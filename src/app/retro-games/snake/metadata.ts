// src/app/brainwave/snake/metadata.ts
import { Metadata } from 'next';

export function generateSnakeMetadata(): Metadata {
  return {
    title: 'Snake - Classic Arcade Game | Triviaah',
    description: 'Play the classic Snake game online. Control a growing snake, eat food, and avoid collisions in this timeless arcade puzzle game.',
    keywords: [
      'snake',
      'arcade game',
      'retro game',
      'classic game',
      'snake game',
      'growing snake',
      'food game',
      'puzzle game',
      'strategy game',
      'mobile game',
      'free snake',
      'online snake',
      'snake classic',
      'arcade classic',
      'avoid collisions',
      'snake eat food',
      'snake puzzle',
      'browser snake'
    ],
    alternates: {
      canonical: 'https://triviaah.com/brainwave/snake',
    },
    openGraph: {
      title: 'Snake - Classic Arcade Game | Triviaah',
      description: 'Play the classic Snake game online. Control a growing snake, eat food, and avoid collisions in this timeless arcade puzzle game.',
      url: 'https://triviaah.com/brainwave/snake',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/brainwave/snake.webp',
          width: 1200,
          height: 630,
          alt: 'Snake - Classic Arcade Game'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Snake - Classic Arcade Game | Triviaah',
      description: 'Play the classic Snake game online.',
      images: ['/imgs/brainwave/snake.webp'],
      site: '@elitetrivias',
    }
  };
}