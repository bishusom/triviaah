'use client';
import { event } from '@/lib/gtag';
import confetti from 'canvas-confetti';
import { useSound } from '@/context/SoundContext';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Eraser } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';
type Board = number[][];

interface GameState {
  board: Board;
  solution: Board;
  difficulty: Difficulty;
  emptyCells: number;
  hintsUsed: number;
  maxHints: 3;
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

  const [feedback, setFeedback] = useState<{
    text: string;
    type: 'success' | 'error' | 'info' | 'hint' | '';
  }>({ text: '', type: '' });
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
    const solution = generateSolution();
    const difficultySettings = {
      easy: 40,
      medium: 50,
      hard: 60,
    };
    const emptyCells = difficultySettings[gameState.difficulty];
    
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

    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'sudoku_started', category: 'sudoku',label: 'sudoku'});
        clearInterval(checkGtag);
      }
    }, 100);

    setFeedback({ text: '', type: '' });
  }, [gameState.difficulty]); 

  useEffect(() => {
    generateNewPuzzle();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const countSolutions = (board: Board): number => {
    return 1;
  };

  const isValidPlacement = (board: Board, row: number, col: number, num: number): boolean => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
    }
    
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }
    
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
        type: 'success' 
      });
    } else {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        emptyCells: newEmptyCells,
      }));
      
      if (!isCorrect) {
        playSound('error');
        setFeedback({ text: 'Incorrect number', type: 'error'});
      }
    }
  };

  const provideHint = () => {
    if (gameState.hintsUsed >= gameState.maxHints) {
      setFeedback({ text: 'No hints remaining', type: 'error' });
      return;
    }
    
    const emptyCells: {row: number, col: number}[] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (gameState.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }
    
    if (emptyCells.length === 0) return;
    
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
    
    setFeedback({ text: 'Hint applied', type: 'info' });
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
        playSound('error');
      } else {
        playSound('found');
      }
    }
    
    setFeedback({
      text: hasErrors ? 'Errors found' : 'No errors found',
      type: hasErrors ? 'error' : 'success'
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

  const getFeedbackClasses = (type: string) => {
    switch (type) {
      case 'success': return 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-400/30';
      case 'error': return 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border border-red-400/30';
      case 'info': return 'bg-gradient-to-r from-blue-500/20 to-sky-500/20 text-blue-200 border border-blue-400/30';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08111f] via-[#0d1b30] to-[#12243d] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-200 via-blue-300 to-cyan-300 bg-clip-text text-transparent mb-3">
            Sudoku Puzzle
          </h1>
          <p className="text-blue-100/70 text-lg">Fill the grid so every row, column and 3×3 box contains 1-9</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-[#0f1d31]/80 backdrop-blur-sm rounded-2xl border border-[#27476d] shadow-2xl">
          <div className="text-center">
            <div className="text-sm text-blue-100/60 font-medium mb-2">Difficulty</div>
            <select 
              value={gameState.difficulty}
              onChange={(e) => changeDifficulty(e.target.value as Difficulty)}
              className="bg-[#142742] border border-[#355a87] rounded-lg px-3 py-2 text-blue-50 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="easy" className="bg-[#142742]">Easy</option>
              <option value="medium" className="bg-[#142742]">Medium</option>
              <option value="hard" className="bg-[#142742]">Hard</option>
            </select>
          </div>
          <div className="text-center">
            <div className="text-sm text-blue-100/60 font-medium mb-2">Time</div>
            <div className={`text-2xl font-bold ${
              gameState.timeElapsed >= 600 ? 'text-amber-300 animate-pulse' : 'text-sky-300'
            }`}>
              {formatTime(gameState.timeElapsed)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-blue-100/60 font-medium mb-2">Hints</div>
            <div className="text-2xl font-bold text-cyan-300">
              {gameState.maxHints - gameState.hintsUsed}
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback.text && (
          <div className={`p-4 rounded-2xl mb-6 text-center font-semibold backdrop-blur-sm ${getFeedbackClasses(feedback.type)}`}>
            {feedback.text}
          </div>
        )}

        {/* Sudoku Grid - FIXED GRID LAYOUT */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-9 grid-rows-9 gap-0 bg-[#11243c] p-3 rounded-2xl shadow-2xl border border-[#2f5a87]">
            {gameState.board.map((row, rowIndex) => (
              row.map((cell, colIndex) => {
                const isSelected = gameState.selectedCell?.row === rowIndex && 
                                  gameState.selectedCell?.col === colIndex;
                const isFixed = gameState.board[rowIndex][colIndex] !== 0 && 
                              gameState.board[rowIndex][colIndex] === gameState.solution[rowIndex][colIndex];
                const isError = gameState.board[rowIndex][colIndex] !== 0 && 
                              gameState.board[rowIndex][colIndex] !== gameState.solution[rowIndex][colIndex];
                
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => selectCell(rowIndex, colIndex)}
                    className={`
                      w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold transition-all duration-200
                      ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-[3px] border-[#23486c]' : 'border-b border-[#31567f]'}
                      ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-[3px] border-[#23486c]' : 'border-r border-[#31567f]'}
                      ${rowIndex === 0 ? 'border-t-[3px] border-[#23486c]' : ''}
                      ${colIndex === 0 ? 'border-l-[3px] border-[#23486c]' : ''}
                      ${isSelected ? 'bg-[#8ec5ff] text-[#0a1a2d] ring-2 ring-inset ring-[#d8efff]' : ''}
                      ${isFixed ? 'text-[#eef6ff] bg-[#1e3a5b]' : ''}
                      ${!isFixed && !isSelected && !isError ? 'text-[#0f2741] bg-[#e6f2ff] hover:bg-[#d8ebff]' : ''}
                      ${isError ? 'text-[#a12626] bg-[#ffd7d7]' : ''}
                      cursor-pointer select-none
                    `}
                  >
                    {cell !== 0 ? cell : ''}
                  </div>
                );
              })
            ))}
          </div>
        </div>

        {/* Number Selector */}
        <div className="grid grid-cols-5 gap-3 mb-8 max-w-md mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => fillCell(num)}
              className="px-4 py-3 sm:px-6 sm:py-4 text-lg sm:text-xl font-bold bg-gradient-to-br from-[#17304f] to-[#21456e] text-blue-50 rounded-xl hover:from-[#21456e] hover:to-[#2b5a8e] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border border-[#3d6a98]"
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
            className="flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg font-bold bg-gradient-to-br from-[#7d1d39] to-[#a12745] text-white rounded-xl hover:from-[#922243] hover:to-[#ba3153] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <Eraser className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Clear</span>
          </button>
        </div>

        {/* Game Controls */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center sm:items-stretch gap-4 mb-8 px-4 sm:px-0">
          <button
            onClick={generateNewPuzzle}
            className="w-full sm:w-auto flex-1 max-w-[180px] px-4 sm:px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-semibold text-sm sm:text-base whitespace-nowrap"
          >
            🎮 New Game
          </button>
          <button
            onClick={checkBoard}
            className="w-full sm:w-auto flex-1 max-w-[180px] px-4 sm:px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md font-semibold text-sm sm:text-base whitespace-nowrap"
          >
            ✅ Check Board
          </button>
          <button
            onClick={provideHint}
            disabled={gameState.hintsUsed >= gameState.maxHints}
            className="w-full sm:w-auto flex-1 max-w-[180px] px-4 sm:px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md font-semibold text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            💡 Hint
          </button>
        </div>

        {/* Stats */}
        <div className="bg-[#0f1d31]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#27476d] shadow-2xl">
          <h3 className="text-xl font-bold text-center mb-6 bg-gradient-to-r from-sky-200 to-cyan-300 bg-clip-text text-transparent">
            Game Statistics
          </h3>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-4 bg-[#132844] rounded-xl border border-[#2f5a87]">
              <div className="text-sm text-blue-100/60 font-medium mb-1">Games Played</div>
              <div className="text-2xl font-bold text-sky-300">{gameState.stats.gamesPlayed}</div>
            </div>
            <div className="text-center p-4 bg-[#132844] rounded-xl border border-[#2f5a87]">
              <div className="text-sm text-blue-100/60 font-medium mb-1">Games Won</div>
              <div className="text-2xl font-bold text-cyan-300">{gameState.stats.gamesWon}</div>
            </div>
            <div className="text-center p-4 bg-[#132844] rounded-xl border border-[#2f5a87]">
              <div className="text-sm text-blue-100/60 font-medium mb-1">Best Time</div>
              <div className="text-2xl font-bold text-blue-200">
                {gameState.stats.bestTime === Infinity ? '--:--' : formatTime(gameState.stats.bestTime)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
