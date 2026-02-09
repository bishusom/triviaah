// src/lib/retrogames/snake-logic-simple.ts

export type Direction = 'up' | 'down' | 'left' | 'right';
export type GameState = 'playing' | 'paused' | 'gameover';

export interface Position {
  x: number;
  y: number;
}

export interface SnakeSegment extends Position {
  type: 'head' | 'body' | 'tail';
  direction: Direction;
}

export interface Food extends Position {
  type: 'normal';
  value: number;
}

export interface SnakeGame {
  width: number;
  height: number;
  gridSize: number;
  snake: SnakeSegment[];
  direction: Direction;
  nextDirection: Direction;
  food: Food[];
  score: number;
  highScore: number;
  gameState: GameState;
  speed: number;
  lastUpdateTime: number;
  isGrowing: boolean;
}

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150; // ms per move

export function createGame(
  width: number = 30,
  height: number = 20,
): SnakeGame {
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  
  const initialSnake: SnakeSegment[] = [
    { x: centerX, y: centerY, type: 'head', direction: 'right' },
    { x: centerX - 1, y: centerY, type: 'body', direction: 'right' },
    { x: centerX - 2, y: centerY, type: 'body', direction: 'right' },
    { x: centerX - 3, y: centerY, type: 'tail', direction: 'right' },
  ];
  
  return {
    width,
    height,
    gridSize: GRID_SIZE,
    snake: initialSnake,
    direction: 'right',
    nextDirection: 'right',
    food: [],
    score: 0,
    highScore: 0,
    gameState: 'paused',
    speed: INITIAL_SPEED,
    lastUpdateTime: Date.now(),
    isGrowing: false,
  };
}

export function updateGame(game: SnakeGame): SnakeGame {
  const now = Date.now();
  const deltaTime = now - game.lastUpdateTime;
  
  if (game.gameState !== 'playing' || deltaTime < game.speed) {
    return { ...game, lastUpdateTime: now };
  }
  
  let newGame = { ...game };
  
  // Update direction
  newGame.direction = newGame.nextDirection;
  
  // Calculate new head position
  const head = { ...newGame.snake[0] };
  let newHead: Position;
  
  switch (newGame.direction) {
    case 'up':
      newHead = { x: head.x, y: head.y - 1 };
      break;
    case 'down':
      newHead = { x: head.x, y: head.y + 1 };
      break;
    case 'left':
      newHead = { x: head.x - 1, y: head.y };
      break;
    case 'right':
      newHead = { x: head.x + 1, y: head.y };
      break;
  }
  
  // Check collision with walls
  if (
    newHead.x < 0 ||
    newHead.x >= newGame.width ||
    newHead.y < 0 ||
    newHead.y >= newGame.height
  ) {
    return { ...newGame, gameState: 'gameover' };
  }
  
  // Check collision with self
  for (let i = 0; i < newGame.snake.length; i++) {
    const segment = newGame.snake[i];
    if (segment.x === newHead.x && segment.y === newHead.y) {
      // Allow head to pass through tail when just moved (tail will move away)
      if (i === newGame.snake.length - 1 && !newGame.isGrowing) {
        // This is ok - tail will move away
      } else {
        return { ...newGame, gameState: 'gameover' };
      }
    }
  }
  
  // Update snake segments
  const newSnake: SnakeSegment[] = [];
  
  // New head
  newSnake.push({
    ...newHead,
    type: 'head',
    direction: newGame.direction,
  });
  
  // Move body segments
  for (let i = 0; i < newGame.snake.length - 1; i++) {
    const segment = newGame.snake[i];
    newSnake.push({
      ...segment,
      type: 'body',
      direction: newGame.snake[i + 1].direction,
    });
  }
  
  // Handle tail
  const lastSegment = newGame.snake[newGame.snake.length - 1];
  newSnake.push({
    ...lastSegment,
    type: 'tail',
    direction: newGame.snake[newGame.snake.length - 2]?.direction || newGame.direction,
  });
  
  // Remove old tail if not growing
  if (!newGame.isGrowing) {
    newSnake.pop();
  } else {
    newGame.isGrowing = false;
  }
  
  newGame.snake = newSnake;
  
  // Check for food collision
  let foodEaten = false;
  let foodValue = 0;
  
  newGame.food = newGame.food.filter(food => {
    if (food.x === newHead.x && food.y === newHead.y) {
      foodEaten = true;
      foodValue = food.value;
      return false; // Remove eaten food
    }
    return true;
  });
  
  if (foodEaten) {
    // Grow snake
    newGame.isGrowing = true;
    
    // Update score
    newGame.score += foodValue;
    
    // Update high score
    if (newGame.score > newGame.highScore) {
      newGame.highScore = newGame.score;
    }
  }
  
  // Spawn new food if there is none
  if (newGame.food.length === 0) {
    newGame = spawnFood(newGame);
  }
  
  newGame.lastUpdateTime = now;
  return newGame;
}

function spawnFood(game: SnakeGame): SnakeGame {
  const newGame = { ...game };
  
  // Try to find empty cell
  let attempts = 0;
  while (attempts < 100) {
    const x = Math.floor(Math.random() * newGame.width);
    const y = Math.floor(Math.random() * newGame.height);
    
    // Check if position is empty
    const isOnSnake = newGame.snake.some(segment => segment.x === x && segment.y === y);
    const isOnFood = newGame.food.some(food => food.x === x && food.y === y);
    
    if (!isOnSnake && !isOnFood) {
      const food: Food = {
        x,
        y,
        type: 'normal',
        value: 1,
      };
      
      newGame.food.push(food);
      break;
    }
    
    attempts++;
  }
  
  return newGame;
}

export function changeDirection(game: SnakeGame, newDirection: Direction): SnakeGame {
  // Prevent 180-degree turns
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

export function togglePause(game: SnakeGame): SnakeGame {
  return {
    ...game,
    gameState: game.gameState === 'playing' ? 'paused' : 'playing',
    lastUpdateTime: Date.now(),
  };
}

export function resetGame(game: SnakeGame): SnakeGame {
  const newGame = createGame(
    game.width,
    game.height,
  );
  return {
    ...newGame,
    highScore: game.highScore,
    gameState: 'paused',
  };
}

export function getSnakeLength(game: SnakeGame): number {
  return game.snake.length;
}