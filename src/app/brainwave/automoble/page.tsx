// src/app/automobile/page.tsx
'use client';

import AutomobleComponent from '@/components/brainwave/AutomobleComponent';
import { getDailyCar, AutomoblePuzzle } from '@/lib/brainwave/automoble/automoble-sb';
import MuteButton from '@/components/common/MuteButton';
import { Suspense, useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { Car, Target, Users, Clock, Trophy, Zap, Wrench } from 'lucide-react';

function AutomobleContent() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const [automobileData, setAutomobileData] = useState<AutomoblePuzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [currentDate] = useState(new Date());
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
      name: 'Automoble - Daily Vehicle Guessing Game | Triviaah',
      description: 'Guess the vehicle from progressive clues with limited attempts! Wordle-style feedback on model names. Unlock more hints with each wrong guess.',
      url: 'https://triviaah.com/brainwave/automoble',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Automoble',
        description: 'Daily vehicle guessing game where players have 6 attempts to guess the target vehicle using progressive clues and letter feedback.',
        gameLocation: 'https://triviaah.com/brainwave/automoble',
        characterAttribute: 'Cars, Vehicles, Automotive, Brands, Models, Engineering'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Automoble?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Automoble is a daily vehicle puzzle game where you guess the target car or vehicle in 6 attempts. It features progressive clues and Wordle-style letter feedback to help you solve the puzzle.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Automoble?',
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
          name: 'Is Automoble free to play?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Automoble is completely free to play with no registration required. New vehicle puzzles are available every day.'
          }
        }
      ]
    }
  });

  // Parse date parameter
  useEffect(() => {
    let date = currentDate;
    if (dateParam) {
      const parsed = new Date(dateParam + 'T00:00:00');
      if (!isNaN(parsed.getTime()) && parsed <= currentDate) {
        date = parsed;
      }
    }
    setTargetDate(date);
    setLastUpdated(new Date().toISOString());
  }, [dateParam, currentDate]);
  
  // Fetch puzzle for the target date
  useEffect(() => {
    if (!targetDate) return;

    const fetchPuzzle = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getDailyCar(targetDate);
        if (!data) {
          setError('No puzzle available for this date');
          return;
        }

        setAutomobileData(data.puzzle);
      } catch (err) {
        console.error('Error fetching daily car:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPuzzle();
  }, [targetDate]);


  // Loading State
  if (isLoading || !currentDate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-900">
        {/* Structured Data */}
        <Script
          id="automoble-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="automoble-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="automoble-faq-schema"
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
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-2xl">
                <Car className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                AUTOMOBLE
              </h1>
            </div>
            <p className="text-gray-200 text-lg">Daily Vehicle Guessing Challenge</p>
          </div>

          {/* Loading Card */}
          <div className="bg-red-800/50 backdrop-blur-lg rounded-3xl border border-red-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                <Car className="w-10 h-10 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Loading Today&apos;s Vehicle</h2>
            <p className="text-red-200 mb-6">Revving up your automotive puzzle...</p>
            
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className="w-2 h-2 bg-red-400 rounded-full animate-pulse"
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
  if (error || !automobileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-black text-white">
        {/* Structured Data */}
        <Script
          id="automoble-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="automoble-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="automoble-faq-schema"
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
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-2xl">
                <Car className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                AUTOMOBLE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Vehicle Guessing Challenge</p>
          </div>

          {/* Error Card */}
          <div className="bg-red-500/10 backdrop-blur-lg rounded-3xl border border-red-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Challenge Unavailable</h2>
            <p className="text-red-200 mb-6">We couldn&apos;t load today&apos;s vehicle puzzle.</p>
            
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-6">
              <p className="text-red-300 text-sm">{error || 'No puzzle available for today'}</p>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
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
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-black text-white">
      {/* Structured Data */}
      <Script
        id="automoble-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="automoble-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="automoble-faq-schema"
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
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-2xl shadow-lg">
                <Car className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                AUTOMOBLE
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-red-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-red-400 text-sm font-medium"
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
          
          <p className="text-gray-300 text-lg mb-2">Guess the car from pixelated image and progressive clues in 6 attempts</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Daily Challenge</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Global Car Enthusiasts</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-red-500" />
              <span className="text-sm">6 Attempts</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Wrench className="w-5 h-5 text-orange-500" />
              <span className="text-sm">Progressive Hints</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-5 h-5 text-emerald-500" />
              <span className="text-sm">Letter Feedback</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        {automobileData && <AutomobleComponent initialData={automobileData} />}

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6 relative z-10">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none p-4 hover:bg-gray-700/30 rounded-2xl transition-all duration-300">
              <h2 className="text-xl font-bold text-white">Game Guide & FAQ</h2>
              <span className="text-red-400 group-open:rotate-180 transition-transform duration-300 text-2xl">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-6 pt-6 border-t border-gray-700">
              <div className="grid gap-4">
                {[
                  {
                    question: "What is Automoble?",
                    answer: "Automoble is a daily vehicle puzzle game where you guess the target car or vehicle in 6 attempts. It features progressive clues, Wordle-style letter feedback, and a pixelated image that becomes clearer with each guess. It's an educational game that teaches about different vehicles, manufacturers, and automotive history."
                  },
                  {
                    question: "How do I play Automoble?",
                    answer: "You have 6 attempts to guess the daily vehicle. Start with a pixelated image and basic clues about the car's category, era, and country of origin. With each wrong guess, you unlock more detailed hints. You also get Wordle-style letter feedback on the vehicle's name to help you narrow down possibilities."
                  },
                  {
                    question: "What types of clues are provided?",
                    answer: "Clues are revealed progressively: basic info (make, decade, country), type info (vehicle type, fuel, era), technical specs (engine, horsepower, category), performance specs (0-60, top speed, drivetrain), cultural hints (movie appearances, nicknames, design), and final hints (first letter, name length, custom hints)."
                  },
                  {
                    question: "How does the letter feedback work?",
                    answer: "Similar to Wordle, letters in your guess are color-coded: green for correct letter in correct position, yellow for correct letter in wrong position, and gray for letters not in the vehicle's name. This helps you deduce the correct vehicle name through logical deduction."
                  },
                  {
                    question: "Is Automoble educational?",
                    answer: "Yes! Automoble is designed to be both fun and educational. Players learn about automotive history, different manufacturers, vehicle specifications, engineering concepts, and cultural aspects of automobiles from around the world."
                  },
                  {
                    question: "Is Automoble free to play?",
                    answer: "Yes! Automoble is completely free to play with no registration required. New vehicle puzzles are available every day at midnight local time. We support the game through optional non-intrusive advertisements."
                  },
                  {
                    question: "What types of vehicles are included?",
                    answer: "The game features a wide variety of vehicles including classic cars, modern supercars, concept vehicles, iconic production models, racing cars, and culturally significant automobiles from different eras and countries around the world."
                  },
                  {
                    question: "How does the pixelated image work?",
                    answer: "The vehicle image starts heavily pixelated and becomes clearer with each attempt. Each wrong guess reveals 15% more of the image (up to 75% after 5 attempts). When you win or lose, the full image is revealed to show you the complete vehicle."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-2xl p-4">
                    <h3 className="font-semibold text-red-400 mb-2">{faq.question}</h3>
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
            <h2>Automoble - Daily Vehicle Guessing Game</h2>
            <p itemProp="description">
              Test your automotive knowledge with Automoble, a daily puzzle game where you guess vehicles 
              from pixelated images and progressive clues. Similar to Wordle but focused on automotive knowledge 
              and vehicle identification. Perfect for car enthusiasts, mechanics, engineers, and anyone who loves vehicles.
            </p>
            <h3>How to Play Automoble:</h3>
            <ul>
              <li>Guess the target vehicle in 6 attempts</li>
              <li>Watch the pixelated image reveal more details with each guess</li>
              <li>Get progressive clues that become more specific with each wrong guess</li>
              <li>Receive Wordle-style letter feedback on vehicle names</li>
              <li>Use hints about manufacturer, vehicle type, year, and specifications</li>
              <li>New vehicle puzzle every day</li>
              <li>Completely free with no registration required</li>
              <li>Educational and entertaining for all ages</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily vehicle challenges with pixelated image reveal</li>
              <li>Progressive hint system across 6 categories</li>
              <li>Wordle-inspired letter feedback mechanics</li>
              <li>Comprehensive vehicle database from classic to modern cars</li>
              <li>Mobile-friendly dark mode design</li>
              <li>No time pressure - play at your own pace</li>
              <li>Learn interesting facts about automotive history and engineering</li>
              <li>Image gallery with zoom functionality</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Learn about automotive history and engineering</li>
              <li>Understand different vehicle specifications and classifications</li>
              <li>Explore car manufacturers from around the world</li>
              <li>Discover cultural significance of iconic vehicles</li>
              <li>Improve deductive reasoning and pattern recognition skills</li>
            </ul>
            <p><strong>Perfect for:</strong> Car enthusiasts, automotive professionals, engineering students, 
               collectors, racing fans, mechanics, and anyone wanting to test their knowledge of vehicles 
               from classic cars to modern supercars and concept vehicles.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AutomoblePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    }>
      <AutomobleContent />
    </Suspense>
  );
}