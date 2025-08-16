// app/page.tsx
'use client';

import { useEffect, useState, useMemo, memo, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { MdInfo, MdEmail } from 'react-icons/md';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// --------------------------
// 1. Lazy-load non-critical UI
// --------------------------
const FaCheckCircleIcon = dynamic(
  () => import('react-icons/fa').then((mod) => mod.FaCheckCircle),
  {
    ssr: false,
    loading: () => (
      <div className="inline-block w-4 h-4 bg-gray-200 animate-pulse rounded-full" />
    ),
  }
);

const ScrollButtons = dynamic(() => import('@/components/ScrollButtons'), {
  ssr: false,
  loading: () => <div className="fixed right-4 bottom-4 w-12 h-12" />,
});

// --------------------------
// 2. Static data
// --------------------------
const DAILY_QUIZZES = [
  {
    category: 'general-knowledge',
    name: 'General Knowledge',
    image: '/imgs/general-knowledge-160x160.webp',
    tagline: 'Test your worldly wisdom with diverse topics',
    keywords: 'facts, trivia, knowledge quiz',
  },
  {
    category: 'today-in-history',
    name: 'Today in History',
    image: '/imgs/today-history-160x160.webp',
    tagline: 'Discover historical events from this date',
    keywords: 'historical events, on this day, history facts',
  },
  {
    category: 'entertainment',
    name: 'Entertainment',
    image: '/imgs/entertainment-160x160.webp',
    tagline: 'Movies, music & pop culture challenges',
    keywords: 'film quiz, music trivia, celebrity questions',
  },
  {
    category: 'geography',
    name: 'Geography',
    image: '/imgs/geography-160x160.webp',
    tagline: 'Explore the world without leaving home',
    keywords: 'countries, capitals, landmarks, maps',
  },
  {
    category: 'science',
    name: 'Science',
    image: '/imgs/science-160x160.webp',
    tagline: 'Discover the wonders of science',
    keywords: 'biology, physics, chemistry, space',
  },
  {
    category: 'sports',
    name: 'Sports',
    image: '/imgs/sports-160x160.webp',
    tagline: 'For the ultimate sports fanatic',
    keywords: 'football, basketball, olympics, athletes',
  },
] as const;

const ADDITIONAL_SECTIONS = [
  {
    category: 'word-games',
    name: 'Word Games',
    image: '/imgs/word-games-160x160.webp',
    tagline: 'Challenge your vocabulary and word skills',
    keywords: 'word puzzles, anagrams, word search',
  },
  {
    category: 'number-puzzles',
    name: 'Number Puzzles',
    image: '/imgs/number-puzzles-160x160.webp',
    tagline: 'Exercise your mathematics and logic skills',
    keywords: 'math games, sudoku, number challenges',
  },
  {
    category: 'blog',
    name: 'Trivia Blog',
    image: '/imgs/blog-160x160.webp',
    tagline: 'Learn interesting facts and trivia stories',
    keywords: 'trivia articles, fun facts, knowledge',
  },
  {
    category: 'trivia-bank',
    name: 'Trivia Bank',
    image: '/imgs/tbank-160x160.webp',
    tagline: 'Access our complete collection of questions',
    keywords: 'question database, trivia archive',
  },
] as const;

// --------------------------
// 3. Home component
// --------------------------
export default function Home() {
  const [playedQuizzes, setPlayedQuizzes] = useState<
    Record<string, { played: boolean; timestamp: number }>
  >({});

  const [timeLeft, setTimeLeft] = useState('');

  // --------------------------
  // 4. Load “played” state
  // --------------------------
  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem('playedQuizzes');
        if (!raw) return;
        const parsed = JSON.parse(raw);
        const next: Record<string, { played: boolean; timestamp: number }> = {};
        for (const k in parsed) {
          next[k] =
            typeof parsed[k] === 'boolean'
              ? { played: parsed[k], timestamp: 0 }
              : parsed[k];
        }
        setPlayedQuizzes(next);
      } catch {
        /* ignore malformed data */
      }
    };
    const t = setTimeout(load, 50);
    return () => clearTimeout(t);
  }, []);

  // --------------------------
  // 5. Countdown timer
  // --------------------------
  const updateTimer = useCallback(() => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setTimeLeft(`${h}h ${m}m`);
  }, []);

  useEffect(() => {
    updateTimer();
    const i = setInterval(updateTimer, 60_000);
    return () => clearInterval(i);
  }, [updateTimer]);

  // --------------------------
  // 6. Persist “played”
  // --------------------------
  const handleQuizPlay = useCallback(
    (category: string) => {
      const next = {
        ...playedQuizzes,
        [category]: { played: true, timestamp: Date.now() },
      };
      setPlayedQuizzes(next);
      localStorage.setItem('playedQuizzes', JSON.stringify(next));
    },
    [playedQuizzes]
  );

  // --------------------------
  // 7. Memoised card grids
  // --------------------------
  const dailyQuizCards = useMemo(
    () =>
      DAILY_QUIZZES.map((quiz, idx) => (
        <DailyQuizCard
          key={quiz.category}
          quiz={quiz}
          playedQuizzes={playedQuizzes}
          timeLeft={timeLeft}
          onPlay={handleQuizPlay}
          priorityImage={idx < 3}
        />
      )),
    [playedQuizzes, timeLeft, handleQuizPlay]
  );

  const additionalSectionCards = useMemo(
    () =>
      ADDITIONAL_SECTIONS.map((s) => (
        <div
          key={s.category}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow p-6 text-center hover:border-blue-400"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              <Image
                src={s.image}
                alt={s.name}
                width={80}
                height={80}
                loading="lazy"
              />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">{s.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{s.tagline}</p>
          <Link
            href={`/${s.category}`}
            className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
            prefetch={false}
          >
            Explore
          </Link>
        </div>
      )),
    []
  );

  // --------------------------
  // 8. Render
  // --------------------------
  return (
    <>
      <Head>
        {/* Preload hero + first 3 quiz images */}
        <link
          rel="preload"
          href="/logo-280x80.webp"
          as="image"
          type="image/webp"
        />
        {DAILY_QUIZZES.slice(0, 3).map((q) => (
          <link
            key={q.image}
            rel="preload"
            href={q.image}
            as="image"
            type="image/webp"
          />
        ))}
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-blue-700 text-white py-4 px-4">
          <div className="container mx-auto flex items-center justify-center gap-4">
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
            <h1 className="text-2xl md:text-3xl font-bold ml-2">
              Explore Fun Trivia Quizzes!
            </h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 flex-grow">
          {!timeLeft && (
            <div className="text-center mb-8">
              <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto animate-pulse"></div>
            </div>
          )}

          {timeLeft && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Daily Trivia Challenges
                </h2>
                <p className="text-gray-600">New quizzes every 24 hours!</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {dailyQuizCards}
              </div>

              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-center mb-8">
                <p className="font-medium">
                  All quizzes reset in{' '}
                  <span className="font-bold">{timeLeft}</span>
                </p>
              </div>
            </>
          )}

          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              More Brain Challenges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalSectionCards}
            </div>
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                All Trivia Categories
              </h3>
              <Link href="/trivias" className="text-blue-600 hover:underline" prefetch={false}>
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['Movies', 'Science', 'History', 'Geography', 'Sports', 'Music'].map(
                (c) => (
                  <Link
                    key={c}
                    href={`/trivias/${c.toLowerCase()}`}
                    className="bg-white hover:bg-blue-50 border border-gray-200 rounded-lg p-4 text-center transition-colors"
                    prefetch={false}
                  >
                    {c}
                  </Link>
                )
              )}
            </div>
          </div>

          <ScrollButtons />
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-bold">Triviaah</h3>
                <p className="text-gray-400">Daily trivia challenges</p>
              </div>
              <div className="flex gap-6">
                <Link href="/about" className="flex items-center hover:text-blue-300" prefetch={false}>
                  <MdInfo className="mr-1" /> About
                </Link>
                <Link href="/contact" className="flex items-center hover:text-blue-300" prefetch={false}>
                  <MdEmail className="mr-1" /> Contact Us
                </Link>
                <Link href="/privacy" className="hover:text-blue-300" prefetch={false}>
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
    </>
  );
}

