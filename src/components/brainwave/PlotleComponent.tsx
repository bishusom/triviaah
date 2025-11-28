import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { event } from '@/lib/gtag';
import { useSound } from '@/context/SoundContext';
import { MdShare } from "react-icons/md";
import FeedbackComponent from '@/components/common/FeedbackComponent';
import { addPlotleResult } from '@/lib/brainwave/plotle/plotle-sb';
import { checkLetterGuess, validateMovieGuess, type PlotleData, type PlotleGuessResult } from '@/lib/brainwave/plotle/plotle-logic';
import Image from 'next/image';
import { Film, Target, Zap, Eye, EyeOff, Search, Sparkles, Clapperboard } from 'lucide-react';

interface PlotleComponentProps {
  initialData: PlotleData;
}

// EnhancedProgressiveHint component with gaming UI
const EnhancedProgressiveHint = ({ attempts }: { attempts: PlotleGuessResult[] }) => {
  if (attempts.length === 0) return null;
  
  const latestAttempt = attempts[attempts.length - 1];
  const correctLetters = latestAttempt.letterStatuses?.filter(s => s === 'correct').length || 0;
  const presentLetters = latestAttempt.letterStatuses?.filter(s => s === 'present').length || 0;
  
  const hints = [
    {
      icon: "🎯",
      text: `Great start! You have ${correctLetters} correct letters.`,
      color: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400"
    },
    {
      icon: "🔍",
      text: `Look for patterns. ${presentLetters} letters are in the title but misplaced.`,
      color: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400"
    },
    {
      icon: "🤔",
      text: "Compare letter positions. Focus on the green letters first.",
      color: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400"
    },
    {
      icon: "💡",
      text: "Use the revealed hints below to narrow down your options.",
      color: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400"
    },
    {
      icon: "⚡",
      text: "Final attempt! Use all clues and think about movie titles that fit the pattern.",
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
              status === 'correct' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
              status === 'present' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const ValidationHints = ({ puzzleData, attempts }: { puzzleData: PlotleData, attempts: PlotleGuessResult[] }) => {
  const hints = puzzleData.validationHints || {};
  const hintsRevealed = Math.min(attempts.length, 5);
  const [activeHintIndex, setActiveHintIndex] = useState(0);
  const hintsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (attempts.length === 0) return;
    
    const visibleHints = [
      attempts.length >= 1, // Release Year
      attempts.length >= 2, // Genre + Oscars
      attempts.length >= 3, // Director + Actors
      attempts.length >= 4, // IMDb + First Letter
      attempts.length >= 5, // Word Count
    ].filter(Boolean);
    
    const latestHintIndex = visibleHints.length - 1;
    if (latestHintIndex >= 0) {
      setActiveHintIndex(latestHintIndex);
    }
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
    attempts.length >= 1 && hints.releaseYear && (
      <div key="releaseYear" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-purple-400">🎬</span>
          <span className="text-white font-medium">Released in:</span>
          <span className="text-cyan-400 font-bold">{hints.releaseYear}</span>
        </div>
      </div>
    ),
    attempts.length >= 2 && (
      <div key="genreOscars" className="flex-none w-full">
        {puzzleData.genre && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-400">🎭</span>
            <span className="text-white font-medium">Genre:</span>
            <span className="text-cyan-400 font-bold">{puzzleData.genre}</span>
          </div>
        )}
        {hints.oscarCategories && (
          <div className="flex items-center gap-2">
            <span className="text-purple-400">🏆</span>
            <span className="text-white font-medium">Oscars:</span>
            <span className="text-cyan-400 font-bold">{hints.oscarCategories.length > 0 ? hints.oscarCategories.join(', ') : 'None'}</span>
          </div>
        )}
      </div>
    ),
    attempts.length >= 3 && (
      <div key="crew" className="flex-none w-full">
        {hints.director && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-400">🎥</span>
            <span className="text-white font-medium">Director:</span>
            <span className="text-cyan-400 font-bold">{hints.director}</span>
          </div>
        )}
        {hints.featuredActors && (
          <div className="flex items-center gap-2">
            <span className="text-purple-400">🌟</span>
            <span className="text-white font-medium">Stars:</span>
            <span className="text-cyan-400 font-bold">{hints.featuredActors.join(', ')}</span>
          </div>
        )}
      </div>
    ),
    attempts.length >= 4 && (
      <div key="ratingLetter" className="flex-none w-full">
        {hints.imdbRating && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-400">⭐</span>
            <span className="text-white font-medium">IMDb Rating:</span>
            <span className="text-cyan-400 font-bold">{hints.imdbRating}/10</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-purple-400">🔤</span>
          <span className="text-white font-medium">Starts with:</span>
          <span className="text-cyan-400 font-bold">{puzzleData.targetTitle.charAt(0).toUpperCase()}</span>
        </div>
      </div>
    ),
    attempts.length >= 5 && (
      <div key="structural" className="flex-none w-full">
        <div className="flex items-center gap-2">
          <span className="text-purple-400">📝</span>
          <span className="text-white font-medium">Title has:</span>
          <span className="text-cyan-400 font-bold">{puzzleData.targetTitle.split(' ').length} words</span>
        </div>
      </div>
    ),
  ].filter(Boolean);

  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-4 mb-6">
      <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
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
            <div key={index} className="flex-none w-full snap-center">
              {hint}
            </div>
          ))}
        </div>
        {hintItems.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {hintItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveHintIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeHintIndex ? 'bg-cyan-400 scale-125' : 'bg-gray-600'
                }`}
                aria-label={`Go to hint ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-cyan-400 mt-3 text-center">
        More hints unlock with each guess... ({hintsRevealed}/5 revealed)
      </p>
    </div>
  );
};

