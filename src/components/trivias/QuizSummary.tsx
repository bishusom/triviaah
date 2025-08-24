'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { FaFacebook, FaWhatsapp, FaMedal, FaTrophy } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

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
  onRestart
}: {
  result: QuizResult;
  onRestart: () => void;
}) {
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [globalHigh, setGlobalHigh] = useState<HighScore | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shareImageUrl, setShareImageUrl] = useState('');
  const shareCardRef = useRef<HTMLDivElement>(null);

  const formatCategory = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-');
  };

  const getPerformance = () => {
    const ratio = result.correctCount / result.totalQuestions;
    if (ratio === 0) return 'zero';
    if (ratio >= 0.9) return 'gold';
    if (ratio >= 0.7) return 'silver';
    return 'bronze';
  };

  const performance = getPerformance();
  const randomMessage = MESSAGES[performance][Math.floor(Math.random() * MESSAGES[performance].length)];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchHighScores = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/highscores?category=${result.category}`);
      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      setHighScores(data.localHighScores || []);
      setGlobalHigh(data.globalHigh || null);
    } catch (error) {
      console.error("Failed to load high scores", error);
      setHighScores([]);
      setGlobalHigh(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHighScores();
  }, [result.category]);

  const generateShareImage = async (result: QuizResult) => {
    const formattedCategory = formatCategory(result.category);
    const shareText = `I scored ${result.score} points in ${formattedCategory} trivia!`;

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: result.score,
          correct: result.correctCount,
          total: result.totalQuestions,
          category: formattedCategory,
          time: result.timeUsed,
          text: shareText
        })
      });

      if (!response.ok) throw new Error('Image generation failed');
      const data = await response.json();
      setShareImageUrl(data.imageUrl || '');
    } catch (error) {
      console.error('Error generating share image:', error);
    }
  };

  useEffect(() => {
    generateShareImage(result);
  }, [result]);

  const saveScore = async () => {
    if (!playerName.trim()) return;

    try {
      const response = await fetch('/api/highscores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: playerName,
          score: result.score,
          category: result.category,
          difficulty: 'mixed'
        })
      });

      if (!response.ok) throw new Error('Failed to save');

      setIsSubmitted(true);
      await fetchHighScores();
    } catch (error) {
      console.error("Failed to save score", error);
    }
  };

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
    }
  };

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0: return <FaTrophy className="text-yellow-500 mr-2" />;
      case 1: return <FaMedal className="text-gray-400 mr-2" />;
      case 2: return <FaMedal className="text-amber-600 mr-2" />;
      default: return <span className="mr-2">{index + 1}.</span>;
    }
  };

  return (
    <>
      <Script
        async
        defer
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=true"
        crossOrigin="anonymous"
        onLoad={() => {
          window.FB.init({
            appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v2.4'
          });
          console.log('Facebook SDK initialized');
        }}
      />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="bg-blue-600 text-white rounded-lg p-6 mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-xl">📌 {randomMessage}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Your Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Score:</span>
                <span>{result.score}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Correct Answers:</span>
                <span>{result.correctCount}/{result.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Time Taken:</span>
                <span>{formatTime(result.timeUsed)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Category:</span>
                <span>{result.category.replace(/-/g, ' ')}</span>
              </div>
            </div>
            {globalHigh && (
              <div className="mt-6 pt-4 border-t">
                <div className="font-medium">
                  <FaTrophy className="inline mr-2 text-yellow-500" />
                  Global High: {globalHigh.score} by {globalHigh.name}
                </div>
                {globalHigh.score > result.score && (
                  <div className="text-sm mt-1">
                    You&apos;re {globalHigh.score - result.score} points behind!
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">High Scores</h3>
              {isLoading ? (
                <div className="text-center">Loading high scores...</div>
              ) : (
                <div className="space-y-2">
                  {highScores.slice(0, 5).map((score, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        {getMedalIcon(index)}
                        <span>{score.name}</span>
                      </div>
                      <span>{score.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {!isSubmitted && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Save your score</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Your name"
                    className="px-4 py-2 border rounded-lg flex-grow"
                  />
                  <button
                    onClick={saveScore}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg whitespace-nowrap"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mb-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Share Your Score</h3>
          {shareImageUrl && (
            <div className="mb-6 mx-auto max-w-xs">
              <img
                src={shareImageUrl}
                alt="Share preview"
                className="rounded-lg border-2 border-gray-200 shadow-md"
              />
            </div>
          )}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => shareOnSocial('facebook', result)}
              className="flex items-center justify-center w-10 h-10 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
              aria-label="Share on Facebook"
            >
              <FaFacebook size={20} />
            </button>
            <button
              onClick={() => shareOnSocial('twitter', result)}
              className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Share on Twitter"
            >
              <FaXTwitter size={20} />
            </button>
            <button
              onClick={() => shareOnSocial('whatsapp', result)}
              className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              aria-label="Share on WhatsApp"
            >
              <FaWhatsapp size={20} />
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