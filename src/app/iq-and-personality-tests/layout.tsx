import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free IQ and Personality Tests | MBTI, Big Five, DISC, CAPA, and More',
  description:
    'Take free IQ and personality tests on Triviaah, including MBTI, Big Five, DISC, Enneagram, CAPA, MatrixIQ, Love Languages, and Holland Code assessments.',
  alternates: {
    canonical: 'https://triviaah.com/iq-and-personality-tests',
  },
  openGraph: {
    title: 'Free IQ and Personality Tests | MBTI, Big Five, DISC, CAPA, and More',
    description:
      'Take free IQ and personality tests on Triviaah, including MBTI, Big Five, DISC, Enneagram, CAPA, MatrixIQ, Love Languages, and Holland Code assessments.',
    url: 'https://triviaah.com/iq-and-personality-tests',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/Triviaah-og.webp',
        width: 1200,
        height: 630,
        alt: 'Triviaah IQ and Personality Tests',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free IQ and Personality Tests | MBTI, Big Five, DISC, CAPA, and More',
    description:
      'Take free IQ and personality tests on Triviaah, including MBTI, Big Five, DISC, Enneagram, CAPA, MatrixIQ, Love Languages, and Holland Code assessments.',
    images: ['/imgs/Triviaah-og.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function IQAndPersonalityTestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
