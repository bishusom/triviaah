import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Big Five Personality Test | OCEAN Trait Assessment | Triviaah',
  description:
    'Take a free Big Five personality test on Triviaah and measure Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism with detailed trait insights.',
  alternates: {
    canonical: 'https://triviaah.com/iq-and-personality-tests/big-five',
  },
  openGraph: {
    title: 'Free Big Five Personality Test | OCEAN Trait Assessment | Triviaah',
    description:
      'Take a free Big Five personality test on Triviaah and measure Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism with detailed trait insights.',
    url: 'https://triviaah.com/iq-and-personality-tests/big-five',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/iq-personality-tests/big-five.webp',
        width: 1200,
        height: 630,
        alt: 'Big Five Personality Test on Triviaah',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Big Five Personality Test | OCEAN Trait Assessment | Triviaah',
    description:
      'Take a free Big Five personality test on Triviaah and measure Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism with detailed trait insights.',
    images: ['/imgs/iq-personality-tests/big-five.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BigFiveLayout({ children }: { children: React.ReactNode }) {
  return children;
}
