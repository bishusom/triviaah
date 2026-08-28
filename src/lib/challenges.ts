import { cache } from 'react';

import {
  supabase,
  getBalancedTriviaQuestions,
  getEnrichedSubcategoriesWithMinQuestions,
  type Question,
  type Subcategory,
} from '@/lib/supabase';
import { getTriviaCategoryBySlug, getTriviaCategories, type TriviaCategoryRecord } from '@/lib/trivia-categories';
import { slugifyTriviaSegment } from '@/lib/trivia-slugs';

export type ChallengeStatus = 'active' | 'upcoming' | 'past';

export interface WeeklyTriviaChallenge {
  id: number;
  slug: string;
  startDate: string;
  endDate: string;
  category: string;
  subcategory: string;
  createdAt: string;
  title: string;
  categoryTitle: string;
  description: string;
  heroImage: string;
  color?: string;
  icon?: string;
  status: ChallengeStatus;
  formattedDateRange: string;
  isFeatured: boolean;
  estimatedMinutes: number;
  questionCount: number;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
}

export type ChallengeCadence = 'weekly' | 'seasonal' | 'evergreen';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

export interface ChallengeItem {
  title: string;
  description: string;
  href: string;
  quizType: 'daily-trivias' | 'brainwave' | 'trivias' | 'trivia-bank' | 'blog' | 'weekly-challenge';
  category?: string;
  sortOrder: number;
}

export interface ChallengeCollection {
  id?: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  theme: string;
  cadence: ChallengeCadence;
  difficulty: ChallengeDifficulty;
  estimatedMinutes: number;
  sourceCategories: string[];
  autoItemLimit: number;
  startsAt?: string;
  endsAt?: string;
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
  sortOrder: number;
  updatedAt?: string;
  items: ChallengeItem[];
  // Weekly challenge specific attributes
  weeklyChallenge?: WeeklyTriviaChallenge;
}

type WeeklyTriviaChallengeRow = {
  id: number;
  start_date: string;
  end_date: string;
  category: string;
  subcategory: string;
  created_at: string;
};

const CATEGORY_IMAGE_ALIASES: Record<string, string> = {
  transportation: 'transports',
  'picture-clues': 'picture-clues',
  'religion-spirituality': 'religion',
  languages: 'language',
  'inventions-everyday-objects': 'inventions',
  'tv-shows': 'tv',
  'arts-literature': 'arts',
};

export function resolveCategoryHeroImage(categorySlug: string, categoryRecord?: TriviaCategoryRecord | null): string {
  if (categoryRecord?.ogImage) {
    return categoryRecord.ogImage;
  }
  const alias = CATEGORY_IMAGE_ALIASES[categorySlug] || categorySlug;
  return `/imgs/categories/${alias}.webp`;
}

