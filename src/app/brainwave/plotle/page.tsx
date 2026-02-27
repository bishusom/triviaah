// src/app/plotle/page.tsx - REDESIGNED
'use client';

import PlotleComponent from '@/components/brainwave/PlotleComponent';
import { getDailyPlotle } from '@/lib/brainwave/plotle/plotle-sb';
import MuteButton from '@/components/common/MuteButton';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlotleData } from '@/lib/brainwave/plotle/plotle-logic';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { Film, Target, Users, Clock, Trophy } from 'lucide-react';

function PlotleContent() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const [plotleData, setPlotleData] = useState<PlotleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [currentDate] = useState(new Date());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

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

        const data = await getDailyPlotle(targetDate);
        if (!data) {
          setError('No puzzle available for this date');
          return;
        }

        setPlotleData(data);
      } catch (err) {
        console.error('Error fetching daily plotle:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPuzzle();
  }, [targetDate]);

  // Structured data remains the same...
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Movie Games', 'Film Puzzles', 'Cinema Education']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Plotle - Daily Movie Plot Puzzle | Triviaah',
      description: 'Guess the movie from its 6-word plot summary with limited attempts, Wordle-style feedback on plot words. Daily movie guessing game for film lovers.',
      url: 'https://triviaah.com/brainwave/plotle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Plotle',
        description: 'Daily movie puzzle game where players identify films based on 6-word plot summaries with Wordle-style feedback on plot words and limited attempts.',
        gameLocation: 'https://triviaah.com/brainwave/plotle',
        characterAttribute: 'Movies, Films, Cinema, Plot, Entertainment, Hollywood, Film Trivia, Movie Quotes'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Plotle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Plotle is a daily movie puzzle game where you guess the film using emoji clues with limited attempts. It\'s the ultimate movie guessing challenge for film enthusiasts.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Plotle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You have 6 attempts to guess the daily movie. The movie poster is gradually revealed with each guess, and you get progressive hints to help you solve the puzzle.'
          }
        },
        {
          '@type': 'Question',
          name: 'What makes Plotle special?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Plotle combines the addictive puzzle format with movie trivia, using emoji clues and gradual poster reveals that challenge your film knowledge while being fun and educational.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Plotle free to play?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Plotle is completely free to play with no registration required. New movie puzzles are available every day.'
          }
        }
      ]
    }
  });

  useEffect(() => {
    const fetchDailyPlotle = async () => {
      if (!currentDate) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getDailyPlotle(currentDate);
        
        if (!data) {
          setError('No puzzle available for today');
          return;
        }
        
        setPlotleData(data);

        setStructuredData(prev => ({
          ...prev,
          webpage: {
            ...prev.webpage,
            dateModified: new Date().toISOString()
          }
        }));
        
      } catch (err) {
        console.error('Error fetching daily plotle:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyPlotle();
  }, [currentDate]);

  // Loading State
  if (isLoading || !currentDate || !plotleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-900">
        {/* Structured Data */}
        <Script
          id="plotle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="plotle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="plotle-faq-schema"
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
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-2xl">
                <Film className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                PLOTLE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Movie Guessing Challenge</p>
          </div>

          {/* Loading Card */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                <Film className="w-10 h-10 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Loading Today's Challenge</h2>
            <p className="text-gray-400 mb-6">Preparing your movie puzzle...</p>
            
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
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        {/* Structured Data */}
        <Script
          id="plotle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="plotle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="plotle-faq-schema"
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
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-2xl">
                <Film className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                PLOTLE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Movie Guessing Challenge</p>
          </div>

          {/* Error Card */}
          <div className="bg-red-500/10 backdrop-blur-lg rounded-3xl border border-red-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Challenge Unavailable</h2>
            <p className="text-red-200 mb-6">We couldn't load today's movie puzzle.</p>
            
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-6">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Structured Data */}
      <Script
        id="plotle-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="plotle-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="plotle-faq-schema"
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
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-2xl shadow-lg">
                <Film className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                PLOTLE
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
          
          <p className="text-gray-300 text-lg mb-2">Guess the movie from emoji clues in 6 attempts</p>
          
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
        <div className="fixed right-4 z-90" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        <PlotleComponent initialData={plotleData} />

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
                    question: "What is Plotle?",
                    answer: "Plotle is a daily movie puzzle game where you guess the film from emoji clues in 6 attempts. The movie poster is gradually revealed with each guess, and you get progressive hints to help solve the puzzle."
                  },
                  {
                    question: "How do I play Plotle?",
                    answer: "You have 6 attempts to guess the daily movie. Use the emoji clues and gradually revealed movie poster to identify the film. Each wrong guess reveals more of the poster and unlocks additional hints."
                  },
                  {
                    question: "Are hints provided?",
                    answer: "Yes! Progressive hints are unlocked with each attempt, including release year, genre, director, actors, and more. The movie poster also becomes clearer with each guess."
                  },
                  {
                    question: "Is Plotle free to play?",
                    answer: "Yes! Plotle is completely free to play with no registration required. New movie puzzles are available every day at midnight local time."
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
      </div>
    </div>
  );
}

export default function PlotlePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    }>
      <PlotleContent />
    </Suspense>
  );
}