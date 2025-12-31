// src/components/brainwave/botanle/BotanleComponent.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { event } from '@/lib/gtag';
import { useSound } from '@/context/SoundContext';
import { MdShare } from "react-icons/md";
import FeedbackComponent from '@/components/common/FeedbackComponent';
import { fetchWikimediaImage } from '@/lib/wikimedia';
import { addBotanleResult, type BotanlePuzzle } from '@/lib/brainwave/botanle/botanle-sb';
import { checkPlantGuess, type PlantGuessResult } from '@/lib/brainwave/botanle/botanle-logic';

interface BotanleComponentProps {
  initialData: { puzzle: BotanlePuzzle };
}

/* -------------------------------------------------------------------------- */
/*  Helper components                                                         */
/* -------------------------------------------------------------------------- */

const ProgressiveHint = ({ attempts }: { attempts: PlantGuessResult[] }) => {
  if (attempts.length === 0) return null;

  const latestAttempt = attempts[attempts.length - 1];
  const correctLetters = latestAttempt.letterFeedback?.filter(l => l.status === 'correct').length || 0;
  const presentLetters = latestAttempt.letterFeedback?.filter(l => l.status === 'present').length || 0;

  const hints = [
    {
      icon: "🌱",
      text: `Great start! You have ${correctLetters} correct letters.`,
      color: "bg-green-100 border-green-400 text-green-700"
    },
    {
      icon: "🔍",
      text: `Look for patterns. ${presentLetters} letters are in the name but misplaced.`,
      color: "bg-yellow-100 border-yellow-400 text-yellow-700"
    },
    {
      icon: "🌿",
      text: "Compare letter positions. Focus on the green letters first.",
      color: "bg-blue-100 border-blue-400 text-blue-700"
    },
    {
      icon: "💡",
      text: "Use the revealed hints below to narrow down your options.",
      color: "bg-purple-100 border-purple-400 text-purple-700"
    },
    {
      icon: "🌸",
      text: "Final attempt! Use all clues and think about plants that fit all hints.",
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
        {latestAttempt.letterFeedback?.map((letter, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${
              letter.status === 'correct' ? 'bg-green-500' :
              letter.status === 'present' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const ValidationHints = ({ puzzleData, attempts }: { puzzleData: BotanlePuzzle; attempts: PlantGuessResult[]; }) => {
  const [activeHintIndex, setActiveHintIndex] = useState(0);
  const hintsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (attempts.length === 0) return;
    const latestHintIndex = Math.min(attempts.length - 1, 5);
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

  const hintItems = [
    // Hint 1: Category & Family
    attempts.length >= 1 && (
      <div key="categoryFamily" className="flex-none w-full">
        <div className="text-sm mb-2">
          🌿 Category: <strong>{puzzleData.category}</strong>
        </div>
        {puzzleData.family && (
          <div className="text-sm">
            🏷️ Family: <strong>{puzzleData.family}</strong>
          </div>
        )}
      </div>
    ),
    // Hint 2: Native Region & Climate
    attempts.length >= 2 && (
      <div key="regionClimate" className="flex-none w-full">
        {puzzleData.native_region.length > 0 && (
          <div className="text-sm mb-2">
            🌍 Native Region: <strong>{puzzleData.native_region.slice(0, 2).join(', ')}</strong>
          </div>
        )}
        {puzzleData.sun_requirements && (
          <div className="text-sm">
            ☀️ Sun Requirements: <strong>{puzzleData.sun_requirements.replace('_', ' ')}</strong>
          </div>
        )}
      </div>
    ),
    // Hint 3: Appearance
    attempts.length >= 3 && (
      <div key="appearance" className="flex-none w-full">
        {puzzleData.flower_color.length > 0 && (
          <div className="text-sm mb-2">
            🌸 Flower Color: <strong>{puzzleData.flower_color.slice(0, 2).join(', ')}</strong>
          </div>
        )}
        {puzzleData.size_category && (
          <div className="text-sm">
            📏 Size: <strong>{puzzleData.size_category}</strong>
          </div>
        )}
      </div>
    ),
    // Hint 4: Growing Requirements
    attempts.length >= 4 && (
      <div key="requirements" className="flex-none w-full">
        {puzzleData.water_requirements && (
          <div className="text-sm mb-2">
            💧 Water Needs: <strong>{puzzleData.water_requirements}</strong>
          </div>
        )}
        {puzzleData.hardiness_zones && (
          <div className="text-sm">
            🌡️ Hardiness Zone: <strong>{puzzleData.hardiness_zones}</strong>
          </div>
        )}
      </div>
    ),
    // Hint 5: Uses & Features
    attempts.length >= 5 && (
      <div key="usesFeatures" className="flex-none w-full">
        {puzzleData.uses.length > 0 && (
          <div className="text-sm mb-2">
            🏆 Uses: <strong>{puzzleData.uses.slice(0, 2).join(', ')}</strong>
          </div>
        )}
        {puzzleData.fragrance !== 'none' && (
          <div className="text-sm">
            👃 Fragrance: <strong>{puzzleData.fragrance}</strong>
          </div>
        )}
      </div>
    ),
    // Hint 6: Special Features & Name Clues
    attempts.length >= 6 && (
      <div key="specialName" className="flex-none w-full">
        {puzzleData.special_features.length > 0 && (
          <div className="text-sm mb-2">
            ✨ Special: <strong>{puzzleData.special_features.slice(0, 2).join(', ')}</strong>
          </div>
        )}
        <div className="text-sm">
          🔤 First letter: <strong>{puzzleData.answer.charAt(0).toUpperCase()}</strong>
        </div>
        {puzzleData.hint_column && (
          <div className="text-sm mt-2 italic">
            💡 {puzzleData.hint_column}
          </div>
        )}
      </div>
    ),
  ].filter(Boolean);

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-green-800 mb-2">💡 Botanical Hints Revealed:</h4>
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
          <div className="flex justify-center gap-2 mt-2">
            {hintItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveHintIndex(index)}
                className={`w-2 h-2 rounded-full ${index === activeHintIndex ? 'bg-green-600' : 'bg-gray-300'}`}
                aria-label={`Go to hint ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-green-600 mt-2">
        More botanical hints unlock with each guess... ({Math.min(attempts.length, 6)}/6 revealed)
      </p>
    </div>
  );
};

const PosterBlock = ({
  x, y, gridCols, gridRows, isRevealed
}: { x: number; y: number; gridCols: number; gridRows: number; isRevealed: boolean; }) => {
  if (isRevealed) return null;

  const left = (x / gridCols) * 100;
  const top = (y / gridRows) * 100;
  const width = 100 / gridCols;
  const height = 100 / gridRows;

  return (
    <div
      className="absolute bg-emerald-900"
      style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*  Image fetch helper                                                        */
/* -------------------------------------------------------------------------- */
async function fetchPlantImage(plantName: string): Promise<string | null> {
  try {
    const imageUrl = await fetchWikimediaImage(plantName, { entityType: 'plant' });
    if (!imageUrl) throw new Error('Failed to fetch plant image');
    return imageUrl;
  } catch (error) {
    console.error('Error fetching plant image:', error);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */
export default function BotanleComponent({ initialData }: BotanleComponentProps) {
  const [puzzleData] = useState(initialData.puzzle);
  const [showImageModal, setShowImageModal] = useState(false);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<PlantGuessResult[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shareMessage, setShareMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGuessLoading, setIsGuessLoading] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [plantImage, setPlantImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [revealPercentage, setRevealPercentage] = useState(0);
  const [revealedBlocks, setRevealedBlocks] = useState<number[]>([]);
  const blockRevealOrderRef = useRef<number[]>([]);

  const GRID_COLS = 30;
  const GRID_ROWS = 40;
  const totalBlocks = GRID_COLS * GRID_ROWS;
  const containerWidth = 90;
  const containerHeight = 120;

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
        const imageUrl = await fetchPlantImage(puzzleData.answer);
        if (imageUrl) {
          setPlantImage(imageUrl);
          const img = new window.Image();
          img.src = imageUrl;
          img.onload = () => setImageLoading(false);
          img.onerror = () => { setImageError(true); setImageLoading(false); };
        } else {
          setImageError(true);
          setImageLoading(false);
        }
      } catch (error) {
        console.error('Error fetching plant image:', error);
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
        event({ action: 'botanle_started', category: 'botanle', label: 'botanle' });
        clearInterval(checkGtag);
      }
    }, 100);
    return () => clearInterval(checkGtag);
  }, [gameStarted]);

  /* --------------------------- persistence -------------------------- */
  useEffect(() => {
    const saved = localStorage.getItem(`botanle-${puzzleData.id}`);
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
      localStorage.setItem(`botanle-${puzzleData.id}`, JSON.stringify({ attempts, gameState }));
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
      myConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  /* --------------------------- guess handler -------------------------- */
  const handleGuess = async () => {
    if (gameState !== 'playing' || attempts.length >= 6) return;
    const normalizedGuess = guess.trim();
    if (!normalizedGuess) return;
    if (attempts.some(a => a.guess.toLowerCase() === normalizedGuess.toLowerCase())) {
      setErrorMessage('Already guessed this plant');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    playSound('click');
    setIsGuessLoading(true);
    try {
      const result = checkPlantGuess(normalizedGuess, puzzleData, attempts.length + 1);
      const newAttempts = [...attempts, result];
      setAttempts(newAttempts);
      setGuess('');

      if (result.isCorrect) {
        setGameState('won');
        triggerConfetti();
        playSound('win');
        await addBotanleResult(true, newAttempts.length);
        event({ action: 'botanle_win', category: 'botanle', label: `attempts_${newAttempts.length}` });
      } else if (newAttempts.length >= 6) {
        setGameState('lost');
        playSound('lose');
        await addBotanleResult(false, newAttempts.length);
        event({ action: 'botanle_loss', category: 'botanle', label: 'max_attempts' });
      } else {
        const hasCorrectOrPresent = result.letterFeedback?.some(l => l.status === 'correct' || l.status === 'present');
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
    let shareText = `Botanle #${puzzleNumber} ${gameState === 'won' ? attempts.length : 'X'}/6\n\n`;
    
    attempts.forEach((attempt, index) => {
      attempt.letterFeedback?.forEach(letter => {
        if (letter.status === 'correct') {
          shareText += '🟩';
        } else if (letter.status === 'present') {
          shareText += '🟨';
        } else {
          shareText += '⬜';
        }
      });
      if (index < attempts.length - 1) {
        shareText += '\n';
      }
    });
    
    shareText += '\n\nPlay daily at https://triviaah.com/brainwave/botanle';
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
  const showImage = plantImage && !imageLoading && !imageError;

  const triesLeft = 6 - attempts.length;
  const triesLeftColor = triesLeft >= 4 ? 'text-green-600' : triesLeft >= 2 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-4rem)]">
      <canvas ref={confettiCanvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-50" />

      {/* Image Modal */}
      {showImageModal && plantImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-60"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative rounded-lg overflow-hidden bg-emerald-50 w-full h-full flex items-center justify-center">
              <Image
                src={plantImage}
                alt={`${puzzleData.answer} - full size`}
                width={800}
                height={600}
                className="object-contain max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              />
              {revealPercentage < 100 && (
                <div className="absolute inset-0 z-20 pointer-events-none">
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
              )}
              {revealPercentage < 100 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded z-30">
                  {Math.round(revealPercentage)}% revealed
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Guess the plant from its botanical attributes!
          </h2>
          <div className={`text-base font-bold ${triesLeftColor}`}>
            {triesLeft} {triesLeft === 1 ? 'try' : 'tries'} left
          </div>
        </div>

        {/* Image + Category */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-shrink-0">
            <div 
              className="relative rounded-lg overflow-hidden bg-emerald-50 group cursor-pointer"
              style={{ height: `${containerHeight}px`, width: `${containerWidth}px` }}
              onClick={() => showImage && setShowImageModal(true)}
            >
              {showImageLoader && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-gray-200 z-10">
                  <div className="text-gray-600 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mb-1"></div>
                    <span className="text-xs">Loading plant image...</span>
                  </div>
                </div>
              )}
              {showImageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-gray-200 z-10">
                  <div className="text-gray-600 flex flex-col items-center text-center p-2">
                    <span className="text-2xl mb-2">🌿</span>
                    <span className="text-xs">No image available</span>
                  </div>
                </div>
              )}
              {showImage && (
                <>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center transition-all z-40 pointer-events-none">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    </div>
                  </div>
                  
                  <Image 
                    src={plantImage} 
                    alt="Plant" 
                    fill 
                    className="object-cover absolute inset-0 z-10"
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute inset-0 z-20">
                    {blockGrid.map((pos, index) => (
                      <PosterBlock key={index} {...pos} gridCols={GRID_COLS} gridRows={GRID_ROWS}
                                   isRevealed={isBlockRevealed(index)} />
                    ))}
                  </div>
                  {revealPercentage === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                      <span className="text-white text-2xl font-bold bg-emerald-600 bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center">?</span>
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded z-30">
                    {revealPercentage > 0 ? `${Math.round(revealPercentage)}%` : '?'}
                  </div>
                  
                  {revealPercentage > 0 && (
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to magnify
                    </div>
                  )}
                </>
              )}
            </div>
            {showImage && revealPercentage > 0 && (
              <div className="text-xs text-gray-500 text-center mt-1 cursor-pointer" onClick={() => setShowImageModal(true)}>
                Click image to view larger
              </div>
            )}
          </div>

          <div className="flex-grow">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h4 className="font-semibold text-emerald-800 mb-2">🌿 Today&apos;s Plant</h4>
              <p className="text-emerald-700 mb-2">
                Today&apos;s plant is a <strong>{puzzleData.category}</strong>.
              </p>
              {puzzleData.scientific_name && (
                <p className="text-sm text-emerald-600">
                  Scientific name: <em>{puzzleData.scientific_name}</em>
                </p>
              )}
              <p className="text-xs text-emerald-600 mt-2">
                More botanical clues will be revealed with each guess...
              </p>
            </div>
          </div>
        </div>

        {/* Errors */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {/* Hints / Result */}
        {gameState === 'playing' && (
          <>
            <ProgressiveHint attempts={attempts} />
            <ValidationHints puzzleData={puzzleData} attempts={attempts} />
          </>
        )}

        {gameState === 'won' && (
          <div className="bg-emerald-100 border border-emerald-400 text-emerald-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Congratulations! 🌿🎉</h3>
            <p>You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="mt-2">The plant was: <strong>{puzzleData.answer}</strong></p>
            {puzzleData.scientific_name && (
              <p className="text-sm italic mt-1">
                (<em>{puzzleData.scientific_name}</em>)
              </p>
            )}
            {puzzleData.fun_fact && (
              <p className="mt-2 italic">🌱 {puzzleData.fun_fact}</p>
            )}
          </div>
        )}

        {gameState === 'lost' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Game Over</h3>
            <p>The plant was: <strong>{puzzleData.answer}</strong></p>
            {puzzleData.scientific_name && (
              <p className="text-sm italic mt-1">
                (<em>{puzzleData.scientific_name}</em>)
              </p>
            )}
            <p className="mt-2 italic">🌿 {puzzleData.fun_fact}</p>
          </div>
        )}

        {/* Previous Attempts */}
        {attempts.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Your Botanical Guesses:</h3>
            <div className="space-y-4">
              {attempts.map((attempt, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{attempt.guess}</span>
                      {attempt.commonNameMatch && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Common Name</span>
                      )}
                      {attempt.scientificNameMatch && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Scientific Name</span>
                      )}
                    </div>
                    <div className="flex flex-wrap justify-center gap-1">
                      {attempt.letterFeedback?.map((letter, letterIndex) => {
                        const bgColor = letter.status === 'correct' ? 'bg-emerald-500' : 
                                      letter.status === 'present' ? 'bg-yellow-500' : 'bg-gray-300';
                        const textColor = letter.status === 'absent' ? 'text-gray-700' : 'text-white';
                        
                        return (
                          <div 
                            key={letterIndex} 
                            className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold ${bgColor} ${textColor}`}
                          >
                            {letter.letter.toUpperCase()}
                          </div>
                        );
                      })}
                    </div>
                    {attempt.similarityScore && attempt.similarityScore > 0.5 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Similarity: {Math.round(attempt.similarityScore * 100)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        {gameState === 'playing' && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 md:-mx-6 -mb-4 md:-mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={guess}
                onChange={e => setGuess(e.target.value)}
                placeholder="Enter plant name (common or scientific)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onKeyPress={e => e.key === 'Enter' && handleGuess()}
                disabled={isGuessLoading}
              />
              <button
                onClick={handleGuess}
                disabled={!guess.trim() || isGuessLoading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isGuessLoading ? '...' : 'Guess'}
              </button>
            </div>
          </div>
        )}

        {/* Share */}
        {(gameState === 'won' || gameState === 'lost') && (
          <div className="flex flex-col items-center mt-4">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              <MdShare /> Share Result
            </button>
            {shareMessage && <div className="mt-2 text-emerald-600">{shareMessage}</div>}

            <FeedbackComponent
              gameType="botanle"
              category="brainwave"
              metadata={{ attempts: attempts.length, won: gameState === 'won', correctAnswer: puzzleData.answer }}
            />
          </div>
        )}
      </div>

      {/* How to Play */}
      <div className="bg-emerald-50 rounded-lg p-4 mt-6">
        <h3 className="font-bold mb-2 text-emerald-800">How to Play Botanle:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-emerald-700">
          <li>Guess the plant by entering its common or scientific name</li>
          <li>Get letter-by-letter feedback compared to the answer</li>
          <li>🟩 Green: Letter in correct position</li>
          <li>🟨 Yellow: Letter is in the name but wrong position</li>
          <li>⬜ Gray: Letter not in the name</li>
          <li>Botanical hints unlock with each attempt (category, habitat, uses, etc.)</li>
          <li>The plant image becomes clearer with each guess</li>
          <li>You have 6 attempts to guess the plant</li>
          <li>Both common names and scientific names are accepted</li>
        </ul>
        <div className="mt-3 text-xs text-emerald-600">
          <p><strong>Tip:</strong> Try common names first, then scientific names if you&apos;re stuck!</p>
        </div>
      </div>
    </div>
  );
}