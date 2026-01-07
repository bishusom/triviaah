// components/brainwave/CitadleComponent.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { event } from '@/lib/gtag';
import { useSound } from '@/context/SoundContext';
import { MdShare } from "react-icons/md";
import FeedbackComponent from '@/components/common/FeedbackComponent';
import { fetchWikimediaImage } from '@/lib/wikimedia';
import { CityPuzzle, addCitadleResult } from '@/lib/brainwave/citadle/citadle-sb';
import { checkCityGuess, CityGuessResult, validateCityGuess, getDifficultyColor, getDifficultyLabel } from '@/lib/brainwave/citadle/citadle-logic';
import { Home, Brain, Building2, Target, Zap, Eye, EyeOff, Search, Sparkles, Globe, Users, MapPin, Mountain, Calendar } from 'lucide-react';

interface CitadleComponentProps {
  initialData: CityPuzzle;
}

/* -------------------------------------------------------------------------- */
/*  Enhanced Helper Components                                                */
/* -------------------------------------------------------------------------- */
const EnhancedProgressiveHint = ({ attempts }: { attempts: CityGuessResult[] }) => {
  if (attempts.length === 0) return null;
  
  const latestAttempt = attempts[attempts.length - 1];
  const correctLetters = latestAttempt.letterFeedback?.filter(l => l.status === 'correct').length || 0;
  const presentLetters = latestAttempt.letterFeedback?.filter(l => l.status === 'present').length || 0;

  const hints = [
    {
      icon: "🏙️",
      text: `Great start! You have ${correctLetters} correct letters.`,
      color: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400"
    },
    {
      icon: "🔍",
      text: `Look for patterns. ${presentLetters} letters are in the name but misplaced.`,
      color: "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-400"
    },
    {
      icon: "🗺️",
      text: "Compare letter positions. Focus on the green letters first.",
      color: "bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-400"
    },
    {
      icon: "💡",
      text: "Use the revealed hints below to narrow down your options.",
      color: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400"
    },
    {
      icon: "⚡",
      text: "Final attempt! Use all clues and think about cities that fit all hints.",
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
        {latestAttempt.letterFeedback?.map((letter, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${
              letter.status === 'correct' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
              letter.status === 'present' ? 'bg-gradient-to-r from-amber-400 to-yellow-500' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const ValidationHints = ({ puzzleData, attempts }: { puzzleData: CityPuzzle; attempts: CityGuessResult[]; }) => {
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
    const correctLetters = latestAttempt.letterFeedback
      ?.filter(letter => letter.status === 'correct')
      .map(letter => letter.letter.toLowerCase()) || [];
    
    if (correctLetters.length > 0) {
      return correctLetters.join(', ').toUpperCase();
    } else {
      return name[0].toUpperCase();
    }
  };

  const getClimateZone = (lat: number): string => {
    const absLat = Math.abs(lat);
    if (absLat <= 23.5) return 'Tropics';
    if (absLat <= 35) return 'Subtropics';
    if (absLat <= 66.5) return 'Temperate';
    return 'Polar';
  };

  const hintItems = [
    // Hint 1: Name structure
    attempts.length >= 1 && (
      <div key="nameStructure" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-400">🔤</span>
          <span className="text-white font-medium">Name Structure:</span>
          <span className="text-cyan-400 font-bold">{getNameStructureHint()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-blue-400">🌍</span>
          <span className="text-white font-medium">Continent:</span>
          <span className="text-cyan-400 font-bold">{puzzleData.continent}</span>
        </div>
      </div>
    ),
    // Hint 2: Geography & Coordinates
    attempts.length >= 2 && (
      <div key="geography" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span className="text-white font-medium">Coordinates:</span>
          <span className="text-cyan-400 font-bold">
            {puzzleData.latitude.toFixed(1)}° {puzzleData.latitude >= 0 ? 'N' : 'S'}, {puzzleData.longitude.toFixed(1)}° {puzzleData.longitude >= 0 ? 'E' : 'W'}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-400">🌡️</span>
          <span className="text-white font-medium">Climate Zone:</span>
          <span className="text-cyan-400 font-bold">{getClimateZone(puzzleData.latitude)}</span>
        </div>
        {puzzleData.elevation && (
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-blue-400" />
            <span className="text-white font-medium">Elevation:</span>
            <span className="text-cyan-400 font-bold">{puzzleData.elevation}m</span>
          </div>
        )}
      </div>
    ),
    // Hint 3: Statistics
    attempts.length >= 3 && (
      <div key="statistics" className="flex-none w-full">
        {puzzleData.population > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-white font-medium">Population:</span>
            <span className="text-cyan-400 font-bold">
              {puzzleData.population >= 1000000 
                ? `${(puzzleData.population / 1000000).toFixed(1)}M`
                : `${(puzzleData.population / 1000).toFixed(0)}K`}
            </span>
          </div>
        )}
        {puzzleData.areaKm2 > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-400">📐</span>
            <span className="text-white font-medium">Area:</span>
            <span className="text-cyan-400 font-bold">
              {puzzleData.areaKm2 >= 1000 
                ? `${(puzzleData.areaKm2 / 1000).toFixed(1)}k km²`
                : `${puzzleData.areaKm2} km²`}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-400" />
          <span className="text-white font-medium">City Type:</span>
          <span className="text-cyan-400 font-bold">{puzzleData.isCapital ? 'Capital City' : 'Major City'}</span>
        </div>
      </div>
    ),
    // Hint 4: Country & Region
    attempts.length >= 4 && (
      <div key="countryRegion" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-blue-400" />
          <span className="text-white font-medium">Country:</span>
          <span className="text-cyan-400 font-bold">{puzzleData.country}</span>
        </div>
        {puzzleData.region && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-400">🗺️</span>
            <span className="text-white font-medium">Region:</span>
            <span className="text-cyan-400 font-bold">{puzzleData.region}</span>
          </div>
        )}
        {puzzleData.foundedYear && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-white font-medium">Founded:</span>
            <span className="text-cyan-400 font-bold">{puzzleData.foundedYear}</span>
          </div>
        )}
      </div>
    ),
    // Hint 5: Letter position & Famous For
    attempts.length >= 5 && (
      <div key="letterFamous" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-400">💡</span>
          <span className="text-white font-medium">Letters:</span>
          <span className="text-cyan-400 font-bold">{getLetterPositionHint()}</span>
        </div>
        {puzzleData.famousFor && puzzleData.famousFor.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-blue-400">🌟</span>
            <span className="text-white font-medium">Famous For:</span>
            <span className="text-cyan-400 font-bold">{puzzleData.famousFor.slice(0, 2).join(', ')}</span>
          </div>
        )}
      </div>
    ),
    // Hint 6: Final hints & Hint Column
    attempts.length >= 6 && (
      <div key="finalHints" className="flex-none w-full">
        {puzzleData.timezone && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-400">🕐</span>
            <span className="text-white font-medium">Timezone:</span>
            <span className="text-cyan-400 font-bold">{puzzleData.timezone}</span>
          </div>
        )}
        {puzzleData.hintColumn && (
          <div className="flex items-center gap-2">
            <span className="text-blue-400">💎</span>
            <span className="text-white font-medium">Final Hint:</span>
            <span className="text-cyan-400 font-bold">{puzzleData.hintColumn}</span>
          </div>
        )}
      </div>
    ),
  ].filter(Boolean);

  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-4 mb-6">
      <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        City Hints:
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
        More city hints unlock with each guess... ({Math.min(attempts.length, 6)}/6 revealed)
      </p>
    </div>
  );
};

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
async function fetchCityImage(cityName: string): Promise<string | null> {
  try {
    const imageUrl = await fetchWikimediaImage(cityName, { entityType: 'city' });
    if (!imageUrl) throw new Error('Failed to fetch city image');
    return imageUrl;
  } catch (error) {
    console.error('Error fetching city image:', error);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */
export default function CitadleComponent({ initialData }: CitadleComponentProps) {
  const [puzzleData] = useState(initialData);
  const [showImageModal, setShowImageModal] = useState(false);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<CityGuessResult[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shareMessage, setShareMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isGuessLoading, setIsGuessLoading] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [cityImage, setCityImage] = useState<string | null>(null);
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
        
        const imageUrl = await fetchCityImage(puzzleData.answer);
        if (imageUrl) {
          console.log('City image found:', imageUrl);
          setCityImage(imageUrl);
          
          const img = new window.Image();
          img.src = imageUrl;
          img.onload = () => setImageLoading(false);
          img.onerror = () => {
            console.error('Failed to load image:', imageUrl);
            setImageError(true);
            setImageLoading(false);
          };
        } else {
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
  }, [puzzleData.answer]);

  /* --------------------------- analytics ---------------------------- */
  useEffect(() => setGameStarted(true), []);
  useEffect(() => {
    if (!gameStarted) return;
    
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({ action: 'citadle_started', category: 'citadle', label: 'citadle' });
        clearInterval(checkGtag);
      }
    }, 100);

    return () => clearInterval(checkGtag);
  }, [gameStarted]);

  /* --------------------------- persistence -------------------------- */
  useEffect(() => {
    const saved = localStorage.getItem(`citadle-${puzzleData.id}`);
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
      localStorage.setItem(`citadle-${puzzleData.id}`, JSON.stringify({ attempts, gameState }));
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
      myConfetti({ 
        particleCount: 150, 
        spread: 100, 
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#0EA5E9', '#06B6D4']
      });
    }
  };

  /* --------------------------- guess handler -------------------------- */
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
    setValidationError(null);
    
    try {
      const validation = await validateCityGuess(normalizedGuess, puzzleData);
      
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
        event({ action: 'citadle_win', category: 'citadle', label: `attempts_${newAttempts.length}` });
      } else if (newAttempts.length >= 6) {
        setGameState('lost');
        playSound('lose');
        await addCitadleResult(false, newAttempts.length);
        event({ action: 'citadle_loss', category: 'citadle', label: 'max_attempts' });
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
  const showImage = cityImage && !imageLoading && !imageError;

  const triesLeft = 6 - attempts.length;
  const triesLeftColor = 
    triesLeft >= 4 ? 'text-blue-400' : 
    triesLeft >= 2 ? 'text-yellow-400' : 
    'text-red-400';

  const difficultyColor = getDifficultyColor(puzzleData.difficulty).includes('blue') 
    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    : getDifficultyColor(puzzleData.difficulty);

  return (
    <div className="relative">
      <canvas ref={confettiCanvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-10" />

      {/* Image Modal */}
      {showImageModal && cityImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-600" style={{ width: '512px', height: '768px' }}>
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
                src={cityImage}
                alt="Mystery City"
                fill
                className="object-cover"
                priority
              />
              {/* Same block overlay as main image */}
              <div className="absolute inset-0">
                {blockGrid.map((pos, index) => (
                  <CityBlock
                    key={index}
                    x={pos.x}
                    y={pos.y}
                    gridCols={GRID_COLS}
                    gridRows={GRID_ROWS}
                    isRevealed={isBlockRevealed(index)}
                  />
                ))}
              </div>
              
              {/* Center "?" overlay for modal */}
              {revealPercentage === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-30">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-blue-500/50">
                      <span className="text-blue-400 text-2xl font-bold">?</span>
                    </div>
                    <p className="text-blue-400 font-semibold">Mystery City</p>
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
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-2 rounded-xl">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Today&apos;s City Mystery</h2>
              <div className={`flex items-center gap-2 text-xs ${difficultyColor} px-2 py-0.5 rounded-full mt-1`}>
                <Target className="w-3 h-3" />
                <span>{getDifficultyLabel(puzzleData.difficulty)}</span>
                {puzzleData.isCapital && <span>• Capital City</span>}
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-2 text-lg font-bold ${triesLeftColor}`}>
            <Target className="w-5 h-5" />
            <span>{triesLeft} {triesLeft === 1 ? 'TRY' : 'TRIES'}</span>
          </div>
        </div>

        {/* City Image & Info */}
        <div className="flex flex-col md:flex-row gap-6 mb-6 items-center">
          {/* City Image Container */}
          <div className="flex-shrink-0 relative">
            <div 
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600" 
              style={{ height: `${containerHeight}px`, width: `${containerWidth}px` }}
              onClick={() => showImage && setShowImageModal(true)}
            >
              {showImageLoader && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-cyan-900/50 z-10">
                  <div className="text-blue-400 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mb-2"></div>
                    <span className="text-sm">Loading city image...</span>
                  </div>
                </div>
              )}
              
              {showImageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-cyan-900/50 z-10">
                  <div className="text-blue-400 flex flex-col items-center text-center p-4">
                    <span className="text-3xl mb-2">🏙️</span>
                    <span className="text-sm">No image available</span>
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
                    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/70">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-blue-500/50">
                          <span className="text-blue-400 text-2xl font-bold">?</span>
                        </div>
                        <p className="text-blue-400 font-semibold">Mystery City</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Reveal Progress */}
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
                </>
              )}
            </div>
            {/* Click hint below the image */}
            {showImage && revealPercentage > 0 && (
              <div className="text-xs text-gray-400 text-center mt-2 cursor-pointer hover:text-blue-400 transition-colors" onClick={() => setShowImageModal(true)}>
                Click image to view larger
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex-grow text-center">
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Today&apos;s City</h3>
              <p className="text-gray-300 text-lg mb-4">
                Today&apos;s city is in <strong className="text-blue-400">{puzzleData.continent}</strong>,{' '}
                <strong className="text-blue-400">{puzzleData.latitude >= 0 ? 'Northern' : 'Southern'} Hemisphere</strong>.
              </p>
              <div className="flex justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Geographic Challenge</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
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
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            <Zap className="w-4 h-4" />
            {hardMode ? 'Hard Mode ON' : 'Hard Mode'}
          </button>
          
          {hardMode && attempts.length > 0 && !showHint && gameState === 'playing' && (
            <button
              onClick={toggleHint}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300"
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

        {validationError && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4 mb-4 animate-pulse">
            <div className="flex items-center gap-2 text-yellow-400">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              {validationError}
            </div>
          </div>
        )}

        {gameState === 'won' && (
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Victory! 🏙️🎉</h3>
            <p className="text-blue-400 mb-2">You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="text-gray-300">The city was: <strong className="text-white">{puzzleData.answer}</strong></p>
            <p className="text-sm text-blue-400 mt-1">
              {puzzleData.country} • {puzzleData.continent}
              {puzzleData.population > 0 && ` • Population: ${(puzzleData.population / 1000000).toFixed(1)}M`}
            </p>
          </div>
        )}

        {gameState === 'lost' && (
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Game Over</h3>
            <p className="text-red-400">The city was: <strong className="text-white">{puzzleData.answer}</strong></p>
            <p className="text-sm text-red-400 mt-1">
              {puzzleData.country} • {puzzleData.continent}
              {puzzleData.population > 0 && ` • Population: ${(puzzleData.population / 1000000).toFixed(1)}M`}
            </p>
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
              Your City Guesses:
            </h3>
            <div className="grid gap-3">
              {attempts.map((attempt, index) => (
                <div key={index} className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
                  <div className="flex flex-wrap justify-center gap-2">
                    {attempt.letterFeedback?.map((letter, letterIndex) => {
                      const bgColor = letter.status === 'correct' 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'  
                        : letter.status === 'present' 
                        ? 'bg-gradient-to-br from-yellow-500 to-amber-600'
                        : 'bg-gray-600 border border-gray-500';
                      const textColor = letter.status === 'absent' ? 'text-gray-300' : 'text-white';
                      
                      return (
                        <div 
                          key={letterIndex} 
                          className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg font-bold ${bgColor} ${textColor} transition-all duration-300 transform hover:scale-110`}
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

        {/* Input Section */}
        {gameState === 'playing' && (
          <div className="sticky bottom-0 bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-700 p-4 z-[100] -mx-2 md:-mx-4 -mb-2 md:-mb-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Enter city name..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                  disabled={isGuessLoading}
                />
              </div>
              <button
                onClick={handleGuess}
                disabled={!guess.trim() || isGuessLoading}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-semibold"
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
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <MdShare className="w-5 h-5" />
              Share Result
            </button>
            {shareMessage && (
              <div className="text-blue-400 font-semibold animate-pulse">{shareMessage}</div>
            )}

            <FeedbackComponent
              gameType="citadle"
              category="brainwave"
              metadata={{ 
                attempts: attempts.length, 
                won: gameState === 'won', 
                correctAnswer: puzzleData.answer,
                difficulty: puzzleData.difficulty,
                isCapital: puzzleData.isCapital
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
          <Sparkles className="w-5 h-5 text-blue-400" />
          How to Play Citadle:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-blue-400">🏙️</span>
            <span>Guess the city from geographic clues</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-blue-400">🟩</span>
            <span>Green: Letter in correct position</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-amber-400">🟨</span>
            <span>Yellow: Letter in name but wrong position</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-gray-400">⬜</span>
            <span>Gray: Letter not in the name</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-blue-400">💡</span>
            <span>City hints unlock after each attempt</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-red-400">🎯</span>
            <span>6 attempts to guess correctly</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-cyan-400">🌍</span>
            <span>Includes continents, coordinates, population</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-purple-400">🗺️</span>
            <span>City image reveals with each guess</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-blue-400">
          <p><strong>Tip:</strong> Use the continent and coordinates hints to narrow down possibilities!</p>
        </div>
      </div>
    </div>
  );
}