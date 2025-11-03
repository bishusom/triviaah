// src/app/foodle/page.tsx
'use client';

import FoodleComponent from '@/components/brainwave/FoodleComponent';
import { getDailyFood, FoodPuzzle } from '@/lib/brainwave/foodle/foodle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function FoodlePage() {
  const [foodData, setFoodData] = useState<{puzzle: FoodPuzzle | null} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());

  // Structured data for Foodle
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Food Games', 'Cooking Puzzles', 'Culinary Education']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Foodle - Daily Food Puzzle | Elite Trivias',
      description: 'Guess the food from its 6 attributes: cuisine, course, main ingredients, cooking method, flavor profile, and temperature. Wordle-style food guessing game.',
      url: 'https://elitetrivias.com/brainwave/foodle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Foodle',
        description: 'Daily food guessing game where players identify dishes based on 6 key attributes: cuisine, course, main ingredients, cooking method, flavor profile, and temperature.',
        gameLocation: 'https://elitetrivias.com/brainwave/foodle',
        characterAttribute: 'Food, Cuisine, Cooking, Recipes, Culinary Arts, Food Education'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Foodle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Foodle is a daily food puzzle game where you guess the target dish using 6 key attributes: cuisine, course, main ingredients, cooking method, flavor profile, and temperature. It\'s an educational game that teaches about different cuisines and cooking techniques.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Foodle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You have 6 attempts to guess the daily dish. Use the 6 attribute categories to narrow down possibilities. Each guess provides feedback on which attributes match the target dish.'
          }
        },
        {
          '@type': 'Question',
          name: 'What are the 6 attributes in Foodle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The 6 attributes are: Cuisine (Italian, Mexican, Chinese, etc.), Course (appetizer, main, dessert), Main Ingredients, Cooking Method (baked, fried, steamed, etc.), Flavor Profile (sweet, savory, spicy, etc.), and Temperature (hot, cold, room temperature).'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Foodle educational?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Foodle is designed to be both fun and educational. Players learn about different cuisines, cooking methods, ingredients, and flavor profiles while playing.'
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
    const fetchDailyFood = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyFood(currentDate);
        
        if (!data || !data.puzzle) {
          setError('No puzzle available for today');
          return;
        }
        
        setFoodData(data);

        // Update structured data with today's puzzle info
        setStructuredData(prev => ({
          ...prev,
          webpage: {
            ...prev.webpage,
            dateModified: new Date().toISOString()
          }
        }));
        
      } catch (err) {
        console.error('Error fetching daily food:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyFood();
  }, [currentDate]);

  // Show loading while waiting for client date or data
  if (isLoading || !currentDate) {
    return (
      <div className="page-with-ads">
        {/* Structured Data */}
        <Script
          id="foodle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="foodle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="foodle-faq-schema"
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
            <h1 className="text-3xl font-bold mb-2">🍽️ Foodle - Food Guessing Game</h1>
            {/* Last Updated Timestamp */}
            <time 
              dateTime={lastUpdated} 
              className="bg-orange-50 px-3 py-1 rounded-full text-xs font-medium border border-orange-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-6">Food guessing puzzle. Guess the dish in 6 tries using 6 attributes!</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s food puzzle...</p>

          {/* Hidden SEO Content */}
          <div className="sr-only" aria-hidden="false">
            <div itemScope itemType="https://schema.org/Game">
              <meta itemProp="dateModified" content={lastUpdated} />
              <h2>Foodle - Daily Food Guessing Game</h2>
              <p itemProp="description">
                Test your culinary knowledge with Foodle, a daily puzzle game where you guess dishes 
                based on 6 key culinary attributes. Educational and fun for food enthusiasts of all ages.
              </p>
              <h3>How to Play Foodle:</h3>
              <ul>
                <li>Guess the target dish in 6 attempts</li>
                <li>Use 6 attribute categories to narrow down possibilities</li>
                <li>Get feedback on cuisine, course, ingredients, cooking method, flavor, and temperature</li>
                <li>Learn about different cuisines and cooking techniques</li>
                <li>New food puzzle every day</li>
                <li>Completely free with no registration required</li>
              </ul>
              <p><strong>Game Features:</strong> Daily culinary challenges, educational food content, 
                 attribute-based guessing system, and comprehensive dish database.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !foodData) {
    return (
      <div className="page-with-ads">
        {/* Structured Data */}
        <Script
          id="foodle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="foodle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="foodle-faq-schema"
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
            <h1 className="text-3xl font-bold mb-2">🍽️ Foodle - Food Guessing Game</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-orange-50 px-3 py-1 rounded-full text-xs font-medium border border-orange-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-4">Food guessing puzzle. Guess the dish in 6 tries using 6 attributes!</p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="mb-2">No puzzle available for today.</p>
            <p className="text-sm">Please check back tomorrow or try refreshing the page!</p>
            {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors"
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
        id="foodle-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="foodle-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="foodle-faq-schema"
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

      <div className="max-w-2xl mx-auto p-4">
        {/* Header with Last Updated */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold">🍽️ Foodle</h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-orange-50 px-3 py-1 rounded-full text-xs font-medium border border-orange-200"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600">Food guessing puzzle. Guess the dish in 6 tries using 6 attributes!</p>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {foodData.puzzle && <FoodleComponent initialData={foodData as { puzzle: FoodPuzzle }} />}

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Foodle Game Information & FAQ</h2>
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
                <h3 className="font-semibold" itemProp="name">What is Foodle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Foodle is a daily food puzzle game where you guess the target dish using 6 key attributes: 
                  cuisine, course, main ingredients, cooking method, flavor profile, and temperature. It&apos;s an 
                  educational game that teaches about different cuisines and cooking techniques in a fun, interactive way.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How do I play Foodle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  You have 6 attempts to guess the daily dish. Use the 6 attribute categories to narrow down possibilities. 
                  Each guess provides feedback on which attributes match the target dish, helping you eliminate options and make educated guesses.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What are the 6 attributes in Foodle?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  The 6 attributes are: Cuisine (Italian, Mexican, Chinese, Indian, American, etc.), 
                  Course (appetizer, main course, dessert, side dish, soup, salad), Main Ingredients, 
                  Cooking Method (baked, fried, steamed, grilled, boiled, roasted), Flavor Profile 
                  (sweet, savory, spicy, sour, bitter, umami), and Temperature (hot, cold, room temperature).
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Foodle educational?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Foodle is designed to be both fun and educational. Players learn about different cuisines, 
                  cooking methods, ingredients, and flavor profiles while playing. It&apos;s great for food enthusiasts, 
                  cooking students, and anyone interested in culinary arts.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What types of dishes are included?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Foodle features a wide variety of dishes from around the world, including appetizers, main courses, 
                  desserts, and traditional specialties. The database includes both common and exotic dishes to provide 
                  diverse and interesting challenges.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is Foodle free to play?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! Foodle is completely free to play with no registration required. New food puzzles 
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
            <h2>Foodle - Daily Food Guessing Game</h2>
            <p itemProp="description">
              Test your culinary knowledge with Foodle, a daily puzzle game where you guess dishes 
              based on 6 key culinary attributes. Educational and fun for food enthusiasts of all ages. 
              Perfect for cooking lovers, culinary students, and anyone interested in learning more about world cuisines.
            </p>
            <h3>How to Play Foodle:</h3>
            <ul>
              <li>Guess the target dish in 6 attempts</li>
              <li>Use 6 attribute categories to narrow down possibilities</li>
              <li>Get feedback on cuisine, course, ingredients, cooking method, flavor, and temperature</li>
              <li>Learn about different cuisines and cooking techniques</li>
              <li>New food puzzle every day</li>
              <li>Completely free with no registration required</li>
              <li>Educational and entertaining for all ages</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily culinary challenges with diverse dishes</li>
              <li>Educational food and cooking content</li>
              <li>Six attribute categories for strategic guessing</li>
              <li>Comprehensive dish database</li>
              <li>Mobile-friendly design</li>
              <li>No time pressure - play at your own pace</li>
              <li>Learn fascinating food facts and cooking techniques</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Learn about world cuisines and culinary traditions</li>
              <li>Understand different cooking methods and techniques</li>
              <li>Explore flavor profiles and ingredient combinations</li>
              <li>Discover cultural food practices and traditions</li>
              <li>Improve deductive reasoning and problem-solving skills</li>
            </ul>
            <p><strong>Perfect for:</strong> Food enthusiasts, cooking students, culinary professionals, 
               families, educators, and anyone wanting to learn more about food in an engaging, interactive way.</p>
          </div>
        </div>
      </div>
    </div>
  );
}