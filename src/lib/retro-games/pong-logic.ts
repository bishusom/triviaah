// src/lib/retrogames/pong-logic.ts
export type GameMode = 'single' | 'two-player';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameState = 'playing' | 'paused' | 'gameover';
export type Side = 'left' | 'right';

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  score: number;
}

export interface Ball {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  maxSpeed: number;
}

export interface PongGame {
  width: number;
  height: number;
  leftPaddle: Paddle;
  rightPaddle: Paddle;
  ball: Ball;
  gameState: GameState;
  mode: GameMode;
  difficulty: Difficulty;
  winningScore: number;
  lastScorer: Side | null;
  lastUpdateTime: number;
}

// Constants
export const PADDLE_WIDTH = 15;
export const PADDLE_HEIGHT = 100;
export const PADDLE_SPEED = 8;
export const AI_PADDLE_SPEED = 6;
export const BALL_RADIUS = 10;
export const BALL_INITIAL_SPEED = 5;

export const DIFFICULTIES = {
  easy: {
    aiReactionTime: 0.3,
    aiAccuracy: 0.7,
    aiSpeed: 4,
  },
  medium: {
    aiReactionTime: 0.2,
    aiAccuracy: 0.85,
    aiSpeed: 5,
  },
  hard: {
    aiReactionTime: 0.1,
    aiAccuracy: 0.95,
    aiSpeed: 6,
  },
};

export function createGame(
  width: number = 800,
  height: number = 400,
  mode: GameMode = 'single',
  difficulty: Difficulty = 'medium',
  winningScore: number = 7
): PongGame {
  const paddleY = height / 2 - PADDLE_HEIGHT / 2;
  
  return {
    width,
    height,
    leftPaddle: {
      x: 30,
      y: paddleY,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      speed: PADDLE_SPEED,
      score: 0,
    },
    rightPaddle: {
      x: width - 30 - PADDLE_WIDTH,
      y: paddleY,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      speed: PADDLE_SPEED,
      score: 0,
    },
    ball: {
      x: width / 2,
      y: height / 2,
      radius: BALL_RADIUS,
      speedX: BALL_INITIAL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      speedY: (Math.random() - 0.5) * BALL_INITIAL_SPEED,
      maxSpeed: 12,
    },
    gameState: 'paused',
    mode,
    difficulty,
    winningScore,
    lastScorer: null,
    lastUpdateTime: Date.now(),
  };
}

export function updateGame(game: PongGame): PongGame {
  const now = Date.now();
  const deltaTime = (now - game.lastUpdateTime) / 16; // Normalize to 60fps
  
  if (game.gameState !== 'playing' || deltaTime <= 0) {
    return { ...game, lastUpdateTime: now };
  }
  
  let newGame = { ...game };
  
  // Update ball position
  newGame.ball.x += newGame.ball.speedX * deltaTime;
  newGame.ball.y += newGame.ball.speedY * deltaTime;
  
  // Ball collision with top and bottom walls
  if (newGame.ball.y - newGame.ball.radius <= 0) {
    newGame.ball.y = newGame.ball.radius;
    newGame.ball.speedY = Math.abs(newGame.ball.speedY);
  } else if (newGame.ball.y + newGame.ball.radius >= newGame.height) {
    newGame.ball.y = newGame.height - newGame.ball.radius;
    newGame.ball.speedY = -Math.abs(newGame.ball.speedY);
  }
  
  // Ball collision with paddles
  // Left paddle
  if (
    newGame.ball.x - newGame.ball.radius <= newGame.leftPaddle.x + newGame.leftPaddle.width &&
    newGame.ball.x - newGame.ball.radius >= newGame.leftPaddle.x &&
    newGame.ball.y >= newGame.leftPaddle.y &&
    newGame.ball.y <= newGame.leftPaddle.y + newGame.leftPaddle.height
  ) {
    const hitPosition = (newGame.ball.y - (newGame.leftPaddle.y + newGame.leftPaddle.height / 2)) / 
                        (newGame.leftPaddle.height / 2);
    const angle = hitPosition * (Math.PI / 4); // Max 45 degree angle
    
    // Increase speed slightly on hit
    const speedIncrease = 1.05;
    const currentSpeed = Math.sqrt(
      newGame.ball.speedX * newGame.ball.speedX + 
      newGame.ball.speedY * newGame.ball.speedY
    );
    const newSpeed = Math.min(currentSpeed * speedIncrease, newGame.ball.maxSpeed);
    
    newGame.ball.speedX = Math.cos(angle) * newSpeed;
    newGame.ball.speedY = Math.sin(angle) * newSpeed;
    
    // Ensure ball moves to the right after hitting left paddle
    newGame.ball.speedX = Math.abs(newGame.ball.speedX);
    newGame.ball.x = newGame.leftPaddle.x + newGame.leftPaddle.width + newGame.ball.radius;
  }
  
  // Right paddle
  if (
    newGame.ball.x + newGame.ball.radius >= newGame.rightPaddle.x &&
    newGame.ball.x + newGame.ball.radius <= newGame.rightPaddle.x + newGame.rightPaddle.width &&
    newGame.ball.y >= newGame.rightPaddle.y &&
    newGame.ball.y <= newGame.rightPaddle.y + newGame.rightPaddle.height
  ) {
    const hitPosition = (newGame.ball.y - (newGame.rightPaddle.y + newGame.rightPaddle.height / 2)) / 
                        (newGame.rightPaddle.height / 2);
    const angle = hitPosition * (Math.PI / 4);
    
    const speedIncrease = 1.05;
    const currentSpeed = Math.sqrt(
      newGame.ball.speedX * newGame.ball.speedX + 
      newGame.ball.speedY * newGame.ball.speedY
    );
    const newSpeed = Math.min(currentSpeed * speedIncrease, newGame.ball.maxSpeed);
    
    newGame.ball.speedX = Math.cos(angle) * newSpeed * -1;
    newGame.ball.speedY = Math.sin(angle) * newSpeed;
    
    // Ensure ball moves to the left after hitting right paddle
    newGame.ball.speedX = -Math.abs(newGame.ball.speedX);
    newGame.ball.x = newGame.rightPaddle.x - newGame.ball.radius;
  }
  
  // Score points
  if (newGame.ball.x - newGame.ball.radius <= 0) {
    // Right player scores
    newGame.rightPaddle.score += 1;
    newGame.lastScorer = 'right';
    resetBall(newGame);
  } else if (newGame.ball.x + newGame.ball.radius >= newGame.width) {
    // Left player scores
    newGame.leftPaddle.score += 1;
    newGame.lastScorer = 'left';
    resetBall(newGame);
  }
  
  // Check for winner
  if (
    newGame.leftPaddle.score >= newGame.winningScore ||
    newGame.rightPaddle.score >= newGame.winningScore
  ) {
    newGame.gameState = 'gameover';
  }
  
  // AI movement (if single player mode)
  if (newGame.mode === 'single' && newGame.gameState === 'playing') {
    updateAI(newGame);
  }
  
  newGame.lastUpdateTime = now;
  return newGame;
}

