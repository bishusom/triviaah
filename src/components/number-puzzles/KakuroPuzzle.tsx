'use client';

import confetti from 'canvas-confetti';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSound } from '@/context/SoundContext';

type Position = { row: number; col: number };
type Grid = Record<string, string>;
type TemplateBlockCell = { kind: 'block' };
type TemplateClueCell = { kind: 'clue' };
type TemplatePlayCell = { kind: 'play'; value: number };
type TemplateCell = TemplateBlockCell | TemplateClueCell | TemplatePlayCell;
type BlockCell = { kind: 'block' };
type ClueCell = { kind: 'clue'; right?: number; down?: number };
type PlayCell = { kind: 'play'; solution: number };
type KakuroCell = BlockCell | ClueCell | PlayCell;
type KakuroRun = { id: string; clue: number; cells: Position[] };
type DifficultyKey = 'easy' | 'intermediate' | 'advanced';
type DifficultyConfig = {
  key: DifficultyKey;
  label: string;
  badge: string;
  playableSize: number;
  boardWidthClass: string;
  hintLimit: number;
  breaks: Position[];
};
type PuzzleData = {
  id: string;
  title: string;
  cells: KakuroCell[][];
  runs: KakuroRun[];
  playableCells: Position[];
  firstCell: Position | null;
  boardSize: number;
  difficulty: DifficultyKey;
};

const DIFFICULTIES: DifficultyConfig[] = [
  {
    key: 'easy',
    label: 'Easy',
    badge: 'Easy 4x4',
    playableSize: 4,
    boardWidthClass: 'w-[280px] sm:w-[320px] md:w-[360px]',
    hintLimit: 2,
    breaks: [],
  },
  {
    key: 'intermediate',
    label: 'Intermediate',
    badge: 'Intermediate 6x6',
    playableSize: 6,
    boardWidthClass: 'w-[294px] sm:w-[336px] md:w-[392px]',
    hintLimit: 3,
    breaks: [
      { row: 2, col: 3 },
      { row: 2, col: 4 },
      { row: 3, col: 3 },
      { row: 4, col: 4 },
    ],
  },
  {
    key: 'advanced',
    label: 'Advanced',
    badge: 'Advanced 8x8',
    playableSize: 8,
    boardWidthClass: 'w-[306px] sm:w-[378px] md:w-[450px]',
    hintLimit: 4,
    breaks: [
      { row: 3, col: 4 },
      { row: 3, col: 6 },
      { row: 4, col: 5 },
      { row: 5, col: 3 },
      { row: 5, col: 6 },
      { row: 6, col: 4 },
    ],
  },
];

function cellKey(row: number, col: number) {
  return `${row}-${col}`;
}

function isPlayCell(cell: KakuroCell): cell is PlayCell {
  return cell.kind === 'play';
}

function shuffle<T>(items: T[]) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function createDigitMap() {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const shuffledDigits = shuffle(digits);

  return Object.fromEntries(digits.map((digit, index) => [digit, shuffledDigits[index]])) as Record<number, number>;
}

function createTemplate(config: DifficultyConfig): TemplateCell[][] {
  const boardSize = config.playableSize + 1;
  const breakKeys = new Set(config.breaks.map(({ row, col }) => cellKey(row, col)));

  // Create a randomized sequence for each row to avoid diagonal repetition
  const rowSequences = Array.from({ length: boardSize }, () =>
    shuffle(Array.from({ length: config.playableSize }, (_, i) => i + 1))
  );

  return Array.from({ length: boardSize }, (_, rowIndex) =>
    Array.from({ length: boardSize }, (_, colIndex) => {
      if (rowIndex === 0 && colIndex === 0) {
        return { kind: 'block' } satisfies TemplateBlockCell;
      }

      if (rowIndex === 0 || colIndex === 0 || breakKeys.has(cellKey(rowIndex, colIndex))) {
        return { kind: 'clue' } satisfies TemplateClueCell;
      }

      // Use the shuffled sequence for this specific row
      // We use (colIndex - 1) to map the playable column to the shuffled array
      const val = rowSequences[rowIndex][colIndex - 1];

      return {
        kind: 'play',
        value: val,
      } satisfies TemplatePlayCell;
    })
  );
}

