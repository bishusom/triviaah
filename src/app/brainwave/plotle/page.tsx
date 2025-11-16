// src/app/plotle/page.tsx
'use client';

import PlotleComponent from '@/components/brainwave/PlotleComponent';
import { getDailyPlotle } from '@/lib/brainwave/plotle/plotle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import { PlotleData } from '@/lib/brainwave/plotle/plotle-logic';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function PlotlePage() {
  const [plotleData, setPlotleData] = useState<PlotleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Plotle
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Movie Games', 'Film Puzzles', 'Cinema Education']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Plotle - Daily Movie Plot Puzzle | Triviaah',
      description: 'Guess the movie from its 6-word plot summary with limited attempts, Wordle-style feedback on plot words. Daily movie guessing game for film lovers.',
      url: 'https://triviaah.com/brainwave/plotle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Plotle',
        description: 'Daily movie puzzle game where players identify films based on 6-word plot summaries with Wordle-style feedback on plot words and limited attempts.',
        gameLocation: 'https://triviaah.com/brainwave/plotle',
        characterAttribute: 'Movies, Films, Cinema, Plot, Entertainment, Hollywood, Film Trivia, Movie Quotes'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Plotle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Plotle is a daily movie puzzle game where you guess the film using a 6-word plot summary with Wordle-style feedback. It\'s the ultimate movie guessing challenge for film enthusiasts.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Plotle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You have 6 attempts to guess the daily movie. Each guess provides Wordle-style feedback on the 6 plot words - green for correct words in right position, yellow for correct words in wrong position, and gray for incorrect words.'
          }
        },
        {
          '@type': 'Question',
          name: 'What makes Plotle special?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Plotle combines the addictive Wordle format with movie trivia, using clever 6-word plot summaries that challenge your film knowledge while being fun and educational.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Plotle educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Plotle helps players learn about different movies, genres, directors, and film history while improving pattern recognition and deductive reasoning skills.'
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
    const fetchDailyPlotle = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyPlotle(currentDate);
        
        if (!data) {
          setError('No puzzle available for today');
          return;
        }
        
        setPlotleData(data);

        // Update structured data with today's puzzle info
        setStructuredData(prev => ({
          ...prev,
          webpage: {
            ...prev.webpage,
            dateModified: new Date().toISOString()
          }
        }));
        
      } catch (err) {
        console.error('Error fetching daily plotle:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyPlotle();
  }, [currentDate]);

  // Show loading while waiting for client date or data
  if (isLoading || !currentDate) {
    return (
      <div className="page-with-ads">
        {/* Structured Data */}
        <Script
          id="plotle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="plotle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="plotle-faq-schema"
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
            <h1 className="text-3xl font-bold mb-2">🎬 Plotle - Movie Plot Guessing Game</h1>
            {/* Last Updated Timestamp */}
            <time 
              dateTime={lastUpdated} 
              className="bg-red-50 px-3 py-1 rounded-full text-xs font-medium border border-red-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-6">Six-word plot summary puzzle. Guess the movie in 6 tries!</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s movie puzzle...</p>

          {/* Hidden SEO Content */}
          <div className="sr-only" aria-hidden="false">
            <div itemScope itemType="https://schema.org/Game">
              <meta itemProp="dateModified" content={lastUpdated} />
              <h2>Plotle - Daily Movie Plot Guessing Game</h2>
              <p itemProp="description">
                Test your movie knowledge with Plotle, the ultimate daily puzzle game where you guess films 
                based on clever 6-word plot summaries with Wordle-style feedback. The most popular movie 
                guessing game for film buffs and casual viewers alike.
              </p>
              <h3>How to Play Plotle:</h3>
              <ul>
                <li>Guess the movie in 6 attempts</li>
                <li>Use the 6-word plot summary as your main clue</li>
                <li>Get Wordle-style feedback on plot words</li>
                <li>Green: Correct word in right position</li>
                <li>Yellow: Correct word in wrong position</li>
                <li>Gray: Word not in the plot summary</li>
                <li>New movie puzzle every day</li>
                <li>Completely free with no registration required</li>
              </ul>
              <p><strong>Why Players Love Plotle:</strong> Addictive Wordle-style gameplay combined with movie trivia, 
                 challenging 6-word summaries, and the thrill of testing your film knowledge daily.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !plotleData) {
    return (
      <div className="page-with-ads">
        {/* Structured Data */}
        <Script
          id="plotle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="plotle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="plotle-faq-schema"
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
            <h1 className="text-3xl font-bold mb-2">🎬 Plotle - Movie Plot Guessing Game</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-red-50 px-3 py-1 rounded-full text-xs font-medium border border-red-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-4">Six-word plot summary puzzle. Guess the movie in 6 tries!</p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="mb-2">No puzzle available for today.</p>
            <p className="text-sm">Please check back tomorrow or try refreshing the page!</p>
            {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors"
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
        id="plotle-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="plotle-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="plotle-faq-schema"
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
      { showAds && (
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
            <h1 className="text-3xl font-bold">🎬 Plotle</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-red-50 px-3 py-1 rounded-full text-xs font-medium border border-red-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600">Six-word plot summary puzzle. Guess the movie in 6 tries!</p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <PlotleComponent initialData={plotleData} />

        {/* Enhanced FAQ Section with Special Styling for Popular Game */}
        <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold text-red-800">🎬 Plotle Game Information & FAQ - Most Popular Movie Game!</h2>
              <span className="text-red-500 group-open:rotate-180 transition-transform text-lg">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-4 pt-4 border-t border-red-200">
              {/* Content Freshness Info */}
              <div className="bg-white p-3 rounded-lg border">
                <h3 className="font-semibold text-red-700">Game Updates</h3>
                <p className="text-gray-600 text-sm">
                  <strong>Last updated:</strong> {new Date(lastUpdated).toLocaleString()} (Server Time)
                </p>
                <p className="text-green-600 text-sm font-medium mt-1">
                  ⭐ Most Popular Game - Thousands of movie lovers play daily!
                </p>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-red-700" itemProp="name">What is Plotle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Plotle is the ultimate daily movie puzzle game where you guess films using clever 6-word plot summaries 
                  with Wordle-style feedback. It&apos;s the most popular movie guessing challenge that combines addictive 
                  puzzle mechanics with film trivia, loved by casual viewers and cinephiles alike.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-red-700" itemProp="name">How do I play Plotle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  You have 6 attempts to guess the daily movie. Use the 6-word plot summary as your main clue. 
                  Each guess provides Wordle-style color feedback: <span className="text-green-600 font-semibold">Green</span> for correct words in the right position, 
                  <span className="text-yellow-600 font-semibold"> Yellow</span> for correct words in the wrong position, and <span className="text-gray-500 font-semibold">Gray</span> for words not in the plot summary. 
                  This feedback helps you deduce the movie through process of elimination.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-red-700" itemProp="name">What makes Plotle so popular?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Plotle&apos;s popularity comes from its perfect blend of Wordle&apos;s addictive puzzle format with universal 
                  movie knowledge. The 6-word summaries are cleverly crafted to be challenging yet solvable, appealing 
                  to both casual movie watchers and hardcore film buffs. The daily challenge creates a shared experience 
                  and friendly competition among players.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-red-700" itemProp="name">Is Plotle educational?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Absolutely! Plotle helps players learn about different movies, genres, directors, actors, and film history. 
                  It improves pattern recognition, deductive reasoning, and film literacy. Many players discover new movies 
                  to watch through the game and learn interesting facts about films they already love.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-red-700" itemProp="name">What types of movies are included?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Plotle features a diverse range of movies from classic Hollywood to modern blockbusters, including dramas, 
                  comedies, action films, sci-fi, fantasy, horror, documentaries, and international cinema. The database includes 
                  both well-known popular films and hidden gems to provide balanced challenges for all knowledge levels.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-red-700" itemProp="name">Can I play previous days&apos; puzzles?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Currently, Plotle features one new puzzle each day. This daily format creates anticipation and makes each 
                  puzzle a special event that the community solves together. Many players enjoy the shared experience of 
                  everyone working on the same movie challenge each day.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-red-700" itemProp="name">Is Plotle free to play?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Plotle is completely free to play with no registration required. New movie puzzles are available 
                  every day at midnight local time. The game is supported by optional ads that can be hidden if desired.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Enhanced Hidden SEO Content for Popular Game */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Plotle - Daily Movie Plot Guessing Game</h2>
            <p itemProp="description">
              Test your movie knowledge with Plotle, the ultimate daily puzzle game where you guess films 
              based on clever 6-word plot summaries with Wordle-style feedback. The most popular movie 
              guessing game for film buffs and casual viewers alike. Join thousands of players worldwide 
              in this addictive daily film challenge.
            </p>
            <h3>How to Play Plotle:</h3>
            <ul>
              <li>Guess the movie in 6 attempts using the 6-word plot summary</li>
              <li>Get Wordle-style color feedback on your guesses</li>
              <li>Green: Correct word in right position</li>
              <li>Yellow: Correct word in wrong position</li>
              <li>Gray: Word not in the plot summary</li>
              <li>Use process of elimination to deduce the movie</li>
              <li>New movie puzzle every day at midnight</li>
              <li>Completely free with no registration required</li>
            </ul>
            <h3>Why Plotle is So Popular:</h3>
            <ul>
              <li>Perfect blend of Wordle mechanics and movie trivia</li>
              <li>Challenging yet accessible for all knowledge levels</li>
              <li>Clever 6-word summaries that test film literacy</li>
              <li>Daily shared experience with global community</li>
              <li>Discover new movies and learn film facts</li>
              <li>Friendly competition with friends and family</li>
              <li>Clean, intuitive interface with cinematic design</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily movie challenges with diverse films</li>
              <li>Wordle-style color feedback system</li>
              <li>Six-word plot summary clues</li>
              <li>Comprehensive movie database</li>
              <li>Mobile-friendly cinematic design</li>
              <li>No time limits - play at your pace</li>
              <li>Share results without spoilers</li>
              <li>Learn about film history and genres</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Improve film knowledge and recognition</li>
              <li>Learn about different genres and directors</li>
              <li>Enhance pattern recognition skills</li>
              <li>Develop deductive reasoning abilities</li>
              <li>Expand cultural and cinematic literacy</li>
              <li>Discover new movies to watch</li>
            </ul>
            <p><strong>Perfect for:</strong> Movie lovers, film students, cinema enthusiasts, trivia fans, 
               families, friends, and anyone who enjoys testing their movie knowledge in a fun, 
               engaging daily challenge. Join the Plotle community today!</p>
              
            <p><strong>Player Testimonials:</strong> &quot;Addictive movie game that makes me think about films in new ways!&quot; 
               - &quot;The perfect combination of Wordle and my love for movies!&quot; - &quot;I&apos;ve discovered so many great films 
               through Plotle!&quot; - &quot;Our family&apos;s favorite daily ritual!&quot;</p>
          </div>
        </div>
      </div>
    </div>
  );
}