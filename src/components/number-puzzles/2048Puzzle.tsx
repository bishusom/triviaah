'use client';

import { event } from '@/lib/gtag';
import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react';
import confetti from 'canvas-confetti';
import { useSound } from '@/context/SoundContext';

type Direction = 'up' | 'down' | 'left' | 'right';
type StatusType = 'info' | 'success' | 'warning' | 'error';
type SoundType = 'select' | 'found' | 'win' | 'error';

interface GameState {
  board: number[][];
  score: number;
  bestScore: number;
  moves: number;
  won: boolean;
  gameOver: boolean;
}

interface Feedback {
  message: string;
  type: StatusType;
}

interface MoveOutcome {
  message: string;
  type: StatusType;
  sound: SoundType;
  shouldConfetti?: boolean;
  eventName?: string;
  eventLabel?: string;
}

const SIZE = 4;
const STORAGE_KEY = 'triviaah-2048-state';

const createEmptyBoard = () => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

const cloneBoard = (board: number[][]) => board.map(row => [...row]);

const boardsEqual = (a: number[][], b: number[][]) =>
  a.every((row, rowIndex) => row.every((value, colIndex) => value === b[rowIndex][colIndex]));

const getEmptyCells = (board: number[][]) => {
  const cells: Array<{ row: number; col: number }> = [];
  board.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (value === 0) cells.push({ row: rowIndex, col: colIndex });
    });
  });
  return cells;
};

const addRandomTile = (board: number[][]) => {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return board;

  const next = cloneBoard(board);
  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  next[row][col] = Math.random() < 0.9 ? 2 : 4;
  return next;
};

const hasTile = (board: number[][], target: number) => board.some(row => row.includes(target));

const canMove = (board: number[][]) => {
  if (getEmptyCells(board).length > 0) return true;

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const value = board[row][col];
      if (row < SIZE - 1 && board[row + 1][col] === value) return true;
      if (col < SIZE - 1 && board[row][col + 1] === value) return true;
    }
  }

  return false;
};

const slideLine = (line: number[]) => {
  const compact = line.filter(value => value !== 0);
  const merged: number[] = [];
  let scoreGained = 0;

  for (let i = 0; i < compact.length; i++) {
    const current = compact[i];
    if (i + 1 < compact.length && current === compact[i + 1]) {
      const mergedValue = current * 2;
      merged.push(mergedValue);
      scoreGained += mergedValue;
      i++;
    } else {
      merged.push(current);
    }
  }

  while (merged.length < SIZE) {
    merged.push(0);
  }

  return { line: merged, scoreGained };
};

const moveBoard = (board: number[][], direction: Direction) => {
  const nextBoard = createEmptyBoard();
  let moved = false;
  let scoreGained = 0;

  const readLine = (index: number) => {
    switch (direction) {
      case 'left':
        return board[index];
      case 'right':
        return [...board[index]].reverse();
      case 'up':
        return board.map(row => row[index]);
      case 'down':
        return board.map(row => row[index]).reverse();
    }
  };

  const writeLine = (index: number, line: number[]) => {
    switch (direction) {
      case 'left':
        nextBoard[index] = line;
        break;
      case 'right':
        nextBoard[index] = [...line].reverse();
        break;
      case 'up':
        line.forEach((value, rowIndex) => {
          nextBoard[rowIndex][index] = value;
        });
        break;
      case 'down':
        [...line].reverse().forEach((value, rowIndex) => {
          nextBoard[rowIndex][index] = value;
        });
        break;
    }
  };

  for (let index = 0; index < SIZE; index++) {
    const line = readLine(index);
    const processed = slideLine(line);
    scoreGained += processed.scoreGained;
    writeLine(index, processed.line);
  }

  moved = !boardsEqual(board, nextBoard);

  return { board: nextBoard, moved, scoreGained };
};

const initialGameState = (): GameState => {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);

  return {
    board,
    score: 0,
    bestScore: 0,
    moves: 0,
    won: false,
    gameOver: false,
  };
};

