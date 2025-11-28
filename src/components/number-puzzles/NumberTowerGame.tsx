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
        feedbackClass: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
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
        feedbackClass: 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30'
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
      feedbackClass: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/30 font-bold text-xl',
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
        feedbackClass: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30'
      }));
      
      setTimeout(() => {
        setGameState(prev => ({ ...prev, feedbackText: '', feedbackClass: '' }));
      }, 2000);
    } else {
      setGameState(prev => ({
        ...prev,
        feedbackText: 'No valid moves left!',
        feedbackClass: 'bg-gray-800 text-gray-400'
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
              feedbackClass: 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            Number Tower
          </h1>
          <p className="text-gray-400 text-lg">Follow the rule to build your tower</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl">
          <div className="text-center">
            <div className="text-sm text-gray-400 font-medium mb-2">Level</div>
            <div className="text-2xl font-bold text-purple-400">{gameState.level}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400 font-medium mb-2">Time</div>
            <div className={`text-2xl font-bold ${
              gameState.timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-cyan-400'
            }`}>
              {formatTime(gameState.timeLeft)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400 font-medium mb-2">Score</div>
            <div className="text-2xl font-bold text-green-400">{gameState.score}</div>
          </div>
        </div>

        {/* Difficulty & Progress */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
              gameState.difficulty === 'easy' ? 'bg-green-500' :
              gameState.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              {gameState.difficulty.toUpperCase()}
            </span>
            <span className="text-gray-300">
              Tower: {gameState.currentHeight} / {gameState.targetHeight}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="flex-1 max-w-md">
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Objective */}
        {gameState.currentRule && (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30 rounded-2xl p-6 mb-6 backdrop-blur-sm">
            <p className="text-lg font-semibold text-blue-300 text-center">{gameState.currentRule.text}</p>
          </div>
        )}

        {gameState.feedbackText && (
          <div className={`p-4 rounded-2xl mb-6 text-center font-semibold backdrop-blur-sm ${gameState.feedbackClass}`}>
            {gameState.feedbackText}
          </div>
        )}

        {!gameState.gameActive && gameState.timeLeft === 0 ? (
          <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-gray-700/50">
            <h2 className="text-3xl font-bold text-red-400 mb-4">Game Over!</h2>
            <p className="text-xl text-gray-300 mb-2">You reached Level {gameState.level}</p>
            <p className="text-lg text-gray-400 mb-6">Final Score: {gameState.score}</p>
            <button 
              onClick={initGame}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Tower Stack Display */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-gray-300">Your Tower:</h3>
              <div className="min-h-[80px] bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
                <div className="flex flex-wrap gap-3 justify-center">
                  {gameState.towerStack.length === 0 ? (
                    <span className="text-gray-500 italic">No blocks yet...</span>
                  ) : (
                    gameState.towerStack.map((num, idx) => (
                      <div 
                        key={idx}
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        {num}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Number Grid */}
            <div 
              className="grid gap-3 mb-8 justify-center"
              style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(60px, 80px))` }}
            >
              {gameState.currentNumbers.map((number, index) => {
                const isSelected = selectedCells.has(index);
                
                return (
                  <button
                    key={index}
                    onClick={() => handleCellClick(number, index)}
                    className={`h-16 rounded-xl font-bold text-lg transition-all duration-200 transform ${
                      isSelected ? 'bg-gray-700 text-gray-500 cursor-not-allowed scale-95' :
                      'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 shadow-lg hover:scale-105'
                    } border-2 ${
                      isSelected ? 'border-gray-600' : 'border-gray-600 hover:border-blue-500/50'
                    }`}
                    disabled={isSelected || !gameState.gameActive}
                  >
                    {number}
                  </button>
                );
              })}
            </div>

            {/* Control Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <button
                onClick={initGame}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
              >
                🎮 New Game
              </button>
              <button
                onClick={clearLastNumber}
                className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
                disabled={gameState.currentHeight === 0}
              >
                ↩️ Clear Last
              </button>
              <button
                onClick={showHint}
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-2xl hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
              >
                💡 Hint
              </button>
            </div>

            {/* Difficulty Selection */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-8">
              <h3 className="text-lg font-semibold mb-4 text-center text-gray-300">Difficulty:</h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
                  <button
                    key={diff}
                    onClick={() => {
                      setDifficulty(diff);
                      initGame();
                    }}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      gameState.difficulty === diff
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)} ({difficultySettings[diff].targetHeight})
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Instructions */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            How to Play
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-400">
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Read the rule at the top - it tells you which numbers to select</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Click numbers from the grid that follow the rule</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Build your tower by reaching the target height</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Wrong selections cost you 3 seconds of time</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Complete levels to increase difficulty and score multipliers</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Easy: 3 blocks, Medium: 5 blocks, Hard: 8 blocks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}