function formatDateRange(startDateStr: string, endDateStr: string): string {
  try {
    const start = new Date(`${startDateStr}T00:00:00Z`);
    const end = new Date(`${endDateStr}T00:00:00Z`);

    const startMonth = start.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
    const startDay = start.getUTCDate();
    const endMonth = end.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
    const endDay = end.getUTCDate();
    const year = end.getUTCFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} – ${endDay}, ${year}`;
    }
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
  } catch {
    return `${startDateStr} to ${endDateStr}`;
  }
}

function computeChallengeStatus(startDateStr: string, endDateStr: string): ChallengeStatus {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  if (todayStr < startDateStr) {
    return 'upcoming';
  }
  if (todayStr > endDateStr) {
    return 'past';
  }
  return 'active';
}

function createChallengeSlug(id: number, category: string, subcategory: string): string {
  const subSlug = slugifyTriviaSegment(subcategory);
  const catSlug = slugifyTriviaSegment(category);
  return `${catSlug}-${subSlug}`;
}

function formatCategoryLabel(category: string): string {
  return category
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function normalizeWeeklyChallenge(
  row: WeeklyTriviaChallengeRow,
  categoryMap: Record<string, TriviaCategoryRecord>,
  subcategoryMap: Record<string, Subcategory>,
  index: number
): WeeklyTriviaChallenge {
  const catRecord = categoryMap[row.category];
  const subcategorySlug = slugifyTriviaSegment(row.subcategory);
  const subcategoryRecord = subcategoryMap[`${row.category}:${subcategorySlug}`];
  const categoryTitle = catRecord?.title || catRecord?.displayName || formatCategoryLabel(row.category);
  const heroImage = resolveCategoryHeroImage(row.category, catRecord);
  const status = computeChallengeStatus(row.start_date, row.end_date);
  const formattedDateRange = formatDateRange(row.start_date, row.end_date);
  const slug = createChallengeSlug(row.id, row.category, row.subcategory);

  const title = `${row.subcategory} Weekly Challenge`;
  const description =
    subcategoryRecord?.description ||
    `Test your knowledge with 10 questions on ${row.subcategory} in the ${categoryTitle} category with a 30-second question timer.`;
  const seoDescription =
    subcategoryRecord?.meta_description ||
    `Play the ${row.subcategory} weekly trivia challenge on Triviaah. 10 curated ${categoryTitle} questions with a 30-second timer and instant feedback.`;

  return {
    id: row.id,
    slug,
    startDate: row.start_date,
    endDate: row.end_date,
    category: row.category,
    subcategory: row.subcategory,
    createdAt: row.created_at,
    title,
    categoryTitle,
    description,
    heroImage,
    color: catRecord?.color || 'from-cyan-500 to-blue-600',
    icon: catRecord?.icon || '🏆',
    status,
    formattedDateRange,
    isFeatured: status === 'active' && index === 0,
    estimatedMinutes: 5,
    questionCount: 10,
    seoTitle: `${row.subcategory} Trivia Challenge | ${categoryTitle} Weekly Quiz | Triviaah`,
    seoDescription,
    keywords: subcategoryRecord?.keywords ?? [],
  };
}

export function weeklyChallengeToCollection(challenge: WeeklyTriviaChallenge): ChallengeCollection {
  return {
    id: challenge.id,
    slug: challenge.slug,
    title: challenge.title,
    subtitle: `${challenge.categoryTitle} • ${challenge.formattedDateRange}`,
    description: challenge.description,
    heroImage: challenge.heroImage,
    theme: challenge.categoryTitle,
    cadence: 'weekly',
    difficulty: 'medium',
    estimatedMinutes: challenge.estimatedMinutes,
    sourceCategories: [challenge.category],
    autoItemLimit: 1,
    startsAt: challenge.startDate,
    endsAt: challenge.endDate,
    isFeatured: challenge.isFeatured,
    seoTitle: challenge.seoTitle,
    seoDescription: challenge.seoDescription,
    sortOrder: challenge.status === 'active' ? 1 : challenge.status === 'upcoming' ? 2 : 3,
    updatedAt: challenge.createdAt,
    weeklyChallenge: challenge,
    items: [
      {
        title: `Play ${challenge.subcategory} Challenge`,
        description: challenge.description,
        href: `/challenges/${challenge.slug}/quiz`,
        quizType: 'weekly-challenge',
        category: challenge.category,
        sortOrder: 1,
      },
    ],
  };
}

export const getWeeklyChallenges = cache(async (): Promise<WeeklyTriviaChallenge[]> => {
  const [challengesResponse, categories] = await Promise.all([
    supabase
      .from('weekly_trivia_challenges')
      .select('id, start_date, end_date, category, subcategory, created_at')
      .order('start_date', { ascending: false })
      .order('id', { ascending: true }),
    getTriviaCategories('trivias'),
  ]);

  if (challengesResponse.error) {
    console.error('Error fetching weekly_trivia_challenges:', challengesResponse.error);
    return [];
  }

  const categoryMap = categories.reduce<Record<string, TriviaCategoryRecord>>((acc, cat) => {
    acc[cat.slug] = cat;
    return acc;
  }, {});

  const rows = (challengesResponse.data ?? []) as WeeklyTriviaChallengeRow[];
  const sourceCategories = [...new Set(rows.map((row) => row.category))];
  const subcategoryResults = await Promise.all(
    sourceCategories.map(async (category) => getEnrichedSubcategoriesWithMinQuestions(category, 0))
  );
  const subcategoryMap = subcategoryResults.flat().reduce<Record<string, Subcategory>>((acc, item) => {
    const category = item.category || item.category_slug;
    if (!category) return acc;
    acc[`${category}:${slugifyTriviaSegment(item.subcategory)}`] = item;
    return acc;
  }, {});
  
  // Sort into active first, then upcoming, then past
  const normalized = rows.map((row, index) => normalizeWeeklyChallenge(row, categoryMap, subcategoryMap, index));
  
  const statusOrder: Record<ChallengeStatus, number> = {
    active: 0,
    upcoming: 1,
    past: 2,
  };

  return normalized.sort((a, b) => {
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    if (a.status === 'active' || a.status === 'upcoming') {
      return a.startDate.localeCompare(b.startDate);
    }
    return b.startDate.localeCompare(a.startDate);
  });
});

export const getActiveWeeklyChallenges = cache(async (): Promise<WeeklyTriviaChallenge[]> => {
  const all = await getWeeklyChallenges();
  return all.filter((c) => c.status === 'active');
});

export const getUpcomingWeeklyChallenges = cache(async (): Promise<WeeklyTriviaChallenge[]> => {
  const all = await getWeeklyChallenges();
  return all.filter((c) => c.status === 'upcoming');
});

export const getPastWeeklyChallenges = cache(async (): Promise<WeeklyTriviaChallenge[]> => {
  const all = await getWeeklyChallenges();
  return all.filter((c) => c.status === 'past');
});

export const getWeeklyChallengeByIdOrSlug = cache(async (idOrSlug: string | number): Promise<WeeklyTriviaChallenge | null> => {
  const challenges = await getWeeklyChallenges();
  const stringIdentifier = String(idOrSlug).toLowerCase().trim();

  // Try matching by exact slug or exact ID
  const directMatch = challenges.find((c) => 
    String(c.id) === stringIdentifier || 
    c.slug.toLowerCase() === stringIdentifier ||
    `${c.id}-${c.slug}`.toLowerCase() === stringIdentifier
  );

  if (directMatch) return directMatch;

  // Try matching by partial subcategory slug or category
  return challenges.find((c) => {
    const subSlug = slugifyTriviaSegment(c.subcategory);
    return stringIdentifier.includes(subSlug) || stringIdentifier === subSlug;
  }) ?? null;
});

export const getFeaturedWeeklyChallenge = cache(async (): Promise<WeeklyTriviaChallenge | null> => {
  const challenges = await getWeeklyChallenges();
  return challenges.find((c) => c.isFeatured) ?? challenges.find((c) => c.status === 'active') ?? challenges[0] ?? null;
});

export const getChallengeCollections = cache(async (): Promise<ChallengeCollection[]> => {
  const weeklyChallenges = await getWeeklyChallenges();
  return weeklyChallenges.map(weeklyChallengeToCollection);
});

export const getFeaturedChallenge = cache(async (): Promise<ChallengeCollection | null> => {
  const featured = await getFeaturedWeeklyChallenge();
  return featured ? weeklyChallengeToCollection(featured) : null;
});

export const getChallengeBySlug = cache(async (slug: string): Promise<ChallengeCollection | null> => {
  const challenge = await getWeeklyChallengeByIdOrSlug(slug);
  return challenge ? weeklyChallengeToCollection(challenge) : null;
});

export async function getWeeklyChallengeQuestions(
  challenge: WeeklyTriviaChallenge,
  count: number = 10
): Promise<Question[]> {
  try {
    const questions = await getBalancedTriviaQuestions(count, {
      category: challenge.category,
      subcategory: challenge.subcategory,
    });

    if (questions && questions.length > 0) {
      return questions;
    }

    // Fallback: fetch questions by category if subcategory had fewer than required
    return getBalancedTriviaQuestions(count, {
      category: challenge.category,
    });
  } catch (error) {
    console.error('Error fetching questions for weekly challenge:', error);
    return [];
  }
}
