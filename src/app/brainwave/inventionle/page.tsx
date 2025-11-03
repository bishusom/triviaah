// src/app/inventionle/page.tsx
'use client';

import InventionleComponent from '@/components/brainwave/InventionleComponent';
import { getDailyInvention, InventionPuzzle } from '@/lib/brainwave/inventionle/inventionle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function InventionlePage() {
  const [inventionData, setInventionData] = useState<{puzzle: InventionPuzzle | null} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());

  // Structured data for Inventionle
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Science Games', 'Invention Puzzles', 'Technology Education']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Inventionle - Daily Invention Puzzle | Elite Trivias',
      description: 'Guess the invention from its 6 attributes: inventor, year, category, country, purpose, and impact. Wordle-style invention guessing game.',
      url: 'https://elitetrivias.com/brainwave/inventionle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Inventionle',
        description: 'Daily invention guessing game where players identify inventions based on 6 key attributes: inventor, year, category, country, purpose, and impact.',
        gameLocation: 'https://elitetrivias.com/brainwave/inventionle',
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

  if (isLoading || !currentDate) {
    return (
      <div className="page-with-ads">
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
            <h1 className="text-3xl font-bold mb-2">⚡ Inventionle - Innovation Guessing Game</h1>
            {/* Last Updated Timestamp */}
            <time 
              dateTime={lastUpdated} 
              className="bg-indigo-50 px-3 py-1 rounded-full text-xs font-medium border border-indigo-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-6">Invention guessing puzzle. Guess the invention in 6 tries using 6 attributes!</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s invention puzzle...</p>

          {/* Hidden SEO Content */}
          <div className="sr-only" aria-hidden="false">
            <div itemScope itemType="https://schema.org/Game">
              <meta itemProp="dateModified" content={lastUpdated} />
              <h2>Inventionle - Daily Invention Guessing Game</h2>
              <p itemProp="description">
                Test your knowledge of innovations with Inventionle, a daily puzzle game where you guess inventions 
                based on 6 key attributes: inventor, year, category, country, purpose, and impact. Educational 
                and fun for technology enthusiasts of all ages.
              </p>
              <h3>How to Play Inventionle:</h3>
              <ul>
                <li>Guess the target invention in 6 attempts</li>
                <li>Use 6 attribute categories to narrow down possibilities</li>
                <li>Get feedback on inventor, year, category, country, purpose, and impact</li>
                <li>Learn about technological innovations and their history</li>
                <li>New invention puzzle every day</li>
                <li>Completely free with no registration required</li>
              </ul>
              <p><strong>Game Features:</strong> Daily innovation challenges, educational technology content, 
                 attribute-based guessing system, and comprehensive invention database.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !inventionData) {
    return (
      <div className="page-with-ads">
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
            <h1 className="text-3xl font-bold mb-2">⚡ Inventionle - Innovation Guessing Game</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-indigo-50 px-3 py-1 rounded-full text-xs font-medium border border-indigo-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-4">Invention guessing puzzle. Guess the invention in 6 tries using 6 attributes!</p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="mb-2">No puzzle available for today.</p>
            <p className="text-sm">Please check back tomorrow or try refreshing the page!</p>
            {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded transition-colors"
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
            <h1 className="text-3xl font-bold">⚡ Inventionle</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-indigo-50 px-3 py-1 rounded-full text-xs font-medium border border-indigo-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600">Invention guessing puzzle. Guess the invention in 6 tries using 6 attributes!</p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {inventionData.puzzle && <InventionleComponent initialData={inventionData as { puzzle: InventionPuzzle }} />}

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Inventionle Game Information & FAQ</h2>
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
                <h3 className="font-semibold" itemProp="name">What is Inventionle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Inventionle is a daily invention puzzle game where you guess the target invention using 6 key attributes: 
                  inventor, year, category, country, purpose, and impact. It&apos;s an educational game that teaches about 
                  technological innovations, their history, and their significance in shaping our world.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do I play Inventionle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  You have 6 attempts to guess the daily invention. Use the 6 attribute categories to narrow down possibilities. 
                  Each guess provides feedback on which attributes match the target invention, helping you eliminate options and 
                  make educated guesses about technological innovations.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What are the 6 attributes in Inventionle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  The 6 attributes are: Inventor (the person or people who created the invention), Year (when it was invented or patented), 
                  Category (technology, medicine, transportation, communication, household, etc.), Country (where it was invented), 
                  Purpose (what problem it solves or need it fulfills), and Impact (how it changed society, industry, or daily life).
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Inventionle educational?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Inventionle is designed to be both fun and educational. Players learn about important inventions, their inventors, 
                  historical context, and technological impact while playing. It&apos;s great for students, technology enthusiasts, 
                  and anyone interested in the history of innovation.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What types of inventions are included?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Inventionle features a wide variety of inventions from different time periods and categories, including technological 
                  breakthroughs, medical advancements, household innovations, transportation developments, communication technologies, 
                  and more. The database includes both famous and lesser-known inventions that have shaped our world.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Inventionle free to play?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Inventionle is completely free to play with no registration required. New invention puzzles 
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
            <h2>Inventionle - Daily Invention Guessing Game</h2>
            <p itemProp="description">
              Test your knowledge of innovations with Inventionle, a daily puzzle game where you guess inventions 
              based on 6 key attributes: inventor, year, category, country, purpose, and impact. Educational 
              and fun for technology enthusiasts of all ages. Perfect for students, inventors, engineers, and 
              anyone interested in the history of technology and innovation.
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