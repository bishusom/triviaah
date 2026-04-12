import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Love Languages Test | Relationship Communication Assessment | Triviaah',
  description:
    'Take a free Love Languages assessment on Triviaah to learn how you prefer to give and receive affection across the five primary relationship languages.',
  alternates: {
    canonical: 'https://triviaah.com/iq-and-personality-tests/love-languages',
  },
  openGraph: {
    title: 'Free Love Languages Test | Relationship Communication Assessment | Triviaah',
    description:
      'Take a free Love Languages assessment on Triviaah to learn how you prefer to give and receive affection across the five primary relationship languages.',
    url: 'https://triviaah.com/iq-and-personality-tests/love-languages',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/iq-personality-tests/love-languages.webp',
        width: 1200,
        height: 630,
        alt: 'Love Languages Assessment on Triviaah',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Love Languages Test | Relationship Communication Assessment | Triviaah',
    description:
      'Take a free Love Languages assessment on Triviaah to learn how you prefer to give and receive affection across the five primary relationship languages.',
    images: ['/imgs/iq-personality-tests/love-languages.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoveLanguagesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
