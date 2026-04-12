import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Triviaah | Support, Feedback, and Questions',
  description:
    'Contact Triviaah for support, feedback, partnership inquiries, or questions about our trivia games, quizzes, and puzzle experiences.',
  alternates: {
    canonical: 'https://triviaah.com/contact',
  },
  openGraph: {
    title: 'Contact Triviaah | Support, Feedback, and Questions',
    description:
      'Contact Triviaah for support, feedback, partnership inquiries, or questions about our trivia games, quizzes, and puzzle experiences.',
    url: 'https://triviaah.com/contact',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/Triviaah-og.webp',
        width: 1200,
        height: 630,
        alt: 'Contact Triviaah',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Triviaah | Support, Feedback, and Questions',
    description:
      'Contact Triviaah for support, feedback, partnership inquiries, or questions about our trivia games, quizzes, and puzzle experiences.',
    images: ['/imgs/Triviaah-og.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
