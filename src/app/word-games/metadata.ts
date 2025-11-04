// src/app/word-games/metadata.ts
import { Metadata } from 'next';

export function generateWordGamesMetadata(): Metadata {
  const canonicalUrl = 'https://elitetrivias.com/word-games';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Free Word Games Collection | Vocabulary & Spelling Games | Elite Trivias',
    description: 'Challenge your vocabulary with our collection of free word games including Boggle, Scramble, Spelling Bee, Word Search, and Word Ladder. Improve spelling, vocabulary, and cognitive skills.',
    keywords: [
      'word games',
      'vocabulary games',
      'spelling games',
      'free word games',
      'online word games',
      'boggle',
      'scramble',
      'spelling bee',
      'word search',
      'word ladder',
      'educational games',
      'vocabulary builder',
      'spelling practice',
      'cognitive games',
      'brain games',
      'language games',
      'word puzzles',
      'educational entertainment',
      'mental exercise',
      'word challenges'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Free Word Games Collection | Vocabulary & Spelling Games | Elite Trivias',
      description: 'Challenge your vocabulary with our collection of free word games including Boggle, Scramble, Spelling Bee, Word Search, and Word Ladder. Improve spelling, vocabulary, and cognitive skills.',
      url: 'https://elitetrivias.com/word-games',
      siteName: 'Elite Trivias',
      images: [
        {
          url: '/imgs/word-games.webp',
          width: 1200,
          height: 630,
          alt: 'Word Games Collection - Vocabulary and Spelling Challenges'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Free Word Games Collection | Vocabulary & Spelling Games | Elite Trivias',
      description: 'Challenge your vocabulary with our collection of free word games including Boggle, Scramble, Spelling Bee, Word Search, and Word Ladder. Improve spelling, vocabulary, and cognitive skills.',
      images: ['/imgs/word-games.webp'],
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