const tileStyles = (value: number) => {
  if (value === 0) return 'bg-[#17304f] border border-[#3d6a98]';
  if (value === 2) return 'bg-[#f4fbff] text-[#0d1b2d] border border-[#cfe7ff] shadow-[0_0_12px_rgba(125,211,252,0.15)]';
  if (value === 4) return 'bg-[#dff3ff] text-[#0d1b2d] border border-[#b8dcff] shadow-[0_0_14px_rgba(96,165,250,0.18)]';
  if (value === 8) return 'bg-gradient-to-br from-sky-100 to-cyan-100 text-[#0d1b2d] border border-sky-200 shadow-[0_0_16px_rgba(56,189,248,0.24)]';
  if (value === 16) return 'bg-gradient-to-br from-sky-200 to-blue-200 text-[#0d1b2d] border border-sky-300 shadow-[0_0_18px_rgba(59,130,246,0.28)]';
  if (value === 32) return 'bg-gradient-to-br from-blue-300 to-cyan-300 text-[#0d1b2d] border border-blue-300 shadow-[0_0_18px_rgba(14,165,233,0.3)]';
  if (value === 64) return 'bg-gradient-to-br from-blue-400 to-sky-400 text-white border border-blue-300 shadow-[0_0_20px_rgba(37,99,235,0.32)]';
  if (value === 128) return 'bg-gradient-to-br from-cyan-400 to-sky-400 text-white border border-cyan-300 shadow-[0_0_22px_rgba(6,182,212,0.34)]';
  if (value === 256) return 'bg-gradient-to-br from-sky-500 to-blue-500 text-white border border-sky-300 shadow-[0_0_24px_rgba(59,130,246,0.36)]';
  if (value === 512) return 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white border border-blue-400 shadow-[0_0_26px_rgba(14,165,233,0.38)]';
  if (value === 1024) return 'bg-gradient-to-br from-indigo-600 to-sky-500 text-white border border-indigo-300 shadow-[0_0_28px_rgba(99,102,241,0.4)]';
  if (value === 2048) return 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white border border-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.45)]';
  return 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-white border border-cyan-300 shadow-[0_0_24px_rgba(59,130,246,0.35)]';
};

const tileFontSize = (value: number) => {
  if (value >= 10000) return 'text-lg md:text-xl';
  if (value >= 1000) return 'text-xl md:text-2xl';
  if (value >= 100) return 'text-2xl md:text-3xl';
  return 'text-3xl md:text-4xl';
};

