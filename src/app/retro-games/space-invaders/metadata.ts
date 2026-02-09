// src/app/brainwave/space-invaders/metadata.ts
import { Metadata } from 'next';

export function generateSpaceInvadersMetadata(): Metadata {
  return {
    title: 'Space Invaders - Classic Arcade Game | Triviaah',
    description: 'Play the classic Space Invaders arcade game online. Defend Earth from alien invaders in this iconic 1978 shooter game with increasing difficulty waves.',
    keywords: [
      'space invaders',
      'arcade game',
      'classic game',
      'shooter game',
      'alien game',
      'retro game',
      '1978 game',
      'taito',
      'alien invasion',
      'spaceship game',
      'defense game',
      'shoot em up',
      'galactic defense',
      'high score game',
      'online space invaders',
      'free space invaders',
      'play space invaders',
      'arcade classic',
      '70s game',
      'nostalgia game',
      'alien shooter',
      'mystery ufo',
      'shield defense'
    ],
    alternates: {
      canonical: 'https://triviaah.com/brainwave/space-invaders',
    },
    openGraph: {
      title: 'Space Invaders - Classic Arcade Game | Triviaah',
      description: 'Play the classic Space Invaders arcade game online. Defend Earth from alien invaders in this iconic 1978 shooter game with increasing difficulty waves.',
      url: 'https://triviaah.com/brainwave/space-invaders',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/brainwave/space-invaders.webp',
          width: 1200,
          height: 630,
          alt: 'Space Invaders - Classic Arcade Game'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Space Invaders - Classic Arcade Game | Triviaah',
      description: 'Play the classic Space Invaders arcade game online.',
      images: ['/imgs/brainwave/space-invaders.webp'],
      site: '@elitetrivias',
    }
  };
}