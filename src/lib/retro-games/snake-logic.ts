// src/lib/retrogames/snake-logic.ts
export type Direction = 'up' | 'down' | 'left' | 'right';
export type GameState = 'playing' | 'paused' | 'gameover';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'classic' | 'wrapped' | 'portal';

export interface Position {
  x: number;
  y: number;
}

export interface SnakeSegment extends Position {
  type: 'head' | 'body' | 'tail';
  direction: Direction;
}

export interface Food extends Position {
  type: 'normal' | 'golden' | 'speed';
  value: number;
  expiresAt?: number; // For timed food items
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
  difficulty: Difficulty;
  mode: GameMode;
  speed: number;
  foodsEaten: number;
  streak: number;
  lastUpdateTime: number;
  isGrowing: boolean;
}

// Constants
export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150; // ms per move

export const DIFFICULTIES = {
  easy: {
    speed: 200,
    foodSpawnRate: 0.05,
    goldenFoodChance: 0.1,
    speedFoodChance: 0.05,
  },
  medium: {
    speed: 150,
    foodSpawnRate: 0.07,
    goldenFoodChance: 0.15,
    speedFoodChance: 0.07,
  },
  hard: {
    speed: 100,
    foodSpawnRate: 0.1,
    goldenFoodChance: 0.2,
    speedFoodChance: 0.1,
  },
};

export const GAME_MODES = {
  classic: {
    name: 'Classic',
    description: 'Hit walls or yourself = game over',
    width: 30,
    height: 20,
  },
  wrapped: {
    name: 'Wrapped',
    description: 'Walls wrap around to opposite side',
    width: 30,
    height: 20,
  },
  portal: {
    name: 'Portal',
    description: 'Portals appear randomly on walls',
    width: 30,
    height: 20,
  },
};

export const FOOD_TYPES = {
  normal: {
    color: 'bg-red-500',
    value: 1,
    lifetime: Infinity,
  },
  golden: {
    color: 'bg-yellow-500',
    value: 5,
    lifetime: 10000, // 10 seconds
  },
  speed: {
    color: 'bg-blue-500',
    value: 3,
    lifetime: 5000, // 5 seconds
    effect: 0.7, // 70% of normal speed
  },
};

export function createGame(
  width: number = 30,
  height: number = 20,
  difficulty: Difficulty = 'medium',
  mode: GameMode = 'classic'
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
    difficulty,
    mode,
    speed: DIFFICULTIES[difficulty].speed,
    foodsEaten: 0,
    streak: 0,
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
  
  // Handle game modes
  if (newGame.mode === 'wrapped') {
    // Wrap around edges
    if (newHead.x < 0) newHead.x = newGame.width - 1;
    if (newHead.x >= newGame.width) newHead.x = 0;
    if (newHead.y < 0) newHead.y = newGame.height - 1;
    if (newHead.y >= newGame.height) newHead.y = 0;
  } else if (newGame.mode === 'portal') {
    // Portal logic (simplified - teleport to random location)
    if (newHead.x < 0 || newHead.x >= newGame.width || 
        newHead.y < 0 || newHead.y >= newGame.height) {
      newHead = {
        x: Math.floor(Math.random() * newGame.width),
        y: Math.floor(Math.random() * newGame.height),
      };
      // Add portal effect score
      newGame.score += 1;
    }
  }
  
  // Check collision with walls (for classic mode)
  if (newGame.mode === 'classic') {
    if (
      newHead.x < 0 ||
      newHead.x >= newGame.width ||
      newHead.y < 0 ||
      newHead.y >= newGame.height
    ) {
      return { ...newGame, gameState: 'gameover' };
    }
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
  let speedEffect = 1;
  
  newGame.food = newGame.food.filter(food => {
    if (food.x === newHead.x && food.y === newHead.y) {
      foodEaten = true;
      foodValue = food.value;
      
      // Apply food effects
      if (food.type === 'speed') {
        speedEffect = 0.7; // 30% faster for a short time
        setTimeout(() => {
          // Reset speed after effect wears off
          // We'll handle this through game state updates
        }, 5000);
      }
      
      // Remove expired food
      if (food.expiresAt && now > food.expiresAt) {
        return false;
      }
      
      return false; // Remove eaten food
    }
    return true;
  });
  
  if (foodEaten) {
    // Grow snake
    newGame.isGrowing = true;
    
    // Update score
    newGame.score += foodValue;
    newGame.foodsEaten += 1;
    newGame.streak += 1;
    
    // Apply speed effect
    if (speedEffect !== 1) {
      newGame.speed = Math.floor(DIFFICULTIES[newGame.difficulty].speed * speedEffect);
    }
    
    // Update high score
    if (newGame.score > newGame.highScore) {
      newGame.highScore = newGame.score;
    }
  } else {
    // Reset streak if no food eaten this move
    newGame.streak = 0;
  }
  
  // Spawn new food
  spawnFood(newGame);
  
  // Remove expired food
  newGame.food = newGame.food.filter(food => {
    if (food.expiresAt && now > food.expiresAt) {
      return false;
    }
    return true;
  });
  
  newGame.lastUpdateTime = now;
  return newGame;
}

function spawnFood(game: SnakeGame): SnakeGame {
  const newGame = { ...game };
  const now = Date.now();
  const settings = DIFFICULTIES[newGame.difficulty];
  
  // Check if we should spawn food
  if (Math.random() > settings.foodSpawnRate) {
    return newGame;
  }
  
  // Try to find empty cell
  let attempts = 0;
  while (attempts < 100) {
    const x = Math.floor(Math.random() * newGame.width);
    const y = Math.floor(Math.random() * newGame.height);
    
    // Check if position is empty
    const isOnSnake = newGame.snake.some(segment => segment.x === x && segment.y === y);
    const isOnFood = newGame.food.some(food => food.x === x && food.y === y);
    
    if (!isOnSnake && !isOnFood) {
      // Determine food type
      let type: 'normal' | 'golden' | 'speed' = 'normal';
      const rand = Math.random();
      
      if (rand < settings.speedFoodChance) {
        type = 'speed';
      } else if (rand < settings.speedFoodChance + settings.goldenFoodChance) {
        type = 'golden';
      }
      
      const food: Food = {
        x,
        y,
        type,
        value: FOOD_TYPES[type].value,
      };
      
      // Add expiration for special foods
      if (type !== 'normal') {
        food.expiresAt = now + FOOD_TYPES[type].lifetime!;
      }
      
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
    game.difficulty,
    game.mode
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

export function getSpeedLevel(game: SnakeGame): number {
  const baseSpeed = DIFFICULTIES[game.difficulty].speed;
  return Math.floor((baseSpeed - game.speed) / 10) + 1;
}