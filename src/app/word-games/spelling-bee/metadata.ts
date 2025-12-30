// src/app/word-games/spelling-bee/metadata.ts
import { Metadata } from 'next';

export function generateSpellingBeeMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/word-games/spelling-bee';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Free Spelling Bee Game Online | Vocabulary Challenge | Triviaah',
    description: 'Play free Spelling Bee game online. Create words from 7 letters with our daily puzzle challenge. Improve your vocabulary, spelling skills, and find all possible words.',
    keywords: [
      'spelling bee',
      'spelling game',
      'vocabulary game',
      'word game',
      'spelling challenge',
      'daily puzzle',
      'word finder',
      'educational games',
      'free spelling bee',
      'online word games',
      'vocabulary builder',
      'spelling practice',
      'word puzzle',
      'language game',
      'cognitive skills',
      'word formation',
      'educational entertainment',
      'daily word challenge',
      'mental exercise',
      'word recognition'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Free Spelling Bee Game Online | Vocabulary Challenge | Triviaah',
      description: 'Play free Spelling Bee game online. Create words from 7 letters with our daily puzzle challenge. Improve your vocabulary, spelling skills, and find all possible words.',
      url: 'https://triviaah.com/word-games/spelling-bee',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/word-games/spelling-bee.webp',
          width: 1200,
          height: 630,
          alt: 'Free Spelling Bee Game Online'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Free Spelling Bee Game Online | Vocabulary Challenge | Triviaah',
      description: 'Play free Spelling Bee game online. Create words from 7 letters with our daily puzzle challenge. Improve your vocabulary, spelling skills, and find all possible words.',
      images: ['/imgs/word-games/spelling-bee.webp'],
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