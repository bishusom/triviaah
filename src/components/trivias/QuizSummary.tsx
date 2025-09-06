// components/trivias/QuizSummary.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { FaMedal, FaTrophy, FaCopy, FaCheck } from 'react-icons/fa';
import { FaSmile, FaMeh, FaFrown, FaGrinStars, FaAngry } from 'react-icons/fa';
import { useUser } from '@/context/UserContext';
import { useSession } from 'next-auth/react';

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
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const { user } = useUser();
  const { data: session, status } = useSession();

  /* ---------- helpers ---------- */
  const formatCategory = (s: string) =>
    s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  /* ------- feedback ------------ */
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedback = async (rating: number) => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          category: result.category,
          score: result.score,
          correctCount: result.correctCount,
          totalQuestions: result.totalQuestions
        }),
      });
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  /* ---------- fetch leaderboard ---------- */
  const fetchHighScores = async () => {
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
  };

  useEffect(() => {
    fetchHighScores();
  }, [result.category]);

  /* ---------- Save score for authenticated users automatically ---------- */
  useEffect(() => {
    const saveScoreForAuthenticatedUser = async () => {
      if (status === 'authenticated' && session?.user && !scoreSaved) {
        try {
          setSaving(true);
          const response = await fetch('/api/highscores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: session.user.name || 'Anonymous',
              score: result.score,
              category: result.category,
              difficulty: 'mixed',
              correctCount: result.correctCount,
              totalQuestions: result.totalQuestions,
              timeUsed: result.timeUsed
            }),
          });

          if (response.ok) {
            setScoreSaved(true);
            await fetchHighScores(); // Refresh leaderboard
          }
        } catch (error) {
          console.error('Failed to save score:', error);
        } finally {
          setSaving(false);
        }
      }
    };

    saveScoreForAuthenticatedUser();
  }, [status, session, result, scoreSaved]);

  /* ---------- Manual save for guest users ---------- */
  const saveScoreCore = async (name: string) => {
    if (saving || scoreSaved) return;
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

      if (response.ok) {
        setScoreSaved(true);
        await fetchHighScores(); // Refresh leaderboard
      }
    } catch (error) {
      console.error('Failed to save score:', error);
    } finally {
      setSaving(false);
    }
  };

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
              {status === 'authenticated' && (
                <div className="flex justify-between text-green-600">
                  <span>Player:</span>
                  <span>{session.user?.name || 'Anonymous'}</span>
                </div>
              )}
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
            {status !== 'authenticated' && !scoreSaved && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Save your score</h3>
                <p className="text-sm text-gray-600 mb-3">Enter your name to save your score to the leaderboard</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="px-4 py-2 border rounded-lg flex-grow"
                    maxLength={20}
                  />
                  <button
                    onClick={() => saveScoreCore(playerName.trim() || 'Guest')}
                    disabled={saving || !playerName.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            )}

            {/* Show confirmation if score was saved */}
            {scoreSaved && (
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <p className="text-green-800 text-center">
                  ✅ Score saved successfully!
                  {status === 'authenticated' && session.user?.name && (
                    <> as <span className="font-semibold">{session.user.name}</span></>
                  )}
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
                <FaCopy />
                Share Your Score
              </>
            )}
          </button>
          <p className="text-gray-600 text-sm mt-2">
            Copy your results to share on any social media
          </p>
        </div>

        {feedbackSubmitted ? (
          <div className="mb-8 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">Thank you for your feedback! 💫</p>
              <p className="text-green-800">For detailed feedback, use <a href="/contact" className="underline">our contact form</a>.</p>
            </div>
          </div>
        ) : (
          <div className="mb-8 text-center">
              <h3 className="text-xl font-semibold mb-4">How was your quiz experience?</h3>
              <p className="text-gray-600 mb-4 text-sm">Your feedback helps us improve!</p>
              <div className="flex justify-center gap-4">
                {[
                  { icon: FaGrinStars, label: 'Excellent', value: 5 },
                  { icon: FaSmile, label: 'Good', value: 4 },
                  { icon: FaMeh, label: 'Average', value: 3 },
                  { icon: FaFrown, label: 'Poor', value: 2 },
                  { icon: FaAngry, label: 'Bad', value: 1 }
                ].map(({ icon: Icon, label, value }) => (
                  <button
                    key={value}
                    onClick={() => handleFeedback(value)}
                    className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors group"
                    aria-label={label}
                  >
                    <Icon 
                      size={28} 
                      className="text-gray-500 group-hover:text-blue-600 transition-colors" 
                    />
                    <span className="text-xs text-gray-600 mt-1">{label}</span>
                  </button>
                ))}
              </div>
            </div>
        )}  

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