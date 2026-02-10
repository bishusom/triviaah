'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  createGame, updateGame, serveBall, type BreakoutGame,
  CANVAS_WIDTH, CANVAS_HEIGHT
} from '@/lib/retro-games/breakout-logic';

export default function Breakout() {
  const [game, setGame] = useState<BreakoutGame>(createGame());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysPressed = useRef<Record<string, boolean>>({});
  const requestRef = useRef<number | undefined>(undefined);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ([' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault(); // Stop page scrolling
    }
    keysPressed.current[e.key] = true;

    if (e.key === ' ' || e.key === 'Enter') {
      setGame(current => {
        if (current.gameState === 'ready') return serveBall(current);
        if (current.gameState === 'gameover' || current.gameState === 'win') return createGame();
        return current;
      });
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current[e.key] = false;
  }, []);

  // HOOK 1: Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ([' ', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
      keysPressed.current[e.key] = true;
      if ((e.key === ' ' || e.key === 'Enter') && game.gameState === 'ready') setGame(g => serveBall(g));
      if ((e.key === ' ' || e.key === 'Enter') && (game.gameState === 'gameover' || game.gameState === 'win')) setGame(createGame());
    };
    const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [game.gameState]);

  // HOOK 2: The Game Loop (Physics)
  useEffect(() => {
    const animate = () => {
      setGame(prev => updateGame(prev, keysPressed.current));
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  // HOOK 3: Drawing (Rendering)
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Bricks
    game.bricks.forEach(b => {
      if (!b.alive) return;
      ctx.fillStyle = b.powerUp ? '#fff' : b.color;
      ctx.fillRect(b.position.x, b.position.y, b.width, b.height);
      if (b.powerUp) { ctx.strokeStyle = '#00f2ff'; ctx.strokeRect(b.position.x, b.position.y, b.width, b.height); }
    });

    // Draw Paddle
    ctx.fillStyle = game.paddle.isLaser ? '#ef4444' : '#0ea5e9';
    ctx.beginPath();
    ctx.roundRect(game.paddle.position.x, game.paddle.position.y, game.paddle.width, game.paddle.height, 4);
    ctx.fill();

    // Draw Balls
    ctx.fillStyle = '#fff';
    game.balls.forEach(b => {
      ctx.beginPath(); ctx.arc(b.position.x, b.position.y, b.radius, 0, Math.PI * 2); ctx.fill();
    });

    // Draw PowerUps
    game.powerUps.forEach(p => {
      const colors = { multiball: '#00f2ff', enlarge: '#d946ef', laser: '#ef4444' };
      ctx.fillStyle = colors[p.type];
      ctx.beginPath(); ctx.roundRect(p.position.x, p.position.y, p.width, p.height, 4); ctx.fill();
    });

    // Draw Bullets
    ctx.fillStyle = '#ef4444';
    game.bullets.forEach(b => ctx.fillRect(b.position.x - 1, b.position.y, 2, 12));
  }, [game]);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 rounded-2xl">
      <div className="flex justify-between w-full max-w-[480px] mb-4 text-white font-mono uppercase tracking-widest">
        <span>Score: {game.score}</span>
        <span className="text-red-400">{'❤'.repeat(game.lives)}</span>
      </div>

      <div className="relative border-4 border-gray-700 rounded-lg shadow-2xl overflow-hidden">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="bg-black" />
        
        {game.gameState !== 'playing' && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-6">
            <h2 className="text-4xl font-bold text-white mb-2 italic">
              {game.gameState === 'ready' ? 'SERVE BALL' : 
               game.gameState === 'gameover' ? 'GAME OVER' : 'YOU WIN!'}
            </h2>
            <p className="text-sky-400 animate-pulse font-mono uppercase text-sm">
              Press SPACE to {game.gameState === 'ready' ? 'launch' : 'restart'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}