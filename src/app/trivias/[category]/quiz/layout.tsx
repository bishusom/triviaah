// src/app/trivias/[category]/quiz/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MuteButton from '@/components/common/MuteButton';

const inter = Inter({ subsets: ['latin'] });

// ✅ Only set metadataBase here — it's the one layout-level metadata value
// that genuinely applies to every page and has no per-page variant.
export const metadata: Metadata = {
  metadataBase: new URL('https://triviaah.com'),
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} min-h-screen`}>
      <div className="no-ads-page">
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}