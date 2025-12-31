// app/citadle/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MuteButton from '@/components/common/MuteButton';
import CitadleComponent from '@/components/brainwave/CitadleComponent';
import { getDailyCityPuzzle, CityPuzzle } from '@/lib/brainwave/citadle/citadle-sb';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function CitadlePage() {
const [dailyData, setDailyData] = useState<{ puzzle: CityPuzzle | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Citadle
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Geography Games', 'Cities', 'Landmarks']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Citadle - Daily City Guessing Game | Triviaah',
      description: 'Guess the world city in 6 tries! Daily geography puzzle game with landmarks, skylines, and urban hints.',
      url: 'https://triviaah.com/brainwave/citadle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Citadle',
        description: 'Daily city guessing game where players have 6 attempts to guess the target city using landmarks, skylines, and geographical clues.',
        gameLocation: 'https://triviaah.com/brainwave/citadle',
        characterAttribute: 'Geography, Cities, Landmarks, Skylines, Urban Knowledge'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Citadle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Citadle is a daily geography puzzle game where you guess the target city in 6 attempts. It uses landmarks, city skylines, geographical coordinates, and statistical comparisons to help you narrow down your guesses.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Citadle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You have 6 attempts to guess the daily city. After each guess, you\'ll get progressive hints including country, landmark (initially blurred), city skyline, coordinates, and statistical comparisons. The game updates daily with a new city.'
          }
        },
        {
          '@type': 'Question',
          name: 'What hints are provided in Citadle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Hints include: 1) Country, 2) City skyline/silhouette, 3) Landmark (becomes clearer with wrong guesses), 4) Distance and direction from your guess, 5) Statistical comparisons (population, elevation, timezone), and 6) Famous features or nicknames.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Citadle free to play?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Citadle is completely free to play with no registration required. New puzzles are available every day at midnight.'
          }
        },
        {
          '@type': 'Question',
          name: 'How many cities are included?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Citadle includes major world cities from all continents, focusing on cities that most people would recognize. The game features a mix of capitals, famous metropolitan areas, and historically significant cities.'
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
    const fetchDailyCity = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyCityPuzzle(currentDate);
        
        if (!data) {
          setError('No puzzle available for today');
          return;
        }
        
        setDailyData({ puzzle: data });

        // Update structured data with today's puzzle info
        setStructuredData(prev => ({
          ...prev,
          webpage: {
            ...prev.webpage,
            dateModified: new Date().toISOString()
          }
        }));
        
      } catch (err) {
        console.error('Error fetching daily citadle:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyCity();
  }, [currentDate]);

  // Show loading while waiting for client date or data
  if (isLoading || !currentDate || !dailyData || !dailyData.puzzle) {
    return (
      <div className="page-with-ads">
        {/* Structured Data */}
        <Script
          id="citadle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="citadle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="citadle-faq-schema"
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
            <h1 className="text-3xl font-bold mb-2">🏙️ Citadle - Daily City Game</h1>
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
          <p className="text-gray-600 mb-6">Guess the city in 6 tries! Daily geography puzzle with landmarks and skylines.</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s city puzzle...</p>

          {/* Hidden SEO Content */}
          <div className="sr-only" aria-hidden="false">
            <div itemScope itemType="https://schema.org/Game">
              <meta itemProp="dateModified" content={lastUpdated} />
              <h2>Citadle - Daily City Guessing Game</h2>
              <p itemProp="description">
                Test your urban geography knowledge with Citadle, a daily puzzle game where you guess cities using landmarks, skylines, and geographical clues. 
                Similar to Wordle but focused on world cities and urban identification.
              </p>
              <h3>How to Play Citadle:</h3>
              <ul>
                <li>Guess the target city in 6 attempts</li>
                <li>Get progressive hints with each wrong guess</li>
                <li>See country information and city skylines</li>
                <li>Landmarks become clearer with each wrong guess</li>
                <li>Compare population, elevation, and timezone</li>
                <li>New city puzzle every day</li>
                <li>Completely free with no registration required</li>
              </ul>
              <p><strong>Game Features:</strong> Daily challenges, landmark recognition, skyline identification, 
                 geographical coordinates, statistical comparisons, and educational content about world cities.</p>
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
          id="citadle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="citadle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="citadle-faq-schema"
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
            <h1 className="text-3xl font-bold mb-2">🏙️ Citadle - Daily City Game</h1>
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
          <p className="text-gray-600 mb-4">Guess the city in 6 tries with landmarks and skylines!</p>
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
        id="citadle-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="citadle-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="citadle-faq-schema"
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
            <h1 className="text-3xl font-bold">🏙️ Citadle</h1>
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
          <p className="text-gray-600">Guess the city in 6 tries! Daily geography puzzle with landmarks and skylines.</p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <CitadleComponent 
          initialData={dailyData.puzzle}
        />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Citadle Game Information & FAQ</h2>
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
                <h3 className="font-semibold" itemProp="name">What is Citadle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Citadle is a daily geography puzzle game where you guess the target city in 6 attempts. 
                  It uses progressive hints including landmarks (initially blurred), city skylines, geographical coordinates, 
                  and statistical comparisons to help you identify the city.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do I play Citadle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  You have 6 attempts to guess the daily city. After each guess, you'll receive hints: 
                  1) Country, 2) City skyline, 3) Landmark (clears with wrong guesses), 4) Distance/direction from your guess, 
                  5) Statistical comparisons, and 6) Famous features or nicknames.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What cities are included?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Citadle includes major world cities from all continents, focusing on cities that most people 
                  would recognize. The game features a mix of capitals, famous metropolitan areas, and historically significant cities.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Citadle free to play?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Citadle is completely free to play with no registration required. New geography puzzles 
                  are available every day at midnight local time.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What makes Citadle different from other geography games?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Citadle combines multiple learning approaches: landmark recognition, skyline identification, 
                  geographical coordinates, statistical data comparison, and cultural information. The progressive 
                  hint system makes it educational for both beginners and geography experts.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Can I play Citadle on mobile?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Citadle is fully responsive and works perfectly on mobile devices, tablets, and desktop computers. 
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
            <h2>Citadle - Daily City Guessing Game</h2>
            <p itemProp="description">
              Test your urban geography knowledge with Citadle, a daily puzzle game where you guess cities 
              using multiple clues. Perfect for geography enthusiasts, students, travelers, and anyone wanting to 
              improve their city identification skills in a fun, interactive way.
            </p>
            <h3>How to Play Citadle:</h3>
            <ul>
              <li>Guess the target city in 6 attempts</li>
              <li>Progressive hints reveal more information with each wrong guess</li>
              <li>Identify cities by their landmarks, skylines, and geographical features</li>
              <li>Compare population, elevation, and timezone with your guesses</li>
              <li>Learn about famous features and city nicknames</li>
              <li>New city puzzle every day</li>
              <li>Completely free with no registration required</li>
              <li>Educational and fun for all ages and skill levels</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily geography challenges with 100+ major cities</li>
              <li>Landmark recognition training (blurred landmarks become clearer)</li>
              <li>City skyline/silhouette identification</li>
              <li>Geographical coordinate system with distance calculations</li>
              <li>Statistical comparisons (population, elevation, etc.)</li>
              <li>Cultural and historical hints</li>
              <li>Mobile-friendly responsive design</li>
              <li>No time pressure - play at your own pace</li>
              <li>Educational content about world cities</li>
            </ul>
            <p><strong>Perfect for:</strong> Geography students, travelers, architecture enthusiasts, puzzle lovers, 
               teachers, families, and anyone interested in learning more about world cities.</p>
            <p><strong>Educational Value:</strong> Citadle helps improve geographical knowledge, landmark recognition, 
               urban landscape reading skills, statistical awareness, and cultural understanding of different cities.</p>
          </div>
        </div>
      </div>
    </div>
  );
}