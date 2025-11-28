// src/components/brainwave/historidle/HistoridleComponent.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { event } from '@/lib/gtag';
import { useSound } from '@/context/SoundContext';
import { MdShare } from "react-icons/md";
import FeedbackComponent from '@/components/common/FeedbackComponent';
import { addHistoridleResult } from '@/lib/brainwave/historidle/historidle-sb';
import { checkHistoridleGuess, 
        validateHistoricalGuess,
        type HistoridleData, 
        type HistoridleGuessResult } from '@/lib/brainwave/historidle/historidle-logic';
import { Scroll, Target, Search, Sparkles, Eye, EyeOff, Clock, Castle } from 'lucide-react';

interface HistoridleComponentProps {
  initialData: HistoridleData;
}

// EnhancedProgressiveHint component
const EnhancedProgressiveHint = ({ attempts }: { attempts: HistoridleGuessResult[] }) => {
  if (attempts.length === 0) return null;
  
  const latestAttempt = attempts[attempts.length - 1];
  const correctLetters = latestAttempt.letterStatuses?.filter(s => s === 'correct').length || 0;
  const presentLetters = latestAttempt.letterStatuses?.filter(s => s === 'present').length || 0;
  
  const hints = [
    {
      icon: "🎯",
      text: `Great start! You have ${correctLetters} correct letters.`,
      color: "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-400"
    },
    {
      icon: "🔍",
      text: `Look for patterns. ${presentLetters} letters are in the title but misplaced.`,
      color: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400"
    },
    {
      icon: "🤔",
      text: "Compare letter positions. Focus on the blue letters first.",
      color: "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400"
    },
    {
      icon: "💡",
      text: "Use the revealed hints below to narrow down your options.",
      color: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400"
    },
    {
      icon: "⚡",
      text: "Final attempt! Use all clues and think about historical figures/events that fit the pattern.",
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
              status === 'correct' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
              status === 'present' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const ValidationHints = ({ puzzleData, attempts }: { puzzleData: HistoridleData, attempts: HistoridleGuessResult[] }) => {
  const hintsRevealed = Math.min(attempts.length, 5);
  const [activeHintIndex, setActiveHintIndex] = useState(0);
  const hintsScrollRef = useRef<HTMLDivElement>(null);

  // Auto-advance effect - triggers on attempts change
  useEffect(() => {
    if (attempts.length === 0) return;
    
    // Calculate how many hints are visible
    const visibleHints = [
      attempts.length >= 1, // Date 1 significance
      attempts.length >= 2, // Date 2 significance  
      attempts.length >= 3, // Date 3 significance
      attempts.length >= 4, // Additional hint 1
      attempts.length >= 5, // Additional hint 2
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
    attempts.length >= 1 && (
      <div key="date1" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-400">📅</span>
          <span className="text-white font-medium">Date 1:</span>
          <span className="text-blue-400 font-bold">{puzzleData.dates[0]}</span>
        </div>
        <p className="text-gray-300 ml-7">{puzzleData.dateSignificances[0]}</p>
      </div>
    ),
    attempts.length >= 2 && (
      <div key="date2" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-400">📅</span>
          <span className="text-white font-medium">Date 2:</span>
          <span className="text-blue-400 font-bold">{puzzleData.dates[1]}</span>
        </div>
        <p className="text-gray-300 ml-7">{puzzleData.dateSignificances[1]}</p>
      </div>
    ),
    attempts.length >= 3 && (
      <div key="date3" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-400">📅</span>
          <span className="text-white font-medium">Date 3:</span>
          <span className="text-blue-400 font-bold">{puzzleData.dates[2]}</span>
        </div>
        <p className="text-gray-300 ml-7">{puzzleData.dateSignificances[2]}</p>
      </div>
    ),
    attempts.length >= 4 && puzzleData.hints[0] && (
      <div key="hint1" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-400">💡</span>
          <span className="text-white font-medium">Historical Hint:</span>
        </div>
        <p className="text-gray-300 ml-7">{puzzleData.hints[0]}</p>
      </div>
    ),
    attempts.length >= 5 && puzzleData.hints[1] && (
      <div key="hint2" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-400">💡</span>
          <span className="text-white font-medium">Historical Hint:</span>
        </div>
        <p className="text-gray-300 ml-7">{puzzleData.hints[1]}</p>
      </div>
    ),
  ].filter(Boolean);

  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-2xl p-4 mb-6">
      <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Historical Hints Revealed:
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
                  index === activeHintIndex ? 'bg-blue-400 scale-125' : 'bg-gray-600'
                }`}
                aria-label={`Go to hint ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-blue-400 mt-3 text-center">
        More historical hints unlock with each guess... ({hintsRevealed}/5 revealed)
      </p>
    </div>
  );
};

const AttemptHistory = ({ attempts }: { attempts: HistoridleGuessResult[] }) => {
  if (attempts.length === 0) return null;

  return (
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
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
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
  );
};

export default function HistoridleComponent({ initialData }: HistoridleComponentProps) {
  const [puzzleData] = useState(initialData);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<HistoridleGuessResult[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shareMessage, setShareMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGuessLoading, setIsGuessLoading] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Start game and trigger analytics
  useEffect(() => {
    setGameStarted(true);
  }, []);

  // Add analytics event for game start
  useEffect(() => {
    if (!gameStarted) return;
    
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'historidle_started', category: 'historidle', label: 'historidle'});
        clearInterval(checkGtag);
      }
    }, 100);

    return () => clearInterval(checkGtag);
  }, [gameStarted]);

  // Sound effects
  const { isMuted } = useSound();

  // Load saved progress
  useEffect(() => {
    const savedProgress = localStorage.getItem(`historidle-${puzzleData.id}`);
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
      localStorage.setItem(`historidle-${puzzleData.id}`, JSON.stringify({
        attempts,
        gameState
      }));
    }
  }, [attempts, gameState, puzzleData.id]);

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
        colors: ['#3B82F6', '#6366F1', '#8B5CF6']
      });
    }
  };

  const handleGuess = async () => {
    if (gameState !== 'playing' || attempts.length >= 6) return;
    
    const normalizedGuess = guess.trim();
    if (!normalizedGuess) return;
    
    // Check if already guessed
    if (attempts.some(a => a.guess.toLowerCase() === normalizedGuess.toLowerCase())) {
      setErrorMessage('Already guessed this historical figure/event');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    playSound('click');
    setIsGuessLoading(true);
    
    try {
      // Validate the historical guess
      const validation = await validateHistoricalGuess(normalizedGuess);
      
      if (!validation.isValid) {
        setErrorMessage(validation.hint || 'Invalid guess');
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }

      // Check the guess
      const result = checkHistoridleGuess(normalizedGuess, puzzleData);
      const newAttempts = [...attempts, result];
      setAttempts(newAttempts);
      setGuess('');
      
      if (result.isCorrect) {
        setGameState('won');
        triggerConfetti();
        playSound('win');
        await addHistoridleResult(true, newAttempts.length);
        event({action: 'historidle_win', category: 'historidle', label: `attempts_${newAttempts.length}`});
      } else if (newAttempts.length >= 6) {
        setGameState('lost');
        playSound('lose');
        await addHistoridleResult(false, newAttempts.length);
        event({action: 'historidle_loss', category: 'historidle', label: 'max_attempts'});
      } else {
        playSound('incorrect');
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
    
    let shareText = `Historidle #${puzzleNumber} ${gameState === 'won' ? attempts.length : 'X'}/6\n\n`;
    
    // Show the dates
    shareText += `Dates: ${puzzleData.dates.join(', ')}\n\n`;
    
    // Show attempts with Wordle-style boxes
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
    
    if (gameState === 'lost') {
      shareText += `\nAnswer: ${puzzleData.targetTitle}`;
    }
    
    shareText += '\nPlay daily at https://triviaah.com/brainwave/historidle';
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
    triesLeft >= 4 ? 'text-blue-400' : 
    triesLeft >= 2 ? 'text-yellow-400' : 
    'text-red-400';

  // Determine header text based on date uniqueness
  const uniqueDates = Array.from(new Set(puzzleData.dates));
  const headerText = uniqueDates.length === 1 
    ? `Guess the historical ${puzzleData.type} associated with this date!`
    : `Connect the dates to guess the historical ${puzzleData.type}!`;

  const DateDisplay = ({ dates }: { dates: [string, string, string] }) => {
    // Count unique dates
    const uniqueDates = Array.from(new Set(dates));
    const allSame = uniqueDates.length === 1;
    const twoSame = uniqueDates.length === 2;
    
    if (allSame) {
      // Show only one date when all are same
      return (
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl p-8 shadow-lg inline-block">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              {dates[0].replace(/-/g, ' ')}
            </div>
            <div className="text-blue-300 mt-2 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Three significant events occurred on this date
            </div>
          </div>
        </div>
      );
    } else if (twoSame) {
      // Show two dates when two are same
      const dateCounts = dates.reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const displayDates = Object.keys(dateCounts);
      return (
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
          {displayDates.map((date, index) => (
            <div key={index} className="text-center">
              <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl p-6 shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {date.replace(/-/g, ' ')}
                </div>
                {dateCounts[date] > 1 && (
                  <div className="text-blue-300 text-sm flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    {dateCounts[date]} significant events
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      // Show all three dates when all are different
      return (
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
          {dates.map((date, index) => (
            <div key={index} className="text-center">
              <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl p-6 shadow-lg">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {date.replace(/-/g, ' ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };    

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
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl">
              <Scroll className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Today&apos;s Historical Mystery</h2>
          </div>
          <div className={`flex items-center gap-2 text-lg font-bold ${triesLeftColor}`}>
            <Target className="w-5 h-5" />
            <span>{triesLeft} {triesLeft === 1 ? 'TRY' : 'TRIES'}</span>
          </div>
        </div>

        {/* Date Display */}
        <DateDisplay dates={puzzleData.dates} />

        {/* Game Controls */}
        <div className="flex flex-wrap gap-3 mb-5">
          <button
            onClick={toggleHardMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              hardMode 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            <Castle className="w-4 h-4" />
            {hardMode ? 'Hard Mode ON' : 'Hard Mode'}
          </button>
          
          {hardMode && attempts.length > 0 && !showHint && gameState === 'playing' && (
            <button
              onClick={toggleHint}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
            >
              {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
          )}
        </div>

        {/* Error messages */}
        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-4 animate-pulse">
            <div className="flex items-center gap-2 text-red-400">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              {errorMessage}
            </div>
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
          <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Victory! 🎉</h3>
            <p className="text-blue-400 mb-2">You solved it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="text-gray-300">The answer was: <strong className="text-white">{puzzleData.targetTitle}</strong></p>
            <div className="mt-4 text-sm text-blue-300 space-y-1">
              <p><strong>Date 1 ({puzzleData.dates[0]}):</strong> {puzzleData.dateSignificances[0]}</p>
              <p><strong>Date 2 ({puzzleData.dates[1]}):</strong> {puzzleData.dateSignificances[1]}</p>
              <p><strong>Date 3 ({puzzleData.dates[2]}):</strong> {puzzleData.dateSignificances[2]}</p>
            </div>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <Scroll className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Game Over</h3>
            <p className="text-red-400 mb-2">The answer was: <strong className="text-white">{puzzleData.targetTitle}</strong></p>
            <div className="mt-4 text-sm text-pink-300 space-y-1">
              <p><strong>Date 1 ({puzzleData.dates[0]}):</strong> {puzzleData.dateSignificances[0]}</p>
              <p><strong>Date 2 ({puzzleData.dates[1]}):</strong> {puzzleData.dateSignificances[1]}</p>
              <p><strong>Date 3 ({puzzleData.dates[2]}):</strong> {puzzleData.dateSignificances[2]}</p>
            </div>
          </div>
        )}
        
        {/* Attempt History */}
        <AttemptHistory attempts={attempts} />
        
        {/* Input for guesses */}
        {gameState === 'playing' && (
          <div className="sticky bottom-0 bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-700 p-4 z-[100] -mx-2 md:-mx-4 -mb-2 md:-mb-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder={`Enter historical ${puzzleData.type}...`}
                  className="w-full pl-12 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                  disabled={isGuessLoading}
                />
              </div>
              <button
                onClick={handleGuess}
                disabled={!guess.trim() || isGuessLoading}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-semibold"
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
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <MdShare className="w-5 h-5" />
              Share Result
            </button>
            {shareMessage && (
              <div className="text-blue-400 font-semibold animate-pulse">{shareMessage}</div>
            )}

            <FeedbackComponent
              gameType="historidle"
              category="brainwave"
              metadata={{
                attempts: attempts.length,
                won: gameState === 'won',
                correctAnswer: puzzleData.targetTitle,
                correctAnswerType: puzzleData.type,
                correctAnswerCategory: puzzleData.category,
                hardMode
              }}
            />
          </div>
        )}
      </div>

      {/* How to Play section */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          How to Play:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-blue-400">🏛️</span>
            <span>Connect the dates to identify the historical {puzzleData.type}</span>
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
            <span className="text-indigo-400">💡</span>
            <span>Historical hints unlock after each attempt</span>
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