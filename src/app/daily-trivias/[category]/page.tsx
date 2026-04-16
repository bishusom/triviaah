// src/app/daily-trivias/[category]/page.tsx

import { getDailyQuizQuestions, getRandomQuestions, getTodaysHistoryQuestions, type Question } from '@/lib/supabase';
import QuizGame from '@/components/trivias/QuizGame';
import { notFound } from 'next/navigation';
import { StructuredData } from './structured-data';
import { WithTimezone } from '@/components/common/WithTimezone';
import { TimezoneInfo } from '@/components/common/TimezoneInfo';
import { FAQSection } from './FAQSection';
import type { UserLocationInfo } from '@/types/location';
import { Play } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

// ─── Static category config ───────────────────────────────────────────────────
// Single source of truth used by both generateMetadata() and the page component.
// Previously this config lived in two places (layout.tsx and page.tsx) with
// slightly different values — a maintenance hazard.

const CATEGORY_CONFIG: Record<string, {
  name: string;
  subject: string;
  description: string;
  longDescription: string; // New field
  learningPoints: string[]; // New field
  keywords: string;
  color: string;
  icon: string;
  triviaSlugs?: string[];
}> = {
  'quick-fire': {
    name: 'Quick Fire',
    subject: 'rapid-fire general knowledge',
    description: 'Race the clock with our Quick Fire daily trivia — 6 questions, 15 seconds each. New challenge every 24 hours.',
    longDescription: 'The Quick Fire challenge is designed for those who think fast under pressure. Featuring a rotating mix of science, history, and pop culture, this high-intensity quiz forces you to rely on your gut instinct. With only 15 seconds per question, it is the ultimate test of cognitive recall and rapid decision-making.',
    learningPoints: [
      "Improve cognitive recall speed and mental agility.",
      "Identify core facts across a diverse range of general knowledge topics.",
      "Master the art of performing accurately under strict time constraints."
    ],
    keywords: 'rapid fire trivia, quick fire trivia, quick trivia quiz, daily trivia',
    color: 'from-orange-500 to-red-500',
    icon: '⚡',
  },
  'general-knowledge': {
    name: 'General Knowledge',
    subject: 'general knowledge',
    description: 'Test your worldly wisdom with 10 free daily general knowledge trivia questions. Refreshed every day.',
    longDescription: 'Our General Knowledge daily quiz is a curated journey through the most interesting facts on Earth. We cover everything from obscure historical milestones to the latest scientific breakthroughs. This quiz is perfect for lifelong learners who want to broaden their intellectual horizons and stay sharp on a global scale.',
    learningPoints: [
      "Broaden your understanding of global history and current events.",
      "Connect disparate facts between science, culture, and geography.",
      "Build a versatile knowledge base for social and professional settings."
    ],
    keywords: 'general knowledge quiz, daily trivia facts, world trivia questions',
    color: 'from-blue-500 to-cyan-500',
    icon: '🌎',
  },
  'today-in-history': {
    name: 'Today in History',
    subject: 'historical events from today\'s date',
    description: 'Discover what happened on this day in history — free daily trivia with 10 questions on famous birthdays and milestones.',
    longDescription: 'Every day is an anniversary of something monumental. This daily history quiz dives into the archives to bring you the battles, discoveries, and births that happened on this exact calendar date. It is a unique way to contextualize the modern world by understanding the specific events that shaped it over centuries.',
    learningPoints: [
      "Identify pivotal historical milestones that occurred on today's date.",
      "Understand the chronological connection between past and present.",
      "Learn about influential figures and their contributions to global history."
    ],
    keywords: 'historical trivia quiz, on this day trivia, history facts game',
    color: 'from-amber-500 to-orange-500',
    icon: '📅',
    triviaSlugs: ['history', 'famous-quotes', 'inventions-everyday-objects'],
  },
  'entertainment': {
    name: 'Entertainment',
    subject: 'movies, music, and pop culture',
    description: 'Daily entertainment trivia — movies, music, TV shows, and celebrity questions. 10 free questions refreshed every 24 hours.',
    longDescription: 'Stay updated with the world of glitz and glamour. Our entertainment daily quiz tracks the evolution of cinema, the biggest hits on the music charts, and the legends of the small screen. From Hollywood’s Golden Age to the latest viral streaming sensations, we test your grasp of the arts and media.',
    learningPoints: [
      "Track the evolution of film, television, and musical trends.",
      "Identify award-winning performances and iconic pop culture moments.",
      "Understand the impact of media on modern society and fashion."
    ],
    keywords: 'pop culture trivia quiz, movie trivia game, celebrity quiz',
    color: 'from-purple-500 to-pink-500',
    icon: '🎬',
    triviaSlugs: ['movies', 'music', 'tv-shows', 'celebrities'],
  },
  'geography': {
    name: 'Geography',
    subject: 'world geography, capitals, and landmarks',
    description: 'Free daily geography trivia — countries, capitals, flags, and world landmarks. 10 fresh questions every day.',
    longDescription: 'Explore the world without leaving your home. Our daily geography challenge goes beyond simple capitals to explore tectonic shifts, climatic zones, and cultural landmarks. It is designed to help you visualize the planet and understand the physical and political borders that define our global community.',
    learningPoints: [
      "Master the locations of countries, capitals, and major landmarks.",
      "Identify the physical features and biomes of different continents.",
      "Understand the demographic and political shifts in global geography."
    ],
    keywords: 'geography trivia quiz, world capitals game, countries trivia',
    color: 'from-green-500 to-emerald-500',
    icon: '🗺️',
    triviaSlugs: ['geography']
  },
  'science': {
    name: 'Science & Nature',
    subject: 'science and nature',
    description: 'Daily science and nature trivia — biology, physics, space exploration, and the animal kingdom.',
    longDescription: 'Unlock the mysteries of the universe with our daily science quiz. Whether we are discussing the microscopic world of cellular biology or the vast expanses of quantum physics and astronomy, these questions are designed to stimulate your curiosity and explain the mechanics of the natural world.',
    learningPoints: [
      "Comprehend fundamental laws of physics and chemical reactions.",
      "Explore the diversity of the animal kingdom and Earth's ecosystems.",
      "Learn about the latest breakthroughs in space exploration and technology."
    ],
    keywords: 'science trivia quiz, biology quiz game, physics trivia questions',
    color: 'from-cyan-500 to-blue-500',
    icon: '🔬',
    triviaSlugs: ['science', 'animals', 'inventions-everyday-objects'],
  },
  'arts-literature': {
    name: 'Arts & Literature',
    subject: 'arts, literature, and famous works',
    description: 'Free daily arts and literature trivia — great authors, artists, famous paintings, and classic books.',
    longDescription: 'Feed your soul with our daily arts and literature trivia. We explore the brushstrokes of Renaissance masters and the profound prose of Nobel-winning authors. This quiz challenges you to recognize the creative milestones that have defined human expression across centuries and cultures.',
    learningPoints: [
      "Recognize the stylistic differences between major art movements.",
      "Identify the themes and authors of world-renowned literary classics.",
      "Understand the historical context behind iconic works of art and drama."
    ],
    keywords: 'literature trivia quiz, famous authors quiz, art history questions',
    color: 'from-pink-500 to-rose-500',
    icon: '🎨',
    triviaSlugs: ['literature', 'arts', 'famous-quotes'],
  },
  'sports': {
    name: 'Sports',
    subject: 'sports history and athletes',
    description: 'Daily sports trivia — athletes, records, championships, and iconic sporting moments. 10 free questions refreshed every 24 hours.',
    longDescription: 'For the ultimate sports fan, this daily quiz is your playing field. We cover the strategy of the pitch, the stats of the court, and the legends of the Olympic track. Test your knowledge of record-breaking performances and the history of global competitions from football to tennis.',
    learningPoints: [
      "Recall major sports records, championships, and iconic moments.",
      "Identify the career achievements of legendary athletes.",
      "Understand the rules and historical origins of various global sports."
    ],
    keywords: 'sports trivia quiz, athlete trivia, sports history game',
    color: 'from-red-500 to-orange-500',
    icon: '⚽',
    triviaSlugs: ['sports']
  },
};

