// src/app/word-games/WordGamesClientPage.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

const wordGames = [
  {
    slug: 'scramble',
    name: 'Word Scramble',
    image: '/imgs/word-scramble.webp',
    description: 'Unscramble letters to form valid words against the clock',
    features: ['Letter rearrangement', 'Vocabulary building', 'Multiple difficulty levels'],
    color: 'green'
  },
  {
    slug: 'spelling-bee',
    name: 'Spelling Bee',
    image: '/imgs/spelling-bee.webp',
    description: 'Spell words correctly using given letters with a center requirement',
    features: ['Honeycomb letter grid', 'Pangram bonuses', 'Genius ranking system'],
    color: 'yellow'
  },
  {
    slug: 'boggle',
    name: 'Boggle',
    image: '/imgs/boggle.webp',
    description: 'Find as many words as possible in a 4x4 letter grid',
    features: ['Timed word search', 'Letter connections', 'Word length scoring'],
    color: 'blue'
  },
  {
    slug: 'word-search',
    name: 'Word Search',
    image: '/imgs/word-search.webp',
    description: 'Find hidden words in a letter matrix horizontally, vertically or diagonally',
    features: ['Multiple grid sizes', 'Themed puzzles', 'Printable options'],
    color: 'orange'
  },
  {
    slug: 'word-ladder',
    name: 'Word Ladder',
    image: '/imgs/word-ladder.webp',
    description: 'Change one letter at a time to transform start word into end word',
    features: ['Word transformation', 'Logical thinking', 'Step-by-step puzzles'],
    color: 'purple'
  },
];

