// src/app/foodle/metadata.ts
import { Metadata } from 'next';

export function generateFoodleMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/brainwave/foodle';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Foodle - Daily Food Puzzle | Triviaah',
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
      title: 'Foodle - Daily Food Puzzle | Triviaah',
      description: 'Guess the food from its 6 attributes: cuisine, course, main ingredients, cooking method, flavor profile, and temperature. Wordle-style food guessing game.',
      url: 'https://triviaah.com/brainwave/foodle',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/brainwave/foodle.webp',
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
      title: 'Foodle - Daily Food Puzzle | Triviaah',
      description: 'Guess the food from its 6 attributes: cuisine, course, main ingredients, cooking method, flavor profile, and temperature. Wordle-style food guessing game.',
      images: ['/imgs/brainwave/foodle.webp'],
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