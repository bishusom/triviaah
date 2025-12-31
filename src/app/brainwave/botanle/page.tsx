    // src/app/brainwave/botanle/page.tsx
'use client';

import BotanleComponent from '@/components/brainwave/BotanleComponent';
import { getDailyPlant, BotanlePuzzle } from '@/lib/brainwave/botanle/botanle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function BotanlePage() {
  const [botanleData, setBotanleData] = useState<BotanlePuzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Botanle
  const [structuredData, setStructuredData] = useState({
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Triviaah',
      url: 'https://triviaah.com',
      description: 'Free daily botanical puzzles and plant identification games. Test your knowledge of plants, flowers, trees, and herbs from around the world.',
      logo: 'https://triviaah.com/logo.png',
      sameAs: [],
      foundingDate: '2024',
      knowsAbout: ['Botany', 'Plant Identification', 'Gardening', 'Horticulture', 'Botanical Science', 'Plant Taxonomy']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Botanle - Daily Plant Guessing Game | Triviaah',
      description: 'Guess the plant from progressive botanical clues in 6 attempts! Wordle-style feedback on plant names. Unlock more hints with each guess. Daily plant puzzle.',
      url: 'https://triviaah.com/brainwave/botanle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Botanle',
        description: 'Daily plant guessing game where players have 6 attempts to identify the target plant using progressive botanical clues and letter feedback.',
        gameLocation: 'https://triviaah.com/brainwave/botanle',
        characterAttribute: 'Plants, Flowers, Trees, Herbs, Gardening, Botany, Horticulture'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Botanle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Botanle is a daily plant puzzle game where you guess the target plant (flower, tree, herb, etc.) in 6 attempts. It features progressive botanical clues and Wordle-style letter feedback to help you solve the puzzle.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Botanle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You have 6 attempts to guess the daily plant. Start with basic botanical clues, and get more detailed hints with each wrong guess. You also get letter feedback similar to Wordle. Both common names and scientific names are accepted.'
          }
        },
        {
          '@type': 'Question',
          name: 'What types of clues are provided?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Botanical clues include plant category, family, native region, growing requirements (sun, water), size, flower colors, special features, uses, and conservation status.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Botanle free to play?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Botanle is completely free to play with no registration required. New plant puzzles are available every day.'
          }
        },
        {
          '@type': 'Question',
          name: 'Can I use scientific names?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Botanle accepts both common plant names and scientific names (Latin botanical names). The game will recognize either form.'
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
    const fetchDailyPlant = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyPlant(currentDate);
        
        if (!data || !data.puzzle) {
          setError('No plant puzzle available for today');
          return;
        }
        
        setBotanleData(data.puzzle);

        // Update structured data with today's puzzle info
        setStructuredData(prev => ({
          ...prev,
          webpage: {
            ...prev.webpage,
            dateModified: new Date().toISOString()
          }
        }));
        
      } catch (err) {
        console.error('Error fetching daily botanle puzzle:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyPlant();
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
            <h1 className="text-3xl font-bold mb-2">🌿 Botanle - Plant Guessing Game</h1>
            {/* Last Updated Timestamp */}
            <time 
              dateTime={lastUpdated} 
              className="bg-emerald-50 px-3 py-1 rounded-full text-xs font-medium border border-emerald-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-6">Guess the plant from progressive botanical clues in 6 tries!</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s plant puzzle...</p>

          {/* Hidden SEO Content */}
          <div className="sr-only" aria-hidden="false">
            <div itemScope itemType="https://schema.org/Game">
              <meta itemProp="dateModified" content={lastUpdated} />
              <h2>Botanle - Daily Plant Guessing Game</h2>
              <p itemProp="description">
                Test your botanical knowledge with Botanle, a daily puzzle game where you guess plants 
                from progressive botanical clues. Similar to Wordle but focused on plant identification, 
                botanical science, and horticultural knowledge.
              </p>
              <h3>How to Play Botanle:</h3>
              <ul>
                <li>Guess the target plant in 6 attempts</li>
                <li>Get progressive botanical clues that become more specific with each wrong guess</li>
                <li>Receive Wordle-style letter feedback on plant names</li>
                <li>Use hints about plant category, native region, growing requirements, and features</li>
                <li>Both common names and scientific names are accepted</li>
                <li>New plant puzzle every day</li>
                <li>Completely free with no registration required</li>
              </ul>
              <p><strong>Game Features:</strong> Daily botanical challenges, progressive hint system, 
                 educational plant content, comprehensive plant database, scientific name support.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !botanleData) {
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
            <h1 className="text-3xl font-bold mb-2">🌿 Botanle - Plant Guessing Game</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-emerald-50 px-3 py-1 rounded-full text-xs font-medium border border-emerald-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-4">Guess the plant from progressive botanical clues in 6 tries!</p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="mb-2">No plant puzzle available for today.</p>
            <p className="text-sm">Please check back tomorrow or try refreshing the page!</p>
            {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded transition-colors"
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
            <h1 className="text-3xl font-bold">🌿 Botanle</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-emerald-50 px-3 py-1 rounded-full text-xs font-medium border border-emerald-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600">Guess the plant from progressive botanical clues in 6 tries! Daily plant identification puzzle.</p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>

        <BotanleComponent initialData={{ puzzle: botanleData }} />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-emerald-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold text-emerald-800">Botanle Game Information & FAQ</h2>
              <span className="text-emerald-500 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-4 pt-4 border-t border-emerald-200">
              {/* Content Freshness Info */}
              <div>
                <h3 className="font-semibold text-emerald-700">Game Updates</h3>
                <p className="text-emerald-600 text-sm">
                  <strong>Last updated:</strong> {new Date(lastUpdated).toLocaleString()} (Server Time)
                </p>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-emerald-700" itemProp="name">What is Botanle?</h3>
                <p className="text-emerald-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Botanle is a daily plant puzzle game where you guess the target plant (flower, tree, herb, etc.) in 6 attempts. 
                  It features progressive botanical clues and Wordle-style letter feedback to help you solve the puzzle.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-emerald-700" itemProp="name">How do I play Botanle?</h3>
                <p className="text-emerald-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  You have 6 attempts to guess the daily plant. Start with basic botanical clues, and get more detailed hints 
                  with each wrong guess. You also get letter feedback similar to Wordle. Both common names and scientific names are accepted.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-emerald-700" itemProp="name">What types of clues are provided?</h3>
                <p className="text-emerald-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Botanical clues include plant category (flower, tree, herb, etc.), family, native region, 
                  growing requirements (sun, water, soil), size, flower colors, special features, uses, 
                  and conservation status. Clues become more specific with each attempt.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-emerald-700" itemProp="name">Can I use scientific names?</h3>
                <p className="text-emerald-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Botanle accepts both common plant names and scientific names (Latin botanical names). 
                  The game will recognize either form. This makes it educational for both casual gardeners and botany enthusiasts.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-emerald-700" itemProp="name">What types of plants are included?</h3>
                <p className="text-emerald-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  The game includes flowers, trees, herbs, succulents, vegetables, shrubs, ferns, cacti, vines, 
                  and other plant categories from around the world. You&apos;ll encounter both common garden plants and rare species.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-emerald-700" itemProp="name">Is Botanle educational?</h3>
                <p className="text-emerald-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Absolutely! Botanle teaches players about plant identification, botanical terminology, 
                  growing requirements, plant families, and conservation. It&apos;s perfect for gardeners, 
                  botany students, and nature enthusiasts wanting to expand their plant knowledge.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-emerald-700" itemProp="name">Is Botanle free to play?</h3>
                <p className="text-emerald-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Botanle is completely free to play with no registration required. New plant puzzles 
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
            <h2>Botanle - Daily Plant Guessing Game</h2>
            <p itemProp="description">
              Test your botanical knowledge with Botanle, a daily puzzle game where you guess plants 
              from progressive botanical clues. Similar to Wordle but focused on plant identification, 
              botanical science, and horticultural knowledge. Perfect for gardeners, botany enthusiasts, 
              nature lovers, and anyone wanting to learn more about the plant kingdom.
            </p>
            <h3>How to Play Botanle:</h3>
            <ul>
              <li>Guess the target plant in 6 attempts</li>
              <li>Get progressive botanical clues that become more specific with each wrong guess</li>
              <li>Receive Wordle-style letter feedback on plant names</li>
              <li>Use hints about plant category, native region, growing requirements, and features</li>
              <li>Both common names and scientific names are accepted</li>
              <li>New plant puzzle every day</li>
              <li>Completely free with no registration required</li>
              <li>Educational and entertaining for all ages</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily plant challenges from various categories</li>
              <li>Progressive botanical hint system</li>
              <li>Wordle-inspired letter feedback mechanics</li>
              <li>Comprehensive plant database with scientific names</li>
              <li>Mobile-friendly design</li>
              <li>No time pressure - play at your own pace</li>
              <li>Learn interesting facts about plant biology and horticulture</li>
              <li>Conservation status and rarity information</li>
            </ul>
            <p><strong>Perfect for:</strong> Gardeners, botany students, nature enthusiasts, 
               horticulturalists, plant collectors, biology teachers, and anyone wanting to 
               improve their plant identification skills.</p>
          </div>
        </div>
      </div>
    </div>
  );
}