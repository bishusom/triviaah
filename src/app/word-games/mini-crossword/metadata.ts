// src/app/word-games/word-minicrossword/metadata.ts
import { Metadata } from 'next';

export function generateMiniCrossWordMetadata(): Metadata {
  const canonicalUrl = 'https://elitetrivias.com/word-games/word-minicrossword';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Mini Crossword Game | Letter Grid Puzzle & Vocabulary Challenge | Elite Trivias',
    description: 'Master our Word minicrossword puzzle! Connect letters in the grid to form words, solve crossword-style challenges, and enhance your vocabulary with this unique word game.',
    keywords: [
      'word minicrossword',
      'letter grid puzzle',
      'grid word game',
      'crossword puzzle',
      'word search grid',
      'vocabulary puzzle',
      'grid letter game',
      'word formation game',
      'brain teaser puzzle',
      'cognitive training game',
      'letter connection game',
      'word matrix game',
      'educational grid game',
      'puzzle challenge',
      'word building game',
      'mental exercise game',
      'pattern recognition game',
      'daily word puzzle',
      'free grid game',
      'interactive word game'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Mini Crossword Game | Letter Grid Puzzle & Vocabulary Challenge | Elite Trivias',
      description: 'Master our Word minicrossword puzzle! Connect letters in the grid to form words, solve crossword-style challenges, and enhance your vocabulary with this unique word game.',
      url: 'https://elitetrivias.com/word-games/mini-crossword',
      siteName: 'Elite Trivias',
      images: [
        {
          url: '/imgs/word-games/minicrossword.webp',
          width: 1200,
          height: 630,
          alt: 'Mini Crossword Game | Letter Grid Puzzle & Vocabulary Challenge | Elite Trivias'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
       title: 'Mini Crossword Game | Letter Grid Puzzle & Vocabulary Challenge | Elite Trivias',
      description: 'Master our Word minicrossword puzzle! Connect letters in the grid to form words, solve crossword-style challenges, and enhance your vocabulary with this unique word game.',
      images: ['/imgs/word-games/minicrossword.webp'],
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