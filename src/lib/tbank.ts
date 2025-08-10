import path from 'path';
import matter from 'gray-matter';

const triviaDir: string = path.join(process.cwd(), 'content/trivia-bank');

// Define types for trivia data
interface Question {
  question: string;
  answer: string;
}

interface TriviaData {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  levels: {
    [key: string]: Question[];
  };
}

interface TriviaPreview {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
}

// Server-side only functions
async function getServerSideFs(): Promise<{
  fs: typeof import('fs').promises;
  fsSync: typeof import('fs');
}> {
  const { promises: fs, default: fsSync } = await import('fs');
  return { fs, fsSync }; // Return both promise and sync versions
}

export async function getAllTriviaSlugs(): Promise<string[]> {
  if (typeof window !== 'undefined') return []; // Client-side guard
  const { fsSync } = await getServerSideFs();
  return fsSync.readdirSync(triviaDir).map(file => file.replace(/\.md$/, ''));
}

export async function getTriviaData(slug: string): Promise<TriviaData | null> {
  if (typeof window !== 'undefined') return null;
  const { fs } = await getServerSideFs();
  const filePath = path.join(triviaDir, `${slug}.md`);
  
  let fileContents: string;
  try {
    fileContents = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    return null;
  }
  
  const { data, content } = matter(fileContents);
  
  // Validate frontmatter data
  if (!data.title || typeof data.title !== 'string') {
    console.error(`Missing or invalid title in frontmatter for slug: ${slug}`);
    return null;
  }
  if (!data.excerpt || typeof data.excerpt !== 'string') {
    console.error(`Missing or invalid excerpt in frontmatter for slug: ${slug}`);
    return null;
  }
  const tags = Array.isArray(data.tags) ? data.tags : [];

  const levels: { [key: string]: Question[] } = {};
  let currentLevel: string = '';
  
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
    title: data.title,
    excerpt: data.excerpt,
    tags,
    levels
  };
}

export async function getAllTriviaPreviews(): Promise<TriviaPreview[]> {
  if (typeof window !== 'undefined') return []; // Client-side guard
  const slugs = await getAllTriviaSlugs();
  const { fs } = await getServerSideFs();
  
  return Promise.all(slugs.map(async (slug: string) => {
    const fileContents = await fs.readFile(path.join(triviaDir, `${slug}.md`), 'utf8');
    const { data } = matter(fileContents);
    
    // Validate frontmatter data
    if (!data.title || typeof data.title !== 'string') {
      console.error(`Missing or invalid title in frontmatter for slug: ${slug}`);
      return null;
    }
    if (!data.excerpt || typeof data.excerpt !== 'string') {
      console.error(`Missing or invalid excerpt in frontmatter for slug: ${slug}`);
      return null;
    }
    const tags = Array.isArray(data.tags) ? data.tags : [];

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      tags
    };
  })).then(results => results.filter((result): result is TriviaPreview => result !== null));
}