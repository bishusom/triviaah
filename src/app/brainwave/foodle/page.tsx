// src/app/foodle/page.tsx - REDESIGNED
'use client';

import FoodleComponent from '@/components/brainwave/FoodleComponent';
import { getDailyFood, FoodPuzzle } from '@/lib/brainwave/foodle/foodle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { Utensils, Target, Users, Clock, Trophy, Flame, ChefHat } from 'lucide-react';

export default function FoodlePage() {
  const [foodData, setFoodData] = useState<{puzzle: FoodPuzzle | null} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Foodle
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Food Games', 'Cooking Puzzles', 'Culinary Education']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Foodle - Daily Food Puzzle | Triviaah',
      description: 'Guess the food from its 6 attributes: cuisine, course, main ingredients, cooking method, flavor profile, and temperature. Wordle-style food guessing game.',
      url: 'https://triviaah.com/brainwave/foodle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Foodle',
        description: 'Daily food guessing game where players identify dishes based on 6 key attributes: cuisine, course, main ingredients, cooking method, flavor profile, and temperature.',
        gameLocation: 'https://triviaah.com/brainwave/foodle',
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

  // Loading State
  if (isLoading || !currentDate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-700 to-orange-900">
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
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-2xl">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                FOODLE
              </h1>
            </div>
            <p className="text-gray-200 text-lg">Daily Food Guessing Challenge</p>
          </div>

          {/* Loading Card */}
          <div className="bg-orange-800/50 backdrop-blur-lg rounded-3xl border border-orange-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-orange-400/30 border-t-orange-400 rounded-full animate-spin"></div>
                <Utensils className="w-10 h-10 text-orange-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Loading Today&apos;s Dish</h2>
            <p className="text-orange-200 mb-6">Preparing your food puzzle...</p>
            
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
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
  if (error || !foodData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 to-black text-white">
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
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-2xl">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                FOODLE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily Food Guessing Challenge</p>
          </div>

          {/* Error Card */}
          <div className="bg-orange-500/10 backdrop-blur-lg rounded-3xl border border-orange-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Challenge Unavailable</h2>
            <p className="text-orange-200 mb-6">We couldn&apos;t load today&apos;s food puzzle.</p>
            
            <div className="bg-orange-500/20 border border-orange-500/30 rounded-2xl p-4 mb-6">
              <p className="text-orange-300 text-sm">{error || 'No puzzle available for today'}</p>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
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
    <div className="min-h-screen bg-gradient-to-br from-orange-900 to-black text-white">
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
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-2xl shadow-lg">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                FOODLE
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-orange-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-orange-400 text-sm font-medium"
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
          
          <p className="text-gray-300 text-lg mb-2">Guess the dish from 6 attributes in 6 attempts</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Daily Challenge</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Global Foodies</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-orange-500" />
              <span className="text-sm">6 Attempts</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <ChefHat className="w-5 h-5 text-red-500" />
              <span className="text-sm">6 Attributes</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        {foodData.puzzle && <FoodleComponent initialData={foodData as { puzzle: FoodPuzzle }} />}

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6 relative z-10">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none p-4 hover:bg-gray-700/30 rounded-2xl transition-all duration-300">
              <h2 className="text-xl font-bold text-white">Game Guide & FAQ</h2>
              <span className="text-orange-400 group-open:rotate-180 transition-transform duration-300 text-2xl">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-6 pt-6 border-t border-gray-700">
              <div className="grid gap-4">
                {[
                  {
                    question: "What is Foodle?",
                    answer: "Foodle is a daily food puzzle game where you guess the target dish using 6 key attributes: cuisine, course, main ingredients, cooking method, flavor profile, and temperature. It's an educational game that teaches about different cuisines and cooking techniques in a fun, interactive way."
                  },
                  {
                    question: "How do I play Foodle?",
                    answer: "You have 6 attempts to guess the daily dish. Use the 6 attribute categories to narrow down possibilities. Each guess provides feedback on which attributes match the target dish, helping you eliminate options and make educated guesses."
                  },
                  {
                    question: "What are the 6 attributes in Foodle?",
                    answer: "The 6 attributes are: Cuisine (Italian, Mexican, Chinese, Indian, American, etc.), Course (appetizer, main course, dessert, side dish, soup, salad), Main Ingredients, Cooking Method (baked, fried, steamed, grilled, boiled, roasted), Flavor Profile (sweet, savory, spicy, sour, bitter, umami), and Temperature (hot, cold, room temperature)."
                  },
                  {
                    question: "Is Foodle educational?",
                    answer: "Yes! Foodle is designed to be both fun and educational. Players learn about different cuisines, cooking methods, ingredients, and flavor profiles while playing. It's great for food enthusiasts, cooking students, and anyone interested in culinary arts."
                  },
                  {
                    question: "What types of dishes are included?",
                    answer: "Foodle features a wide variety of dishes from around the world, including appetizers, main courses, desserts, and traditional specialties. The database includes both common and exotic dishes to provide diverse and interesting challenges."
                  },
                  {
                    question: "Is Foodle free to play?",
                    answer: "Yes! Foodle is completely free to play with no registration required. New food puzzles are available every day at midnight local time."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-2xl p-4">
                    <h3 className="font-semibold text-orange-400 mb-2">{faq.question}</h3>
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