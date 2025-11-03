// src/app/landmarkdle/page.tsx
'use client';

import LandmarkdleComponent from '@/components/brainwave/LandmarkdleComponent';
import { getDailyLandmark, LandmarkPuzzle } from '@/lib/brainwave/landmarkdle/landmarkdle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function LandmarkdlePage() {
  const [landmarkData, setLandmarkData] = useState<{puzzle: LandmarkPuzzle | null} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());

  // Structured data for Landmarkdle
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Geography Games', 'Architecture Puzzles', 'Travel Education']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Landmarkdle - Daily Landmark Puzzle | Elite Trivias',
      description: 'Guess the landmark from its 6 attributes: type, location, architect, built year, height, and material. Wordle-style landmark guessing game.',
      url: 'https://elitetrivias.com/brainwave/landmarkdle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Landmarkdle',
        description: 'Daily landmark guessing game where players identify world landmarks based on 6 key attributes: type, location, architect, built year, height, and material.',
        gameLocation: 'https://elitetrivias.com/brainwave/landmarkdle',
        characterAttribute: 'Landmarks, Architecture, Geography, Travel, World Heritage, Famous Buildings, Historical Structures'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Landmarkdle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Landmarkdle is a daily landmark puzzle game where you guess the target landmark using 6 key attributes: type, location, architect, built year, height, and material. It\'s an educational game that teaches about world architecture and famous structures.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Landmarkdle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You have 6 attempts to guess the daily landmark. Use the 6 attribute categories to narrow down possibilities. Each guess provides feedback on which attributes match the target landmark.'
          }
        },
        {
          '@type': 'Question',
          name: 'What are the 6 attributes in Landmarkdle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The 6 attributes are: Type (building, monument, bridge, etc.), Location (city and country), Architect (designer or builder), Built Year (construction date), Height (in meters or feet), and Material (stone, steel, concrete, etc.).'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Landmarkdle educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Landmarkdle is designed to be both fun and educational. Players learn about world architecture, famous landmarks, geographical locations, and architectural history while playing.'
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
    const fetchDailyLandmark = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyLandmark(currentDate);
        
        if (!data || !data.puzzle) {
          setError('No puzzle available for today');
          return;
        }
        
        setLandmarkData(data);

        // Update structured data with today's puzzle info
        setStructuredData(prev => ({
          ...prev,
          webpage: {
            ...prev.webpage,
            dateModified: new Date().toISOString()
          }
        }));
        
      } catch (err) {
        console.error('Error fetching daily landmark:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyLandmark();
  }, [currentDate]);

  // Show loading while waiting for client date or data
  if (isLoading || !currentDate) {
    return (
      <div className="page-with-ads">
        {/* Structured Data */}
        <Script
          id="landmarkdle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="landmarkdle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="landmarkdle-faq-schema"
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
            <h1 className="text-3xl font-bold mb-2">🏛️ Landmarkdle - Architecture Guessing Game</h1>
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
          <p className="text-gray-600 mb-6">Landmark guessing puzzle. Guess the landmark in 6 tries using 6 attributes!</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s landmark puzzle...</p>

          {/* Hidden SEO Content */}
          <div className="sr-only" aria-hidden="false">
            <div itemScope itemType="https://schema.org/Game">
              <meta itemProp="dateModified" content={lastUpdated} />
              <h2>Landmarkdle - Daily Landmark Guessing Game</h2>
              <p itemProp="description">
                Test your knowledge of world architecture with Landmarkdle, a daily puzzle game where you guess landmarks 
                based on 6 key attributes: type, location, architect, built year, height, and material. Educational 
                and fun for travel and architecture enthusiasts of all ages.
              </p>
              <h3>How to Play Landmarkdle:</h3>
              <ul>
                <li>Guess the target landmark in 6 attempts</li>
                <li>Use 6 attribute categories to narrow down possibilities</li>
                <li>Get feedback on type, location, architect, year, height, and material</li>
                <li>Learn about world architecture and famous structures</li>
                <li>New landmark puzzle every day</li>
                <li>Completely free with no registration required</li>
              </ul>
              <p><strong>Game Features:</strong> Daily architecture challenges, educational geography content, 
                 attribute-based guessing system, and comprehensive landmark database.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !landmarkData) {
    return (
      <div className="page-with-ads">
        {/* Structured Data */}
        <Script
          id="landmarkdle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="landmarkdle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="landmarkdle-faq-schema"
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
            <h1 className="text-3xl font-bold mb-2">🏛️ Landmarkdle - Architecture Guessing Game</h1>
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
          <p className="text-gray-600 mb-4">Landmark guessing puzzle. Guess the landmark in 6 tries using 6 attributes!</p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="mb-2">No puzzle available for today.</p>
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
        id="landmarkdle-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="landmarkdle-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="landmarkdle-faq-schema"
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
            <h1 className="text-3xl font-bold">🏛️ Landmarkdle</h1>
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
          <p className="text-gray-600">Landmark guessing puzzle. Guess the landmark in 6 tries using 6 attributes!</p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {landmarkData.puzzle && <LandmarkdleComponent initialData={landmarkData as { puzzle: LandmarkPuzzle }} />}

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Landmarkdle Game Information & FAQ</h2>
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
                <h3 className="font-semibold" itemProp="name">What is Landmarkdle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Landmarkdle is a daily landmark puzzle game where you guess the target landmark using 6 key attributes: 
                  type, location, architect, built year, height, and material. It&apos;s an educational game that teaches 
                  about world architecture, famous structures, and geographical landmarks in a fun, interactive way.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do I play Landmarkdle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  You have 6 attempts to guess the daily landmark. Use the 6 attribute categories to narrow down possibilities. 
                  Each guess provides feedback on which attributes match the target landmark, helping you eliminate options and 
                  make educated guesses about architectural structures.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What are the 6 attributes in Landmarkdle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  The 6 attributes are: Type (building, monument, bridge, tower, temple, castle, etc.), 
                  Location (specific city and country), Architect (the designer, builder, or architectural firm), 
                  Built Year (when construction was completed), Height (in meters or feet), and Material 
                  (stone, marble, steel, concrete, glass, wood, etc.).
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Landmarkdle educational?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Landmarkdle is designed to be both fun and educational. Players learn about world architecture, 
                  famous landmarks, geographical locations, architectural history, and construction techniques while playing. 
                  It&apos;s great for travel enthusiasts, architecture students, and anyone interested in world cultures.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What types of landmarks are included?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Landmarkdle features a wide variety of landmarks from around the world, including ancient wonders, 
                  modern skyscrapers, historical monuments, religious structures, bridges, castles, and UNESCO World 
                  Heritage sites. The database includes both famous icons and lesser-known architectural marvels.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Landmarkdle free to play?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Landmarkdle is completely free to play with no registration required. New landmark puzzles 
                  are available every day at midnight local time.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Landmarkdle - Daily Landmark Guessing Game</h2>
            <p itemProp="description">
              Test your knowledge of world architecture with Landmarkdle, a daily puzzle game where you guess landmarks 
              based on 6 key attributes: type, location, architect, built year, height, and material. Educational 
              and fun for travel and architecture enthusiasts of all ages. Perfect for globetrotters, architecture 
              students, and anyone fascinated by the world&apos;s most famous structures.
            </p>
            <h3>How to Play Landmarkdle:</h3>
            <ul>
              <li>Guess the target landmark in 6 attempts</li>
              <li>Use 6 attribute categories to narrow down possibilities</li>
              <li>Get feedback on type, location, architect, year, height, and material</li>
              <li>Learn about world architecture and famous structures</li>
              <li>New landmark puzzle every day</li>
              <li>Completely free with no registration required</li>
              <li>Educational and entertaining for all ages</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily architecture challenges with diverse landmarks</li>
              <li>Educational geography and architecture content</li>
              <li>Six attribute categories for strategic guessing</li>
              <li>Comprehensive landmark database</li>
              <li>Mobile-friendly design</li>
              <li>No time pressure - play at your own pace</li>
              <li>Learn fascinating facts about world landmarks</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Learn about famous world landmarks and their history</li>
              <li>Understand architectural styles and construction techniques</li>
              <li>Explore geographical locations and cultural significance</li>
              <li>Discover architectural innovators and their creations</li>
              <li>Improve deductive reasoning and problem-solving skills</li>
              <li>Develop appreciation for world heritage and cultural diversity</li>
            </ul>
            <p><strong>Perfect for:</strong> Travel enthusiasts, architecture students, geography lovers, 
               history buffs, educators, and anyone wanting to learn more about the world&apos;s most 
               famous structures in an engaging, interactive way.</p>
          </div>
        </div>
      </div>
    </div>
  );
}