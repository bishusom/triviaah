import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MuteButton from '@/components/MuteButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Daily Quiz | Triviaah',
  description: 'Test your knowledge with our daily quizzes on various topics',
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