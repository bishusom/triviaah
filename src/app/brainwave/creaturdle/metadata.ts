// src/app/creaturdle/metadata.ts
import { Metadata } from 'next';

export function generateCreaturdleMetadata(): Metadata {
  const canonicalUrl = 'https://elitetrivias.com/brainwave/creaturdle';

  return {
    title: 'Creaturdle - Daily Animal Puzzle | Elite Trivias',
    description: 'Guess the animal from its 6 attributes: class, habitat, diet, size, activity, and body covering. Wordle-style animal guessing game.',
    keywords: 'creaturdle, animal puzzle, daily animal, wordle animal, creature game, animal guessing game, wildlife games, free animal trivia, online animal games, daily puzzle, biology game, nature game',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Creaturdle - Daily Animal Puzzle | Elite Trivias',
      description: 'Guess the animal from its 6 attributes: class, habitat, diet, size, activity, and body covering. Wordle-style animal guessing game.',
      url: 'https://elitetrivias.com/brainwave/creaturdle',
      siteName: 'Elite Trivias',
      images: [
        {
          url: '/imgs/creaturdle-og.webp',
          width: 1200,
          height: 630,
          alt: 'Creaturdle - Daily Animal Puzzle Game'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Creaturdle - Daily Animal Puzzle | Elite Trivias',
      description: 'Guess the animal from its 6 attributes: class, habitat, diet, size, activity, and body covering. Wordle-style animal guessing game.',
      images: ['/imgs/creaturdle-og.webp'],
    },
  };
}