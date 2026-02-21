'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import {
  Clapperboard, Sparkles, Calendar, Users, Target,
  Share2, Trophy, Star, FileText, Clock, Zap, Film,
} from 'lucide-react';
import { getDailyPuzzle } from '@/lib/brainwave/supabase-service';
import GameShell from '@/components/brainwave/GameShell';
import FeedbackComponent from '@/components/common/FeedbackComponent';
import MuteButton from '@/components/common/MuteButton';
import Ads from '@/components/common/Ads';

// Structured data (same as before)
const STRUCTURED_DATA = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Triviaah',
    url: 'https://triviaah.com',
    description: 'Free daily trivia quizzes and word games.',
    logo: 'https://triviaah.com/logo.png',
    foundingDate: '2024',
  },
  webpage: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Plotle – Daily Movie Puzzle | Triviaah',
    description:
      'Guess the movie from emoji clues with Wordle-style letter feedback. New puzzle every day!',
    url: 'https://triviaah.com/brainwave/plotle',
    mainEntity: {
      '@type': 'Game',
      name: 'Plotle',
      description:
        'Daily movie guessing game. Decode the emoji sequence and guess the film title using letter feedback and progressive hints.',
      gameLocation: 'https://triviaah.com/brainwave/plotle',
    },
  },
  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Plotle?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Plotle is a daily movie guessing game. Decode an emoji sequence and use Wordle-style letter feedback to identify the movie title in 6 attempts.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I play Plotle?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Look at the emoji clues and type your movie title guess. Green tiles mean the letter is correct; yellow means the letter is in the title but in the wrong spot. Unlock progressive hints after each wrong guess.',
        },
      },
      {
        '@type': 'Question',
        name: 'How often does Plotle update?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A new Plotle puzzle is available every day at midnight in your local time zone. You can also play the last 7 days of past puzzles.',
        },
      },
    ],
  },
};

