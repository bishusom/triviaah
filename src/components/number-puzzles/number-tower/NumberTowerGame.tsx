"use client"
import { useState, useEffect, useCallback } from 'react';

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
}

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
    towerComplete: false
  });

  const [selectedNumbers, setSelectedNumbers] = useState<{number: number, index: number}[]>([]);
  const [feedback, setFeedback] = useState({ text: '', className: '' });

  const determineDifficulty = (globalLevel: number): Difficulty => {
    if (globalLevel <= difficultySettings.easy.levels) return 'easy';
    if (globalLevel <= difficultySettings.easy.levels + difficultySettings.medium.levels) return 'medium';
    return 'hard';
  };

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
      towerComplete: false
    }));
    setSelectedNumbers([]);
    setFeedback({ text: '', className: '' });
  }, [gameState.globalLevel, generateTower]);

  const startTimer = useCallback(() => {
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          return { ...prev, timeLeft: 0, isComplete: true };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNumberSelect = (number: number, index: number) => {
    // Fixed: Remove the problematic early return condition
    if (gameState.isComplete) return;
    
    const existingSelection = selectedNumbers.find(n => n.index === index);
    if (existingSelection) {
      setSelectedNumbers([]);
      setFeedback({ text: '', className: '' });
      return;
    }

    if (selectedNumbers.length === 0) {
      setSelectedNumbers([{ number, index }]);
      return;
    }

    const firstSelection = selectedNumbers[0];
    if (Math.abs(index - firstSelection.index) !== 1) {
      setSelectedNumbers([{ number, index }]);
      setFeedback({ text: 'Numbers must be adjacent!', className: 'text-red-500 font-semibold' });
      return;
    }

    const sum = firstSelection.number + number;
    const nextLevel = gameState.currentLevel + 1;
    // The target position in the level above is the minimum index of the two selected numbers
    const targetPosition = Math.min(firstSelection.index, index);
    const targetNumber = gameState.tower[nextLevel][targetPosition];
    
    console.log(`Selected: ${firstSelection.number} + ${number} = ${sum}, Target: ${targetNumber} at position ${targetPosition}`);
    
    if (sum === targetNumber) {
      setFeedback({ text: 'Correct!', className: 'text-green-500 font-semibold' });
      setSelectedNumbers([]);

      setGameState(prev => {
        // Fixed: Correct condition for tower completion
        const towerComplete = nextLevel >= prev.tower.length - 1;
        
        return {
          ...prev,
          currentLevel: nextLevel,
          score: prev.score + (10 * (nextLevel + 1)),
          towerComplete: towerComplete
        };
      });

      // Fixed: Check if we've reached the top of the tower
      if (nextLevel >= gameState.tower.length - 1) {
        // Trigger confetti for tower completion
        if (typeof window !== 'undefined') {
          // Simple confetti effect
          setTimeout(() => {
            setFeedback({ text: '🎉 Tower Complete! 🎉', className: 'text-yellow-500 font-bold text-xl' });
          }, 500);
        }
      }

      setTimeout(() => setFeedback({ text: '', className: '' }), 1500);
    } else {
      setFeedback({ text: `Try again! Need ${targetNumber}`, className: 'text-red-500 font-semibold' });
      setTimeout(() => {
        setSelectedNumbers([]);
        setFeedback({ text: '', className: '' });
      }, 1500);
    }
  };

  const handleNextLevel = () => {
    setGameState(prev => ({
      ...prev,
      globalLevel: prev.globalLevel + 1,
      towerComplete: false
    }));
  };

  // Fixed: Separate useEffect for timer
  useEffect(() => {
    if (!gameState.isComplete && !gameState.towerComplete) {
      const timer = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            clearInterval(timer);
            return { ...prev, timeLeft: 0, isComplete: true };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState.isComplete, gameState.towerComplete, gameState.globalLevel]);

  // Initialize game when global level changes
  useEffect(() => {
    if (!gameState.towerComplete) {
      initializeGame();
    }
  }, [gameState.globalLevel]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white rounded-lg shadow-lg p-4">
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-semibold">
            Global Level: {gameState.globalLevel}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
            gameState.currentDifficulty === 'easy' ? 'bg-green-500' :
            gameState.currentDifficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
          }`}>
            {gameState.currentDifficulty.toUpperCase()}
          </span>
        </div>
        <div className={`text-lg font-mono ${gameState.timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
          Time: {formatTime(gameState.timeLeft)}
        </div>
        <div className="text-lg font-semibold text-gray-700">
          Score: {gameState.score}
        </div>
      </div>

      {gameState.towerComplete ? (
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Tower Complete! 🎉</h2>
          <p className="text-xl mb-2">You completed Global Level {gameState.globalLevel}!</p>
          <p className="text-lg mb-6">Current Score: {gameState.score}</p>
          <button 
            onClick={handleNextLevel} 
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-lg transition-colors"
          >
            Continue to Level {gameState.globalLevel + 1}
          </button>
        </div>
      ) : gameState.isComplete ? (
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Time&apos;s Up!</h2>
          <p className="text-xl mb-6">You reached Level {gameState.currentLevel + 1}</p>
          <button 
            onClick={() => setGameState(prev => ({ ...prev, globalLevel: 1, score: 0 }))} 
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-lg transition-colors"
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
                        isActive ? 'bg-white hover:bg-blue-50 text-gray-800 shadow-md hover:scale-105' :
                        'bg-gray-100 text-gray-500 cursor-not-allowed'
                      } border-2 ${
                        isSelected ? 'border-blue-600' :
                        isActive ? 'border-gray-300' : 'border-gray-200'
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

          {/* Feedback */}
          {feedback.text && (
            <div className={`text-center text-lg mb-6 ${feedback.className}`}>
              {feedback.text}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">How to Play:</h3>
            <p className="mb-2 text-gray-600">Select two adjacent numbers that sum to the number above them.</p>
            <p className="mb-4 text-gray-600">Complete towers to progress through increasing difficulties.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 p-3 rounded">
                <p className="font-semibold text-green-700">Easy (Levels 1-3)</p>
                <p className="text-green-600">Addition & Subtraction</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <p className="font-semibold text-yellow-700">Medium (Levels 4-6)</p>
                <p className="text-yellow-600">Add/Subtract/Multiply</p>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <p className="font-semibold text-red-700">Hard (Level 7+)</p>
                <p className="text-red-600">All operations</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}