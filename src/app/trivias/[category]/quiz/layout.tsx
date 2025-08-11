// app/trivias/[category]/quiz/layout.tsx
'use client';
import Script from 'next/script';

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
      <Script
            strategy="lazyOnload"
            src="https://connect.facebook.net/en_US/sdk.js"
            onLoad={() => {
              const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
              if (!appId) {
                console.error('Facebook App ID is not defined');
                return;
              }
              window.FB.init({
                appId: appId,
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v19.0'
              });
            }}
          />
      {children}
    </div>
    </>
  );
}