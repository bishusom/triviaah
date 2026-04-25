'use client';
import Link from 'next/link';
import { ArrowRight, BookText, Calculator, ChevronRight, Play, Zap } from 'lucide-react';
import Footer from './Footer';
import TopScores from './TopScores';
import Ads from '@/components/common/Ads';
import DailyTriviaFact from './sections/DailyTriviaFact';
import { DAILY_QUIZZES, BRAIN_WAVES, RETRO_GAMES, WORD_GAMES, NUMBER_PUZZLES } from '@/config/homeContent';

// Types
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

const CHALLENGE_PREVIEWS = [
  { label: 'Weekly Challenge', status: 'Coming Soon', hint: 'A rotating curated set of tougher quizzes.' },
  { label: 'Monthly Challenge', status: 'Coming Soon', hint: 'A larger seasonal event with milestone rewards.' },
];

const getIconForCategory = (categoryName: string) => {
  const iconMap: Record<string, string> = {
    arts: '🎨',
    science: '🔬',
    history: '📜',
    geography: '🌍',
    movies: '🎬',
    music: '🎷',
    tv: '📺',
    sports: '⚽',
    literature: '📖',
    food: '🍔',
    business: '💵',
    'video-games': '🎮',
    animals: '🐅',
    'famous-quotes': '✏️',
  };

  return iconMap[categoryName] || '❓';
};

const getColorForCategory = (categoryName: string) => {
  const colorMap: Record<string, string> = {
    science: 'text-blue-400',
    history: 'text-cyan-400',
    geography: 'text-emerald-400',
    movies: 'text-purple-400',
    music: 'text-sky-400',
    sports: 'text-red-400',
    literature: 'text-cyan-400',
    food: 'text-blue-400',
    business: 'text-green-400',
    'video-games': 'text-fuchsia-400',
    animals: 'text-lime-400',
    'famous-quotes': 'text-pink-400',
  };

  return colorMap[categoryName] || 'text-gray-400';
};

interface GameSectionItem {
  id?: string | number;
  title?: string;
  name?: string;
  image?: string;
  image_url?: string;
  path?: string;
  tagline?: string;
}