// --------------------------
// 9. DailyQuizCard (memoised)
// --------------------------
const DailyQuizCard = memo(function DailyQuizCard({
  quiz,
  playedQuizzes,
  timeLeft,
  onPlay,
  priorityImage = false,
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
  const [isPlayed, setIsPlayed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const check = () => {
      if (!playedQuizzes[quiz.category]) {
        setIsPlayed(false);
        setIsChecking(false);
        return;
      }
      const last = new Date(playedQuizzes[quiz.category].timestamp);
      const now = new Date();
      const reset =
        last.getDate() !== now.getDate() ||
        last.getMonth() !== now.getMonth() ||
        last.getFullYear() !== now.getFullYear();
      setIsPlayed(playedQuizzes[quiz.category].played && !reset);
      setIsChecking(false);
    };
    const t = setTimeout(check, 50);
    return () => clearTimeout(t);
  }, [playedQuizzes, quiz.category]);

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
              loading={priorityImage ? 'eager' : 'lazy'}
              quality={85}
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </div>
        </div>

        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{quiz.name}</h3>
          <div className="text-sm text-gray-600 italic mb-2">{quiz.tagline}</div>
          {/* 🔧 Colour-contrast fix: 400 → 600 */}
          <div className="text-xs text-gray-600">Keywords: {quiz.keywords}</div>
        </div>

        <div className="mt-auto">
          {isChecking ? (
            <Link
              href={
                quiz.category === 'today-in-history'
                  ? '/daily/today-in-history'
                  : `/daily/${quiz.category}`
              }
              onClick={() => onPlay(quiz.category)}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors"
            >
              Play Now
            </Link>
          ) : isPlayed ? (
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
              href={
                quiz.category === 'today-in-history'
                  ? '/daily/today-in-history'
                  : `/daily/${quiz.category}`
              }
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