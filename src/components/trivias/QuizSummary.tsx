'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Medal, RotateCcw, Share2, Trophy, 
  BookOpen, XCircle, CheckCircle2, User
} from 'lucide-react';
import FeedbackComponent from '@/components/common/FeedbackComponent';
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
  gold: ["🏆 Trivia Deity!", "🧠 Mind = Blown!", "🤯 Unstoppable Genius!"],
  silver: ["✨ Brainiac Alert!", "🚀 Knowledge Rocket!", "💎 Diamond Mind!"],
  bronze: ["👍 Great Effort!", "📈 On the Rise!", "🎯 Nice Aim!"],
  participation: ["🌱 Learning Mode", "📚 Keep Reading!", "🔄 Try Again!"]
};

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
  const [playerMoniker] = useState(getPersistentGuestId()); // Get the player's moniker
  
  const saveAttemptedRef = useRef(false);

  const fetchHighScores = useCallback(async () => {
    try {
      const res = await fetch(`/api/highscores?category=${result.category}`);
      const data = await res.json();
      setHighScores(Array.isArray(data) ? data : data.localHighScores || []);
    } catch (err) {
      console.error("Leaderboard fetch failed", err);
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
        console.error("Save failed", err);
      }
    };
    saveScore();
  }, [result, fetchHighScores, playerMoniker]);

  const percentage = Math.round((result.correctCount / result.totalQuestions) * 100);
  const tier = percentage >= 90 ? 'gold' : percentage >= 70 ? 'silver' : percentage >= 40 ? 'bronze' : 'participation';
  const rankMessage = MESSAGES[tier][Math.floor(Math.random() * MESSAGES[tier].length)];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: Results */}
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl flex flex-col items-center text-center">
          <div className="relative mb-4">
            <Trophy className={`w-16 h-16 ${tier === 'gold' ? 'text-yellow-400' : 'text-gray-400'}`} />
          </div>

          <h1 className="text-3xl font-black italic uppercase mb-1">{rankMessage}</h1>
          
          {/* Display Player Moniker */}
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
              <button onClick={() => setShowReview(!showReview)} className="bg-gray-700 py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors">
                <BookOpen size={20} /> {showReview ? "GOT IT!" : "SEE WHAT I MISSED"}
              </button>
              <button className="bg-indigo-600 py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-indigo-500">
                <Share2 size={20} /> SHARE
              </button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Leaderboard */}
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-gray-800/50 rounded-3xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-yellow-500 uppercase tracking-tighter">
            <Medal /> Category Leaderboard
          </h3>

          {isLoadingScores ? (
            <div className="space-y-3 animate-pulse">
              {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-gray-700 rounded-xl w-full" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {highScores.map((s, i) => (
                <div key={s.id} className={`flex justify-between items-center p-3 rounded-xl border ${s.name === playerMoniker ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-gray-900/30 border-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500">{i + 1}</span>
                    <span className={`font-bold text-sm ${s.name === playerMoniker ? 'text-cyan-400' : 'text-gray-200'}`}>
                        {s.name} {s.name === playerMoniker && "(You)"}
                    </span>
                  </div>
                  <span className="font-black text-white">{s.score}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Review Section with Perfect Score Logic */}
      <AnimatePresence>
        {showReview && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="w-full max-w-4xl mt-6 space-y-4 overflow-hidden">
             {result.wrongAnswers.length > 0 ? (
               result.wrongAnswers.map((item, idx) => (
                 <div key={idx} className="bg-gray-800 border border-gray-700 p-4 rounded-2xl shadow-xl">
                   <p className="text-sm font-bold text-gray-200 mb-3">{item.question}</p>
                   <div className="flex flex-wrap gap-3">
                     <div className="text-xs font-bold text-red-400 bg-red-400/10 px-4 py-2 rounded-xl border border-red-400/20 flex items-center gap-2">
                        <XCircle size={14} /> {item.userSelected}
                     </div>
                     <div className="text-xs font-bold text-green-400 bg-green-400/10 px-4 py-2 rounded-xl border border-green-400/20 flex items-center gap-2">
                        <CheckCircle2 size={14} /> {item.correct}
                     </div>
                   </div>
                 </div>
               ))
             ) : (
               /* This shows when the player answers all questions correctly */
               <div className="bg-green-500/10 border border-green-500/30 p-10 rounded-3xl text-center">
                 <div className="flex justify-center mb-4">
                    <div className="bg-green-500 rounded-full p-3 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                        <CheckCircle2 className="text-white" size={32} />
                    </div>
                 </div>
                 <p className="text-green-400 font-black text-2xl mb-1 uppercase italic">Flawless Victory!</p>
                 <p className="text-green-300/60 text-sm">You didn't miss a single question. You are a true Master of {result.category}!</p>
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="mt-20 w-full max-w-4xl">
        <FeedbackComponent
          gameType="trivia"
          category={result.category}
          metadata={{
            score: result.score,
            correctCount: result.correctCount,
            totalQuestions: result.totalQuestions,
            timeUsed: result.timeUsed,
            performance: result.correctCount / result.totalQuestions >= 0.9 ? 'gold' : 
                        result.correctCount / result.totalQuestions >= 0.7 ? 'silver' : 
                        result.correctCount / result.totalQuestions >= 0.5 ? 'bronze' : 'default',
            subcategory: result.subcategory,
            difficulty: 'mixed',
            completedAt: new Date().toISOString()
          }}
        />
      </div>
      {/* Action buttons */}
      <div className="mt-12 flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
        {/* Show Play Again only for regular trivias, not quick-fire or today-in-history */}
        {context === 'trivias' && result.category !== 'quick-fire' && result.category !== 'today-in-history' && (
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