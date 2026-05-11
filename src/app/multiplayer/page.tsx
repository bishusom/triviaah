import type { Metadata } from 'next';

import { MultiplayerHomeClient } from '@/components/multiplayer/MultiplayerHomeClient';
import { getTriviaCategoryBySlug } from '@/lib/trivia-categories';

export const metadata: Metadata = {
  title: 'Multiplayer Trivia Rooms | Triviaah',
  description: 'Create a private trivia room and invite friends to compete live.',
  keywords: [
    'multiplayer trivia',
    'multiplayer quiz',
    'online multiplayer trivia',
    'private trivia room',
    'play trivia with friends',
    'online quiz with friends',
  ],
  robots: { index: false, follow: true },
};

type MultiplayerPageProps = {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    quizType?: string;
  }>;
};

export default async function MultiplayerPage({ searchParams }: MultiplayerPageProps) {
  const resolvedSearchParams = await searchParams;
  const quizType = resolvedSearchParams.quizType === 'daily-trivias' ? 'daily-trivias' : 'trivias';
  const category = resolvedSearchParams.category;
  const categoryData = category
    ? await getTriviaCategoryBySlug(category, quizType)
    : null;

  return (
    <MultiplayerHomeClient
      initialCategory={category}
      initialCategoryName={categoryData?.displayName || categoryData?.title}
      initialSubcategory={resolvedSearchParams.subcategory}
      quizType={quizType}
    />
  );
}
