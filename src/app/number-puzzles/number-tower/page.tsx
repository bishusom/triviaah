// src/app/number-puzzles/number-tower/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MuteButton from '@/components/common/MuteButton';
import NumberTowerGame from "@/components/number-puzzles/NumberTowerGame";
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function NumberTowerPage() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Number Tower
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
      name: 'Number Tower Puzzle Game | Free Math Arrangement Challenge | Triviaah',
      description: 'Play Number Tower, a free online number puzzle game. Arrange numbers in a tower structure with limited moves. Improve your math skills with this fun and challenging brain game.',
      url: 'https://triviaah.com/number-puzzles/number-tower',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Number Tower',
        description: 'Math puzzle game where players strategically arrange numbers in a tower structure with limited moves. Develops spatial reasoning, strategic thinking, and mathematical problem-solving skills.',
        gameLocation: 'https://triviaah.com/number-puzzles/number-tower',
        characterAttribute: 'Math Skills, Spatial Reasoning, Strategic Thinking, Logical Planning, Problem Solving, Cognitive Skills, Mental Math, Analytical Reasoning'
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
          name: 'Number Tower',
          item: 'https://triviaah.com/number-puzzles/number-tower'
        }
      ]
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Number Tower?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Number Tower is a math puzzle game where players strategically arrange numbers in a tower structure using limited moves. It challenges spatial reasoning, strategic planning, and mathematical thinking.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do you play Number Tower?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Players arrange numbers in a tower structure according to mathematical rules, using limited moves to achieve the correct arrangement. The game requires careful planning and strategic thinking.'
          }
        },
        {
          '@type': 'Question',
          name: 'What skills does Number Tower develop?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The game develops spatial reasoning, strategic planning, mathematical thinking, problem-solving abilities, logical reasoning, and cognitive flexibility through engaging tower arrangement challenges.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Number Tower educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Number Tower develops mathematical thinking, spatial reasoning, strategic planning, and problem-solving skills in an engaging game format that makes learning math concepts enjoyable.'
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
        id="number-tower-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="number-tower-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="number-tower-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
      />
      <Script
        id="number-tower-faq-schema"
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
            <h1 className="text-3xl font-bold">Number Tower Puzzle Game</h1>
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
            Strategically arrange numbers in a tower structure with limited moves. 
            Challenge your spatial reasoning and strategic planning skills!
          </p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <NumberTowerGame />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Number Tower Game Information & FAQ</h2>
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
                <h3 className="font-semibold" itemProp="name">What is Number Tower?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Number Tower is a strategic math puzzle game where players arrange numbers in a tower 
                  structure according to mathematical rules using limited moves. It challenges spatial 
                  reasoning, strategic planning, and mathematical thinking in an engaging, game-based 
                  format that makes learning mathematical concepts enjoyable for all skill levels.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do you play Number Tower?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Players strategically arrange numbers in a tower structure, following mathematical 
                  rules and constraints. Each level presents a new tower arrangement challenge with 
                  limited moves, requiring careful planning and strategic thinking to achieve the 
                  correct number placement and complete the puzzle successfully.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What skills does Number Tower develop?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Number Tower develops essential cognitive skills including spatial reasoning, 
                  strategic planning, mathematical thinking, problem-solving abilities, logical 
                  reasoning, cognitive flexibility, and numerical processing. The game challenges 
                  players to think multiple steps ahead and consider spatial relationships.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Number Tower educational?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Number Tower is excellent for developing mathematical thinking, spatial 
                  reasoning, strategic planning, and problem-solving skills. It helps build 
                  foundational math abilities, improves strategic thinking capabilities, and 
                  enhances cognitive functions related to spatial processing and analytical 
                  thinking in a fun, engaging game format.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What mathematical concepts are involved?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Number Tower involves numerical relationships, spatial arrangements, strategic 
                  planning, logical sequencing, and mathematical problem-solving. Players must 
                  understand number properties, spatial configurations, and develop effective 
                  strategies to arrange numbers optimally within the tower structure.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is this game free to play?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Our Number Tower game is completely free to play with no registration required. 
                  You can enjoy daily new puzzles, multiple difficulty levels, comprehensive learning 
                  features, and unlimited gameplay without any cost or subscription requirements.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Game Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Number Tower Puzzles</h2>
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-lg font-semibold mb-2">How to Play:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Analyze the tower structure and number arrangement requirements</li>
                <li>Plan your moves strategically to arrange numbers correctly</li>
                <li>Use limited moves efficiently to achieve the target arrangement</li>
                <li>Consider spatial relationships and number patterns</li>
                <li>Progress through multiple difficulty levels as your skills improve</li>
                <li>Learn from each puzzle to enhance your strategic planning abilities</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Game Features:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Spatial Challenges:</strong> Arrange numbers in tower structures with specific rules</li>
                <li><strong>Strategic Planning:</strong> Limited moves require careful planning and foresight</li>
                <li><strong>Mathematical Thinking:</strong> Apply number relationships and patterns</li>
                <li><strong>Progressive Difficulty:</strong> Multiple levels from beginner to expert</li>
                <li><strong>Daily Challenges:</strong> Fresh puzzles with new tower arrangements</li>
                <li><strong>Educational Content:</strong> Learn mathematical concepts through gameplay</li>
                <li><strong>Hint System:</strong> Assistance when you need strategic guidance</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Difficulty Progression:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Beginner Level:</strong> Simple tower structures with basic arrangement rules</li>
                <li><strong>Intermediate Level:</strong> More complex towers with additional constraints</li>
                <li><strong>Advanced Level:</strong> Challenging arrangements requiring multiple-step planning</li>
                <li><strong>Expert Level:</strong> Complex towers with limited moves and strict rules</li>
                <li><strong>Master Level:</strong> Highly complex arrangements requiring optimal strategies</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">Advanced Solving Strategies:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Plan your entire sequence of moves before making the first move</li>
                <li>Consider the end goal and work backwards from the target arrangement</li>
                <li>Identify key numbers that must be placed in specific positions first</li>
                <li>Use temporary placements to create space for strategic moves</li>
                <li>Look for patterns in number relationships within the tower</li>
                <li>Consider multiple possible sequences before committing to moves</li>
                <li>Practice spatial visualization to anticipate arrangement outcomes</li>
                <li>Learn from failed attempts to improve future strategies</li>
                <li>Develop systematic approaches to different tower types</li>
              </ul>
            </div>
          </div>
          
          {/* Educational Benefits Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Educational Benefits of Number Tower Games</h3>
            <div className="prose text-gray-700">
              <p className="mb-4">
                Number Tower puzzles are powerful educational tools that develop essential mathematical 
                and cognitive skills. As one of the most engaging <strong>free math brain teasers</strong> 
                available, our Number Tower game offers comprehensive learning benefits:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li><strong>Enhanced Spatial Reasoning:</strong> Develops ability to visualize and manipulate spatial arrangements</li>
                <li><strong>Improved Strategic Planning:</strong> Strengthens ability to plan multiple steps ahead</li>
                <li><strong>Mathematical Thinking:</strong> Builds foundational skills for mathematical problem-solving</li>
                <li><strong>Problem-Solving Abilities:</strong> Develops systematic approaches to complex challenges</li>
                <li><strong>Logical Sequencing:</strong> Improves understanding of logical sequences and patterns</li>
                <li><strong>Cognitive Flexibility:</strong> Enhances ability to adapt strategies and think creatively</li>
                <li><strong>Analytical Thinking:</strong> Strengthens ability to analyze complex arrangements</li>
                <li><strong>Academic Performance:</strong> Supports improved performance in mathematics and logic-based subjects</li>
              </ul>
              <p>
                Whether you&apos;re a student building math skills, an educator seeking engaging teaching tools, 
                a professional maintaining cognitive sharpness, or simply someone who enjoys challenging puzzles, 
                our <strong>free number tower game</strong> provides the perfect combination of entertainment 
                and substantial educational value.
              </p>
            </div>
          </div>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Number Tower - Free Online Math Arrangement Puzzle Game</h2>
            <p itemProp="description">
              Challenge your strategic mind with Number Tower puzzles! Arrange numbers in tower structures 
              with limited moves in this engaging brain game. Perfect for students, math enthusiasts, 
              educators, puzzle lovers, and anyone looking to improve spatial reasoning, strategic planning, 
              and mathematical skills through fun, educational gameplay.
            </p>
            <h3>How to Play Number Tower:</h3>
            <ul>
              <li>Analyze tower structures and number arrangement requirements</li>
              <li>Plan strategic moves to arrange numbers correctly</li>
              <li>Use limited moves efficiently to achieve target arrangements</li>
              <li>Consider spatial relationships and mathematical patterns</li>
              <li>Progress through multiple difficulty levels from beginner to expert</li>
              <li>Daily new puzzles with fresh tower challenges</li>
              <li>Learn from each puzzle to enhance strategic thinking</li>
              <li>Completely free with no registration required</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Multiple tower types with varying arrangement rules</li>
              <li>Strategic planning with limited moves</li>
              <li>Daily new number tower challenges</li>
              <li>Spatial reasoning and mathematical thinking training</li>
              <li>Cognitive skill development and mental exercise</li>
              <li>Hint system for strategic assistance</li>
              <li>Progress tracking and achievement system</li>
              <li>Mobile-friendly responsive design</li>
              <li>Educational content and learning resources</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Improves spatial reasoning and visualization abilities</li>
              <li>Enhances strategic planning and foresight</li>
              <li>Develops mathematical thinking and problem-solving skills</li>
              <li>Builds confidence in logical and analytical abilities</li>
              <li>Strengthens cognitive functions and spatial processing</li>
              <li>Provides foundation for advanced mathematical concepts</li>
              <li>Supports academic performance in mathematics and logic</li>
              <li>Makes learning math enjoyable and engaging</li>
            </ul>
            <p><strong>Perfect for:</strong> Students learning mathematics and logic, educators seeking 
               classroom activities and teaching tools, puzzle enthusiasts wanting intellectual challenges, 
               professionals maintaining analytical skills, seniors preserving cognitive health, and anyone 
               looking to improve their spatial reasoning and strategic thinking through entertaining daily puzzles.</p>
          </div>
        </div>
      </div>
    </div>
  );
}