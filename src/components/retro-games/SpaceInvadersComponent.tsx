// src/components/retro-games/SpaceInvadersComponent.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, Play, Rocket } from 'lucide-react';
import {
  createGame, updateGame, fireBullet, type SpaceInvadersGame,
  CANVAS_WIDTH, CANVAS_HEIGHT
} from '@/lib/retro-games/space-invaders-logic';

export default function SpaceInvaders() {
  const [game, setGame] = useState<SpaceInvadersGame>(createGame());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysPressed = useRef<Record<string, boolean>>({});
  const requestRef = useRef<number | null>(null);

  const handleStart = useCallback(() => {
    setGame(prev => {
      if (prev.gameState === 'ready' || prev.gameState === 'gameover') {
        return { ...createGame(), gameState: 'playing' };
      }
      if (prev.gameState === 'levelComplete') {
        return { ...createGame(), score: prev.score, level: prev.level + 1, gameState: 'playing' };
      }
      return prev;
    });
  }, []);

  const handleTouchControl = useCallback((key: 'ArrowLeft' | 'ArrowRight', pressed: boolean) => {
    keysPressed.current[key] = pressed;
  }, []);

  const handleFire = useCallback(() => {
    setGame(prev => fireBullet(prev));
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Define the keys that should not trigger browser scrolling
    const keysToBlock = [' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    
    if (keysToBlock.includes(e.key)) {
        e.preventDefault(); // This stops the browser from scrolling
    }

    keysPressed.current[e.key] = true;

    if (e.key === 'Enter') {
        setGame(prev => {
        if (prev.gameState === 'ready' || prev.gameState === 'gameover') 
            return { ...createGame(), gameState: 'playing' };
        if (prev.gameState === 'levelComplete') 
            return { ...createGame(), score: prev.score, level: prev.level + 1, gameState: 'playing' };
        return prev;
        });
    }

    if (e.key === ' ') {
        setGame(prev => fireBullet(prev));
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

  // Game Loop
  const animate = useCallback(() => {
    setGame(prev => updateGame(prev, keysPressed.current));
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [animate]);

  // Draw Function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Player
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(game.player.position.x, game.player.position.y, game.player.width, game.player.height);
    ctx.fillRect(game.player.position.x + 12, game.player.position.y - 5, 6, 5); // Cannon

    // Draw Aliens
    game.aliens.forEach(alien => {
      if (!alien.alive) return;
      ctx.fillStyle = alien.type === 0 ? '#ff00ff' : (alien.type === 1 ? '#00ffff' : '#ffffff');
      ctx.fillRect(alien.position.x, alien.position.y, alien.width, alien.height);
      // Small eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(alien.position.x + 5, alien.position.y + 5, 4, 4);
      ctx.fillRect(alien.position.x + 21, alien.position.y + 5, 4, 4);
    });

    // Draw Bullets
    game.bullets.forEach(bullet => {
      ctx.fillStyle = bullet.owner === 'player' ? '#ffff00' : '#ff0000';
      ctx.fillRect(bullet.position.x - 1, bullet.position.y, 2, 10);
    });

  }, [game]);

  return (
    <div className="flex flex-col items-center bg-gray-900 p-8 rounded-xl shadow-2xl border-4 border-gray-700">
      <div className="flex justify-between w-full mb-4 px-2 text-green-500 font-mono text-xl">
        <div>SCORE: {game.score.toString().padStart(4, '0')}</div>
        <div>LIVES: {'❤'.repeat(game.lives)}</div>
      </div>

      <div className="relative w-full max-w-[560px]">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT} 
          className="h-auto w-full touch-none border-2 border-green-900 bg-black shadow-[0_0_20px_rgba(0,255,0,0.1)]"
        />
        
        {game.gameState !== 'playing' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-green-400 font-mono text-center p-4">
            <h2 className="text-4xl mb-4 blink">{game.gameState === 'ready' ? 'READY PLAYER ONE' : game.gameState.toUpperCase()}</h2>
            <p className="text-sm text-green-700 mb-8">USE ARROWS TO MOVE • SPACE TO SHOOT</p>
            <button 
              className="px-6 py-2 border-2 border-green-500 hover:bg-green-500 hover:text-black transition-colors"
              onClick={() => setGame(prev => ({...createGame(), gameState: 'playing'}))}
            >
              PRESS ENTER TO START
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 flex w-full max-w-[560px] items-center justify-center gap-3 md:hidden">
        <button
          type="button"
          aria-label="Move left"
          onTouchStart={() => handleTouchControl('ArrowLeft', true)}
          onTouchEnd={() => handleTouchControl('ArrowLeft', false)}
          onTouchCancel={() => handleTouchControl('ArrowLeft', false)}
          onMouseDown={() => handleTouchControl('ArrowLeft', true)}
          onMouseUp={() => handleTouchControl('ArrowLeft', false)}
          onMouseLeave={() => handleTouchControl('ArrowLeft', false)}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-700 text-white active:scale-95 active:bg-green-600"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          aria-label="Shoot"
          onClick={handleFire}
          className="flex h-14 min-w-[6rem] items-center justify-center gap-2 rounded-2xl bg-pink-600 px-4 text-white active:scale-95 active:bg-pink-500"
        >
          <Rocket className="h-5 w-5" />
          <span className="text-sm font-semibold">Fire</span>
        </button>
        <button
          type="button"
          aria-label="Move right"
          onTouchStart={() => handleTouchControl('ArrowRight', true)}
          onTouchEnd={() => handleTouchControl('ArrowRight', false)}
          onTouchCancel={() => handleTouchControl('ArrowRight', false)}
          onMouseDown={() => handleTouchControl('ArrowRight', true)}
          onMouseUp={() => handleTouchControl('ArrowRight', false)}
          onMouseLeave={() => handleTouchControl('ArrowRight', false)}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-700 text-white active:scale-95 active:bg-green-600"
        >
          <ArrowRight className="h-6 w-6" />
        </button>
        <button
          type="button"
          aria-label="Start or restart game"
          onClick={handleStart}
          className="flex h-14 min-w-[6rem] items-center justify-center gap-2 rounded-2xl border border-green-400 bg-black px-4 text-green-300 active:scale-95 active:bg-green-950"
        >
          <Play className="h-5 w-5" />
          <span className="text-sm font-semibold">
            {game.gameState === 'playing' ? 'Live' : game.gameState === 'levelComplete' ? 'Next' : 'Start'}
          </span>
        </button>
      </div>
    </div>
  );
}
