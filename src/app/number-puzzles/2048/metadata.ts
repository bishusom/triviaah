// src/app/number-puzzles/2048/metadata.ts
import { Metadata } from 'next';

export function generate2048Metadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/number-puzzles/2048';
  const lastUpdated = new Date().toISOString();

  return {
    title: '2048 | Free Tile-Merging Brain Teaser | Triviaah',
    description: 'Play 2048, a free online tile-merging puzzle game. Swipe matching tiles together and reach 2048 while building strategy and spatial reasoning.',
    keywords: [
      '2048',
      '2048 game',
      'tile merging game',
      'number puzzle game',
      'free number game',
      'brain games',
      'tile puzzle',
      'educational games',
      'free brain teasers',
      'daily puzzle games',
      'math puzzles',
      'strategy game',
      'pattern recognition',
      'cognitive games',
      'spatial reasoning',
      'logic puzzles',
      'problem solving games',
      '2048 puzzle'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: '2048 Puzzle Game | Free Tile-Merging Brain Teaser | Triviaah',
      description: 'Play 2048, a free online tile-merging puzzle game. Swipe matching tiles together and reach 2048 while building strategy and spatial reasoning.',
      url: 'https://triviaah.com/number-puzzles/2048',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/number-puzzles/2048.webp',
          width: 1200,
          height: 630,
          alt: '2048 Puzzle Game - Free Tile-Merging Brain Teaser'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: '2048 Puzzle Game | Free Tile-Merging Brain Teaser | Triviaah',
      description: 'Play 2048, a free online tile-merging puzzle game. Swipe matching tiles together and reach 2048 while building strategy and spatial reasoning.',
      images: ['/imgs/number-puzzles/2048.webp'],
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
