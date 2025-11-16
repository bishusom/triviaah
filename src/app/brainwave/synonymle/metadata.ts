// src/app/brainwave/synonymle/metadata.ts
import { Metadata } from 'next';

export function generateSynonymleMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/brainwave/synonymle';

  return {
    title: 'Synonymle - Daily Word Guessing Puzzle | Triviaah',
    description: 'Guess the word based on semantic similarity and synonyms. Wordle-style vocabulary puzzle game that tests your understanding of word meanings.',
    keywords: 'synonymle, word puzzle, daily word, wordle vocabulary, synonym game, semantic game, word guessing, vocabulary builder, english words, free word games, online word puzzles, daily puzzle, brain game',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Synonymle - Daily Word Guessing Puzzle | Triviaah',
      description: 'Guess the word based on semantic similarity and synonyms. Wordle-style vocabulary puzzle game that tests your understanding of word meanings.',
      url: 'https://triviaah.com/brainwave/synonymle',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/synonymle-og.webp',
          width: 1200,
          height: 630,
          alt: 'Synonymle - Daily Word Guessing Puzzle Game'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Synonymle - Daily Word Guessing Puzzle | Triviaah',
      description: 'Guess the word based on semantic similarity and synonyms. Wordle-style vocabulary puzzle game that tests your understanding of word meanings.',
      images: ['/imgs/synonymle-og.webp'],
    },
    // Add robots for better indexing
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}