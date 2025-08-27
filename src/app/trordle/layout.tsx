import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MuteButton from '@/components/MuteButton';
//import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Trordle - Daily Trivia Puzzle | Triviaah',
  description: 'Guess the answer to today\'s trivia puzzle with limited attempts, similar to Wordle but with trivia questions.',
  openGraph: {
    title: 'Trordle - Daily Trivia Puzzle | Triviaah',
    description: 'Guess the answer to today\'s trivia puzzle with limited attempts, similar to Wordle but with trivia questions.',
    url: 'https://triviaah.com/trordle',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/trordle-og.webp', // or '/imgs/trordle-og.jpg'
        width: 1200,
        height: 630,
        alt: 'Trordle - Daily Trivia Puzzle Game'
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trordle - Daily Trivia Puzzle | Triviaah',
    description: 'Guess the answer to today\'s trivia puzzle with limited attempts, similar to Wordle but with trivia questions.',
    images: ['/imgs/trordle-og.webp'], // or '/imgs/trordle-og.jpg'
  },
};

export default function TrordleLayout({
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
      { /* <GoogleAnalytics gaId="G-K4KZ7XR85V" /> */ }
    </div>
  );
}