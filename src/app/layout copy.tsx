// app/layout.tsx (fixed)
import { Geist } from 'next/font/google';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { SpeedInsights } from '@vercel/speed-insights/next'; // Add this import
import { Breadcrumbs, SeoBreadcrumbs } from '@/components/Breadcrumbs';
import { SoundProvider } from '@/context/SoundContext';;
import { Metadata } from 'next';
import '@styles/globals.css';

const geist = Geist({ 
  subsets: ['latin'], 
  variable: '--font-geist',
  display: 'swap',
  adjustFontFallback: true, 
  fallback: ['system-ui', 'arial']
});

export const metadata: Metadata = {
  metadataBase: new URL('https://triviaah.com'),
  title: 'Triviaah: Free Daily Trivia & Quiz Games',
  description: 'Discover fun, free daily trivia challenges across 20+ exciting categories like movies, history, and science. Test your knowledge with fresh questions every 24 hours!',
  keywords: 'daily trivia, daily quiz, free trivia, trivia questions, quiz games, daily challenge, trivia app, quiz app, trivia online, trivia categories, fun quizzes, trivia competition, trivia game, quiz challenge, trivia fun, plotle, songle, capitale',
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
  const isProduction = process.env.NODE_ENV === 'production';
  
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
         {/* Critical CSS to prevent layout shifts */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
                /* Critical above-the-fold CSS to prevent CLS */
                .logo-container { 
                    min-height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    contain: layout style paint;
                  }

                  /* Text shouldn't shift during font load */
                    h1, h2, h3 {
                      font-size-adjust: 0.5;
                    }

                .category-image-placeholder {
                  width: 64px;
                  height: 64px;
                  border-radius: 50%;
                  background-color: #dbeafe;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  contain: layout style paint;
                }
                
                main { 
                  min-height: 60vh;
                  contain: layout style paint;
                }
                
                /* Ensure containers don't collapse */
                .container { 
                  width: 100%; 
                  margin-left: auto; 
                  margin-right: auto; 
                }

                .hero-section { 
                  min-height: 200px;
                  contain: layout style paint;
                }
                
                .category-grid {
                  min-height: 400px;
                  contain: layout style paint;
                }
                
                /* Ad containers must reserve space */
                .ad-container {
                  min-height: 90px;
                  background-color: #f5f5f5;
                  contain: layout style paint;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                
                @media (min-width: 640px) { .container { max-width: 640px; } }
                @media (min-width: 768px) { .container { max-width: 768px; } }
                @media (min-width: 1024px) { .container { max-width: 1024px; } }
                @media (min-width: 1280px) { .container { max-width: 1280px; } }
              `,
            }}
          />
      </head>

      <body className={`${geist.variable} font-[Geist,Geist-fallback] overflow-x-hidden`}>
        <SoundProvider>
          <Breadcrumbs />
          <div className="w-full overflow-x-hidden">
            {children}
          </div>
          <SeoBreadcrumbs />
          
          {/* Google Analytics - only load in production */}
          {isProduction && <GoogleAnalytics gaId="G-K4KZ7XR85V" />}
          
          {/* Vercel Speed Insights */}
          {isProduction && <SpeedInsights />}
          
          {/* AdSense Configuration */}
          {isProduction && (
            <>
              <Script
                id="adsense-config"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    (window.adsbygoogle = window.adsbygoogle || []).push({
                      google_ad_client: "ca-pub-4386714040098164",
                      enable_page_level_ads: false
                    });
                  `,
                }}
              />
              <Script
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4386714040098164"
                strategy="lazyOnload"
                crossOrigin="anonymous"
              />
            </>
          )}
        </SoundProvider>
      </body>
    </html>
  );
}