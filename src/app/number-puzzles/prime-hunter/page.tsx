// src/app/number-puzzles/prime-hunter/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MuteButton from '@/components/common/MuteButton';
import PrimeHunterPuzzle from '@/components/number-puzzles/PrimeHunterPuzzle';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function PrimeHunterPage() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Prime Hunter
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
      name: 'Prime Hunter Puzzle Game | Free Prime Number Challenge | Triviaah',
      description: 'Play Prime Hunter, a free online prime number puzzle game. Identify prime numbers in a grid with limited attempts. Improve your math skills with this fun and challenging brain game.',
      url: 'https://triviaah.com/number-puzzles/prime-hunter',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Prime Hunter',
        description: 'Math puzzle game where players identify prime numbers in a grid with limited attempts. Develops number theory understanding, prime identification skills, and mathematical reasoning.',
        gameLocation: 'https://triviaah.com/number-puzzles/prime-hunter',
        characterAttribute: 'Math Skills, Number Theory, Prime Identification, Logical Thinking, Problem Solving, Cognitive Skills, Mental Math, Analytical Reasoning'
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
          name: 'Prime Hunter',
          item: 'https://triviaah.com/number-puzzles/prime-hunter'
        }
      ]
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Prime Hunter?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Prime Hunter is a math puzzle game where players identify prime numbers in a grid with limited attempts. It challenges number theory knowledge, prime identification skills, and mathematical reasoning.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do you play Prime Hunter?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Players analyze number grids to identify which numbers are prime numbers, using limited attempts to select the correct primes. The game requires quick thinking and strong number theory understanding.'
          }
        },
        {
          '@type': 'Question',
          name: 'What are prime numbers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Prime numbers are natural numbers greater than 1 that have no positive divisors other than 1 and themselves. Examples include 2, 3, 5, 7, 11, 13, etc.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Prime Hunter educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Prime Hunter develops mathematical thinking, number theory understanding, prime identification skills, and problem-solving abilities in an engaging game format that makes learning math enjoyable.'
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
        id="prime-hunter-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="prime-hunter-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="prime-hunter-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
      />
      <Script
        id="prime-hunter-faq-schema"
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
            <h1 className="text-3xl text-white font-bold mb-2">Prime Hunter Puzzle Game</h1>
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
            Hunt for prime numbers in challenging grids with limited attempts. 
            Sharpen your number theory skills and mathematical intuition!
          </p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <PrimeHunterPuzzle />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold text-white">Prime Hunter Game Information & FAQ</h2>
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
                <h3 className="font-semibold" itemProp="name">What is Prime Hunter?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Prime Hunter is an engaging math puzzle game where players identify prime numbers 
                  in various grid configurations with limited attempts. It challenges number theory 
                  knowledge, prime identification skills, and mathematical reasoning in a fun, 
                  game-based format that makes learning advanced mathematical concepts accessible 
                  and enjoyable for all skill levels.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do you play Prime Hunter?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Players analyze number grids to identify which numbers are prime numbers, using 
                  limited attempts to select the correct primes. Each level presents new challenges 
                  with different grid sizes and number ranges, requiring quick mathematical thinking 
                  and strong number theory understanding to succeed within the attempt limit.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What are prime numbers?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Prime numbers are natural numbers greater than 1 that have exactly two distinct 
                  positive divisors: 1 and the number itself. They cannot be formed by multiplying 
                  two smaller natural numbers. Examples include 2, 3, 5, 7, 11, 13, 17, 19, 23, 
                  and so on. The number 2 is the only even prime number.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Prime Hunter educational?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Prime Hunter is excellent for developing mathematical thinking, number theory 
                  understanding, prime identification skills, and problem-solving abilities. It helps 
                  build foundational math knowledge, improves mental calculation capabilities, and 
                  enhances cognitive functions related to numerical processing and analytical thinking 
                  in an engaging game format.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What mathematical skills does this game develop?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Prime Hunter develops number theory understanding, prime identification, mathematical 
                  reasoning, problem-solving abilities, mental math skills, analytical thinking, and 
                  cognitive flexibility. Regular play significantly improves numerical literacy, 
                  mathematical confidence, and overall performance in mathematics-related subjects.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is this game free to play?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Our Prime Hunter game is completely free to play with no registration required. 
                  You can enjoy daily new puzzles, multiple difficulty levels, comprehensive learning 
                  features, and unlimited gameplay without any cost or subscription requirements.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Game Information Section */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Prime Hunter Puzzles</h2>
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-lg font-semibold mb-2">How to Play:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Analyze the number grid to identify potential prime numbers</li>
                <li>Use your knowledge of prime number properties to make selections</li>
                <li>Submit your answers within the limited attempts available</li>
                <li>Use available hints when you need assistance with prime identification</li>
                <li>Progress through multiple difficulty levels as your skills improve</li>
                <li>Learn from each puzzle to enhance your number theory understanding</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Prime Number Properties:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-green-300">Definition:</strong> Numbers greater than 1 with exactly two distinct positive divisors</li>
                <li><strong className="text-green-300">Even Prime:</strong> 2 is the only even prime number</li>
                <li><strong className="text-green-300">Odd Primes:</strong> All other prime numbers are odd (3, 5, 7, 11, etc.)</li>
                <li><strong className="text-green-300">Divisibility:</strong> Prime numbers are only divisible by 1 and themselves</li>
                <li><strong className="text-green-300">Fundamental Theorem:</strong> Every number greater than 1 is either prime or can be factored into primes</li>
                <li><strong className="text-green-300">Distribution:</strong> Prime numbers become less frequent as numbers get larger</li>
                <li><strong className="text-green-300">Twin Primes:</strong> Prime pairs that differ by 2 (3-5, 5-7, 11-13, etc.)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Difficulty Progression:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-green-300">Beginner Level:</strong> Small numbers (1-50) with obvious primes</li>
                <li><strong className="text-green-300">Intermediate Level:</strong> Medium numbers (1-100) with more attempts needed</li>
                <li><strong className="text-green-300">Advanced Level:</strong> Larger numbers (1-200) requiring prime testing strategies</li>
                <li><strong className="text-green-300">Expert Level:</strong> Complex grids with numbers up to 500</li>
                <li><strong className="text-green-300">Master Level:</strong> Challenging grids with limited attempts and time constraints</li>
              </ul>
            </div>

            <div className="p-4 bg-green-500/10 border border-green-500/20 text-white">
              <h4 className="font-bold text-white mb-2">Prime Identification Strategies:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Remember that 2 is the only even prime number</li>
                <li>Check divisibility by small primes (2, 3, 5, 7) first</li>
                <li>Numbers ending in 0, 2, 4, 5, 6, or 8 (except 2 and 5) are not prime</li>
                <li>Use the digital root rule: numbers divisible by 3 have digital root of 3, 6, or 9</li>
                <li>For numbers up to 100, memorize common primes for quick identification</li>
                <li>Learn to recognize prime patterns and common non-prime numbers</li>
                <li>Practice mental division with small primes to test larger numbers</li>
                <li>Use elimination strategies to quickly rule out obvious non-primes</li>
                <li>Develop intuition for prime distribution and common prime ranges</li>
              </ul>
            </div>
          </div>
          
          {/* Educational Benefits Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Educational Benefits of Prime Hunter Games</h3>
            <div className="prose prose-invert max-w-none text-gray-300">
              <p className="mb-4">
                Prime Hunter puzzles are powerful educational tools that develop essential mathematical 
                and cognitive skills. As one of the most engaging <strong>free math brain teasers</strong> 
                available, our Prime Hunter game offers comprehensive learning benefits:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li><strong className="text-green-300">Number Theory Foundation:</strong> Builds understanding of prime numbers and their properties</li>
                <li><strong className="text-green-300">Mathematical Reasoning:</strong> Develops logical thinking and deductive reasoning skills</li>
                <li><strong className="text-green-300">Pattern Recognition:</strong> Enhances ability to identify numerical patterns and properties</li>
                <li><strong className="text-green-300">Problem-Solving Skills:</strong> Develops systematic approaches to mathematical challenges</li>
                <li><strong className="text-green-300">Mental Math Abilities:</strong> Improves quick calculation and number sense</li>
                <li><strong className="text-green-300">Cognitive Flexibility:</strong> Enhances ability to apply different mathematical strategies</li>
                <li><strong className="text-green-300">Analytical Thinking:</strong> Strengthens ability to analyze numerical properties</li>
                <li><strong className="text-green-300">Academic Performance:</strong> Supports improved performance in mathematics and number theory</li>
              </ul>
              <p>
                Whether you&apos;re a student building math skills, an educator seeking engaging teaching tools, 
                a professional maintaining cognitive sharpness, or simply someone who enjoys challenging puzzles, 
                our <strong>free prime hunter game</strong> provides the perfect combination of entertainment 
                and substantial educational value.
              </p>
            </div>
          </div>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Prime Hunter - Free Online Prime Number Puzzle Game</h2>
            <p itemProp="description">
              Challenge your mathematical mind with Prime Hunter puzzles! Identify prime numbers 
              in challenging grids with limited attempts in this engaging brain game. Perfect for 
              students, math enthusiasts, educators, puzzle lovers, and anyone looking to improve 
              number theory knowledge, prime identification skills, and mathematical reasoning 
              through fun, educational gameplay.
            </p>
            <h3>How to Play Prime Hunter:</h3>
            <ul>
              <li>Analyze number grids to identify prime numbers</li>
              <li>Use mathematical reasoning to test number properties</li>
              <li>Submit answers within limited attempts to maximize score</li>
              <li>Utilize hints when you need prime identification assistance</li>
              <li>Progress through multiple difficulty levels from beginner to expert</li>
              <li>Daily new puzzles with fresh prime hunting challenges</li>
              <li>Learn from each puzzle to enhance mathematical thinking</li>
              <li>Completely free with no registration required</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Multiple grid configurations and number ranges</li>
              <li>Progressive difficulty system with attempt limitations</li>
              <li>Daily new prime hunting challenges</li>
              <li>Number theory and prime identification training</li>
              <li>Cognitive skill development and mental exercise</li>
              <li>Hint system for educational assistance</li>
              <li>Progress tracking and achievement system</li>
              <li>Mobile-friendly responsive design</li>
              <li>Educational content and learning resources</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Improves number theory understanding and mathematical reasoning</li>
              <li>Enhances prime identification and pattern recognition skills</li>
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
               looking to improve their number theory knowledge and mathematical abilities through entertaining daily puzzles.</p>
          </div>
        </div>
      </div>
    </div>
  );
}