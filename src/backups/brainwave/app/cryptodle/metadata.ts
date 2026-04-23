// src/app/brainwave/cryptodle/metadata.ts
import { Metadata } from 'next';

export function generateCryptodleMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/brainwave/cryptodle';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Cryptodle Game | Decode Quotes & Train Your Brain | Triviaah',
    description: 'Challenge your mind with our Cryptodle game. Decode encrypted quotes, sharpen your logic, and improve pattern recognition with daily brainy puzzles.',
    keywords: [
      'cryptodle',
      'cryptoquote',
      'substitution cipher',
      'quote puzzle',
      'logic puzzle',
      'brain teaser',
      'pattern recognition',
      'deduction game',
      'analytical word game',
      'word puzzle',
      'language game',
      'cognitive skills',
      'letter substitution',
      'mental exercise',
      'word recognition',
      'educational entertainment',
      'daily quote puzzle',
      'free word games'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Cryptodle Game | Decode Quotes & Train Your Brain | Triviaah',
      description: 'Challenge your mind with our Cryptodle game. Decode encrypted quotes, sharpen your logic, and improve pattern recognition with daily brainy puzzles.',
      url: 'https://triviaah.com/brainwave/cryptodle',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/word-games/cryptogram.svg',
          width: 1200,
          height: 630,
          alt: 'Cryptodle Game - Decode Encrypted Quotes'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Cryptodle Game | Decode Quotes & Train Your Brain | Triviaah',
      description: 'Challenge your mind with our Cryptodle game. Decode encrypted quotes, sharpen your logic, and improve pattern recognition with daily brainy puzzles.',
      images: ['/imgs/word-games/cryptogram.svg'],
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
