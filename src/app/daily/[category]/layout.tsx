// layout.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import MuteButton from '@/components/MuteButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Daily Quiz | Triviaah',
  description: 'Test your knowledge with today\'s quiz',
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
          <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
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
        </main>
      </div>
    </div>
  );
}