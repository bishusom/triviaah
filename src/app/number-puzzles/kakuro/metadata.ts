// src/app/number-puzzles/kakuro/metadata.ts
import { Metadata } from 'next';

export function generateKakuroMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/number-puzzles/kakuro';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Kakuro Puzzle Game | Free Math Brain Teaser | Triviaah',
    description: 'Play Kakuro, a free online number puzzle game. Fill the grid with numbers 1-9 to match the sums while avoiding duplicates. Improve your math skills with this fun and challenging brain game.',
    keywords: [
      'kakuro',
      'kakuro puzzle',
      'kakuro game',
      'math puzzle',
      'brain teaser',
      'number puzzle',
      'logic puzzle',
      'free online puzzle',
      'educational game',
      'math brain teaser',
      'number puzzle game',
      'free number game',
      'online math games',
      'brain games',
      'number pattern identification',
      'educational games',
      'free brain teasers',
      'daily math challenges',
      'math puzzles',
      'sequence game',
      'pattern recognition',
      'cognitive games',
      'math brain teaser',
      'number patterns',
      'educational math games',
      'mental math',
      'logic puzzles',
      'problem solving games',
      'math challenges'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Kakuro Puzzle Game | Free Math Brain Teaser | Triviaah',
    description: 'Play Kakuro, a free online number puzzle game. Fill the grid with numbers 1-9 to match the sums while avoiding duplicates. Improve your math skills with this fun and challenging brain game.',
      url: 'https://triviaah.com/number-puzzles/kakuro',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/number-puzzles/kakuro.webp',
          width: 1200,
          height: 630,
          alt: 'Kakuro Puzzle Game - Free Math Brain Teaser'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Kakuro Puzzle Game | Free Math Brain Teaser | Triviaah',
      description: 'Play Kakuro, a free online number puzzle game. Identify the next numbers in a sequence with limited attempts. Improve your math skills with this fun and challenging brain game.',
      images: ['/imgs/number-puzzles/kakuro.webp'],
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