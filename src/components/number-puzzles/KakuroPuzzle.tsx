// components/number-puzzles/KakuroPuzzle.tsx
'use client';
import { event } from '@/lib/gtag';
import confetti from 'canvas-confetti';
import { useSound } from '@/context/SoundContext';
import { useEffect, useState, useCallback, useRef } from 'react';

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
type CellType = 'blocked' | 'white';
type Direction = 'across' | 'down';

interface Clue {
  value: number;
  direction: Direction;
  length: number;
  startRow: number;
  startCol: number;
  cells: { row: number; col: number }[];
  id: string;
}

interface Cell {
  type: CellType;
  value: number;
  acrossClueId: string | null;
  downClueId: string | null;
  isEditable: boolean;
  isError: boolean;
  isHighlighted: boolean;
  row: number;
  col: number;
}

interface Run {
  row?: number;
  col?: number;
  start: number;
  end: number;
}

interface GameState {
  board: Cell[][];
  solution: number[][];
  difficulty: Difficulty;
  selectedCell: { row: number; col: number } | null;
  timeElapsed: number;
  isComplete: boolean;
  isPaused: boolean;
  totalClues: number;
  solvedClues: number;
  hintsUsed: number;
  maxHints: number;
  highlightMode: 'none' | 'across' | 'down';
  clues: Map<string, Clue>;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    bestTime: number;
    currentStreak: number;
    longestStreak: number;
  };
}

