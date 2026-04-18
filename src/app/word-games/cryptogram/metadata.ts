// src/app/word-games/cryptogram/metadata.ts
import { Metadata } from 'next';

export function generateCryptogramMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/word-games/cryptogram';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Word Cryptogram Game | Uncryptogram Letters & Build Vocabulary | Triviaah',
    description: 'Challenge your mind with our Word Cryptogram game! Uncryptogram letters to form words, build vocabulary, and improve spelling skills with daily puzzle challenges.',
    keywords: [
      'word cryptogram',
      'anagram game',
      'vocabulary game',
      'word puzzle',
      'letter cryptogram',
      'word uncryptogram',
      'vocabulary builder',
      'spelling game',
      'educational word games',
      'brain teaser',
      'word challenge',
      'language game',
      'cognitive skills',
      'word formation',
      'letter rearrangement',
      'mental exercise',
      'word recognition',
      'educational entertainment',
      'daily word puzzle',
      'free word games'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Word Cryptogram Game | Uncryptogram Letters & Build Vocabulary | Triviaah',
      description: 'Challenge your mind with our Word Cryptogram game! Uncryptogram letters to form words, build vocabulary, and improve spelling skills with daily puzzle challenges.',
      url: 'https://triviaah.com/word-games/cryptogram',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/word-games/word-cryptogram.webp',
          width: 1200,
          height: 630,
          alt: 'Word Cryptogram Game - Uncryptogram Letters to Form Words'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Word Cryptogram Game | Uncryptogram Letters & Build Vocabulary | Triviaah',
      description: 'Challenge your mind with our Word Cryptogram game! Uncryptogram letters to form words, build vocabulary, and improve spelling skills with daily puzzle challenges.',
      images: ['/imgs/word-games/word-cryptogram.webp'],
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