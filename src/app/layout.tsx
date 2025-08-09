// app/layout.tsx
import { AdBanner } from '@/components/Ads';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/../styles/globals.css";
import { SoundProvider } from './context/SoundContext';
import BreadcrumbNav from '@/components/common/BreadcrumbNav';
import { GoogleAnalytics } from '@next/third-parties/google';



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Triviaah: Free Daily Trivia, Word Games & Number Puzzles | 20+ Categories, 10,000+ Questions",
  description: "Test your knowledge with our trivia game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
        precedence="default"
      />
      <body className="antialiased">
        <SoundProvider>
          <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50">
              <BreadcrumbNav />
            </header>

            {/* Horizontal Banner - Below Header */}
            <AdBanner />

            <main className="flex-grow">
              <GoogleAnalytics gaId="G-K4KZ7XR85V" />
              {children}
            </main>
            <AdBanner />
          </div>
        </SoundProvider>
      </body>
    </html>
  );
}