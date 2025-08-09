'use client';
import { event } from '@/lib/gtag';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { db } from '@/lib/firebase';
import { useSound } from '@/app/context/SoundContext';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

type DifficultyLevel = 'easy' | 'medium' | 'hard';

type GameConfig = {
  gridCols: number;
  gridRows: number;
  minWordLength: number;
  maxWordLength: number;
  wordCount: number;
  timeLimit: number;
};

type Cell = {
  letter: string;
  word: string | null;
  element: HTMLElement | null;
};

type WordObj = {
  word: string;
  letters: string[];
};

type DirectionCounts = {
  horizontal: number;
  vertical: number;
  diagonal: number;
  [key: string]: number; // Add index signature
};

export default function WordSearchGame() {
  // Game configuration
  const config: Record<DifficultyLevel, GameConfig> & {
    maxPlacementAttempts: number;
    maxTotalAttempts: number;
    maxRetries: number;
  } = {
    easy: { gridCols: 6, gridRows: 8, minWordLength: 3, maxWordLength: 5, wordCount: 6, timeLimit: 240 },
    medium: { gridCols: 8, gridRows: 10, minWordLength: 4, maxWordLength: 7, wordCount: 8, timeLimit: 300 },
    hard: { gridCols: 10, gridRows: 10, minWordLength: 5, maxWordLength: 8, wordCount: 10, timeLimit: 500 },
    maxPlacementAttempts: 500,
    maxTotalAttempts: 2000,
    maxRetries: 5
  };

  // Game state
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [consecutiveWins, setConsecutiveWins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [grid, setGrid] = useState<Cell[]>([]);
  const [words, setWords] = useState<WordObj[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [timer, setTimer] = useState(config.easy.timeLimit);
  const { isMuted } = useSound();
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [showVictory, setShowVictory] = useState(false);
  const [victoryMessage, setVictoryMessage] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const usedWordsRef = useRef<Set<string>>(new Set());
  const directionCountsRef = useRef<DirectionCounts>({ horizontal: 0, vertical: 0, diagonal: 0 });
  const retryCountRef = useRef(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const startCellRef = useRef<number | null>(null);

  useEffect(() => {
    event({
      action: 'word_search_started',
      category: 'word_search',
      label: difficulty, // Track the difficulty level
      game_type: 'word_search', // Additional parameter
      level: currentLevel // Track current level
    });
  }, []);

  // Load saved state
  useEffect(() => {
    // Only initialize game if difficulty changes, not on mount
    const savedState = localStorage.getItem('wordSearchState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      if (parsed.difficulty && parsed.difficulty !== difficulty) {
        setDifficulty(parsed.difficulty);
      }
      if (parsed.currentLevel) {
        setCurrentLevel(parsed.currentLevel);
      }
      if (parsed.consecutiveWins) {
        setConsecutiveWins(parsed.consecutiveWins);
      }
    } else {
      // Initial game load
      initGame();
    }
  }, []);

  useEffect(() => {
    // This will handle difficulty changes
    if (difficulty) {
      initGame();
    }
  }, [difficulty]);
    
  // Save game state
  useEffect(() => {
    localStorage.setItem('wordSearchState', JSON.stringify({
      difficulty,
      consecutiveWins,
      currentLevel
    }));
  }, [difficulty, consecutiveWins, currentLevel]);

  // Sound functions
    const playSound = (type: string) => {
      if (isMuted) return;
      const sounds: Record<string, string> = {
        select: '/sounds/click.mp3',
        found: '/sounds/correct.mp3',
        error: '/sounds/incorrect.mp3',
        win: '/sounds/win.mp3'
      };
      try {
        const audio = new Audio(sounds[type]);
        audio.play().catch(err => console.error(`Error playing ${type} sound:`, err));
      } catch (error) {
        console.error('Sound error:', error);
      }
    };

  // Timer functions
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(config[difficulty].timeLimit);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          showFeedback("Time's up!", 'error');
          setTimeout(initGame, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Game state functions
  const showFeedback = (message: string, type: string) => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
  };

  const showConfetti = (options = {}) => {
    const defaults = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    };
    confetti({ ...defaults, ...options });
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
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  // Word placement functions
  const canPlaceWord = (localGrid: Cell[], wordObj: WordObj, row: number, col: number, direction: number) => {
    const { letters } = wordObj;
    for (let i = 0; i < letters.length; i++) {
      let r = row, c = col;
      switch (direction) {
        case 0: c += i; break; // horizontal
        case 1: r += i; break; // vertical
        case 2: r += i; c += i; break; // diagonal down-right
        case 3: r -= i; c += i; break; // diagonal up-right
      }
      if (r < 0 || r >= config[difficulty].gridRows || c < 0 || c >= config[difficulty].gridCols) {
        return false;
      }
      const index = r * config[difficulty].gridCols + c;
      if (index < 0 || index >= localGrid.length) {
        return false;
      }
      if (!localGrid[index]) {
        return false;
      }
      if (localGrid[index].letter !== '' && localGrid[index].letter !== letters[i]) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (localGrid: Cell[], wordObj: WordObj, row: number, col: number, direction: number) => {
    const { word, letters } = wordObj;
    const newGrid = [...localGrid];
    for (let i = 0; i < letters.length; i++) {
      let r = row, c = col;
      switch (direction) {
        case 0: c += i; break;
        case 1: r += i; break;
        case 2: r += i; c += i; break;
        case 3: r -= i; c += i; break;
      }
      const index = r * config[difficulty].gridCols + c;
      newGrid[index] = { ...newGrid[index], letter: letters[i], word };
    }
    return newGrid;
  };

  const tryPlaceWord = (localGrid: Cell[], wordObj: WordObj, directionQuotas: DirectionCounts) => {
    const directions = [
      { id: 0, type: 'horizontal', rowStep: 0, colStep: 1 },
      { id: 1, type: 'vertical', rowStep: 1, colStep: 0 },
      { id: 2, type: 'diagonal', rowStep: 1, colStep: 1 },
      { id: 3, type: 'diagonal', rowStep: -1, colStep: 1 }
    ];

    const neededDirections = directions.filter(dir => {
      if (dir.type === 'horizontal' && directionCountsRef.current.horizontal >= directionQuotas.horizontal) return false;
      if (dir.type === 'vertical' && directionCountsRef.current.vertical >= directionQuotas.vertical) return false;
      if (dir.type === 'diagonal' && directionCountsRef.current.diagonal >= directionQuotas.diagonal) return false;
      return true;
    });

    const directionsToTry = neededDirections.length > 0 ? neededDirections : directions;
    const shuffledDirections = shuffleArray([...directionsToTry]);

    for (const dir of shuffledDirections) {
      const attempts = wordObj.letters.length > 4 ? config.maxPlacementAttempts * 2 : config.maxPlacementAttempts;
      for (let i = 0; i < attempts; i++) {
        const maxRow = dir.rowStep === 0 ? config[difficulty].gridRows :
          config[difficulty].gridRows - (wordObj.letters.length - 1) * Math.abs(dir.rowStep);
        const maxCol = dir.colStep === 0 ? config[difficulty].gridCols :
          config[difficulty].gridCols - (wordObj.letters.length - 1) * Math.abs(dir.colStep);
        if (maxRow <= 0 || maxCol <= 0) {
          continue;
        }
        const row = Math.floor(Math.random() * maxRow);
        const col = Math.floor(Math.random() * maxCol);
        if (canPlaceWord(localGrid, wordObj, row, col, dir.id)) {
          const updatedGrid = placeWord(localGrid, wordObj, row, col, dir.id);
          directionCountsRef.current[dir.type as keyof DirectionCounts]++;
          return { success: true, grid: updatedGrid };
        }
      }
    }
    return { success: false, grid: localGrid };
  };

  const fillEmptyCells = (localGrid: Cell[]) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return localGrid.map(cell => ({
      ...cell,
      letter: cell.letter || alphabet[Math.floor(Math.random() * alphabet.length)]
    }));
  };

  // Word generation
  const generateWordList = async (diffConfig: GameConfig, limitOverride: number | null = null) => {
    try {
      const randomFloor = Math.floor(Math.random() * 900000);
      const xlimit = limitOverride || diffConfig.wordCount;
      const q = query(
        collection(db, 'dictionary'),
        where('length', '>=', diffConfig.minWordLength),
        where('length', '<=', diffConfig.maxWordLength),
        where('randomIndex', '>=', randomFloor),
        orderBy('randomIndex'),
        limit(xlimit * 2)
      );

      const snapshot = await getDocs(q);
      const wordPoolSet = new Set<string>();
      const wordData: WordObj[] = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.word && data.letters) {
          const word = data.word.toUpperCase();
          if (!usedWordsRef.current.has(word)) {
            wordPoolSet.add(word);
            wordData.push({ word, letters: word.split('').map((l: string) => l.toUpperCase()) });
          }
        }
      });

      if (wordPoolSet.size === 0) {
        throw new Error("No valid words found in Firebase");
      }

      const shuffledWordData = shuffleArray(wordData);
      return shuffledWordData.slice(0, xlimit);
    } catch (error) {
      console.error("Error fetching words:", error);
      const staticWords = [
        'CAT', 'DOG', 'HAT', 'PEN', 'SUN', 'TWO',
        'BOOK', 'GAME', 'TREE', 'FISH', 'MOON', 'STAR',
        'RIVER', 'HOUSE', 'CLOUD', 'STONE', 'WIND', 'PATH'
      ].filter(word => word.length >= diffConfig.minWordLength && word.length <= diffConfig.maxWordLength);
      const uniqueStaticWords = [...new Set(staticWords)].filter(word => !usedWordsRef.current.has(word));
      const finalWords = shuffleArray(uniqueStaticWords).slice(0, limitOverride || diffConfig.wordCount)
        .map(word => ({ word, letters: word.split('') }));
      return finalWords;
    }
  };

  // Game initialization
  const initGame = async (attemptedWordCount: number = config[difficulty].wordCount) => {
    console.log('init game ',difficulty);
    setIsLoading(true);
    setError('');
    setSelectedCells([]);
    setFoundWords([]);
    setIsSelecting(false);
    usedWordsRef.current.clear();
    directionCountsRef.current = { horizontal: 0, vertical: 0, diagonal: 0 };
    setShowVictory(false);
    setFeedback({ message: '', type: '' });

    // Clear previous game styles from DOM
    const gridElement = gridRef.current;
    if (gridElement) {
      const cells = gridElement.querySelectorAll('.wordsearch-cell');
      cells.forEach(cell => {
        cell.classList.remove('found');
        (cell as HTMLElement).style.backgroundColor = '';
        (cell as HTMLElement).style.boxShadow = '';
      });
    }

    // Initialize grid
    const initialGrid: Cell[] = Array(config[difficulty].gridCols * config[difficulty].gridRows)
    .fill(null)
    .map(() => ({ letter: '', word: null, element: null }));
    setGrid(initialGrid);

    try {
      // Generate and sort words
      let wordList = await generateWordList(config[difficulty], attemptedWordCount);
      wordList.sort((a, b) => b.letters.length - a.letters.length);
      setWords(wordList);

      let placedSuccessfully = false;
      let totalGameAttempts = 0;
      const maxGameAttempts = 10;
      let localGrid = [...initialGrid];
      let placedWords: WordObj[] = [];

      while (!placedSuccessfully && totalGameAttempts < maxGameAttempts) {
        totalGameAttempts++;
        localGrid = [...initialGrid];
        let totalAttempts = 0;
        placedWords = [];
        let availableWords = [...wordList];

        const totalWords = attemptedWordCount;
        const minPerDirection = Math.floor(totalWords / 3);
        const directionQuotas: DirectionCounts = {
          horizontal: minPerDirection,
          vertical: minPerDirection,
          diagonal: totalWords - 2 * minPerDirection
        };

        while (placedWords.length < attemptedWordCount && totalAttempts < config.maxTotalAttempts) {
          if (availableWords.length === 0) {
            availableWords = [...wordList].filter(wordObj => !placedWords.some(p => p.word === wordObj.word));
          }
          if (availableWords.length === 0) {
            break;
          }
          const wordObj = availableWords[0];
          const result = tryPlaceWord(localGrid, wordObj, directionQuotas);
          if (result.success) {
            placedWords.push(wordObj);
            usedWordsRef.current.add(wordObj.word);
            localGrid = result.grid;
            availableWords.shift();
          } else {
            availableWords.shift();
            totalAttempts++;
          }
        }

        if (placedWords.length < attemptedWordCount) {
          const remainingWordsNeeded = attemptedWordCount - placedWords.length;
          const simplerWords = await generateWordList(config[difficulty], remainingWordsNeeded);
          const simplerAvailableWords = simplerWords.filter(wordObj => !usedWordsRef.current.has(wordObj.word));
          let simplerAttempts = 0;

          while (placedWords.length < attemptedWordCount && simplerAttempts < config.maxTotalAttempts && simplerAvailableWords.length > 0) {
            const wordObj = simplerAvailableWords[0];
            const result = tryPlaceWord(localGrid, wordObj, directionQuotas);
            if (result.success) {
              placedWords.push(wordObj);
              usedWordsRef.current.add(wordObj.word);
              localGrid = result.grid;
              simplerAvailableWords.shift();
            } else {
              simplerAvailableWords.shift();
              simplerAttempts++;
            }
          }
        }

        if (placedWords.length === attemptedWordCount) {
          placedSuccessfully = true;
          setWords(placedWords);
          const finalGrid = fillEmptyCells(localGrid);
          setGrid(finalGrid);
          startTimer();
          showFeedback(`Find ${placedWords.length} hidden words!`, 'info');
          retryCountRef.current = 0;
        } else {
          usedWordsRef.current.clear();
          wordList = await generateWordList(config[difficulty], attemptedWordCount);
          wordList.sort((a, b) => b.letters.length - a.letters.length);
          directionCountsRef.current = { horizontal: 0, vertical: 0, diagonal: 0 };
        }
      }

      if (!placedSuccessfully) {
        if (attemptedWordCount > 3) {
          return initGame(attemptedWordCount - 1);
        }
        throw new Error(`Could only place ${placedWords.length} out of ${attemptedWordCount} words after ${maxGameAttempts} attempts`);
      }
    } catch (error) {
      console.error("Game initialization failed:", error);
      setError("Failed to load puzzle. Retrying...");
      retryCountRef.current++;
      if (retryCountRef.current >= config.maxRetries) {
        setError("Failed to load puzzle after multiple attempts. Please try again.");
        setIsLoading(false);
        return;
      }
      setTimeout(() => {
        const staticWords = [
          'CAT', 'DOG', 'HAT', 'PEN', 'SUN', 'TWO',
          'BOOK', 'GAME', 'TREE', 'FISH', 'MOON', 'STAR',
          'RIVER', 'HOUSE', 'CLOUD', 'STONE', 'WIND', 'PATH'
        ].filter(word => word.length >= config[difficulty].minWordLength && word.length <= config[difficulty].maxWordLength);
        const uniqueStaticWords = [...new Set(staticWords)].filter(word => !usedWordsRef.current.has(word));
        const finalWords = shuffleArray(uniqueStaticWords).slice(0, attemptedWordCount)
          .map(word => ({ word, letters: word.split('') }));
        setWords(finalWords.sort((a, b) => b.letters.length - a.letters.length));
        initGame(attemptedWordCount);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  // Selection handling
  const startSelection = (index: number) => {
    setIsSelecting(true);
    setSelectedCells([index]);
    startCellRef.current = index;
    playSound('select');
  };

  const continueSelection = (index: number) => {
    if (!isSelecting || !startCellRef.current || selectedCells.includes(index)) return;

    const size = config[difficulty].gridCols;
    const startIndex = startCellRef.current;
    const startRow = Math.floor(startIndex / size);
    const startCol = startIndex % size;
    const currentRow = Math.floor(index / size);
    const currentCol = index % size;

    const rowDiff = currentRow - startRow;
    const colDiff = currentCol - startCol;

    // Determine direction
    let direction = '';
    if (Math.abs(rowDiff) <= 0 && Math.abs(colDiff) > 0) {
      direction = 'horizontal';
    } else if (Math.abs(colDiff) <= 0 && Math.abs(rowDiff) > 0) {
      direction = 'vertical';
    } else if (Math.abs(rowDiff) === Math.abs(colDiff)) {
      direction = 'diagonal';
    } else {
      return; // Not a straight line
    }

    // Calculate all cells in this direction
    const newSelectedCells = [startIndex];
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
    const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
    const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;

    for (let i = 1; i <= steps; i++) {
      const r = startRow + i * rowStep;
      const c = startCol + i * colStep;
      if (r >= 0 && r < config[difficulty].gridRows && c >= 0 && c < config[difficulty].gridCols) {
        newSelectedCells.push(r * size + c);
      }
    }

    setSelectedCells(newSelectedCells);
  };

  const endSelection = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    checkSelectedWord();
    startCellRef.current = null;
  };

  const checkSelectedWord = () => {
    if (selectedCells.length < config[difficulty].minWordLength) {
      playSound('error');
      setSelectedCells([]);
      return;
    }

    const selectedWord = selectedCells.map(index => grid[index].letter).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
    const selectedUpper = selectedWord.toUpperCase();
    const reversedUpper = reversedWord.toUpperCase();

    const matchedWordObj = words.find(wordObj =>
      (wordObj.word.toUpperCase() === selectedUpper || wordObj.word.toUpperCase() === reversedUpper) &&
      !foundWords.includes(wordObj.word)
    );

    if (matchedWordObj) {
      setFoundWords(prev => [...prev, matchedWordObj.word]);
      playSound('found');

      const colorIndex = foundWords.length % 4;
      const colors = [
        'rgba(122, 255, 195, 0.7)',
        'rgba(142, 196, 250, 0.7)',
        'rgba(255, 216, 117, 0.7)',
        'rgba(255, 158, 232, 0.7)'
      ];

      const orderedCells = matchedWordObj.word.toUpperCase() === reversedUpper ?
        [...selectedCells].reverse() : selectedCells;

      const newGrid = grid.map((cell, index) => {
        if (orderedCells.includes(index)) {
          const element = cell.element || document.querySelector(`[data-index="${index}"]`);
          if (element) {
            const currentBg = element instanceof HTMLElement ? element.style.backgroundColor : '';
            if (currentBg && currentBg !== 'transparent') {
              element.style.backgroundColor = colors[colorIndex];
              element.style.boxShadow = `inset 0 0 0 2px ${currentBg}`;
            } else {
              element.style.backgroundColor = colors[colorIndex];
            }
            element.classList.add('found');
          }
          return { ...cell, element };
        }
        return cell;
      });
      setGrid(newGrid);

      showFeedback(`Found: ${matchedWordObj.word}`, 'success');

      if (foundWords.length + 1 === words.length) {
        handleGameWin();
      }
    } else {
      playSound('error');
      showFeedback('Word not found in list', 'error');
    }

    setSelectedCells([]);
  };

  const handleGameWin = () => {
    playSound('win');
    showConfetti();

    const newConsecutiveWins = consecutiveWins + 1;
    const newCurrentLevel = currentLevel + 1;
    let levelUp = false;
    let message = '';
    let newDifficulty = difficulty;

    if (newConsecutiveWins >= 3) {
      if (difficulty === 'easy') {
        newDifficulty = 'medium';
        levelUp = true;
        message = `🎉 Advanced to Medium level! 🎉`;
      } else if (difficulty === 'medium') {
        newDifficulty = 'hard';
        levelUp = true;
        message = `🏆 Advanced to Hard level! 🏆`;
      } else {
        message = `👑 Mastered Hard level! Continuing at max difficulty. 👑`;
      }
      if (levelUp) {
        setTimeout(() => showConfetti({ particleCount: 200, spread: 100 }), 1000);
      }
    } else {
      message = `🎊 Level ${newCurrentLevel} UnLocked! 🎊`;
    }

    // Update state first
    setCurrentLevel(newCurrentLevel);
    setConsecutiveWins(levelUp ? 0 : newConsecutiveWins);
    if (levelUp) {
      setDifficulty(newDifficulty);
    }
    
    setVictoryMessage(message);
    setShowVictory(true);

    let count = 5;
    setCountdown(count);
    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(countdownInterval);
        setShowVictory(false);
        // Only initialize game after countdown if we didn't level up
        // (level up already triggers initGame via useEffect)
        if (!levelUp) {
          initGame();
        }
      }
    }, 1000);
  };

  const giveHint = () => {
    const remainingWords = words.filter(wordObj => !foundWords.includes(wordObj.word));
    if (remainingWords.length > 0) {
      const hintWordObj = remainingWords[Math.floor(Math.random() * remainingWords.length)];
      const hint = hintWordObj.word.slice(0, 2);
      showFeedback(`Try looking for a word starting with ${hint}...`, 'info');
    } else {
      showFeedback('You found all words!', 'success');
    }
  };

  // Calculate cell size based on screen width
  const calculateCellSize = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxWidth = typeof window !== 'undefined' ? window.innerWidth - 32 : 760; // Reduced padding to 16px per side
    const minCellSize = isMobile ? 28 : 36; // Increased minCellSize for better touch targets (28px for mobile, 36px for desktop)
    const calculatedSize = Math.floor(maxWidth / config[difficulty].gridCols);
    return Math.max(minCellSize, Math.min(calculatedSize, 30)); // Cap max cell size at 40px to prevent oversized cells
  };

  const [cellSize, setCellSize] = useState(calculateCellSize());

  useEffect(() => {
    const handleResize = () => {
      setCellSize(calculateCellSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [difficulty]);

  return (
    <div className="word-game-card max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="word-game-meta flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Word Search</h1>
          <div className="text-sm text-gray-600">
            Level: {currentLevel} ({difficulty})
            {difficulty !== 'hard' ? (
              consecutiveWins < 3 ? ` • Wins to next difficulty: ${3 - consecutiveWins}` : ' • Ready to advance!'
            ) : ' • Max difficulty!'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            ⏱️ {formatTime(timer)}
          </div>
          <div className="font-bold text-blue-600 text-sm">
            Words: {words.length - foundWords.length}/{words.length}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="p-3 rounded mb-4 bg-blue-100 text-blue-800 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800"></div>
            <div>Creating your puzzle...</div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded mb-4 bg-red-100 text-red-800 text-center">
          <div className="flex items-center justify-center gap-2">
            <div>{retryCountRef.current >= config.maxRetries ? '❌' : '⚠️'}</div>
            <div>{error}</div>
          </div>
          {retryCountRef.current >= config.maxRetries && (
            <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded" onClick={() => initGame()}>Try Again</button>
          )}
        </div>
      )}

      <div
        ref={gridRef}
        className="wordsearch-grid mb-2 bg-gray-100 rounded-md mx-auto" // Reduced margin-bottom here
        style={{
          gridTemplateColumns: `repeat(${config[difficulty].gridCols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${config[difficulty].gridRows}, ${cellSize}px)`,
          width: `${cellSize * config[difficulty].gridCols}px`,
          height: `${cellSize * config[difficulty].gridRows}px`,
          display: 'grid',
          overflow: 'hidden'
        }}
      >
        {grid.map((cell, index) => (
          <div
            key={index}
            data-index={index}
            className={`wordsearch-cell flex items-center justify-center cursor-pointer select-none
              ${selectedCells.includes(index) ? 'bg-blue-200' : cell.element?.classList.contains('found') ? 'found' : 'bg-white hover:bg-gray-50'}`}
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              fontSize: `${Math.max(12, cellSize * 0.6)}px`,
              userSelect: 'none',
              touchAction: 'none'
            }}
            onMouseDown={() => startSelection(index)}
            onMouseEnter={() => continueSelection(index)}
            onMouseUp={endSelection}
            onTouchStart={(e) => {
              e.preventDefault();
              startSelection(index);
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              const target = document.elementFromPoint(touch.clientX, touch.clientY);
              if (target && target.classList.contains('wordsearch-cell')) {
                const index = parseInt(target.getAttribute('data-index') || '');
                if (!isNaN(index)) continueSelection(index);
              }
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              endSelection();
            }}
          >
            {cell.letter}
          </div>
        ))}
      </div>

      {/* Feedback moved below the grid */}
      {feedback.message && !isLoading && (
        <div className={`mb-4 p-3 rounded text-center ${
          feedback.type === 'error' ? 'bg-red-100 text-red-800' : 
          feedback.type === 'success' ? 'bg-green-100 text-green-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {feedback.message}
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Words to Find:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 sm:gap-2 max-h-40 overflow-y-auto">
          {words
            .sort((a, b) => a.word.localeCompare(b.word))
            .map((wordObj, i) => (
              <div
                key={i}
                className={`p-1 text-sm sm:text-base ${foundWords.includes(wordObj.word) ? 'hidden' : 'text-gray-800'}`}
              >
                {wordObj.word}
              </div>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => initGame()}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm sm:text-base"
          disabled={isLoading}
        >
          New Game
        </button>
        <button
          onClick={giveHint}
          className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded text-sm sm:text-base"
          disabled={isLoading}
        >
          Hint
        </button>
      </div>

      {showVictory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Victory!</h2>
            <p className="mb-2">{victoryMessage}</p>
            <p className="mb-4">Words Found: {foundWords.length}</p>
            <div className="text-center text-gray-600">
              Next level in {countdown}...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}