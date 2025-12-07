// src/app/word-games/word-ladder/metadata.ts
import { Metadata } from 'next';

export function generateWordLadderMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/word-games/word-ladder';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Free Word Ladder Puzzles Online | Vocabulary Brain Game | Triviaah',
    description: 'Play free word ladder puzzles online. Transform one word into another by changing one letter at a time. Fun vocabulary game that improves spelling and logic skills.',
    keywords: [
      'word ladder',
      'word ladder puzzles',
      'vocabulary games',
      'word games',
      'spelling games',
      'free word puzzles',
      'online word games',
      'brain games',
      'word transformation game',
      'logic puzzles',
      'word change game',
      'cognitive games',
      'vocabulary builder',
      'spelling practice',
      'word brain teaser',
      'educational word games',
      'puzzle challenge',
      'mental exercise',
      'language games',
      'word patterns'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Free Word Ladder Puzzles Online | Vocabulary Brain Game | Triviaah',
      description: 'Play free word ladder puzzles online. Transform one word into another by changing one letter at a time. Fun vocabulary game that improves spelling and logic skills.',
      url: 'https://triviaah.com/word-games/word-ladder',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/word-games/word-ladder.webp',
          width: 1200,
          height: 630,
          alt: 'Free Word Ladder Puzzles Online'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Free Word Ladder Puzzles Online | Vocabulary Brain Game | Triviaah',
      description: 'Play free word ladder puzzles online. Transform one word into another by changing one letter at a time. Fun vocabulary game that improves spelling and logic skills.',
      images: ['/imgs/word-games/word-ladder.webp'],
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