function GameGallerySection({
  title,
  href,
  items,
  blurb,
}: {
  title: string;
  href: string;
  items: GameSectionItem[];
  blurb: string;
}) {
  return (
    <section>
      <div className="rounded-3xl border border-white/10 bg-gray-900/50 p-6 md:p-8">
        <div className="flex items-center mb-2">
          <Link href={href} className="group/title flex items-center gap-2">
            <h2 className="text-lg md:text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent group-hover/title:opacity-80 transition-opacity">
              {title}
            </h2>
            <ChevronRight className="w-5 h-5 text-cyan-500 opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all" />
            <span className="hidden md:block text-[10px] text-cyan-600 font-bold uppercase tracking-widest opacity-0 group-hover/title:opacity-100 transition-opacity ml-2">
              Explore All
            </span>
          </Link>
        </div>
        <p className="mt-2 max-w-none text-sm md:text-base text-gray-300">
          {blurb}
        </p>

        <div className="mt-6 flex gap-3 overflow-x-auto pb-2 no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
          {items.slice(0, 6).map((item, index) => {
            const label = item.title || item.name || 'Untitled';
            const img = item.image || item.image_url;
            return (
              <Link
                key={item.id ?? `${title}-${index}`}
                href={item.path || href}
                className="group h-full w-44 flex-none rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 md:w-52"
              >
                <div className="mx-auto flex h-24 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gray-800">
                  {img ? (
                    <img
                      src={img}
                      alt={label}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-800 text-xs font-bold text-gray-500">
                      No image
                    </div>
                  )}
                </div>
                <h3 className="mt-3 text-sm font-semibold leading-snug text-white">
                    {label}
                  </h3>
                {item.tagline && (
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-400">
                    {item.tagline}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 transition-colors group-hover:text-cyan-300">
                  Play
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Main export
export default function HomePageContent({ featuredTriviaCategories }: HomePageContentProps) {
  // Daily Trivia items - pull first 3 from config
  const dailyItems = DAILY_QUIZZES.slice(0, 3);
  // Daily Puzzle items - pull first 3 from config
  const brainItems = BRAIN_WAVES.slice(0, 3);
  const displayCategories = featuredTriviaCategories.map(({ key, category }) => ({
    key,
    category,
    icon: getIconForCategory(key),
    color: getColorForCategory(key),
  }));

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: '#000' }}
    >
        {/* Page body */}
      <main className="pb-16 px-4 md:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="mb-4 flex w-full justify-center">
          <Ads format="fluid" style={{ width: '100%', maxWidth: '1200px', height: '90px' }} />
        </div>

        {/* High-Density Bento Hero Hub */}
        <div className="grid w-full gap-4 mt-2 md:grid-cols-12 md:grid-rows-2 md:h-[600px]">
          
          {/* Main Hero Panel - Span 8 columns, 2 rows on desktop */}
          <section
            className="relative md:col-span-8 md:row-span-2 rounded-3xl overflow-hidden flex items-end p-6 sm:p-8 md:p-10"
            style={{
              background:
                'radial-gradient(120% 130% at 20% 15%, rgba(37,99,235,0.2) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #020617 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Premium Decorative Elements (Circles/Orbs) */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute top-[20%] left-[30%] w-24 h-24 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl pointer-events-none" />
            <div className="absolute bottom-[40%] right-[10%] w-16 h-16 rounded-full border border-white/5 bg-white/5 backdrop-blur-2xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />

            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-3 flex items-center gap-2">
                <span className="h-1 w-8 bg-blue-500 rounded-full" />
                The Brain Hub
              </p>
              <p className="text-sm md:text-lg text-gray-400 mb-2 font-medium tracking-tight">Challenge your mind</p>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.05] tracking-tighter text-white mb-6 uppercase">
                PLAY. <span className="text-blue-500">THINK.</span> WIN.
              </h1>
              <p className="text-sm md:text-lg text-gray-400 leading-relaxed mb-8 max-w-xl">
                Test your knowledge across thousands of curated questions, solve elegant logic puzzles, and compete on the global leaderboard. Fresh challenges delivered every single day.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/daily-trivias"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-600/30"
                  style={{ background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)' }}
                >
                  Play Daily Challenge
                  <Zap className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Daily Trivia Highlight - Span 4 cols, 1 row */}
          <div className="md:col-span-4 md:row-span-1">
            <MiniContentCard
              title="Daily Trivias"
              items={dailyItems.slice(0, 3)}
              ctaHref="/daily-trivias"
              accentColor="#3b82f6"
            />
          </div>

          {/* Daily Puzzle Highlight - Span 4 cols, 1 row */}
          <div className="md:col-span-4 md:row-span-1">
            <MiniContentCard
              title="Daily Puzzles"
              items={brainItems.slice(0, 3)}
              ctaHref="/brainwave"
              accentColor="#06b6d4"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          
          {/* TOP ROW: Content Cards + Top Scores */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              <ContentCard
                title="Word Games"
                icon={<BookText className="h-4 w-4 text-blue-400" />}
                items={WORD_GAMES.slice(0, 3)}
                ctaLabel="Explore All"
                ctaHref="/word-games"
                badgeText="Letter challenges"
                accentColor="#3b82f6"
                showFeaturedPill={false}
              />
              <ContentCard
                title="Number Puzzles"
                icon={<Calculator className="h-4 w-4 text-cyan-400" />}
                items={NUMBER_PUZZLES.slice(0, 3)}
                ctaLabel="Explore All"
                ctaHref="/number-puzzles"
                badgeText="Logic & math"
                accentColor="#06b6d4"
                showFeaturedPill={false}
              />
            </div>
          </div>
          <div className="lg:col-span-3">
            <TopScores />
          </div>
        </div>

        {/* Center Column: Ads + Daily Insight */}
        <div className="mt-8 space-y-8">
          <div className="w-full">
            <Ads format="fluid" style={{ width: '100%', height: '120px' }} />
          </div>
          
          <div 
            className="w-full rounded-3xl overflow-hidden"
            style={{ 
              background: 'linear-gradient(180deg, rgba(18,33,58,0.95) 0%, rgba(11,22,38,0.98) 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 18px 50px rgba(0,0,0,0.22)',
            }}
          >
            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Daily Insight</span>
            </div>
            <DailyTriviaFact />
          </div>
        </div>

        {/* Ad Break before Categories */}
        <div className="mt-12 w-full">
          <Ads format="fluid" style={{ width: '100%', height: '120px' }} />
        </div>

        {/* Featured Categories strip */}
        <section className="mt-12">
          <div 
            className="rounded-3xl p-6 md:p-8"
            style={{ 
              background: 'linear-gradient(180deg, rgba(18,33,58,0.95) 0%, rgba(11,22,38,0.98) 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 18px 50px rgba(0,0,0,0.22)',
            }}
          >
            <div className="flex items-center mb-2">
              <Link href="/trivias" className="group/title flex items-center gap-2">
                <h2 className="text-lg md:text-2xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity uppercase tracking-[0.1em]">
                  Popular Categories
                </h2>
                <ChevronRight className="w-5 h-5 text-blue-500 transition-transform group-hover/title:translate-x-1" />
              </Link>
            </div>
            
            <div className="mt-6 flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {displayCategories.slice(0, 8).map(({ key, category, icon, color }) => (
                <Link
                  key={key}
                  href={`/trivias/${key}`}
                  className="group h-full w-40 flex-none rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-center transition-all hover:bg-white/[0.06] hover:border-blue-500/30"
                >
                  <div className={`text-2xl ${color} mb-3 group-hover:scale-110 transition-transform`}>
                    {icon}
                  </div>
                  <h3 className="text-xs font-bold text-white truncate">
                    {category.displayName || category.title}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Play Now <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer (unchanged from original) */}
      <Footer />

      <style jsx global>{`
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// Mini Content Card (for Bento Hero)
function MiniContentCard({
  title,
  items,
  ctaHref,
  accentColor,
}: {
  title: string;
  items: TriviaItem[];
  ctaHref: string;
  accentColor: string;
}) {
  return (
    <div
      className="h-full flex flex-col rounded-3xl overflow-hidden border border-white/5"
      style={{ 
        background: 'linear-gradient(180deg, rgba(18,33,58,0.95) 0%, rgba(11,22,38,0.98) 100%)',
        boxShadow: '0 18px 50px rgba(0,0,0,0.22)',
      }}
    >
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-blue-400" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </h3>
        </div>
        <Link 
          href={ctaHref} 
          className="px-3 py-1 rounded-lg bg-blue-600 text-[10px] font-black text-white uppercase tracking-wider hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          View All
        </Link>
      </div>
      <div className="flex-1 divide-y divide-white/5">
        {items.map((item, i) => (
          <Link
            key={i}
            href={item.path || ctaHref}
            className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-900 border border-white/5 group-hover:border-blue-500/30 transition-colors">
              {(item.image || item.image_url) ? (
                <img
                  src={item.image || item.image_url}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600 font-bold">
                  {(item.title || item.name || '?').slice(0, 2)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-200 truncate group-hover:text-blue-400 transition-colors">
                {item.title || item.name}
              </p>
              <p className="mt-0.5 text-[10px] text-gray-500 truncate">
                Daily pick
              </p>
            </div>
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
                boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
              }}
            >
              <Play className="w-3 h-3 fill-white text-white translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Reusable content card (Trivia / Puzzles)
interface TriviaItem {
  id?: string | number;
  title?: string;
  name?: string;
  image?: string;
  image_url?: string;
  path?: string;
  tagline?: string;
}

interface ContentCardProps {
  title: string;
  icon: React.ReactNode;
  items: TriviaItem[];
  ctaLabel: string;
  ctaHref: string;
  badgeText: string;
  badgeIcon?: string;
  accentColor: string;
  showFeaturedPill?: boolean;
}

function ContentCard({
  title, icon, items, ctaLabel, ctaHref, badgeText, badgeIcon, accentColor,
  showFeaturedPill = true,
}: ContentCardProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'linear-gradient(180deg, rgba(18,33,58,0.95) 0%, rgba(11,22,38,0.98) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 18px 50px rgba(0,0,0,0.22)',
      }}
    >
      {/* Card header */}
      <div
        className="flex items-center justify-between gap-4 px-5 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              color: accentColor,
              background: 'rgba(255,255,255,0.04)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
            }}
          >
            {icon}
          </span>
          <div className="min-w-0">
            <h3 className="font-black text-sm uppercase tracking-[0.2em] bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {title}
            </h3>
            <p className="mt-1 text-[11px] text-gray-400">Curated picks designed to pull you in.</p>
          </div>
        </div>
        {showFeaturedPill ? (
          <span
            className="hidden sm:inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest"
            style={{
              color: '#ffffff',
              background: '#ef4444',
              boxShadow: 'none',
            }}
          >
            Featured
          </span>
        ) : null}
      </div>

      {/* Items */}
      <ul className="flex-1 divide-y divide-white/5">
        {items.map((item, i) => (
          <li key={item.id ?? i} className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors">
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800 ring-1 ring-white/6">
              {(item.image || item.image_url) ? (
                <img
                  src={item.image || item.image_url}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-600 font-bold">
                  {(item.title || item.name || '?').slice(0, 2)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-100 truncate">
                {item.title || item.name}
              </p>
              <p className="mt-1 text-[11px] text-gray-400 truncate">
                {item.tagline || (ctaHref === '/daily-trivias' ? 'Fresh trivia challenge.' : 'Fresh puzzle challenge.')}
              </p>
            </div>
            <Link
              href={item.path || ctaHref}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
                boxShadow: '0 8px 20px rgba(37,99,235,0.28)',
              }}
              aria-label={`Play ${item.title || item.name || 'item'}`}
              title={`Play ${item.title || item.name || 'item'}`}
            >
              <Play className="h-4 w-4 fill-white text-white translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>

      {/* Card footer */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="flex items-center gap-1.5 text-[11px] text-gray-400 font-semibold">
          {badgeIcon && <span>{badgeIcon}</span>}
          <span>{badgeText}</span>
        </span>
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white transition-all hover:scale-[1.02] active:scale-95"
          style={{
            background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)',
            boxShadow: '0 10px 24px rgba(37,99,235,0.28)',
          }}
          aria-label={ctaLabel}
          title={ctaLabel}
        >
          <span>{ctaLabel}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
