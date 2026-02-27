// app/citadle/page.tsx
'use client';

import { Suspense, useState, useEffect } from 'react';
import MuteButton from '@/components/common/MuteButton';
import CitadleComponent from '@/components/brainwave/CitadleComponent';
import { getDailyCityPuzzle, CityPuzzle } from '@/lib/brainwave/citadle/citadle-sb';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { Building, Target, Users, Clock, Trophy, Map, Globe, Compass } from 'lucide-react';

function CitadleContent() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const [dailyData, setDailyData] = useState<{ puzzle: CityPuzzle | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [currentDate] = useState(new Date());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  // Structured data for Citadle
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
      knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment', 'Geography Games', 'Cities', 'Landmarks']
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Citadle - Daily City Guessing Game | Triviaah',
      description: 'Guess the world city in 6 tries! Daily geography puzzle game with landmarks, skylines, and urban hints.',
      url: 'https://triviaah.com/brainwave/citadle',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Citadle',
        description: 'Daily city guessing game where players have 6 attempts to guess the target city using landmarks, skylines, and geographical clues.',
        gameLocation: 'https://triviaah.com/brainwave/citadle',
        characterAttribute: 'Geography, Cities, Landmarks, Skylines, Urban Knowledge'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Citadle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Citadle is a daily geography puzzle game where you guess the target city in 6 attempts. It uses landmarks, city skylines, geographical coordinates, and statistical comparisons to help you narrow down your guesses.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I play Citadle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You have 6 attempts to guess the daily city. After each guess, you\'ll get progressive hints including country, landmark (initially blurred), city skyline, coordinates, and statistical comparisons. The game updates daily with a new city.'
          }
        },
        {
          '@type': 'Question',
          name: 'What hints are provided in Citadle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Hints include: 1) Country, 2) City skyline/silhouette, 3) Landmark (becomes clearer with wrong guesses), 4) Distance and direction from your guess, 5) Statistical comparisons (population, elevation, timezone), and 6) Famous features or nicknames.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Citadle free to play?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Citadle is completely free to play with no registration required. New puzzles are available every day at midnight.'
          }
        },
        {
          '@type': 'Question',
          name: 'How many cities are included?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Citadle includes major world cities from all continents, focusing on cities that most people would recognize. The game features a mix of capitals, famous metropolitan areas, and historically significant cities.'
          }
        }
      ]
    }
  });

  // Parse date parameter
  useEffect(() => {
    let date = currentDate;
    if (dateParam) {
      const parsed = new Date(dateParam + 'T00:00:00');
      if (!isNaN(parsed.getTime()) && parsed <= currentDate) {
        date = parsed;
      }
    }
    setTargetDate(date);
    setLastUpdated(new Date().toISOString());
  }, [dateParam, currentDate]);
  
  // Fetch puzzle for the target date
  useEffect(() => {
    if (!targetDate) return;

    const fetchPuzzle = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getDailyCityPuzzle(targetDate);
        if (!data) {
          setError('No puzzle available for this date');
          return;
        }

        setDailyData({ puzzle: data });

        // Update structured data with today's puzzle info
        setStructuredData(prev => ({
          ...prev,
          webpage: {
            ...prev.webpage,
            dateModified: new Date().toISOString()
          }
        }));
      } catch (err) {
        console.error('Error fetching daily citadle:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPuzzle();
  }, [targetDate]);

  // Loading State
  if (isLoading || !currentDate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
        {/* Structured Data */}
        <Script
          id="citadle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="citadle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="citadle-faq-schema"
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
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-2xl">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                CITADLE
              </h1>
            </div>
            <p className="text-gray-200 text-lg">Daily City Guessing Challenge</p>
          </div>

          {/* Loading Card */}
          <div className="bg-blue-800/50 backdrop-blur-lg rounded-3xl border border-blue-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                <Globe className="w-10 h-10 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Loading Citadle Puzzle</h2>
            <p className="text-blue-200 mb-6">Mapping your urban geography puzzle...</p>
            
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
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
  if (error || !dailyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white">
        {/* Structured Data */}
        <Script
          id="citadle-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
        />
        <Script
          id="citadle-webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
        />
        <Script
          id="citadle-faq-schema"
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
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-2xl">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                CITADLE
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Daily City Guessing Challenge</p>
          </div>

          {/* Error Card */}
          <div className="bg-blue-500/10 backdrop-blur-lg rounded-3xl border border-blue-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Challenge Unavailable</h2>
            <p className="text-blue-200 mb-6">We couldn&apos;t load today&apos;s city puzzle.</p>
            
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4 mb-6">
              <p className="text-blue-300 text-sm">{error || 'No puzzle available for today'}</p>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white">
      {/* Structured Data */}
      <Script
        id="citadle-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <Script
        id="citadle-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }}
      />
      <Script
        id="citadle-faq-schema"
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
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-2xl shadow-lg">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                CITADLE
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-blue-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-blue-400 text-sm font-medium"
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
          
          <p className="text-gray-300 text-lg mb-2">Guess the city from landmarks, skylines, and progressive hints in 6 attempts</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Daily Challenge</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Global Geographers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-red-500" />
              <span className="text-sm">6 Attempts</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Map className="w-5 h-5 text-green-500" />
              <span className="text-sm">Landmark Recognition</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Compass className="w-5 h-5 text-orange-500" />
              <span className="text-sm">Geographic Clues</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        {dailyData.puzzle && <CitadleComponent initialData={dailyData.puzzle} />}

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6 relative z-10">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none p-4 hover:bg-gray-700/30 rounded-2xl transition-all duration-300">
              <h2 className="text-xl font-bold text-white">Game Guide & FAQ</h2>
              <span className="text-blue-400 group-open:rotate-180 transition-transform duration-300 text-2xl">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-6 pt-6 border-t border-gray-700">
              <div className="grid gap-4">
                {[
                  {
                    question: "What is Citadle?",
                    answer: "Citadle is a daily geography puzzle game where you guess the target city in 6 attempts. It uses progressive hints including blurred landmarks, city skylines, geographical coordinates, and statistical comparisons to help you identify the city. It's an educational game that teaches about world geography and urban landmarks."
                  },
                  {
                    question: "How do I play Citadle?",
                    answer: "You have 6 attempts to guess the daily city. After each guess, you'll receive progressive hints: starting with country and continent, then a blurred landmark that becomes clearer with each wrong guess, followed by city skylines, geographical coordinates, statistical comparisons (population, elevation, timezone), and finally distance/direction from your guesses to the target city."
                  },
                  {
                    question: "What types of clues are provided?",
                    answer: "Clues are revealed progressively: 1) Country and continent, 2) Blurred landmark image (clears 15% per attempt), 3) City skyline silhouette, 4) Geographic coordinates, 5) Statistical comparisons (population, elevation, timezone differences), 6) Distance and direction from your guesses to the target city, 7) Cultural hints and famous city features."
                  },
                  {
                    question: "How does the landmark reveal work?",
                    answer: "The landmark image starts heavily blurred and becomes clearer with each wrong guess. Each incorrect attempt reveals 15% more of the image (up to 75% after 5 attempts). When you win or lose, the full landmark is revealed to show you the complete iconic structure."
                  },
                  {
                    question: "Is Citadle educational?",
                    answer: "Yes! Citadle is designed to be both fun and educational. Players learn about world geography, recognize famous landmarks, understand city skylines, learn about population distributions, and improve their knowledge of global urban centers and their cultural significance."
                  },
                  {
                    question: "Is Citadle free to play?",
                    answer: "Yes! Citadle is completely free to play with no registration required. New city puzzles are available every day at midnight local time. We support the game through optional non-intrusive advertisements."
                  },
                  {
                    question: "What types of cities are included?",
                    answer: "The game features major world cities from all continents including capitals, famous metropolitan areas, historical cities, and culturally significant urban centers. Cities range from well-known global hubs to interesting regional capitals that represent diverse geography and cultures."
                  },
                  {
                    question: "What makes Citadle different from other geography games?",
                    answer: "Citadle combines multiple learning approaches: landmark recognition training, skyline identification, geographical coordinate understanding, statistical data interpretation, and cultural geography. The progressive hint system with distance/direction feedback makes it particularly educational for developing spatial awareness and geographical reasoning."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-2xl p-4">
                    <h3 className="font-semibold text-blue-400 mb-2">{faq.question}</h3>
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
            <h2>Citadle - Daily City Guessing Game</h2>
            <p itemProp="description">
              Test your urban geography knowledge with Citadle, a daily puzzle game where you guess cities 
              using multiple clues and progressive hints. Perfect for geography enthusiasts, students, travelers, 
              and anyone wanting to improve their city identification and landmark recognition skills in a fun, interactive way.
            </p>
            <h3>How to Play Citadle:</h3>
            <ul>
              <li>Guess the target city in 6 attempts</li>
              <li>Watch blurred landmarks reveal more details with each wrong guess</li>
              <li>Get progressive clues across 7 categories: country, landmarks, skylines, coordinates, statistics, distance/direction, and cultural hints</li>
              <li>Use distance and direction feedback to triangulate the target city</li>
              <li>Compare population, elevation, and timezone data</li>
              <li>Identify cities by their iconic skylines and landmarks</li>
              <li>New city puzzle every day</li>
              <li>Completely free with no registration required</li>
              <li>Educational and fun for all ages and skill levels</li>
            </ul>
            <h3>Game Features:</h3>
            <ul>
              <li>Daily geography challenges with 100+ major world cities</li>
              <li>Progressive landmark reveal system (blurred to clear)</li>
              <li>City skyline/silhouette identification training</li>
              <li>Geographical coordinate system with distance and direction calculations</li>
              <li>Statistical comparisons (population, elevation, timezone differences)</li>
              <li>Cultural and historical hints about cities</li>
              <li>Mobile-friendly dark mode design</li>
              <li>No time pressure - play at your own pace</li>
              <li>Educational content about world geography and urban studies</li>
              <li>Image gallery with zoom functionality for landmarks</li>
            </ul>
            <h3>Educational Benefits:</h3>
            <ul>
              <li>Improve geographical knowledge and spatial awareness</li>
              <li>Learn to recognize famous landmarks and city skylines</li>
              <li>Understand geographic coordinates and distance calculations</li>
              <li>Develop statistical interpretation skills with real city data</li>
              <li>Learn about cultural and historical significance of world cities</li>
              <li>Enhance deductive reasoning and problem-solving abilities</li>
              <li>Build mental maps of world geography and urban distributions</li>
            </ul>
            <p><strong>Perfect for:</strong> Geography students, teachers, travelers, architecture enthusiasts, 
               urban planners, map lovers, trivia enthusiasts, families, and anyone interested in 
               learning more about world cities, their landmarks, and their unique characteristics.</p>
            <p><strong>Skill Development:</strong> Citadle helps improve geographical literacy, landmark 
               recognition, urban landscape reading skills, statistical awareness, spatial reasoning, 
               and cultural understanding of different cities around the world.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CitadlePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    }>
      <CitadleContent />
    </Suspense>
  );
}