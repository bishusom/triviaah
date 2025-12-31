// src/app/automobile/metadata.ts
import { Metadata } from 'next';

export function generateAutomobileMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/brainwave/automoble';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Automobile - Daily Vehicle Guessing Game | Triviaah',
    description: 'Guess the vehicle from progressive clues in 6 tries! Wordle-style letter feedback. Unlock more hints with each wrong guess. Free daily automotive puzzle.',
    keywords: [
      'automobile game',
      'vehicle puzzle',
      'daily car game',
      'car guessing game',
      'wordle vehicle',
      'automotive puzzle',
      'car trivia',
      'automobile quiz',
      'daily brain teaser',
      'free car game',
      'online puzzle games',
      'car brands game',
      'vehicle identification',
      'automotive knowledge game',
      'car model guessing',
      'automobile trivia'
    ],
    
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Automobile - Daily Vehicle Guessing Game | Triviaah',
      description: 'Guess the vehicle from progressive clues in 6 tries! Wordle-style letter feedback. Unlock more hints with each wrong guess.',
      url: 'https://triviaah.com/brainwave/automoble',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs//brainwave/automoble-og.webp',
          width: 1200,
          height: 630,
          alt: 'Automobile - Daily Vehicle Guessing Game'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Automobile - Daily Vehicle Guessing Game | Triviaah',
      description: 'Guess the vehicle from progressive clues in 6 tries! Wordle-style letter feedback. Unlock more hints with each wrong guess.',
      images: ['/imgs//brainwave/automoble.webp'],
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