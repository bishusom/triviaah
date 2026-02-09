// breakout-logic.ts

export type GameState = 'ready' | 'playing' | 'paused' | 'gameover' | 'win';

export interface Position {
  x: number;
  y: number;
}

export interface Brick {
  id: string;
  position: Position;
  width: number;
  height: number;
  color: string;
  points: number;
  alive: boolean;
}

export interface BreakoutGame {
  ball: {
    position: Position;
    velocity: Position;
    radius: number;
  };
  paddle: {
    position: Position;
    width: number;
    height: number;
  };
  bricks: Brick[];
  score: number;
  lives: number;
  gameState: GameState;
}

export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 600;
const PADDLE_SPEED = 8;
const INITIAL_BALL_SPEED = 5;

export function createGame(): BreakoutGame {
  const bricks: Brick[] = [];
  const rows = 6;
  const cols = 8;
  const padding = 10;
  const width = (CANVAS_WIDTH - (padding * (cols + 1))) / cols;
  const height = 20;
  const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082'];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      bricks.push({
        id: `brick-${r}-${c}`,
        position: { x: c * (width + padding) + padding, y: r * (height + padding) + 60 },
        width,
        height,
        color: colors[r],
        points: (rows - r) * 10,
        alive: true,
      });
    }
  }

  return {
    ball: {
      position: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 100 },
      velocity: { x: 0, y: 0 },
      radius: 7,
    },
    paddle: {
      position: { x: CANVAS_WIDTH / 2 - 40, y: CANVAS_HEIGHT - 30 },
      width: 80,
      height: 12,
    },
    bricks,
    score: 0,
    lives: 3,
    gameState: 'ready',
  };
}

export function updateGame(game: BreakoutGame, keys: Record<string, boolean>): BreakoutGame {
  // If not playing, we still allow paddle movement so the player can "aim" the start
  if (game.gameState !== 'playing' && game.gameState !== 'ready') return game;

  // Clone top-level state
  let nextGame = { ...game };
  
  // 1. Move Paddle (Always allowed in ready/playing)
  const nextPaddle = { ...nextGame.paddle };
  if (keys['ArrowLeft'] || keys['a']) {
    nextPaddle.position = { ...nextPaddle.position, x: Math.max(0, nextPaddle.position.x - PADDLE_SPEED) };
  }
  if (keys['ArrowRight'] || keys['d']) {
    nextPaddle.position = { ...nextPaddle.position, x: Math.min(CANVAS_WIDTH - nextPaddle.width, nextPaddle.position.x + PADDLE_SPEED) };
  }
  nextGame.paddle = nextPaddle;

  // If we are just in the 'ready' state, move ball with paddle but don't do physics
  if (game.gameState === 'ready') {
    nextGame.ball = {
      ...nextGame.ball,
      position: { x: nextPaddle.position.x + nextPaddle.width / 2, y: nextPaddle.position.y - nextGame.ball.radius - 2 }
    };
    return nextGame;
  }

  // 2. Physics & Ball Movement
  const nextBall = { ...nextGame.ball };
  nextBall.position = {
    x: nextBall.position.x + nextBall.velocity.x,
    y: nextBall.position.y + nextBall.velocity.y
  };

  // 3. Wall Collisions
  if (nextBall.position.x + nextBall.radius > CANVAS_WIDTH || nextBall.position.x - nextBall.radius < 0) {
    nextBall.velocity = { ...nextBall.velocity, x: -nextBall.velocity.x };
  }
  if (nextBall.position.y - nextBall.radius < 0) {
    nextBall.velocity = { ...nextBall.velocity, y: -nextBall.velocity.y };
  }

  // 4. Paddle Collision
  if (
    nextBall.position.y + nextBall.radius > nextPaddle.position.y &&
    nextBall.position.y - nextBall.radius < nextPaddle.position.y + nextPaddle.height &&
    nextBall.position.x > nextPaddle.position.x &&
    nextBall.position.x < nextPaddle.position.x + nextPaddle.width
  ) {
    const hitPoint = (nextBall.position.x - (nextPaddle.position.x + nextPaddle.width / 2)) / (nextPaddle.width / 2);
    const currentSpeed = Math.sqrt(nextBall.velocity.x ** 2 + nextBall.velocity.y ** 2);
    
    nextBall.velocity = {
      x: hitPoint * currentSpeed,
      y: -Math.abs(nextBall.velocity.y) // Always bounce up
    };
    nextBall.position = { ...nextBall.position, y: nextPaddle.position.y - nextBall.radius };
  }

  // 5. Brick Collisions
  let brickHit = false;
  nextGame.bricks = nextGame.bricks.map(brick => {
    if (brick.alive && !brickHit &&
        nextBall.position.x + nextBall.radius > brick.position.x &&
        nextBall.position.x - nextBall.radius < brick.position.x + brick.width &&
        nextBall.position.y + nextBall.radius > brick.position.y &&
        nextBall.position.y - nextBall.radius < brick.position.y + brick.height) {
      
      brickHit = true;
      nextGame.score += brick.points;
      nextBall.velocity = { ...nextBall.velocity, y: -nextBall.velocity.y };
      return { ...brick, alive: false };
    }
    return brick;
  });

  // 6. Death / Out of Bounds
  if (nextBall.position.y + nextBall.radius > CANVAS_HEIGHT) {
    nextGame.lives -= 1;
    if (nextGame.lives <= 0) {
      nextGame.gameState = 'gameover';
    } else {
      // Revert to ready state
      nextGame.gameState = 'ready';
      nextGame.ball = createGame().ball; // Reset ball to default
    }
    return nextGame;
  }

  // 7. Win Condition
  if (nextGame.bricks.every(b => !b.alive)) {
    nextGame.gameState = 'win';
  }

  nextGame.ball = nextBall;
  return nextGame;
}

export function serveBall(game: BreakoutGame): BreakoutGame {
  if (game.gameState !== 'ready') return game;
  return {
    ...game,
    gameState: 'playing',
    ball: {
      ...game.ball,
      velocity: { x: (Math.random() - 0.5) * 6, y: -INITIAL_BALL_SPEED }
    }
  };
}