// src/app/celebrile/page.tsx - REDESIGNED
'use client';

import CelebrileComponent from '@/components/brainwave/CelebrileComponent';
import { getDailyCelebrile } from '@/lib/brainwave/celebrile/celebrile-sb';
import MuteButton from '@/components/common/MuteButton';
import { Suspense, useState, useEffect } from 'react';
import { CelebrileData } from '@/lib/brainwave/celebrile/celebrile-logic';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { User, Target, Users, Clock, Trophy, Star } from 'lucide-react';

function CelebrileContent() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const [celebrileData, setCelebrileData] = useState<CelebrileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [currentDate] = useState(new Date());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Celebrile
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Celebrity Games', 'Pop Culture Puzzles']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Celebrile - Daily Celebrity Guessing Game | Triviaah',
      description: 'Guess the celebrity from progressive clues with limited attempts! Wordle-style feedback on name letters. Unlock more hints with each wrong guess.',
      url: 'https://triviaah.com/celebrile',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Celebrile',
        description: 'Daily celebrity guessing game where players have 6 attempts to guess the target celebrity using progressive clues and letter feedback.',
        gameLocation: 'https://triviaah.com/celebrile',
        characterAttribute: 'Celebrities, Pop Culture, Entertainment, Famous People'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Celebrile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Celebrile is a daily celebrity puzzle game where you guess the target famous person in 6 attempts. It features progressive clues and Wordle-style letter feedback to help you solve the puzzle.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Celebrile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You have 6 attempts to guess the daily celebrity. Start with basic clues, and get more detailed hints with each wrong guess. You also get letter feedback similar to Wordle.'
          }
        },
        {
          '@type': 'Question',
          name: 'What types of clues are provided?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Clues include profession, nationality, age range, notable works, awards, and other identifying information about the celebrity. Clues become more specific with each attempt.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Celebrile free to play?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Celebrile is completely free to play with no registration required. New celebrity puzzles are available every day.'
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

        const data = await getDailyCelebrile(targetDate);
        if (!data) {
          setError('No puzzle available for this date');
          return;
        }

        setCelebrileData(data);

        // Update structured data with today's puzzle info
        setStructuredData(prev => ({
          ...prev,
          webpage: {
            ...prev.webpage,
            dateModified: new Date().toISOString()
          }
        }));
      } catch (err) {
        console.error('Error fetching daily celebrile:', err);
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
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900">
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
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-2xl">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                CELEBRILE
              </h1>
            </div>
            <p className="text-gray-200 text-lg">Daily Celebrity Guessing Challenge</p>
          </div>

          {/* Loading Card */}
          <div className="bg-purple-800/50 backdrop-blur-lg rounded-3xl border border-purple-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
                <User className="w-10 h-10 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Loading Celebrity Puzzle</h2>
            <p className="text-purple-200 mb-6">Preparing your celebrity puzzle...</p>
            
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
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
  if (error || !celebrileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white">
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
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-2xl">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                CELEBRILE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Celebrity Guessing Challenge</p>
          </div>

          {/* Error Card */}
          <div className="bg-purple-500/10 backdrop-blur-lg rounded-3xl border border-purple-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Challenge Unavailable</h2>
            <p className="text-purple-200 mb-6">We couldn't load today's celebrity puzzle.</p>
            
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-2xl p-4 mb-6">
              <p className="text-purple-300 text-sm">{error || 'No puzzle available for today'}</p>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white">
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
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-2xl shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                CELEBRILE
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-purple-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-purple-400 text-sm font-medium"
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
          
          <p className="text-gray-300 text-lg mb-2">Guess the celebrity from progressive clues in 6 attempts</p>
          
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
              <Target className="w-5 h-5 text-purple-500" />
              <span className="text-sm">6 Attempts</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Star className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Letter Hints</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        <CelebrileComponent initialData={celebrileData} />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6 relative z-10">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none p-4 hover:bg-gray-700/30 rounded-2xl transition-all duration-300">
              <h2 className="text-xl font-bold text-white">Game Guide & FAQ</h2>
              <span className="text-purple-400 group-open:rotate-180 transition-transform duration-300 text-2xl">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-6 pt-6 border-t border-gray-700">
              <div className="grid gap-4">
                {[
                  {
                    question: "What is Celebrile?",
                    answer: "Celebrile is a daily celebrity puzzle game where you guess the target famous person in 6 attempts. It features progressive clues and Wordle-style letter feedback to help you solve the puzzle."
                  },
                  {
                    question: "How do I play Celebrile?",
                    answer: "You have 6 attempts to guess the daily celebrity. Start with basic clues, and get more detailed hints with each wrong guess. You also get letter feedback similar to Wordle to help identify the celebrity's name."
                  },
                  {
                    question: "What types of clues are provided?",
                    answer: "Clues include profession, nationality, age range, notable works, awards, and other identifying information about the celebrity. Clues become more specific and revealing with each attempt."
                  },
                  {
                    question: "How does the letter feedback work?",
                    answer: "Similar to Wordle, letters in your guess are color-coded: green for correct letter in correct position, yellow for correct letter in wrong position, and gray for letters not in the celebrity's name."
                  },
                  {
                    question: "Is Celebrile free to play?",
                    answer: "Yes! Celebrile is completely free to play with no registration required. New celebrity puzzles are available every day at midnight local time."
                  },
                  {
                    question: "What happens if I don't guess correctly in 6 tries?",
                    answer: "If you don't guess the celebrity in 6 attempts, the game will reveal the answer with a complete biography and fun facts. You can try again tomorrow with a new celebrity puzzle!"
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-2xl p-4">
                    <h3 className="font-semibold text-purple-400 mb-2">{faq.question}</h3>
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
            <h2>Celebrile - Daily Celebrity Guessing Game</h2>
            <p itemProp="description">
              Test your pop culture knowledge with Celebrile, a daily puzzle game where you guess famous celebrities 
              from progressive clues. Similar to Wordle but focused on entertainment and celebrity knowledge. 
              Perfect for movie buffs, music fans, and anyone who loves pop culture trivia.
            </p>
            <h3>How to Play Celebrile:</h3>
            <ul>
              <li>Guess the target celebrity in 6 attempts</li>
              <li>Get progressive clues that become more specific with each wrong guess</li>
              <li>Receive Wordle-style letter feedback on celebrity names</li>
              <li>Use hints about profession, nationality, age, and notable works</li>
              <li>New celebrity puzzle every day</li>
              <li>Completely free with no registration required</li>
              <li>Educational and entertaining for all ages</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily celebrity challenges from various fields</li>
              <li>Progressive hint system that adapts to your progress</li>
              <li>Wordle-inspired letter feedback mechanics</li>
              <li>Comprehensive celebrity database</li>
              <li>Mobile-friendly design</li>
              <li>No time pressure - play at your own pace</li>
              <li>Learn interesting facts about famous people</li>
            </ul>
            <p><strong>Perfect for:</strong> Pop culture enthusiasts, entertainment fans, trivia lovers, 
               and anyone wanting to test their knowledge of famous people from movies, music, sports, and more.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CelebrilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    }>
      <CelebrileContent />
    </Suspense>
  );
}