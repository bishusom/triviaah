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
  header: string;
  excerpt: string;
  tags: string[];
  levels: {
    [key: string]: Question[];
  };
}

interface TriviaPreview {
  slug: string;
  title: string;
  header: string;
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
    console.log(`Error reading file for slug ${slug}:`, error);
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
  const header = data.header || data.title; // Use header if provided, fallback to title

  const levels: { [key: string]: Question[] } = {};
  let currentLevel: string = '';
  
  // Split by lines and process content
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Handle section headers (## Easy Level, ## Medium Level, ## Hard Level)
    if (line.startsWith('## ')) {
      const levelMatch = line.match(/^##\s+(.+?)\s*Level/i);
      if (levelMatch) {
        currentLevel = levelMatch[1].toLowerCase().trim();
        levels[currentLevel] = [];
      }
      continue;
    }
    
    // Handle questions (numbered list items)
    if (/^\d+\.\s+\*\*/.test(line)) {
      // Extract question number and text
      const questionMatch = line.match(/^\d+\.\s+\*\*(.+?)\*\*\s*$/);
      if (questionMatch && currentLevel) {
        const questionText = questionMatch[1].trim();
        
        // Look for answer in the next line
        let answerText = '';
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          const answerMatch = nextLine.match(/^\*\*Answer:\*\*\s*(.+)$/);
          if (answerMatch) {
            answerText = answerMatch[1].trim();
            i++; // Skip the answer line
          }
        }
        
        levels[currentLevel].push({
          question: questionText,
          answer: answerText
        });
      }
    }
  }
  
  return {
    slug,
    title: data.title,
    header: header,
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
    try {
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
      const header = data.header || data.title; // Use header if provided, fallback to title

      return {
        slug,
        title: data.title,
        header: header,
        excerpt: data.excerpt,
        tags
      };
    } catch (error) {
      console.error(`Error reading file for slug ${slug}:`, error);
      return null;
    }
  })).then(results => results.filter((result): result is TriviaPreview => result !== null));
}