// src/app/number-puzzles/number-scramble/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MuteButton from '@/components/common/MuteButton';
import ScramblePuzzle from '@/components/number-puzzles/ScramblePuzzle';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function NumberScramblePage() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Number Scramble
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
      name: 'Number Sequence Puzzle Game | Free Math Brain Teaser | Triviaah',
      description: 'Play Number Sequence, a free online number puzzle game. Identify the next numbers in a sequence with limited attempts. Improve your math skills with this fun and challenging brain game.',
      url: 'https://triviaah.com/number-puzzles/number-scramble',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Number Sequence',
        description: 'Math puzzle game where players identify patterns and predict the next numbers in sequences. Features arithmetic, geometric, and complex number patterns with multiple difficulty levels.',
        gameLocation: 'https://triviaah.com/number-puzzles/number-scramble',
        characterAttribute: 'Math Skills, Pattern Recognition, Logical Thinking, Problem Solving, Cognitive Skills, Mental Math'
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
          name: 'Number Sequence',
          item: 'https://triviaah.com/number-puzzles/number-scramble'
        }
      ]
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Number Sequence?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Number Sequence is a math puzzle game where players identify patterns in number sequences and predict the next numbers. It challenges logical thinking and pattern recognition skills.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do you play Number Sequence?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Players are shown a sequence of numbers with a pattern, and they must identify the next numbers in the sequence using logical reasoning and mathematical thinking.'
          }
        },
        {
          '@type': 'Question',
          name: 'What types of number patterns are used?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The game includes arithmetic sequences, geometric sequences, Fibonacci patterns, prime numbers, squares, cubes, and various mathematical operations and combinations.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Number Sequence educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Number Sequence is excellent for developing mathematical thinking, pattern recognition, logical reasoning, and problem-solving skills in an engaging game format.'
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Structured Data */}
      <Script
        id="number-scramble-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="number-scramble-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="number-scramble-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
      />
      <Script
        id="number-scramble-faq-schema"
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
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <ScramblePuzzle />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700 text-gray-300">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold text-white">Number Scramble Game Information & FAQ</h2>
              <span className="text-gray-500 transition-transform duration-200 group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
              {/* Content Freshness Info */}
              <div>
                <h3 className="font-semibold text-white">Game Updates</h3>
                <p className="text-gray-10 text-sm">
                  <strong>Last updated:</strong> {new Date(lastUpdated).toLocaleString()} (Server Time)
                </p>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What is Number Scramble?</h3>
                <p className="text-gray-10" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Number Scramble is a math puzzle game where players rearrange given digits to match a
                  target number or solve a numeric challenge. It tests number sense, logical thinking,
                  pattern recognition, and flexible problem-solving in a fast, game-based format.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do you play Number Scramble?</h3>
                <p className="text-gray-10" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Players are shown scrambled digits and must rearrange them into the correct order or
                  configuration to solve the puzzle. You analyze the available numbers, test different
                  arrangements, and use reasoning to reach the target before running out of attempts.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What skills does Number Scramble develop?</h3>
                <p className="text-gray-10" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Number Scramble develops mental math, numerical reasoning, logical thinking, digit
                  recognition, and problem-solving speed. Regular play helps improve confidence with
                  numbers while training attention to detail and strategic trial-and-error.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Number Scramble educational?</h3>
                <p className="text-gray-10" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes. Number Scramble reinforces core math skills by making players work actively with
                  digits, order, and numeric relationships. It is useful for students, puzzle fans, and
                  anyone who wants a quick way to practice number fluency and reasoning.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Are there different difficulty levels?</h3>
                <p className="text-gray-10" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes. Number Scramble puzzles can vary from simple digit reordering challenges to harder
                  puzzles that require multi-step thinking, tighter constraints, or more abstract numeric
                  goals. That range makes it suitable for both casual players and stronger puzzle solvers.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is this game free to play?</h3>
                <p className="text-gray-10" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes. Number Scramble is completely free to play with no registration required, so you
                  can jump straight into new puzzle challenges and practice your math skills anytime.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Game Information Section */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700 text-gray-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Number Scramble Puzzles</h2>
          <div className="space-y-6 text-gray-10">
            <div>
              <h3 className="text-lg font-semibold mb-2">How to Play:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Review the available digits and the puzzle goal</li>
                <li>Rearrange numbers into the correct order or target value</li>
                <li>Test combinations strategically within the allowed attempts</li>
                <li>Use hints when you need help narrowing the possibilities</li>
                <li>Progress through increasingly difficult numeric challenges</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Common Puzzle Skills:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-green-300">Digit Ordering:</strong> Finding the correct arrangement of the given numbers</li>
                <li><strong className="text-green-300">Target Matching:</strong> Building the exact required value from limited digits</li>
                <li><strong className="text-green-300">Pattern Recognition:</strong> Spotting useful numeric relationships quickly</li>
                <li><strong className="text-green-300">Mental Math:</strong> Estimating, comparing, and adjusting values efficiently</li>
                <li><strong className="text-green-300">Constraint Solving:</strong> Working within attempt limits or puzzle rules</li>
                <li><strong className="text-green-300">Strategy:</strong> Eliminating weak combinations and refining strong ones</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Difficulty Levels:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-green-300">Beginner:</strong> Simple digit arrangements and obvious targets</li>
                <li><strong className="text-green-300">Intermediate:</strong> More possible combinations and tighter constraints</li>
                <li><strong className="text-green-300">Advanced:</strong> Multi-step reasoning and less obvious numeric solutions</li>
                <li><strong className="text-green-300">Expert:</strong> High-complexity puzzles requiring fast, accurate strategy</li>
              </ul>
            </div>

            <div className="p-4 bg-green-500/10 border border-green-500/20 text-white">
              <h4 className="font-bold text-white mb-2">Solving Strategies:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Start by identifying the largest and smallest digits available</li>
                <li>Try obvious high-value and low-value arrangements first</li>
                <li>Use failed attempts to eliminate impossible placements</li>
                <li>Group digits in ways that create meaningful number patterns</li>
                <li>Work backward from the target when possible</li>
                <li>Use hints to refine your search instead of guessing randomly</li>
                <li>Balance speed with accuracy on harder rounds</li>
              </ul>
            </div>
          </div>
          
          {/* Educational Benefits Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Educational Benefits of Number Scramble Games</h3>
            <div className="prose prose-invert max-w-none text-gray-10">
              <p className="mb-4">
                Number Scramble puzzles are more than just entertaining games. They help strengthen number
                fluency, flexible thinking, and quick reasoning in a format that feels playful rather than
                academic. As one of our most accessible <strong>free math brain teasers</strong>, Number
                Scramble offers:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Improved number sense and digit recognition</li>
                <li>Stronger logical reasoning and puzzle-solving skills</li>
                <li>Better mental math speed and accuracy</li>
                <li>More confidence working with numeric constraints</li>
                <li>Practice with strategic thinking under limited attempts</li>
                <li>A low-pressure way to build everyday math fluency</li>
              </ul>
              <p>
                Whether you&apos;re a student building core skills, a teacher looking for engaging number
                practice, or a puzzle fan who enjoys quick logic challenges, our <strong>free Number
                Scramble game</strong> offers a strong mix of entertainment and educational value.
              </p>
            </div>
          </div>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Number Scramble - Free Online Math Puzzle Game</h2>
            <p itemProp="description">
              Challenge your mathematical mind with Number Scramble puzzles. Rearrange digits, solve
              numeric goals, and sharpen logical reasoning in this fast-paced brain game. Ideal for
              students, puzzle fans, and anyone who wants to build stronger number fluency through play.
            </p>
            <h3>How to Play Number Scramble:</h3>
            <ul>
              <li>Review the provided digits and puzzle objective</li>
              <li>Rearrange numbers to create the correct target or solution</li>
              <li>Use logical reasoning to eliminate weak combinations</li>
              <li>Submit answers and refine your approach using feedback</li>
              <li>Use hints when you need help narrowing possibilities</li>
              <li>Play fresh math challenges that test flexible thinking</li>
              <li>Completely free with no registration required</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Digit-reordering and target-matching challenges</li>
              <li>Difficulty progression from beginner to expert</li>
              <li>Fast, replayable number puzzle rounds</li>
              <li>Mental math and numeric reasoning practice</li>
              <li>Cognitive skill development</li>
              <li>Hint system for learning assistance</li>
              <li>Progress tracking and achievement system</li>
              <li>Mobile-friendly design</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Improves mathematical thinking and logical reasoning</li>
              <li>Enhances pattern recognition and analytical skills</li>
              <li>Develops problem-solving abilities and mental math</li>
              <li>Builds confidence in mathematical capabilities</li>
              <li>Strengthens cognitive functions and numerical processing</li>
              <li>Provides foundation for advanced mathematical concepts</li>
              <li>Makes learning math fun and engaging</li>
            </ul>
            <p><strong>Perfect for:</strong> Students learning mathematics, educators seeking classroom 
               activities, puzzle enthusiasts wanting new challenges, seniors maintaining cognitive health, 
               and anyone looking to improve their logical thinking and mathematical skills through 
               entertaining daily puzzles.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
