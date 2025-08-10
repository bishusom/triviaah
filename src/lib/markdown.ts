import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { formatPostDate } from './date-utils';

// Define types for post data
interface PostFrontMatter {
  title: string;
  date: string;
  excerpt?: string;
  image?: string;
}

interface PostData {
  slug: string;
  title: string;
  date: string;
  isoDate: string;
  excerpt: string;
  image: string;
}

interface PostContent extends PostData {
  contentHtml: string;
}

const postsDir: string = path.join(process.cwd(), 'content/blog');

// Date formatting utility
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getAllPostSlugs(): string[] {
  try {
    const fileNames: string[] = fs.readdirSync(postsDir);
    return fileNames
      .filter(name => name.endsWith('.md') || name.endsWith('.mdx'))
      .map(name => name.replace(/\.(md|mdx)$/, ''));
  } catch (error) {
    console.warn('Posts directory not found, returning empty array');
    return [];
  }
}

// Get all posts sorted by date (newest first)
export function getAllPosts(): PostData[] {
  const fileNames: string[] = fs.readdirSync(postsDir);
  const allPosts: PostData[] = fileNames.map(fileName => {
    const slug: string = fileName.replace(/\.md$/, '');
    const filePath: string = path.join(postsDir, fileName);
    const { data } = matter(fs.readFileSync(filePath, 'utf8'));
    const frontMatter = data as PostFrontMatter;
    
    return {
      slug,
      title: frontMatter.title,
      date: formatDate(frontMatter.date), // Format the date here
      isoDate: new Date(frontMatter.date).toISOString(), // For proper sorting
      excerpt: frontMatter.excerpt || '',
      image: frontMatter.image || '/imgs/default-blog.webp' // Fallback image
    };
  });
  
  return allPosts.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
}

// Alias for getSortedPosts (backward compatibility)
export function getSortedPosts(): PostData[] {
  return getAllPosts();
}

export async function getPostData(slug: string): Promise<PostContent> {
  const filePath: string = path.join(postsDir, `${slug}.md`);
  const fileContents: string = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  
  const dateInfo = formatPostDate(data.date);
  
  return {
    slug,
    contentHtml: processedContent.toString(),
    date: dateInfo.display, // Formatted string
    isoDate: dateInfo.iso, // ISO format for sorting
    title: data.title,
    excerpt: data.excerpt || '',
    image: data.image || '/imgs/default-blog.jpg'
  };
}