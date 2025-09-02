import client from './contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Document } from '@contentful/rich-text-types';

export interface PostData {
  slug: string;
  title: string;
  date: string;
  isoDate: string;
  excerpt: string;
  image: string;
  contentHtml: string;
}

interface ContentfulFields {
  slug?: unknown;
  title?: unknown;
  date?: unknown;
  isoDate?: unknown;
  excerpt?: unknown;
  image?: {
    fields?: {
      file?: {
        url?: string;
      };
    };
  };
  content?: Document;
}

interface ContentfulItem {
  fields: ContentfulFields;
}

// Helper function to convert protocol-relative URLs to absolute URLs
function normalizeImageUrl(imageUrl: string | undefined): string {
  if (!imageUrl) return '/default-image.jpg';
  
  if (imageUrl.startsWith('//')) {
    // Convert protocol-relative URL to HTTPS
    return `https:${imageUrl}`;
  }
  
  if (imageUrl.startsWith('/')) {
    // Handle relative URLs (adjust if you have a different base URL)
    return imageUrl; // Keep as is if it's a relative path
  }
  
  return imageUrl;
}

export async function getAllPosts(): Promise<PostData[]> {
  const entries = await client.getEntries({
    content_type: 'blogPost',
    order: ['-fields.date'],
  });

  return entries.items.map((item: ContentfulItem) => ({
    slug: String(item.fields.slug || ''),
    title: String(item.fields.title || ''),
    date: String(item.fields.date || ''),
    isoDate: String(item.fields.isoDate || ''),
    excerpt: String(item.fields.excerpt || ''),
    image: normalizeImageUrl(item.fields.image?.fields?.file?.url),
    contentHtml: convertRichTextToHtml(item.fields.content),
  }));
}

export async function getPostData(slug: string): Promise<PostData> {
  const entries = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
  });

  if (entries.items.length === 0) {
    throw new Error(`Post not found: ${slug}`);
  }

  const item = entries.items[0] as ContentfulItem;
  return {
    slug: String(item.fields.slug || ''),
    title: String(item.fields.title || ''),
    date: String(item.fields.date || ''),
    isoDate: String(item.fields.isoDate || ''),
    excerpt: String(item.fields.excerpt || ''),
    image: normalizeImageUrl(item.fields.image?.fields?.file?.url),
    contentHtml: convertRichTextToHtml(item.fields.content),
  };
}

function convertRichTextToHtml(richText?: Document): string {
  if (!richText) return '';
  try {
    return documentToHtmlString(richText);
  } catch (error) {
    console.error('Error converting rich text to HTML:', error);
    return '';
  }
}