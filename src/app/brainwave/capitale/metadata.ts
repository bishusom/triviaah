// src/app/Capitale/metadata.ts
import { Metadata } from 'next';

export function generateCapitaleMetadata(): Metadata {
  return {
    title: 'Capitale - Daily Trivia Puzzle | Triviaah',
    description: 'Guess the answer to today\'s capital city puzzle with limited attempts, similar to Wordle but with trivia questions.',
    keywords: 'Capitale, trivia puzzle, daily trivia, wordle trivia, trivia game, city guessing game, educational games, free trivia, online trivia games, daily puzzle',
    openGraph: {
      title: 'Capitale - Daily Trivia Puzzle | Triviaah',
      description: 'Guess the answer to today\'s capital city puzzle with limited attempts, similar to Wordle but with trivia questions.',
      url: 'https://triviaah.com/Capitale',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/Capitale-og.webp',
          width: 1200,
          height: 630,
          alt: 'Capitale - Daily Trivia Puzzle Game'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Capitale - Daily Trivia Puzzle | Triviaah',
      description: 'Guess the answer to today\'s capital city with limited attempts, similar to Wordle but with trivia questions.',
      images: ['/imgs/Capitale-og.webp'],
    },
  };
}