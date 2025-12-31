// src/app/automobile/page.tsx
'use client';

import AutomobleComponent from '@/components/brainwave/AutomobleComponent';
import { getDailyCar, AutomoblePuzzle } from '@/lib/brainwave/automoble/automoble-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
//import { AutomobleData } from '@/lib/brainwave/automoble/automoble-logic';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function AutomoblePage() {
  const [automobileData, setAutomobileData] = useState<AutomoblePuzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Automobile
  const [structuredData, setStructuredData] = useState({
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Triviaah',
      url: 'https://triviaah.com',
      description: 'Free daily trivia quizzes and challenges across multiple categories including automotive knowledge, vehicle history, car brands, and more.',
      logo: 'https://triviaah.com/logo.png',
      sameAs: [],
      foundingDate: '2024',
      knowsAbout: ['Automotive Trivia', 'Car Games', 'Vehicle Knowledge', 'Car Brands', 'Automotive History', 'Engineering Puzzles']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Automobile - Daily Vehicle Guessing Game | Triviaah',
      description: 'Guess the vehicle from progressive clues with limited attempts! Wordle-style feedback on model names. Unlock more hints with each wrong guess.',
      url: 'https://triviaah.com/automobile',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Automobile',
        description: 'Daily vehicle guessing game where players have 6 attempts to guess the target vehicle using progressive clues and letter feedback.',
        gameLocation: 'https://triviaah.com/automobile',
        characterAttribute: 'Cars, Vehicles, Automotive, Brands, Models, Engineering'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Automobile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Automobile is a daily vehicle puzzle game where you guess the target car or vehicle in 6 attempts. It features progressive clues and Wordle-style letter feedback to help you solve the puzzle.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Automobile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You have 6 attempts to guess the daily vehicle. Start with basic clues, and get more detailed hints with each wrong guess. You also get letter feedback similar to Wordle.'
          }
        },
        {
          '@type': 'Question',
          name: 'What types of clues are provided?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Clues include manufacturer, vehicle type, year range, engine specifications, notable features, country of origin, and other identifying information about the vehicle.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Automobile free to play?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Automobile is completely free to play with no registration required. New vehicle puzzles are available every day.'
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
    const fetchDailyAutomobile = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyCar(currentDate);
        
        if (!data) {
          setError('No vehicle puzzle available for today');
          return;
        }
        
        setAutomobileData(data.puzzle);

        // Update structured data with today's puzzle info
        setStructuredData(prev => ({
          ...prev,
          webpage: {
            ...prev.webpage,
            dateModified: new Date().toISOString()
          }
        }));
        
      } catch (err) {
        console.error('Error fetching daily automobile:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyAutomobile();
  }, [currentDate]);

  // Show loading while waiting for client date or data
  if (isLoading || !currentDate) {
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
            <h1 className="text-3xl font-bold mb-2">🚗 Automobile - Vehicle Guessing Game</h1>
            {/* Last Updated Timestamp */}
            <time 
              dateTime={lastUpdated} 
              className="bg-blue-50 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-6">Guess the vehicle from progressive clues in 6 tries!</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s vehicle puzzle...</p>

          {/* Hidden SEO Content */}
          <div className="sr-only" aria-hidden="false">
            <div itemScope itemType="https://schema.org/Game">
              <meta itemProp="dateModified" content={lastUpdated} />
              <h2>Automobile - Daily Vehicle Guessing Game</h2>
              <p itemProp="description">
                Test your automotive knowledge with Automobile, a daily puzzle game where you guess vehicles 
                from progressive clues. Similar to Wordle but focused on automotive knowledge and vehicle identification.
              </p>
              <h3>How to Play Automobile:</h3>
              <ul>
                <li>Guess the target vehicle in 6 attempts</li>
                <li>Get progressive clues that become more specific with each wrong guess</li>
                <li>Receive Wordle-style letter feedback on vehicle names</li>
                <li>Use hints about manufacturer, vehicle type, year, and specifications</li>
                <li>New vehicle puzzle every day</li>
                <li>Completely free with no registration required</li>
              </ul>
              <p><strong>Game Features:</strong> Daily automotive challenges, progressive hint system, 
                 educational automotive content, and comprehensive vehicle database.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !automobileData) {
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
            <h1 className="text-3xl font-bold mb-2">🚗 Automobile - Vehicle Guessing Game</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-blue-50 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-4">Guess the vehicle from progressive clues in 6 tries!</p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="mb-2">No vehicle puzzle available for today.</p>
            <p className="text-sm">Please check back tomorrow or try refreshing the page!</p>
            {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
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
            <h1 className="text-3xl font-bold">🚗 Automobile</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-blue-50 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600">Guess the vehicle from progressive clues in 6 tries! Daily automotive puzzle.</p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>

        <AutomobleComponent initialData={automobileData} />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Automobile Game Information & FAQ</h2>
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
                <h3 className="font-semibold" itemProp="name">What is Automobile?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Automobile is a daily vehicle puzzle game where you guess the target car or vehicle in 6 attempts. 
                  It features progressive clues and Wordle-style letter feedback to help you solve the puzzle.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do I play Automobile?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  You have 6 attempts to guess the daily vehicle. Start with basic clues, and get more detailed hints 
                  with each wrong guess. You also get letter feedback similar to Wordle to help identify the vehicle&apos;s name.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What types of clues are provided?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Clues include manufacturer, vehicle type, year range, engine specifications, country of origin, 
                  notable features, and other identifying information about the vehicle. Clues become more specific 
                  with each attempt to help you narrow down possibilities.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How does the letter feedback work?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Similar to Wordle, letters in your guess are color-coded: green for correct letter in correct position, 
                  yellow for correct letter in wrong position, and gray for letters not in the vehicle&apos;s name.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Automobile free to play?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Automobile is completely free to play with no registration required. New vehicle puzzles 
                  are available every day at midnight local time.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What types of vehicles are included?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  The game includes cars, trucks, motorcycles, concept vehicles, and historical automobiles from various 
                  eras, countries, and manufacturers around the world.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Automobile - Daily Vehicle Guessing Game</h2>
            <p itemProp="description">
              Test your automotive knowledge with Automobile, a daily puzzle game where you guess vehicles 
              from progressive clues. Similar to Wordle but focused on automotive knowledge and vehicle identification. 
              Perfect for car enthusiasts, mechanics, engineers, and anyone who loves vehicles.
            </p>
            <h3>How to Play Automobile:</h3>
            <ul>
              <li>Guess the target vehicle in 6 attempts</li>
              <li>Get progressive clues that become more specific with each wrong guess</li>
              <li>Receive Wordle-style letter feedback on vehicle names</li>
              <li>Use hints about manufacturer, vehicle type, year, and specifications</li>
              <li>New vehicle puzzle every day</li>
              <li>Completely free with no registration required</li>
              <li>Educational and entertaining for all ages</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily vehicle challenges from various categories</li>
              <li>Progressive hint system that adapts to your progress</li>
              <li>Wordle-inspired letter feedback mechanics</li>
              <li>Comprehensive vehicle database</li>
              <li>Mobile-friendly design</li>
              <li>No time pressure - play at your own pace</li>
              <li>Learn interesting facts about automotive history</li>
            </ul>
            <p><strong>Perfect for:</strong> Car enthusiasts, automotive professionals, engineering students, 
               trivia lovers, and anyone wanting to test their knowledge of vehicles from classic cars to modern supercars.</p>
          </div>
        </div>
      </div>
    </div>
  );
}