// components/brainwave/countridleComponent.tsx
'use client';

import { event } from '@/lib/gtag';
import confetti from 'canvas-confetti';
import { MdShare } from "react-icons/md";
import { useSound } from '@/context/SoundContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import FeedbackComponent from '@/components/common/FeedbackComponent';
import { CountryPuzzle, CountryInfo, addCountryResult } from '@/lib/brainwave/countridle/countridle-sb';
import { checkCountryGuess, CountryGuessResult, isValidCountry } from '@/lib/brainwave/countridle/countridle-logic';
import Image from 'next/image';

interface countridleComponentProps {
  initialData: CountryPuzzle;
  allCountries: CountryInfo[];
}

// Block component for pixelated flag reveal
const FlagBlock = ({ 
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
      className="absolute bg-gray-900"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
    />
  );
};

// Progressive hints component with dots navigation
const ProgressiveHints = ({ 
  puzzleData, 
  attempts 
}: { 
  puzzleData: CountryPuzzle; 
  attempts: CountryGuessResult[]; 
}) => {
  const [activeHintIndex, setActiveHintIndex] = useState(0);
  const hintsScrollRef = useRef<HTMLDivElement>(null);
  
  const hintsRevealed = Math.min(attempts.length, 6);
  
  const hintItems = [
    attempts.length >= 1 && (
      <div key="continent-map" className="flex-none w-full">
        <div className="text-sm mb-2 text-gray-200">
          🌍 Continent: <strong className="text-red-300">{puzzleData.continent}</strong>
        </div>
        {puzzleData.mapSilhouette && (
          <div className="relative h-32 w-full bg-gray-800 rounded mt-2">
            <Image
              src={puzzleData.mapSilhouette}
              alt="Country outline"
              fill
              className="object-contain p-2"
            />
          </div>
        )}
      </div>
    ),
    attempts.length >= 2 && (
      <div key="coordinates" className="flex-none w-full text-sm text-gray-200">
        📍 Coordinates: <strong className="text-red-300">{puzzleData.latitude.toFixed(2)}°N, {puzzleData.longitude.toFixed(2)}°E</strong>
        <div className="text-xs text-gray-400 mt-1">
          Timezone: {puzzleData.timezone}
        </div>
      </div>
    ),
    attempts.length >= 3 && (
      <div key="stats" className="flex-none w-full">
        <div className="text-sm mb-2 text-gray-200">
          📊 Statistics:
        </div>
        <div className="grid grid-cols-2 gap-1 text-xs text-gray-300">
          <div>Population: <strong className="text-red-300">{(puzzleData.population / 1000000).toFixed(1)}M</strong></div>
          <div>Area: <strong className="text-red-300">{(puzzleData.areaKm2 / 1000000).toFixed(1)}M km²</strong></div>
          <div>Driving side: <strong className="text-red-300">{puzzleData.drivingSide}</strong></div>
          <div>Currency: <strong className="text-red-300">{puzzleData.currency}</strong></div>
        </div>
      </div>
    ),
    attempts.length >= 4 && (
      <div key="capital" className="flex-none w-full text-sm text-gray-200">
        🏛️ Capital: <strong className="text-red-300">{puzzleData.capital}</strong>
        {puzzleData.languages.length > 0 && (
          <div className="mt-1">
            Languages: <strong className="text-red-300">{puzzleData.languages.slice(0, 2).join(', ')}</strong>
          </div>
        )}
      </div>
    ),
    attempts.length >= 5 && (
      <div key="table-hint" className="flex-none w-full text-sm text-gray-200">
        🔍 Extra Hint:
        <div className="mt-1 text-xs bg-gray-800 p-2 rounded">
          {puzzleData.hint}
        </div>
      </div>
    ),
    attempts.length >= 6 && (
      <div key="final-hint" className="flex-none w-full text-sm text-gray-200">
        ⚡ Final Hint:
        <div className="mt-1 text-xs bg-amber-900/30 p-2 rounded border border-amber-700">
          <strong className="text-amber-300">Think about:</strong>
          <ul className="list-disc list-inside mt-1 text-amber-200">
            <li>Letter positions from previous guesses</li>
            <li>Geographic location based on coordinates</li>
            <li>Country size relative to the continent</li>
          </ul>
        </div>
      </div>
    ),
  ].filter(Boolean);


  // Auto-advance to latest hint
  useEffect(() => {
    if (attempts.length === 0) return;
    
    const latestHintIndex = Math.min(attempts.length - 1, hintItems.length - 1);
    if (latestHintIndex >= 0) {
      setActiveHintIndex(latestHintIndex);
    }
  }, [attempts.length, hintItems.length]);

  // Scroll to active hint
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

  return (
    <div className="bg-gray-800/50 border border-red-800/50 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-red-300 mb-2">
        💡 Hints Revealed ({hintsRevealed}/6):
      </h4>
      <div className="relative overflow-hidden">
        <div
          ref={hintsScrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {hintItems.map((hint, index) => (
            <div key={index} className="flex-none w-full snap-center px-1">
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
                  index === activeHintIndex ? 'bg-red-500' : 'bg-gray-600'
                }`}
                aria-label={`Go to hint ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-red-400 mt-2">
        Flag image reveals {Math.min(attempts.length * 15, 75)}% — Use it to help guess!
      </p>
    </div>
  );
};

// Progressive feedback component
const ProgressiveFeedback = ({ attempts }: { 
  attempts: CountryGuessResult[]; 
}) => {
  if (attempts.length === 0) return null;
  
  const latestAttempt = attempts[attempts.length - 1];
  const correctLetters = latestAttempt.letterFeedback?.filter(l => l.status === 'correct').length || 0;
  const presentLetters = latestAttempt.letterFeedback?.filter(l => l.status === 'present').length || 0;
  
  const feedbackMessages = [
    {
      icon: "🌍",
      text: `Great start! You know the continent and can see the map outline.`,
      color: "bg-emerald-900/30 border-emerald-700 text-emerald-200"
    },
    {
      icon: "📍",
      text: `Coordinates and timezone revealed! ${presentLetters} letters are in the name but misplaced.`,
      color: "bg-amber-900/30 border-amber-700 text-amber-200"
    },
    {
      icon: "📊",
      text: "Statistics are now available. Use population, area, and other data to narrow it down.",
      color: "bg-blue-900/30 border-blue-700 text-blue-200"
    },
    {
      icon: "🏛️",
      text: "Capital and languages revealed! This should help identify the country.",
      color: "bg-red-900/30 border-red-700 text-red-200"
    },
    {
      icon: "🔍",
      text: "Extra hint from our database! Combine all clues for the final guess.",
      color: "bg-purple-900/30 border-purple-700 text-purple-200"
    },
    {
      icon: "⚡",
      text: "Final attempt! Use all revealed information strategically.",
      color: "bg-orange-900/30 border-orange-700 text-orange-200"
    }
  ];
  
  const feedbackIndex = Math.min(attempts.length - 1, feedbackMessages.length - 1);
  const currentFeedback = feedbackMessages[feedbackIndex];
  
  return (
    <div className={`rounded-lg p-3 mb-3 border ${currentFeedback.color}`}>
      <div className="flex items-center">
        <span className="text-xl mr-2">{currentFeedback.icon}</span>
        <span className="font-medium text-sm">{currentFeedback.text}</span>
      </div>
      {attempts.length > 0 && (
        <div className="flex gap-1 mt-2">
          {latestAttempt.letterFeedback?.map((letter, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded ${
                letter.status === 'correct' ? 'bg-emerald-500' :
                letter.status === 'present' ? 'bg-amber-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CountridleComponent({ initialData, allCountries }: countridleComponentProps) {
  const [puzzleData] = useState(initialData);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<CountryGuessResult[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shareMessage, setShareMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [suggestions, setSuggestions] = useState<CountryInfo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [revealPercentage, setRevealPercentage] = useState(0);
  const [revealedBlocks, setRevealedBlocks] = useState<number[]>([]);
  const blockRevealOrderRef = useRef<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Grid settings for flag blocks
  const GRID_COLS = 30;
  const GRID_ROWS = 20;
  const totalBlocks = GRID_COLS * GRID_ROWS;
  const containerWidth = 300;
  const containerHeight = 200;
  
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

  // Load and handle flag image
  useEffect(() => {
    if (puzzleData.flagUrl) {
      setImageLoading(true);
      setImageError(false);
      
      // Preload the image
      const img = new window.Image();
      img.src = puzzleData.flagUrl;
      img.onload = () => {
        setImageLoading(false);
      };
      img.onerror = () => {
        console.error('Failed to load flag image:', puzzleData.flagUrl);
        setImageError(true);
        setImageLoading(false);
      };
    }
  }, [puzzleData.flagUrl]);

  // Start game and analytics
  useEffect(() => {
    setGameStarted(true);
  }, []);

  useEffect(() => {
    if (!gameStarted) return;
    
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'countridle_started', category: 'countridle', label: 'countridle'});
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
    const savedProgress = localStorage.getItem(`countridle-${puzzleData.id}`);
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
      localStorage.setItem(`countridle-${puzzleData.id}`, JSON.stringify({
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

  // Autocomplete suggestions
  useEffect(() => {
    if (guess.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      return;
    }

    const normalizedGuess = guess.toLowerCase().trim();
    const filtered = allCountries
      .filter(country => 
        country.name.toLowerCase().includes(normalizedGuess) ||
        country.capital.toLowerCase().includes(normalizedGuess)
      )
      .slice(0, 5); // Limit to 5 suggestions

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedSuggestionIndex(-1);
  }, [guess, allCountries]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
          setGuess(suggestions[selectedSuggestionIndex].name);
          setShowSuggestions(false);
        }
        break;
      
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

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

  const handleGuess = (userGuess?: string) => {
    if (gameState !== 'playing' || attempts.length >= 6) return;
    
    const normalizedGuess = (userGuess || guess).trim();
    if (!normalizedGuess) return;
    
    // Check for duplicate guesses
    if (attempts.some(a => a.guess.toLowerCase() === normalizedGuess.toLowerCase())) {
      setErrorMessage('Already guessed this country');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    // Validate that the guess is a valid country
    if (!isValidCountry(normalizedGuess, puzzleData.validCountries)) {
      setErrorMessage('Not a valid country name');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    playSound('click');
    
    const result = checkCountryGuess(
      normalizedGuess,
      puzzleData,
      attempts.length + 1,
      allCountries
    );
    
    const newAttempts = [...attempts, result];
    setAttempts(newAttempts);
    setGuess('');
    setShowSuggestions(false);
    
    if (result.isCorrect) {
      setGameState('won');
      triggerConfetti();
      playSound('win');
      addCountryResult(true, newAttempts.length);
      event({action: 'countridle_win', category: 'countridle', label: `attempts_${newAttempts.length}`});
    } else if (newAttempts.length >= 6) {
      setGameState('lost');
      playSound('lose');
      addCountryResult(false, newAttempts.length);
      event({action: 'countridle_loss', category: 'countridle', label: 'max_attempts'});
    } else {
      // Check if any letters are correct or present
      const hasCorrectOrPartial = result.letterFeedback?.some(letter => 
        letter.status === 'correct' || letter.status === 'present'
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
    
    let shareText = `countridle #${puzzleNumber} ${gameState === 'won' ? attempts.length : 'X'}/6\n\n`;
    
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
    
    shareText += '\n\nPlay daily at https://triviaah.com/brainwave/countridle';
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
  const triesLeftColor = triesLeft >= 4 ? 'text-emerald-400' : triesLeft >= 2 ? 'text-amber-400' : 'text-red-400';

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
  const showImage = puzzleData.flagUrl && !imageLoading && !imageError;

  return (
     <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-5 mb-5">
      <canvas 
        ref={confettiCanvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      />
      
      <div className="bg-green-800 rounded-lg shadow-lg p-4 md:p-6 mb-6 flex-grow border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-100">
            Guess the country from the clues!
          </h2>
          <div className={`text-base font-bold ${triesLeftColor}`}>
            {triesLeft} {triesLeft === 1 ? 'try' : 'tries'} left
          </div>
        </div>

        {/* Flag Container */}
        <div className="flex justify-center mb-6">
          <div 
            className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900" 
            style={{ height: `${containerHeight}px`, width: `${containerWidth}px`, maxWidth: '100%' }}
          >
            {showImageLoader && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-gray-400 flex flex-col items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mb-1"></div>
                  <span className="text-xs">Loading flag...</span>
                </div>
              </div>
            )}
            
            {showImageError && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-gray-400 flex flex-col items-center text-center p-2">
                  <span className="text-2xl mb-2">🏴</span>
                  <span className="text-xs">No flag available</span>
                </div>
              </div>
            )}
            
            {showImage && (
              <>
                <Image
                  src={puzzleData.flagUrl!}
                  alt="Country flag"
                  fill
                  className="object-cover absolute inset-0 z-10"
                />
                
                {/* Block overlay */}
                <div className="absolute inset-0 z-20">
                  {blockGrid.map((pos, index) => (
                    <FlagBlock
                      key={index}
                      {...pos}
                      gridCols={GRID_COLS}
                      gridRows={GRID_ROWS}
                      isRevealed={isBlockRevealed(index)}
                    />
                  ))}
                </div>
                
                {/* Center "?" overlay for completely hidden flag */}
                {revealPercentage === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center z-30">
                    <span className="text-white text-2xl font-bold bg-black bg-opacity-70 rounded-full w-8 h-8 flex items-center justify-center">?</span>
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

        {/* Error message */}
        {errorMessage && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        
        {/* Progressive feedback */}
        {gameState === 'playing' && attempts.length > 0 && (
          <ProgressiveFeedback attempts={attempts} />
        )}
        
        {/* Progressive hints with dots navigation */}
        {gameState === 'playing' && attempts.length > 0 && (
          <ProgressiveHints puzzleData={puzzleData} attempts={attempts} />
        )}
        
        {/* Game result message */}
        {gameState === 'won' && (
          <div className="bg-emerald-900/30 border border-emerald-700 text-emerald-200 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Congratulations! 🎉</h3>
            <p>You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="mt-2">The country was: <strong className="text-emerald-300">{puzzleData.answer.toUpperCase()}</strong></p>
            <p className="mt-1 text-sm text-emerald-100">Capital: {puzzleData.capital} | Continent: {puzzleData.continent}</p>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Game Over</h3>
            <p>The country was: <strong className="text-red-300">{puzzleData.answer.toUpperCase()}</strong></p>
            <p className="mt-1 text-sm text-red-100">Capital: {puzzleData.capital} | Continent: {puzzleData.continent}</p>
          </div>
        )}
        
        {/* Previous attempts grid (Wordle-style) */}
        {attempts.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-200">Your Guesses:</h3>
            <div className="space-y-3">
              {attempts.map((attempt, attemptIndex) => (
                <div key={attemptIndex} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm text-gray-200">{attempt.guess}</span>
                    <span className="text-xs text-gray-400">
                      Attempt {attemptIndex + 1}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1">
                    {attempt.letterFeedback?.map((letter, letterIndex) => {
                      const bgColor = letter.status === 'correct' ? 'bg-emerald-600' : 
                                    letter.status === 'present' ? 'bg-amber-500' : 'bg-gray-700';
                      const textColor = letter.status === 'absent' ? 'text-gray-300' : 'text-white';
                      
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
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Input for guesses with autocomplete */}
        {gameState === 'playing' && (
          <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4 -mx-4 md:-mx-6 -mb-4 md:-mb-6">
            <div className="relative">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => guess.length >= 2 && setShowSuggestions(true)}
                  placeholder="Enter country name (type 2+ letters)"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-100 placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                />
                <button
                  onClick={() => handleGuess()}
                  disabled={!guess.trim()}
                  className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                  Guess
                </button>
              </div>
              
              {/* Autocomplete suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20 mt-1 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((country, index) => (
                    <button
                      key={`${country.countryCode}-${index}`}
                      type="button"
                      onClick={() => {
                        setGuess(country.name);
                        setShowSuggestions(false);
                        // Auto-submit after short delay
                        setTimeout(() => handleGuess(country.name), 100);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-700 focus:bg-gray-700 focus:outline-none ${
                        index === selectedSuggestionIndex ? 'bg-gray-700' : ''
                      } ${index > 0 ? 'border-t border-gray-700' : ''}`}
                    >
                      <div className="font-medium text-gray-200">{country.name}</div>
                      <div className="text-sm text-gray-400">
                        {country.capital} • {country.continent}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Start typing for autocomplete suggestions (minimum 2 characters)
            </div>
          </div>
        )}
        
        {/* Share button & feedback */}
        {(gameState === 'won' || gameState === 'lost') && (
          <div className="flex flex-col items-center mt-4">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              <MdShare /> Share Result
            </button>
            {shareMessage && (
              <div className="mt-2 text-red-300">{shareMessage}</div>
            )}

            <FeedbackComponent
              gameType="countridle"
              category="brainwave"
              metadata={{
                attempts: attempts.length,
                won: gameState === 'won',
                targetCountry: puzzleData.answer,
                targetContinent: puzzleData.continent,
                targetCapital: puzzleData.capital
              }}
            />
          </div>
        )}
      </div>

      {/* How to Play section */}
      <div className="bg-gray-800/50 rounded-lg p-4 mt-6 border border-gray-700">
        <h3 className="font-bold mb-2 text-gray-200">How to Play countridle:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
          <li>Guess the country by entering its name</li>
          <li>Get letter-by-letter feedback compared to the answer</li>
          <li className="text-emerald-400">🟩 Green: Letter in correct position</li>
          <li className="text-amber-400">🟨 Yellow: Letter is in the name but wrong position</li>
          <li className="text-gray-400">⬜ Gray: Letter not in the name</li>
          <li>The flag image becomes clearer with each attempt (15% per guess)</li>
          <li>New hints unlock with each wrong guess:</li>
          <ol className="list-decimal list-inside ml-4 mt-1 space-y-1 text-gray-300">
            <li>Continent & Map outline (after 1 attempt)</li>
            <li>Coordinates & timezone (after 2 attempts)</li>
            <li>Statistics: population, area, driving side, currency (after 3 attempts)</li>
            <li>Capital & languages (after 4 attempts)</li>
            <li>Extra hint from our database (after 5 attempts)</li>
            <li>Final strategic hint (after 6 attempts)</li>
          </ol>
          <li>You have 6 attempts to guess the country</li>
          <li>Use the dots below hints to navigate between them</li>
        </ul>
      </div>
    </div>
  );
}