// src/app/celebrile/metadata.ts
import { Metadata } from 'next';

export function generateCelebrileMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/celebrile';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Celebrile - Daily Celebrity Guessing Game | Triviaah',
    description: 'Guess the celebrity from progressive clues in 6 tries! Wordle-style letter feedback. Unlock more hints with each wrong guess. Free daily entertainment puzzle.',
    keywords: [
      'celebrile',
      'celebrity puzzle',
      'daily celebrity game',
      'celebrity guessing game',
      'wordle celebrity',
      'famous people game',
      'entertainment trivia',
      'pop culture game',
      'celebrity quiz',
      'daily brain teaser',
      'free celebrity game',
      'online puzzle games',
      'movie stars game',
      'music celebrities game'
    ],
    
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Celebrile - Daily Celebrity Guessing Game | Triviaah',
      description: 'Guess the celebrity from progressive clues in 6 tries! Wordle-style letter feedback. Unlock more hints with each wrong guess.',
      url: 'https://triviaah.com/celebrile',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/celebrile-og.webp',
          width: 1200,
          height: 630,
          alt: 'Celebrile - Daily Celebrity Guessing Game'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Celebrile - Daily Celebrity Guessing Game | Triviaah',
      description: 'Guess the celebrity from progressive clues in 6 tries! Wordle-style letter feedback. Unlock more hints with each wrong guess.',
      images: ['/imgs/celebrile-og.webp'],
      site: '@elitetrivias', // Replace with your actual Twitter handle
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