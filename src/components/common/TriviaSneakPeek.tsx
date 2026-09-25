import React from 'react';
import Link from 'next/link';
import { HelpCircle, Sparkles, ChevronDown, CheckCircle, Info, Play, Lightbulb } from 'lucide-react';
import type { Question } from '@/lib/supabase';

interface TriviaSneakPeekProps {
  questions: Question[];
  title?: string;
  subtitle?: string;
  badgeText?: string;
  playHref?: string;
  playButtonText?: string;
}

export default function TriviaSneakPeek({
  questions,
  title = 'Topic Warmup: 3 Practice Questions',
  subtitle = 'Test your recall before starting the timed quiz. Click any question to reveal the verified answer and backstory.',
  badgeText = 'Topic Warmup',
  playHref,
  playButtonText = 'Play Full Quiz Now',
}: TriviaSneakPeekProps) {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <section className="my-12 rounded-3xl border border-cyan-500/20 bg-slate-900/80 p-6 shadow-2xl backdrop-blur sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              {badgeText}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
              ✓ Excluded from live scored quiz
            </span>
          </div>
          <h2 className="text-2xl font-black text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-gray-300 max-w-2xl">
            {subtitle}
          </p>
        </div>
        {playHref && (
          <Link
            href={playHref}
            className="hidden sm:inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500"
          >
            <Play className="h-4 w-4 fill-current" />
            {playButtonText}
          </Link>
        )}
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3.5">
        {questions.map((q, index) => {
          const difficultyColor =
            q.difficulty === 'hard'
              ? 'border-red-500/30 text-red-300 bg-red-500/10'
              : q.difficulty === 'medium'
              ? 'border-amber-500/30 text-amber-300 bg-amber-500/10'
              : 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10';

          return (
            <details
              key={q.id || index}
              className="group overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-800/60 transition-all duration-200 hover:border-cyan-500/40 hover:bg-slate-800/90 open:border-cyan-400/50 open:bg-slate-800/95"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 sm:p-5 text-left font-semibold text-white focus:outline-none">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/10 text-xs font-black text-cyan-300">
                    Q{index + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="text-base sm:text-lg font-medium text-slate-100 group-hover:text-cyan-200 transition-colors">
                      {q.question}
                    </span>
                    {q.difficulty && (
                      <span
                        className={`ml-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${difficultyColor}`}
                      >
                        {q.difficulty}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline text-xs font-medium text-cyan-400/80 group-open:hidden">
                    Reveal Answer
                  </span>
                  <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-300 group-open:rotate-180 group-hover:text-cyan-300" />
                </div>
              </summary>

              <div className="border-t border-slate-700/60 bg-slate-900/60 p-4 sm:p-5 text-sm text-gray-300 space-y-3">
                {/* Correct Answer */}
                <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-emerald-200">
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                      Correct Answer
                    </span>
                    <span className="text-base font-bold text-white">
                      {q.correct}
                    </span>
                  </div>
                </div>

                {/* Multiple Choice Options Preview */}
                {q.options && q.options.length > 0 && (
                  <div className="pt-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                      Options in Quiz
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = opt === q.correct;
                        return (
                          <span
                            key={optIdx}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                              isCorrect
                                ? 'border border-emerald-500/50 bg-emerald-500/20 text-emerald-200 font-bold'
                                : 'border border-slate-700 bg-slate-800/80 text-gray-300'
                            }`}
                          >
                            {opt}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Titbits / Fun Fact / Background */}
                {q.titbits && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-cyan-200">
                    <Lightbulb className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 block">
                        Trivia Factoid
                      </span>
                      <p className="mt-0.5 text-sm leading-relaxed text-gray-200">
                        {q.titbits}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </details>
          );
        })}
      </div>

      {/* Mobile CTA */}
      {playHref && (
        <div className="mt-6 sm:hidden">
          <Link
            href={playHref}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20"
          >
            <Play className="h-4 w-4 fill-current" />
            {playButtonText}
          </Link>
        </div>
      )}
    </section>
  );
}