// All sibling categories for the internal linking "More daily quizzes" section
const ALL_CATEGORIES = Object.entries(CATEGORY_CONFIG).map(([slug, cfg]) => ({
  slug,
  name: cfg.name,
  icon: cfg.icon,
}));

// ─── Metadata ─────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ date?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const cfg = CATEGORY_CONFIG[category];

  // Graceful fallback for unknown categories
  const name = cfg?.name ?? category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const description = cfg?.description ?? `Free daily ${name.toLowerCase()} trivia — 10 fresh questions every 24 hours. No sign-up required.`;
  const keywords = cfg?.keywords ?? `${name.toLowerCase()} trivia, daily quiz, knowledge test`;

  const title = `${name} Daily Quiz | Free Trivia Questions | Triviaah`;
  // ✅ Canonical is always the base category URL — never ?date= variants.
  // Date-parameterised URLs are the same page with different data, not distinct
  // indexable URLs. Including them in canonical would fragment PageRank.
  const canonicalUrl = `https://triviaah.com/daily-trivias/${category}`;

  return {
    title,
    description,
    keywords,

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    openGraph: {
      title: `${name} Daily Quiz — Play Free Today | Triviaah`,
      description,
      type: 'website',
      // ✅ FIX: Was `https://triviaah.com/daily/${category}` — wrong path (404).
      url: canonicalUrl,
      siteName: 'Triviaah',
      images: [{
        url: `/imgs/daily-trivias/${category}.webp`,
        width: 1200,
        height: 630,
        alt: `${name} Daily Trivia Quiz`,
      }],
    },

    twitter: {
      card: 'summary_large_image',
      title: `${name} Daily Quiz — Play Free Today | Triviaah`,
      description,
      images: [`/imgs/daily-trivias/${category}.webp`],
    },

    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// ─── Quiz content (server component, runs inside WithTimezone) ────────────────

interface DailyQuizContentProps {
  category: string;
  locationInfo: UserLocationInfo;
}

async function DailyQuizContent({ category, locationInfo }: DailyQuizContentProps) {
  try {
    const dateKey = locationInfo.dateKey;

    let questions: Question[];
    if (category === 'quick-fire') {
      questions = await getRandomQuestions(7, ['easy', 'medium', 'hard']);
    } else if (category === 'today-in-history') {
      questions = await getTodaysHistoryQuestions(10, dateKey);
    } else {
      questions = await getDailyQuizQuestions(category, dateKey);
    }

    if (!questions || questions.length === 0) {
      notFound();
    }

    const cfg = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG] ?? {
      name: category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      color: 'from-cyan-500 to-blue-500',
      icon: '❓',
      description: 'Daily trivia challenge',
      triviaSlug: undefined,
    };

    const isQuickfire = category === 'quick-fire';
    const lastUpdated = `${dateKey}T00:00:00Z`;

    const quizConfig = {
      isQuickfire,
      timePerQuestion: isQuickfire ? 15 : 30,
      hasBonusQuestion: isQuickfire,
    };

    // Sibling categories for internal linking (exclude current)
    const siblingCategories = ALL_CATEGORIES.filter(c => c.slug !== category);

    return (
      <div className="max-w-full md:max-w-4xl lg:max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">

        {/* ✅ StructuredData now receives category as a plain string, not Promise<params>.
            The original passed the raw params Promise — this meant StructuredData had
            to await it internally, adding an unnecessary async boundary and making
            the component harder to test. */}
        <StructuredData
          category={category}
          formattedCategory={cfg.name}
          dateKey={dateKey}
          lastUpdated={lastUpdated}
          questions={questions}
        />

        {/* Hero header */}
        <div className="text-center mb-8" itemScope itemType="https://schema.org/Quiz">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-md shadow-lg">
                <Play className="w-3 h-3 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {cfg.name} Daily Quiz
                </h1>
                {/* ✅ Visible description text — gives Google readable content to
                    assess page quality, not just structured data.
                    Previously the description paragraph was commented out. */}
                <p className="text-gray-300 text-sm mt-1 max-w-md">
                  {questions.length} free {cfg.name.toLowerCase()} trivia questions — refreshed daily.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 text-sm">
            <TimezoneInfo locationInfo={locationInfo} />
          </div>
        </div>

        {/* Quiz game */}
        <div className="mb-8">
          <QuizGame
            key={`${category}-${dateKey}`}
            initialQuestions={questions}
            category={category}
            quizConfig={quizConfig}
            quizType="daily-trivias"
          />
        </div>

        {/* NEW: Learning Points Section */}
        <section className="mt-16 mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Mastery Goals for Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cfg.learningPoints.map((point, index) => (
              <div key={index} className="bg-gray-800/40 border border-gray-700 p-6 rounded-2xl flex gap-4 items-start">
                <div className="w-8 h-8 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 font-bold border border-cyan-500/30">
                  {index + 1}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* NEW: Deep Dive Long Description Section */}
        <section className="mb-16 p-8 rounded-3xl bg-gradient-to-br from-gray-800/50 to-transparent border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-cyan-400">#</span> About the {cfg.name} Challenge
          </h2>
          <p className="text-gray-400 leading-loose text-base">
            {cfg.longDescription}
          </p>
        </section>

        <section className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">About {cfg.name} Daily</h2>
          <p className="text-gray-400 leading-relaxed mb-6">{cfg.longDescription}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cfg.learningPoints.map((p, i) => (
              <div key={i} className="text-xs bg-gray-900/50 p-3 rounded-xl border border-gray-800 text-gray-300">
                • {p}
              </div>
            ))}
          </div>
        </section>

        {/* REDESIGNED NAVIGATION ROWS */}
        <nav className="space-y-6 pt-8 border-t border-gray-800">
          
          {/* Row 1: Sibling Daily Quizzes */}
          <div>
            <p className="text-sm text-gray-500 mb-3 font-medium uppercase tracking-wider">More Daily Challenges</p>
            <div className="flex flex-wrap gap-2">
              {siblingCategories.map(({ slug, name, icon }) => (
                <Link
                  key={slug}
                  href={`/daily-trivias/${slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-gray-800/50 hover:bg-gray-700 text-gray-300 rounded-xl border border-gray-700 transition-all"
                >
                  <span>{icon}</span> {name}
                </Link>
              ))}
            </div>
          </div>

          {/* Row 2: Back to Index and Deep Links to Evergreen Categories */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Link 
              href="/daily-trivias" 
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-2 transition-colors"
            >
              ← All daily quizzes
            </Link>

            {/* Dynamic Evergreen Links */}
            {cfg.triviaSlugs && cfg.triviaSlugs.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-400">
                <span>Want more {cfg.name.toLowerCase()} trivias? Browse:&nbsp;</span>
                {cfg.triviaSlugs.map((slug, idx) => (
                  <span key={slug} className="flex items-center">
                    <Link 
                      href={`/trivias/${slug}`}
                      className="text-white hover:text-cyan-400 underline decoration-gray-600 hover:decoration-cyan-400 transition-all capitalize"
                    >
                      {slug.replace(/-/g, ' ')}
                    </Link>
                    {idx < cfg.triviaSlugs!.length - 1 && <span className="ml-2">•</span>}
                  </span>
                ))}
                <span>→</span>
              </div>
            )}
          </div>
        </nav>

        {/* FAQ section */}
        <FAQSection
          formattedCategory={cfg.name}
          hasBonusQuestion={quizConfig.hasBonusQuestion}
          userTimezone={locationInfo.timezone}
          lastUpdated={lastUpdated}
        />

      </div>
    );
  } catch (error) {
    console.error('Error loading daily quiz:', error);
    notFound();
  }
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default async function DailyQuizPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  return (
    <WithTimezone>
      {(locationInfo) => {
        const dateKey = resolvedSearch.date
          ? resolvedSearch.date
          : locationInfo.dateKey;
        const userLocalDate = resolvedSearch.date
          ? new Date(`${resolvedSearch.date}T00:00:00Z`)
          : locationInfo.userLocalDate;
        const displayDate = resolvedSearch.date
          ? new Date(`${resolvedSearch.date}T00:00:00Z`).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC',
            })
          : locationInfo.displayDate;

        return (
          <DailyQuizContent
            category={resolvedParams.category}
            locationInfo={{ ...locationInfo, dateKey, userLocalDate, displayDate }}
          />
        );
      }}
    </WithTimezone>
  );
}
