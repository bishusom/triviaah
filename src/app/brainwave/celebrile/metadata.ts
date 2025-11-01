// src/app/celebrile/metadata.ts
import { Metadata } from 'next';

export function generateCelebrileMetadata(): Metadata {
  const canonicalUrl = 'https://elitetrivias.com/brainwave/celebrile';

  return {
    title: 'Celebrile - Daily Celebrity Puzzle | Elite Trivias',
    description: 'Guess the celebrity from progressive clues with limited attempts, Wordle-style feedback on name letters. Unlock more hints with each wrong guess!',
    keywords: 'celebrile, celebrity puzzle, daily celebrity, wordle celebrity, famous people game, celebrity guessing game, trivia games, free celebrity trivia, online puzzle games, daily brain teaser',
    // ✅ ADD CANONICAL URL
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Celebrile - Daily Celebrity Puzzle | Elite Trivias',
      description: 'Guess the celebrity from progressive clues with limited attempts, Wordle-style feedback on name letters. Unlock more hints with each wrong guess!',
      url: 'https://elitetrivias.com/brainwave/celebrile',
      siteName: 'Elite Trivias',
      images: [
        {
          url: '/imgs/celebrile-og.webp',
          width: 1200,
          height: 630,
          alt: 'Celebrile - Daily Celebrity Puzzle Game'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Celebrile - Daily Celebrity Puzzle | Elite Trivias',
      description: 'Guess the celebrity from progressive clues with limited attempts, Wordle-style feedback on name letters. Unlock more hints with each wrong guess!',
      images: ['/imgs/celebrile-og.webp'],
    },
  };
}