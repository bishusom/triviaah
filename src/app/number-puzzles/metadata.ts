// src/app/number-puzzles/metadata.ts
import { Metadata } from 'next';

export function generateNumberPuzzlesMetadata(): Metadata {
  const canonicalUrl = 'https://elitetrivias.com/number-puzzles';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Number Puzzles Collection | Free Math Games & Brain Teasers | Elite Trivias',
    description: 'Challenge your math skills with our collection of free number puzzles including Number Scramble, Number Tower, Prime Hunter, Number Sequence, and Sudoku. Improve logical thinking and problem-solving skills.',
    keywords: [
      'number puzzles',
      'math games',
      'free number games',
      'brain teasers',
      'logic puzzles',
      'number scramble',
      'number tower',
      'prime hunter',
      'number sequence',
      'sudoku',
      'online math puzzles',
      'educational games',
      'cognitive games',
      'mental math',
      'problem solving games',
      'math challenges',
      'free brain games',
      'daily puzzles',
      'number games collection',
      'mathematical puzzles'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Number Puzzles Collection | Free Math Games & Brain Teasers | Elite Trivias',
      description: 'Challenge your math skills with our collection of free number puzzles including Number Scramble, Number Tower, Prime Hunter, Number Sequence, and Sudoku. Improve logical thinking and problem-solving skills.',
      url: 'https://elitetrivias.com/number-puzzles',
      siteName: 'Elite Trivias',
      images: [
        {
          url: '/imgs/number-puzzles.webp',
          width: 1200,
          height: 630,
          alt: 'Number Puzzles Collection - Free Math Games & Brain Teasers'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Number Puzzles Collection | Free Math Games & Brain Teasers | Elite Trivias',
      description: 'Challenge your math skills with our collection of free number puzzles including Number Scramble, Number Tower, Prime Hunter, Number Sequence, and Sudoku. Improve logical thinking and problem-solving skills.',
      images: ['/imgs/number-puzzles.webp'],
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