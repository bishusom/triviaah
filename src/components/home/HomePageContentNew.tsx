'use client';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Play, Zap } from 'lucide-react';
import NavBar from './NavBar';
import Footer from './Footer';
import TopScores from './TopScores';
import Ads from '@/components/common/Ads';
import DailyTriviaFact from './sections/DailyTriviaFact';
import { DAILY_QUIZZES, BRAIN_WAVES, RETRO_GAMES, WORD_GAMES, NUMBER_PUZZLES } from '@/config/homeContent';

// ─── Types ────────────────────────────────────────────────────────────────────
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

function ChallengePlaceholder() {
  return (
    <div
      className="flex h-full flex-col rounded-2xl p-4 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(15,34,64,0.95) 0%, rgba(10,21,37,0.95) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <p className="text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase mb-2">
        Weekly / Monthly Challenges
      </p>
      <p className="text-sm text-gray-300 leading-relaxed mb-4">
        New challenge modes are being prepared for competitive play.
      </p>

      <div className="space-y-3">
        {CHALLENGE_PREVIEWS.map((challenge) => (
          <div
            key={challenge.label}
            className="rounded-xl border border-white/8 bg-white/5 px-4 py-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-white">{challenge.label}</p>
                <p className="text-[11px] text-gray-400 mt-1">{challenge.hint}</p>
              </div>
              <span className="shrink-0 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                {challenge.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

// ─── Main export ──────────────────────────────────────────────────────────────
export default function HomePageContent({ featuredTriviaCategories }: HomePageContentProps) {
  // Daily Trivia items — pull first 3 from config
  const dailyItems = DAILY_QUIZZES.slice(0, 3);
  // Daily Puzzle items — pull first 3 from config
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
      {/* ── NavBar (unchanged from original) ─────────────────────────────── */}
      <NavBar />

      {/* ── Page body ────────────────────────────────────────────────────── */}
      <main className="pt-20 pb-16 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <div className="mb-6 hidden md:flex w-full justify-center">
          <Ads format="fluid" style={{ width: '100%', maxWidth: '1200px', height: '90px' }} />
        </div>

        {/* ── Hero + sidebar ────────────────────────────────────────────── */}
        <div className="grid w-full gap-5 mt-4 md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] md:items-stretch md:min-h-[480px] lg:min-h-[540px]">
          {/* Hero panel */}
          <section
            className="relative w-full h-full self-stretch rounded-2xl overflow-hidden min-h-[180px] sm:min-h-[220px] md:min-h-0 flex items-end p-5 sm:p-7 md:p-8 lg:p-10"
            style={{
              background:
                'radial-gradient(120% 130% at 20% 15%, rgba(37,99,235,0.18) 0%, transparent 45%), linear-gradient(135deg, #0f2240 0%, #0d1b30 58%, #1a2e4a 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(37,99,235,0.08) 0%, transparent 70%)',
              }}
            />
            <div className="absolute left-0 top-0 h-64 w-64 pointer-events-none hidden sm:block" aria-hidden="true">
              <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />
              <div className="absolute left-24 top-18 h-16 w-16 rounded-full bg-cyan-400/10 blur-xl" />
            </div>
            <div className="absolute right-4 bottom-0 w-64 h-64 pointer-events-none hidden sm:block" aria-hidden="true">
              <div className="absolute right-6 bottom-4 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl" />
              <div className="absolute right-20 bottom-10 h-16 w-16 rounded-full bg-cyan-400/10 blur-xl" />
              <div className="absolute right-2 bottom-20 h-20 w-20 rounded-full bg-blue-400/8 blur-2xl" />
            </div>

            <div className="relative z-10 max-w-xl">
              <p className="text-[11px] font-black tracking-[0.25em] text-cyan-400/80 uppercase mb-2">
                Challenge Your Mind
              </p>
              <h1 className="max-w-2xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.02] tracking-tight text-white mb-3 sm:mb-4">
                PLAY. <span className="text-cyan-400">THINK.</span> WIN.
                <span className="mt-2 block text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-200">
                  Trivia, daily puzzles, and fresh challenges made to pull you in.
                </span>
              </h1>
              <p className="hidden sm:block max-w-xl text-sm md:text-base text-gray-300 leading-relaxed">
                Step into a sharper daily ritual with fast trivia, elegant puzzle sets, and category hubs that are easy to explore.
              </p>
              <Link
                href="/daily-trivias"
                className="inline-flex items-center gap-2 mt-4 sm:mt-6 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full font-black text-xs sm:text-sm uppercase tracking-[0.16em] text-white transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)',
                  boxShadow: '0 10px 30px rgba(37,99,235,0.32)',
                }}
              >
                Play Now
              </Link>
            </div>
          </section>

          {/* Right sidebar */}
          <aside className="hidden w-full h-full self-stretch gap-4 md:grid md:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
          <TopScores />
          <ChallengePlaceholder />
        </aside>
      </div>

        {/* ── Daily Trivia + Brain Puzzles ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <ContentCard
            title="Daily Trivias"
            icon={<Zap className="h-4 w-4" />}
            items={dailyItems}
            ctaLabel="Explore All"
            ctaHref="/daily-trivias"
            badgeText="Fresh every day"
            accentColor="#2563eb"
          />

          <ContentCard
            title="Daily Puzzles"
            icon={<Zap className="h-4 w-4" />}
            items={brainItems}
            ctaLabel="Explore All"
            ctaHref="/brainwave"
            badgeText="Fresh puzzle drops"
            badgeIcon="🧩"
            accentColor="#2563eb"
          />
        </div>

        <div className="mt-10 px-0 md:px-0">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-lg md:text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Daily Trivia Fact
            </h2>
            <span className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-[0.16em] text-cyan-400">
              Fresh insight
            </span>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/40 overflow-hidden">
            <DailyTriviaFact />
          </div>
        </div>

        <div className="mt-8 px-0 md:px-0">
          <Ads format="fluid" style={{ width: '100%', height: '120px' }} />
        </div>

        <div className="mt-10 space-y-12">
          <GameGallerySection
            title="Word Games"
            href="/word-games"
            items={[...WORD_GAMES]}
            blurb="Alphabetize your way through word puzzles, vocabulary challenges, and logic-driven games."
          />
          <GameGallerySection
            title="Number Puzzles"
            href="/number-puzzles"
            items={[...NUMBER_PUZZLES]}
            blurb="Navigate your way through number-based challenges and quick brainteasers."
          />
          <GameGallerySection
            title="Retro Games"
            href="/retro-games"
            items={[...RETRO_GAMES]}
            blurb="Blast from the past! Jump into familiar arcade-style classics games."
          />
        </div>

                {/* ── Featured Categories strip ─────────────────────────────────── */}
        <section className="mt-10">
          <div className="rounded-3xl border border-white/10 bg-gray-900/50 p-6 md:p-8">
            <div className="flex items-center mb-2">
              <Link href="/trivias" className="group/title flex items-center gap-2">
                <h2 className="text-lg md:text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent group-hover/title:opacity-80 transition-opacity">
                  Popular Trivia Categories
                </h2>
                <ChevronRight className="w-5 h-5 text-cyan-500 opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all" />
                <span className="hidden md:block text-[10px] text-cyan-600 font-bold uppercase tracking-widest opacity-0 group-hover/title:opacity-100 transition-opacity ml-2">
                  Explore All
                </span>
              </Link>
            </div>
            <p className="mt-2 max-w-none text-sm md:text-base text-gray-300">
              Jump straight into the site&apos;s main category pages to explore topic hubs, subtopics, and full quiz collections.
            </p>

            <div
              className="mt-6 flex gap-3 overflow-x-auto pb-2 no-scrollbar"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {displayCategories.slice(0, 8).map(({ key, category, icon, color }) => (
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
      </main>

      {/* ── Footer (unchanged from original) ─────────────────────────────── */}
      <Footer />

      <style jsx global>{`
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// ─── Reusable content card (Trivia / Puzzles) ─────────────────────────────────
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
}

function ContentCard({
  title, icon, items, ctaLabel, ctaHref, badgeText, badgeIcon, accentColor,
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
            <h3 className="font-black text-sm uppercase tracking-[0.2em] text-white">{title}</h3>
            <p className="mt-1 text-[11px] text-gray-400">Curated picks designed to pull you in.</p>
          </div>
        </div>
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