function createPuzzle(seed: number, variant: number, config: DifficultyConfig): PuzzleData {
  const digitMap = createDigitMap();
  const template = createTemplate(config);
  const cells: KakuroCell[][] = template.map((row) =>
    row.map((cell) => {
      if (cell.kind === 'block') return { kind: 'block' };
      if (cell.kind === 'clue') return { kind: 'clue' };
      return { kind: 'play', solution: digitMap[cell.value] };
    })
  );

  const runs: KakuroRun[] = [];
  const playableCells: Position[] = [];

  for (let row = 0; row < cells.length; row += 1) {
    for (let col = 0; col < cells[row].length; col += 1) {
      const cell = cells[row][col];

      if (isPlayCell(cell)) {
        playableCells.push({ row, col });
      }

      if (cell.kind !== 'clue') {
        continue;
      }

      const rightCells: Position[] = [];
      for (let nextCol = col + 1; nextCol < cells[row].length; nextCol += 1) {
        const nextCell = cells[row][nextCol];
        if (!isPlayCell(nextCell)) break;
        rightCells.push({ row, col: nextCol });
      }

      if (rightCells.length > 0) {
        const rightTotal = rightCells.reduce((sum, position) => {
          const runCell = cells[position.row][position.col];
          return sum + (isPlayCell(runCell) ? runCell.solution : 0);
        }, 0);

        cell.right = rightTotal;
        runs.push({ id: `row-${row}-${col}`, clue: rightTotal, cells: rightCells });
      }

      const downCells: Position[] = [];
      for (let nextRow = row + 1; nextRow < cells.length; nextRow += 1) {
        const nextCell = cells[nextRow][col];
        if (!isPlayCell(nextCell)) break;
        downCells.push({ row: nextRow, col });
      }

      if (downCells.length > 0) {
        const downTotal = downCells.reduce((sum, position) => {
          const runCell = cells[position.row][position.col];
          return sum + (isPlayCell(runCell) ? runCell.solution : 0);
        }, 0);

        cell.down = downTotal;
        runs.push({ id: `col-${row}-${col}`, clue: downTotal, cells: downCells });
      }
    }
  }

  return {
    id: `generated-${config.key}-${variant}-${seed}`,
    title: `${config.label} ${config.playableSize}x${config.playableSize} #${variant + 1}`,
    cells,
    runs,
    playableCells,
    firstCell: playableCells[0] ?? null,
    boardSize: cells.length,
    difficulty: config.key,
  };
}

