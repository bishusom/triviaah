import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { formatPostDate } from './date-utils';

const postsDir = path.join(process.cwd(), 'content/blog');

// Date formatting utility
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getAllPostSlugs() {
  try {
    const fileNames = fs.readdirSync(postsDir);
    return fileNames
      .filter(name => name.endsWith('.md') || name.endsWith('.mdx'))
      .map(name => name.replace(/\.(md|mdx)$/, ''));
  } catch (error) {
    console.warn('Posts directory not found, returning empty array');
    return [];
  }
}

// Get all posts sorted by date (newest first)
export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDir);
  const allPosts = fileNames.map(fileName => {
    const slug = fileName.replace(/\.md$/, '');
    const filePath = path.join(postsDir, fileName);
    const { data } = matter(fs.readFileSync(filePath, 'utf8'));
    
    return {
      slug,
      title: data.title,
      date: formatDate(data.date), // Format the date here
      isoDate: new Date(data.date).toISOString(), // For proper sorting
      excerpt: data.excerpt || '',
      image: data.image || '/imgs/default-blog.jpg' // Fallback image
    };
  });
  
  return allPosts.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));
}

// Alias for getSortedPosts (backward compatibility)
export function getSortedPosts() {
  return getAllPosts();
}

export async function getPostData(slug) {
  const filePath = path.join(postsDir, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
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