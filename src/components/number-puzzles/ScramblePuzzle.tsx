'use client';
import { event } from '@/lib/gtag';
import { useState, useEffect, useCallback, useRef } from 'react';
import { evaluate } from 'mathjs';
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

const buttonStyle = "px-6 md:px-3 py-2 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] text-center"

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
    // Clear existing timer
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }

    // Reset game state for new puzzle
    setFeedback({ message: '', type: '' });
    setGameState(prev => ({
      ...prev,
      currentExpression: '',
      usedIndices: [],
      numbers: generateNumbers(prev.difficulty, prev.level),
      target: generateTarget(prev.difficulty, prev.level),
      timeLeft: 120,
    }));

    // Start timer
    timerInterval.current = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = Math.max(0, prev.timeLeft - 1);
        if (newTimeLeft <= 0) {
          timerInterval.current = null;
          // Handle time expiration
          setFeedback({ message: "Time's up!", type: 'error' });
          setGameState(prevState => ({ ...prevState, consecutiveHardWins: 0 }));
          playSound('error');
          // Schedule new puzzle after delay
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
            // Restart timer for the new puzzle
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
      const result = evaluate(gameState.currentExpression);
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
    <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Number Scramble - Beat the timer</h1>
      <p className="text-gray-600 mb-6">Combine numbers with operators to reach the target</p>

      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold">Level: {gameState.level}</div>
        <div className={`text-lg font-semibold ${gameState.timeLeft <= 10 ? 'text-red-600 animate-pulse' : ''}`}>
          Time: {formatTime(gameState.timeLeft)}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold">Score: {gameState.score}</div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold">Target: {gameState.target}</div>
        </div>

        <div
          className={`p-4 rounded-lg mb-4 font-mono text-lg ${
            feedback.type === 'error' ? 'bg-red-100 text-red-700' :
            feedback.type === 'success' ? 'bg-green-100 text-green-700' :
            'bg-blue-50 text-blue-700'
          }`}
        >
          {feedback.message || `Current: ${gameState.currentExpression || 'Empty'}`}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {gameState.numbers.map((num, index) => (
            <button
              key={index}
              onClick={() => selectNumber(index)}
              disabled={gameState.usedIndices.includes(index)}
              className={`px-6 py-3 text-lg font-bold rounded-lg transition-all ${
                gameState.usedIndices.includes(index)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {['+', '-', '*', '/'].map(op => (
            <button
              key={`op-${op}`}
              onClick={() => addOperator(op)}
              className="px-6 py-3 text-lg font-bold rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all"
            >
              {op}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={submitSolution}
            className={`${buttonStyle} bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white`}
          >
            Submit
          </button>
          <button
            onClick={clearInput}
            className={`${buttonStyle} bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white`}
          >
            Clear
          </button>
          <button
            onClick={generateNewPuzzle}
            className={`${buttonStyle} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white`}
          >
            New Puzzle
          </button>
          <button
            onClick={showHint}
            className={`${buttonStyle} bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white`}
          >
            Hint
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">How to Play</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Combine the given numbers with +, -, ×, ÷ operators</li>
          <li>Use each number exactly once</li>
          <li>Reach the target value to solve the puzzle</li>
          <li>Longer expressions and higher difficulties earn more points</li>
        </ul>
      </div>
    </div>
  );
}