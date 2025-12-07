'use client';
import { event } from '@/lib/gtag';
import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { createClient } from '@supabase/supabase-js';
import { useSound } from '@/context/SoundContext';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const buttonStyle = "px-6 md:px-8 py-2 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] text-center";

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
  [key: string]: number;
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
  const [gridKey, setGridKey] = useState(0); // Unique key for grid to force re-render

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const usedWordsRef = useRef<Set<string>>(new Set());
  const directionCountsRef = useRef<DirectionCounts>({ horizontal: 0, vertical: 0, diagonal: 0 });
  const retryCountRef = useRef(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const startCellRef = useRef<number | null>(null);

  // Calculate cell size based on screen width
  const calculateCellSize = useCallback(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxWidth = typeof window !== 'undefined' ? window.innerWidth - 32 : 760;
    const minCellSize = isMobile ? 28 : 36;
    const calculatedSize = Math.floor(maxWidth / config[difficulty].gridCols);
    return Math.max(minCellSize, Math.min(calculatedSize, 30));
  }, [difficulty]);

  const [cellSize, setCellSize] = useState(calculateCellSize());

  useEffect(() => {
    const handleResize = () => {
      setCellSize(calculateCellSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateCellSize]);

  useEffect(() => {
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'word_search_started', category: 'word_search', label: difficulty,
              game_type: 'word_search',level: currentLevel });
        clearInterval(checkGtag);
      }
    }, 100);

    return () => clearInterval(checkGtag);
  }, [currentLevel, difficulty]);

  useEffect(() => {
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
        case 0: c += i; break;
        case 1: r += i; break;
        case 2: r += i; c += i; break;
        case 3: r -= i; c += i; break;
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
      letter: (cell.letter || alphabet[Math.floor(Math.random() * alphabet.length)]).toUpperCase()
    }));
  };

  // Word generation
  const generateWordList = async (diffConfig: GameConfig, limitOverride: number | null = null) => {
    try {
      const randomFloor = Math.floor(Math.random() * 900000);
      const xlimit = limitOverride || diffConfig.wordCount;
      
      // Supabase query
      const { data, error } = await supabase
        .from('dictionary')
        .select('word, letters')
        .gte('length', diffConfig.minWordLength)
        .lte('length', diffConfig.maxWordLength)
        .gte('random_index', randomFloor)
        .order('random_index')
        .limit(xlimit * 2);

      if (error) throw error;

      const wordPoolSet = new Set<string>();
      const wordData: WordObj[] = [];

      (data || []).forEach(item => {
        const word = item.word.toUpperCase();
        if (!usedWordsRef.current.has(word)) {
          wordPoolSet.add(word);
          wordData.push({ 
            word, 
            letters: item.letters || word.split('').map((l: string) => l.toUpperCase()) 
          });
        }
      });

      if (wordPoolSet.size === 0) {
        throw new Error("No valid words found in Supabase");
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
    setIsLoading(true);
    setError('');
    setFeedback({ message: '', type: '' });
    setFoundWords([]);
    setSelectedCells([]);
    setIsSelecting(false);
    setGridKey(prev => prev + 1); // Increment gridKey to force re-render

    // Reset styles of existing grid cells
    grid.forEach(cell => {
      if (cell.element) {
        cell.element.style.backgroundColor = '';
        cell.element.style.boxShadow = '';
        cell.element.classList.remove('bg-green-500/90');
      }
    });

    try {
      const diffConfig = config[difficulty];
      const newWords = await generateWordList(diffConfig, attemptedWordCount);
      if (newWords.length === 0) {
        throw new Error('No words could be generated');
      }

      let newGrid: Cell[] = Array(diffConfig.gridRows * diffConfig.gridCols)
        .fill(null)
        .map(() => ({ letter: '', word: null, element: null }));

      directionCountsRef.current = { horizontal: 0, vertical: 0, diagonal: 0 };
      const directionQuotas: DirectionCounts = {
        horizontal: Math.ceil(newWords.length / 3),
        vertical: Math.ceil(newWords.length / 3),
        diagonal: Math.ceil(newWords.length / 3)
      };

      let totalAttempts = 0;
      for (const wordObj of newWords) {
        let wordPlaced = false;
        const currentGrid = [...newGrid];

        while (!wordPlaced && totalAttempts < config.maxTotalAttempts) {
          const result = tryPlaceWord(currentGrid, wordObj, directionQuotas);
          totalAttempts++;
          if (result.success) {
            newGrid = result.grid;
            wordPlaced = true;
            usedWordsRef.current.add(wordObj.word);
          } else if (totalAttempts >= config.maxTotalAttempts) {
            if (retryCountRef.current < config.maxRetries) {
              retryCountRef.current++;
              setTimeout(() => initGame(attemptedWordCount - 1), 0);
              setError(`Could not place all words, retrying with ${attemptedWordCount - 1} words... (${retryCountRef.current}/${config.maxRetries})`);
              return;
            } else {
              setError('Failed to generate a valid puzzle after maximum retries.');
              setIsLoading(false);
              return;
            }
          }
        }
      }

      newGrid = fillEmptyCells(newGrid);
      setGrid(newGrid);
      setWords(newWords);
      setIsLoading(false);
      showFeedback('Find all the words in the grid!', 'info');
      startTimer();
    } catch (error) {
      console.error('Game initialization error:', error);
      setError('Failed to initialize the game. Please try again.');
      setIsLoading(false);
    }
  };

  // Load saved state
  useEffect(() => {
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
      initGame();
    }
  }, [initGame, difficulty]);

  // Selection handlers - COPIED FROM DARK VERSION
  const startSelection = (index: number) => {
    if (isLoading) return;
    setIsSelecting(true);
    setSelectedCells([index]);
    startCellRef.current = index;
    playSound('select');
  };

  const continueSelection = (index: number) => {
    if (!isSelecting || !startCellRef.current) return;

    const size = config[difficulty].gridCols;
    const startRow = Math.floor(startCellRef.current / size);
    const startCol = startCellRef.current % size;
    const endRow = Math.floor(index / size);
    const endCol = index % size;

    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;
    
    // For first row specifically, ensure horizontal selection works correctly
    let direction = '';
    
    if (rowDiff === 0 && Math.abs(colDiff) > 0) {
      direction = 'horizontal';
    } else if (colDiff === 0 && Math.abs(rowDiff) > 0) {
      direction = 'vertical';
    } else if (Math.abs(rowDiff) === Math.abs(colDiff) && rowDiff !== 0) {
      direction = 'diagonal';
    } else {
      return;
    }

    const newSelectedCells = [startCellRef.current];
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
    const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
    const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;

    for (let i = 1; i <= steps; i++) {
      const r = startRow + i * rowStep;
      const c = startCol + i * colStep;
      
      // Ensure we don't go out of bounds
      if (r >= 0 && r < config[difficulty].gridRows && c >= 0 && c < config[difficulty].gridCols) {
        const cellIndex = r * size + c;
        // Ensure we don't add duplicates
        if (!newSelectedCells.includes(cellIndex)) {
          newSelectedCells.push(cellIndex);
        }
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
          if (element instanceof HTMLElement) {
            element.style.backgroundColor = colors[colorIndex];
            element.classList.add('bg-green-500/90');
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
    
    // Add a small delay before showing confetti and victory message
    setTimeout(() => {
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
          if (!levelUp) {
            initGame();
          }
        }
      }, 1000);
    }, 500); // 500ms delay
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 p-4 md:p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 p-4 bg-white/70 rounded-xl backdrop-blur-sm border border-gray-200 shadow-lg">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Word Search
            </h1>
            <div className="text-sm md:text-base text-gray-600 mt-1">
              Level: {currentLevel} ({difficulty})
              {difficulty !== 'hard' ? (
                consecutiveWins < 3 ? ` • Wins to next difficulty: ${3 - consecutiveWins}` : ' • Ready to advance!'
              ) : ' • Max difficulty!'}
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="bg-white/90 px-4 py-2 rounded-lg border border-gray-300 font-bold text-lg shadow-sm">
              ⏱️ {formatTime(timer)}
            </div>
            <div className="bg-white/90 px-4 py-2 rounded-lg border border-gray-300 font-bold text-lg shadow-sm">
              Words: {words.length - foundWords.length}/{words.length}
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="p-4 rounded-xl mb-6 bg-blue-50 text-blue-700 text-center border border-blue-200 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <div className="text-lg">Creating your puzzle...</div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl mb-6 bg-red-50 text-red-700 text-center border border-red-200 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3">
              <div>{retryCountRef.current >= config.maxRetries ? '❌' : '⚠️'}</div>
              <div>{error}</div>
            </div>
            {retryCountRef.current >= config.maxRetries && (
              <button 
                className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm" 
                onClick={() => initGame()}
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {/* Game Grid */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div
            key={`grid-${gridKey}`}
            ref={gridRef}
            className="grid gap-1 md:gap-2 p-6 bg-white/80 rounded-3xl backdrop-blur-sm border border-gray-300 shadow-2xl"
            style={{
              gridTemplateColumns: `repeat(${config[difficulty].gridCols}, 1fr)`,
              gridTemplateRows: `repeat(${config[difficulty].gridRows}, 1fr)`,
              width: 'fit-content',
              maxWidth: '100%',
              aspectRatio: `${config[difficulty].gridCols} / ${config[difficulty].gridRows}`,
            }}
          >
            {grid.map((cell, index) => (
              <div
                key={`cell-${index}-${gridKey}`}
                data-index={index}
                className={`
                  flex items-center justify-center font-bold text-2xl md:text-3xl
                  transition-all duration-200 select-none rounded-xl
                  border border-gray-300 backdrop-blur-sm
                  ${selectedCells.includes(index)
                    ? 'bg-blue-500 text-white scale-110 shadow-2xl shadow-blue-500/60 z-10 border-blue-400'
                    : foundWords.some(w => grid[index].word === w)
                      ? 'bg-green-500/90 text-white shadow-lg shadow-green-500/50 border-green-400'
                      : 'bg-white hover:bg-gray-100 text-gray-800 border-gray-300'
                  }
                `}
                style={{
                  aspectRatio: '1 / 1',
                  minWidth: '36px',
                  minHeight: '36px',
                }}
                onMouseDown={() => startSelection(index)}
                onMouseEnter={() => continueSelection(index)}
                onMouseUp={endSelection}
                onTouchStart={(e) => { e.preventDefault(); startSelection(index); }}
                onTouchMove={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  const el = document.elementFromPoint(touch.clientX, touch.clientY);
                  if (el?.hasAttribute('data-index')) {
                    continueSelection(parseInt(el.getAttribute('data-index')!, 10));
                  }
                }}
                onTouchEnd={(e) => { e.preventDefault(); endSelection(); }}
              >
                {cell.letter.toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Message - Always reserves space to prevent layout shift */}
        <div className="min-h-20 mb-6 md:mb-8 flex items-center justify-center">
          {feedback.message && !isLoading ? (
            <div
              className={`
                w-full max-w-2xl text-center text-lg font-medium p-4 rounded-xl border backdrop-blur-sm
                transition-all duration-500 ease-out
                animate-in fade-in zoom-in-95
                ${
                  feedback.type === 'error'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : feedback.type === 'success'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }
              `}
            >
              {feedback.message}
            </div>
          ) : (
            <div className="h-20" />
          )}
        </div>

        {/* Words to Find - Now positioned lower on the page */}
        <div className="bg-white/70 rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-gray-200 shadow-lg mb-6">
          <h3 className="text-lg md:text-xl font-bold text-center mb-4 text-gray-700">Words to Find:</h3>
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
            {words
              .sort((a, b) => a.word.localeCompare(b.word))
              .map((wordObj, i) => (
                <div
                  key={i}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium border transition-all duration-300 ${
                    foundWords.includes(wordObj.word) 
                      ? 'bg-green-100 text-green-700 border-green-300 opacity-60 line-through' 
                      : 'bg-white text-gray-800 border-gray-300 shadow-sm'
                  }`}
                >
                  {wordObj.word}
                </div>
              ))}
          </div>
        </div>

         {/* Action Buttons */}
        <div className="flex justify-center gap-4 md:gap-6">
          <button
            onClick={() => initGame()}
            className={`${buttonStyle} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white`}
            disabled={isLoading}
          >
            New Game
          </button>
          <button
            onClick={giveHint}
            className={`${buttonStyle} bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white`}
            disabled={isLoading}
          >
            Hint
          </button>
        </div>

        {/* Victory Modal */}
        {showVictory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-6 md:p-8 max-w-md w-full border border-gray-300 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Victory!
              </h2>
              <p className="text-lg text-center text-gray-700 mb-4">
                {victoryMessage}
              </p>
              <p className="text-center text-gray-600 mb-6">
                Words Found: <span className="font-bold text-green-600">{foundWords.length}</span>
              </p>
              <div className="text-center text-lg text-blue-600 font-mono">
                Next level in {countdown}...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}