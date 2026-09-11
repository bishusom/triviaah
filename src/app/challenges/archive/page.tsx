import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Filter,
  History,
  Search,
  X,
} from 'lucide-react';

import { getArchiveCardGradient } from '@/components/challenges/archive-card-styles';
import { getWeeklyChallenges, type WeeklyTriviaChallenge } from '@/lib/challenges';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Trivia Challenge Archive | Past Weekly Quizzes | Triviaah',
  description:
    'Browse and replay past Triviaah weekly challenges by category, month, or topic.',
  alternates: {
    canonical: 'https://triviaah.com/challenges/archive',
  },
  openGraph: {
    title: 'Trivia Challenge Archive | Triviaah',
    description: 'Find and replay past weekly trivia challenges.',
    url: 'https://triviaah.com/challenges/archive',
    siteName: 'Triviaah',
    images: [{ url: '/imgs/triviaah-og.webp', width: 1200, height: 630 }],
    type: 'website',
  },
};

type ArchiveSearchParams = {
  q?: string | string[];
  category?: string | string[];
  month?: string | string[];
  limit?: string | string[];
};

function getParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] || '' : value || '';
}

function formatMonth(month: string): string {
  return new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function buildArchiveHref(
  filters: { q: string; category: string; month: string },
  limit: number
): string {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.category) params.set('category', filters.category);
  if (filters.month) params.set('month', filters.month);
  if (limit > 12) params.set('limit', String(limit));
  const query = params.toString();
  return `/challenges/archive${query ? `?${query}` : ''}`;
}

function groupChallengesByMonth(challenges: WeeklyTriviaChallenge[]) {
  return challenges.reduce<Record<string, WeeklyTriviaChallenge[]>>((groups, challenge) => {
    const month = challenge.startDate.slice(0, 7);
    (groups[month] ||= []).push(challenge);
    return groups;
  }, {});
}

