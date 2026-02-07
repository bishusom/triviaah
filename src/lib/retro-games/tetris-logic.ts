// src/lib/retrogames/tetris-logic.ts
export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';
export type CellState = TetrominoType | 'empty' | 'ghost';
export type GameState = 'playing' | 'paused' | 'gameover';

export interface Tetromino {
  shape: number[][];
  color: string;
  type: TetrominoType;
  x: number;
  y: number;
}

export interface TetrisBoard {
  width: number;
  height: number;
  grid: CellState[][];
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  holdPiece: Tetromino | null;
  canHold: boolean;
  score: number;
  level: number;
  lines: number;
  gameState: GameState;
  dropSpeed: number;
  lastDropTime: number;
}

export const TETROMINOS: Record<TetrominoType, Tetromino> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: 'bg-cyan-500',
    type: 'I',
    x: 3,
    y: 0,
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-blue-500',
    type: 'J',
    x: 4,
    y: 0,
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-orange-500',
    type: 'L',
    x: 4,
    y: 0,
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: 'bg-yellow-500',
    type: 'O',
    x: 4,
    y: 0,
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: 'bg-green-500',
    type: 'S',
    x: 4,
    y: 0,
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-purple-500',
    type: 'T',
    x: 4,
    y: 0,
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-red-500',
    type: 'Z',
    x: 4,
    y: 0,
  },
};

export const COLORS: Record<TetrominoType, string> = {
  I: 'bg-cyan-500',
  J: 'bg-blue-500',
  L: 'bg-orange-500',
  O: 'bg-yellow-500',
  S: 'bg-green-500',
  T: 'bg-purple-500',
  Z: 'bg-red-500',
};

export const LEVEL_SPEEDS = [1000, 900, 800, 700, 600, 500, 400, 350, 300, 250, 200, 150, 100, 80, 60];

export function createBoard(width = 10, height = 20): TetrisBoard {
  const grid = Array(height).fill(null).map(() => Array(width).fill('empty'));
  
  return {
    width,
    height,
    grid,
    currentPiece: null,
    nextPiece: null,
    holdPiece: null,
    canHold: true,
    score: 0,
    level: 1,
    lines: 0,
    gameState: 'playing',
    dropSpeed: LEVEL_SPEEDS[0],
    lastDropTime: Date.now(),
  };
}

export function getRandomTetromino(): Tetromino {
  const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    ...TETROMINOS[type],
    x: 4,
    y: 0,
  };
}

export function canPlacePiece(board: TetrisBoard, piece: Tetromino): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardX = piece.x + x;
        const boardY = piece.y + y;
        
        if (
          boardX < 0 ||
          boardX >= board.width ||
          boardY >= board.height ||
          (boardY >= 0 && board.grid[boardY][boardX] !== 'empty')
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

export function placePiece(board: TetrisBoard): TetrisBoard {
  const newGrid = board.grid.map(row => [...row]);
  const piece = board.currentPiece!;
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardX = piece.x + x;
        const boardY = piece.y + y;
        
        if (boardY >= 0) {
          newGrid[boardY][boardX] = piece.type;
        }
      }
    }
  }
  
  return { ...board, grid: newGrid };
}

export function rotatePiece(board: TetrisBoard): TetrisBoard {
  if (!board.currentPiece) return board;
  
  const piece = { ...board.currentPiece };
  const rotatedShape = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  );
  
  const rotatedPiece = { ...piece, shape: rotatedShape };
  
  // Try rotation, if fails, try wall kicks
  if (canPlacePiece(board, rotatedPiece)) {
    return { ...board, currentPiece: rotatedPiece };
  }
  
  // Wall kick: try moving left
  rotatedPiece.x -= 1;
  if (canPlacePiece(board, rotatedPiece)) {
    return { ...board, currentPiece: rotatedPiece };
  }
  
  // Wall kick: try moving right
  rotatedPiece.x += 2;
  if (canPlacePiece(board, rotatedPiece)) {
    return { ...board, currentPiece: rotatedPiece };
  }
  
  return board;
}

