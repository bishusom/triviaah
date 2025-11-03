// src/app/literale/page.tsx
'use client';

import LiteraleComponent from '@/components/brainwave/LiteraleComponent';
import { getDailyLiterale } from '@/lib/brainwave/literale/literale-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import { LiteraleData } from '@/lib/brainwave/literale/literale-logic';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function LiteralePage() {
  const [literaleData, setLiteraleData] = useState<LiteraleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());

  // Structured data for Literale
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Literature Games', 'Book Puzzles', 'Reading Education']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Literale - Daily Literature Puzzle | Elite Trivias',
      description: 'Guess the book title from opening lines and progressive clues with limited attempts, Wordle-style feedback on title letters. Unlock more hints with each wrong guess!',
      url: 'https://elitetrivias.com/brainwave/literale',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Literale',
        description: 'Daily literature puzzle game where players identify book titles based on opening lines, progressive clues, and Wordle-style letter feedback with limited attempts.',
        gameLocation: 'https://elitetrivias.com/brainwave/literale',
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
    // Set the current date on the client side to ensure it's using client timezone
    const now = new Date();
    setCurrentDate(now);
    setLastUpdated(now.toISOString());
  }, []);

  useEffect(() => {
    const fetchDailyLiterale = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyLiterale(currentDate);
        
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
  }, [currentDate]);

  // Show loading while waiting for client date or data
  if (isLoading || !currentDate) {
    return (
      <div className="page-with-ads">
        {/* Structured Data */}
        <Script
          id="literale-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="literale-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="literale-faq-schema"
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
          <Ads isMobileFooter={true} format="horizontal" style={{ width: '100%', height: '100px' }} />
        )}
        
        <div className="max-w-2xl mx-auto p-6 text-center">
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold mb-2">📚 Literale - Book Guessing Game</h1>
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
          <p className="text-gray-600 mb-6">Guess the book from opening lines and clues in 6 tries!</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s book puzzle...</p>

          {/* Hidden SEO Content */}
          <div className="sr-only" aria-hidden="false">
            <div itemScope itemType="https://schema.org/Game">
              <meta itemProp="dateModified" content={lastUpdated} />
              <h2>Literale - Daily Book Guessing Game</h2>
              <p itemProp="description">
                Test your literary knowledge with Literale, a daily puzzle game where you guess book titles 
                based on opening lines, progressive clues, and Wordle-style letter feedback. Educational 
                and fun for book lovers and literature enthusiasts of all ages.
              </p>
              <h3>How to Play Literale:</h3>
              <ul>
                <li>Guess the book title in 6 attempts</li>
                <li>Start with opening lines and unlock more hints with wrong guesses</li>
                <li>Use Wordle-style letter feedback to identify correct letters</li>
                <li>Learn about famous books and authors</li>
                <li>New book puzzle every day</li>
                <li>Completely free with no registration required</li>
              </ul>
              <p><strong>Game Features:</strong> Daily literature challenges, educational reading content, 
                 progressive clue system, opening line hints, and comprehensive book database.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !literaleData) {
    return (
      <div className="page-with-ads">
        {/* Structured Data */}
        <Script
          id="literale-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="literale-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="literale-faq-schema"
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
            <h1 className="text-3xl font-bold mb-2">📚 Literale - Book Guessing Game</h1>
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
          <p className="text-gray-600 mb-4">Guess the book from opening lines and clues in 6 tries!</p>
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
        id="literale-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="literale-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="literale-faq-schema"
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
            <h1 className="text-3xl font-bold">📚 Literale</h1>
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
          <p className="text-gray-600">Guess the book from opening lines and clues in 6 tries!</p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <LiteraleComponent initialData={literaleData} />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Literale Game Information & FAQ</h2>
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
                <h3 className="font-semibold" itemProp="name">What is Literale?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Literale is a daily literature puzzle game where you guess the book title using opening lines, 
                  progressive clues, and Wordle-style letter feedback. It&apos;s an educational game that tests your 
                  knowledge of literature, famous books, and authors in a fun, interactive way.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do I play Literale?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  You have 6 attempts to guess the daily book title. Start with opening lines and unlock more 
                  detailed literary hints with each wrong guess. Use Wordle-style letter feedback to identify 
                  which letters are correct and in the right position, helping you deduce the book title.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What types of clues does Literale provide?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Literale provides multiple types of clues: Opening lines from the book, progressive text hints 
                  that unlock with wrong guesses (revealing more about the plot, characters, or author), and 
                  Wordle-style letter feedback showing correct letters in green, misplaced letters in yellow, 
                  and incorrect letters in gray.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Literale educational?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Literale is designed to be both fun and educational. Players learn about famous books, 
                  authors, literary quotes, reading comprehension, and literary analysis while playing. It&apos;s 
                  great for book lovers, literature students, educators, and anyone interested in expanding 
                  their literary knowledge.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What types of books are included?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Literale features a wide variety of books from different genres and time periods, including 
                  classic literature, contemporary fiction, famous novels, children&apos;s books, young adult 
                  fiction, and notable non-fiction works from authors around the world.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Literale free to play?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Literale is completely free to play with no registration required. New book puzzles 
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
            <h2>Literale - Daily Book Guessing Game</h2>
            <p itemProp="description">
              Test your literary knowledge with Literale, a daily puzzle game where you guess book titles 
              based on opening lines, progressive clues, and Wordle-style letter feedback. Educational 
              and fun for book lovers and literature enthusiasts of all ages. Perfect for readers, students, 
              educators, and anyone who loves the world of books and literature.
            </p>
            <h3>How to Play Literale:</h3>
            <ul>
              <li>Guess the book title in 6 attempts</li>
              <li>Start with opening lines and unlock more hints with wrong guesses</li>
              <li>Use Wordle-style letter feedback to identify correct letters</li>
              <li>Learn about famous books and authors</li>
              <li>New book puzzle every day</li>
              <li>Completely free with no registration required</li>
              <li>Educational and entertaining for all ages</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily literature challenges with diverse books</li>
              <li>Educational reading and literary content</li>
              <li>Progressive clue system that reveals more with each guess</li>
              <li>Opening line hints from famous books</li>
              <li>Wordle-style letter feedback mechanics</li>
              <li>Comprehensive book database</li>
              <li>Mobile-friendly design</li>
              <li>No time pressure - play at your own pace</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Learn about famous books and their authors</li>
              <li>Improve reading comprehension and literary analysis</li>
              <li>Discover new books and expand reading horizons</li>
              <li>Enhance vocabulary and language skills</li>
              <li>Develop critical thinking and deductive reasoning</li>
              <li>Explore different literary genres and styles</li>
            </ul>
            <p><strong>Perfect for:</strong> Book lovers, literature students, educators, librarians, 
               book club members, and anyone wanting to test and expand their literary knowledge in a 
               fun, engaging way.</p>
          </div>
        </div>
      </div>
    </div>
  );
}