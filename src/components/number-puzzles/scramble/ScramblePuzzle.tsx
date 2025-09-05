'use client';
import { event } from '@/lib/gtag';
import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useSound } from '@/context/SoundContext';
import commonStyles from '@styles/NumberPuzzles/NumberPuzzles.common.module.css';
import styles from '@styles/NumberPuzzles/NumberScramble.module.css';

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
  const timerInterval = useRef<NodeJS.Timeout| null>(null);
  const { isMuted } = useSound();

  type SoundType = 'select' | 'found' | 'win' | 'error';
  
  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;
    const sounds: Record<SoundType, string> = {
      select: '/sounds/click.mp3',
      found: '/sounds/correct.mp3',
      win: '/sounds/win.mp3',
      error: '/sounds/incorrect.mp3'
    };
    
    try {
      const audio = new Audio(sounds[type]);
      audio.play().catch(err => console.error(`Error playing ${type} sound:`, err));
    } catch (error) {
      console.error('Sound error:', error);
    }
  }, [isMuted]);
  
  const startTimer = useCallback(() => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    setGameState(prev => ({ ...prev, timeLeft: 120 }));

    timerInterval.current = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = Math.max(0, prev.timeLeft - 1);
        if (newTimeLeft <= 0) {
          timerInterval.current = null;
          handleTimeExpired();
        }
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 1000);
  }, []);

  const handleTimeExpired = useCallback(() => {
    setFeedback({ message: "Time's up!", type: 'error' });
    setGameState(prev => ({ ...prev, consecutiveHardWins: 0 }));
    playSound('error');
    setTimeout(generateNewPuzzle, 2000);
  }, [playSound]);

  const generateNumbers = useCallback((difficulty: Difficulty, level: number): number[] => {
    const count = 6 + Math.floor(level / 5);
    const numbers = [];
    for (let i = 0; i < count; i++) {
      let max = 9;
      if (difficulty === 'medium') max = 15;
      if (difficulty === 'hard') max = 25;
      if (difficulty === 'expert') max = 50;
      const levelMultiplier = 1 + (level * 0.05);
      numbers.push(Math.floor(Math.random() * max * levelMultiplier) + 1);
    }
    return numbers;
  }, []);

  const generateTarget = useCallback((difficulty: Difficulty, level: number): number => {
    let min = 10, max = 100;
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
    const levelMultiplier = 1 + (level * 0.1);
    return Math.floor(Math.random() * (max * levelMultiplier - min * levelMultiplier + 1)) + min * levelMultiplier;
  }, []);

  const generateNewPuzzle = useCallback(() => {
    setFeedback({ message: '', type: '' });
    setGameState(prev => ({
      ...prev,
      currentExpression: '',
      usedIndices: [],
      numbers: generateNumbers(prev.difficulty, prev.level),
      target: generateTarget(prev.difficulty, prev.level)
    }));
    startTimer();
  }, [generateNumbers, generateTarget, startTimer]);

  const selectNumber = useCallback((index: number) => {
    if (!gameState.usedIndices.includes(index)) {
      setGameState(prev => ({
        ...prev,
        currentExpression: prev.currentExpression + prev.numbers[index],
        usedIndices: [...prev.usedIndices, index]
      }));
      setFeedback({ message: `Current: ${gameState.currentExpression}${gameState.numbers[index]}`, type: 'info' });
      playSound('select');
    }
  }, [gameState.numbers, gameState.usedIndices, gameState.currentExpression, playSound]);

  const addOperator = useCallback((op: string) => {
    setGameState(prev => ({
      ...prev,
      currentExpression: prev.currentExpression + op
    }));
    setFeedback({ message: `Current: ${gameState.currentExpression}${op}`, type: 'info' });
    playSound('select');
  }, [gameState.currentExpression, playSound]);

  const showConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    });
  }, []);

  const handleCorrectSolution = useCallback(() => {
    let points = 10;
    if (gameState.difficulty === 'medium') points *= 1.5;
    if (gameState.difficulty === 'hard') points *= 2;
    if (gameState.difficulty === 'expert') points *= 3;
    points = Math.round(points);

    const newConsecutiveHardWins = gameState.difficulty === 'hard' 
      ? gameState.consecutiveHardWins + 1 
      : 0;

    const newLevel = gameState.level + 1;

    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      level: newLevel,
      stats: {
        ...prev.stats,
        puzzlesSolved: prev.stats.puzzlesSolved + 1,
        totalPoints: prev.stats.totalPoints + points
      },
      consecutiveHardWins: newConsecutiveHardWins,
    }));

    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    setFeedback({ 
      message: `Correct! ${gameState.currentExpression} = ${gameState.target} (+${points} points)`, 
      type: 'success' 
    });
    playSound('win');
    showConfetti();

    setTimeout(() => {
      setFeedback({ message: '', type: '' });  
      generateNewPuzzle();
    }, 1500);
  }, [gameState.difficulty, gameState.consecutiveHardWins, gameState.currentExpression, gameState.target, gameState.level, playSound, generateNewPuzzle, showConfetti]);

  const handleIncorrectSolution = useCallback((result: number) => {
    setFeedback({ 
      message: `Incorrect! ${gameState.currentExpression} = ${result} (Target: ${gameState.target})`, 
      type: 'error' 
    });
    if (gameState.difficulty === 'hard') {
      setGameState(prev => ({ ...prev, consecutiveHardWins: 0 }));
    }
    playSound('error');
  }, [gameState.difficulty, gameState.currentExpression, gameState.target, playSound]);

  const submitSolution = useCallback(() => {
    if (!gameState.currentExpression) {
      setFeedback({ message: 'Create an expression using the numbers!', type: 'error' });
      playSound('error');
      return;
    }

    const hasOperator = ['+', '-', '*', '/'].some(op => 
      gameState.currentExpression.includes(op)
    );

    if (!hasOperator) {
      setFeedback({ 
        message: 'You must use at least one operator (+, -, *, /) between numbers!', 
        type: 'error' 
      });
      playSound('error');
      return;
    }

    try {
      const result = eval(gameState.currentExpression);
      if (Math.abs(result - gameState.target) < 0.0001) {
        handleCorrectSolution();
      } else {
        handleIncorrectSolution(result);
      }
    } catch (error) {
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
          hintsUsed: prev.stats.hintsUsed + 1
        }
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
        event({action: 'number_scramble_started', category: 'number_scramble',label: 'number_scramble'});
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
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Number Scramble
      </h1>
      <p className="text-gray-600 mb-6">
        Combine numbers with operators to reach the target
      </p>

      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold">
          Level: {gameState.level}
        </div>
        <div className={`text-lg font-semibold ${gameState.timeLeft <= 10 ? styles.timeCritical : ''}`}>
          Time: {formatTime(gameState.timeLeft)}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold">
            Score: {gameState.score}
          </div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold">
            Target: {gameState.target}
          </div>
        </div>

        <div 
        className={`${styles.scrambleExpression} ${
          feedback.type === 'error' ? styles.feedbackError : 
          feedback.type === 'success' ? styles.feedbackSuccess : 
          styles.feedbackInfo
        }`}>
          {feedback.message || `Current: ${gameState.currentExpression || 'Empty'}`}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {gameState.numbers.map((num, index) => (
            <button
              key={index}
              onClick={() => selectNumber(index)}
              disabled={gameState.usedIndices.includes(index)}
              className={`${styles.scrambleTile} ${gameState.usedIndices.includes(index) ? styles.used : ''}`}
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
              className={styles.scrambleTile}
            >
              {op}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={submitSolution}
            className={`${commonStyles.btn} ${commonStyles.primary}`}
          >
            Submit
          </button>
          <button 
            onClick={clearInput}
            className={`${commonStyles.btn} ${commonStyles.secondary}`}
          >
            Clear
          </button>
          <button 
            onClick={generateNewPuzzle}
            className={`${commonStyles.btn} ${commonStyles.secondary}`}
          >
            New Puzzle
          </button>
          <button 
            onClick={showHint}
            className={`${commonStyles.btn} ${commonStyles.tertiary}`}
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