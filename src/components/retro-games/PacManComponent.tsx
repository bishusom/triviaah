'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Pause, Play, RotateCcw } from 'lucide-react';
import {
  createGame, updateGame, changeDirection, startGame, pauseGame,
  resetGame, nextLevel, type PacmanGame, type Direction,
  TILE_SIZE, MAZE_WIDTH, MAZE_HEIGHT,
} from '@/lib/retro-games/pacman-logic';

export default function PacmanGame() {
  const [game, setGame] = useState<PacmanGame>(createGame());
  const [highScore, setHighScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pacman-highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    if (game.score > highScore) {
      setHighScore(game.score);
      localStorage.setItem('pacman-highscore', game.score.toString());
    }
  }, [game.score, highScore]);

  const handleAction = useCallback(() => {
    setGame(g => {
      if (g.gameState === 'ready') return startGame(g);
      if (g.gameState === 'levelComplete') return nextLevel(g);
      if (g.gameState === 'gameover') return resetGame(g);
      return pauseGame(g);
    });
  }, []);

  const handleReset = useCallback(() => {
    setGame(g => resetGame(g));
  }, []);

  const handleDirection = useCallback((dir: Direction) => {
    setGame(g => changeDirection(g, dir));
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      setGame(g => {
        if (g.gameState === 'ready') return startGame(g);
        if (g.gameState === 'levelComplete') return nextLevel(g);
        if (g.gameState === 'gameover') return resetGame(g);
        return g;
      });
    }

    if (e.key === ' ' || e.key === 'Escape') {
      e.preventDefault();
      setGame(g => pauseGame(g));
    }

    let dir: Direction = null;
    switch (e.key) {
      case 'ArrowUp': case 'w': dir = 'up'; break;
      case 'ArrowDown': case 's': dir = 'down'; break;
      case 'ArrowLeft': case 'a': dir = 'left'; break;
      case 'ArrowRight': case 'd': dir = 'right'; break;
    }

    if (dir) {
      e.preventDefault();
      setGame(g => changeDirection(g, dir));
    }
  }, []);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // FIXED GAME LOOP
  useEffect(() => {
    if (game.gameState !== 'playing') {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const loop = () => {
      setGame(prev => updateGame(prev));
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [game.gameState]);

  // RENDER LOGIC (Remains largely the same, but ensures game dependency)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render Walls
    ctx.strokeStyle = '#2121DE';
    ctx.lineWidth = 2;
    for (let y = 0; y < MAZE_HEIGHT; y++) {
      for (let x = 0; x < MAZE_WIDTH; x++) {
        if (game.maze[y][x] === 1) {
          ctx.strokeRect(x * TILE_SIZE + 2, y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        }
      }
    }

    // Render Dots
    ctx.fillStyle = '#FFB897';
    for (let y = 0; y < MAZE_HEIGHT; y++) {
      for (let x = 0; x < MAZE_WIDTH; x++) {
        if (game.dots[y][x]) {
          ctx.beginPath();
          ctx.arc(x * TILE_SIZE + TILE_SIZE/2, y * TILE_SIZE + TILE_SIZE/2, 2, 0, Math.PI*2);
          ctx.fill();
        }
      }
    }

    // Power Pellets
    game.powerPellets.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x * TILE_SIZE + TILE_SIZE/2, p.y * TILE_SIZE + TILE_SIZE/2, 5, 0, Math.PI*2);
      ctx.fill();
    });

    // Render Pacman
    const px = game.pacman.position.x * TILE_SIZE + TILE_SIZE/2;
    const py = game.pacman.position.y * TILE_SIZE + TILE_SIZE/2;
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(px, py, TILE_SIZE/2 - 2, 0.2 * Math.PI, 1.8 * Math.PI); // Simplified for now
    ctx.lineTo(px, py);
    ctx.fill();

    // Render Ghosts
    game.ghosts.forEach(g => {
      ctx.fillStyle = g.mode === 'frightened' ? '#2121DE' : g.mode === 'eaten' ? '#555' : g.color;
      const gx = g.position.x * TILE_SIZE + TILE_SIZE/2;
      const gy = g.position.y * TILE_SIZE + TILE_SIZE/2;
      ctx.beginPath();
      ctx.arc(gx, gy, TILE_SIZE/2 - 2, Math.PI, 0);
      ctx.lineTo(gx + TILE_SIZE/2 - 2, gy + TILE_SIZE/2 - 2);
      ctx.lineTo(gx - TILE_SIZE/2 + 2, gy + TILE_SIZE/2 - 2);
      ctx.fill();
    });

  }, [game]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="text-white mb-4 flex gap-10">
        <div>SCORE: {game.score}</div>
        <div>HIGH: {highScore}</div>
      </div>

      {/* Game Stats Bar */}
      <div className="flex justify-between w-full max-w-md px-4 py-2 bg-blue-900/20 rounded-lg mb-4">
        <div className="text-white">
          <span className="text-gray-400 text-xs block">CURRENT MODE</span>
          <span className={game.frightenedMode ? "text-blue-400 animate-pulse" : "text-yellow-400"}>
            {game.frightenedMode ? 'FRIGHTENED' : game.globalMode.toUpperCase()}
          </span>
        </div>
        <div className="text-right text-white">
          <span className="text-gray-400 text-xs block">SCORE</span>
          <span className="text-xl font-mono">{game.score.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="relative w-full max-w-[560px] overflow-hidden rounded-xl border-4 border-blue-800">
        <canvas
          ref={canvasRef}
          width={MAZE_WIDTH * TILE_SIZE}
          height={MAZE_HEIGHT * TILE_SIZE}
          className="h-auto w-full touch-none"
        />
        {game.gameState !== 'playing' && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-yellow-400 text-2xl">
            {game.gameState.toUpperCase()}! PRESS ENTER
          </div>
        )}
      </div>

      <div className="mt-5 w-full max-w-[560px] rounded-2xl border border-blue-900/60 bg-blue-950/40 p-4 md:hidden">
        <div className="mb-4 flex justify-center">
          <button
            type="button"
            aria-label="Move up"
            onClick={() => handleDirection('up')}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-900/80 text-white active:scale-95 active:bg-blue-700"
          >
            <ArrowUp className="h-6 w-6" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Move left"
            onClick={() => handleDirection('left')}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-900/80 text-white active:scale-95 active:bg-blue-700"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label={game.gameState === 'playing' ? 'Pause game' : 'Start or continue'}
            onClick={handleAction}
            className="flex h-14 min-w-[5.5rem] items-center justify-center gap-2 rounded-2xl bg-yellow-500 px-4 text-black active:scale-95 active:bg-yellow-400"
          >
            {game.gameState === 'playing' ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            <span className="text-sm font-bold">
              {game.gameState === 'levelComplete' ? 'Next' : game.gameState === 'gameover' ? 'Retry' : game.gameState === 'playing' ? 'Pause' : 'Play'}
            </span>
          </button>
          <button
            type="button"
            aria-label="Move right"
            onClick={() => handleDirection('right')}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-900/80 text-white active:scale-95 active:bg-blue-700"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Reset game"
            onClick={handleReset}
            className="flex h-12 min-w-[5.5rem] items-center justify-center gap-2 rounded-2xl bg-slate-700 px-4 text-white active:scale-95 active:bg-slate-600"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="text-sm font-semibold">Reset</span>
          </button>
          <button
            type="button"
            aria-label="Move down"
            onClick={() => handleDirection('down')}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-900/80 text-white active:scale-95 active:bg-blue-700"
          >
            <ArrowDown className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
