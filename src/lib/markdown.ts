import client from './contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Document, BLOCKS, INLINES, Block, Inline } from '@contentful/rich-text-types';

// Define proper TypeScript interfaces for Contentful nodes
interface ContentfulAsset {
  fields: {
    file: {
      url: string;
      details?: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
    title: string;
    description?: string;
  };
}

interface ContentfulEntry {
  fields: Record<string, unknown>;
}

const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline) => {
      // Type guard to ensure we have the right node structure
      if ('data' in node && node.data && typeof node.data === 'object' && 'target' in node.data) {
        const target = node.data.target as ContentfulAsset;
        const { file, title } = target.fields;
        const imageUrl = file.url.startsWith('//') ? `https:${file.url}` : file.url;
        return `
          <div class="embedded-asset">
            <img src="${imageUrl}" alt="${title}" style="max-width: 100%; height: auto;" />
            ${title ? `<p class="asset-caption">${title}</p>` : ''}
          </div>
        `;
      }
      return '<div class="embedded-asset">Asset not available</div>';
    },
    [BLOCKS.EMBEDDED_ENTRY]: (node: Block | Inline) => {
      // Handle embedded entries if needed
      return `<div class="embedded-entry">Embedded content</div>`;
    },
    [INLINES.HYPERLINK]: (node: Block | Inline, next: (nodes: (Block | Inline)[]) => string) => {
      if ('data' in node && node.data && typeof node.data === 'object' && 'uri' in node.data) {
        const uri = node.data.uri as string;
        const content = 'content' in node && Array.isArray(node.content) ? node.content : [];
        return `<a href="${uri}" target="_blank" rel="noopener noreferrer">${next(content as (Block | Inline)[])}</a>`;
      }
      return '<a href="#">Link</a>';
    },
  },
};

export interface PostData {
  slug: string;
  title: string;
  header: string
  date: string;
  isoDate: string;
  excerpt: string;
  image: string;
  contentHtml: string;
}

interface ContentfulFields {
  slug?: unknown;
  title?: unknown;
  header?: unknown;
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
  if (!imageUrl) return '/imgs/default-blog.webp';
  
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
    header: String(item.fields.header || ''),
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
    header: String(item.fields.header || ''),
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
    return documentToHtmlString(richText, options);
  } catch (error) {
    console.error('Error converting rich text to HTML:', error);
    return '';
  }
}