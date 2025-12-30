// src/app/word-games/word-search/page.tsx
'use client';

import MuteButton from '@/components/common/MuteButton';
import WordSearchGame from '@/components/word-games/WordSearchGame';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function WordSearchPage() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Word Search
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
      knowsAbout: ['Trivia', 'Quiz Games', 'Word Games', 'Educational Entertainment', 'Vocabulary Games', 'Puzzle Games', 'Brain Games']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Free Word Search Puzzles Online | Printable Word Find Games | Triviaah',
      description: 'Play free word search puzzles online. Find hidden words in our themed word find games. Perfect for vocabulary practice, relaxation, and educational fun for all ages.',
      url: 'https://triviaah.com/word-games/word-search',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Word Search',
        description: 'Classic word finding puzzle where players locate hidden words in letter grids. Features multiple difficulty levels, themed puzzles, and printable options for educational and recreational use.',
        gameLocation: 'https://triviaah.com/word-games/word-search',
        characterAttribute: 'Vocabulary, Pattern Recognition, Visual Scanning, Cognitive Skills, Relaxation, Educational Entertainment'
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
          name: 'Word Search',
          item: 'https://triviaah.com/word-games/word-search'
        }
      ]
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Word Search?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Word Search is a puzzle game where players find hidden words in a grid of letters. Words can be placed horizontally, vertically, diagonally, and sometimes backwards.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do you play Word Search?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Players scan the letter grid to find words from a given list. Words can be found in any straight line direction and are typically highlighted when found.'
          }
        },
        {
          '@type': 'Question',
          name: 'What are the benefits of playing Word Search?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Word Search improves vocabulary, spelling, pattern recognition, visual scanning skills, and provides relaxing mental exercise. It\'s great for cognitive maintenance and stress relief.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Word Search educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Word Search is excellent for vocabulary building, spelling practice, and developing pattern recognition skills. It\'s widely used in educational settings for language learning.'
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
    <div className="page-with-ads">
      {/* Structured Data */}
      <Script
        id="word-search-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="word-search-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="word-search-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
      />
      <Script
        id="word-search-faq-schema"
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
            <h1 className="text-3xl font-bold">Free Word Search Puzzles Online</h1>
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
            Discover hidden words in our themed word find games. Perfect for vocabulary practice, 
            relaxation, and educational fun for all ages.
          </p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <WordSearchGame />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Word Search Game Information & FAQ</h2>
              <span className="text-gray-500 transition-transform duration-200 group-open:rotate-180">
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
                <h3 className="font-semibold" itemProp="name">What is Word Search?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Word Search is a classic puzzle game where players find hidden words in a grid of letters. 
                  Words can be placed horizontally, vertically, diagonally, and sometimes backwards. It&apos;s 
                  one of the most popular and relaxing word games enjoyed by people of all ages worldwide.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do you play Word Search?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Players scan the letter grid to find words from a given list. Words can be found in any 
                  straight line direction (horizontal, vertical, diagonal) and are typically highlighted 
                  when found. The goal is to locate all hidden words in the grid as quickly as possible.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What are the benefits of playing Word Search?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Word Search improves vocabulary, spelling, pattern recognition, visual scanning skills, 
                  and provides relaxing mental exercise. It&apos;s great for cognitive maintenance, stress 
                  relief, and can even help improve concentration and attention to detail.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Word Search educational?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Word Search is excellent for vocabulary building, spelling practice, and developing 
                  pattern recognition skills. It&apos;s widely used in educational settings for language 
                  learning, and themed puzzles can help reinforce subject-specific terminology in an 
                  engaging, game-based format.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What difficulty levels are available?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  We offer three difficulty levels: Easy (10x10 grid with 10 words), Medium (15x15 grid 
                  with 15 words), and Hard (20x20 grid with 20 words). Each level features appropriately 
                  sized words and grid complexity to provide the right challenge for different skill levels.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Are there printable word search options?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Many of our word search puzzles are available as printable PDFs for offline enjoyment. 
                  This makes them perfect for classrooms, travel, or anywhere you want screen-free 
                  entertainment and educational activities.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Game Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Play Word Search</h2>
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-lg font-semibold mb-2">Game Rules:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Find all the hidden words in the grid</li>
                <li>Words can be horizontal, vertical, or diagonal</li>
                <li>Words may be forwards or backwards</li>
                <li>Click and drag or tap letters to select words</li>
                <li>Words must be at least 3 letters long</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Difficulty Levels:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Easy:</strong> 10x10 grid, 10 words (3-5 letters)</li>
                <li><strong>Medium:</strong> 15x15 grid, 15 words (4-7 letters)</li>
                <li><strong>Hard:</strong> 20x20 grid, 20 words (5-8 letters)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Progression System:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Complete 3 consecutive games to advance to the next difficulty</li>
                <li>Each level increases your score multiplier</li>
                <li>Track your best times and completion rates</li>
                <li>Earn achievements for special accomplishments</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">Word Search Pro Tips:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Look for unique letters in words (Q, X, Z) to help spot them quickly</li>
                <li>Scan rows, then columns, then diagonals systematically</li>
                <li>Watch for common word endings like -ING, -TION, -MENT</li>
                <li>Use the Hint button if you get stuck on a particular word</li>
                <li>Try our printable versions for offline fun and group activities</li>
                <li>Focus on longer words first as they&apos;re often easier to spot</li>
                <li>Look for word patterns and letter combinations you recognize</li>
              </ul>
            </div>
          </div>
          
          {/* Educational Benefits Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Play Word Search?</h3>
            <div className="prose text-gray-700">
              <p className="mb-4">
                Word Search is one of the most popular <strong>free word puzzles</strong> enjoyed by 
                millions worldwide. Our <strong>online word search</strong> games offer numerous benefits:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Improves vocabulary and spelling through repeated exposure to words</li>
                <li>Enhances pattern recognition and visual scanning abilities</li>
                <li>Provides relaxing, meditative gameplay that reduces stress</li>
                <li>Great educational tool for all ages, from children to seniors</li>
                <li>Available as <strong>printable word search</strong> options for offline play</li>
                <li>Helps maintain cognitive function and mental agility</li>
                <li>Themed puzzles expand knowledge in specific subject areas</li>
              </ul>
              <p>
                Whether you&apos;re looking for a quick brain teaser or a longer relaxing session, 
                our <strong>free word search</strong> puzzles provide the perfect combination of 
                challenge and enjoyment. With themed puzzles updated regularly across categories 
                like science, history, literature, and pop culture, you&apos;ll always find fresh 
                content to explore and learn from.
              </p>
            </div>
          </div>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Word Search - Free Online Word Finding Puzzles</h2>
            <p itemProp="description">
              Discover the joy of Word Search puzzles! Find hidden words in letter grids with our 
              free online word search games. Perfect for vocabulary practice, relaxation, cognitive 
              exercise, and educational fun for all ages. Enjoy themed puzzles, multiple difficulty 
              levels, and printable options for endless word-finding entertainment.
            </p>
            <h3>How to Play Word Search:</h3>
            <ul>
              <li>Find hidden words in a grid of letters</li>
              <li>Words can be horizontal, vertical, or diagonal</li>
              <li>Words may appear forwards or backwards</li>
              <li>Click and drag to select found words</li>
              <li>Complete all words to finish the puzzle</li>
              <li>Use hints when you need assistance</li>
              <li>Multiple difficulty levels from Easy to Hard</li>
              <li>Printable versions available for offline play</li>
              <li>Completely free with no registration required</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Multiple grid sizes (10x10, 15x15, 20x20)</li>
              <li>Themed puzzles across various topics</li>
              <li>Vocabulary building and spelling practice</li>
              <li>Pattern recognition and visual scanning training</li>
              <li>Relaxing, stress-reducing gameplay</li>
              <li>Progress tracking and achievement system</li>
              <li>Hint system for learning assistance</li>
              <li>Mobile-friendly interface</li>
              <li>Printable PDF versions</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Expands vocabulary through word exposure</li>
              <li>Improves spelling and word recognition</li>
              <li>Enhances visual scanning and pattern finding</li>
              <li>Develops concentration and attention to detail</li>
              <li>Provides cognitive maintenance and mental exercise</li>
              <li>Offers stress relief and relaxation</li>
              <li>Reinforces subject-specific terminology through themes</li>
              <li>Accessible to all age groups and skill levels</li>
            </ul>
            <p><strong>Perfect for:</strong> Puzzle enthusiasts, students learning vocabulary, educators 
               seeking classroom activities, seniors maintaining cognitive health, travelers looking for 
               offline entertainment, and anyone wanting relaxing mental exercise with educational benefits.</p>
          </div>
        </div>
      </div>
    </div>
  );
}