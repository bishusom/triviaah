// app/layout.tsx
import { Geist } from 'next/font/google';
import { Metadata } from 'next';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Breadcrumbs, SeoBreadcrumbs } from '@/components/Breadcrumbs';
import { SoundProvider } from '@/context/SoundContext';
import { UserProvider } from '@/context/UserContext';
import WelcomeBanner from '@/components/WelcomeBanner';
import SessionProviderClient from '@/components/SessionProviderClient';
import '@styles/globals.css';

const geist = Geist({ 
  subsets: ['latin'], 
  variable: '--font-geist',
  display: 'swap',
  preload: true
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
    images: [{
      url: '/imgs/triviaah-og.webp',
      width: 1200,
      height: 630,
      alt: 'Triviaah - Free Daily Trivia & Quiz Games'
    }],
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
    <html lang="en" className={geist.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical CSS for immediate render */
              * { box-sizing: border-box; }
              html { scroll-behavior: smooth; }
              body { 
                margin: 0; 
                font-family: var(--font-geist), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                line-height: 1.6;
                color: #1f2937;
                background-color: #ffffff;
              }
              
              .logo-container { 
                min-height: 64px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
                contain: layout style paint;
              }
              
              .card-grid {
                display: grid;
                gap: 1.5rem;
                padding: 1rem;
              }
              
              @media (min-width: 768px) {
                .card-grid { 
                  grid-template-columns: repeat(2, 1fr);
                  padding: 2rem;
                }
              }
              
              @media (min-width: 1024px) {
                .card-grid { 
                  grid-template-columns: repeat(3, 1fr);
                  max-width: 1200px;
                  margin: 0 auto;
                }
              }
              
              .mobile-scroll {
                display: flex;
                overflow-x: auto;
                gap: 1rem;
                padding: 1rem;
                scrollbar-width: none;
                -ms-overflow-style: none;
              }
              
              .mobile-scroll::-webkit-scrollbar { display: none; }
              
              @media (min-width: 768px) {
                .mobile-scroll { display: none; }
                .desktop-grid { display: grid; }
              }
              
              @media (max-width: 767px) {
                .desktop-grid { display: none; }
              }
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <SessionProviderClient>
          <UserProvider>
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