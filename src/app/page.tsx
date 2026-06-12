import Script from 'next/script';
import type { Metadata } from 'next';
import HomePageContent from '@/components/home/HomePageContent';
import { getTriviaExplorerCards } from '@/lib/trivia-categories';

const title = 'Triviaah: Free Daily Trivia & Quiz Games';
const description =
  'Discover fun, free daily trivia challenges across 20+ exciting categories like movies, history, and science at Triviaah. Test your knowledge with fresh questions every 24 hours.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: 'https://triviaah.com',
  },
  openGraph: {
    title,
    description: 'Play free daily trivia challenges across 20+ categories. New questions every 24 hours!',
    url: 'https://triviaah.com',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/triviaah-og.webp',
        width: 1200,
        height: 630,
        alt: 'Triviaah - Free Daily Trivia & Quiz Games',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: 'Play free daily trivia challenges across 20+ categories. New questions every 24 hours!',
    images: ['/imgs/triviaah-og.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Home() {
  const featuredTriviaCategories = await getTriviaExplorerCards('trivias');

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Triviaah',
        url: 'https://triviaah.com',
        description: 'Free daily trivia, multiplayer quiz rooms, word games, number puzzles, and brain training challenges.',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://triviaah.com/trivias?search={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        name: 'Triviaah',
        url: 'https://triviaah.com',
        logo: 'https://triviaah.com/imgs/triviaah-og.webp',
      },
      {
        '@type': 'WebPage',
        name: 'Triviaah: Free Daily Trivia & Quiz Games',
        url: 'https://triviaah.com',
        description:
          'Discover fun, free daily trivia challenges, multiplayer quiz rooms, and knowledge games across categories like movies, history, and science at Triviaah.',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Triviaah',
          url: 'https://triviaah.com',
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="homepage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePageContent featuredTriviaCategories={featuredTriviaCategories} />
    </>
  );
}
