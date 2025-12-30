// src/app/number-puzzles/prime-hunter/metadata.ts
import { Metadata } from 'next';

export function generatePrimeHunterMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/number-puzzles/prime-hunter';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Prime Hunter Puzzle Game | Free Prime Number Challenge | Triviaah',
    description: 'Play Prime Hunter, a free online prime number puzzle game. Identify prime numbers in a grid with limited attempts. Improve your math skills with this fun and challenging brain game.',
    keywords: [
      'prime hunter',
      'prime number puzzle',
      'free prime game',
      'online math games',
      'brain games',
      'number puzzles',
      'prime number identification',
      'educational games',
      'free brain teasers',
      'daily math challenges',
      'math puzzles',
      'prime numbers',
      'mathematical games',
      'cognitive games',
      'math brain teaser',
      'number patterns',
      'educational math games',
      'mental math',
      'logic puzzles',
      'problem solving games',
      'math challenges',
      'prime identification',
      'number theory',
      'mathematical puzzles'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Prime Hunter Puzzle Game | Free Prime Number Challenge | Triviaah',
      description: 'Play Prime Hunter, a free online prime number puzzle game. Identify prime numbers in a grid with limited attempts. Improve your math skills with this fun and challenging brain game.',
      url: 'https://triviaah.com/number-puzzles/prime-hunter',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/number-puzzles//prime-hunter.webp',
          width: 1200,
          height: 630,
          alt: 'Prime Hunter Puzzle Game - Free Prime Number Challenge'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Prime Hunter Puzzle Game | Free Prime Number Challenge | Triviaah',
      description: 'Play Prime Hunter, a free online prime number puzzle game. Identify prime numbers in a grid with limited attempts. Improve your math skills with this fun and challenging brain game.',
      images: ['/imgs/number-puzzles//prime-hunter.webp'],
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