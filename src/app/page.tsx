// app/page.tsx
'use client';

import { useEffect, useState, useMemo, memo, useCallback } from 'react';
import Link from 'next/link';
import { MdInfo, MdEmail } from 'react-icons/md';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Script from 'next/script';

// Optimize icon imports
const FaCheckCircleIcon = dynamic(() => import('react-icons/fa').then(mod => mod.FaCheckCircle), { 
  ssr: false,
  loading: () => <div className="inline-block w-4 h-4 bg-gray-200 animate-pulse rounded-full" />
});

// Lazy load non-critical components
const ScrollButtons = dynamic(() => import('@/components/ScrollButtons'), {
  ssr: false,
  loading: () => <div className="fixed right-4 bottom-4 w-12 h-12" />
});

// Static quiz data with optimized images
const DAILY_QUIZZES = [
  {
    category: 'general-knowledge',
    name: 'General Knowledge',
    image: '/imgs/general-knowledge-160x160.webp',
    tagline: 'Test your worldly wisdom with diverse topics',
    keywords: 'facts, trivia, knowledge quiz'
  },
    {
    category: 'today-in-history',
    name: 'Today in History',
    image: '/imgs/today-history-160x160.webp',
    tagline: 'Discover historical events from this date',
    keywords: 'historical events, on this day, history facts'
  },
  {
    category: 'entertainment',
    name: 'Entertainment',
    image: '/imgs/entertainment-160x160.webp',
    tagline: 'Movies, music & pop culture challenges',
    keywords: 'film quiz, music trivia, celebrity questions'
  },
  {
    category: 'geography',
    name: 'Geography',
    image: '/imgs/geography-160x160.webp',
    tagline: 'Explore the world without leaving home',
    keywords: 'countries, capitals, landmarks, maps'
  },
  {
    category: 'science',
    name: 'Science',
    image: '/imgs/science-160x160.webp',
    tagline: 'Discover the wonders of science',
    keywords: 'biology, physics, chemistry, space'
  },
  {
    category: 'sports',
    name: 'Sports',
    image: '/imgs/sports-160x160.webp',
    tagline: 'For the ultimate sports fanatic',
    keywords: 'football, basketball, olympics, athletes'
  }
];

const ADDITIONAL_SECTIONS = [
  {
    category: 'word-games',
    name: 'Word Games',
    image: '/imgs/word-games-160x160.webp',
    tagline: 'Challenge your vocabulary and word skills',
    keywords: 'word puzzles, anagrams, word search'
  },
  {
    category: 'number-puzzles',
    name: 'Number Puzzles',
    image: '/imgs/number-puzzles-160x160.webp',
    tagline: 'Exercise your mathematics and logic skills',
    keywords: 'math games, sudoku, number challenges'
  },
  {
    category: 'blog',
    name: 'Trivia Blog',
    image: '/imgs/blog-160x160.webp',
    tagline: 'Learn interesting facts and trivia stories',
    keywords: 'trivia articles, fun facts, knowledge'
  },
  {
    category: 'trivia-bank',
    name: 'Trivia Bank',
    image: '/imgs/tbank-160x160.webp',
    tagline: 'Access our complete collection of questions',
    keywords: 'question database, trivia archive'
  }
];

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Triviaah",
  "url": "https://triviaah.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://triviaah.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Triviaah",
  "url": "https://triviaah.com",
  "logo": "https://triviaah.com/logo-280x80.webp"
};

const quizCategorySchemas = DAILY_QUIZZES.map(quiz => ({
  "@context": "https://schema.org",
  "@type": "Quiz",
  "name": `${quiz.name} Daily Trivia`,
  "description": quiz.tagline,
  "about": quiz.keywords.split(', ').join(', '),
  "url": `https://triviaah.com/daily/${quiz.category}`
}));

