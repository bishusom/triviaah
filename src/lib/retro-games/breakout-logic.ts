// breakout-logic.ts
export type GameState = 'ready' | 'playing' | 'paused' | 'gameover' | 'win';
export type PowerUpType = 'multiball' | 'enlarge' | 'laser';

export interface Position { x: number; y: number; }
export interface Ball { position: Position; velocity: Position; radius: number; }
export interface Bullet { position: Position; alive: boolean; }

export interface PowerUp {
  position: Position;
  type: PowerUpType;
  width: number;
  height: number;
  active: boolean;
}

export interface Brick {
  id: string;
  position: Position;
  width: number;
  height: number;
  color: string;
  points: number;
  alive: boolean;
  powerUp?: PowerUpType;
}

export interface BreakoutGame {
  balls: Ball[];
  bullets: Bullet[];
  paddle: { 
    position: Position; 
    width: number; 
    height: number; 
    isLaser: boolean;
    laserTimer: number;
    enlargeTimer: number;
  };
  bricks: Brick[];
  powerUps: PowerUp[];
  score: number;
  lives: number;
  gameState: GameState;
}

export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 600;
const PADDLE_NORMAL_WIDTH = 80;
const PADDLE_LARGE_WIDTH = 130;
const INITIAL_BALL_SPEED = 5;
const POWERUP_DURATION = 10000;

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
      const rand = Math.random();
      let pType: PowerUpType | undefined = undefined;
      if (rand > 0.92) pType = 'multiball';
      else if (rand > 0.85) pType = 'enlarge';
      else if (rand > 0.78) pType = 'laser';

      bricks.push({
        id: `brick-${r}-${c}`,
        position: { x: c * (width + padding) + padding, y: r * (height + padding) + 60 },
        width, height,
        color: pType ? '#FFFFFF' : colors[r],
        points: (rows - r) * 10,
        alive: true,
        powerUp: pType,
      });
    }
  }

  return {
    balls: [{ position: { x: 240, y: 500 }, velocity: { x: 0, y: 0 }, radius: 7 }],
    bullets: [],
    paddle: { 
      position: { x: 200, y: 570 }, 
      width: PADDLE_NORMAL_WIDTH, 
      height: 12, 
      isLaser: false, 
      laserTimer: 0, 
      enlargeTimer: 0 
    },
    bricks,
    powerUps: [],
    score: 0,
    lives: 3,
    gameState: 'ready',
  };
}

