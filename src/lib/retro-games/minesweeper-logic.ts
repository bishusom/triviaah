// src/lib/brainwave/minesweeper/minesweeper-logic.ts
export interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
  isExploded?: boolean;
}

export interface GameBoard {
  width: number;
  height: number;
  mines: number;
  cells: Cell[][];
  gameState: 'playing' | 'won' | 'lost';
  flagsRemaining: number;
  cellsRevealed: number;
  totalCells: number;
}

export interface GameDifficulty {
  name: 'beginner' | 'intermediate' | 'expert' | 'custom';
  width: number;
  height: number;
  mines: number;
  description: string;
}

export const DIFFICULTIES: GameDifficulty[] = [
  {
    name: 'beginner',
    width: 9,
    height: 9,
    mines: 10,
    description: '9×9 grid with 10 mines'
  },
  {
    name: 'intermediate',
    width: 16,
    height: 16,
    mines: 40,
    description: '16×16 grid with 40 mines'
  },
  {
    name: 'expert',
    width: 30,
    height: 16,
    mines: 99,
    description: '30×16 grid with 99 mines'
  }
];

export function createBoard(
  width: number,
  height: number,
  mines: number,
  firstClickX: number,
  firstClickY: number
): GameBoard {
  // Initialize empty board
  const cells: Cell[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        x,
        y,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0
      });
    }
    cells.push(row);
  }

  // Place mines randomly, avoiding first click
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    
    // Don't place mine on first click or adjacent cells
    const isFirstClickArea = 
      Math.abs(x - firstClickX) <= 1 && 
      Math.abs(y - firstClickY) <= 1;
    
    if (!cells[y][x].isMine && !isFirstClickArea) {
      cells[y][x].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate adjacent mines
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!cells[y][x].isMine) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (
              ny >= 0 && ny < height &&
              nx >= 0 && nx < width &&
              cells[ny][nx].isMine
            ) {
              count++;
            }
          }
        }
        cells[y][x].adjacentMines = count;
      }
    }
  }

  return {
    width,
    height,
    mines,
    cells,
    gameState: 'playing',
    flagsRemaining: mines,
    cellsRevealed: 0,
    totalCells: width * height
  };
}

export function revealCell(
  board: GameBoard,
  x: number,
  y: number
): GameBoard {
  const newBoard = { ...board, cells: board.cells.map(row => [...row]) };
  const cell = newBoard.cells[y][x];
  
  // If already revealed or flagged, do nothing
  if (cell.isRevealed || cell.isFlagged) {
    return newBoard;
  }
  
  // Reveal this cell
  cell.isRevealed = true;
  newBoard.cellsRevealed++;
  
  // If it's a mine, game over
  if (cell.isMine) {
    newBoard.gameState = 'lost';
    cell.isExploded = true;
    // Reveal all mines
    revealAllMines(newBoard);
    return newBoard;
  }
  
  // If it's an empty cell (0 adjacent mines), reveal adjacent cells
  if (cell.adjacentMines === 0) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const ny = y + dy;
        const nx = x + dx;
        if (
          ny >= 0 && ny < newBoard.height &&
          nx >= 0 && nx < newBoard.width &&
          !(dx === 0 && dy === 0)
        ) {
          revealCell(newBoard, nx, ny);
        }
      }
    }
  }
  
  // Check win condition
  if (newBoard.cellsRevealed === newBoard.totalCells - newBoard.mines) {
    newBoard.gameState = 'won';
    // Auto-flag remaining mines
    autoFlagRemainingMines(newBoard);
  }
  
  return newBoard;
}

function revealAllMines(board: GameBoard) {
  for (let y = 0; y < board.height; y++) {
    for (let x = 0; x < board.width; x++) {
      const cell = board.cells[y][x];
      if (cell.isMine && !cell.isFlagged) {
        cell.isRevealed = true;
      }
    }
  }
}

function autoFlagRemainingMines(board: GameBoard) {
  for (let y = 0; y < board.height; y++) {
    for (let x = 0; x < board.width; x++) {
      const cell = board.cells[y][x];
      if (cell.isMine && !cell.isFlagged) {
        cell.isFlagged = true;
        board.flagsRemaining--;
      }
    }
  }
}

export function toggleFlag(
  board: GameBoard,
  x: number,
  y: number
): GameBoard {
  const newBoard = { ...board, cells: board.cells.map(row => [...row]) };
  const cell = newBoard.cells[y][x];
  
  // Can't flag revealed cells
  if (cell.isRevealed) {
    return newBoard;
  }
  
  if (cell.isFlagged) {
    // Remove flag
    cell.isFlagged = false;
    newBoard.flagsRemaining++;
  } else if (newBoard.flagsRemaining > 0) {
    // Add flag
    cell.isFlagged = true;
    newBoard.flagsRemaining--;
  }
  
  return newBoard;
}

export function chordCell(
  board: GameBoard,
  x: number,
  y: number
): GameBoard {
  const cell = board.cells[y][x];
  if (!cell.isRevealed || cell.adjacentMines === 0) {
    return board;
  }
  
  // Count adjacent flags
  let adjacentFlags = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      
      const ny = y + dy;
      const nx = x + dx;
      if (
        ny >= 0 && ny < board.height &&
        nx >= 0 && nx < board.width &&
        board.cells[ny][nx].isFlagged
      ) {
        adjacentFlags++;
      }
    }
  }
  
  // If flag count matches adjacent mines, reveal surrounding cells
  if (adjacentFlags === cell.adjacentMines) {
    let newBoard = { ...board };
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        
        const ny = y + dy;
        const nx = x + dx;
        if (
          ny >= 0 && ny < board.height &&
          nx >= 0 && nx < board.width &&
          !board.cells[ny][nx].isFlagged &&
          !board.cells[ny][nx].isRevealed
        ) {
          newBoard = revealCell(newBoard, nx, ny);
        }
      }
    }
    return newBoard;
  }
  
  return board;
}