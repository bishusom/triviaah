// src/app/foodle/metadata.ts
import { Metadata } from 'next';

export function generateFoodleMetadata(): Metadata {
  const canonicalUrl = 'https://elitetrivias.com/brainwave/foodle';

  return {
    title: 'Foodle - Daily Food Puzzle | Elite Trivias',
    description: 'Guess the food from its 6 attributes: cuisine, course, main ingredients, cooking method, flavor profile, and temperature. Wordle-style food guessing game.',
    keywords: 'foodle, food puzzle, daily food, wordle food, dish game, food guessing game, cuisine games, free food trivia, online food games, daily puzzle, cooking game, food trivia',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Foodle - Daily Food Puzzle | Elite Trivias',
      description: 'Guess the food from its 6 attributes: cuisine, course, main ingredients, cooking method, flavor profile, and temperature. Wordle-style food guessing game.',
      url: 'https://elitetrivias.com/brainwave/foodle',
      siteName: 'Elite Trivias',
      images: [
        {
          url: '/imgs/foodle-og.webp',
          width: 1200,
          height: 630,
          alt: 'Foodle - Daily Food Puzzle Game'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Foodle - Daily Food Puzzle | Elite Trivias',
      description: 'Guess the food from its 6 attributes: cuisine, course, main ingredients, cooking method, flavor profile, and temperature. Wordle-style food guessing game.',
      images: ['/imgs/foodle-og.webp'],
    },
  };
}