export default function WordGamesClientPage() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Word Games Collection
  const [structuredData, setStructuredData] = useState({
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Elite Trivias',
      url: 'https://elitetrivias.com',
      description: 'Free daily trivia quizzes and challenges across multiple categories including general knowledge, history, entertainment, and more.',
      logo: 'https://elitetrivias.com/logo.png',
      sameAs: [],
      foundingDate: '2024',
      knowsAbout: ['Trivia', 'Quiz Games', 'Word Games', 'Educational Entertainment', 'Vocabulary Games', 'Spelling Games', 'Language Games']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Free Word Games Collection | Vocabulary & Spelling Games | Elite Trivias',
      description: 'Challenge your vocabulary with our collection of free word games including Boggle, Scramble, Spelling Bee, Word Search, and Word Ladder. Improve spelling, vocabulary, and cognitive skills.',
      url: 'https://elitetrivias.com/word-games',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'ItemList',
        name: 'Word Games Collection',
        description: 'A collection of educational word games designed to improve vocabulary, spelling, and cognitive skills through engaging gameplay.',
        numberOfItems: 5,
        itemListElement: wordGames.map((game, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Game',
            name: game.name,
            description: game.description,
            url: `https://elitetrivias.com/word-games/${game.slug}`,
            gameLocation: `https://elitetrivias.com/word-games/${game.slug}`
          }
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
          item: 'https://elitetrivias.com'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Word Games',
          item: 'https://elitetrivias.com/word-games'
        }
      ]
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What types of word games are available?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We offer five main word games: Word Scramble (letter unscrambling), Spelling Bee (word formation), Boggle (word search in grid), Word Search (hidden word finding), and Word Ladder (word transformation). Each game focuses on different language skills.'
          }
        },
        {
          '@type': 'Question',
          name: 'Are these word games educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! All our word games are designed to be educational, helping improve vocabulary, spelling, pattern recognition, and cognitive skills while providing engaging entertainment.'
          }
        },
        {
          '@type': 'Question',
          name: 'Are the word games free to play?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! All word games are completely free to play with no registration required. You can enjoy unlimited gameplay across all our word game collection.'
          }
        },
        {
          '@type': 'Question',
          name: 'Which word game is best for beginners?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Word Search is great for beginners as it\'s relaxing and helps with word recognition. For more challenge, try Word Scramble or Spelling Bee to build vocabulary and spelling skills.'
          }
        }
      ]
    }
  });

  useEffect(() => {
    // Update last modified time on client side
    setLastUpdated(new Date().toISOString());
  }, []);

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      green: 'bg-green-50 border-green-200 text-green-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800'
    };
    return colorMap[color] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  return (
    <div className="page-with-ads">
      {/* Structured Data */}
      <Script
        id="word-games-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="word-games-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="word-games-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
      />
      <Script
        id="word-games-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faq) }}
      />

      <Ads format="horizontal" isMobileFooter={false} className="lg:hidden" />
      
      <div className="max-w-7xl mx-auto p-4">
        {/* Header with Last Updated */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Word Games Collection
            </h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-indigo-50 px-3 py-1 rounded-full text-xs font-medium border border-indigo-200"
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
            Challenge your vocabulary with our exciting collection of word games designed to improve spelling, vocabulary, and cognitive skills.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16">
          {wordGames.map((game) => (
            <div 
              key={game.slug}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Link href={`/word-games/${game.slug}`}>
                <div className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mb-4 flex items-center justify-center overflow-hidden">
                    <Image 
                      src={game.image}
                      alt={game.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{game.name}</h2>
                  <p className="text-gray-600 mb-4 flex-grow">{game.description}</p>
                  
                  {/* Game Features */}
                  <div className="w-full mb-4">
                    {game.features.slice(0, 2).map((feature, index) => (
                      <span 
                        key={index}
                        className={`${getColorClasses(game.color)} text-xs font-medium px-2 py-1 rounded-full mr-1 mb-1 inline-block`}
                      >
                        {feature}
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
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Word Games Collection Information & FAQ</h2>
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
                <h3 className="font-semibold" itemProp="name">What types of word games are available?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  We offer five main word games: <strong>Word Scramble</strong> (letter unscrambling), <strong>Spelling Bee</strong> (word formation), 
                  <strong>Boggle</strong> (word search in grid), <strong>Word Search</strong> (hidden word finding), and <strong>Word Ladder</strong> (word transformation). 
                  Each game focuses on different language skills and provides unique challenges for vocabulary building and cognitive development.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Are these word games educational?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! All our word games are designed to be educational, helping improve vocabulary, spelling, pattern recognition, 
                  and cognitive skills while providing engaging entertainment. Each game targets specific language skills and offers 
                  progressive learning opportunities for players of all ages and skill levels.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Are the word games free to play?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! All word games are completely free to play with no registration required. You can enjoy unlimited gameplay 
                  across all our word game collection, with daily new puzzles, multiple difficulty levels, and comprehensive 
                  learning features available at no cost.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Which word game is best for beginners?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <strong>Word Search</strong> is great for beginners as it&apos;s relaxing and helps with word recognition. 
                  For more challenge, try <strong>Word Scramble</strong> or <strong>Spelling Bee</strong> to build vocabulary 
                  and spelling skills. <strong>Boggle</strong> offers a good balance of challenge and accessibility, while 
                  <strong>Word Ladder</strong> is perfect for developing logical thinking and problem-solving skills.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What educational benefits do these games provide?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Our word games provide comprehensive educational benefits including vocabulary expansion, spelling improvement, 
                  pattern recognition development, cognitive skill enhancement, logical thinking improvement, and mental agility 
                  training. Regular play can significantly boost language proficiency and academic performance.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Are there difficulty levels for different age groups?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Each word game offers multiple difficulty levels suitable for different age groups and skill levels. 
                  From beginner-friendly puzzles for children and language learners to expert challenges for word game 
                  enthusiasts, our collection provides appropriate challenges for everyone from elementary students to adults.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Enhanced About Section */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Our Word Games Collection</h2>
          <div className="prose prose-lg text-gray-600">
            <p className="mb-4">
              Our comprehensive word games collection is designed to help improve vocabulary, spelling, and cognitive skills 
              through engaging, educational gameplay. Each game offers unique challenges that target different aspects of 
              language learning and mental development.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Educational Benefits:</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Vocabulary Expansion:</strong> Discover new words and their meanings through contextual gameplay</li>
              <li><strong>Spelling Improvement:</strong> Reinforce correct spelling patterns and word structures</li>
              <li><strong>Cognitive Development:</strong> Enhance pattern recognition, memory, and problem-solving skills</li>
              <li><strong>Language Skills:</strong> Improve reading comprehension and word recognition speed</li>
              <li><strong>Mental Agility:</strong> Develop quick thinking and mental flexibility</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Perfect For:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Students looking to improve language arts skills</li>
              <li>Educators seeking engaging classroom activities</li>
              <li>Word game enthusiasts wanting new challenges</li>
              <li>Seniors maintaining cognitive health</li>
              <li>Language learners building vocabulary</li>
              <li>Families enjoying educational entertainment together</li>
            </ul>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">Learning Tips:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Start with easier levels and gradually increase difficulty</li>
                <li>Play regularly to build consistent learning habits</li>
                <li>Use the hint systems to learn new words and strategies</li>
                <li>Challenge yourself with daily puzzles for continuous improvement</li>
                <li>Mix different game types to develop comprehensive language skills</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/ItemList">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Word Games Collection - Free Online Vocabulary and Spelling Games</h2>
            <p itemProp="description">
              Explore our comprehensive collection of free word games designed to improve vocabulary, spelling, 
              and cognitive skills through engaging educational gameplay. Perfect for students, educators, word 
              game enthusiasts, and anyone looking to enhance their language abilities with fun, challenging puzzles.
            </p>
            <h3>Featured Word Games:</h3>
            <ul>
              <li><strong>Word Scramble:</strong> Unscramble letters to form valid words and build vocabulary</li>
              <li><strong>Spelling Bee:</strong> Create words from letter honeycombs with center letter requirements</li>
              <li><strong>Boggle:</strong> Find words by connecting adjacent letters in timed grid challenges</li>
              <li><strong>Word Search:</strong> Locate hidden words in letter grids across multiple directions</li>
              <li><strong>Word Ladder:</strong> Transform words step by step through single letter changes</li>
            </ul>
            <h3>Collection Features:</h3>
            <ul>
              <li>Five unique word game types targeting different language skills</li>
              <li>Multiple difficulty levels for all ages and skill levels</li>
              <li>Daily new puzzles and challenges</li>
              <li>Comprehensive educational benefits</li>
              <li>Progress tracking and achievement systems</li>
              <li>Completely free with no registration required</li>
              <li>Mobile-friendly designs for gaming anywhere</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Vocabulary expansion and word discovery</li>
              <li>Spelling improvement and pattern recognition</li>
              <li>Cognitive development and mental agility</li>
              <li>Language skills enhancement</li>
              <li>Problem-solving and logical thinking</li>
              <li>Visual scanning and pattern finding</li>
            </ul>
            <p><strong>Ideal For:</strong> Students improving language arts, educators enhancing classroom activities, 
               word game enthusiasts seeking challenges, seniors maintaining cognitive health, language learners 
               building vocabulary, and families enjoying educational entertainment together.</p>
          </div>
        </div>
      </div>
    </div>
  );
}