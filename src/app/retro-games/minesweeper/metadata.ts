// src/app/brainwave/minesweeper/metadata.ts
import { Metadata } from 'next';

export function generateMinesweeperMetadata(): Metadata {
  return {
    title: 'Minesweeper - Classic Logic Puzzle | Triviaah',
    description: 'Play the classic Minesweeper game with modern features. Clear minefields using logic, strategy, and careful planning with multiple difficulty levels.',
    keywords: [
      'minesweeper',
      'logic puzzle',
      'mine game',
      'classic game',
      'strategy game',
      'brain teaser',
      'puzzle game',
      'number game',
      'mind game',
      'logic game',
      'free minesweeper',
      'online minesweeper',
      'minesweeper classic',
      'minefield game',
      'flag game',
      'logic challenge',
      'puzzle challenge',
      'thinking game'
    ],
    alternates: {
      canonical: 'https://triviaah.com/brainwave/minesweeper',
    },
    openGraph: {
      title: 'Minesweeper - Classic Logic Puzzle | Triviaah',
      description: 'Play the classic Minesweeper game with modern features. Clear minefields using logic, strategy, and careful planning with multiple difficulty levels.',
      url: 'https://triviaah.com/brainwave/minesweeper',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/brainwave/minesweeper.webp',
          width: 1200,
          height: 630,
          alt: 'Minesweeper - Classic Logic Puzzle Game'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Minesweeper - Classic Logic Puzzle | Triviaah',
      description: 'Play the classic Minesweeper game with modern features.',
      images: ['/imgs/brainwave/minesweeper.webp'],
      site: '@elitetrivias',
    }
  };
}