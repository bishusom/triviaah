import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free MBTI Personality Test | Myers-Briggs Type Indicator | Triviaah',
  description:
    'Take a free MBTI personality test on Triviaah to discover your Myers-Briggs type, explore personality preferences, and review strengths and communication patterns.',
  alternates: {
    canonical: 'https://triviaah.com/iq-and-personality-tests/mbti',
  },
  openGraph: {
    title: 'Free MBTI Personality Test | Myers-Briggs Type Indicator | Triviaah',
    description:
      'Take a free MBTI personality test on Triviaah to discover your Myers-Briggs type, explore personality preferences, and review strengths and communication patterns.',
    url: 'https://triviaah.com/iq-and-personality-tests/mbti',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/iq-personality-tests/mbti.webp',
        width: 1200,
        height: 630,
        alt: 'MBTI Personality Test on Triviaah',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free MBTI Personality Test | Myers-Briggs Type Indicator | Triviaah',
    description:
      'Take a free MBTI personality test on Triviaah to discover your Myers-Briggs type, explore personality preferences, and review strengths and communication patterns.',
    images: ['/imgs/iq-personality-tests/mbti.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MBTILayout({ children }: { children: React.ReactNode }) {
  return children;
}
