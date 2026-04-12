import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free DISC Personality Assessment | Behavior and Communication Test | Triviaah',
  description:
    'Take a free DISC assessment on Triviaah to understand Dominance, Influence, Steadiness, and Conscientiousness, with communication and work-style insights.',
  alternates: {
    canonical: 'https://triviaah.com/iq-and-personality-tests/disc',
  },
  openGraph: {
    title: 'Free DISC Personality Assessment | Behavior and Communication Test | Triviaah',
    description:
      'Take a free DISC assessment on Triviaah to understand Dominance, Influence, Steadiness, and Conscientiousness, with communication and work-style insights.',
    url: 'https://triviaah.com/iq-and-personality-tests/disc',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/iq-personality-tests/disc.webp',
        width: 1200,
        height: 630,
        alt: 'DISC Assessment on Triviaah',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free DISC Personality Assessment | Behavior and Communication Test | Triviaah',
    description:
      'Take a free DISC assessment on Triviaah to understand Dominance, Influence, Steadiness, and Conscientiousness, with communication and work-style insights.',
    images: ['/imgs/iq-personality-tests/disc.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DiscLayout({ children }: { children: React.ReactNode }) {
  return children;
}
