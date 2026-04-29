import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, CheckCircle2, Sparkles } from 'lucide-react';

import QuizGame from '@/components/trivias/QuizGame';
import { FAQSection } from '@/app/daily-trivias/[category]/FAQSection';
import { StructuredData } from '@/app/daily-trivias/[category]/structured-data';
import type { Question } from '@/lib/supabase';
import type { TriviaCategoryFaqItem, TriviaCategoryRecord } from '@/lib/trivia-categories';
import { LandingStructuredData } from './LandingStructuredData';
import { MobileExpandableDescription } from './MobileExpandableDescription';

type QuizConfig = {
  isQuickfire: boolean;
  timePerQuestion: number;
  hasBonusQuestion: boolean;
};

type DailyTriviaSiblingCategory = {
  slug: string;
  name: string;
  icon: string;
};

type DailyTriviaPageContentProps = {
  category: string;
  categoryData: TriviaCategoryRecord;
  siblingCategories?: DailyTriviaSiblingCategory[];
  questions?: Question[];
  dateKey?: string;
  displayDate?: string;
  startQuizHref?: string;
  showIntro?: boolean;
  showFAQ?: boolean;
  showQuiz?: boolean;
};

function getCategoryAccent(color?: string) {
  // Elegant dark blue/black theme accent colors
  return color || 'from-blue-600 to-cyan-500';
}

