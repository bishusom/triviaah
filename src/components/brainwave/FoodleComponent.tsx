// src/components/brainwave/foodle/FoodleComponent.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { event } from '@/lib/gtag';
import { useSound } from '@/context/SoundContext';
import { MdShare } from "react-icons/md";
import FeedbackComponent from '@/components/common/FeedbackComponent';
import { fetchWikimediaImage } from '@/lib/wikimedia';
import { addFoodResult, type FoodPuzzle } from '@/lib/brainwave/foodle/foodle-sb';
import { checkFoodGuess, type FoodGuessResult } from '@/lib/brainwave/foodle/foodle-logic';
import { Home, Brain, Utensils, Target, Users, Search, Sparkles, Eye, EyeOff, Flame, ChefHat } from 'lucide-react';
import Link from 'next/link';

interface FoodleComponentProps {
  initialData: { puzzle: FoodPuzzle };
}

/* -------------------------------------------------------------------------- */
/*  Enhanced Helper Components                                                */
/* -------------------------------------------------------------------------- */
const EnhancedProgressiveHint = ({ attempts }: { attempts: FoodGuessResult[] }) => {
  if (attempts.length === 0) return null;
  
  const latestAttempt = attempts[attempts.length - 1];
  const correctLetters = latestAttempt.letterStatuses?.filter(s => s === 'correct').length || 0;
  const presentLetters = latestAttempt.letterStatuses?.filter(s => s === 'present').length || 0;

  const hints = [
    {
      icon: "🎯",
      text: `Great start! You have ${correctLetters} correct letters.`,
      color: "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-400"
    },
    {
      icon: "🔍",
      text: `Look for patterns. ${presentLetters} letters are in the name but misplaced.`,
      color: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400"
    },
    {
      icon: "👨‍🍳",
      text: "Compare letter positions. Focus on the green letters first.",
      color: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400"
    },
    {
      icon: "💡",
      text: "Use the revealed hints below to narrow down your options.",
      color: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400"
    },
    {
      icon: "🍽️",
      text: "Final attempt! Use all clues and think about dishes that fit all hints.",
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
        {latestAttempt.letterStatuses?.map((status, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${
              status === 'correct' ? 'bg-gradient-to-r from-orange-400 to-red-500' :
              status === 'present' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const ValidationHints = ({ puzzleData, attempts }: { puzzleData: FoodPuzzle; attempts: FoodGuessResult[]; }) => {
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

  // Helper functions for name structure hints
  const getNameStructureHint = () => {
    const name = puzzleData.answer;
    const wordCount = name.split(' ').length;
    const charCount = name.replace(/\s/g, '').length;
    
    if (wordCount > 1) {
      return `${wordCount} words with ${charCount} total letters`;
    } else {
      return `${charCount} letters`;
    }
  };

  const getLetterPositionHint = () => {
    const name = puzzleData.answer.toLowerCase();
    const latestAttempt = attempts[attempts.length - 1];
    
    // Find correct letters from the latest attempt
    const correctLetters = latestAttempt.letterStatuses
      ?.map((status, index) => status === 'correct' ? latestAttempt.guess[index].toLowerCase() : null)
      .filter(Boolean) || [];
    
    if (correctLetters.length > 0) {
      return correctLetters.join(', ').toUpperCase();
    } else {
      return name[0].toUpperCase();
    }
  };

  const hintItems = [
    // Hint 1: Name structure
    attempts.length >= 1 && (
      <div key="nameStructure" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-orange-400">🔤</span>
          <span className="text-white font-medium">Name Structure:</span>
          <span className="text-red-400 font-bold">{getNameStructureHint()}</span>
        </div>
      </div>
    ),
    // Hint 2: Cuisine & Course
    attempts.length >= 2 && (
      <div key="cuisineCourse" className="flex-none w-full">
        {puzzleData.cuisine && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-400">🌍</span>
            <span className="text-white font-medium">Cuisine:</span>
            <span className="text-red-400 font-bold">{puzzleData.cuisine}</span>
          </div>
        )}
        {puzzleData.course && (
          <div className="flex items-center gap-2">
            <span className="text-orange-400">🍽️</span>
            <span className="text-white font-medium">Course:</span>
            <span className="text-red-400 font-bold">{puzzleData.course}</span>
          </div>
        )}
      </div>
    ),
    // Hint 3: Main Ingredients & Cooking Method
    attempts.length >= 3 && (
      <div key="ingredientsMethod" className="flex-none w-full">
        {puzzleData.mainIngredients && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-400">🥕</span>
            <span className="text-white font-medium">Main Ingredients:</span>
            <span className="text-red-400 font-bold">{puzzleData.mainIngredients}</span>
          </div>
        )}
        {puzzleData.cookingMethod && (
          <div className="flex items-center gap-2">
            <span className="text-orange-400">🔥</span>
            <span className="text-white font-medium">Cooking Method:</span>
            <span className="text-red-400 font-bold">{puzzleData.cookingMethod}</span>
          </div>
        )}
      </div>
    ),
    // Hint 4: Flavor Profile & Temperature
    attempts.length >= 4 && (
      <div key="flavorTemp" className="flex-none w-full">
        {puzzleData.flavorProfile && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-400">👅</span>
            <span className="text-white font-medium">Flavor Profile:</span>
            <span className="text-red-400 font-bold">{puzzleData.flavorProfile}</span>
          </div>
        )}
        {puzzleData.temperature && (
          <div className="flex items-center gap-2">
            <span className="text-orange-400">🌡️</span>
            <span className="text-white font-medium">Temperature:</span>
            <span className="text-red-400 font-bold">{puzzleData.temperature}</span>
          </div>
        )}
      </div>
    ),
    // Hint 5: Letter position or starting letter
    attempts.length >= 5 && (
      <div key="letterHint" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-orange-400">💡</span>
          <span className="text-white font-medium">Letters:</span>
          <span className="text-red-400 font-bold">{getLetterPositionHint()}</span>
        </div>
        {puzzleData.funFact && (
          <div className="flex items-center gap-2">
            <span className="text-orange-400">🎯</span>
            <span className="text-white font-medium">Fun Fact:</span>
            <span className="text-red-400 font-bold">{puzzleData.funFact}</span>
          </div>
        )}
      </div>
    ),
  ].filter(Boolean);

  return (
    <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-4 mb-6">
      <h4 className="font-semibold text-orange-400 mb-3 flex items-center gap-2">
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
                  index === activeHintIndex ? 'bg-orange-400 scale-125' : 'bg-gray-600'
                }`}
                aria-label={`Go to hint ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-orange-400 mt-3 text-center">
        More hints unlock with each guess... ({Math.min(attempts.length, 5)}/5 revealed)
      </p>
    </div>
  );
};

const ImageBlock = ({ 
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
  
  // Calculate position as percentages
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
/*  Image fetch helper                                                        */
/* -------------------------------------------------------------------------- */
async function fetchFoodImage(foodName: string): Promise<string | null> {
  try {
    const imageUrl = await fetchWikimediaImage(foodName, { entityType: 'food' });
    if (!imageUrl) throw new Error('Failed to fetch food image');
    return imageUrl;
  } catch (error) {
    console.error('Error fetching food image:', error);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */
export default function FoodleComponent({ initialData }: FoodleComponentProps) {
  const [puzzleData] = useState(initialData.puzzle);
  const [showImageModal, setShowImageModal] = useState(false);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<FoodGuessResult[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shareMessage, setShareMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGuessLoading, setIsGuessLoading] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [foodImage, setFoodImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [revealPercentage, setRevealPercentage] = useState(0);
  const [revealedBlocks, setRevealedBlocks] = useState<number[]>([]);
  const blockRevealOrderRef = useRef<number[]>([]);
  const [hardMode, setHardMode] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const GRID_COLS = 20;
  const GRID_ROWS = 30;
  const totalBlocks = GRID_COLS * GRID_ROWS;
  const containerWidth = 90;
  const containerHeight = 130;

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

  /* --------------------------- fetch image -------------------------- */
  useEffect(() => {
    const fetchImage = async () => {
      try {
        setImageLoading(true);
        setImageError(false);
        const imageUrl = await fetchFoodImage(puzzleData.answer);
        if (imageUrl) {
          setFoodImage(imageUrl);
          const img = new window.Image();
          img.src = imageUrl;
          img.onload = () => setImageLoading(false);
          img.onerror = () => { setImageError(true); setImageLoading(false); };
        } else {
          setImageError(true);
          setImageLoading(false);
        }
      } catch (error) {
        console.error('Error fetching food image:', error);
        setImageError(true);
        setImageLoading(false);
      }
    };
    fetchImage();
  }, [puzzleData.answer]);

  /* --------------------------- analytics ---------------------------- */
  useEffect(() => setGameStarted(true), []);
  useEffect(() => {
    if (!gameStarted) return;
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({ action: 'foodle_started', category: 'foodle', label: 'foodle' });
        clearInterval(checkGtag);
      }
    }, 100);
    return () => clearInterval(checkGtag);
  }, [gameStarted]);

  /* --------------------------- persistence -------------------------- */
  useEffect(() => {
    const saved = localStorage.getItem(`foodle-${puzzleData.id}`);
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
      localStorage.setItem(`foodle-${puzzleData.id}`, JSON.stringify({ attempts, gameState }));
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
  }, [attempts.length, gameState, totalBlocks]);

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
        colors: ['#FF6B35', '#FF8E53', '#FFB088']
      });
    }
  };

  /* --------------------------- guess handler -------------------------- */
  const handleGuess = async () => {
    if (gameState !== 'playing' || attempts.length >= 6) return;
    const normalizedGuess = guess.trim();
    if (!normalizedGuess) return;
    if (attempts.some(a => a.guess.toLowerCase() === normalizedGuess.toLowerCase())) {
      setErrorMessage('Already guessed this dish');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    playSound('click');
    setIsGuessLoading(true);
    try {
      const result = checkFoodGuess(normalizedGuess, puzzleData);
      const newAttempts = [...attempts, result];
      setAttempts(newAttempts);
      setGuess('');

      if (result.isCorrect) {
        setGameState('won');
        triggerConfetti();
        playSound('win');
        await addFoodResult(true, newAttempts.length);
        event({ action: 'foodle_win', category: 'foodle', label: `attempts_${newAttempts.length}` });
      } else if (newAttempts.length >= 6) {
        setGameState('lost');
        playSound('lose');
        await addFoodResult(false, newAttempts.length);
        event({ action: 'foodle_loss', category: 'foodle', label: 'max_attempts' });
      } else {
        const hasCorrectOrPresent = result.letterStatuses?.some(s => s === 'correct' || s === 'present');
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
    let shareText = `Foodle #${puzzleNumber} ${gameState === 'won' ? attempts.length : 'X'}/6\n\n`;
    
    attempts.forEach((attempt, index) => {
      attempt.letterStatuses?.forEach(status => {
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
    
    shareText += '\n\nPlay daily at https://triviaah.com/brainwave/foodle';
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

  const showImageLoader = imageLoading && !imageError;
  const showImageError = imageError && !imageLoading;
  const showImage = foodImage && !imageLoading && !imageError;

  const triesLeft = 6 - attempts.length;
  const triesLeftColor = 
    triesLeft >= 4 ? 'text-orange-400' : 
    triesLeft >= 2 ? 'text-yellow-400' : 
    'text-red-400';

  return (
    <div className="relative">
      <canvas ref={confettiCanvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-10" />

      {/* Image Modal */}
      {showImageModal && foodImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-600" style={{ width: '512px', height: '768px' }}>
              {/* Close Button - Now positioned inside the image container */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the backdrop click
                  setShowImageModal(false);
                }}
                className="absolute top-3 right-3 bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-full p-2 shadow-xl hover:bg-gray-700/90 z-20 transition-all duration-300 hover:scale-110"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <Image
                src={foodImage}
                alt="Mystery Food"
                fill
                className="object-cover"
                priority
              />
              {/* Same block overlay as main image */}
              <div className="absolute inset-0">
                {blockGrid.map((pos, index) => (
                  <ImageBlock
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
                    <p className="text-blue-400 font-semibold">Mystery Landmark</p>
                  </div>
                </div>
              )}
              
              {/* Progress bar for modal */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/70 backdrop-blur-sm rounded-xl p-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-blue-400 text-xs font-medium">Image Reveal</span>
                    <span className="text-white text-xs font-bold">{Math.round(revealPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-cyan-500 h-1.5 rounded-full transition-all duration-500"
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
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-xl">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Today&apos;s Food Mystery</h2>
          </div>
          <div className={`flex items-center gap-2 text-lg font-bold ${triesLeftColor}`}>
            <Target className="w-5 h-5" />
            <span>{triesLeft} {triesLeft === 1 ? 'TRY' : 'TRIES'}</span>
          </div>
        </div>

        {/* Food Image & Category */}
         <div className="flex flex-col md:flex-row gap-6 mb-6 items-center">
          {/* Food Image Container */}
          <div className="flex-shrink-0 relative">
            <div 
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600" 
              style={{ height: `${containerHeight}px`, width: `${containerWidth}px` }}
               onClick={() => showImage && setShowImageModal(true)}
            >
              {showImageLoader && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-900/50 to-red-900/50 z-10">
                  <div className="text-orange-400 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400 mb-2"></div>
                    <span className="text-sm">Loading image...</span>
                  </div>
                </div>
              )}
              
              {showImageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-900/50 to-red-900/50 z-10">
                  <div className="text-orange-400 flex flex-col items-center text-center p-4">
                    <span className="text-3xl mb-2">🍽️</span>
                    <span className="text-sm">No image available</span>
                  </div>
                </div>
              )}
              
              {showImage && (
                <>
                  <Image
                    src={foodImage}
                    alt="Food dish"
                    fill
                    className="object-cover absolute inset-0 z-10"
                    onError={() => {
                      console.error('Image failed to load:', foodImage);
                      setImageError(true);
                    }}
                  />
                  {/* Block overlay */}
                  <div className="absolute inset-0 z-20">
                    {blockGrid.map((pos, index) => (
                      <ImageBlock
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
                        <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-orange-500/50">
                          <span className="text-orange-400 text-2xl font-bold">?</span>
                        </div>
                        <p className="text-orange-400 font-semibold">Mystery Dish</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Reveal Progress */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black/70 backdrop-blur-sm rounded-xl p-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-orange-400 text-xs font-medium">Image Reveal</span>
                        <span className="text-white text-xs font-bold">{Math.round(revealPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-red-500 h-1.5 rounded-full transition-all duration-500"
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
              <div className="text-xs text-gray-400 text-center mt-2 cursor-pointer hover:text-orange-400 transition-colors" onClick={() => setShowImageModal(true)}>
                Click image to view larger
              </div>
            )}
          </div>

          {/* Category Section */}
          <div className="flex-grow text-center">
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Today&apos;s Dish</h3>
              <p className="text-gray-300 text-lg mb-4">
                Today&apos;s dish is from <strong className="text-orange-400">{puzzleData.cuisine}</strong> cuisine.
              </p>
              <div className="flex justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Global Foodies</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChefHat className="w-4 h-4" />
                  <span>6 Attributes</span>
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
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            <Flame className="w-4 h-4" />
            {hardMode ? 'Hard Mode ON' : 'Hard Mode'}
          </button>
          
          {hardMode && attempts.length > 0 && !showHint && gameState === 'playing' && (
            <button
              onClick={toggleHint}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300"
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
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Victory! 🎉</h3>
            <p className="text-orange-400 mb-2">You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="text-gray-300">The dish was: <strong className="text-white">{puzzleData.answer}</strong></p>
            {attempts[attempts.length - 1]?.funFact && (
              <p className="text-red-400 mt-2 italic">{attempts[attempts.length - 1].funFact}</p>
            )}
          </div>
        )}

        {gameState === 'lost' && (
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <Utensils className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Game Over</h3>
            <p className="text-red-400">The dish was: <strong className="text-white">{puzzleData.answer}</strong></p>
            <p className="text-pink-400 mt-2 italic">{puzzleData.funFact}</p>
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
                      const status = attempt.letterStatuses?.[letterIndex] || 'absent';
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
                  placeholder="Enter dish name..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  onKeyPress={e => e.key === 'Enter' && handleGuess()}
                  disabled={isGuessLoading}
                />
              </div>
              <button
                onClick={handleGuess}
                disabled={!guess.trim() || isGuessLoading}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:from-orange-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-semibold"
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
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <MdShare className="w-5 h-5" />
              Share Result
            </button>
            {shareMessage && (
              <div className="text-orange-400 font-semibold animate-pulse">{shareMessage}</div>
            )}

            <FeedbackComponent
              gameType="foodle"
              category="brainwave"
              metadata={{ 
                attempts: attempts.length, 
                won: gameState === 'won', 
                correctAnswer: puzzleData.answer,
                hardMode
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
          <Sparkles className="w-5 h-5 text-orange-400" />
          How to Play:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-orange-400">🍽️</span>
            <span>Guess the dish from 6 attributes</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-orange-400">🟩</span>
            <span>Green: Letter in correct position</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-yellow-400">🟨</span>
            <span>Yellow: Letter in name but wrong position</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-gray-400">⬜</span>
            <span>Gray: Letter not in the name</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-red-400">💡</span>
            <span>Hints unlock after each attempt</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-orange-400">🎯</span>
            <span>6 attempts to guess correctly</span>
          </div>
        </div>
      </div>
    </div>
  );
}