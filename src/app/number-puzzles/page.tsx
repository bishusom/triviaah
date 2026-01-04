// src/app/number-puzzles/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Boxes, Star, Clock, Users } from 'lucide-react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

const numberPuzzles = [
  {
    slug: 'number-scramble',
    name: 'Number Scramble',
    image: '/imgs/number-puzzles/number-scramble.webp',
    description: 'Combine numbers and operators to reach the target value',
    tagline: 'Strategic math puzzle combining numbers and arithmetic operators',
    fullDescription: 'Strategic math puzzle where you combine numbers and arithmetic operators to reach specific target values. Develops mental math and strategic thinking.',
    keywords: 'math scramble, number challenge, arithmetic game, mental math, strategic thinking',
    difficulty: 'Medium',
    skills: ['Mental Math', 'Strategic Planning', 'Arithmetic Operations'],
    color: 'blue'
  },
  {
    slug: 'prime-hunter',
    name: 'Prime Hunter',
    image: '/imgs/number-puzzles/prime-hunter.webp',
    description: 'Identify all prime numbers in the given grid',
    tagline: 'Challenge your number theory knowledge by identifying prime numbers',
    fullDescription: 'Challenge your number theory knowledge by identifying prime numbers in various grid configurations with limited attempts.',
    keywords: 'prime numbers game, math challenge, number theory, prime identification, cognitive skills',
    difficulty: 'Easy to Hard',
    skills: ['Number Theory', 'Pattern Recognition', 'Logical Reasoning'],
    color: 'green'
  },
  {
    slug: 'number-sequence',
    name: 'Number Sequence',
    image: '/imgs/number-puzzles/number-sequence.webp',
    description: 'Find the pattern and complete the number sequence',
    tagline: 'Identify mathematical patterns in challenging number sequences',
    fullDescription: 'Identify mathematical patterns in number sequences and predict the next numbers. Develops pattern recognition and logical reasoning.',
    keywords: 'number patterns, sequence puzzle, math logic, pattern recognition, analytical thinking',
    difficulty: 'Easy to Expert',
    skills: ['Pattern Recognition', 'Logical Reasoning', 'Mathematical Thinking'],
    color: 'purple'
  },
  {
    slug: 'number-tower',
    name: 'Number Tower',
    image: '/imgs/number-puzzles/number-tower.webp',
    description: 'Stack numbers to reach the target sum in this tower challenge',
    tagline: 'Strategic number arrangement with spatial tower challenges',
    fullDescription: 'Strategic number arrangement game where you build towers to achieve target sums with limited moves and spatial constraints.',
    keywords: 'addition game, math towers, number stacking, spatial reasoning, strategic planning',
    difficulty: 'Medium to Hard',
    skills: ['Spatial Reasoning', 'Strategic Planning', 'Addition Skills'],
    color: 'orange'
  },
  {
    slug: 'sudoku',
    name: 'Sudoku',
    image: '/imgs/number-puzzles/sudoku.webp',
    description: 'Classic 9x9 grid puzzle with numbers 1-9',
    tagline: 'World-famous logic puzzle for concentration and logical thinking',
    fullDescription: 'World-famous logic puzzle where you fill a 9x9 grid following specific rules. Perfect for developing concentration and logical thinking.',
    keywords: 'sudoku puzzle, number grid, logic game, concentration, problem solving',
    difficulty: 'Easy to Expert',
    skills: ['Logical Thinking', 'Concentration', 'Problem Solving'],
    color: 'red'
  },
];

// Gaming-style puzzle card matching the brainwave page design
function PuzzleCard({ puzzle, index }: { puzzle: typeof numberPuzzles[0]; index: number }) {
  return (
    <Link
      key={puzzle.slug}
      href={`/number-puzzles/${puzzle.slug}`}
      className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-500 bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/20 hover:border-cyan-400/40"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      {/* Puzzle Image */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-cyan-900 to-purple-900 overflow-hidden">  
        <Image
          src={puzzle.image}
          alt={puzzle.name}
          fill
          className="object-contain transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={index < 3 ? "eager" : "lazy"}
          priority={index < 2}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Play button overlay */}
        <div className="absolute bottom-4 right-4 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Play className="w-5 h-5 text-white" />
        </div>

        {/* Puzzle number badge */}
        <div className="absolute top-4 left-4 bg-black/70 text-white text-sm font-semibold px-3 py-1 rounded-full">
          #{index + 1}
        </div>

        {/* Difficulty badge */}
        <div className="absolute top-4 right-4 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full">
          {puzzle.difficulty}
        </div>
      </div>
      
      {/* Puzzle Content */}
      <div className="p-6 relative z-10">
        <h3 className="font-bold text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
          {puzzle.name}
        </h3>
        <p className="text-sm text-gray-300 line-clamp-2">
          {puzzle.tagline}
        </p>
        
        {/* Skills tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {puzzle.skills.slice(0, 2).map((skill, index) => (
            <span key={index} className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs">
              {skill}
            </span>
          ))}
        </div>
        
        {/* Progress bar effect */}
        <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-0 group-hover:w-full transition-all duration-700" />
        </div>
      </div>
    </Link>
  );
}

