// app/citadle/metadata.ts
import { Metadata } from 'next';

export function generateCitadleMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/brainwave/citadle';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Citadle - Daily City Guessing Game with Landmarks & Skylines | Triviaah',
    description: 'Guess the world city in 6 tries! Daily geography puzzle game with landmarks, city skylines, and urban hints. Free, educational, and fun!',
    keywords: [
      'Citadle',
      'city guessing game',
      'geography puzzle',
      'daily geography game',
      'world cities quiz',
      'landmark guessing game',
      'city identification',
      'skyline recognition game',
      'educational geography games',
      'free trivia',
      'online geography games',
      'daily puzzle',
      'world landmarks',
      'city skylines',
      'geography trivia',
      'landmark quiz',
      'skyline quiz',
      'urban geography',
      'world cities',
      'capital cities game'
    ],
   
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Citadle - Daily City Guessing Game | Triviaah',
      description: 'Guess the world city in 6 tries! Daily geography puzzle game with landmarks, skylines, and urban hints.',
      url: 'https://triviaah.com/brainwave/citadle',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/brainwave/citadle.webp',
          width: 1200,
          height: 630,
          alt: 'Citadle - Daily City Guessing Game with Landmarks'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Citadle - Daily City Guessing Game | Triviaah',
      description: 'Guess the world city in 6 tries! Daily geography puzzle with landmarks, skylines, and hints.',
      images: ['/imgs/brainwave/citadle.webp'],
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