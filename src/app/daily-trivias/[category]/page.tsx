import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { DailyTriviaPageContent } from '@/components/daily-trivias/DailyTriviaPageContent';
import { getTriviaCategories, getTriviaCategoryBySlug } from '@/lib/trivia-categories';

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

  const title = `${cfg.displayName || cfg.title} Daily Quiz | Free Trivia Questions | Triviaah`;
  const canonicalUrl = `https://triviaah.com/daily-trivias/${category}`;

  return {
    title,
    description: cfg.description,
    keywords: [
      ...cfg.keywords,
      'multiplayer trivia',
      'multiplayer quiz',
      'private trivia room',
      `${cfg.displayName || cfg.title} multiplayer trivia`,
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: `${cfg.displayName || cfg.title} Daily Quiz — Play Free Today | Triviaah`,
      description: cfg.description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Triviaah',
      images: [{
        url: `/imgs/daily-trivias/${category}.webp`,
        width: 1200,
        height: 630,
        alt: `${cfg.displayName || cfg.title} Daily Trivia Quiz`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cfg.displayName || cfg.title} Daily Quiz — Play Free Today | Triviaah`,
      description: cfg.description,
      images: [`/imgs/daily-trivias/${category}.webp`],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function DailyQuizPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const category = resolvedParams.category;
  const startQuizHref = resolvedSearch.date
    ? `/daily-trivias/${category}/quiz?date=${encodeURIComponent(resolvedSearch.date)}`
    : `/daily-trivias/${category}/quiz`;

  const [categoryData, siblingCategories] = await Promise.all([
    getTriviaCategoryBySlug(category, 'daily-trivias'),
    getTriviaCategories('daily-trivias'),
  ]);

  if (!categoryData) {
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
      startQuizHref={startQuizHref}
      showIntro
      showFAQ
      showQuiz={false}
    />
  );
}
