'use client';
import { event } from '@/lib/gtag';
import confetti from 'canvas-confetti';
import { useSound } from '@/context/SoundContext';
import { useState, useEffect, useCallback, useRef } from 'react';

export default function PrimeHunterPuzzle() {
  const [gameState, setGameState] = useState({
    level: 1,
    score: 0,
    timeLeft: 120,
    primesInGrid: 0,
    primesCollected: 0,
    currentNumbers: [] as number[],
    gameActive: false,
  });

  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const { isMuted } = useSound();
  const levelUpInProgress = useRef(false);

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

  const showConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
    });
  }, []);

  const getGridSize = useCallback((level: number) => {
    if (level <= 3) return 4;
    if (level <= 6) return 5;
    return 6;
  }, []);

  const getNumberRange = useCallback((level: number) => {
    if (level <= 2) return 30;
    if (level <= 4) return 50;
    if (level <= 6) return 75;
    return 100;
  }, []);

  const isPrime = useCallback((num: number) => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  }, []);

  const generateGrid = useCallback((level: number) => {
    const gridSize = getGridSize(level);
    const numberRange = getNumberRange(level);
    const numbers: number[] = [];
    let primeCount = 0;

    const totalCells = gridSize * gridSize;
    let attempts = 0;
    const MAX_ATTEMPTS = 100;

    while (numbers.length < totalCells && attempts < MAX_ATTEMPTS) {
      const num = Math.floor(Math.random() * numberRange) + 1;
      numbers.push(num);
      if (isPrime(num)) primeCount++;
      attempts++;
    }

    // Ensure we have at least 1 prime
    if (primeCount < 1) {
      const backupPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
      const randomPrime = backupPrimes[Math.floor(Math.random() * backupPrimes.length)];
      const randomIndex = Math.floor(Math.random() * numbers.length);
      if (!isPrime(numbers[randomIndex])) {
        numbers[randomIndex] = randomPrime;
        primeCount++;
      }
    }

    console.log(`Generated grid for level ${level}: ${primeCount} primes out of ${totalCells} cells`);

    setGameState(prev => ({
      ...prev,
      currentNumbers: numbers.slice(0, totalCells),
      primesInGrid: primeCount,
      primesCollected: 0,
      gameActive: true,
    }));

    return primeCount;
  }, [getGridSize, getNumberRange, isPrime]);

  const startTimer = useCallback(() => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }

    timerInterval.current = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = prev.timeLeft - 1;
        if (newTimeLeft <= 0) {
          if (timerInterval.current) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
          }
          setFeedback({ message: `Game Over! Final Score: ${prev.score}`, type: 'error' });
          playSound('error');
          return { ...prev, timeLeft: 0, gameActive: false };
        }
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 1000);
  }, [playSound]);

  const initGame = useCallback(() => {
    // Clear existing timer
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }

    levelUpInProgress.current = false;

    // Reset game state
    setFeedback({ message: '', type: '' });
    setGameState({
      level: 1,
      score: 0,
      timeLeft: 120,
      primesInGrid: 0,
      primesCollected: 0,
      currentNumbers: [],
      gameActive: false,
    });

    // Generate grid and start timer
    setTimeout(() => {
      generateGrid(1);
      startTimer();
    }, 100);
  }, [generateGrid, startTimer]);

  const levelUp = useCallback(() => {
    if (levelUpInProgress.current) return;
    levelUpInProgress.current = true;

    console.log(`Leveling up from level ${gameState.level} to ${gameState.level + 1}`);

    // Stop game and timer
    setGameState(prev => ({ ...prev, gameActive: false }));
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }

    const bonus = gameState.level * 20;
    const newLevel = gameState.level + 1;

    setFeedback({ message: `Level Complete! +${bonus} bonus points!`, type: 'success' });

    setGameState(prev => ({
      ...prev,
      score: prev.score + bonus,
      level: newLevel,
      timeLeft: 120,
      primesCollected: 0,
      gameActive: false,
    }));

    playSound('win');
    showConfetti();

    // Start new level after delay
    setTimeout(() => {
      console.log(`Starting level ${newLevel}`);
      setFeedback({ message: '', type: '' });
      generateGrid(newLevel);
      startTimer();
      levelUpInProgress.current = false;
    }, 2000);
  }, [gameState.level, generateGrid, startTimer, playSound, showConfetti]);

  const handleCellClick = useCallback(
    (num: number, index: number) => {
      if (!gameState.gameActive || levelUpInProgress.current) return;

      const prime = isPrime(num);
      playSound('select');

      if (prime) {
        setGameState(prev => {
          const newPrimesCollected = prev.primesCollected + 1;
          const newScore = prev.score + prev.level * 5;
          
          console.log(`Prime found! ${newPrimesCollected}/${prev.primesInGrid} primes collected`);
          
          return {
            ...prev,
            primesCollected: newPrimesCollected,
            score: newScore,
            currentNumbers: prev.currentNumbers.map((n, i) => 
              i === index ? -Math.abs(n) : n
            ),
          };
        });

        playSound('found');
      } else {
        setGameState(prev => ({
          ...prev,
          timeLeft: Math.max(5, prev.timeLeft - 5),
          currentNumbers: prev.currentNumbers.map((n, i) => 
            i === index ? -n - 1 : n
          ),
        }));
        playSound('error');
      }
    },
    [gameState.gameActive, isPrime, playSound]
  );

  // Check for level completion
  useEffect(() => {
    if (gameState.gameActive && 
        !levelUpInProgress.current &&
        gameState.primesInGrid > 0 &&
        gameState.primesCollected >= gameState.primesInGrid) {
      console.log(`Level completion detected: ${gameState.primesCollected}/${gameState.primesInGrid} primes`);
      levelUp();
    }
  }, [gameState.primesCollected, gameState.primesInGrid, gameState.gameActive, levelUp]);

  const showHint = useCallback(() => {
    if (!gameState.gameActive) return;
    playSound('select');
    setFeedback({ message: 'Look for numbers divisible only by 1 and themselves', type: 'info' });
  }, [gameState.gameActive, playSound]);

  useEffect(() => {
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({ action: 'prime_hunter_started', category: 'prime_hunter', label: 'prime_hunter' });
        clearInterval(checkGtag);
      }
    }, 100);
    
    // Initialize game after a short delay to ensure everything is loaded
    setTimeout(() => {
      initGame();
    }, 500);

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [initGame]);

  const gridSize = getGridSize(gameState.level);

  const getFeedbackClasses = (type: string) => {
    switch (type) {
      case 'success': return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30';
      case 'error': return 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30';
      case 'info': return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30';
      default: return 'bg-gray-800 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            Prime Hunter
          </h1>
          <p className="text-gray-400 text-lg">Find all prime numbers in the grid before time runs out</p>
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
              {gameState.timeLeft}s
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400 font-medium mb-2">Score</div>
            <div className="text-2xl font-bold text-green-400">{gameState.score}</div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50 shadow-2xl">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all"
                style={{
                  width: `${gameState.primesInGrid > 0 ? (gameState.primesCollected / gameState.primesInGrid) * 100 : 0}%`,
                }}
              ></div>
            </div>

            <div className="flex justify-between text-gray-300">
              <div>Primes Found: <span className="font-bold text-green-400">{gameState.primesCollected}</span></div>
              <div>Total Primes: <span className="font-bold text-blue-400">{gameState.primesInGrid}</span></div>
            </div>
          </div>

          {/* Feedback */}
          {feedback.message && (
            <div className={`p-4 rounded-2xl mb-6 text-center font-semibold backdrop-blur-sm ${getFeedbackClasses(feedback.type)}`}>
              {feedback.message}
            </div>
          )}

          {/* Number Grid */}
          <div
            className="grid gap-3 justify-center mb-6"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(60px, 80px))`,
            }}
          >
            {gameState.currentNumbers.map((num, index) => {
              const absoluteNum = Math.abs(num);
              const isCorrectPrime = num < 0 && isPrime(absoluteNum);
              const isWrongSelection = num < -1;
              const isDisabled = isCorrectPrime || isWrongSelection || !gameState.gameActive;

              return (
                <button
                  key={index}
                  onClick={() => !isDisabled && handleCellClick(absoluteNum, index)}
                  className={`h-16 rounded-xl font-bold text-lg transition-all duration-200 transform ${
                    isCorrectPrime ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400 border-2 border-green-500/50' :
                    isWrongSelection ? 'bg-gradient-to-br from-red-500/20 to-pink-500/20 text-red-400 border-2 border-red-500/50' :
                    !gameState.gameActive && isPrime(absoluteNum) ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400 border-2 border-blue-500/50' :
                    'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 border-2 border-gray-600 hover:border-blue-500/50 hover:scale-105'
                  } ${isDisabled ? 'cursor-not-allowed scale-95' : 'shadow-lg'}`}
                  disabled={isDisabled}
                  aria-label={`Number ${absoluteNum}`}
                >
                  {absoluteNum}
                </button>
              );
            })}
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={showHint}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-2xl hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
            >
              💡 Hint
            </button>
            <button
              onClick={initGame}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
            >
              🎮 New Game
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            How to Play
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-400">
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Click on prime numbers (divisible only by 1 and themselves)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Find all primes before time runs out to level up</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Clicking non-primes reduces your time by 5 seconds</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Higher levels have larger grids and number ranges</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}