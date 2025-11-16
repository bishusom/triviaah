// src/app/number-puzzles/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

const numberPuzzles = [
  {
    slug: 'number-scramble',
    name: 'Number Scramble',
    image: '/imgs/number-scramble.webp',
    description: 'Combine numbers and operators to reach the target value',
    fullDescription: 'Strategic math puzzle where you combine numbers and arithmetic operators to reach specific target values. Develops mental math and strategic thinking.',
    keywords: 'math scramble, number challenge, arithmetic game, mental math, strategic thinking',
    difficulty: 'Medium',
    skills: ['Mental Math', 'Strategic Planning', 'Arithmetic Operations']
  },
  {
    slug: 'prime-hunter',
    name: 'Prime Hunter',
    image: '/imgs/prime-hunter.webp',
    description: 'Identify all prime numbers in the given grid',
    fullDescription: 'Challenge your number theory knowledge by identifying prime numbers in various grid configurations with limited attempts.',
    keywords: 'prime numbers game, math challenge, number theory, prime identification, cognitive skills',
    difficulty: 'Easy to Hard',
    skills: ['Number Theory', 'Pattern Recognition', 'Logical Reasoning']
  },
  {
    slug: 'number-sequence',
    name: 'Number Sequence',
    image: '/imgs/number-sequence.webp',
    description: 'Find the pattern and complete the number sequence',
    fullDescription: 'Identify mathematical patterns in number sequences and predict the next numbers. Develops pattern recognition and logical reasoning.',
    keywords: 'number patterns, sequence puzzle, math logic, pattern recognition, analytical thinking',
    difficulty: 'Easy to Expert',
    skills: ['Pattern Recognition', 'Logical Reasoning', 'Mathematical Thinking']
  },
  {
    slug: 'number-tower',
    name: 'Number Tower',
    image: '/imgs/number-tower.webp',
    description: 'Stack numbers to reach the target sum in this tower challenge',
    fullDescription: 'Strategic number arrangement game where you build towers to achieve target sums with limited moves and spatial constraints.',
    keywords: 'addition game, math towers, number stacking, spatial reasoning, strategic planning',
    difficulty: 'Medium to Hard',
    skills: ['Spatial Reasoning', 'Strategic Planning', 'Addition Skills']
  },
  {
    slug: 'sudoku',
    name: 'Sudoku',
    image: '/imgs/sudoku.webp',
    description: 'Classic 9x9 grid puzzle with numbers 1-9',
    fullDescription: 'World-famous logic puzzle where you fill a 9x9 grid following specific rules. Perfect for developing concentration and logical thinking.',
    keywords: 'sudoku puzzle, number grid, logic game, concentration, problem solving',
    difficulty: 'Easy to Expert',
    skills: ['Logical Thinking', 'Concentration', 'Problem Solving']
  },
];

