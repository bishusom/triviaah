import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Curated Trivia Challenges | Weekly Quiz Routes | Triviaah',
  description:
    'Play curated weekly Triviaah challenges built around daily trivia, Brainwave puzzles, and focused topical quiz routes.',
  alternates: {
    canonical: 'https://triviaah.com/challenges',
  },
  openGraph: {
    title: 'Curated Trivia Challenges | Weekly Quiz Routes | Triviaah',
    description:
      'Play curated weekly Triviaah challenges built around daily trivia, Brainwave puzzles, and focused topical quiz routes.',
    url: 'https://triviaah.com/challenges',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/daily-trivias/nature.webp',
        width: 1024,
        height: 1024,
        alt: 'Triviaah Challenges',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curated Trivia Challenges | Weekly Quiz Routes | Triviaah',
    description:
      'Play curated weekly Triviaah challenges built around daily trivia, Brainwave puzzles, and focused topical quiz routes.',
    images: ['/imgs/daily-trivias/nature.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ChallengesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
