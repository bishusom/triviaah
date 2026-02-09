// space-invaders-logic.ts

export type GameState = 'ready' | 'playing' | 'paused' | 'gameover' | 'levelComplete';

export interface Position {
  x: number;
  y: number;
}

export interface Entity {
  position: Position;
  width: number;
  height: number;
  alive: boolean;
}

export interface Bullet {
  position: Position;
  velocity: number; // Negative for player (up), positive for aliens (down)
  owner: 'player' | 'alien';
}

export interface SpaceInvadersGame {
  player: Entity;
  aliens: (Entity & { type: number; scoreValue: number })[];
  bullets: Bullet[];
  score: number;
  lives: number;
  level: number;
  gameState: GameState;
  alienDirection: 1 | -1;
  alienMoveTimer: number;
  lastUpdateTime: number;
  lastAlienShotTime: number;
}

export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 500;
const PLAYER_SPEED = 5;
const BULLET_SPEED = 7;
const ALIEN_ROWS = 5;
const ALIEN_COLS = 11;

export function createGame(): SpaceInvadersGame {
  const aliens = [];
  for (let row = 0; row < ALIEN_ROWS; row++) {
    for (let col = 0; col < ALIEN_COLS; col++) {
      aliens.push({
        position: { x: col * 40 + 50, y: row * 30 + 50 },
        width: 30,
        height: 20,
        alive: true,
        type: Math.floor((ALIEN_ROWS - row - 1) / 2), // Different alien types
        scoreValue: (row === 0) ? 30 : (row < 3 ? 20 : 10)
      });
    }
  }

  return {
    player: { position: { x: CANVAS_WIDTH / 2 - 15, y: CANVAS_HEIGHT - 40 }, width: 30, height: 20, alive: true },
    aliens,
    bullets: [],
    score: 0,
    lives: 3,
    level: 1,
    gameState: 'ready',
    alienDirection: 1,
    alienMoveTimer: 0,
    lastUpdateTime: Date.now(),
    lastAlienShotTime: 0,
  };
}

export function updateGame(game: SpaceInvadersGame, keys: Record<string, boolean>): SpaceInvadersGame {
  if (game.gameState !== 'playing') return game;

  const now = Date.now();
  const deltaTime = now - game.lastUpdateTime;
  const nextGame = { ...game, lastUpdateTime: now };

  // 1. Move Player
  if (keys['ArrowLeft'] || keys['a']) {
    nextGame.player.position.x = Math.max(0, nextGame.player.position.x - PLAYER_SPEED);
  }
  if (keys['ArrowRight'] || keys['d']) {
    nextGame.player.position.x = Math.min(CANVAS_WIDTH - nextGame.player.width, nextGame.player.position.x + PLAYER_SPEED);
  }

  // 2. Move Bullets
  nextGame.bullets = nextGame.bullets
    .map(b => ({ ...b, position: { ...b.position, y: b.position.y + b.velocity } }))
    .filter(b => b.position.y > 0 && b.position.y < CANVAS_HEIGHT);

  // 3. Move Aliens (Based on number of survivors - they speed up!)
  const livingAliens = nextGame.aliens.filter(a => a.alive);
  const speedFactor = Math.max(100, (livingAliens.length / (ALIEN_ROWS * ALIEN_COLS)) * 1000);
  
  nextGame.alienMoveTimer += deltaTime;
  if (nextGame.alienMoveTimer > speedFactor) {
    nextGame.alienMoveTimer = 0;
    
    let shiftDown = false;
    const padding = 20;
    
    // Check bounds
    livingAliens.forEach(a => {
      if (nextGame.alienDirection === 1 && a.position.x + a.width > CANVAS_WIDTH - padding) shiftDown = true;
      if (nextGame.alienDirection === -1 && a.position.x < padding) shiftDown = true;
    });

    if (shiftDown) {
      nextGame.alienDirection *= -1;
      nextGame.aliens = nextGame.aliens.map(a => ({
        ...a,
        position: { ...a.position, y: a.position.y + 15 }
      }));
    } else {
      nextGame.aliens = nextGame.aliens.map(a => ({
        ...a,
        position: { ...a.position, x: a.position.x + (10 * nextGame.alienDirection) }
      }));
    }
  }

  // 4. Alien Shooting
  if (now - nextGame.lastAlienShotTime > 1500 && livingAliens.length > 0) {
    const randomAlien = livingAliens[Math.floor(Math.random() * livingAliens.length)];
    nextGame.bullets.push({
      position: { x: randomAlien.position.x + randomAlien.width / 2, y: randomAlien.position.y },
      velocity: BULLET_SPEED / 1.5,
      owner: 'alien'
    });
    nextGame.lastAlienShotTime = now;
  }

  // 5. Collision Detection
  nextGame.bullets.forEach((bullet, bIdx) => {
    if (bullet.owner === 'player') {
      // Player Bullet vs Alien
      nextGame.aliens.forEach(alien => {
        if (alien.alive && checkCollision(bullet.position, 2, 10, alien.position, alien.width, alien.height)) {
          alien.alive = false;
          nextGame.score += alien.scoreValue;
          nextGame.bullets.splice(bIdx, 1);
        }
      });
    } else {
      // Alien Bullet vs Player
      if (checkCollision(bullet.position, 4, 10, nextGame.player.position, nextGame.player.width, nextGame.player.height)) {
        nextGame.lives--;
        nextGame.bullets.splice(bIdx, 1);
        if (nextGame.lives <= 0) nextGame.gameState = 'gameover';
      }
    }
  });

  // 6. Win Condition
  if (livingAliens.length === 0) nextGame.gameState = 'levelComplete';

  // 7. Lose Condition (Aliens reach bottom)
  if (livingAliens.some(a => a.position.y + a.height > nextGame.player.position.y)) {
    nextGame.gameState = 'gameover';
  }

  return nextGame;
}

function checkCollision(pos1: Position, w1: number, h1: number, pos2: Position, w2: number, h2: number) {
  return pos1.x < pos2.x + w2 && pos1.x + w1 > pos2.x && pos1.y < pos2.y + h2 && pos1.y + h1 > pos2.y;
}

export function fireBullet(game: SpaceInvadersGame): SpaceInvadersGame {
  if (game.gameState !== 'playing') return game;
  // Limit player to 2 bullets on screen at once
  if (game.bullets.filter(b => b.owner === 'player').length >= 2) return game;

  const newBullet: Bullet = {
    position: { x: game.player.position.x + game.player.width / 2, y: game.player.position.y },
    velocity: -BULLET_SPEED,
    owner: 'player'
  };

  return { ...game, bullets: [...game.bullets, newBullet] };
}