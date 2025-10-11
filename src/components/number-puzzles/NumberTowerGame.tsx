"use client";
import { event } from '@/lib/gtag';
import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useSound } from '@/context/SoundContext';

type TowerLevel = number[];
type Difficulty = 'easy' | 'medium' | 'hard';

interface GameState {
  tower: TowerLevel[];
  currentLevel: number;
  score: number;
  isComplete: boolean;
  timeLeft: number;
  currentDifficulty: Difficulty;
  globalLevel: number;
  towerComplete: boolean;
  feedbackText: string;
  feedbackClass: string;
}

type SelectedNumber = {
  number: number;
  index: number;
};

const difficultySettings = {
  easy: {
    operations: ['add', 'subtract'],
    time: 120,
    baseRange: [1, 15],
    levels: 3
  },
  medium: {
    operations: ['add', 'subtract', 'multiply'],
    time: 100,
    baseRange: [5, 25],
    levels: 3
  },
  hard: {
    operations: ['add', 'subtract', 'multiply', 'divide'],
    time: 80,
    baseRange: [10, 40],
    levels: Infinity
  }
};

export default function NumberTowerGame() {
  const [gameState, setGameState] = useState<GameState>({
    tower: [],
    currentLevel: 0,
    score: 0,
    isComplete: false,
    timeLeft: 120,
    currentDifficulty: 'easy',
    globalLevel: 1,
    towerComplete: false,
    feedbackText: '',
    feedbackClass: ''
  });

  const [selectedNumbers, setSelectedNumbers] = useState<SelectedNumber[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { isMuted } = useSound();

  type SoundType = 'select' | 'found' | 'win' | 'error';
  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;
    const sounds: Record<SoundType, string> = {
      select: '/sounds/click.mp3',
      found: '/sounds/correct.mp3',
      error: '/sounds/incorrect.mp3',
      win: '/sounds/win.mp3',
    };
    try {
      const audio = new Audio(sounds[type]);
      audio.play().catch(err => console.error(`Error playing ${type} sound:`, err));
    } catch (error) {
      console.error('Sound error:', error);
    }
  }, [isMuted]);

  const showConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
    });
  }, []);

  const determineDifficulty = useCallback((globalLevel: number): Difficulty => {
    if (globalLevel <= difficultySettings.easy.levels) return 'easy';
    if (globalLevel <= difficultySettings.easy.levels + difficultySettings.medium.levels) return 'medium';
    return 'hard';
  }, []);

  const generateTower = useCallback((difficulty: Difficulty) => {
    const { baseRange } = difficultySettings[difficulty];
    const levels = 4 + Math.floor(Math.random() * 2); // 4-5 levels
    const tower: TowerLevel[] = [];
    
    // Generate base level with simple numbers
    const baseSize = 3 + Math.floor(Math.random() * 2); // 3-4 numbers
    const baseLevel: number[] = [];
    
    for (let i = 0; i < baseSize; i++) {
      const num = Math.floor(Math.random() * (baseRange[1] - baseRange[0])) + baseRange[0];
      baseLevel.push(num);
    }
    
    tower.push(baseLevel);
    
    // Build the pyramid by calculating sums going upward
    for (let i = 1; i < levels; i++) {
      const prevLevel = tower[i-1];
      const currentLevel: number[] = [];
      
      // Each number in the current level is the sum of two adjacent numbers below
      for (let j = 0; j < prevLevel.length - 1; j++) {
        currentLevel.push(prevLevel[j] + prevLevel[j+1]);
      }
      
      // Stop if we've reached a single number (top of pyramid)
      if (currentLevel.length === 1) {
        tower.push(currentLevel);
        break;
      }
      
      tower.push(currentLevel);
    }
    
    return tower;
  }, []);

  const initializeGame = useCallback(() => {
    // Clear existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const difficulty = determineDifficulty(gameState.globalLevel);
    const tower = generateTower(difficulty);
    const time = difficultySettings[difficulty].time;
    
    setGameState(prev => ({
      ...prev,
      tower,
      currentLevel: 0,
      isComplete: false,
      timeLeft: time,
      currentDifficulty: difficulty,
      towerComplete: false,
      feedbackText: '',
      feedbackClass: ''
    }));
    setSelectedNumbers([]);
  }, [gameState.globalLevel, determineDifficulty, generateTower]);

  const handleNumberSelect = useCallback((number: number, index: number) => {
    if (gameState.isComplete || gameState.towerComplete) return;
    
    const existingSelection = selectedNumbers.find(n => n.index === index);
    if (existingSelection) {
      setSelectedNumbers([]);
      setGameState(prev => ({ ...prev, feedbackText: '', feedbackClass: '' }));
      return;
    }

    if (selectedNumbers.length === 0) {
      setSelectedNumbers([{ number, index }]);
      playSound('select');
      return;
    }

    const firstSelection = selectedNumbers[0];
    if (Math.abs(index - firstSelection.index) !== 1) {
      setSelectedNumbers([{ number, index }]);
      setGameState(prev => ({ 
        ...prev, 
        feedbackText: 'Numbers must be adjacent!', 
        feedbackClass: 'bg-red-100 text-red-700' 
      }));
      playSound('error');
      return;
    }

    const sum = firstSelection.number + number;
    const nextLevel = gameState.currentLevel + 1;
    const targetPosition = Math.min(firstSelection.index, index);
    const targetNumber = gameState.tower[nextLevel][targetPosition];
    
    if (sum === targetNumber) {
      setGameState(prev => ({ 
        ...prev, 
        feedbackText: 'Correct!', 
        feedbackClass: 'bg-green-100 text-green-700' 
      }));
      setSelectedNumbers([]);
      playSound('found');

      setGameState(prev => {
        const towerComplete = nextLevel >= prev.tower.length - 1;
        const newScore = prev.score + (10 * (nextLevel + 1));
        
        if (towerComplete) {
          playSound('win');
          showConfetti();
        }

        return {
          ...prev,
          currentLevel: nextLevel,
          score: newScore,
          towerComplete: towerComplete,
          feedbackText: towerComplete ? '🎉 Tower Complete! 🎉' : 'Correct!',
          feedbackClass: towerComplete ? 'bg-yellow-100 text-yellow-700 font-bold text-xl' : 'bg-green-100 text-green-700'
        };
      });

      setTimeout(() => {
        setGameState(prev => ({ ...prev, feedbackText: '', feedbackClass: '' }));
      }, 1500);
    } else {
      setGameState(prev => ({ 
        ...prev, 
        feedbackText: `Try again! Need ${targetNumber}`, 
        feedbackClass: 'bg-red-100 text-red-700' 
      }));
      playSound('error');
      
      setTimeout(() => {
        setSelectedNumbers([]);
        setGameState(prev => ({ ...prev, feedbackText: '', feedbackClass: '' }));
      }, 1500);
    }
  }, [gameState.isComplete, gameState.towerComplete, gameState.currentLevel, gameState.tower, selectedNumbers, playSound, showConfetti]);

  const handleNextLevel = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      globalLevel: prev.globalLevel + 1,
      towerComplete: false
    }));
    playSound('select');
  }, [playSound]);

  const initGame = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    setGameState({
      tower: [],
      currentLevel: 0,
      score: 0,
      isComplete: false,
      timeLeft: 120,
      currentDifficulty: 'easy',
      globalLevel: 1,
      towerComplete: false,
      feedbackText: '',
      feedbackClass: ''
    });
    setSelectedNumbers([]);
    
    // Initialize with a new game after state reset
    setTimeout(() => {
      const difficulty = determineDifficulty(1);
      const tower = generateTower(difficulty);
      const time = difficultySettings[difficulty].time;
      
      setGameState(prev => ({
        ...prev,
        tower,
        timeLeft: time,
        currentDifficulty: difficulty
      }));
    }, 100);
    
    playSound('select');
  }, [determineDifficulty, generateTower, playSound]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Timer effect
  useEffect(() => {
    if (!gameState.isComplete && !gameState.towerComplete && gameState.timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setGameState(prev => {
          const newTimeLeft = Math.max(0, prev.timeLeft - 1);
          if (newTimeLeft <= 0) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            return { 
              ...prev, 
              timeLeft: 0, 
              isComplete: true,
              feedbackText: "Time's up!",
              feedbackClass: "bg-red-100 text-red-700"
            };
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [gameState.isComplete, gameState.towerComplete, gameState.timeLeft]);

  // Initialize game when global level changes
  useEffect(() => {
    if (!gameState.towerComplete && gameState.globalLevel > 1) {
      initializeGame();
    }
  }, [gameState.globalLevel, gameState.towerComplete, initializeGame]);

  // Initial game setup
  useEffect(() => {
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({ action: 'number_tower_started', category: 'number_tower', label: 'number_tower' });
        clearInterval(checkGtag);
      }
    }, 100);

    // Initialize first game
    const difficulty = determineDifficulty(1);
    const tower = generateTower(difficulty);
    const time = difficultySettings[difficulty].time;
    
    setGameState(prev => ({
      ...prev,
      tower,
      timeLeft: time,
      currentDifficulty: difficulty
    }));

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [determineDifficulty, generateTower]);

  return (
    <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Number Tower</h1>
      <p className="text-gray-600 mb-6">Combine adjacent numbers to build the tower</p>

      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold">Level: {gameState.globalLevel}</div>
        <div className={`text-lg font-semibold ${gameState.timeLeft <= 10 ? 'text-red-600 animate-pulse' : ''}`}>
          Time: {formatTime(gameState.timeLeft)}
        </div>
        <div className="text-lg font-semibold">Score: {gameState.score}</div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
          gameState.currentDifficulty === 'easy' ? 'bg-green-500' :
          gameState.currentDifficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
        }`}>
          {gameState.currentDifficulty.toUpperCase()}
        </span>
        <span className="text-sm text-gray-600">
          Tower Level: {gameState.currentLevel + 1} of {gameState.tower.length}
        </span>
      </div>

      {gameState.feedbackText && (
        <div className={`p-4 rounded-lg mb-6 font-mono text-lg ${gameState.feedbackClass}`}>
          {gameState.feedbackText}
        </div>
      )}

      {gameState.towerComplete ? (
        <div className="text-center bg-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Tower Complete! 🎉</h2>
          <p className="text-xl mb-2">You completed Global Level {gameState.globalLevel}!</p>
          <p className="text-lg mb-6">Current Score: {gameState.score}</p>
          <button 
            onClick={handleNextLevel}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold text-lg"
          >
            Continue to Level {gameState.globalLevel + 1}
          </button>
        </div>
      ) : gameState.isComplete ? (
        <div className="text-center bg-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Time&apos;s Up!</h2>
          <p className="text-xl mb-6">You reached Level {gameState.currentLevel + 1}</p>
          <button 
            onClick={initGame}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold text-lg"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Tower Display */}
          <div className="flex flex-col items-center space-y-4 mb-8">
            {gameState.tower.map((level, levelIndex) => (
              <div 
                key={levelIndex} 
                className={`flex gap-2 ${
                  levelIndex > gameState.currentLevel ? 'opacity-40' : 'opacity-100'
                }`}
              >
                {level.map((number, numIndex) => {
                  const isSelected = selectedNumbers.some(n => n.index === numIndex);
                  const isActive = levelIndex === gameState.currentLevel;
                  
                  return (
                    <button
                      key={numIndex}
                      onClick={() => isActive && handleNumberSelect(number, numIndex)}
                      className={`w-16 h-16 rounded-lg font-bold text-lg transition-all duration-200 ${
                        isSelected ? 'bg-blue-500 text-white scale-110 shadow-lg' :
                        isActive ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 shadow-md hover:scale-105' :
                        'bg-gray-100 text-gray-500 cursor-not-allowed'
                      } border-2 ${
                        isSelected ? 'border-blue-600' :
                        isActive ? 'border-blue-300' : 'border-gray-200'
                      }`}
                      disabled={!isActive || gameState.isComplete}
                    >
                      {number}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={initGame}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold"
            >
              New Game
            </button>
          </div>
        </>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">How to Play</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Select two adjacent numbers that sum to the number above them</li>
          <li>Complete each level to build the tower to the top</li>
          <li>Each completed tower advances you to the next global level</li>
          <li>Higher levels feature more complex towers and shorter time limits</li>
          <li>Easy: Levels 1-3, Medium: Levels 4-6, Hard: Level 7+</li>
        </ul>
      </div>
    </div>
  );
}