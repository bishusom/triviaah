'use client';
import { event } from '@/lib/gtag';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useSound } from '@/app/context/SoundContext';
import commonStyles from '@styles/WordGames/WordGames.common.module.css';
import gameStyles from '@styles/WordGames/BoggleGame.module.css'; 

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
  };
  minWordLength: {
    easy: number;
    medium: number;
    hard: number;
  };
  maxWordLength: {
    easy: number;
    medium: number;
    hard: number;
  };
  timeLimit: {
    easy: number;
    medium: number;
    hard: number;
  };
  scorePerLetter: {
    easy: number;
    medium: number;
    hard: number;
  };
  winThreshold: {
    easy: number;
    medium: number;
    hard: number;
  };
  vowelPercentage: {
    easy: number;
    medium: number;
    hard: number;
  };
}

interface DifficultyLevel {
  difficulty: 'easy' | 'medium' | 'hard';
  wordLength: [number, number];
  games: number;
  timeLimit: number;
}

interface ExtendedLevel {
  level: number;
  winThreshold: number;
  timeLimit: number;
  minWordLength: number;
  scoreMultiplier: number;
}

export default function BoggleGame() {
  // Refs
  const gridElement = useRef<HTMLDivElement>(null);
  const timeElement = useRef<HTMLSpanElement>(null);
  const scoreElement = useRef<HTMLSpanElement>(null);
  const levelElement = useRef<HTMLSpanElement>(null);
  const gamesRemainingElement = useRef<HTMLSpanElement>(null);

  // Game state
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [consecutiveWins, setConsecutiveWins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(180);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isSelecting, setIsSelecting] = useState(false);
  const [usedLetters, setUsedLetters] = useState<Set<number>>(new Set());
  const [wordCache, setWordCache] = useState<Map<string, boolean>>(new Map());
  const [extendedLevels, setExtendedLevels] = useState<ExtendedLevel[]>([]);
  const [currentExtendedLevel, setCurrentExtendedLevel] = useState(0);

  const timerInterval = useRef<NodeJS.Timeout| null>(null)

  // Game configuration
  const config: GameConfig = {
    gridSize: {
      easy: 4,
      medium: 5,
      hard: 5
    },
    minWordLength: {
      easy: 3,
      medium: 3,
      hard: 3
    },
    maxWordLength: {
      easy: 4,
      medium: 4,
      hard: 5
    },
    timeLimit: {
      easy: 240,
      medium: 300,
      hard: 360
    },
    scorePerLetter: {
      easy: 10,
      medium: 15,
      hard: 20
    },
    winThreshold: {
      easy: 100,
      medium: 200,
      hard: 300
    },
    vowelPercentage: {
      easy: 0.4,
      medium: 0.35,
      hard: 0.3
    }
  };

  const levels: DifficultyLevel[] = [
    { difficulty: 'easy', wordLength: [4, 5], games: 3, timeLimit: 180 },
    { difficulty: 'medium', wordLength: [5, 6], games: 3, timeLimit: 240 },
    { difficulty: 'hard', wordLength: [6, 7], games: 3, timeLimit: 300 }
  ];

  // Common words for fallback
  const commonWords = [
    'CAT', 'DOG', 'HAT', 'RUN', 'SUN', 'PEN', 'RED', 'BLUE', 'TREE', 'BIRD',
    'FISH', 'STAR', 'MOON', 'PLAY', 'BOOK', 'FOOD', 'GOOD', 'LOVE', 'HOME', 'TIME',
    'BALL', 'GAME', 'CARS', 'SHIP', 'WIND', 'RAIN', 'SNOW', 'FIRE', 'WAVE', 'HILL',
    'HOUSE', 'TABLE', 'CHAIR', 'WINDOW', 'DOOR', 'FLOOR'
  ].map(word => word.toUpperCase());

  const { isMuted } = useSound();

  const isTouchDevice = useRef(false);

  // Initialize game on mount
   useEffect(() => {
    // Detect if it's a touch device
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'boggle_started', category: 'boggle',label: 'boggle'});
        clearInterval(checkGtag);
      }
    }, 100)

    const generateExtendedLevels = () => {
      const levels: ExtendedLevel[] = [];
      for (let i = 0; i < 20; i++) {
        levels.push({
          level: i + 5,
          winThreshold: 300 + (i * 50),
          timeLimit: Math.max(120, 300 - (i * 5)),
          minWordLength: 3 + Math.floor(i / 5),
          scoreMultiplier: 1 + (i * 0.1)
        });
      }
      return levels;
    };

    setExtendedLevels(generateExtendedLevels());
    loadGameState();
    initGame();

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
      }, []);

  // Regenerate grid when difficulty or level changes
  useEffect(() => {
    generateGrid();
  }, [difficulty, currentLevel]);

  // Add selection line effect
  useEffect(() => {
  const updateSelectionLine = () => {
    const existingLines = document.querySelectorAll(`.${gameStyles.selectionLine}`);
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
      line.className = gameStyles.selectionLine;
      line.style.width = `${length}px`;
      line.style.transform = `rotate(${angle}deg)`;
      line.style.left = `${startX}px`;
      line.style.top = `${startY}px`;
      
      gridEl.appendChild(line);
    }
  };

  updateSelectionLine();
  }, [selectedCells, grid, gameStyles.selectionLine]);

  // Load game state from localStorage
  const loadGameState = () => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('boggleGameState');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          if (['easy', 'medium', 'hard'].includes(parsed.difficulty) &&
              typeof parsed.consecutiveWins === 'number' &&
              typeof parsed.currentLevel === 'number') {
            setDifficulty(parsed.difficulty);
            setConsecutiveWins(parsed.consecutiveWins);
            setCurrentLevel(parsed.currentLevel);
          }
        } catch (e) {
          console.error('Invalid saved game state', e);
        }
      }
    }
  };

  // Save game state to localStorage
  const saveGameState = () => {
    const gameState = {
      difficulty,
      consecutiveWins,
      currentLevel,
      currentExtendedLevel
    };
    localStorage.setItem('boggleGameState', JSON.stringify(gameState));
  };

  // Initialize game
  const initGame = () => {
    if (timerInterval.current !== null) {
      window.clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
    
    if (currentLevel >= 4 && extendedLevels[currentExtendedLevel]) {
      setTimer(extendedLevels[currentExtendedLevel].timeLimit);
    } else {
      setTimer(config.timeLimit[difficulty]);
    }
    
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

    const minLen = currentLevel >= 4 
      ? extendedLevels[currentExtendedLevel]?.minWordLength || config.minWordLength[difficulty]
      : config.minWordLength[difficulty];
      
    const maxLen = config.maxWordLength[difficulty];
    
    showFeedback({
      message: `How to Play Boggle: Find words by selecting adjacent letters.\nWords must be ${minLen}-${maxLen} letters long.\nScore ${config.scorePerLetter[difficulty]} points per letter. Reach ${currentLevel >= 4 ? extendedLevels[currentExtendedLevel]?.winThreshold : config.winThreshold[difficulty]} points to win!`,
      type: 'info'
    });
  };

  // Generate game grid
  const generateGrid = () => {
    const size = config.gridSize[difficulty];
    const vowels = 'AEIOU';
    const minVowels = Math.ceil(size * size * config.vowelPercentage[difficulty]);
    let vowelCount = 0;

    // Create letter pool
    const letterPool: string[] = [];
    
    // Add letters from common words
    commonWords.forEach(word => {
      word.split('').forEach(letter => letterPool.push(letter));
    });

    // Add vowels to ensure enough vowels are available
    for (let i = 0; i < 30; i++) {
      letterPool.push(vowels[Math.floor(Math.random() * vowels.length)]);
    }

    // Add common consonants
    const commonConsonants = 'BCDFGHJKLMNPQRSTVWXYZ';
    for (let i = 0; i < 40; i++) {
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
    while (vowelCount < minVowels) {
      const consonantIndices = newGrid
        .map((cell, idx) => (!vowels.includes(cell.letter) ? idx : -1))
        .filter(idx => idx !== -1);
      
      if (consonantIndices.length > 0) {
        const randomIndex = consonantIndices[Math.floor(Math.random() * consonantIndices.length)];
        newGrid[randomIndex].letter = vowels[Math.floor(Math.random() * vowels.length)];
        vowelCount++;
      } else {
        break;
      }
    }

    setGrid(newGrid);
  };

  // Handle cell interaction
  const handleCellInteraction = (index: number, action: 'start' | 'continue' | 'end') => {
    switch (action) {
      case 'start':
        setIsSelecting(true);
        setSelectedCells([index]);
        setUsedLetters(new Set([index]));
        highlightAdjacentCells(index);
        playSound('select');
        break;
        
      case 'continue':
        if (!isSelecting || selectedCells.length === 0) return;
        if (usedLetters.has(index)) return;
        
        const lastIndex = selectedCells[selectedCells.length - 1];
        if (isAdjacent(lastIndex, index)) {
          setSelectedCells(prev => [...prev, index]);
          setUsedLetters(prev => new Set(prev).add(index));
          highlightAdjacentCells(index);
        }
        break;
        
      case 'end':
        if (!isSelecting) return;
        setIsSelecting(false);
        
        if (selectedCells.length >= 2) {
          checkSelectedWord();
        }
        // Don't clear selectedCells here - let checkSelectedWord handle it
        break;
    }
  };

  // Check if two cells are adjacent
  const isAdjacent = (index1: number, index2: number) => {
    const size = config.gridSize[difficulty];
    const pos1 = { row: Math.floor(index1 / size), col: index1 % size };
    const pos2 = { row: Math.floor(index2 / size), col: index2 % size };

    const rowDiff = Math.abs(pos2.row - pos1.row);
    const colDiff = Math.abs(pos2.col - pos1.col);

    return (rowDiff <= 1 && colDiff <= 1) && !(rowDiff === 0 && colDiff === 0);
  };

  // Highlight adjacent cells
  const highlightAdjacentCells = (currentIndex: number) => {
    // This would be handled by CSS classes in the component
  };

  // Check selected word
  const checkSelectedWord = async () => {
    const minWordLength = currentLevel >= 4 
    ? extendedLevels[currentExtendedLevel]?.minWordLength || config.minWordLength[difficulty]
    : config.minWordLength[difficulty];

  if (selectedCells.length < minWordLength) {
    showFeedback({ message: `Word too short (min ${minWordLength} letters)`, type: 'error' });
    setSelectedCells([]);
    return;
  }

  const selectedWord = selectedCells.map(index => grid[index].letter).join('');
    if (foundWords.has(selectedWord)) {
      showFeedback({ message: 'Word already found', type: 'error' });
      setSelectedCells([]);
      return;
    }

    try {
      let isValid = false;
      if (wordCache.has(selectedWord.toLowerCase())) {
        isValid = wordCache.get(selectedWord.toLowerCase())!;
      } else {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedWord.toLowerCase()}`);
        isValid = response.ok;
        setWordCache(prev => new Map(prev).set(selectedWord.toLowerCase(), isValid));
      }

      if (isValid) {
        const newFoundWords = new Set(foundWords);
        newFoundWords.add(selectedWord);
        setFoundWords(newFoundWords);

        const scoreMultiplier = currentLevel >= 4 
          ? extendedLevels[currentExtendedLevel]?.scoreMultiplier || 1 
          : 1;
        
        const points = Math.floor(selectedWord.length * config.scorePerLetter[difficulty] * scoreMultiplier);
        setScore(prev => prev + points);

        setGrid(prev => 
          prev.map((cell, idx) => 
            selectedCells.includes(idx) ? { ...cell, found: true } : cell
          )
        );

        showFeedback({ message: `Found: ${selectedWord} (+${points} points)`, type: 'success' });
        playSound('correct');

        const winThreshold = currentLevel >= 4 
          ? extendedLevels[currentExtendedLevel]?.winThreshold || config.winThreshold[difficulty]
          : config.winThreshold[difficulty];

        if (score + points >= winThreshold) {
          handleGameWin();
        }
      } else {
        showFeedback({ message: 'Not a valid word', type: 'error' });
        playSound('error');
      }
    } catch (error) {
      console.error('Error checking word:', error);
      if (commonWords.includes(selectedWord)) {
        const newFoundWords = new Set(foundWords);
        newFoundWords.add(selectedWord);
        setFoundWords(newFoundWords);

        const points = selectedWord.length * config.scorePerLetter[difficulty];
        setScore(prev => prev + points);
        showFeedback({ message: `Found: ${selectedWord} (+${points} points)`, type: 'success' });
        playSound('found');
      } else {
        showFeedback({ message: 'Error checking word, try another', type: 'error' });
        playSound('error');
      }
    }

    setSelectedCells([]);
    setIsSelecting(false);
  };

  // Handle game win
  const handleGameWin = () => {
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

    // Play win sound
    playSound('win');

    const confettiConfig = {
      particleCount: difficulty === 'hard' ? 300 : 200,
      spread: difficulty === 'hard' ? 120 : 100,
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    };

    fireConfetti(confettiConfig);
    setTimeout(() => fireConfetti({ ...confettiConfig, origin: { x: 0.25, y: 0.5 } }), 300);
    setTimeout(() => fireConfetti({ ...confettiConfig, origin: { x: 0.75, y: 0.5 } }), 600);

    const newConsecutiveWins = consecutiveWins + 1;
    setConsecutiveWins(newConsecutiveWins);

    let newDifficulty = difficulty;
    let newLevel = currentLevel;
    let newExtendedLevel = currentExtendedLevel;

    if (currentLevel >= 4) {
      if (currentExtendedLevel < extendedLevels.length - 1) {
        newExtendedLevel = currentExtendedLevel + 1;
        setCurrentExtendedLevel(newExtendedLevel);
      }
    } else {
      if (newConsecutiveWins >= 3) {
        if (difficulty === 'easy') {
          newDifficulty = 'medium';
        } else if (difficulty === 'medium') {
          newDifficulty = 'hard';
        }
        newLevel++;
        setConsecutiveWins(0);
      }
    }

    setDifficulty(newDifficulty);
    setCurrentLevel(newLevel);
    saveGameState();

    let victoryMessage = '';
    if (currentLevel >= 4) {
      victoryMessage = `🌟 ${randomMessage} (Level ${extendedLevels[currentExtendedLevel]?.level || currentLevel}) 🌟`;
    } else {
      victoryMessage = difficulty === 'hard' 
        ? '🎊 Great job in tackling this hard level! 🎊' 
        : `🎊 Great job! ${3 - newConsecutiveWins} more wins to advance. 🎊`;
    }

    showFeedback({
      message: victoryMessage,
      type: 'success'
    });

    // Increase delay to 5 seconds to let players see the message
    setTimeout(() => {
      initGame();
    }, 5000);
  };

  // Start timer
  const startTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }

    timerInterval.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 0) {
          clearInterval(timerInterval.current!);
          showFeedback({ message: 'Time\'s up!', type: 'error' });
          setTimeout(initGame, 2000);
          return 0;
        }
        return prev - 1;
      });
      updateTimer();
    }, 1000);
  };

  // Update timer display
  const updateTimer = () => {
    if (!timeElement.current) return;
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timeElement.current.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Update score display
  const updateScore = () => {
    if (!scoreElement.current) return;
    scoreElement.current.textContent = `Score: ${score}`;
  };

  // Update level info
  const updateLevelInfo = () => {
    if (!levelElement.current || !gamesRemainingElement.current) return;
    
    if (currentLevel >= 4) {
      levelElement.current.textContent = `Level: ${extendedLevels[currentExtendedLevel]?.level || currentLevel} (${difficulty}+)`;
      gamesRemainingElement.current.textContent = `Next level: ${extendedLevels[currentExtendedLevel]?.winThreshold || 300} points`;
    } else {
      levelElement.current.textContent = `Level: ${currentLevel} (${difficulty})`;
      if (difficulty !== 'hard') {
        const winsNeeded = 3 - consecutiveWins;
        gamesRemainingElement.current.textContent = winsNeeded > 0
          ? `Wins to next difficulty: ${winsNeeded}`
          : 'Ready to advance difficulty!';
      } else {
        gamesRemainingElement.current.textContent = 'Max difficulty reached!';
      }
    }
  };

  // Show feedback
  const showFeedback = ({ message, type }: { message: string; type: 'success' | 'error' | 'info' }) => {
    setFeedback({ message, type });
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
      showFeedback({ message: `Hint: Try finding a word starting with ${hint[0]}`, type: 'success' });
    } else {
      showFeedback({ message: "No hints available", type: 'error' });
    }
  };

  // Play sound
  const playSound = (type: string) => {
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
  };

  // Confetti effect
  const fireConfetti = (options = {}) => {
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
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={commonStyles.container} style={{ touchAction: 'none', overflow: 'hidden' }}>
      <div className={commonStyles.header}>
        <div>
          <h1 className={commonStyles.title}>Boggle Game</h1>
          <div className={commonStyles.levelText}>
            {currentLevel >= 4 
              ? `Level: ${extendedLevels[currentExtendedLevel]?.level || currentLevel} (${difficulty}+)`
              : `Level: ${currentLevel} (${difficulty})`}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={commonStyles.timerContainer}>
            ⏱️ {formatTime(timer)}
          </div>
          <div className={commonStyles.scoreText}>
            Score: {score}
          </div>
        </div>
      </div>

      <div className="mb-6" style={{ overflow: 'hidden' }}>
        <div ref={gridElement} className={gameStyles.gridContainer} style={{ overflow: 'hidden' }}>
          <div 
            className={gameStyles.grid}
            style={{ 
              gridTemplateColumns: `repeat(${config.gridSize[difficulty]}, 1fr)`,
              gridTemplateRows: `repeat(${config.gridSize[difficulty]}, 1fr)`,
              touchAction: 'none'
            }}
          >
            {grid.map((cell, index) => (
              <button
                key={index}
                className={`${gameStyles.cell} ${
                  selectedCells.includes(index) ? gameStyles.cellSelected : ''
                } ${
                  selectedCells[selectedCells.length - 1] === index ? gameStyles.cellHighlight : ''
                } ${
                  cell.found ? gameStyles.cellFound : ''
                }`}
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
                  
                  if (element && element.classList.contains(gameStyles.cell)) {
                    const cells = Array.from(gridElement.current?.querySelectorAll(`.${gameStyles.cell}`) || []);
                    const idx = cells.indexOf(element);
                    if (idx >= 0) {
                      handleCellInteraction(idx, 'continue');
                    }
                  }
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleCellInteraction(index, 'end');
                }}
                onContextMenu={(e) => e.preventDefault()}
              >
                {cell.letter}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback message */}
        <div className={`${commonStyles.feedback} ${
          feedback.type === 'error' ? commonStyles.feedbackError : 
          feedback.type === 'success' ? commonStyles.feedbackSuccess : 
          commonStyles.feedbackInfo
        }`}>
          {feedback.message}
        </div>
      </div>

      <div className={commonStyles.actionButtons}>
        <button 
          onClick={handleNewGame}
          className={`${commonStyles.actionButton} ${commonStyles.playAgainButton}`}
        >
          New Game
        </button>
        <button 
          onClick={handleHint}
          className={`${commonStyles.actionButton} ${commonStyles.hintButton}`}
        >
          Hint
        </button>
      </div>

      {foundWords.size > 0 && (
        <div className={gameStyles.foundWordsContainer}>
          <h3 className={gameStyles.foundWordsTitle}>Found Words:</h3>
          <div className={gameStyles.foundWordsList}>
            {Array.from(foundWords).sort().map((word, i) => (
              <span key={i} className={gameStyles.wordPill}>
                {word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}