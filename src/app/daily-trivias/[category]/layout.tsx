// src/app/daily-trivias/[category]/layout.tsx
//
// ✅ FIX: Removed generateMetadata entirely from the layout.
//
// The original layout had a full generateMetadata() that set title, description,
// openGraph, and twitter — AND the page.tsx also has generateMetadata(). In
// Next.js App Router these merge, but whichever sets a field "last" wins for
// that field. The layout ran first and set:
//
//   openGraph.url: `https://triviaah.com/daily/${category}`  ← WRONG PATH (404)
//
// The correct path is /daily-trivias/${category}. Every daily category page was
// broadcasting a broken OG URL to every social share and Open Graph crawler.
//
// All metadata now lives exclusively in page.tsx's generateMetadata(), which has
// access to the resolved category param and can produce accurate, specific values.
// Only metadataBase belongs at layout level.

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MuteButton from '@/components/common/MuteButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://triviaah.com'),
};

interface Props {
  children: React.ReactNode;
}

export default function DailyLayout({ children }: Props) {
  return (
    <div className={`${inter.className} bg-gradient-to-b from-gray-900 to-gray-800`}>
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