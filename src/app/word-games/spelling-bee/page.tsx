// src/app/word-games/spelling-bee/page.tsx
'use client';

import MuteButton from '@/components/common/MuteButton';
import SpellingBeeGame from '@/components/word-games/SpellingBeeGame';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function SpellingBeePage() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Spelling Bee
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
      knowsAbout: ['Trivia', 'Quiz Games', 'Word Games', 'Educational Entertainment', 'Vocabulary Games', 'Spelling Games', 'Language Games']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Free Spelling Bee Game Online | Vocabulary Challenge | Triviaah',
      description: 'Play free Spelling Bee game online. Create words from 7 letters with our daily puzzle challenge. Improve your vocabulary, spelling skills, and find all possible words.',
      url: 'https://triviaah.com/word-games/spelling-bee',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Spelling Bee',
        description: 'Classic word formation game where players create words from 7 letters, with daily puzzles, multiple difficulty levels, and vocabulary building challenges.',
        gameLocation: 'https://triviaah.com/word-games/spelling-bee',
        characterAttribute: 'Vocabulary, Spelling, Word Formation, Language Skills, Cognitive Training, Pattern Recognition'
      }
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://triviaah.com'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Word Games',
          item: 'https://triviaah.com/word-games'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Spelling Bee',
          item: 'https://triviaah.com/word-games/spelling-bee'
        }
      ]
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Spelling Bee?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Spelling Bee is a word game where players create words from 7 letters arranged in a honeycomb pattern. Every word must include the center letter, and words must be at least 4 letters long.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do you play Spelling Bee?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Create words using the letters in the honeycomb. Every word must contain the center letter, be at least 4 letters long, and can use letters multiple times. Proper nouns and hyphenated words are not allowed.'
          }
        },
        {
          '@type': 'Question',
          name: 'What are pangrams in Spelling Bee?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Pangrams are words that use all 7 letters at least once. They earn bonus points and are key to achieving higher scores and rankings in the game.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Spelling Bee educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Spelling Bee is excellent for vocabulary building, spelling practice, and cognitive development. It helps players discover new words, improve spelling, and enhance pattern recognition skills.'
          }
        }
      ]
    }
  });

  useEffect(() => {
    // Update last modified time on client side
    setLastUpdated(new Date().toISOString());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Structured Data */}
      <Script
        id="spelling-bee-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="spelling-bee-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="spelling-bee-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
      />
      <Script
        id="spelling-bee-faq-schema"
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

      <div className="max-w-3xl mx-auto p-4">
        {/* Header with Last Updated */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold mb-2">Free Spelling Bee Game Online</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-green-500/10 border border-green-500/20 text-white"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Challenge your vocabulary with our daily Spelling Bee puzzle. Find as many words as possible 
            from 7 letters and aim for the coveted Genius rank!
          </p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <SpellingBeeGame />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold text-white">Spelling Bee Game Information & FAQ</h2>
              <span className="text-gray-500 transition-transform duration-200 group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
              {/* Content Freshness Info */}
              <div>
                <h3 className="font-semibold text-white">Game Updates</h3>
                <p className="text-gray-300 text-sm">
                  <strong>Last updated:</strong> {new Date(lastUpdated).toLocaleString()} (Server Time)
                </p>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">What is Spelling Bee?</h3>
                <p className="text-gray-200" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Spelling Bee is a classic word game where players create words from 7 letters arranged in a honeycomb pattern. 
                  Every word must include the center letter, and words must be at least 4 letters long. It&apos;s an engaging 
                  vocabulary challenge that tests your word knowledge and pattern recognition skills.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">How do you play Spelling Bee?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Create words using the letters in the honeycomb. Every word must contain the center letter, be at least 
                  4 letters long, and can use letters multiple times. Proper nouns, hyphenated words, and offensive terms 
                  are not allowed. The goal is to find as many words as possible to achieve the highest rank.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">What are pangrams in Spelling Bee?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Pangrams are words that use all 7 letters at least once. They earn significant bonus points (typically 
                  +7 points) and are essential for achieving higher scores and reaching the Genius rank. Finding the 
                  pangram is often key to maximizing your score in each puzzle.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">Is Spelling Bee educational?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Spelling Bee is excellent for vocabulary building, spelling practice, and cognitive development. 
                  It helps players discover new words, improve spelling, enhance pattern recognition skills, and develop 
                  better language processing abilities. Many educators use spelling bee games as effective teaching tools.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">What is the scoring system?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  4-letter words earn 1 point, with each additional letter adding 1 more point. Pangrams (words using 
                  all 7 letters) earn a 7-point bonus. The ranking system progresses from Beginner (0-4 points) to 
                  Genius (200+ points), with multiple tiers in between to track your progress.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">Is this Spelling Bee game free to play?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Our online Spelling Bee game is completely free to play with no registration required. 
                  You can play daily new puzzles, track your progress, and challenge yourself to reach Genius 
                  rank without any cost or subscription.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Game Rules Section */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Play Spelling Bee</h2>
          <div className="space-y-6 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold mb-2">Game Rules:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Create words using the letters in the honeycomb</li>
                <li>Every word must contain the <strong>center letter</strong></li>
                <li>Words must be at least <strong>4 letters</strong> long</li>
                <li>Letters can be used more than once in a word</li>
                <li>Proper nouns and hyphenated words are not allowed</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Scoring System:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>4-letter words: <strong>1 point</strong></li>
                <li>Each additional letter: <strong>+1 point</strong> per letter</li>
                <li>Pangrams (words using all 7 letters): <strong>+7 bonus points</strong></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Ranking System:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-green-300">Beginner:</strong> 0-4 points</li>
                <li><strong className="text-green-300">Good Start:</strong> 5-9 points</li>
                <li><strong className="text-green-300">Moving Up:</strong> 10-19 points</li>
                <li><strong className="text-green-300">Good:</strong> 20-29 points</li>
                <li><strong className="text-green-300">Solid:</strong> 30-49 points</li>
                <li><strong className="text-green-300">Nice:</strong> 50-69 points</li>
                <li><strong className="text-green-300">Great:</strong> 70-99 points</li>
                <li><strong className="text-green-300">Amazing:</strong> 100-199 points</li>
                <li><strong className="text-green-300">Genius:</strong> 200+ points</li>
              </ul>
            </div>

            <div className="p-4 bg-green-500/10 border border-green-500/20 text-white">
              <h4 className="font-bold text-white mb-2">Pro Tips:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Look for common prefixes (re-, un-, pre-) and suffixes (-ing, -tion, -ment)</li>
                <li>Start with the center letter and build outward</li>
                <li>Plurals often work (add -s or -es to found words)</li>
                <li>Try changing verb tenses (play → played → playing)</li>
                <li>Don&apos;t forget to look for compound words and less common forms</li>
                <li>Focus on finding the pangram early for maximum points</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Spelling Bee - Free Online Vocabulary Challenge</h2>
            <p itemProp="description">
              Challenge your vocabulary with our free Spelling Bee game! Create words from 7 letters in a honeycomb 
              pattern, discover new vocabulary, and improve your spelling skills with daily puzzles. Perfect for word 
              game enthusiasts, students, educators, and anyone looking to enhance their language skills through 
              engaging, educational gameplay.
            </p>
            <h3>How to Play Spelling Bee:</h3>
            <ul>
              <li>Create words from 7 letters arranged in a honeycomb</li>
              <li>Every word must include the center letter</li>
              <li>Words must be at least 4 letters long</li>
              <li>Letters can be reused within words</li>
              <li>Find pangrams (words using all 7 letters) for bonus points</li>
              <li>Aim for Genius rank by finding all possible words</li>
              <li>Daily new puzzles with fresh letter combinations</li>
              <li>Completely free with no registration required</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily Spelling Bee challenges</li>
              <li>Vocabulary building and spelling practice</li>
              <li>Multiple difficulty levels and rankings</li>
              <li>Pangram discovery for bonus points</li>
              <li>Progress tracking and achievement system</li>
              <li>Educational word definitions</li>
              <li>Mobile-friendly honeycomb interface</li>
              <li>Hint system for learning assistance</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Expands vocabulary with new word discoveries</li>
              <li>Improves spelling and word recognition</li>
              <li>Enhances pattern recognition and cognitive skills</li>
              <li>Develops strategic thinking and problem-solving</li>
              <li>Builds language processing and mental flexibility</li>
              <li>Reinforces English language skills</li>
              <li>Encourages lifelong learning habits</li>
            </ul>
            <p><strong>Perfect for:</strong> Word game enthusiasts, students learning English, educators seeking 
               engaging teaching tools, seniors maintaining cognitive health, and anyone wanting to improve 
               their vocabulary, spelling, and language skills through entertaining daily challenges.</p>
          </div>
        </div>
      </div>
    </div>
  );
}