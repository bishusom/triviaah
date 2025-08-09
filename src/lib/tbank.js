import path from 'path';
import matter from 'gray-matter';

const triviaDir = path.join(process.cwd(), 'content/trivia-bank');

// Server-side only functions
async function getServerSideFs() {
  const { promises: fs, default: fsSync } = await import('fs');
  return { fs, fsSync }; // Return both promise and sync versions
}

export async function getAllTriviaSlugs() {
  if (typeof window !== 'undefined') return []; // Client-side guard
  const { fsSync } = await getServerSideFs();
  return fsSync.readdirSync(triviaDir).map(file => file.replace(/\.md$/, ''));
}

export async function getTriviaData(slug) {
  if (typeof window !== 'undefined') return null;
  const { fs } = await getServerSideFs();
  const filePath = path.join(triviaDir, `${slug}.md`);
  const fileContents = await fs.readFile(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const levels = {};
  let currentLevel = '';
  
  // Split by lines
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Handle section headers
    if (line.startsWith('## ')) {
      currentLevel = line.replace('## ', '').replace(' Level', '').trim().toLowerCase();
      levels[currentLevel] = [];
      continue;
    }
    
    // Handle questions
    if (/^\d+\./.test(line)) {
      // Extract question text (remove number and trim)
      const question = line.replace(/^\d+\.\s*\*\*/, '').replace(/\*\*\s*$/, '').trim();
      
      // Get the next line for answer
      const answerLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
      let answer = '';
      
      // Extract answer if properly formatted
      if (answerLine.startsWith('**Answer:**')) {
        answer = answerLine.replace('**Answer:**', '').trim();
        i++; // Skip the answer line
      }
      
      levels[currentLevel].push({
        question,
        answer
      });
    }
  }
  
  return {
    slug,
    ...data,
    levels
  };
}

export async function getAllTriviaPreviews() {
  if (typeof window !== 'undefined') return []; // Client-side guard
  const slugs = await getAllTriviaSlugs();
  const { fs } = await getServerSideFs();
  
  return Promise.all(slugs.map(async slug => {
    const fileContents = await fs.readFile(path.join(triviaDir, `${slug}.md`), 'utf8');
    const { data } = matter(fileContents);
    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      tags: data.tags || []
    };
  }));
}