// app/literale/page.tsx - REDESIGNED
'use client';

import { Suspense, useState, useEffect } from 'react';
import MuteButton from '@/components/common/MuteButton';
import { LiteraleData } from '@/lib/brainwave/literale/literale-logic';
import LiteraleComponent from '@/components/brainwave/LiteraleComponent';
import { getDailyLiterale } from '@/lib/brainwave/literale/literale-sb';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Clock, Sparkles, Target, Zap } from 'lucide-react';

function LiteraleContent() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const [literaleData, setLiteraleData] = useState<LiteraleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [currentDate] = useState(new Date());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';


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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Literature Games', 'Book Puzzles', 'Reading Education']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Literale - Daily Literature Puzzle | Triviaah',
      description: 'Guess the book title from opening lines and progressive clues with limited attempts, Wordle-style feedback on title letters. Unlock more hints with each wrong guess!',
      url: 'https://triviaah.com/brainwave/literale',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Literale',
        description: 'Daily literature puzzle game where players identify book titles based on opening lines, progressive clues, and Wordle-style letter feedback with limited attempts.',
        gameLocation: 'https://triviaah.com/brainwave/literale',
        characterAttribute: 'Books, Literature, Reading, Authors, Novels, Classic Literature, Book Quotes, Literary Games'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Literale?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Literale is a daily literature puzzle game where you guess the book title using opening lines, progressive clues, and Wordle-style letter feedback. It\'s an educational game that tests your knowledge of literature and famous books.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Literale?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You have 6 attempts to guess the daily book title. Start with opening lines and unlock more detailed literary hints with each wrong guess. Use Wordle-style letter feedback to identify the correct book title.'
          }
        },
        {
          '@type': 'Question',
          name: 'What types of clues does Literale provide?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Literale provides opening lines from books, progressive text hints that unlock with wrong guesses, book cover images (in some versions), and Wordle-style letter feedback showing which letters are correct and in the right position.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Literale educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Literale is designed to be both fun and educational. Players learn about famous books, authors, literary quotes, and reading comprehension while playing. It\'s great for book lovers, students, and anyone interested in literature.'
          }
        }
      ]
    }
  });

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
    const fetchDailyLiterale = async () => {
      if (!targetDate) return; // Wait for target date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyLiterale(targetDate);
        
        if (!data) {
          setError('No puzzle available for today');
          return;
        }
        
        setLiteraleData(data);

        // Update structured data with today's puzzle info
        setStructuredData(prev => ({
          ...prev,
          webpage: {
            ...prev.webpage,
            dateModified: new Date().toISOString()
          }
        }));
        
      } catch (err) {
        console.error('Error fetching daily literale:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyLiterale();
  }, [targetDate]);

  // Loading State
  if (isLoading || !currentDate) {
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
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-2xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                LITERALE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Guess the Book Challenge</p>
          </div>

          {/* Loading Card */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-orange-400/30 border-t-orange-400 rounded-full animate-spin"></div>
                <Target className="w-10 h-10 text-orange-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Loading Literale Challenge</h2>
            <p className="text-gray-400 mb-6">Preparing your book puzzle...</p>
            
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
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-2xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                LITERALE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Guess The Book Challenge</p>
          </div>

          {/* Error Card */}
          <div className="bg-red-500/10 backdrop-blur-lg rounded-3xl border border-red-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Challenge Unavailable</h2>
            <p className="text-red-200 mb-6">We couldn't load today's literale puzzle.</p>
            
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
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-2xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                LITERALE
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-orange-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-orange-400 text-sm font-medium"
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
          
          <p className="text-gray-300 text-lg mb-2">Guess the book name in 6 attempts</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Daily Challenge</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-5 h-5 text-green-500" />
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
       {literaleData && <LiteraleComponent initialData={literaleData} />}

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6 relative z-10">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none p-4 hover:bg-gray-700/30 rounded-2xl transition-all duration-300">
              <h2 className="text-xl font-bold text-white">Game Guide & FAQ</h2>
              <span className="text-orange-400 group-open:rotate-180 transition-transform duration-300 text-2xl">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-6 pt-6 border-t border-gray-700">
              {/* FAQ content remains the same but with updated styling */}
              <div className="grid gap-4">
                {[
                  {
                    question: "What is Literale?",
                    answer: " Literale is a daily literature puzzle game where you guess the book title using opening lines, progressive clues, and Wordle-style letter feedback. It&apos;s an educational game that tests your knowledge of literature, famous books, and authors in a fun, interactive way."
                  },
                  {
                    question: "How do I play Literale?",
                    answer: " You have 6 attempts to guess the daily book title. Start with opening lines and unlock more detailed literary hints with each wrong guess. Use Wordle-style letter feedback to identify which letters are correct and in the right position, helping you deduce the book title."
                  },
                  {
                    question: "What types of clues does Literale provide?",
                    answer: "Literale provides multiple types of clues: Opening lines from the book, progressive text hints that unlock with wrong guesses (revealing more about the plot, characters, or author), and Wordle-style letter feedback showing correct letters in green, misplaced letters in yellow, and incorrect letters in gray."
                  },
                  {
                    question: "Is Literale educational?",
                    answer: " Yes! Literale is designed to be both fun and educational. Players learn about famous books, authors, literary quotes, reading comprehension, and literary analysis while playing. It&apos;s great for book lovers, literature students, educators, and anyone interested in expanding their literary knowledge."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-2xl p-4">
                    <h3 className="font-semibold text-orange-400 mb-2">{faq.question}</h3>
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

export default function LiteralePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    }>
      <LiteraleContent />
    </Suspense>
  );
}