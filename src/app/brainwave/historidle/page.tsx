// src/app/brainwave/historidle/page.tsx
'use client';

import HistoridleComponent from '@/components/brainwave/HistoridleComponent';
import { getDailyHistoridle } from '@/lib/brainwave/historidle/historidle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import { HistoridleData } from '@/lib/brainwave/historidle/historidle-logic';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

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
      name: 'Elite Trivias',
      url: 'https://elitetrivias.com',
      description: 'Free daily trivia quizzes and challenges across multiple categories including general knowledge, history, entertainment, and more.',
      logo: 'https://elitetrivias.com/logo.png',
      sameAs: [],
      foundingDate: '2024',
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'History Games', 'Historical Puzzles', 'Educational History']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Historidle - Daily Historical Puzzle | Elite Trivias',
      description: 'Guess the historical figure or event from 3 dates and progressive clues with limited attempts, Wordle-style feedback. Unlock more historical hints with each wrong guess!',
      url: 'https://elitetrivias.com/brainwave/historidle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Historidle',
        description: 'Daily historical puzzle game where players identify historical figures or events based on dates, progressive clues, and timeline information with Wordle-style feedback.',
        gameLocation: 'https://elitetrivias.com/brainwave/historidle',
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

  // Show loading while waiting for client date or data
  if (isLoading || !currentDate) {
    return (
      <div className="page-with-ads">
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
            <h1 className="text-3xl font-bold mb-2">🏛️ Historidle - History Guessing Game</h1>
            {/* Last Updated Timestamp */}
            <time 
              dateTime={lastUpdated} 
              className="bg-blue-50 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-6">Guess the historical figure or event from dates and progressive clues!</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s historical puzzle...</p>

          {/* Hidden SEO Content */}
          <div className="sr-only" aria-hidden="false">
            <div itemScope itemType="https://schema.org/Game">
              <meta itemProp="dateModified" content={lastUpdated} />
              <h2>Historidle - Daily Historical Puzzle Game</h2>
              <p itemProp="description">
                Test your history knowledge with Historidle, a daily puzzle game where you guess historical 
                figures or events based on dates, progressive clues, and timeline information. Educational 
                and fun for history enthusiasts of all ages.
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
              </ul>
              <p><strong>Game Features:</strong> Daily history challenges, educational historical content, 
                 progressive clue system, date-based hints, and comprehensive historical database.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !historidleData) {
    return (
      <div className="page-with-ads">
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
            <h1 className="text-3xl font-bold mb-2">🏛️ Historidle - History Guessing Game</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-blue-50 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-4">Guess the historical figure or event from dates and progressive clues!</p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="mb-2">No historical puzzle available for today.</p>
            <p className="text-sm">Please check back tomorrow or try refreshing the page!</p>
            {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
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
        {/* Header with Last Updated */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold">🏛️ Historidle</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-blue-50 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600">Guess the historical figure or event from dates and progressive clues in 6 tries!</p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <HistoridleComponent initialData={historidleData} />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Historidle Game Information & FAQ</h2>
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
                <h3 className="font-semibold" itemProp="name">What is Historidle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Historidle is a daily historical puzzle game where you guess the target historical figure or event 
                  using dates, progressive clues, and timeline information. It&apos;s an educational game that teaches 
                  about important historical figures and events in a fun, interactive way with Wordle-style mechanics.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do I play Historidle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  You have 6 attempts to guess the daily historical figure or event. Start with date clues and unlock 
                  more detailed historical hints with each wrong guess. Use the timeline information and progressive 
                  text clues to narrow down your answer. Each guess provides Wordle-style feedback to help you identify 
                  the correct historical subject.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What types of clues does Historidle provide?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Historidle provides multiple types of clues: Emoji representations of the historical figure or event, 
                  timeline information (birth/death dates for figures or event dates), progressive text hints that unlock 
                  with wrong guesses, and Wordle-style feedback indicating how close your guess is to the correct answer.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Historidle educational?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Historidle is designed to be both fun and educational. Players learn about important historical 
                  figures, events, timelines, and historical context while playing. It&apos;s great for history enthusiasts, 
                  students, educators, and anyone interested in learning more about the past in an engaging way.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What historical periods are covered?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Historidle covers a wide range of historical periods from ancient civilizations to modern times, 
                  including famous leaders, inventors, artists, scientists, political figures, and significant historical 
                  events from around the world.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Historidle free to play?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Historidle is completely free to play with no registration required. New historical puzzles 
                  are available every day at midnight local time.
                </p>
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