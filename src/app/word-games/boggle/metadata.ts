// src/app/word-games/boggle/metadata.ts
import { Metadata } from 'next';

export function generateBoggleMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/word-games/boggle';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Free Boggle Game Online | Word Search Challenge | Triviaah',
    description: 'Play free Boggle game online. Find words in a 4x4 or 5x5 letter grid with our daily puzzle challenge. Boost your vocabulary, word-finding skills, and uncover all possible words.',
    keywords: [
      'boggle',
      'word search game',
      'vocabulary game',
      'word game',
      'boggle challenge',
      'daily puzzle',
      'word finder',
      'educational games',
      'free boggle',
      'online word games',
      'word puzzle',
      'letter grid game',
      'vocabulary builder',
      'word recognition',
      'cognitive games',
      'brain teaser',
      'word formation',
      'language game',
      'educational entertainment',
      'word discovery'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Free Boggle Game Online | Word Search Challenge | Triviaah',
      description: 'Play free Boggle game online. Find words in a 4x4 or 5x5 letter grid with our daily puzzle challenge. Boost your vocabulary, word-finding skills, and uncover all possible words.',
      url: 'https://triviaah.com/word-games/boggle',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/boggle.webp',
          width: 1200,
          height: 630,
          alt: 'Free Boggle Game Online'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Free Boggle Game Online | Word Search Challenge | Triviaah',
      description: 'Play free Boggle game online. Find words in a 4x4 or 5x5 letter grid with our daily puzzle challenge. Boost your vocabulary, word-finding skills, and uncover all possible words.',
      images: ['/imgs/boggle.webp'],
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