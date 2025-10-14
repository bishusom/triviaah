import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MuteButton from '@/components/common/MuteButton';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://triviaah.com'),
  title: 'Trivia Quizzes | Triviaah',
  description: 'Challenge yourself with our collection of trivia quizzes',
  robots: 'index, follow',
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} bg-gray-50 min-h-screen`}>
      <div className="no-ads-page">
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        <main className="pb-20">
          {children}
        </main>
        
      </div>
    </div>
  );
}