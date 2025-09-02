import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MuteButton from '@/components/MuteButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quick Fire Quiz | Test Your Knowledge | Triviaah',
  description: 'Challenge yourself with our daily quick fire trivia quiz! Test your knowledge across various topics including history, science, pop culture, and more. Fun, fast, and free trivia questions updated daily.',
  keywords: 'trivia quiz, quick fire quiz, daily trivia, knowledge test, fun quiz, brain teaser, trivia questions, quiz game, mental exercise',
  
  openGraph: {
    title: 'Quick Fire Quiz | Test Your Knowledge | Triviaah',
    description: 'Daily quick fire trivia quiz to challenge your knowledge across various topics. Fun, fast, and free!',
    type: 'website',
    url: 'https://triviaah.com/quick-fire',
    siteName: 'Triviaah',
    images: [
      {
        url: '/og-quiz-image.jpg', // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: 'Triviaah Quick Fire Quiz Challenge',
      },
    ],
    locale: 'en_US',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Quick Fire Quiz | Triviaah',
    description: 'Test your knowledge with our daily quick fire trivia quiz!',
    images: ['/twitter-quiz-image.jpg'], // Replace with your actual Twitter image
    site: '@triviaah', // Replace with your actual Twitter handle
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  alternates: {
    canonical: 'https://triviaah.com/quick-fire',
  },
  
  authors: [
    {
      name: 'Triviaah Team',
      url: 'https://triviaah.com',
    },
  ],
  
  creator: 'Triviaah',
  publisher: 'Triviaah',
  
  category: 'education',
  
  manifest: '/manifest.json', // If you have a web app manifest
};

export default function DailyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} bg-gray-50`}>
      <div className="no-ads-page">
        <main className="min-h-screen p-4 md:p-8">
          <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
            <MuteButton />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}