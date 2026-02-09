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

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Optimized Game Loop
  const animate = useCallback(() => {
    setGame(prev => updateGame(prev, keysPressed.current));
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  // Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Bricks
    game.bricks.forEach(brick => {
      if (!brick.alive) return;
      ctx.fillStyle = brick.color;
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.fillRect(brick.position.x, brick.position.y, brick.width, brick.height);
      ctx.shadowBlur = 0;
      
      // Bevel effect
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.strokeRect(brick.position.x, brick.position.y, brick.width, brick.height);
    });

    // Paddle
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    // RoundRect is modern, standard in most browsers now
    ctx.roundRect(game.paddle.position.x, game.paddle.position.y, game.paddle.width, game.paddle.height, 4);
    ctx.fill();

    // Ball
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fff';
    ctx.beginPath();
    ctx.arc(game.ball.position.x, game.ball.position.y, game.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

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