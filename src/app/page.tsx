// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdInfo, MdEmail } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';
import Image from 'next/image';
import AdInit from '@/components/AdInit';

export default function Home() {
  const [playedQuizzes, setPlayedQuizzes] = useState<Record<string, { played: boolean; timestamp: number }>>({})
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('playedQuizzes');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert old format to new format if needed
        const updated: Record<string, { played: boolean; timestamp: number }> = {};
        for (const key in parsed) {
          if (typeof parsed[key] === 'boolean') {
            updated[key] = { played: parsed[key], timestamp: 0 }; // 0 will force check
          } else {
            updated[key] = parsed[key];
          }
        }
        setPlayedQuizzes(updated);
      } catch (e) {
        console.error('Error parsing playedQuizzes', e);
      }
    }

    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleQuizPlay = (category: string) => {
    const updated = { 
      ...playedQuizzes, 
      [category]: { 
        played: true, 
        timestamp: Date.now() 
      } 
    };
    setPlayedQuizzes(updated);
    localStorage.setItem('playedQuizzes', JSON.stringify(updated));
  };

  const shouldResetQuiz = (category: string) => {
    if (!playedQuizzes[category]) return true;
    
    const lastPlayed = new Date(playedQuizzes[category].timestamp);
    const now = new Date();
    
    // Reset if last played was before today
    return (
      lastPlayed.getDate() !== now.getDate() ||
      lastPlayed.getMonth() !== now.getMonth() ||
      lastPlayed.getFullYear() !== now.getFullYear()
    );
  };

  const dailyQuizzes = [
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

  // Add these new categories to your dailyQuizzes array or create a separate section
  const additionalSections = [
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdInit /> {/* Add this near the top */}
      <header className="bg-blue-700 text-white py-4 px-4">
        <div className="container mx-auto flex items-center justify-center gap-4">
          <div className="flex items-center">
            <Image 
              src="logo.webp" 
              alt="Triviaah Logo"
              width={140}
              height={140}
            />
            <h1 className="text-2xl md:text-3xl font-bold ml-2">Explore Fun Trivia Quizzes!</h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Trivia Challenges</h2>
          <p className="text-gray-600">New quizzes every 24 hours!</p>
        </div>

        {/* Daily Quizzes Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {dailyQuizzes.map((quiz) => (
            <DailyQuizCard
              key={quiz.category}
              quiz={quiz}
              playedQuizzes={playedQuizzes}
              timeLeft={timeLeft}
              onPlay={handleQuizPlay}
            />
          ))}
        </div>
        
        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-center mb-8">
          <p className="font-medium">All quizzes reset in <span className="font-bold">{timeLeft}</span></p>
        </div>

        {/* Additional Features Section */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">More Brain Challenges</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalSections.map((section) => (
              <div 
                key={section.category}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow p-6 text-center hover:border-blue-400"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    <Image 
                      src={section.image}
                      alt={section.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{section.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{section.tagline}</p>
                <Link
                  href={`/${section.category}`}
                  className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Explore
                </Link>
              </div>
            ))}
          </div>
        </div>


        {/* All Trivias Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">All Trivia Categories</h3>
            <Link href="/trivias" className="text-blue-600 hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Movies', 'Science', 'History', 'Geography', 'Sports', 'Music'].map((category) => (
              <Link
                key={category}
                href={`/trivias/${category.toLowerCase()}`}
                className="bg-white hover:bg-blue-50 border border-gray-200 rounded-lg p-4 text-center transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Rest of your existing content (timer, about section) */}
      </main>
      <footer className="bg-gray-800 text-white py-6 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold">Triviaah</h3>
              <p className="text-gray-400">Daily trivia challenges</p>
            </div>
            <div className="flex gap-6">
              <Link href="/about" className="flex items-center hover:text-blue-300 transition-colors">
                <MdInfo className="mr-1" /> About
              </Link>
              <Link href="/contact" className="flex items-center hover:text-blue-300 transition-colors">
                <MdEmail className="mr-1" /> Contact Us
              </Link>
              <Link href="/privacy" className="hover:text-blue-300 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Triviaah. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function DailyQuizCard({ 
  quiz, 
  playedQuizzes,
  timeLeft,
  onPlay 
}: {
  quiz: {
    category: string;
    name: string;
    image: string;
    tagline: string;
    keywords: string;
  };
  playedQuizzes: Record<string, { played: boolean; timestamp: number }>;
  timeLeft: string;
  onPlay: (category: string) => void;
}) {
  const shouldResetQuiz = (category: string) => {
    if (!playedQuizzes[category]) return true;
    
    const lastPlayed = new Date(playedQuizzes[category].timestamp);
    const now = new Date();
    
    return (
      lastPlayed.getDate() !== now.getDate() ||
      lastPlayed.getMonth() !== now.getMonth() ||
      lastPlayed.getFullYear() !== now.getFullYear()
    );
  };

  const wasPlayed = playedQuizzes[quiz.category]?.played || false;
  const shouldReset = shouldResetQuiz(quiz.category);
  const showAsPlayed = wasPlayed && !shouldReset;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow hover:border-blue-400">
      <div className="p-6 flex flex-col h-full">
        {/* Image container with larger size and better styling */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
            <Image 
              src={quiz.image}
              alt={quiz.name}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{quiz.name}</h3>
          <div className="text-sm text-gray-600 italic mb-2">
            {quiz.tagline}
          </div>
          <div className="text-xs text-gray-400">
            Keywords: {quiz.keywords}
          </div>
        </div>
        
        <div className="mt-auto">
          {showAsPlayed ? (
            <div className="text-center">
              <div className="inline-flex items-center bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full">
                <FaCheckCircle className="mr-2 text-green-500" />
                <span>Played</span>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Resets in {timeLeft}
              </div>
            </div>
          ) : (
            <Link 
              href={`/daily/${quiz.category}`}
              onClick={() => onPlay(quiz.category)}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors"
            >
              Play Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}