import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MuteButton from '@/components/MuteButton';
//import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Today in History | Triviaah',
  description: 'Discover historical events that happened on this day. Daily history quiz and fascinating facts.',
};

export default function TodayInHistoryLayout({
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
      { /*<GoogleAnalytics gaId="G-K4KZ7XR85V" /> */ }
    </div>
  );
}