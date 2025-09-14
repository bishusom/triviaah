// src/app/plotle/metadata.ts
import { Metadata } from 'next';

export function generatePlotleMetadata(): Metadata {
  return {
    title: 'Plotle - Daily Movie Plot Puzzle | Triviaah',
    description: 'Guess the movie from its 6-word plot summary with limited attempts, Wordle-style feedback on plot words.',
    keywords: 'plotle, movie puzzle, daily movie, wordle movie, plot game, movie guessing game, film games, free movie trivia, online movie games, daily puzzle',
    openGraph: {
      title: 'Plotle - Daily Movie Plot Puzzle | Triviaah',
      description: 'Guess the movie from its 6-word plot summary with limited attempts, Wordle-style feedback on plot words.',
      url: 'https://triviaah.com/plotle',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/plotle-og.webp',
          width: 1200,
          height: 630,
          alt: 'Plotle - Daily Movie Plot Puzzle Game'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Plotle - Daily Movie Plot Puzzle | Triviaah',
      description: 'Guess the movie from its 6-word plot summary with limited attempts, Wordle-style feedback on plot words.',
      images: ['/imgs/plotle-og.webp'],
    },
  };
}