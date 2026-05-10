import type { Metadata } from 'next';

import { MultiplayerHomeClient } from '@/components/multiplayer/MultiplayerHomeClient';
import { getTriviaCategories } from '@/lib/trivia-categories';

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
  const categories = await getTriviaCategories('trivias');
  const options = categories.map((category) => ({
    slug: category.slug,
    name: category.displayName || category.title,
  }));

  return (
    <MultiplayerHomeClient
      categories={options}
      initialCategory={resolvedSearchParams.category}
      initialSubcategory={resolvedSearchParams.subcategory}
      quizType={resolvedSearchParams.quizType === 'daily-trivias' ? 'daily-trivias' : 'trivias'}
    />
  );
}
