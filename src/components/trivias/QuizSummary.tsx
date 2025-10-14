// components/trivias/QuizSummary.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { MdShare } from "react-icons/md";
import { FaMedal, FaTrophy, FaCheck } from 'react-icons/fa';
import FeedbackComponent from '@/components/common/FeedbackComponent';
import { getPersistentGuestId, rerollGuestId } from '@/lib/guestId';

type QuizResult = {
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeUsed: number;
  category: string;
  isTimedMode?: boolean;
};

type HighScore = {
  id: string;
  name: string;
  score: number;
  category: string;
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
}: {
  result: QuizResult;
  onRestart: () => void;
}) {
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [globalHigh, setGlobalHigh] = useState<HighScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const alias = getPersistentGuestId();
  const [displayName, setDisplayName] = useState(alias);
  
  // Add refs to track save attempts and prevent duplicates
  const saveAttemptedRef = useRef(false);
  const mountedRef = useRef(true);

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
      
      // Handle the response structure
      if (data.localHighScores && Array.isArray(data.localHighScores)) {
        setHighScores(data.localHighScores);
        setGlobalHigh(data.globalHigh || null);
      } else if (Array.isArray(data)) {
        // Fallback for direct array response
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
  }, [fetchHighScores]);

  
  /* ---------- Improved save score with duplicate prevention ---------- */
  const saveScoreCore = useCallback(async (name: string) => {
    // Multiple layers of duplicate prevention
    if (saving || scoreSaved || saveAttemptedRef.current || !mountedRef.current) {
      console.log('Save prevented:', { 
        saving, 
        scoreSaved, 
        saveAttempted: saveAttemptedRef.current,
        mounted: mountedRef.current 
      });
      return;
    }
    
    console.log('Starting save process for:', name);
    saveAttemptedRef.current = true;
    setSaving(true);
    
    try {
      const response = await fetch('/api/highscores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          score: result.score,
          category: result.category,
          difficulty: 'mixed',
        }),
      });

      if (response.ok && mountedRef.current) {
        console.log('Score saved successfully');
        setScoreSaved(true);
        await fetchHighScores(); // Refresh leaderboard
      }
    } catch (error) {
      console.error('Failed to save score:', error);
      // Reset the attempt flag on error so user can retry
      saveAttemptedRef.current = false;
    } finally {
      if (mountedRef.current) {
        setSaving(false);
      }
    }
  }, [saving, scoreSaved, result.score, result.category, fetchHighScores]);

  // Cleanup effect to track component mounting
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Single effect to handle initial save with better guards
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (!saveAttemptedRef.current && !scoreSaved && !saving) {
      // Add a small delay to avoid React StrictMode double execution
      timeoutId = setTimeout(() => {
        if (mountedRef.current && !saveAttemptedRef.current) {
          console.log('Triggering initial save');
          saveScoreCore(displayName);
        }
      }, 100);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [displayName, saveScoreCore, saving, scoreSaved]); // Now includes all dependencies

   /* ---------- tiny reroll icon ---------- */
  const handleReroll = () => {
    if (scoreSaved || saving) {
      console.log('Reroll prevented - score already saved or saving in progress');
      return;
    }
    
    const newAlias = rerollGuestId();
    setDisplayName(newAlias);
    // Reset the attempt flag and trigger a new save
    saveAttemptedRef.current = false;
    saveScoreCore(newAlias);
  }

  /* ---------- performance message ---------- */
  const ratio = result.correctCount / result.totalQuestions;
  const perf = ratio === 0 ? 'zero' : ratio >= 0.9 ? 'gold' : ratio >= 0.7 ? 'silver' : 'bronze';
  const randomMessage = MESSAGES[perf][Math.floor(Math.random() * MESSAGES[perf].length)];

  /* ---------- share to clipboard ---------- */
  const shareScore = async () => {
    const formattedCategory = formatCategory(result.category);
    const shareText = `I scored ${result.score} points in ${formattedCategory} trivia! Got ${result.correctCount}/${result.totalQuestions} correct in ${formatTime(result.timeUsed)}. Can you beat me?`;
    const shareUrl = `${window.location.origin}/api/share?score=${result.score}&correct=${result.correctCount}&total=${result.totalQuestions}&category=${encodeURIComponent(formattedCategory)}&time=${result.timeUsed}`;
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for browsers that don't support clipboard API
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
    i === 0 ? <FaTrophy className="text-yellow-500 mr-2" /> :
    i === 1 ? <FaMedal className="text-gray-400 mr-2" /> :
    i === 2 ? <FaMedal className="text-amber-600 mr-2" /> :
    <span className="mr-2">{i + 1}.</span>;

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="bg-blue-600 text-white rounded-lg p-6 mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-xl">{randomMessage}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* results */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Your Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span>Score:</span><span>{result.score}</span></div>
              <div className="flex justify-between"><span>Correct:</span><span>{result.correctCount}/{result.totalQuestions}</span></div>
              <div className="flex justify-between"><span>Time:</span><span>{formatTime(result.timeUsed)}</span></div>
              <div className="flex justify-between"><span>Category:</span><span>{formatCategory(result.category)}</span></div>
            </div>
            {globalHigh && (
              <div className="mt-6 pt-4 border-t">
                <FaTrophy className="inline mr-2 text-yellow-500" />
                Global High: {globalHigh.score} by {globalHigh.name}
                {globalHigh.score > result.score && (
                  <span className="text-sm ml-2">({globalHigh.score - result.score} pts ahead)</span>
                )}
              </div>
            )}
          </div>

          {/* leaderboard */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">High Scores</h3>
              {isLoading ? (
                <div className="text-center">Loading...</div>
              ) : highScores.length === 0 ? (
                <div className="text-center text-gray-500">No scores yet for this category</div>
              ) : (
                <div className="space-y-2">
                  {highScores.slice(0, 5).map((s, i) => (
                    <div key={s.id || i} className="flex justify-between items-center">
                      <div className="flex items-center">{medalIcon(i)}{s.name}</div>
                      <span>{s.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Show manual save input for guest users */}
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                {displayName}
                <button
                  onClick={handleReroll}
                  disabled={scoreSaved || saving}
                  className="text-xs text-blue-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                  title={scoreSaved ? "Score already saved" : "Get a new random name"}
                >
                  🔄
                </button>
              </span>
              <span>{result.score}</span>
            </div>

            {/* Show confirmation if score was saved */}
            {scoreSaved && (
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <p className="text-green-800 text-center">
                  ✅ Score saved successfully! as <span className="font-semibold">{displayName}</span>
                </p>
              </div>
            )}

            {/* Show saving state */}
            {saving && !scoreSaved && (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-center">
                  ⏳ Saving your score...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Share button */}
        <div className="mb-8 text-center">
          <button 
            onClick={shareScore}
            className="flex items-center justify-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <FaCheck className="text-green-300" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <MdShare />
                Share Your Score
              </>
            )}
          </button>
          <p className="text-gray-600 text-sm mt-2">
            Copy your results to share on any social media
          </p>
        </div>

        {/* Feedback component */}
        <FeedbackComponent
          gameType="trivia"
          category={result.category}
          metadata={{
            score: result.score,
            correctCount: result.correctCount,
            totalQuestions: result.totalQuestions,
            timeUsed: result.timeUsed,
            performance: perf, // 'gold', 'silver', 'bronze', 'zero', 'default'
            // Add any other relevant data
            difficulty: 'mixed', // or extract from result if available
            completedAt: new Date().toISOString()
          }}
        />
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}