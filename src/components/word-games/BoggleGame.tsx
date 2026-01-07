'use client';
import { event } from '@/lib/gtag';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useSound } from '@/context/SoundContext';

interface GridCell {
  letter: string;
  found: boolean;
  element?: HTMLElement | null;
}

interface GameConfig {
  gridSize: {
    easy: number;
    medium: number;
    hard: number;
    expert: number;
  };
  minWordLength: {
    easy: number;
    medium: number;
    hard: number;
    expert: number;
  };
  maxWordLength: {
    easy: number;
    medium: number;
    hard: number;
    expert: number;
  };
  timeLimit: {
    easy: number;
    medium: number;
    hard: number;
    expert: number;
  };
  scorePerLetter: {
    easy: number;
    medium: number;
    hard: number;
    expert: number;
  };
  winThreshold: {
    easy: number;
    medium: number;
    hard: number;
    expert: number;
  };
  vowelPercentage: {
    easy: number;
    medium: number;
    hard: number;
    expert: number;
  };
}

interface LevelConfig {
  level: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  minWordLength: number;
  winThreshold: number;
  timeLimit: number;
  scoreMultiplier: number;
  description: string;
}

export default function BoggleGame() {
  // Refs
  const gridElement = useRef<HTMLDivElement>(null);
  const timeElement = useRef<HTMLSpanElement>(null);
  const scoreElement = useRef<HTMLSpanElement>(null);
  const targetScoreElement = useRef<HTMLSpanElement>(null);
  const levelElement = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Game state
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(180);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isSelecting, setIsSelecting] = useState(false);
  const [usedLetters, setUsedLetters] = useState<Set<number>>(new Set());
  const [wordCache, setWordCache] = useState<Map<string, boolean>>(new Map());
  const [levels, setLevels] = useState<LevelConfig[]>([]);
  const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);

  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const DICTIONARY_API_KEY = process.env.NEXT_PUBLIC_MW_DICTIONARY_KEY;

  // Game configuration - UPDATED with expert level
  const config: GameConfig = useMemo(() => ({
    gridSize: {
      easy: 4,
      medium: 5,
      hard: 5,
      expert: 6
    },
    minWordLength: {
      easy: 3,
      medium: 3,
      hard: 3,
      expert: 4
    },
    maxWordLength: {
      easy: 5,
      medium: 6,
      hard: 7,
      expert: 8
    },
    timeLimit: {
      easy: 180,
      medium: 180,
      hard: 180,
      expert: 210
    },
    scorePerLetter: {
      easy: 10,
      medium: 12,
      hard: 15,
      expert: 18
    },
    winThreshold: {
      easy: 100,
      medium: 150,
      hard: 200,
      expert: 250
    },
    vowelPercentage: {
      easy: 0.4,
      medium: 0.35,
      hard: 0.3,
      expert: 0.4
    }
  }), []);

  // Common words for fallback - EXPANDED
  const commonWords = useMemo(() => [
    'CAT', 'DOG', 'HAT', 'RUN', 'SUN', 'PEN', 'RED', 'BLUE', 'TREE', 'BIRD',
    'FISH', 'STAR', 'MOON', 'PLAY', 'BOOK', 'FOOD', 'GOOD', 'LOVE', 'HOME', 'TIME',
    'BALL', 'GAME', 'CARS', 'SHIP', 'WIND', 'RAIN', 'SNOW', 'FIRE', 'WAVE', 'HILL',
    'HOUSE', 'TABLE', 'CHAIR', 'WINDOW', 'DOOR', 'FLOOR', 'BRAIN', 'CHAINS', 'THREAD',
    'STREAM', 'POWER', 'LIGHT', 'SHADOW', 'MUSIC', 'RHYTHM', 'PUZZLE', 'CHALLENGE',
    'COMPLEX', 'DYNAMIC', 'SYSTEM', 'PATTERN', 'STRUCTURE', 'SOLUTION', 'QUESTION',
    'ABILITY', 'CHANCE', 'DANCE', 'EARTH', 'FOREST', 'GARDEN', 'HEART', 'ISLAND',
    'JUNGLE', 'KNIGHT', 'LANGUAGE', 'MAGIC', 'NATURE', 'OCEAN', 'PICTURE', 'QUALITY',
    'RIVER', 'SPIRIT', 'TRAVEL', 'UNIVERSE', 'VICTORY', 'WONDER', 'YOUTH', 'ZENITH',
    'ADVENTURE', 'BEAUTIFUL', 'CELEBRATE', 'DISCOVER', 'ELEPHANT', 'FANTASY', 'GRACEFUL',
    'HARMONY', 'IMAGINE', 'JOURNEY', 'KINDNESS', 'LIBERTY', 'MYSTERY', 'NOVEMBER',
    'OBSERVER', 'PARADISE', 'QUIETLY', 'RAINBOW', 'SUNSHINE', 'TREASURE', 'UMBRELLA',
    'VIBRANT', 'WHISPER', 'XENON', 'YELLOW', 'ZEALOUS'
  ].map(word => word.toUpperCase()), []);

  const { isMuted } = useSound();
  const isTouchDevice = useRef(false);

  // Generate levels function - Simplified progression
  const generateLevels = useCallback(() => {
    const generatedLevels: LevelConfig[] = [];
    
    // Level 1-4: Easy levels
    for (let i = 1; i <= 4; i++) {
      generatedLevels.push({
        level: i,
        difficulty: 'easy',
        minWordLength: 3,
        winThreshold: 80 + (i * 20),
        timeLimit: 180,
        scoreMultiplier: 1.0,
        description: `Beginner Level ${i} - Find 3-letter words`
      });
    }
    
    // Level 5-8: Medium levels
    for (let i = 5; i <= 8; i++) {
      generatedLevels.push({
        level: i,
        difficulty: 'medium',
        minWordLength: 4,
        winThreshold: 200 + ((i - 4) * 50),
        timeLimit: 180,
        scoreMultiplier: 1.2 + ((i - 4) * 0.1),
        description: `Intermediate Level ${i-4} - Find 4-5 letter words`
      });
    }
    
    // Level 9-12: Hard levels
    for (let i = 9; i <= 12; i++) {
      generatedLevels.push({
        level: i,
        difficulty: 'hard',
        minWordLength: 5,
        winThreshold: 420 + ((i - 8) * 80),
        timeLimit: 180,
        scoreMultiplier: 1.6 + ((i - 8) * 0.1),
        description: `Advanced Level ${i-8} - Find 5-6 letter words`
      });
    }
    
    // Level 13-16: Expert levels
    for (let i = 13; i <= 16; i++) {
      generatedLevels.push({
        level: i,
        difficulty: 'expert',
        minWordLength: 6,
        winThreshold: 780 + ((i - 12) * 120),
        timeLimit: 210,
        scoreMultiplier: 2.0 + ((i - 12) * 0.2),
        description: `Expert Level ${i-12} - Find 6-7 letter words`
      });
    }
    
    // Level 17-20: Master levels
    for (let i = 17; i <= 20; i++) {
      generatedLevels.push({
        level: i,
        difficulty: 'expert',
        minWordLength: 7,
        winThreshold: 1320 + ((i - 16) * 180),
        timeLimit: 200,
        scoreMultiplier: 2.8 + ((i - 16) * 0.25),
        description: `Master Level ${i-16} - Find 7-8 letter words`
      });
    }
    
    return generatedLevels;
  }, []);

  // Get current level configuration
  const getCurrentLevelConfig = useCallback((): LevelConfig | null => {
    if (!levels.length) return null;
    return levels.find(l => l.level === currentLevel) || levels[0];
  }, [currentLevel, levels]);

  // Calculate current target score
  const calculateTargetScore = useCallback(() => {
    const levelConfig = getCurrentLevelConfig();
    return levelConfig?.winThreshold || 100;
  }, [getCurrentLevelConfig]);

  // Calculate min word length based on level
  const calculateMinWordLength = useCallback(() => {
    const levelConfig = getCurrentLevelConfig();
    return levelConfig?.minWordLength || 3;
  }, [getCurrentLevelConfig]);

  // Get current difficulty
  const getCurrentDifficulty = useCallback(() => {
    const levelConfig = getCurrentLevelConfig();
    return levelConfig?.difficulty || 'easy';
  }, [getCurrentLevelConfig]);

  // Get current grid size (dynamic based on level)
  const getCurrentGridSize = useCallback(() => {
    const difficulty = getCurrentDifficulty();
    return config.gridSize[difficulty];
  }, [getCurrentDifficulty, config]);

  // Play sound
  const playSound = useCallback((type: string) => {
    if (isMuted) return;
    const sounds: Record<string, string> = {
      select: '/sounds/click.mp3',
      correct: '/sounds/correct.mp3',
      error: '/sounds/incorrect.mp3',
      win: '/sounds/win.mp3',
      shuffle: '/sounds/shuffle.mp3'
    };
    
    try {
      const audio = new Audio(sounds[type]);
      audio.play().catch(err => console.error(`Error playing ${type} sound:`, err));
    } catch (error) {
      console.error('Sound error:', error);
    }
  }, [isMuted]);

  // Confetti effect
  const fireConfetti = useCallback((options = {}) => {
    const defaults = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    };

    confetti({
      ...defaults,
      ...options
    });

    if (Math.random() > 0.5) {
      setTimeout(() => {
        confetti({
          ...defaults,
          ...options,
          angle: Math.random() * 180 - 90,
          origin: { x: Math.random(), y: 0.6 }
        });
      }, 300);
    }
  }, []);

  // Load game state from localStorage
  const loadGameState = useCallback(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('boggleGameState');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          if (typeof parsed.currentLevel === 'number' && parsed.currentLevel >= 1) {
            setCurrentLevel(Math.min(parsed.currentLevel, levels.length || 1));
          }
        } catch (e) {
          console.error('Invalid saved game state', e);
        }
      }
    }
  }, [levels.length]);

  // Save game state to localStorage
  const saveGameState = useCallback(() => {
    const gameState = {
      currentLevel
    };
    localStorage.setItem('boggleGameState', JSON.stringify(gameState));
  }, [currentLevel]);

  // Generate game grid
  const generateGrid = useCallback(() => {
    const difficulty = getCurrentDifficulty();
    const size = config.gridSize[difficulty];
    const vowels = 'AEIOU';
    const vowelPercent = config.vowelPercentage[difficulty];
    const minVowels = Math.ceil(size * size * vowelPercent);
    let vowelCount = 0;

    // Create letter pool
    const letterPool: string[] = [];
    
    // Add letters from common words
    commonWords.forEach(word => {
      word.split('').forEach(letter => letterPool.push(letter));
    });

    // Add extra vowels
    const extraVowels = difficulty === 'expert' ? 50 : 30;
    for (let i = 0; i < extraVowels; i++) {
      letterPool.push(vowels[Math.floor(Math.random() * vowels.length)]);
    }

    // Add common consonants
    const commonConsonants = 'BCDFGHJKLMNPQRSTVWXYZ';
    const extraConsonants = difficulty === 'expert' ? 50 : 40;
    for (let i = 0; i < extraConsonants; i++) {
      letterPool.push(commonConsonants[Math.floor(Math.random() * commonConsonants.length)]);
    }

    // Generate initial grid
    const newGrid: GridCell[] = [];
    for (let i = 0; i < size * size; i++) {
      const randomIndex = Math.floor(Math.random() * letterPool.length);
      const letter = letterPool[randomIndex];
      newGrid.push({ 
        letter,
        found: false 
      });
      
      // Count vowels
      if (vowels.includes(letter)) {
        vowelCount++;
      }
    }

    // Ensure minimum vowels are met by replacing consonants
    let attempts = 0;
    const maxAttempts = size * size * 2;
    while (vowelCount < minVowels && attempts < maxAttempts) {
      const consonantIndices = newGrid
        .map((cell, idx) => (!vowels.includes(cell.letter) ? idx : -1))
        .filter(idx => idx !== -1);
      
      if (consonantIndices.length > 0) {
        const randomIndex = consonantIndices[Math.floor(Math.random() * consonantIndices.length)];
        newGrid[randomIndex].letter = vowels[Math.floor(Math.random() * vowels.length)];
        vowelCount++;
      }
      attempts++;
    }

    // For expert levels, add more common letter combinations
    if (difficulty === 'expert') {
      const suffixes = ['ING', 'ED', 'ER', 'EST', 'LY', 'MENT', 'NESS', 'TION'];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      
      const availablePositions = newGrid
        .map((cell, idx) => idx)
        .sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < Math.min(suffix.length, 3); i++) {
        if (availablePositions.length > i) {
          newGrid[availablePositions[i]].letter = suffix[i];
        }
      }
    }

    setGrid(newGrid);
  }, [getCurrentDifficulty, config, commonWords]);

  // Show feedback
  const showFeedback = useCallback(({ message, type }: { message: string; type: 'success' | 'error' | 'info' }) => {
    setFeedback({ message, type });
  }, []);

  // Update timer display
  const updateTimer = useCallback(() => {
    if (!timeElement.current) return;
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timeElement.current.textContent = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timer]);

  // Update score display
  const updateScore = useCallback(() => {
    if (!scoreElement.current) return;
    scoreElement.current.textContent = `Score: ${score}`;
  }, [score]);

  // Update target score display
  const updateTargetScore = useCallback(() => {
    if (!targetScoreElement.current || !progressBarRef.current) return;
    const currentTarget = calculateTargetScore();
    const progressPercent = Math.min(100, (score / currentTarget) * 100);
    
    targetScoreElement.current.textContent = `Target: ${score}/${currentTarget}`;
    
    const progressBar = progressBarRef.current;
    progressBar.style.width = `${progressPercent}%`;
    
    if (progressPercent >= 100) {
      progressBar.style.backgroundColor = '#10b981';
      targetScoreElement.current.textContent = `🎯 Target: ${score}/${currentTarget} 🎯`;
    } else if (progressPercent >= 75) {
      progressBar.style.backgroundColor = '#f59e0b';
    } else if (progressPercent >= 50) {
      progressBar.style.backgroundColor = '#3b82f6';
    } else {
      progressBar.style.backgroundColor = '#ef4444';
    }
    
    progressBar.offsetHeight;
  }, [score, calculateTargetScore]);

  // Update level info
  const updateLevelInfo = useCallback(() => {
    if (!levelElement.current) return;
    
    const levelConfig = getCurrentLevelConfig();
    if (!levelConfig) return;
    
    levelElement.current.textContent = `Level ${levelConfig.level}: ${levelConfig.description}`;
    updateTargetScore();
  }, [getCurrentLevelConfig, updateTargetScore]);

  // Start timer
  const startTimer = useCallback(() => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }

    timerInterval.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 0) {
          clearInterval(timerInterval.current!);
          showFeedback({ 
            message: 'Time\'s up! Better luck next time!', 
            type: 'error' 
          });
          setTimeout(() => initGameRef.current(), 3000);
          return 0;
        }
        return prev - 1;
      });
      updateTimer();
    }, 1000);
  }, [updateTimer, showFeedback]);

  // Validate word using Merriam-Webster API
  const validateWord = useCallback(async (word: string) => {
    const wordLower = word.toLowerCase();
    
    // Check cache first
    if (wordCache.has(wordLower)) {
      return wordCache.get(wordLower)!;
    }

    try {
      const response = await fetch(
        `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${wordLower}?key=${DICTIONARY_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Response:', responseText);
        throw new Error('Invalid JSON from API');
      }

      if (Array.isArray(data) && data.length > 0) {
        for (const entry of data) {
          if (typeof entry === 'string') {
            continue;
          }
          
          if (typeof entry === 'object' && entry !== null) {
            const wordMatches = 
              (entry.meta?.id && entry.meta.id.split(':')[0].toUpperCase() === word.toUpperCase()) ||
              (entry.hwi?.hw && entry.hwi.hw.replace(/\*/g, '').toUpperCase() === word.toUpperCase()) ||
              (entry.meta?.stems && entry.meta.stems.some((stem: string) => stem.toUpperCase() === word.toUpperCase()));
            
            if (wordMatches) {
              setWordCache(prev => new Map(prev).set(wordLower, true));
              return true;
            }
          }
        }
      }
      
      setWordCache(prev => new Map(prev).set(wordLower, false));
      return false;
    } catch (error) {
      console.error(`Error validating word "${word}":`, error);
      
      const isInLocalList = commonWords.includes(word.toUpperCase());
      if (!isInLocalList) {
        showFeedback({ message: 'Dictionary API unavailable. Using local word list.', type: 'info' });
      }
      setWordCache(prev => new Map(prev).set(wordLower, isInLocalList));
      return isInLocalList;
    }
  }, [wordCache, commonWords, DICTIONARY_API_KEY, showFeedback]);

  // Initialize game
  const initGame = useCallback(() => {
    if (!isLevelsLoaded || !levels.length) return;
    
    if (timerInterval.current !== null) {
      window.clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
    
    const levelConfig = getCurrentLevelConfig();
    if (!levelConfig) return;
    
    setTimer(levelConfig.timeLimit);
    setScore(0);
    setFoundWords(new Set());
    setSelectedCells([]);
    setUsedLetters(new Set());
    setWordCache(new Map());
    setIsSelecting(false);

    generateGrid();
    startTimer();
    updateScore();
    updateLevelInfo();
    updateTimer();

    const currentMinLength = calculateMinWordLength();
    const difficulty = getCurrentDifficulty();
    const maxLen = config.maxWordLength[difficulty];
    const currentTarget = calculateTargetScore();
    const gridSize = getCurrentGridSize();
    
    showFeedback({
      message: `Level ${currentLevel}: ${levelConfig.description}\n\n${gridSize}x${gridSize} Grid | Words: ${currentMinLength}-${maxLen} letters\nScore ${config.scorePerLetter[difficulty]} points per letter\nReach ${currentTarget} points to win!`,
      type: 'info'
    });
  }, [currentLevel, getCurrentLevelConfig, config, generateGrid, startTimer, updateScore, updateLevelInfo, updateTimer, showFeedback, calculateMinWordLength, getCurrentDifficulty, calculateTargetScore, isLevelsLoaded, levels.length, getCurrentGridSize]);

  // Store initGame in ref for timer callback
  const initGameRef = useRef(initGame);
  
  useEffect(() => {
    initGameRef.current = initGame;
  }, [initGame]);

  // Handle game win
  const handleGameWin = useCallback(() => {
    if (!levels.length) return;
    
    const messages = [
      "Amazing! You're crushing it!",
      "Incredible skills!",
      "Word wizard!",
      "Boggle master!",
      "Unstoppable!",
      "Legendary performance!",
      "Vocabulary champion!",
      "Mind-blowing!",
      "You're on fire!",
      "Absolutely brilliant!"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }

    updateTargetScore();
    playSound('win');

    const levelConfig = getCurrentLevelConfig();
    if (!levelConfig) return;
    
    const confettiConfig = {
      particleCount: levelConfig.difficulty === 'expert' ? 350 : (levelConfig.difficulty === 'hard' ? 300 : 200),
      spread: levelConfig.difficulty === 'expert' ? 150 : (levelConfig.difficulty === 'hard' ? 120 : 100),
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    };

    fireConfetti(confettiConfig);
    setTimeout(() => fireConfetti({ ...confettiConfig, origin: { x: 0.25, y: 0.5 } }), 300);
    setTimeout(() => fireConfetti({ ...confettiConfig, origin: { x: 0.75, y: 0.5 } }), 600);

    const nextLevel = Math.min(currentLevel + 1, levels.length);
    
    if (targetScoreElement.current) {
      targetScoreElement.current.textContent = `🎯 Target Achieved! ${score}/${calculateTargetScore()} 🎯`;
      const progressBar = document.querySelector('.progress-bar-fill') as HTMLElement;
      if (progressBar) {
        progressBar.style.width = '100%';
        progressBar.style.backgroundColor = '#10b981';
      }
    }

    const victoryMessage = currentLevel < levels.length
      ? `🎊 ${randomMessage} Level ${currentLevel} completed! 🎊\nAdvancing to Level ${nextLevel}...`
      : `🏆 ${randomMessage} 🏆\nYou've completed all levels! You're a true Boggle Champion!`;

    showFeedback({
      message: victoryMessage,
      type: 'success'
    });

    setTimeout(() => {
      setCurrentLevel(nextLevel);
      saveGameState();
      setTimeout(() => {
        initGameRef.current();
      }, 500);
    }, 4000);
  }, [currentLevel, levels.length, getCurrentLevelConfig, fireConfetti, playSound, saveGameState, showFeedback, calculateTargetScore, updateTargetScore, score]);

  // Initialize game on mount
  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'boggle_started', category: 'boggle',label: 'boggle'});
        clearInterval(checkGtag);
      }
    }, 100);

    const generatedLevels = generateLevels();
    setLevels(generatedLevels);
    setIsLevelsLoaded(true);
    
    loadGameState();
    
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventDefault, { passive: false });

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
      document.removeEventListener('touchmove', preventDefault);
    };
  }, [loadGameState, generateLevels]);

  // Initialize game when levels are loaded
  useEffect(() => {
    if (isLevelsLoaded && levels.length > 0) {
      setTimeout(() => {
        initGameRef.current();
      }, 0);
    }
  }, [isLevelsLoaded, levels.length]);

  // Regenerate grid when level changes
  useEffect(() => {
    if (isLevelsLoaded && levels.length > 0) {
      generateGrid();
    }
  }, [currentLevel, isLevelsLoaded, levels.length, generateGrid]);

  // Update target score when level or score changes
  useEffect(() => {
    if (isLevelsLoaded && levels.length > 0) {
      updateTargetScore();
    }
  }, [score, currentLevel, isLevelsLoaded, levels.length, updateTargetScore]);

  // Add selection line effect
  useEffect(() => {
    const updateSelectionLine = () => {
      const existingLines = document.querySelectorAll('.selection-line');
      existingLines.forEach(line => line.remove());

      if (selectedCells.length < 2 || !gridElement.current) return;

      const gridEl = gridElement.current;
      const gridRect = gridEl.getBoundingClientRect();
      const gridInner = gridEl.firstChild as HTMLElement;

      for (let i = 0; i < selectedCells.length - 1; i++) {
        const startCell = gridInner.children[selectedCells[i]] as HTMLElement;
        const endCell = gridInner.children[selectedCells[i + 1]] as HTMLElement;

        if (!startCell || !endCell) continue;

        const startRect = startCell.getBoundingClientRect();
        const endRect = endCell.getBoundingClientRect();

        const startX = startRect.left + startRect.width / 2 - gridRect.left;
        const startY = startRect.top + startRect.height / 2 - gridRect.top;
        const endX = endRect.left + endRect.width / 2 - gridRect.left;
        const endY = endRect.top + endRect.height / 2 - gridRect.top;

        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

        const line = document.createElement('div');
        line.className = 'selection-line';
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.left = `${startX}px`;
        line.style.top = `${startY}px`;
        line.style.position = 'absolute';
        line.style.height = '3px';
        line.style.backgroundColor = '#3b82f6';
        line.style.zIndex = '10';
        line.style.pointerEvents = 'none';
        line.style.transformOrigin = '0 0';
        
        gridEl.appendChild(line);
      }
    };

    updateSelectionLine();
  }, [selectedCells, grid]);

  // Check if two cells are adjacent
  const isAdjacent = (index1: number, index2: number) => {
    const size = getCurrentGridSize();
    const pos1 = { row: Math.floor(index1 / size), col: index1 % size };
    const pos2 = { row: Math.floor(index2 / size), col: index2 % size };

    const rowDiff = Math.abs(pos2.row - pos1.row);
    const colDiff = Math.abs(pos2.col - pos1.col);

    return (rowDiff <= 1 && colDiff <= 1) && !(rowDiff === 0 && colDiff === 0);
  };

  // Handle cell interaction
  const handleCellInteraction = (index: number, action: 'start' | 'continue' | 'end') => {
    switch (action) {
      case 'start':
        setIsSelecting(true);
        setSelectedCells([index]);
        setUsedLetters(new Set([index]));
        playSound('select');
        break;
        
      case 'continue':
        if (!isSelecting || selectedCells.length === 0) return;
        if (usedLetters.has(index)) return;
        
        const lastIndex = selectedCells[selectedCells.length - 1];
        if (isAdjacent(lastIndex, index)) {
          setSelectedCells(prev => [...prev, index]);
          setUsedLetters(prev => new Set(prev).add(index));
        }
        break;
        
      case 'end':
        if (!isSelecting) return;
        
        const finalSelectedCells = [...selectedCells];
        setIsSelecting(false);
        
        if (finalSelectedCells.length >= 2) {
          checkSelectedWord(finalSelectedCells);
        }
        break;
    }
  };

  // Check selected word
  const checkSelectedWord = async (cellsToCheck: number[]) => {
    const currentMinLength = calculateMinWordLength();

    if (cellsToCheck.length < currentMinLength) {
      showFeedback({ message: `Word too short (min ${currentMinLength} letters)`, type: 'error' });
      playSound('error');
      
      setTimeout(() => {
        setSelectedCells([]);
      }, 100);
      return;
    }

    const selectedWord = cellsToCheck.map(index => grid[index].letter).join('');
    
    if (foundWords.has(selectedWord)) {
      showFeedback({ message: 'Word already found', type: 'error' });
      playSound('error');
      
      setTimeout(() => {
        setSelectedCells([]);
      }, 100);
      return;
    }

    const isValid = await validateWord(selectedWord);

    if (isValid) {
      const newFoundWords = new Set(foundWords);
      newFoundWords.add(selectedWord);
      setFoundWords(newFoundWords);

      const levelConfig = getCurrentLevelConfig();
      if (!levelConfig) return;
      
      const difficulty = getCurrentDifficulty();
      
      const points = Math.floor(selectedWord.length * config.scorePerLetter[difficulty] * levelConfig.scoreMultiplier);
      const newScore = score + points;
      setScore(newScore);

      setTimeout(() => {
        updateTargetScore();
      }, 0);

      setGrid(prev => 
        prev.map((cell, idx) => 
          cellsToCheck.includes(idx) ? { ...cell, found: true } : cell
        )
      );

      showFeedback({ message: `Found: ${selectedWord} (+${points} points)`, type: 'success' });
      playSound('correct');

      const currentTarget = calculateTargetScore();

      if (newScore >= currentTarget) {
        handleGameWin();
      }
    } else {
      showFeedback({ message: 'Not a valid word', type: 'error' });
      playSound('error');
    }

    setSelectedCells([]);
  };

  // Handle new game
  const handleNewGame = () => {
    initGame();
  };

  // Handle hint
  const handleHint = () => {
    if (foundWords.size > 0) {
      showFeedback({ message: "Try finding more words first!", type: 'info' });
      return;
    }

    const hint = commonWords[Math.floor(Math.random() * commonWords.length)];
    if (hint) {
      showFeedback({ message: `Hint: Try finding a word starting with "${hint[0]}"`, type: 'success' });
    } else {
      showFeedback({ message: "No hints available", type: 'error' });
    }
  };

  // Handle level selection
  const handleLevelSelect = (level: number) => {
    if (level >= 1 && level <= levels.length) {
      setCurrentLevel(level);
      saveGameState();
      setTimeout(() => {
        initGame();
      }, 100);
    }
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isLevelsLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="w-full max-w-2xl bg-gray-800/50 rounded-2xl p-8 text-center border border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Loading Boggle Game...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  const currentGridSize = getCurrentGridSize();
  const currentDifficulty = getCurrentDifficulty();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-4 md:p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Boggle Game
            </h1>
            <div className="text-sm md:text-base text-gray-300 mt-1">
              <span ref={levelElement}>
                Level {currentLevel}: {getCurrentLevelConfig()?.description || 'Loading...'}
              </span>
              <div className="text-sm text-gray-400 mt-1">
                {currentGridSize}x{currentGridSize} Grid | Min word length: {calculateMinWordLength()} letters | Difficulty: {currentDifficulty}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="bg-gray-900/80 px-4 py-2 rounded-lg border border-gray-700 font-mono text-lg">
              <span ref={timeElement}>⏱️ {formatTime(timer)}</span>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-lg border border-purple-500 font-bold text-lg">
              <span ref={scoreElement}>Score: {score}</span>
            </div>
          </div>
        </div>

        {/* Target Score Progress Bar */}
        <div className="mb-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
          <div className="flex justify-between items-center mb-2">
            <span ref={targetScoreElement} className="text-lg font-semibold text-white">
              Target: {score}/{calculateTargetScore()}
            </span>
            <span className="text-sm text-gray-300">
              {Math.min(100, Math.round((score / calculateTargetScore()) * 100))}%
            </span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
            <div 
              ref={progressBarRef}
              className="progress-bar-fill h-full rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${Math.min(100, (score / calculateTargetScore()) * 100)}%`,
                backgroundColor: '#3b82f6'
              }}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-300">
              <strong>Level Progress:</strong> {currentLevel}/{levels.length}
            </span>
            {levels.length > 0 && (
              <select 
                value={currentLevel}
                onChange={(e) => handleLevelSelect(parseInt(e.target.value))}
                className="text-sm border border-gray-600 rounded px-2 py-1 bg-gray-800 text-white min-w-[200px] transition-colors duration-200 hover:border-blue-500"
              >
                {levels.map(level => (
                  <option key={level.level} value={level.level}>
                    Level {level.level}: {level.description}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Game Grid */}
        <div className="mb-6 md:mb-8 flex justify-center" style={{ overflow: 'hidden' }}>
          <div ref={gridElement} className="relative" style={{ overflow: 'hidden' }}>
            <div 
              className="grid gap-2 md:gap-3 p-4 bg-gray-800/30 rounded-2xl backdrop-blur-sm border border-gray-700/50"
              style={{ 
                gridTemplateColumns: `repeat(${currentGridSize}, 1fr)`,
                gridTemplateRows: `repeat(${currentGridSize}, 1fr)`,
                touchAction: 'none'
              }}
            >
              {grid.map((cell, index) => (
                <button
                  key={index}
                  className={`
                    ${currentGridSize <= 5 ? 'w-12 h-12 md:w-14 md:h-14 text-lg md:text-xl' : 'w-10 h-10 md:w-11 md:h-11 text-base md:text-lg'}
                    rounded-lg md:rounded-xl font-bold transition-all duration-200
                    ${selectedCells.includes(index) 
                      ? 'bg-blue-500 text-white scale-105 shadow-lg' 
                      : selectedCells[selectedCells.length - 1] === index 
                        ? 'bg-blue-600 text-white scale-110 shadow-lg'
                        : cell.found 
                          ? 'bg-green-600/80 text-white'
                          : 'bg-gray-700/80 hover:bg-gray-600/80 text-white'
                    }
                    border-2 ${selectedCells.includes(index) ? 'border-blue-300' : cell.found ? 'border-green-400' : 'border-gray-600'}
                    active:scale-95
                  `}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleCellInteraction(index, 'start');
                  }}
                  onMouseEnter={() => handleCellInteraction(index, 'continue')}
                  onMouseUp={() => handleCellInteraction(index, 'end')}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleCellInteraction(index, 'start');
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const element = document.elementFromPoint(touch.clientX, touch.clientY);
                    
                    if (element && element.classList.contains('bg-gray-700\\/80')) {
                      const cells = Array.from(gridElement.current?.querySelectorAll('.bg-gray-700\\/80, .bg-blue-500, .bg-blue-600, .bg-green-600\\/80') || []);
                      const idx = cells.indexOf(element);
                      if (idx >= 0) {
                        handleCellInteraction(idx, 'continue');
                      }
                    }
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    const finalSelectedCells = [...selectedCells];
                    setIsSelecting(false);
                    
                    if (finalSelectedCells.length >= 2) {
                      checkSelectedWord(finalSelectedCells);
                    }
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {cell.letter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback message */}
        <div className={`mb-6 md:mb-8 text-center text-lg font-medium p-4 rounded-xl border backdrop-blur-sm ${
          feedback.type === 'error' ? 'bg-red-500/20 text-red-300 border-red-500/50' : 
          feedback.type === 'success' ? 'bg-green-500/20 text-green-300 border-green-500/50' : 
          'bg-blue-500/20 text-blue-300 border-blue-500/50'
        }`}>
          {feedback.message}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 md:gap-6 mb-6 md:mb-8">
          <button 
            onClick={handleNewGame}
            className="px-6 md:px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Restart Level
          </button>
          <button 
            onClick={handleHint}
            className="px-6 md:px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Get Hint
          </button>
        </div>

        {/* Found Words */}
        {foundWords.size > 0 && (
          <div className="bg-gray-800/50 rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-gray-700">
            <h3 className="text-lg md:text-xl font-bold text-center mb-4 text-gray-200">Found Words ({foundWords.size}):</h3>
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
              {Array.from(foundWords).sort().map((word, i) => (
                <span key={i} className="px-3 md:px-4 py-2 bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white rounded-lg font-medium border border-gray-600">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}