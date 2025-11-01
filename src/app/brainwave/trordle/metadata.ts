// src/app/trordle/metadata.ts
import { Metadata } from 'next';

export function generateTrordleMetadata(): Metadata {
  return {
    title: 'Trordle - Daily Trivia Puzzle | Elite Trivias',
    description: 'Guess the answer to today\'s trivia puzzle with limited attempts, similar to Wordle but with trivia questions.',
    keywords: 'trordle, trivia puzzle, daily trivia, wordle trivia, trivia game, word guessing game, educational games, free trivia, online trivia games, daily puzzle',
    openGraph: {
      title: 'Trordle - Daily Trivia Puzzle | Elite Trivias',
      description: 'Guess the answer to today\'s trivia puzzle with limited attempts, similar to Wordle but with trivia questions.',
      url: 'https://elitetrivias.com/brainwave/trordle',
      siteName: 'Elite Trivias',
      images: [
        {
          url: '/imgs/trordle-og.webp',
          width: 1200,
          height: 630,
          alt: 'Trordle - Daily Trivia Puzzle Game'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Trordle - Daily Trivia Puzzle | Elite Trivias',
      description: 'Guess the answer to today\'s trivia puzzle with limited attempts, similar to Wordle but with trivia questions.',
      images: ['/imgs/trordle-og.webp'],
    },
  };
}