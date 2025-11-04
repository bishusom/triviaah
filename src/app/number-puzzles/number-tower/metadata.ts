// src/app/number-puzzles/number-tower/metadata.ts
import { Metadata } from 'next';

export function generateNumberTowerMetadata(): Metadata {
  const canonicalUrl = 'https://elitetrivias.com/number-puzzles/number-tower';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Number Tower Puzzle Game | Free Math Arrangement Challenge | Elite Trivias',
    description: 'Play Number Tower, a free online number puzzle game. Arrange numbers in a tower structure with limited moves. Improve your math skills with this fun and challenging brain game.',
    keywords: [
      'number tower',
      'number puzzle game',
      'free number game',
      'online math games',
      'brain games',
      'number arrangement',
      'educational games',
      'free brain teasers',
      'daily math challenges',
      'math puzzles',
      'tower game',
      'logical thinking',
      'cognitive games',
      'math brain teaser',
      'number patterns',
      'educational math games',
      'mental math',
      'logic puzzles',
      'problem solving games',
      'math challenges',
      'spatial reasoning',
      'strategic thinking',
      'number placement'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Number Tower Puzzle Game | Free Math Arrangement Challenge | Elite Trivias',
      description: 'Play Number Tower, a free online number puzzle game. Arrange numbers in a tower structure with limited moves. Improve your math skills with this fun and challenging brain game.',
      url: 'https://elitetrivias.com/number-puzzles/number-tower',
      siteName: 'Elite Trivias',
      images: [
        {
          url: '/imgs/number-tower.webp',
          width: 1200,
          height: 630,
          alt: 'Number Tower Puzzle Game - Free Math Arrangement Challenge'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Number Tower Puzzle Game | Free Math Arrangement Challenge | Elite Trivias',
      description: 'Play Number Tower, a free online number puzzle game. Arrange numbers in a tower structure with limited moves. Improve your math skills with this fun and challenging brain game.',
      images: ['/imgs/number-tower.webp'],
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