// src/app/retro-games/pong/metadata.ts
import { Metadata } from 'next';

export function generatePongMetadata(): Metadata {
  return {
    title: 'Pong - Classic Arcade Game | Triviaah',
    description: 'Play the classic Pong game online. Battle against AI or challenge a friend in this timeless table tennis arcade game.',
    keywords: [
      'pong',
      'arcade game',
      'table tennis',
      'retro game',
      'classic game',
      'two player game',
      'vs ai',
      'paddle game',
      'ball game',
      'sports game',
      'free pong',
      'online pong',
      'pong classic',
      'arcade classic',
      'competitive game',
      'reflex game',
      'mobile pong',
      'browser pong'
    ],
    alternates: {
      canonical: 'https://triviaah.com/retro-games/pong',
    },
    openGraph: {
      title: 'Pong - Classic Arcade Game | Triviaah',
      description: 'Play the classic Pong game online. Battle against AI or challenge a friend in this timeless table tennis arcade game.',
      url: 'https://triviaah.com/retro-games/pong',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/retro-games/pong.webp',
          width: 1200,
          height: 630,
          alt: 'Pong - Classic Arcade Game'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Pong - Classic Arcade Game | Triviaah',
      description: 'Play the classic Pong game online.',
      images: ['/imgs/retro-games/pong.webp'],
      site: '@elitetrivias',
    }
  };
}
