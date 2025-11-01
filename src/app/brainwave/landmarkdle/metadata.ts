// src/app/landmarkdle/metadata.ts
import { Metadata } from 'next';

export function generateLandmarkdleMetadata(): Metadata {
  const canonicalUrl = 'https://elitetrivias.com/brainwave/landmarkdle';

  return {
    title: 'Landmarkdle - Daily Landmark Puzzle | Elite Trivias',
    description: 'Guess the landmark from its 6 attributes: type, location, architect, built year, height, and material. Wordle-style landmark guessing game.',
    keywords: 'landmarkdle, landmark puzzle, daily landmark, wordle landmark, architecture game, landmark guessing game, world landmarks, free landmark trivia, online landmark games, daily puzzle, geography game, travel game, famous buildings, world monuments',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Landmarkdle - Daily Landmark Puzzle | Elite Trivias',
      description: 'Guess the landmark from its 6 attributes: type, location, architect, built year, height, and material. Wordle-style landmark guessing game.',
      url: 'https://elitetrivias.com/brainwave/landmarkdle',
      siteName: 'Elite Trivias',
      images: [
        {
          url: '/imgs/landmarkdle-og.webp',
          width: 1200,
          height: 630,
          alt: 'Landmarkdle - Daily Landmark Puzzle Game'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Landmarkdle - Daily Landmark Puzzle | Elite Trivias',
      description: 'Guess the landmark from its 6 attributes: type, location, architect, built year, height, and material. Wordle-style landmark guessing game.',
      images: ['/imgs/landmarkdle-og.webp'],
    },
  };
}