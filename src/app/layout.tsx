// layout.tsx - Updated with optimized resource loading
import { Geist } from 'next/font/google';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Breadcrumbs, SeoBreadcrumbs } from '@/components/Breadcrumbs';
import { SoundProvider } from './context/SoundContext';
import { Metadata } from 'next';
import '@styles/globals.css';

const geist = Geist({ 
  subsets: ['latin'], 
  variable: '--font-geist',
  display: 'swap' // Add this for better font loading
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
        {/* Preload critical resources */}
        <link
          rel="preload"
          href={geist.variable ? undefined : geist.style.fontFamily}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
        {/* Inline critical CSS - extract from globals.css and add here */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Critical above-the-fold CSS */
          .lcp-priority {
            content-visibility: auto;
            contain-intrinsic-size: 1px 500px;
          }
          #__next {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
          /* Add other critical styles as needed */
        `}} />
      </head>
      <body className={`${geist.variable} font-[Geist,Geist-fallback]`}>
        <SoundProvider>
          <Breadcrumbs />
          {children}
          <SeoBreadcrumbs />
          <GoogleAnalytics gaId="G-K4KZ7XR85V" />
          <Script
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            strategy="afterInteractive" // Changed from lazyOnload
            crossOrigin="anonymous"
          />
        </SoundProvider>
      </body>
    </html>
  );
}