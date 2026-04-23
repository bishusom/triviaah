'use client';

import confetti from 'canvas-confetti';
import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, RefreshCcw, Target } from 'lucide-react';
import { useSound } from '@/context/SoundContext';

type CageOp = '+' | '×';

type Cage = {
  cells: Array<[number, number]>;
  target: number;
  op: CageOp;
};

type KenKenPuzzle = {
  title: string;
  size: number;
  solution: number[][];
  cages: Cage[];
  note: string;
};

const BASE_PUZZLE = {
  title: 'Grid Logic',
  size: 4,
  solution: [
    [1, 4, 3, 2],
    [3, 2, 1, 4],
    [4, 1, 2, 3],
    [2, 3, 4, 1],
  ],
  cages: [
    { cells: [[0, 0], [1, 0]], target: 3, op: '×' },
    { cells: [[0, 1], [0, 2]], target: 12, op: '×' },
    { cells: [[0, 3], [1, 3]], target: 8, op: '×' },
    { cells: [[1, 1], [1, 2]], target: 3, op: '+' },
    { cells: [[2, 0], [3, 0]], target: 8, op: '×' },
    { cells: [[2, 1], [2, 2], [3, 1]], target: 6, op: '+' },
    { cells: [[2, 3], [3, 2], [3, 3]], target: 12, op: '×' },
  ],
  note: 'Fill each row and column with the numbers 1 to 4, and make every cage match its target.',
} satisfies KenKenPuzzle;

function permutePuzzle(puzzle: KenKenPuzzle, mapping: number[]): KenKenPuzzle {
  const transform = (value: number) => mapping[value - 1];
  const solution = puzzle.solution.map((row) => row.map(transform));
  const cages = puzzle.cages.map((cage) => ({
    ...cage,
    target: cage.op === '+' ? cage.cells.reduce((sum, [row, col]) => sum + solution[row][col], 0) : cage.cells.reduce((product, [row, col]) => product * solution[row][col], 1),
  }));

  return { ...puzzle, solution, cages };
}

const KENKEN_PUZZLES: KenKenPuzzle[] = [
  BASE_PUZZLE,
  permutePuzzle(BASE_PUZZLE, [2, 3, 4, 1]),
  permutePuzzle(BASE_PUZZLE, [3, 4, 1, 2]),
];

function emptyBoard(size: number) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => ''));
}

function buildCageMap(cages: Cage[]) {
  const map = new Map<string, number>();
  cages.forEach((cage, cageIndex) => {
    cage.cells.forEach(([row, col]) => {
      map.set(`${row}-${col}`, cageIndex);
    });
  });
  return map;
}

function isValidRow(values: number[]) {
  const required = new Set([1, 2, 3, 4]);
  return values.length === 4 && values.every((value) => required.has(value)) && new Set(values).size === 4;
}

