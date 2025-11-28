'use client';
import { event } from '@/lib/gtag';
import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useSound } from '@/context/SoundContext';

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

interface GameState {
  numbers: number[];
  target: number;
  score: number;
  currentExpression: string;
  usedIndices: number[];
  level: number;
  timeLeft: number;
  difficulty: Difficulty;
  consecutiveHardWins: number;
  stats: {
    puzzlesSolved: number;
    totalPoints: number;
    hintsUsed: number;
  };
}

export default function ScramblePuzzle() {
  const [gameState, setGameState] = useState<GameState>({
    numbers: [1, 2, 3, 4, 5, 6],
    target: 10,
    score: 0,
    currentExpression: '',
    usedIndices: [],
    level: 1,
    timeLeft: 120,
    difficulty: 'easy',
    consecutiveHardWins: 0,
    stats: {
      puzzlesSolved: 0,
      totalPoints: 0,
      hintsUsed: 0,
    },
  });

  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const { isMuted } = useSound();
  const mathjsRef = useRef<any>(null);

  type SoundType = 'select' | 'found' | 'win' | 'error';

  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;
    const sounds: Record<SoundType, string> = {
      select: '/sounds/click.mp3',
      found: '/sounds/correct.mp3',
      win: '/sounds/win.mp3',
      error: '/sounds/incorrect.mp3',
    };

    try {
      const audio = new Audio(sounds[type]);
      audio.play().catch(err => console.error(`Error playing ${type} sound:`, err));
    } catch (err) {
      console.error('Sound error:', err);
    }
  }, [isMuted]);

  // Load mathjs dynamically on client side
  useEffect(() => {
    const loadMathJS = async () => {
      try {
        const mathjs = await import('mathjs');
        mathjsRef.current = mathjs.evaluate;
      } catch (error) {
        console.error('Failed to load mathjs:', error);
        // Fallback to a simple eval-based solution
        mathjsRef.current = (expression: string) => {
          try {
            // Basic safe evaluation (for simple arithmetic only)
            // Remove any characters that aren't numbers or basic operators
            const sanitized = expression.replace(/[^0-9+\-*/().]/g, '');
            return Function(`"use strict"; return (${sanitized})`)();
          } catch {
            throw new Error('Invalid expression');
          }
        };
      }
    };

    loadMathJS();
  }, []);

  const generateNumbers = useCallback((difficulty: Difficulty, level: number): number[] => {
    const count = 6 + Math.floor(level / 5);
    const numbers = [];
    for (let i = 0; i < count; i++) {
      let max = 9;
      if (difficulty === 'medium') max = 15;
      if (difficulty === 'hard') max = 25;
      if (difficulty === 'expert') max = 50;
      const levelMultiplier = 1 + level * 0.05;
      numbers.push(Math.floor(Math.random() * max * levelMultiplier) + 1);
    }
    return numbers;
  }, []);

  const generateTarget = useCallback((difficulty: Difficulty, level: number): number => {
    let min = 10,
      max = 100;
    if (difficulty === 'medium') {
      min = 50;
      max = 200;
    } else if (difficulty === 'hard') {
      min = 100;
      max = 500;
    } else if (difficulty === 'expert') {
      min = 200;
      max = 1000;
    }
    const levelMultiplier = 1 + level * 0.1;
    return Math.floor(Math.random() * (max * levelMultiplier - min * levelMultiplier + 1)) + min * levelMultiplier;
  }, []);

  const generateNewPuzzle = useCallback(() => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }

    setFeedback({ message: '', type: '' });
    setGameState(prev => ({
      ...prev,
      currentExpression: '',
      usedIndices: [],
      numbers: generateNumbers(prev.difficulty, prev.level),
      target: generateTarget(prev.difficulty, prev.level),
      timeLeft: 120,
    }));

    timerInterval.current = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = Math.max(0, prev.timeLeft - 1);
        if (newTimeLeft <= 0) {
          timerInterval.current = null;
          setFeedback({ message: "Time's up!", type: 'error' });
          setGameState(prevState => ({ ...prevState, consecutiveHardWins: 0 }));
          playSound('error');
          setTimeout(() => {
            setFeedback({ message: '', type: '' });
            setGameState(prevState => ({
              ...prevState,
              currentExpression: '',
              usedIndices: [],
              numbers: generateNumbers(prevState.difficulty, prevState.level),
              target: generateTarget(prevState.difficulty, prevState.level),
              timeLeft: 120,
            }));
            timerInterval.current = setInterval(() => {
              setGameState(prevState => {
                const newTimeLeftInner = Math.max(0, prevState.timeLeft - 1);
                if (newTimeLeftInner <= 0) {
                  timerInterval.current = null;
                  setFeedback({ message: "Time's up!", type: 'error' });
                  setGameState(prevStateInner => ({ ...prevStateInner, consecutiveHardWins: 0 }));
                  playSound('error');
                  setTimeout(() => {
                    setFeedback({ message: '', type: '' });
                    setGameState(prevStateInner => ({
                      ...prevStateInner,
                      currentExpression: '',
                      usedIndices: [],
                      numbers: generateNumbers(prevStateInner.difficulty, prevStateInner.level),
                      target: generateTarget(prevStateInner.difficulty, prevStateInner.level),
                      timeLeft: 120,
                    }));
                  }, 2000);
                }
                return { ...prevState, timeLeft: newTimeLeftInner };
              });
            }, 1000);
          }, 2000);
        }
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 1000);
  }, [generateNumbers, generateTarget, playSound]);

  const selectNumber = useCallback(
    (index: number) => {
      if (!gameState.usedIndices.includes(index)) {
        setGameState(prev => ({
          ...prev,
          currentExpression: prev.currentExpression + prev.numbers[index],
          usedIndices: [...prev.usedIndices, index],
        }));
        setFeedback({ message: `Current: ${gameState.currentExpression}${gameState.numbers[index]}`, type: 'info' });
        playSound('select');
      }
    },
    [gameState.numbers, gameState.usedIndices, gameState.currentExpression, playSound]
  );

  const addOperator = useCallback(
    (op: string) => {
      setGameState(prev => ({
        ...prev,
        currentExpression: prev.currentExpression + op,
      }));
      setFeedback({ message: `Current: ${gameState.currentExpression}${op}`, type: 'info' });
      playSound('select');
    },
    [gameState.currentExpression, playSound]
  );

  const showConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
    });
  }, []);

  const handleCorrectSolution = useCallback(() => {
    let points = 10;
    if (gameState.difficulty === 'medium') points *= 1.5;
    if (gameState.difficulty === 'hard') points *= 2;
    if (gameState.difficulty === 'expert') points *= 3;
    points = Math.round(points);

    const newConsecutiveHardWins = gameState.difficulty === 'hard' ? gameState.consecutiveHardWins + 1 : 0;

    const newLevel = gameState.level + 1;

    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      level: newLevel,
      stats: {
        ...prev.stats,
        puzzlesSolved: prev.stats.puzzlesSolved + 1,
        totalPoints: prev.stats.totalPoints + points,
      },
      consecutiveHardWins: newConsecutiveHardWins,
    }));

    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    setFeedback({
      message: `Correct! ${gameState.currentExpression} = ${gameState.target} (+${points} points)`,
      type: 'success',
    });
    playSound('win');
    showConfetti();

    setTimeout(generateNewPuzzle, 1500);
  }, [
    gameState.difficulty,
    gameState.consecutiveHardWins,
    gameState.currentExpression,
    gameState.target,
    gameState.level,
    playSound,
    generateNewPuzzle,
    showConfetti,
  ]);

  const handleIncorrectSolution = useCallback(
    (result: number) => {
      setFeedback({
        message: `Incorrect! ${gameState.currentExpression} = ${result} (Target: ${gameState.target})`,
        type: 'error',
      });
      if (gameState.difficulty === 'hard') {
        setGameState(prev => ({ ...prev, consecutiveHardWins: 0 }));
      }
      playSound('error');
    },
    [gameState.difficulty, gameState.currentExpression, gameState.target, playSound]
  );

  const submitSolution = useCallback(() => {
    if (!gameState.currentExpression) {
      setFeedback({ message: 'Create an expression using the numbers!', type: 'error' });
      playSound('error');
      return;
    }

    const hasOperator = ['+', '-', '*', '/'].some(op => gameState.currentExpression.includes(op));

    if (!hasOperator) {
      setFeedback({
        message: 'You must use at least one operator (+, -, *, /) between numbers!',
        type: 'error',
      });
      playSound('error');
      return;
    }

    try {
      if (!mathjsRef.current) {
        setFeedback({ message: 'Math engine not loaded yet', type: 'error' });
        return;
      }

      const result = mathjsRef.current(gameState.currentExpression);
      if (Math.abs(result - gameState.target) < 0.0001) {
        handleCorrectSolution();
      } else {
        handleIncorrectSolution(result);
      }
    } catch {
      setFeedback({ message: 'Invalid mathematical expression', type: 'error' });
      playSound('error');
    }
  }, [gameState.currentExpression, gameState.target, playSound, handleCorrectSolution, handleIncorrectSolution]);

  const showHint = useCallback(() => {
    if (gameState.numbers.length > 0) {
      setGameState(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          hintsUsed: prev.stats.hintsUsed + 1,
        },
      }));
      setFeedback({ message: `Try starting with ${gameState.numbers[0]}`, type: 'hint' });
      playSound('select');
    }
  }, [gameState.numbers, playSound]);

  const clearInput = useCallback(() => {
    setGameState(prev => ({ ...prev, currentExpression: '', usedIndices: [] }));
    setFeedback({ message: 'Cleared', type: 'info' });
    playSound('select');
  }, [playSound]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({ action: 'number_scramble_started', category: 'number_scramble', label: 'number_scramble' });
        clearInterval(checkGtag);
      }
    }, 100);
    generateNewPuzzle();

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [generateNewPuzzle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Number Scramble
            </h1>
            <div className="text-sm md:text-base text-gray-300 mt-1">
              Level: {gameState.level} • Combine numbers to reach the target
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className={`bg-gray-900/80 px-4 py-2 rounded-lg border border-gray-700 font-mono text-lg ${
              gameState.timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'
            }`}>
              ⏱️ {formatTime(gameState.timeLeft)}
            </div>
            <div className="bg-gray-900/80 px-4 py-2 rounded-lg border border-gray-700 font-mono text-lg">
              Score: {gameState.score}
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-gray-800/30 rounded-2xl p-6 md:p-8 mb-6 backdrop-blur-sm border border-gray-700/50">
          {/* Target Display */}
          <div className="text-center mb-6">
            <div className="text-lg md:text-xl text-gray-300 mb-2">Target Number</div>
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              {gameState.target}
            </div>
          </div>

          {/* Feedback Message */}
          {feedback.message && (
            <div className={`text-center text-lg font-medium p-4 rounded-xl border backdrop-blur-sm mb-6 ${
              feedback.type === 'error' ? 'bg-red-500/20 text-red-300 border-red-500/50' : 
              feedback.type === 'success' ? 'bg-green-500/20 text-green-300 border-green-500/50' : 
              feedback.type === 'hint' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' :
              'bg-blue-500/20 text-blue-300 border-blue-500/50'
            }`}>
              {feedback.message}
            </div>
          )}

          {/* Current Expression */}
          <div className="bg-gray-700/50 rounded-xl p-4 mb-6 border border-gray-600/50">
            <div className="text-sm text-gray-400 mb-2">Current Expression</div>
            <div className="text-xl md:text-2xl font-mono text-center min-h-8 bg-gray-800/30 rounded-lg p-3 border border-gray-600/30">
              {gameState.currentExpression || 'Select numbers and operators...'}
            </div>
          </div>

          {/* Numbers Grid */}
          <div className="mb-6">
            <div className="text-lg font-semibold text-center mb-4 text-gray-200">Available Numbers</div>
            <div className="flex flex-wrap gap-3 justify-center">
              {gameState.numbers.map((num, index) => (
                <button
                  key={index}
                  onClick={() => selectNumber(index)}
                  disabled={gameState.usedIndices.includes(index)}
                  className={`
                    w-14 h-14 md:w-16 md:h-16 flex items-center justify-center
                    text-lg md:text-xl font-bold rounded-xl transition-all duration-200
                    border-2
                    ${gameState.usedIndices.includes(index)
                      ? 'bg-gray-600 text-gray-400 border-gray-500 cursor-not-allowed'
                      : 'bg-gray-700/80 text-white border-gray-600 hover:bg-blue-600 hover:border-blue-400 hover:scale-105 cursor-pointer'
                    }
                  `}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Operators */}
          <div className="mb-6">
            <div className="text-lg font-semibold text-center mb-4 text-gray-200">Operators</div>
            <div className="flex gap-3 justify-center">
              {['+', '-', '*', '/'].map(op => (
                <button
                  key={`op-${op}`}
                  onClick={() => addOperator(op)}
                  className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-xl md:text-2xl font-bold rounded-xl bg-purple-600 text-white border-2 border-purple-400 hover:bg-purple-500 hover:scale-105 transition-all duration-200"
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={submitSolution}
              className="px-6 md:px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Submit
            </button>
            <button
              onClick={clearInput}
              className="px-6 md:px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Clear
            </button>
            <button
              onClick={generateNewPuzzle}
              className="px-6 md:px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              New Puzzle
            </button>
            <button
              onClick={showHint}
              className="px-6 md:px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Hint
            </button>
          </div>
        </div>

        {/* How to Play */}
        <div className="bg-gray-800/50 rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-gray-700">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-gray-200">How to Play</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Combine the given numbers with +, -, ×, ÷ operators</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Use each number exactly once</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Reach the target value to solve the puzzle</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Longer expressions and higher difficulties earn more points</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Complete before time runs out</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Use hints if you get stuck</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}