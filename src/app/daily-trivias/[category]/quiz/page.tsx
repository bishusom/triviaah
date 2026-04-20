import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { DailyTriviaPageContent } from '@/components/daily-trivias/DailyTriviaPageContent';
import { getDailyTriviaQuestions } from '@/lib/daily-trivias';
import { getTriviaCategoryBySlug, getTriviaCategories } from '@/lib/trivia-categories';

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ date?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const cfg = await getTriviaCategoryBySlug(category, 'daily-trivias');
  if (!cfg) {
    notFound();
  }
  const canonicalUrl = `https://triviaah.com/daily-trivias/${category}`;

  return {
    title: `${cfg.displayName || cfg.title} Quiz | Triviaah`,
    description: cfg.description,
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function DailyTriviaQuizPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const category = resolvedParams.category;

  const dateKey = resolvedSearch.date ?? new Date().toISOString().slice(0, 10);
  const displayDate = new Date(`${dateKey}T00:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

  const [categoryData, questions, siblingCategories] = await Promise.all([
    getTriviaCategoryBySlug(category, 'daily-trivias'),
    getDailyTriviaQuestions(category, dateKey),
    getTriviaCategories('daily-trivias'),
  ]);

  if (!categoryData || !questions || questions.length === 0) {
    notFound();
  }

  const siblingLinks = siblingCategories
    .filter((item) => item.slug !== category)
    .map((item) => ({
      slug: item.slug,
      name: item.displayName || item.title,
      icon: item.icon || '❓',
    }));

  return (
    <DailyTriviaPageContent
      category={category}
      categoryData={categoryData}
      siblingCategories={siblingLinks}
      dateKey={dateKey}
      displayDate={displayDate}
      questions={questions}
      showIntro={false}
      showFAQ={false}
      showQuiz
    />
  );
}
