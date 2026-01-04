// app/capitale/page.tsx - REDESIGNED
'use client';

import { useState, useEffect } from 'react';

import MuteButton from '@/components/common/MuteButton';
import CapitaleComponent from '@/components/brainwave/CapitaleComponent';
import { getDailyCapitale, CapitalePuzzle, CapitalInfo } from '@/lib/brainwave/capitale/capitale-sb';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { Trophy, Globe, Target, Users, Clock } from 'lucide-react';

export default function CapitalePage() {
  const [dailyData, setDailyData] = useState<{ puzzle: CapitalePuzzle | null, allCapitals: CapitalInfo[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';
  const [showFAQ, setShowFAQ] = useState(false);


  // Structured data remains the same
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Geography Games', 'Capital Cities']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Capitale - Daily Capital City Guessing Game | Triviaah',
      description: 'Guess the world capital city in 6 tries! Daily geography puzzle game similar to Wordle but with capital cities.',
      url: 'https://triviaah.com/capitale',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Capitale',
        description: 'Daily capital city guessing game where players have 6 attempts to guess the target capital city.',
        gameLocation: 'https://triviaah.com/capitale',
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
  });;

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now);
    setLastUpdated(now.toISOString());
  }, []);

  useEffect(() => {
    const fetchDailyCapitale = async () => {
      if (!currentDate) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getDailyCapitale(currentDate);
        
        if (!data.puzzle) {
          setError('No puzzle available for today');
          return;
        }
        
        setDailyData(data);

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

  // Loading State
  if (isLoading || !currentDate || !dailyData || !dailyData.puzzle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-900">
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
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-2xl">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                CAPITALE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Capital City Challenge</p>
          </div>

          {/* Loading Card */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                <Target className="w-10 h-10 text-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Loading Today's Challenge</h2>
            <p className="text-gray-400 mb-6">Preparing your geography puzzle...</p>
            
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Structured Data - same as before */}
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

        {/* Ads - same as before */}
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
          min-h-screen bg-gradient-to-br from-gray-900 to-black text-white
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-2xl">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                CAPITALE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Capital City Challenge</p>
          </div>

          {/* Error Card */}
          <div className="bg-red-500/10 backdrop-blur-lg rounded-3xl border border-red-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Challenge Unavailable</h2>
            <p className="text-red-200 mb-6">We couldn't load today's capital city puzzle.</p>
            
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-6">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
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
    <div className="min-h-screen bg-gradient-to-br bg-gradient-to-br from-gray-900 to-black text-white">
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
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-2xl shadow-lg">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                CAPITALE
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-cyan-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-cyan-400 text-sm font-medium"
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
          
          <p className="text-gray-300 text-lg mb-2">Guess the world capital in 6 attempts</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Daily Challenge</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-5 h-5 text-green-500" />
              <span className="text-sm">Global Players</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-red-500" />
              <span className="text-sm">6 Attempts</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        <CapitaleComponent 
          initialData={dailyData.puzzle} 
          allCapitals={dailyData.allCapitals}
        />

        {/* Enhanced FAQ Section - Updated with lower z-index */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6 relative z-0"> {/* Changed z-10 to z-0 */}
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none p-4 hover:bg-gray-700/30 rounded-2xl transition-all duration-300">
              <h2 className="text-xl font-bold text-white">Game Guide & FAQ</h2>
              <span className="text-cyan-400 group-open:rotate-180 transition-transform duration-300 text-2xl">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-6 pt-6 border-t border-gray-700">
              {/* ... FAQ content ... */}
              <div className="grid gap-4">
                {[
                  {
                    question: "What is Capitale?",
                    answer: "Capitale is a daily geography puzzle game where you guess the target capital city in 6 attempts. It's similar to Wordle but focused on world capitals and geography knowledge."
                  },
                  {
                    question: "How do I play Capitale?",
                    answer: "You have 6 attempts to guess the daily capital city. After each guess, you'll get feedback on how close your guess is. The game updates daily with a new capital city challenge."
                  },
                  {
                    question: "Are hints provided?",
                    answer: "Yes! After each guess, you'll see distance and direction indicators showing how far your guess is from the target capital, along with continent information to help narrow down possibilities."
                  },
                  {
                    question: "Is Capitale free to play?",
                    answer: "Yes! Capitale is completely free to play with no registration required. New geography puzzles are available every day at midnight local time."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-2xl p-4">
                    <h3 className="font-semibold text-cyan-400 mb-2">{faq.question}</h3>
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}