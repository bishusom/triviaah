import { Metadata } from 'next';

export function generateKakuroMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/number-puzzles/kakuro';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Kakuro | Free Cross Sums Number Puzzle | Triviaah',
    description:
      'Play Kakuro on Triviaah, a free cross sums puzzle where each row and column must match its clue total without repeating digits.',
    keywords: [
      'kakuro',
      'cross sums',
      'kakuro puzzle',
      'number crossword',
      'math puzzle',
      'logic puzzle',
      'daily number puzzle',
      'free kakuro',
      'sum puzzle',
      'brain teaser',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Kakuro | Free Cross Sums Number Puzzle | Triviaah',
      description:
        'Play Kakuro on Triviaah, a free cross sums puzzle where each row and column must match its clue total without repeating digits.',
      url: canonicalUrl,
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/number-puzzles/kakuro.webp',
          width: 1200,
          height: 630,
          alt: 'Kakuro number puzzle on Triviaah',
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Kakuro | Free Cross Sums Number Puzzle | Triviaah',
      description:
        'Play Kakuro on Triviaah, a free cross sums puzzle where each row and column must match its clue total without repeating digits.',
      images: ['/imgs/number-puzzles/kakuro.webp'],
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
        'max-snippet': -1,
      },
    },
    other: {
      updated_time: lastUpdated,
    },
  };
}
