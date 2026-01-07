// components/songle/SongleComponent.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { event } from '@/lib/gtag';
import { useSound } from '@/context/SoundContext';
import { MdShare } from "react-icons/md";
import FeedbackComponent from '@/components/common/FeedbackComponent';
import { useCoverArt } from '@/hooks/useCoverArt';
import { SonglePuzzle, addSongleResult } from '@/lib/brainwave/songle/songle-sb';
import { checkSongleGuess, SongleGuessResult, getProgressiveClues } from '@/lib/brainwave/songle/songle-logic';
import { Music, Target, Users, Search, Sparkles, Eye, EyeOff, Flame, Mic } from 'lucide-react';

interface SongleComponentProps {
  initialData: SonglePuzzle;
}

/* -------------------------------------------------------------------------- */
/*  Enhanced Helper Components                                                */
/* -------------------------------------------------------------------------- */
const EnhancedProgressiveHint = ({ attempts }: { attempts: SongleGuessResult[] }) => {
  if (attempts.length === 0) return null;
  
  const latestAttempt = attempts[attempts.length - 1];
  const correctLetters = latestAttempt.statuses.filter(s => s === 'correct').length;
  const presentLetters = latestAttempt.statuses.filter(s => s === 'present').length;

  const hints = [
    {
      icon: "🎯",
      text: `Great start! You have ${correctLetters} correct letters.`,
      color: "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400"
    },
    {
      icon: "🔍",
      text: `Look for patterns. ${presentLetters} letters are in the title but misplaced.`,
      color: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400"
    },
    {
      icon: "🎵",
      text: "Compare letter positions. Focus on the blue letters first.",
      color: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400"
    },
    {
      icon: "💡",
      text: "Use the revealed hints below to narrow down your options.",
      color: "bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-500/30 text-green-400"
    },
    {
      icon: "⚡",
      text: "Final attempt! Use all clues and think about songs that fit all hints.",
      color: "bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-red-400"
    }
  ];

  const hintIndex = Math.min(attempts.length - 1, hints.length - 1);
  const currentHint = hints[hintIndex];

  return (
    <div className={`rounded-2xl p-4 mb-4 ${currentHint.color}`}>
      <div className="flex items-center mb-2">
        <span className="text-xl mr-3">{currentHint.icon}</span>
        <span className="font-semibold">{currentHint.text}</span>
      </div>

      <div className="flex gap-1 mt-3">
        {latestAttempt.statuses.map((status, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${
              status === 'correct' ? 'bg-gradient-to-r from-blue-400 to-purple-500' :
              status === 'present' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const ValidationHints = ({ puzzleData, attempts }: { puzzleData: SonglePuzzle; attempts: SongleGuessResult[]; }) => {
  const [activeHintIndex, setActiveHintIndex] = useState(0);
  const hintsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (attempts.length === 0) return;
    const latestHintIndex = Math.min(attempts.length - 1, 4);
    setActiveHintIndex(latestHintIndex);
  }, [attempts.length]);

  useEffect(() => {
    const scrollContainer = hintsScrollRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTo({
        left: activeHintIndex * scrollContainer.offsetWidth,
        behavior: 'smooth',
      });
    }
  }, [activeHintIndex]);

  if (attempts.length === 0) return null;

  // Helper functions for title structure hints
  const getTitleStructureHint = () => {
    const title = puzzleData.normalizedTitle;
    const wordCount = title.split(' ').length;
    const charCount = title.replace(/\s/g, '').length;
    
    if (wordCount > 1) {
      return `${wordCount} words with ${charCount} total letters`;
    } else {
      return `${charCount} letters`;
    }
  };

  const getLetterPositionHint = () => {
    const title = puzzleData.normalizedTitle.toLowerCase();
    const latestAttempt = attempts[attempts.length - 1];
    
    // Find correct letters from the latest attempt
    const correctLetters = latestAttempt.statuses
      .map((status, index) => status === 'correct' ? latestAttempt.guess[index].toLowerCase() : null)
      .filter(Boolean) || [];
    
    if (correctLetters.length > 0) {
      return correctLetters.join(', ').toUpperCase();
    } else {
      return title[0].toUpperCase();
    }
  };

  const currentClues = getProgressiveClues(puzzleData, attempts.length);

  const hintItems = [
    // Hint 1: Title structure
    attempts.length >= 1 && (
      <div key="titleStructure" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-blue-400">🔤</span>
          <span className="text-white font-medium">Title Structure:</span>
          <span className="text-purple-400 font-bold">{getTitleStructureHint()}</span>
        </div>
      </div>
    ),
    // Hint 2: Artist & Genre
    attempts.length >= 2 && (
      <div key="artistGenre" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-400">🎤</span>
          <span className="text-white font-medium">Artist:</span>
          <span className="text-purple-400 font-bold">{puzzleData.artist}</span>
        </div>
        {currentClues[1] && (
          <div className="flex items-center gap-2">
            <span className="text-blue-400">🎵</span>
            <span className="text-white font-medium">Genre:</span>
            <span className="text-purple-400 font-bold">{currentClues[1]}</span>
          </div>
        )}
      </div>
    ),
    // Hint 3: Release & Era
    attempts.length >= 3 && (
      <div key="releaseEra" className="flex-none w-full">
        {currentClues[2] && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-400">📅</span>
            <span className="text-white font-medium">Release:</span>
            <span className="text-purple-400 font-bold">{currentClues[2]}</span>
          </div>
        )}
        {currentClues[3] && (
          <div className="flex items-center gap-2">
            <span className="text-blue-400">🌟</span>
            <span className="text-white font-medium">Era:</span>
            <span className="text-purple-400 font-bold">{currentClues[3]}</span>
          </div>
        )}
      </div>
    ),
    // Hint 4: Chart & Awards
    attempts.length >= 4 && (
      <div key="chartAwards" className="flex-none w-full">
        {currentClues[4] && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-400">🏆</span>
            <span className="text-white font-medium">Chart:</span>
            <span className="text-purple-400 font-bold">{currentClues[4]}</span>
          </div>
        )}
        {currentClues[5] && (
          <div className="flex items-center gap-2">
            <span className="text-blue-400">⭐</span>
            <span className="text-white font-medium">Achievement:</span>
            <span className="text-purple-400 font-bold">{currentClues[5]}</span>
          </div>
        )}
      </div>
    ),
    // Hint 5: Letter position and fun fact
    attempts.length >= 5 && (
      <div key="letterHint" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-400">💡</span>
          <span className="text-white font-medium">Letters:</span>
          <span className="text-purple-400 font-bold">{getLetterPositionHint()}</span>
        </div>
        {currentClues[6] && (
          <div className="flex items-center gap-2">
            <span className="text-blue-400">🎯</span>
            <span className="text-white font-medium">Fun Fact:</span>
            <span className="text-purple-400 font-bold">{currentClues[6]}</span>
          </div>
        )}
      </div>
    ),
  ].filter(Boolean);

  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-4 mb-6">
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
          {hintItems.map((hint, index) => (
            <div key={index} className="flex-none w-full snap-center">{hint}</div>
          ))}
        </div>
        {hintItems.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {hintItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveHintIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeHintIndex ? 'bg-blue-400 scale-125' : 'bg-gray-600'
                }`}
                aria-label={`Go to hint ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-blue-400 mt-3 text-center">
        More hints unlock with each guess... ({Math.min(attempts.length, 5)}/5 revealed)
      </p>
    </div>
  );
};

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
  if (isRevealed) return null;
  
  const left = (x / gridCols) * 100;
  const top = (y / gridRows) * 100;
  const width = 100 / gridCols;
  const height = 100 / gridRows;

  return (
    <div
      className="absolute bg-gray-900/90"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */
export default function SongleComponent({ initialData }: SongleComponentProps) {
  const [puzzleData] = useState(initialData);
  const [showImageModal, setShowImageModal] = useState(false);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<SongleGuessResult[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shareMessage, setShareMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGuessLoading, setIsGuessLoading] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const { imageUrl, isLoading: imageLoading, error: imageError } = useCoverArt(puzzleData.targetTitle, puzzleData.artist);
  const [revealPercentage, setRevealPercentage] = useState(0);
  const [revealedBlocks, setRevealedBlocks] = useState<number[]>([]);
  const blockRevealOrderRef = useRef<number[]>([]);
  const [revealedLyricIndices, setRevealedLyricIndices] = useState<number[]>([]);
  const lyricRevealOrderRef = useRef<number[]>([]);
  const [hardMode, setHardMode] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Grid settings
  const GRID_COLS = 20;
  const GRID_ROWS = 20;
  const totalBlocks = GRID_COLS * GRID_ROWS;
  const containerWidth = 90;
  const containerHeight = 130;

  // Lyrics settings
  const lyricChars = puzzleData.lyricHint.split('');
  const totalLyricChars = lyricChars.length;

  /* ----------------------- block reveal order ----------------------- */
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
        for (let i = group.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [group[i], group[j]] = [group[j], group[i]];
        }
        shuffledOrder.push(...group);
      });
      
      blockRevealOrderRef.current = shuffledOrder;
    }
  }, []);

  /* ----------------------- lyric reveal order ----------------------- */
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

  /* --------------------------- analytics ---------------------------- */
  useEffect(() => setGameStarted(true), []);
  useEffect(() => {
    if (!gameStarted) return;
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({ action: 'songle_started', category: 'songle', label: 'songle' });
        clearInterval(checkGtag);
      }
    }, 100);
    return () => clearInterval(checkGtag);
  }, [gameStarted]);

  /* --------------------------- persistence -------------------------- */
  useEffect(() => {
    const saved = localStorage.getItem(`songle-${puzzleData.id}`);
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        setAttempts(progress.attempts || []);
        setGameState(progress.gameState || 'playing');
      } catch (e) { console.error('Error loading saved progress:', e); }
    }
  }, [puzzleData.id]);

  useEffect(() => {
    if (attempts.length > 0 || gameState !== 'playing') {
      localStorage.setItem(`songle-${puzzleData.id}`, JSON.stringify({ attempts, gameState }));
    }
  }, [attempts, gameState, puzzleData.id]);

  /* -------------------------- reveal logic -------------------------- */
  useEffect(() => {
    let newReveal = 0;
    if (attempts.length > 0 && gameState === 'playing') {
      newReveal = Math.min(attempts.length * 15, 75);
    } else if (gameState === 'won' || gameState === 'lost') {
      newReveal = 100;
    }
    setRevealPercentage(newReveal);

    // Calculate number of blocks to reveal
    const numToReveal = Math.floor(totalBlocks * (newReveal / 100));
    const newRevealed = blockRevealOrderRef.current.slice(0, numToReveal);
    setRevealedBlocks(newRevealed);

    // Calculate number of lyrics to reveal
    const numLyricsToReveal = Math.floor(totalLyricChars * (newReveal / 100));
    const newRevealedLyrics = lyricRevealOrderRef.current.slice(0, numLyricsToReveal);
    setRevealedLyricIndices(newRevealedLyrics);
  }, [attempts.length, gameState, totalBlocks, totalLyricChars]);

  /* ---------------------------- sound ----------------------------- */
  const { isMuted } = useSound();
  const playSound = useCallback((soundType: 'correct' | 'incorrect' | 'win' | 'lose' | 'click') => {
    if (isMuted) return;
    const sounds = {
      correct: '/sounds/correct.mp3',
      incorrect: '/sounds/incorrect.mp3',
      win: '/sounds/win.mp3',
      lose: '/sounds/lose.mp3',
      click: '/sounds/click.mp3'
    };
    const audio = new Audio(sounds[soundType]);
    audio.play().catch(() => {});
  }, [isMuted]);

  const triggerConfetti = () => {
    if (confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, { resize: true, useWorker: true });
      myConfetti({ 
        particleCount: 150, 
        spread: 100, 
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#8B5CF6', '#EC4899']
      });
    }
  };

  /* --------------------------- guess handler -------------------------- */
  const handleGuess = async () => {
    if (gameState !== 'playing' || attempts.length >= 6) return;
    const normalizedGuess = guess.trim();
    if (!normalizedGuess) return;
    if (attempts.some(a => a.guess.toLowerCase() === normalizedGuess.toLowerCase())) {
      setErrorMessage('Already guessed this song');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    playSound('click');
    setIsGuessLoading(true);
    try {
      const result = checkSongleGuess(normalizedGuess, puzzleData);
      const newAttempts = [...attempts, result];
      setAttempts(newAttempts);
      setGuess('');

      if (result.isCorrect) {
        setGameState('won');
        triggerConfetti();
        playSound('win');
        await addSongleResult(true, newAttempts.length);
        event({ action: 'songle_win', category: 'songle', label: `attempts_${newAttempts.length}` });
      } else if (newAttempts.length >= 6) {
        setGameState('lost');
        playSound('lose');
        await addSongleResult(false, newAttempts.length);
        event({ action: 'songle_loss', category: 'songle', label: 'max_attempts' });
      } else {
        const hasCorrectOrPresent = result.statuses.some(s => s === 'correct' || s === 'present');
        playSound(hasCorrectOrPresent ? 'correct' : 'incorrect');
      }
    } catch (error) {
      console.error('Error processing guess:', error);
      setErrorMessage('Error processing your guess. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsGuessLoading(false);
    }
  };

  /* --------------------------- share --------------------------- */
  const generateShareMessage = () => {
    if (gameState !== 'won' && gameState !== 'lost') return '';
    const clientDate = new Date();
    const startDate = new Date(2024, 0, 1);
    const puzzleNumber = Math.floor((clientDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    let shareText = `Songle #${puzzleNumber} ${gameState === 'won' ? attempts.length : 'X'}/6\n\n`;
    
    attempts.forEach((attempt, index) => {
      attempt.statuses.forEach(status => {
        if (status === 'correct') {
          shareText += '🟩';
        } else if (status === 'present') {
          shareText += '🟨';
        } else {
          shareText += '⬜';
        }
      });
      if (index < attempts.length - 1) {
        shareText += '\n';
      }
    });
    
    shareText += '\n\nPlay daily at https://triviaah.com/brainwave/songle';
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

  const toggleHardMode = () => {
    setHardMode(!hardMode);
    playSound('click');
  };

  const toggleHint = () => {
    setShowHint(!showHint);
    playSound('click');
  };

  /* -------------------------- block grid -------------------------- */
  const blockGrid: { x: number; y: number }[] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        blockGrid.push({ x: col, y: row });
      }
    }
  const isBlockRevealed = (index: number) => revealedBlocks.includes(index);

  // Check if a lyric character is revealed (always reveal spaces)
  const isLyricRevealed = (index: number, char: string) => {
    return char === ' ' || revealedLyricIndices.includes(index);
  };

  const showImageLoader = imageLoading && !imageError;
  const showImageError = imageError && !imageLoading;
  const showImage = imageUrl && !imageLoading && !imageError;

  const triesLeft = 6 - attempts.length;
  const triesLeftColor = 
    triesLeft >= 4 ? 'text-blue-400' : 
    triesLeft >= 2 ? 'text-yellow-400' : 
    'text-red-400';

  return (
    <div className="relative">
      <canvas ref={confettiCanvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-10" />

      {/* Image Modal */}
      {showImageModal && imageUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-600" style={{ width: '400px', height: '400px' }}>
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowImageModal(false);
                }}
                className="absolute top-3 right-3 bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-full p-2 shadow-xl hover:bg-gray-700/90 z-20 transition-all duration-300 hover:scale-110"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <Image
                src={imageUrl}
                alt="Album cover"
                fill
                className="object-cover"
                priority
              />
              {/* Same block overlay as main image */}
              <div className="absolute inset-0">
                {blockGrid.map((pos, index) => (
                  <PosterBlock
                    key={index}
                    x={pos.x}
                    y={pos.y}
                    gridCols={GRID_COLS}
                    gridRows={GRID_ROWS}
                    isRevealed={isBlockRevealed(index)}
                  />
                ))}
              </div>
              
              {/* Center "?" overlay for modal too */}
              {revealPercentage === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-blue-500/50">
                      <span className="text-blue-400 text-2xl font-bold">?</span>
                    </div>
                    <p className="text-blue-400 font-semibold">Mystery Album</p>
                  </div>
                </div>
              )}
              
              {/* Progress bar for modal */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/70 backdrop-blur-sm rounded-xl p-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-blue-400 text-xs font-medium">Cover Reveal</span>
                    <span className="text-white text-xs font-bold">{Math.round(revealPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${revealPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Game Card */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-5 mb-5">
        {/* Header with Attempts Counter */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
              <Music className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Today&apos;s Song Mystery</h2>
          </div>
          <div className={`flex items-center gap-2 text-lg font-bold ${triesLeftColor}`}>
            <Target className="w-5 h-5" />
            <span>{triesLeft} {triesLeft === 1 ? 'TRY' : 'TRIES'}</span>
          </div>
        </div>

        {/* Album Cover & Lyrics */}
        <div className="flex flex-col md:flex-row gap-6 mb-6 items-center">
          {/* Album Cover Container */}
          <div className="flex-shrink-0 relative">
            <div 
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600" 
              style={{ height: `${containerHeight}px`, width: `${containerWidth}px` }}
              onClick={() => showImage && setShowImageModal(true)}
            >
              {showImageLoader && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-purple-900/50 z-10">
                  <div className="text-blue-400 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mb-2"></div>
                    <span className="text-sm">Loading cover...</span>
                  </div>
                </div>
              )}
              
              {showImageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-purple-900/50 z-10">
                  <div className="text-blue-400 flex flex-col items-center text-center p-4">
                    <span className="text-3xl mb-2">🎵</span>
                    <span className="text-sm">No cover available</span>
                  </div>
                </div>
              )}
              
              {showImage && (
                <>
                  <Image
                    src={imageUrl}
                    alt="Album cover"
                    fill
                    className="object-cover absolute inset-0 z-10"
                    onError={() => {
                      console.error('Image failed to load:', imageUrl);
                    }}
                  />
                  {/* Block overlay */}
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
                  {/* Center "?" overlay */}
                  {revealPercentage === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/70">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-blue-500/50">
                          <span className="text-blue-400 text-2xl font-bold">?</span>
                        </div>
                        <p className="text-blue-400 font-semibold">Mystery Album</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Reveal Progress */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black/70 backdrop-blur-sm rounded-xl p-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-blue-400 text-xs font-medium">Cover Reveal</span>
                        <span className="text-white text-xs font-bold">{Math.round(revealPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${revealPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* Click hint below the image */}
            {showImage && revealPercentage > 0 && (
              <div className="text-xs text-gray-400 text-center mt-2 cursor-pointer hover:text-blue-400 transition-colors" onClick={() => setShowImageModal(true)}>
                Click cover to view larger
              </div>
            )}
          </div>

          {/* Lyrics Section */}
          <div className="flex-grow text-center">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Lyric Hint</h3>
              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-4 rounded-xl text-center font-serif text-base leading-relaxed whitespace-pre-wrap min-h-[120px] flex items-center justify-center border border-purple-500/20">
                <div className="w-full">
                  {lyricChars.map((char, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center justify-center transition-all duration-300 ${
                        isLyricRevealed(index, char)
                          ? 'text-purple-300 font-semibold'
                          : 'text-transparent'
                      } ${char === ' ' ? 'w-3' : 'w-4 h-4 mx-0.5'}`}
                      style={{
                        animation: isLyricRevealed(index, char) ? 'fadeIn 0.3s ease-in' : 'none'
                      }}
                    >
                      {isLyricRevealed(index, char) ? (
                        char
                      ) : char === ' ' ? (
                        ' '
                      ) : (
                        <span className="w-3 h-3 bg-gray-600 rounded-full inline-block"></span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-4 text-sm text-gray-400 mt-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Music Lovers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mic className="w-4 h-4" />
                  <span>5 Attributes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex flex-wrap gap-3 mb-5">
          <button
            onClick={toggleHardMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              hardMode 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            <Flame className="w-4 h-4" />
            {hardMode ? 'Hard Mode ON' : 'Hard Mode'}
          </button>
          
          {hardMode && attempts.length > 0 && !showHint && gameState === 'playing' && (
            <button
              onClick={toggleHint}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
          )}
        </div>

        {/* Game Messages */}
        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-4 animate-pulse">
            <div className="flex items-center gap-2 text-red-400">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              {errorMessage}
            </div>
          </div>
        )}

        {gameState === 'won' && (
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Victory! 🎉</h3>
            <p className="text-blue-400 mb-2">You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="text-gray-300">The song was: <strong className="text-white">&quot;{puzzleData.normalizedTitle.toUpperCase()}&quot;</strong> by <strong className="text-white">{puzzleData.artist}</strong></p>
          </div>
        )}

        {gameState === 'lost' && (
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <Music className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Game Over</h3>
            <p className="text-red-400">The song was: <strong className="text-white">&quot;{puzzleData.normalizedTitle.toUpperCase()}&quot;</strong> by <strong className="text-white">{puzzleData.artist}</strong></p>
          </div>
        )}

        {/* Progressive Hints */}
        {gameState === 'playing' && (
          <>
            <EnhancedProgressiveHint attempts={attempts} />
            <ValidationHints puzzleData={puzzleData} attempts={attempts} />
          </>
        )}

        {/* Previous Attempts Grid */}
        {attempts.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Your Guesses:
            </h3>
            <div className="grid gap-3">
              {attempts.map((attempt, index) => (
                <div key={index} className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
                  <div className="flex flex-wrap justify-center gap-2">
                    {attempt.guess.split('').map((letter, letterIndex) => {
                      const status = attempt.statuses[letterIndex];
                      const bgColor = status === 'correct' 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                        : status === 'present' 
                        ? 'bg-gradient-to-br from-yellow-500 to-amber-600'
                        : 'bg-gray-600 border border-gray-500';
                      const textColor = status === 'absent' ? 'text-gray-300' : 'text-white';
                      
                      return (
                        <div 
                          key={letterIndex} 
                          className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg font-bold ${bgColor} ${textColor} transition-all duration-300 transform hover:scale-110`}
                        >
                          {letter.toUpperCase()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Section */}
        {gameState === 'playing' && (
          <div className="sticky bottom-0 bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-700 p-4 z-[100] -mx-2 md:-mx-4 -mb-2 md:-mb-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={guess}
                  onChange={e => setGuess(e.target.value)}
                  placeholder="Enter song title..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  onKeyPress={e => e.key === 'Enter' && handleGuess()}
                  disabled={isGuessLoading}
                />
              </div>
              <button
                onClick={handleGuess}
                disabled={!guess.trim() || isGuessLoading}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                {isGuessLoading ? '...' : 'GUESS'}
              </button>
            </div>
          </div>
        )}
        
        {/* Share & Feedback Section */}
        {(gameState === 'won' || gameState === 'lost') && (
          <div className="flex flex-col items-center gap-4 mt-6">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <MdShare className="w-5 h-5" />
              Share Result
            </button>
            {shareMessage && (
              <div className="text-blue-400 font-semibold animate-pulse">{shareMessage}</div>
            )}

            <FeedbackComponent
              gameType="songle"
              category="brainwave"
              metadata={{ 
                attempts: attempts.length, 
                won: gameState === 'won', 
                correctAnswer: puzzleData.normalizedTitle,
                artist: puzzleData.artist,
                hardMode
              }}
            />
          </div>
        )}
        </div>

      {/* How to Play Section */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          How to Play:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-blue-400">🎵</span>
            <span>Guess the song from 5 attributes</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-blue-400">🟩</span>
            <span>Blue: Letter in correct position</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-yellow-400">🟨</span>
            <span>Yellow: Letter in title but wrong position</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-gray-400">⬜</span>
            <span>Gray: Letter not in the title</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-purple-400">💡</span>
            <span>Hints unlock after each attempt</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-blue-400">🎯</span>
            <span>6 attempts to guess correctly</span>
          </div>
        </div>
      </div>
    </div>
  );
}