import React from 'react';
import { Sparkles, ChevronDown, CheckCircle, Lightbulb, Brain, Tag } from 'lucide-react';
import type { BrainwaveWarmupPuzzle } from '@/lib/brainwave/brainwave-warmup-data';

interface BrainwaveWarmupProps {
  puzzles: BrainwaveWarmupPuzzle[];
  gameTitle: string;
}

export default function BrainwaveWarmup({ puzzles, gameTitle }: BrainwaveWarmupProps) {
  if (!puzzles || puzzles.length === 0) {
    return null;
  }

  const questionSchemas = puzzles.map((p, idx) => ({
    '@type': 'Question',
    name: p.clue,
    position: idx + 1,
    acceptedAnswer: {
      '@type': 'Answer',
      text: p.answer,
    },
  }));

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: `${gameTitle} Practice Clue Challenge`,
    description: `Sample practice deduction clues and verified solutions for ${gameTitle}.`,
    educationalLevel: 'Intermediate',
    about: {
      '@type': 'Thing',
      name: gameTitle,
    },
    hasPart: questionSchemas,
  };

  return (
    <section className="my-10 rounded-3xl border border-white/10 bg-white/[0.04] p-5 md:p-7 shadow-2xl backdrop-blur-xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
              <Brain className="h-3.5 w-3.5" />
              Practice Deduction
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
              ✓ Daily Mystery Safe (Practice only)
            </span>
          </div>
          <h2 className="text-2xl font-black text-white sm:text-3xl">
            {gameTitle} Warmup: 3 Sample Puzzles
          </h2>
          <p className="mt-1 text-sm text-white/75 max-w-2xl">
            Test your deductive reasoning with these sample clue trails before solving today&apos;s live daily mystery. Click to reveal the verified answer and backstory.
          </p>
        </div>
      </div>

      {/* Clue Accordions */}
      <div className="space-y-3.5">
        {puzzles.map((p, index) => (
          <details
            key={p.id || index}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-black/30 transition-all duration-200 hover:border-cyan-500/40 hover:bg-black/40 open:border-cyan-400/50 open:bg-black/60"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 sm:p-5 text-left font-semibold text-white focus:outline-none">
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/10 text-xs font-black text-cyan-300">
                  #{index + 1}
                </span>
                <div className="min-w-0">
                  <span className="text-base sm:text-lg font-medium text-slate-100 group-hover:text-cyan-200 transition-colors">
                    {p.clue}
                  </span>
                  {p.category && (
                    <span className="ml-2 inline-block rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-200">
                      {p.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline text-xs font-medium text-cyan-400/80 group-open:hidden">
                  Reveal Solution
                </span>
                <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-300 group-open:rotate-180 group-hover:text-cyan-300" />
              </div>
            </summary>

            <div className="border-t border-white/10 bg-slate-950/60 p-4 sm:p-5 text-sm text-gray-300 space-y-3">
              {/* Correct Solution */}
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-emerald-200">
                <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                    Answer / Target Solution
                  </span>
                  <span className="text-base font-bold text-white">
                    {p.answer}
                  </span>
                </div>
              </div>

              {/* Clue Hints / Attributes */}
              {p.hints && p.hints.length > 0 && (
                <div className="pt-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                    Deduction Clues
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {p.hints.map((hint, hintIdx) => (
                      <span
                        key={hintIdx}
                        className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 text-xs text-cyan-200"
                      >
                        <Tag className="h-3 w-3 text-cyan-400" />
                        {hint}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Factoid / Backstory */}
              {p.factoid && (
                <div className="flex items-start gap-2.5 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-cyan-200">
                  <Lightbulb className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 block">
                      Trivia Backstory
                    </span>
                    <p className="mt-0.5 text-sm leading-relaxed text-gray-200">
                      {p.factoid}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
