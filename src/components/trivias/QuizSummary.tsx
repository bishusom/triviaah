'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Medal, RotateCcw, Share2, Trophy,
  BookOpen, XCircle, CheckCircle2, User, CalendarDays, ArrowRight
} from 'lucide-react';
import FeedbackComponent from '@/components/common/FeedbackComponent';
import Ads from '@/components/common/Ads';
import { getPersistentGuestId } from '@/lib/guestId';

type QuizResult = {
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeUsed: number;
  category: string;
  subcategory?: string;
  wrongAnswers: { question: string; correct: string; userSelected: string }[];
};

type HighScore = {
  id: string;
  name: string;
  score: number;
};

const MESSAGES = {
  gold:          ['🏆 Trivia Deity!', '🧠 Mind = Blown!', '🤯 Unstoppable Genius!'],
  silver:        ['✨ Brainiac Alert!', '🚀 Knowledge Rocket!', '💎 Diamond Mind!'],
  bronze:        ['👍 Great Effort!', '📈 On the Rise!', '🎯 Nice Aim!'],
  participation: ['🌱 Learning Mode', '📚 Keep Reading!', '🔄 Try Again!'],
};

interface HistoricalDay {
  label: string;
  dateParam: string;
}

const getLast7Days = (): HistoricalDay[] =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (i + 1));
    return {
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dateParam: d.toISOString().split('T')[0],
    };
  });

