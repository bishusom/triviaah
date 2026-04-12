import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Holland Code Career Test | RIASEC Assessment | Triviaah',
  description:
    'Take a free Holland Code career assessment on Triviaah to discover your RIASEC profile and explore career-interest patterns across six work-style dimensions.',
  alternates: {
    canonical: 'https://triviaah.com/iq-and-personality-tests/holland-code',
  },
  openGraph: {
    title: 'Free Holland Code Career Test | RIASEC Assessment | Triviaah',
    description:
      'Take a free Holland Code career assessment on Triviaah to discover your RIASEC profile and explore career-interest patterns across six work-style dimensions.',
    url: 'https://triviaah.com/iq-and-personality-tests/holland-code',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/iq-personality-tests/holland-code.webp',
        width: 1200,
        height: 630,
        alt: 'Holland Code Career Test on Triviaah',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Holland Code Career Test | RIASEC Assessment | Triviaah',
    description:
      'Take a free Holland Code career assessment on Triviaah to discover your RIASEC profile and explore career-interest patterns across six work-style dimensions.',
    images: ['/imgs/iq-personality-tests/holland-code.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HollandCodeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
