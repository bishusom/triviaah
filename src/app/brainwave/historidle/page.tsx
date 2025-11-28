// src/app/brainwave/historidle/page.tsx - REDESIGNED
'use client';

import HistoridleComponent from '@/components/brainwave/HistoridleComponent';
import { getDailyHistoridle } from '@/lib/brainwave/historidle/historidle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import { HistoridleData } from '@/lib/brainwave/historidle/historidle-logic';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { Clock, Target, Users, Trophy, Scroll, Castle } from 'lucide-react';

export default function HistoridlePage() {
  const [historidleData, setHistoridleData] = useState<HistoridleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Historidle
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'History Games', 'Historical Puzzles', 'Educational History']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Historidle - Daily Historical Puzzle | Triviaah',
      description: 'Guess the historical figure or event from 3 dates and progressive clues with limited attempts, Wordle-style feedback. Unlock more historical hints with each wrong guess!',
      url: 'https://triviaah.com/brainwave/historidle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Historidle',
        description: 'Daily historical puzzle game where players identify historical figures or events based on dates, progressive clues, and timeline information with Wordle-style feedback.',
        gameLocation: 'https://triviaah.com/brainwave/historidle',
        characterAttribute: 'History, Historical Figures, Historical Events, Timeline, Education, World History'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Historidle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Historidle is a daily historical puzzle game where you guess the target historical figure or event using dates, progressive clues, and timeline information. It\'s an educational game that teaches about important historical figures and events in a fun, interactive way.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Historidle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You have 6 attempts to guess the daily historical figure or event. Start with date clues and unlock more detailed historical hints with each wrong guess. Use the timeline and progressive clues to narrow down your answer.'
          }
        },
        {
          '@type': 'Question',
          name: 'What types of clues does Historidle provide?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Historidle provides date clues, timeline information (birth/death dates or event dates), progressive text hints that unlock with wrong guesses, and Wordle-style feedback to help you identify the correct historical figure or event.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Historidle educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Historidle is designed to be both fun and educational. Players learn about important historical figures, events, timelines, and historical context while playing. It\'s great for history enthusiasts, students, and anyone interested in learning more about the past.'
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
    const fetchDailyHistoridle = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyHistoridle(currentDate);
        
        if (!data) {
          setError('No puzzle available for today');
          return;
        }
        
        setHistoridleData(data);

        // Update structured data with today's puzzle info
        setStructuredData(prev => ({
          ...prev,
          webpage: {
            ...prev.webpage,
            dateModified: new Date().toISOString()
          }
        }));
        
      } catch (err) {
        console.error('Error fetching daily historidle:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyHistoridle();
  }, [currentDate]);

  // Loading State
  if (isLoading || !currentDate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
        {/* Structured Data */}
        <Script
          id="historidle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="historidle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="historidle-faq-schema"
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
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl">
                <Scroll className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                HISTORIDLE
              </h1>
            </div>
            <p className="text-gray-200 text-lg">Daily Historical Puzzle Challenge</p>
          </div>

          {/* Loading Card */}
          <div className="bg-blue-800/50 backdrop-blur-lg rounded-3xl border border-blue-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                <Scroll className="w-10 h-10 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Loading Today&apos;s History Puzzle</h2>
            <p className="text-blue-200 mb-6">Preparing your historical challenge...</p>
            
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
  if (error || !historidleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white">
        {/* Structured Data */}
        <Script
          id="historidle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="historidle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="historidle-faq-schema"
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
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl">
                <Scroll className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                HISTORIDLE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Historical Puzzle Challenge</p>
          </div>

          {/* Error Card */}
          <div className="bg-blue-500/10 backdrop-blur-lg rounded-3xl border border-blue-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Challenge Unavailable</h2>
            <p className="text-blue-200 mb-6">We couldn&apos;t load today&apos;s historical puzzle.</p>
            
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4 mb-6">
              <p className="text-blue-300 text-sm">{error || 'No puzzle available for today'}</p>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
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
        id="historidle-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="historidle-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="historidle-faq-schema"
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
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
                <Scroll className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                HISTORIDLE
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
          
          <p className="text-gray-300 text-lg mb-2">Guess the historical figure or event from dates and clues in 6 attempts</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Daily Challenge</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Global Historians</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-indigo-500" />
              <span className="text-sm">6 Attempts</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Castle className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Progressive Clues</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        <HistoridleComponent initialData={historidleData} />

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
                    question: "What is Historidle?",
                    answer: "Historidle is a daily historical puzzle game where you guess the target historical figure or event using dates, progressive clues, and timeline information. It's an educational game that teaches about important historical figures and events in a fun, interactive way with Wordle-style mechanics."
                  },
                  {
                    question: "How do I play Historidle?",
                    answer: "You have 6 attempts to guess the daily historical figure or event. Start with date clues and unlock more detailed historical hints with each wrong guess. Use the timeline information and progressive text clues to narrow down your answer. Each guess provides Wordle-style feedback to help you identify the correct historical subject."
                  },
                  {
                    question: "What types of clues does Historidle provide?",
                    answer: "Historidle provides multiple types of clues: Emoji representations of the historical figure or event, timeline information (birth/death dates for figures or event dates), progressive text hints that unlock with wrong guesses, and Wordle-style feedback indicating how close your guess is to the correct answer."
                  },
                  {
                    question: "Is Historidle educational?",
                    answer: "Yes! Historidle is designed to be both fun and educational. Players learn about important historical figures, events, timelines, and historical context while playing. It's great for history enthusiasts, students, educators, and anyone interested in learning more about the past in an engaging way."
                  },
                  {
                    question: "What historical periods are covered?",
                    answer: "Historidle covers a wide range of historical periods from ancient civilizations to modern times, including famous leaders, inventors, artists, scientists, political figures, and significant historical events from around the world."
                  },
                  {
                    question: "Is Historidle free to play?",
                    answer: "Yes! Historidle is completely free to play with no registration required. New historical puzzles are available every day at midnight local time."
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
            <h2>Historidle - Daily Historical Puzzle Game</h2>
            <p itemProp="description">
              Test your history knowledge with Historidle, a daily puzzle game where you guess historical 
              figures or events based on dates, progressive clues, and timeline information. Educational 
              and fun for history enthusiasts of all ages. Perfect for students, educators, and anyone 
              interested in learning more about world history in an engaging, interactive way.
            </p>
            <h3>How to Play Historidle:</h3>
            <ul>
              <li>Guess the historical figure or event in 6 attempts</li>
              <li>Start with date clues and unlock more hints with wrong guesses</li>
              <li>Use timeline information and progressive text clues</li>
              <li>Get Wordle-style feedback on your guesses</li>
              <li>Learn about important historical figures and events</li>
              <li>New historical puzzle every day</li>
              <li>Completely free with no registration required</li>
              <li>Educational and entertaining for all ages</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily history challenges with diverse historical subjects</li>
              <li>Educational historical content and context</li>
              <li>Progressive clue system that reveals more with each guess</li>
              <li>Emoji-based visual hints</li>
              <li>Timeline and date information</li>
              <li>Wordle-style feedback mechanics</li>
              <li>Comprehensive historical database</li>
              <li>Mobile-friendly design</li>
              <li>No time pressure - play at your own pace</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Learn about important historical figures and their contributions</li>
              <li>Understand historical timelines and context</li>
              <li>Explore different historical periods and civilizations</li>
              <li>Develop critical thinking and deductive reasoning skills</li>
              <li>Improve historical knowledge and cultural awareness</li>
            </ul>
            <p><strong>Perfect for:</strong> History enthusiasts, students, educators, trivia lovers, 
               lifelong learners, and anyone wanting to improve their historical knowledge in a fun, 
               engaging way.</p>
          </div>
        </div>
      </div>
    </div>
  );
}