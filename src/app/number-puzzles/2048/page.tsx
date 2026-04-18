// src/app/number-puzzles/2048/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MuteButton from '@/components/common/MuteButton';
import Puzzle2048 from '@/components/number-puzzles/2048Puzzle';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function Number2048Page() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for 2048
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
      name: '2048 Puzzle Game | Free Number Brain Teaser | Triviaah',
      description: 'Play 2048, a free online tile-merging puzzle game. Swipe to combine matching tiles and reach 2048 while improving strategy and planning skills.',
      url: 'https://triviaah.com/number-puzzles/2048',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: '2048',
        description: 'Tile-merging puzzle game where players combine matching numbers to reach the 2048 tile and beyond. Features strategic planning, pattern recognition, and spatial reasoning.',
        gameLocation: 'https://triviaah.com/number-puzzles/2048',
        characterAttribute: 'Strategy, Pattern Recognition, Logical Thinking, Problem Solving, Spatial Reasoning, Mental Math'
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
            name: '2048',
            item: 'https://triviaah.com/number-puzzles/2048'
        }
      ]
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is 2048?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '2048 is a classic tile-merging puzzle game where players slide numbered tiles on a grid and combine matching values to reach the 2048 tile.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do you play 2048?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Swipe or use the arrow keys to move all tiles. Matching tiles merge into one tile with double the value, and a new tile appears after each move.'
          }
        },
        {
          '@type': 'Question',
          name: 'What are the rules of 2048?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can merge tiles with the same number, new tiles appear after every move, and the game ends when no legal moves remain.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is 2048 educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! 2048 helps build spatial reasoning, strategic planning, pattern recognition, and quick decision-making in an engaging format.'
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
        id="2048-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="2048-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="2048-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
      />
      <Script
        id="2048-faq-schema"
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
        
        <Puzzle2048 />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700 text-gray-300">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold text-white">2048 Game Information & FAQ</h2>
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
                <h3 className="font-semibold" itemProp="name">What is 2048?</h3>
                <p className="text-gray-10" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  2048 is a tile-merging puzzle game where players slide numbered tiles on a 4x4 grid.
                  Matching tiles combine into larger values, and the goal is to reach the 2048 tile.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do you play 2048?</h3>
                <p className="text-gray-10" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Use the arrow keys or swipe gestures to move tiles. When two tiles with the same number
                  touch, they merge into a single tile with double the value. A new tile appears after each move.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What skills does 2048 develop?</h3>
                <p className="text-gray-10" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  2048 develops spatial reasoning, strategic planning, pattern recognition, and decision-making
                  under pressure. It is a simple game with a surprisingly deep strategy layer.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is 2048 educational?</h3>
                <p className="text-gray-10" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes. 2048 reinforces spatial awareness, planning, and logical thinking while keeping the
                  gameplay fast and approachable for casual players.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Are there different difficulty levels?</h3>
                <p className="text-gray-10" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  The core 2048 rules stay the same, but difficulty comes from board randomness and how
                  well you manage the grid. Playing for a higher tile value is the real challenge.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is this game free to play?</h3>
                <p className="text-gray-10" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes. 2048 is completely free to play with no registration required, so you can jump
                  straight into the game and practice your strategic thinking anytime.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Game Information Section */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700 text-gray-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About 2048</h2>
          <div className="space-y-6 text-gray-10">
            <div>
              <h3 className="text-lg font-semibold mb-2">How to Play:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Swipe or use the arrow keys to move all tiles on the board</li>
                <li>Merge matching tiles to create larger numbers</li>
                <li>Plan ahead so you do not trap the board too early</li>
                <li>Reach 2048, then keep going for a bigger score if you want</li>
                <li>The game ends when no legal moves remain</li>
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
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Educational Benefits of 2048</h3>
            <div className="prose prose-invert max-w-none text-gray-10">
              <p className="mb-4">
                2048 is more than just an entertaining game. It helps strengthen spatial awareness,
                flexible thinking, and quick reasoning in a format that feels playful rather than
                academic. As one of our most accessible <strong>free number puzzles</strong>, 2048 offers:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Improved spatial reasoning and board awareness</li>
                <li>Stronger logical reasoning and puzzle-solving skills</li>
                <li>Better decision-making speed and accuracy</li>
                <li>More confidence planning several moves ahead</li>
                <li>Practice with strategic thinking under pressure</li>
                <li>A low-pressure way to build everyday problem-solving skills</li>
              </ul>
              <p>
                Whether you&apos;re a student building core skills, a teacher looking for engaging number
                practice, or a puzzle fan who enjoys quick logic challenges, our <strong>free 2048 game</strong>
                offers a strong mix of entertainment and educational value.
              </p>
            </div>
          </div>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>2048 - Free Online Tile Puzzle Game</h2>
            <p itemProp="description">
              Challenge your strategic mind with 2048. Merge tiles, plan your moves, and sharpen spatial
              reasoning in this fast-paced brain game. Ideal for players who enjoy quick logic puzzles.
            </p>
            <h3>How to Play 2048:</h3>
            <ul>
              <li>Swipe or use the arrow keys to move the tiles</li>
              <li>Merge matching tiles to create bigger numbers</li>
              <li>Keep the board open so you have room for new tiles</li>
              <li>Try to reach 2048 and then push for higher scores</li>
              <li>Completely free with no registration required</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Classic 4x4 tile-merging board</li>
              <li>Simple controls with deep strategy</li>
              <li>Fast, replayable puzzle rounds</li>
              <li>Score tracking and best-score persistence</li>
              <li>Mobile swipe support and keyboard controls</li>
              <li>Win state at 2048 and beyond</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Improves spatial reasoning and board awareness</li>
              <li>Enhances pattern recognition and strategic planning</li>
              <li>Develops problem-solving abilities under pressure</li>
              <li>Builds confidence in multi-step decision-making</li>
              <li>Strengthens attention to detail and foresight</li>
              <li>Makes learning problem-solving fun and engaging</li>
            </ul>
            <p><strong>Perfect for:</strong> Students learning mathematics, educators seeking classroom 
               activities, puzzle enthusiasts wanting new challenges, seniors maintaining cognitive health, 
               and anyone looking to improve their strategic thinking through entertaining puzzle play.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
