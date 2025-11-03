// src/app/songle/metadata.ts
import { Metadata } from 'next';

export function generateSongleMetadata(): Metadata {
  const canonicalUrl = 'https://elitetrivias.com/brainwave/songle';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Songle - Daily Song Guessing Puzzle | Elite Trivias',
    description: 'Guess the song from clues like lyrics, artist, and genre. A daily Wordle-style music puzzle game that tests your knowledge of music across decades and genres.',
    keywords: [
      'songle',
      'music puzzle',
      'daily song',
      'wordle music',
      'song game',
      'music guessing game',
      'lyric games',
      'free music trivia',
      'online music games',
      'daily puzzle',
      'song lyrics game',
      'music trivia',
      'artist guessing',
      'genre puzzle',
      'music education',
      'song quiz',
      'music brain teaser',
      'hit song game',
      'music knowledge',
      'daily music challenge'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Songle - Daily Song Guessing Puzzle | Elite Trivias',
      description: 'Guess the song from clues like lyrics, artist, and genre. A daily Wordle-style music puzzle game that tests your knowledge of music across decades and genres.',
      url: 'https://elitetrivias.com/brainwave/songle',
      siteName: 'Elite Trivias',
      images: [
        {
          url: '/imgs/songle-og.webp',
          width: 1200,
          height: 630,
          alt: 'Songle - Daily Song Guessing Puzzle Game'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Songle - Daily Song Guessing Puzzle | Elite Trivias',
      description: 'Guess the song from clues like lyrics, artist, and genre. A daily Wordle-style music puzzle game that tests your knowledge of music across decades and genres.',
      images: ['/imgs/songle-og.webp'],
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