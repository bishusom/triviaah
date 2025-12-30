// src/app/number-puzzles/number-sequence/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MuteButton from '@/components/common/MuteButton';
import NumberSequenceGame from "@/components/number-puzzles/NumberSequenceGame";
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function NumberSequencePage() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Number Sequence
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
      name: 'Number Sequence Puzzle Game | Free Math Pattern Challenge | Triviaah',
      description: 'Play Number Sequence, a free online number puzzle game. Identify the next numbers in a sequence with limited attempts. Improve your math skills with this fun and challenging brain game.',
      url: 'https://triviaah.com/number-puzzles/number-sequence',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Number Sequence',
        description: 'Math puzzle game where players identify patterns and predict the next numbers in sequences. Features arithmetic, geometric, Fibonacci, and complex number patterns with multiple difficulty levels and educational benefits.',
        gameLocation: 'https://triviaah.com/number-puzzles/number-sequence',
        characterAttribute: 'Math Skills, Pattern Recognition, Logical Thinking, Problem Solving, Cognitive Skills, Mental Math, Analytical Reasoning'
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
          item: 'https://triviaah.com/number-puzzles/number-sequence'
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
            text: 'Number Sequence is a math puzzle game where players identify patterns in number sequences and predict the next numbers. It challenges logical thinking, pattern recognition, and mathematical reasoning skills.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do you play Number Sequence?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Players analyze given number sequences to identify hidden patterns, then predict and submit the next numbers in the sequence using logical reasoning and mathematical thinking.'
          }
        },
        {
          '@type': 'Question',
          name: 'What types of number patterns are included?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The game includes arithmetic sequences, geometric sequences, Fibonacci patterns, prime numbers, square and cube numbers, and various mathematical operation combinations.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Number Sequence educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Number Sequence develops mathematical thinking, pattern recognition, logical reasoning, and problem-solving skills in an engaging game format that makes learning math fun.'
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
        id="number-sequence-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="number-sequence-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="number-sequence-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
      />
      <Script
        id="number-sequence-faq-schema"
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
            <h1 className="text-3xl font-bold">Number Sequence Puzzle Game</h1>
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
          <p className="text-lg text-gray-600">
            Identify number patterns and predict the next numbers in sequences. 
            Challenge your mathematical thinking and pattern recognition skills!
          </p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <NumberSequenceGame />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Number Sequence Game Information & FAQ</h2>
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
                <h3 className="font-semibold" itemProp="name">What is Number Sequence?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Number Sequence is a math puzzle game where players identify patterns in number sequences 
                  and predict the next numbers. It challenges logical thinking, pattern recognition, and 
                  mathematical reasoning skills in an engaging, game-based format that makes learning math 
                  concepts enjoyable and accessible for all skill levels.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do you play Number Sequence?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Players analyze given number sequences to identify hidden patterns, then predict and submit 
                  the next numbers in the sequence using logical reasoning and mathematical thinking. The game 
                  provides limited attempts and may include hints to help players understand the patterns and 
                  develop effective problem-solving strategies.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What types of number patterns are included?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  The game includes various mathematical patterns such as arithmetic sequences (constant difference), 
                  geometric sequences (constant ratio), Fibonacci patterns, prime numbers, square numbers, cube numbers, 
                  and combinations of mathematical operations. Each pattern type challenges different aspects of 
                  mathematical thinking and helps develop comprehensive numerical reasoning skills.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Number Sequence educational?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Number Sequence is excellent for developing mathematical thinking, pattern recognition, 
                  logical reasoning, and problem-solving skills. It helps build foundational math abilities, 
                  improves mental math capabilities, and enhances cognitive functions related to numerical 
                  processing and analytical thinking in a fun, engaging game format.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What mathematical skills does this game develop?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Number Sequence develops mathematical reasoning, pattern recognition, logical thinking, 
                  problem-solving abilities, mental math skills, analytical thinking, and cognitive flexibility. 
                  Regular play can significantly improve numerical literacy, mathematical confidence, and 
                  overall academic performance in mathematics-related subjects.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is this game free to play?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Our Number Sequence game is completely free to play with no registration required. 
                  You can enjoy daily new puzzles, multiple difficulty levels, comprehensive learning features, 
                  and unlimited gameplay without any cost or subscription requirements.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Game Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Number Sequence Puzzles</h2>
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-lg font-semibold mb-2">How to Play:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Carefully analyze the given number sequence to identify the pattern</li>
                <li>Use logical reasoning and mathematical thinking to predict the next numbers</li>
                <li>Submit your answer to check if it correctly follows the identified pattern</li>
                <li>Use available hints when you need assistance understanding the pattern</li>
                <li>Progress through multiple difficulty levels as your skills improve</li>
                <li>Learn from each puzzle to enhance your pattern recognition abilities</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Common Pattern Types:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Arithmetic Sequences:</strong> Constant difference between terms (2, 4, 6, 8, 10...)</li>
                <li><strong>Geometric Sequences:</strong> Constant ratio between terms (2, 4, 8, 16, 32...)</li>
                <li><strong>Fibonacci Patterns:</strong> Each term is sum of two previous terms (1, 1, 2, 3, 5, 8...)</li>
                <li><strong>Prime Numbers:</strong> Sequence of prime numbers only (2, 3, 5, 7, 11, 13...)</li>
                <li><strong>Square Numbers:</strong> Sequence of perfect squares (1, 4, 9, 16, 25, 36...)</li>
                <li><strong>Cube Numbers:</strong> Sequence of perfect cubes (1, 8, 27, 64, 125...)</li>
                <li><strong>Combination Patterns:</strong> Mix of mathematical operations and rules</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Difficulty Progression:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Beginner Level:</strong> Simple arithmetic and basic recognizable patterns</li>
                <li><strong>Intermediate Level:</strong> Geometric sequences and combined operations</li>
                <li><strong>Advanced Level:</strong> Complex patterns involving multiple mathematical concepts</li>
                <li><strong>Expert Level:</strong> Challenging sequences requiring deep mathematical insight</li>
                <li><strong>Master Level:</strong> Highly complex patterns with multiple layers of operations</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">Advanced Solving Strategies:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Look for constant differences between consecutive terms first</li>
                <li>Check if numbers follow multiplicative patterns like doubling or tripling</li>
                <li>Consider if the sequence involves squares, cubes, or other powers</li>
                <li>Look for prime numbers, Fibonacci, or other special number sequences</li>
                <li>Try adding or subtracting position numbers from the terms</li>
                <li>Check for alternating patterns or combinations of different operations</li>
                <li>Look for patterns within patterns (second differences, etc.)</li>
                <li>Use the process of elimination with available answer choices</li>
                <li>Practice regularly to develop intuition for common pattern types</li>
              </ul>
            </div>
          </div>
          
          {/* Educational Benefits Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Educational Benefits of Number Sequence Games</h3>
            <div className="prose text-gray-700">
              <p className="mb-4">
                Number Sequence puzzles are powerful educational tools that develop essential mathematical 
                and cognitive skills. As one of the most engaging <strong>free math brain teasers</strong> 
                available, our Number Sequence game offers comprehensive learning benefits:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li><strong>Enhanced Pattern Recognition:</strong> Develops ability to identify and extend numerical patterns</li>
                <li><strong>Improved Logical Reasoning:</strong> Strengthens deductive and inductive reasoning skills</li>
                <li><strong>Mathematical Thinking:</strong> Builds foundational skills for advanced mathematical concepts</li>
                <li><strong>Problem-Solving Abilities:</strong> Develops systematic approaches to complex challenges</li>
                <li><strong>Mental Math Skills:</strong> Improves numerical processing speed and accuracy</li>
                <li><strong>Cognitive Flexibility:</strong> Enhances ability to switch between different thinking strategies</li>
                <li><strong>Analytical Thinking:</strong> Strengthens ability to break down complex problems</li>
                <li><strong>Academic Performance:</strong> Supports improved performance in mathematics and related subjects</li>
              </ul>
              <p>
                Whether you&apos;re a student building math skills, an educator seeking engaging teaching tools, 
                a professional maintaining cognitive sharpness, or simply someone who enjoys challenging puzzles, 
                our <strong>free number sequence game</strong> provides the perfect combination of entertainment 
                and substantial educational value.
              </p>
            </div>
          </div>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Number Sequence - Free Online Math Pattern Puzzle Game</h2>
            <p itemProp="description">
              Challenge your mathematical mind with Number Sequence puzzles! Identify patterns in number 
              sequences and predict the next numbers in this engaging brain game. Perfect for students, 
              math enthusiasts, educators, puzzle lovers, and anyone looking to improve logical reasoning, 
              pattern recognition, and mathematical skills through fun, educational gameplay.
            </p>
            <h3>How to Play Number Sequence:</h3>
            <ul>
              <li>Analyze number sequences to identify hidden mathematical patterns</li>
              <li>Use logical reasoning to predict the next numbers in each sequence</li>
              <li>Submit answers to check understanding of pattern recognition</li>
              <li>Utilize hints when you need pattern identification assistance</li>
              <li>Progress through multiple difficulty levels from beginner to expert</li>
              <li>Daily new puzzles with fresh mathematical challenges</li>
              <li>Learn from each puzzle to enhance mathematical thinking</li>
              <li>Completely free with no registration required</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Multiple pattern types (arithmetic, geometric, Fibonacci, prime, etc.)</li>
              <li>Comprehensive difficulty progression system</li>
              <li>Daily new number sequence challenges</li>
              <li>Mathematical reasoning and pattern recognition training</li>
              <li>Cognitive skill development and mental exercise</li>
              <li>Hint system for educational assistance</li>
              <li>Progress tracking and achievement system</li>
              <li>Mobile-friendly responsive design</li>
              <li>Educational content and learning resources</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Improves mathematical thinking and logical reasoning abilities</li>
              <li>Enhances pattern recognition and analytical skills</li>
              <li>Develops problem-solving strategies and mental math capabilities</li>
              <li>Builds confidence in mathematical and numerical abilities</li>
              <li>Strengthens cognitive functions and numerical processing</li>
              <li>Provides foundation for advanced mathematical concepts</li>
              <li>Supports academic performance in mathematics</li>
              <li>Makes learning math enjoyable and engaging</li>
            </ul>
            <p><strong>Perfect for:</strong> Students learning mathematics at all levels, educators seeking 
               classroom activities and teaching tools, puzzle enthusiasts wanting intellectual challenges, 
               professionals maintaining analytical skills, seniors preserving cognitive health, and anyone 
               looking to improve their logical thinking and mathematical abilities through entertaining daily puzzles.</p>
          </div>
        </div>
      </div>
    </div>
  );
}