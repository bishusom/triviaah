'use client';

import { useState, useEffect, useCallback } from 'react';

type Player = 'X' | 'O' | null;
type GameState = 'playing' | 'paused' | 'gameover';
type Winner = 'X' | 'O' | 'draw' | null;

interface TicTacToeGame {
  board: Player[][];
  currentPlayer: 'X' | 'O';
  winner: Winner;
  gameState: GameState;
  scores: {
    x: number;
    o: number;
    draws: number;
  };
  winningLine: [number, number][] | null;
  isSinglePlayer: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function TicTacToeComponent() {
  const [game, setGame] = useState<TicTacToeGame>(() => createGame());
  const [gameOver, setGameOver] = useState(false);

  // Handle player move
  const handleCellClick = useCallback((row: number, col: number) => {
    if (game.gameState !== 'playing') return;
    if (game.board[row][col] !== null) return;
    if (game.winner) return;
    
    setGame(prev => {
      const newGame = { ...prev };
      // Make player move
      newGame.board[row][col] = newGame.currentPlayer;
      
      // Check for winner
      const winnerResult = checkWinner(newGame.board);
      if (winnerResult) {
        newGame.winner = winnerResult.winner;
        newGame.winningLine = winnerResult.line;
        newGame.gameState = 'gameover';
        
        // Update scores
        if (winnerResult.winner === 'X') {
          newGame.scores.x += 1;
          if (typeof window !== 'undefined') {
            localStorage.setItem('ticTacToeScoreX', newGame.scores.x.toString());
          }
        } else if (winnerResult.winner === 'O') {
          newGame.scores.o += 1;
          if (typeof window !== 'undefined') {
            localStorage.setItem('ticTacToeScoreO', newGame.scores.o.toString());
          }
        }
        
        if (winnerResult.winner === 'draw') {
          newGame.scores.draws += 1;
          if (typeof window !== 'undefined') {
            localStorage.setItem('ticTacToeScoreDraws', newGame.scores.draws.toString());
          }
        }
      } else {
        // Switch player
        newGame.currentPlayer = newGame.currentPlayer === 'X' ? 'O' : 'X';
        
        // If single player and it's computer's turn
        if (newGame.isSinglePlayer && newGame.currentPlayer === 'O') {
          // Return here and let useEffect handle computer move
          return newGame;
        }
      }
      
      return newGame;
    });
  }, [game.gameState, game.winner, game.board]);

  // Computer move logic
  useEffect(() => {
    if (game.isSinglePlayer && 
        game.currentPlayer === 'O' && 
        game.gameState === 'playing' && 
        !game.winner) {
      
      const makeComputerMove = () => {
        setGame(prev => {
          const newGame = { ...prev };
          const emptyCells: [number, number][] = [];
          
          // Find all empty cells
          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
              if (newGame.board[row][col] === null) {
                emptyCells.push([row, col]);
              }
            }
          }
          
          if (emptyCells.length === 0) return newGame;
          
          let chosenCell: [number, number];
          
          // Different AI strategies based on difficulty
          switch (newGame.difficulty) {
            case 'hard':
              // Try to win, then block, then choose center, then corners, then random
              chosenCell = getBestMove(newGame.board, 'O');
              break;
            case 'medium':
              // 70% chance of best move, 30% random
              if (Math.random() < 0.7) {
                chosenCell = getBestMove(newGame.board, 'O');
              } else {
                chosenCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
              }
              break;
            case 'easy':
            default:
              // Random move
              chosenCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
              break;
          }
          
          // Make computer move
          newGame.board[chosenCell[0]][chosenCell[1]] = 'O';
          
          // Check for winner
          const winnerResult = checkWinner(newGame.board);
          if (winnerResult) {
            newGame.winner = winnerResult.winner;
            newGame.winningLine = winnerResult.line;
            newGame.gameState = 'gameover';
            
            if (winnerResult.winner === 'O') {
              newGame.scores.o += 1;
              localStorage.setItem('ticTacToeScoreO', newGame.scores.o.toString());
            } else if (winnerResult.winner === 'draw') {
              newGame.scores.draws += 1;
              localStorage.setItem('ticTacToeScoreDraws', newGame.scores.draws.toString());
            }
          } else {
            // Switch back to player
            newGame.currentPlayer = 'X';
          }
          
          return newGame;
        });
      };
      
      // Add delay for computer move to feel natural
      const timeout = setTimeout(makeComputerMove, 500);
      return () => clearTimeout(timeout);
    }
  }, [game.isSinglePlayer, game.currentPlayer, game.gameState, game.winner]);

  // Keyboard controls
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

      // Enter to restart
      if (e.key === 'Enter') {
        e.preventDefault();
        setGame(createGame(game.isSinglePlayer, game.difficulty));
        setGameOver(false);
        return;
      }

      // R to reset scores
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setGame(prev => ({
          ...createGame(prev.isSinglePlayer, prev.difficulty),
          scores: { x: 0, o: 0, draws: 0 }
        }));
        if (typeof window !== 'undefined') {
          localStorage.removeItem('ticTacToeScoreX');
          localStorage.removeItem('ticTacToeScoreO');
          localStorage.removeItem('ticTacToeScoreDraws');
        }
        return;
      }

      // 1-9 for quick moves (numpad style)
      if (game.gameState === 'playing' && !game.winner) {
        const keyMap: { [key: string]: [number, number] } = {
          '1': [2, 0], '2': [2, 1], '3': [2, 2],
          '4': [1, 0], '5': [1, 1], '6': [1, 2],
          '7': [0, 0], '8': [0, 1], '9': [0, 2],
        };
        
        if (keyMap[e.key]) {
          e.preventDefault();
          const [row, col] = keyMap[e.key];
          handleCellClick(row, col);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game.gameState, game.winner, game.isSinglePlayer, game.difficulty, handleCellClick]);

  // Toggle game mode
  const toggleGameMode = () => {
    setGame(createGame(!game.isSinglePlayer, game.difficulty));
  };

  // Change difficulty
  const changeDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setGame(createGame(game.isSinglePlayer, difficulty));
  };

  // Render board
  const renderBoard = () => {
    return game.board.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-center gap-2">
        {row.map((cell, colIndex) => {
          const isWinningCell = game.winningLine?.some(
            ([r, c]) => r === rowIndex && c === colIndex
          );
          
          let cellClass = 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800';
          let textClass = '';
          
          if (isWinningCell) {
            cellClass = 'bg-gradient-to-br from-green-600 to-emerald-700 animate-pulse';
          } else if (cell !== null) {
            cellClass = 'bg-gradient-to-br from-gray-700 to-gray-800';
          }
          
          if (cell === 'X') {
            textClass = 'text-blue-400';
          } else if (cell === 'O') {
            textClass = 'text-red-400';
          }
          
          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={cell !== null || game.currentPlayer === 'O' || game.winner !== null}
              className={`
                w-20 h-20 md:w-24 md:h-24 rounded-xl
                ${cellClass}
                flex items-center justify-center
                transition-all duration-300
                disabled:cursor-not-allowed
                shadow-lg hover:shadow-xl
                border-2 ${isWinningCell ? 'border-yellow-400' : 'border-gray-700'}
              `}
            >
              {cell && (
                <span className={`text-4xl md:text-5xl font-bold ${textClass}`}>
                  {cell}
                </span>
              )}
            </button>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="text-2xl font-bold text-white">Tic Tac Toe</div>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-white text-lg">Score</div>
            <div className="flex gap-4">
              <div className="text-blue-400 font-bold">X: {game.scores.x}</div>
              <div className="text-gray-400">Draws: {game.scores.draws}</div>
              <div className="text-red-400 font-bold">O: {game.scores.o}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game mode and difficulty selector */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={toggleGameMode}
          className={`
            px-4 py-2 rounded-lg font-semibold transition-all
            ${game.isSinglePlayer 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' 
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
            }
          `}
        >
          {game.isSinglePlayer ? 'vs Computer' : '2 Players'}
        </button>
        
        {game.isSinglePlayer && (
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => changeDifficulty(diff)}
                className={`
                  px-4 py-2 rounded-lg font-semibold capitalize transition-all
                  ${game.difficulty === diff
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                  }
                `}
              >
                {diff}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Current player indicator */}
      <div className="text-center mb-6">
        <div className="text-xl font-bold mb-2">
          {game.winner ? (
            <div className="animate-bounce">
              {game.winner === 'draw' ? (
                <span className="text-yellow-400">It's a Draw! 🎭</span>
              ) : (
                <span className={game.winner === 'X' ? 'text-blue-400' : 'text-red-400'}>
                  {game.winner} Wins! 🎉
                </span>
              )}
            </div>
          ) : (
            <span>
              Current Turn:{' '}
              <span className={game.currentPlayer === 'X' ? 'text-blue-400' : 'text-red-400'}>
                {game.currentPlayer}
                {game.isSinglePlayer && game.currentPlayer === 'O' ? ' (Computer)' : ''}
              </span>
            </span>
          )}
        </div>
      </div>
      
      {/* Game board */}
      <div className="flex flex-col gap-2 mb-6">
        {renderBoard()}
      </div>
      
      {/* Controls */}
      <div className="text-center">
        {game.winner && (
          <div className="mb-4">
            <button
              onClick={() => {
                setGame(createGame(game.isSinglePlayer, game.difficulty));
                setGameOver(false);
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-bold text-lg transition-all"
            >
              Play Again
            </button>
          </div>
        )}
        
        <div className="text-gray-400 text-sm mt-4">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>SPACE: {game.gameState === 'playing' ? 'Pause' : 'Start'}</div>
            <div>ENTER: New Game</div>
            <div>R: Reset Scores</div>
            <div>1-9: Quick Move</div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {game.isSinglePlayer && `Difficulty: ${game.difficulty}`}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function createGame(isSinglePlayer: boolean = true, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): TicTacToeGame {
  // Load scores from localStorage
  let scores = { x: 0, o: 0, draws: 0 };
  if (typeof window !== 'undefined') {
    try {
      scores = {
        x: parseInt(localStorage.getItem('ticTacToeScoreX') || '0'),
        o: parseInt(localStorage.getItem('ticTacToeScoreO') || '0'),
        draws: parseInt(localStorage.getItem('ticTacToeScoreDraws') || '0'),
      };
    } catch (error) {
      console.warn('Failed to load scores:', error);
    }
  }
  
  return {
    board: Array(3).fill(null).map(() => Array(3).fill(null)),
    currentPlayer: 'X',
    winner: null,
    gameState: 'playing',
    scores,
    winningLine: null,
    isSinglePlayer,
    difficulty,
  };
}

function checkWinner(board: Player[][]) {
  const lines = [
    // Rows
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    // Columns
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    // Diagonals
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
  ];
  
  for (const line of lines) {
    const [a, b, c] = line;
    if (
      board[a[0]][a[1]] &&
      board[a[0]][a[1]] === board[b[0]][b[1]] &&
      board[a[0]][a[1]] === board[c[0]][c[1]]
    ) {
      return {
        winner: board[a[0]][a[1]] as 'X' | 'O',
        line: line as [number, number][]
      };
    }
  }
  
  // Check for draw
  const isDraw = board.flat().every(cell => cell !== null);
  if (isDraw) {
    return { winner: 'draw' as const, line: null };
  }
  
  return null;
}

function getBestMove(board: Player[][], player: 'X' | 'O'): [number, number] {
  const opponent = player === 'X' ? 'O' : 'X';
  
  // Check for winning move
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        board[row][col] = player;
        if (checkWinner(board)?.winner === player) {
          board[row][col] = null;
          return [row, col];
        }
        board[row][col] = null;
      }
    }
  }
  
  // Block opponent's winning move
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        board[row][col] = opponent;
        if (checkWinner(board)?.winner === opponent) {
          board[row][col] = null;
          return [row, col];
        }
        board[row][col] = null;
      }
    }
  }
  
  // Take center if available
  if (board[1][1] === null) return [1, 1];
  
  // Take corners
  const corners: [number, number][] = [[0, 0], [0, 2], [2, 0], [2, 2]];
  const availableCorners = corners.filter(([r, c]) => board[r][c] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }
  
  // Take any available edge
  const edges: [number, number][] = [[0, 1], [1, 0], [1, 2], [2, 1]];
  const availableEdges = edges.filter(([r, c]) => board[r][c] === null);
  if (availableEdges.length > 0) {
    return availableEdges[Math.floor(Math.random() * availableEdges.length)];
  }
  
  // Fallback (should never reach here)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        return [row, col];
      }
    }
  }
  
  return [0, 0];
}