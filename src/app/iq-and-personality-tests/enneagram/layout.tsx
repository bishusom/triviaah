import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Enneagram Personality Test | Discover Your Type | Triviaah',
  description:
    'Take a free Enneagram personality test on Triviaah to explore your core type, wing influences, and personal growth patterns with clear result breakdowns.',
  alternates: {
    canonical: 'https://triviaah.com/iq-and-personality-tests/enneagram',
  },
  openGraph: {
    title: 'Free Enneagram Personality Test | Discover Your Type | Triviaah',
    description:
      'Take a free Enneagram personality test on Triviaah to explore your core type, wing influences, and personal growth patterns with clear result breakdowns.',
    url: 'https://triviaah.com/iq-and-personality-tests/enneagram',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/iq-personality-tests/enneagram.webp',
        width: 1200,
        height: 630,
        alt: 'Enneagram Test on Triviaah',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Enneagram Personality Test | Discover Your Type | Triviaah',
    description:
      'Take a free Enneagram personality test on Triviaah to explore your core type, wing influences, and personal growth patterns with clear result breakdowns.',
    images: ['/imgs/iq-personality-tests/enneagram.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EnneagramLayout({ children }: { children: React.ReactNode }) {
  return children;
}
