// src/app/brainwave/literale/metadata.ts
import { Metadata } from 'next';

export function generateLiteraleMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/brainwave/literale';

  return {
    title: 'Literale - Daily Literature Puzzle | Triviaah',
    description: 'Guess the book title from opening lines and progressive clues with limited attempts, Wordle-style feedback on title letters. Unlock more hints with each wrong guess!',
    keywords: 'literale, book puzzle, daily book, wordle book, book guessing game, literature game, book trivia, reading game, novel puzzle, book cover game, daily brain teaser, book quotes',
    // ✅ ADD CANONICAL URL
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Literale - Daily Literature Puzzle | Triviaah',
      description: 'Guess the book title from opening lines and progressive clues with limited attempts, Wordle-style feedback on title letters. Unlock more hints with each wrong guess!',
      url: 'https://triviaah.com/brainwave/literale',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/literale-og.webp',
          width: 1200,
          height: 630,
          alt: 'Literale - Daily Literature Puzzle Game'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Literale - Daily Literature Puzzle | Triviaah',
      description: 'Guess the book title from opening lines and progressive clues with limited attempts, Wordle-style feedback on title letters. Unlock more hints with each wrong guess!',
      images: ['/imgs/literale-og.webp'],
    },
  };
}