export default function Puzzle2048() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [feedback, setFeedback] = useState<Feedback>({
    message: 'Swipe or use arrow keys to merge tiles and reach 2048.',
    type: 'info',
  });
  const { isMuted } = useSound();
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const hasHydratedRef = useRef(false);
  const hasTrackedStartRef = useRef(false);
  const pendingOutcomeRef = useRef<MoveOutcome | null>(null);

  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;

    const sounds: Record<SoundType, string> = {
      select: '/sounds/click.mp3',
      found: '/sounds/correct.mp3',
      win: '/sounds/win.mp3',
      error: '/sounds/incorrect.mp3',
    };

    try {
      const audio = new Audio(sounds[type]);
      audio.play().catch(err => console.error(`Error playing ${type} sound:`, err));
    } catch (err) {
      console.error('Sound error:', err);
    }
  }, [isMuted]);

  const showConfetti = useCallback(() => {
    if (!confettiCanvasRef.current) {
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#f97316', '#facc15', '#ffffff'],
      });
      return;
    }

    const boom = confetti.create(confettiCanvasRef.current, {
      resize: true,
      useWorker: true,
    });

    boom({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#f97316', '#facc15', '#ffffff'],
    });
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as GameState;
        if (parsed.board && parsed.board.length === SIZE) {
          setGameState(prev => ({
            ...prev,
            ...parsed,
            bestScore: Math.max(prev.bestScore, parsed.bestScore || 0),
          }));
          setFeedback({
            message: 'Game restored. Continue from where you left off.',
            type: 'info',
          });
        }
      }
    } catch (error) {
      console.error('Failed to load 2048 state:', error);
    } finally {
      hasHydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    const outcome = pendingOutcomeRef.current;
    if (!outcome) return;

    pendingOutcomeRef.current = null;
    setFeedback({ message: outcome.message, type: outcome.type });
    playSound(outcome.sound);

    if (outcome.shouldConfetti) {
      showConfetti();
    }

    if (outcome.eventName) {
      event({
        action: outcome.eventName,
        category: 'number_2048',
        label: outcome.eventLabel || '2048',
      });
    }
  }, [gameState, playSound, showConfetti]);

  const restartGame = useCallback(() => {
    pendingOutcomeRef.current = null;
    hasTrackedStartRef.current = false;
    setGameState(prev => {
      let board = createEmptyBoard();
      board = addRandomTile(board);
      board = addRandomTile(board);
      return {
        board,
        score: 0,
        bestScore: prev.bestScore,
        moves: 0,
        won: false,
        gameOver: false,
      };
    });
    setFeedback({
      message: 'New game started.',
      type: 'info',
    });
    playSound('select');
  }, [playSound]);

  const moveGame = useCallback((direction: Direction) => {
    if (gameState.gameOver) return;

    const result = moveBoard(gameState.board, direction);
    if (!result.moved) {
      setFeedback({
        message: 'That move does not change the board.',
        type: 'warning',
      });
      playSound('select');
      return;
    }

    if (!hasTrackedStartRef.current) {
      hasTrackedStartRef.current = true;
      event({
        action: 'number_2048_started',
        category: 'number_2048',
        label: '2048',
      });
    }

    const boardWithTile = addRandomTile(result.board);
    const hasReached2048 = gameState.won || hasTile(boardWithTile, 2048);
    const isGameOver = !canMove(boardWithTile);
    const nextScore = gameState.score + result.scoreGained;
    const nextBestScore = Math.max(gameState.bestScore, nextScore);

    pendingOutcomeRef.current = hasReached2048 && !gameState.won
      ? {
          message: '2048 reached. You can keep playing for a higher score.',
          type: 'success',
          sound: 'win',
          shouldConfetti: true,
          eventName: 'number_2048_win',
          eventLabel: `score_${nextScore}`,
        }
      : isGameOver && !gameState.gameOver
      ? {
          message: 'No more moves left. Game over.',
          type: 'error',
          sound: 'error',
          eventName: 'number_2048_game_over',
          eventLabel: `score_${nextScore}`,
        }
      : {
          message: result.scoreGained > 0
            ? `Merged tiles for +${result.scoreGained} points.`
            : 'Board moved.',
          type: result.scoreGained > 0 ? 'success' : 'info',
          sound: result.scoreGained > 0 ? 'found' : 'select',
          eventLabel: `move_${gameState.moves + 1}`,
        };

    setGameState({
      board: boardWithTile,
      score: nextScore,
      bestScore: nextBestScore,
      moves: gameState.moves + 1,
      won: hasReached2048,
      gameOver: isGameOver,
    });
  }, [gameState, playSound]);

  useEffect(() => {
    const handleKeyDown = (eventKey: KeyboardEvent) => {
      const key = eventKey.key.toLowerCase();
      if (['arrowup', 'w', 'arrowdown', 's', 'arrowleft', 'a', 'arrowright', 'd'].includes(key)) {
        eventKey.preventDefault();
      }

      switch (key) {
        case 'arrowup':
        case 'w':
          moveGame('up');
          break;
        case 'arrowdown':
        case 's':
          moveGame('down');
          break;
        case 'arrowleft':
        case 'a':
          moveGame('left');
          break;
        case 'arrowright':
        case 'd':
          moveGame('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveGame]);

  const onTouchStart = (eventTouch: TouchEvent<HTMLDivElement>) => {
    const touch = eventTouch.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (eventTouch: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    if (!start) return;

    const touch = eventTouch.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) {
      touchStartRef.current = null;
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      moveGame(dx > 0 ? 'right' : 'left');
    } else {
      moveGame(dy > 0 ? 'down' : 'up');
    }

    touchStartRef.current = null;
  };

  const highestTile = Math.max(...gameState.board.flat());
  const isVictory = gameState.won;

  const renderTile = (value: number, rowIndex: number, colIndex: number) => {
    if (value === 0) {
      return (
        <div
          key={`${rowIndex}-${colIndex}`}
          className="aspect-square rounded-xl bg-slate-950/50 border border-slate-800/80"
        />
      );
    }

    return (
      <div
        key={`${rowIndex}-${colIndex}`}
        className={[
          'aspect-square rounded-xl flex items-center justify-center font-extrabold shadow-lg transition-transform duration-200',
          tileStyles(value),
          tileFontSize(value),
        ].join(' ')}
      >
        {value}
      </div>
    );
  };

  const controlButtonClass =
    'w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-800/90 border border-slate-700 text-white text-2xl font-bold flex items-center justify-center transition-all duration-200 hover:bg-slate-700 active:scale-95';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-4 md:p-6 flex flex-col items-center justify-center">
      <canvas ref={confettiCanvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-10" />

      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 md:mb-8 p-4 rounded-[2rem] border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-2xl">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-white">2</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
                2048
              </h1>
            </div>
            <p className="text-slate-300 text-sm md:text-base">
              Swipe or use arrow keys to merge tiles and reach the 2048 tile.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
            <div className="px-3 py-2 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[80px]">
              <div className="text-xs uppercase tracking-widest text-slate-400">Score</div>
              <div className="text-xl font-black text-white">{gameState.score}</div>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[80px]">
              <div className="text-xs uppercase tracking-widest text-slate-400">Best</div>
              <div className="text-xl font-black text-amber-300">{gameState.bestScore}</div>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[80px]">
              <div className="text-xs uppercase tracking-widest text-slate-400">Moves</div>
              <div className="text-xl font-black text-white">{gameState.moves}</div>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[80px]">
              <div className="text-xs uppercase tracking-widest text-slate-400">Max</div>
              <div className="text-xl font-black text-orange-300">{highestTile}</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl rounded-[2rem] border border-slate-800 p-4 md:p-6 shadow-2xl">
          {feedback.message && (
            <div
              className={[
                'mb-4 rounded-2xl px-4 py-3 border text-sm md:text-base font-medium text-center',
                feedback.type === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                  : feedback.type === 'warning'
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-200'
                  : feedback.type === 'error'
                  ? 'bg-red-500/15 border-red-500/30 text-red-200'
                  : 'bg-sky-500/15 border-sky-500/30 text-sky-200',
              ].join(' ')}
            >
              {feedback.message}
            </div>
          )}

          {isVictory && (
            <div className="mb-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 to-orange-500/15 p-4 text-center">
              <div className="text-2xl font-black text-white mb-1">You Win!</div>
              <div className="text-amber-200 text-sm md:text-base">
                You reached 2048. Keep going for a bigger score if you want.
              </div>
            </div>
          )}

          {gameState.gameOver && !isVictory && (
            <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/15 p-4 text-center">
              <div className="text-2xl font-black text-white mb-1">Game Over</div>
              <div className="text-red-200 text-sm md:text-base">
                No more legal moves remain.
              </div>
            </div>
          )}

          <div
            className="mx-auto w-full max-w-[min(85vw,20rem)] select-none touch-none"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="grid grid-cols-4 gap-2 rounded-3xl bg-[#142742] p-2.5 border border-[#355a87] shadow-inner">
              {gameState.board.map((row, rowIndex) =>
                row.map((value, colIndex) => renderTile(value, rowIndex, colIndex))
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="grid grid-cols-3 gap-3 md:hidden">
              <div />
              <button onClick={() => moveGame('up')} className={controlButtonClass} aria-label="Move up">
                ↑
              </button>
              <div />
              <button onClick={() => moveGame('left')} className={controlButtonClass} aria-label="Move left">
                ←
              </button>
              <button onClick={restartGame} className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 border border-amber-400 text-white text-lg font-black flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95" aria-label="Restart game">
                ↻
              </button>
              <button onClick={() => moveGame('right')} className={controlButtonClass} aria-label="Move right">
                →
              </button>
              <div />
              <button onClick={() => moveGame('down')} className={controlButtonClass} aria-label="Move down">
                ↓
              </button>
              <div />
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={restartGame}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-semibold text-base min-w-[160px] flex items-center justify-center gap-2"
              >
                🎮 New Game
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-slate-900/70 backdrop-blur-xl rounded-[2rem] border border-slate-800 p-5 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">How to Play</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 text-sm md:text-base">
            <li className="flex items-start gap-2">
              <span className="text-amber-300 mt-1">•</span>
              <span>Swipe or use the arrow keys to move all tiles at once.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-300 mt-1">•</span>
              <span>Tiles with the same value merge when they collide.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-300 mt-1">•</span>
              <span>Each move adds a new 2 or 4 tile to the board.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-300 mt-1">•</span>
              <span>Reach 2048 to win, then keep playing for a higher score.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-300 mt-1">•</span>
              <span>The game ends when no legal moves remain.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-300 mt-1">•</span>
              <span>The best score is saved automatically in your browser.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
