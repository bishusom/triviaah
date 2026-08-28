import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import {
  ArrowRight,
  Calendar,
  CircleStar,
  Clock,
  Users,
  Play,
  Sparkles,
  Trophy,
} from 'lucide-react';

import {
  getWeeklyChallengeByIdOrSlug,
  getWeeklyChallenges,
  type WeeklyTriviaChallenge,
} from '@/lib/challenges';
import ExploreSections from '@/components/common/ExploreSections';
import { MobileExpandableDescription } from '@/components/daily-trivias/MobileExpandableDescription';

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const challenge = await getWeeklyChallengeByIdOrSlug(slug);

  if (!challenge) {
    return {
      title: 'Weekly Challenge Not Found | Triviaah',
      robots: { index: false, follow: true },
    };
  }

  const canonical = `https://triviaah.com/challenges/${challenge.slug}`;

  return {
    title: `${challenge.subcategory} in ${challenge.categoryTitle} Trivia | Weekly Challenge | Triviaah`,
    description: challenge.seoDescription,
    keywords: challenge.keywords,
    alternates: { canonical },
    openGraph: {
      title: `${challenge.subcategory} in ${challenge.categoryTitle} Trivia | Weekly Challenge | Triviaah`,
      description: challenge.seoDescription,
      url: canonical,
      siteName: 'Triviaah',
      images: [
        {
          url: challenge.heroImage,
          width: 1024,
          height: 1024,
          alt: `${challenge.subcategory} Trivia Challenge`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${challenge.subcategory} in ${challenge.categoryTitle} Trivia | Weekly Challenge | Triviaah`,
      description: challenge.seoDescription,
      images: [challenge.heroImage],
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export async function generateStaticParams() {
  const challenges = await getWeeklyChallenges();
  return challenges.map((challenge) => ({ slug: challenge.slug }));
}

export default async function ChallengeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const challenge = await getWeeklyChallengeByIdOrSlug(slug);

  if (!challenge) {
    notFound();
  }

  const allChallenges = await getWeeklyChallenges();
  const siblingChallenges = allChallenges
    .filter((c) => c.id !== challenge.id && c.status === 'active')
    .slice(0, 6);

  const pageTitle = `${challenge.subcategory} in ${challenge.categoryTitle} Trivia`;
  const canonical = `https://triviaah.com/challenges/${challenge.slug}`;
  const quizHref = `/challenges/${challenge.slug}/quiz`;
  const multiplayerHref = `/multiplayer?category=${encodeURIComponent(challenge.category)}&subcategory=${encodeURIComponent(challenge.subcategory)}`;
  const heroDescription = `${challenge.description} Test your recall with 10 questions focused on ${challenge.subcategory} with a strict 30-second timer per question. Available for the week of ${challenge.formattedDateRange}.`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}/#webpage`,
        url: canonical,
        name: pageTitle,
        description: challenge.seoDescription,
      },
      {
        '@type': 'Quiz',
        '@id': `${canonical}/#quiz`,
        name: `${challenge.subcategory} Weekly Trivia Challenge`,
        description: challenge.description,
        url: canonical,
        numberOfQuestions: challenge.questionCount,
        timeRequired: 'PT5M',
        educationalLevel: 'Intermediate',
        about: {
          '@type': 'Thing',
          name: challenge.subcategory,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://triviaah.com' },
          { '@type': 'ListItem', position: 2, name: 'Weekly Challenges', item: 'https://triviaah.com/challenges' },
          { '@type': 'ListItem', position: 3, name: challenge.categoryTitle, item: 'https://triviaah.com/challenges' },
          { '@type': 'ListItem', position: 4, name: pageTitle, item: canonical },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <Script
          id="challenge-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* ── Subcategory Style Hero Container ───────────────────────── */}
        <div className="rounded-3xl border border-cyan-500/20 bg-gray-900/60 p-5 md:p-12">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <Link href="/challenges" className="hover:text-cyan-400 transition-colors">
              Weekly Challenges
            </Link>
            <span>/</span>
            <span className="text-gray-300">{challenge.categoryTitle}</span>
            <span>/</span>
            <span className="text-white">{pageTitle}</span>
          </div>

          <div className="mt-6 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Weekly Challenge
            </p>
            <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
              {pageTitle}
            </h1>
            <MobileExpandableDescription className="mt-5 text-base leading-relaxed text-gray-300 md:text-lg">
              {heroDescription}
            </MobileExpandableDescription>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row md:mt-10">
            <Link
              href={quizHref}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-base font-bold text-white transition-transform hover:scale-[1.02]"
            >
              Play {challenge.subcategory} Challenge
              <Play className="ml-2 h-4 w-4 fill-current" />
            </Link>
            <Link
              href="/challenges"
              className="inline-flex items-center justify-center rounded-2xl border border-gray-600 bg-gray-800 px-8 py-4 text-base font-semibold text-white transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
            >
              Back to Weekly Challenges
            </Link>
            <Link
              href={multiplayerHref}
              className="inline-flex items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-8 py-4 text-base font-semibold text-emerald-200 transition-colors hover:border-emerald-400 hover:bg-emerald-500/20"
            >
              Play With Friends
              <Users className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* 4 Feature Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <div className="rounded-2xl border border-gray-700 bg-gray-800/80 p-4 text-center">
              <Clock className="mx-auto mb-2 text-cyan-400 h-6 w-6" />
              <div className="text-xl font-bold text-white">30s</div>
              <div className="text-sm text-gray-400">Per Question</div>
            </div>
            <div className="rounded-2xl border border-gray-700 bg-gray-800/80 p-4 text-center">
              <Play className="mx-auto mb-2 text-yellow-400 h-6 w-6 fill-current" />
              <div className="text-xl font-bold text-white">10</div>
              <div className="text-sm text-gray-400">Per Quiz Run</div>
            </div>
            <div className="rounded-2xl border border-gray-700 bg-gray-800/80 p-4 text-center">
              <CircleStar className="mx-auto mb-2 text-purple-400 h-6 w-6" />
              <div className="text-xl font-bold text-white">Free</div>
              <div className="text-sm text-gray-400">Instant Scoring</div>
            </div>
            <div className="rounded-2xl border border-gray-700 bg-gray-800/80 p-4 text-center">
              <Calendar className="mx-auto mb-2 text-green-400 h-6 w-6" />
              <div className="text-xl font-bold text-white">{challenge.formattedDateRange}</div>
              <div className="text-sm text-gray-400">Active Week</div>
            </div>
          </div>
        </div>

        {/* ── Other Weekly Challenges Section ────────────────────────── */}
        {siblingChallenges.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-white text-center">
              Other Weekly Challenges Live This Week
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {siblingChallenges.map((item: WeeklyTriviaChallenge) => {
                const href = `/challenges/${item.slug}`;
                return (
                  <Link
                    key={item.id}
                    href={href}
                    className="group relative overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900/95 via-slate-900 to-cyan-950/50 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-300/30 hover:shadow-[0_24px_60px_rgba(8,145,178,0.2)]"
                  >
                    <div
                      className="absolute inset-0 opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          'radial-gradient(circle at top right, rgba(34, 211, 238, 0.18), transparent 34%), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.12), transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent 45%)',
                      }}
                    />
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500" />
                    <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div className="relative z-10 flex h-full flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.18)] ring-1 ring-white/10">
                              <Sparkles className="h-5 w-5 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)] transition-transform duration-300 group-hover:scale-110 group-hover:text-white" />
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                                {item.categoryTitle}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.65)]">
                                30s Timer • 10 Questions
                              </p>
                            </div>
                          </div>

                          <p className="text-lg font-semibold text-white transition-colors group-hover:text-cyan-300">
                            {item.subcategory}
                          </p>
                          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-300">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          {item.formattedDateRange}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 transition-colors group-hover:text-cyan-200">
                          Open challenge
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <ExploreSections exclude="challenges" />
      </div>
    </div>
  );
}
