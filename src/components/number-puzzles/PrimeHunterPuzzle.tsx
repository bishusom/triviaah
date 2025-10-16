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

  return (
    <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Prime Hunter - Find the Primes in the grid</h1>
      <p className="text-gray-600 mb-6">Find all prime numbers in the grid before time runs out</p>

      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold">Level: {gameState.level}</div>
        <div className={`text-lg font-semibold ${gameState.timeLeft <= 10 ? 'text-red-600 animate-pulse' : ''}`}>
          Time: {gameState.timeLeft}s
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold">Score: {gameState.score}</div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-6 mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all"
            style={{
              width: `${gameState.primesInGrid > 0 ? (gameState.primesCollected / gameState.primesInGrid) * 100 : 0}%`,
            }}
          ></div>
        </div>

        <div className="flex justify-between mb-2">
          <div>Primes Found: {gameState.primesCollected}</div>
          <div>Total Primes: {gameState.primesInGrid}</div>
        </div>

        {feedback.message && (
          <div
            className={`p-4 rounded-lg mb-4 font-mono text-lg ${
              feedback.type === 'error' ? 'bg-red-100 text-red-700' :
              feedback.type === 'success' ? 'bg-green-100 text-green-700' :
              'bg-blue-50 text-blue-700'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div
          className="grid gap-2 justify-center"
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
                className={`p-3 text-lg font-bold rounded-lg transition-all ${
                  isCorrectPrime ? 'bg-green-100 text-green-700' :
                  isWrongSelection ? 'bg-red-100 text-red-700' :
                  !gameState.gameActive && isPrime(absoluteNum) ? 'bg-blue-100 text-blue-700' :
                  'bg-blue-500 text-white hover:bg-blue-600'
                } ${isDisabled ? 'cursor-not-allowed' : ''}`}
                disabled={isDisabled}
                aria-label={`Number ${absoluteNum}`}
              >
                {absoluteNum}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={showHint}
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all font-semibold"
          >
            Hint
          </button>
          <button
            onClick={initGame}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold"
          >
            New Game
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">How to Play</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Click on prime numbers (divisible only by 1 and themselves)</li>
          <li>Find all primes before time runs out to level up</li>
          <li>Clicking non-primes reduces your time by 5 seconds</li>
          <li>Higher levels have larger grids and number ranges</li>
        </ul>
      </div>
    </div>
  );
}