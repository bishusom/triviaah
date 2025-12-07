"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from "canvas-confetti"; 

type Difficulty = 'easy' | 'medium' | 'hard';

interface Rule {
  text: string;
  fn: (n: number, last: number | null) => boolean;
  xValue: number;
  numbers: number[];
}

interface GameState {
  level: number;
  score: number;
  timeLeft: number;
  currentNumbers: number[];
  gameActive: boolean;
  currentRule: Rule | null;
  targetHeight: number;
  currentHeight: number;
  lastNumber: number | null;
  difficulty: Difficulty;
  feedbackText: string;
  feedbackClass: string;
  towerStack: number[];
}

const difficultySettings = {
  easy: { targetHeight: 3, time: 180 },
  medium: { targetHeight: 5, time: 180 },
  hard: { targetHeight: 8, time: 180 }
};

export default function NumberTowerGame() {
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    timeLeft: 180,
    currentNumbers: [],
    gameActive: false,
    currentRule: null,
    targetHeight: 5,
    currentHeight: 0,
    lastNumber: null,
    difficulty: 'medium',
    feedbackText: '',
    feedbackClass: '',
    towerStack: []
  });


  const [selectedCells, setSelectedCells] = useState<Set<number>>(new Set());
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const buttonStyle = "px-6 md:px-3 py-2 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] text-center"

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
    const defaults = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    };
    
    confetti(defaults);
    
    if (Math.random() > 0.5) {
      setTimeout(() => {
        confetti({
          ...defaults,
          angle: Math.random() * 180 - 90,
          origin: { x: Math.random(), y: 0.6 }
        });
      }, 300);
    }
  }, []);

  const getGridSize = useCallback(() => {
    if (gameState.level <= 3) return 6;
    if (gameState.level <= 6) return 8;
    return 10;
  }, [gameState.level]);

  const getNumberRange = useCallback(() => {
    if (gameState.level <= 2) return 20;
    if (gameState.level <= 4) return 100;
    if (gameState.level <= 6) return 500;
    return 1000;
  }, [gameState.level]);

  const shuffleArray = useCallback((array: number[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  const generateRule = useCallback(() => {
    const range = getNumberRange();
    
    const rules = [
      {
        name: "multiples",
        text: "Build the tower by selecting multiples of X!",
        fn: (n: number, x: number) => n % x === 0,
        xGenerator: () => Math.max(2, Math.floor(gameState.level / 2) + 1),
        numberGenerator: (x: number, range: number) => {
          const multiples = [];
          for (let i = x; i <= range; i += x) {
            multiples.push(i);
          }
          return multiples;
        }
      },
      {
        name: "factors",
        text: "Build the tower by selecting factors of X!",
        fn: (n: number, x: number) => x % n === 0,
        xGenerator: () => {
          const goodNumbers = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20];
          return goodNumbers[Math.floor(Math.random() * goodNumbers.length)];
        },
        numberGenerator: (x: number) => {
          const factors = [];
          for (let i = 1; i <= x; i++) {
            if (x % i === 0) factors.push(i);
          }
          return factors;
        }
      },
      {
        name: "greater",
        text: "Build the tower by selecting numbers greater than X!",
        fn: (n: number, x: number) => n > x,
        xGenerator: () => Math.max(1, Math.floor(range * 0.3)),
        numberGenerator: (x: number, range: number) => {
          return Array.from({ length: range - x }, (_, i) => x + 1 + i);
        }
      },
      {
        name: "less",
        text: "Build the tower by selecting numbers less than X!",
        fn: (n: number, x: number) => n < x,
        xGenerator: () => Math.min(range - 2, Math.max(4, Math.floor(range * 0.7))),
        numberGenerator: (x: number) => {
          return Array.from({ length: x - 1 }, (_, i) => i + 1);
        }
      },
      {
        name: "additive",
        text: "Build the tower by selecting numbers that are X more than the last!",
        fn: (n: number, x: number, last: number | null) => last ? n === last + x : true,
        xGenerator: () => Math.max(1, Math.floor(gameState.level / 3) + 1),
        numberGenerator: (x: number, range: number) => {
          return Array.from({ length: range }, (_, i) => i + 1);
        }
      },
      {
        name: "multiplicative",
        text: "Build the tower by selecting numbers that are X times the last!",
        fn: (n: number, x: number, last: number | null) => last ? n === last * x : true,
        xGenerator: () => Math.max(2, Math.floor(gameState.level / 3) + 2),
        numberGenerator: (x: number, range: number) => {
          return Array.from({ length: range }, (_, i) => i + 1);
        }
      }
    ];

    let rule;
    let x;
    let numbers;
    
    for (let i = 0; i < 3; i++) {
      rule = rules[Math.floor(Math.random() * rules.length)];
      x = rule.xGenerator();
      numbers = rule.numberGenerator(x, range);
      if (numbers.length >= gameState.targetHeight) break;
    }
    
    if (!rule || !x || !numbers || numbers.length < gameState.targetHeight) {
      rule = rules[0];
      x = rule.xGenerator();
      numbers = rule.numberGenerator(x, range);
    }

    return {
      text: rule.text.replace('X', x.toString()),
      fn: (n: number, last: number | null) => rule.fn(n, x, last),
      xValue: x,
      numbers: numbers
    };
  }, [gameState.level, gameState.targetHeight, getNumberRange]);

  const generateGrid = useCallback((rule: Rule) => {
    const gridSize = getGridSize();
    const totalCells = gridSize * gridSize;
    const range = getNumberRange();
    let numberPool: number[] = [];
    
    let validSequence: number[] = [];
    const x = rule.xValue;

    if (rule.text.includes("multiples of")) {
      let current = x;
      while (current <= range && validSequence.length < gameState.targetHeight) {
        validSequence.push(current);
        current += x;
      }
    } else if (rule.text.includes("factors of")) {
      for (let i = 1; i <= x; i++) {
        if (x % i === 0 && validSequence.length < gameState.targetHeight) {
          validSequence.push(i);
        }
      }
    } else if (rule.text.includes("greater than")) {
      let current = x + 1;
      while (current <= range && validSequence.length < gameState.targetHeight) {
        validSequence.push(current);
        current++;
      }
    } else if (rule.text.includes("less than")) {
      let current = 1;
      while (current < x && validSequence.length < gameState.targetHeight) {
        validSequence.push(current);
        current++;
      }
    } else if (rule.text.includes("more than the last")) {
      let current = 1;
      while (current <= range && validSequence.length < gameState.targetHeight) {
        validSequence.push(current);
        current += x;
      }
    } else if (rule.text.includes("times the last")) {
      let current = 1;
      validSequence = [current];
      while (current <= range && validSequence.length < gameState.targetHeight) {
        current *= x;
        if (current <= range) validSequence.push(current);
      }
    }

    numberPool = [...validSequence];
    
    const validNumbersNeeded = Math.max(gameState.targetHeight + 2, Math.ceil(totalCells * 0.4));
    while (numberPool.length < validNumbersNeeded) {
      const potentialNumbers = rule.numbers.filter(n => 
        !numberPool.includes(n)
      );
      if (potentialNumbers.length > 0) {
        numberPool.push(potentialNumbers[Math.floor(Math.random() * potentialNumbers.length)]);
      } else {
        break;
      }
    }
    
    while (numberPool.length < totalCells) {
      const randomNum = Math.floor(Math.random() * range) + 1;
      numberPool.push(randomNum);
    }
    
    return shuffleArray(numberPool);
  }, [gameState.targetHeight, getGridSize, getNumberRange, shuffleArray]);

  const handleCellClick = useCallback((number: number, index: number) => {
    if (!gameState.gameActive) return;
    
    if (selectedCells.has(index)) return;
    
    playSound('select');
    const isValid = gameState.currentRule?.fn(number, gameState.lastNumber) ?? false;
    
    setSelectedCells(prev => new Set(prev).add(index));
    
    if (isValid) {
      const newHeight = gameState.currentHeight + 1;
      const newScore = gameState.score + gameState.level * 2;
      
      setGameState(prev => ({
        ...prev,
        lastNumber: number,
        currentHeight: newHeight,
        towerStack: [...prev.towerStack, number],
        score: newScore,
        feedbackText: 'Correct!',
        feedbackClass: 'bg-green-100 text-green-700'
      }));
      playSound('found');
      
      setTimeout(() => {
        setGameState(prev => ({ ...prev, feedbackText: '', feedbackClass: '' }));
        
        if (newHeight >= gameState.targetHeight) {
          levelUp();
        }
      }, 500);
    } else {
      setGameState(prev => ({
        ...prev,
        timeLeft: Math.max(5, prev.timeLeft - 3),
        feedbackText: 'Wrong! -3 seconds',
        feedbackClass: 'bg-red-100 text-red-700'
      }));
      playSound('error');
      
      setTimeout(() => {
        setGameState(prev => ({ ...prev, feedbackText: '', feedbackClass: '' }));
      }, 1000);
    }
  }, [gameState.gameActive, gameState.currentRule, gameState.lastNumber, gameState.currentHeight, gameState.score, gameState.level, gameState.targetHeight, selectedCells, playSound]);

  const levelUp = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setGameState(prev => ({
      ...prev,
      gameActive: false,
      feedbackText: `Level Complete! +${prev.level * 15} bonus points!`,
      feedbackClass: 'bg-yellow-100 text-yellow-700 font-bold text-xl',
      score: prev.score + prev.level * 15
    }));
    
    playSound('win');
    showConfetti();
    
    setTimeout(() => {
      setGameState(prev => {
        const newLevel = prev.level + 1;
        const newRule = generateRule();
        const newNumbers = generateGrid(newRule);
        
        return {
          ...prev,
          level: newLevel,
          timeLeft: 180,
          currentHeight: 0,
          lastNumber: null,
          towerStack: [],
          gameActive: true,
          currentRule: newRule,
          currentNumbers: newNumbers,
          feedbackText: '',
          feedbackClass: ''
        };
      });
      setSelectedCells(new Set());
    }, 2000);
  }, [playSound, showConfetti, generateRule, generateGrid]);

  const clearLastNumber = useCallback(() => {
    if (!gameState.gameActive || gameState.currentHeight === 0) return;
    
    playSound('select');
    
    setGameState(prev => {
      const newStack = [...prev.towerStack];
      newStack.pop();
      
      return {
        ...prev,
        currentHeight: prev.currentHeight - 1,
        towerStack: newStack,
        lastNumber: newStack.length > 0 ? newStack[newStack.length - 1] : null
      };
    });
    
    setSelectedCells(prev => {
      const arr = Array.from(prev);
      arr.pop();
      return new Set(arr);
    });
  }, [gameState.gameActive, gameState.currentHeight, playSound]);

  const showHint = useCallback(() => {
    if (!gameState.gameActive || !gameState.currentRule) return;
    
    playSound('select');
    
    const validIndices: number[] = [];
    gameState.currentNumbers.forEach((num, idx) => {
      if (!selectedCells.has(idx) && gameState.currentRule!.fn(num, gameState.lastNumber)) {
        validIndices.push(idx);
      }
    });
    
    if (validIndices.length > 0) {
      const randomIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
      setGameState(prev => ({
        ...prev,
        feedbackText: `Hint: Try ${prev.currentNumbers[randomIndex]}`,
        feedbackClass: 'bg-blue-100 text-blue-700'
      }));
      
      setTimeout(() => {
        setGameState(prev => ({ ...prev, feedbackText: '', feedbackClass: '' }));
      }, 2000);
    } else {
      setGameState(prev => ({
        ...prev,
        feedbackText: 'No valid moves left!',
        feedbackClass: 'bg-gray-100 text-gray-700'
      }));
    }
  }, [gameState.gameActive, gameState.currentRule, gameState.currentNumbers, gameState.lastNumber, selectedCells, playSound]);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    const targetHeight = difficultySettings[difficulty].targetHeight;
    setGameState(prev => ({
      ...prev,
      difficulty,
      targetHeight
    }));
  }, []);

  const initGame = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    const rule = generateRule();
    const numbers = generateGrid(rule);
    
    setGameState(prev => ({
      level: 1,
      score: 0,
      timeLeft: 180,
      currentNumbers: numbers,
      gameActive: true,
      currentRule: rule,
      targetHeight: difficultySettings[prev.difficulty].targetHeight,
      currentHeight: 0,
      lastNumber: null,
      difficulty: prev.difficulty,
      feedbackText: '',
      feedbackClass: '',
      towerStack: []
    }));
    
    setSelectedCells(new Set());
    playSound('select');
  }, [generateRule, generateGrid, playSound]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState.gameActive && gameState.timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setGameState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          if (newTimeLeft <= 0) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            playSound('error');
            return {
              ...prev,
              timeLeft: 0,
              gameActive: false,
              feedbackText: `Game Over! Final Score: ${prev.score}`,
              feedbackClass: 'bg-red-100 text-red-700'
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
  }, [gameState.gameActive, gameState.timeLeft, playSound]);

  // Initial game setup
  useEffect(() => {
    initGame();
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const gridSize = getGridSize();
  const progressPercentage = (gameState.currentHeight / gameState.targetHeight) * 100;

  return (
    <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Number Tower</h1>
      <p className="text-gray-600 mb-6">Follow the rule to build your tower</p>

      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold">Level: {gameState.level}</div>
        <div className={`text-lg font-semibold ${gameState.timeLeft <= 10 ? 'text-red-600 animate-pulse' : ''}`}>
          Time: {formatTime(gameState.timeLeft)}
        </div>
        <div className="text-lg font-semibold">Score: {gameState.score}</div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
          gameState.difficulty === 'easy' ? 'bg-green-500' :
          gameState.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
        }`}>
          {gameState.difficulty.toUpperCase()}
        </span>
        <span className="text-sm text-gray-600">
          Tower Height: {gameState.currentHeight} / {gameState.targetHeight}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div 
          className="bg-blue-500 h-4 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Objective */}
      {gameState.currentRule && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
          <p className="text-lg font-semibold text-blue-800">{gameState.currentRule.text}</p>
        </div>
      )}

      {gameState.feedbackText && (
        <div className={`p-4 rounded-lg mb-6 font-mono text-lg ${gameState.feedbackClass}`}>
          {gameState.feedbackText}
        </div>
      )}

      {!gameState.gameActive && gameState.timeLeft === 0 ? (
        <div className="text-center bg-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Game Over!</h2>
          <p className="text-xl mb-2">You reached Level {gameState.level}</p>
          <p className="text-lg mb-6">Final Score: {gameState.score}</p>
          <button 
            onClick={initGame}
            className={`${buttonStyle} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white`}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Tower Stack Display */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Your Tower:</h3>
            <div className="flex flex-wrap gap-2 min-h-[60px] bg-gray-50 rounded-lg p-4">
              {gameState.towerStack.length === 0 ? (
                <span className="text-gray-400 italic">No blocks yet...</span>
              ) : (
                gameState.towerStack.map((num, idx) => (
                  <div 
                    key={idx}
                    className="w-14 h-14 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-md"
                  >
                    {num}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Number Grid */}
          <div 
            className="grid gap-2 mb-6"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {gameState.currentNumbers.map((number, index) => {
              const isSelected = selectedCells.has(index);
              
              return (
                <button
                  key={index}
                  onClick={() => handleCellClick(number, index)}
                  className={`h-16 rounded-lg font-bold text-lg transition-all duration-200 ${
                    isSelected ? 'bg-gray-300 text-gray-600 cursor-not-allowed' :
                    'bg-blue-100 text-blue-800 hover:bg-blue-200 shadow-md hover:scale-105'
                  } border-2 ${
                    isSelected ? 'border-gray-400' : 'border-blue-300'
                  }`}
                  disabled={isSelected || !gameState.gameActive}
                >
                  {number}
                </button>
              );
            })}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={initGame}
              className={`${buttonStyle} bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white`}
            >
              New Game
            </button>
            <button
              onClick={clearLastNumber}
              className={`${buttonStyle} bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white`}
              disabled={gameState.currentHeight === 0}
            >
              Clear Last
            </button>
            <button
              onClick={showHint}
              className={`${buttonStyle} bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white`}
            >
              Hint
            </button>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Difficulty:</h3>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
                <button
                  key={diff}
                  onClick={() => {
                    setDifficulty(diff);
                    initGame();
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    gameState.difficulty === diff
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)} ({difficultySettings[diff].targetHeight})
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">How to Play</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Read the rule at the top - it tells you which numbers to select</li>
          <li>Click numbers from the grid that follow the rule</li>
          <li>Build your tower by reaching the target height</li>
          <li>Wrong selections cost you 3 seconds of time</li>
          <li>Complete levels to increase difficulty and score multipliers</li>
          <li>Easy: 3 blocks, Medium: 5 blocks, Hard: 8 blocks</li>
        </ul>
      </div>
    </div>
  );
}