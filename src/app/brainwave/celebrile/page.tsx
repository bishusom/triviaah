// src/app/celebrile/page.tsx
'use client';

import CelebrileComponent from '@/components/brainwave/CelebrileComponent';
import { getDailyCelebrile } from '@/lib/brainwave/celebrile/celebrile-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import { CelebrileData } from '@/lib/brainwave/celebrile/celebrile-logic';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function CelebrilePage() {
  const [celebrileData, setCelebrileData] = useState<CelebrileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());

  // Structured data for Celebrile
  const [structuredData, setStructuredData] = useState({
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Elite Trivias',
      url: 'https://elitetrivias.com',
      description: 'Free daily trivia quizzes and challenges across multiple categories including general knowledge, history, entertainment, and more.',
      logo: 'https://elitetrivias.com/logo.png',
      sameAs: [],
      foundingDate: '2024',
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Celebrity Games', 'Pop Culture Puzzles']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Celebrile - Daily Celebrity Guessing Game | Elite Trivias',
      description: 'Guess the celebrity from progressive clues with limited attempts! Wordle-style feedback on name letters. Unlock more hints with each wrong guess.',
      url: 'https://elitetrivias.com/celebrile',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Celebrile',
        description: 'Daily celebrity guessing game where players have 6 attempts to guess the target celebrity using progressive clues and letter feedback.',
        gameLocation: 'https://elitetrivias.com/celebrile',
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

  useEffect(() => {
    // Set the current date on the client side to ensure it's using client timezone
    const now = new Date();
    setCurrentDate(now);
    setLastUpdated(now.toISOString());
  }, []);

  useEffect(() => {
    const fetchDailyCelebrile = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyCelebrile(currentDate);
        
        if (!data) {
          setError('No puzzle available for today');
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
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyCelebrile();
  }, [currentDate]);

  // Show loading while waiting for client date or data
  if (isLoading || !currentDate) {
    return (
      <div className="page-with-ads">
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
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold mb-2">🌟 Celebrile - Celebrity Guessing Game</h1>
            {/* Last Updated Timestamp */}
            <time 
              dateTime={lastUpdated} 
              className="bg-purple-50 px-3 py-1 rounded-full text-xs font-medium border border-purple-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-6">Guess the celebrity from progressive clues in 6 tries!</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s celebrity puzzle...</p>

          {/* Hidden SEO Content */}
          <div className="sr-only" aria-hidden="false">
            <div itemScope itemType="https://schema.org/Game">
              <meta itemProp="dateModified" content={lastUpdated} />
              <h2>Celebrile - Daily Celebrity Guessing Game</h2>
              <p itemProp="description">
                Test your pop culture knowledge with Celebrile, a daily puzzle game where you guess famous celebrities 
                from progressive clues. Similar to Wordle but focused on entertainment and celebrity knowledge.
              </p>
              <h3>How to Play Celebrile:</h3>
              <ul>
                <li>Guess the target celebrity in 6 attempts</li>
                <li>Get progressive clues that become more specific with each wrong guess</li>
                <li>Receive Wordle-style letter feedback on celebrity names</li>
                <li>Use hints about profession, nationality, age, and notable works</li>
                <li>New celebrity puzzle every day</li>
                <li>Completely free with no registration required</li>
              </ul>
              <p><strong>Game Features:</strong> Daily celebrity challenges, progressive hint system, 
                 educational entertainment content, and comprehensive celebrity database.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !celebrileData) {
    return (
      <div className="page-with-ads">
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
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold mb-2">🌟 Celebrile - Celebrity Guessing Game</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-purple-50 px-3 py-1 rounded-full text-xs font-medium border border-purple-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-4">Guess the celebrity from progressive clues in 6 tries!</p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="mb-2">No puzzle available for today.</p>
            <p className="text-sm">Please check back tomorrow or try refreshing the page!</p>
            {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-with-ads">
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
      
      {/* Ad Controls */}
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

      <div className="max-w-2xl mx-auto p-4">
        {/* Header with Last Updated */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold">🌟 Celebrile</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-purple-50 px-3 py-1 rounded-full text-xs font-medium border border-purple-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600">Guess the celebrity from progressive clues in 6 tries! Daily entertainment puzzle.</p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <CelebrileComponent initialData={celebrileData} />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Celebrile Game Information & FAQ</h2>
              <span className="text-gray-500 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
              {/* Content Freshness Info */}
              <div>
                <h3 className="font-semibold">Game Updates</h3>
                <p className="text-gray-600 text-sm">
                  <strong>Last updated:</strong> {new Date(lastUpdated).toLocaleString()} (Server Time)
                </p>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What is Celebrile?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Celebrile is a daily celebrity puzzle game where you guess the target famous person in 6 attempts. 
                  It features progressive clues and Wordle-style letter feedback to help you solve the puzzle.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do I play Celebrile?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  You have 6 attempts to guess the daily celebrity. Start with basic clues, and get more detailed hints 
                  with each wrong guess. You also get letter feedback similar to Wordle to help identify the celebrity&apos;s name.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What types of clues are provided?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Clues include profession, nationality, age range, notable works, awards, and other identifying information 
                  about the celebrity. Clues become more specific and revealing with each attempt to help you narrow down possibilities.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How does the letter feedback work?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Similar to Wordle, letters in your guess are color-coded: green for correct letter in correct position, 
                  yellow for correct letter in wrong position, and gray for letters not in the celebrity&apos;s name.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Celebrile free to play?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Celebrile is completely free to play with no registration required. New celebrity puzzles 
                  are available every day at midnight local time.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What happens if I don&apos;t guess correctly in 6 tries?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  If you don&apos;t guess the celebrity in 6 attempts, the game will reveal the answer with a complete 
                  biography and fun facts. You can try again tomorrow with a new celebrity puzzle!
                </p>
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