// src/app/brainwave/synonymle/page.tsx
'use client';

import SynonymleComponent from '@/components/brainwave/SynonymleComponent';
import { getDailySynonymle } from '@/lib/brainwave/synonymle/synonymle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import { SynonymleData } from '@/lib/brainwave/synonymle/synonymle-logic';
import Ads from '@/components/common/Ads';

export default function SynonymlePage() {
  const [synonymleData, setSynonymleData] = useState<SynonymleData | null>(null);
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
      } catch (err) {
        console.error('Error fetching daily synonymle:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailySynonymle();
  }, [currentDate]); // Depend on currentDate instead of empty array

  // Show loading while waiting for client date or data
  if (isLoading || !currentDate) {
    return (
      <div className="page-with-ads">
        {/* Desktop Side Ads */}
        {showDesktopAds && (
          <>
            <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-right"/>
            </div>
            <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-left"/>
            </div>
          </>
        )}
        
        {/* Mobile Bottom Ad */}
        {showMobileAd && (
          <Ads format="horizontal" isMobileFooter={true} className="lg:hidden" />
        )}
        
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Synonymle</h1>
          <p className="text-gray-600 mb-6">Guess the word based on semantic similarity and synonyms!</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s puzzle...</p>
        </div>
      </div>
    );
  }

  if (error || !synonymleData) {
    return (
      <div className="page-with-ads">
        {/* Desktop Side Ads */}
        {showDesktopAds && (
          <>
            <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-right"/>
            </div>
            <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-left"/>
            </div>
          </>
        )}
        
        {/* Mobile Bottom Ad */}
        {showMobileAd && (
          <Ads format="horizontal" isMobileFooter={true} className="lg:hidden" />
        )}
        
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Synonymle</h1>
          <p className="text-gray-600 mb-4">Guess the word based on semantic similarity and synonyms!</p>
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
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-right"/>
          </div>
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-left"/>
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
        <div className="fixed top-4 right-4 z-50 flex gap-2">
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
        <h1 className="text-3xl font-bold text-center mb-2">🔠 Synonymle - The word guessing game</h1>
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        <p className="text-gray-600 text-center mb-6">Guess the word based on semantic similarity and synonyms!</p>
        
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
        
        <SynonymleComponent initialData={synonymleData} />
        
        {/* FAQ Section */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">What is Synonymle?</h3>
              <p className="text-gray-700">
                Synonymle is a daily word puzzle game where you guess words based on semantic similarity and shared synonyms. 
                Unlike traditional word games, Synonymle focuses on meaning and vocabulary relationships rather than letter positions.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">How do I play Synonymle?</h3>
              <p className="text-gray-700">
                Enter words and see how semantically similar they are to the target word. The similarity percentage shows how close 
                your guess is in meaning. Use the shared synonyms list to help identify the target word. You have unlimited guesses!
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">What does the similarity percentage mean?</h3>
              <p className="text-gray-700">
                The similarity percentage represents how closely related your guessed word is to the target word in terms of meaning, 
                based on semantic analysis and shared synonyms. Higher percentages mean the words are more closely related.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">Is there a new puzzle every day?</h3>
              <p className="text-gray-700">
                Yes! Synonymle features a new target word every day. Come back daily to test your vocabulary and word association skills.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">Is Synonymle free to play?</h3>
              <p className="text-gray-700">
                Absolutely! Synonymle is completely free to play. No subscriptions, no payments, just daily word puzzle fun.
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
        "@id": "https://elitetrivias.com/#organization",
        "name": "Elite Trivias",
        "url": "https://elitetrivias.com/",
        "description": "Elite Trivias offers engaging and educational trivia games and puzzles for everyone.",
        "logo": {
          "@type": "ImageObject",
          "url": "https://elitetrivias.com/logo.png",
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
        "@id": "https://elitetrivias.com/brainwave/synonymle/#webpage",
        "url": "https://elitetrivias.com/brainwave/synonymle",
        "name": "Synonymle - Daily Word Guessing Puzzle | Elite Trivias",
        "description": "Guess the word based on semantic similarity and synonyms. Wordle-style vocabulary puzzle game that tests your understanding of word meanings.",
        "isPartOf": {
          "@id": "https://elitetrivias.com/#website"
        },
        "about": {
          "@id": "https://elitetrivias.com/brainwave/synonymle/#game"
        },
        "datePublished": "2024-01-01T00:00:00+00:00",
        "dateModified": new Date().toISOString(),
        "breadcrumb": {
          "@id": "https://elitetrivias.com/brainwave/synonymle/#breadcrumb"
        },
        "potentialAction": [
          {
            "@type": "PlayAction",
            "target": "https://elitetrivias.com/brainwave/synonymle"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://elitetrivias.com/#website",
        "url": "https://elitetrivias.com/",
        "name": "Elite Trivias",
        "description": "Engaging trivia games and puzzles for everyone",
        "publisher": {
          "@id": "https://elitetrivias.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://elitetrivias.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Game",
        "@id": "https://elitetrivias.com/brainwave/synonymle/#game",
        "name": "Synonymle",
        "description": "Daily word guessing puzzle based on semantic similarity and synonyms",
        "url": "https://elitetrivias.com/brainwave/synonymle",
        "applicationCategory": "Game",
        "gameType": "PuzzleGame,WordGame",
        "genre": ["puzzle", "word game", "educational"],
        "numberOfPlayers": {
          "@type": "QuantitativeValue",
          "minValue": 1
        },
        "publisher": {
          "@id": "https://elitetrivias.com/#organization"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "operatingSystem": "Any",
        "author": {
          "@id": "https://elitetrivias.com/#organization"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://elitetrivias.com/brainwave/synonymle/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://elitetrivias.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Brainwave",
            "item": "https://elitetrivias.com/brainwave"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Synonymle",
            "item": "https://elitetrivias.com/brainwave/synonymle"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Synonymle?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Synonymle is a daily word puzzle game where you guess words based on semantic similarity and shared synonyms. Unlike traditional word games, Synonymle focuses on meaning and vocabulary relationships rather than letter positions."
            }
          },
          {
            "@type": "Question",
            "name": "How do I play Synonymle?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Enter words and see how semantically similar they are to the target word. The similarity percentage shows how close your guess is in meaning. Use the shared synonyms list to help identify the target word. You have unlimited guesses!"
            }
          },
          {
            "@type": "Question",
            "name": "What does the similarity percentage mean?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The similarity percentage represents how closely related your guessed word is to the target word in terms of meaning, based on semantic analysis and shared synonyms. Higher percentages mean the words are more closely related."
            }
          },
          {
            "@type": "Question",
            "name": "Is there a new puzzle every day?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Synonymle features a new target word every day. Come back daily to test your vocabulary and word association skills."
            }
          },
          {
            "@type": "Question",
            "name": "Is Synonymle free to play?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! Synonymle is completely free to play. No subscriptions, no payments, just daily word puzzle fun."
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