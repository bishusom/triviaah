// src/app/foodle/metadata.ts
import { Metadata } from 'next';

export function generateFoodleMetadata(): Metadata {
  const canonicalUrl = 'https://elitetrivias.com/brainwave/foodle';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Foodle - Daily Food Puzzle | Elite Trivias',
    description: 'Guess the food from its 6 attributes: cuisine, course, main ingredients, cooking method, flavor profile, and temperature. Wordle-style food guessing game.',
    keywords: [
      'foodle',
      'food puzzle',
      'daily food',
      'wordle food',
      'dish game',
      'food guessing game',
      'cuisine games',
      'free food trivia',
      'online food games',
      'daily puzzle',
      'cooking game',
      'food trivia',
      'culinary game',
      'recipe guessing',
      'food education',
      'cooking puzzle'
    ],
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
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Foodle - Daily Food Puzzle | Elite Trivias',
      description: 'Guess the food from its 6 attributes: cuisine, course, main ingredients, cooking method, flavor profile, and temperature. Wordle-style food guessing game.',
      images: ['/imgs/foodle-og.webp'],
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