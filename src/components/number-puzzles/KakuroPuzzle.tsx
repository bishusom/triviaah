'use client';

import confetti from 'canvas-confetti';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSound } from '@/context/SoundContext';
import { getDailyKakuro, type KakuroPuzzleData } from '@/lib/number-puzzles/kakuro-sb';

type Grid = string[][];
type Solution = number[][];

const emptyGrid = (): Grid =>
  Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => ''));

export default function KakuroPuzzle() {
  const [puzzle, setPuzzle] = useState<KakuroPuzzleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [grid, setGrid] = useState<Grid>(emptyGrid);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [feedback, setFeedback] = useState('Fill the grid so each row and column matches its clue sum with no repeated digits.');
  const [isComplete, setIsComplete] = useState(false);
  const [stats, setStats] = useState({ played: 0, won: 0 });
  const { isMuted } = useSound();
  const inputRefs = useRef<Array<Array<HTMLInputElement | null>>>([]);

  useEffect(() => {
    const loadPuzzle = async () => {
      setIsLoading(true);
      setLoadError('');

      const dailyPuzzle = await getDailyKakuro();
      if (!dailyPuzzle) {
        setLoadError('Today’s Kakuro puzzle is unavailable right now. Please try again shortly.');
        setIsLoading(false);
        return;
      }

      setPuzzle(dailyPuzzle);
      setIsLoading(false);
    };

    loadPuzzle();
  }, []);

  const solution = useMemo(() => puzzle?.solution ?? [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [puzzle]);

  useEffect(() => {
    if (!puzzle) return;
    setGrid(emptyGrid());
    setSelectedCell({ row: 0, col: 0 });
    setHintsUsed(0);
    setTimeElapsed(0);
    setIsComplete(false);
    setFeedback('Fill the grid so each row and column matches its clue sum with no repeated digits.');
    setStats((prev) => ({ ...prev, played: prev.played + 1 }));
  }, [puzzle]);

  useEffect(() => {
    if (isComplete) return undefined;
    const timer = window.setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isComplete]);

  const playSound = (src: string) => {
    if (isMuted) return;
    try {
      const audio = new Audio(src);
      audio.play().catch(() => undefined);
    } catch {
      // ignore sound errors
    }
  };

  const moveSelection = (row: number, col: number) => {
    const nextRow = Math.min(2, Math.max(0, row));
    const nextCol = Math.min(2, Math.max(0, col));
    setSelectedCell({ row: nextRow, col: nextCol });
    inputRefs.current[nextRow]?.[nextCol]?.focus();
  };

  const getRowValues = (board: Grid, row: number) =>
    board[row].filter(Boolean).map((value) => Number(value));
  const getColValues = (board: Grid, col: number) =>
    board.map((row) => row[col]).filter(Boolean).map((value) => Number(value));

  const isRunValid = (values: number[]) => new Set(values).size === values.length;
  const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

  const checkCompletion = (nextGrid: Grid) => {
    if (!puzzle) return;

    const filled = nextGrid.every((row) => row.every(Boolean));
    if (!filled) return;

    const rowsValid = puzzle.rowSums.every((target, rowIndex) => {
      const values = getRowValues(nextGrid, rowIndex);
      return isRunValid(values) && sum(values) === target;
    });

    const colsValid = puzzle.colSums.every((target, colIndex) => {
      const values = getColValues(nextGrid, colIndex);
      return isRunValid(values) && sum(values) === target;
    });

    const matchesSolution = nextGrid.every((row, rowIndex) =>
      row.every((value, colIndex) => Number(value) === solution[rowIndex][colIndex])
    );

    if (rowsValid && colsValid && matchesSolution) {
      setIsComplete(true);
      setStats((prev) => ({ ...prev, won: prev.won + 1 }));
      setFeedback('Kakuro solved. Every run matches its clue total.');
      playSound('/sounds/win.mp3');
      confetti({ particleCount: 120, spread: 75, origin: { y: 0.7 } });
    } else {
      setFeedback('The sums look close, but at least one row or column still needs correction.');
    }
  };

  const updateCell = (row: number, col: number, value: string) => {
    const digit = value.slice(-1).replace(/[^1-9]/g, '');
    const nextGrid = grid.map((gridRow, rowIndex) =>
      gridRow.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) return digit;
        return cell;
      })
    );

    setGrid(nextGrid);
    if (digit) {
      playSound('/sounds/click.mp3');
      if (col < 2) moveSelection(row, col + 1);
      else if (row < 2) moveSelection(row + 1, 0);
    }
    if (nextGrid.every((gridRow) => gridRow.every(Boolean))) {
      checkCompletion(nextGrid);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    if (event.key === 'Backspace' && !grid[row][col]) {
      if (col > 0) moveSelection(row, col - 1);
      else if (row > 0) moveSelection(row - 1, 2);
      return;
    }

    if (event.key === 'ArrowUp') moveSelection(row - 1, col);
    if (event.key === 'ArrowDown') moveSelection(row + 1, col);
    if (event.key === 'ArrowLeft') moveSelection(row, col - 1);
    if (event.key === 'ArrowRight') moveSelection(row, col + 1);
  };

  const revealHint = () => {
    if (hintsUsed >= 2 || isComplete) {
      setFeedback('No hints remaining for this Kakuro board.');
      return;
    }

    const emptyCells = [];
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        if (!grid[row][col]) emptyCells.push({ row, col });
      }
    }

    if (emptyCells.length === 0) return;
    const target = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const nextGrid = grid.map((gridRow, rowIndex) =>
      gridRow.map((cell, colIndex) => {
        if (rowIndex === target.row && colIndex === target.col) {
          return String(solution[rowIndex][colIndex]);
        }
        return cell;
      })
    );

    setGrid(nextGrid);
    setHintsUsed((prev) => prev + 1);
    setFeedback(`Hint revealed at row ${target.row + 1}, column ${target.col + 1}.`);
    playSound('/sounds/correct.mp3');
    if (nextGrid.every((row) => row.every(Boolean))) {
      checkCompletion(nextGrid);
    }
  };

  const resetPuzzle = () => {
    setGrid(emptyGrid());
    setSelectedCell({ row: 0, col: 0 });
    setHintsUsed(0);
    setTimeElapsed(0);
    setIsComplete(false);
    setFeedback('Board reset. Try again with fresh eyes.');
    setStats((prev) => ({ ...prev, played: prev.played + 1 }));
  };

  if (isLoading) {
    return (
      <section className="bg-gray-900/80 border border-gray-700 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Kakuro</h1>
          <p className="text-gray-300">Loading today&apos;s puzzle...</p>
        </div>
      </section>
    );
  }

  if (!puzzle) {
    return (
      <section className="bg-gray-900/80 border border-gray-700 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Kakuro</h1>
          <p className="text-red-300">{loadError}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-900/80 border border-gray-700 rounded-3xl p-6 md:p-8 shadow-2xl">
      <div className="text-center mb-8">
        <span className="inline-flex items-center bg-purple-500/15 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
          Daily Mini Kakuro
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Kakuro</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Fill each run with unique digits so every row and column matches its target sum.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="w-fit mx-auto rounded-3xl bg-gray-950 border border-gray-700 p-4">
            <div className="grid grid-cols-4 gap-2">
              <div className="h-16 w-16 rounded-2xl bg-gray-800 border border-gray-700" />
              {puzzle.colSums.map((clue) => (
                <div
                  key={`col-${clue}`}
                  className="h-16 w-16 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-lg font-bold text-purple-200"
                >
                  {clue}
                </div>
              ))}

              {grid.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="contents">
                  <div className="h-16 w-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-lg font-bold text-cyan-200">
                    {puzzle.rowSums[rowIndex]}
                  </div>
                  {row.map((value, colIndex) => {
                    const rowValues = getRowValues(grid, rowIndex);
                    const colValues = getColValues(grid, colIndex);
                    const hasConflict =
                      (rowValues.length !== new Set(rowValues).size && value !== '') ||
                      (colValues.length !== new Set(colValues).size && value !== '');

                    return (
                      <input
                        key={`${rowIndex}-${colIndex}`}
                        ref={(element) => {
                          if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
                          inputRefs.current[rowIndex][colIndex] = element;
                        }}
                        value={value}
                        onChange={(event) => updateCell(rowIndex, colIndex, event.target.value)}
                        onKeyDown={(event) => handleKeyDown(event, rowIndex, colIndex)}
                        onFocus={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                        className={`h-16 w-16 rounded-2xl border text-center text-2xl font-bold outline-none transition ${
                          hasConflict
                            ? 'border-red-400 bg-red-500/10 text-red-100'
                            : selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                              ? 'border-purple-400 bg-purple-500/15 text-white shadow-lg shadow-purple-500/20'
                              : 'border-gray-600 bg-gray-800 text-white hover:border-purple-500/60'
                        }`}
                        maxLength={1}
                        inputMode="numeric"
                        autoComplete="off"
                        spellCheck={false}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={revealHint}
              className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 font-medium transition-colors"
            >
              Reveal Digit
            </button>
            <button
              onClick={() => checkCompletion(grid)}
              className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 font-medium transition-colors"
            >
              Check Board
            </button>
            <button
              onClick={resetPuzzle}
              className="rounded-xl bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 font-medium transition-colors"
            >
              Reset Board
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="rounded-2xl bg-gray-800 border border-gray-700 p-4">
              <div className="text-sm text-gray-400">Board</div>
              <div className="text-lg font-semibold text-white">{puzzle.title}</div>
            </div>
            <div className="rounded-2xl bg-gray-800 border border-gray-700 p-4">
              <div className="text-sm text-gray-400">Hints Used</div>
              <div className="text-lg font-semibold text-white">{hintsUsed}/2</div>
            </div>
            <div className="rounded-2xl bg-gray-800 border border-gray-700 p-4">
              <div className="text-sm text-gray-400">Time</div>
              <div className="text-lg font-semibold text-white">{timeElapsed}s</div>
            </div>
            <div className="rounded-2xl bg-gray-800 border border-gray-700 p-4">
              <div className="text-sm text-gray-400">Solved</div>
              <div className="text-lg font-semibold text-white">{stats.won}</div>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-800/70 border border-gray-700 p-4">
            <p className={`${isComplete ? 'text-green-300' : 'text-gray-300'} text-sm`}>{feedback}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-gray-800 border border-gray-700 p-5">
            <h2 className="text-xl font-bold text-white mb-4">Kakuro Rules</h2>
            <ul className="space-y-2 text-gray-300">
              <li>Each row must add up to the clue shown on the left.</li>
              <li>Each column must add up to the clue shown on the top.</li>
              <li>You cannot repeat a digit within the same row or column run.</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-gray-800 border border-gray-700 p-5">
            <h2 className="text-xl font-bold text-white mb-4">Solving Tips</h2>
            <ul className="space-y-2 text-gray-300">
              <li>Low sums usually force smaller digits.</li>
              <li>Check both the row clue and the column clue before placing a number.</li>
              <li>If a run already contains a digit, it cannot be used again in that run.</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-gray-800 border border-gray-700 p-5">
            <h2 className="text-xl font-bold text-white mb-4">Why Kakuro Works</h2>
            <p className="text-gray-300">
              Kakuro blends arithmetic with logic. You are not just adding numbers, you are narrowing
              valid combinations while watching for duplicates across intersecting runs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