export default async function ChallengeArchivePage({
  searchParams,
}: {
  searchParams?: Promise<ArchiveSearchParams>;
}) {
  const params = (await searchParams) || {};
  const q = getParam(params.q).trim();
  const category = getParam(params.category);
  const month = getParam(params.month);
  const requestedLimit = Number.parseInt(getParam(params.limit), 10);
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 12
    ? Math.ceil(requestedLimit / 12) * 12
    : 12;

  const challenges = await getWeeklyChallenges();
  const archivedChallenges = challenges.filter((challenge) => challenge.status === 'past');
  const normalizedQuery = q.toLowerCase();

  const categoryOptions = Array.from(
    archivedChallenges.reduce<Map<string, string>>((options, challenge) => {
      options.set(challenge.category, challenge.categoryTitle);
      return options;
    }, new Map())
  ).sort((a, b) => a[1].localeCompare(b[1]));

  const monthOptions = Array.from(
    new Set(archivedChallenges.map((challenge) => challenge.startDate.slice(0, 7)))
  ).sort((a, b) => b.localeCompare(a));

  const filteredChallenges = archivedChallenges.filter((challenge) => {
    const matchesQuery = !normalizedQuery || [
      challenge.title,
      challenge.subcategory,
      challenge.categoryTitle,
      challenge.description,
    ].some((value) => value.toLowerCase().includes(normalizedQuery));
    const matchesCategory = !category || challenge.category === category;
    const matchesMonth = !month || challenge.startDate.startsWith(month);
    return matchesQuery && matchesCategory && matchesMonth;
  });

  const visibleChallenges = filteredChallenges.slice(0, limit);
  const groupedChallenges = groupChallengesByMonth(visibleChallenges);
  const filters = { q, category, month };
  const hasFilters = Boolean(q || category || month);
  const hasMore = visibleChallenges.length < filteredChallenges.length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#060913] via-[#0b1021] to-[#040711] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/challenges"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition hover:text-cyan-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to current challenges
        </Link>

        <header className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-cyan-300">
              <History className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                Challenge Archive
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
                Replay a past challenge
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
                Search by topic or narrow the archive by category and month. Every challenge remains available to replay.
              </p>
            </div>
          </div>
        </header>

        <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900/60 p-4 shadow-xl backdrop-blur sm:p-6">
          <form action="/challenges/archive" method="get" className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_200px_auto]">
            <label className="relative">
              <span className="sr-only">Search archived challenges</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search topics…"
                className="h-12 w-full rounded-xl border border-white/10 bg-black/25 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
              />
            </label>

            <label>
              <span className="sr-only">Filter by category</span>
              <select
                name="category"
                defaultValue={category}
                className="h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-sm text-gray-200 outline-none transition focus:border-cyan-400/60"
              >
                <option value="">All categories</option>
                {categoryOptions.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="sr-only">Filter by month</span>
              <select
                name="month"
                defaultValue={month}
                className="h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-sm text-gray-200 outline-none transition focus:border-cyan-400/60"
              >
                <option value="">All months</option>
                {monthOptions.map((value) => (
                  <option key={value} value={value}>{formatMonth(value)}</option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 text-sm font-black text-white transition hover:from-cyan-400 hover:to-blue-500"
            >
              <Filter className="h-4 w-4" />
              Apply
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <p className="text-sm text-gray-400" aria-live="polite">
              Showing <strong className="text-white">{visibleChallenges.length}</strong> of{' '}
              <strong className="text-white">{filteredChallenges.length}</strong>{' '}
              {filteredChallenges.length === 1 ? 'challenge' : 'challenges'}
            </p>
            {hasFilters && (
              <Link
                href="/challenges/archive"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-300 transition hover:text-white"
              >
                <X className="h-4 w-4" />
                Clear filters
              </Link>
            )}
          </div>
        </section>

        {visibleChallenges.length > 0 ? (
          <div className="mt-8 space-y-8">
            {Object.entries(groupedChallenges).map(([groupMonth, monthChallenges]) => (
              <section key={groupMonth} aria-labelledby={`month-${groupMonth}`}>
                <div className="mb-3 flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  <h2 id={`month-${groupMonth}`} className="text-lg font-black text-white">
                    {formatMonth(groupMonth)}
                  </h2>
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs font-bold text-gray-500">
                    {monthChallenges.length}
                  </span>
                </div>

                <div className="grid gap-2.5 md:grid-cols-2">
                  {monthChallenges.map((challenge, index) => (
                    <Link
                      key={challenge.id}
                      href={`/challenges/${challenge.slug}`}
                      className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br p-2.5 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:shadow-xl hover:shadow-black/25 ${getArchiveCardGradient(index)}`}
                    >
                      <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl bg-slate-950">
                        <Image
                          src={challenge.heroImage}
                          alt=""
                          fill
                          className="object-cover opacity-80 transition duration-500 group-hover:scale-110 group-hover:opacity-100"
                          sizes="76px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                        {challenge.icon && (
                          <span aria-hidden="true" className="absolute bottom-1.5 left-1.5 text-lg drop-shadow-md">
                            {challenge.icon}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="w-fit rounded-full border border-cyan-400/15 bg-cyan-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.14em] text-cyan-200">
                          {challenge.categoryTitle}
                        </p>
                        <h3 className="mt-1 truncate text-base font-black text-white group-hover:text-cyan-200">
                          {challenge.subcategory}
                        </h3>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-gray-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {challenge.formattedDateRange}
                        </p>
                      </div>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-200 transition group-hover:border-cyan-300/50 group-hover:bg-cyan-400 group-hover:text-slate-950">
                        <span className="sr-only">Replay {challenge.subcategory}</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <section className="mt-8 rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
            <Search className="mx-auto h-8 w-8 text-gray-500" />
            <h2 className="mt-4 text-xl font-black">No matching challenges</h2>
            <p className="mt-2 text-sm text-gray-400">Try a different topic, category, or month.</p>
            <Link
              href="/challenges/archive"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-black text-slate-950 hover:bg-cyan-300"
            >
              Clear filters
            </Link>
          </section>
        )}

        {hasMore && (
          <div className="mt-10 text-center">
            <Link
              href={buildArchiveHref(filters, limit + 12)}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-6 py-3 text-sm font-black text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-500/20"
            >
              Load 12 more
              <ArrowRight className="h-4 w-4 rotate-90" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
