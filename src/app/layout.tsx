import { Geist } from 'next/font/google';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Breadcrumbs, SeoBreadcrumbs } from '@/components/Breadcrumbs';
import { SoundProvider } from './context/SoundContext';
import '@styles/globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata = {
  title: 'Triviaah: Free Daily Trivia & Quiz Games',
  description: 'Play free daily trivia challenges across 20+ categories. New questions every 24 hours!',
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
        {/* Add preconnect for Google Ads */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />  
      </head>
      <body className={`${geist.variable} font-[Geist,Geist-fallback]`}>
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
      </body>
    </html>
  );
}