function createEmptyGrid(puzzle: PuzzleData): Grid {
  return Object.fromEntries(puzzle.playableCells.map(({ row, col }) => [cellKey(row, col), '']));
}

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function KakuroPuzzle() {
  const [difficulty, setDifficulty] = useState<DifficultyKey>('intermediate');
  const [puzzleIndex, setPuzzleIndex] = useState(() => Math.floor(Math.random() * 9));
  const [puzzleSeed, setPuzzleSeed] = useState(() => Date.now());
  const [grid, setGrid] = useState<Grid>({});
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [feedback, setFeedback] = useState('Fill every white cell so each run hits its clue total without repeating digits.');
  const [isComplete, setIsComplete] = useState(false);
  const [stats, setStats] = useState({ played: 0, won: 0 });
  const { isMuted } = useSound();
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const activeDifficulty = DIFFICULTIES.find((entry) => entry.key === difficulty) ?? DIFFICULTIES[1];

  const puzzle = useMemo(
    () => createPuzzle(puzzleSeed, puzzleIndex, activeDifficulty),
    [activeDifficulty, puzzleIndex, puzzleSeed]
  );

  useEffect(() => {
    setGrid(createEmptyGrid(puzzle));
    setSelectedCell(puzzle.firstCell);
    setHintsUsed(0);
    setTimeElapsed(0);
    setIsComplete(false);
    setFeedback(`Fill every white cell so each run hits its clue total without repeating digits on this ${activeDifficulty.badge.toLowerCase()} board.`);
    setStats((prev) => ({ ...prev, played: prev.played + 1 }));
  }, [activeDifficulty.badge, puzzle]);

  useEffect(() => {
    if (!puzzle.firstCell) return;
    const firstCell = puzzle.firstCell;
    window.setTimeout(() => {
      const key = cellKey(firstCell.row, firstCell.col);
      inputRefs.current[key]?.focus();
    }, 0);
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

  const focusCell = ({ row, col }: Position) => {
    const key = cellKey(row, col);
    setSelectedCell({ row, col });
    inputRefs.current[key]?.focus();
  };

  const moveDirection = (row: number, col: number, rowDelta: number, colDelta: number) => {
    let nextRow = row + rowDelta;
    let nextCol = col + colDelta;

    while (
      nextRow >= 0 &&
      nextRow < puzzle.cells.length &&
      nextCol >= 0 &&
      nextCol < puzzle.cells[nextRow].length
    ) {
      if (isPlayCell(puzzle.cells[nextRow][nextCol])) {
        focusCell({ row: nextRow, col: nextCol });
        return;
      }

      nextRow += rowDelta;
      nextCol += colDelta;
    }
  };

  const moveLinear = (row: number, col: number, offset: number) => {
    const currentIndex = puzzle.playableCells.findIndex((cell) => cell.row === row && cell.col === col);
    if (currentIndex === -1) return;

    const nextCell = puzzle.playableCells[currentIndex + offset];
    if (nextCell) {
      focusCell(nextCell);
    }
  };

  const getRunValues = (run: KakuroRun, board: Grid) =>
    run.cells
      .map(({ row, col }) => board[cellKey(row, col)])
      .filter(Boolean)
      .map((value) => Number(value));

  const hasUniqueDigits = (values: number[]) => new Set(values).size === values.length;
  const sumValues = (values: number[]) => values.reduce((total, value) => total + value, 0);

  const getConflictedKeys = (board: Grid) => {
    const conflicted = new Set<string>();

    puzzle.runs.forEach((run) => {
      const values = run.cells.map(({ row, col }) => ({
        key: cellKey(row, col),
        value: board[cellKey(row, col)],
      }));

      const filled = values.filter((entry) => entry.value !== '');
      const digits = filled.map((entry) => Number(entry.value));
      const duplicateExists = new Set(digits).size !== digits.length;
      const runIsFull = filled.length === run.cells.length;
      const sumMismatch = runIsFull && sumValues(digits) !== run.clue;

      if (!duplicateExists && !sumMismatch) return;
      filled.forEach((entry) => conflicted.add(entry.key));
    });

    return conflicted;
  };

  const checkCompletion = (board: Grid) => {
    const allFilled = puzzle.playableCells.every(({ row, col }) => board[cellKey(row, col)]);
    if (!allFilled) {
      setFeedback('The board still has empty cells.');
      return;
    }

    const runsValid = puzzle.runs.every((run) => {
      const values = getRunValues(run, board);
      return values.length === run.cells.length && hasUniqueDigits(values) && sumValues(values) === run.clue;
    });

    const matchesSolution = puzzle.playableCells.every(({ row, col }) => {
      const value = board[cellKey(row, col)];
      const cell = puzzle.cells[row][col];
      return isPlayCell(cell) && Number(value) === cell.solution;
    });

    if (runsValid && matchesSolution) {
      setIsComplete(true);
      setStats((prev) => ({ ...prev, won: prev.won + 1 }));
      setFeedback('Kakuro solved. Every run matches its clue total.');
      playSound('/sounds/win.mp3');
      confetti({ particleCount: 110, spread: 70, origin: { y: 0.7 } });
      return;
    }

    setFeedback('At least one run has a duplicate digit or the wrong total.');
  };

  const updateCell = (row: number, col: number, value: string) => {
    const digit = value.slice(-1).replace(/[^1-9]/g, '');
    const key = cellKey(row, col);
    const nextGrid = { ...grid, [key]: digit };

    setGrid(nextGrid);
    if (digit) {
      playSound('/sounds/click.mp3');
      moveLinear(row, col, 1);
    }

    const allFilled = puzzle.playableCells.every(({ row: playRow, col: playCol }) => nextGrid[cellKey(playRow, playCol)]);
    if (allFilled) {
      checkCompletion(nextGrid);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveDirection(row, col, -1, 0);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveDirection(row, col, 1, 0);
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveDirection(row, col, 0, -1);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveDirection(row, col, 0, 1);
      return;
    }

    if (event.key === 'Backspace' && !grid[cellKey(row, col)]) {
      event.preventDefault();
      moveLinear(row, col, -1);
    }
  };

  const revealHint = () => {
    if (hintsUsed >= activeDifficulty.hintLimit || isComplete) {
      setFeedback('No hints remaining for this board.');
      return;
    }

    const emptyCells = puzzle.playableCells.filter(({ row, col }) => !grid[cellKey(row, col)]);
    if (emptyCells.length === 0) return;

    const target = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const cell = puzzle.cells[target.row][target.col];
    if (!isPlayCell(cell)) return;

    const nextGrid = { ...grid, [cellKey(target.row, target.col)]: String(cell.solution) };
    setGrid(nextGrid);
    setHintsUsed((prev) => prev + 1);
    setFeedback(`Hint revealed at row ${target.row}, column ${target.col}.`);
    playSound('/sounds/correct.mp3');

    const allFilled = puzzle.playableCells.every(({ row, col }) => nextGrid[cellKey(row, col)]);
    if (allFilled) {
      checkCompletion(nextGrid);
    }
  };

  const clearBoard = () => {
    setGrid(createEmptyGrid(puzzle));
    setSelectedCell(puzzle.firstCell);
    setHintsUsed(0);
    setTimeElapsed(0);
    setIsComplete(false);
    setFeedback('Board cleared. Try again.');
    if (puzzle.firstCell) {
      const firstCell = puzzle.firstCell;
      window.setTimeout(() => focusCell(firstCell), 0);
    }
  };

  const generatePuzzle = () => {
    setPuzzleIndex(Math.floor(Math.random() * 9));
    setPuzzleSeed(Date.now());
  };

  const changeDifficulty = (nextDifficulty: DifficultyKey) => {
    setDifficulty(nextDifficulty);
    setPuzzleIndex(Math.floor(Math.random() * 9));
    setPuzzleSeed(Date.now());
  };

  const conflictedKeys = getConflictedKeys(grid);

  return (
    <section className="bg-gray-900/80 border border-gray-700 rounded-3xl p-5 md:p-7 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Kakuro</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Choose between easy `4x4`, intermediate `6x6`, and advanced `8x8` puzzles.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {DIFFICULTIES.map((option) => (
              <button
                key={option.key}
                onClick={() => changeDifficulty(option.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${option.key === difficulty
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                  }`}
              >
                {option.badge}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <div className={`mx-auto ${activeDifficulty.boardWidthClass}`}>
              <div
                className="grid aspect-square border-[2px] border-[#12243a] bg-[#12243a] shadow-[0_12px_28px_rgba(0,0,0,0.28)]"
                style={{
                  gridTemplateColumns: `repeat(${puzzle.boardSize}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${puzzle.boardSize}, minmax(0, 1fr))`,
                  gap: '2px',
                }}
              >
                {puzzle.cells.flatMap((boardRow, rowIndex) =>
                  boardRow.map((cell, colIndex) => {
                    const key = cellKey(rowIndex, colIndex);
                    const cellBaseClass = 'box-border block aspect-square h-full w-full min-h-0 min-w-0';

                    if (cell.kind === 'block') {
                      return (
                        <div
                          key={key}
                          className={`${cellBaseClass} bg-[#4a6787]`}
                        />
                      );
                    }

                    if (cell.kind === 'clue') {
                      return (
                        <div
                          key={key}
                          className={`relative ${cellBaseClass} overflow-hidden bg-[#9fb9d4]`}
                        >
                          <div className="absolute inset-0 bg-[#9fb9d4]" />
                          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_48.4%,#12243a_48.5%,#12243a_51.5%,transparent_51.6%)]" />
                          <div
                            className="absolute inset-0 bg-[#bdd2e8]"
                            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                          />
                          <div
                            className="absolute inset-0 bg-[#7fa1c4]"
                            style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}
                          />
                          {cell.right ? (
                            <span className="absolute top-[18%] left-[58%] -translate-x-1/2 text-sm font-bold leading-none text-[#0d1b2d] sm:text-base">
                              {cell.right}
                            </span>
                          ) : null}
                          {cell.down ? (
                            <span className="absolute left-[22%] top-[68%] -translate-y-1/2 text-sm font-bold leading-none text-[#0d1b2d] sm:text-base">
                              {cell.down}
                            </span>
                          ) : null}
                        </div>
                      );
                    }

                    const value = grid[key] ?? '';
                    const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                    const hasConflict = conflictedKeys.has(key);

                    return (
                      <input
                        key={key}
                        ref={(element) => {
                          inputRefs.current[key] = element;
                        }}
                        value={value}
                        onChange={(event) => updateCell(rowIndex, colIndex, event.target.value)}
                        onKeyDown={(event) => handleKeyDown(event, rowIndex, colIndex)}
                        onFocus={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                        className={`${cellBaseClass} appearance-none rounded-none border-0 p-0 bg-[#eef6ff] text-center align-middle text-xl font-semibold leading-none text-[#0d1b2d] outline-none transition sm:text-2xl ${hasConflict
                          ? 'bg-[#ffd7d1] text-[#9f2f1f]'
                          : isSelected
                            ? 'bg-[#cfe7ff] ring-2 ring-inset ring-[#2d5f91]'
                            : 'hover:bg-[#deefff]'
                          }`}
                        maxLength={1}
                        inputMode="numeric"
                        autoComplete="off"
                        spellCheck={false}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center sm:items-stretch gap-4 px-4 sm:px-0">
            <button
              onClick={generatePuzzle}
              className="w-full sm:w-auto flex-1 max-w-[180px] px-4 sm:px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-semibold text-sm sm:text-base whitespace-nowrap"
            >
              🎮 New Puzzle
            </button>
            <button
              onClick={() => checkCompletion(grid)}
              className="w-full sm:w-auto flex-1 max-w-[180px] px-4 sm:px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md font-semibold text-sm sm:text-base whitespace-nowrap"
            >
              ✅ Check Board
            </button>
            <button
              onClick={revealHint}
              className="w-full sm:w-auto flex-1 max-w-[180px] px-4 sm:px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md font-semibold text-sm sm:text-base whitespace-nowrap"
            >
              💡 Reveal Digit
            </button>
            <button
              onClick={clearBoard}
              className="w-full sm:w-auto flex-1 max-w-[180px] px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-100 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md font-semibold text-sm sm:text-base whitespace-nowrap"
            >
              ↩️ Clear Board
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 text-center">
            <div className="rounded-2xl bg-gray-800 border border-gray-700 p-4">
              <div className="text-sm text-gray-400">Board</div>
              <div className="text-lg font-semibold text-white">{puzzle.title}</div>
            </div>
            <div className="rounded-2xl bg-gray-800 border border-gray-700 p-4">
              <div className="text-sm text-gray-400">Hints Used</div>
              <div className="text-lg font-semibold text-white">{hintsUsed}/{activeDifficulty.hintLimit}</div>
            </div>
            <div className="rounded-2xl bg-gray-800 border border-gray-700 p-4">
              <div className="text-sm text-gray-400">Time</div>
              <div className="text-lg font-semibold text-white">{formatTimer(timeElapsed)}</div>
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

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl bg-gray-800 border border-gray-700 p-5">
            <h2 className="text-xl font-bold text-white mb-4">Rules</h2>
            <ul className="space-y-2 text-gray-300">
              <li>Each clue cell controls the white run to its right, below, or both.</li>
              <li>The digits in that run must add up to the clue.</li>
              <li>A digit cannot repeat inside the same run.</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-gray-800 border border-gray-700 p-5">
            <h2 className="text-xl font-bold text-white mb-4">What Changed</h2>
            <ul className="space-y-2 text-gray-300">
              <li>The board is generated locally instead of being read from Supabase.</li>
              <li>You can now switch between easy `4x4`, intermediate `6x6`, and advanced `8x8` puzzles.</li>
              <li>The board keeps the blue site palette and clue-cell split styling across all three sizes.</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-gray-800 border border-gray-700 p-5">
            <h2 className="text-xl font-bold text-white mb-4">Notes</h2>
            <p className="text-gray-300">
              Each difficulty uses its own board size and clue layout, then randomizes the digits to produce
              a fresh valid puzzle while preserving a consistent Kakuro structure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
