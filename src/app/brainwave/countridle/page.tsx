// app/countridle/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MuteButton from '@/components/common/MuteButton';
import CountridleComponent from '@/components/brainwave/CountridleComponent';
import { getDailyCountry, CountryPuzzle, CountryInfo } from '@/lib/brainwave/countridle/countridle-sb';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function CountridlePage() {
  const [dailyData, setDailyData] = useState<{ puzzle: CountryPuzzle | null, allCountries: CountryInfo[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for countridle
  const [structuredData, setStructuredData] = useState({
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Triviaah',
      url: 'https://triviaah.com',
      description: 'Free daily trivia quizzes and challenges across multiple categories including general knowledge, history, entertainment, and more.',
      logo: 'https://triviaah.com/logo.png',
      sameAs: [],
      foundingDate: '2024',
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Geography Games', 'Countries', 'Flags']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'countridle - Daily Country Guessing Game | Triviaah',
      description: 'Guess the world country in 6 tries! Daily geography puzzle game with flags, maps, and geographical hints.',
      url: 'https://triviaah.com/brainwave/countridle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'countridle',
        description: 'Daily country guessing game where players have 6 attempts to guess the target country using flags, maps, and geographical clues.',
        gameLocation: 'https://triviaah.com/brainwave/countridle',
        characterAttribute: 'Geography, Countries, Flags, Maps, World Knowledge'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is countridle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'countridle is a daily geography puzzle game where you guess the target country in 6 attempts. It uses flags, country outlines, geographical coordinates, and statistical comparisons to help you narrow down your guesses.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play countridle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You have 6 attempts to guess the daily country. After each guess, you\'ll get progressive hints including continent, flag (initially blurred), country outline, coordinates, and statistical comparisons. The game updates daily with a new country.'
          }
        },
        {
          '@type': 'Question',
          name: 'What hints are provided in countridle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Hints include: 1) Continent, 2) Country outline/silhouette, 3) Flag (becomes clearer with wrong guesses), 4) Distance and direction from your guess, 5) Statistical comparisons (population, area, driving side, currency), and 6) Capital city or language.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is countridle free to play?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! countridle is completely free to play with no registration required. New puzzles are available every day at midnight.'
          }
        },
        {
          '@type': 'Question',
          name: 'How many countries are included?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'countridle includes all 195 UN-recognized sovereign states, plus additional territories and regions. The game focuses on countries that most people would recognize.'
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
    const fetchDailyCountry = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyCountry(currentDate);
        
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
        console.error('Error fetching daily countridle:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyCountry();
  }, [currentDate]);

  // Show loading while waiting for client date or data
  if (isLoading || !currentDate || !dailyData || !dailyData.puzzle) {
    return (
      <div className="page-with-ads">
        {/* Structured Data */}
        <Script
          id="countridle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="countridle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="countridle-faq-schema"
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
            <h1 className="text-3xl font-bold mb-2">🌍 countridle - Daily Country Game</h1>
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
          <p className="text-gray-600 mb-6">Guess the country in 6 tries! Daily geography puzzle with flags and maps.</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s country puzzle...</p>

          {/* Hidden SEO Content */}
          <div className="sr-only" aria-hidden="false">
            <div itemScope itemType="https://schema.org/Game">
              <meta itemProp="dateModified" content={lastUpdated} />
              <h2>countridle - Daily Country Guessing Game</h2>
              <p itemProp="description">
                Test your geography knowledge with countridle, a daily puzzle game where you guess countries using flags, maps, and geographical clues. 
                Similar to Wordle but focused on world geography and country identification.
              </p>
              <h3>How to Play countridle:</h3>
              <ul>
                <li>Guess the target country in 6 attempts</li>
                <li>Get progressive hints with each wrong guess</li>
                <li>See continent information and country outlines</li>
                <li>Flags become clearer with each wrong guess</li>
                <li>Compare population, area, driving side, and currency</li>
                <li>New country puzzle every day</li>
                <li>Completely free with no registration required</li>
              </ul>
              <p><strong>Game Features:</strong> Daily challenges, flag recognition, map identification, 
                 geographical coordinates, statistical comparisons, and educational content about world countries.</p>
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
          id="countridle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="countridle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="countridle-faq-schema"
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
            <h1 className="text-3xl font-bold mb-2">🌍 countridle - Daily Country Game</h1>
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
          <p className="text-gray-600 mb-4">Guess the country in 6 tries with flags and maps!</p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="mb-2">No puzzle available for today.</p>
            <p className="text-sm">Please check back tomorrow or try refreshing the page!</p>
            <p className="text-red-500 text-sm mt-2">Error: {error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors"
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
        id="countridle-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="countridle-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="countridle-faq-schema"
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
      
      {/* Ad Controls */}
      {showAds && (
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
      )}

      <div className="max-w-2xl mx-auto p-4">
        {/* Header with Last Updated */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold">🌍 countridle</h1>
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
          <p className="text-gray-600">Guess the country in 6 tries! Daily geography puzzle with flags and maps.</p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <CountridleComponent 
          initialData={dailyData.puzzle} 
          allCountries={dailyData.allCountries}
        />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">countridle Game Information & FAQ</h2>
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
                <h3 className="font-semibold" itemProp="name">What is countridle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  countridle is a daily geography puzzle game where you guess the target country in 6 attempts. 
                  It uses progressive hints including flags (initially blurred), country outlines, geographical coordinates, 
                  and statistical comparisons to help you identify the country.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do I play countridle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  You have 6 attempts to guess the daily country. After each guess, you&apos;ll receive hints: 
                  1) Continent, 2) Country outline, 3) Flag (clears with wrong guesses), 4) Distance/direction from your guess, 
                  5) Statistical comparisons, and 6) Capital/language hints.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What countries are included?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  countridle includes all 195 UN-recognized sovereign states, focusing on countries that most people 
                  would recognize. The game may occasionally include well-known territories and regions for variety.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is countridle free to play?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! countridle is completely free to play with no registration required. New geography puzzles 
                  are available every day at midnight local time.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What makes countridle different from other geography games?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  countridle combines multiple learning approaches: flag recognition, map identification, 
                  geographical coordinates, statistical data comparison, and cultural information. The progressive 
                  hint system makes it educational for both beginners and geography experts.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Can I play countridle on mobile?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! countridle is fully responsive and works perfectly on mobile devices, tablets, and desktop computers. 
                  The interface adapts to different screen sizes for optimal gameplay.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>countridle - Daily Country Guessing Game</h2>
            <p itemProp="description">
              Test your world geography knowledge with countridle, a daily puzzle game where you guess countries 
              using multiple clues. Perfect for geography enthusiasts, students, travelers, and anyone wanting to 
              improve their country identification skills in a fun, interactive way.
            </p>
            <h3>How to Play countridle:</h3>
            <ul>
              <li>Guess the target country in 6 attempts</li>
              <li>Progressive hints reveal more information with each wrong guess</li>
              <li>Identify countries by their flags, outlines, and geographical features</li>
              <li>Compare population, area, driving side, and currency with your guesses</li>
              <li>Learn about capital cities and official languages</li>
              <li>New country puzzle every day</li>
              <li>Completely free with no registration required</li>
              <li>Educational and fun for all ages and skill levels</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily geography challenges with 195+ countries</li>
              <li>Flag recognition training (blurred flags become clearer)</li>
              <li>Country outline/silhouette identification</li>
              <li>Geographical coordinate system with distance calculations</li>
              <li>Statistical comparisons (population, area, etc.)</li>
              <li>Cultural and linguistic hints</li>
              <li>Mobile-friendly responsive design</li>
              <li>No time pressure - play at your own pace</li>
              <li>Educational content about world geography</li>
            </ul>
            <p><strong>Perfect for:</strong> Geography students, travelers, flag enthusiasts, puzzle lovers, 
               teachers, families, and anyone interested in learning more about world countries.</p>
            <p><strong>Educational Value:</strong> countridle helps improve geographical knowledge, flag recognition, 
               map reading skills, statistical awareness, and cultural understanding of different countries.</p>
          </div>
        </div>
      </div>
    </div>
  );
}