// src/app/word-games/word-search/metadata.ts
import { Metadata } from 'next';

export function generateWordSearchMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/word-games/word-search';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Free Word Search Puzzles Online | Printable Word Find Games | Triviaah',
    description: 'Play free word search puzzles online. Find hidden words in our themed word find games. Perfect for vocabulary practice, relaxation, and educational fun for all ages.',
    keywords: [
      'word search',
      'word find puzzles',
      'free word search',
      'online word games',
      'vocabulary games',
      'word puzzles',
      'printable word search',
      'brain games',
      'educational games',
      'word hunt',
      'letter grid',
      'hidden words',
      'puzzle games',
      'cognitive games',
      'vocabulary builder',
      'pattern recognition',
      'educational entertainment',
      'relaxing games',
      'mental exercise',
      'word recognition'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Free Word Search Puzzles Online | Printable Word Find Games | Triviaah',
      description: 'Play free word search puzzles online. Find hidden words in our themed word find games. Perfect for vocabulary practice, relaxation, and educational fun for all ages.',
      url: 'https://triviaah.com/word-games/word-search',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/word-games/word-search.webp',
          width: 1200,
          height: 630,
          alt: 'Free Word Search Puzzles Online | Printable Word Find Games | Triviaah'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Free Word Search Puzzles Online | Printable Word Find Games | Triviaah',
      description: 'Play free word search puzzles online. Find hidden words in our themed word find games. Perfect for vocabulary practice, relaxation, and educational fun for all ages.',
      images: ['/imgs/word-games/word-search.webp'],
      site: '@elitetrivias',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    other: {
      'updated_time': lastUpdated
    }
  };
}   