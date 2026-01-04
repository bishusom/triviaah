// src/app/Creaturedle/page.tsx - REDESIGNED
'use client';

import CreaturedleComponent from '@/components/brainwave/CreaturedleComponent';
import { getDailyCreature, CreaturePuzzle } from '@/lib/brainwave/creaturedle/creaturdle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { PawPrint, Target, Users, Clock, Trophy, Leaf, Zap } from 'lucide-react';

export default function CreaturedlePage() {
  const [creatureData, setCreatureData] = useState<{puzzle: CreaturePuzzle | null} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Creaturedle
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Animal Games', 'Biology Puzzles', 'Nature Education']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Creaturedle - Daily Animal Guessing Game | Triviaah',
      description: 'Guess the animal from its 6 attributes: class, habitat, diet, size, activity, and body covering. Wordle-style animal guessing game for nature lovers.',
      url: 'https://triviaah.com/creaturedle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Creaturedle',
        description: 'Daily animal guessing game where players identify animals based on 6 key attributes: class, habitat, diet, size, activity, and body covering.',
        gameLocation: 'https://triviaah.com/creaturedle',
        characterAttribute: 'Animals, Wildlife, Biology, Nature, Science Education'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Creaturedle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Creaturedle is a daily animal puzzle game where you guess the target animal using 6 key attributes: class, habitat, diet, size, activity, and body covering. It\'s an educational game that teaches about wildlife and biology.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Creaturedle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You have 6 attempts to guess the daily animal. Use the 6 attribute categories to narrow down possibilities. Each guess provides feedback on which attributes match the target animal.'
          }
        },
        {
          '@type': 'Question',
          name: 'What are the 6 attributes in Creaturedle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The 6 attributes are: Animal Class (mammal, bird, reptile, etc.), Habitat, Diet, Size, Activity Pattern (nocturnal/diurnal), and Body Covering (fur, feathers, scales, etc.).'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Creaturedle educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Creaturedle is designed to be both fun and educational. Players learn about animal classification, habitats, diets, and other biological characteristics while playing.'
          }
        }
      ]
    }
  });

  useEffect(() => {
    // Set the current date on the client side to ensure it's using client timezone
    const now = new Date();
    setCurrentDate(now);
    setLastUpdated(now.toISOString());
  }, []);

  useEffect(() => {
    const fetchDailyCreature = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyCreature(currentDate);
        
        if (!data || !data.puzzle) {
          setError('No puzzle available for today');
          return;
        }
        
        setCreatureData(data);

        // Update structured data with today's puzzle info
        setStructuredData(prev => ({
          ...prev,
          webpage: {
            ...prev.webpage,
            dateModified: new Date().toISOString()
          }
        }));
        
      } catch (err) {
        console.error('Error fetching daily creature:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyCreature();
  }, [currentDate]);

  // Loading State
  if (isLoading || !currentDate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-900">
        {/* Structured Data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="faq-schema"
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
          <Ads format="horizontal" isMobileFooter={true} style={{ width: '100%', height: '100px' }} className="lg:hidden" />
        )}
        
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-2xl">
                <PawPrint className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                CREATUREDLE
              </h1>
            </div>
            <p className="text-gray-200 text-lg">Daily Animal Guessing Challenge</p>
          </div>

          {/* Loading Card */}
          <div className="bg-green-800/50 backdrop-blur-lg rounded-3xl border border-green-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
                <PawPrint className="w-10 h-10 text-green-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Loading Today&apos;s Creature</h2>
            <p className="text-green-200 mb-6">Preparing your animal puzzle...</p>
            
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${dot * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !creatureData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-black text-white">
        {/* Structured Data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faq) }}
        />

        {/* Ads */}
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
        
        {showMobileAd && (
          <Ads format="horizontal" isMobileFooter={true} style={{ width: '100%', height: '100px' }} className="lg:hidden" />
        )}
        
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-2xl">
                <PawPrint className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                CREATUREDLE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Animal Guessing Challenge</p>
          </div>

          {/* Error Card */}
          <div className="bg-green-500/10 backdrop-blur-lg rounded-3xl border border-green-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Challenge Unavailable</h2>
            <p className="text-green-200 mb-6">We couldn&apos;t load today&apos;s animal puzzle.</p>
            
            <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 mb-6">
              <p className="text-green-300 text-sm">{error || 'No puzzle available for today'}</p>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Game State
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-black text-white">
      {/* Structured Data */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="faq-schema"
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
        <Ads isMobileFooter={true} format="horizontal" style={{ width: '100%', height: '100px' }} className="lg:hidden" />
      )}
      
      {/* Ad Controls */}
      {showAds && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setShowDesktopAds(!showDesktopAds)}
            className="bg-gray-700/80 hover:bg-gray-600/80 text-white text-xs px-3 py-2 rounded-2xl backdrop-blur-sm hidden lg:block transition-all duration-300"
          >
            {showDesktopAds ? 'Hide Ads' : 'Show Ads'}
          </button>
          <button
            onClick={() => setShowMobileAd(!showMobileAd)}
            className="bg-gray-700/80 hover:bg-gray-600/80 text-white text-xs px-3 py-2 rounded-2xl backdrop-blur-sm lg:hidden transition-all duration-300"
          >
            {showMobileAd ? 'Hide Ad' : 'Show Ad'}
          </button>
        </div>
      )}

      <div className="max-w-4xl lg:max-w-2xl mx-auto p-4 relative z-30">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-2xl shadow-lg">
                <PawPrint className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                CREATUREDLE
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-green-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-green-400 text-sm font-medium"
              >
                Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </time>
            </div>
          </div>
          
          <p className="text-gray-300 text-lg mb-2">Guess the animal from 6 attributes in 6 attempts</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Daily Challenge</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Global Players</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-sm">6 Attempts</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Leaf className="w-5 h-5 text-emerald-500" />
              <span className="text-sm">6 Attributes</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        {creatureData.puzzle && <CreaturedleComponent initialData={creatureData as { puzzle: CreaturePuzzle }} />}

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6 relative z-10">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none p-4 hover:bg-gray-700/30 rounded-2xl transition-all duration-300">
              <h2 className="text-xl font-bold text-white">Game Guide & FAQ</h2>
              <span className="text-green-400 group-open:rotate-180 transition-transform duration-300 text-2xl">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-6 pt-6 border-t border-gray-700">
              <div className="grid gap-4">
                {[
                  {
                    question: "What is Creaturedle?",
                    answer: "Creaturedle is a daily animal puzzle game where you guess the target animal using 6 key attributes: class, habitat, diet, size, activity, and body covering. It's an educational game that teaches about wildlife and biology in a fun, interactive way."
                  },
                  {
                    question: "How do I play Creaturedle?",
                    answer: "You have 6 attempts to guess the daily animal. Use the 6 attribute categories to narrow down possibilities. Each guess provides feedback on which attributes match the target animal, helping you eliminate options and make educated guesses."
                  },
                  {
                    question: "What are the 6 attributes in Creaturedle?",
                    answer: "The 6 attributes are: Animal Class (mammal, bird, reptile, fish, amphibian, insect, etc.), Habitat (forest, ocean, desert, etc.), Diet (carnivore, herbivore, omnivore), Size (small, medium, large), Activity Pattern (nocturnal, diurnal, crepuscular), and Body Covering (fur, feathers, scales, skin, etc.)."
                  },
                  {
                    question: "Is Creaturedle educational?",
                    answer: "Yes! Creaturedle is designed to be both fun and educational. Players learn about animal classification, habitats, diets, and other biological characteristics while playing. It's great for students, nature enthusiasts, and anyone interested in wildlife."
                  },
                  {
                    question: "What types of animals are included?",
                    answer: "Creaturedle features a wide variety of animals from around the world, including mammals, birds, reptiles, amphibians, fish, and insects. The database includes both common and exotic species to provide diverse and interesting challenges."
                  },
                  {
                    question: "Is Creaturedle free to play?",
                    answer: "Yes! Creaturedle is completely free to play with no registration required. New animal puzzles are available every day at midnight local time."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-2xl p-4">
                    <h3 className="font-semibold text-green-400 mb-2">{faq.question}</h3>
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Game">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2>Creaturedle - Daily Animal Guessing Game</h2>
            <p itemProp="description">
              Test your wildlife knowledge with Creaturedle, a daily puzzle game where you guess animals 
              based on 6 key biological attributes. Educational and fun for nature enthusiasts of all ages. 
              Perfect for animal lovers, biology students, and anyone interested in learning more about the natural world.
            </p>
            <h3>How to Play Creaturedle:</h3>
            <ul>
              <li>Guess the target animal in 6 attempts</li>
              <li>Use 6 attribute categories to narrow down possibilities</li>
              <li>Get feedback on class, habitat, diet, size, activity, and body covering</li>
              <li>Learn about animal biology and classification</li>
              <li>New animal puzzle every day</li>
              <li>Completely free with no registration required</li>
              <li>Educational and entertaining for all ages</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily wildlife challenges with diverse animals</li>
              <li>Educational biology and classification system</li>
              <li>Six attribute categories for strategic guessing</li>
              <li>Comprehensive animal database</li>
              <li>Mobile-friendly design</li>
              <li>No time pressure - play at your own pace</li>
              <li>Learn fascinating animal facts and characteristics</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Learn animal classification and taxonomy</li>
              <li>Understand different habitats and ecosystems</li>
              <li>Explore dietary patterns and food chains</li>
              <li>Discover animal adaptations and characteristics</li>
              <li>Improve deductive reasoning and problem-solving skills</li>
            </ul>
            <p><strong>Perfect for:</strong> Nature enthusiasts, biology students, animal lovers, families, 
               educators, and anyone wanting to learn more about wildlife in an engaging, interactive way.</p>
          </div>
        </div>
      </div>
    </div>
  );
}