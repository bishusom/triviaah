// src/app/brainwave/botanle/page.tsx
'use client';

import BotanleComponent from '@/components/brainwave/BotanleComponent';
import { getDailyPlant, BotanlePuzzle } from '@/lib/brainwave/botanle/botanle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { Leaf, Clock, Sparkles, Target, Zap, ThermometerSun, Droplets, Flower } from 'lucide-react';

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
    const now = new Date();
    setCurrentDate(now);
    setLastUpdated(now.toISOString());
  }, []);

  useEffect(() => {
    const fetchDailyPlant = async () => {
      if (!currentDate) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getDailyPlant(currentDate);
        
        if (!data || !data.puzzle) {
          setError('No plant puzzle available for today');
          return;
        }
        
        setBotanleData(data.puzzle);

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
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-3 rounded-2xl">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-500 to-green-800 bg-clip-text text-transparent">
                BOTANLE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Guess the Plant Challenge</p>
          </div>

          {/* Loading Card */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
                <Target className="w-10 h-10 text-emerald-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Loading Today's Challenge</h2>
            <p className="text-gray-400 mb-6">Preparing your plant puzzle...</p>
            
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
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

        {/* Ads */}
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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-3 rounded-2xl">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                BOTANLE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Guess The Plant Challenge</p>
          </div>

          {/* Error Card */}
          <div className="bg-red-500/10 backdrop-blur-lg rounded-3xl border border-red-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Challenge Unavailable</h2>
            <p className="text-red-200 mb-6">We couldn't load today's botanle puzzle.</p>
            
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-6">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
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
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-3 rounded-2xl">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                BOTANLE
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-emerald-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-emerald-400 text-sm font-medium"
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
          
          <p className="text-gray-300 text-lg mb-2">Guess the plant in 6 attempts</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Flower className="w-5 h-5 text-emerald-400" />
              <span className="text-sm">Plant Categories</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <ThermometerSun className="w-5 h-5 text-amber-400" />
              <span className="text-sm">Growing Hints</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Droplets className="w-5 h-5 text-blue-400" />
              <span className="text-sm">Water Needs</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-red-400" />
              <span className="text-sm">6 Attempts</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
       {botanleData && <BotanleComponent initialData={{ puzzle: botanleData }} />}

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6 relative z-10">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none p-4 hover:bg-gray-700/30 rounded-2xl transition-all duration-300">
              <h2 className="text-xl font-bold text-white">Game Guide & FAQ</h2>
              <span className="text-emerald-400 group-open:rotate-180 transition-transform duration-300 text-2xl">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-6 pt-6 border-t border-gray-700">
              <div className="grid gap-4">
                {[
                  {
                    question: "What is Botanle?",
                    answer: "Botanle is a daily plant puzzle game where you guess the target plant (flower, tree, herb, etc.) in 6 attempts. It features progressive botanical clues and Wordle-style letter feedback to help you solve the puzzle."
                  },
                  {
                    question: "How do I play Botanle?",
                    answer: "You have 6 attempts to guess the daily plant. Start with basic botanical clues, and get more detailed hints with each wrong guess. You also get letter feedback similar to Wordle. Both common names and scientific names are accepted."
                  },
                  {
                    question: "What types of clues are provided?",
                    answer: "Botanical clues include plant category, family, native region, growing requirements (sun, water), size, flower colors, special features, uses, and conservation status. Clues become more specific with each attempt."
                  },
                  {
                    question: "Can I use scientific names?",
                    answer: "Yes! Botanle accepts both common plant names and scientific names (Latin botanical names). The game will recognize either form. This makes it educational for both casual gardeners and botany enthusiasts."
                  },
                  {
                    question: "What types of plants are included?",
                    answer: "The game includes flowers, trees, herbs, succulents, vegetables, shrubs, ferns, cacti, vines, and other plant categories from around the world. You'll encounter both common garden plants and rare species."
                  },
                  {
                    question: "Is Botanle educational?",
                    answer: "Absolutely! Botanle teaches players about plant identification, botanical terminology, growing requirements, plant families, and conservation. It's perfect for gardeners, botany students, and nature enthusiasts wanting to expand their plant knowledge."
                  },
                  {
                    question: "Is Botanle free to play?",
                    answer: "Yes! Botanle is completely free to play with no registration required. New plant puzzles are available every day at midnight local time."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-2xl p-4">
                    <h3 className="font-semibold text-emerald-400 mb-2">{faq.question}</h3>
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only mt-8" aria-hidden="false">
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