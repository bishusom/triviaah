// src/app/number-puzzles/number-sequence/metadata.ts
import { Metadata } from 'next';

export function generateNumberSequenceMetadata(): Metadata {
  const canonicalUrl = 'https://elitetrivias.com/number-puzzles/number-sequence';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Number Sequence Puzzle Game | Free Math Pattern Challenge | Elite Trivias',
    description: 'Play Number Sequence, a free online number puzzle game. Identify the next numbers in a sequence with limited attempts. Improve your math skills with this fun and challenging brain game.',
    keywords: [
      'number sequence',
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
      'math challenges',
      'arithmetic sequences',
      'geometric sequences',
      'fibonacci sequence'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Number Sequence Puzzle Game | Free Math Pattern Challenge | Elite Trivias',
      description: 'Play Number Sequence, a free online number puzzle game. Identify the next numbers in a sequence with limited attempts. Improve your math skills with this fun and challenging brain game.',
      url: 'https://elitetrivias.com/number-puzzles/number-sequence',
      siteName: 'Elite Trivias',
      images: [
        {
          url: '/imgs/number-puzzles//number-sequence.webp',
          width: 1200,
          height: 630,
          alt: 'Number Sequence Puzzle Game - Free Math Pattern Challenge'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Number Sequence Puzzle Game | Free Math Pattern Challenge | Elite Trivias',
      description: 'Play Number Sequence, a free online number puzzle game. Identify the next numbers in a sequence with limited attempts. Improve your math skills with this fun and challenging brain game.',
      images: ['/imgs/number-puzzles//number-sequence.webp'],
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