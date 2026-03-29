// src/app/daily-trivias/[category]/page.tsx
//
// Key SEO fixes in this file:
//
// ✅ generateMetadata() consolidated here (removed from layout.tsx)
// ✅ Removed sr-only hidden question/answer block — hidden content visible
//    only to crawlers is a Google quality guideline violation
// ✅ robots object form (not string) for reliability across Next.js versions
// ✅ Accurate canonical URL (/daily-trivias/${category}, never with ?date=)
// ✅ Category-specific descriptions using static config (not generic template)
// ✅ Internal links added: to /daily-trivias index, sibling categories,
//    and the matching /trivias/${category} page where one exists
// ✅ StructuredData now receives `category` as a plain string (not Promise<params>)

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
  subject: string;       // used in descriptions
  description: string;   // unique meta description per category
  keywords: string;
  color: string;
  icon: string;
  // Matching /trivias/ category slug, if one exists
  triviaSlug?: string;
}> = {
  'quick-fire': {
    name: 'Quick Fire',
    subject: 'rapid-fire general knowledge',
    description: 'Race the clock with our Quick Fire daily trivia — 6 questions, 15 seconds each. New challenge every 24 hours. No sign-up required.',
    keywords: 'rapid fire trivia, quick fire trivia, quick trivia quiz, daily trivia, daily quiz with answers',
    color: 'from-orange-500 to-red-500',
    icon: '⚡',
  },
  'general-knowledge': {
    name: 'General Knowledge',
    subject: 'general knowledge',
    description: 'Test your worldly wisdom with 10 free daily general knowledge trivia questions. Topics from science to history to pop culture. Refreshed every day.',
    keywords: 'general knowledge quiz, daily trivia facts, world trivia questions, daily quiz with answers',
    color: 'from-blue-500 to-cyan-500',
    icon: '🌎',
  },
  'today-in-history': {
    name: 'Today in History',
    subject: 'historical events from today\'s date',
    description: 'Discover what happened on this day in history — free daily trivia with 10 questions on famous birthdays, battles, discoveries, and milestones.',
    keywords: 'historical trivia quiz, on this day trivia, history facts game, history quiz with answers, today in history quiz',
    color: 'from-amber-500 to-orange-500',
    icon: '📅',
    triviaSlug: 'history',
  },
  'entertainment': {
    name: 'Entertainment',
    subject: 'movies, music, and pop culture',
    description: 'Daily entertainment trivia — movies, music, TV shows, and celebrity questions. 10 free pop culture questions refreshed every 24 hours.',
    keywords: 'pop culture trivia quiz, movie trivia game, celebrity quiz, entertainment quiz answers, daily entertainment trivia',
    color: 'from-purple-500 to-pink-500',
    icon: '🎬',
    triviaSlug: 'movies',
  },
  'geography': {
    name: 'Geography',
    subject: 'world geography, capitals, and landmarks',
    description: 'Free daily geography trivia — countries, capitals, flags, and world landmarks. 10 fresh questions every day, no registration needed.',
    keywords: 'geography trivia quiz, world capitals game, countries trivia, geography quiz with answers, daily geography quiz',
    color: 'from-green-500 to-emerald-500',
    icon: '🗺️',
    triviaSlug: 'geography',
  },
  'science': {
    name: 'Science & Nature',
    subject: 'science and nature',
    description: 'Daily science and nature trivia — biology, physics, space exploration, and the animal kingdom. 10 free questions updated every 24 hours.',
    keywords: 'science trivia quiz, biology quiz game, physics trivia questions, science quiz with answers, daily science trivia',
    color: 'from-cyan-500 to-blue-500',
    icon: '🔬',
    triviaSlug: 'science',
  },
  'arts-literature': {
    name: 'Arts & Literature',
    subject: 'arts, literature, and famous works',
    description: 'Free daily arts and literature trivia — great authors, artists, famous paintings, and classic books. 10 new questions every day.',
    keywords: 'literature trivia quiz, famous authors quiz, art history questions, classic books quiz, daily arts trivia',
    color: 'from-pink-500 to-rose-500',
    icon: '🎨',
    triviaSlug: 'literature',
  },
  'sports': {
    name: 'Sports',
    subject: 'sports history and athletes',
    description: 'Daily sports trivia — athletes, records, championships, and iconic sporting moments. 10 free questions refreshed every 24 hours.',
    keywords: 'sports trivia quiz, athlete trivia, sports history game, sports quiz with answers, daily sports trivia',
    color: 'from-red-500 to-orange-500',
    icon: '⚽',
    triviaSlug: 'sports',
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
    const activeDate = locationInfo.userLocalDate;
    const dateKey = activeDate.toISOString().split('T')[0];

    let questions: Question[];
    if (category === 'quick-fire') {
      questions = await getRandomQuestions(7, ['easy', 'medium', 'hard']);
    } else if (category === 'today-in-history') {
      questions = await getTodaysHistoryQuestions(10, activeDate);
    } else {
      questions = await getDailyQuizQuestions(category, activeDate);
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
    const lastUpdated = new Date().toISOString();

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
          locationInfo={locationInfo}
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

        {/* ✅ REMOVED: sr-only hidden question/answer block.
            Hidden content that's visible to crawlers but not users is explicitly
            against Google's quality guidelines and risks a manual penalty.
            The questions are already in the Quiz schema structured data above —
            no need to duplicate them in hidden HTML.
            
            If you want questions to be indexable as text, render them visibly
            below the quiz (e.g. as an "Answer key" section that appears after
            the user completes the quiz — many trivia sites do this). */}

        {/* FAQ section */}
        <FAQSection
          formattedCategory={cfg.name}
          hasBonusQuestion={quizConfig.hasBonusQuestion}
          userTimezone={locationInfo.timezone}
          lastUpdated={lastUpdated}
        />

        {/* ✅ Internal linking block — this is new.
            
            Previously every daily category page was a crawl dead-end: no links
            back to /daily-trivias, no links to sibling daily categories, and no
            links to the matching /trivias/ category. PageRank couldn't flow
            between pages at all.

            These links do three things:
            1. Pass PageRank back up to the /daily-trivias index
            2. Pass PageRank sideways to sibling daily category pages
            3. Create a cross-section link to the matching evergreen trivia page,
               which helps Google understand the relationship between daily and
               static content on the same topic */}
        <nav aria-label="Related trivia" className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Back to daily index + link to matching trivia category */}
            <div>
              <p className="text-gray-400 text-sm mb-3">
                <Link href="/daily-trivias" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
                  ← All daily quizzes
                </Link>
              </p>
              {cfg.triviaSlug && (
                <p className="text-gray-400 text-sm">
                  Want more {cfg.name.toLowerCase()} questions?{' '}
                  <Link
                    href={`/trivias/${cfg.triviaSlug}`}
                    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                  >
                    Browse the full {cfg.name} trivia quiz →
                  </Link>
                </p>
              )}
            </div>

            {/* Sibling daily categories */}
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-3 font-medium">More daily quizzes</p>
              <div className="flex flex-wrap gap-2">
                {siblingCategories.map(({ slug, name, icon }) => (
                  <Link
                    key={slug}
                    href={`/daily-trivias/${slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg border border-gray-700 hover:border-cyan-500/40 transition-all duration-200"
                  >
                    <span className="text-xs">{icon}</span>
                    {name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
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
        const displayDate = resolvedSearch.date
          ? new Date(resolvedSearch.date)
          : locationInfo.userLocalDate;

        return (
          <DailyQuizContent
            category={resolvedParams.category}
            locationInfo={{ ...locationInfo, userLocalDate: displayDate }}
          />
        );
      }}
    </WithTimezone>
  );
}