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

      <div className="max-w-4xl mx-auto p-4">
        {/* Header with Last Updated */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl text-white font-bold mb-2">Number Sequence Puzzle Game</h1>
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
            Identify number patterns and predict the next numbers in sequences. 
            Challenge your mathematical thinking and pattern recognition skills!
          </p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <ScramblePuzzle />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold text-white">Number Sequence Game Information & FAQ</h2>
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
                <h3 className="font-semibold" itemProp="name">What is Number Sequence?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Number Sequence is a math puzzle game where players identify patterns in number sequences 
                  and predict the next numbers. It challenges logical thinking, pattern recognition skills, 
                  and mathematical reasoning in an engaging, game-based format that makes learning math fun 
                  and interactive.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do you play Number Sequence?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Players are shown a sequence of numbers with a hidden pattern, and they must identify the 
                  next numbers in the sequence using logical reasoning and mathematical thinking. The game 
                  provides limited attempts and may include hints to help players understand the patterns 
                  and improve their problem-solving strategies.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What types of number patterns are used?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  The game includes various mathematical patterns such as arithmetic sequences (constant 
                  difference), geometric sequences (constant ratio), Fibonacci patterns, prime numbers, 
                  square numbers, cube numbers, and combinations of mathematical operations. Each pattern 
                  type challenges different aspects of mathematical thinking and logical reasoning.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Number Sequence educational?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Number Sequence is excellent for developing mathematical thinking, pattern recognition, 
                  logical reasoning, and problem-solving skills. It helps build foundational math skills, 
                  improves mental math abilities, and enhances cognitive functions related to numerical 
                  processing and analytical thinking in an engaging game format.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What skills does this game develop?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Number Sequence develops mathematical reasoning, pattern recognition, logical thinking, 
                  problem-solving abilities, mental math skills, analytical thinking, and cognitive 
                  flexibility. Regular play can significantly improve numerical literacy and mathematical 
                  confidence across various age groups and skill levels.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is this game free to play?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Our Number Sequence game is completely free to play with no registration required. 
                  You can enjoy daily new puzzles, multiple difficulty levels, and comprehensive learning 
                  features without any cost or subscription.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Game Information Section */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Number Sequence Puzzles</h2>
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-lg font-semibold mb-2">How to Play:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Analyze the given number sequence to identify the pattern</li>
                <li>Use logical reasoning to predict the next numbers</li>
                <li>Submit your answer to check if it follows the pattern</li>
                <li>Use hints when you need assistance understanding the pattern</li>
                <li>Progress through multiple difficulty levels</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Common Pattern Types:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-green-300">Arithmetic:</strong> Constant difference between terms (2, 4, 6, 8...)</li>
                <li><strong className="text-green-300">Geometric:</strong> Constant ratio between terms (2, 4, 8, 16...)</li>
                <li><strong className="text-green-300">Fibonacci:</strong> Each term is sum of two previous terms (1, 1, 2, 3, 5...)</li>
                <li><strong className="text-green-300">Prime Numbers:</strong> Sequence of prime numbers (2, 3, 5, 7, 11...)</li>
                <li><strong className="text-green-300">Squares/Cubes:</strong> Square or cube numbers (1, 4, 9, 16... or 1, 8, 27, 64...)</li>
                <li><strong className="text-green-300">Combination:</strong> Mix of mathematical operations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Difficulty Levels:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-green-300">Beginner:</strong> Simple arithmetic and basic patterns</li>
                <li><strong className="text-green-300">Intermediate:</strong> Geometric sequences and combined operations</li>
                <li><strong className="text-green-300">Advanced:</strong> Complex patterns and multiple mathematical concepts</li>
                <li><strong className="text-green-300">Expert:</strong> Challenging sequences requiring deep mathematical insight</li>
              </ul>
            </div>

            <div className="p-4 bg-green-500/10 border border-green-500/20 text-white">
              <h4 className="font-bold text-white mb-2">Solving Strategies:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Look for constant differences between consecutive terms</li>
                <li>Check if numbers are doubling, tripling, or following other multiplicative patterns</li>
                <li>Consider if the sequence involves squares, cubes, or other powers</li>
                <li>Look for prime numbers or other special number sequences</li>
                <li>Try adding or subtracting position numbers from the terms</li>
                <li>Check for alternating patterns or combinations of operations</li>
                <li>Use the process of elimination with the available answer choices</li>
              </ul>
            </div>
          </div>
          
          {/* Educational Benefits Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Educational Benefits of Number Sequence Games</h3>
            <div className="prose prose-invert max-w-none text-gray-300">
              <p className="mb-4">
                Number Sequence puzzles are more than just entertaining games—they&apos;re powerful educational 
                tools that develop essential mathematical and cognitive skills. As one of the most engaging 
                <strong> free math brain teasers</strong> available, our Number Sequence game offers:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Improved pattern recognition and logical reasoning abilities</li>
                <li>Enhanced mathematical thinking and problem-solving skills</li>
                <li>Development of mental math and numerical processing speed</li>
                <li>Strengthened analytical thinking and cognitive flexibility</li>
                <li>Building confidence in mathematical abilities</li>
                <li>Fun, stress-free way to practice and learn math concepts</li>
              </ul>
              <p>
                Whether you&apos;re a student looking to improve math skills, an educator seeking engaging 
                teaching tools, or someone who enjoys challenging puzzles, our <strong>free number sequence 
                game</strong> provides the perfect combination of entertainment and educational value.
              </p>
            </div>
          </div>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Number Sequence - Free Online Math Puzzle Game</h2>
            <p itemProp="description">
              Challenge your mathematical mind with Number Sequence puzzles! Identify patterns in number 
              sequences and predict the next numbers in this engaging brain game. Perfect for students, 
              math enthusiasts, puzzle lovers, and anyone looking to improve their logical reasoning and 
              pattern recognition skills through fun, educational gameplay.
            </p>
            <h3>How to Play Number Sequence:</h3>
            <ul>
              <li>Analyze number sequences to identify hidden patterns</li>
              <li>Use logical reasoning to predict the next numbers</li>
              <li>Submit answers to check pattern understanding</li>
              <li>Use hints when you need pattern recognition assistance</li>
              <li>Progress through multiple difficulty levels</li>
              <li>Daily new puzzles with fresh mathematical challenges</li>
              <li>Completely free with no registration required</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Multiple pattern types (arithmetic, geometric, Fibonacci, etc.)</li>
              <li>Various difficulty levels from beginner to expert</li>
              <li>Daily new number sequence challenges</li>
              <li>Mathematical reasoning and pattern recognition training</li>
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