// app/page.tsx
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { MdInfo, MdEmail } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import OptimizedImage from '@/components/optimized/Image';

// Lazy load non-critical components
const DynamicTimer = dynamic(() => import('@/components/daily/dailyQuizTimer'), {
  loading: () => <div className="w-20 h-8 bg-gray-100 animate-pulse rounded" />,
  ssr: false
});

// Type definitions
interface QuizData {
  category: string;
  name: string;
  image: string;
  tagline: string;
  keywords: string;
}

// Memoized quiz data to prevent unnecessary re-renders
const DAILY_QUIZZES: QuizData[] = [
  {
    category: 'general-knowledge',
    name: 'General Knowledge',
    image: '/imgs/general-knowledge.webp',
    tagline: 'Test your worldly wisdom with diverse topics',
    keywords: 'facts, trivia, knowledge quiz'
  },
  {
    category: 'entertainment',
    name: 'Entertainment',
    image: '/imgs/entertainment.webp',
    tagline: 'Movies, music & pop culture challenges',
    keywords: 'film quiz, music trivia, celebrity questions'
  },
  {
    category: 'history',
    name: 'History',
    image: '/imgs/history.webp',
    tagline: 'Journey through time with historical facts',
    keywords: 'world history, past events, historical figures'
  },
  {
    category: 'geography',
    name: 'Geography',
    image: '/imgs/geography.webp',
    tagline: 'Explore the world without leaving home',
    keywords: 'countries, capitals, landmarks, maps'
  },
  {
    category: 'science',
    name: 'Science',
    image: '/imgs/science.webp',
    tagline: 'Discover the wonders of science',
    keywords: 'biology, physics, chemistry, space'
  },
  {
    category: 'sports',
    name: 'Sports',
    image: '/imgs/sports.webp',
    tagline: 'For the ultimate sports fanatic',
    keywords: 'football, basketball, olympics, athletes'
  }
];

const ADDITIONAL_SECTIONS: QuizData[] = [
  {
    category: 'word-games',
    name: 'Word Games',
    image: '/imgs/word-games.webp',
    tagline: 'Challenge your vocabulary and word skills',
    keywords: 'word puzzles, anagrams, word search'
  },
  {
    category: 'number-puzzles',
    name: 'Number Puzzles',
    image: '/imgs/number-puzzles.webp',
    tagline: 'Exercise your mathematics and logic skills',
    keywords: 'math games, sudoku, number challenges'
  },
  {
    category: 'blog',
    name: 'Trivia Blog',
    image: '/imgs/blog.webp',
    tagline: 'Learn interesting facts and trivia stories',
    keywords: 'trivia articles, fun facts, knowledge'
  },
  {
    category: 'trivia-bank',
    name: 'Trivia Bank',
    image: '/imgs/tbank.webp',
    tagline: 'Access our complete collection of questions',
    keywords: 'question database, trivia archive'
  }
];

const CATEGORY_LINKS = ['Movies', 'Science', 'History', 'Geography', 'Sports', 'Music'];

interface PlayedQuiz {
  played: boolean;
  timestamp: number;
}

type PlayedQuizzes = Record<string, PlayedQuiz>;

