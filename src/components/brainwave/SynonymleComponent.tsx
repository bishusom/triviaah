// src/components/brainwave/synonymle/SynonymleComponent.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { event } from '@/lib/gtag';
import { useSound } from '@/context/SoundContext';
import { MdShare } from "react-icons/md";
import FeedbackComponent from '@/components/common/FeedbackComponent';
import { addSynonymleResult } from '@/lib/brainwave/synonymle/synonymle-sb';
import { 
  checkSynonymleGuess, 
  getCategoryLabel,
  getCategoryBorderColor,
  validateWordGuess, 
  getCategoryColor,
  getCategoryEmoji,
  type SynonymleData, 
  type SynonymleGuessResult 
} from '@/lib/brainwave/synonymle/synonymle-logic';

interface SynonymleComponentProps {
  initialData: SynonymleData;
}

// EnhancedProgressiveHint component for Synonymle
const EnhancedProgressiveHint = ({ attempts }: { attempts: SynonymleGuessResult[] }) => {
  if (attempts.length === 0) return null;
  
  const latestAttempt = attempts[attempts.length - 1];
  const score = latestAttempt.similarityScore;
  const category = latestAttempt.similarityCategory;
  
  const hints = [
    {
      icon: "🎯",
      text: `Great start! Your guess scored ${score}.`,
      color: "bg-green-100 border-green-400 text-green-700"
    },
    {
      icon: "🔍",
      text: `Think about ${category} concepts. You're getting ${category}!`,
      color: "bg-yellow-100 border-yellow-400 text-yellow-700"
    },
    {
      icon: "🤔",
      text: "Consider different angles and categories for the target word.",
      color: "bg-blue-100 border-blue-400 text-blue-700"
    },
    {
      icon: "💡",
      text: "Use the revealed hints below to narrow down your options.",
      color: "bg-purple-100 border-purple-400 text-purple-700"
    },
    {
      icon: "⚡",
      text: "Final attempt! Use all clues and think about the core meaning.",
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
      
      {/* Enhanced similarity thermometer with gradient */}
      <div className="w-full bg-gradient-to-r from-gray-400 via-cyan-400 via-blue-400 via-orange-400 to-red-400 to-green-500 rounded-full h-3 mt-2 relative">
        <div 
          className="h-3 rounded-full bg-white bg-opacity-70 transition-all duration-700 ease-out"
          style={{ width: `${100 - (score / 1000) * 100}%`, marginLeft: 'auto' }}
        />
        {/* Current score indicator */}
        <div 
          className="absolute top-0 w-1 h-4 -mt-0.5 bg-black rounded-full transform -translate-y-0.5"
          style={{ left: `${(score / 1000) * 100}%` }}
        />
        {/* Score label */}
        <div 
          className="absolute top-0 transform -translate-y-6 -translate-x-1/2 text-xs font-bold bg-black text-white px-1 rounded"
          style={{ left: `${(score / 1000) * 100}%` }}
        >
          {score}
        </div>
      </div>
      <div className="flex justify-between text-xs mt-4 font-medium">
        <span className="text-gray-600">Freezing</span>
        <span className="text-cyan-500">Cold</span>
        <span className="text-blue-500">Cool</span>
        <span className="text-orange-500">Warm</span>
        <span className="text-red-500">Hot</span>
        <span className="text-green-600">Perfect</span>
      </div>
    </div>
  );
};

const ValidationHints = ({ puzzleData, attempts }: { puzzleData: SynonymleData, attempts: SynonymleGuessResult[] }) => {
  const hintsRevealed = Math.min(attempts.length, 5);
  const [activeHintIndex, setActiveHintIndex] = useState(0);
  const hintsScrollRef = useRef<HTMLDivElement>(null);

  // Auto-advance effect
  useEffect(() => {
    if (attempts.length === 0) return;
    
    const visibleHints = [
      attempts.length >= 1, // Word length
      attempts.length >= 2, // First letter
      attempts.length >= 3, // Synonyms
      attempts.length >= 4, // Additional hint 1
      attempts.length >= 5, // Additional hint 2
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
      <div key="length" className="flex-none w-full text-sm">
        🔤 <strong>Word Length:</strong> {puzzleData.wordLength} letters
      </div>
    ),
    attempts.length >= 2 && (
      <div key="firstLetter" className="flex-none w-full text-sm">
        🔠 <strong>Starts With:</strong> {puzzleData.targetWord[0].toUpperCase()}
      </div>
    ),
    attempts.length >= 3 && (
      <div key="synonyms" className="flex-none w-full text-sm">
        📝 <strong>Synonyms:</strong> {puzzleData.synonyms.slice(0, 3).join(', ')}
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
      <h4 className="font-semibold text-blue-800 mb-2">💡 Semantic Hints Revealed:</h4>
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
        More semantic hints unlock with each guess... ({hintsRevealed}/5 revealed)
      </p>
    </div>
  );
};

const AttemptHistory = ({ attempts }: { attempts: SynonymleGuessResult[] }) => {
  if (attempts.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3 text-gray-800">Your Guesses:</h3>
      <div className="space-y-3">
        {attempts.map((attempt, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg">{attempt.guess}</span>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getCategoryColor(attempt.similarityCategory)} ${getCategoryBorderColor(attempt.similarityCategory)} border`}>
                  {getCategoryEmoji(attempt.similarityCategory)} {attempt.similarityScore}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {getCategoryLabel(attempt.similarityCategory)} • {attempt.feedback}
            </div>
            {/* Enhanced similarity bar with gradient */}
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2 relative overflow-hidden">
              <div 
                className={`h-3 rounded-full ${getCategoryColor(attempt.similarityCategory)} transition-all duration-700 ease-out`}
                style={{ width: `${(attempt.similarityScore / 1000) * 100}%` }}
              />
              {/* Score markers */}
              <div className="absolute inset-0 flex justify-between items-center px-1">
                {[0, 200, 400, 600, 800, 1000].map((marker) => (
                  <div 
                    key={marker}
                    className="w-px h-1 bg-white bg-opacity-50"
                    style={{ marginLeft: `${(marker / 1000) * 100 - 0.1}%` }}
                  />
                ))}
              </div>
            </div>
            {/* Category scale indicator */}
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Freezing</span>
              <span>Cold</span>
              <span>Cool</span>
              <span>Warm</span>
              <span>Hot</span>
              <span>Perfect</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function SynonymleComponent({ initialData }: SynonymleComponentProps) {
  const [puzzleData] = useState(initialData);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<SynonymleGuessResult[]>([]);
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
        event({action: 'synonymle_started', category: 'synonymle', label: 'synonymle'});
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
    const savedProgress = localStorage.getItem(`synonymle-${puzzleData.id}`);
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
      localStorage.setItem(`synonymle-${puzzleData.id}`, JSON.stringify({
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
      setErrorMessage('Already guessed this word');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    playSound('click');
    setIsGuessLoading(true);
    
    try {
      // Validate the word guess
      const validation = await validateWordGuess(normalizedGuess, puzzleData);
      
      if (!validation.isValid) {
        setErrorMessage(validation.hint || 'Invalid guess');
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }

      // Check the guess
      const result = checkSynonymleGuess(normalizedGuess, puzzleData);
      const newAttempts = [...attempts, result];
      setAttempts(newAttempts);
      setGuess('');
      
      if (result.isCorrect) {
        setGameState('won');
        triggerConfetti();
        playSound('win');
        await addSynonymleResult(true, newAttempts.length);
        event({action: 'synonymle_win', category: 'synonymle', label: `attempts_${newAttempts.length}`});
      } else if (newAttempts.length >= 6) {
        setGameState('lost');
        playSound('lose');
        await addSynonymleResult(false, newAttempts.length);
        event({action: 'synonymle_loss', category: 'synonymle', label: 'max_attempts'});
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

  let shareText = `Synonymle #${puzzleNumber} ${gameState === 'won' ? attempts.length : 'X'}/6\n\n`;

  // Show attempts with category emojis and formatted scores
  attempts.forEach(attempt => {
    const emoji = getCategoryEmoji(attempt.similarityCategory);
    shareText += `${emoji} ${attempt.guess} (${attempt.similarityScore})\n`;
  });

  if (gameState === 'lost') {
    shareText += `\nAnswer: ${puzzleData.targetWord}`;
    shareText += `\nSynonyms: ${puzzleData.synonyms.slice(0, 3).join(', ')}`;
  }

  shareText += '\nPlay daily at https://elitetrivias.com/brainwave/synonymle';
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
            Guess the word based on semantic similarity!
          </h2>
          <div className={`text-base font-bold ${triesLeftColor}`}>
            {triesLeft} {triesLeft === 1 ? 'try' : 'tries'} left
          </div>
        </div>

        {/* Word Info Display */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-6 shadow-lg inline-block">
            <div className="text-2xl md:text-3xl font-bold text-blue-800 mb-2">
              {puzzleData.wordLength}-letter Word
            </div>
            <div className="text-lg text-blue-600">
              Category: {puzzleData.category}
            </div>
          </div>
        </div>

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
            <p className="mt-2 font-semibold">The answer was: {puzzleData.targetWord}</p>
            <div className="mt-3 text-sm">
              <p><strong>Synonyms:</strong> {puzzleData.synonyms.join(', ')}</p>
              <p><strong>Related words:</strong> {puzzleData.relatedWords.slice(0, 5).join(', ')}</p>
            </div>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <h3 className="font-bold text-lg mb-2">Game Over</h3>
            <p className="mb-2">The answer was: <strong>{puzzleData.targetWord}</strong></p>
            <div className="text-sm">
              <p><strong>Synonyms:</strong> {puzzleData.synonyms.join(', ')}</p>
              <p><strong>Related words:</strong> {puzzleData.relatedWords.slice(0, 5).join(', ')}</p>
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
                placeholder={`Enter a ${puzzleData.wordLength}-letter word`}
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
              gameType="synonymle"
              category="brainwave"
              metadata={{
                attempts: attempts.length,
                won: gameState === 'won',
                correctAnswer: puzzleData.targetWord
              }}
            />
          </div>
        )}
      </div>

      {/* How to Play section */}
      <div className="bg-gray-100 rounded-lg p-4 mt-6">
        <h3 className="font-bold mb-2">How to Play Synonymle:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Guess the target word based on semantic similarity</li>
          <li>You have 6 attempts to guess correctly</li>
          <li>Get a similarity score (0-1000) for each guess</li>
          <li>🎉 Perfect (990-1000): Exact match - you win!</li>
          <li>🔥 Hot (900-989): Extremely close synonym</li>
          <li>☀️ Warm (700-899): Conceptually related</li>
          <li>💨 Cool (500-699): Broadly related concept</li>
          <li>❄️ Cold (1-499): Semantically distant</li>
          <li>🧊 Freezing (0): No meaningful connection</li>
          <li>Hints are revealed after each attempt</li>
        </ul>
      </div>
    </div>
  );
}