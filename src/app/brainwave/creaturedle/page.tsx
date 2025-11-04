// src/app/creaturdle/page.tsx
'use client';

import CreaturedleComponent from '@/components/brainwave/CreaturedleComponent';
import { getDailyCreature, CreaturePuzzle } from '@/lib/brainwave/creaturedle/creaturdle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function CreaturdlePage() {
  const [creatureData, setCreatureData] = useState<{puzzle: CreaturePuzzle | null} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Creaturdle
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Animal Games', 'Biology Puzzles', 'Nature Education']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Creaturdle - Daily Animal Guessing Game | Elite Trivias',
      description: 'Guess the animal from its 6 attributes: class, habitat, diet, size, activity, and body covering. Wordle-style animal guessing game for nature lovers.',
      url: 'https://elitetrivias.com/creaturdle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Creaturdle',
        description: 'Daily animal guessing game where players identify animals based on 6 key attributes: class, habitat, diet, size, activity, and body covering.',
        gameLocation: 'https://elitetrivias.com/creaturdle',
        characterAttribute: 'Animals, Wildlife, Biology, Nature, Science Education'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Creaturdle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Creaturdle is a daily animal puzzle game where you guess the target animal using 6 key attributes: class, habitat, diet, size, activity, and body covering. It\'s an educational game that teaches about wildlife and biology.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Creaturdle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You have 6 attempts to guess the daily animal. Use the 6 attribute categories to narrow down possibilities. Each guess provides feedback on which attributes match the target animal.'
          }
        },
        {
          '@type': 'Question',
          name: 'What are the 6 attributes in Creaturdle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The 6 attributes are: Animal Class (mammal, bird, reptile, etc.), Habitat, Diet, Size, Activity Pattern (nocturnal/diurnal), and Body Covering (fur, feathers, scales, etc.).'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Creaturdle educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Creaturdle is designed to be both fun and educational. Players learn about animal classification, habitats, diets, and other biological characteristics while playing.'
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

  // Show loading while waiting for client date or data
  if (isLoading || !currentDate) {
    return (
      <div className="page-with-ads">
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
        
        <div className="max-w-2xl mx-auto p-6 text-center">
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold mb-2">🐾 Creaturedle - Animal Guessing Game</h1>
            {/* Last Updated Timestamp */}
            <time 
              dateTime={lastUpdated} 
              className="bg-green-50 px-3 py-1 rounded-full text-xs font-medium border border-green-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-6">Animal guessing puzzle. Guess the animal in 6 tries using 6 attributes!</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s animal puzzle...</p>

          {/* Hidden SEO Content */}
          <div className="sr-only" aria-hidden="false">
            <div itemScope itemType="https://schema.org/Game">
              <meta itemProp="dateModified" content={lastUpdated} />
              <h2>Creaturedle - Daily Animal Guessing Game</h2>
              <p itemProp="description">
                Test your wildlife knowledge with Creaturedle, a daily puzzle game where you guess animals 
                based on 6 key biological attributes. Educational and fun for nature enthusiasts of all ages.
              </p>
              <h3>How to Play Creaturedle:</h3>
              <ul>
                <li>Guess the target animal in 6 attempts</li>
                <li>Use 6 attribute categories to narrow down possibilities</li>
                <li>Get feedback on class, habitat, diet, size, activity, and body covering</li>
                <li>Learn about animal biology and classification</li>
                <li>New animal puzzle every day</li>
                <li>Completely free with no registration required</li>
              </ul>
              <p><strong>Game Features:</strong> Daily wildlife challenges, educational biology content, 
                 attribute-based guessing system, and comprehensive animal database.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !creatureData) {
    return (
      <div className="page-with-ads">
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
        
        <div className="max-w-2xl mx-auto p-6 text-center">
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold mb-2">🐾 Creaturedle - Animal Guessing Game</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-green-50 px-3 py-1 rounded-full text-xs font-medium border border-green-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-4">Animal guessing puzzle. Guess the animal in 6 tries using 6 attributes!</p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="mb-2">No puzzle available for today.</p>
            <p className="text-sm">Please check back tomorrow or try refreshing the page!</p>
            {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-with-ads">
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
      
      <div className="max-w-2xl mx-auto p-4">
        {/* Header with Last Updated */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold">🐾 Creaturedle</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-green-50 px-3 py-1 rounded-full text-xs font-medium border border-green-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600">Animal guessing puzzle. Guess the animal in 6 tries using 6 attributes!</p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {creatureData.puzzle && <CreaturedleComponent initialData={creatureData as { puzzle: CreaturePuzzle }} />}

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Creaturedle Game Information & FAQ</h2>
              <span className="text-gray-500 group-open:rotate-180 transition-transform">
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
                <h3 className="font-semibold" itemProp="name">What is Creaturdle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Creaturdle is a daily animal puzzle game where you guess the target animal using 6 key attributes: 
                  class, habitat, diet, size, activity, and body covering. It&apos;s an educational game that teaches 
                  about wildlife and biology in a fun, interactive way.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do I play Creaturdle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  You have 6 attempts to guess the daily animal. Use the 6 attribute categories to narrow down possibilities. 
                  Each guess provides feedback on which attributes match the target animal, helping you eliminate options and make educated guesses.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What are the 6 attributes in Creaturdle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  The 6 attributes are: Animal Class (mammal, bird, reptile, fish, amphibian, insect, etc.), 
                  Habitat (forest, ocean, desert, etc.), Diet (carnivore, herbivore, omnivore), Size (small, medium, large), 
                  Activity Pattern (nocturnal, diurnal, crepuscular), and Body Covering (fur, feathers, scales, skin, etc.).
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Creaturdle educational?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Creaturdle is designed to be both fun and educational. Players learn about animal classification, 
                  habitats, diets, and other biological characteristics while playing. It&apos;s great for students, nature 
                  enthusiasts, and anyone interested in wildlife.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What types of animals are included?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Creaturdle features a wide variety of animals from around the world, including mammals, birds, reptiles, 
                  amphibians, fish, and insects. The database includes both common and exotic species to provide diverse 
                  and interesting challenges.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Creaturdle free to play?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Creaturdle is completely free to play with no registration required. New animal puzzles 
                  are available every day at midnight local time.
                </p>
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