export function DailyTriviaPageContent({
  category,
  categoryData,
  siblingCategories = [],
  questions = [],
  dateKey,
  displayDate,
  startQuizHref,
  showIntro = true,
  showFAQ = true,
  showQuiz = true,
}: DailyTriviaPageContentProps) {
  const cfg = categoryData;
  const isQuickfire = category === 'quick-fire';
  const quizConfig: QuizConfig = {
    isQuickfire,
    timePerQuestion: isQuickfire ? 15 : 30,
    hasBonusQuestion: isQuickfire,
  };
  const title = cfg.displayName || cfg.title;
  const accent = getCategoryAccent(cfg.color);
  const heroImage = cfg.ogImage || `/imgs/daily-trivias/${category}.webp`;
  const playHref = startQuizHref || `/daily-trivias/${category}/quiz`;
  const lastUpdated = dateKey ? `${dateKey}T00:00:00Z` : cfg.updatedAt || new Date().toISOString();
  const learningPoints = cfg.learningPoints.length > 0
    ? cfg.learningPoints
    : [
        `Explore curated ${title.toLowerCase()} trivia topics.`,
        'Return daily for fresh questions and challenges.',
        'Use the quiz to test what you know and learn something new.',
      ];
  const faqItems: TriviaCategoryFaqItem[] = cfg.faqItems.length > 0
    ? cfg.faqItems
    : [
        {
          icon: '🔄',
          title: 'How often are new questions available?',
          answer: `New ${title.toLowerCase()} trivia questions are available every day. Come back daily for a fresh challenge.`,
        },
      ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#050810] via-[#0a0f1c] to-[#030612]">
      {/* Subtle background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-cyan-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-full px-4 py-6 sm:px-6 lg:max-w-6xl lg:px-8 lg:py-8">
        <LandingStructuredData
          category={category}
          title={title}
          description={cfg.description}
          lastUpdated={lastUpdated}
        />

        {showQuiz && dateKey && questions.length > 0 ? (
          <StructuredData
            category={category}
            formattedCategory={title}
            dateKey={dateKey}
            lastUpdated={lastUpdated}
            questions={questions}
          />
        ) : null}

        {showIntro && (
          <section className="relative mb-10 overflow-hidden rounded-3xl border border-slate-800/60 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-black/90 backdrop-blur-sm shadow-2xl">
            <div className="relative grid gap-6 p-5 sm:p-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8 lg:p-10">
              <div className="relative order-2 flex flex-col items-center justify-start lg:order-1">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/18 via-cyan-500/10 to-transparent blur-3xl" />
                <div className="relative w-full max-w-[180px] overflow-hidden rounded-[1.5rem] border border-cyan-400/20 bg-gradient-to-br from-slate-800 to-slate-950 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] sm:max-w-[240px]">
                  <div className="relative aspect-square overflow-hidden rounded-[1.2rem] border border-white/10 bg-slate-950/80">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(96,165,250,0.18),transparent_34%),radial-gradient(circle_at_70%_30%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_50%_75%,rgba(139,92,246,0.12),transparent_36%)]" />
                    <Image
                      src={heroImage}
                      alt={`${title} daily trivia`}
                      fill
                      sizes="(max-width: 640px) 200px, 240px"
                      className="relative z-10 object-contain p-4 drop-shadow-[0_14px_30px_rgba(0,0,0,0.5)]"
                      priority
                    />
                  </div>
                </div>
                <div className="mt-3 grid w-full max-w-[240px] grid-cols-3 gap-2 text-center">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-2.5 backdrop-blur">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-cyan-200/80">Free</div>
                    <div className="mt-1 text-[11px] font-semibold text-white">No signup</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-2.5 backdrop-blur">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-cyan-200/80">Daily</div>
                    <div className="mt-1 text-[11px] font-semibold text-white">Fresh set</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-2.5 backdrop-blur">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-cyan-200/80">Play</div>
                    <div className="mt-1 text-[11px] font-semibold text-white">Timed quiz</div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 order-1 flex flex-col justify-center lg:order-2">
                <div className="mb-3 flex items-center gap-2 sm:mb-4">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <p className="text-xs font-medium uppercase tracking-wider text-blue-300/90">
                    Daily Challenge
                  </p>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {title}{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Daily Quiz
                  </span>
                </h1>
                <MobileExpandableDescription className="mt-4 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
                  {cfg.longDescription}
                </MobileExpandableDescription>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400/80">
                  Fresh questions every day. Play instantly - no signup required.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                  <Link
                    href={playHref}
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/30 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
                    Start Quiz Now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/daily-trivias"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-cyan-100 shadow-lg shadow-cyan-950/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-slate-800/90 hover:text-white hover:shadow-[0_16px_36px_rgba(34,211,238,0.16)] focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300 transition-colors group-hover:bg-cyan-300/15 group-hover:text-cyan-200">
                      <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                    </span>
                    Browse All Daily Quizzes
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {showQuiz && !showIntro && (
          <section className="text-center mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-md shadow-lg">
                  <Play className="w-3 h-3 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="mb-0.5 text-xl font-bold leading-tight text-white sm:mb-1 sm:text-3xl md:text-4xl">
                    {title} Quiz Challenge
                  </h1>
                  <p className="max-w-[90vw] overflow-hidden whitespace-nowrap text-ellipsis text-sm leading-none text-gray-300 sm:max-w-xl sm:text-base">
                    {cfg.description}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {showQuiz && (
          <div className="mb-10 rounded-2xl border border-slate-800/60 bg-slate-900/30 p-4 backdrop-blur-sm sm:p-6">
            <QuizGame
              key={`${category}-${dateKey}`}
              initialQuestions={questions}
              category={category}
              quizConfig={quizConfig}
              quizType="daily-trivias"
            />
          </div>
        )}

        {/* What You'll Learn Section */}
        <section className="my-20">
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Expand Your Knowledge
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">What You'll Learn</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {learningPoints.map((point, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-blue-900/40 to-cyan-900/30 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_8px_30px_rgb(6,182,212,0.15)]"
              >
                <div className="absolute -top-3 left-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-sm leading-relaxed text-gray-200">{point}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Navigation & Sibling Categories */}
        <nav className="mt-20 space-y-12 border-t border-slate-800/60 pt-16">
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Daily Discovery
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">More Daily Challenges</h2>
              </div>
              <Link 
                href="/daily-trivias"
                className="hidden sm:flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors group"
              >
                View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-8 sm:gap-3">
              {siblingCategories.slice(0, 16).map(({ slug, name, icon }) => (
                <Link
                  key={slug}
                  href={`/daily-trivias/${slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-white/5 bg-slate-900/40 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-lg"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-800">
                    <Image
                      src={`/imgs/daily-trivias/${slug}.webp`}
                      alt={name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-50 group-hover:opacity-100"
                      sizes="(max-width: 640px) 25vw, (max-width: 1024px) 15vw, 12vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                    
                    {/* Icon Overlay */}
                    <div className="absolute top-1.5 left-1.5 flex h-5 w-5 items-center justify-center rounded-md bg-black/60 text-[10px] backdrop-blur-sm">
                      {icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-2">
                    <h3 className="text-[10px] font-bold text-white transition-colors group-hover:text-blue-400 line-clamp-1 text-center">
                      {name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/daily-trivias"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
            >
              ← All Daily Quizzes
            </Link>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-400">
              <span>Want more {title.toLowerCase()} trivia? Browse:&nbsp;</span>
              {cfg.related.map((slug, idx) => (
                <span key={slug} className="flex items-center">
                  <Link
                    href={`/trivias/${slug}`}
                    className="text-white underline decoration-gray-600 underline-offset-4 transition-colors hover:text-blue-400 hover:decoration-blue-400 capitalize"
                  >
                    {slug.replace(/-/g, ' ')}
                  </Link>
                  {idx < cfg.related.length - 1 && <span className="ml-2">•</span>}
                </span>
              ))}
              <span>→</span>
            </div>
          </div>
        </nav>

        {showFAQ && (
          <div className="mt-16">
            <FAQSection
              formattedCategory={title}
              hasBonusQuestion={quizConfig.hasBonusQuestion}
              lastUpdated={lastUpdated}
              faqItems={faqItems}
            />
          </div>
        )}
      </div>
    </div>
  );
}
