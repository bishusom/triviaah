// components/trivias/QuizSummary.tsx (Modern Gaming UI)
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Check, Crown, Home, LogIn, Medal, RotateCcw, Share2, Trophy } from 'lucide-react';
import FeedbackComponent from '@/components/common/FeedbackComponent';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/user/Authmodal';

type QuizResult = {
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeUsed: number;
  category: string;
  subcategory?: string;
  isTimedMode?: boolean;
  helpUsed?: number;
};

type HighScore = {
  id: string;
  name: string;
  score: number;
  category: string;
  user_id?: string;
};

const MESSAGES = {
  gold: [
    "🏆 Trivia Deity! The knowledge gods bow before you! Can you maintain your reign?",
    "🧠 Mind = Blown! Think you can top this perfect score? Try again!",
    "🤯 Unstoppable Genius! Ready for an even bigger challenge next round?",
    "🎖️ Absolute Legend! The leaderboard needs your name again!"
  ],
  silver: [
    "✨ Brainiac Alert! One more round could push you to perfection!",
    "🚀 Knowledge Rocket! You're just one launch away from trivia greatness!",
    "💎 Diamond Mind! Polish your skills further with another game!",
    "🧩 Puzzle Master! Can you complete the picture perfectly next time?"
  ],
  bronze: [
    "👍 Solid Effort! Your next attempt could be your breakthrough!",
    "📚 Bookworm Rising! Every replay makes you wiser - try again!",
    "💡 Bright Spark! Your knowledge is growing - fuel it with another round!",
    "🏅 Contender Status! The podium is within reach - one more try!"
  ],
  zero: [
    "💥 Knowledge Explosion Incoming! Stick around - the next attempt will be better!",
    "🎯 Fresh Start! Now that you've warmed up, the real game begins!",
    "🔥 Fueling Curiosity! Your learning journey starts here - play again!",
    "🚀 Launch Pad Ready! First attempts are just practice - try for real now!",
    "🌱 Seeds of Knowledge Planted! Water them with another try!"
  ],
  default: [
    "🌱 Sprouting Scholar! Every replay makes you stronger - continue your journey!",
    "🦉 Wise Owl in Training! The more you play, the wiser you become!",
    "📖 Chapter 1 Complete! Turn the page to your next knowledge adventure!",
    "🧭 Learning Compass Active! Your next game could be your true north!"
  ]
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
  const { user, profile } = useAuth();
  
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [globalHigh, setGlobalHigh] = useState<HighScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  /* ---------- helpers ---------- */
  const formatCategory = (s: string) =>
    s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  /* ---------- fetch leaderboard ---------- */
  const fetchHighScores = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/highscores?category=${result.category}`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.localHighScores && Array.isArray(data.localHighScores)) {
        setHighScores(data.localHighScores);
        setGlobalHigh(data.globalHigh || null);
      } else if (Array.isArray(data)) {
        setHighScores(data);
      } else {
        console.warn('Unexpected response structure:', data);
        setHighScores([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setHighScores([]);
    } finally {
      setIsLoading(false);
    }
  }, [result.category]);

  useEffect(() => {
    fetchHighScores();
  }, [result.category]);

  /* ---------- Get display name based on auth status ---------- */
  const getDisplayName = useCallback(() => {
    if (user && profile) {
      return profile.display_name || profile.username || user.email?.split('@')[0] || 'Player';
    }
    return 'Guest Player';
  }, [user, profile]);

  /* ---------- getSignupMessage helper ---------- */
  const getSignupMessage = () => {
    const accuracy = result.correctCount / result.totalQuestions;
    
    if (accuracy >= 0.9) {
      return "👑 You're in the top 10%! Register to compete on the global leaderboards.";
    } else if (result.score > 300) {
      return "📊 This could be your new personal best! Create an account to track all your achievements.";
    } else if (result.score > 150) {
      return "⭐ Great score! Sign up to save it permanently and track your progress.";
    } else {
      return "✨ Want to save this score to your permanent record? Sign up now!";
    }
  };

  /* ---------- Handle sign in after quiz ---------- */
  const handleSignIn = () => {
    setShowAuthModal(true);
  };

  /* ---------- performance message ---------- */
  const ratio = result.correctCount / result.totalQuestions;
  const perf = ratio === 0 ? 'zero' : ratio >= 0.9 ? 'gold' : ratio >= 0.7 ? 'silver' : ratio >= 0.5 ? 'bronze' : 'default';
  const randomMessage = useMemo(() => {
      const ratio = result.correctCount / result.totalQuestions;
      const perf = ratio === 0 ? 'zero' : ratio >= 0.9 ? 'gold' : ratio >= 0.7 ? 'silver' : ratio >= 0.5 ? 'bronze' : 'default';
      return MESSAGES[perf][Math.floor(Math.random() * MESSAGES[perf].length)];
    }, [result.correctCount, result.totalQuestions]);

  /* ---------- share to clipboard ---------- */
  const shareScore = async () => {
    const formattedCategory = formatCategory(result.category);
    const categoryDisplay = result.subcategory 
      ? `${formattedCategory} - ${result.subcategory}`
      : formattedCategory;
      
    const shareText = `I scored ${result.score} points in ${categoryDisplay} trivia! Got ${result.correctCount}/${result.totalQuestions} correct in ${formatTime(result.timeUsed)}. Can you beat me?`;
    const shareUrl = `${window.location.origin}/api/share?score=${result.score}&correct=${result.correctCount}&total=${result.totalQuestions}&category=${encodeURIComponent(categoryDisplay)}&time=${result.timeUsed}`;
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
        alert('Failed to copy to clipboard. Please manually copy the text.');
      }
      document.body.removeChild(textArea);
    }
  };

  const medalIcon = (i: number) =>
    i === 0 ? <Crown className="text-yellow-400 mr-2 text-xl" /> :
    i === 1 ? <Medal className="text-gray-300 mr-2 text-lg" /> :
    i === 2 ? <Medal className="text-amber-600 mr-2 text-lg" /> :
    <span className="mr-2 text-gray-400">{i + 1}.</span>;

  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-full md:max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-2xl p-6 md:p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Trophy className="text-3xl md:text-4xl text-yellow-300" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Quiz Complete!</h2>
            <p className="text-lg md:text-xl text-cyan-100">{randomMessage}</p>
          </div>

          <div className="p-4 md:p-6 lg:p-8">
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
              {/* Results Card */}
              <div className="bg-gradient-to-br from-gray-750 to-gray-800 rounded-xl border border-gray-600 p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
                  <Trophy className="text-yellow-400" />
                  Your Results
                </h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex justify-between items-center py-2 md:py-3 border-b border-gray-600">
                    <span className="text-gray-300">Score:</span>
                    <span className="font-bold text-xl md:text-2xl text-cyan-400">{result.score}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 md:py-3 border-b border-gray-600">
                    <span className="text-gray-300">Correct Answers:</span>
                    <span className="font-semibold text-white">{result.correctCount}/{result.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 md:py-3 border-b border-gray-600">
                    <span className="text-gray-300">Time:</span>
                    <span className="font-semibold text-white">{formatTime(result.timeUsed)}</span>
                  </div>
                  <div className="flex justify-between items-start py-2 md:py-3">
                    <span className="text-gray-300">Category:</span>
                    <span className="text-right text-white font-semibold">
                      {result.subcategory ? (
                        <>
                          {formatCategory(result.category)}
                          <br />
                          <span className="text-sm text-gray-400">({result.subcategory})</span>
                        </>
                      ) : (
                        formatCategory(result.category)
                      )}
                    </span>
                  </div>
                </div>
                
                {globalHigh && (
                  <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-600">
                    <div className="flex items-center gap-2 text-sm">
                      <Crown className="text-yellow-400" />
                      <span className="text-gray-300">
                        Global High: <span className="text-white font-semibold">{globalHigh.score}</span> by <span className="text-cyan-400">{globalHigh.name}</span>
                        {globalHigh.score > result.score && (
                          <span className="text-xs ml-2 text-gray-400">({globalHigh.score - result.score} pts ahead)</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Leaderboard Card */}
              <div className="space-y-4 md:space-y-6">
                <div className="bg-gradient-to-br from-gray-750 to-gray-800 rounded-xl border border-gray-600 p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
                    <Medal className="text-amber-400" />
                    {formatCategory(result.category)} High Scores
                  </h3>
                  {isLoading ? (
                    <div className="text-center py-6 md:py-8 text-gray-400">
                      <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-cyan-500 mx-auto mb-2"></div>
                      Loading leaderboard...
                    </div>
                  ) : highScores.length === 0 ? (
                    <div className="text-center text-gray-500 py-6 md:py-8">
                      No scores yet for this category
                    </div>
                  ) : (
                    <div className="space-y-2 md:space-y-3">
                      {highScores.slice(0, 5).map((s, i) => (
                        <div key={s.id || i} className="flex justify-between items-center py-2 md:py-3 px-3 md:px-4 bg-gray-700/50 rounded-lg border border-gray-600">
                          <div className="flex items-center">
                            {medalIcon(i)}
                            <span className={i === 0 ? "font-bold text-white text-sm md:text-base" : "text-gray-300 text-sm md:text-base"}>{s.name}</span>
                            {s.user_id && (
                              <span className="ml-2 text-xs text-cyan-400" title="Authenticated User">✓</span>
                            )}
                          </div>
                          <span className={i === 0 ? "font-bold text-yellow-400 text-lg" : "text-white font-semibold"}>{s.score}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Player Score Display */}
                <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl border border-cyan-500/30 p-4 md:p-6">
                  <div className="flex justify-between items-center mb-2 md:mb-3">
                    <span className="font-bold text-white text-base md:text-lg">Your Score</span>
                    <span className="font-bold text-xl md:text-2xl text-cyan-400">{result.score}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs md:text-sm">
                    <span className="text-gray-300">
                      {getDisplayName()}
                      {user && <span className="ml-2 text-cyan-400 text-xs">✓</span>}
                    </span>
                    <span className="text-gray-300">
                      {result.correctCount}/{result.totalQuestions} correct
                    </span>
                  </div>
                  
                  {/* Save Status */}
                  <div className="mt-3 p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                    <p className="text-green-400 text-center text-xs font-medium">
                      ✅ Score automatically saved {user ? 'to your account' : 'for this session'}
                    </p>
                  </div>

                  {/* Authentication Prompt for Guests */}
                  {!user && (
                    <div className="mt-3 p-3 rounded-lg border border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                      <p className="text-sm mb-2 font-medium text-cyan-300 text-center">
                        {getSignupMessage()}
                      </p>
                      <button
                        onClick={handleSignIn}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <LogIn className="w-4 h-4" />
                        Sign Up for Permanent Tracking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Share Button */}
            <div className="mb-6 md:mb-8 text-center">
              <button 
                onClick={shareScore}
                className="inline-flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                {copied ? (
                  <>
                    <Check className="text-green-300 text-lg md:text-xl" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="text-lg md:text-xl" />
                    <span>Share Your Score</span>
                  </>
                )}
              </button>
              <p className="text-gray-400 text-xs md:text-sm mt-2 md:mt-3">
                Copy your results to share on any social media
              </p>
            </div>

            {/* Feedback component */}
            <div className="mb-6 md:mb-8">
              <FeedbackComponent
                gameType="trivia"
                category={result.category}
                metadata={{
                  score: result.score,
                  correctCount: result.correctCount,
                  totalQuestions: result.totalQuestions,
                  timeUsed: result.timeUsed,
                  performance: perf,
                  subcategory: result.subcategory,
                  difficulty: 'mixed',
                  completedAt: new Date().toISOString()
                }}
              />
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
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
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
          <div 
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl">
              <AuthModal 
                isOpen={showAuthModal} 
                onClose={() => setShowAuthModal(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}