export default function Home() {
  const [playedQuizzes, setPlayedQuizzes] = useState<PlayedQuizzes>({});
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Optimized timer calculation
  const calculateTimeLeft = useCallback((): string => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }, []);

  // Check if quiz should be reset (memoized)
  const shouldResetQuiz = useCallback((category: string): boolean => {
    if (!playedQuizzes[category]) return true;
    
    const lastPlayed = new Date(playedQuizzes[category].timestamp);
    const now = new Date();
    
    return (
      lastPlayed.getDate() !== now.getDate() ||
      lastPlayed.getMonth() !== now.getMonth() ||
      lastPlayed.getFullYear() !== now.getFullYear()
    );
  }, [playedQuizzes]);

  // Initialize component after mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Load played quizzes from localStorage with error handling
    try {
      const stored = localStorage.getItem('playedQuizzes');
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated: PlayedQuizzes = {};
        
        for (const key in parsed) {
          if (typeof parsed[key] === 'boolean') {
            updated[key] = { played: parsed[key], timestamp: 0 };
          } else {
            updated[key] = parsed[key];
          }
        }
        setPlayedQuizzes(updated);
      }
    } catch (error) {
      console.error('Error parsing playedQuizzes:', error);
      localStorage.removeItem('playedQuizzes'); // Clear corrupted data
    }

    // Set initial timer and start interval
    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute instead of second for better performance

    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  // Handle quiz play with optimized state update
  const handleQuizPlay = useCallback((category: string) => {
    const updated = { 
      ...playedQuizzes, 
      [category]: { 
        played: true, 
        timestamp: Date.now() 
      } 
    };
    setPlayedQuizzes(updated);
    
    // Use requestIdleCallback for non-critical localStorage write
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        localStorage.setItem('playedQuizzes', JSON.stringify(updated));
      });
    } else {
      setTimeout(() => {
        localStorage.setItem('playedQuizzes', JSON.stringify(updated));
      }, 0);
    }
  }, [playedQuizzes]);

  // Early return for SSR/hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="w-full h-screen bg-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Header - Optimized for LCP */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-6 px-4 lcp-priority">
        <div className="container mx-auto flex items-center justify-center gap-4">
          <div className="flex items-center">
            <OptimizedImage 
              src="/logo.webp" 
              alt="Triviaah Logo - Daily Trivia Quiz Platform"
              width={140}
              height={140}
              priority={true}
              className="rounded-full shadow-lg"
            />
            <div className="ml-4">
              <h1 className="text-2xl md:text-3xl font-bold">
                Explore Fun Trivia Quizzes!
              </h1>
              <p className="text-blue-100 mt-1 hidden sm:block">
                20+ Categories • 10,000+ Questions • Daily Challenges
              </p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Daily Trivia Challenges
          </h2>
          <p className="text-gray-600 mb-4">
            New quizzes every 24 hours! Challenge your knowledge across multiple categories.
          </p>
          
          {/* Timer Display */}
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-center mb-6">
            <p className="font-medium">
              All quizzes reset in <span className="font-bold">{timeLeft}</span>
            </p>
          </div>
        </section>

        {/* Daily Quizzes Grid - Optimized for CLS */}
        <section className="mb-12">
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{ minHeight: '400px' }} // Prevent CLS
          >
            {DAILY_QUIZZES.map((quiz, index) => (
              <DailyQuizCard
                key={quiz.category}
                quiz={quiz}
                playedQuizzes={playedQuizzes}
                timeLeft={timeLeft}
                onPlay={handleQuizPlay}
                shouldReset={shouldResetQuiz}
                priority={index < 3} // Prioritize first 3 images
              />
            ))}
          </div>
        </section>

        {/* Additional Features Section */}
        <section className="mb-12">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
            More Brain Challenges
          </h3>
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            style={{ minHeight: '200px' }} // Prevent CLS
          >
            {ADDITIONAL_SECTIONS.map((section) => (
              <AdditionalSectionCard key={section.category} section={section} />
            ))}
          </div>
        </section>

        {/* All Trivias Preview */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              All Trivia Categories
            </h3>
            <Link 
              href="/trivias" 
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              aria-label="View all trivia categories"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {CATEGORY_LINKS.map((category) => (
              <Link
                key={category}
                href={`/trivias/${category.toLowerCase()}`}
                className="bg-white hover:bg-blue-50 border border-gray-200 rounded-lg p-4 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`Play ${category} trivia`}
              >
                <span className="font-medium">{category}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold">Triviaah</h3>
              <p className="text-gray-400">Daily trivia challenges</p>
            </div>
            <nav className="flex gap-6" aria-label="Footer navigation">
              <Link 
                href="/about" 
                className="flex items-center hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-label="About Triviaah"
              >
                <MdInfo className="mr-1" aria-hidden="true" /> About
              </Link>
              <Link 
                href="/contact" 
                className="flex items-center hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-label="Contact Triviaah"
              >
                <MdEmail className="mr-1" aria-hidden="true" /> Contact Us
              </Link>
              <Link 
                href="/privacy" 
                className="hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </Link>
            </nav>
          </div>
          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Triviaah. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Memoized Daily Quiz Card Component
const DailyQuizCard = React.memo(function DailyQuizCard({ 
  quiz, 
  playedQuizzes,
  timeLeft,
  onPlay,
  shouldReset,
  priority = false
}: {
  quiz: QuizData;
  playedQuizzes: PlayedQuizzes;
  timeLeft: string;
  onPlay: (category: string) => void;
  shouldReset: (category: string) => boolean;
  priority?: boolean;
}) {
  const wasPlayed = playedQuizzes[quiz.category]?.played || false;
  const shouldResetQuiz = shouldReset(quiz.category);
  const showAsPlayed = wasPlayed && !shouldResetQuiz;

  const handleClick = useCallback(() => {
    if (!showAsPlayed) {
      onPlay(quiz.category);
    }
  }, [showAsPlayed, onPlay, quiz.category]);

  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
            <OptimizedImage 
              src={quiz.image}
              alt={`${quiz.name} trivia category icon`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
            />
          </div>
        </div>
        
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{quiz.name}</h3>
          <p className="text-sm text-gray-600 italic mb-2">
            {quiz.tagline}
          </p>
          <p className="text-xs text-gray-400">
            Keywords: {quiz.keywords}
          </p>
        </div>
        
        <div className="mt-auto">
          {showAsPlayed ? (
            <div className="text-center">
              <div className="inline-flex items-center bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full">
                <FaCheckCircle className="mr-2 text-green-500" aria-hidden="true" />
                <span>Completed</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Resets in {timeLeft}
              </p>
            </div>
          ) : (
            <Link 
              href={`/daily/${quiz.category}`}
              onClick={handleClick}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`Play ${quiz.name} daily trivia quiz`}
            >
              Play Now
            </Link>
          )}
        </div>
      </div>
    </article>
  );
});

// Memoized Additional Section Card
const AdditionalSectionCard = React.memo(function AdditionalSectionCard({
  section
}: {
  section: QuizData;
}) {
  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow p-6 text-center hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
      <div className="flex items-center justify-center mb-4">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
          <OptimizedImage 
            src={section.image}
            alt={`${section.name} section icon`}
            width={80}
            height={80}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{section.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{section.tagline}</p>
      <Link
        href={`/${section.category}`}
        className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={`Explore ${section.name}`}
      >
        Explore
      </Link>
    </article>
  );
});