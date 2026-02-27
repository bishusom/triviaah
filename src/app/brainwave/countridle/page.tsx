// app/countridle/page.tsx - REDESIGNED
'use client';

import { Suspense, useState, useEffect } from 'react';
import MuteButton from '@/components/common/MuteButton';
import CountridleComponent from '@/components/brainwave/CountridleComponent';
import { getDailyCountry, CountryPuzzle, CountryInfo } from '@/lib/brainwave/countridle/countridle-sb';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { Trophy, Globe, Target, Users, Clock, Flag, Map, Compass } from 'lucide-react';

function CountridleContent() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const [dailyData, setDailyData] = useState<{ puzzle: CountryPuzzle | null, allCountries: CountryInfo[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [currentDate] = useState(new Date());
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

        const data = await getDailyCountry(targetDate);
        if (!data) {
          setError('No puzzle available for this date');
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
        console.error('Error fetching daily country:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPuzzle();
  }, [targetDate]);

  // Loading State
  if (isLoading || !currentDate || !dailyData || !dailyData.puzzle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900">
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
              <div className="bg-gradient-to-r from-emerald-400 to-green-500 p-3 rounded-2xl">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                COUNTRIDLE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Country Guessing Challenge</p>
          </div>

          {/* Loading Card */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
                <Map className="w-10 h-10 text-emerald-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Loading Country Challenge</h2>
            <p className="text-gray-400 mb-6">Preparing your geography puzzle with flags and maps...</p>
            
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
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
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900">
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
              <div className="bg-gradient-to-r from-emerald-400 to-green-500 p-3 rounded-2xl">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                COUNTRIDLE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Country Guessing Challenge</p>
          </div>

          {/* Error Card */}
          <div className="bg-red-500/10 backdrop-blur-lg rounded-3xl border border-red-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Challenge Unavailable</h2>
            <p className="text-red-200 mb-6">We couldn't load today's country puzzle.</p>
            
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-6">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900 text-white">
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
              <div className="bg-gradient-to-r from-emerald-400 to-green-500 p-3 rounded-2xl shadow-lg">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                COUNTRIDLE
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-emerald-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-emerald-400 text-sm font-medium"
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
          
          <p className="text-gray-300 text-lg mb-2">Guess the country in 6 attempts with flags and maps</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Daily Challenge</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Flag className="w-5 h-5 text-red-500" />
              <span className="text-sm">Flag Recognition</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Map className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Map Skills</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-purple-500" />
              <span className="text-sm">6 Attempts</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        <CountridleComponent 
          initialData={dailyData.puzzle} 
          allCountries={dailyData.allCountries}
        />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none p-4 hover:bg-gray-700/30 rounded-2xl transition-all duration-300">
              <h2 className="text-xl font-bold text-white">Game Guide & FAQ</h2>
              <span className="text-emerald-400 group-open:rotate-180 transition-transform duration-300 text-2xl">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-6 pt-6 border-t border-gray-700">
              <div className="grid gap-4">
                {[
                  {
                    question: "What is countridle?",
                    answer: "countridle is a daily geography puzzle game where you guess the target country in 6 attempts. It uses progressive hints including flags, country outlines, geographical coordinates, and statistical comparisons."
                  },
                  {
                    question: "How do I play countridle?",
                    answer: "You have 6 attempts to guess the daily country. After each guess, you'll get hints: continent, country outline, flag (becomes clearer with wrong guesses), distance/direction, statistical comparisons, and capital/language hints."
                  },
                  {
                    question: "What countries are included?",
                    answer: "countridle includes all 195 UN-recognized sovereign states, focusing on countries that most people would recognize. The game may occasionally include well-known territories and regions for variety."
                  },
                  {
                    question: "Is countridle free to play?",
                    answer: "Yes! countridle is completely free to play with no registration required. New geography puzzles are available every day at midnight local time."
                  },
                  {
                    question: "What makes countridle different?",
                    answer: "countridle combines multiple learning approaches: flag recognition, map identification, geographical coordinates, statistical data comparison, and cultural information. The progressive hint system makes it educational for all skill levels."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-2xl p-4">
                    <h3 className="font-semibold text-emerald-400 mb-2">{faq.question}</h3>
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
              
              {/* Features Section */}
              <div className="mt-8">
                <h3 className="font-bold text-lg text-white mb-4">Game Features:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Flag, text: "Flag recognition training", color: "text-red-400" },
                    { icon: Map, text: "Country outline identification", color: "text-blue-400" },
                    { icon: Globe, text: "Geographical coordinates", color: "text-green-400" },
                    { icon: Compass, text: "Distance & direction hints", color: "text-purple-400" },
                    { icon: Users, text: "Population comparisons", color: "text-yellow-400" },
                    { icon: Target, text: "6 attempts per day", color: "text-cyan-400" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl">
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                      <span className="text-gray-300 text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

export default function CountridlePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    }>
      <CountridleContent />
    </Suspense>
  );
}