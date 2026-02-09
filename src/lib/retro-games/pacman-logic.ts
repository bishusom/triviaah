// pacman-logic.ts - Full Game Logic

export type Direction = 'up' | 'down' | 'left' | 'right' | null;
export type GameState = 'ready' | 'playing' | 'paused' | 'gameover' | 'levelComplete';
export type GhostMode = 'chase' | 'scatter' | 'frightened' | 'eaten';
export type GhostName = 'blinky' | 'pinky' | 'inky' | 'clyde';

export interface Position {
  x: number;
  y: number;
}

export interface Ghost {
  name: GhostName;
  position: Position;
  direction: Direction;
  mode: GhostMode;
  scatterTarget: Position;
  homePosition: Position;
  color: string;
}

export interface PacmanGame {
  pacman: {
    position: Position;
    direction: Direction;
    nextDirection: Direction;
    mouthOpen: boolean;
    animationFrame: number;
  };
  ghosts: Ghost[];
  maze: number[][];
  dots: boolean[][];
  powerPellets: Position[];
  score: number;
  lives: number;
  level: number;
  gameState: GameState;
  
  // Global Mode Schedule Logic
  globalMode: 'scatter' | 'chase';
  modeTimer: number;
  modeCycle: number;
  
  frightenedMode: boolean;
  frightenedTimer: number;
  dotsRemaining: number;
  ghostsEaten: number;
  lastUpdateTime: number;
  speed: number;
}

export const TILE_SIZE = 20;
export const MAZE_WIDTH = 28;
export const MAZE_HEIGHT = 31;

