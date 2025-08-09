'use client';
import { event } from '@/lib/gtag';
import confetti from 'canvas-confetti';
import { useSound } from '@/app/context/SoundContext';
import { useEffect, useState, useCallback, useRef } from 'react';


type Difficulty = 'easy' | 'medium' | 'hard';
type Board = number[][];

interface GameState {
  board: Board;
  solution: Board;
  difficulty: Difficulty;
  emptyCells: number;
  hintsUsed: number;
  maxHints: number;
  selectedCell: { row: number; col: number } | null;
  timeElapsed: number;
  isComplete: boolean;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    bestTime: number;
  };
}

export default function SudokuPuzzle() {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(0).map(() => Array(9).fill(0)),
    solution: Array(9).fill(0).map(() => Array(9).fill(0)),
    difficulty: 'medium',
    emptyCells: 0,
    hintsUsed: 0,
    maxHints: 3,
    selectedCell: null,
    timeElapsed: 0,
    isComplete: false,
    stats: {
      gamesPlayed: 0,
      gamesWon: 0,
      bestTime: Infinity,
    },
  });

  const [feedback, setFeedback] = useState({ text: '', className: '' });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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


  // Sudoku generation helpers (similar to your JS version)
  const generateSolution = (): Board => {
    const board = Array(9).fill(0).map(() => Array(9).fill(0));
    fillBoard(board, 0, 0);
    return board;
  };

  const fillBoard = useCallback((board: Board, row: number, col: number): boolean => {
    if (row === 9) return true;
    if (col === 9) return fillBoard(board, row + 1, 0);
    if (board[row][col] !== 0) return fillBoard(board, row, col + 1);
    
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(nums);
    
    for (const num of nums) {
      if (isValidPlacement(board, row, col, num)) {
        board[row][col] = num;
        if (fillBoard(board, row, col + 1)) return true;
        board[row][col] = 0;
      }
    }
    
    return false;
  }, []);


  const generateNewPuzzle = useCallback(() => {
    // Generate solution
    const solution = generateSolution();
    const difficultySettings = {
      easy: 40,
      medium: 50,
      hard: 60,
    };
    const emptyCells = difficultySettings[gameState.difficulty];
    
    // Create playable board
    const board = JSON.parse(JSON.stringify(solution));
    let cellsRemoved = 0;
    
    while (cellsRemoved < emptyCells) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (board[row][col] !== 0) {
        const backup = board[row][col];
        board[row][col] = 0;
        
        if (countSolutions(JSON.parse(JSON.stringify(board)))) {
          cellsRemoved++;
        } else {
          board[row][col] = backup;
        }
      }
    }
    
    setGameState(prev => ({
      ...prev,
      board,
      solution,
      emptyCells,
      hintsUsed: 0,
      selectedCell: null,
      timeElapsed: 0,
      isComplete: false,
    }));
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setGameState(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
    }, 1000);
    
    setFeedback({ text: '', className: '' });
  }, [gameState.difficulty]); 

  // Initialize game - runs only once on mount
  useEffect(() => {
    generateNewPuzzle();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  
  const countSolutions = (board: Board): number => {
    // Implementation similar to your JS version
    return 1; // Simplified for this example
  };

  const isValidPlacement = (board: Board, row: number, col: number, num: number): boolean => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
    }
    
    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }
    
    return true;
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const selectCell = (row: number, col: number) => {
    if (gameState.board[row][col] !== 0 && !gameState.selectedCell) return;
    playSound('select');
    setGameState(prev => ({
      ...prev,
      selectedCell: prev.selectedCell?.row === row && prev.selectedCell?.col === col 
        ? null 
        : { row, col }
    }));
  };

  const fillCell = (num: number) => {
    if (!gameState.selectedCell || gameState.board[gameState.selectedCell.row][gameState.selectedCell.col] !== 0) {
      return;
    }
    playSound('select');
    const { row, col } = gameState.selectedCell;
    const newBoard = [...gameState.board];
    newBoard[row] = [...newBoard[row]];
    newBoard[row][col] = num;
    
    const isCorrect = num === gameState.solution[row][col];
    const newEmptyCells = isCorrect ? gameState.emptyCells - 1 : gameState.emptyCells;
    const isComplete = newEmptyCells === 0;
    
    if (isComplete) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        emptyCells: newEmptyCells,
        isComplete: true,
        stats: {
          gamesPlayed: prev.stats.gamesPlayed + 1,
          gamesWon: prev.stats.gamesWon + 1,
          bestTime: Math.min(prev.stats.bestTime, prev.timeElapsed),
        },
      }));
      playSound('win');
      confetti({ particleCount: 100, spread: 70 });
      setFeedback({ 
        text: `🎉 Puzzle solved in ${formatTime(gameState.timeElapsed)}!`, 
        className: 'feedback-success' 
      });
    } else {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        emptyCells: newEmptyCells,
      }));
      
      if (!isCorrect) {
        playSound('error');
        setFeedback({ text: 'Incorrect number', className: 'feedback-error' });
      }
    }
  };

  const provideHint = () => {
    if (gameState.hintsUsed >= gameState.maxHints) {
      setFeedback({ text: 'No hints remaining', className: 'feedback-error' });
      return;
    }
    
    // Find empty cells
    const emptyCells: {row: number, col: number}[] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (gameState.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }
    
    if (emptyCells.length === 0) return;
    
    // Select random empty cell
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = [...gameState.board];
    newBoard[row] = [...newBoard[row]];
    newBoard[row][col] = gameState.solution[row][col];
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      hintsUsed: prev.hintsUsed + 1,
      emptyCells: prev.emptyCells - 1,
    }));
    
    setFeedback({ text: 'Hint applied', className: 'feedback-info' });
  };

  const checkBoard = () => {
    let hasErrors = false;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (gameState.board[row][col] !== 0 && 
            gameState.board[row][col] !== gameState.solution[row][col]) {
          hasErrors = true;
          break;
        }
      }
       if (hasErrors) {
        playSound('error'); // Add this line
      } else {
        playSound('found'); // Add this line
      }
    }
    
    setFeedback({
      text: hasErrors ? 'Errors found' : 'No errors found',
      className: hasErrors ? 'feedback-error' : 'feedback-success'
    });
  };

  const changeDifficulty = (difficulty: Difficulty) => {
    setGameState(prev => ({ ...prev, difficulty }));
    generateNewPuzzle();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="sudoku-game bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">
      <div className="game-header flex justify-between items-center mb-6">
        <div className="text-lg font-semibold">
          Difficulty: 
          <select 
            value={gameState.difficulty}
            onChange={(e) => changeDifficulty(e.target.value as Difficulty)}
            className="ml-2 p-1 border rounded"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className={`text-lg font-semibold ${
          gameState.timeElapsed >= 600 ? 'text-red-500' : ''
        }`}>
          Time: {formatTime(gameState.timeElapsed)}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold">
            Hints: {gameState.maxHints - gameState.hintsUsed}
          </div>
        </div>
      </div>

      {feedback.text && (
        <div className={`feedback ${feedback.className} text-center p-3 rounded-lg mb-4`}>
          {feedback.text}
        </div>
      )}

      <div className="sudoku-grid grid grid-cols-9 gap-1 mb-6">
        {gameState.board.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            const isSelected = gameState.selectedCell?.row === rowIndex && 
                              gameState.selectedCell?.col === colIndex;
            const isFixed = gameState.board[rowIndex][colIndex] !== 0 && 
                           gameState.board[rowIndex][colIndex] === gameState.solution[rowIndex][colIndex];
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => selectCell(rowIndex, colIndex)}
                className={`sudoku-cell aspect-square flex items-center justify-center text-xl font-bold border
                  ${isSelected ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}
                  ${isFixed ? 'bg-gray-100 text-gray-800' : 'cursor-pointer hover:bg-gray-50'}
                  ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-gray-400' : ''}
                  ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-gray-400' : ''}
                `}
              >
                {cell !== 0 ? cell : ''}
              </div>
            );
          })
        ))}
      </div>

      <div className="number-selector grid grid-cols-5 gap-2 mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => fillCell(num)}
            className="number-btn p-3 bg-blue-100 hover:bg-blue-200 rounded-lg font-bold text-lg"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => {
            if (gameState.selectedCell) {
              const { row, col } = gameState.selectedCell;
              if (gameState.board[row][col] !== 0 && 
                  gameState.board[row][col] !== gameState.solution[row][col]) {
                const newBoard = [...gameState.board];
                newBoard[row] = [...newBoard[row]];
                newBoard[row][col] = 0;
                setGameState(prev => ({
                  ...prev,
                  board: newBoard,
                  emptyCells: prev.emptyCells + 1,
                }));
              }
            }
          }}
          className="number-btn p-3 bg-red-100 hover:bg-red-200 rounded-lg font-bold text-lg"
        >
          Clear
        </button>
      </div>

      <div className="game-controls flex justify-center gap-4">
        <button
          onClick={provideHint}
          disabled={gameState.hintsUsed >= gameState.maxHints}
          className="btn secondary px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
        >
          Hint
        </button>
        <button
          onClick={checkBoard}
          className="btn primary px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Check
        </button>
        <button
          onClick={generateNewPuzzle}
          className="btn tertiary px-4 py-2 rounded-lg bg-yellow-500 text-gray-800 hover:bg-yellow-600"
        >
          New Game
        </button>
      </div>

      <div className="stats mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold mb-2">Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Games Played</p>
            <p className="text-xl font-bold">{gameState.stats.gamesPlayed}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Games Won</p>
            <p className="text-xl font-bold">{gameState.stats.gamesWon}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Best Time</p>
            <p className="text-xl font-bold">
              {gameState.stats.bestTime === Infinity ? '--:--' : formatTime(gameState.stats.bestTime)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}