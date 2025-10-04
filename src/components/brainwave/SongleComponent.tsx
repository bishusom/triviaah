// components/songle/SongleComponent.tsx
'use client';

import { event } from '@/lib/gtag';
import confetti from 'canvas-confetti';
import { MdShare } from "react-icons/md";
import { useSound } from '@/context/SoundContext';
import { useCoverArt } from '@/hooks/useCoverArt';
import { useState, useEffect, useRef, useCallback } from 'react';
import { SonglePuzzle, addSongleResult } from '@/lib/brainwave/songle/songle-sb';
import { checkSongleGuess, SongleGuessResult, getProgressiveClues } from '@/lib/brainwave/songle/songle-logic';

interface SongleComponentProps {
  initialData: SonglePuzzle;
  currentDate: Date;
}

// Block component for the pixelated reveal
const PosterBlock = ({ 
  x, 
  y, 
  gridCols, 
  gridRows, 
  isRevealed 
}: {
  x: number;
  y: number;
  gridCols: number;
  gridRows: number;
  isRevealed: boolean;
}) => {
  if (isRevealed) return null; // Transparent, let image show through
  
  const left = (x / gridCols) * 100;
  const top = (y / gridRows) * 100;
  const width = 100 / gridCols;
  const height = 100 / gridRows;

  return (
    <div
      className="absolute bg-black"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
    />
  );
};

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
  const { imageUrl, isLoading, error } = useCoverArt(puzzleData.targetTitle, puzzleData.artist);
  const [revealPercentage, setRevealPercentage] = useState(0);
  const [revealedBlocks, setRevealedBlocks] = useState<number[]>([]);
  const blockRevealOrderRef = useRef<number[]>([]);
  const [revealedLyricIndices, setRevealedLyricIndices] = useState<number[]>([]);
  const lyricRevealOrderRef = useRef<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Grid settings for blocks
  const GRID_COLS = 40; // For 120px width ~3px blocks
  const GRID_ROWS = 40; // Square aspect
  const totalBlocks = GRID_COLS * GRID_ROWS;
  const containerWidth = 120; // px
  const containerHeight = 120; // px
  
  // Lyrics settings
  const lyricChars = puzzleData.lyricHint.split('');
  const totalLyricChars = lyricChars.length;
  
  // Initialize spaced random reveal order on mount for poster
  useEffect(() => {
    if (blockRevealOrderRef.current.length === 0) {
      const groups: number[][] = [[], [], [], []];
      for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
          const index = row * GRID_COLS + col;
          const groupIdx = (row % 2) * 2 + (col % 2);
          groups[groupIdx].push(index);
        }
      }
      
      const shuffledOrder: number[] = [];
      groups.forEach(group => {
        // Shuffle within group
        for (let i = group.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [group[i], group[j]] = [group[j], group[i]];
        }
        shuffledOrder.push(...group);
      });
      
      blockRevealOrderRef.current = shuffledOrder;
    }
  }, []);

  // Initialize random reveal order for lyrics
  useEffect(() => {
    if (lyricRevealOrderRef.current.length === 0) {
      const order = Array.from({ length: totalLyricChars }, (_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      lyricRevealOrderRef.current = order;
    }
  }, [totalLyricChars]);

  // Start game and trigger analytics
  useEffect(() => {
    setGameStarted(true);
  }, []);

  // Add analytics event for game start
  useEffect(() => {
    if (!gameStarted) return;
    
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'songle_started', category: 'songle', label: 'songle'});
        clearInterval(checkGtag);
      }
    }, 100);

    return () => clearInterval(checkGtag);
  }, [gameStarted]);

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

  // Update reveal percentage and reveals based on attempts
  useEffect(() => {
    let newReveal = 0;
    if (attempts.length > 0 && gameState === 'playing') {
      newReveal = Math.min(attempts.length * 10, 60); // 10% per attempt, max 60%
    } else if (gameState === 'won' || gameState === 'lost') {
      newReveal = 100;
    }
    setRevealPercentage(newReveal);

    // Poster blocks
    const numBlocksToReveal = Math.floor(totalBlocks * (newReveal / 100));
    const newRevealedBlocks = blockRevealOrderRef.current.slice(0, numBlocksToReveal);
    setRevealedBlocks(newRevealedBlocks);

    // Lyric letters (excluding spaces)
    const numLyricsToReveal = Math.floor(totalLyricChars * (newReveal / 100));
    const newRevealedLyrics = lyricRevealOrderRef.current.slice(0, numLyricsToReveal);
    setRevealedLyricIndices(newRevealedLyrics);
  }, [attempts.length, gameState, totalBlocks, totalLyricChars]);

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
    
    shareText += '\nPlay daily at https://triviaah.com/brainwave/songle';
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
    
    // Define hint groups that get revealed at specific attempt levels
    const hintGroups = [
      {
        attempt: 1,
        hints: ['🎤 Artist clues and basic song information']
      },
      {
        attempt: 2, 
        hints: ['🎵 Genre and musical style hints']
      },
      {
        attempt: 3,
        hints: ['📅 Release year and era information']
      },
      {
        attempt: 4,
        hints: ['🏆 Chart performance or awards']
      },
      {
        attempt: 5,
        hints: ['💫 Fun facts or cultural significance']
      }
    ].filter(group => attempts.length >= group.attempt);

    // Get actual hints based on the current attempt level
    const currentClues = getProgressiveClues(puzzleData, attempts.length);
    const displayedHints = hintGroups.map((group, index) => {
      // Use actual hints if available, otherwise use placeholder
      const actualHint = currentClues[index] || group.hints[0];
      return {
        ...group,
        hints: [actualHint]
      };
    });

    const hintsRevealed = displayedHints.length;
    
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Hints Revealed:</h4>
        <div className="relative overflow-hidden">
          <div
            ref={hintsScrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {displayedHints.map((group, index) => (
              <div key={index} className="flex-none w-full snap-center px-4">
                <div className="text-sm bg-white p-3 rounded-lg shadow-sm">
                  {group.hints.map((hint, hintIndex) => (
                    <div key={hintIndex}>{hint}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {displayedHints.length > 1 && (
            <div className="flex justify-center gap-2 mt-3">
              {displayedHints.map((_, index) => (
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
          More hints unlock with each guess... ({hintsRevealed}/5 revealed)
        </p>
      </div>
    );
  };

  // Generate block grid
  const blockGrid: { x: number; y: number }[] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      blockGrid.push({ x: col, y: row });
    }
  }

  // Check if a block is revealed
  const isBlockRevealed = (index: number) => revealedBlocks.includes(index);

  // Check if a lyric character is revealed (always reveal spaces)
  const isLyricRevealed = (index: number, char: string) => {
    return char === ' ' || revealedLyricIndices.includes(index);
  };

  // Helper function to ensure status array matches guess length
  const getLetterStatus = (attempt: SongleGuessResult, index: number) => {
    if (index < attempt.statuses.length) {
      return attempt.statuses[index];
    }
    return 'absent'; // Default status for extra letters
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

        {/* Cover and Lyrics Container */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          {/* Cover Art */}
          <div className="flex-shrink-0 relative">
            {isLoading ? (
              <div className="w-32 h-32 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                <span className="text-gray-400">Loading...</span>
              </div>
            ) : error || !imageUrl ? (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
                <span className="text-gray-400 text-sm text-center">No cover art available</span>
              </div>
            ) : (
              <div 
                className="relative rounded-lg overflow-hidden bg-gray-100" 
                style={{ height: `${containerHeight}px`, width: `${containerWidth}px` }}
              >
                <img
                  src={imageUrl}
                  alt={`${puzzleData.targetTitle} cover art`}
                  className="w-full h-full object-cover absolute inset-0 z-10"
                />
                {/* Block overlay container */}
                <div className="absolute inset-0 z-20">
                  {blockGrid.map((pos, index) => (
                    <PosterBlock
                      key={index}
                      {...pos}
                      gridCols={GRID_COLS}
                      gridRows={GRID_ROWS}
                      isRevealed={isBlockRevealed(index)}
                    />
                  ))}
                </div>
                {/* Center "?" overlay only initially */}
                {revealPercentage === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center z-30">
                    <span className="text-white text-2xl font-bold">?</span>
                  </div>
                )}
                {/* Percentage badge */}
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded z-30">
                  {revealPercentage > 0 ? `${Math.round(revealPercentage)}%` : '?'}
                </div>
              </div>
            )}
          </div>

          {/* Lyrics Hint */}
          <div className="flex-grow min-w-0">
            <h4 className="font-semibold text-center mb-2">Lyric Hint:</h4>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl text-center font-serif text-base md:text-lg leading-relaxed whitespace-pre-wrap border-2 border-purple-200 shadow-inner min-h-[80px] flex items-center justify-center">
              <div className="w-full">
                {lyricChars.map((char, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center justify-center transition-all duration-300 ${
                      isLyricRevealed(index, char)
                        ? 'text-purple-700 font-semibold'
                        : 'text-transparent'
                    } ${char === ' ' ? 'w-3' : 'w-5 h-5 mx-0.5'}`}
                    style={{
                      animation: isLyricRevealed(index, char) ? 'fadeIn 0.3s ease-in' : 'none'
                    }}
                  >
                    {isLyricRevealed(index, char) ? (
                      char
                    ) : char === ' ' ? (
                      ' '
                    ) : (
                      <span className="w-4 h-4 bg-gray-400 rounded-full inline-block"></span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        
        {/* Conditional rendering of hints or result */}
        {gameState === 'playing' && (
          <>
            {/* Enhanced progressive hints */}
            <EnhancedProgressiveHint />
            
            {/* Validation hints */}
            <ValidationHints />
          </>
        )}
        
        {/* Game result message */}
        {gameState === 'won' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Congratulations! 🎉</h3>
            <p>You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="mt-2">The song is &quot;{puzzleData.normalizedTitle.toUpperCase()}&quot; by {puzzleData.artist}.</p>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Game Over</h3>
            <p>The song was: <strong>&quot;{puzzleData.normalizedTitle.toUpperCase()}&quot;</strong> by {puzzleData.artist}</p>
          </div>
        )}
        
        {/* Letter grid for previous attempts */}
        <div className="mb-6">
          {attempts.length > 0 && (
            <h3 className="font-semibold mb-3">Your Guesses:</h3>
          )}
          {attempts.map((attempt, index) => (
            <div key={index} className="flex justify-center mb-2">
              {attempt.guess.replace(/\s+/g, '').split('').map((letter, letterIndex) => (
                <div
                  key={letterIndex}
                  className={`w-8 h-8 flex items-center justify-center mx-1 text-xl font-bold rounded ${
                    attempt.statuses[letterIndex] === 'correct' 
                      ? 'bg-green-500 text-white border-green-500' 
                      : attempt.statuses[letterIndex] === 'present' 
                      ? 'bg-yellow-500 text-white border-yellow-500'
                      : 'bg-gray-300 text-gray-700 border-gray-300'
                  }`}
                >
                  {letter.toUpperCase()}
                </div>
              ))}
            </div>
          ))}
        </div>
        
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
          <li>You have 6 attempts to guess the song</li>
        </ul>
      </div>
    </div>
  );
}