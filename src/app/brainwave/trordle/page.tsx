// src/app/brainwave/trordle/page.tsx - REDESIGNED
'use client';

import TrordleComponent from '@/components/brainwave/TrordleComponent';
import { getDailyTrordle } from '@/lib/brainwave/trordle/trordle-sb';
import MuteButton from '@/components/common/MuteButton';
import { Suspense, useState, useEffect } from 'react';
import { TrordleData } from '@/lib/brainwave/trordle/trordle-logic';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { HelpCircle, Target, Users, Clock, Trophy, Brain, Sparkles } from 'lucide-react';

function TrordleContent() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const [trordleData, setTrordleData] = useState<TrordleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [currentDate] = useState(new Date());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Trordle
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'History', 'Science', 'Pop Culture']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Trordle - Daily Trivia Puzzle | Triviaah',
      description: 'Guess the answer to today\'s trivia puzzle with limited attempts. Wordle-style trivia game that tests your knowledge across history, science, pop culture, and more.',
      url: 'https://triviaah.com/brainwave/trordle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Trordle',
        description: 'Daily trivia puzzle combining Wordle mechanics with trivia questions. Players guess answers based on attribute feedback across multiple categories.',
        gameLocation: 'https://triviaah.com/brainwave/trordle',
        characterAttribute: 'Trivia, General Knowledge, History, Science, Geography, Pop Culture, Educational Games'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Trordle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Trordle is a daily trivia puzzle game that combines the challenge of trivia questions with the word-guessing mechanics of Wordle. Each day features a new trivia question where you need to guess the answer in 6 attempts using attribute-based feedback.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Trordle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Read the daily trivia question and try to guess the answer from the available options. You have 6 attempts to get it right. After each guess, you\'ll get feedback on which attributes are correct (green), partially correct (yellow), or incorrect (gray).'
          }
        },
        {
          '@type': 'Question',
          name: 'What types of trivia questions are included?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Trordle features a wide variety of trivia categories including history, science, pop culture, geography, sports, art, literature, and more. The questions are designed to be challenging but accessible to general knowledge enthusiasts.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Trordle educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Trordle is designed to be both fun and educational. Players learn interesting facts, historical events, scientific concepts, and cultural knowledge while playing. It\'s great for trivia lovers and anyone looking to expand their general knowledge.'
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

  useEffect(() => {
    const fetchDailyTrordle = async () => {
      if (!targetDate) return; // Wait for target date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyTrordle(targetDate);
        
        if (!data) {
          setError('No puzzle available for today');
          return;
        }
        
        setTrordleData(data);

        // Update structured data with today's puzzle info
        setStructuredData(prev => ({
          ...prev,
          webpage: {
            ...prev.webpage,
            dateModified: new Date().toISOString()
          }
        }));
        
      } catch (err) {
        console.error('Error fetching daily trordle:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyTrordle();
  }, [targetDate]);

  // Loading State
  if (isLoading || !targetDate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
        {/* Structured Data */}
        <Script
          id="trordle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="trordle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="trordle-faq-schema"
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
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-2xl">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                TRORDLE
              </h1>
            </div>
            <p className="text-gray-200 text-lg">Daily Trivia Guessing Challenge</p>
          </div>

          {/* Loading Card */}
          <div className="bg-green-800/50 backdrop-blur-lg rounded-3xl border border-green-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
                <HelpCircle className="w-10 h-10 text-green-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Loading Today&apos;s Trivia</h2>
            <p className="text-green-200 mb-6">Preparing your knowledge challenge...</p>
            
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
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
  if (error || !trordleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-black text-white">
        {/* Structured Data */}
        <Script
          id="trordle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="trordle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="trordle-faq-schema"
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
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-2xl">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                TRORDLE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Trivia Guessing Challenge</p>
          </div>

          {/* Error Card */}
          <div className="bg-green-500/10 backdrop-blur-lg rounded-3xl border border-green-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Challenge Unavailable</h2>
            <p className="text-green-200 mb-6">We couldn&apos;t load today&apos;s trivia puzzle.</p>
            
            <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 mb-6">
              <p className="text-green-300 text-sm">{error || 'No puzzle available for today'}</p>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
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
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-black text-white">
      {/* Structured Data */}
      <Script
        id="trordle-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="trordle-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="trordle-faq-schema"
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
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-2xl shadow-lg">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                TRORDLE
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-green-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-green-400 text-sm font-medium"
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
          
          <p className="text-gray-300 text-lg mb-2">Guess the trivia answer from 5 attributes in 6 attempts</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Daily Challenge</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Trivia Enthusiasts</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-sm">6 Attempts</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Brain className="w-5 h-5 text-purple-500" />
              <span className="text-sm">5 Attributes</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        {trordleData && <TrordleComponent initialData={trordleData} />}

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6 relative z-10">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none p-4 hover:bg-gray-700/30 rounded-2xl transition-all duration-300">
              <h2 className="text-xl font-bold text-white">Game Guide & FAQ</h2>
              <span className="text-green-400 group-open:rotate-180 transition-transform duration-300 text-2xl">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-6 pt-6 border-t border-gray-700">
              <div className="grid gap-4">
                {[
                  {
                    question: "What is Trordle?",
                    answer: "Trordle is a daily trivia puzzle game that combines the challenge of trivia questions with the attribute-guessing mechanics of Wordle. Each day features a new trivia question where you need to guess the answer in 6 attempts using feedback across 5 different attributes."
                  },
                  {
                    question: "How do I play Trordle?",
                    answer: "Read the daily trivia question and try to guess the answer from the available options. You have 6 attempts to get it right. After each guess, you'll get feedback on which attributes are correct (green), partially correct (yellow), or incorrect (gray). Use this feedback to narrow down your choices."
                  },
                  {
                    question: "What types of trivia questions are included?",
                    answer: "Trordle features a wide variety of trivia categories including history, science, pop culture, geography, sports, art, literature, music, and more. The questions are designed to be challenging but accessible to general knowledge enthusiasts of all levels."
                  },
                  {
                    question: "What do the attribute colors mean?",
                    answer: "🟩 Green: This attribute is exactly correct • 🟨 Yellow: This attribute is partially correct or related • ⬜ Gray: This attribute is incorrect. Use these clues to eliminate options and make educated guesses."
                  },
                  {
                    question: "Is Trordle educational?",
                    answer: "Yes! Trordle is designed to be both fun and educational. Players learn interesting facts, historical events, scientific concepts, cultural knowledge, and more while playing. It's great for trivia lovers, students, and anyone looking to expand their general knowledge in an engaging way."
                  },
                  {
                    question: "Is Trordle free to play?",
                    answer: "Yes! Trordle is completely free to play with no registration required. New trivia puzzles are available every day at midnight local time. Perfect for daily mental exercise and learning new facts."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-2xl p-4">
                    <h3 className="font-semibold text-green-400 mb-2">{faq.question}</h3>
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
            <h2>Trordle - Daily Trivia Guessing Game</h2>
            <p itemProp="description">
              Test your general knowledge with Trordle, a daily puzzle game where you guess trivia 
              answers based on attribute feedback across multiple categories. Educational and fun 
              for trivia enthusiasts of all ages. Perfect for history buffs, science lovers, pop 
              culture fans, and anyone interested in learning fascinating facts through engaging gameplay.
            </p>
            <h3>How to Play Trordle:</h3>
            <ul>
              <li>Guess the trivia answer in 6 attempts</li>
              <li>Get attribute feedback for each guess</li>
              <li>Use progressive hints that unlock with each attempt</li>
              <li>Learn interesting facts across multiple categories</li>
              <li>New trivia puzzle every day</li>
              <li>Completely free with no registration required</li>
              <li>Educational and entertaining for all ages</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily trivia challenges across diverse categories</li>
              <li>Attribute-based feedback system</li>
              <li>Progressive hint system</li>
              <li>Comprehensive trivia database</li>
              <li>Mobile-friendly design</li>
              <li>No time pressure - play at your own pace</li>
              <li>Learn fascinating facts and historical events</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Expand general knowledge across multiple subjects</li>
              <li>Learn historical events and timelines</li>
              <li>Understand scientific concepts and discoveries</li>
              <li>Discover cultural and geographical facts</li>
              <li>Improve critical thinking and deduction skills</li>
              <li>Enhance memory and recall abilities</li>
            </ul>
            <p><strong>Perfect for:</strong> Trivia enthusiasts, students, educators, history buffs, 
               science lovers, and anyone wanting to expand their knowledge in an engaging, interactive way.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrordlePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    }>
      <TrordleContent />
    </Suspense>
  );
}