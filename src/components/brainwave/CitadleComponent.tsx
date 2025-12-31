// components/brainwave/CitadleComponent.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { event } from '@/lib/gtag';
import { useSound } from '@/context/SoundContext';
import { MdShare } from "react-icons/md";
import FeedbackComponent from '@/components/common/FeedbackComponent';
import { CityPuzzle, addCitadleResult } from '@/lib/brainwave/citadle/citadle-sb';
import { checkCityGuess, CityGuessResult, validateCityGuess, getDifficultyColor, getDifficultyLabel } from '@/lib/brainwave/citadle/citadle-logic';
import { fetchWikimediaImage } from '@/lib/wikimedia';
import Image from 'next/image';

interface CitadleComponentProps {
  initialData: CityPuzzle;
}

// Block component for pixelated city image reveal
const CityBlock = ({ 
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

// ProgressiveHint component for Citadle
const ProgressiveHint = ({ attempts }: { 
  attempts: CityGuessResult[]; 
}) => {
  if (attempts.length === 0) return null;
  
  const latestAttempt = attempts[attempts.length - 1];
  const correctLetters = latestAttempt.letterFeedback?.filter(l => l.status === 'correct').length || 0;
  const presentLetters = latestAttempt.letterFeedback?.filter(l => l.status === 'present').length || 0;
  
  const hints = [
    {
      icon: "🎯",
      text: `Great start! You have ${correctLetters} correct letters.`,
      color: "bg-blue-100 border-blue-400 text-blue-700"
    },
    {
      icon: "🔍",
      text: `Look for patterns. ${presentLetters} letters are in the name but misplaced.`,
      color: "bg-yellow-100 border-yellow-400 text-yellow-700"
    },
    {
      icon: "🤔",
      text: "Compare letter positions. Focus on the green letters first.",
      color: "bg-green-100 border-green-400 text-green-700"
    },
    {
      icon: "💡",
      text: "Use the revealed hints below to narrow down your options.",
      color: "bg-purple-100 border-purple-400 text-purple-700"
    },
    {
      icon: "⚡",
      text: "Final attempt! Use all clues and think about cities that fit all hints.",
      color: "bg-orange-100 border-orange-400 text-orange-700"
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

// ValidationHints component for Citadle (similar to Celebrile)
const ValidationHints = ({ puzzleData, attempts }: { 
  puzzleData: CityPuzzle; 
  attempts: CityGuessResult[]; 
}) => {
  // Get hints directly from puzzleData, not from validationHints
  const hintsRevealed = Math.min(attempts.length, 6);
  const [activeHintIndex, setActiveHintIndex] = useState(0);
  const hintsScrollRef = useRef<HTMLDivElement>(null);

  // Auto-advance effect
  useEffect(() => {
    if (attempts.length === 0) return;
    
    const visibleHints = [
      attempts.length >= 1, // Continent + Country
      attempts.length >= 2, // Coordinates + Timezone
      attempts.length >= 3, // Statistics
      attempts.length >= 4, // City info
      attempts.length >= 5, // Famous + Hint
      attempts.length >= 6, // First letter + Name length
    ].filter(Boolean);
    
    const latestHintIndex = visibleHints.length - 1;
    if (latestHintIndex >= 0) {
      setActiveHintIndex(latestHintIndex);
    }
  }, [attempts.length]);

  // Scroll effect
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
    attempts.length >= 1 && (
      <div key="continentCountry" className="flex-none w-full">
        {/* Use puzzleData.continent directly, not hints.continent */}
        {puzzleData.continent && (
          <div className="text-sm mb-2">
            🌍 Continent: <strong>{puzzleData.continent}</strong>
          </div>
        )}
      </div>
    ),
    attempts.length >= 2 && (
      <div key="stats" className="flex-none w-full">
        {/* For coordinates, check if they exist in puzzleData */}
        {puzzleData.latitude && puzzleData.longitude && (
          <div className="text-sm mb-2">
            📍 Coordinates: <strong>{puzzleData.latitude.toFixed(2)}°, {puzzleData.longitude.toFixed(2)}°</strong>
          </div>
        )}
        {/* Use puzzleData.population directly */}
        {puzzleData.population > 0 && (
          <div className="text-sm mb-2">
            📊 Population: <strong>{(puzzleData.population / 1000000).toFixed(1)}M</strong>
          </div>
        )}
        {/* Add other stats if available in puzzleData */}
        {puzzleData.areaKm2 > 0 && (
          <div className="text-sm mb-2">
            Area: <strong>{puzzleData.areaKm2} km²</strong>
          </div>
        )}
        {/* Add elevation if available */}
        {puzzleData.elevation && (
          <div className="text-sm">
            Elevation: <strong>{puzzleData.elevation}m</strong>
          </div>
        )}
      </div>
    ),
    attempts.length >= 3 && (
      <div key="cityInfo" className="flex-none w-full">
        {/* City type from puzzleData */}
        {puzzleData.isCapital !== undefined && (
          <div className="text-sm mb-2">
            {puzzleData.isCapital ? '🏛️' : '🏙️'} <strong>{puzzleData.isCapital ? 'Capital city' : 'Major city'}</strong>
          </div>
        )}
        {/* Region might be in puzzleData */}
        {puzzleData.region && (
          <div className="text-sm mb-2">
            Country: <strong>{puzzleData.countryCode}</strong>
          </div>
        )}
        {/* Founded year if available */}
        {puzzleData.foundedYear && (
          <div className="text-sm">
            Founded: <strong>{puzzleData.foundedYear}</strong>
          </div>
        )}
      </div>
    ),
    attempts.length >= 4 && (
      <div key="famousHint" className="flex-none w-full">
        {/* Famous for might be in puzzleData */}
        {puzzleData.famousFor && puzzleData.famousFor.length > 0 && (
          <div className="text-sm mb-2">
            🌟 Famous for: <strong>{puzzleData.famousFor.slice(0, 2).join(', ')}</strong>
          </div>
        )}
      </div>
    ),
    attempts.length >= 5 && (
      <div key="finalHints" className="flex-none w-full">
        {/* First letter and name length can be derived from answer */}
        {puzzleData.answer && (
          <>
            <div className="text-sm mb-2">
              🔤 First letter: <strong>{puzzleData.answer.charAt(0).toUpperCase()}</strong>
            </div>
            <div className="text-sm">
              📝 Name length: <strong>{puzzleData.answer.length} letters</strong>
            </div>
          </>
         )}  
        {/* Additional hint if available */}
        {puzzleData.hintColumn && (
        <div className="text-sm">
            💡 <strong>{puzzleData.hintColumn}</strong>
        </div>
        )}
      </div>
    ),
  ].filter(Boolean);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-blue-800 mb-2">💡 Hints Revealed ({hintsRevealed}/6):</h4>
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
        More hints unlock with each guess... ({hintsRevealed}/6 revealed)
      </p>
    </div>
  );
};

export default function CitadleComponent({ initialData }: CitadleComponentProps) {
  const [puzzleData] = useState(initialData);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<CityGuessResult[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showImageModal, setShowImageModal] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isGuessLoading, setIsGuessLoading] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [cityImage, setCityImage] = useState<string | null>(null);
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
  
  // Get the city image URL
  const imageUrl = puzzleData.mapSilhouette || puzzleData.flagUrl;

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

  // Fetch city image on component mount
  useEffect(() => {
    const fetchImage = async () => {
      try {
        setImageLoading(true);
        setImageError(false);
        
        const imageUrl  = await fetchWikimediaImage(puzzleData.answer, {
            entityType: 'city',
            context: puzzleData.country,
            minImageSize: 500
        });
        
        if (imageUrl) {
          console.log('Image found:', imageUrl);
          setCityImage(imageUrl);
          
          // Preload the image
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
          console.log('No image found');
          setImageError(true);
          setImageLoading(false);
        }
      } catch (error) {
        console.error('Error fetching city image:', error);
        setImageError(true);
        setImageLoading(false);
      }
    };

    fetchImage();
  }, [puzzleData.answer, imageUrl]);

  // Start game and analytics
  useEffect(() => {
    setGameStarted(true);
  }, []);

  useEffect(() => {
    if (!gameStarted) return;
    
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'citadle_started', category: 'citadle', label: 'citadle'});
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
    const savedProgress = localStorage.getItem(`citadle-${puzzleData.id}`);
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
      localStorage.setItem(`citadle-${puzzleData.id}`, JSON.stringify({
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
      setErrorMessage('Already guessed this city');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    playSound('click');
    setIsGuessLoading(true);
    setValidationError(null); // Clear previous validation errors
    
    try {
      // Validate the city guess (for errors only)
      const validation = await validateCityGuess(normalizedGuess, puzzleData);
      
      // Only show validation error if there's an actual error (not the initial hint)
      if (validation.hint && !validation.isValid) {
        setValidationError(validation.hint);
      }

      const result = checkCityGuess(normalizedGuess, puzzleData, attempts.length + 1);
      const newAttempts = [...attempts, result];
      setAttempts(newAttempts);
      setGuess('');
      
      if (result.isCorrect) {
        setGameState('won');
        triggerConfetti();
        playSound('win');
        await addCitadleResult(true, newAttempts.length);
        event({action: 'citadle_win', category: 'citadle', label: `attempts_${newAttempts.length}`});
      } else if (newAttempts.length >= 6) {
        setGameState('lost');
        playSound('lose');
        await addCitadleResult(false, newAttempts.length);
        event({action: 'citadle_loss', category: 'citadle', label: 'max_attempts'});
      } else {
        const hasCorrectOrPartial = result.letterFeedback?.some(letter => 
          letter.status === 'correct' || letter.status === 'present'
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

  const getClimateZone = (lat: number): string => {
    const absLat = Math.abs(lat);
    if (absLat <= 23.5) return ' (Tropics)';
    if (absLat <= 35) return ' (Subtropics)';
    if (absLat <= 66.5) return ' (Temperate)';
    return ' (Polar)';
  };

  const generateShareMessage = () => {
    if (gameState !== 'won' && gameState !== 'lost') return '';
    
    const clientDate = new Date();
    const startDate = new Date(2024, 0, 1);
    const puzzleNumber = Math.floor((clientDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let shareText = `Citadle #${puzzleNumber} ${gameState === 'won' ? attempts.length : 'X'}/6\n`;
    shareText += `Difficulty: ${getDifficultyLabel(puzzleData.difficulty)}\n\n`;
    
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
    
    shareText += '\n\nPlay daily at https://triviaah.com/brainwave/citadle';
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
  const difficultyColor = getDifficultyColor(puzzleData.difficulty);

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
  const showImage = cityImage && !imageLoading && !imageError;

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-4rem)]">
      <canvas 
        ref={confettiCanvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      />

      {/* Add Image Modal Here */}
      {showImageModal && cityImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-90"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative rounded-lg overflow-hidden bg-gray-100 w-full h-full flex items-center justify-center">
              <Image
                src={cityImage}
                alt={`${puzzleData.answer} - full size`}
                width={800}
                height={600}
                className="object-contain max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              />
              {/* Block overlay in modal */}
              {revealPercentage < 100 && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  {blockGrid.map((pos, index) => (
                    <CityBlock
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
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              Guess the city from the clues!
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColor}`}>
                {getDifficultyLabel(puzzleData.difficulty)}
              </span>
              <span className="text-xs text-gray-500">
                • {puzzleData.isCapital ? 'Capital city' : 'Major city'}
              </span>
            </div>
          </div>
          <div className={`text-base font-bold ${triesLeftColor}`}>
            {triesLeft} {triesLeft === 1 ? 'try' : 'tries'} left
          </div>
        </div>

        {/* Image Container */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Image Container */}
          <div className="flex-shrink-0">
            <div 
              className="relative rounded-lg overflow-hidden bg-gray-100" 
              style={{ height: `${containerHeight}px`, width: `${containerWidth}px` }}
            >
              {showImageLoader && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-200 z-10">
                  <div className="text-gray-600 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-1"></div>
                    <span className="text-xs">Loading image...</span>
                  </div>
                </div>
              )}
              
              {showImageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-200 z-10">
                  <div className="text-gray-600 flex flex-col items-center text-center p-2">
                    <span className="text-2xl mb-2">🏙️</span>
                    <span className="text-xs">No image available</span>
                  </div>
                </div>
              )}
              
              {showImage && (
                <>
                  <Image
                    src={cityImage}
                    alt="City"
                    fill
                    className="object-cover absolute inset-0 z-10"
                    onError={() => {
                      console.error('Image failed to load:', cityImage);
                      setImageError(true);
                    }}
                  />
                  {/* Block overlay */}
                  <div className="absolute inset-0 z-20">
                    {blockGrid.map((pos, index) => (
                      <CityBlock
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

                  {/* Click to magnify hint text */}
                  {revealPercentage > 0 && (
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to magnify
                    </div>
                  )}
                </>
              )}
            </div>
            {/* Click hint below the image */}
            {showImage && revealPercentage > 0 && (
              <div className="text-xs text-gray-500 text-center mt-1 cursor-pointer" onClick={() => setShowImageModal(true)}>
                Click to magnify
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex-grow">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Today&apos;s City</h4>
              <p className="text-blue-700">
                {puzzleData.isCapital ? 'A capital city' : 'A major city'} located in the{' '}
                <strong className="text-blue-800">
                  {puzzleData.latitude >= 0 ? '🌎 Northern' : '🌍 Southern'} Hemisphere
                  {getClimateZone(puzzleData.latitude)} •{' '} {Math.abs(puzzleData.latitude).toFixed(1)}° {puzzleData.latitude >= 0 ? 'N' : 'S'}
                </strong>.
              </p>
              <p className="text-xs text-blue-600 mt-2">
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
        
        {/* Validation error */}
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
            
            {/* Validation hints (similar to Celebrile) */}
            <ValidationHints puzzleData={puzzleData} attempts={attempts} />
          </>
        )}
        
        {/* Game result message */}
        {gameState === 'won' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Congratulations! 🎉</h3>
            <p>You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="mt-2">The city was: <strong>{puzzleData.answer.toUpperCase()}</strong></p>
            <p className="mt-1 text-sm">
              {puzzleData.country} • {puzzleData.continent}
              {puzzleData.population > 0 && ` • Population: ${(puzzleData.population / 1000000).toFixed(1)}M`}
            </p>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Game Over</h3>
            <p>The city was: <strong>{puzzleData.answer.toUpperCase()}</strong></p>
            <p className="mt-1 text-sm">
              {puzzleData.country} • {puzzleData.continent}
              {puzzleData.population > 0 && ` • Population: ${(puzzleData.population / 1000000).toFixed(1)}M`}
            </p>
          </div>
        )}
        
        {/* Previous attempts grid */}
        {attempts.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Your Guesses:</h3>
            <div className="space-y-4">
              {attempts.map((attempt, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex flex-wrap justify-center gap-1 mb-2">
                    {attempt.guess.split('').map((letter, letterIndex) => {
                      const status = attempt.letterFeedback?.[letterIndex]?.status || 'absent';
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
                  <div className="text-center text-xs text-gray-500">
                    {attempt.guess}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Input for guesses - FREE TEXT like Celebrile */}
        {gameState === 'playing' && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 md:-mx-6 -mb-4 md:-mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter city name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                disabled={isGuessLoading}
              />
              <button
                onClick={handleGuess}
                disabled={!guess.trim() || isGuessLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <MdShare /> Share Result
            </button>
            {shareMessage && (
              <div className="mt-2 text-blue-600">{shareMessage}</div>
            )}

            <FeedbackComponent
              gameType="citadle"
              category="brainwave"
              metadata={{
                attempts: attempts.length,
                won: gameState === 'won',
                correctAnswer: puzzleData.answer,
                correctAnswerCountry: puzzleData.country,
                correctAnswerContinent: puzzleData.continent,
                isCapital: puzzleData.isCapital,
                difficulty: puzzleData.difficulty
              }}
            />
          </div>
        )}
      </div>

      {/* How to Play section */}
      <div className="bg-gray-100 rounded-lg p-4 mt-6">
        <h3 className="font-bold mb-2">How to Play Citadle:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Guess the city by entering its name (free text input)</li>
          <li>Get letter-by-letter feedback compared to the answer</li>
          <li>🟩 Green: Letter in correct position</li>
          <li>🟨 Yellow: Letter is in the name but wrong position</li>
          <li>⬜ Gray: Letter not in the name</li>
          <li>Additional hints unlock with each attempt</li>
          <li>You have 6 attempts to guess the city</li>
          <li>The image becomes clearer with each attempt</li>
        </ul>
      </div>
    </div>
  );
}