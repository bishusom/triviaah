'use client';
import { event } from '@/lib/gtag';
import confetti from 'canvas-confetti';
import { useSound } from '@/app/context/SoundContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import commonStyles from '@styles/NumberPuzzles/NumberPuzzles.common.module.css';
import styles from '@styles/NumberPuzzles/PrimeHunter.module.css';

export default function PrimeHunterPuzzle() {
  const [gameState, setGameState] = useState({
    level: 1,
    score: 0,
    timeLeft: 60,
    primesInGrid: 0,
    primesCollected: 0,
    currentNumbers: [] as number[],
    gameActive: false
  });

  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const timerInterval = useRef<NodeJS.Timeout| null>(null);
  const audioElements = useRef<Record<string, HTMLAudioElement | null>>({
    select: null,
    correct: null,
    win: null,
    error: null
  });

  const handleFirstInteraction = () => {
    document.removeEventListener('click', handleFirstInteraction);
    document.removeEventListener('keydown', handleFirstInteraction);
    
    Object.values(audioElements.current).forEach(audio => {
      if (audio) {
        audio.muted = false;
      }
    });
  };

  useEffect(() => {
    setGameState(prev => ({ ...prev }));
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'prime_hunter_started', category: 'prime_hunter',label: 'prime_hunter'});
        clearInterval(checkGtag);
      }
    }, 100);
    initGame();

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, []);

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

  const showConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    });
  };

  const initGame = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    setFeedback({ message: '', type: '' });
    setGameState({
      level: 1,
      score: 0,
      timeLeft: 60,
      primesInGrid: 0,
      primesCollected: 0,
      currentNumbers: [],
      gameActive: false
    });
    generateGrid();
    startTimer();
  };

  const generateGrid = () => {
    const gridSize = getGridSize();
    const numberRange = getNumberRange();
    const numbers: number[] = [];
    const primesSet = new Set<number>();

    const totalCells = gridSize * gridSize;
    let attempts = 0;
    const MAX_ATTEMPTS = 100;

    while (numbers.length < totalCells && attempts < MAX_ATTEMPTS) {
      const num = Math.floor(Math.random() * numberRange) + 1;
      numbers.push(num);
      if (isPrime(num)) primesSet.add(num);
      attempts++;
    }

    if (primesSet.size < 1) {
      const backupPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
      const randomPrime = backupPrimes[Math.floor(Math.random() * backupPrimes.length)];
      const randomIndex = Math.floor(Math.random() * numbers.length);
      numbers[randomIndex] = randomPrime;
      primesSet.add(randomPrime);
    }

    setGameState(prev => ({
      ...prev,
      currentNumbers: numbers.slice(0, totalCells),
      primesInGrid: primesSet.size,
      primesCollected: 0,
      gameActive: true
    }));
  };

  const getGridSize = () => {
    if (gameState.level <= 3) return 4;
    if (gameState.level <= 6) return 5;
    return 6;
  };

  const getNumberRange = () => {
    if (gameState.level <= 2) return 30;
    if (gameState.level <= 4) return 50;
    if (gameState.level <= 6) return 75;
    return 100;
  };

  const isPrime = (num: number) => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  };

  const handleCellClick = (num: number, index: number) => {
    if (!gameState.gameActive) return;

    const prime = isPrime(num);
    playSound('select');

    if (prime) {
      const primeCount = gameState.currentNumbers
        .filter(n => Math.abs(n) === num && n > 0).length;

      setGameState(prev => ({
        ...prev,
        primesCollected: prev.primesCollected + primeCount,
        score: prev.score + (prev.level * 5 * primeCount),
        currentNumbers: prev.currentNumbers.map(n => 
          Math.abs(n) === num ? -Math.abs(n) : n
        )
      }));

      playSound('found');

      if (gameState.primesCollected + primeCount >= gameState.primesInGrid) {
        levelUp();
      }
    } else {
      setGameState(prev => ({
        ...prev,
        timeLeft: Math.max(5, prev.timeLeft - 5),
      }));
      setGameState(prev => ({
        ...prev,
        currentNumbers: prev.currentNumbers.map((n, i) => 
          i === index ? -n-1 : n
        )
      }));
      playSound('error');
    }
  };

  const levelUp = () => {
    setGameState(prev => ({ ...prev, gameActive: false }));
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    setFeedback({ message: '', type: '' });

    const bonus = gameState.level * 20;
    setTimeout(() => {
      setFeedback({ 
        message: `Level Complete! +${bonus} bonus points!`, 
        type: 'success' 
      });
    }, 50);

    setGameState(prev => ({
      ...prev,
      score: prev.score + bonus,
      level: prev.level + 1,
    }));

    playSound('win');
    showConfetti();

    setTimeout(() => {
      setFeedback({ message: '', type: '' });
      setGameState(prev => ({
        ...prev,
        timeLeft: 60,
        primesCollected: 0,
        gameActive: true,
      }));
      generateGrid();
      startTimer();
    }, 2000);
  };

  const startTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    timerInterval.current = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = prev.timeLeft - 1;
        if (newTimeLeft <= 0) {
          timerInterval.current = null;
          gameOver();
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 1000);
  };

  const gameOver = () => {
    setGameState(prev => ({ ...prev, gameActive: false }));
    setFeedback({ message: '', type: '' });
    setFeedback({ 
      message: `Game Over! Final Score: ${gameState.score}`, 
      type: 'error' 
    });
    playSound('error');
  };

  const showHint = () => {
    if (!gameState.gameActive) return;
    playSound('select');
    setFeedback({ message: "Look for numbers divisible only by 1 and themselves", type: 'info' });
  };

  const gridSize = getGridSize();

  return (
      <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Prime Hunter
        </h1>
        <p className="text-gray-600 mb-6">
          Find all prime numbers in the grid before time runs out
        </p>

        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-semibold">
            Level: {gameState.level}
          </div>
          <div className={`text-lg font-semibold ${gameState.timeLeft <= 10 ? commonStyles.timeCritical : ''}`}>
            Time: {gameState.timeLeft}s
          </div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold">
              Score: {gameState.score}
            </div>
          </div>
        </div>
        
        
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className={styles.progressFill} 
              style={{ 
                width: `${gameState.primesInGrid > 0 ? (gameState.primesCollected / gameState.primesInGrid) * 100 : 0}%` 
              }}
            ></div>
          </div>
          
          <div className="flex justify-between mb-2">
            <div>Primes Found: {gameState.primesCollected}</div>
            <div>Total Primes: {gameState.primesInGrid}</div>
          </div>

          {feedback.message && (
            <div className={`${styles.feedback} ${styles[`feedback${feedback.type}`]}`}>
              {feedback.message}
            </div>
          )}

          <div 
            className={styles.hunterGrid} 
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, minmax(60px, 80px))`,
              justifyContent: 'center'
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
                  className={`${styles.hunterCell} ${
                    isCorrectPrime ? styles.correctPrime : 
                    isWrongSelection ? styles.wrongSelection : ''
                  } ${
                    !gameState.gameActive && isPrime(absoluteNum) ? styles.revealedPrime : ''
                  }`}
                  disabled={isDisabled}
                  aria-label={`Number ${absoluteNum}`}
                >
                  {absoluteNum}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <button 
              onClick={showHint}
              className={`${commonStyles.btn} ${commonStyles.secondary}`}
            >
              Hint
            </button>
            <button 
              onClick={initGame}
              className={`${commonStyles.btn} ${commonStyles.primary}`}
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