export default function QuizSummary({
  result,
  onRestart,
  context = 'trivias',
}: {
  result: QuizResult;
  onRestart: () => void;
  context?: 'trivias' | 'daily-trivias' | 'quick-fire';
}) {
  const [showReview, setShowReview] = useState(false);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [isLoadingScores, setIsLoadingScores] = useState(true);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [playerMoniker] = useState(getPersistentGuestId());

  const resultsRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const saveAttemptedRef = useRef(false);

  const fetchHighScores = useCallback(async () => {
    try {
      const res = await fetch(`/api/highscores?category=${result.category}`);
      const data = await res.json();
      setHighScores(Array.isArray(data) ? data : data.localHighScores || []);
    } catch (err) {
      console.error('Leaderboard fetch failed', err);
    } finally {
      setIsLoadingScores(false);
    }
  }, [result.category]);

  useEffect(() => {
    const saveScore = async () => {
      if (saveAttemptedRef.current) return;
      saveAttemptedRef.current = true;
      try {
        await fetch('/api/highscores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: playerMoniker,
            score: result.score,
            category: result.category,
            correct_answers: result.correctCount,
            total_questions: result.totalQuestions,
            time_used: result.timeUsed,
          }),
        });
        setScoreSaved(true);
        fetchHighScores();
      } catch (err) {
        console.error('Save failed', err);
      }
    };
    saveScore();
  }, [result, fetchHighScores, playerMoniker]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (showReview) {
      requestAnimationFrame(() => {
        reviewRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
      return;
    }

    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, [showReview]);

  const handleReviewToggle = () => {
    setShowReview((current) => !current);
  };

  const percentage = Math.round((result.correctCount / result.totalQuestions) * 100);
  const tier =
    percentage >= 90 ? 'gold' :
    percentage >= 70 ? 'silver' :
    percentage >= 40 ? 'bronze' : 'participation';
  const rankMessage = MESSAGES[tier][Math.floor(Math.random() * MESSAGES[tier].length)];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex flex-col items-center">

      {/* Row 1: Results + Leaderboard */}
      <div ref={resultsRef} className="w-full max-w-4xl grid lg:grid-cols-2 gap-6">

        {/* Results card */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl flex flex-col items-center text-center"
        >
          <div className="relative mb-4">
            <Trophy className={`w-16 h-16 ${tier === 'gold' ? 'text-yellow-400' : 'text-gray-400'}`} />
          </div>

          <h1 className="text-3xl font-black italic uppercase mb-1">{rankMessage}</h1>

          <div className="flex items-center gap-2 bg-gray-900/50 px-4 py-1.5 rounded-full border border-white/5 mb-6">
            <User size={14} className="text-cyan-400" />
            <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">{playerMoniker}</span>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full mb-6">
            <div className="bg-gray-900/50 p-4 rounded-2xl border border-white/5">
              <p className="text-gray-500 text-[10px] uppercase font-bold">Score</p>
              <p className="text-xl font-black text-cyan-400">{result.score}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-2xl border border-white/5">
              <p className="text-gray-500 text-[10px] uppercase font-bold">Accuracy</p>
              <p className="text-xl font-black text-green-400">{percentage}%</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-2xl border border-white/5">
              <p className="text-gray-500 text-[10px] uppercase font-bold">Time</p>
              <p className="text-xl font-black text-purple-400">{result.timeUsed}s</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleReviewToggle}
                className="bg-gray-700 py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
              >
                <BookOpen size={20} />
                {showReview ? 'GOT IT!' : (
                  <>
                    <span className="sm:hidden">REVIEW</span>
                    <span className="hidden sm:inline">REVIEW MISSED</span>
                  </>
                )}
              </button>
              <button className="bg-indigo-600 py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-indigo-500">
                <Share2 size={20} /> SHARE
              </button>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard card */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-gray-800/50 rounded-3xl p-6 border border-gray-700"
        >
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-yellow-500 uppercase tracking-tighter">
            <Medal /> Category Leaderboard
          </h3>

          {isLoadingScores ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-12 bg-gray-700 rounded-xl w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {highScores.map((s, i) => (
                <div
                  key={s.id}
                  className={`flex justify-between items-center p-3 rounded-xl border ${
                    s.name === playerMoniker
                      ? 'bg-cyan-500/10 border-cyan-500/30'
                      : 'bg-gray-900/30 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500">{i + 1}</span>
                    <span className={`font-bold text-sm ${s.name === playerMoniker ? 'text-cyan-400' : 'text-gray-200'}`}>
                      {s.name} {s.name === playerMoniker && '(You)'}
                    </span>
                  </div>
                  <span className="font-black text-white">{s.score}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Ad 1: after score reveal, before review
          Horizontal banner. High-attention position - user just saw their
          score and is deciding what to do next. Uses the leaderboard slot
          (you can swap to a dedicated slot once you have one).           */}
      <div className="w-full max-w-4xl mt-6">
        <Ads
          slot="2207590813"
          format="horizontal"
          isMobileFooter={false}
          className="rounded-xl overflow-hidden"
        />
      </div>

      {/* Review section */}
      <AnimatePresence>
        {showReview && (
          <motion.div
            ref={reviewRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full max-w-4xl mt-6 space-y-4 overflow-hidden"
          >
            {result.wrongAnswers.length > 0 ? (
              result.wrongAnswers.map((item, idx) => (
                <div key={idx} className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl shadow-xl">
                  <p className="text-sm font-bold text-white mb-4 leading-relaxed">{item.question}</p>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-rose-400/20 bg-rose-400/8 px-4 py-3">
                      <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-rose-300">
                        <XCircle size={14} />
                        Your answer
                      </div>
                      <p className="text-sm font-semibold text-slate-100 leading-relaxed break-words">
                        {item.userSelected}
                      </p>
                    </div>
                    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/8 px-4 py-3">
                      <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                        <CheckCircle2 size={14} />
                        Correct answer
                      </div>
                      <p className="text-sm font-semibold text-slate-100 leading-relaxed break-words">
                        {item.correct}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-green-500/10 border border-green-500/30 p-10 rounded-3xl text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-500 rounded-full p-3 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                    <CheckCircle2 className="text-white" size={32} />
                  </div>
                </div>
                <p className="text-green-400 font-black text-2xl mb-1 uppercase italic">Flawless Victory!</p>
                <p className="text-green-300/60 text-sm">
                  You didn&apos;t miss a single question. You are a true Master of {result.category}!
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback */}
      <div className="mt-8 w-full max-w-4xl">
        <FeedbackComponent
          gameType="trivia"
          category={result.category}
          metadata={{
            score: result.score,
            correctCount: result.correctCount,
            totalQuestions: result.totalQuestions,
            timeUsed: result.timeUsed,
            performance:
              result.correctCount / result.totalQuestions >= 0.9 ? 'gold' :
              result.correctCount / result.totalQuestions >= 0.7 ? 'silver' :
              result.correctCount / result.totalQuestions >= 0.5 ? 'bronze' : 'default',
            subcategory: result.subcategory,
            difficulty: 'mixed',
            completedAt: new Date().toISOString(),
          }}
        />
      </div>

      {/* Previous daily quizzes (daily-trivias only) */}
      {context === 'daily-trivias' && result.category !== 'quick-fire' && (
        <div className="mt-12 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-sm font-black italic uppercase tracking-tighter flex items-center gap-2 text-cyan-300">
              <RotateCcw size={18} className="text-cyan-400" />
              Missed a Day?
            </h3>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-200">
              <CalendarDays size={12} />
              Previous 7 Sessions
            </span>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3">
            {getLast7Days().map((day: HistoricalDay) => (
              <Link
                key={day.dateParam}
                href={`/daily-trivias/${result.category}?date=${day.dateParam}`}
                className="group relative flex min-h-[92px] flex-col items-center justify-between overflow-hidden rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-3 sm:p-4 text-center shadow-lg shadow-cyan-950/20 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_18px_40px_rgba(34,211,238,0.18)]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_50%)] opacity-80 transition-opacity group-hover:opacity-100" />
                <div className="relative z-10 flex w-full items-center justify-between gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-cyan-200/80">
                    Replay
                  </span>
                  <ArrowRight size={12} className="text-cyan-300 transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="relative z-10 flex flex-1 flex-col items-center justify-center py-2">
                  <p className="text-[11px] sm:text-xs font-black text-white transition-colors group-hover:text-cyan-200">
                    {day.label}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300/90">
                    Play Again
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Ad 2: after feedback, before action buttons
          Keeps the feedback widget high enough to notice, while preserving
          the existing ad break before the final actions.                  */}
      <div className="w-full max-w-4xl mt-10">
        <Ads
          slot="9040722315"
          format="auto"
          isInArticle={true}
          isMobileFooter={false}
          className="rounded-xl overflow-hidden"
        />
      </div>

      {/* Ad 3: above action buttons
          Mobile footer style on small screens, inline on desktop.
          Last impression before the user navigates away.                */}
      <div className="w-full max-w-4xl mt-10">
        <Ads
          slot="2207590813"
          format="horizontal"
          isMobileFooter={false}
          className="rounded-xl overflow-hidden"
        />
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
        {context === 'trivias' &&
          result.category !== 'quick-fire' &&
          result.category !== 'today-in-history' && (
            <button
              onClick={() => onRestart()}
              className="flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              <RotateCcw className="text-lg md:text-xl" />
              Play Again
            </button>
          )}

        {context === 'trivias' ? (
          <>
            <Link
              href={`/trivias/${result.category}`}
              className="flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-center text-sm md:text-base"
            >
              Back to Category
            </Link>
            <Link
              href="/trivias"
              className="flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-center text-sm md:text-base"
            >
              All Categories
            </Link>
          </>
        ) : (
          <Link
            href="/daily-trivias"
            className="flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-center text-sm md:text-base"
          >
            Daily Trivias
          </Link>
        )}

        <Link
          href="/"
          className="flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-center text-sm md:text-base"
        >
          <Home className="text-lg md:text-xl" />
          Home
        </Link>
      </div>
    </div>
  );
}
