// src/app/brainwave/literale/metadata.ts
import { Metadata } from 'next';

export function generateLiteraleMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/brainwave/literale';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Literale - Daily Literature Puzzle | Triviaah',
    description: 'Guess the book title from opening lines and progressive clues with limited attempts, Wordle-style feedback on title letters. Unlock more hints with each wrong guess!',
    keywords: [
      'literale',
      'book puzzle',
      'daily book',
      'wordle book',
      'book guessing game',
      'literature game',
      'book trivia',
      'reading game',
      'novel puzzle',
      'book cover game',
      'daily brain teaser',
      'book quotes',
      'literature puzzle',
      'book title game',
      'reading challenge',
      'literary game',
      'author game',
      'classic literature',
      'book opening lines',
      'literary quotes'
    ],
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
          url: '/imgs/brainwave/literale.webp',
          width: 1200,
          height: 630,
          alt: 'Literale - Daily Literature Puzzle Game'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Literale - Daily Literature Puzzle | Triviaah',
      description: 'Guess the book title from opening lines and progressive clues with limited attempts, Wordle-style feedback on title letters. Unlock more hints with each wrong guess!',
      images: ['/imgs/brainwave/literale.webp'],
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
        'max-snippet': -1,
      },
    },
    other: {
      'updated_time': lastUpdated
    }
  };
}