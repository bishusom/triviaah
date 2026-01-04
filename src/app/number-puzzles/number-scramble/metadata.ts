// src/app/number-puzzles/number-scramble/metadata.ts
import { Metadata } from 'next';

export function generateNumberScrambleMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/number-puzzles/number-scramble';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Number Scramble | Free Math Brain Teaser | Triviaah',
    description: 'Play Number Scramble, a free online number puzzle game. Form the target number by rearranging given digits within limited attempts. Challenge your math skills with this fun and engaging brain game.',
    keywords: [
      'number scramble',
      'number puzzle game',
      'free number game',
      'online math games',
      'brain games',
      'number pattern identification',
      'educational games',
      'free brain teasers',
      'daily math challenges',
      'math puzzles',
      'scramble game',
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
      title: 'Number Scramble Puzzle Game | Free Math Brain Teaser | Triviaah',
      description: 'Play Number Scramble, a free online number puzzle game. Form the target number by rearranging given digits within limited attempts. Challenge your math skills with this fun and engaging brain game.',
      url: 'https://triviaah.com/number-puzzles/number-scramble',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/number-puzzles/number-scramble.webp',
          width: 1200,
          height: 630,
          alt: 'Number scramble Puzzle Game - Free Math Brain Teaser'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Number scramble Puzzle Game | Free Math Brain Teaser | Triviaah',
      description: 'Play Number Scramble, a free online number puzzle game. Form the target number by rearranging given digits within limited attempts. Challenge your math skills with this fun and engaging brain game.',
      images: ['/imgs/number-puzzles/number-scramble.webp'],
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