// 1 = Wall, 0 = Empty/Tunnel, 2 = Dot, 3 = Power Pellet
export const CLASSIC_MAZE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
  [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,1,0,1,1,1,0,0,1,1,1,0,1,1,2,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
  [0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
  [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,3,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,3,1],
  [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
  [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
  [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

export const GHOST_COLORS = {
  blinky: '#FF0000',
  pinky: '#FFB8FF',
  inky: '#00FFFF',
  clyde: '#FFB851',
};

// Official timing for modes (Scatter for 7s, Chase for 20s, etc.)
const MODE_SCHEDULE = [
  { mode: 'scatter', duration: 7000 },
  { mode: 'chase', duration: 20000 },
  { mode: 'scatter', duration: 7000 },
  { mode: 'chase', duration: 20000 },
  { mode: 'scatter', duration: 5000 },
  { mode: 'chase', duration: 20000 },
  { mode: 'scatter', duration: 5000 },
  { mode: 'chase', duration: -1 }, // Permanent chase
];

export function createGame(): PacmanGame {
  const dots: boolean[][] = [];
  const powerPellets: Position[] = [];
  let dotsRemaining = 0;

  for (let y = 0; y < MAZE_HEIGHT; y++) {
    dots[y] = [];
    for (let x = 0; x < MAZE_WIDTH; x++) {
      if (CLASSIC_MAZE[y][x] === 2) {
        dots[y][x] = true;
        dotsRemaining++;
      } else if (CLASSIC_MAZE[y][x] === 3) {
        dots[y][x] = false;
        powerPellets.push({ x, y });
        dotsRemaining++;
      } else {
        dots[y][x] = false;
      }
    }
  }

  const ghosts: Ghost[] = [
    { name: 'blinky', position: { x: 14, y: 11 }, direction: 'left', mode: 'scatter', scatterTarget: { x: 25, y: -2 }, homePosition: { x: 14, y: 11 }, color: GHOST_COLORS.blinky },
    { name: 'pinky', position: { x: 14, y: 14 }, direction: 'up', mode: 'scatter', scatterTarget: { x: 2, y: -2 }, homePosition: { x: 14, y: 14 }, color: GHOST_COLORS.pinky },
    { name: 'inky', position: { x: 12, y: 14 }, direction: 'up', mode: 'scatter', scatterTarget: { x: 27, y: 31 }, homePosition: { x: 12, y: 14 }, color: GHOST_COLORS.inky },
    { name: 'clyde', position: { x: 16, y: 14 }, direction: 'up', mode: 'scatter', scatterTarget: { x: 0, y: 31 }, homePosition: { x: 16, y: 14 }, color: GHOST_COLORS.clyde },
  ];

  return {
    pacman: { position: { x: 14, y: 23 }, direction: null, nextDirection: null, mouthOpen: true, animationFrame: 0 },
    ghosts,
    maze: CLASSIC_MAZE,
    dots,
    powerPellets,
    score: 0,
    lives: 3,
    level: 1,
    gameState: 'ready',
    globalMode: 'scatter',
    modeTimer: MODE_SCHEDULE[0].duration,
    modeCycle: 0,
    frightenedMode: false,
    frightenedTimer: 0,
    dotsRemaining,
    ghostsEaten: 0,
    lastUpdateTime: Date.now(),
    speed: 150,
  };
}

// Helper Functions
function isWall(maze: number[][], x: number, y: number): boolean {
  if (x < 0 || x >= MAZE_WIDTH) return false; // Tunnel wrapping
  if (y < 0 || y >= MAZE_HEIGHT) return true;
  return maze[y][x] === 1;
}

function getNextPosition(pos: Position, dir: Direction): Position {
  if (!dir) return { ...pos };
  const next = { ...pos };
  if (dir === 'up') next.y -= 1;
  if (dir === 'down') next.y += 1;
  if (dir === 'left') next.x -= 1;
  if (dir === 'right') next.x += 1;
  // Wrapping
  if (next.x < 0) next.x = MAZE_WIDTH - 1;
  if (next.x >= MAZE_WIDTH) next.x = 0;
  return next;
}

function canMove(maze: number[][], pos: Position, dir: Direction): boolean {
  if (!dir) return false;
  const next = getNextPosition(pos, dir);
  return !isWall(maze, next.x, next.y);
}

function reverseDirection(d: Direction): Direction {
  if (d === 'up') return 'down';
  if (d === 'down') return 'up';
  if (d === 'left') return 'right';
  if (d === 'right') return 'left';
  return null;
}

// Target Logic for AI Personalities

function getGhostChaseTarget(game: PacmanGame, ghost: Ghost): Position {
  const pac = game.pacman.position;
  const pDir = game.pacman.direction;

  switch (ghost.name) {
    case 'blinky': 
      return pac; // Chases Pacman directly
    case 'pinky': {
      // Targets 4 tiles ahead of Pacman (Ambusher)
      let t = { ...pac };
      for (let i = 0; i < 4; i++) t = getNextPosition(t, pDir);
      return t;
    }
    case 'inky': {
      // Uses a vector from Blinky to Pacman's front (Strategic)
      let offset = { ...pac };
      for (let i = 0; i < 2; i++) offset = getNextPosition(offset, pDir);
      const blinky = game.ghosts.find(g => g.name === 'blinky')?.position || pac;
      return { x: offset.x + (offset.x - blinky.x), y: offset.y + (offset.y - blinky.y) };
    }
    case 'clyde': {
      // Chases if far away, retreats to corner if close (Pokey)
      const dist = Math.hypot(pac.x - ghost.position.x, pac.y - ghost.position.y);
      return dist > 8 ? pac : ghost.scatterTarget;
    }
    default: return pac;
  }
}

function moveGhostTowardsTarget(game: PacmanGame, ghost: Ghost, target: Position): Ghost {
  const dirs: Direction[] = ['up', 'down', 'left', 'right'];
  let bestDir = ghost.direction;
  let minDist = Infinity;

  dirs.forEach(d => {
    if (d === reverseDirection(ghost.direction)) return; // No 180 turns
    if (canMove(game.maze, ghost.position, d)) {
      const np = getNextPosition(ghost.position, d);
      const dist = Math.hypot(target.x - np.x, target.y - np.y);
      if (dist < minDist) {
        minDist = dist;
        bestDir = d;
      }
    }
  });

  return { ...ghost, direction: bestDir, position: getNextPosition(ghost.position, bestDir) };
}

// Main Logic Entry Point
export function updateGame(game: PacmanGame): PacmanGame {
  const now = Date.now();
  const deltaTime = now - game.lastUpdateTime;
  if (game.gameState !== 'playing' || deltaTime < game.speed) return game;

  const nextGame = { ...game, lastUpdateTime: now };

  // 1. Global Mode Timing
  if (!nextGame.frightenedMode) {
    let sched = MODE_SCHEDULE[nextGame.modeCycle];
    if (sched.duration !== -1) {
      nextGame.modeTimer -= deltaTime;
      if (nextGame.modeTimer <= 0) {
        nextGame.modeCycle = Math.min(nextGame.modeCycle + 1, MODE_SCHEDULE.length - 1);
        const nextSched = MODE_SCHEDULE[nextGame.modeCycle];
        nextGame.globalMode = nextSched.mode as 'scatter' | 'chase';
        nextGame.modeTimer = nextSched.duration;
        // Ghosts reverse on mode change
        nextGame.ghosts = nextGame.ghosts.map(g => ({ ...g, direction: reverseDirection(g.direction) }));
      }
    }
  }

  // 2. Pacman Logic
  const nextPacman = { ...nextGame.pacman };
  if (nextPacman.nextDirection && canMove(game.maze, nextPacman.position, nextPacman.nextDirection)) {
    nextPacman.direction = nextPacman.nextDirection;
    nextPacman.nextDirection = null;
  }
  if (nextPacman.direction && canMove(game.maze, nextPacman.position, nextPacman.direction)) {
    nextPacman.position = getNextPosition(nextPacman.position, nextPacman.direction);
  }
  nextPacman.animationFrame = (nextPacman.animationFrame + 1) % 8;
  nextPacman.mouthOpen = nextPacman.animationFrame < 4;
  nextGame.pacman = nextPacman;

  // 3. Dots & Pellets
  const { x: px, y: py } = nextPacman.position;
  if (nextGame.dots[py] && nextGame.dots[py][px]) {
    const newDots = [...nextGame.dots];
    newDots[py] = [...newDots[py]];
    newDots[py][px] = false;
    nextGame.dots = newDots;
    nextGame.score += 10;
    nextGame.dotsRemaining--;
  }

  const pIdx = nextGame.powerPellets.findIndex(p => p.x === px && p.y === py);
  if (pIdx !== -1) {
    nextGame.powerPellets = nextGame.powerPellets.filter((_, i) => i !== pIdx);
    nextGame.score += 50;
    nextGame.dotsRemaining--;
    nextGame.frightenedMode = true;
    nextGame.frightenedTimer = 7000;
    nextGame.ghosts = nextGame.ghosts.map(g => ({
      ...g, 
      mode: 'frightened' as GhostMode,
      direction: reverseDirection(g.direction)
    }));
  }

  if (nextGame.frightenedTimer > 0) {
    nextGame.frightenedTimer -= deltaTime;
    if (nextGame.frightenedTimer <= 0) {
      nextGame.frightenedMode = false;
      nextGame.ghosts = nextGame.ghosts.map(g => g.mode === 'frightened' ? { ...g, mode: nextGame.globalMode as GhostMode } : g);
    }
  }

  // 4. Ghost Movement
  nextGame.ghosts = nextGame.ghosts.map(ghost => {
    let nextGhost = { ...ghost };
    if (nextGhost.mode === 'eaten') {
      if (nextGhost.position.x === nextGhost.homePosition.x && nextGhost.position.y === nextGhost.homePosition.y) {
        nextGhost.mode = nextGame.globalMode as GhostMode;
        return nextGhost;
      }
      return moveGhostTowardsTarget(nextGame, nextGhost, nextGhost.homePosition);
    }

    if (nextGhost.mode === 'frightened') {
      const dirs: Direction[] = ['up', 'down', 'left', 'right'];
      const valid = dirs.filter(d => canMove(game.maze, nextGhost.position, d) && d !== reverseDirection(nextGhost.direction));
      const moveDir = valid[Math.floor(Math.random() * valid.length)] || nextGhost.direction;
      return { ...nextGhost, direction: moveDir, position: getNextPosition(nextGhost.position, moveDir) };
    }

    const target = nextGame.globalMode === 'scatter' ? nextGhost.scatterTarget : getGhostChaseTarget(nextGame, nextGhost);
    return moveGhostTowardsTarget(nextGame, nextGhost, target);
  });

  // 5. Collisions
  for (const ghost of nextGame.ghosts) {
    if (ghost.position.x === px && ghost.position.y === py) {
      if (ghost.mode === 'frightened') {
        nextGame.score += 200;
        ghost.mode = 'eaten';
      } else if (ghost.mode !== 'eaten') {
        nextGame.lives--;
        if (nextGame.lives <= 0) return { ...nextGame, gameState: 'gameover' };
        const reset = createGame();
        return { ...nextGame, gameState: 'ready', pacman: reset.pacman, ghosts: reset.ghosts };
      }
    }
  }

  if (nextGame.dotsRemaining === 0) return { ...nextGame, gameState: 'levelComplete' };

  return nextGame;
}

// Action Handlers
export function changeDirection(game: PacmanGame, dir: Direction): PacmanGame {
  return { ...game, pacman: { ...game.pacman, nextDirection: dir } };
}

export function startGame(game: PacmanGame): PacmanGame {
  return { ...game, gameState: 'playing', lastUpdateTime: Date.now() };
}

export function pauseGame(game: PacmanGame): PacmanGame {
  return { ...game, gameState: game.gameState === 'playing' ? 'paused' : 'playing' };
}

export function resetGame(game: PacmanGame): PacmanGame {
  return createGame();
}

export function nextLevel(game: PacmanGame): PacmanGame {
  const ng = createGame();
  return { ...ng, score: game.score, lives: game.lives, level: game.level + 1, speed: Math.max(80, game.speed - 15) };
}