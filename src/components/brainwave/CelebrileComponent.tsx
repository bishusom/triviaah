// src/components/brainwave/celebrile/CelebrileComponent.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { event } from '@/lib/gtag';
import { useSound } from '@/context/SoundContext';
import { MdShare } from "react-icons/md";
import FeedbackComponent from '@/components/common/FeedbackComponent';
import { addCelebrileResult } from '@/lib/brainwave/celebrile/celebrile-sb';
import { 
  checkLetterGuess, 
  validateCelebrityGuess,
  type CelebrileData, 
  type CelebrileGuessResult 
} from '@/lib/brainwave/celebrile/celebrile-logic';
import { fetchWikimediaImage } from '@/lib/wikimedia';
import Image from 'next/image';

interface CelebrileComponentProps {
  initialData: CelebrileData;
}

// Helper function to get correct article (a/an)
function getArticle(word: string): string {
  if (!word) return 'a';
  const firstLetter = word.charAt(0).toLowerCase();
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  return vowels.includes(firstLetter) ? 'an' : 'a';
}

// ProgressiveHint component for Celebrile
const ProgressiveHint = ({ attempts }: { 
  attempts: CelebrileGuessResult[]; 
}) => {
  if (attempts.length === 0) return null;
  
  const latestAttempt = attempts[attempts.length - 1];
  const correctLetters = latestAttempt.letterStatuses?.filter(s => s === 'correct').length || 0;
  const presentLetters = latestAttempt.letterStatuses?.filter(s => s === 'present').length || 0;
  
  const hints = [
    {
      icon: "🎯",
      text: `Great start! You have ${correctLetters} correct letters.`,
      color: "bg-green-100 border-green-400 text-green-700"
    },
    {
      icon: "🔍",
      text: `Look for patterns. ${presentLetters} letters are in the name but misplaced.`,
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
      text: "Final attempt! Use all clues and think about celebrities that fit all hints.",
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
        {latestAttempt.letterStatuses?.map((status, i) => (
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

// Updated ValidationHints component for Celebrile (Plotle-style with proper reveal timing)
const ValidationHints = ({ puzzleData, attempts }: { 
  puzzleData: CelebrileData; 
  attempts: CelebrileGuessResult[]; 
}) => {
  const hints = puzzleData.validationHints || {};
  const hintsRevealed = Math.min(attempts.length, 5);
  const [activeHintIndex, setActiveHintIndex] = useState(0);
  const hintsScrollRef = useRef<HTMLDivElement>(null);

  // Auto-advance effect - triggers on attempts change
  useEffect(() => {
    if (attempts.length === 0) return;
    
    // Updated: Show one hint per attempt (1st attempt = 1st hint, 2nd attempt = 2nd hint, etc.)
    const visibleHints = [
      attempts.length >= 1, // Birth Year
      attempts.length >= 2, // Category + Profession
      attempts.length >= 3, // Nationality + Notable Works
      attempts.length >= 4, // Years Active + First Letter
      attempts.length >= 5, // Word Count
    ].filter(Boolean);
    
    const latestHintIndex = visibleHints.length - 1;
    if (latestHintIndex >= 0) {
      setActiveHintIndex(latestHintIndex);
    }
  }, [attempts.length]);

  // Scroll effect - triggers on activeHintIndex change
  useEffect(() => {
    const scrollContainer = hintsScrollRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTo({
        left: activeHintIndex * scrollContainer.offsetWidth,
        behavior: 'smooth',
      });
    }
  }, [activeHintIndex]);

  // Early return after all hooks
  if (attempts.length === 0) return null;

  const hintItems = [
    attempts.length >= 1 && hints.birthYear && (
      <div key="birthYear" className="flex-none w-full text-sm">
        🎂 Born in: <strong>{hints.birthYear}</strong>
      </div>
    ),
    attempts.length >= 2 && (
      <div key="categoryProfession" className="flex-none w-full">
        {puzzleData.category && (
          <div className="text-sm mb-2">
            🎭 Category: <strong>{puzzleData.category}</strong>
          </div>
        )}
        {hints.profession && (
          <div className="text-sm">
            💼 Profession: <strong>{hints.profession?.join(', ')}</strong>
          </div>
        )}
      </div>
    ),
    attempts.length >= 3 && (
      <div key="nationalityWorks" className="flex-none w-full">
        {hints.nationality && (
          <div className="text-sm mb-2">
            🌍 Nationality: <strong>{hints.nationality}</strong>
          </div>
        )}
        {hints.notableWorks && (
          <div className="text-sm">
            🏆 Known for: <strong>{hints.notableWorks?.slice(0, 2).join(', ')}</strong>
          </div>
        )}
      </div>
    ),
    attempts.length >= 4 && (
      <div key="yearsLetter" className="flex-none w-full">
        {hints.yearsActive && (
          <div className="text-sm mb-2">
            ⏳ Active: <strong>{hints.yearsActive}</strong>
          </div>
        )}
        <div className="text-sm">
          🔤 Starts with: <strong>{puzzleData.targetName.charAt(0).toUpperCase()}</strong>
        </div>
      </div>
    ),
    attempts.length >= 5 && (
      <div key="wordCount" className="flex-none w-full text-sm">
        📝 Name has: <strong>{puzzleData.targetName.split(' ').length} words</strong>
      </div>
    ),
  ].filter(Boolean);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-blue-800 mb-2">💡 Hints Revealed:</h4>
      <div className="relative overflow-hidden">
        <div
          ref={hintsScrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {hintItems.map((hint, index) => (
            <div key={index} className="flex-none w-full snap-center">
              {hint}
            </div>
          ))}
        </div>
        {hintItems.length > 1 && (
          <div className="flex justify-center gap-2 mt-2">
            {hintItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveHintIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === activeHintIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to hint ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-blue-600 mt-2">
        More hints unlock with each guess... ({hintsRevealed}/5 revealed)
      </p>
    </div>
  );
};

// Block component for pixelated reveal (same as Plotle)
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

export default function CelebrileComponent({ initialData }: CelebrileComponentProps) {
  const [puzzleData] = useState(initialData);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<CelebrileGuessResult[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shareMessage, setShareMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isGuessLoading, setIsGuessLoading] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [celebrityImage, setCelebrityImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [revealPercentage, setRevealPercentage] = useState(0);
  const [revealedBlocks, setRevealedBlocks] = useState<number[]>([]);
  const blockRevealOrderRef = useRef<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Grid settings for blocks
  const GRID_COLS = 30;
  const GRID_ROWS = 40;
  const totalBlocks = GRID_COLS * GRID_ROWS;
  const containerWidth = 90;
  const containerHeight = 120;
  
  // Remove unused revealedClues variable
  // const revealedClues = getRevealedClues(attempts.length, puzzleData.clues);

  // Get the correct article for the category
  const categoryArticle = getArticle(puzzleData.category);

  // Initialize block reveal order
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

  // Fetch celebrity image on component mount
  useEffect(() => {
    const fetchImage = async () => {
      try {
        setImageLoading(true);
        setImageError(false);
        const imageUrl = await fetchWikimediaImage(puzzleData.targetName, { entityType: 'person' });
        
        if (imageUrl) {
          console.log('Image found:', imageUrl);
          setCelebrityImage(imageUrl);
          
          // Preload the image to ensure it's cached - FIXED: use window.Image
          const img = new window.Image();
          img.src = imageUrl;
          img.onload = () => {
            setImageLoading(false);
          };
          img.onerror = () => {
            console.error('Failed to load image:', imageUrl);
            setImageError(true);
            setImageLoading(false);
          };
        } else {
          console.log('No image found found');
          setImageError(true);
          setImageLoading(false);
        }
      } catch (error) {
        console.error('Error fetching celebrity image:', error);
        setImageError(true);
        setImageLoading(false);
      }
    };

    fetchImage();
  }, [puzzleData.targetName]);

  // Start game and analytics
  useEffect(() => {
    setGameStarted(true);
  }, []);

  useEffect(() => {
    if (!gameStarted) return;
    
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'celebrile_started', category: 'celebrile', label: 'celebrile'});
        clearInterval(checkGtag);
      }
    }, 100);

    return () => clearInterval(checkGtag);
  }, [gameStarted]);

  // Sound effects
  const { isMuted } = useSound();
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

  // Load saved progress
  useEffect(() => {
    const savedProgress = localStorage.getItem(`celebrile-${puzzleData.id}`);
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

  // Save progress
  useEffect(() => {
    if (attempts.length > 0 || gameState !== 'playing') {
      localStorage.setItem(`celebrile-${puzzleData.id}`, JSON.stringify({
        attempts,
        gameState
      }));
    }
  }, [attempts, gameState, puzzleData.id]);

  // Update reveal percentage and blocks
  useEffect(() => {
    let newReveal = 0;
    if (attempts.length > 0 && gameState === 'playing') {
      newReveal = Math.min(attempts.length * 15, 75); // 15% per attempt, max 75%
    } else if (gameState === 'won' || gameState === 'lost') {
      newReveal = 100;
    }
    setRevealPercentage(newReveal);

    const numToReveal = Math.floor(totalBlocks * (newReveal / 100));
    const newRevealed = blockRevealOrderRef.current.slice(0, numToReveal);
    setRevealedBlocks(newRevealed);
  }, [attempts.length, gameState, totalBlocks]);

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
    }
  };

  const handleGuess = async () => {
    if (gameState !== 'playing' || attempts.length >= 6) return;
    
    const normalizedGuess = guess.trim();
    if (!normalizedGuess) return;
    
    if (attempts.some(a => a.guess.toLowerCase() === normalizedGuess.toLowerCase())) {
      setErrorMessage('Already guessed this celebrity');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    playSound('click');
    setIsGuessLoading(true);
    setValidationError(null); // Clear previous validation errors
    
    try {
      // Validate the celebrity guess (for errors only)
      const validation = await validateCelebrityGuess(normalizedGuess, puzzleData);
      
      // Only show validation error if there's an actual error (not the initial hint)
      if (validation.hint && !validation.isValid) {
        setValidationError(validation.hint);
      }

      const result = checkLetterGuess(normalizedGuess, puzzleData);
      const newAttempts = [...attempts, result];
      setAttempts(newAttempts);
      setGuess('');
      
      if (result.isCorrect) {
        setGameState('won');
        triggerConfetti();
        playSound('win');
        await addCelebrileResult(true, newAttempts.length);
        event({action: 'celebrile_win', category: 'celebrile', label: `attempts_${newAttempts.length}`});
      } else if (newAttempts.length >= 6) {
        setGameState('lost');
        playSound('lose');
        await addCelebrileResult(false, newAttempts.length);
        event({action: 'celebrile_loss', category: 'celebrile', label: 'max_attempts'});
      } else {
        const hasCorrectOrPartial = result.letterStatuses?.some(status => 
          status === 'correct' || status === 'present'
        );
        if (hasCorrectOrPartial) {
          playSound('correct');
        } else {
          playSound('incorrect');
        }
      }
    } catch (error) {
      console.error('Error processing guess:', error);
      setErrorMessage('Error processing your guess. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsGuessLoading(false);
    }
  };

  const generateShareMessage = () => {
    if (gameState !== 'won' && gameState !== 'lost') return '';
    
    const clientDate = new Date();
    const startDate = new Date(2024, 0, 1);
    const puzzleNumber = Math.floor((clientDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let shareText = `Celebrile #${puzzleNumber} ${gameState === 'won' ? attempts.length : 'X'}/6\n\n`;
    
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
    
    shareText += '\n\nPlay daily at https://triviaah.com/brainwave/celebrile';
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

  // Generate block grid
  const blockGrid: { x: number; y: number }[] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      blockGrid.push({ x: col, y: row });
    }
  }

  const isBlockRevealed = (index: number) => revealedBlocks.includes(index);

  // Image loading states
  const showImageLoader = imageLoading && !imageError;
  const showImageError = imageError && !imageLoading;
  const showImage = celebrityImage && !imageLoading && !imageError;

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-4rem)]">
      <canvas 
        ref={confettiCanvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      />
      
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Guess the celebrity from the clues!
          </h2>
          <div className={`text-base font-bold ${triesLeftColor}`}>
            {triesLeft} {triesLeft === 1 ? 'try' : 'tries'} left
          </div>
        </div>

        {/* Image and Category Container */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Image Container */}
          <div className="flex-shrink-0">
            <div 
              className="relative rounded-lg overflow-hidden bg-gray-100" 
              style={{ height: `${containerHeight}px`, width: `${containerWidth}px` }}
            >
              {showImageLoader && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-gray-200 z-10">
                  <div className="text-gray-600 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mb-1"></div>
                    <span className="text-xs">Loading image...</span>
                  </div>
                </div>
              )}
              
              {showImageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-gray-200 z-10">
                  <div className="text-gray-600 flex flex-col items-center text-center p-2">
                    <span className="text-2xl mb-2">👤</span>
                    <span className="text-xs">No image available</span>
                  </div>
                </div>
              )}
              
              {showImage && (
                <>
                  <Image
                    src={celebrityImage}
                    alt="Celebrity"
                    fill
                    className="object-cover absolute inset-0 z-10"
                    onError={() => {
                      console.error('Image failed to load:', celebrityImage);
                      setImageError(true);
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
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                      <span className="text-white text-2xl font-bold bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center">?</span>
                    </div>
                  )}
                  {/* Percentage badge */}
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded z-30">
                    {revealPercentage > 0 ? `${Math.round(revealPercentage)}%` : '?'}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Category Section - Replaced CluesDisplay */}
          <div className="flex-grow">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Today&apos;s Celebrity</h4>
              <p className="text-purple-700">
                Today&apos;s celebrity is {categoryArticle} <strong>{puzzleData.category}</strong>.
              </p>
              <p className="text-xs text-purple-600 mt-2">
                More clues will be revealed as you make guesses...
              </p>
            </div>
          </div>
        </div>

        {/* Error messages */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        
        {/* Validation error - Only show when there's an actual error (not the initial question) */}
        {validationError && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            {validationError}
          </div>
        )}
        
        {/* Conditional rendering of hints or result */}
        {gameState === 'playing' && (
          <>
            {/* Progressive hints */}
            <ProgressiveHint attempts={attempts} />
            
            {/* Validation hints (Plotle-style) */}
            <ValidationHints puzzleData={puzzleData} attempts={attempts} />
          </>
        )}
        
        {/* Game result message */}
        {gameState === 'won' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Congratulations! 🎉</h3>
            <p>You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="mt-2">The celebrity was: <strong>{puzzleData.targetName}</strong></p>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Game Over</h3>
            <p>The celebrity was: <strong>{puzzleData.targetName}</strong></p>
          </div>
        )}
        
        {/* Previous attempts grid - UPDATED TO MATCH PLOTLECOMPONENT */}
        {attempts.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Your Guesses:</h3>
            <div className="space-y-4">
              {attempts.map((attempt, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex flex-wrap justify-center gap-1 mb-2">
                    {attempt.guess.split('').map((letter, letterIndex) => {
                      const status = attempt.letterStatuses?.[letterIndex] || 'absent';
                      const bgColor = status === 'correct' ? 'bg-green-500' : 
                                    status === 'present' ? 'bg-yellow-500' : 'bg-gray-300';
                      const textColor = status === 'absent' ? 'text-gray-700' : 'text-white';
                      
                      return (
                        <div 
                          key={letterIndex} 
                          className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold ${bgColor} ${textColor}`}
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
        
        {/* Input for guesses */}
        {gameState === 'playing' && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 md:-mx-6 -mb-4 md:-mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter celebrity name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                disabled={isGuessLoading}
              />
              <button
                onClick={handleGuess}
                disabled={!guess.trim() || isGuessLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isGuessLoading ? '...' : 'Guess'}
              </button>
            </div>
          </div>
        )}
        
        {/* Share button */}
        {(gameState === 'won' || gameState === 'lost') && (
          <div className="flex flex-col items-center mt-4">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <MdShare /> Share Result
            </button>
            {shareMessage && (
              <div className="mt-2 text-purple-600">{shareMessage}</div>
            )}

            <FeedbackComponent
              gameType="celebrile"
              category="brainwave"
              metadata={{
                attempts: attempts.length,
                won: gameState === 'won',
                correctAnswer: puzzleData.targetName,
                correctAnswerCategory: puzzleData.category
              }}
            />
          </div>
        )}
      </div>

      {/* How to Play section */}
      <div className="bg-gray-100 rounded-lg p-4 mt-6">
        <h3 className="font-bold mb-2">How to Play Celebrile:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Guess the celebrity by entering their name</li>
          <li>Get letter-by-letter feedback compared to the answer</li>
          <li>🟩 Green: Letter in correct position</li>
          <li>🟨 Yellow: Letter is in the name but wrong position</li>
          <li>⬜ Gray: Letter not in the name</li>
          <li>Additional hints unlock with each attempt</li>
          <li>You have 6 attempts to guess the celebrity</li>
          <li>The image becomes clearer with each attempt</li>
        </ul>
      </div>
    </div>
  );
}