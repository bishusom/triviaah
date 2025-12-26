// src/app/creaturdle/metadata.ts
import { Metadata } from 'next';

export function generateCreaturdleMetadata(): Metadata {
  const canonicalUrl = 'https://elitetrivias.com/creaturdle';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Creaturdle - Daily Animal Guessing Game | Elite Trivias',
    description: 'Guess the animal from its 6 attributes: class, habitat, diet, size, activity, and body covering. Educational Wordle-style animal puzzle for nature lovers.',
    keywords: [
      'creaturdle',
      'animal puzzle',
      'daily animal game',
      'animal guessing game',
      'wordle animal',
      'wildlife game',
      'biology game',
      'nature puzzle',
      'animal classification',
      'educational games',
      'free animal trivia',
      'online animal games',
      'daily puzzle',
      'wildlife education',
      'science game'
    ],
    
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Creaturdle - Daily Animal Guessing Game | Elite Trivias',
      description: 'Guess the animal from its 6 attributes: class, habitat, diet, size, activity, and body covering. Educational Wordle-style animal puzzle.',
      url: 'https://elitetrivias.com/creaturdle',
      siteName: 'Elite Trivias',
      images: [
        {
          url: '/imgs//brainwave/creaturdle-og.webp',
          width: 1200,
          height: 630,
          alt: 'Creaturdle - Daily Animal Guessing Game'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Creaturdle - Daily Animal Guessing Game | Elite Trivias',
      description: 'Guess the animal from its 6 attributes: class, habitat, diet, size, activity, and body covering. Educational Wordle-style animal puzzle.',
      images: ['/imgs//brainwave/creaturdle-og.webp'],
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