// src/app/word-games/scramble/metadata.ts
import { Metadata } from 'next';

export function generateScrambleMetadata(): Metadata {
  const canonicalUrl = 'https://elitetrivias.com/word-games/scramble';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Word Scramble Game | Unscramble Letters & Build Vocabulary | Elite Trivias',
    description: 'Challenge your mind with our Word Scramble game! Unscramble letters to form words, build vocabulary, and improve spelling skills with daily puzzle challenges.',
    keywords: [
      'word scramble',
      'anagram game',
      'vocabulary game',
      'word puzzle',
      'letter scramble',
      'word unscramble',
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
      title: 'Word Scramble Game | Unscramble Letters & Build Vocabulary | Elite Trivias',
      description: 'Challenge your mind with our Word Scramble game! Unscramble letters to form words, build vocabulary, and improve spelling skills with daily puzzle challenges.',
      url: 'https://elitetrivias.com/word-games/scramble',
      siteName: 'Elite Trivias',
      images: [
        {
          url: '/imgs/scramble-og.webp',
          width: 1200,
          height: 630,
          alt: 'Word Scramble Game - Unscramble Letters to Form Words'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Word Scramble Game | Unscramble Letters & Build Vocabulary | Elite Trivias',
      description: 'Challenge your mind with our Word Scramble game! Unscramble letters to form words, build vocabulary, and improve spelling skills with daily puzzle challenges.',
      images: ['/imgs/scramble-og.webp'],
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