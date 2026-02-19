"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Search, Share2, Flame, History, Zap, Eye, EyeOff,
  Target, Sparkles, Calendar, Trophy, Clapperboard,
} from 'lucide-react';
import Image from 'next/image';
import { checkLetterGuess } from '@/lib/brainwave/core-logic';
import { saveGameResult } from '@/lib/brainwave/supabase-service';
import { getPersistentGuestId } from '@/lib/guestId';
import { useSound } from '@/context/SoundContext';
import { event } from '@/lib/gtag';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HintField {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

export interface GameConfig {
  category: string;
  primaryColor?: string;
  maxAttempts?: number;
  posterRevealType?: 'blur' | 'blocks';
  posterGridCols?: number;
  posterGridRows?: number;
  renderHeader?: (data: any) => React.ReactNode;
  renderQuestion: (data: any, attempts: any[], gameState: 'playing' | 'won' | 'lost') => React.ReactNode;
  renderHints?: (data: any, attempts: any[], gameState: 'playing' | 'won' | 'lost') => React.ReactNode;
  hintFields?: HintField[][];
  renderEndGame?: (
    data: any,
    attempts: any[],
    gameState: 'won' | 'lost',
    shareMessage: string,
    onShare: () => void,
    onCopy: () => void
  ) => React.ReactNode;
  renderInput?: (props: {
    value: string;
    onChange: (val: string) => void;
    onSubmit: () => void;
    disabled: boolean;
    gameState: 'playing';
  }) => React.ReactNode;
  renderGuessGrid?: (attempts: any[]) => React.ReactNode;
  renderFooter?: (data: any, attempts: any[], gameState: string) => React.ReactNode;
  onWin?: (attemptsCount: number) => void;
  onLoss?: (attemptsCount: number) => void;
}

interface GameShellProps {
  data: any;
  config: GameConfig;
}

// ─── EnhancedProgressiveHint ─────────────────────────────────────────────────
// Defined OUTSIDE GameShell — stable component reference prevents remount on re-render

// All style variants use fully static class strings so Tailwind's scanner can
// detect and include them in the production bundle — no dynamic string assembly.
const PROGRESSIVE_HINTS: Array<{
  icon: string;
  getMsg: (correct: number, present: number) => string;
  wrapperClass: string;
  textClass: string;
}> = [
  {
    icon: '🎯',
    getMsg: (correct) =>
      `Great start! You have ${correct} correct letter${correct !== 1 ? 's' : ''}.`,
    wrapperClass:
      'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30',
    textClass: 'text-green-400',
  },
  {
    icon: '🔍',
    getMsg: (_, present) =>
      `${present} letter${present !== 1 ? 's' : ''} ${present !== 1 ? 'are' : 'is'} in the title but misplaced.`,
    wrapperClass:
      'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30',
    textClass: 'text-yellow-400',
  },
  {
    icon: '🤔',
    getMsg: () => 'Compare letter positions. Focus on the green letters first.',
    wrapperClass:
      'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30',
    textClass: 'text-blue-400',
  },
  {
    icon: '💡',
    getMsg: () => 'Use the revealed hints below to narrow down your options.',
    wrapperClass:
      'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30',
    textClass: 'text-purple-400',
  },
  {
    icon: '⚡',
    getMsg: () => 'Final clues! Use every hint and think about what fits the pattern.',
    wrapperClass:
      'bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30',
    textClass: 'text-red-400',
  },
];

function EnhancedProgressiveHint({ attempts }: { attempts: any[] }) {
  if (attempts.length === 0) return null;

  const latest = attempts[attempts.length - 1];
  const correct = latest.letterStatuses?.filter((s: string) => s === 'correct').length ?? 0;
  const present = latest.letterStatuses?.filter((s: string) => s === 'present').length ?? 0;
  const idx = Math.min(attempts.length - 1, PROGRESSIVE_HINTS.length - 1);
  const hint = PROGRESSIVE_HINTS[idx];

  return (
    <div className={`${hint.wrapperClass} rounded-2xl p-4 mb-4`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">{hint.icon}</span>
        <span className={`font-semibold text-sm ${hint.textClass}`}>
          {hint.getMsg(correct, present)}
        </span>
      </div>
      <div className="flex gap-1">
        {latest.letterStatuses?.map((status: string, i: number) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded transition-all duration-500 ${
              status === 'correct'
                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                : status === 'present'
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── DefaultHints carousel ────────────────────────────────────────────────────

/** Convert camelCase to snake_case for DB key fallback */
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

/** Look up a hint value: try camelCase key, then snake_case key, then top-level data */
function resolveHintValue(data: any, key: string): any {
  const snakeKey = toSnakeCase(key);
  return (
    data.validationHints?.[key] ??
    data.validationHints?.[snakeKey] ??
    data[key] ??
    data[snakeKey] ??
    null
  );
}

function DefaultHints({
  data,
  attempts,
  fields,
}: {
  data: any;
  attempts: any[];
  fields: HintField[][];
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const unlocked = Math.min(attempts.length, fields.length);

  useEffect(() => {
    const latest = unlocked - 1;
    if (latest >= 0) {
      setActiveIdx(latest);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          left: latest * scrollRef.current.offsetWidth,
          behavior: 'smooth',
        });
      }
    }
  }, [unlocked]);

  if (unlocked === 0) return null;

  // Build slides. A slide is shown as long as it has at least one non-empty field.
  // Fields with no data are simply omitted from the slide — the slide itself still renders.
  const items = fields
    .slice(0, unlocked)
    .map((levelFields, lvl) => {
      const rows = levelFields
        .map((field) => {
          const value = resolveHintValue(data, field.key);
          if (value === null || value === undefined || value === '') return null;
          const display = Array.isArray(value) ? value.join(', ') : String(value);
          return (
            <div key={field.key} className="flex items-center gap-3">
              {field.icon && <span className="text-cyan-400 text-base">{field.icon}</span>}
              <div>
                <p className="text-[9px] uppercase font-black text-gray-500 tracking-widest">
                  {field.label}
                </p>
                <p className="font-bold text-white text-sm">{display}</p>
              </div>
            </div>
          );
        })
        .filter(Boolean);

      // Only skip the slide if it has literally no fields with any data
      if (rows.length === 0) return null;

      return (
        <div key={lvl} className="flex-none w-full snap-center space-y-3">
          {rows}
        </div>
      );
    })
    .filter(Boolean);

  if (items.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-4 mb-4">
      <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2 text-sm">
        <Sparkles className="w-4 h-4" />
        Hints Revealed:
      </h4>
      <div className="relative overflow-hidden">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {items}
        </div>
        {items.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveIdx(i);
                  if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                      left: i * scrollRef.current.offsetWidth,
                      behavior: 'smooth',
                    });
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeIdx ? 'bg-cyan-400 scale-125' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-cyan-400 mt-3 text-center">
        More hints unlock with each guess... ({unlocked}/{fields.length} revealed)
      </p>
    </div>
  );
}

// ─── DefaultGuessGrid ─────────────────────────────────────────────────────────

function DefaultGuessGrid({ attempts }: { attempts: any[] }) {
  if (attempts.length === 0) return null;
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
        <Target className="w-4 h-4" />
        Your Guesses:
      </h3>
      <div className="grid gap-3">
        {attempts.map((attempt, i) => (
          <div key={i} className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
            <div className="flex flex-wrap justify-center gap-2">
              {attempt.guess.split('').map((letter: string, j: number) => {
                const status = attempt.letterStatuses?.[j] ?? 'absent';
                return (
                  <div
                    key={j}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-base font-black uppercase transition-all duration-300 hover:scale-110 ${
                      status === 'correct'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                        : status === 'present'
                        ? 'bg-gradient-to-br from-yellow-500 to-amber-600 text-white'
                        : 'bg-gray-600 border border-gray-500 text-gray-300'
                    }`}
                  >
                    {letter.toUpperCase()}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DefaultInput ─────────────────────────────────────────────────────────────
// CRITICAL: defined outside GameShell so it is a stable component type.
// If defined inside, every GameShell re-render creates a new component identity,
// React unmounts + remounts it, and the input loses focus after every keystroke.

interface DefaultInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

function DefaultInput({ value, onChange, onSubmit, disabled }: DefaultInputProps) {
  return (
    <div className="sticky bottom-0 bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-700 p-4 z-40 -mx-2 md:-mx-5 -mb-2 md:-mb-5">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter title..."
            className="w-full pl-12 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
            disabled={disabled}
            autoComplete="off"
          />
        </div>
        <button
          onClick={onSubmit}
          disabled={!value.trim() || disabled}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 font-semibold"
        >
          {disabled ? '...' : 'GUESS'}
        </button>
      </div>
    </div>
  );
}

// ─── Last7DaysPanel ───────────────────────────────────────────────────────────

function Last7DaysPanel({ category }: { category: string }) {
  const [results, setResults]   = useState<Record<number, 'won' | 'lost' | null>>({});
  const [countdown, setCountdown] = useState('');

  // Read saved local results from localStorage
  useEffect(() => {
    const map: Record<number, 'won' | 'lost' | null> = {};
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(`${category}-`)) continue;
      try {
        const saved = JSON.parse(localStorage.getItem(key) ?? '{}');
        if (!saved.gameState || !saved.date) continue;
        const savedMidnight = new Date(saved.date);
        savedMidnight.setHours(0, 0, 0, 0);
        const diffDays = Math.round(
          (todayMidnight.getTime() - savedMidnight.getTime()) / 86400000
        );
        if (diffDays >= 0 && diffDays < 7) {
          map[diffDays] =
            saved.gameState === 'won' ? 'won'
            : saved.gameState === 'lost' ? 'lost'
            : null;
        }
      } catch {}
    }
    setResults(map);
  }, [category]);

  // Live countdown to local midnight (next puzzle)
  useEffect(() => {
    function calcCountdown() {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // next midnight in local time
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
    }
    calcCountdown();
    const t = setInterval(calcCountdown, 1000);
    return () => clearInterval(t);
  }, []);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  });

  // Count how many past days (days 1-6) are unplayed
  const unplayedPast = days.slice(1).filter((_, i) => results[i + 1] == null).length;

  return (
    <div className="mt-5 bg-gray-900/50 backdrop-blur-lg rounded-3xl border border-gray-700 overflow-hidden">

      {/* Next puzzle countdown banner */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-gray-700 px-5 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Next puzzle in</p>
            <p className="text-3xl font-black text-white tabular-nums tracking-tight">{countdown}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Resets at midnight (your time)</p>
            {unplayedPast > 0 && (
              <p className="text-sm text-purple-400 font-semibold">
                {unplayedPast} past puzzle{unplayedPast > 1 ? 's' : ''} waiting for you ↓
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 7-day grid */}
      <div className="p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
          <Calendar className="w-4 h-4 text-purple-400" />
          Last 7 Days
        </h3>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => {
            const result = results[i];
            const isToday = i === 0;
            const label = isToday
              ? 'Today'
              : day.toLocaleDateString('en-US', { weekday: 'short' });
            const dateNum = day.getDate();

            let cellClass = '';
            let icon: React.ReactNode = dateNum;

            if (result === 'won') {
              cellClass = 'bg-green-500/20 border-green-500/50 text-green-400';
              icon = <span className="text-lg">✓</span>;
            } else if (result === 'lost') {
              cellClass = 'bg-red-500/20 border-red-500/50 text-red-400';
              icon = <span className="text-lg">✗</span>;
            } else if (isToday) {
              // Today, already finished but result not stored yet — shouldn't happen;
              // shown as purple "played today"
              cellClass = 'bg-purple-500/20 border-purple-500/50 text-purple-300';
            } else {
              // Past day — not played, show as a link hint
              cellClass = 'bg-gray-800/60 border-gray-700 text-gray-400 hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-300 cursor-pointer transition-all duration-200';
            }

            // For past unplayed days, link to that day's puzzle
            // (uses query param so page.tsx can handle fetching by date)
            const pastDate = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
            const href = !isToday && result == null
              ? `/brainwave/${category}?date=${pastDate}`
              : undefined;

            const CellWrapper = href
              ? ({ children }: { children: React.ReactNode }) => (
                  <a href={href} className="flex flex-col items-center gap-1">
                    {children}
                  </a>
                )
              : ({ children }: { children: React.ReactNode }) => (
                  <div className="flex flex-col items-center gap-1">{children}</div>
                );

            return (
              <CellWrapper key={i}>
                <div
                  className={`w-full aspect-square rounded-xl border flex items-center justify-center text-xs font-black ${cellClass}`}
                >
                  {icon}
                </div>
                <span className="text-[8px] text-gray-500 uppercase text-center leading-tight font-medium">
                  {label}
                </span>
                {!isToday && result == null && (
                  <span className="text-[7px] text-purple-500 uppercase font-bold">Play</span>
                )}
              </CellWrapper>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-gray-600 uppercase tracking-widest">
          <span className="flex items-center gap-1"><span className="text-green-500">✓</span> Won</span>
          <span className="flex items-center gap-1"><span className="text-red-500">✗</span> Lost</span>
          <span className="flex items-center gap-1"><span className="text-purple-400">Play</span> Not played</span>
        </div>
      </div>
    </div>
  );
}

// ─── InlinePoster ─────────────────────────────────────────────────────────────
// Self-contained poster with block-reveal or blur logic, inlined so there is no
// sizing conflict with a parent component. Container is always relative so
// Next.js <Image fill> has a proper anchor. Block reveal uses a Set for O(1)
// lookup instead of Array.includes (O(n)) which was slow at 1200 blocks.

interface InlinePosterProps {
  category: string;
  title: string;
  attemptsCount: number;
  isGameOver: boolean;
  revealType?: 'blur' | 'blocks';
  gridCols?: number;
  gridRows?: number;
}

function InlinePoster({
  category,
  title,
  attemptsCount,
  isGameOver,
  revealType = 'blocks',
  gridCols = 30,
  gridRows = 40,
}: InlinePosterProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealedSet, setRevealedSet] = useState<Set<number>>(new Set());
  const blockOrderRef = useRef<number[]>([]);
  const totalBlocks = gridCols * gridRows;

  // Build a spatially-distributed random reveal order once
  useEffect(() => {
    if (blockOrderRef.current.length > 0) return;
    const groups: number[][] = [[], [], [], []];
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        groups[(r % 2) * 2 + (c % 2)].push(r * gridCols + c);
      }
    }
    const order: number[] = [];
    groups.forEach((g) => {
      for (let i = g.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [g[i], g[j]] = [g[j], g[i]];
      }
      order.push(...g);
    });
    blockOrderRef.current = order;
  }, [gridCols, gridRows]);

  // Recompute which blocks are revealed whenever attempts / game-over changes
  useEffect(() => {
    if (revealType !== 'blocks') return;
    const pct = isGameOver ? 100 : Math.min(attemptsCount * 10, 60);
    const count = Math.floor(totalBlocks * (pct / 100));
    setRevealedSet(new Set(blockOrderRef.current.slice(0, count)));
  }, [attemptsCount, isGameOver, revealType, totalBlocks]);

  // Fetch poster image from TMDB via your existing API route
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setImageUrl(null);
      try {
        const res = await fetch(`/api/tmdb?title=${encodeURIComponent(title)}`);
        if (!res.ok) throw new Error('fetch failed');
        const json = await res.json();
        if (!cancelled) setImageUrl(json.posterUrl ?? null);
      } catch {
        if (!cancelled) setImageUrl(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [title]);

  // Blur levels (blur mode)
  const blurClass = (() => {
    if (isGameOver) return '';
    const levels = [
      'blur-[50px] grayscale brightness-50',
      'blur-[35px] grayscale-[0.7]',
      'blur-[25px] grayscale-[0.5]',
      'blur-[15px] grayscale-[0.2]',
      'blur-[8px]',
      'blur-[3px]',
    ];
    return levels[attemptsCount] ?? '';
  })();

  const revealPct = isGameOver ? 100 : Math.min(attemptsCount * 10, 60);

  return (
    // Outer glow ring — purely decorative, overflow visible intentionally
    <div className="relative flex-shrink-0" style={{ width: 160, height: 240 }}>
      <div className="absolute -inset-2 bg-gradient-to-t from-purple-600/30 to-blue-600/30 rounded-3xl blur-xl opacity-50 pointer-events-none" />

      {/* Main poster frame — this is the sizing root for <Image fill> */}
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-900 border border-white/10 shadow-2xl"
      >
        {imageUrl ? (
          <>
            {/* Poster image */}
            <Image
              src={imageUrl}
              alt="Poster"
              fill
              className={`object-cover transition-all duration-1000 ease-in-out scale-105 ${
                revealType === 'blur' ? blurClass : ''
              }`}
              priority
              sizes="160px"
            />

            {/* Block overlay (blocks mode) */}
            {revealType === 'blocks' && (
              <div className="absolute inset-0" style={{ zIndex: 10 }}>
                {Array.from({ length: gridRows }, (_, row) =>
                  Array.from({ length: gridCols }, (_, col) => {
                    const idx = row * gridCols + col;
                    if (revealedSet.has(idx)) return null;
                    return (
                      <div
                        key={idx}
                        className="absolute bg-gray-900"
                        style={{
                          left:   `${(col / gridCols) * 100}%`,
                          top:    `${(row / gridRows) * 100}%`,
                          width:  `${100 / gridCols}%`,
                          height: `${100 / gridRows}%`,
                        }}
                      />
                    );
                  })
                )}
              </div>
            )}

            {/* "?" overlay — blocks mode, 0 guesses */}
            {revealType === 'blocks' && attemptsCount === 0 && !isGameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70" style={{ zIndex: 20 }}>
                <div className="text-center">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-purple-500/50">
                    <span className="text-pink-400 text-lg font-bold">?</span>
                  </div>
                  <p className="text-pink-400 text-xs font-semibold">Mystery</p>
                </div>
              </div>
            )}

            {/* Progress bar — blocks mode */}
            {revealType === 'blocks' && (
              <div className="absolute bottom-1.5 left-1.5 right-1.5" style={{ zIndex: 20 }}>
                <div className="bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-purple-400 text-[9px] font-medium">Reveal</span>
                    <span className="text-white text-[9px] font-bold">{revealPct}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-pink-500 h-1 rounded-full transition-all duration-500"
                      style={{ width: `${revealPct}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          // Loading / error state
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-600">
            <Clapperboard className={`w-8 h-8 ${loading ? 'animate-pulse text-gray-500' : 'opacity-20'}`} />
            {loading && <span className="text-[10px]">Loading...</span>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GameShell ────────────────────────────────────────────────────────────────

export default function GameShell({ data, config }: GameShellProps) {
  if (!config) return null;

  const maxAttempts = config.maxAttempts ?? 6;
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<any[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [streak, setStreak] = useState(0);
  const [shareMessage, setShareMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGuessLoading, setIsGuessLoading] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const { isMuted } = useSound();

  // ── Persistence ───────────────────────────────────────────────────────────────

  useEffect(() => {
    getPersistentGuestId();
    const saved = localStorage.getItem(`${config.category}_streak`);
    if (saved) setStreak(parseInt(saved, 10));
  }, [config.category]);

  useEffect(() => {
    const saved = localStorage.getItem(`${config.category}-${data.id}`);
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setAttempts(p.attempts ?? []);
        setGameState(p.gameState ?? 'playing');
      } catch {}
    }
  }, [data.id, config.category]);

  useEffect(() => {
    if (attempts.length > 0 || gameState !== 'playing') {
      localStorage.setItem(
        `${config.category}-${data.id}`,
        // Include `date` so Last7DaysPanel can compute the day offset
        JSON.stringify({
          attempts,
          gameState,
          date: data.date ?? new Date().toISOString().split('T')[0],
        })
      );
    }
  }, [attempts, gameState, data.id, data.date, config.category]);

  // ── Analytics ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    const t = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({
          action: `${config.category}_started`,
          category: config.category,
          label: config.category,
        });
        clearInterval(t);
      }
    }, 100);
    return () => clearInterval(t);
  }, [config.category]);

  // ── Sound & confetti ──────────────────────────────────────────────────────────

  const playSound = useCallback(
    (type: 'correct' | 'incorrect' | 'win' | 'lose' | 'click') => {
      if (isMuted) return;
      new Audio(`/sounds/${type}.mp3`).play().catch(() => {});
    },
    [isMuted]
  );

  const triggerConfetti = useCallback(() => {
    if (!confettiCanvasRef.current) return;
    const myConfetti = confetti.create(confettiCanvasRef.current, { resize: true, useWorker: true });
    myConfetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#3b82f6'],
    });
  }, []);

  // ── Win / Loss ────────────────────────────────────────────────────────────────

  const handleWin = useCallback(
    (newAttempts: any[]) => {
      setGameState('won');
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem(`${config.category}_streak`, newStreak.toString());
      triggerConfetti();
      playSound('win');
      saveGameResult(config.category, {
        success: true,
        attempts: newAttempts.length,
        puzzleId: data.id,
      });
      event({
        action: `${config.category}_win`,
        category: config.category,
        label: `attempts_${newAttempts.length}`,
      });
      config.onWin?.(newAttempts.length);
    },
    [streak, config, data.id, playSound, triggerConfetti]
  );

  const handleLoss = useCallback(() => {
    setGameState('lost');
    playSound('lose');
    saveGameResult(config.category, {
      success: false,
      attempts: maxAttempts,
      puzzleId: data.id,
    });
    event({
      action: `${config.category}_loss`,
      category: config.category,
      label: 'max_attempts',
    });
    config.onLoss?.(maxAttempts);
  }, [config, data.id, maxAttempts, playSound]);

  // ── Guess handler ─────────────────────────────────────────────────────────────

  const onGuess = useCallback(async () => {
    if (gameState !== 'playing' || attempts.length >= maxAttempts || !guess.trim() || isGuessLoading)
      return;

    const normalized = guess.trim();
    if (attempts.some((a) => a.guess.toLowerCase() === normalized.toLowerCase())) {
      setErrorMessage('Already guessed this');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    playSound('click');
    setIsGuessLoading(true);

    try {
      const result = checkLetterGuess(normalized, data.targetTitle ?? data.target_title);
      const newAttempts = [...attempts, result];
      setAttempts(newAttempts);
      setGuess('');

      if (result.isCorrect) {
        handleWin(newAttempts);
      } else if (newAttempts.length >= maxAttempts) {
        handleLoss();
      } else {
        const hasHit = result.letterStatuses?.some(
          (s: string) => s === 'correct' || s === 'present'
        );
        playSound(hasHit ? 'correct' : 'incorrect');
      }
    } catch {
      setErrorMessage('Error processing guess. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsGuessLoading(false);
    }
  }, [gameState, attempts, maxAttempts, guess, isGuessLoading, playSound, data, handleWin, handleLoss]);

  // ── Share ─────────────────────────────────────────────────────────────────────

  const generateShareText = useCallback(() => {
    const start = new Date(2024, 0, 1);
    const num = Math.floor((Date.now() - start.getTime()) / 86400000);
    let text = `${config.category.toUpperCase()} #${num} ${
      gameState === 'won' ? attempts.length : 'X'
    }/${maxAttempts}\n\n`;
    attempts.forEach((a) => {
      a.letterStatuses?.forEach((s: string) => {
        text += s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬜';
      });
      text += '\n';
    });
    text += `\nPlay daily at https://triviaah.com/brainwave/${config.category}`;
    return text;
  }, [config.category, gameState, attempts, maxAttempts]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(generateShareText()).then(() => {
      setShareMessage('Copied to clipboard!');
      playSound('click');
      setTimeout(() => setShareMessage(''), 2000);
    });
  }, [generateShareText, playSound]);

  // ── Derived ───────────────────────────────────────────────────────────────────

  const triesLeft = maxAttempts - attempts.length;
  const triesColor =
    triesLeft >= 4 ? 'text-green-400' : triesLeft >= 2 ? 'text-yellow-400' : 'text-red-400';
  const showHints = gameState === 'playing' && (!hardMode || showHint);

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full text-white font-sans">
      <canvas
        ref={confettiCanvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
      />

      {/*<div className="max-w-xl mx-auto px-3 pb-20">*/}
       <div className="px-3 pb-20">

        {/* Optional custom header (game logo, title) */}
        {config.renderHeader?.(data)}

        {/* Streak pill + history toggle */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span className="text-xs font-bold text-orange-500">{streak}</span>
            <span className="text-[10px] text-orange-400/70 uppercase tracking-wider">streak</span>
          </div>
          <button
            onClick={() => setShowHistory((h) => !h)}
            className={`p-1.5 rounded-lg border transition-all ${
              showHistory
                ? 'bg-white text-black border-white'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'
            }`}
            title="Last 7 days"
          >
            <History className="w-4 h-4" />
          </button>
        </div>

        {/* History quick-look */}
        {showHistory && (
          <div className="mb-4 p-3 bg-gray-900/40 border border-white/5 rounded-2xl animate-in slide-in-from-top-4 duration-300">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">
              Previous 7 Days
            </p>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return (
                  <div key={i} className="flex flex-col items-center gap-0.5">
                    <div className="w-full aspect-square rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
                      {d.getDate()}
                    </div>
                    <span className="text-[7px] text-gray-500 uppercase">
                      {i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Main game card ── */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-5 mb-5">

          {/* Card header: title + tries remaining */}
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-xl">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Today's Puzzle</h2>
            </div>
            <div className={`flex items-center gap-2 text-lg font-bold ${triesColor}`}>
              <Target className="w-5 h-5" />
              <span>
                {triesLeft} {triesLeft === 1 ? 'TRY' : 'TRIES'}
              </span>
            </div>
          </div>

          {/* Poster + question — stacks on mobile, side-by-side on md+ */}
          <div className="flex flex-col md:flex-row gap-6 mb-6 items-center">
            <InlinePoster
              category={config.category}
              title={data.targetTitle ?? data.target_title}
              attemptsCount={attempts.length}
              isGameOver={gameState !== 'playing'}
              revealType={config.posterRevealType ?? 'blocks'}
              gridCols={config.posterGridCols ?? 30}
              gridRows={config.posterGridRows ?? 40}
            />

            {/* Question area */}
            <div className="flex-grow text-center">
              {config.renderQuestion(data, attempts, gameState)}
            </div>
          </div>

          {/* Game controls (hard mode, hint toggle) */}
          <div className="flex flex-wrap gap-3 mb-5">
            <button
              onClick={() => {
                setHardMode((m) => !m);
                playSound('click');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
                hardMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              <Zap className="w-4 h-4" />
              {hardMode ? 'Hard Mode ON' : 'Hard Mode'}
            </button>

            {hardMode && attempts.length > 0 && gameState === 'playing' && (
              <button
                onClick={() => {
                  setShowHint((s) => !s);
                  playSound('click');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl text-sm hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
              >
                {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            )}
          </div>

          {/* Error toast */}
          {errorMessage && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-4 animate-pulse">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0" />
                {errorMessage}
              </div>
            </div>
          )}

          {/* End-game panel — shown above guess grid, matching original layout */}
          {gameState !== 'playing' &&
            (config.renderEndGame ? (
              config.renderEndGame(
                data,
                attempts,
                gameState,
                shareMessage,
                copyToClipboard,
                copyToClipboard
              )
            ) : (
              <div
                className={`rounded-2xl p-6 mb-6 text-center border animate-in zoom-in-95 duration-500 ${
                  gameState === 'won'
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30'
                    : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30'
                }`}
              >
                <div className="flex justify-center mb-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      gameState === 'won'
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                        : 'bg-gradient-to-r from-red-400 to-pink-500'
                    }`}
                  >
                    {gameState === 'won' ? (
                      <Sparkles className="w-8 h-8 text-white" />
                    ) : (
                      <Target className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {gameState === 'won' ? 'Victory! 🎉' : 'Game Over'}
                </h3>
                {gameState === 'won' && (
                  <p className="text-green-400 mb-2">
                    You guessed it in {attempts.length}{' '}
                    {attempts.length === 1 ? 'try' : 'tries'}!
                  </p>
                )}
                <p className="text-gray-300 mb-4">
                  The answer was:{' '}
                  <strong className="text-white">
                    {data.targetTitle ?? data.target_title}
                  </strong>
                </p>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 mx-auto bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-2xl hover:from-purple-600 hover:to-pink-700 font-semibold hover:scale-105 transition-all duration-300"
                >
                  <Share2 className="w-5 h-5" />
                  {shareMessage || 'Share Result'}
                </button>
                {shareMessage && (
                  <p className="text-purple-400 font-semibold animate-pulse mt-3 text-sm">
                    {shareMessage}
                  </p>
                )}
              </div>
            ))}

          {/* Last 7 days + countdown — shown inside the card after game ends */}
          {gameState !== 'playing' && (
            <>
              <div className="border-t border-gray-700 my-4" />
              <Last7DaysPanel category={config.category} />
            </>
          )}

          {/* Progressive + carousel hints — playing only, respects hard mode */}
          {showHints && (
            <>
              <EnhancedProgressiveHint attempts={attempts} />
              {config.renderHints
                ? config.renderHints(data, attempts, gameState)
                : config.hintFields
                ? (
                  <DefaultHints
                    data={data}
                    attempts={attempts}
                    fields={config.hintFields}
                  />
                )
                : null}
            </>
          )}

          {/* Guess grid */}
          {config.renderGuessGrid ? (
            config.renderGuessGrid(attempts)
          ) : (
            <DefaultGuessGrid attempts={attempts} />
          )}

          {/* Input — stable component reference, no focus-stealing remount */}
          {gameState === 'playing' &&
            (config.renderInput ? (
              config.renderInput({
                value: guess,
                onChange: setGuess,
                onSubmit: onGuess,
                disabled: isGuessLoading,
                gameState,
              })
            ) : (
              <DefaultInput
                value={guess}
                onChange={setGuess}
                onSubmit={onGuess}
                disabled={isGuessLoading}
              />
            ))}
        </div>

        {/* Footer (how-to-play, etc.) */}
        {config.renderFooter?.(data, attempts, gameState)}

      </div>
    </div>
  );
}
