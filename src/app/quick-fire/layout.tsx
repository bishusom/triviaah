import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MuteButton from '@/components/common/MuteButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quick Fire Quiz | Test Your Knowledge | Elite Trivias',
  description: 'Challenge yourself with our daily quick fire trivia quiz! Test your knowledge across various topics including history, science, pop culture, and more. Fun, fast, and free trivia questions updated daily.',
  keywords: 'trivia quiz, quick fire quiz, daily trivia, knowledge test, fun quiz, brain teaser, trivia questions, quiz game, mental exercise',
  
  openGraph: {
    title: 'Quick Fire Quiz | Test Your Knowledge | Elite Trivias',
    description: 'Daily quick fire trivia quiz to challenge your knowledge across various topics. Fun, fast, and free!',
    type: 'website',
    url: 'https://elitetrivias.com/quick-fire',
    siteName: 'Elite Trivias',
    images: [
      {
        url: '/imgs/quick-fire-og.webp', // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: 'Elite Trivias Quick Fire Quiz Challenge',
      },
    ],
    locale: 'en_US',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Quick Fire Quiz | Elite Trivias',
    description: 'Test your knowledge with our daily quick fire trivia quiz!',
    images: ['/twitter-quiz-image.jpg'], // Replace with your actual Twitter image
    site: '@Elite Trivias', // Replace with your actual Twitter handle
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
    canonical: 'https://elitetrivias.com/quick-fire',
  },
  
  authors: [
    {
      name: 'Elite Trivias Team',
      url: 'https://elitetrivias.com.com',
    },
  ],
  
  creator: 'Elite Trivias',
  publisher: 'Elite Trivias',
  
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