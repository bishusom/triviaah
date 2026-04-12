import { Metadata } from 'next';

export function generateCrossgridMetadata(): Metadata {
  const canonicalUrl = 'https://triviaah.com/word-games/crossgrid';
  const lastUpdated = new Date().toISOString();

  return {
    title: 'Crossgrid | Free Mini Crossword Word Square Game | Triviaah',
    description:
      'Play Crossgrid, a free clue-based word puzzle on Triviaah. Solve a compact mini crossword where every row and column must form a valid word.',
    keywords: [
      'crossgrid',
      'mini crossword',
      'word square',
      'crossword puzzle',
      'free crossword game',
      'daily word puzzle',
      'clue based word game',
      'vocabulary game',
      'letter puzzle',
      'word logic game',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Crossgrid | Free Mini Crossword Word Square Game | Triviaah',
      description:
        'Play Crossgrid, a free clue-based word puzzle on Triviaah. Solve a compact mini crossword where every row and column must form a valid word.',
      url: canonicalUrl,
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/word-games/word-crossgrid.webp',
          width: 1200,
          height: 630,
          alt: 'Crossgrid word game on Triviaah',
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Crossgrid | Free Mini Crossword Word Square Game | Triviaah',
      description:
        'Play Crossgrid, a free clue-based word puzzle on Triviaah. Solve a compact mini crossword where every row and column must form a valid word.',
      images: ['/imgs/word-games/word-crossgrid.webp'],
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
