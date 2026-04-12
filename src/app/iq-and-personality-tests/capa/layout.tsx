import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CAPA Cognitive Assessment | Free Cognitive Strengths Test | Triviaah',
  description:
    'Take the free Cognitive Abilities Profile Assessment on Triviaah to explore verbal, numerical, spatial, memory, reasoning, and processing-speed strengths.',
  alternates: {
    canonical: 'https://triviaah.com/iq-and-personality-tests/capa',
  },
  openGraph: {
    title: 'CAPA Cognitive Assessment | Free Cognitive Strengths Test | Triviaah',
    description:
      'Take the free Cognitive Abilities Profile Assessment on Triviaah to explore verbal, numerical, spatial, memory, reasoning, and processing-speed strengths.',
    url: 'https://triviaah.com/iq-and-personality-tests/capa',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/iq-personality-tests/capa-rect.webp',
        width: 1200,
        height: 630,
        alt: 'CAPA Cognitive Assessment on Triviaah',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CAPA Cognitive Assessment | Free Cognitive Strengths Test | Triviaah',
    description:
      'Take the free Cognitive Abilities Profile Assessment on Triviaah to explore verbal, numerical, spatial, memory, reasoning, and processing-speed strengths.',
    images: ['/imgs/iq-personality-tests/capa-rect.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CapaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
