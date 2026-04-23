// src/app/brainwave/botanle/metadata.ts
import { Metadata } from 'next';

export function generateBotanleMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/brainwave/botanle';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Botanle - Daily Plant Guessing Game | Triviaah',
    description: 'Guess the plant from progressive botanical clues in 6 tries! Wordle-style letter feedback. Unlock more hints with each wrong guess. Free daily plant puzzle.',
    keywords: [
      'botanle',
      'plant puzzle',
      'botany game',
      'plant identification',
      'daily plant game',
      'flower guessing game',
      'tree identification',
      'botanical puzzle',
      'plant quiz',
      'gardening game',
      'horticulture game',
      'scientific names game',
      'wordle plants',
      'daily brain teaser',
      'free plant game',
      'online botany games',
      'plant species guessing',
      'botanical knowledge game',
      'plant taxonomy game',
      'nature puzzle'
    ],
    
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Botanle - Daily Plant Guessing Game | Triviaah',
      description: 'Guess the plant from progressive botanical clues in 6 tries! Wordle-style letter feedback. Unlock more hints with each wrong guess.',
      url: 'https://triviaah.com/brainwave/botanle',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/brainwave/botanle-og.webp',
          width: 1200,
          height: 630,
          alt: 'Botanle - Daily Plant Guessing Game'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Botanle - Daily Plant Guessing Game | Triviaah',
      description: 'Guess the plant from progressive botanical clues in 6 tries! Wordle-style letter feedback. Unlock more hints with each wrong guess.',
      images: ['/imgs/brainwave/botanle-og.webp'],
      site: '@triviaah',
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