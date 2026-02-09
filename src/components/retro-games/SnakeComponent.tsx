'use client';

import { useState, useEffect, useCallback } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right';
type GameState = 'playing' | 'paused' | 'gameover';

interface Position {
  x: number;
  y: number;
}

interface SnakeGame {
  width: number;
  height: number;
  snake: Position[];
  direction: Direction;
  nextDirection: Direction;
  food: Position;
  score: number;
  highScore: number;
  gameState: GameState;
  speed: number;
}

export default function SnakeComponent() {
  const [game, setGame] = useState<SnakeGame>(() => createGame());
  const [gameOver, setGameOver] = useState(false);

  // Keyboard controls - FIXED
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space to start/pause
      if (e.key === ' ') {
        e.preventDefault();
        if (game.gameState === 'paused') {
          setGame(prev => ({ ...prev, gameState: 'playing' }));
        } else if (game.gameState === 'playing') {
          setGame(prev => ({ ...prev, gameState: 'paused' }));
        }
        return;
      }

      // Enter to restart (any state)
      if (e.key === 'Enter') {
        e.preventDefault();
        setGame(createGame());
        setGameOver(false);
        return;
      }

      // Only accept direction keys when playing
      if (game.gameState !== 'playing') return;

      let newDirection: Direction | null = null;
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          newDirection = 'up';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          newDirection = 'down';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          newDirection = 'left';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          newDirection = 'right';
          break;
      }
      
      if (newDirection) {
        setGame(prev => changeDirection(prev, newDirection!));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game.gameState]);

  // Game loop
  useEffect(() => {
    if (game.gameState !== 'playing') return;

    const interval = setInterval(() => {
      setGame(prev => {
        const newGame = { ...prev };
        const head = newGame.snake[0];
        
        // Update direction
        newGame.direction = newGame.nextDirection;
        
        // Calculate new head position
        let newHead = { ...head };
        switch(newGame.direction) {
          case 'up': newHead.y--; break;
          case 'down': newHead.y++; break;
          case 'left': newHead.x--; break;
          case 'right': newHead.x++; break;
        }
        
        // Check wall collision
        if (newHead.x < 0 || newHead.x >= newGame.width || 
            newHead.y < 0 || newHead.y >= newGame.height) {
          setGameOver(true);
          return { ...newGame, gameState: 'gameover' };
        }
        
        // Check self collision
        if (newGame.snake.some((seg, index) => 
          index > 0 && seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          return { ...newGame, gameState: 'gameover' };
        }
        
        // Move snake
        const newSnake = [newHead, ...newGame.snake.slice(0, -1)];
        
        // Check food collision
        if (newHead.x === newGame.food.x && newHead.y === newGame.food.y) {
          // Grow snake
          newSnake.push({ ...newGame.snake[newGame.snake.length - 1] });
          
          // Increase score
          newGame.score += 1;
          if (newGame.score > newGame.highScore) {
            newGame.highScore = newGame.score;
            localStorage.setItem('snakeHighScore', newGame.highScore.toString());
          }
          
          // Generate new food (not on snake)
          let newFood: Position;
          do {
            newFood = {
              x: Math.floor(Math.random() * newGame.width),
              y: Math.floor(Math.random() * newGame.height),
            };
          } while (newSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
          
          newGame.food = newFood;
        }
        
        return { ...newGame, snake: newSnake };
      });
    }, game.speed);

    return () => clearInterval(interval);
  }, [game.gameState, game.speed]);

  // Render game grid
  const renderGrid = () => {
    const grid = [];
    
    for (let y = 0; y < game.height; y++) {
      for (let x = 0; x < game.width; x++) {
        const isSnake = game.snake.some(seg => seg.x === x && seg.y === y);
        const isHead = game.snake[0].x === x && game.snake[0].y === y;
        const isFood = game.food.x === x && game.food.y === y;
        
        let cellClass = 'bg-gray-900';
        if (isHead) {
          cellClass = 'bg-green-500';
        } else if (isSnake) {
          cellClass = 'bg-green-700';
        } else if (isFood) {
          cellClass = 'bg-red-500 rounded-full animate-pulse';
        } else {
          cellClass = 'bg-gray-800';
        }
        
        grid.push(
          <div
            key={`${x}-${y}`}
            className={`w-4 h-4 md:w-5 md:h-5 ${cellClass}`}
          />
        );
      }
    }
    
    return grid;
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex justify-between mb-4">
        <div className="text-2xl font-bold text-white">Snake</div>
        <div className="text-right">
          <div className="text-white text-lg">Score: {game.score}</div>
          <div className="text-gray-400">Best: {game.highScore}</div>
        </div>
      </div>
      
      <div 
        className="grid gap-px bg-gray-700 p-1 rounded"
        style={{
          gridTemplateColumns: `repeat(${game.width}, 1fr)`,
        }}
      >
        {renderGrid()}
      </div>
      
      <div className="mt-4 text-center">
        {game.gameState === 'paused' && (
          <div className="mb-4">
            <button
              onClick={() => setGame(prev => ({ ...prev, gameState: 'playing' }))}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold"
            >
              Press SPACE to Start
            </button>
            <div className="text-gray-400 text-sm mt-2">
              Use arrow keys or WASD to move
            </div>
          </div>
        )}
        
        {gameOver && (
          <div className="mb-4">
            <div className="text-red-500 text-xl font-bold mb-2">Game Over!</div>
            <button
              onClick={() => {
                setGame(createGame());
                setGameOver(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold"
            >
              Press ENTER to Restart
            </button>
          </div>
        )}
        
        <div className="text-gray-400 text-sm mt-4">
          <div>SPACE: {game.gameState === 'playing' ? 'Pause' : 'Start'}</div>
          <div>ENTER: Restart • ARROWS/WASD: Move</div>
        </div>
      </div>
    </div>
  );
}

function createGame(): SnakeGame {
  const width = 20;
  const height = 15;
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  
  return {
    width,
    height,
    snake: [
      { x: centerX, y: centerY },
      { x: centerX - 1, y: centerY },
      { x: centerX - 2, y: centerY },
    ],
    direction: 'right',
    nextDirection: 'right',
    food: { x: 10, y: 5 },
    score: 0,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
    gameState: 'paused',
    speed: 150,
  };
}

function changeDirection(game: SnakeGame, newDirection: Direction): SnakeGame {
  const oppositeDirections: Record<Direction, Direction> = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left',
  };
  
  if (oppositeDirections[newDirection] === game.direction) {
    return game;
  }
  
  return {
    ...game,
    nextDirection: newDirection,
  };
}