import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { ArrowLeft, Calendar, Clock, Flame, Sparkles } from 'lucide-react';

import QuizGame from '@/components/trivias/QuizGame';
import {
  getWeeklyChallengeByIdOrSlug,
  getWeeklyChallengeQuestions,
  getWeeklyChallenges,
} from '@/lib/challenges';

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const challenge = await getWeeklyChallengeByIdOrSlug(slug);

  if (!challenge) {
    return {
      title: 'Challenge Quiz Not Found | Triviaah',
      robots: { index: false, follow: true },
    };
  }

  const canonical = `https://triviaah.com/challenges/${challenge.slug}/quiz`;

  return {
    title: `${challenge.subcategory} Weekly Quiz | 30s Timer | Triviaah`,
    description: `Play the timed 30-second weekly trivia quiz for ${challenge.subcategory} (${challenge.categoryTitle}). 10 questions with instant feedback and score tracking.`,
    alternates: { canonical },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: `${challenge.subcategory} Weekly Quiz | 30s Timer | Triviaah`,
      description: `Play the timed 30-second weekly trivia quiz for ${challenge.subcategory}.`,
      url: canonical,
      siteName: 'Triviaah',
      images: [{ url: challenge.heroImage, width: 1024, height: 1024 }],
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const challenges = await getWeeklyChallenges();
  return challenges.map((challenge) => ({ slug: challenge.slug }));
}

export default async function ChallengeQuizPage({ params }: PageProps) {
  const { slug } = await params;
  const challenge = await getWeeklyChallengeByIdOrSlug(slug);

  if (!challenge) {
    notFound();
  }

  const questions = await getWeeklyChallengeQuestions(challenge, 10);

  if (!questions || questions.length === 0) {
    notFound();
  }

  const canonical = `https://triviaah.com/challenges/${challenge.slug}/quiz`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#050812] via-[#090e1f] to-[#030610] px-4 py-6 text-white sm:px-6 lg:px-8">
      {/* ── Schema.org Quiz Data ─────────────────────────────────────── */}
      <Script
        id={`structured-data-quiz-${challenge.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Quiz',
            name: `${challenge.subcategory} Weekly Challenge Quiz`,
            description: challenge.description,
            url: canonical,
            numberOfQuestions: questions.length,
            timeRequired: 'PT5M',
            hasPart: questions.map((q, idx) => ({
              '@type': 'Question',
              position: idx + 1,
              name: q.question,
              eduQuestionType: 'Multiple choice',
              text: q.question,
              suggestedAnswer: q.options.map((opt) => ({
                '@type': 'Answer',
                text: opt,
              })),
              acceptedAnswer: {
                '@type': 'Answer',
                text: q.correct,
              },
            })),
          }),
        }}
      />

      <div className="mx-auto max-w-4xl">
        {/* Header Navigation & Info Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/challenges/${challenge.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition-colors hover:text-cyan-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to challenge overview
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 font-bold text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              {challenge.categoryTitle}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-bold text-gray-300">
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
              {challenge.formattedDateRange}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 font-black text-emerald-300">
              <Clock className="h-3.5 w-3.5" />
              30s Timer
            </span>
          </div>
        </div>

        {/* Quiz Game Container */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl backdrop-blur sm:p-6 lg:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-black text-white sm:text-3xl">
              {challenge.subcategory} Challenge
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              10 questions • 30 seconds per question • Test your mastery
            </p>
          </div>

          <QuizGame
            initialQuestions={questions}
            category={challenge.category}
            subcategory={challenge.subcategory}
            quizConfig={{
              isQuickfire: false,
              timePerQuestion: 30,
              hasBonusQuestion: false,
              regularQuestionCount: questions.length,
            }}
            quizType="trivias"
            showDailyTriviaHistory={false}
          />
        </div>
      </div>
    </main>
  );
}
