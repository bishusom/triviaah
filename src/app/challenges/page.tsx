import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import {
  ArrowRight,
  Calendar,
  Clock,
  Flame,
  HelpCircle,
  Play,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';

import { getWeeklyChallenges, type WeeklyTriviaChallenge } from '@/lib/challenges';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Weekly Trivia Challenges | Free Timed Topic Quizzes | Triviaah',
  description:
    'Play curated weekly trivia challenges across food, history, science, sports, and pop-culture. 10 questions with 30-second timers refreshed every week.',
  alternates: {
    canonical: 'https://triviaah.com/challenges',
  },
  openGraph: {
    title: 'Weekly Trivia Challenges | Free Timed Topic Quizzes | Triviaah',
    description:
      'Play curated weekly trivia challenges across food, history, science, sports, and pop-culture. 10 questions with 30-second timers refreshed every week.',
    url: 'https://triviaah.com/challenges',
    siteName: 'Triviaah',
    images: [{ url: '/imgs/triviaah-og.webp', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weekly Trivia Challenges | Free Timed Topic Quizzes | Triviaah',
    description:
      'Play curated weekly trivia challenges across food, history, science, sports, and pop-culture.',
    images: ['/imgs/triviaah-og.webp'],
  },
  robots: { index: true, follow: true },
};

function ChallengeCard({
  challenge,
  isFeatured = false,
}: {
  challenge: WeeklyTriviaChallenge;
  isFeatured?: boolean;
}) {
  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 ${
        isFeatured
          ? 'border-red-500/40 bg-slate-900/90 shadow-2xl shadow-red-950/20 hover:border-red-400/60 hover:-translate-y-1'
          : 'border-white/10 bg-slate-900/70 shadow-xl shadow-black/30 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-slate-900/90'
      }`}
    >
      <div>
        {/* Card Hero Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
          <Image
            src={challenge.heroImage}
            alt={`${challenge.subcategory} trivia challenge`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          {/* Status Badges */}
          {isFeatured && (
            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-600 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-red-600/30 backdrop-blur">
                <Trophy className="h-3.5 w-3.5 fill-current" />
                Featured
              </span>
            </div>
          )}

          <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-xs font-bold text-gray-300 backdrop-blur">
            {challenge.categoryTitle}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
              {challenge.formattedDateRange}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
              <Clock className="h-3.5 w-3.5" />
              30s / Q
            </span>
          </div>

          <h3 className="text-xl font-black text-white group-hover:text-cyan-200 transition-colors">
            {challenge.subcategory}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-gray-300 line-clamp-2">
            {challenge.description}
          </p>

          <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 font-medium">
              <HelpCircle className="h-3.5 w-3.5 text-cyan-300" />
              10 Questions
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 font-medium">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Instant Score
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer Action */}
      <div className="border-t border-white/10 p-5 pt-3">
        <Link
          href={`/challenges/${challenge.slug}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-blue-500"
        >
          <Play className="h-4 w-4 fill-current" />
          Start Challenge
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export default async function ChallengesPage() {
  const challenges = await getWeeklyChallenges();
  // Filter only active challenges for the challenges homepage
  const activeChallenges = challenges.filter((c) => c.status === 'active');
  const displayChallenges = activeChallenges.length > 0 ? activeChallenges : challenges;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#060913] via-[#0b1021] to-[#040711] px-4 py-8 text-white sm:px-6 lg:px-8">
      <Script
        id="structured-data-weekly-challenges"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Weekly Trivia Challenges',
            url: 'https://triviaah.com/challenges',
            description: metadata.description,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: displayChallenges.map((challenge, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: challenge.title,
                url: `https://triviaah.com/challenges/${challenge.slug}`,
              })),
            },
          }),
        }}
      />

      <div className="mx-auto max-w-7xl">
        {/* ── Top Header Section ────────────────────────────────────────── */}
        <section className="mb-10 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-cyan-300">
                <Sparkles className="h-4 w-4" />
                Weekly Rotations
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                Weekly Trivia{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                  Challenges
                </span>
              </h1>
              <p className="mt-3 text-base leading-relaxed text-gray-300 sm:text-lg">
                Play focused topic challenges refreshed every week. Each challenge has 10 questions with a strict <strong>30-second timer</strong> per question.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center">
                <div className="text-2xl font-black text-cyan-300">{displayChallenges.length}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Active Challenges
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center">
                <div className="text-2xl font-black text-emerald-300">30s</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Per Question
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Active Weekly Challenges Grid (4 Per Row) ────────────────── */}
        <section className="mb-12">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                Active Weekly Roster
              </p>
              <h2 className="text-2xl font-black text-white sm:text-3xl">
                Challenges Live This Week
              </h2>
            </div>
            <p className="text-sm text-gray-400">
              {displayChallenges.length} challenges available to play right now
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {displayChallenges.map((challenge, index) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isFeatured={index === 0}
              />
            ))}
          </div>
        </section>

        {/* ── Bottom Banner CTA ────────────────────────────────────────── */}
        <section className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900/80 to-blue-950/40 p-8 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                Daily Mode
              </p>
              <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                Looking for daily quick-fire quizzes?
              </h2>
              <p className="mt-2 text-sm text-gray-300 sm:text-base">
                Jump into our Daily Trivias refreshed every 24 hours across general knowledge, nature, history, and pop-culture.
              </p>
            </div>
            <Link
              href="/daily-trivias"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3.5 text-sm font-black text-slate-950 transition-all hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20"
            >
              Explore Daily Trivias
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
