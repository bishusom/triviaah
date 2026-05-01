'use client';

import confetti from 'canvas-confetti';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSound } from '@/context/SoundContext';
import { getDailyCrossgrid, type CrossgridPuzzle } from '@/lib/word-games/crossgrid-sb';
import { Volume2, VolumeX, Timer, Trophy, Info } from 'lucide-react';

type Grid = string[][];

const emptyGrid = (): Grid =>
  Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ''));

export default function CrossgridGame() {
  const [puzzle, setPuzzle] = useState<CrossgridPuzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [grid, setGrid] = useState<Grid>(emptyGrid);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [activeDir, setActiveDir] = useState<'across' | 'down'>('across');
  const [stats, setStats] = useState({ played: 0, won: 0 });

  const { isMuted, toggleMute } = useSound();
  const inputRefs = useRef<Array<Array<HTMLInputElement | null>>>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [hintsRemaining, setHintsRemaining] = useState(2);

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('crossgrid-stats');
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  // Timer Logic
  useEffect(() => {
    if (!isComplete && !isLoading && puzzle) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isComplete, isLoading, puzzle]);

  useEffect(() => {
    const loadPuzzle = async () => {
      setIsLoading(true);
      setLoadError('');
      const dailyPuzzle = await getDailyCrossgrid();
      if (!dailyPuzzle) {
        setLoadError('Today’s 5x5 Crossgrid is unavailable. Please try again later.');
      } else {
        setPuzzle(dailyPuzzle);
        // Track a played game
        const newStats = { ...stats, played: stats.played + 1 };
        setStats(newStats);
        localStorage.setItem('crossgrid-stats', JSON.stringify(newStats));
      }
      setIsLoading(false);
    };
    loadPuzzle();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    if (isComplete) return;
    const newChar = value.slice(-1).toUpperCase();
    if (newChar && !/^[A-Z]$/.test(newChar)) return;

    const newGrid = grid.map((r, ri) =>
      r.map((c, ci) => (ri === row && ci === col ? newChar : c))
    );
    setGrid(newGrid);

    // Auto-advance
    if (newChar) {
      if (col < 4) {
        inputRefs.current[row][col + 1]?.focus();
      } else if (row < 4) {
        inputRefs.current[row + 1][0]?.focus();
      }
    }

    if (puzzle && checkIsComplete(newGrid, puzzle.words)) {
      handleWin();
    }
  };

  const handleKeyDown = (row: number, col: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !grid[row][col] && col > 0) {
      inputRefs.current[row][col - 1]?.focus();
    } else if (e.key === 'ArrowRight' && col < 4) {
      inputRefs.current[row][col + 1]?.focus();
    } else if (e.key === 'ArrowLeft' && col > 0) {
      inputRefs.current[row][col - 1]?.focus();
    } else if (e.key === 'ArrowDown' && row < 4) {
      inputRefs.current[row + 1][col]?.focus();
    } else if (e.key === 'ArrowUp' && row > 0) {
      inputRefs.current[row - 1][col]?.focus();
    }
  };

  const checkIsComplete = (currentGrid: Grid, solution: string[]) => {
    return currentGrid.every((row, i) => row.join('').toUpperCase() === solution[i]);
  };

  const handleWin = () => {
    setIsComplete(true);
    setFeedback(`Magnificent! Solved in ${formatTime(timeElapsed)}`);
    const newStats = { ...stats, won: stats.won + 1 };
    setStats(newStats);
    localStorage.setItem('crossgrid-stats', JSON.stringify(newStats));
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  };

  const handleHint = () => {
    if (hintsRemaining <= 0 || isComplete || !puzzle) return;

    const invalidCells: { r: number, c: number }[] = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (grid[r][c] !== puzzle.words[r][c]) {
          invalidCells.push({ r, c });
        }
      }
    }

    if (invalidCells.length > 0) {
      const randomCell = invalidCells[Math.floor(Math.random() * invalidCells.length)];
      const newGrid = [...grid];
      newGrid[randomCell.r] = [...newGrid[randomCell.r]];
      newGrid[randomCell.r][randomCell.c] = puzzle.words[randomCell.r][randomCell.c];
      setGrid(newGrid);
      setHintsRemaining(prev => prev - 1);

      if (checkIsComplete(newGrid, puzzle.words)) {
        handleWin();
      }
    }
  };

  const handleGiveUp = () => {
    if (isComplete || !puzzle) return;

    const solutionGrid = puzzle.words.map(word => word.split(''));
    setGrid(solutionGrid);
    setIsComplete(true);
    setFeedback("Better luck next time!");
    if (timerRef.current) clearInterval(timerRef.current);
  };

  if (isLoading) return <div className="text-center p-10 text-white animate-pulse">Loading daily 5x5...</div>;
  if (loadError) return <div className="text-center p-10 text-red-400">{loadError}</div>;
  if (!puzzle) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header Area */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">CROSSGRID 5x5</h1>
          <p className="text-gray-400 text-sm">Every row and column is a word.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
            <Timer className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-mono">{formatTime(timeElapsed)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Game Board - 7 Cols */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3 mb-6 max-w-md mx-auto">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  ref={(el) => {
                    if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
                    inputRefs.current[rowIndex][colIndex] = el;
                  }}
                  type="text"
                  value={cell}
                  onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(rowIndex, colIndex, e)}
                  onFocus={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                  className={`w-full aspect-square text-center text-xl sm:text-2xl font-bold uppercase rounded-lg border-2 transition-all outline-none
                    ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                      ? 'bg-[#8ec5ff] border-blue-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                      : 'bg-[#e6f2ff] hover:bg-[#d8ebff] text-black border-[#31567f]'
                    } ${isComplete ? 'border-green-400 bg-green-600/80 text-white' : ''}`}
                />
              ))
            )}
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center sm:items-stretch gap-4 px-4 sm:px-0 mb-6">
            <button
              onClick={handleHint}
              disabled={hintsRemaining <= 0 || isComplete}
              className="w-full sm:w-auto flex-1 max-w-[180px] px-4 sm:px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md font-semibold text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              💡 Hint ({hintsRemaining})
            </button>
            <button
              onClick={handleGiveUp}
              disabled={isComplete}
              className="w-full sm:w-auto flex-1 max-w-[180px] px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-red-500 hover:to-rose-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md font-semibold text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              🏳️ Give Up
            </button>
          </div>

          {feedback && (
            <div className={`p-4 rounded-2xl text-center font-bold animate-bounce ${isComplete && hintsRemaining >= 0 && feedback.includes("Magnificent") ? 'bg-emerald-900/30 border border-emerald-500/50 text-emerald-400' : 'bg-red-900/30 border border-red-500/50 text-red-400'}`}>
              {feedback}
            </div>
          )}
        </div>

        {/* Clue Panel - 5 Cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-gray-800/40 border border-gray-700 p-1">
            <div className="flex p-1 bg-gray-900/50 rounded-2xl mb-2">
              <button
                onClick={() => setActiveDir('across')}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${activeDir === 'across' ? 'bg-cyan-500 text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
              >
                ACROSS
              </button>
              <button
                onClick={() => setActiveDir('down')}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${activeDir === 'down' ? 'bg-emerald-500 text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
              >
                DOWN
              </button>
            </div>

            <div className="p-2 space-y-1">
              {(activeDir === 'across' ? puzzle.acrossClues : puzzle.downClues).map((clue, index) => (
                <div
                  key={`${activeDir}-${index}`}
                  className={`flex items-start p-3 rounded-xl transition-colors ${(activeDir === 'across' ? selectedCell?.row === index : selectedCell?.col === index)
                    ? 'bg-gray-700/60 ring-1 ring-gray-600'
                    : ''
                    }`}
                >
                  <span className={`font-black mr-3 text-sm ${activeDir === 'across' ? 'text-cyan-400' : 'text-emerald-400'}`}>
                    {index + 1}
                  </span>
                  <span className="text-gray-200 text-sm leading-relaxed">{clue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats & Rules */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/80 border border-gray-700 p-4 rounded-2xl text-center">
              <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
              <div className="text-xl font-black text-white">{stats.won}</div>
              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Wins</div>
            </div>
            <div className="bg-gray-800/80 border border-gray-700 p-4 rounded-2xl text-center">
              <Info className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <div className="text-xl font-black text-white">5x5</div>
              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Grid Size</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}