export default function NumberPuzzlesPage() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Number Puzzles Collection
  const [structuredData, setStructuredData] = useState({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://triviaah.com/#organization",
        "name": "Triviaah",
        "url": "https://triviaah.com/",
        "description": "Triviaah offers engaging and educational trivia games and puzzles for everyone.",
        "logo": {
          "@type": "ImageObject",
          "url": "https://triviaah.com/logo.png",
          "width": 200,
          "height": 60
        },
        "sameAs": [
          "https://twitter.com/elitetrivias",
          "https://www.facebook.com/elitetrivias",
          "https://www.instagram.com/elitetrivias"
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://triviaah.com/number-puzzles/#webpage",
        "url": "https://triviaah.com/number-puzzles",
        "name": "Number Puzzles Collection | Free Math Games & Brain Teasers | Triviaah",
        "description": "Challenge your math skills with our collection of free number puzzles including Number Scramble, Number Tower, Prime Hunter, Number Sequence, and Sudoku.",
        "isPartOf": {
          "@id": "https://triviaah.com/#website"
        },
        "about": {
          "@id": "https://triviaah.com/number-puzzles/#itemlist"
        },
        "datePublished": "2024-01-01T00:00:00+00:00",
        "dateModified": lastUpdated,
        "breadcrumb": {
          "@id": "https://triviaah.com/number-puzzles/#breadcrumb"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://triviaah.com/imgs/number-puzzles/number-puzzles-og.webp",
          "width": 1200,
          "height": 630
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://triviaah.com/#website",
        "url": "https://triviaah.com/",
        "name": "Triviaah",
        "description": "Engaging trivia games and puzzles for everyone",
        "publisher": {
          "@id": "https://triviaah.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://triviaah.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://triviaah.com/number-puzzles/#itemlist",
        "name": "Number Puzzles Collection",
        "description": "Comprehensive collection of mathematical puzzle games designed to improve cognitive skills and mathematical thinking",
        "numberOfItems": numberPuzzles.length,
        "itemListElement": numberPuzzles.map((puzzle, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Game",
            "name": puzzle.name,
            "description": puzzle.tagline,
            "url": `https://triviaah.com/number-puzzles/${puzzle.slug}`,
            "gameType": "PuzzleGame",
            "genre": ["math", "puzzle", "educational"],
            "applicationCategory": "Game",
            "numberOfPlayers": {
              "@type": "QuantitativeValue",
              "minValue": 1
            },
            "publisher": {
              "@id": "https://triviaah.com/#organization"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://triviaah.com/number-puzzles/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://triviaah.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Number Puzzles",
            "item": "https://triviaah.com/number-puzzles"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are number puzzles?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Number puzzles are mathematical games and brain teasers that challenge players to solve problems using numbers, patterns, and logical reasoning. They develop mathematical thinking, problem-solving skills, and cognitive abilities through engaging gameplay."
            }
          },
          {
            "@type": "Question",
            "name": "Are these number puzzles free to play?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! All our number puzzles are completely free to play with no registration required. You can enjoy unlimited gameplay across all puzzle types without any cost or subscription requirements."
            }
          },
          {
            "@type": "Question",
            "name": "What skills do number puzzles develop?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Number puzzles develop mathematical reasoning, logical thinking, problem-solving abilities, pattern recognition, mental math skills, concentration, and overall cognitive function through engaging mathematical challenges."
            }
          },
          {
            "@type": "Question",
            "name": "Which number puzzle should I start with?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Beginners should start with Number Sequence or Prime Hunter, which have easier difficulty levels. Intermediate players can try Number Scramble or Number Tower, while Sudoku offers challenges for all skill levels."
            }
          }
        ]
      }
    ]
  });

  useEffect(() => {
    setLastUpdated(new Date().toISOString());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Structured Data */}
        <Script
          id="number-puzzles-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-2xl">
                <Star className="text-4xl text-white" />
              </div>           
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Number Puzzles
                <span className="block text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl md:text-2xl mt-2">
                  Math Games & Brain Teasers
                </span>
              </h1>
            </div>
            <div className="max-w-3xl mx-auto">  
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Challenge your math skills with our exciting collection of free number puzzles 
                designed to improve logical thinking and problem-solving abilities.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
                <Boxes className="text-2xl text-purple-400 mx-auto mb-2" />
                <div className="text-white font-bold text-xl">{numberPuzzles.length}</div>
                <div className="text-gray-400 text-sm">Puzzles</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
                <Clock className="text-2xl text-yellow-400 mx-auto mb-2" />
                <div className="text-white font-bold text-xl">Daily</div>
                <div className="text-gray-400 text-sm">Challenges</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
                <Users className="text-2xl text-cyan-400 mx-auto mb-2" />
                <div className="text-white font-bold text-xl">Free</div>
                <div className="text-gray-400 text-sm">To Play</div>
              </div>
            </div>

            {/* Last Updated Date */}
            <div className="text-center">
              <p className="text-sm text-gray-500 bg-gray-800/50 rounded-lg px-4 py-2 inline-block border border-gray-700">
                Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <div className="py-4">
            <Ads format="horizontal" slot="2207590813" isMobileFooter={false} className="lg:hidden" />
          </div>

          {/* Puzzles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
            {numberPuzzles.map((puzzle, index) => (
              <PuzzleCard key={puzzle.slug} puzzle={puzzle} index={index} />
            ))}
          </div>

          <div className="py-4">
            <Ads format="horizontal" slot="9040722315" isMobileFooter={false} className="lg:hidden" />
          </div>

          {/* Gaming Features Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Why Players Love Number Puzzles</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Brain Training</h3>
                <p className="text-gray-300">Improve cognitive skills, memory, and logical reasoning abilities</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Math Skills</h3>
                <p className="text-gray-300">Develop mental math, pattern recognition, and problem-solving</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">All Levels</h3>
                <p className="text-gray-300">Multiple difficulty levels perfect for beginners to math experts</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-500/20 text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Daily Progress</h3>
                <p className="text-gray-300">Track your improvement with daily challenges and achievements</p>
              </div>
            </div>
          </div>

          {/* FAQ Section - Gaming Style */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "What are number puzzles?",
                  answer: "Number puzzles are mathematical games and brain teasers that challenge players to solve problems using numbers, patterns, sequences, and logical reasoning. They range from simple arithmetic challenges to complex logical problems designed to develop mathematical thinking."
                },
                {
                  question: "Are these number puzzles free to play?",
                  answer: "Yes! All our number puzzles are completely free to play with no registration required. Enjoy unlimited gameplay across all puzzle types, multiple difficulty levels, and daily challenges without any cost or subscription requirements."
                },
                {
                  question: "What skills do number puzzles develop?",
                  answer: "Number puzzles develop mathematical reasoning, logical thinking, problem-solving abilities, pattern recognition, mental math skills, concentration, spatial reasoning, strategic planning, and overall cognitive function through engaging mathematical challenges."
                },
                {
                  question: "Which number puzzle should I start with?",
                  answer: "Beginners should start with Number Sequence or Prime Hunter, which have easier difficulty levels. Intermediate players can try Number Scramble or Number Tower, while Sudoku offers classic puzzle challenges suitable for all skill levels."
                },
                {
                  question: "Are these puzzles suitable for children?",
                  answer: "Absolutely! Our number puzzles are excellent for children developing mathematical skills. The varying difficulty levels make them suitable for different age groups, helping build foundational math skills and logical thinking abilities valuable for academic success."
                },
                {
                  question: "How often are new puzzles added?",
                  answer: "We add new puzzles and challenges regularly, with daily updates for most puzzle types. Each game features fresh content, new difficulty levels, and seasonal challenges to keep the experience engaging and provide continuous learning opportunities."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/30 transition-all duration-300">
                  <h3 className="font-semibold text-lg text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Content Section */}
          <section className="bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-700">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-3xl font-bold text-white mb-6">Number Puzzles Collection - Mathematical Brain Teasers</h2>
              <p className="text-lg text-gray-300 mb-6">
                Our <strong className="text-purple-400">number puzzles collection</strong> offers challenging mathematical games designed to 
                improve logical reasoning, problem-solving skills, and cognitive abilities through engaging, 
                thought-provoking puzzles that make learning mathematics enjoyable and rewarding.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Featured Number Puzzles</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-400 font-bold mr-2">•</span>
                      <span><strong>Number Scramble</strong>: Combine numbers and operators to reach target values</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 font-bold mr-2">•</span>
                      <span><strong>Prime Hunter</strong>: Identify prime numbers in challenging grid configurations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 font-bold mr-2">•</span>
                      <span><strong>Number Sequence</strong>: Discover patterns and complete mathematical sequences</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 font-bold mr-2">•</span>
                      <span><strong>Number Tower</strong>: Strategically arrange numbers in tower structures</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Mathematical Benefits</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-purple-400 font-bold mr-2">✓</span>
                      <span>Enhanced <strong>mathematical reasoning</strong> and logical thinking</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 font-bold mr-2">✓</span>
                      <span>Improved <strong>problem-solving</strong> and strategic planning skills</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 font-bold mr-2">✓</span>
                      <span>Advanced <strong>pattern recognition</strong> and analytical abilities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 font-bold mr-2">✓</span>
                      <span>Stronger <strong>mental math</strong> and numerical processing</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Perfect For Mathematical Development</h3>
                <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-2">Students & Learners</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Elementary students building math foundations</li>
                      <li>• Middle school students developing logic skills</li>
                      <li>• High school students preparing for exams</li>
                      <li>• College students strengthening analytical thinking</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-2">Adults & Enthusiasts</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Puzzle enthusiasts seeking intellectual challenges</li>
                      <li>• Professionals maintaining analytical skills</li>
                      <li>• Seniors preserving cognitive health</li>
                      <li>• Families enjoying educational entertainment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>  
    </div>
  );
}