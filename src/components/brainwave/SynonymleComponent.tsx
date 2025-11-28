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
import { Target, Users, Search, Sparkles, BookOpen, Brain, TrendingUp } from 'lucide-react';

interface SynonymleComponentProps {
  initialData: SynonymleData;
}

/* -------------------------------------------------------------------------- */
/*  Enhanced Helper Components                                                */
/* -------------------------------------------------------------------------- */
const EnhancedProgressiveHint = ({ attempts }: { attempts: SynonymleGuessResult[] }) => {
  if (attempts.length === 0) return null;
  
  const latestAttempt = attempts[attempts.length - 1];
  const score = latestAttempt.similarityScore;
  const category = latestAttempt.similarityCategory;
  
  const hints = [
    {
      icon: "🎯",
      text: `Great start! Your guess scored ${score}.`,
      color: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400"
    },
    {
      icon: "🔍",
      text: `Think about ${category} concepts. You're getting ${category}!`,
      color: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400"
    },
    {
      icon: "🤔",
      text: "Consider different angles and categories for the target word.",
      color: "bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 text-indigo-400"
    },
    {
      icon: "💡",
      text: "Use the revealed hints below to narrow down your options.",
      color: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400"
    },
    {
      icon: "⚡",
      text: "Final attempt! Use all clues and think about the core meaning.",
      color: "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-400"
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
      
      {/* Enhanced similarity thermometer with gradient */}
      <div className="w-full bg-gradient-to-r from-gray-600 via-cyan-400 via-blue-400 via-orange-400 to-red-400 to-green-500 rounded-full h-3 mt-2 relative">
        <div 
          className="h-3 rounded-full bg-gray-900/80 transition-all duration-700 ease-out"
          style={{ width: `${100 - (score / 1000) * 100}%`, marginLeft: 'auto' }}
        />
        {/* Current score indicator */}
        <div 
          className="absolute top-0 w-1 h-4 -mt-0.5 bg-white rounded-full transform -translate-y-0.5"
          style={{ left: `${(score / 1000) * 100}%` }}
        />
        {/* Score label */}
        <div 
          className="absolute top-0 transform -translate-y-6 -translate-x-1/2 text-xs font-bold bg-white text-gray-900 px-1 rounded"
          style={{ left: `${(score / 1000) * 100}%` }}
        >
          {score}
        </div>
      </div>
      <div className="flex justify-between text-xs mt-4 font-medium text-gray-300">
        <span>Freezing</span>
        <span>Cold</span>
        <span>Cool</span>
        <span>Warm</span>
        <span>Hot</span>
        <span>Perfect</span>
      </div>
    </div>
  );
};

const ValidationHints = ({ puzzleData, attempts }: { puzzleData: SynonymleData, attempts: SynonymleGuessResult[] }) => {
  const [activeHintIndex, setActiveHintIndex] = useState(0);
  const hintsScrollRef = useRef<HTMLDivElement>(null);

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
      <div key="length" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-blue-400">🔤</span>
          <span className="text-white font-medium">Word Length:</span>
          <span className="text-cyan-400 font-bold">{puzzleData.wordLength} letters</span>
        </div>
      </div>
    ),
    attempts.length >= 2 && (
      <div key="firstLetter" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-blue-400">🔠</span>
          <span className="text-white font-medium">Starts With:</span>
          <span className="text-cyan-400 font-bold">{puzzleData.targetWord[0].toUpperCase()}</span>
        </div>
      </div>
    ),
    attempts.length >= 3 && (
      <div key="synonyms" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-blue-400">📝</span>
          <span className="text-white font-medium">Synonyms:</span>
          <span className="text-cyan-400 font-bold">{puzzleData.synonyms.slice(0, 3).join(', ')}</span>
        </div>
      </div>
    ),
    attempts.length >= 4 && puzzleData.hints[0] && (
      <div key="hint1" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-blue-400">💡</span>
          <span className="text-white font-medium">Hint:</span>
          <span className="text-cyan-400 font-bold">{puzzleData.hints[0]}</span>
        </div>
      </div>
    ),
    attempts.length >= 5 && puzzleData.hints[1] && (
      <div key="hint2" className="flex-none w-full">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-blue-400">💡</span>
          <span className="text-white font-medium">Hint:</span>
          <span className="text-cyan-400 font-bold">{puzzleData.hints[1]}</span>
        </div>
      </div>
    ),
  ].filter(Boolean);

  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-4 mb-6">
      <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Semantic Hints Revealed:
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
        More semantic hints unlock with each guess... ({Math.min(attempts.length, 5)}/5 revealed)
      </p>
    </div>
  );
};

