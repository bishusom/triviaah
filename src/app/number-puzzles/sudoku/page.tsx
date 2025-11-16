// src/app/number-puzzles/sudoku/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MuteButton from '@/components/common/MuteButton';
import SudokuPuzzle from '@/components/number-puzzles/SudokuPuzzle';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function SudokuPage() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Sudoku
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
      knowsAbout: ['Trivia', 'Quiz Games', 'Number Games', 'Educational Entertainment', 'Math Puzzles', 'Brain Games', 'Cognitive Games']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Free Sudoku Puzzles Online | Daily Sudoku Games & Challenges | Triviaah',
      description: 'Play free Sudoku puzzles online with daily challenges. Enjoy classic 9x9 Sudoku games with multiple difficulty levels. One of the best free Sudoku websites with no registration required.',
      url: 'https://triviaah.com/number-puzzles/sudoku',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Sudoku',
        description: 'Classic logic-based number puzzle game where players fill a 9x9 grid so that each column, each row, and each of the nine 3x3 subgrids contain all digits from 1 to 9.',
        gameLocation: 'https://triviaah.com/number-puzzles/sudoku',
        characterAttribute: 'Logical Thinking, Problem Solving, Concentration, Pattern Recognition, Cognitive Skills, Mental Math, Analytical Reasoning, Strategic Planning'
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
          name: 'Sudoku',
          item: 'https://triviaah.com/number-puzzles/sudoku'
        }
      ]
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Sudoku?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sudoku is a classic logic-based number puzzle game where players fill a 9x9 grid so that each column, each row, and each of the nine 3x3 subgrids contain all digits from 1 to 9 without repetition.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do you play Sudoku?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Players fill in the empty cells of a 9x9 grid with numbers 1-9, ensuring no number repeats in any row, column, or 3x3 box. The puzzle starts with some numbers pre-filled as clues.'
          }
        },
        {
          '@type': 'Question',
          name: 'What are the basic rules of Sudoku?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '1. Each row must contain numbers 1-9 without repetition. 2. Each column must contain numbers 1-9 without repetition. 3. Each 3x3 box must contain numbers 1-9 without repetition.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Sudoku good for your brain?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Sudoku improves logical thinking, concentration, problem-solving skills, memory, and cognitive function. Regular play can help maintain mental sharpness and prevent cognitive decline.'
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
        id="sudoku-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="sudoku-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="sudoku-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
      />
      <Script
        id="sudoku-faq-schema"
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

      <div className="max-w-4xl mx-auto p-4">
        {/* Header with Last Updated */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold">Free Online Sudoku Puzzles</h1>
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
            Play daily Sudoku challenges on one of the best free Sudoku websites. 
            Enjoy classic 9x9 grid puzzles with multiple difficulty levels - perfect for beginners and experts alike.
          </p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <SudokuPuzzle />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Sudoku Game Information & FAQ</h2>
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
                <h3 className="font-semibold" itemProp="name">What is Sudoku?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Sudoku is a classic logic-based number puzzle game that originated in Japan and has become 
                  one of the world&apos;s most popular puzzle games. Players fill a 9x9 grid divided into nine 
                  3x3 subgrids, ensuring that each row, each column, and each subgrid contains all digits 
                  from 1 to 9 without any repetition. The puzzle begins with some numbers pre-filled as clues.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do you play Sudoku?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Players strategically fill in the empty cells of a partially completed 9x9 grid with numbers 
                  from 1 to 9. The key rules are: no number can repeat in any row, no number can repeat in any 
                  column, and no number can repeat in any of the nine 3x3 subgrids. Players use logical deduction, 
                  pattern recognition, and elimination techniques to solve the puzzle.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What are the basic rules of Sudoku?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <strong>Rule 1:</strong> Each row must contain numbers 1-9 without repetition.<br/>
                  <strong>Rule 2:</strong> Each column must contain numbers 1-9 without repetition.<br/>
                  <strong>Rule 3:</strong> Each 3x3 box must contain numbers 1-9 without repetition.<br/>
                  <strong>Rule 4:</strong> The solution must be unique - only one correct arrangement exists.<br/>
                  <strong>Rule 5:</strong> Puzzles are solved through logic alone, no guessing required.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Sudoku good for your brain?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Sudoku provides excellent mental exercise that improves logical thinking, concentration, 
                  problem-solving skills, memory retention, and cognitive function. Regular Sudoku play can help 
                  maintain mental sharpness, prevent cognitive decline, improve focus, and enhance overall brain 
                  health. It&apos;s often recommended by neurologists as a beneficial activity for brain training.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What difficulty levels are available?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Our Sudoku puzzles come in multiple difficulty levels: <strong>Easy</strong> (good for beginners), 
                  <strong> Medium</strong> (balanced challenge), <strong>Hard</strong> (for experienced players), 
                  and <strong>Expert</strong> (for Sudoku masters). Each level provides the appropriate number of 
                  starting clues and logical complexity to match your skill level and provide an engaging challenge.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is this game completely free?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Our Sudoku game is completely free to play with no registration required. You can enjoy 
                  daily new puzzles, multiple difficulty levels, timer functionality, hint system, and unlimited 
                  gameplay without any cost, subscription fees, or registration requirements.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Game Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Sudoku Puzzles</h2>
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-lg font-semibold mb-2">How to Play Sudoku:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Study the 9x9 grid and identify the given numbers (clues)</li>
                <li>Fill empty cells with numbers 1-9 following the three basic rules</li>
                <li>Use logical deduction rather than guessing</li>
                <li>Look for cells that can only contain one possible number</li>
                <li>Use elimination techniques to narrow down possibilities</li>
                <li>Progress systematically through the puzzle</li>
                <li>Double-check rows, columns, and boxes for rule compliance</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Sudoku Difficulty Levels:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Easy:</strong> 36-45 given numbers, straightforward logic required</li>
                <li><strong>Medium:</strong> 27-35 given numbers, requires basic techniques</li>
                <li><strong>Hard:</strong> 22-26 given numbers, needs intermediate strategies</li>
                <li><strong>Expert:</strong> 17-21 given numbers, demands advanced methods</li>
                <li><strong>Extreme:</strong> 16 or fewer given numbers, master-level challenge</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Common Solving Techniques:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Scanning:</strong> Quickly identifying obvious placements</li>
                <li><strong>Cross-Hatching:</strong> Eliminating possibilities in rows and columns</li>
                <li><strong>Pencil Marks:</strong> Noting possible numbers in cells</li>
                <li><strong>Naked Singles:</strong> Cells with only one possible number</li>
                <li><strong>Hidden Singles:</strong> Numbers that can only go in one cell in a unit</li>
                <li><strong>Naked/Hidden Pairs/Triples:</strong> Group elimination techniques</li>
                <li><strong>Pointing Pairs:</strong> Using subgrid constraints on rows/columns</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">Advanced Sudoku Strategies:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>X-Wing:</strong> Pattern that eliminates candidates across two rows/columns</li>
                <li><strong>Swordfish:</strong> Extended X-Wing pattern across three rows/columns</li>
                <li><strong>XY-Wing:</strong> Three-cell pattern that creates elimination chains</li>
                <li><strong>Unique Rectangle:</strong> Avoiding deadly patterns that create multiple solutions</li>
                <li><strong>Colors:</strong> Tracking candidate patterns through conjugate pairs</li>
                <li><strong>Forcing Chains:</strong> Testing candidate consequences through logical chains</li>
                <li><strong>Nishio:</strong> Testing hypothetical placements to find contradictions</li>
                <li><strong>BUG:</strong> Bivalue Universal Grave technique for nearly-complete puzzles</li>
              </ul>
            </div>
          </div>
          
          {/* Educational Benefits Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Educational & Cognitive Benefits of Sudoku</h3>
            <div className="prose text-gray-700">
              <p className="mb-4">
                Sudoku is more than just a puzzle game - it&apos;s a powerful tool for cognitive development 
                and mental fitness. As one of the world&apos;s most popular <strong>free logic games</strong>, 
                Sudoku offers comprehensive brain training benefits:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li><strong>Enhanced Logical Thinking:</strong> Develops systematic reasoning and deduction skills</li>
                <li><strong>Improved Concentration:</strong> Trains focused attention and mental stamina</li>
                <li><strong>Better Memory:</strong> Strengthens short-term memory and pattern retention</li>
                <li><strong>Problem-Solving Skills:</strong> Develops strategic approaches to complex challenges</li>
                <li><strong>Pattern Recognition:</strong> Enhances ability to identify and extend patterns</li>
                <li><strong>Cognitive Flexibility:</strong> Improves ability to shift between different strategies</li>
                <li><strong>Mental Math:</strong> Strengthens numerical processing and quick calculation</li>
                <li><strong>Stress Reduction:</strong> Provides meditative focus that reduces anxiety</li>
              </ul>
              <p>
                Whether you&apos;re a student looking to improve academic performance, a professional maintaining 
                mental sharpness, a senior preserving cognitive health, or simply someone who enjoys challenging 
                puzzles, our <strong>free Sudoku game</strong> provides the perfect combination of entertainment 
                and substantial mental exercise.
              </p>
            </div>
          </div>

          {/* Why Play Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Play Sudoku on Triviaah?</h3>
            <div className="prose text-gray-700">
              <p className="mb-4">
                Sudoku is one of the world&apos;s most popular puzzle games, with millions of daily players 
                worldwide. Our free Sudoku puzzles offer the perfect brain exercise that improves logical 
                thinking, concentration, and problem-solving skills.
              </p>
              <p className="mb-4">
                As one of the top free Sudoku websites, we provide:
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li>Daily updated Sudoku puzzles with varying difficulty levels</li>
                <li>Completely free online Sudoku with no registration required</li>
                <li>Classic 9x9 grid format that Sudoku enthusiasts love</li>
                <li>Mobile-friendly interface for playing on any device</li>
                <li>Timer functionality to track your solving speed</li>
                <li>Hint system for when you need assistance</li>
                <li>Progress tracking and achievement system</li>
                <li>Educational content and solving strategies</li>
              </ul>
              <p>
                Whether you&apos;re a Sudoku beginner looking to learn or an expert seeking challenging puzzles, 
                our collection of free Sudoku games has something for everyone. Bookmark this page for your 
                daily Sudoku fix and join millions of players who enjoy this timeless logic game.
              </p>
            </div>
          </div>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Free Online Sudoku Puzzles - Daily Sudoku Games & Challenges</h2>
            <p itemProp="description">
              Play the world&apos;s most popular logic puzzle game with our free online Sudoku. Enjoy daily 
              Sudoku challenges with multiple difficulty levels on one of the best free Sudoku websites. 
              Perfect for beginners learning Sudoku strategies and experts seeking challenging puzzles. 
              Improve your logical thinking, concentration, and problem-solving skills with this classic 
              number placement game.
            </p>
            <h3>How to Play Sudoku:</h3>
            <ul>
              <li>Fill the 9x9 grid with numbers 1-9 following three simple rules</li>
              <li>No number can repeat in any row, column, or 3x3 box</li>
              <li>Use logical deduction and elimination techniques</li>
              <li>Start with easy puzzles and progress to expert levels</li>
              <li>Use hints when you need solving assistance</li>
              <li>Track your solving time and improve your speed</li>
              <li>Daily new puzzles with fresh challenges</li>
              <li>Completely free with no registration required</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Multiple difficulty levels (Easy, Medium, Hard, Expert)</li>
              <li>Daily updated Sudoku puzzles</li>
              <li>Classic 9x9 grid format</li>
              <li>Timer and progress tracking</li>
              <li>Hint system and solving assistance</li>
              <li>Mobile-friendly responsive design</li>
              <li>No downloads or registration required</li>
              <li>Educational solving strategies</li>
              <li>Cognitive benefits and brain training</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Improves logical thinking and deductive reasoning</li>
              <li>Enhances concentration and mental focus</li>
              <li>Develops problem-solving and strategic planning skills</li>
              <li>Strengthens memory and pattern recognition</li>
              <li>Boosts cognitive flexibility and mental agility</li>
              <li>Provides mental exercise and brain training</li>
              <li>Reduces stress through focused engagement</li>
              <li>Supports overall cognitive health and maintenance</li>
            </ul>
            <p><strong>Perfect for:</strong> Puzzle enthusiasts of all ages, students developing logical 
               thinking skills, professionals maintaining mental sharpness, seniors preserving cognitive 
               health, and anyone looking to improve their problem-solving abilities through engaging daily 
               brain exercises. Join millions of Sudoku players worldwide in this timeless logic game!</p>
          </div>
        </div>
      </div>
    </div>
  );
}