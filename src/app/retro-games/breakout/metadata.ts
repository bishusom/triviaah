// src/app/brainwave/breakout/metadata.ts
import { Metadata } from 'next';

export function generateBreakoutMetadata(): Metadata {
  return {
    title: 'Breakout - Classic Arcade Game | Triviaah',
    description: 'Play the classic Breakout arcade game online. Use the paddle to bounce a ball and break bricks in this iconic 1976 Atari game with multiple levels.',
    keywords: [
      'breakout',
      'atari',
      'arcade game',
      'classic game',
      'paddle game',
      'ball game',
      'brick game',
      'retro game',
      '1976 game',
      'nolan bushnell',
      'steve jobs',
      'steve wozniak',
      'brick breaker',
      'paddle and ball',
      'atari classic',
      'high score game',
      'online breakout',
      'free breakout',
      'play breakout',
      'arcade classic',
      '70s game',
      'nostalgia game',
      'brick breaking game',
      'ball physics',
      'multi-level game'
    ],
    alternates: {
      canonical: 'https://triviaah.com/brainwave/breakout',
    },
    openGraph: {
      title: 'Breakout - Classic Arcade Game | Triviaah',
      description: 'Play the classic Breakout arcade game online. Use the paddle to bounce a ball and break bricks in this iconic 1976 Atari game with multiple levels.',
      url: 'https://triviaah.com/brainwave/breakout',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/brainwave/breakout.webp',
          width: 1200,
          height: 630,
          alt: 'Breakout - Classic Arcade Game'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Breakout - Classic Arcade Game | Triviaah',
      description: 'Play the classic Breakout arcade game online.',
      images: ['/imgs/brainwave/breakout.webp'],
      site: '@elitetrivias',
    }
  };
}