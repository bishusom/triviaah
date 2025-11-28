// src/app/brainwave/synonymle/page.tsx - REDESIGNED
'use client';

import SynonymleComponent from '@/components/brainwave/SynonymleComponent';
import { getDailySynonymle } from '@/lib/brainwave/synonymle/synonymle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import { SynonymleData } from '@/lib/brainwave/synonymle/synonymle-logic';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { BookOpen, Target, Users, Clock, Trophy, Brain, TrendingUp } from 'lucide-react';

export default function SynonymlePage() {
  const [synonymleData, setSynonymleData] = useState<SynonymleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Synonymle
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Word Games', 'Vocabulary Puzzles', 'Language Education']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Synonymle - Daily Word Puzzle | Triviaah',
      description: 'Guess the word based on semantic similarity and synonyms. Wordle-style vocabulary puzzle game that tests your understanding of word meanings and relationships.',
      url: 'https://triviaah.com/brainwave/synonymle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Synonymle',
        description: 'Daily word guessing puzzle based on semantic similarity and synonyms. Players guess words and get similarity scores based on meaning and shared synonyms.',
        gameLocation: 'https://triviaah.com/brainwave/synonymle',
        characterAttribute: 'Vocabulary, Word Games, Semantic Analysis, Synonyms, Language Skills, Educational Games'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Synonymle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Synonymle is a daily word puzzle game where you guess words based on semantic similarity and shared synonyms. Unlike traditional word games, Synonymle focuses on meaning and vocabulary relationships rather than letter positions.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Synonymle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Enter words and see how semantically similar they are to the target word. The similarity percentage shows how close your guess is in meaning. Use the shared synonyms list to help identify the target word. You have 6 attempts to guess correctly.'
          }
        },
        {
          '@type': 'Question',
          name: 'What does the similarity percentage mean?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The similarity percentage represents how closely related your guessed word is to the target word in terms of meaning, based on semantic analysis and shared synonyms. Higher percentages mean the words are more closely related.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Synonymle educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Synonymle is designed to be both fun and educational. Players learn about word relationships, synonyms, and vocabulary while playing. It\'s great for students, writers, and anyone looking to improve their language skills.'
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
    const fetchDailySynonymle = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailySynonymle(currentDate);
        
        if (!data) {
          setError('No puzzle available for today');
          return;
        }
        
        setSynonymleData(data);

        // Update structured data with today's puzzle info
        setStructuredData(prev => ({
          ...prev,
          webpage: {
            ...prev.webpage,
            dateModified: new Date().toISOString()
          }
        }));
        
      } catch (err) {
        console.error('Error fetching daily synonymle:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailySynonymle();
  }, [currentDate]);

  // Loading State
  if (isLoading || !currentDate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900">
        {/* Structured Data */}
        <Script
          id="synonymle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="synonymle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="synonymle-faq-schema"
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
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                SYNONYMLE
              </h1>
            </div>
            <p className="text-gray-200 text-lg">Daily Word Guessing Challenge</p>
          </div>

          {/* Loading Card */}
          <div className="bg-blue-800/50 backdrop-blur-lg rounded-3xl border border-blue-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                <BookOpen className="w-10 h-10 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Loading Today&apos;s Word</h2>
            <p className="text-blue-200 mb-6">Preparing your vocabulary puzzle...</p>
            
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
  if (error || !synonymleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white">
        {/* Structured Data */}
        <Script
          id="synonymle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="synonymle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="synonymle-faq-schema"
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
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                SYNONYMLE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Word Guessing Challenge</p>
          </div>

          {/* Error Card */}
          <div className="bg-blue-500/10 backdrop-blur-lg rounded-3xl border border-blue-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Challenge Unavailable</h2>
            <p className="text-blue-200 mb-6">We couldn&apos;t load today&apos;s word puzzle.</p>
            
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
        id="synonymle-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="synonymle-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="synonymle-faq-schema"
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
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                SYNONYMLE
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
          
          <p className="text-gray-300 text-lg mb-2">Guess the word based on semantic similarity in 6 attempts</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Daily Challenge</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Word Lovers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-cyan-500" />
              <span className="text-sm">6 Attempts</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Brain className="w-5 h-5 text-purple-500" />
              <span className="text-sm">Semantic Analysis</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        {synonymleData && <SynonymleComponent initialData={synonymleData} />}

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
                    question: "What is Synonymle?",
                    answer: "Synonymle is a daily word puzzle game where you guess words based on semantic similarity and shared synonyms. Unlike traditional word games, Synonymle focuses on meaning and vocabulary relationships rather than letter positions. It's an educational game that helps improve vocabulary and understanding of word relationships."
                  },
                  {
                    question: "How do I play Synonymle?",
                    answer: "You have 6 attempts to guess the daily target word. Enter words and see how semantically similar they are to the target word. The similarity percentage shows how close your guess is in meaning. Use the shared synonyms list and progressive hints to help identify the target word."
                  },
                  {
                    question: "What does the similarity percentage mean?",
                    answer: "The similarity percentage (0-1000) represents how closely related your guessed word is to the target word in terms of meaning, based on semantic analysis and shared synonyms. Higher percentages mean the words are more closely related. Categories range from Freezing (0) to Perfect (990-1000)."
                  },
                  {
                    question: "What are the similarity categories?",
                    answer: "🎉 Perfect (990-1000): Exact match • 🔥 Hot (900-989): Extremely close synonym • ☀️ Warm (700-899): Conceptually related • 💨 Cool (500-699): Broadly related concept • ❄️ Cold (1-499): Semantically distant • 🧊 Freezing (0): No meaningful connection"
                  },
                  {
                    question: "Is Synonymle educational?",
                    answer: "Yes! Synonymle is designed to be both fun and educational. Players learn about word relationships, synonyms, vocabulary, and semantic connections while playing. It's great for students, writers, language learners, and anyone looking to improve their language skills."
                  },
                  {
                    question: "Is Synonymle free to play?",
                    answer: "Yes! Synonymle is completely free to play with no registration required. New word puzzles are available every day at midnight local time."
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
            <h2>Synonymle - Daily Word Guessing Game</h2>
            <p itemProp="description">
              Test your vocabulary and semantic understanding with Synonymle, a daily puzzle game 
              where you guess words based on meaning and synonym relationships. Educational and fun 
              for word enthusiasts of all ages. Perfect for students, writers, and anyone interested 
              in improving their language skills through engaging gameplay.
            </p>
            <h3>How to Play Synonymle:</h3>
            <ul>
              <li>Guess the target word in 6 attempts</li>
              <li>Get semantic similarity scores for each guess</li>
              <li>Use progressive hints that unlock with each attempt</li>
              <li>Learn about word relationships and synonyms</li>
              <li>New word puzzle every day</li>
              <li>Completely free with no registration required</li>
              <li>Educational and entertaining for all ages</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily vocabulary challenges with diverse words</li>
              <li>Semantic analysis and similarity scoring</li>
              <li>Progressive hint system</li>
              <li>Comprehensive word database</li>
              <li>Mobile-friendly design</li>
              <li>No time pressure - play at your own pace</li>
              <li>Learn fascinating word relationships and synonyms</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Improve vocabulary and word knowledge</li>
              <li>Understand semantic relationships between words</li>
              <li>Learn synonyms and word associations</li>
              <li>Enhance language comprehension skills</li>
              <li>Develop critical thinking and pattern recognition</li>
              <li>Expand expressive language abilities</li>
            </ul>
            <p><strong>Perfect for:</strong> Students, writers, language learners, educators, 
               word game enthusiasts, and anyone wanting to improve their vocabulary in an engaging, interactive way.</p>
          </div>
        </div>
      </div>
    </div>
  );
}