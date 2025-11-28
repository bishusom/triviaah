// src/app/landmarkdle/page.tsx - REDESIGNED
'use client';

import LandmarkdleComponent from '@/components/brainwave/LandmarkdleComponent';
import { getDailyLandmark, LandmarkPuzzle } from '@/lib/brainwave/landmarkdle/landmarkdle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { Building, Target, Users, Clock, Trophy, Flame, MapPin } from 'lucide-react';

export default function LandmarkdlePage() {
  const [landmarkData, setLandmarkData] = useState<{puzzle: LandmarkPuzzle | null} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Landmarkdle
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Geography Games', 'Architecture Puzzles', 'Travel Education']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Landmarkdle - Daily Landmark Puzzle | Triviaah',
      description: 'Guess the landmark from its 6 attributes: type, location, architect, built year, height, and material. Wordle-style landmark guessing game.',
      url: 'https://triviaah.com/brainwave/landmarkdle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Landmarkdle',
        description: 'Daily landmark guessing game where players identify world landmarks based on 6 key attributes: type, location, architect, built year, height, and material.',
        gameLocation: 'https://triviaah.com/brainwave/landmarkdle',
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

  // Loading State
  if (isLoading || !currentDate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
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
            <div className="fixed left-4 bottom-8 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-right"/>
            </div>
            <div className="fixed right-4 bottom-8 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-left"/>
            </div>
          </>
        )}
        
        {/* Mobile Bottom Ad */}
        {showMobileAd && (
          <Ads format="horizontal" isMobileFooter={true} style={{ width: '100%', height: '100px' }} className="lg:hidden" />
        )}
        
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-2xl">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                LANDMARKDLE
              </h1>
            </div>
            <p className="text-gray-200 text-lg">Daily Architecture Guessing Challenge</p>
          </div>

          {/* Loading Card */}
          <div className="bg-blue-800/50 backdrop-blur-lg rounded-3xl border border-blue-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                <Building className="w-10 h-10 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Loading Today&apos;s Landmark</h2>
            <p className="text-blue-200 mb-6">Preparing your architecture puzzle...</p>
            
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${dot * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !landmarkData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white">
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

        {/* Ads */}
        {showDesktopAds && (
          <>
            <div className="fixed left-4 bottom-8 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-right"/>
            </div>
            <div className="fixed right-4 bottom-8 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-left"/>
            </div>
          </>
        )}
        
        {showMobileAd && (
          <Ads format="horizontal" isMobileFooter={true} style={{ width: '100%', height: '100px' }} className="lg:hidden" />
        )}
        
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-2xl">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                LANDMARKDLE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Architecture Guessing Challenge</p>
          </div>

          {/* Error Card */}
          <div className="bg-blue-500/10 backdrop-blur-lg rounded-3xl border border-blue-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Challenge Unavailable</h2>
            <p className="text-blue-200 mb-6">We couldn&apos;t load today&apos;s landmark puzzle.</p>
            
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4 mb-6">
              <p className="text-blue-300 text-sm">{error || 'No puzzle available for today'}</p>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Game State
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white">
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
          <div className="fixed left-4 bottom-8 z-40 hidden lg:block">
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-right"/>
          </div>
          <div className="fixed right-4 bottom-8 z-40 hidden lg:block">
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-left"/>
          </div>
        </>
      )}
      
      {/* Mobile Bottom Ad */}
      {showMobileAd && (
        <Ads isMobileFooter={true} format="horizontal" style={{ width: '100%', height: '100px' }} className="lg:hidden" />
      )}
      
      {/* Ad Controls */}
      {showAds && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setShowDesktopAds(!showDesktopAds)}
            className="bg-gray-700/80 hover:bg-gray-600/80 text-white text-xs px-3 py-2 rounded-2xl backdrop-blur-sm hidden lg:block transition-all duration-300"
          >
            {showDesktopAds ? 'Hide Ads' : 'Show Ads'}
          </button>
          <button
            onClick={() => setShowMobileAd(!showMobileAd)}
            className="bg-gray-700/80 hover:bg-gray-600/80 text-white text-xs px-3 py-2 rounded-2xl backdrop-blur-sm lg:hidden transition-all duration-300"
          >
            {showMobileAd ? 'Hide Ad' : 'Show Ad'}
          </button>
        </div>
      )}

      <div className="max-w-4xl lg:max-w-2xl mx-auto p-4 relative z-30">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-2xl shadow-lg">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                LANDMARKDLE
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-blue-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-blue-400 text-sm font-medium"
              >
                Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </time>
            </div>
          </div>
          
          <p className="text-gray-300 text-lg mb-2">Guess the landmark from 6 attributes in 6 attempts</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Daily Challenge</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-5 h-5 text-cyan-500" />
              <span className="text-sm">Global Explorers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="text-sm">6 Attempts</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-5 h-5 text-cyan-500" />
              <span className="text-sm">6 Attributes</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        {landmarkData.puzzle && <LandmarkdleComponent initialData={landmarkData as { puzzle: LandmarkPuzzle }} />}

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6 relative z-10">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none p-4 hover:bg-gray-700/30 rounded-2xl transition-all duration-300">
              <h2 className="text-xl font-bold text-white">Game Guide & FAQ</h2>
              <span className="text-blue-400 group-open:rotate-180 transition-transform duration-300 text-2xl">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-6 pt-6 border-t border-gray-700">
              <div className="grid gap-4">
                {[
                  {
                    question: "What is Landmarkdle?",
                    answer: "Landmarkdle is a daily landmark puzzle game where you guess the target landmark using 6 key attributes: type, location, architect, built year, height, and material. It's an educational game that teaches about world architecture and famous structures in a fun, interactive way."
                  },
                  {
                    question: "How do I play Landmarkdle?",
                    answer: "You have 6 attempts to guess the daily landmark. Use the 6 attribute categories to narrow down possibilities. Each guess provides feedback on which attributes match the target landmark, helping you eliminate options and make educated guesses about architectural structures."
                  },
                  {
                    question: "What are the 6 attributes in Landmarkdle?",
                    answer: "The 6 attributes are: Type (building, monument, bridge, tower, temple, castle, etc.), Location (specific city and country), Architect (the designer, builder, or architectural firm), Built Year (when construction was completed), Height (in meters or feet), and Material (stone, marble, steel, concrete, glass, wood, etc.)."
                  },
                  {
                    question: "Is Landmarkdle educational?",
                    answer: "Yes! Landmarkdle is designed to be both fun and educational. Players learn about world architecture, famous landmarks, geographical locations, architectural history, and construction techniques while playing. It's great for travel enthusiasts, architecture students, and anyone interested in world cultures."
                  },
                  {
                    question: "What types of landmarks are included?",
                    answer: "Landmarkdle features a wide variety of landmarks from around the world, including ancient wonders, modern skyscrapers, historical monuments, religious structures, bridges, castles, and UNESCO World Heritage sites. The database includes both famous icons and lesser-known architectural marvels."
                  },
                  {
                    question: "Is Landmarkdle free to play?",
                    answer: "Yes! Landmarkdle is completely free to play with no registration required. New landmark puzzles are available every day at midnight local time."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-2xl p-4">
                    <h3 className="font-semibold text-blue-400 mb-2">{faq.question}</h3>
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                ))}
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
              based on 6 key attributes. Educational and fun for travel and architecture enthusiasts of all ages. 
              Perfect for globetrotters, architecture students, and anyone fascinated by the world's most famous structures.
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
               history buffs, educators, and anyone wanting to learn more about the world's most 
               famous structures in an engaging, interactive way.</p>
          </div>
        </div>
      </div>
    </div>
  );
}