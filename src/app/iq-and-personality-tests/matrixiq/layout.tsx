import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Matrix IQ Test | Pattern Recognition and Fluid Intelligence | Triviaah',
  description:
    'Take a free Matrix IQ test on Triviaah to assess pattern recognition, abstract reasoning, and fluid intelligence with matrix-style visual problems.',
  alternates: {
    canonical: 'https://triviaah.com/iq-and-personality-tests/matrixiq',
  },
  openGraph: {
    title: 'Free Matrix IQ Test | Pattern Recognition and Fluid Intelligence | Triviaah',
    description:
      'Take a free Matrix IQ test on Triviaah to assess pattern recognition, abstract reasoning, and fluid intelligence with matrix-style visual problems.',
    url: 'https://triviaah.com/iq-and-personality-tests/matrixiq',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/iq-personality-tests/matrixiq.webp',
        width: 1200,
        height: 630,
        alt: 'Matrix IQ Test on Triviaah',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Matrix IQ Test | Pattern Recognition and Fluid Intelligence | Triviaah',
    description:
      'Take a free Matrix IQ test on Triviaah to assess pattern recognition, abstract reasoning, and fluid intelligence with matrix-style visual problems.',
    images: ['/imgs/iq-personality-tests/matrixiq.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MatrixIQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