export default function Home() {
  const [playedQuizzes, setPlayedQuizzes] = useState<Record<string, { played: boolean; timestamp: number }>>({});
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('playedQuizzes');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const updated: Record<string, { played: boolean; timestamp: number }> = {};
        for (const key in parsed) {
          if (typeof parsed[key] === 'boolean') {
            updated[key] = { played: parsed[key], timestamp: 0 };
          } else {
            updated[key] = parsed[key];
          }
        }
        setPlayedQuizzes(updated);
      } catch (e) {
        console.error('Error parsing playedQuizzes', e);
      }
    }
  }, []);

  const updateTimer = useCallback(() => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setTimeLeft(`${hours}h ${minutes}m`);
  }, []);

  useEffect(() => {
    updateTimer();
    // Reduce to 10 min intervals
    const interval = setInterval(updateTimer, 600000);
    return () => clearInterval(interval);
  }, [updateTimer]);

  const handleQuizPlay = useCallback((category: string) => {
    const updated = { 
      ...playedQuizzes, 
      [category]: { 
        played: true, 
        timestamp: Date.now() 
      } 
    };
    setPlayedQuizzes(updated);
    localStorage.setItem('playedQuizzes', JSON.stringify(updated));
  }, [playedQuizzes]);

  // Memoized components
  const DailyQuizCards = useMemo(() => (
    DAILY_QUIZZES.map((quiz, index) => (
      <DailyQuizCard
        key={quiz.category}
        quiz={quiz}
        playedQuizzes={playedQuizzes}
        timeLeft={timeLeft}
        onPlay={handleQuizPlay}
        priorityImage={index < 3} // Preload first 3 images
      />
    ))
  ), [playedQuizzes, timeLeft, handleQuizPlay]);

  const AdditionalSectionCards = useMemo(() => (
    ADDITIONAL_SECTIONS.map((section) => (
      <div 
        key={section.category}
        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow p-6 text-center hover:border-blue-400"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
            <Image 
              src={section.image}  // FIXED: Use section's own image
              alt={section.name}
              width={80}
              height={80}
              loading="lazy"
            />
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">{section.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{section.tagline}</p>
        <Link
          href={`/${section.category}`}
          className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          prefetch={false}
        >
          Explore
        </Link>
      </div>
    ))
  ), []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Add these Script components right after the opening div */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {quizCategorySchemas.map((schema, index) => (
        <Script
          key={`quiz-schema-${index}`}
          id={`quiz-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <header className="bg-blue-700 text-white py-4 px-4">
        <div className="container mx-auto flex items-center justify-center gap-4">
          <div className="flex items-center">
            <link rel="preconnect" href="https://triviaah.com" />
            <Image 
              src="/logo-280x80.webp"
              alt="Triviaah Logo"
              width={140}
              height={40}
              priority
              quality={80}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
            />
            <h1 className="text-2xl md:text-3xl font-bold ml-2">Explore Fun Trivia Quizzes!</h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Add loading skeletons */}
        {!timeLeft && (
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto animate-pulse"></div>
          </div>
        )}
        
        {timeLeft && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Trivia Challenges</h2>
              <p className="text-gray-600">New quizzes every 24 hours!</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {DailyQuizCards}
            </div>
            
            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-center mb-8">
              <p className="font-medium">All quizzes reset in <span className="font-bold">{timeLeft}</span></p>
            </div>
          </>
        )}

        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">More Brain Challenges</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AdditionalSectionCards}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">All Trivia Categories</h3>
            <Link href="/trivias" className="text-blue-600 hover:underline" prefetch={false}>
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Movies', 'Science', 'History', 'Geography', 'Sports', 'Music'].map((category) => (
              <Link
                key={category}
                href={`/trivias/${category.toLowerCase()}`}
                className="bg-white hover:bg-blue-50 border border-gray-200 rounded-lg p-4 text-center transition-colors"
                prefetch={false}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        <ScrollButtons />
      </main>
      
      <footer className="bg-gray-800 text-white py-6 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold">Triviaah</h3>
              <p className="text-gray-400">Daily trivia challenges</p>
            </div>
            <div className="flex gap-6">
              <Link href="/about" className="flex items-center hover:text-blue-300 transition-colors" prefetch={false}>
                <MdInfo className="mr-1" /> About
              </Link>
              <Link href="/contact" className="flex items-center hover:text-blue-300 transition-colors" prefetch={false}>
                <MdEmail className="mr-1" /> Contact Us
              </Link>
              <Link href="/privacy" className="hover:text-blue-300 transition-colors" prefetch={false}>
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

const DailyQuizCard = memo(function DailyQuizCard({ 
  quiz, 
  playedQuizzes,
  timeLeft,
  onPlay,
  priorityImage = false
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
  priorityImage?: boolean;
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
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
            <Image 
              src={quiz.image}
              alt={quiz.name}
              width={80}
              height={80}
              className="object-cover w-full h-full"
              priority={priorityImage}
              loading={priorityImage ? "eager" : "lazy"}
              quality={85}
              sizes="(max-width: 768px) 50vw, 33vw"
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
                <FaCheckCircleIcon className="mr-2 text-green-500" />
                <span>Played</span>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Resets in {timeLeft}
              </div>
            </div>
          ) : (
            <Link 
              href={quiz.category === 'today-in-history' ? '/daily/today-in-history' : `/daily/${quiz.category}`}
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
});