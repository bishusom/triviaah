// src/app/inventionle/page.tsx - REDESIGNED
'use client';

import InventionleComponent from '@/components/brainwave/InventionleComponent';
import { getDailyInvention, InventionPuzzle } from '@/lib/brainwave/inventionle/inventionle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { Zap, Target, Users, Clock, Trophy, Flame, Lightbulb } from 'lucide-react';

export default function InventionlePage() {
  const [inventionData, setInventionData] = useState<{puzzle: InventionPuzzle | null} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Inventionle
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Science Games', 'Invention Puzzles', 'Technology Education']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Inventionle - Daily Invention Puzzle | Triviaah',
      description: 'Guess the invention from its 6 attributes: inventor, year, category, country, purpose, and impact. Wordle-style invention guessing game.',
      url: 'https://triviaah.com/brainwave/inventionle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Inventionle',
        description: 'Daily invention guessing game where players identify inventions based on 6 key attributes: inventor, year, category, country, purpose, and impact.',
        gameLocation: 'https://triviaah.com/brainwave/inventionle',
        characterAttribute: 'Inventions, Technology, Science, Innovation, History, Inventors, Patents'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Inventionle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Inventionle is a daily invention puzzle game where you guess the target invention using 6 key attributes: inventor, year, category, country, purpose, and impact. It\'s an educational game that teaches about technological innovations and their history.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Inventionle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You have 6 attempts to guess the daily invention. Use the 6 attribute categories to narrow down possibilities. Each guess provides feedback on which attributes match the target invention.'
          }
        },
        {
          '@type': 'Question',
          name: 'What are the 6 attributes in Inventionle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The 6 attributes are: Inventor (who created it), Year (when it was invented), Category (technology, medicine, transportation, etc.), Country (where it was invented), Purpose (what problem it solves), and Impact (how it changed the world).'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Inventionle educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Inventionle is designed to be both fun and educational. Players learn about important inventions, their inventors, historical context, and technological impact while playing.'
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
    const fetchDailyInvention = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyInvention(currentDate);
        
        if (!data || !data.puzzle) {
          setError('No puzzle available for today');
          return;
        }
        
        setInventionData(data);

        // Update structured data with today's puzzle info
        setStructuredData(prev => ({
          ...prev,
          webpage: {
            ...prev.webpage,
            dateModified: new Date().toISOString()
          }
        }));
        
      } catch (err) {
        console.error('Error fetching daily invention:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyInvention();
  }, [currentDate]);

  // Loading State
  if (isLoading || !currentDate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900">
        {/* Structured Data */}
        <Script
          id="inventionle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="inventionle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="inventionle-faq-schema"
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
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-3 rounded-2xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
                INVENTIONLE
              </h1>
            </div>
            <p className="text-gray-200 text-lg">Daily Innovation Guessing Challenge</p>
          </div>

          {/* Loading Card */}
          <div className="bg-indigo-800/50 backdrop-blur-lg rounded-3xl border border-indigo-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div>
                <Zap className="w-10 h-10 text-indigo-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Loading Today&apos;s Invention</h2>
            <p className="text-indigo-200 mb-6">Preparing your innovation puzzle...</p>
            
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
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
  if (error || !inventionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white">
        {/* Structured Data */}
        <Script
          id="inventionle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="inventionle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="inventionle-faq-schema"
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
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-3 rounded-2xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
                INVENTIONLE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Innovation Guessing Challenge</p>
          </div>

          {/* Error Card */}
          <div className="bg-indigo-500/10 backdrop-blur-lg rounded-3xl border border-indigo-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Challenge Unavailable</h2>
            <p className="text-indigo-200 mb-6">We couldn&apos;t load today&apos;s invention puzzle.</p>
            
            <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-2xl p-4 mb-6">
              <p className="text-indigo-300 text-sm">{error || 'No puzzle available for today'}</p>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white">
      {/* Structured Data */}
      <Script
        id="inventionle-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="inventionle-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="inventionle-faq-schema"
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
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-3 rounded-2xl shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
                INVENTIONLE
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-indigo-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-indigo-400 text-sm font-medium"
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
          
          <p className="text-gray-300 text-lg mb-2">Guess the invention from 6 attributes in 6 attempts</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Daily Challenge</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Global Innovators</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-indigo-500" />
              <span className="text-sm">6 Attempts</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Lightbulb className="w-5 h-5 text-blue-500" />
              <span className="text-sm">6 Attributes</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        {inventionData.puzzle && <InventionleComponent initialData={inventionData as { puzzle: InventionPuzzle }} />}

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6 relative z-10">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none p-4 hover:bg-gray-700/30 rounded-2xl transition-all duration-300">
              <h2 className="text-xl font-bold text-white">Game Guide & FAQ</h2>
              <span className="text-indigo-400 group-open:rotate-180 transition-transform duration-300 text-2xl">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-6 pt-6 border-t border-gray-700">
              <div className="grid gap-4">
                {[
                  {
                    question: "What is Inventionle?",
                    answer: "Inventionle is a daily invention puzzle game where you guess the target invention using 6 key attributes: inventor, year, category, country, purpose, and impact. It's an educational game that teaches about technological innovations and their history in a fun, interactive way."
                  },
                  {
                    question: "How do I play Inventionle?",
                    answer: "You have 6 attempts to guess the daily invention. Use the 6 attribute categories to narrow down possibilities. Each guess provides feedback on which attributes match the target invention, helping you eliminate options and make educated guesses about technological innovations."
                  },
                  {
                    question: "What are the 6 attributes in Inventionle?",
                    answer: "The 6 attributes are: Inventor (the person or people who created the invention), Year (when it was invented or patented), Category (technology, medicine, transportation, communication, household, etc.), Country (where it was invented), Purpose (what problem it solves or need it fulfills), and Impact (how it changed society, industry, or daily life)."
                  },
                  {
                    question: "Is Inventionle educational?",
                    answer: "Yes! Inventionle is designed to be both fun and educational. Players learn about important inventions, their inventors, historical context, and technological impact while playing. It's great for students, technology enthusiasts, and anyone interested in the history of innovation."
                  },
                  {
                    question: "What types of inventions are included?",
                    answer: "Inventionle features a wide variety of inventions from different time periods and categories, including technological breakthroughs, medical advancements, household innovations, transportation developments, communication technologies, and more. The database includes both famous and lesser-known inventions that have shaped our world."
                  },
                  {
                    question: "Is Inventionle free to play?",
                    answer: "Yes! Inventionle is completely free to play with no registration required. New invention puzzles are available every day at midnight local time."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-2xl p-4">
                    <h3 className="font-semibold text-indigo-400 mb-2">{faq.question}</h3>
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
            <h2>Inventionle - Daily Invention Guessing Game</h2>
            <p itemProp="description">
              Test your knowledge of innovations with Inventionle, a daily puzzle game where you guess inventions 
              based on 6 key attributes. Educational and fun for technology enthusiasts of all ages. 
              Perfect for students, inventors, engineers, and anyone interested in the history of technology and innovation.
            </p>
            <h3>How to Play Inventionle:</h3>
            <ul>
              <li>Guess the target invention in 6 attempts</li>
              <li>Use 6 attribute categories to narrow down possibilities</li>
              <li>Get feedback on inventor, year, category, country, purpose, and impact</li>
              <li>Learn about technological innovations and their history</li>
              <li>New invention puzzle every day</li>
              <li>Completely free with no registration required</li>
              <li>Educational and entertaining for all ages</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily innovation challenges with diverse inventions</li>
              <li>Educational technology and history content</li>
              <li>Six attribute categories for strategic guessing</li>
              <li>Comprehensive invention database</li>
              <li>Mobile-friendly design</li>
              <li>No time pressure - play at your own pace</li>
              <li>Learn fascinating facts about inventors and innovations</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Learn about important inventions and their inventors</li>
              <li>Understand technological timelines and historical context</li>
              <li>Explore different categories of innovation</li>
              <li>Discover how inventions solve problems and impact society</li>
              <li>Improve deductive reasoning and problem-solving skills</li>
              <li>Develop appreciation for scientific and technological progress</li>
            </ul>
            <p><strong>Perfect for:</strong> Technology enthusiasts, students, educators, inventors, engineers, 
               history buffs, and anyone curious about how innovations have shaped our modern world.</p>
          </div>
        </div>
      </div>
    </div>
  );
}