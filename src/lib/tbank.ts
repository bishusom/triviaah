import client from './contentful';

export interface TriviaData {
  slug: string;
  title: string;
  header: string;
  excerpt: string;
  tags: string[];
  levels: {
    [key: string]: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export interface Category {
  slug: string;
  title: string;
  header: string;
  excerpt: string;
  tags: string[];
}

// Contentful entry type definitions
interface ContentfulFields {
  slug?: string;
  title?: string;
  header?: string;
  excerpt?: string;
  tags?: string[];
  levels?: {
    [key: string]: Array<{
      question: string;
      answer: string;
    }>;
  };
}

interface ContentfulEntry {
  fields: ContentfulFields;
}

interface ContentfulResponse {
  items: ContentfulEntry[];
}

// Get all trivia previews (for listing page)
export async function getAllTriviaPreviews(): Promise<Category[]> {
  const entries = await client.getEntries({
    content_type: 'triviaBank',
    select: ['fields.slug', 'fields.title', 'fields.header', 'fields.excerpt', 'fields.tags'],
  }) as ContentfulResponse;

  return entries.items.map((item: ContentfulEntry) => {
    const fields = item.fields;
    return {
      slug: String(fields.slug || ''),
      title: String(fields.title || ''),
      header: String(fields.header || ''),
      excerpt: String(fields.excerpt || ''),
      tags: Array.isArray(fields.tags) ? fields.tags.map(String) : [],
    };
  });
}

// Get full trivia data by slug
export async function getTriviaData(slug: string): Promise<TriviaData | null> {
  try {
    const entries = await client.getEntries({
      content_type: 'triviaBank',
      'fields.slug': slug,
      limit: 1,
    }) as ContentfulResponse;

    if (entries.items.length === 0) {
      return null;
    }

    const fields = entries.items[0].fields;
    return {
      slug: String(fields.slug || ''),
      title: String(fields.title || ''),
      header: String(fields.header || ''),
      excerpt: String(fields.excerpt || ''),
      tags: Array.isArray(fields.tags) ? fields.tags.map(String) : [],
      levels: fields.levels || {},
    };
  } catch (error) {
    console.error('Error fetching trivia data:', error);
    return null;
  }
}