function resetBall(game: PongGame): PongGame {
  const newGame = { ...game };
  
  // Reset ball to center
  newGame.ball.x = game.width / 2;
  newGame.ball.y = game.height / 2;
  
  // Random direction, but always toward the player who was just scored on
  const angle = (Math.random() * Math.PI / 3) - (Math.PI / 6); // -30 to +30 degrees
  const baseSpeed = BALL_INITIAL_SPEED;
  
  if (newGame.lastScorer === 'left') {
    // Ball goes to right
    newGame.ball.speedX = Math.cos(angle) * baseSpeed;
  } else {
    // Ball goes to left
    newGame.ball.speedX = Math.cos(angle + Math.PI) * baseSpeed;
  }
  
  newGame.ball.speedY = Math.sin(angle) * baseSpeed;
  
  return newGame;
}

function updateAI(game: PongGame): PongGame {
  const newGame = { ...game };
  const aiSettings = DIFFICULTIES[newGame.difficulty];
  
  // AI controls the right paddle
  const paddle = newGame.rightPaddle;
  const paddleCenter = paddle.y + paddle.height / 2;
  const ballCenter = newGame.ball.y;
  
  // Only move if ball is coming toward AI
  if (newGame.ball.speedX > 0) {
    // Add some imperfection based on difficulty
    const accuracy = Math.random() < aiSettings.aiAccuracy ? 1 : 0.7;
    const targetY = ballCenter * accuracy + 
                    (newGame.height / 2) * (1 - accuracy);
    
    // Move toward target with reaction delay
    if (Math.abs(paddleCenter - targetY) > paddle.height / 3) {
      if (paddleCenter < targetY) {
        paddle.y += aiSettings.aiSpeed;
      } else {
        paddle.y -= aiSettings.aiSpeed;
      }
    }
  } else {
    // Return to center when ball is going away
    const center = newGame.height / 2 - paddle.height / 2;
    if (Math.abs(paddle.y - center) > 5) {
      if (paddle.y < center) {
        paddle.y += aiSettings.aiSpeed * 0.5;
      } else {
        paddle.y -= aiSettings.aiSpeed * 0.5;
      }
    }
  }
  
  // Keep paddle within bounds
  paddle.y = Math.max(0, Math.min(newGame.height - paddle.height, paddle.y));
  
  return newGame;
}

export function movePaddle(
  game: PongGame,
  side: Side,
  direction: 'up' | 'down' | 'stop'
): PongGame {
  const newGame = { ...game };
  const paddle = side === 'left' ? newGame.leftPaddle : newGame.rightPaddle;
  
  if (direction === 'up') {
    paddle.y -= paddle.speed;
  } else if (direction === 'down') {
    paddle.y += paddle.speed;
  }
  // 'stop' doesn't change position
  
  // Keep paddle within bounds
  paddle.y = Math.max(0, Math.min(newGame.height - paddle.height, paddle.y));
  
  return newGame;
}

export function togglePause(game: PongGame): PongGame {
  return {
    ...game,
    gameState: game.gameState === 'playing' ? 'paused' : 'playing',
    lastUpdateTime: Date.now(),
  };
}

export function resetGame(game: PongGame): PongGame {
  const newGame = createGame(
    game.width,
    game.height,
    game.mode,
    game.difficulty,
    game.winningScore
  );
  return {
    ...newGame,
    gameState: 'paused', // Start in paused state
  };
}