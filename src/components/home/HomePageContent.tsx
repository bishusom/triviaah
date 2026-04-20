'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import NavBar from './NavBar';
import Billboard from './sections/Billboard';
import { NetflixRow } from './sections/NetflixRow';
import Footer from './Footer';
import Ads from '@/components/common/Ads';
import DailyTriviaFact from './sections/DailyTriviaFact';
import { DAILY_QUIZZES, BRAIN_WAVES, RETRO_GAMES, WORD_GAMES, NUMBER_PUZZLES, IQ_PERSONALITY_TESTS } from '@/config/homeContent';
import { GuestSessionManager } from '@/hooks/guestSession';
import { getGuestStats } from '@/lib/guestStats';
import { getPersistentGuestId } from '@/lib/guestId';

interface HomeTriviaCategory {
  title: string;
  description?: string;
  displayName?: string;
  keywords?: string[];
  ogImage?: string;
  related?: string[];
}

interface HomePageContentProps {
  featuredTriviaCategories: Array<{
    key: string;
    category: HomeTriviaCategory;
  }>;
}

interface WelcomeState {
  username: string;
  gamesPlayed: number;
  lastPlayed: string;
  recentHref?: string;
  recentTitle?: string;
}

const getIconForCategory = (categoryName: string) => {
  const iconMap: Record<string, string> = {
    science: '🔬',
    history: '📜',
    geography: '🌍',
    movies: '🎬',
    music: '🎷',
    sports: '⚽',
    literature: '📖',
    food: '🍔',
    business: '💵',
    'video-games': '🎮',
    animals: '🐾',
    'famous-quotes': '✏️',
  };

  return iconMap[categoryName] || '❓';
};

const getColorForCategory = (categoryName: string) => {
  const colorMap: Record<string, string> = {
    science: 'text-blue-400',
    history: 'text-amber-400',
    geography: 'text-emerald-400',
    movies: 'text-purple-400',
    music: 'text-yellow-400',
    sports: 'text-red-400',
    literature: 'text-cyan-400',
    food: 'text-orange-400',
    business: 'text-green-400',
    'video-games': 'text-fuchsia-400',
    animals: 'text-lime-400',
    'famous-quotes': 'text-pink-400',
  };

  return colorMap[categoryName] || 'text-gray-400';
};