export default function NumberPuzzlesPage() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Number Puzzles Collection
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
      name: 'Number Puzzles Collection | Free Math Games & Brain Teasers | Triviaah',
      description: 'Challenge your math skills with our collection of free number puzzles including Number Scramble, Number Tower, Prime Hunter, Number Sequence, and Sudoku. Improve logical thinking and problem-solving skills.',
      url: 'https://triviaah.com/number-puzzles',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'ItemList',
        name: 'Number Puzzles Collection',
        description: 'Comprehensive collection of mathematical puzzle games designed to improve cognitive skills and mathematical thinking.',
        numberOfItems: numberPuzzles.length,
        itemListElement: numberPuzzles.map((puzzle, index) => ({
          '@type': 'Game',
          position: index + 1,
          name: puzzle.name,
          description: puzzle.fullDescription,
          url: `https://triviaah.com/number-puzzles/${puzzle.slug}`,
          gameLocation: `https://triviaah.com/number-puzzles/${puzzle.slug}`,
          characterAttribute: puzzle.skills.join(', ')
        }))
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
        }
      ]
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What are number puzzles?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Number puzzles are mathematical games and brain teasers that challenge players to solve problems using numbers, patterns, and logical reasoning. They develop mathematical thinking, problem-solving skills, and cognitive abilities.'
          }
        },
        {
          '@type': 'Question',
          name: 'Are these number puzzles free to play?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! All our number puzzles are completely free to play with no registration required. You can enjoy unlimited gameplay across all puzzle types without any cost or subscription requirements.'
          }
        },
        {
          '@type': 'Question',
          name: 'What skills do number puzzles develop?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Number puzzles develop mathematical reasoning, logical thinking, problem-solving abilities, pattern recognition, mental math skills, concentration, and overall cognitive function through engaging gameplay.'
          }
        },
        {
          '@type': 'Question',
          name: 'Which number puzzle should I start with?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Beginners should start with Number Sequence or Prime Hunter, which have easier difficulty levels. Intermediate players can try Number Scramble or Number Tower, while Sudoku offers challenges for all skill levels.'
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
    <div className="page-with-ads min-h-screen bg-gray-50">
      {/* Structured Data */}
      <Script
        id="number-puzzles-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="number-puzzles-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="number-puzzles-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
      />
      <Script
        id="number-puzzles-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faq) }}
      />
          
      <Ads format="horizontal" isMobileFooter={false} className="lg:hidden" />

      <div className="container mx-auto px-4 py-12">
        {/* Header with Last Updated */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Number Puzzles Collection
            </h1>
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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Challenge your math skills with our exciting collection of free number puzzles and brain teasers
          </p>
        </div>

        {/* Puzzle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16">
          {numberPuzzles.map((puzzle) => (
            <div 
              key={puzzle.slug}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Link href={`/number-puzzles/${puzzle.slug}`}>
                <div className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mb-4 flex items-center justify-center overflow-hidden border-2 border-blue-100">
                    <Image 
                      src={puzzle.image}
                      alt={puzzle.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{puzzle.name}</h2>
                  <p className="text-gray-600 mb-3 flex-grow">{puzzle.description}</p>
                  
                  {/* Difficulty Badge */}
                  <div className="mb-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      puzzle.difficulty.includes('Easy') ? 'bg-green-100 text-green-800' :
                      puzzle.difficulty.includes('Medium') ? 'bg-yellow-100 text-yellow-800' :
                      puzzle.difficulty.includes('Hard') ? 'bg-orange-100 text-orange-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {puzzle.difficulty}
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="mb-4 flex flex-wrap gap-1 justify-center">
                    {puzzle.skills.slice(0, 2).map((skill, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors w-full">
                    Play Now
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Enhanced About Section */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Our Number Puzzles Collection</h2>
          <div className="prose prose-lg text-gray-600">
            <p className="mb-4">
              Our comprehensive collection of number puzzles helps improve mathematical reasoning, 
              problem-solving skills, mental calculation, and cognitive abilities. Each puzzle offers 
              unique challenges suitable for all ages and skill levels, from beginners to math experts.
            </p>
            <p className="mb-4">
              Perfect for students developing mathematical thinking, educators seeking engaging teaching tools, 
              professionals maintaining analytical skills, seniors preserving cognitive health, and anyone 
              looking to sharpen their numerical abilities through entertaining daily challenges.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Educational Benefits:</h3>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              <li><strong>Enhanced Mathematical Thinking:</strong> Develops logical reasoning and numerical intuition</li>
              <li><strong>Improved Problem-Solving Skills:</strong> Builds systematic approaches to complex challenges</li>
              <li><strong>Better Cognitive Function:</strong> Strengthens memory, concentration, and mental agility</li>
              <li><strong>Pattern Recognition:</strong> Enhances ability to identify and extend numerical patterns</li>
              <li><strong>Mental Math Proficiency:</strong> Improves quick calculation and numerical processing</li>
              <li><strong>Strategic Planning:</strong> Develops foresight and multi-step thinking abilities</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Why Choose Our Number Puzzles?</h3>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              <li><strong>Completely Free:</strong> No registration, subscriptions, or hidden costs</li>
              <li><strong>Daily Challenges:</strong> Fresh puzzles updated regularly</li>
              <li><strong>Multiple Difficulty Levels:</strong> Suitable for beginners to experts</li>
              <li><strong>Educational Focus:</strong> Designed to develop real mathematical skills</li>
              <li><strong>Mobile Friendly:</strong> Play on any device, anytime, anywhere</li>
              <li><strong>Progress Tracking:</strong> Monitor your improvement over time</li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Number Puzzles Information & FAQ</h2>
              <span className="text-gray-500 transition-transform duration-200 group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
              {/* Content Freshness Info */}
              <div>
                <h3 className="font-semibold">Collection Updates</h3>
                <p className="text-gray-600 text-sm">
                  <strong>Last updated:</strong> {new Date(lastUpdated).toLocaleString()} (Server Time)
                </p>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What are number puzzles?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Number puzzles are mathematical games and brain teasers that challenge players to solve 
                  problems using numbers, patterns, sequences, and logical reasoning. They range from simple 
                  arithmetic challenges to complex logical problems, all designed to develop mathematical 
                  thinking and cognitive skills in an engaging, game-based format.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Are these number puzzles free to play?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! All our number puzzles are completely free to play with no registration required. 
                  You can enjoy unlimited gameplay across all puzzle types, multiple difficulty levels, 
                  daily challenges, and comprehensive learning features without any cost, subscription 
                  fees, or registration requirements.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What skills do number puzzles develop?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Number puzzles develop mathematical reasoning, logical thinking, problem-solving abilities, 
                  pattern recognition, mental math skills, concentration, spatial reasoning, strategic planning, 
                  and overall cognitive function. Regular practice can significantly improve academic performance 
                  in mathematics and enhance analytical thinking capabilities.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Which number puzzle should I start with?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Beginners should start with <strong>Number Sequence</strong> or <strong>Prime Hunter</strong>, 
                  which have easier difficulty levels and straightforward rules. Intermediate players can try 
                  <strong> Number Scramble</strong> or <strong>Number Tower</strong> for more strategic challenges, 
                  while <strong>Sudoku</strong> offers a classic puzzle experience suitable for all skill levels 
                  with progressive difficulty options.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Are these puzzles suitable for children?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Our number puzzles are excellent for children developing mathematical skills. The varying 
                  difficulty levels make them suitable for different age groups and skill levels. Puzzles like 
                  Number Sequence and Prime Hunter are particularly good for building foundational math skills, 
                  while all puzzles help develop logical thinking and problem-solving abilities valuable for 
                  academic success.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How often are new puzzles added?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  We add new puzzles and challenges regularly, with daily updates for most puzzle types. Each 
                  game features fresh content, new difficulty levels, and seasonal challenges to keep the 
                  experience engaging and provide continuous learning opportunities and mental stimulation.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/ItemList">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Number Puzzles Collection - Free Math Games & Brain Teasers</h2>
            <p itemProp="description">
              Discover our comprehensive collection of free number puzzles designed to challenge your 
              mathematical mind and improve cognitive skills. From classic Sudoku to innovative Number 
              Tower challenges, our puzzles develop logical thinking, problem-solving abilities, pattern 
              recognition, and mental math proficiency through engaging gameplay suitable for all ages 
              and skill levels.
            </p>
            <h3>Featured Number Puzzles:</h3>
            <ul>
              <li><strong>Number Scramble:</strong> Combine numbers and operators to reach target values</li>
              <li><strong>Prime Hunter:</strong> Identify prime numbers in challenging grid configurations</li>
              <li><strong>Number Sequence:</strong> Discover patterns and complete mathematical sequences</li>
              <li><strong>Number Tower:</strong> Strategically arrange numbers in tower structures</li>
              <li><strong>Sudoku:</strong> Classic 9x9 grid logic puzzle with multiple difficulty levels</li>
            </ul>
            <h3>Key Features:</h3>
            <ul>
              <li>Completely free with no registration required</li>
              <li>Daily updated puzzles and fresh challenges</li>
              <li>Multiple difficulty levels for all skill ranges</li>
              <li>Educational focus on mathematical skill development</li>
              <li>Mobile-friendly design for play anywhere</li>
              <li>Progress tracking and achievement systems</li>
              <li>Hint systems and learning resources</li>
              <li>Cognitive benefits and brain training</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Improves mathematical reasoning and logical thinking</li>
              <li>Develops problem-solving and strategic planning skills</li>
              <li>Enhances pattern recognition and analytical abilities</li>
              <li>Strengthens mental math and numerical processing</li>
              <li>Boosts concentration and cognitive flexibility</li>
              <li>Supports academic performance in mathematics</li>
              <li>Provides mental exercise and brain training</li>
              <li>Makes learning math enjoyable and engaging</li>
            </ul>
            <p><strong>Perfect for:</strong> Students of all ages developing math skills, educators seeking 
               classroom resources, puzzle enthusiasts wanting intellectual challenges, professionals 
               maintaining analytical skills, seniors preserving cognitive health, and anyone looking 
               to improve their mathematical abilities through entertaining daily puzzles. Join thousands 
               of players who trust Triviaah for quality educational entertainment!</p>
          </div>
        </div>
      </div>
    </div>
  );
}