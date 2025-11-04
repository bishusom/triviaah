// src/app/number-puzzles/sudoku/metadata.ts
import { Metadata } from 'next';

export function generateSudokuMetadata(): Metadata {
  const canonicalUrl = 'https://elitetrivias.com/number-puzzles/sudoku';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Free Sudoku Puzzles Online | Daily Sudoku Games & Challenges | Elite Trivias',
    description: 'Play free Sudoku puzzles online with daily challenges. Enjoy classic 9x9 Sudoku games with multiple difficulty levels. One of the best free Sudoku websites with no registration required.',
    keywords: [
      'sudoku',
      'free sudoku puzzles',
      'online sudoku',
      'daily sudoku',
      'sudoku game',
      'number puzzle',
      'logic game',
      'brain game',
      'free puzzle games',
      '9x9 sudoku',
      'classic sudoku',
      'logic puzzle',
      'number game',
      'cognitive games',
      'brain teaser',
      'puzzle challenge',
      'mental exercise',
      'logical reasoning',
      'problem solving games',
      'daily brain training',
      'free online puzzles'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Free Sudoku Puzzles Online | Daily Sudoku Games & Challenges | Elite Trivias',
      description: 'Play free Sudoku puzzles online with daily challenges. Enjoy classic 9x9 Sudoku games with multiple difficulty levels. One of the best free Sudoku websites with no registration required.',
      url: 'https://elitetrivias.com/number-puzzles/sudoku',
      siteName: 'Elite Trivias',
      images: [
        {
          url: '/imgs/sudoku.webp',
          width: 1200,
          height: 630,
          alt: 'Free Sudoku Puzzles Online - Daily Sudoku Games & Challenges'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Free Sudoku Puzzles Online | Daily Sudoku Games & Challenges | Elite Trivias',
      description: 'Play free Sudoku puzzles online with daily challenges. Enjoy classic 9x9 Sudoku games with multiple difficulty levels. One of the best free Sudoku websites with no registration required.',
      images: ['/imgs/sudoku.webp'],
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