export function updateGame(game: BreakoutGame, keys: Record<string, boolean>): BreakoutGame {
  if (game.gameState !== 'playing' && game.gameState !== 'ready') return game;

  let nextGame = { ...game };
  const deltaTime = 16;

  // 1. Power-up Timers
  const nextPaddle = { ...nextGame.paddle };
  nextPaddle.enlargeTimer = Math.max(0, nextPaddle.enlargeTimer - deltaTime);
  nextPaddle.laserTimer = Math.max(0, nextPaddle.laserTimer - deltaTime);
  nextPaddle.width = nextPaddle.enlargeTimer > 0 ? PADDLE_LARGE_WIDTH : PADDLE_NORMAL_WIDTH;
  nextPaddle.isLaser = nextPaddle.laserTimer > 0;

  // 2. Paddle Movement
  if (keys['ArrowLeft']) nextPaddle.position.x = Math.max(0, nextPaddle.position.x - 8);
  if (keys['ArrowRight']) nextPaddle.position.x = Math.min(CANVAS_WIDTH - nextPaddle.width, nextPaddle.position.x + 8);
  nextGame.paddle = nextPaddle;

  if (game.gameState === 'ready') {
    nextGame.balls = [{ ...nextGame.balls[0], position: { x: nextPaddle.position.x + nextPaddle.width / 2, y: nextPaddle.position.y - 10 }, velocity: { x: 0, y: 0 } }];
    return nextGame;
  }

  // 3. Laser Logic
  if (nextPaddle.isLaser && keys[' ']) {
    if (nextGame.bullets.length < 4 && (!nextGame.bullets[nextGame.bullets.length-1] || nextGame.bullets[nextGame.bullets.length-1].position.y < nextPaddle.position.y - 100)) {
      nextGame.bullets.push(
        { position: { x: nextPaddle.position.x + 5, y: nextPaddle.position.y }, alive: true },
        { position: { x: nextPaddle.position.x + nextPaddle.width - 5, y: nextPaddle.position.y }, alive: true }
      );
    }
  }

  // 4. Bullet Movement & Collision
  nextGame.bullets = nextGame.bullets.map(b => ({ ...b, position: { ...b.position, y: b.position.y - 10 } }))
    .filter(b => b.position.y > 0 && b.alive);

  nextGame.bullets.forEach(bullet => {
    nextGame.bricks.forEach(brick => {
      if (brick.alive && bullet.position.x > brick.position.x && bullet.position.x < brick.position.x + brick.width && bullet.position.y > brick.position.y && bullet.position.y < brick.position.y + brick.height) {
        brick.alive = false; bullet.alive = false; nextGame.score += brick.points;
        if (brick.powerUp) nextGame.powerUps.push({ position: { x: brick.position.x + brick.width / 2, y: brick.position.y }, type: brick.powerUp, width: 25, height: 12, active: true });
      }
    });
  });

  // 5. Ball Physics
  let updatedBalls: Ball[] = [];
  nextGame.balls.forEach(ball => {
    let nb = { ...ball, position: { x: ball.position.x + ball.velocity.x, y: ball.position.y + ball.velocity.y } };
    
    if (nb.position.x + nb.radius > CANVAS_WIDTH || nb.position.x - nb.radius < 0) nb.velocity.x *= -1;
    if (nb.position.y - nb.radius < 0) nb.velocity.y *= -1;

    if (nb.position.y + nb.radius > nextPaddle.position.y && nb.position.x > nextPaddle.position.x && nb.position.x < nextPaddle.position.x + nextPaddle.width) {
      const hitPoint = (nb.position.x - (nextPaddle.position.x + nextPaddle.width / 2)) / (nextPaddle.width / 2);
      nb.velocity = { x: hitPoint * 5, y: -Math.abs(nb.velocity.y) };
      nb.position.y = nextPaddle.position.y - nb.radius;
    }

    nextGame.bricks.forEach(brick => {
      if (brick.alive && nb.position.x + nb.radius > brick.position.x && nb.position.x - nb.radius < brick.position.x + brick.width && nb.position.y + nb.radius > brick.position.y && nb.position.y - nb.radius < brick.position.y + brick.height) {
        brick.alive = false; nb.velocity.y *= -1; nextGame.score += brick.points;
        if (brick.powerUp) nextGame.powerUps.push({ position: { x: brick.position.x + brick.width / 2, y: brick.position.y }, type: brick.powerUp, width: 25, height: 12, active: true });
      }
    });

    if (nb.position.y < CANVAS_HEIGHT) updatedBalls.push(nb);
  });

  // 6. Power-Up Movement & Collection
  nextGame.powerUps = nextGame.powerUps.map(p => ({ ...p, position: { ...p.position, y: p.position.y + 3 } }))
    .filter(p => p.position.y < CANVAS_HEIGHT && p.active);

  nextGame.powerUps.forEach(p => {
    if (p.position.x < nextPaddle.position.x + nextPaddle.width && p.position.x + p.width > nextPaddle.position.x && p.position.y < nextPaddle.position.y + nextPaddle.height && p.position.y + p.height > nextPaddle.position.y) {
      p.active = false;
      if (p.type === 'multiball') {
        const b = nextGame.balls[0] || { position: { x: nextPaddle.position.x, y: nextPaddle.position.y }, velocity: { x: 0, y: -5 }, radius: 7 };
        nextGame.balls.push(
          { ...b, velocity: { x: 3, y: -4 } },
          { ...b, velocity: { x: -3, y: -4 } }
        );
      }
      if (p.type === 'enlarge') nextPaddle.enlargeTimer = POWERUP_DURATION;
      if (p.type === 'laser') nextPaddle.laserTimer = POWERUP_DURATION;
    }
  });

  if (updatedBalls.length === 0) {
    nextGame.lives--;
    nextGame.gameState = nextGame.lives <= 0 ? 'gameover' : 'ready';
    nextGame.balls = [{ position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, radius: 7 }];
    nextGame.powerUps = [];
    nextGame.bullets = [];
  } else {
    nextGame.balls = updatedBalls;
  }

  return nextGame;
}

export function serveBall(game: BreakoutGame): BreakoutGame {
  return { ...game, gameState: 'playing', balls: [{ ...game.balls[0], velocity: { x: (Math.random() - 0.5) * 4, y: -INITIAL_BALL_SPEED } }] };
}