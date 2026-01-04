// src/app/word-games/boggle/page.tsx
'use client';

import MuteButton from '@/components/common/MuteButton';
import BoggleGame from '@/components/word-games/BoggleGame';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function BogglePage() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Boggle
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
      knowsAbout: ['Trivia', 'Quiz Games', 'Word Games', 'Educational Entertainment', 'Vocabulary Games', 'Word Puzzles', 'Language Games']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Free Boggle Game Online | Word Search Challenge | Triviaah',
      description: 'Play free Boggle game online. Find words in a 4x4 or 5x5 letter grid with our daily puzzle challenge. Boost your vocabulary, word-finding skills, and uncover all possible words.',
      url: 'https://triviaah.com/word-games/boggle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Boggle',
        description: 'Classic word search game where players find words by connecting adjacent letters in a grid. Features daily puzzles, multiple grid sizes, and vocabulary building challenges.',
        gameLocation: 'https://triviaah.com/word-games/boggle',
        characterAttribute: 'Vocabulary, Word Recognition, Pattern Finding, Language Skills, Cognitive Training, Word Games'
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
          name: 'Word Games',
          item: 'https://triviaah.com/word-games'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Boggle',
          item: 'https://triviaah.com/word-games/boggle'
        }
      ]
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Boggle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Boggle is a classic word game where players find words by connecting adjacent letters in a 4x4 or 5x5 grid. Words are formed from sequentially adjacent letters horizontally, vertically, or diagonally.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do you play Boggle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Players find as many words as possible within the time limit by connecting adjacent letters. Words must be at least 3 letters long and can be formed horizontally, vertically, or diagonally in any direction.'
          }
        },
        {
          '@type': 'Question',
          name: 'What are the benefits of playing Boggle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Boggle improves vocabulary, spelling skills, pattern recognition, and cognitive abilities. It enhances word recognition speed and helps build language skills in an engaging, game-based format.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Boggle educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Boggle is highly educational for vocabulary building, spelling practice, and cognitive development. It helps players discover new words and improves pattern recognition skills.'
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
    <div className="min-h-screen bg-gradient-to-br bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Structured Data */}
      <Script
        id="boggle-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="boggle-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="boggle-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
      />
      <Script
        id="boggle-faq-schema"
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
        {/* Mute Button - Fixed Position */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <BoggleGame />

        {/* Enhanced FAQ Section - Fixed Arrow */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold text-white">Boggle Game Information & FAQ</h2>
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
                <h3 className="font-semibold text-gray-300" itemProp="name">What is Boggle?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Boggle is a classic word game where players find words by connecting adjacent letters in a 4x4 or 5x5 grid. 
                  Words are formed from sequentially adjacent letters horizontally, vertically, or diagonally. It&apos;s one of 
                  the most engaging free word puzzles available online, perfect for enhancing vocabulary and cognitive skills.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">How do you play Boggle?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Players find as many words as possible within the time limit by connecting adjacent letters. Words must be 
                  at least 3 letters long and can be formed horizontally, vertically, or diagonally in any direction. Each 
                  letter can only be used once per word, and proper nouns are not allowed.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">What are the benefits of playing Boggle?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Boggle improves vocabulary, spelling skills, pattern recognition, and cognitive abilities. It enhances word 
                  recognition speed, builds language skills, and provides excellent mental exercise. Regular play can help 
                  with vocabulary expansion, spelling improvement, and faster word recognition.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">Is Boggle educational?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Boggle is highly educational for vocabulary building, spelling practice, and cognitive development. 
                  It helps players discover new words, improves pattern recognition skills, and enhances language processing 
                  speed. Many educators use Boggle as a fun way to reinforce spelling and vocabulary lessons.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">What word lengths are allowed in Boggle?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Words must be at least 3 letters long. There is no maximum length, but typically words found in Boggle range 
                  from 3 to 8 letters. Longer words are possible but less common due to the grid size constraints.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">Is this Boggle game free to play?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Our online Boggle game is completely free to play with no registration required. You can play as many 
                  games as you want and enjoy daily new puzzles to keep challenging your word-finding skills.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Boggle - Free Online Word Search Game</h2>
            <p itemProp="description">
              Play the classic Boggle word search game online for free. Find words by connecting adjacent 
              letters in a 4x4 or 5x5 grid. Improve your vocabulary, spelling skills, and pattern recognition 
              with our daily puzzle challenges. Perfect for word game enthusiasts, students, educators, and 
              anyone looking to enhance their language skills through fun, engaging gameplay.
            </p>
            <h3>How to Play Boggle:</h3>
            <ul>
              <li>Find words by connecting adjacent letters (horizontally, vertically, or diagonally)</li>
              <li>Words must be at least 3 letters long</li>
              <li>Each letter can only be used once per word</li>
              <li>Proper nouns are not allowed</li>
              <li>Find as many words as possible within the time limit</li>
              <li>Longer words score more points</li>
              <li>Daily new puzzles and challenges</li>
              <li>Completely free with no registration required</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Multiple grid sizes (4x4 and 5x5)</li>
              <li>Daily puzzle challenges</li>
              <li>Vocabulary building and spelling practice</li>
              <li>Pattern recognition training</li>
              <li>Cognitive skill development</li>
              <li>Mobile-friendly design</li>
              <li>No time pressure in practice mode</li>
              <li>Word definitions and learning resources</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Expands vocabulary and discovers new words</li>
              <li>Improves spelling and word recognition</li>
              <li>Enhances pattern finding and cognitive skills</li>
              <li>Develops quick thinking and mental agility</li>
              <li>Builds language processing speed</li>
              <li>Reinforces English language skills</li>
            </ul>
            <p><strong>Perfect for:</strong> Word game lovers, students learning English, educators looking for 
               engaging teaching tools, seniors maintaining cognitive health, and anyone wanting to improve 
               their vocabulary and language skills through entertaining daily challenges.</p>
          </div>
        </div>
      </div>
    </div>
  );
}