export default function HomePageContent({ featuredTriviaCategories }: HomePageContentProps) {
  const [welcomeState, setWelcomeState] = useState<WelcomeState | null>(null);

  useEffect(() => {
    const session = new GuestSessionManager().getSession();
    const stats = getGuestStats();
    const guestAlias = getPersistentGuestId();

    if (!stats.gamesPlayed && !stats.lastPlayed && stats.recentQuizzes.length === 0) {
      return;
    }

    const recentQuiz = stats.recentQuizzes[0];
    const sessionName = session.username || '';
    const preferredName =
      sessionName && !/^Guest[a-z0-9]+$/i.test(sessionName)
        ? sessionName
        : guestAlias;

    setWelcomeState({
      username: preferredName || 'there',
      gamesPlayed: stats.gamesPlayed || 0,
      lastPlayed: stats.lastPlayed || '',
      recentHref: recentQuiz?.href,
      recentTitle: recentQuiz?.title,
    });
  }, []);

  const displayCategories = featuredTriviaCategories.map(({ key, category }) => ({
    key,
    category,
    icon: getIconForCategory(key),
    color: getColorForCategory(key),
  }));

  return (
    <div className="bg-[#141414] min-h-screen text-white overflow-x-hidden">
      <NavBar />
      
      <main className="flex flex-col pt-24 md:pt-28">
        <h1 className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden whitespace-nowrap">
          Free Daily Trivia, Word Games, Retro Games, and Brain Puzzles
        </h1>

        {/* Top Ad Slot */}
        <div className="w-full pt-8 md:pt-10 pb-4 bg-black/20 flex justify-center">
          <Ads format="fluid" style={{ width: '100%', maxWidth: '1200px', height: '90px' }} />
        </div>

        <Billboard />

        {/* FIX: Changed -mt-48 to -mt-24 to prevent overlap with Billboard text/buttons.
            Added pt-10 to give the first row some breathing room.
        */}
        <div className="relative z-20 -mt-24 md:-mt-32 pt-10 space-y-12 pb-24 bg-gradient-to-t from-[#141414] via-[#141414]/95 to-transparent">
          {welcomeState ? (
            <section className="px-4 md:px-12">
              <div className="rounded-3xl border border-cyan-500/20 bg-[linear-gradient(135deg,rgba(14,31,52,0.95),rgba(9,19,33,0.92))] p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      Welcome Back
                    </div>
                    <h2 className="mt-3 text-2xl md:text-3xl font-black tracking-tight text-white">
                      Welcome back, {welcomeState.username}
                    </h2>
                    <p className="mt-2 text-sm md:text-base text-gray-300">
                      {welcomeState.gamesPlayed > 0
                        ? `You’ve played ${welcomeState.gamesPlayed} game${welcomeState.gamesPlayed === 1 ? '' : 's'} so far`
                        : 'Ready for another round?'}
                      {welcomeState.lastPlayed
                        ? ` • Last played ${new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(new Date(welcomeState.lastPlayed))}`
                        : ''}
                    </p>
                  </div>

                  {welcomeState.recentHref && welcomeState.recentTitle ? (
                    <Link
                      href={welcomeState.recentHref}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-900/30 transition-transform hover:scale-[1.02]"
                    >
                      Continue {welcomeState.recentTitle}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}
          
          <NetflixRow title="Daily Quizzes - Updated 24 hours" items={DAILY_QUIZZES} sectionHref="/daily-trivias" />

          <NetflixRow title="Brain Waves - Daily Puzzles" items={BRAIN_WAVES} sectionHref="/brainwave" />

          <div className="px-4 md:px-12">
            <Ads format="fluid" style={{ width: '100%', height: '120px' }} />
          </div>

          {/* DAILY TRIVIA FACT: 
              Now styled to match the page width and mobile padding 
          */}
          <section className="px-4 md:px-12">
            <h2 className="text-gray-300 text-md md:text-xl font-bold mb-4 ml-4 md:ml-4">
              Did You Know?
            </h2>
            <div className="bg-gray-900/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
              <DailyTriviaFact />
            </div>
          </section>

          <section className="px-4 md:px-12">
            <div className="rounded-3xl border border-white/10 bg-gray-900/50 p-6 md:p-8">
              <div className="flex items-center mb-2">
                <Link
                  href="/trivias"
                  className="group/title flex items-center gap-2"
                >
                  <h2 className="text-lg md:text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent group-hover/title:opacity-80 transition-opacity">
                    Popular Trivia Categories
                  </h2>
                  <ChevronRight className="w-5 h-5 text-cyan-500 opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all" />
                  <span className="hidden md:block text-[10px] text-cyan-600 font-bold uppercase tracking-widest opacity-0 group-hover/title:opacity-100 transition-opacity ml-2">
                    Explore All
                  </span>
                </Link>
              </div>
              <p className="mt-2 max-w-2xl text-sm md:text-base text-gray-300">
                Jump straight into the site&apos;s main category pages to explore topic hubs, subtopics, and full quiz collections.
              </p>

              <div
                className="mt-6 flex gap-3 overflow-x-auto pb-2 no-scrollbar"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {displayCategories.map(({ key, category, icon, color }) => (
                  <Link
                    key={key}
                    href={`/trivias/${key}`}
                    className="group h-full w-44 flex-none rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 md:w-52"
                  >
                    <div className={`text-3xl ${color} transition-transform duration-300 group-hover:scale-110`}>
                      {icon}
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-white">
                      {category.displayName || category.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-400">
                      {category.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 transition-colors group-hover:text-cyan-300">
                      Explore
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <NetflixRow title="Retro Classics" items={RETRO_GAMES} sectionHref="/retro-games" />

          <NetflixRow title="Word Games" items={WORD_GAMES} sectionHref="/word-games" />

          <NetflixRow title="Number Puzzles" items={NUMBER_PUZZLES} sectionHref="/number-puzzles" />

          <NetflixRow title="IQ & Personality Tests" items={IQ_PERSONALITY_TESTS} sectionHref="/iq-and-personality-tests" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
