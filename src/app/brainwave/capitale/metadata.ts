// app/capitale/metadata.ts
import { Metadata } from 'next';

export function generateCapitaleMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/brainwave/capitale';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Capitale - Daily Capital City Guessing Game | Triviaah',
    description: 'Guess the world capital city in 6 tries! Daily geography puzzle game similar to Wordle but with capital cities. Free, educational, and fun!',
    keywords: [
      'Capitale',
      'capital city game',
      'geography puzzle',
      'daily geography game',
      'world capitals quiz',
      'Wordle geography',
      'capital guessing game',
      'educational games',
      'free trivia',
      'online geography games',
      'daily puzzle',
      'world capitals',
      'geography trivia'
    ],
   
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Capitale - Daily Capital City Guessing Game | Triviaah',
      description: 'Guess the world capital city in 6 tries! Daily geography puzzle game similar to Wordle but with capital cities.',
      url: 'https://triviaah.com/brainwave/capitale',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/capitale-og.webp',
          width: 1200,
          height: 630,
          alt: 'Capitale - Daily Capital City Guessing Game'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Capitale - Daily Capital City Guessing Game | Triviaah',
      description: 'Guess the world capital city in 6 tries! Daily geography puzzle game similar to Wordle.',
      images: ['/imgs/capitale-og.webp'],
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