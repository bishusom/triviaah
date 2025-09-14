// components/songle/SongleComponent.tsx
'use client';

import { event } from '@/lib/gtag';
import confetti from 'canvas-confetti';
import { MdShare } from "react-icons/md";
import { useSound } from '@/context/SoundContext';
import { useCoverArt } from '@/hooks/useCoverArt';
import { useState, useEffect, useRef, useCallback } from 'react';
import { SonglePuzzle, addSongleResult } from '@/lib/brainwave/songle/songle-fb';
import { checkSongleGuess, SongleGuessResult, getProgressiveClues } from '@/lib/brainwave/songle/songle-logic';

interface SongleComponentProps {
  initialData: SonglePuzzle;
  currentDate: Date;
}

export default function SongleComponent({ initialData, currentDate }: SongleComponentProps) {
  const [puzzleData] = useState(initialData);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<SongleGuessResult[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shareMessage, setShareMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [activeHintIndex, setActiveHintIndex] = useState(0);
  const hintsScrollRef = useRef<HTMLDivElement>(null);
  const { imageUrl, isLoading, error } = useCoverArt(puzzleData.normalizedTitle, puzzleData.artist);
  const [imageRevealLevel, setImageRevealLevel] = useState(0);
  
  // Sound effects
  const { isMuted } = useSound();
  const correctSound = useRef<HTMLAudioElement | null>(null);
  const incorrectSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);
  const loseSound = useRef<HTMLAudioElement | null>(null);
  const clickSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize sound effects
    correctSound.current = new Audio('/sounds/correct.mp3');
    incorrectSound.current = new Audio('/sounds/incorrect.mp3');
    winSound.current = new Audio('/sounds/win.mp3');
    loseSound.current = new Audio('/sounds/lose.mp3');
    clickSound.current = new Audio('/sounds/click.mp3');

    return () => {
      [correctSound, incorrectSound, winSound, loseSound, clickSound].forEach(sound => {
        sound.current?.pause();
      });
    };
  }, []);

  useEffect(() => {
    const savedProgress = localStorage.getItem(`songle-${puzzleData.id}`);
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setAttempts(progress.attempts || []);
        setGameState(progress.gameState || 'playing');
      } catch (e) {
        console.error('Error loading saved progress:', e);
      }
    }
  }, [puzzleData.id]);

  useEffect(() => {
    if (attempts.length > 0 || gameState !== 'playing') {
      localStorage.setItem(`songle-${puzzleData.id}`, JSON.stringify({
        attempts,
        gameState
      }));
    }
  }, [attempts, gameState, puzzleData.id]);

  // Add useEffect for image reveal
  useEffect(() => {
    // Update reveal percentage based on attempts
    if (attempts.length > 0 && gameState === 'playing') {
      const newReveal = Math.min(attempts.length * 15, 75); // 15% per attempt, max 75%
      setImageRevealLevel(newReveal);
    }
    
    // Fully reveal when game ends
    if (gameState === 'won' || gameState === 'lost') {
      setImageRevealLevel(100);
    }
  }, [attempts.length, gameState]);

  // Auto-advance to latest hint when new hints are revealed
  useEffect(() => {
    if (attempts.length > 0) {
      const hints = getProgressiveClues(puzzleData, attempts.length);
      const latestHintIndex = hints.length - 1;
      if (latestHintIndex >= 0) {
        setActiveHintIndex(latestHintIndex);
      }
    }
  }, [attempts.length, puzzleData]);

  // Scroll to active hint when it changes
  useEffect(() => {
      const scrollToHint = () => {
        if (hintsScrollRef.current) {
          const scrollContainer = hintsScrollRef.current;
          const hintWidth = scrollContainer.offsetWidth;
          scrollContainer.scrollTo({
            left: activeHintIndex * hintWidth,
            behavior: 'smooth'
          });
        }
      };

      // Small delay to ensure the DOM has been updated with new hints
      const timeoutId = setTimeout(scrollToHint, 100);
      return () => clearTimeout(timeoutId);
    }, [activeHintIndex]);

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
      audio.play().catch(() => {});
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [isMuted]);

  const triggerConfetti = () => {
    if (confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true
      });
      
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => myConfetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } }), 250);
      setTimeout(() => myConfetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } }), 400);
    }
  };

  const handleGuess = () => {
    if (gameState !== 'playing' || attempts.length >= 6) return;
    
    const normalizedGuess = guess.trim();
    if (!normalizedGuess) return;
    
    // Check if already guessed
    if (attempts.some(a => a.guess.toLowerCase() === normalizedGuess.toLowerCase())) {
      setErrorMessage('Already guessed this song');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    playSound('click');
    
    const result = checkSongleGuess(normalizedGuess, puzzleData);
    const newAttempts = [...attempts, result];
    setAttempts(newAttempts);
    setGuess('');
    
    if (result.isCorrect) {
      setGameState('won');
      triggerConfetti();
      playSound('win');
      addSongleResult(true, newAttempts.length);
      event({action: 'songle_win', category: 'songle', label: 'songle'});
    } else if (newAttempts.length >= 6) {
      setGameState('lost');
      playSound('lose');
      addSongleResult(false, newAttempts.length);
      event({action: 'songle_loss', category: 'songle', label: 'songle'});
    } else {
      const hasCorrectOrPartial = result.statuses.some(status => 
        status === 'correct' || status === 'present'
      );
      if (hasCorrectOrPartial) {
        playSound('correct');
      } else {
        playSound('incorrect');
      }
    }
  };

  const generateShareMessage = () => {
    if (gameState !== 'won' && gameState !== 'lost') return '';
    
    const clientDate = new Date();
    const startDate = new Date(2024, 0, 1);
    const puzzleNumber = Math.floor((clientDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let shareText = `Songle #${puzzleNumber} ${gameState === 'won' ? attempts.length : 'X'}/6\n\n`;
    
    attempts.forEach(attempt => {
      attempt.statuses.forEach(status => {
        if (status === 'correct') {
          shareText += '🟩';
        } else if (status === 'present') {
          shareText += '🟨';
        } else {
          shareText += '⬜';
        }
      });
      shareText += '\n';
    });
    
    shareText += '\nPlay daily at triviaah.com/brainwave/songle';
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
    setAttempts([]);
    setGameState('playing');
    setGuess('');
    setActiveHintIndex(0);
    setImageRevealLevel(0);
    localStorage.removeItem(`songle-${puzzleData.id}`);
    playSound('click');
  };

  const triesLeft = 6 - attempts.length;
  const triesLeftColor = triesLeft >= 4 ? 'text-green-600' : triesLeft >= 2 ? 'text-amber-600' : 'text-red-600';

  // Get progressive clues based on attempt number
  const clues = getProgressiveClues(puzzleData, attempts.length);

  // Enhanced progressive hints component
  const EnhancedProgressiveHint = () => {
    if (attempts.length === 0) return null;
    
    const latestAttempt = attempts[attempts.length - 1];
    const correctLetters = latestAttempt.statuses.filter(s => s === 'correct').length;
    const presentLetters = latestAttempt.statuses.filter(s => s === 'present').length;
    
    const hints = [
      {
        icon: "🎯",
        text: `Great start! You have ${correctLetters} correct letters.`,
        color: "bg-green-100 border-green-400 text-green-700"
      },
      {
        icon: "🔍",
        text: `Look for patterns. ${presentLetters} letters are in the title but misplaced.`,
        color: "bg-yellow-100 border-yellow-400 text-yellow-700"
      },
      {
        icon: "🤔",
        text: "Compare letter positions. Focus on the green letters first.",
        color: "bg-blue-100 border-blue-400 text-blue-700"
      },
      {
        icon: "💡",
        text: "Use the revealed hints below to narrow down your options.",
        color: "bg-purple-100 border-purple-400 text-purple-700"
      },
      {
        icon: "⚡",
        text: "Final attempt! Use all clues and think about song titles that fit the pattern.",
        color: "bg-red-100 border-red-400 text-red-700"
      }
    ];
    
    const hintIndex = Math.min(attempts.length - 1, hints.length - 1);
    const currentHint = hints[hintIndex];
    
    return (
      <div className={`rounded-lg p-4 mb-4 border ${currentHint.color}`}>
        <div className="flex items-center mb-2">
          <span className="text-xl mr-2">{currentHint.icon}</span>
          <span className="font-semibold">{currentHint.text}</span>
        </div>
        
        <div className="flex gap-1 mt-2">
          {latestAttempt.statuses.map((status, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded ${
                status === 'correct' ? 'bg-green-500' :
                status === 'present' ? 'bg-yellow-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  // Validation hints component with navigation dots
  const ValidationHints = () => {
    if (attempts.length === 0) return null;
    
    const hints = getProgressiveClues(puzzleData, attempts.length);
    
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Hints Revealed:</h4>
        <div className="relative overflow-hidden">
          <div
            ref={hintsScrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {hints.map((hint, index) => (
              <div key={index} className="flex-none w-full snap-center px-4">
                <div className="text-sm bg-white p-3 rounded-lg shadow-sm">
                  {hint}
                </div>
              </div>
            ))}
          </div>
          {hints.length > 1 && (
            <div className="flex justify-center gap-2 mt-3">
              {hints.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveHintIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeHintIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to hint ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-blue-600 mt-2 text-center">
          More hints unlock with each guess... ({attempts.length}/6 revealed)
        </p>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-4rem)]">
      <canvas 
        ref={confettiCanvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      />
      
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold">Today&apos;s Song</h2>
          <div className={`text-base font-bold ${triesLeftColor}`}>
            {triesLeft} {triesLeft === 1 ? 'try' : 'tries'} left
          </div>
        </div>

        {/* Cover art with progressive reveal */}
        <div className="flex justify-center mb-4">
          {isLoading ? (
            <div className="w-32 h-32 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
              <span className="text-gray-400">Loading...</span>
            </div>
          ) : error ? (
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
              <span className="text-gray-400 text-sm text-center">No cover art available</span>
            </div>
          ) : imageUrl ? (
            <div className="relative rounded-lg overflow-hidden bg-gray-100" style={{ height: '120px', width: '120px' }}>
              <img
                src={imageUrl}
                alt={`${puzzleData.targetTitle} cover art`}
                className="w-full h-full object-cover"
                style={{
                  filter: `blur(${Math.max(0, 20 - (imageRevealLevel * 0.2))}px)`,
                  opacity: 0.2 + (imageRevealLevel * 0.008),
                  transition: 'filter 0.5s ease, opacity 0.5s ease'
                }}
              />
              <div 
                className="absolute inset-0 bg-black flex items-center justify-center transition-opacity duration-500"
                style={{ opacity: (100 - imageRevealLevel) / 100 }}
              >
                <span className="text-white text-xl font-bold">?</span>
              </div>
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                {imageRevealLevel > 0 ? 
                  `${Math.round(imageRevealLevel)}%` : 
                  '?'
                }
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
              <span className="text-gray-400 text-sm text-center">No cover art available</span>
            </div>
          )}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        
        {/* Enhanced progressive hints */}
        <EnhancedProgressiveHint />
        
        {/* Validation hints */}
        <ValidationHints />

        {/* Letter grid for previous attempts */}
        <div className="mb-6">
          {attempts.length > 0 && (
            <h3 className="font-semibold mb-3">Your Guesses:</h3>
          )}
          {attempts.map((attempt, index) => (
            <div key={index} className="flex justify-center mb-2">
              {attempt.statuses.map((status, letterIndex) => {
                const letter = attempt.guess[letterIndex] || '';
                return (
                  <div
                    key={letterIndex}
                    className={`w-12 h-12 flex items-center justify-center mx-1 text-xl font-bold border-2 rounded ${
                      status === 'correct' 
                        ? 'bg-green-500 text-white border-green-500' 
                        : status === 'present' 
                        ? 'bg-yellow-500 text-white border-yellow-500'
                        : 'bg-gray-300 text-gray-700 border-gray-300'
                    }`}
                  >
                    {letter.toUpperCase()}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Game result message */}
        {gameState === 'won' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Congratulations! 🎉</h3>
            <p>You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="mt-2">The song is &quot;{puzzleData.targetTitle}&quot; by {puzzleData.artist}.</p>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Game Over</h3>
            <p>The song was: <strong>&quot;{puzzleData.targetTitle}&quot;</strong> by {puzzleData.artist}</p>
          </div>
        )}
        
        {/* Input for guesses */}
        {gameState === 'playing' && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 z-10 -mx-4 md:-mx-6 -mb-4 md:-mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter song title"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
              />
              <button
                onClick={handleGuess}
                disabled={!guess.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Guess
              </button>
            </div>
          </div>
        )}
        
        {/* Share button */}
        {(gameState === 'won' || gameState === 'lost') && (
          <div className="flex flex-col items-center mt-4">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <MdShare /> Share Result
            </button>
            {shareMessage && (
              <div className="mt-2 text-blue-600">{shareMessage}</div>
            )}
          </div>
        )}
      </div>

      {/* How to Play section */}
      <div className="bg-gray-100 rounded-lg p-4 mt-6">
        <h3 className="font-bold mb-2">How to Play:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Guess the song by entering any song title</li>
          <li>Get letter-by-letter feedback compared to the answer</li>
          <li>🟩 Green: Letter in correct position</li>
          <li>🟨 Yellow: Letter is in the title but wrong position</li>
          <li>⬜ Gray: Letter not in the title</li>
          <li>Hints are revealed after each attempt</li>
          <li>You have 6 attempts to guess the movie</li>
        </ul>
      </div>
    </div>
  );
}