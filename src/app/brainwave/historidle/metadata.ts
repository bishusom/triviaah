// src/app/brainwave/historidle/metadata.ts
import { Metadata } from 'next';

export function generateHistoridleMetadata(): Metadata {
  return {
    title: 'Historidle - Daily Historical Puzzle | Triviaah',
    description: 'Guess the historical figure or event from emojis and progressive clues with limited attempts, Wordle-style feedback. Unlock more historical hints with each wrong guess!',
    keywords: 'historidle, historical puzzle, daily history, wordle history, historical figures game, history guessing game, trivia games, free history trivia, online puzzle games, daily brain teaser, emoji history game, historical events',
    openGraph: {
      title: 'Historidle - Daily Historical Puzzle | Triviaah',
      description: 'Guess the historical figure or event from emojis and progressive clues with limited attempts, Wordle-style feedback. Unlock more historical hints with each wrong guess!',
      url: 'https://triviaah.com/brainwave/historidle',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/historidle-og.webp',
          width: 1200,
          height: 630,
          alt: 'Historidle - Daily Historical Puzzle Game'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Historidle - Daily Historical Puzzle | Triviaah',
      description: 'Guess the historical figure or event from emojis and progressive clues with limited attempts, Wordle-style feedback. Unlock more historical hints with each wrong guess!',
      images: ['/imgs/historidle-og.webp'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}