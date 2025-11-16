// src/app/songle/page.tsx
'use client';

import SongleComponent from '@/components/brainwave/SongleComponent';
import { getDailySongle } from '@/lib/brainwave/songle/songle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import { SongleData } from '@/lib/brainwave/songle/songle-logic';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function SonglePage() {
  const [songleData, setSongleData] = useState<SongleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Songle
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Music Games', 'Song Puzzles', 'Music Education']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Songle - Daily Song Guessing Puzzle | Triviaah',
      description: 'Guess the song from clues like lyrics, artist, and genre. A daily Wordle-style music puzzle game that tests your knowledge of music across decades and genres.',
      url: 'https://triviaah.com/brainwave/songle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Songle',
        description: 'Daily song guessing game where players identify songs based on lyrics, artist clues, genre information, and other musical attributes with limited attempts.',
        gameLocation: 'https://triviaah.com/brainwave/songle',
        characterAttribute: 'Music, Songs, Lyrics, Artists, Genres, Music Trivia, Music Education, Hit Songs, Music History'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Songle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Songle is a daily music puzzle game where you guess songs using clues like lyrics, artist information, genre, and other musical attributes. It\'s an educational game that tests your music knowledge across different decades and styles.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Songle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You have limited attempts to guess the daily song. Use the provided clues like lyrics snippets, artist hints, genre information, and other musical attributes to identify the correct song.'
          }
        },
        {
          '@type': 'Question',
          name: 'What types of clues does Songle provide?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Songle provides various musical clues including lyric excerpts, artist information, genre hints, release decade clues, and sometimes musical characteristics like tempo or instrumentation.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Songle educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Songle helps players learn about different music genres, artists, song lyrics, and music history while improving pattern recognition and musical knowledge.'
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
    const fetchDailySongle = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailySongle(currentDate);
        
        if (!data) {
          setError('No puzzle available for today');
          return;
        }
        
        setSongleData(data);

        // Update structured data with today's puzzle info
        setStructuredData(prev => ({
          ...prev,
          webpage: {
            ...prev.webpage,
            dateModified: new Date().toISOString()
          }
        }));
        
      } catch (err) {
        console.error('Error fetching daily songle:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailySongle();
  }, [currentDate]);

  // Show loading while waiting for client date or data
  if (isLoading || !currentDate) {
    return (
      <div className="page-with-ads">
        {/* Structured Data */}
        <Script
          id="songle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="songle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="songle-faq-schema"
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
            <h1 className="text-3xl font-bold mb-2">♫ Songle - Music Guessing Game</h1>
            {/* Last Updated Timestamp */}
            <time 
              dateTime={lastUpdated} 
              className="bg-pink-50 px-3 py-1 rounded-full text-xs font-medium border border-pink-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-6">Guess the song from clues like lyrics, artist, and genre!</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s music puzzle...</p>

          {/* Hidden SEO Content */}
          <div className="sr-only" aria-hidden="false">
            <div itemScope itemType="https://schema.org/Game">
              <meta itemProp="dateModified" content={lastUpdated} />
              <h2>Songle - Daily Song Guessing Game</h2>
              <p itemProp="description">
                Test your music knowledge with Songle, a daily puzzle game where you guess songs 
                based on lyrics, artist clues, genre information, and musical attributes. Educational 
                and fun for music lovers of all ages and musical tastes.
              </p>
              <h3>How to Play Songle:</h3>
              <ul>
                <li>Guess the song in limited attempts</li>
                <li>Use lyric snippets, artist hints, and genre clues</li>
                <li>Get feedback on your guesses</li>
                <li>Learn about different music genres and artists</li>
                <li>New song puzzle every day</li>
                <li>Completely free with no registration required</li>
              </ul>
              <p><strong>Game Features:</strong> Daily music challenges, educational music content, 
                 lyric-based clues, artist information, and comprehensive song database.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !songleData) {
    return (
      <div className="page-with-ads">
        {/* Structured Data */}
        <Script
          id="songle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="songle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="songle-faq-schema"
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
            <h1 className="text-3xl font-bold mb-2">♫ Songle - Music Guessing Game</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-pink-50 px-3 py-1 rounded-full text-xs font-medium border border-pink-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-4">Guess the song from clues like lyrics, artist, and genre!</p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="mb-2">No puzzle available for today.</p>
            <p className="text-sm">Please check back tomorrow or try refreshing the page!</p>
            {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded transition-colors"
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
        id="songle-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="songle-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="songle-faq-schema"
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
            <h1 className="text-3xl font-bold">♫ Songle</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-pink-50 px-3 py-1 rounded-full text-xs font-medium border border-pink-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600">Guess the song from clues like lyrics, artist, and genre!</p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <SongleComponent initialData={songleData} />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Songle Game Information & FAQ</h2>
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
                <h3 className="font-semibold" itemProp="name">What is Songle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Songle is a daily music puzzle game where you guess songs using clues like lyrics, artist information, 
                  genre, and other musical attributes. It&apos;s an educational game that tests your music knowledge across 
                  different decades, genres, and styles in a fun, interactive way.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do I play Songle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  You have limited attempts to guess the daily song. Use the provided clues like lyric snippets, 
                  artist hints, genre information, and other musical attributes to identify the correct song. 
                  Each guess provides feedback to help you narrow down possibilities and improve your music knowledge.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What types of clues does Songle provide?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Songle provides various musical clues including lyric excerpts from the song, artist information 
                  (name, band, or musical group), genre hints (pop, rock, country, hip-hop, etc.), release decade 
                  clues, and sometimes additional musical characteristics like tempo, instrumentation, or notable 
                  musical features.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Songle educational?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Songle is designed to be both fun and educational. Players learn about different music genres, 
                  artists, song lyrics, music history, and musical terminology while playing. It&apos;s great for music 
                  enthusiasts, students, educators, and anyone interested in expanding their musical knowledge and 
                  appreciation.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What types of music are included?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Songle features a wide variety of music from different decades, genres, and styles, including pop, 
                  rock, country, hip-hop, R&B, jazz, classical, electronic, folk, and international music. The database 
                  includes both classic hits and contemporary songs to provide diverse and interesting challenges for 
                  all musical tastes.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Songle free to play?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Songle is completely free to play with no registration required. New song puzzles are available 
                  every day at midnight local time.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Songle - Daily Song Guessing Game</h2>
            <p itemProp="description">
              Test your music knowledge with Songle, a daily puzzle game where you guess songs 
              based on lyrics, artist clues, genre information, and musical attributes. Educational 
              and fun for music lovers of all ages and musical tastes. Perfect for music enthusiasts, 
              students, educators, and anyone who loves discovering and testing their knowledge of songs 
              across different eras and styles.
            </p>
            <h3>How to Play Songle:</h3>
            <ul>
              <li>Guess the song in limited attempts</li>
              <li>Use lyric snippets, artist hints, and genre clues</li>
              <li>Get feedback on your guesses to narrow down possibilities</li>
              <li>Learn about different music genres and artists</li>
              <li>New song puzzle every day</li>
              <li>Completely free with no registration required</li>
              <li>Educational and entertaining for all ages</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily music challenges with diverse songs</li>
              <li>Educational music content and history</li>
              <li>Lyric-based clues and artist information</li>
              <li>Genre and decade categorization</li>
              <li>Comprehensive song database</li>
              <li>Mobile-friendly design</li>
              <li>No time pressure - play at your own pace</li>
              <li>Learn fascinating music facts and trivia</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Learn about different music genres and styles</li>
              <li>Discover new artists and expand musical horizons</li>
              <li>Improve lyric recognition and musical memory</li>
              <li>Understand music history and evolution</li>
              <li>Develop pattern recognition and deductive reasoning</li>
              <li>Enhance cultural and musical literacy</li>
            </ul>
            <p><strong>Perfect for:</strong> Music lovers, aspiring musicians, music students, educators, 
               trivia enthusiasts, and anyone wanting to test and expand their musical knowledge in a 
               fun, engaging daily challenge.</p>
          </div>
        </div>
      </div>
    </div>
  );
}