const AttemptHistory = ({ attempts }: { attempts: SynonymleGuessResult[] }) => {
  if (attempts.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <Target className="w-4 h-4" />
        Your Guesses:
      </h3>
      <div className="space-y-3">
        {attempts.map((attempt, index) => (
          <div key={index} className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-lg text-white">{attempt.guess}</span>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getCategoryColor(attempt.similarityCategory)} ${getCategoryBorderColor(attempt.similarityCategory)} border`}>
                  {getCategoryEmoji(attempt.similarityCategory)} {attempt.similarityScore}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-300 mb-2">
              {getCategoryLabel(attempt.similarityCategory)} • {attempt.feedback}
            </div>
            {/* Enhanced similarity bar with gradient */}
            <div className="w-full bg-gray-600 rounded-full h-3 mt-2 relative overflow-hidden">
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
            <div className="flex justify-between text-xs text-gray-400 mt-1">
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

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */
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

  const triggerConfetti = () => {
    if (confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true
      });
      
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#06B6D4', '#8B5CF6']
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

    shareText += '\nPlay daily at https://triviaah.com/brainwave/synonymle';
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
  const triesLeftColor = 
    triesLeft >= 4 ? 'text-blue-400' : 
    triesLeft >= 2 ? 'text-yellow-400' : 
    'text-red-400';

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
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-2 rounded-xl">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Today&apos;s Word Mystery</h2>
          </div>
          <div className={`flex items-center gap-2 text-lg font-bold ${triesLeftColor}`}>
            <Target className="w-5 h-5" />
            <span>{triesLeft} {triesLeft === 1 ? 'TRY' : 'TRIES'}</span>
          </div>
        </div>

        {/* Word Info & Category */}
        <div className="flex flex-col md:flex-row gap-6 mb-6 items-center">
          {/* Word Info Container */}
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600 rounded-2xl p-8 text-center" style={{ width: '200px', height: '120px' }}>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {puzzleData.wordLength}
              </div>
              <div className="text-white font-semibold">LETTER WORD</div>
              <div className="text-cyan-400 text-sm mt-2">{puzzleData.category}</div>
            </div>
          </div>

          {/* Category Section */}
          <div className="flex-grow text-center">
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Today&apos;s Word</h3>
              <p className="text-gray-300 text-lg mb-4">
                Find the word in <strong className="text-blue-400">{puzzleData.category}</strong> category.
              </p>
              <div className="flex justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Word Lovers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Brain className="w-4 h-4" />
                  <span>Semantic Analysis</span>
                </div>
              </div>
            </div>
          </div>
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

        {gameState === 'won' && (
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Victory! 🎉</h3>
            <p className="text-blue-400 mb-2">You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="text-gray-300">The word was: <strong className="text-white">{puzzleData.targetWord}</strong></p>
            <div className="mt-4 text-sm">
              <p className="text-cyan-400"><strong>Synonyms:</strong> {puzzleData.synonyms.join(', ')}</p>
              <p className="text-blue-400 mt-1"><strong>Related words:</strong> {puzzleData.relatedWords.slice(0, 5).join(', ')}</p>
            </div>
          </div>
        )}

        {gameState === 'lost' && (
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Game Over</h3>
            <p className="text-red-400">The word was: <strong className="text-white">{puzzleData.targetWord}</strong></p>
            <div className="mt-4 text-sm">
              <p className="text-pink-400"><strong>Synonyms:</strong> {puzzleData.synonyms.join(', ')}</p>
              <p className="text-red-400 mt-1"><strong>Related words:</strong> {puzzleData.relatedWords.slice(0, 5).join(', ')}</p>
            </div>
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
        <AttemptHistory attempts={attempts} />

        {/* Input Section */}
        {gameState === 'playing' && (
          <div className="sticky bottom-0 bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-700 p-4 z-[100] -mx-2 md:-mx-4 -mb-2 md:-mb-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={guess}
                  onChange={e => setGuess(e.target.value)}
                  placeholder={`Enter a ${puzzleData.wordLength}-letter word...`}
                  className="w-full pl-12 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  onKeyPress={e => e.key === 'Enter' && handleGuess()}
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

      {/* How to Play Section */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          How to Play:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-blue-400">🔠</span>
            <span>Guess the word based on semantic similarity</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-blue-400">🎯</span>
            <span>6 attempts to guess correctly</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-cyan-400">📊</span>
            <span>Get a similarity score (0-1000) for each guess</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-green-400">🎉</span>
            <span>Perfect (990-1000): Exact match</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-red-400">🔥</span>
            <span>Hot (900-989): Extremely close synonym</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-orange-400">☀️</span>
            <span>Warm (700-899): Conceptually related</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-yellow-400">💨</span>
            <span>Cool (500-699): Broadly related concept</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-blue-400">❄️</span>
            <span>Cold (1-499): Semantically distant</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-gray-400">🧊</span>
            <span>Freezing (0): No meaningful connection</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-purple-400">💡</span>
            <span>Hints are revealed after each attempt</span>
          </div>
        </div>
      </div>
    </div>
  );
}