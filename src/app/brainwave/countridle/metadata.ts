// app/countridle/metadata.ts
import { Metadata } from 'next';

export function generateCountridleMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/brainwave/countridle';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Countridle - Daily Country Guessing Game with Flags & Maps | Triviaah',
    description: 'Guess the world country in 6 tries! Daily geography puzzle game with flags, country outlines, and geographical hints. Free, educational, and fun!',
    keywords: [
      'countridle',
      'country guessing game',
      'geography puzzle',
      'daily geography game',
      'world countries quiz',
      'flag guessing game',
      'country identification',
      'map recognition game',
      'educational geography games',
      'free trivia',
      'online geography games',
      'daily puzzle',
      'world flags',
      'country outlines',
      'geography trivia',
      'flag quiz',
      'map quiz',
      'world geography'
    ],
   
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Countridle - Daily Country Guessing Game | Triviaah',
      description: 'Guess the world country in 6 tries! Daily geography puzzle game with flags, maps, and geographical hints.',
      url: 'https://triviaah.com/brainwave/countridle',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/brainwave/countridle.webp',
          width: 1200,
          height: 630,
          alt: 'countridle - Daily Country Guessing Game with Flags'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'countridle - Daily Country Guessing Game | Triviaah',
      description: 'Guess the world country in 6 tries! Daily geography puzzle with flags, maps, and hints.',
      images: ['/imgs/brainwave/countridle.webp'],
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