export default function KenKenPuzzleComponent() {
  const { isMuted } = useSound();
  const [puzzleIndex, setPuzzleIndex] = useState(() => new Date().getUTCDate() % KENKEN_PUZZLES.length);
  const puzzle = KENKEN_PUZZLES[puzzleIndex];
  const cageMap = useMemo(() => buildCageMap(puzzle.cages), [puzzle]);
  const [board, setBoard] = useState<string[][]>(() => emptyBoard(puzzle.size));
  const [message, setMessage] = useState('Fill the grid and keep each cage within its target.');
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setBoard(emptyBoard(puzzle.size));
    setMessage('Fill the grid and keep each cage within its target.');
    setSolved(false);
  }, [puzzle]);

  type SoundType = 'select' | 'found' | 'win' | 'error';

  const playSound = (type: SoundType) => {
    if (isMuted) return;
    const sounds: Record<SoundType, string> = {
      select: '/sounds/click.mp3',
      found: '/sounds/correct.mp3',
      error: '/sounds/incorrect.mp3',
      win: '/sounds/win.mp3',
    };
    const audio = new Audio(sounds[type]);
    audio.play().catch(() => undefined);
  };

  const checkBoard = () => {
    const numeric = board.map((row) => row.map((value) => Number(value)));
    const filled = numeric.every((row) => row.every((value) => Number.isInteger(value) && value >= 1 && value <= 4));

    if (!filled) {
      setMessage('Fill every cell with a number from 1 to 4.');
      playSound('error');
      return;
    }

    const rowsValid = numeric.every((row) => isValidRow(row));
    const colsValid = [0, 1, 2, 3].every((col) => isValidRow(numeric.map((row) => row[col])));
    const cagesValid = puzzle.cages.every((cage) => {
      const values = cage.cells.map(([row, col]) => numeric[row][col]);
      if (cage.op === '+') {
        return values.reduce((sum, value) => sum + value, 0) === cage.target;
      }
      return values.reduce((product, value) => product * value, 1) === cage.target;
    });

    if (rowsValid && colsValid && cagesValid) {
      setSolved(true);
      setMessage('Puzzle solved. Every row, column, and cage checks out.');
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      playSound('win');
      return;
    }

    setMessage('Not quite yet. Check the row, column, and cage rules.');
    playSound('error');
  };

  const updateCell = (row: number, col: number, value: string) => {
    const sanitized = value.replace(/[^1-4]/g, '').slice(-1);
    setBoard((current) => {
      const next = current.map((line) => [...line]);
      next[row][col] = sanitized;
      return next;
    });
    setSolved(false);
    playSound('select');
  };

  const firstCellForCage = (row: number, col: number) => {
    const cageIndex = cageMap.get(`${row}-${col}`);
    if (cageIndex === undefined) return false;
    const cage = puzzle.cages[cageIndex];
    return cage.cells[0][0] === row && cage.cells[0][1] === col;
  };

  const borderClasses = (row: number, col: number) => {
    const cageIndex = cageMap.get(`${row}-${col}`);
    const same = (r: number, c: number) => cageMap.get(`${r}-${c}`) === cageIndex;

    return [
      row === 0 || !same(row - 1, col) ? 'border-t-2 border-t-cyan-400/30' : 'border-t border-t-white/10',
      col === 0 || !same(row, col - 1) ? 'border-l-2 border-l-cyan-400/30' : 'border-l border-l-white/10',
      row === puzzle.size - 1 || !same(row + 1, col) ? 'border-b-2 border-b-cyan-400/30' : 'border-b border-b-white/10',
      col === puzzle.size - 1 || !same(row, col + 1) ? 'border-r-2 border-r-cyan-400/30' : 'border-r border-r-white/10',
    ].join(' ');
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-black/30 p-4 md:p-6 shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">KenKen</p>
            <h2 className="mt-2 text-2xl font-black text-white">{puzzle.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">{puzzle.note}</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-white/5 px-4 py-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300/70">Grid</p>
            <p className="mt-1 text-2xl font-black text-white">4 x 4</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/70">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">1-4 once per row</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">1-4 once per column</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Cages match target</span>
        </div>

        <div className="mt-5 overflow-x-auto">
          <div className="mx-auto w-fit rounded-[1.8rem] border-2 border-[#2f6ee5] bg-[#10253f] p-1 shadow-[0_0_0_1px_rgba(59,130,246,0.15),0_18px_40px_rgba(8,15,30,0.45)]">
            <div className="grid grid-cols-4 gap-0.5">
            {board.map((row, rowIndex) =>
              row.map((value, colIndex) => {
                const cageIndex = cageMap.get(`${rowIndex}-${colIndex}`) ?? 0;
                const cage = puzzle.cages[cageIndex];
                const primary = firstCellForCage(rowIndex, colIndex);

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#bfd4ea] ${borderClasses(rowIndex, colIndex)} ${solved ? 'bg-[#d7efdc]' : ''}`}
                  >
                    {primary ? (
                      <span className="absolute left-2 top-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#0d1b2d] md:text-xs">
                        {cage.target}
                        {cage.op}
                      </span>
                    ) : null}
                    <input
                      value={value}
                      onChange={(event) => updateCell(rowIndex, colIndex, event.target.value)}
                      inputMode="numeric"
                      maxLength={1}
                      className="h-full w-full rounded-2xl bg-transparent text-center text-2xl font-black text-black outline-none placeholder:text-black/25"
                      placeholder=""
                    />
                    </div>
                  );
                }),
            )}
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-white/70">{message}</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={checkBoard}
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition-all duration-200 hover:scale-[1.02] active:scale-95"
            style={{
              background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)',
              boxShadow: '0 10px 30px rgba(37,99,235,0.28)',
            }}
          >
            <CheckCircle2 className="h-4 w-4" />
            Check Board
          </button>
          <button
            type="button"
            onClick={() => setPuzzleIndex((index) => (index + 1) % KENKEN_PUZZLES.length)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <RefreshCcw className="h-4 w-4" />
            Next Puzzle
          </button>
        </div>
      </div>
    </div>
  );
}
