// src/app/word-games/word-ladder/page.tsx
'use client';

import MuteButton from '@/components/common/MuteButton';
import WordLadderGame from '@/components/word-games/WordLadderGame';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function WordLadderPage() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Word Ladder
  const [structuredData, setStructuredData] = useState({
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Triviaah',
      url: 'https://triviaah.com',
      description: 'Free daily trivia quizzes and challenges across multiple categories including general knowledge, history, entertainment, and more.',
      logo: 'https://triviaah.com/logo.png',
      sameAs: [],
      foundingDate: '2025-04-01',
      knowsAbout: ['Trivia', 'Quiz Games', 'Word Games', 'Educational Entertainment', 'Vocabulary Games', 'Logic Puzzles', 'Brain Games']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Free Word Ladder Puzzles Online | Vocabulary Brain Game | Triviaah',
      description: 'Play free word ladder puzzles online. Transform one word into another by changing one letter at a time. Fun vocabulary game that improves spelling and logic skills.',
      url: 'https://triviaah.com/word-games/word-ladder',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Word Ladder',
        description: 'Classic word transformation puzzle where players change one word into another by altering one letter at a time, with each step forming a valid word. Features multiple difficulty levels and daily challenges.',
        gameLocation: 'https://triviaah.com/word-games/word-ladder',
        characterAttribute: 'Vocabulary, Spelling, Logic, Problem Solving, Pattern Recognition, Cognitive Skills'
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
          name: 'Word Ladder',
          item: 'https://triviaah.com/word-games/word-ladder'
        }
      ]
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is a Word Ladder?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Word Ladder is a word puzzle where you transform one word into another by changing one letter at a time, with each intermediate step forming a valid English word.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do you play Word Ladder?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Start with the beginning word and change one letter to form a new valid word. Continue changing one letter at a time until you reach the target word. Each step must be a valid dictionary word.'
          }
        },
        {
          '@type': 'Question',
          name: 'What are the benefits of playing Word Ladder?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Word Ladder improves vocabulary, spelling skills, logical thinking, problem-solving abilities, and pattern recognition. It\'s excellent mental exercise for cognitive development.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Word Ladder educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Word Ladder is highly educational for vocabulary building, spelling practice, and developing logical thinking skills. It helps players discover word patterns and improves language skills.'
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
        id="word-ladder-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="word-ladder-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="word-ladder-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
      />
      <Script
        id="word-ladder-faq-schema"
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
            <h1 className="text-3xl font-bold mb-2">Free Word Ladder Puzzles Online</h1>
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
            Transform words step by step in this classic vocabulary puzzle game. 
            Perfect for word game enthusiasts and anyone looking to improve their spelling skills.
          </p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        <WordLadderGame />

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold text-white">Word Ladder Game Information & FAQ</h2>
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
                <h3 className="font-semibold text-gray-300" itemProp="name">What is a Word Ladder?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  A Word Ladder is a classic word puzzle where you transform one word into another by changing 
                  one letter at a time, with each intermediate step forming a valid English word. It&apos;s an 
                  engaging vocabulary and logic game that challenges your word knowledge and problem-solving skills.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">How do you play Word Ladder?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Start with the beginning word and change one letter to form a new valid word. Continue changing 
                  one letter at a time until you reach the target word. Each step must be a valid dictionary word, 
                  and you can only change one letter per step. The goal is to find the shortest possible path between 
                  the two words.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">What are the benefits of playing Word Ladder?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Word Ladder improves vocabulary, spelling skills, logical thinking, problem-solving abilities, 
                  and pattern recognition. It&apos;s excellent mental exercise for cognitive development, helping 
                  players develop strategic thinking and word association skills while expanding their vocabulary.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">Is Word Ladder educational?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Word Ladder is highly educational for vocabulary building, spelling practice, and developing 
                  logical thinking skills. It helps players discover word patterns, understand word relationships, 
                  and improves overall language skills. Many educators use word ladder puzzles as effective teaching 
                  tools in language arts and vocabulary development.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">What strategies help solve Word Ladders?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Look for common word patterns and endings, try changing vowels first as they often create new words, 
                  work from both the start and end words simultaneously, and consider multiple possibilities for each 
                  step. Using word families and common prefixes/suffixes can also help find the solution faster.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-gray-300" itemProp="name">Is this Word Ladder game free to play?</h3>
                <p className="text-gray-300" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Our online Word Ladder game is completely free to play with no registration required. 
                  You can play multiple difficulty levels, enjoy daily new puzzles, and challenge yourself 
                  to improve your word skills without any cost or subscription.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Game Information Section */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Word Ladder Puzzles</h2>
          <div className="prose prose-invert max-w-none text-gray-300">
            <p className="mb-4">
              Word Ladder is a classic word game where you transform one word into another by 
              changing a single letter at a time, with each intermediate step forming a valid word. 
              It&apos;s one of the most engaging <strong>free word puzzles</strong> available online, 
              perfect for <strong>vocabulary building</strong> and <strong>cognitive exercise</strong>.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Benefits of Playing Word Ladder:</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Improves vocabulary and spelling skills</li>
              <li>Enhances problem-solving and logical thinking</li>
              <li>Great brain exercise for all ages</li>
              <li>Helps with pattern recognition</li>
              <li>Fun way to learn new words</li>
              <li>Develops strategic thinking abilities</li>
              <li>Improves mental flexibility</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Game Features:</h3>
            <p className="mb-4">
              Our <strong>free online word ladder</strong> puzzles are carefully designed to provide 
              the perfect balance of challenge and enjoyment. As one of the top <strong>free word games</strong> 
              available, we offer:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Multiple difficulty levels from beginner to expert</li>
              <li>Daily new puzzles to keep the challenge fresh</li>
              <li>Hint system to help when you&apos;re stuck</li>
              <li>Timer to track your solving speed</li>
              <li>Progress tracking and achievement system</li>
              <li>Completely free with no registration required</li>
            </ul>
            
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 text-white">
              <h4 className="font-bold text-white mb-2">Word Ladder Tips & Strategies:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Start by looking for common word patterns and endings</li>
                <li>Try changing vowels first as they often create new words</li>
                <li>Work from both the start and end words simultaneously</li>
                <li>Use the hint system when you need a nudge in the right direction</li>
                <li>Consider multiple possibilities for each step before committing</li>
                <li>Look for word families and common prefixes/suffixes</li>
                <li>Practice regularly to improve your solving speed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Word Ladder - Free Online Word Transformation Puzzles</h2>
            <p itemProp="description">
              Challenge your mind with Word Ladder puzzles! Transform one word into another by changing 
              one letter at a time in this classic vocabulary and logic game. Perfect for word game enthusiasts, 
              students, educators, and anyone looking to improve their vocabulary, spelling, and problem-solving 
              skills through engaging, educational gameplay.
            </p>
            <h3>How to Play Word Ladder:</h3>
            <ul>
              <li>Start with the beginning word provided</li>
              <li>Change one letter to form a new valid word</li>
              <li>Continue changing one letter per step</li>
              <li>Each intermediate step must be a valid dictionary word</li>
              <li>Reach the target word in the fewest steps possible</li>
              <li>Use hints when you need assistance</li>
              <li>Daily new puzzles with varying difficulty</li>
              <li>Completely free with no registration required</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Multiple difficulty levels (Beginner to Expert)</li>
              <li>Daily Word Ladder challenges</li>
              <li>Vocabulary building and spelling practice</li>
              <li>Logic and problem-solving development</li>
              <li>Hint system for learning assistance</li>
              <li>Timer and progress tracking</li>
              <li>Mobile-friendly interface</li>
              <li>Educational word definitions</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Expands vocabulary with new word discoveries</li>
              <li>Improves spelling and word recognition</li>
              <li>Enhances logical thinking and problem-solving</li>
              <li>Develops pattern recognition skills</li>
              <li>Builds mental flexibility and strategic thinking</li>
              <li>Improves cognitive processing speed</li>
              <li>Reinforces English language skills</li>
            </ul>
            <p><strong>Perfect for:</strong> Word game lovers, students learning English, educators seeking 
               engaging teaching tools, puzzle enthusiasts, seniors maintaining cognitive health, and anyone 
               wanting to improve their vocabulary, spelling, and logical thinking skills through entertaining 
               daily challenges.</p>
          </div>
        </div>
      </div>
    </div>
  );
}