// src/app/trordle/page.tsx
'use client';

import TrordleComponent from '@/components/brainwave/TrordleComponent';
import { getDailyTrordle } from '@/lib/brainwave/trordle/trordle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import { TrordleData } from '@/lib/brainwave/trordle/trordle-logic';
import Ads from '@/components/common/Ads';

export default function TrordlePage() {
  const [trordleData, setTrordleData] = useState<TrordleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  useEffect(() => {
    // Set the current date on the client side to ensure it's using client timezone
    setCurrentDate(new Date());
  }, []);

  useEffect(() => {
    const fetchDailyTrordle = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyTrordle(currentDate);
        
        if (!data) {
          setError('No puzzle available for today');
          return;
        }
        
        setTrordleData(data);
      } catch (err) {
        console.error('Error fetching daily trordle:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyTrordle();
  }, [currentDate]); // Depend on currentDate instead of empty array

  // Show loading while waiting for client date or data
  if (isLoading || !currentDate) {
    return (
      <div className="page-with-ads">
        {/* Desktop Side Ads */}
        {showDesktopAds && (
          <>
            <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }}  closeButtonPosition="top-right" />
            </div>
            <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }}  closeButtonPosition="top-left" />
            </div>
          </>
        )}
        
        {/* Mobile Bottom Ad */}
        {showMobileAd && (
          <Ads format="horizontal" isMobileFooter={true} className="lg:hidden" />
        )}
        
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Trordle</h1>
          <p className="text-gray-600 mb-6">The trivia version of Wordle. Guess the answer in 6 tries!</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s puzzle...</p>
        </div>
      </div>
    );
  }

  if (error || !trordleData) {
    return (
      <div className="page-with-ads">
        {/* Desktop Side Ads */}
        {showDesktopAds && (
          <>
            <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-right" />
            </div>
            <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-left" />
            </div>
          </>
        )}
        
        {/* Mobile Bottom Ad */}
        {showMobileAd && (
          <Ads format="horizontal" isMobileFooter={true} className="lg:hidden" />
        )}
        
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Trordle</h1>
          <p className="text-gray-600 mb-4">The trivia version of Wordle. Guess the answer in 6 tries!</p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="mb-2">No puzzle available for today.</p>
            <p className="text-sm">Please check back tomorrow or try refreshing the page!</p>
            {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-with-ads">
      {/* Desktop Side Ads */}
      {showDesktopAds && (
        <>
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-right" />
          </div>
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-left" />
          </div>
        </>
      )}
      
      {/* Mobile Bottom Ad */}
      {showMobileAd && (
          <Ads format="horizontal" isMobileFooter={true} className="lg:hidden" />
      )}
      
      {/* Structured Data for SEO */}
      <StructuredData />
      
      {/* Ad Controls */}
      {showAds && (
        <div className="fixed top-4 right-4 z-60 flex gap-2">
          <button
            onClick={() => setShowDesktopAds(!showDesktopAds)}
            className="bg-gray-600 hover:bg-gray-800 text-white text-xs px-2 py-1 rounded hidden lg:block"
          >
            {showDesktopAds ? 'Hide Side Ads' : 'Show Side Ads'}
          </button>
          <button
            onClick={() => setShowMobileAd(!showMobileAd)}
            className="bg-gray-600 hover:bg-gray-800 text-white text-xs px-2 py-1 rounded lg:hidden"
          >
            {showMobileAd ? 'Hide Bottom Ad' : 'Show Bottom Ad'}
          </button>
        </div>
      )}
      
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-2">﹖ Trordle - The Daily Trivia Game</h1>
        <div className="fixed right-8 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        <p className="text-gray-600 text-center mb-6">The trivia version of Wordle. Guess the answer in 6 tries!</p>
        
        {/* Last Updated Date */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">
            Last updated: {currentDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <TrordleComponent initialData={trordleData} />
        
        {/* FAQ Section */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">What is Trordle?</h3>
              <p className="text-gray-700">
                Trordle is a daily trivia puzzle game that combines the challenge of trivia questions with the word-guessing 
                mechanics of Wordle. Each day features a new trivia question where you need to guess the answer in 6 attempts.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">How do I play Trordle?</h3>
              <p className="text-gray-700">
                Read the daily trivia question and try to guess the answer. You have 6 attempts to get it right. 
                After each guess, you&apos;ll get feedback on which letters are correct and in the right position (green), 
                correct but in the wrong position (yellow), or not in the word at all (gray).
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">What types of trivia questions are included?</h3>
              <p className="text-gray-700">
                Trordle features a wide variety of trivia categories including history, science, pop culture, geography, 
                sports, and more. The questions are designed to be challenging but accessible to general knowledge enthusiasts.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">Is there a new puzzle every day?</h3>
              <p className="text-gray-700">
                Yes! Trordle features a new trivia question and answer every day. Come back daily to test your knowledge 
                and keep your trivia skills sharp.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">What if I can&apos;t guess the answer in 6 tries?</h3>
              <p className="text-gray-700">
                If you use all 6 attempts without guessing the correct answer, the game will reveal the solution. 
                You can then learn from it and come back tomorrow for a new challenge!
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">Is Trordle free to play?</h3>
              <p className="text-gray-700">
                Absolutely! Trordle is completely free to play. No subscriptions, no payments - just daily trivia fun 
                to challenge your knowledge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Structured Data Component for SEO
function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://triviaah.com/#organization",
        "name": "Triviaah",
        "url": "https://triviaah.com/",
        "description": "Triviaah offers engaging and educational trivia games and puzzles for everyone.",
        "logo": {
          "@type": "ImageObject",
          "url": "https://triviaah.com/logo.png",
          "width": 200,
          "height": 60
        },
        "sameAs": [
          "https://twitter.com/elitetrivias",
          "https://www.facebook.com/elitetrivias",
          "https://www.instagram.com/elitetrivias"
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://triviaah.com/brainwave/trordle/#webpage",
        "url": "https://triviaah.com/brainwave/trordle",
        "name": "Trordle - Daily Trivia Puzzle | Triviaah",
        "description": "Guess the answer to today's trivia puzzle with limited attempts, similar to Wordle but with trivia questions.",
        "isPartOf": {
          "@id": "https://triviaah.com/#website"
        },
        "about": {
          "@id": "https://triviaah.com/brainwave/trordle/#game"
        },
        "datePublished": "2024-01-01T00:00:00+00:00",
        "dateModified": new Date().toISOString(),
        "breadcrumb": {
          "@id": "https://triviaah.com/brainwave/trordle/#breadcrumb"
        },
        "potentialAction": [
          {
            "@type": "PlayAction",
            "target": "https://triviaah.com/brainwave/trordle"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://triviaah.com/#website",
        "url": "https://triviaah.com/",
        "name": "Triviaah",
        "description": "Engaging trivia games and puzzles for everyone",
        "publisher": {
          "@id": "https://triviaah.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://triviaah.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Game",
        "@id": "https://triviaah.com/brainwave/trordle/#game",
        "name": "Trordle",
        "description": "Daily trivia puzzle combining Wordle mechanics with trivia questions",
        "url": "https://triviaah.com/brainwave/trordle",
        "applicationCategory": "Game",
        "gameType": "PuzzleGame,TriviaGame",
        "genre": ["puzzle", "trivia", "educational", "word game"],
        "numberOfPlayers": {
          "@type": "QuantitativeValue",
          "minValue": 1
        },
        "publisher": {
          "@id": "https://triviaah.com/#organization"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "operatingSystem": "Any",
        "author": {
          "@id": "https://triviaah.com/#organization"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://triviaah.com/brainwave/trordle/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://triviaah.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Brainwave",
            "item": "https://triviaah.com/brainwave"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Trordle",
            "item": "https://triviaah.com/brainwave/trordle"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Trordle?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Trordle is a daily trivia puzzle game that combines the challenge of trivia questions with the word-guessing mechanics of Wordle. Each day features a new trivia question where you need to guess the answer in 6 attempts."
            }
          },
          {
            "@type": "Question",
            "name": "How do I play Trordle?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Read the daily trivia question and try to guess the answer. You have 6 attempts to get it right. After each guess, you'll get feedback on which letters are correct and in the right position (green), correct but in the wrong position (yellow), or not in the word at all (gray)."
            }
          },
          {
            "@type": "Question",
            "name": "What types of trivia questions are included?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Trordle features a wide variety of trivia categories including history, science, pop culture, geography, sports, and more. The questions are designed to be challenging but accessible to general knowledge enthusiasts."
            }
          },
          {
            "@type": "Question",
            "name": "Is there a new puzzle every day?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Trordle features a new trivia question and answer every day. Come back daily to test your knowledge and keep your trivia skills sharp."
            }
          },
          {
            "@type": "Question",
            "name": "What if I can't guess the answer in 6 tries?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "If you use all 6 attempts without guessing the correct answer, the game will reveal the solution. You can then learn from it and come back tomorrow for a new challenge!"
            }
          },
          {
            "@type": "Question",
            "name": "Is Trordle free to play?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! Trordle is completely free to play. No subscriptions, no payments - just daily trivia fun to challenge your knowledge."
            }
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}