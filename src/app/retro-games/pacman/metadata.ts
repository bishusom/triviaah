// src/app/brainwave/pacman/metadata.ts
import { Metadata } from 'next';

export function generatePacManMetadata(): Metadata {
  return {
    title: 'Pac-Man - Classic Arcade Game | Triviaah',
    description: 'Play the classic Pac-Man arcade game online. Navigate the maze, eat dots, avoid ghosts, and achieve high scores in this iconic 80s game.',
    keywords: [
      'pac-man',
      'pacman',
      'arcade game',
      'classic game',
      'maze game',
      'ghost game',
      'retro game',
      '1980 game',
      'namco',
      'dot eater',
      'power pellet',
      'blinky',
      'pinky',
      'inky',
      'clyde',
      'maze chase',
      'high score game',
      'online pac-man',
      'free pac-man',
      'play pac-man',
      'arcade classic',
      '80s game',
      'nostalgia game'
    ],
    alternates: {
      canonical: 'https://triviaah.com/brainwave/pacman',
    },
    openGraph: {
      title: 'Pac-Man - Classic Arcade Game | Triviaah',
      description: 'Play the classic Pac-Man arcade game online. Navigate the maze, eat dots, avoid ghosts, and achieve high scores in this iconic 80s game.',
      url: 'https://triviaah.com/brainwave/pacman',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/brainwave/pacman.webp',
          width: 1200,
          height: 630,
          alt: 'Pac-Man - Classic Arcade Game'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Pac-Man - Classic Arcade Game | Triviaah',
      description: 'Play the classic Pac-Man arcade game online.',
      images: ['/imgs/brainwave/pacman.webp'],
      site: '@elitetrivias',
    }
  };
}