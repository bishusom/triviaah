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

const buttonStyle = "px-6 md:px-3 py-2 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] text-center"

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

  const timerInterval = useRef<NodeJS.Timeout| null>(null)
  const DICTIONARY_API_KEY = process.env.NEXT_PUBLIC_MW_DICTIONARY_KEY;

  // Game configuration - UPDATED with expert level
  const config: GameConfig = useMemo(() => ({
    gridSize: {
      easy: 4,
      medium: 5,
      hard: 5,
      expert: 6  // Larger grid for expert levels
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
      expert: 8  // Allow longer words for expert levels
    },
    timeLimit: {
      easy: 180,
      medium: 180,
      hard: 180,
      expert: 210  // More time for larger grids
    },
    scorePerLetter: {
      easy: 10,
      medium: 12,
      hard: 15,
      expert: 18  // Higher points per letter for expert
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
      expert: 0.4  // More vowels for expert levels to form more words
    }
  }), []);

  // Common words for fallback - EXPANDED with more words
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
    'VIBRANT', 'WHISPER', 'XENON', 'YELLOW', 'ZEALOUS', 'ALPHABET', 'BUTTERFLY', 'CINNAMON',
    'DOLPHIN', 'ELEVATOR', 'FLAMINGO', 'GIRAFFE', 'HIBISCUS', 'ICICLE', 'JACKRABBIT',
    'KANGAROO', 'LIGHTNING', 'MOUNTAIN', 'NEBULA', 'ORCHESTRA', 'PENGUIN', 'QUARTZ',
    'RAINSTORM', 'STARFISH', 'TORNADO', 'UNICORN', 'VOLCANO', 'WATERFALL', 'XYLOPHONE',
    'YELLOWFIN', 'ZIGZAG', 'AMBITION', 'BRILLIANT', 'CURIOUS', 'DETERMINED', 'ENCHANTED',
    'FASCINATING', 'GLORIOUS', 'HAPPINESS', 'ILLUMINATE', 'JUBILANT', 'KNOWLEDGE',
    'LUMINOUS', 'MARVELOUS', 'NOTABLE', 'OUTSTANDING', 'PHENOMENON', 'QUIZZICAL',
    'REMARKABLE', 'SPECTACULAR', 'TERRIFIC', 'UNDERSTAND', 'VIVACIOUS', 'WONDERFUL',
    'EXCELLENT', 'YEARLY', 'ZEALOUSLY', 'AMAZEMENT', 'BOUNDLESS', 'CREATIVE', 'DILIGENT',
    'EAGERNESS', 'FULFILLED', 'GENEROUS', 'HOPEFUL', 'INSPIRED', 'JOYFUL', 'KINDLY',
    'LEARNED', 'MOTIVATED', 'NOURISHED', 'OPTIMISTIC', 'PEACEFUL', 'QUALIFIED', 'RADIANT',
    'SINCERE', 'THANKFUL', 'UPBEAT', 'VALUABLE', 'WELCOMING', 'EXCITED', 'YIELDING'
  ].map(word => word.toUpperCase()), []);

  const { isMuted } = useSound();

  const isTouchDevice = useRef(false);

  // Generate levels function - SIMPLIFIED progression
  const generateLevels = useCallback(() => {
    const generatedLevels: LevelConfig[] = [];
    
    // Level 1-2: 3-letter words (Easy, 4x4 grid)
    for (let i = 1; i <= 2; i++) {
      generatedLevels.push({
        level: i,
        difficulty: 'easy',
        minWordLength: 3,
        winThreshold: 80 + (i * 20), // 100, 120
        timeLimit: 180,
        scoreMultiplier: 1.0,
        description: `Beginner ${i} - Find 3-letter words`
      });
    }
    
    // Level 3-4: 3-4 letter words (Easy, 4x4 grid)
    for (let i = 3; i <= 4; i++) {
      generatedLevels.push({
        level: i,
        difficulty: 'easy',
        minWordLength: 3,
        winThreshold: 140 + ((i - 2) * 30), // 140, 170
        timeLimit: 180,
        scoreMultiplier: 1.0 + ((i - 2) * 0.1),
        description: `Beginner ${i-2} - Find 3-4 letter words`
      });
    }
    
    // Level 5-6: 4-letter words (Medium, 5x5 grid)
    for (let i = 5; i <= 6; i++) {
      generatedLevels.push({
        level: i,
        difficulty: 'medium',
        minWordLength: 4,
        winThreshold: 200 + ((i - 4) * 50), // 200, 250
        timeLimit: 180,
        scoreMultiplier: 1.2 + ((i - 4) * 0.1),
        description: `Intermediate ${i-4} - Find 4-letter words`
      });
    }
    
    // Level 7-8: 4-5 letter words (Medium, 5x5 grid)
    for (let i = 7; i <= 8; i++) {
      generatedLevels.push({
        level: i,
        difficulty: 'medium',
        minWordLength: 4,
        winThreshold: 300 + ((i - 6) * 60), // 300, 360
        timeLimit: 180,
        scoreMultiplier: 1.4 + ((i - 6) * 0.1),
        description: `Intermediate ${i-6} - Find 4-5 letter words`
      });
    }
    
    // Level 9-10: 5-letter words (Hard, 5x5 grid)
    for (let i = 9; i <= 10; i++) {
      generatedLevels.push({
        level: i,
        difficulty: 'hard',
        minWordLength: 5,
        winThreshold: 420 + ((i - 8) * 80), // 420, 500
        timeLimit: 180,
        scoreMultiplier: 1.6 + ((i - 8) * 0.1),
        description: `Advanced ${i-8} - Find 5-letter words`
      });
    }
    
    // Level 11-12: 5-6 letter words (Hard, 5x5 grid)
    for (let i = 11; i <= 12; i++) {
      generatedLevels.push({
        level: i,
        difficulty: 'hard',
        minWordLength: 5,
        winThreshold: 580 + ((i - 10) * 100), // 580, 680
        timeLimit: 180,
        scoreMultiplier: 1.8 + ((i - 10) * 0.15),
        description: `Advanced ${i-10} - Find 5-6 letter words`
      });
    }
    
    // Level 13-14: 6-letter words (Expert, 6x6 grid)
    for (let i = 13; i <= 14; i++) {
      generatedLevels.push({
        level: i,
        difficulty: 'expert',
        minWordLength: 6,
        winThreshold: 780 + ((i - 12) * 120), // 780, 900
        timeLimit: 210,
        scoreMultiplier: 2.0 + ((i - 12) * 0.2),
        description: `Expert ${i-12} - Find 6-letter words`
      });
    }
    
    // Level 15-16: 6-7 letter words (Expert, 6x6 grid)
    for (let i = 15; i <= 16; i++) {
      generatedLevels.push({
        level: i,
        difficulty: 'expert',
        minWordLength: 6,
        winThreshold: 1020 + ((i - 14) * 150), // 1020, 1170
        timeLimit: 210,
        scoreMultiplier: 2.4 + ((i - 14) * 0.2),
        description: `Expert ${i-14} - Find 6-7 letter words`
      });
    }
    
    // Level 17-18: 7-letter words (Expert, 6x6 grid)
    for (let i = 17; i <= 18; i++) {
      generatedLevels.push({
        level: i,
        difficulty: 'expert',
        minWordLength: 7,
        winThreshold: 1320 + ((i - 16) * 180), // 1320, 1500
        timeLimit: 200,
        scoreMultiplier: 2.8 + ((i - 16) * 0.25),
        description: `Master ${i-16} - Find 7-letter words`
      });
    }
    
    // Level 19-20: 7-8 letter words (Expert, 6x6 grid)
    for (let i = 19; i <= 20; i++) {
      generatedLevels.push({
        level: i,
        difficulty: 'expert',
        minWordLength: 7,
        winThreshold: 1680 + ((i - 18) * 200), // 1680, 1880
        timeLimit: 200,
        scoreMultiplier: 3.3 + ((i - 18) * 0.3),
        description: `Master ${i-18} - Find 7-8 letter words`
      });
    }
    
    return generatedLevels;
  }, []);

  // Get current level configuration - FIXED with null check
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

  // Generate game grid - UPDATED for larger grids and more vowels
  const generateGrid = useCallback(() => {
    const difficulty = getCurrentDifficulty();
    const size = config.gridSize[difficulty];
    const vowels = 'AEIOU';
    const vowelPercent = config.vowelPercentage[difficulty];
    const minVowels = Math.ceil(size * size * vowelPercent);
    let vowelCount = 0;

    console.log(`Generating ${size}x${size} grid for level ${currentLevel}, difficulty: ${difficulty}`);
    console.log(`Target vowels: ${minVowels} (${(vowelPercent * 100).toFixed(0)}% of ${size * size} cells)`);

    // Create letter pool with weighted vowels for expert levels
    const letterPool: string[] = [];
    
    // Add letters from common words (this gives us real words)
    commonWords.forEach(word => {
      word.split('').forEach(letter => letterPool.push(letter));
    });

    // Add extra vowels for expert levels
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

    console.log(`Initial vowels: ${vowelCount}/${minVowels}`);

    // Ensure minimum vowels are met by replacing consonants
    let attempts = 0;
    const maxAttempts = size * size * 2; // Prevent infinite loop
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

    console.log(`Final vowels: ${vowelCount}/${minVowels}`);
    
    // For expert levels, add more common letter combinations
    if (difficulty === 'expert') {
      // Add common word endings/suffixes
      const suffixes = ['ING', 'ED', 'ER', 'EST', 'LY', 'MENT', 'NESS', 'TION'];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      
      // Try to place suffix letters adjacent to each other
      const availablePositions = newGrid
        .map((cell, idx) => idx)
        .sort(() => Math.random() - 0.5);
      
      // Place at least some suffix letters
      for (let i = 0; i < Math.min(suffix.length, 3); i++) {
        if (availablePositions.length > i) {
          newGrid[availablePositions[i]].letter = suffix[i];
        }
      }
    }

    setGrid(newGrid);
  }, [getCurrentDifficulty, config, commonWords, currentLevel]);

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
    
    // Update the display with progress bar
    targetScoreElement.current.textContent = `Target: ${score}/${currentTarget}`;
    
    // Update progress bar width using ref
    const progressBar = progressBarRef.current;
    progressBar.style.width = `${progressPercent}%`;
    
    // Change color based on progress
    if (progressPercent >= 100) {
      progressBar.style.backgroundColor = '#10b981'; // green
      targetScoreElement.current.textContent = `🎯 Target: ${score}/${currentTarget} 🎯`;
    } else if (progressPercent >= 75) {
      progressBar.style.backgroundColor = '#f59e0b'; // amber
    } else if (progressPercent >= 50) {
      progressBar.style.backgroundColor = '#3b82f6'; // blue
    } else {
      progressBar.style.backgroundColor = '#ef4444'; // red
    }
    
    // Force reflow for smooth animation
    progressBar.offsetHeight;
  }, [score, calculateTargetScore]);

  // Update level info
  const updateLevelInfo = useCallback(() => {
    if (!levelElement.current) return;
    
    const levelConfig = getCurrentLevelConfig();
    if (!levelConfig) return;
    
    const currentTarget = calculateTargetScore();
    const currentMinLength = calculateMinWordLength();
    const gridSize = getCurrentGridSize();
    
    levelElement.current.textContent = `Level ${levelConfig.level}: ${levelConfig.description}`;
    
    updateTargetScore();
  }, [getCurrentLevelConfig, calculateTargetScore, calculateMinWordLength, updateTargetScore, getCurrentGridSize]);

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
          // Reset to same level on failure
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

      // Handle different response types from Merriam-Webster
      if (Array.isArray(data) && data.length > 0) {
        // Check each entry in the array
        for (const entry of data) {
          // If it's a string, it's a suggestion (not a valid entry)
          if (typeof entry === 'string') {
            continue;
          }
          
          // If it's an object with meta data, check if it matches our word
          if (typeof entry === 'object' && entry !== null) {
            // Check multiple possible ways the word might be represented
            const wordMatches = 
              // Check meta.id (might be "word:1" format)
              (entry.meta?.id && entry.meta.id.split(':')[0].toUpperCase() === word.toUpperCase()) ||
              // Check hwi.hw (headword)
              (entry.hwi?.hw && entry.hwi.hw.replace(/\*/g, '').toUpperCase() === word.toUpperCase()) ||
              // Check stems array
              (entry.meta?.stems && entry.meta.stems.some((stem: string) => stem.toUpperCase() === word.toUpperCase()));
            
            if (wordMatches) {
              setWordCache(prev => new Map(prev).set(wordLower, true));
              return true;
            }
          }
        }
      }
      
      // Word not found in dictionary
      setWordCache(prev => new Map(prev).set(wordLower, false));
      return false;
    } catch (error) {
      console.error(`Error validating word "${word}":`, error);
      
      // Fallback to local word list
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

    // Immediately update progress bar to 100%
    const currentTarget = calculateTargetScore();
    updateTargetScore(); // This will show 100% progress
    
    // Play win sound
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

    // Advance to next level
    const nextLevel = Math.min(currentLevel + 1, levels.length);
    
    // Update the target score display to show victory
    if (targetScoreElement.current) {
      targetScoreElement.current.textContent = `🎯 Target Achieved! ${score}/${currentTarget} 🎯`;
      // Force progress bar to 100%
      const progressBar = document.querySelector('.progress-bar-fill') as HTMLElement;
      if (progressBar) {
        progressBar.style.width = '100%';
        progressBar.style.backgroundColor = '#10b981'; // Green for success
      }
    }

    const victoryMessage = currentLevel < levels.length
      ? `🎊 ${randomMessage} Level ${currentLevel} completed! 🎊\nAdvancing to Level ${nextLevel}...`
      : `🏆 ${randomMessage} 🏆\nYou've completed all 30 levels! You're a true Boggle Champion!`;

    showFeedback({
      message: victoryMessage,
      type: 'success'
    });

    // Set new level after a delay to let players see the victory
    setTimeout(() => {
      setCurrentLevel(nextLevel);
      saveGameState();
      // Reset game after advancing level
      setTimeout(() => {
        initGameRef.current();
      }, 500);
    }, 4000); // Reduced from 5000 to 4000 to make transition smoother
  }, [currentLevel, levels.length, getCurrentLevelConfig, fireConfetti, playSound, saveGameState, showFeedback, calculateTargetScore, updateTargetScore, score]);

  // Initialize game on mount
  useEffect(() => {
    // Detect if it's a touch device
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'boggle_started', category: 'boggle',label: 'boggle'});
        clearInterval(checkGtag);
      }
    }, 100);

    // Generate levels first
    const generatedLevels = generateLevels();
    setLevels(generatedLevels);
    setIsLevelsLoaded(true);
    
    // Load game state after levels are set
    loadGameState();
    
    // Prevent default touch behavior to avoid scrolling
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

        // Calculate positions relative to the grid container
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
        line.style.backgroundColor = '#3b82f6'; // blue-500
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
        
        // Create a copy of selectedCells before clearing them
        const finalSelectedCells = [...selectedCells];
        setIsSelecting(false);
        
        if (finalSelectedCells.length >= 2) {
          // Pass the final selected cells to checkSelectedWord
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
      
      // Add a brief delay before clearing to show visual feedback
      setTimeout(() => {
        setSelectedCells([]);
      }, 100);
      return;
    }

    const selectedWord = cellsToCheck.map(index => grid[index].letter).join('');
    
    if (foundWords.has(selectedWord)) {
      showFeedback({ message: 'Word already found', type: 'error' });
      playSound('error');
      
      // Add a brief delay before clearing to show visual feedback
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

      // Update progress bar immediately
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

    // Clear the selection after validation
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
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Loading Boggle Challenge...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  const currentGridSize = getCurrentGridSize();
  const currentDifficulty = getCurrentDifficulty();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50" style={{ touchAction: 'none', overflow: 'hidden' }}>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-4 md:p-6 mb-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Boggle Challenge</h2>
            <div className="text-base text-gray-600 font-medium">
              <span ref={levelElement}>
                Level {currentLevel}: {getCurrentLevelConfig()?.description || 'Loading...'}
              </span>
              <div className="text-sm text-gray-500 mt-1">
                {currentGridSize}x{currentGridSize} Grid | Min word length: {calculateMinWordLength()} letters | Difficulty: {currentDifficulty}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="bg-gray-800 text-white px-3 py-2 rounded-lg font-mono text-base shadow-md">
              <span ref={timeElement}>⏱️ {formatTime(timer)}</span>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
              <span ref={scoreElement}>Score: {score}</span>
            </div>
          </div>
        </div>

        {/* Target Score Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span ref={targetScoreElement} className="text-lg font-semibold text-gray-700 transition-all duration-300">
              Target: {score}/{calculateTargetScore()}
            </span>
            <span className="text-sm text-gray-600 font-medium transition-all duration-300">
              {Math.min(100, Math.round((score / calculateTargetScore()) * 100))}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              ref={progressBarRef}
              className="progress-bar-fill h-full rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${Math.min(100, (score / calculateTargetScore()) * 100)}%`,
                backgroundColor: '#3b82f6'
              }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">
              <strong>Level Progress:</strong> {currentLevel}/{levels.length}
            </span>
            {levels.length > 0 && (
              <select 
                value={currentLevel}
                onChange={(e) => handleLevelSelect(parseInt(e.target.value))}
                className="text-sm border border-gray-300 rounded px-2 py-1 bg-white min-w-[200px] transition-colors duration-200 hover:border-blue-400"
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

        {/* Game Grid - ADJUSTED for larger grids */}
        <div className="mb-6 md:mb-8 flex justify-center" style={{ overflow: 'hidden' }}>
          <div ref={gridElement} className="relative" style={{ overflow: 'hidden' }}>
            <div 
              className="grid gap-1.5 md:gap-2 p-3 md:p-4 bg-white rounded-2xl border border-gray-300 shadow-md"
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
                      ? 'bg-blue-200 text-blue-800 scale-105 shadow-md' 
                      : selectedCells[selectedCells.length - 1] === index 
                        ? 'bg-blue-300 text-blue-900 scale-110 shadow-lg'
                        : cell.found 
                          ? 'bg-green-200 text-green-800'
                          : 'bg-white hover:bg-gray-50 text-gray-800'
                    }
                    border-2 ${selectedCells.includes(index) ? 'border-blue-400' : cell.found ? 'border-green-400' : 'border-gray-300'}
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
                    
                    if (element && element instanceof HTMLButtonElement && 
                        (element.classList.contains('bg-white') || 
                        element.classList.contains('bg-blue-200') || 
                        element.classList.contains('bg-blue-300') || 
                        element.classList.contains('bg-green-200'))) {
                      const cells = Array.from(gridElement.current?.querySelectorAll('button') || []) as HTMLButtonElement[];
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
        {feedback.message && (
          <div className={`mb-6 text-center text-base md:text-lg font-medium p-4 rounded-xl border whitespace-pre-line ${
            feedback.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 
            feedback.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 
            'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            {feedback.message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
          <button 
            onClick={handleNewGame}
            className={`${buttonStyle} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white`}
          >
            Restart Level
          </button>
          <button 
            onClick={handleHint}
            className={`${buttonStyle} bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white`}
          >
            Get Hint
          </button>
        </div>

        {/* Found Words */}
        {foundWords.size > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Found Words ({foundWords.size}):</h3>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(foundWords).sort().map((word, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-medium rounded-full border border-blue-300 shadow-sm text-sm"
                >
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