// src/app/songle/metadata.ts
import { Metadata } from 'next';

export function generateSongleMetadata(): Metadata {
  return {
    title: 'Songle - Daily Song Guessing Puzzle | Triviaah',
    description: 'Guess the song from clues like lyrics, artist, and genre. Wordle-style music puzzle game.',
    keywords: 'songle, music puzzle, daily song, wordle music, song game, music guessing game, lyric games, free music trivia, online music games, daily puzzle',
    openGraph: {
      title: 'Songle - Daily Song Guessing Puzzle | Triviaah',
      description: 'Guess the song from clues like lyrics, artist, and genre. Wordle-style music puzzle game.',
      url: 'https://triviaah.com/brainwave/songle',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/songle-og.webp',
          width: 1200,
          height: 630,
          alt: 'Songle - Daily Song Guessing Puzzle Game'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Songle - Daily Song Guessing Puzzle | Triviaah',
      description: 'Guess the song from clues like lyrics, artist, and genre. Wordle-style music puzzle game.',
      images: ['/imgs/songle-og.webp'],
    },
  };
}