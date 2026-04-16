import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trivia Leaderboard | Compare Scores and Track Progress',
  description:
    'View the Triviaah leaderboard to compare scores, track trivia performance, and see how you rank across weekly, monthly, and all-time results.',
  alternates: {
    canonical: 'https://triviaah.com/leaderboard',
  },
  openGraph: {
    title: 'Trivia Leaderboard | Compare Scores and Track Progress',
    description:
      'View the Triviaah leaderboard to compare scores, track trivia performance, and see how you rank across weekly, monthly, and all-time results.',
    url: 'https://triviaah.com/leaderboard',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/triviaah-og.webp',
        width: 1200,
        height: 630,
        alt: 'Triviaah Leaderboard',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trivia Leaderboard | Compare Scores and Track Progress',
    description:
      'View the Triviaah leaderboard to compare scores, track trivia performance, and see how you rank across weekly, monthly, and all-time results.',
    images: ['/imgs/triviaah-og.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