export function movePiece(board: TetrisBoard, dx: number, dy: number): TetrisBoard {
  if (!board.currentPiece) return board;
  
  const movedPiece = {
    ...board.currentPiece,
    x: board.currentPiece.x + dx,
    y: board.currentPiece.y + dy,
  };
  
  if (canPlacePiece(board, movedPiece)) {
    return { ...board, currentPiece: movedPiece };
  }
  
  // If moving down and can't move, place the piece
  if (dy > 0) {
    const newBoard = placePiece(board);
    return checkLines(newBoard);
  }
  
  return board;
}

export function hardDrop(board: TetrisBoard): TetrisBoard {
  if (!board.currentPiece) return board;
  
  let newBoard = { ...board };
  let distance = 0;
  
  while (true) {
    const testPiece = {
      ...newBoard.currentPiece!,
      y: newBoard.currentPiece!.y + 1,
    };
    
    if (canPlacePiece(newBoard, testPiece)) {
      distance++;
      newBoard = { ...newBoard, currentPiece: testPiece };
    } else {
      break;
    }
  }
  
  // Add score for hard drop (2 points per cell dropped)
  newBoard.score += distance * 2;
  
  const placedBoard = placePiece(newBoard);
  return checkLines(placedBoard);
}

export function holdPiece(board: TetrisBoard): TetrisBoard {
  if (!board.canHold || !board.currentPiece) return board;
  
  const newHoldPiece = board.currentPiece;
  const newCurrentPiece = board.holdPiece || board.nextPiece || getRandomTetromino();
  const newNextPiece = board.holdPiece ? board.nextPiece : getRandomTetromino();
  
  // Reset position for new current piece
  newCurrentPiece.x = 4;
  newCurrentPiece.y = 0;
  
  if (!canPlacePiece(board, newCurrentPiece)) {
    return { ...board, gameState: 'gameover' };
  }
  
  return {
    ...board,
    currentPiece: newCurrentPiece,
    nextPiece: newNextPiece,
    holdPiece: newHoldPiece,
    canHold: false,
  };
}

export function checkLines(board: TetrisBoard): TetrisBoard {
  const newGrid = board.grid.map(row => [...row]);
  let linesCleared = 0;
  
  for (let y = board.height - 1; y >= 0; y--) {
    if (newGrid[y].every(cell => cell !== 'empty')) {
      newGrid.splice(y, 1);
      newGrid.unshift(Array(board.width).fill('empty'));
      linesCleared++;
      y++; // Check same row again after shift
    }
  }
  
  if (linesCleared > 0) {
    // Calculate score
    const linePoints = [0, 40, 100, 300, 1200]; // Points for 0, 1, 2, 3, 4 lines
    const points = linePoints[linesCleared] * board.level;
    
    const newLines = board.lines + linesCleared;
    const newLevel = Math.floor(newLines / 10) + 1;
    const newDropSpeed = LEVEL_SPEEDS[Math.min(newLevel - 1, LEVEL_SPEEDS.length - 1)];
    
    // Generate new piece
    const newCurrentPiece = board.nextPiece || getRandomTetromino();
    const newNextPiece = getRandomTetromino();
    
    // Check if new piece can be placed
    if (!canPlacePiece({ ...board, currentPiece: newCurrentPiece }, newCurrentPiece)) {
      return { ...board, gameState: 'gameover' };
    }
    
    return {
      ...board,
      grid: newGrid,
      score: board.score + points,
      lines: newLines,
      level: newLevel,
      dropSpeed: newDropSpeed,
      currentPiece: newCurrentPiece,
      nextPiece: newNextPiece,
      canHold: true,
    };
  }
  
  // Generate new piece
  const newCurrentPiece = board.nextPiece || getRandomTetromino();
  const newNextPiece = getRandomTetromino();
  
  // Check if new piece can be placed
  if (!canPlacePiece({ ...board, currentPiece: newCurrentPiece }, newCurrentPiece)) {
    return { ...board, gameState: 'gameover' };
  }
  
  return {
    ...board,
    currentPiece: newCurrentPiece,
    nextPiece: newNextPiece,
    canHold: true,
  };
}

export function getGhostPiece(board: TetrisBoard): Tetromino | null {
  if (!board.currentPiece) return null;
  
  let ghost = { ...board.currentPiece };
  while (canPlacePiece(board, { ...ghost, y: ghost.y + 1 })) {
    ghost.y++;
  }
  
  return ghost;
}