export default function PlotleGame({ dateParam }: { dateParam?: string }) {
  const [puzzleData, setPuzzleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPastPuzzle, setIsPastPuzzle] = useState(false);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const fetchPuzzle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const customDate = dateParam ? new Date(dateParam) : undefined;
      const data = await getDailyPuzzle('plotle', customDate);
      if (!data) {
        setError('No puzzle found for this date.');
        return;
      }
      // Add computed fields for hints
      const enhancedData = {
        ...data,
        firstLetter: data.targetTitle?.charAt(0).toUpperCase() ?? '?',
        wordCount: data.targetTitle?.split(' ').length ?? 0,
      };
      setPuzzleData(enhancedData);
      setIsPastPuzzle(!!dateParam);
    } catch (e) {
      setError('Failed to load puzzle.');
    } finally {
      setLoading(false);
    }
  }, [dateParam]);

  useEffect(() => {
    fetchPuzzle();
  }, [fetchPuzzle]);

  // GameShell config
  const plotleConfig = {
    category: 'plotle',
    primaryColor: 'purple',
    posterRevealType: 'blocks' as const,
    posterGridCols: 30,
    posterGridRows: 40,
    renderHeader: () => (
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-2xl">
            <Film className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
            PLOTLE
          </h1>
        </div>
        <p className="text-gray-300 text-lg">Daily Movie Guessing Challenge</p>
        {isPastPuzzle && dateParam && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
            <Clock className="w-3 h-3 text-amber-400" />
            <span className="text-amber-400 text-xs font-semibold">
              Past puzzle –{' '}
              {new Date(dateParam).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>
    ),
    renderQuestion: (data: any) => (
      <div className="text-center">
        <div className="flex justify-center items-center gap-2 flex-wrap mb-4">
          {data.emojis?.split(' ').map((emoji: string, i: number) => (
            <span
              key={i}
              className="p-2 md:p-3 bg-gray-700/50 rounded-xl border border-gray-600 flex items-center justify-center"
              style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)' }}
            >
              {emoji}
            </span>
          ))}
        </div>
        <p className="text-gray-400 text-sm">Decode the emoji sequence to guess the movie</p>
      </div>
    ),
    hintFields: [
      [{ key: 'releaseYear', label: 'Release Year', icon: <Calendar size={16} /> }],
      [
        { key: 'genre', label: 'Genre', icon: <Clapperboard size={16} /> },
        { key: 'oscarCategories', label: 'Oscars', icon: <Trophy size={16} /> },
      ],
      [
        { key: 'director', label: 'Director', icon: <Users size={16} /> },
        { key: 'featuredActors', label: 'Stars', icon: <Star size={16} /> },
      ],
      [
        { key: 'imdbRating', label: 'IMDb Rating', icon: <Star size={16} /> },
        { key: 'firstLetter', label: 'Starts with', icon: <span className="text-sm">🔤</span> },
      ],
      [{ key: 'wordCount', label: 'Title length', icon: <FileText size={16} /> }],
    ],
    renderEndGame: (
      data: any,
      attempts: any[],
      gameState: 'won' | 'lost',
      shareMessage: string,
      _onShare: () => void,
      onCopy: () => void
    ) => (
      <div className="mb-8">
        {gameState === 'won' ? (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Victory! 🎉</h3>
            <p className="text-green-400 mb-2">
              Guessed in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!
            </p>
            <p className="text-gray-300">
              The movie was: <strong className="text-white">{data.targetTitle}</strong>
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <Clapperboard className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Game Over</h3>
            <p className="text-red-400">
              The movie was: <strong className="text-white">{data.targetTitle}</strong>
            </p>
          </div>
        )}

        {/* Share + feedback */}
        <div className="flex flex-col items-center gap-4 mt-6">
          <button
            onClick={onCopy}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 hover:scale-105 font-semibold"
          >
            <Share2 className="w-5 h-5" />
            {shareMessage || 'Share Result'}
          </button>
          {shareMessage && (
            <p className="text-purple-400 text-sm font-semibold animate-pulse">{shareMessage}</p>
          )}

          <FeedbackComponent
            gameType="plotle"
            category="brainwave"
            metadata={{
              attempts: attempts.length,
              won: gameState === 'won',
              correctAnswer: data.targetTitle,
            }}
          />

          <div className="flex flex-wrap justify-center gap-3 mt-2 w-full">
            <Link
              href="/"
              className="flex items-center gap-2 bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Home
            </Link>
            <Link
              href="/brainwave"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
            >
              More Games
            </Link>
          </div>
        </div>
      </div>
    ),
    renderFooter: () => (
      <div className="mt-8 bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-800 p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
          <Sparkles className="w-4 h-4 text-purple-400" /> How to Play
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-400">
          <div className="flex items-start gap-2">
            <span>🎬</span> Guess the movie from the emoji clues
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400">🟩</span> Green = correct letter & position
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-400">🟨</span> Yellow = letter in title, wrong spot
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-400">⬜</span> Gray = letter not in the title
          </div>
          <div className="flex items-start gap-2">
            <span>💡</span> Hints unlock after each wrong guess
          </div>
          <div className="flex items-start gap-2">
            <span>🎯</span> 6 attempts to get it right
          </div>
        </div>
      </div>
    ),
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 inline-block mb-4">
            <Clapperboard className="w-10 h-10 text-purple-400 animate-pulse" />
          </div>
          <p className="text-gray-500 text-sm uppercase tracking-widest">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !puzzleData) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clapperboard className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Puzzle Unavailable</h2>
          <p className="text-gray-400 mb-2 text-sm">{error ?? 'No puzzle found.'}</p>
          {isPastPuzzle && (
            <p className="text-gray-500 text-xs mb-6">This date may not have a puzzle yet.</p>
          )}
          <div className="flex flex-col gap-3">
            <button
              onClick={fetchPuzzle}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300"
            >
              Try Again
            </button>
            {isPastPuzzle && (
              <Link
                href="/brainwave/plotle"
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                ← Back to today's puzzle
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-[#050505] py-4">
      {/* Structured data */}
      <Script id="org-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(STRUCTURED_DATA.organization)}
      </Script>
      <Script id="page-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(STRUCTURED_DATA.webpage)}
      </Script>
      <Script id="faq-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(STRUCTURED_DATA.faq)}
      </Script>

      {/* Desktop side ads */}
      {showAds && showDesktopAds && (
        <>
          <div className="fixed left-4 bottom-8 z-40 hidden lg:block">
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-right" />
          </div>
          <div className="fixed right-4 bottom-8 z-40 hidden lg:block">
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-left" />
          </div>
        </>
      )}

      {/* Ad visibility toggles */}
      {showAds && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setShowDesktopAds((v) => !v)}
            className="bg-gray-700/80 hover:bg-gray-600/80 text-white text-xs px-3 py-2 rounded-2xl backdrop-blur-sm hidden lg:block transition-all"
          >
            {showDesktopAds ? 'Hide Ads' : 'Show Ads'}
          </button>
          <button
            onClick={() => setShowMobileAd((v) => !v)}
            className="bg-gray-700/80 hover:bg-gray-600/80 text-white text-xs px-3 py-2 rounded-2xl backdrop-blur-sm lg:hidden transition-all"
          >
            {showMobileAd ? 'Hide Ad' : 'Show Ad'}
          </button>
        </div>
      )}

      {/* Mobile bottom ad */}
      {showAds && showMobileAd && (
        <Ads format="horizontal" isMobileFooter={true} style={{ width: '100%', height: '100px' }} className="lg:hidden" />
      )}

      {/* Mute button */}
      <div className="fixed right-4 z-50" style={{ top: showAds ? '5rem' : '1rem' }}>
        <MuteButton />
      </div>

      {/* Game container – matches original page width */}
      <div className="max-w-4xl lg:max-w-2xl mx-auto px-4 relative z-30">
        <GameShell data={puzzleData} config={plotleConfig} />
      </div>

      {/* FAQ – same width */}
      <div className="max-w-4xl lg:max-w-2xl mx-auto px-4 mt-4 pb-8">
        <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-800 overflow-hidden">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none p-5 hover:bg-gray-800/30 transition-all duration-300">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Game Guide & FAQ</h2>
              <span className="text-purple-400 text-lg group-open:rotate-180 transition-transform duration-300">▼</span>
            </summary>
            <div className="px-5 pb-5 pt-2 border-t border-gray-800 space-y-4">
              {STRUCTURED_DATA.faq.mainEntity.map((item, i) => (
                <div key={i} className="bg-gray-800/40 rounded-2xl p-4">
                  <h3 className="font-semibold text-purple-400 mb-1 text-sm">{item.name}</h3>
                  <p className="text-gray-400 text-sm">{item.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}