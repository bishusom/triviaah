// src/app/brainwave/tic-tac-toe/metadata.ts
import { Metadata } from 'next';

export function generateTicTacToeMetadata(): Metadata {
  return {
    title: 'Tic Tac Toe - Classic Strategy Game | Triviaah',
    description: 'Play the classic Tic Tac Toe game online. Challenge friends or play against AI with multiple difficulty levels in this timeless strategy game.',
    keywords: [
      'tic tac toe',
      'noughts and crosses',
      'strategy game',
      'two player game',
      'board game',
      'classic game',
      'puzzle game',
      'ai game',
      'online tic tac toe',
      'free tic tac toe',
      'x and o game',
      '3 in a row',
      'mind game',
      'brain game',
      'retro game',
      'mobile game',
      'browser game',
      'triviaah',
      'play tic tac toe online'
    ],
    alternates: {
      canonical: 'https://triviaah.com/brainwave/tic-tac-toe',
    },
    openGraph: {
      title: 'Tic Tac Toe - Classic Strategy Game | Triviaah',
      description: 'Play the classic Tic Tac Toe game online. Challenge friends or play against AI with multiple difficulty levels in this timeless strategy game.',
      url: 'https://triviaah.com/brainwave/tic-tac-toe',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/brainwave/tic-tac-toe.webp',
          width: 1200,
          height: 630,
          alt: 'Tic Tac Toe - Classic Strategy Game'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Tic Tac Toe - Classic Strategy Game | Triviaah',
      description: 'Play the classic Tic Tac Toe game online.',
      images: ['/imgs/brainwave/tic-tac-toe.webp'],
      site: '@elitetrivias',
    }
  };
}