// app/layout.tsx (simplified)
import { Geist } from 'next/font/google';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Breadcrumbs, SeoBreadcrumbs } from '@/components/Breadcrumbs';
import { SoundProvider } from '@/context/SoundContext';
import { UserProvider } from '@/context/UserContext';
import WelcomeBanner from '@/components/WelcomeBanner';
import SessionProviderClient from '@/components/SessionProviderClient';
import { Metadata } from 'next';
import '@styles/globals.css';

const geist = Geist({ 
  subsets: ['latin'], 
  variable: '--font-geist',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://triviaah.com'),
  title: 'Triviaah: Free Daily Trivia & Quiz Games',
  description: 'Play free daily trivia challenges across 20+ categories. New questions every 24 hours!',
  openGraph: {
    title: 'Triviaah: Free Daily Trivia & Quiz Games',
    description: 'Play free daily trivia challenges across 20+ categories. New questions every 24 hours!',
    url: 'https://triviaah.com',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/triviaah-og.webp',
        width: 1200,
        height: 630,
        alt: 'Triviaah - Free Daily Trivia & Quiz Games'
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Triviaah: Free Daily Trivia & Quiz Games',
    description: 'Play free daily trivia challenges across 20+ categories. New questions every 24 hours!',
    images: ['/imgs/triviaah-og.webp'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body className={`${geist.variable} font-[Geist,Geist-fallback] overflow-x-hidden`}>
        <SessionProviderClient>
          <UserProvider>
            <WelcomeBanner />
            <SoundProvider>
              <Breadcrumbs />
              <div className="w-full overflow-x-hidden">
                {children}
              </div>
              <SeoBreadcrumbs />
              <GoogleAnalytics gaId="G-K4KZ7XR85V" />
              <Script
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
                strategy="lazyOnload"
                crossOrigin="anonymous"
              />
            </SoundProvider>
          </UserProvider>
        </SessionProviderClient>
      </body>
    </html>
  );
}