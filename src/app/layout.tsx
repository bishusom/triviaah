// app/layout.tsx
import { Geist } from 'next/font/google';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Breadcrumbs, SeoBreadcrumbs } from '@/components/Breadcrumbs';
import { SoundProvider } from './context/SoundContext';
import { UserProvider } from '@/context/UserContext';
import WelcomeBanner from '@/components/WelcomeBanner';
import SessionProviderClient from '@/components/SessionProviderClient';
import { Metadata } from 'next';
import '@styles/globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

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
        <link
          rel="preload"
          href={geist.variable ? undefined : geist.style.fontFamily}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
      </head>

      <body className={`${geist.variable} font-[Geist,Geist-fallback]`}>
        <SessionProviderClient> {/* 🔐 Google-OAuth provider */}
          <UserProvider>   {/* 💡 local user context */}
            <WelcomeBanner />
            <SoundProvider>
              <Breadcrumbs />
              {children}
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