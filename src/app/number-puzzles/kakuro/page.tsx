// src/app/number-puzzles/kakuro/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MuteButton from '@/components/common/MuteButton';
import KakuroPuzzle from '@/components/number-puzzles/KakuroPuzzle';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function KakuroPage() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const [structuredData, setStructuredData] = useState({
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Triviaah',
      url: 'https://triviaah.com',
      description: 'Free daily trivia quizzes and challenges across multiple categories including logic puzzles, number games, and brain teasers.',
      logo: 'https://triviaah.com/logo.png',
      sameAs: [],
      foundingDate: '2024',
      knowsAbout: ['Logic Puzzles', 'Number Games', 'Brain Teasers', 'Educational Games', 'Math Puzzles', 'Cognitive Games']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Free Kakuro Puzzles Online | Daily Kakuro Games & Challenges | Triviaah',
      description: 'Play free Kakuro puzzles online with daily challenges. Enjoy classic cross-sum puzzles with multiple difficulty levels. One of the best free Kakuro websites with no registration required.',
      url: 'https://triviaah.com/number-puzzles/kakuro',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Kakuro',
        description: 'Logic-based number puzzle game combining elements of Sudoku and crosswords. Players fill a grid with numbers 1-9 where each run sums to a given clue without repeating numbers.',
        gameLocation: 'https://triviaah.com/number-puzzles/kakuro',
        characterAttribute: 'Logical Thinking, Arithmetic Skills, Pattern Recognition, Problem Solving, Analytical Reasoning, Strategic Planning'
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
          name: 'Number Puzzles',
          item: 'https://triviaah.com/number-puzzles'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Kakuro',
          item: 'https://triviaah.com/number-puzzles/kakuro'
        }
      ]
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Kakuro?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Kakuro is a logic-based number puzzle that combines elements of Sudoku and crosswords. Players fill a grid with numbers 1-9 where each horizontal and vertical run must sum to the clue number without repeating digits within a run.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do you play Kakuro?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Fill empty white cells with numbers 1-9 so that each horizontal run sums to the clue on its left (in the black cell) and each vertical run sums to the clue above it. No number can repeat within a single run.'
          }
        },
        {
          '@type': 'Question',
          name: 'What are the basic rules of Kakuro?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '1. Use numbers 1-9 only. 2. The sum of numbers in each horizontal run must equal the clue on the left. 3. The sum of numbers in each vertical run must equal the clue above. 4. No number can repeat within a single run. 5. Black cells contain clue numbers and are not filled.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Kakuro good for your brain?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Kakuro improves logical thinking, arithmetic skills, pattern recognition, and problem-solving abilities. It combines mathematical thinking with logical deduction, providing excellent mental exercise.'
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
        id="kakuro-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="kakuro-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="kakuro-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
      />
      <Script
        id="kakuro-faq-schema"
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold">Free Online Kakuro Puzzles</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-teal-50 px-3 py-1 rounded-full text-xs font-medium border border-teal-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Challenge your logic and arithmetic skills with Kakuro puzzles. 
            Fill the grid with numbers 1-9 where each run sums to the clue without repeating digits.
          </p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <KakuroPuzzle />

        {/* FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Kakuro Game Information & FAQ</h2>
              <span className="text-gray-500 transition-transform duration-200 group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
              <div>
                <h3 className="font-semibold">Game Updates</h3>
                <p className="text-gray-600 text-sm">
                  <strong>Last updated:</strong> {new Date(lastUpdated).toLocaleString()} (Server Time)
                </p>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What is Kakuro?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Kakuro is a logic puzzle often called a &quot;cross-sum&quot; puzzle, combining elements of Sudoku and crosswords. 
                  It was invented in 1950 by Canadian Jacob E. Funk and gained popularity in Japan before spreading worldwide. 
                  The name &quot;Kakuro&quot; comes from the Japanese words for &quot;addition&quot; and &quot;cross.&quot;
                </p>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do you solve Kakuro puzzles?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  1. Start with runs that have only one possible combination of numbers.<br/>
                  2. Look for runs with small sums (they have fewer possibilities).<br/>
                  3. Use the &quot;no repeats&quot; rule to eliminate possibilities.<br/>
                  4. Work on intersecting runs to narrow down options.<br/>
                  5. Keep track of possible numbers for each cell (pencil marks).<br/>
                  6. Use logical deduction rather than guessing.
                </p>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What are common solving techniques?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <strong>Unique Combinations:</strong> Some sums have only one combination (like 3 in two cells must be 1+2).<br/>
                  <strong>Cross-Referencing:</strong> Use intersecting horizontal and vertical runs together.<br/>
                  <strong>Elimination:</strong> Remove numbers that would cause repeats in other runs.<br/>
                  <strong>Minimum/Maximum Analysis:</strong> Determine possible ranges for cells based on run sums.
                </p>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Kakuro good for math skills?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Kakuro is excellent for developing mental arithmetic, logical thinking, and problem-solving skills. 
                  It requires addition skills, pattern recognition, and systematic thinking. Regular Kakuro practice can 
                  improve calculation speed, number sense, and logical reasoning abilities.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Game Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Kakuro Puzzles</h2>
          
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-lg font-semibold mb-2">Kakuro vs Sudoku:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Kakuro</strong> uses addition and has clue sums; <strong>Sudoku</strong> uses placement without arithmetic</li>
                <li>Kakuro allows number repetition across different runs; Sudoku prohibits repetition in rows/columns/boxes</li>
                <li>Kakuro grids have black cells with clues; Sudoku grids are entirely 9×9</li>
                <li>Kakuro requires arithmetic thinking; Sudoku requires pattern recognition</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Difficulty Levels:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Easy (6×6):</strong> Simple sums, obvious combinations, good for beginners</li>
                <li><strong>Medium (8×8):</strong> More complex intersections, requires cross-referencing</li>
                <li><strong>Hard (10×10):</strong> Challenging sums, multiple possibilities, requires advanced techniques</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Educational Benefits:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Improves mental arithmetic and calculation speed</li>
                <li>Enhances logical reasoning and deductive skills</li>
                <li>Develops pattern recognition and systematic thinking</li>
                <li>Strengthens problem-solving strategies</li>
                <li>Boosts concentration and attention to detail</li>
                <li>Provides mathematical confidence through puzzle-solving</li>
              </ul>
            </div>
          </div>

          {/* Why Play Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Play Kakuro on Triviaah?</h3>
            <div className="prose text-gray-700">
              <p className="mb-4">
                Kakuro is one of the world&apos;s most engaging logic puzzles, offering a perfect blend of mathematics 
                and logic. Our free Kakuro puzzles provide daily brain exercise that improves arithmetic skills, 
                logical thinking, and problem-solving abilities.
              </p>
              <p className="mb-4">
                As one of the top free Kakuro websites, we provide:
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li>Daily updated Kakuro puzzles with varying difficulty levels</li>
                <li>Completely free online Kakuro with no registration required</li>
                <li>Classic grid format that puzzle enthusiasts love</li>
                <li>Mobile-friendly interface for playing on any device</li>
                <li>Timer functionality to track your solving speed</li>
                <li>Hint system for when you need assistance</li>
                <li>Progress tracking and achievement system</li>
                <li>Educational content and solving strategies</li>
              </ul>
              <p>
                Whether you&apos;re a Kakuro beginner looking to learn or an expert seeking challenging puzzles, 
                our collection of free Kakuro games has something for everyone. Bookmark this page for your 
                daily logic puzzle fix and join thousands of players who enjoy this stimulating number game.
              </p>
            </div>
          </div>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Free Online Kakuro Puzzles - Daily Logic Games & Challenges</h2>
            <p itemProp="description">
              Play free Kakuro puzzles online with daily challenges. Enjoy classic cross-sum puzzles 
              with multiple difficulty levels on one of the best free Kakuro websites. Perfect for 
              beginners learning logic puzzles and experts seeking challenging number games. Improve 
              your arithmetic skills, logical thinking, and problem-solving abilities with this 
              engaging brain teaser.
            </p>
            <h3>How to Play Kakuro:</h3>
            <ul>
              <li>Fill the grid with numbers 1-9 following sum clues</li>
              <li>Horizontal runs sum to clues on the left</li>
              <li>Vertical runs sum to clues above</li>
              <li>No number repeats within a single run</li>
              <li>Use logical deduction and arithmetic skills</li>
              <li>Start with easy puzzles and progress to expert levels</li>
              <li>Use hints when you need solving assistance</li>
              <li>Daily new puzzles with fresh challenges</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Multiple difficulty levels (Easy, Medium, Hard)</li>
              <li>Daily updated Kakuro puzzles</li>
              <li>Classic grid format with clue cells</li>
              <li>Timer and progress tracking</li>
              <li>Hint system and solving assistance</li>
              <li>Mobile-friendly responsive design</li>
              <li>No downloads or registration required</li>
              <li>Educational solving strategies</li>
              <li>Cognitive benefits and brain training</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}