// src/app/word-games/cryptogram/page.tsx
'use client';

import MuteButton from '@/components/common/MuteButton';
import CryptogramGame from '@/components/word-games/CryptogramGame';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function CryptogramPage() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Cryptogram
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
      knowsAbout: ['Trivia', 'Quiz Games', 'Word Games', 'Educational Entertainment', 'Vocabulary Games', 'Word Puzzles', 'Language Games', 'Spelling Games']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Word Cryptogram Game | Decode Quotes, Books & Movies | Triviaah',
      description: 'Challenge your mind with our Word Cryptogram game! Decode letters to reveal quotes, book names, and movie titles while building vocabulary and logic skills with daily puzzle challenges.',
      url: 'https://triviaah.com/word-games/cryptogram',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Word Cryptogram',
        description: 'Letter substitution game where players decode letters to reveal quotes, book names, and movie titles. Features daily puzzles, multiple difficulty levels, and cognitive building challenges.',
        gameLocation: 'https://triviaah.com/word-games/cryptogram',
        characterAttribute: 'Vocabulary, Spelling, Word Recognition, Pattern Finding, Language Skills, Cognitive Training'
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
          name: 'Word Cryptogram',
          item: 'https://triviaah.com/word-games/cryptogram'
        }
      ]
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Word Cryptogram?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Word Cryptogram is a puzzle game where letters are encrypted with a substitution cipher, and players must decode them to reveal the original quote, book title, or movie title. It\'s an excellent game for logic building and mental exercise.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do you play Word Cryptogram?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Players map letters to decode the encrypted puzzle text. Use hints if stuck, clear mappings for a new start, and find the correct substitution cipher to match the original puzzle.'
          }
        },
        {
          '@type': 'Question',
          name: 'What are the benefits of playing Word Cryptogram?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Word Cryptogram improves vocabulary, spelling skills, pattern recognition, and cognitive abilities. It enhances mental flexibility, word recognition speed, and helps discover new words and their spellings.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Word Cryptogram educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Word Cryptogram is highly educational for vocabulary building, spelling practice, and cognitive development. It helps players learn new words, improve spelling, and enhance pattern recognition skills.'
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
        id="cryptogram-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="cryptogram-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="cryptogram-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
      />
      <Script
        id="cryptogram-faq-schema"
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
        
        <CryptogramGame />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold text-white">Word Cryptogram Game Information & FAQ</h2>
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
                <h3 className="font-semibold text-gray-300" itemProp="name">What is Word Cryptogram?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Word Cryptogram is a puzzle game where letters are encrypted with a substitution cipher, and players must 
                  decode them to form the original quote, book title, or movie title. It&apos;s an excellent game for vocabulary building, 
                  logic practice, and mental exercise that challenges your pattern recognition and word skills.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">How do you play Word Cryptogram?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Players map letters to decode the encrypted puzzle text. 
                  Use hints if you&apos;re stuck, clear mappings for a new arrangement, and find all the correct mappings 
                  to solve the puzzle. The game features multiple puzzle types and 
                  limitless challenges to keep improving your skills.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">What are the benefits of playing Word Cryptogram?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Word Cryptogram improves vocabulary, spelling skills, pattern recognition, and cognitive abilities. 
                  It enhances mental flexibility, word recognition speed, and helps discover new words and their 
                  correct spellings. Regular play can significantly boost your language skills and mental agility.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">Is Word Cryptogram educational?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Word Cryptogram is highly educational for vocabulary building, spelling practice, and cognitive 
                  development. It helps players learn new words, improve spelling, enhance pattern recognition skills, 
                  and develop better language processing abilities. Many educators use word cryptogram games as fun 
                  teaching tools in classrooms.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">What strategies help with solving cryptograms?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Look for common prefixes and suffixes, identify vowel and consonant patterns, try to spot smaller 
                  words within the cryptogram, and consider different letter combinations. Starting with the first and 
                  last letters can often provide clues to the overall word structure.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">Is this Word Cryptogram game free to play?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Our online Word Cryptogram game is completely free to play with no registration required. 
                  You can play as many games as you want and enjoy daily new puzzles to keep challenging and 
                  improving your word skills.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Word Cryptogram - Quote Decoding Vocabulary Game</h2>
            <p itemProp="description">
              Challenge your mind with our Word Cryptogram game! Decode letters to reveal quotes, build vocabulary, 
              and improve logic skills with puzzle challenges. Perfect for word game enthusiasts, students, 
              educators, and anyone looking to enhance their language skills through fun, engaging gameplay that 
              exercises cognitive abilities and pattern recognition.
            </p>
            <h3>How to Play Word Cryptogram:</h3>
            <ul>
              <li>Decode substituted letters to reveal the original quote</li>
              <li>Click on letter mappings to substitute characters</li>
              <li>Use hints when you need assistance</li>
              <li>Clear mappings to try again</li>
              <li>Substitute all letters to win</li>
              <li>Earn points based on word length and speed</li>
              <li>Daily new puzzles and challenges</li>
              <li>Multiple difficulty levels</li>
              <li>Completely free with no registration required</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily cryptogram challenges with new words</li>
              <li>Vocabulary building and spelling practice</li>
              <li>Pattern recognition training</li>
              <li>Cognitive skill development</li>
              <li>Multiple difficulty settings</li>
              <li>Hint system for learning assistance</li>
              <li>Mobile-friendly design</li>
              <li>Progress tracking and scoring</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Expands vocabulary and discovers new words</li>
              <li>Improves spelling and word recognition</li>
              <li>Enhances pattern finding and cognitive skills</li>
              <li>Develops mental flexibility and problem-solving</li>
              <li>Builds language processing speed</li>
              <li>Reinforces English language skills</li>
              <li>Encourages logical thinking</li>
            </ul>
            <p><strong>Perfect for:</strong> Word game lovers, students learning English, educators looking for 
               engaging teaching tools, seniors maintaining cognitive health, and anyone wanting to improve 
               their vocabulary, spelling, and language skills through entertaining daily challenges.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
