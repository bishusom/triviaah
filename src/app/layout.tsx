// app/layout.tsx
import { AdBanner } from '@/components/Ads';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/../styles/globals.css";
import { SoundProvider } from './context/SoundContext';
import BreadcrumbNav from '@/components/common/BreadcrumbNav';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Suspense } from 'react';

// Optimized font loading with display swap
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Arial', 'sans-serif'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
  fallback: ['Menlo', 'Monaco', 'Consolas', 'monospace'],
});

export const metadata: Metadata = {
  title: "Triviaah: Free Daily Trivia, Word Games & Number Puzzles | 20+ Categories, 10,000+ Questions",
  description: "Test your knowledge with our trivia game featuring 20+ categories and over 10,000 questions. Play daily trivia challenges, word games, and number puzzles for free.",
  keywords: "trivia, quiz, daily trivia, word games, number puzzles, brain games, knowledge test",
  authors: [{ name: "Triviaah" }],
  creator: "Triviaah",
  publisher: "Triviaah",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Performance and SEO optimizations
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Triviaah - Free Daily Trivia & Brain Games',
    description: 'Challenge yourself with daily trivia questions across 20+ categories',
    siteName: 'Triviaah',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Triviaah - Free Daily Trivia & Brain Games',
    description: 'Challenge yourself with daily trivia questions across 20+ categories',
  },
  // Performance hints
  other: {
    'theme-color': '#2563eb',
    'color-scheme': 'light',
  },
};

// Loading component for Suspense boundaries
function Loading() {
  return (
    <div className="w-full h-8 bg-gray-100 animate-pulse rounded" aria-label="Loading..." />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Material Icons - simplified loading */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap"
          rel="stylesheet"
        />

        {/* Viewport meta with performance optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* Favicon and PWA manifest */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <SoundProvider>
          <div className="min-h-screen flex flex-col">
            {/* Header with Suspense for better loading performance */}
            <header className="sticky top-0 z-50">
              <Suspense fallback={<Loading />}>
                <BreadcrumbNav />
              </Suspense>
            </header>

            {/* Ad Banner with Suspense to prevent render blocking */}
            <Suspense fallback={null}>
              <AdBanner />
            </Suspense>

            <main className="flex-grow" id="main-content">
              {/* Google Analytics loaded asynchronously */}
              <Suspense fallback={null}>
                <GoogleAnalytics gaId="G-K4KZ7XR85V" />
              </Suspense>
              
              {children}
            </main>

            {/* Footer ad with Suspense */}
            <Suspense fallback={null}>
              <AdBanner />
            </Suspense>
          </div>
        </SoundProvider>

        {/* Service Worker registration for caching */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('SW registration failed');
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}