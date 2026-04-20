import { cache } from 'react';

import { supabase } from '@/lib/supabase';
import { slugifyTriviaSegment } from '@/lib/trivia-slugs';

export type TriviaCategoryType = 'daily-trivias' | 'trivias';

export interface TriviaCategoryRecord {
  slug: string;
  categoryType: TriviaCategoryType;
  title: string;
  description: string;
  longDescription: string;
  learningPoints: string[];
  faqItems: TriviaCategoryFaqItem[];
  related: string[];
  keywords: string[];
  ogImage?: string;
  displayName?: string;
  icon?: string;
  color?: string;
  showPrintableQuizCTA: boolean;
  sortOrder: number;
  isActive: boolean;
  updatedAt?: string;
}

export interface TriviaCategoryFaqItem {
  icon: string;
  title: string;
  answer: string;
}

export interface TriviaSubcategoryRecord {
  categorySlug: string;
  subcategory: string;
  slug: string;
  questionCount: number;
  sortOrder: number;
  isActive: boolean;
}

type TriviaCategoryRow = {
  slug: string;
  category_type: TriviaCategoryType;
  title: string;
  description: string;
  long_description: string | null;
  learning_points: string[] | null;
  faq_items: TriviaCategoryFaqItem[] | null;
  related: string[] | null;
  keywords: string[] | null;
  og_image: string | null;
  display_name: string | null;
  icon: string | null;
  color: string | null;
  show_printable_quiz_cta: boolean | null;
  sort_order: number | null;
  is_active: boolean | null;
  updated_at: string | null;
};

function normalizeTriviaCategoryRow(row: TriviaCategoryRow): TriviaCategoryRecord {
  return {
    slug: row.slug,
    categoryType: row.category_type,
    title: row.title,
    description: row.description,
    longDescription: row.long_description ?? '',
    learningPoints: row.learning_points ?? [],
    faqItems: row.faq_items ?? [],
    related: row.related ?? [],
    keywords: row.keywords ?? [],
    ogImage: row.og_image ?? undefined,
    displayName: row.display_name ?? undefined,
    icon: row.icon ?? undefined,
    color: row.color ?? undefined,
    showPrintableQuizCTA: row.show_printable_quiz_cta ?? true,
    sortOrder: row.sort_order ?? 0,
    isActive: row.is_active ?? true,
    updatedAt: row.updated_at ?? undefined,
  };
}

function isMissingTriviaSchemaField(error: { code?: string }) {
  return error.code === 'PGRST205' || error.code === '42703';
}

export const getTriviaCategories = cache(async (
  categoryType?: TriviaCategoryType
): Promise<TriviaCategoryRecord[]> => {
  let query = supabase
    .from('trivia_categories')
    .select([
      'slug',
      'category_type',
      'title',
      'description',
      'long_description',
      'learning_points',
      'faq_items',
      'related',
      'keywords',
      'og_image',
      'display_name',
      'icon',
      'color',
      'show_printable_quiz_cta',
      'sort_order',
      'is_active',
      'updated_at',
    ].join(','))
    .eq('is_active', true);

  if (categoryType) {
    query = query.eq('category_type', categoryType);
  }

  const { data, error } = await query.order('sort_order', { ascending: true }).order('title', { ascending: true });

  if (error) {
    if (!isMissingTriviaSchemaField(error as { code?: string })) {
      console.error('Error loading trivia categories:', error);
    }
    return [];
  }

  return (data ?? []).map((row) => normalizeTriviaCategoryRow(row as unknown as TriviaCategoryRow));
});

export const getTriviaCategoryMap = cache(async (
  categoryType?: TriviaCategoryType
): Promise<Record<string, TriviaCategoryRecord>> => {
  const categories = await getTriviaCategories(categoryType);
  return categories.reduce<Record<string, TriviaCategoryRecord>>((acc, category) => {
    acc[category.slug] = category;
    return acc;
  }, {});
});

export const getTriviaCategoryBySlug = cache(async (
  slug: string,
  categoryType: TriviaCategoryType = 'trivias'
): Promise<TriviaCategoryRecord | null> => {
  const { data, error } = await supabase
    .from('trivia_categories')
    .select([
      'slug',
      'category_type',
      'title',
      'description',
      'long_description',
      'learning_points',
      'faq_items',
      'related',
      'keywords',
      'og_image',
      'display_name',
      'icon',
      'color',
      'show_printable_quiz_cta',
      'sort_order',
      'is_active',
      'updated_at',
    ].join(','))
    .eq('slug', slug)
    .eq('category_type', categoryType)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    if (!isMissingTriviaSchemaField(error as { code?: string })) {
      console.error(`Error loading trivia category "${slug}":`, error);
    }
    return null;
  }

  return data ? normalizeTriviaCategoryRow(data as unknown as TriviaCategoryRow) : null;
});

export const getTriviaCategorySlugs = cache(async (
  categoryType?: TriviaCategoryType
): Promise<string[]> => {
  const categories = await getTriviaCategories(categoryType);
  return categories.map((category) => category.slug);
});

export async function getTriviaExplorerCards(categoryType: TriviaCategoryType = 'trivias') {
  const categories = await getTriviaCategories(categoryType);
  return categories.map((category) => ({
    key: category.slug,
    category: {
      title: category.title,
      description: category.description,
      longDescription: category.longDescription,
      learningPoints: category.learningPoints,
      keywords: category.keywords,
      ogImage: category.ogImage,
      related: category.related,
      displayName: category.displayName,
    },
  }));
}

export function toTriviaCategoryDisplay(category: TriviaCategoryRecord) {
  return {
    title: category.title,
    description: category.description,
    longDescription: category.longDescription,
    learningPoints: category.learningPoints,
    keywords: category.keywords,
    ogImage: category.ogImage,
    related: category.related,
    displayName: category.displayName,
    showPrintableQuizCTA: category.showPrintableQuizCTA,
  };
}

export function slugFromSubcategoryName(subcategory: string) {
  return slugifyTriviaSegment(subcategory);
}
