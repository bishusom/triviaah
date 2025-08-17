// app/layout.tsx
import { AdBanner } from '@/components/Ads';
import Script from 'next/script';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/../styles/globals.css";
import { SoundProvider } from './context/SoundContext';
import BreadcrumbNav from '@/components/common/BreadcrumbNav';
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Triviaah: Free Daily Trivia & Word Games | 20+ Categories",
  description: "Play free daily trivia challenges, word games, and quiz yourself on entertainment, science, history, geography and more. New trivia questions every 24 hours!",
  keywords: "daily trivia challenges, free online trivia games, trivia quiz, word games, pop culture trivia quizzes, science trivia, history quiz, geography trivia, entertainment quiz, brain games",
  openGraph: {
    title: "Triviaah: Free Daily Trivia & Word Games",
    description: "Test your knowledge with daily trivia challenges and word games. Free online quizzes with new questions every day!",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link
          rel="preload"
          href={geistSans.variable ? undefined : geistSans.style.fontFamily}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={geistMono.variable ? undefined : geistMono.style.fontFamily}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
          precedence="default"
        />
      </head>
      <body className="antialiased">
        <SoundProvider>
          <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50">
              <BreadcrumbNav />
            </header>

            {/* Header Ad */}
            <AdBanner position="header" />    

            <main className="flex-grow">
              <GoogleAnalytics gaId="G-K4KZ7XR85V" />
              {children}
            </main>
            
            {/* Footer Ad */}
            <div className="mt-auto">
              <AdBanner position="footer" />
            </div>
          </div>
        </SoundProvider>

        {/* AdSense Script - Load early but after interaction */}
        <Script
          id="adsense-script"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4386714040098164"
        />
      </body>
    </html>
  );
}