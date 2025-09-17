import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { event } from '@/lib/gtag';
import { useSound } from '@/context/SoundContext';
import { MdShare } from "react-icons/md";
import { addPlotleResult } from '@/lib/brainwave/plotle/plotle-fb';
import { checkLetterGuess, validateMovieGuess, type PlotleData, type PlotleGuessResult } from '@/lib/brainwave/plotle/plotle-logic';

interface PlotleComponentProps {
  initialData: PlotleData;
}

interface PlotleSavedProgress {
  attempts: PlotleGuessResult[];
  gameState: 'playing' | 'won' | 'lost';
}

// EnhancedProgressiveHint component
const EnhancedProgressiveHint = ({ attempts }: { attempts: PlotleGuessResult[] }) => {
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
      text: "Final attempt! Use all clues and think about movie titles that fit the pattern.",
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

const ValidationHints = ({ puzzleData, attempts }: { puzzleData: PlotleData, attempts: PlotleGuessResult[] }) => {
  const hints = puzzleData.validationHints || {};
  const hintsRevealed = Math.min(attempts.length, 5); // More hints based on attempts
  const [activeHintIndex, setActiveHintIndex] = useState(0);
  const hintsScrollRef = useRef<HTMLDivElement>(null);

  // Auto-advance effect - triggers on attempts change
  useEffect(() => {
    if (attempts.length === 0) return;
    
    // Calculate how many hints are visible
    const visibleHints = [
      hints.releaseYear && attempts.length >= 1,
      puzzleData.genre && attempts.length >= 2,
      hints.director && attempts.length >= 3,
      hints.featuredActors && attempts.length >= 3,
      hints.oscarCategories && attempts.length >= 2,
      hints.imdbRating && attempts.length >= 4,
      attempts.length >= 4, // first letter
      attempts.length >= 5, // word count
    ].filter(Boolean);
    
    const latestHintIndex = visibleHints.length - 1;
    if (latestHintIndex >= 0) {
      setActiveHintIndex(latestHintIndex);
    }
  }, [attempts.length, hints.releaseYear, puzzleData.genre, hints.director, hints.featuredActors, hints.oscarCategories, hints.imdbRating]);

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
    hints.releaseYear && attempts.length >= 1 && (
      <div key="releaseYear" className="flex-none w-full text-sm">
        🎬 Released in: <strong>{hints.releaseYear}</strong>
      </div>
    ),
    puzzleData.genre && attempts.length >= 2 && (
      <div key="genre" className="flex-none w-full text-sm">
        🎭 Genre: <strong>{puzzleData.genre}</strong>
      </div>
    ),
    hints.director && attempts.length >= 3 && (
      <div key="director" className="flex-none w-full text-sm">
        🎥 Director: <strong>{hints.director}</strong>
      </div>
    ),
    hints.featuredActors && attempts.length >= 3 && (
      <div key="featuredActors" className="flex-none w-full text-sm">
        🌟 Stars: <strong>{hints.featuredActors.join(', ')}</strong>
      </div>
    ),
    hints.oscarCategories && attempts.length >= 2 && (
      <div key="oscarCategories" className="flex-none w-full text-sm">
        🏆 Oscars: <strong>{hints.oscarCategories.join(', ')}</strong>
      </div>
    ),
    hints.imdbRating && attempts.length >= 4 && (
      <div key="imdbRating" className="flex-none w-full text-sm">
        ⭐ IMDb Rating: <strong>{hints.imdbRating}/10</strong>
      </div>
    ),
    attempts.length >= 4 && (
      <div key="firstLetter" className="flex-none w-full text-sm">
        🔤 Starts with: <strong>{puzzleData.targetTitle.charAt(0).toUpperCase()}</strong>
      </div>
    ),
    attempts.length >= 5 && (
      <div key="wordCount" className="flex-none w-full text-sm">
        📝 Title has: <strong>{puzzleData.targetTitle.split(' ').length} words</strong>
      </div>
    ),
  ].filter(Boolean); // Remove null/undefined entries

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
  
  // Grid settings for blocks
  const GRID_COLS = 30; // Adjust for finer/coarser grid (higher = smaller blocks)
  const GRID_ROWS = 40; // Aspect ratio ~90x120 = 3:4, so cols:rows ~ 3:4
  const totalBlocks = GRID_COLS * GRID_ROWS;
  const containerWidth = 90; // px
  const containerHeight = 120; // px
  
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
        // Shuffle within group
        for (let i = group.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [group[i], group[j]] = [group[j], group[i]]; // Fixed syntax
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
      newReveal = Math.min(attempts.length * 10, 60); // 10% per attempt, max 60%
    } else if (gameState === 'won' || gameState === 'lost') {
      newReveal = 100;
    }
    setRevealPercentage(newReveal);

    // Calculate number of blocks to reveal
    const numToReveal = Math.floor(totalBlocks * (newReveal / 100));
    const newRevealed = blockRevealOrderRef.current.slice(0, numToReveal);
    setRevealedBlocks(newRevealed);
  }, [attempts.length, gameState]);

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

  const resetGame = () => {
    setAttempts([]);
    setGameState('playing');
    setGuess('');
    setRevealedBlocks([]);
    localStorage.removeItem(`plotle-${puzzleData.id}`);
    playSound('click');
  };

  const triesLeft = 6 - attempts.length;
  const triesLeftColor = triesLeft >= 4 ? 'text-green-600' : triesLeft >= 2 ? 'text-amber-600' : 'text-red-600';

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
    <div className="relative flex flex-col min-h-[calc(100vh-4rem)]">
      <canvas 
        ref={confettiCanvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      />
      
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 flex-grow">
        {/* Header with title and tries left on the same line */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Guess the movie from its emoji plot!
          </h2>
          <div className={`text-base font-bold ${triesLeftColor}`}>
            {triesLeft} {triesLeft === 1 ? 'try' : 'tries'} left
          </div>
        </div>

        {/* Question and Image Container - simplified without title */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="flex-shrink-0 relative">
            <div 
              className="relative rounded-lg overflow-hidden bg-gray-100" 
              style={{ height: `${containerHeight}px`, width: `${containerWidth}px` }}
            >
              {moviePoster ? (
                <>
                  <img
                    src={moviePoster}
                    alt="Movie poster"
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
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-200 z-10">
                  <div className="text-gray-600 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-1"></div>
                    <span className="text-xs">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-grow">
            {/* Display the emoji sequence */}
            <div className="flex justify-center items-center gap-2 text-4xl">
              {puzzleEmojis.map((emoji, index) => (
                <span key={index} className="p-2 bg-gray-100 rounded-md">
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Error messages */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        
        {validationError && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            {validationError}
          </div>
        )}
        
        {/* Conditional rendering of hints or result */}
        {gameState === 'playing' && (
          <>
            {/* Enhanced progressive hints */}
            <EnhancedProgressiveHint attempts={attempts} />
            
            {/* Validation hints */}
            <ValidationHints puzzleData={puzzleData} attempts={attempts} />
          </>
        )}
        
        {/* Game result message */}
        {gameState === 'won' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Congratulations! 🎉</h3>
            <p>You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="mt-2">The movie was: <strong>{puzzleData.targetTitle}</strong></p>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Game Over</h3>
            <p>The movie was: <strong>{puzzleData.targetTitle}</strong></p>
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
                  <div className="text-center text-sm text-gray-600">
                    {attempt.guess}
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
                placeholder="Enter movie title"
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
            
          </div>
        )}
      </div>

      {/* How to Play section */}
      <div className="bg-gray-100 rounded-lg p-4 mt-6">
        <h3 className="font-bold mb-2">How to Play:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Guess the movie by entering any movie title</li>
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