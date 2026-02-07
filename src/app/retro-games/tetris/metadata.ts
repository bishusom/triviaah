// src/app/brainwave/tetris/metadata.ts
import { Metadata } from 'next';

export function generateTetrisMetadata(): Metadata {
  return {
    title: 'Tetris - Classic Puzzle Game | Triviaah',
    description: 'Play the classic Tetris puzzle game online. Arrange falling blocks to clear lines and achieve high scores in this timeless arcade game.',
    keywords: [
      'tetris',
      'puzzle game',
      'arcade game',
      'block game',
      'classic game',
      'falling blocks',
      'line clear',
      'retro game',
      'brain game',
      'strategy game',
      'free tetris',
      'online tetris',
      'tetris classic',
      'puzzle challenge',
      'mind game',
      'thinking game',
      'mobile tetris',
      'browser tetris'
    ],
    alternates: {
      canonical: 'https://triviaah.com/brainwave/tetris',
    },
    openGraph: {
      title: 'Tetris - Classic Puzzle Game | Triviaah',
      description: 'Play the classic Tetris puzzle game online. Arrange falling blocks to clear lines and achieve high scores in this timeless arcade game.',
      url: 'https://triviaah.com/brainwave/tetris',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/brainwave/tetris.webp',
          width: 1200,
          height: 630,
          alt: 'Tetris - Classic Puzzle Game'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Tetris - Classic Puzzle Game | Triviaah',
      description: 'Play the classic Tetris puzzle game online.',
      images: ['/imgs/brainwave/tetris.webp'],
      site: '@elitetrivias',
    }
  };
}