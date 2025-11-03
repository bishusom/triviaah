// src/app/inventionle/metadata.ts
import { Metadata } from 'next';

export function generateInventionleMetadata(): Metadata {
  const canonicalUrl = 'https://elitetrivias.com/brainwave/inventionle';

  return {
    title: 'Inventionle - Daily Invention Puzzle | Elite Trivias',
    description: 'Guess the invention from its 6 attributes: inventor, year, category, country, purpose, and impact. Wordle-style invention guessing game.',
    keywords: 'inventionle, invention puzzle, daily invention, wordle invention, technology game, invention guessing game, history games, free invention trivia, online invention games, daily puzzle, science game, innovation game',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Inventionle - Daily Invention Puzzle | Elite Trivias',
      description: 'Guess the invention from its 6 attributes: inventor, year, category, country, purpose, and impact. Wordle-style invention guessing game.',
      url: 'https://elitetrivias.com/brainwave/inventionle',
      siteName: 'Elite Trivias',
      images: [
        {
          url: '/imgs/inventionle-og.webp',
          width: 1200,
          height: 630,
          alt: 'Inventionle - Daily Invention Puzzle Game'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Inventionle - Daily Invention Puzzle | Elite Trivias',
      description: 'Guess the invention from its 6 attributes: inventor, year, category, country, purpose, and impact. Wordle-style invention guessing game.',
      images: ['/imgs/inventionle-og.webp'],
    },
  };
}