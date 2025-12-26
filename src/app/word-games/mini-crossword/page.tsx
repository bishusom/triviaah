// src/app/word-games/mini-crossword/page.tsx
'use client';

import MuteButton from '@/components/common/MuteButton';
import MiniCrosswordGame from '@/components/word-games/MiniCrosswordGame';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function MiniCrosswordPage() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Mini Crossword
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
      knowsAbout: ['Trivia', 'Quiz Games', 'Word Games', 'Educational Entertainment', 'Crossword Puzzles', 'Mini Crossword']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Free Mini Crossword Puzzles Online | 5-Letter Word Crosswords | Elite Trivias',
      description: 'Play free mini crossword puzzles online. Solve quick 5x5 crosswords with Wordle-style feedback. Perfect for daily brain training and vocabulary practice.',
      url: 'https://elitetrivias.com/word-games/mini-crossword',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Mini Crossword',
        description: 'Quick 5x5 crossword puzzles with Wordle-style letter feedback. Features daily puzzles, multiple difficulty levels, and educational word practice.',
        gameLocation: 'https://elitetrivias.com/word-games/mini-crossword',
        characterAttribute: 'Vocabulary, Spelling, Pattern Recognition, Cognitive Skills, Daily Brain Training'
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
          item: 'https://elitetrivias.com'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Word Games',
          item: 'https://elitetrivias.com/word-games'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Mini Crossword',
          item: 'https://elitetrivias.com/word-games/mini-crossword'
        }
      ]
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Mini Crossword?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Mini Crossword is a quick 5x5 crossword puzzle that can be solved in minutes. It features 5-letter words with clues, and includes Wordle-style letter feedback to help you learn.'
          }
        },
        {
          '@type': 'Question',
          name: 'How does Wordle-style feedback work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Green letters are correct and in the right position, yellow letters are in the word but wrong position, and gray letters are not in the word at all. This helps you learn as you play.'
          }
        },
        {
          '@type': 'Question',
          name: 'How long does it take to solve?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Mini crosswords typically take 2-5 minutes to solve, making them perfect for quick brain breaks or daily mental exercise.'
          }
        }
      ]
    }
  });

  useEffect(() => {
    setLastUpdated(new Date().toISOString());
  }, []);

  return (
    <div className="page-with-ads">
      {/* Structured Data */}
      <Script
        id="mini-crossword-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="mini-crossword-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="mini-crossword-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
      />
      <Script
        id="mini-crossword-faq-schema"
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

      <div className="max-w-3xl mx-auto p-4">
        {/* Header with Last Updated */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold">Free Mini Crossword Puzzles Online</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-orange-50 px-3 py-1 rounded-full text-xs font-medium border border-orange-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-lg text-gray-600">
            Solve quick 5x5 crossword puzzles with Wordle-style feedback. Perfect for daily brain training 
            and vocabulary practice with instant letter validation.
          </p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <MiniCrosswordGame />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Mini Crossword Game Information & FAQ</h2>
              <span className="text-gray-500 transition-transform duration-200 group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
              <div>
                <h3 className="font-semibold">Game Features</h3>
                <p className="text-gray-600 text-sm">
                  <strong>Last updated:</strong> {new Date(lastUpdated).toLocaleString()} • 
                  <strong>Grid Size:</strong> 5x5 • 
                  <strong>Word Length:</strong> 5 letters • 
                  <strong>Check Mode:</strong> Always on with Wordle-style feedback
                </p>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What is Mini Crossword?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Mini Crossword is a quick 5x5 crossword puzzle that can be solved in 2-5 minutes. 
                  It features 5-letter words with clues and includes Wordle-style letter feedback 
                  (green = correct position, yellow = wrong position, gray = not in word) to help you learn as you play.
                </p>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How does Wordle-style feedback work?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  As you type, letters immediately show their status: 
                  <span className="inline-block w-4 h-4 bg-green-500 rounded ml-2 mr-1"></span> Green = correct letter in correct position, 
                  <span className="inline-block w-4 h-4 bg-yellow-500 rounded ml-2 mr-1"></span> Yellow = letter exists but wrong position, 
                  <span className="inline-block w-4 h-4 bg-gray-500 rounded ml-2 mr-1"></span> Gray = letter not in the word at all.
                </p>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How long does it take to solve?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Mini crosswords typically take 2-5 minutes to solve, making them perfect for quick brain breaks, 
                  daily mental exercise, or short commutes. They&apos;re designed to be completed faster than traditional crosswords 
                  while still providing satisfying word puzzle challenge.
                </p>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What are the educational benefits?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Mini crosswords improve vocabulary, spelling, and pattern recognition. The instant feedback helps 
                  reinforce correct spellings and word structures. They&apos;re excellent for language learning, 
                  cognitive maintenance, and building confidence with word puzzles through progressive difficulty.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Game Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Play Mini Crossword</h2>
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-lg font-semibold mb-2">Game Rules:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Fill in the 5x5 grid with 5-letter words based on clues</li>
                <li>Words intersect horizontally (across) and vertically (down)</li>
                <li>Type letters directly into the grid squares</li>
                <li>Get instant Wordle-style feedback on each letter</li>
                <li>Complete all words to finish the puzzle</li>
                <li>Use keyboard arrows or click to navigate between cells</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Wordle-Style Feedback:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="inline-block w-4 h-4 bg-green-500 rounded mr-2"></span>Green: Correct letter in correct position</li>
                <li><span className="inline-block w-4 h-4 bg-yellow-500 rounded mr-2"></span>Yellow: Letter exists but wrong position</li>
                <li><span className="inline-block w-4 h-4 bg-gray-500 rounded mr-2"></span>Gray: Letter not in this word at all</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Navigation Tips:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Click any white square to start typing</li>
                <li>Use arrow keys to move between cells</li>
                <li>Backspace deletes and moves backward</li>
                <li>Letters automatically advance to next cell</li>
                <li>Black squares are blocked and can&apos;t be selected</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">Mini Crossword Pro Tips:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Start with the clues you know best</li>
                <li>Use intersecting letters to help solve crossing words</li>
                <li>Pay attention to the Wordle feedback - it teaches correct spellings</li>
                <li>Common 5-letter patterns: -ING, -TION, -MENT endings</li>
                <li>Think about word categories mentioned in clues</li>
                <li>Use the feedback colors to eliminate wrong letter choices</li>
                <li>Practice daily to improve speed and vocabulary</li>
              </ul>
            </div>
          </div>
          
          {/* Educational Benefits Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Play Mini Crossword?</h3>
            <div className="prose text-gray-700">
              <p className="mb-4">
                Mini crosswords combine the classic crossword experience with modern Wordle-style learning feedback. 
                Our <strong>free mini crossword puzzles</strong> offer numerous benefits:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Expands vocabulary through 5-letter word exposure</li>
                <li>Improves spelling with instant visual feedback</li>
                <li>Enhances pattern recognition and word structure understanding</li>
                <li>Develops quick thinking and mental agility</li>
                <li>Provides satisfying daily brain exercise in just minutes</li>
                <li>Builds confidence for larger crossword puzzles</li>
                <li>Perfect for busy schedules and short breaks</li>
                <li>Educational tool for vocabulary building and spelling practice</li>
              </ul>
              <p>
                Whether you&apos;re a crossword beginner looking to build skills, a word game enthusiast seeking 
                quick daily challenges, or someone wanting to maintain mental sharpness, our 
                <strong> free online mini crosswords </strong> provide the perfect combination of learning 
                and entertainment. With new puzzles added regularly and progressive difficulty levels, 
                you&apos;ll always have fresh word challenges to explore and master.
              </p>
            </div>
          </div>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Mini Crossword - Free Online 5x5 Crossword Puzzles with Wordle Feedback</h2>
            <p itemProp="description">
              Play free mini crossword puzzles online with Wordle-style letter feedback. Solve quick 5x5 
              crosswords featuring 5-letter words with instant validation. Perfect for daily brain training, 
              vocabulary practice, and educational word puzzle fun. Features include green/yellow/gray letter 
              feedback, daily puzzles, multiple difficulty levels, and printable options for offline enjoyment.
            </p>
            <h3>How to Play Mini Crossword:</h3>
            <ul>
              <li>Fill 5x5 grid with 5-letter words based on clues</li>
              <li>Words intersect horizontally (across) and vertically (down)</li>
              <li>Type letters directly into grid squares</li>
              <li>Get instant Wordle-style feedback: green=correct, yellow=wrong position, gray=not in word</li>
              <li>Complete all intersecting words to finish puzzle</li>
              <li>Use keyboard arrows or mouse to navigate between cells</li>
              <li>Black squares are blocked and cannot be filled</li>
              <li>Backspace deletes letters and moves backward</li>
              <li>New puzzles available daily with fresh clues and words</li>
              <li>Completely free with no registration required</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>5x5 grid size with 5-letter words only</li>
              <li>Wordle-style letter feedback (green/yellow/gray)</li>
              <li>Instant validation as you type</li>
              <li>Across and down clues for each word</li>
              <li>Keyboard navigation with arrow keys</li>
              <li>Mobile-friendly touch interface</li>
              <li>Daily new puzzles with themed words</li>
              <li>Multiple difficulty levels</li>
              <li>Progress tracking and statistics</li>
              <li>Printable PDF versions for offline play</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Improves vocabulary with 5-letter word exposure</li>
              <li>Enhances spelling through instant visual feedback</li>
              <li>Develops pattern recognition and word structure skills</li>
              <li>Builds crossword solving confidence for beginners</li>
              <li>Provides quick daily mental exercise</li>
              <li>Reinforces correct letter placement and word formation</li>
              <li>Perfect for language learning and ESL students</li>
              <li>Maintains cognitive function and mental sharpness</li>
            </ul>
            <p><strong>Perfect for:</strong> Crossword beginners, word game enthusiasts, students building vocabulary, 
               educators seeking classroom activities, seniors maintaining mental agility, busy professionals wanting 
               quick brain breaks, and anyone who enjoys learning through word puzzles with instant feedback.</p>
          </div>
        </div>
      </div>
    </div>
  );
}