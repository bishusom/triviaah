// components/trivias/QuizSummary.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { FaFacebook, FaWhatsapp, FaMedal, FaTrophy, FaCopy } from 'react-icons/fa';
import { FaSmile, FaMeh, FaFrown, FaGrinStars, FaAngry } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useUser } from '@/context/UserContext';

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
    '🏆 Trivia Deity! The knowledge gods bow before you! Can you maintain your reign?',
    '🧠 Mind = Blown! Think you can top this perfect score? Try again!',
  ],
  silver: [
    '✨ Brainiac Alert! One more round could push you to perfection!',
    '🚀 Knowledge Rocket! You are just one launch away from trivia greatness!',
  ],
  bronze: [
    '👏 Solid Effort! Your next attempt could be your breakthrough!',
    '📚 Bookworm Rising! Every replay makes you wiser - try again!',
  ],
  zero: [
    '💥 Knowledge Explosion Incoming! Stick around - the next attempt will be better!',
    '🎯 Fresh Start! Now that you have warmed up, the real game begins!',
  ],
  default: [
    '🌱 Sprouting Scholar! Every replay makes you stronger - continue your journey!',
  ],
};

export default function QuizSummary({
  result,
  onRestart,
  scoreAlreadySaved = false
}: {
  result: QuizResult;
  onRestart: () => void;
  scoreAlreadySaved?: boolean;
}) {
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [globalHigh, setGlobalHigh] = useState<HighScore | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useUser();

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
      console.log('Fetching high scores for category:', result.category);
      const res = await fetch(`/api/highscores?category=${result.category}`);
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      console.log('API Response:', data);
      
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

  /* ---------- core save (only for manual saves now) ---------- */
  const saveScoreCore = async (name: string) => {
    if (saving || scoreAlreadySaved) return;
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

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      await fetchHighScores(); // Refresh leaderboard
    } catch (error) {
      console.error('Failed to save score:', error);
    } finally {
      setSaving(false);
    }
  };

  //Refresh leaderboard after scores are saved
  useEffect(() => {
    const handleScoreSaved = () => {
      fetchHighScores(); // Refresh the leaderboard
    };

    window.addEventListener('scoreSaved', handleScoreSaved);
    
    return () => {
      window.removeEventListener('scoreSaved', handleScoreSaved);
    };
  }, [fetchHighScores]);

  /* ---------- performance message ---------- */
  const ratio = result.correctCount / result.totalQuestions;
  const perf = ratio === 0 ? 'zero' : ratio >= 0.9 ? 'gold' : ratio >= 0.7 ? 'silver' : 'bronze';
  const randomMessage = MESSAGES[perf][Math.floor(Math.random() * MESSAGES[perf].length)];

  /* ---------- social share ---------- */
  const shareOnSocial = async (platform: string, result: QuizResult) => {
    const formattedCategory = formatCategory(result.category);
    const shareText = `I scored ${result.score} points in ${formattedCategory} trivia! Got ${result.correctCount}/${result.totalQuestions} correct in ${formatTime(result.timeUsed)}. Can you beat me? #TriviaQuiz`;
    const shareUrl = `${window.location.origin}/api/share?score=${result.score}&correct=${result.correctCount}&total=${result.totalQuestions}&category=${encodeURIComponent(formattedCategory)}&time=${result.timeUsed}`;

    switch (platform) {
      case 'facebook':
        // Check if FB SDK is loaded and properly initialized
        if (typeof window !== 'undefined' && window.FB && window.FB.ui) {
          try {
            window.FB.ui({
              method: 'share',
              href: shareUrl,
              quote: shareText
            }, (response: { error_message?: string } | undefined) => {
              if (response && !response.error_message) {
                console.log('Shared successfully:', response);
              } else {
                console.error('Share failed:', response && 'error_message' in response ? response.error_message : 'Unknown error');
                // Fallback to direct link
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                  '_blank'
                );
              }
            });
          } catch (error) {
            console.error('Facebook share error:', error);
            // Fallback to direct link
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
              '_blank'
            );
          }
        } else {
          console.log('Facebook SDK not available, using fallback');
          // Direct fallback without app_id to avoid errors
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            '_blank'
          );
        }
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
        break;
      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
          '_blank'
        );
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
          alert('Copied to clipboard!');
        } catch (err) {
          console.error('Failed to copy: ', err);
          alert('Failed to copy to clipboard');
        }
        break;  
    }
  };

  const medalIcon = (i: number) =>
    i === 0 ? <FaTrophy className="text-yellow-500 mr-2" /> :
    i === 1 ? <FaMedal className="text-gray-400 mr-2" /> :
    i === 2 ? <FaMedal className="text-amber-600 mr-2" /> :
    <span className="mr-2">{i + 1}.</span>;

  return (
    <>
      <Script async defer src="https://connect.facebook.net/en_US/sdk.js#xfbml=true" crossOrigin="anonymous" />
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

            {/* Only show manual save input if score hasn't been saved yet and user is guest */}
            {!scoreAlreadySaved && user?.isGuest && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Save your score</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="px-4 py-2 border rounded-lg flex-grow"
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

            {/* Show confirmation if score was already saved */}
            {scoreAlreadySaved && (
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <p className="text-green-800 text-center">
                  ✅ Score saved successfully!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* social */}
        <div className="mb-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Share Your Score</h3>
          <div className="flex justify-center gap-4">
            <button onClick={() => shareOnSocial('facebook', result)} 
              className="flex items-center justify-center w-10 h-10 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
              aria-label="Share on Facebook">
                <FaFacebook size={20} />
            </button>
            <button onClick={() => shareOnSocial('twitter', result)} 
              className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Share on X">
                <FaXTwitter size={20} />
            </button>
            <button onClick={() => shareOnSocial('whatsapp', result)} 
              className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              aria-label="Share on Whatsapp">
                <FaWhatsapp size={20} />
            </button>
            <button onClick={() => shareOnSocial('copy', result)} 
              className="flex items-center justify-center w-10 h-10 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              aria-label="Copy to clipboard">
                <FaCopy size={18} />
            </button>
          </div>
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

        <div className="flex justify-center">
          <Link
            href="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}