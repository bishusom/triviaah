// src/app/trivias/[category]/quiz/layout.tsx
//
// ✅ FIX: No metadata export here. Layout-level metadata in Next.js App Router
// merges with page-level metadata — any field set here becomes the fallback if
// generateMetadata() in page.tsx fails or doesn't set that field. A generic
// title like "Trivia Quizzes | Triviaah" set here would be indexed by Google
// on any quiz page where metadata generation throws (e.g. Supabase timeout).
//
// All metadata belongs in page.tsx's generateMetadata() where it has access
// to the actual category/subcategory and can produce specific, indexable titles.

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