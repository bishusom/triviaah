// src/app/retro-games/metadata.ts
import { Metadata } from 'next';

export function generateRetroGamesMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/retro-games';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Free Retro Games Collection | Classic Arcade Games | Triviaah',
    description: 'Play classic retro games including Minesweeper, Tetris, Pong, and Snake. Enjoy timeless arcade games that test your logic, strategy, and reflexes. Free to play, no registration required.',
    keywords: [
      'retro games',
      'classic games',
      'arcade games',
      'free retro games',
      'online retro games',
      'minesweeper',
      'tetris',
      'pong',
      'snake',
      'nostalgia games',
      'classic arcade',
      '80s games',
      '90s games',
      'logic games',
      'strategy games',
      'puzzle games',
      'arcade classics',
      'timeless games',
      'vintage games',
      'old school games'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Free Retro Games Collection | Classic Arcade Games | Triviaah',
      description: 'Play classic retro games including Minesweeper, Tetris, Pong, and Snake. Enjoy timeless arcade games that test your logic, strategy, and reflexes.',
      url: 'https://triviaah.com/retro-games',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/retro-games/retro-games-collection.webp',
          width: 1200,
          height: 630,
          alt: 'Retro Games Collection - Classic Arcade Games'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Free Retro Games Collection | Classic Arcade Games | Triviaah',
      description: 'Play classic retro games including Minesweeper, Tetris, Pong, and Snake. Enjoy timeless arcade games that test your logic, strategy, and reflexes.',
      images: ['/imgs/retro-games/retro-games-collection.webp'],
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