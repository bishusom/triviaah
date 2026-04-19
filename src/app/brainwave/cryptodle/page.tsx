// app/brainwave/cryptodle/page.tsx
'use client';

import { Suspense, useState, useEffect } from 'react';
import MuteButton from '@/components/common/MuteButton';
import { getDailyCryptodle, type CryptodlePuzzle } from '@/lib/brainwave/cryptodle/cryptodle-sb';
import CryptodleComponent from '@/components/brainwave/CryptodleComponent';
import Ads from '@/components/common/Ads';
import { BookOpen, Clock, Sparkles, Target } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function CryptodleContent() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const [puzzleData, setPuzzleData] = useState<CryptodlePuzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [currentDate] = useState(new Date());
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);

  useEffect(() => {
    let date = currentDate;
    if (dateParam) {
      const parsed = new Date(dateParam + 'T00:00:00');
      if (!isNaN(parsed.getTime()) && parsed <= currentDate) {
        date = parsed;
      }
    }
    setTargetDate(date);
    setLastUpdated(new Date().toISOString());
  }, [dateParam, currentDate]);

  useEffect(() => {
    const fetchPuzzle = async () => {
      if (!targetDate) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await getDailyCryptodle(targetDate);
        if (!data) {
          setError('No puzzle available for today');
          return;
        }
        setPuzzleData(data);
      } catch (err) {
        console.error('Error fetching cryptodle:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPuzzle();
  }, [targetDate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-2xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                CRYPTODLE
              </h1>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-orange-400/30 border-t-orange-400 rounded-full animate-spin"></div>
                <Target className="w-10 h-10 text-orange-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Loading Cryptodle Challenge</h2>
            <p className="text-gray-400 mb-6">Preparing your cryptogram puzzle...</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((dot) => (
                <div key={dot} className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: `${dot * 0.2}s` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-2xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                CRYPTODLE
              </h1>
            </div>
          </div>
          <div className="bg-red-500/10 backdrop-blur-lg rounded-3xl border border-red-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Challenge Unavailable</h2>
            <p className="text-red-200 mb-6">We couldn't load today's cryptogram puzzle.</p>
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-6">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
            <button onClick={() => window.location.reload()} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {showDesktopAds && (
        <>
          <div className="fixed left-4 bottom-8 z-40 hidden lg:block">
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-right" />
          </div>
          <div className="fixed right-4 bottom-8 z-40 hidden lg:block">
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-left" />
          </div>
        </>
      )}
      {showMobileAd && (
        <Ads isMobileFooter={true} format="horizontal" style={{ width: '100%', height: '100px' }} className="lg:hidden" />
      )}
      {showAds && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button onClick={() => setShowDesktopAds(!showDesktopAds)} className="bg-gray-700/80 hover:bg-gray-600/80 text-white text-xs px-3 py-2 rounded-2xl backdrop-blur-sm hidden lg:block transition-all duration-300">
            {showDesktopAds ? 'Hide Ads' : 'Show Ads'}
          </button>
          <button onClick={() => setShowMobileAd(!showMobileAd)} className="bg-gray-700/80 hover:bg-gray-600/80 text-white text-xs px-3 py-2 rounded-2xl backdrop-blur-sm lg:hidden transition-all duration-300">
            {showMobileAd ? 'Hide Ad' : 'Show Ad'}
          </button>
        </div>
      )}

      <div className="max-w-4xl lg:max-w-2xl mx-auto p-4 pb-28 md:pb-8 relative z-30">
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-2xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                CRYPTODLE
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-orange-400" />
              <time dateTime={lastUpdated} className="text-orange-400 text-sm font-medium">
                Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </time>
            </div>
          </div>
          <p className="text-gray-300 text-lg mb-2">Decode a daily encrypted puzzle using a substitution cipher</p>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Tap any encrypted letter, map it to a guess on the keyboard, and use the color feedback to refine your solution.
            Each correct mapping reveals more of the hidden text. You have 15 attempts, and hints unlock as you play.
          </p>
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Daily Challenge</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-red-500" />
              <span className="text-sm">15 Attempts</span>
            </div>
          </div>
        </div>

        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>

        {puzzleData && <CryptodleComponent initialData={puzzleData} />}

        {/* FAQ Section */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6 relative z-10">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none p-4 hover:bg-gray-700/30 rounded-2xl transition-all duration-300">
              <h2 className="text-xl font-bold text-white">How Cryptodle Works</h2>
              <span className="text-orange-400 group-open:rotate-180 transition-transform duration-300 text-2xl">▼</span>
            </summary>
            <div className="mt-4 space-y-6 pt-6 border-t border-gray-700">
              <div className="grid gap-4">
                {[
                  { question: "What is Cryptodle?", answer: "Cryptodle is a daily substitution-cipher puzzle. The target text is encrypted letter by letter, and your job is to recover the original text by testing letter mappings." },
                  { question: "How do I play Cryptodle?", answer: "Click an encrypted letter in the puzzle, then choose a letter from the on-screen keyboard to map it. Correct mappings reveal the hidden text, and you have 15 attempts to solve the puzzle." },
                  { question: "What do the colors mean?", answer: "Green means the mapped letter is correct, yellow means the letter belongs in the answer but is not the right placement in the current feedback view, and gray means the mapping is still wrong." },
                  { question: "How do hints work?", answer: "Hints reveal progressively as you make attempts. They are designed to nudge you toward the answer without giving the whole puzzle away immediately." }
                ].map((faq, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-2xl p-4">
                    <h3 className="font-semibold text-orange-400 mb-2">{faq.question}</h3>
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

export default function CryptodlePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-blue-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div></div>}>
      <CryptodleContent />
    </Suspense>
  );
}
