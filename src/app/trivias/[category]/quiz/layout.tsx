// app/trivias/[category]/quiz/layout.tsx
'use client';

import MuteButton from '@/components/MuteButton';

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <div className="no-ads-page">
      {/* Fixed mute button at top-right */}
      <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
        <MuteButton />
      </div>
      {children}
    </div>
    </>
  );
}