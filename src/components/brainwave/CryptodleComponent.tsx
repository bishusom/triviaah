// src/components/brainwave/cryptodle/CryptodleComponent.tsx
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { event } from '@/lib/gtag';
import { useSound } from '@/context/SoundContext';
import { MdShare } from 'react-icons/md';
import FeedbackComponent from '@/components/common/FeedbackComponent';
import {
  getDailyCryptodle,
  addCryptodleResult,
  type CryptodlePuzzle
} from '@/lib/brainwave/cryptodle/cryptodle-sb';
import { checkGuess } from '@/lib/brainwave/cryptodle/cryptodle-logic';
import { fetchWikimediaImage } from '@/lib/wikimedia';
import Image from 'next/image';
import { Home, Brain, BookOpen, Target, Sparkles, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';

interface CryptodleComponentProps {
  initialData: CryptodlePuzzle;
}

const hintThemes = [
  {
    accent: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300',
    badge: 'bg-cyan-500/15 text-cyan-300',
    bar: 'from-cyan-400 to-blue-500',
  },
  {
    accent: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300',
    badge: 'bg-amber-500/15 text-amber-300',
    bar: 'from-amber-400 to-orange-500',
  },
  {
    accent: 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-300',
    badge: 'bg-emerald-500/15 text-emerald-300',
    bar: 'from-emerald-400 to-green-500',
  },
  {
    accent: 'bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/30 text-fuchsia-300',
    badge: 'bg-fuchsia-500/15 text-fuchsia-300',
    bar: 'from-fuchsia-400 to-pink-500',
  },
  {
    accent: 'bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border-violet-500/30 text-violet-300',
    badge: 'bg-violet-500/15 text-violet-300',
    bar: 'from-violet-400 to-indigo-500',
  },
];

const CryptodleProgressiveHints = ({ attempts, hints }: { attempts: string[]; hints: string[] }) => {
  if (attempts.length === 0 || hints.length === 0) return null;

  const [activeHintIndex, setActiveHintIndex] = useState(0);
  const hintsScrollRef = useRef<HTMLDivElement>(null);
  const revealedHints = hints.slice(0, Math.min(attempts.length, hints.length));

  useEffect(() => {
    const latestHintIndex = Math.min(revealedHints.length - 1, hints.length - 1);
    if (latestHintIndex >= 0) {
      setActiveHintIndex(latestHintIndex);
    }
  }, [revealedHints.length, hints.length]);

  useEffect(() => {
    const scrollContainer = hintsScrollRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTo({
        left: activeHintIndex * scrollContainer.offsetWidth,
        behavior: 'smooth',
      });
    }
  }, [activeHintIndex]);

  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-4 mb-6">
      <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Hints Revealed:
      </h4>

      <div className="relative overflow-hidden">
        <div
          ref={hintsScrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {revealedHints.map((hint, index) => {
            const theme = hintThemes[index % hintThemes.length];
            return (
              <div key={index} className="flex-none w-full snap-center">
                <div className={`rounded-2xl border p-4 ${theme.accent}`}>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-semibold">Hint {index + 1}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${theme.badge}`}>
                      {index + 1}/{hints.length} revealed
                    </span>
                  </div>
                  <p className="text-sm text-gray-100 leading-relaxed">{hint}</p>
                  <div className="h-1.5 mt-4 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${theme.bar} transition-all duration-500`}
                      style={{ width: `${((index + 1) / hints.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {revealedHints.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {revealedHints.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveHintIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeHintIndex ? 'bg-blue-400 scale-125' : 'bg-gray-600'
                  }`}
                aria-label={`Go to hint ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function CryptodleComponent({ initialData }: CryptodleComponentProps) {
  const MAX_ATTEMPTS = 15;
  const [puzzleData] = useState(initialData);
  const [userMapping, setUserMapping] = useState<Record<string, string>>({});
  const [selectedCipherLetter, setSelectedCipherLetter] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<string[]>([]); // Stores decrypted strings of wrong guesses
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shareMessage, setShareMessage] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isGuessLoading, setIsGuessLoading] = useState(false);
  const [authorImageUrl, setAuthorImageUrl] = useState<string | null>(puzzleData.authorImageUrl || null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const feedbackSectionRef = useRef<HTMLDivElement>(null);
  const [timeToNext, setTimeToNext] = useState<{ hours: number; minutes: number } | null>(null);

  // Sound effects
  const { isMuted, toggleMute } = useSound();
  const playSound = useCallback((soundType: 'correct' | 'incorrect' | 'win' | 'lose' | 'click') => {
    if (isMuted) return;
    try {
      const sounds = {
        correct: '/sounds/correct.mp3',
        incorrect: '/sounds/incorrect.mp3',
        win: '/sounds/win.mp3',
        lose: '/sounds/lose.mp3',
        click: '/sounds/click.mp3'
      };
      const audio = new Audio(sounds[soundType]);
      audio.play().catch(() => { });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [isMuted]);

  // Fetch Wikimedia image if not provided
  useEffect(() => {
    if (!authorImageUrl && puzzleData.author) {
      fetchWikimediaImage(puzzleData.author, { entityType: 'person' })
        .then(url => setAuthorImageUrl(url))
        .catch(err => console.error('Failed to fetch author image:', err));
    }
  }, [puzzleData.author, authorImageUrl]);

  // Countdown to next puzzle (midnight local time)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight.getTime() - now.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      setTimeToNext({ hours, minutes });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`cryptodle-${puzzleData.id}`);
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        setUserMapping(progress.userMapping || {});
        setAttempts(progress.attempts || []);
        setGameState(progress.gameState || 'playing');
      } catch (e) {
        console.error('Error loading saved progress:', e);
      }
    }
  }, [puzzleData.id]);

  // Save progress
  useEffect(() => {
    if (Object.keys(userMapping).length > 0 || attempts.length > 0 || gameState !== 'playing') {
      localStorage.setItem(`cryptodle-${puzzleData.id}`, JSON.stringify({
        userMapping,
        attempts,
        gameState
      }));
    }
  }, [userMapping, attempts, gameState, puzzleData.id]);

  // Compute current decryption and correctness
  const { currentDecryption, isCorrect } = useMemo(() => {
    const result = checkGuess(userMapping, puzzleData);
    return { currentDecryption: result.currentDecryption, isCorrect: result.isCorrect };
  }, [userMapping, puzzleData]);

  // Compute letter statuses for the current decryption preview
  const currentLetterStatuses = useMemo(() => {
    const target = puzzleData.targetQuote.toLowerCase();
    const decrypted = currentDecryption.toLowerCase();
    const statuses: ('correct' | 'present' | 'absent')[] = [];
    for (let i = 0; i < decrypted.length; i++) {
      if (decrypted[i] === target[i]) statuses[i] = 'correct';
      else if (target.includes(decrypted[i])) statuses[i] = 'present';
      else statuses[i] = 'absent';
    }
    return statuses;
  }, [currentDecryption, puzzleData.targetQuote]);

  // Auto-win when decryption exactly matches the target text
  useEffect(() => {
    if (gameState === 'playing' && currentDecryption.toLowerCase() === puzzleData.targetQuote.toLowerCase()) {
      setGameState('won');
      triggerConfetti();
      playSound('win');
      addCryptodleResult(true, attempts.length).catch(console.error);
      event({ action: 'cryptodle_win', category: 'cryptodle', label: `attempts_${attempts.length}` });
    }
  }, [currentDecryption, puzzleData.targetQuote, gameState, attempts.length]);

  useEffect(() => {
    if (gameState !== 'won' && gameState !== 'lost') return;

    const timer = window.setTimeout(() => {
      feedbackSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [gameState]);

  const triggerConfetti = () => {
    if (confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true
      });
      myConfetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#00FFFF', '#0066FF', '#9933FF']
      });
    }
  };

  const handleLetterMapping = (cipherLetter: string, plainLetter: string) => {
    if (gameState !== 'playing') return;
    playSound('click');
    setUserMapping(prev => ({
      ...prev,
      [cipherLetter]: plainLetter
    }));
    setSelectedCipherLetter(null);
  };


  const handleCheckWin = async () => {
    if (gameState !== 'playing') return;

    // If already correct (auto-win might have fired), just return
    if (currentDecryption.toLowerCase() === puzzleData.targetQuote.toLowerCase()) {
      return;
    }

    setIsGuessLoading(true);
    setValidationError(null);

    try {
      const result = checkGuess(userMapping, puzzleData);

      if (result.isCorrect) {
        // This should rarely happen because auto-win would have triggered,
        // but keep for safety.
        setGameState('won');
        triggerConfetti();
        playSound('win');
        await addCryptodleResult(true, attempts.length);
        event({ action: 'cryptodle_win', category: 'cryptodle', label: `attempts_${attempts.length}` });
      } else {
        // Wrong guess – store the decrypted string as an attempt
        const newAttempts = [...attempts, result.currentDecryption];
        setAttempts(newAttempts);
        playSound('incorrect');

        if (newAttempts.length >= MAX_ATTEMPTS) {
          setGameState('lost');
          playSound('lose');
          await addCryptodleResult(false, newAttempts.length);
          event({ action: 'cryptodle_loss', category: 'cryptodle', label: 'max_attempts' });
        } else {
          setValidationError('Not quite right. Keep decoding!');
          setTimeout(() => setValidationError(null), 3000);
        }
      }
    } catch (error) {
      console.error('Error checking guess:', error);
      setValidationError('An error occurred. Please try again.');
      setTimeout(() => setValidationError(null), 3000);
    } finally {
      setIsGuessLoading(false);
    }
  };

  const generateShareMessage = () => {
    if (gameState !== 'won' && gameState !== 'lost') return '';

    const puzzleNumber = Math.floor((new Date().getTime() - new Date(2024, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
    let shareText = `Cryptodle #${puzzleNumber} ${gameState === 'won' ? attempts.length : 'X'}/${MAX_ATTEMPTS}\n\n`;
    shareText += `🔐 ${puzzleData.encryptedQuote}\n`;
    shareText += `📝 Decoded: ${currentDecryption}\n\n`;
    shareText += `Play Cryptodle at https://triviaah.com/brainwave/cryptodle`;
    return shareText;
  };

  const copyToClipboard = () => {
    const text = generateShareMessage();
    navigator.clipboard.writeText(text).then(() => {
      setShareMessage('Copied to clipboard!');
      setTimeout(() => setShareMessage(''), 2000);
      playSound('click');
    });
  };

  const resetGame = () => {
    setUserMapping({});
    setAttempts([]);
    setGameState('playing');
    setSelectedCipherLetter(null);
    setValidationError(null);
    playSound('click');
  };

  const totalCipherSymbols = useMemo(() => {
    const symbols = new Set<string>();
    for (const char of puzzleData.encryptedQuote.toLowerCase()) {
      if (/[a-z0-9]/.test(char)) {
        symbols.add(char);
      }
    }
    return symbols.size;
  }, [puzzleData.encryptedQuote]);

  const mappingsMade = Object.keys(userMapping).length;
  const attemptsRemaining = MAX_ATTEMPTS - attempts.length;
  const attemptsRemainingColor =
    attemptsRemaining >= 10 ? 'text-green-400' :
      attemptsRemaining >= 5 ? 'text-yellow-400' :
        'text-red-400';

  // Render encrypted text with interactive pills
  const renderEncryptedQuote = () => {
    return puzzleData.encryptedQuote.split('').map((char, index) => {
      const isCipherChar = /[A-Za-z0-9]/.test(char);
      if (isCipherChar) {
        const lowerCipher = char.toLowerCase();
        const mappedPlain = userMapping[lowerCipher];
        const isSelected = selectedCipherLetter === lowerCipher;
        const displayLetter = mappedPlain ? mappedPlain.toUpperCase() : char.toUpperCase();
        const status = currentLetterStatuses[index];

        let bgClass = 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50';
        if (mappedPlain) {
          if (status === 'correct') bgClass = 'bg-gradient-to-br from-green-500 to-emerald-600 text-white';
          else if (status === 'present') bgClass = 'bg-gradient-to-br from-yellow-500 to-amber-600 text-white';
          else if (status === 'absent') bgClass = 'bg-gray-600 border border-gray-500 text-white';
        }

        return (
          <button
            key={index}
            onClick={() => setSelectedCipherLetter(lowerCipher)}
            className={`inline-block w-8 h-10 mx-0.5 rounded-lg font-mono text-lg font-bold transition-all duration-200
              ${isSelected ? 'ring-2 ring-amber-400 scale-105' : ''}
              ${bgClass}`}
          >
            {displayLetter}
          </button>
        );
      } else {
        return (
          <span key={index} className="text-gray-400 mx-0.5">
            {char}
          </span>
        );
      }
    });
  };

  // Keyboard layout
  const keyboardRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  ];

  return (
    <div className="relative">
      <canvas ref={confettiCanvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-10" />

      <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-6 mb-6">
        {/* Header with Attempts Counter */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-2 rounded-xl">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Cryptodle Puzzle</h2>
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
              <span>{mappingsMade}/{totalCipherSymbols} MAPPINGS</span>
            </div>
            <div className={`flex items-center gap-2 text-lg font-bold ${attemptsRemainingColor}`}>
              <Target className="w-5 h-5" />
              <span>{attemptsRemaining} {attemptsRemaining === 1 ? 'ATTEMPT LEFT' : 'ATTEMPTS LEFT'}</span>
            </div>
          </div>
        </div>

        {/* Attribution Section (Image + Name) */}
        {(puzzleData.author || authorImageUrl) && (
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-lg bg-gray-700">
              {authorImageUrl ? (
                <Image
                  src={authorImageUrl}
                  alt={puzzleData.author || 'Author'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-amber-400">
                  <span className="text-3xl">?</span>
                </div>
              )}
            </div>
            {puzzleData.author && (
              <p className="mt-2 text-amber-400 font-semibold text-center">
                — Decrypt this quote by {puzzleData.author}
              </p>
            )}
          </div>
        )}

        {/* Encrypted Text Display */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-amber-400 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Encrypted Text:
          </h3>
          <div className="flex flex-wrap justify-center gap-1">
            {renderEncryptedQuote()}
          </div>
          {selectedCipherLetter && (
            <div className="mt-4 text-center text-amber-400 text-sm">
              Select a letter to map for: <span className="font-bold text-white">{selectedCipherLetter.toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Progressive Hints */}
        <CryptodleProgressiveHints attempts={attempts} hints={puzzleData.hints} />

        {/* Game Messages */}
        {validationError && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4 mb-6 animate-pulse">
            <div className="flex items-center gap-2 text-yellow-400">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              {validationError}
            </div>
          </div>
        )}

        {/* Current Decryption Preview with Colored Feedback 
        {currentDecryption && (
          <div className="bg-gray-700/30 rounded-xl p-4 mb-6">
            <h3 className="text-gray-400 text-sm mb-2">Your current decoding:</h3>
            <div className="flex flex-wrap justify-center gap-1">
              {currentDecryption.split('').map((letter, idx) => {
                const status = currentLetterStatuses[idx];
                let bgClass = 'bg-gray-600/50';
                if (status === 'correct') bgClass = 'bg-gradient-to-br from-green-500 to-emerald-600';
                else if (status === 'present') bgClass = 'bg-gradient-to-br from-yellow-500 to-amber-600';
                else if (status === 'absent') bgClass = 'bg-gray-600 border border-gray-500';
                
                return (
                  <div
                    key={idx}
                    className={`w-8 h-10 flex items-center justify-center rounded-lg font-mono text-lg font-bold text-white ${bgClass}`}
                  >
                    {letter === ' ' ? '\u00A0' : letter.toUpperCase()}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        */}

        {/* On-screen Keyboard */}
        <div className="mb-6">
          <h3 className="font-semibold text-white mb-3">Map Letters:</h3>
          <div className="space-y-2">
            {keyboardRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-1">
                {row.map(letter => {
                  const isUsed = Object.values(userMapping).includes(letter);
                  return (
                    <button
                      key={letter}
                      onClick={() => {
                        if (selectedCipherLetter) {
                          handleLetterMapping(selectedCipherLetter, letter);
                        }
                      }}
                      disabled={!selectedCipherLetter || isUsed}
                      className={`w-10 h-12 rounded-lg font-bold text-lg transition-all duration-200
                        ${selectedCipherLetter && !isUsed
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white cursor-pointer'
                          : isUsed
                            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                        }`}
                    >
                      {letter.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Current Mappings */}
        {Object.keys(userMapping).length > 0 && (
          <div className="bg-gray-700/30 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-white mb-2 text-sm">Your Mappings:</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(userMapping).map(([cipher, plain]) => (
                <div key={cipher} className="bg-gray-600/50 rounded-lg px-3 py-1">
                  <span className="text-amber-400 font-mono font-bold">{cipher.toUpperCase()}</span>
                  <span className="text-gray-400 mx-1">→</span>
                  <span className="text-green-400 font-mono font-bold">{plain.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Win/Loss States */}
        {gameState === 'won' && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Victory! 🎉</h3>
            <p className="text-green-400 mb-2">You decoded it in {attempts.length} {attempts.length === 1 ? 'attempt' : 'attempts'}!</p>
            <p className="text-gray-300">The answer is: <strong className="text-white">"{puzzleData.targetQuote}"</strong></p>
            {puzzleData.author && (
              <p className="text-gray-300 mt-2">— {puzzleData.author}</p>
            )}
          </div>
        )}

        {gameState === 'lost' && (
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Game Over</h3>
            <p className="text-red-400 mb-2">The answer was: <strong className="text-white">"{puzzleData.targetQuote}"</strong></p>
            {puzzleData.author && (
              <p className="text-gray-300">— Attribution: {puzzleData.author}</p>
            )}
          </div>
        )}

        {/* Action Buttons (during playing) */}
        {gameState === 'playing' && (
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-600/50 transition-all duration-300"
            >
              Reset Game
            </button>
          </div>
        )}

      {/* Submit Button */}
      {gameState === 'playing' && (
        <div className="sticky bottom-20 md:bottom-0 bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-700 p-4 z-[100] -mx-2 md:-mx-4 -mb-2 md:-mb-6">
            <button
              onClick={handleCheckWin}
              disabled={isGuessLoading}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl hover:from-amber-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              {isGuessLoading ? 'Checking...' : 'SUBMIT DECODING'}
            </button>
          </div>
        )}

        {/* Share & Feedback Section (after win/loss) */}
        {(gameState === 'won' || gameState === 'lost') && (
          <div
            ref={feedbackSectionRef}
            className="flex flex-col items-center gap-4 mt-6 scroll-mt-24 pb-28 md:pb-0"
          >
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <MdShare className="w-5 h-5" />
              Share Result
            </button>
            {shareMessage && (
              <div className="text-amber-400 font-semibold animate-pulse">{shareMessage}</div>
            )}

            <FeedbackComponent
              gameType="cryptodle"
              category="brainwave"
              metadata={{
                attempts: attempts.length,
                won: gameState === 'won',
                correctAnswer: puzzleData.targetQuote,
              }}
            />

            {/* Navigation Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-4 w-full">
              <Link href="/"
                className="flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-center text-sm md:text-base"
              >
                <Home className="text-lg md:text-xl" />
                Home
              </Link>

              <Link href="/brainwave"
                className="flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-center text-sm md:text-base"
              >
                <Brain className="w-4 h-4" />
                More Brain Teasers
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* How to Play Section */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          How to Play:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-amber-400">🔐</span>
          <span>Click any encrypted letter to select it</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-green-400">✅</span>
            <span>Then click a keyboard letter to map it</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-cyan-400">💡</span>
            <span>Use hints that unlock as you make attempts</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-red-400">🎯</span>
            <span>{MAX_ATTEMPTS} attempts to decode the full text</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-green-500">🟩</span>
            <span>Green: correct mapping</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-yellow-500">🟨</span>
            <span>Yellow: the letter belongs in the answer, but this placement is off</span>
          </div>
        </div>
      </div>
    </div>
  );
}
