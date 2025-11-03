// app/capitale/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MuteButton from '@/components/common/MuteButton';
import CapitaleComponent from '@/components/brainwave/CapitaleComponent';
import { getDailyCapitale, CapitalePuzzle, CapitalInfo } from '@/lib/brainwave/capitale/capitale-sb';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function CapitalePage() {
  const [dailyData, setDailyData] = useState<{ puzzle: CapitalePuzzle | null, allCapitals: CapitalInfo[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());

  // Structured data for Capitale
  const [structuredData, setStructuredData] = useState({
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Elite Trivias',
      url: 'https://elitetrivias.com',
      description: 'Free daily trivia quizzes and challenges across multiple categories including general knowledge, history, entertainment, and more.',
      logo: 'https://elitetrivias.com/logo.png',
      sameAs: [],
      foundingDate: '2024',
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Geography Games', 'Capital Cities']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Capitale - Daily Capital City Guessing Game | Elite Trivias',
      description: 'Guess the world capital city in 6 tries! Daily geography puzzle game similar to Wordle but with capital cities.',
      url: 'https://elitetrivias.com/capitale',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Capitale',
        description: 'Daily capital city guessing game where players have 6 attempts to guess the target capital city.',
        gameLocation: 'https://elitetrivias.com/capitale',
        characterAttribute: 'Geography, Capital Cities, World Knowledge'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Capitale?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Capitale is a daily geography puzzle game where you guess the target capital city in 6 attempts. It\'s similar to Wordle but focused on world capitals and geography.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Capitale?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You have 6 attempts to guess the daily capital city. After each guess, you\'ll get feedback on how close your guess is. The game updates daily with a new capital city.'
          }
        },
        {
          '@type': 'Question',
          name: 'Are hints provided in Capitale?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! After each guess, you\'ll see distance and direction indicators showing how far your guess is from the target capital, along with continent information.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Capitale free to play?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Capitale is completely free to play with no registration required. New puzzles are available every day.'
          }
        }
      ]
    }
  });

  useEffect(() => {
    // Set the current date on the client side to ensure it's using client timezone
    const now = new Date();
    setCurrentDate(now);
    setLastUpdated(now.toISOString());
  }, []);

  useEffect(() => {
    const fetchDailyCapitale = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyCapitale(currentDate);
        
        if (!data.puzzle) {
          setError('No puzzle available for today');
          return;
        }
        
        setDailyData(data);

        // Update structured data with today's puzzle info
        setStructuredData(prev => ({
          ...prev,
          webpage: {
            ...prev.webpage,
            dateModified: new Date().toISOString()
          }
        }));
        
      } catch (err) {
        console.error('Error fetching daily capitale:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyCapitale();
  }, [currentDate]);

  // Show loading while waiting for client date or data
  if (isLoading || !currentDate || !dailyData || !dailyData.puzzle) {
    return (
      <div className="page-with-ads">
        {/* Structured Data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faq) }}
        />

        {/* Desktop Side Ads */}
        {showDesktopAds && (
          <>
            <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-right"/>
            </div>
            <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-left"/>
            </div>
          </>
        )}
        
        {/* Mobile Bottom Ad */}
        {showMobileAd && (
           <Ads format="horizontal" isMobileFooter={true} className="lg:hidden" />
        )}
        
        <div className="max-w-2xl mx-auto p-6 text-center">
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold mb-2">🌎 Capitale - Daily Capital City Game</h1>
            {/* Last Updated Timestamp */}
            <time 
              dateTime={lastUpdated} 
              className="bg-green-50 px-3 py-1 rounded-full text-xs font-medium border border-green-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-6">Guess the world capital in 6 tries! Daily geography puzzle.</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s puzzle...</p>

          {/* Hidden SEO Content */}
          <div className="sr-only" aria-hidden="false">
            <div itemScope itemType="https://schema.org/Game">
              <meta itemProp="dateModified" content={lastUpdated} />
              <h2>Capitale - Daily Capital City Guessing Game</h2>
              <p itemProp="description">
                Test your geography knowledge with Capitale, a daily puzzle game where you guess world capital cities. 
                Similar to Wordle but focused on geography and world capitals.
              </p>
              <h3>How to Play Capitale:</h3>
              <ul>
                <li>Guess the target capital city in 6 attempts</li>
                <li>Get distance and direction hints after each guess</li>
                <li>See continent information to narrow down possibilities</li>
                <li>New capital city puzzle every day</li>
                <li>Completely free with no registration required</li>
              </ul>
              <p><strong>Game Features:</strong> Daily challenges, educational geography content, 
                 progressive hints, and global capital city database.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-with-ads">
        {/* Structured Data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faq) }}
        />

        {/* Desktop Side Ads */}
        {showDesktopAds && (
          <>
            <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-right"/>
            </div>
            <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-left"/>
            </div>
          </>
        )}
        
        {/* Mobile Bottom Ad */}
        {showMobileAd && (
           <Ads format="horizontal" isMobileFooter={true} className="lg:hidden" />
        )} 
        
        <div className="max-w-2xl mx-auto p-6 text-center">
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold mb-2">🌎 Capitale - Daily Capital City Game</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-green-50 px-3 py-1 rounded-full text-xs font-medium border border-green-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-4">Guess the world capital in 6 tries!</p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="mb-2">No puzzle available for today.</p>
            <p className="text-sm">Please check back tomorrow or try refreshing the page!</p>
            <p className="text-red-500 text-sm mt-2">Error: {error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-with-ads">
      {/* Structured Data */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faq) }}
      />

      {/* Desktop Side Ads */}
      {showDesktopAds && (
        <>
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-right"/>
          </div>
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-left"/>
          </div>
        </>
      )}
      
      {/* Mobile Bottom Ad */}
      {showMobileAd && (
        <Ads isMobileFooter={true} format="horizontal" style={{ width: '100%', height: '100px' }} />
      )}
      
      {/* Ad Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setShowDesktopAds(!showDesktopAds)}
          className="bg-gray-600 hover:bg-gray-800 text-white text-xs px-2 py-1 rounded hidden lg:block"
        >
          {showDesktopAds ? 'Hide Side Ads' : 'Show Side Ads'}
        </button>
        <button
          onClick={() => setShowMobileAd(!showMobileAd)}
          className="bg-gray-600 hover:bg-gray-800 text-white text-xs px-2 py-1 rounded lg:hidden"
        >
          {showMobileAd ? 'Hide Bottom Ad' : 'Show Bottom Ad'}
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* Header with Last Updated */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold">🌎 Capitale</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-green-50 px-3 py-1 rounded-full text-xs font-medium border border-green-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600">Guess the world capital in 6 tries! Daily geography puzzle.</p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <CapitaleComponent 
          initialData={dailyData.puzzle} 
          allCapitals={dailyData.allCapitals}
        />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Capitale Game Information & FAQ</h2>
              <span className="text-gray-500 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
              {/* Content Freshness Info */}
              <div>
                <h3 className="font-semibold">Game Updates</h3>
                <p className="text-gray-600 text-sm">
                  <strong>Last updated:</strong> {new Date(lastUpdated).toLocaleString()} (Server Time)
                </p>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What is Capitale?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Capitale is a daily geography puzzle game where you guess the target capital city in 6 attempts. 
                  It&apos;s similar to Wordle but focused on world capitals and geography knowledge.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do I play Capitale?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  You have 6 attempts to guess the daily capital city. After each guess, you&apos;ll get feedback on 
                  how close your guess is. The game updates daily with a new capital city challenge.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Are hints provided in Capitale?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! After each guess, you&apos;ll see distance and direction indicators showing how far your guess 
                  is from the target capital, along with continent information to help narrow down possibilities.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Capitale free to play?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Capitale is completely free to play with no registration required. New geography puzzles 
                  are available every day at midnight local time.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What happens if I don&apos;t guess correctly in 6 tries?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  If you don&apos;t guess the capital city in 6 attempts, the game will reveal the answer. 
                  You can try again tomorrow with a new capital city puzzle!
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Capitale - Daily Capital City Guessing Game</h2>
            <p itemProp="description">
              Test your geography knowledge with Capitale, a daily puzzle game where you guess world capital cities. 
              Similar to Wordle but focused on geography and world capitals. Perfect for geography enthusiasts and 
              anyone looking to improve their world knowledge.
            </p>
            <h3>How to Play Capitale:</h3>
            <ul>
              <li>Guess the target capital city in 6 attempts</li>
              <li>Get distance and direction hints after each guess</li>
              <li>See continent information to narrow down possibilities</li>
              <li>New capital city puzzle every day</li>
              <li>Completely free with no registration required</li>
              <li>Educational and fun for all ages</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily geography challenges</li>
              <li>Educational world capital content</li>
              <li>Progressive hint system</li>
              <li>Global capital city database</li>
              <li>Mobile-friendly design</li>
              <li>No time pressure - play at your own pace</li>
            </ul>
            <p><strong>Perfect for:</strong> Geography students, travel enthusiasts, puzzle lovers, 
               and anyone wanting to learn more about world capitals in a fun, interactive way.</p>
          </div>
        </div>
      </div>
    </div>
  );
}