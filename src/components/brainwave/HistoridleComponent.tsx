// src/components/brainwave/historidle/HistoridleComponent.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { event } from '@/lib/gtag';
import { useSound } from '@/context/SoundContext';
import { MdShare } from "react-icons/md";
import { addHistoridleResult } from '@/lib/brainwave/historidle/historidle-sb';
import { checkHistoridleGuess, 
        validateHistoricalGuess,
        type HistoridleData, 
        type HistoridleGuessResult } from '@/lib/brainwave/historidle/historidle-logic';

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
      text: "Final attempt! Use all clues and think about historical figures/events that fit the pattern.",
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
      <div key="date1" className="flex-none w-full text-sm">
        📅 <strong>{puzzleData.dates[0]}:</strong> {puzzleData.dateSignificances[0]}
      </div>
    ),
    attempts.length >= 2 && (
      <div key="date2" className="flex-none w-full text-sm">
        📅 <strong>{puzzleData.dates[1]}:</strong> {puzzleData.dateSignificances[1]}
      </div>
    ),
    attempts.length >= 3 && (
      <div key="date3" className="flex-none w-full text-sm">
        📅 <strong>{puzzleData.dates[2]}:</strong> {puzzleData.dateSignificances[2]}
      </div>
    ),
    attempts.length >= 4 && puzzleData.hints[0] && (
      <div key="hint1" className="flex-none w-full text-sm">
        💡 {puzzleData.hints[0]}
      </div>
    ),
    attempts.length >= 5 && puzzleData.hints[1] && (
      <div key="hint2" className="flex-none w-full text-sm">
        💡 {puzzleData.hints[1]}
      </div>
    ),
  ].filter(Boolean);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-blue-800 mb-2">💡 Historical Hints Revealed:</h4>
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
        More historical hints unlock with each guess... ({hintsRevealed}/5 revealed)
      </p>
    </div>
  );
};

const DateDisplay = ({ dates }: { dates: [string, string, string] }) => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-12 mb-8">
      {dates.map((date, index) => (
        <div key={index} className="text-center">
          <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-6 shadow-lg">
            <div className="text-4xl md:text-5xl font-bold text-blue-800 mb-2">
              {/* remove the dash from the date */}
              {date.replace(/-/g,' ')} 
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AttemptHistory = ({ attempts }: { attempts: HistoridleGuessResult[] }) => {
  if (attempts.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3 text-gray-800">Your Guesses:</h3>
      <div className="space-y-4">
        {attempts.map((attempt, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3">
            <div className="flex flex-wrap justify-center gap-1 mb-2">
              {attempt.guess.split('').map((letter, letterIndex) => {
                const status = attempt.letterStatuses?.[letterIndex] || 'absent';
                const bgColor = status === 'correct' ? 'bg-green-500' : 
                              status === 'present' ? 'bg-amber-500' : 'bg-gray-400';
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

  const triesLeft = 6 - attempts.length;
  const triesLeftColor = triesLeft >= 4 ? 'text-green-600' : triesLeft >= 2 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-4rem)]">
      <canvas 
        ref={confettiCanvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      />
      
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Connect the dates to guess the historical {puzzleData.type}!
          </h2>
          <div className={`text-base font-bold ${triesLeftColor}`}>
            {triesLeft} {triesLeft === 1 ? 'try' : 'tries'} left
          </div>
        </div>

        {/* Date Display */}
        <DateDisplay dates={puzzleData.dates} />

        {/* Error messages */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
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
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <h3 className="font-bold text-lg mb-2">Congratulations! 🎉</h3>
            <p>You solved it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="mt-2 font-semibold">The answer was: {puzzleData.targetTitle}</p>
            <div className="mt-3 text-sm">
              <p><strong>Date 1 ({puzzleData.dates[0]}):</strong> {puzzleData.dateSignificances[0]}</p>
              <p><strong>Date 2 ({puzzleData.dates[1]}):</strong> {puzzleData.dateSignificances[1]}</p>
              <p><strong>Date 3 ({puzzleData.dates[2]}):</strong> {puzzleData.dateSignificances[2]}</p>
            </div>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <h3 className="font-bold text-lg mb-2">Game Over</h3>
            <p className="mb-2">The answer was: <strong>{puzzleData.targetTitle}</strong></p>
            <div className="text-sm">
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
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 md:-mx-6 -mb-4 md:-mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder={`Enter historical ${puzzleData.type}`}
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
        <h3 className="font-bold mb-2">How to Play Historidle:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Connect the three dates to identify the historical {puzzleData.type}</li>
          <li>You have 6 attempts to guess correctly</li>
          <li>Get letter-by-letter feedback compared to the answer</li>
          <li>🟩 Green: Letter in correct position</li>
          <li>🟨 Amber: Letter is in the title but wrong position</li>
          <li>⬜ Gray: Letter not in the title</li>
          <li>Historical hints are revealed after each attempt</li>
          <li>5 total hints: 3 date significances + 2 additional clues</li>
        </ul>
      </div>
    </div>
  );
}