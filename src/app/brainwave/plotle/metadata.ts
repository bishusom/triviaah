// src/app/plotle/metadata.ts
import { Metadata } from 'next';

export function generatePlotleMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/brainwave/plotle';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Plotle - Daily Movie Plot Puzzle | Triviaah',
    description: 'Guess the movie from its 6-word plot summary with limited attempts, Wordle-style feedback on plot words. Daily movie guessing game for film lovers.',
    keywords: [
      'plotle',
      'movie puzzle',
      'daily movie',
      'wordle movie',
      'plot game',
      'movie guessing game',
      'film games',
      'free movie trivia',
      'online movie games',
      'daily puzzle',
      'movie plot game',
      'film trivia',
      'cinema game',
      'movie buff game',
      'six word plot',
      'movie summary game',
      'film guessing',
      'hollywood game',
      'movie challenge',
      'film puzzle',
      'entertainment game'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Plotle - Daily Movie Plot Puzzle | Triviaah',
      description: 'Guess the movie from its 6-word plot summary with limited attempts, Wordle-style feedback on plot words. Daily movie guessing game for film lovers.',
      url: 'https://triviaah.com/brainwave/plotle',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/brainwave/plotle.webp',
          width: 1200,
          height: 630,
          alt: 'Plotle - Daily Movie Plot Puzzle Game'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Plotle - Daily Movie Plot Puzzle | Triviaah',
      description: 'Guess the movie from its 6-word plot summary with limited attempts, Wordle-style feedback on plot words. Daily movie guessing game for film lovers.',
      images: ['/imgs/brainwave/plotle.webp'],
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