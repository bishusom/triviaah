// components/trivias/QuizSummary.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { FaFacebook, FaWhatsapp, FaMedal, FaTrophy, FaCopy } from 'react-icons/fa';
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
    '👍 Solid Effort! Your next attempt could be your breakthrough!',
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
}: {
  result: QuizResult;
  onRestart: () => void;
}) {
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [globalHigh, setGlobalHigh] = useState<HighScore | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user, login } = useUser();

  /* ---------- helpers ---------- */
  const formatCategory = (s: string) =>
    s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  /* ---------- fetch leaderboard ---------- */
  const fetchHighScores = async () => {
    setIsLoading(true);
    const res = await fetch(`/api/highscores?category=${result.category}`);
    const data = await res.json();
    setHighScores(data.localHighScores || []);
    setGlobalHigh(data.globalHigh || null);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchHighScores();
  }, [result.category]);

  /* ---------- core save ---------- */
  const saveScoreCore = async (name: string) => {
    if (saving) return;
    setSaving(true);
    await fetch('/api/highscores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        score: result.score,
        category: result.category,
        difficulty: 'mixed',
      }),
    });
    await fetchHighScores();
    if (user?.isGuest && name !== 'Guest') {
      login({ ...user, name, isGuest: false });
    }
    setSaving(false);
  };

  /* ---------- auto-save on load ---------- */
  useEffect(() => {
    if (!user) return;
    const nameToSave = !user.isGuest && user.name ? user.name : 'Guest';
    saveScoreCore(nameToSave);
  }, [user]);

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
        if (window.FB) {
          window.FB.ui({
            method: 'share',
            href: shareUrl,
            quote: shareText
          }, (response) => {
            if (response && !response.error_message) {
              console.log('Shared successfully:', response);
            } else {
              console.error('Share failed:', response?.error_message);
              // Fallback to sharer.php
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}&app_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`,
                '_blank'
              );
            }
          });
        } else {
          console.error('Facebook SDK not loaded');
          // Fallback to sharer.php
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}&app_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`,
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
                <div className="text-center">Loading…</div>
              ) : (
                highScores.slice(0, 5).map((s, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center">{medalIcon(i)}{s.name}</div>
                    <span>{s.score}</span>
                  </div>
                ))
              )}
            </div>

            {/* only show input to real guests */}
            {user?.isGuest && (
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
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
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