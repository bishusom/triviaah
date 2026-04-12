import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trivia Challenges | Upcoming Daily, Weekly, and Monthly Events',
  description:
    'See what is coming next on Triviaah, including daily challenges, weekly quests, monthly tournaments, and achievement-based competition features.',
  alternates: {
    canonical: 'https://triviaah.com/challenges',
  },
  openGraph: {
    title: 'Trivia Challenges | Upcoming Daily, Weekly, and Monthly Events',
    description:
      'See what is coming next on Triviaah, including daily challenges, weekly quests, monthly tournaments, and achievement-based competition features.',
    url: 'https://triviaah.com/challenges',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/Triviaah-og.webp',
        width: 1200,
        height: 630,
        alt: 'Triviaah Challenges',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trivia Challenges | Upcoming Daily, Weekly, and Monthly Events',
    description:
      'See what is coming next on Triviaah, including daily challenges, weekly quests, monthly tournaments, and achievement-based competition features.',
    images: ['/imgs/Triviaah-og.webp'],
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
