// layout.tsx - Fixed with correct preload implementation
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
  display: 'swap',
  preload: true,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://triviaah.com'),
  title: {
    default: 'Triviaah: Free Daily Trivia & Quiz Games',
    template: '%s | Triviaah'
  },
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
          href="/logo-280x80.webp"
          as="image"
          type="image/webp"
        />
        
        {/* Preload high priority images for different resolutions */}
        <link
          rel="preload"
          href="/logo-280x80.webp"
          as="image"
          media="(max-width: 640px)"
        />
        <link
          rel="preload"
          href="/logo-560x160.webp"
          as="image"
          media="(min-width: 641px)"
        />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
        
        {/* Inline critical CSS with improved CLS prevention */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Critical above-the-fold CSS */
          .lcp-priority {
            content-visibility: auto;
            contain-intrinsic-size: 1px 500px;
          }
          body {
            font-family: var(--font-geist), system-ui, -apple-system, sans-serif;
            position: relative;
          }
          /* Prevent layout shifts for images */
          img {
            max-width: 100%;
            height: auto;
            display: block;
          }
          /* Skeleton loading for images */
          .img-skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
          }
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}} />
      </head>
      <body className={`${geist.variable} font-sans`}>
        <SoundProvider>
          <Breadcrumbs />
          {children}
          <SeoBreadcrumbs />
          <GoogleAnalytics gaId="G-K4KZ7XR85V" />
          <Script
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        </SoundProvider>
      </body>
    </html>
  );
}