export default function KakuroPuzzle() {
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    solution: [],
    difficulty: 'easy',
    selectedCell: null,
    timeElapsed: 0,
    isComplete: false,
    isPaused: false,
    totalClues: 0,
    solvedClues: 0,
    hintsUsed: 0,
    maxHints: 5,
    highlightMode: 'none',
    clues: new Map(),
    stats: {
      gamesPlayed: 0,
      gamesWon: 0,
      bestTime: Infinity,
      currentStreak: 0,
      longestStreak: 0,
    },
  });

  const [feedback, setFeedback] = useState<{
    text: string;
    type: 'success' | 'error' | 'info' | 'hint' | '';
  }>({ text: '', type: '' });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { isMuted } = useSound();

  type SoundType = 'select' | 'found' | 'win' | 'error' | 'clear';

  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;
    const sounds: Record<SoundType, string> = {
      select: '/sounds/click.mp3',
      found: '/sounds/correct.mp3',
      win: '/sounds/win.mp3',
      error: '/sounds/incorrect.mp3',
      clear: '/sounds/clear.mp3'
    };
    
    try {
      const audio = new Audio(sounds[type]);
      audio.play().catch(err => console.error(`Error playing ${type} sound:`, err));
    } catch (error) {
      console.error('Sound error:', error);
    }
  }, [isMuted]);

  // Generate puzzle based on difficulty
  const generatePuzzle = useCallback((difficulty: Difficulty) => {
    setIsGenerating(true);
    
    // Difficulty settings
    const difficultySettings = {
      easy: { size: 8, whiteRatio: 0.6, minRunLength: 2, maxRunLength: 4 },
      medium: { size: 10, whiteRatio: 0.55, minRunLength: 2, maxRunLength: 5 },
      hard: { size: 12, whiteRatio: 0.5, minRunLength: 3, maxRunLength: 6 },
      expert: { size: 15, whiteRatio: 0.45, minRunLength: 3, maxRunLength: 7 },
    };

    const settings = difficultySettings[difficulty];
    const size = settings.size;
    
    // Step 1: Create symmetrical pattern
    const pattern = createSymmetricalPattern(size, settings.whiteRatio);
    
    // Step 2: Identify runs
    const { horizontalRuns, verticalRuns } = identifyRuns(pattern);
    
    // Step 3: Generate numbers for runs
    const { board, solution, clues } = generateNumbersForRuns(
      pattern, 
      horizontalRuns, 
      verticalRuns,
      settings
    );
    
    setGameState(prev => ({
      ...prev,
      board,
      solution,
      clues: new Map(Object.entries(clues)),
      totalClues: Object.keys(clues).length,
      solvedClues: 0,
      selectedCell: null,
      timeElapsed: 0,
      isComplete: false,
      hintsUsed: 0,
      highlightMode: 'none',
      difficulty,
    }));

    // Reset timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      if (!gameState.isPaused && !gameState.isComplete) {
        setGameState(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }
    }, 1000);

    event({ action: 'kakuro_started', category: 'kakuro', label: difficulty });
    setIsGenerating(false);
  }, [gameState.isPaused, gameState.isComplete]);

  // Helper functions for puzzle generation
  const createSymmetricalPattern = (size: number, whiteRatio: number): CellType[][] => {
    const pattern: CellType[][] = Array(size).fill(null).map(() => Array(size).fill('blocked'));
    
    // Ensure symmetry (180-degree)
    const half = Math.ceil(size / 2);
    for (let row = 0; row < half; row++) {
      for (let col = 0; col < half; col++) {
        if (Math.random() < whiteRatio) {
          pattern[row][col] = 'white';
          pattern[size - 1 - row][size - 1 - col] = 'white';
        }
      }
    }
    
    // Ensure at least one white cell in each row and column
    for (let i = 0; i < size; i++) {
      if (!pattern[i].some(cell => cell === 'white')) {
        const col = Math.floor(Math.random() * size);
        pattern[i][col] = 'white';
        pattern[size - 1 - i][size - 1 - col] = 'white';
      }
      
      const columnHasWhite = pattern.some(row => row[i] === 'white');
      if (!columnHasWhite) {
        const row = Math.floor(Math.random() * size);
        pattern[row][i] = 'white';
        pattern[size - 1 - row][size - 1 - i] = 'white';
      }
    }
    
    return pattern;
  };

  const identifyRuns = (pattern: CellType[][]) => {
    const size = pattern.length;
    const horizontalRuns: Run[] = [];
    const verticalRuns: Run[] = [];
    
    // Find horizontal runs
    for (let row = 0; row < size; row++) {
      let start = -1;
      for (let col = 0; col <= size; col++) {
        if (col < size && pattern[row][col] === 'white') {
          if (start === -1) start = col;
        } else if (start !== -1) {
          if (col - start >= 2) { // Minimum run length of 2
            horizontalRuns.push({ row, start, end: col - 1 });
          }
          start = -1;
        }
      }
    }
    
    // Find vertical runs
    for (let col = 0; col < size; col++) {
      let start = -1;
      for (let row = 0; row <= size; row++) {
        if (row < size && pattern[row][col] === 'white') {
          if (start === -1) start = row;
        } else if (start !== -1) {
          if (row - start >= 2) { // Minimum run length of 2
            verticalRuns.push({ col, start, end: row - 1 });
          }
          start = -1;
        }
      }
    }
    
    return { horizontalRuns, verticalRuns };
  };

  const generateNumbersForRuns = (
    pattern: CellType[][],
    horizontalRuns: Run[],
    verticalRuns: Run[],
    settings: { minRunLength: number; maxRunLength: number }
  ) => {
    const size = pattern.length;
    const board: Cell[][] = [];
    const solution: number[][] = Array(size).fill(null).map(() => Array(size).fill(0));
    const clues: Record<string, Clue> = {};
    
    // Initialize board
    for (let row = 0; row < size; row++) {
      const boardRow: Cell[] = [];
      for (let col = 0; col < size; col++) {
        boardRow.push({
          type: pattern[row][col],
          value: 0,
          acrossClueId: null,
          downClueId: null,
          isEditable: pattern[row][col] === 'white',
          isError: false,
          isHighlighted: false,
          row,
          col,
        });
      }
      board.push(boardRow);
    }
    
    // Generate numbers for each horizontal run
    horizontalRuns.forEach((run, index) => {
      const runLength = run.end - run.start + 1;
      const numbers = generateUniqueNumbers(runLength);
      const sum = numbers.reduce((a, b) => a + b, 0);
      
      // Store in solution
      for (let col = run.start; col <= run.end; col++) {
        solution[run.row!][col] = numbers[col - run.start];
      }
      
      // Create clue
      const clueId = `h${index}`;
      clues[clueId] = {
        id: clueId,
        value: sum,
        direction: 'across',
        length: runLength,
        startRow: run.row!,
        startCol: run.start,
        cells: Array.from({ length: runLength }, (_, i) => ({ 
          row: run.row!, 
          col: run.start + i 
        }))
      };
      
      // Link clue to cells
      for (let col = run.start; col <= run.end; col++) {
        board[run.row!][col].acrossClueId = clueId;
      }
    });
    
    // Generate numbers for each vertical run
    verticalRuns.forEach((run, index) => {
      const runLength = run.end - run.start + 1;
      const numbers = generateUniqueNumbers(runLength);
      const sum = numbers.reduce((a, b) => a + b, 0);
      
      // Store in solution (check for conflicts)
      for (let row = run.start; row <= run.end; row++) {
        // If cell already has a number from horizontal run, ensure uniqueness
        if (solution[row][run.col!] !== 0) {
          // Ensure vertical run also has unique numbers
          if (solution[row][run.col!] === numbers[row - run.start]) {
            // Conflict - regenerate vertical numbers
            const newNumbers = generateUniqueNumbers(runLength, [solution[row][run.col!]]);
            for (let r = run.start; r <= run.end; r++) {
              solution[r][run.col!] = newNumbers[r - run.start];
            }
            numbers[row - run.start] = newNumbers[row - run.start];
          }
        } else {
          solution[row][run.col!] = numbers[row - run.start];
        }
      }
      
      // Create clue
      const clueId = `v${index}`;
      clues[clueId] = {
        id: clueId,
        value: sum,
        direction: 'down',
        length: runLength,
        startRow: run.start,
        startCol: run.col!,
        cells: Array.from({ length: runLength }, (_, i) => ({ 
          row: run.start + i, 
          col: run.col! 
        }))
      };
      
      // Link clue to cells
      for (let row = run.start; row <= run.end; row++) {
        board[row][run.col!].downClueId = clueId;
      }
    });
    
    return { board, solution, clues };
  };

  const generateUniqueNumbers = (length: number, exclude: number[] = []): number[] => {
    const available = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !exclude.includes(n));
    const result: number[] = [];
    
    while (result.length < length && available.length > 0) {
      const index = Math.floor(Math.random() * available.length);
      result.push(available[index]);
      available.splice(index, 1);
    }
    
    // If we need more numbers, allow repeats (but that's not ideal for Kakuro)
    while (result.length < length) {
      result.push(Math.floor(Math.random() * 9) + 1);
    }
    
    return result;
  };

  // Initialize on mount
  useEffect(() => {
    generatePuzzle('easy');
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [generatePuzzle]);

  // Game logic functions
  const selectCell = (row: number, col: number) => {
    const cell = gameState.board[row]?.[col];
    if (!cell || !cell.isEditable) return;
    
    playSound('select');
    
    // Highlight related cells
    const newBoard = [...gameState.board.map(r => [...r])];
    
    // Reset all highlights
    for (let r = 0; r < newBoard.length; r++) {
      for (let c = 0; c < newBoard[r].length; c++) {
        newBoard[r][c].isHighlighted = false;
      }
    }
    
    // Highlight selected cell
    newBoard[row][col].isHighlighted = true;
    
    // Highlight across run
    if (cell.acrossClueId) {
      const clue = gameState.clues.get(cell.acrossClueId);
      if (clue) {
        clue.cells.forEach(({ row: r, col: c }) => {
          if (newBoard[r] && newBoard[r][c]) {
            newBoard[r][c].isHighlighted = true;
          }
        });
      }
    }
    
    // Highlight down run
    if (cell.downClueId) {
      const clue = gameState.clues.get(cell.downClueId);
      if (clue) {
        clue.cells.forEach(({ row: r, col: c }) => {
          if (newBoard[r] && newBoard[r][c]) {
            newBoard[r][c].isHighlighted = true;
          }
        });
      }
    }
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      selectedCell: prev.selectedCell?.row === row && prev.selectedCell?.col === col 
        ? null 
        : { row, col }
    }));
  };

  const fillCell = (num: number) => {
    if (!gameState.selectedCell) return;
    
    const { row, col } = gameState.selectedCell;
    const cell = gameState.board[row]?.[col];
    if (!cell || !cell.isEditable) return;
    
    playSound('select');
    
    const newBoard = [...gameState.board.map(r => [...r])];
    const newCell = { ...newBoard[row][col] };
    
    newCell.value = num;
    newCell.isError = false;
    newBoard[row][col] = newCell;
    
    // Check run sums
    let solvedClues = 0;
    const checkedClues = new Set<string>();
    
    // Check across clue
    if (newCell.acrossClueId) {
      const clue = gameState.clues.get(newCell.acrossClueId);
      if (clue) {
        const sum = clue.cells.reduce((acc, { row: r, col: c }) => acc + newBoard[r][c].value, 0);
        const allFilled = clue.cells.every(({ row: r, col: c }) => newBoard[r][c].value !== 0);
        
        if (allFilled && sum === clue.value) {
          solvedClues++;
          checkedClues.add(clue.id);
        }
      }
    }
    
    // Check down clue
    if (newCell.downClueId) {
      const clue = gameState.clues.get(newCell.downClueId);
      if (clue && !checkedClues.has(clue.id)) {
        const sum = clue.cells.reduce((acc, { row: r, col: c }) => acc + newBoard[r][c].value, 0);
        const allFilled = clue.cells.every(({ row: r, col: c }) => newBoard[r][c].value !== 0);
        
        if (allFilled && sum === clue.value) {
          solvedClues++;
        }
      }
    }
    
    // Check if puzzle is complete
    let isComplete = true;
    for (let r = 0; r < newBoard.length; r++) {
      for (let c = 0; c < newBoard[r].length; c++) {
        if (newBoard[r][c].isEditable && newBoard[r][c].value === 0) {
          isComplete = false;
          break;
        }
      }
      if (!isComplete) break;
    }
    
    if (isComplete) {
      // Verify all clues are solved
      let allCluesSolved = true;
      for (const clue of gameState.clues.values()) {
        const sum = clue.cells.reduce((acc, { row, col }) => acc + newBoard[row][col].value, 0);
        if (sum !== clue.value) {
          allCluesSolved = false;
          break;
        }
      }
      
      if (allCluesSolved) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        
        setGameState(prev => {
          const newStreak = prev.stats.currentStreak + 1;
          return {
            ...prev,
            board: newBoard,
            isComplete: true,
            solvedClues: gameState.clues.size,
            stats: {
              gamesPlayed: prev.stats.gamesPlayed + 1,
              gamesWon: prev.stats.gamesWon + 1,
              bestTime: Math.min(prev.stats.bestTime, prev.timeElapsed),
              currentStreak: newStreak,
              longestStreak: Math.max(prev.stats.longestStreak, newStreak),
            },
          };
        });
        
        playSound('win');
        confetti({ particleCount: 100, spread: 70 });
        setFeedback({ 
          text: `🎉 Puzzle solved in ${formatTime(gameState.timeElapsed)}!`, 
          type: 'success' 
        });
      }
    } else {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        solvedClues: prev.solvedClues + (solvedClues > prev.solvedClues ? 1 : 0),
      }));
    }
  };

  const provideHint = () => {
    if (gameState.hintsUsed >= gameState.maxHints) {
      setFeedback({ text: 'No hints remaining', type: 'error' });
      return;
    }
    
    // Find an empty cell
    const emptyCells: {row: number; col: number}[] = [];
    for (let row = 0; row < gameState.board.length; row++) {
      for (let col = 0; col < gameState.board[row].length; col++) {
        const cell = gameState.board[row][col];
        if (cell.isEditable && cell.value === 0) {
          emptyCells.push({ row, col });
        }
      }
    }
    
    if (emptyCells.length === 0) return;
    
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = [...gameState.board.map(r => [...r])];
    newBoard[row][col] = {
      ...newBoard[row][col],
      value: gameState.solution[row][col],
      isError: false,
    };
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      hintsUsed: prev.hintsUsed + 1,
    }));
    
    setFeedback({ text: 'Hint applied! Try to figure out the logic', type: 'info' });
  };

  const checkBoard = () => {
    let hasErrors = false;
    const newBoard = [...gameState.board.map(r => [...r])];
    
    for (let row = 0; row < newBoard.length; row++) {
      for (let col = 0; col < newBoard[row].length; col++) {
        const cell = newBoard[row][col];
        if (cell.isEditable && cell.value !== 0) {
          const isCorrect = cell.value === gameState.solution[row][col];
          if (!isCorrect) {
            hasErrors = true;
            newBoard[row][col] = { ...cell, isError: true };
          } else {
            newBoard[row][col] = { ...cell, isError: false };
          }
        }
      }
    }
    
    setGameState(prev => ({ ...prev, board: newBoard }));
    
    if (hasErrors) {
      playSound('error');
      setFeedback({ text: 'Found incorrect numbers', type: 'error' });
    } else {
      playSound('found');
      setFeedback({ text: 'All current numbers are correct!', type: 'success' });
    }
  };

  const clearCell = () => {
    if (!gameState.selectedCell) return;
    
    playSound('clear');
    const { row, col } = gameState.selectedCell;
    const newBoard = [...gameState.board.map(r => [...r])];
    newBoard[row][col] = {
      ...newBoard[row][col],
      value: 0,
      isError: false,
    };
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
    }));
    setFeedback({ text: 'Cell cleared', type: 'info' });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFeedbackClasses = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 border border-green-300';
      case 'error': return 'bg-red-100 text-red-800 border border-red-300';
      case 'info': return 'bg-blue-100 text-blue-800 border border-blue-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Render cell
  const renderCell = (row: number, col: number, cell: Cell) => {
    const isSelected = gameState.selectedCell?.row === row && 
                      gameState.selectedCell?.col === col;
    
    if (cell.type === 'blocked') {
      // Check if this blocked cell has any clues
      const hasAcrossClue = Array.from(gameState.clues.values()).some(
        clue => clue.direction === 'across' && 
               clue.startRow === row && 
               clue.startCol - 1 === col
      );
      const hasDownClue = Array.from(gameState.clues.values()).some(
        clue => clue.direction === 'down' && 
               clue.startRow - 1 === row && 
               clue.startCol === col
      );
      
      if (hasAcrossClue || hasDownClue) {
        const acrossClue = Array.from(gameState.clues.values()).find(
          clue => clue.direction === 'across' && 
                 clue.startRow === row && 
                 clue.startCol - 1 === col
        );
        const downClue = Array.from(gameState.clues.values()).find(
          clue => clue.direction === 'down' && 
                 clue.startRow - 1 === row && 
                 clue.startCol === col
        );
        
        return (
          <div
            key={`${row}-${col}`}
            className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 border border-gray-800 text-white text-xs flex flex-col justify-center items-center"
          >
            <div className="absolute top-0 left-0 w-1/2 h-1/2 flex items-start justify-start p-1">
              {downClue && (
                <div className="text-[10px] font-bold text-blue-300">
                  {downClue.value}
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 flex items-end justify-end p-1">
              {acrossClue && (
                <div className="text-[10px] font-bold text-green-300">
                  {acrossClue.value}
                </div>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-600 font-bold">
              {hasAcrossClue && hasDownClue ? '\\' : ''}
            </div>
          </div>
        );
      }
      
      return (
        <div
          key={`${row}-${col}`}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 border border-gray-800"
        />
      );
    }

    // White cell
    return (
      <div
        key={`${row}-${col}`}
        onClick={() => selectCell(row, col)}
        className={`
          relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl
          border border-gray-300 transition-all duration-200
          ${isSelected ? 'bg-blue-100 ring-2 ring-blue-400' : ''}
          ${cell.isHighlighted ? 'bg-yellow-50' : 'bg-white'}
          ${cell.isError ? 'bg-red-100 text-red-600' : 'text-gray-800'}
          ${cell.value === 0 ? '' : ''}
          hover:bg-gray-50 cursor-pointer select-none
          font-bold'
        `}
      >
        {/* Main number */}
        {cell.value !== 0 && (
          <span className="z-10">{cell.value}</span>
        )}
        
        
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute inset-0 border-2 border-blue-400 pointer-events-none" />
        )}
      </div>
    );
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generating new puzzle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-lg">
          <div className="text-center">
            <div className="text-sm text-gray-600 font-medium mb-2">Difficulty</div>
            <select 
              value={gameState.difficulty}
              onChange={(e) => generatePuzzle(e.target.value as Difficulty)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              disabled={isGenerating}
            >
              <option value="easy" className="bg-white text-gray-800">Easy (8×8)</option>
              <option value="medium" className="bg-white text-gray-800">Medium (10×10)</option>
              <option value="hard" className="bg-white text-gray-800">Hard (12×12)</option>
              <option value="expert" className="bg-white text-gray-800">Expert (15×15)</option>
            </select>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 font-medium mb-2">Time</div>
            <div className={`text-2xl font-bold ${
              gameState.timeElapsed >= 1200 ? 'text-red-600 animate-pulse' : 'text-blue-600'
            }`}>
              {formatTime(gameState.timeElapsed)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 font-medium mb-2">Clues</div>
            <div className="text-2xl font-bold text-purple-600">
              {gameState.solvedClues}/{gameState.totalClues}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 font-medium mb-2">Hints</div>
            <div className="text-2xl font-bold text-yellow-600">
              {gameState.maxHints - gameState.hintsUsed}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 font-medium mb-2">Streak</div>
            <div className="text-2xl font-bold text-green-600">
              {gameState.stats.currentStreak}
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback.text && (
          <div className={`p-4 rounded-2xl mb-6 text-center font-semibold ${getFeedbackClasses(feedback.type)}`}>
            {feedback.text}
          </div>
        )}

        {/* Kakuro Grid */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="inline-block border-4 border-gray-800 rounded-lg p-2 bg-gray-900">
            {gameState.board.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => renderCell(rowIndex, colIndex, cell))}
              </div>
            ))}
          </div>
        </div>

        {/* Number Selector */}
        <div className="grid grid-cols-5 sm:grid-cols-9 gap-3 mb-8 max-w-3xl mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => fillCell(num)}
              className={`
                px-4 py-3 sm:px-6 sm:py-4 text-lg sm:text-xl font-bold rounded-xl 
                transition-all duration-300 transform hover:scale-105 active:scale-95 
                shadow-md hover:shadow-lg border
                bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 border-blue-300 hover:from-blue-200 hover:to-blue-300
                }
              `}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Game Controls */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <button
            onClick={clearCell}
            className="px-4 py-3 sm:px-6 sm:py-4 text-lg sm:text-xl font-bold bg-gradient-to-br from-red-100 to-red-200 text-red-700 rounded-xl hover:from-red-200 hover:to-red-300 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg border border-red-300 flex items-center justify-center col-span-2"
          >
            Clear
          </button>  
          <button
            onClick={provideHint}
            disabled={gameState.hintsUsed >= gameState.maxHints}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-800 rounded-2xl hover:from-yellow-200 hover:to-yellow-300 disabled:from-gray-200 disabled:to-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg font-bold text-lg border border-yellow-300"
          >
            💡 Hint ({gameState.maxHints - gameState.hintsUsed})
          </button>
          <button
            onClick={checkBoard}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 rounded-2xl hover:from-blue-200 hover:to-blue-300 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg font-bold text-lg border border-blue-300"
          >
            🔍 Check
          </button>
          <button
            onClick={() => generatePuzzle(gameState.difficulty)}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-br from-green-100 to-green-200 text-green-800 rounded-2xl hover:from-green-200 hover:to-green-300 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg font-bold text-lg border border-green-300"
          >
            🔄 New Puzzle
          </button>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <h3 className="text-xl font-bold text-center mb-6 text-gray-800">
            Game Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-300">
              <div className="text-sm text-gray-600 font-medium mb-1">Games Played</div>
              <div className="text-2xl font-bold text-purple-600">{gameState.stats.gamesPlayed}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-300">
              <div className="text-sm text-gray-600 font-medium mb-1">Games Won</div>
              <div className="text-2xl font-bold text-green-600">{gameState.stats.gamesWon}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-300">
              <div className="text-sm text-gray-600 font-medium mb-1">Best Time</div>
              <div className="text-2xl font-bold text-blue-600">
                {gameState.stats.bestTime === Infinity ? '--:--' : formatTime(gameState.stats.bestTime)}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-300">
              <div className="text-sm text-gray-600 font-medium mb-1">Longest Streak</div>
              <div className="text-2xl font-bold text-orange-600">{gameState.stats.longestStreak}</div>
            </div>
          </div>
        </div>

        {/* Puzzle Info */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">About This Puzzle</h2>
              <span className="text-gray-500 transition-transform duration-200 group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-gray-600">
                  This Kakuro puzzle was <strong>generated in your browser</strong> using a custom algorithm.
                  Each puzzle is unique and solvable!
                </p>
                <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-600">
                  <li><strong>Black cells with numbers</strong> are clues</li>
                  <li>Top-left number is for the <strong>vertical run below</strong></li>
                  <li>Bottom-right number is for the <strong>horizontal run to the right</strong></li>
                  <li>Fill white cells with numbers 1-9</li>
                  <li>No number can repeat within a single run</li>
                  <li>The sum of each run must equal its clue</li>
                </ul>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}