async function fetchTMDBMoviePoster(movieTitle: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/tmdb?title=${encodeURIComponent(movieTitle)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch poster');
    }
    const data = await response.json();
    return data.posterUrl;
  } catch (error) {
    console.error('Error fetching movie poster:', error);
    return null;
  }
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

export default function PlotleComponent({ initialData }: PlotleComponentProps) {
  const [puzzleData] = useState(initialData);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<PlotleGuessResult[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shareMessage, setShareMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isGuessLoading, setIsGuessLoading] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [moviePoster, setMoviePoster] = useState<string | null>(null);
  const [revealPercentage, setRevealPercentage] = useState(0);
  const [revealedBlocks, setRevealedBlocks] = useState<number[]>([]);
  const blockRevealOrderRef = useRef<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Grid settings for blocks
  const GRID_COLS = 30;
  const GRID_ROWS = 40;
  const totalBlocks = GRID_COLS * GRID_ROWS;
  const containerWidth = 90;
  const containerHeight = 130;
  
  // Initialize spaced random reveal order on mount
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

  // Start game and trigger analytics
  useEffect(() => {
    setGameStarted(true);
  }, []);

  // Add analytics event for game start
  useEffect(() => {
    if (!gameStarted) return;
    
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'plotle_started', category: 'plotle', label: 'plotle'});
        clearInterval(checkGtag);
      }
    }, 100);

    return () => clearInterval(checkGtag);
  }, [gameStarted]);

  // Sound effects
  const { isMuted } = useSound();

  useEffect(() => {
    const savedProgress = localStorage.getItem(`plotle-${puzzleData.id}`);
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
      localStorage.setItem(`plotle-${puzzleData.id}`, JSON.stringify({
        attempts,
        gameState
      }));
    }
  }, [attempts, gameState, puzzleData.id]);

  // Add useEffect to fetch poster
  useEffect(() => {
    const fetchPoster = async () => {
      const poster = await fetchTMDBMoviePoster(puzzleData.targetTitle);
      setMoviePoster(poster);
    };
    fetchPoster();
  }, [puzzleData.targetTitle]);

  // Update reveal percentage and blocks based on attempts
  useEffect(() => {
    let newReveal = 0;
    if (attempts.length > 0 && gameState === 'playing') {
      newReveal = Math.min(attempts.length * 10, 60);
    } else if (gameState === 'won' || gameState === 'lost') {
      newReveal = 100;
    }
    setRevealPercentage(newReveal);

    // Calculate number of blocks to reveal
    const numToReveal = Math.floor(totalBlocks * (newReveal / 100));
    const newRevealed = blockRevealOrderRef.current.slice(0, numToReveal);
    setRevealedBlocks(newRevealed);
  }, [attempts.length, gameState, totalBlocks]);

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
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#00FFFF', '#0066FF', '#9933FF']
      });
    }
  };

  const handleGuess = async () => {
    if (gameState !== 'playing' || attempts.length >= 6) return;
    
    const normalizedGuess = guess.trim();
    if (!normalizedGuess) return;
    
    // Check if already guessed
    if (attempts.some(a => a.guess.toLowerCase() === normalizedGuess.toLowerCase())) {
      setErrorMessage('Already guessed this movie');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    playSound('click');
    setIsGuessLoading(true);
    setValidationError(null);
    
    try {
      // Validate the movie guess (for hints)
      const validation = await validateMovieGuess(normalizedGuess, puzzleData);
      
      if (validation.hint) {
        setValidationError(validation.hint);
      }

      // Use letter-based comparison
      const result = checkLetterGuess(normalizedGuess, puzzleData);
      const newAttempts = [...attempts, result];
      setAttempts(newAttempts);
      setGuess('');
      
      if (result.isCorrect) {
        setGameState('won');
        triggerConfetti();
        playSound('win');
        await addPlotleResult(true, newAttempts.length);
        event({action: 'plotle_win', category: 'plotle', label: `attempts_${newAttempts.length}`});
      } else if (newAttempts.length >= 6) {
        setGameState('lost');
        playSound('lose');
        await addPlotleResult(false, newAttempts.length);
        event({action: 'plotle_loss', category: 'plotle', label: 'max_attempts'});
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
    
    let shareText = `Plotle #${puzzleNumber} ${gameState === 'won' ? attempts.length : 'X'}/6\n\n`;
    
    attempts.forEach(attempt => {
      attempt.letterStatuses?.forEach(status => {
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
    
    shareText += '\nPlay daily at https://triviaah.com/brainwave/plotle';
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

  const triesLeft = 6 - attempts.length;
  const triesLeftColor = 
    triesLeft >= 4 ? 'text-green-400' : 
    triesLeft >= 2 ? 'text-yellow-400' : 
    'text-red-400';

  // Display the emoji question
  const puzzleEmojis = puzzleData.emojis.split(' ');

  // Generate block grid
  const blockGrid: { x: number; y: number }[] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      blockGrid.push({ x: col, y: row });
    }
  }

  // Check if a block is revealed
  const isBlockRevealed = (index: number) => revealedBlocks.includes(index);

  return (
    <div className="relative">
      <canvas 
        ref={confettiCanvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
      />
      
      {/* Main Game Card */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-5 mb-5">
        {/* Header with Attempts Counter */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-xl">
              <Clapperboard className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Today's Movie Mystery</h2>
          </div>
          <div className={`flex items-center gap-2 text-lg font-bold ${triesLeftColor}`}>
            <Target className="w-5 h-5" />
            <span>{triesLeft} {triesLeft === 1 ? 'TRY' : 'TRIES'}</span>
          </div>
        </div>

        {/* Movie Poster & Emoji Puzzle */}
        <div className="flex flex-col md:flex-row gap-6 mb-6 items-center">
          {/* Movie Poster Container */}
          <div className="flex-shrink-0 relative">
            <div 
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600" 
              style={{ height: `${containerHeight}px`, width: `${containerWidth}px` }}
            >
              {moviePoster ? (
                <>
                  <Image
                    src={moviePoster}
                    alt="Movie poster"
                    fill
                    className="object-cover absolute inset-0 z-10"
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
                    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/70">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-purple-500/50">
                          <span className="text-purple-400 text-2xl font-bold">?</span>
                        </div>
                        <p className="text-purple-400 font-semibold">Mystery Movie</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Reveal Progress */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black/70 backdrop-blur-sm rounded-xl p-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-purple-400 text-xs font-medium">Poster Reveal</span>
                        <span className="text-white text-xs font-bold">{Math.round(revealPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-pink-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${revealPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-pink-900/50">
                  <div className="text-purple-400 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mb-2"></div>
                    <span className="text-sm">Loading poster...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Emoji Puzzle */}
          <div className="flex-grow text-center">
            <div className="flex justify-center items-center gap-2 md:gap-3 flex-wrap mb-4">
              {puzzleEmojis.map((emoji, index) => (
                <span 
                  key={index} 
                  className="p-2 md:p-3 bg-gray-700/50 rounded-xl border border-gray-600 text-2xl md:text-4xl min-w-[50px] md:min-w-0 flex items-center justify-center"
                  style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)' }}
                >
                  {emoji}
                </span>
              ))}
            </div>
            <p className="text-gray-300 text-sm px-2">Decode the emoji sequence to guess the movie title</p>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex flex-wrap gap-3 mb-5">
          <button
            onClick={toggleHardMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              hardMode 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            <Zap className="w-4 h-4" />
            {hardMode ? 'Hard Mode ON' : 'Hard Mode'}
          </button>
          
          {hardMode && attempts.length > 0 && !showHint && gameState === 'playing' && (
            <button
              onClick={toggleHint}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
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
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 text-yellow-400">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              {validationError}
            </div>
          </div>
        )}

        {gameState === 'won' && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Victory! 🎉</h3>
            <p className="text-green-400 mb-2">You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="text-gray-300">The movie was: <strong className="text-white">{puzzleData.targetTitle}</strong></p>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <Film className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Game Over</h3>
            <p className="text-red-400">The movie was: <strong className="text-white">{puzzleData.targetTitle}</strong></p>
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
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Enter movie title..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                  disabled={isGuessLoading}
                />
              </div>
              <button
                onClick={handleGuess}
                disabled={!guess.trim() || isGuessLoading}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-semibold"
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
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <MdShare className="w-5 h-5" />
              Share Result
            </button>
            {shareMessage && (
              <div className="text-purple-400 font-semibold animate-pulse">{shareMessage}</div>
            )}

            <FeedbackComponent
              gameType="plotle"
              category="brainwave"
              metadata={{
                attempts: attempts.length,
                won: gameState === 'won',
                correctAnswer: puzzleData.targetTitle,
                hardMode
              }}
            />
          </div>
        )}
      </div>

      {/* How to Play Section */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          How to Play:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-purple-400">🎬</span>
            <span>Guess the movie from emoji clues</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-green-400">🟩</span>
            <span>Green: Letter in correct position</span>
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
            <span className="text-cyan-400">💡</span>
            <span>Hints unlock after each attempt</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-red-400">🎯</span>
            <span>6 attempts to guess correctly</span>
          </div>
        </div>
      </div>
    </div>
  );
}