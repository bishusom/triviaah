'use client';
import { event } from '@/lib/gtag';
import confetti from 'canvas-confetti';
import { useSound } from '@/context/SoundContext';
import { useEffect, useState, useCallback, useRef } from 'react';

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
      case 'success': return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30';
      case 'error': return 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30';
      case 'info': return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30';
      default: return 'bg-gray-800 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            Sudoku Puzzle
          </h1>
          <p className="text-gray-400 text-lg">Fill the grid so every row, column and 3×3 box contains 1-9</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl">
          <div className="text-center">
            <div className="text-sm text-gray-400 font-medium mb-2">Difficulty</div>
            <select 
              value={gameState.difficulty}
              onChange={(e) => changeDifficulty(e.target.value as Difficulty)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="easy" className="bg-gray-700">Easy</option>
              <option value="medium" className="bg-gray-700">Medium</option>
              <option value="hard" className="bg-gray-700">Hard</option>
            </select>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400 font-medium mb-2">Time</div>
            <div className={`text-2xl font-bold ${
              gameState.timeElapsed >= 600 ? 'text-red-400 animate-pulse' : 'text-cyan-400'
            }`}>
              {formatTime(gameState.timeElapsed)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400 font-medium mb-2">Hints</div>
            <div className="text-2xl font-bold text-yellow-400">
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
          <div className="grid grid-cols-9 grid-rows-9 gap-0 bg-gray-600 p-3 rounded-xl shadow-2xl border border-gray-600">
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
                      ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-gray-500' : 'border-b border-gray-600'}
                      ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-gray-500' : 'border-r border-gray-600'}
                      ${rowIndex === 0 ? 'border-t-2 border-gray-500' : ''}
                      ${colIndex === 0 ? 'border-l-2 border-gray-500' : ''}
                      ${isSelected ? 'bg-gradient-to-br from-purple-500/40 to-blue-500/40 ring-2 ring-purple-400' : ''}
                      ${isFixed ? 'text-gray-300 bg-gray-700/50' : ''}
                      ${!isFixed && !isSelected && !isError ? 'text-cyan-300 bg-gray-800/80 hover:bg-gray-700/80' : ''}
                      ${isError ? 'text-red-400 bg-red-500/20' : ''}
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
              className="px-4 py-3 sm:px-6 sm:py-4 text-lg sm:text-xl font-bold bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border border-gray-600"
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
            className="px-4 py-3 sm:px-6 sm:py-4 text-lg sm:text-xl font-bold bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Clear
          </button>
        </div>

        {/* Game Controls */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <button
            onClick={provideHint}
            disabled={gameState.hintsUsed >= gameState.maxHints}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-br from-yellow-500 to-amber-500 text-white rounded-2xl hover:from-yellow-600 hover:to-amber-600 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl font-bold text-lg"
          >
            💡 Hint
          </button>
          <button
            onClick={checkBoard}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl font-bold text-lg"
          >
            🔍 Check
          </button>
          <button
            onClick={generateNewPuzzle}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl font-bold text-lg"
          >
            🎮 New Game
          </button>
        </div>

        {/* Stats */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
          <h3 className="text-xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Game Statistics
          </h3>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
              <div className="text-sm text-gray-400 font-medium mb-1">Games Played</div>
              <div className="text-2xl font-bold text-purple-400">{gameState.stats.gamesPlayed}</div>
            </div>
            <div className="text-center p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
              <div className="text-sm text-gray-400 font-medium mb-1">Games Won</div>
              <div className="text-2xl font-bold text-green-400">{gameState.stats.gamesWon}</div>
            </div>
            <div className="text-center p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
              <div className="text-sm text-gray-400 font-medium mb-1">Best Time</div>
              <div className="text-2xl font-bold text-cyan-400">
                {gameState.stats.bestTime === Infinity ? '--:--' : formatTime(gameState.stats.bestTime)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}