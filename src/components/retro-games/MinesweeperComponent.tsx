// src/components/brainwave/minesweeper/MinesweeperComponent.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  createBoard, 
  revealCell, 
  toggleFlag, 
  chordCell,
  DIFFICULTIES,
  type GameBoard,
  type GameDifficulty
} from '@/lib/retro-games/minesweeper-logic';
import { useSound } from '@/context/SoundContext';
import { Timer, Flag, Bomb, RefreshCw, Trophy, Settings, Zap } from 'lucide-react';
import { event } from '@/lib/gtag';

interface MinesweeperStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTimes: Record<string, number>;
  winStreak: number;
}

export default function MinesweeperComponent() {
  const [board, setBoard] = useState<GameBoard | null>(null);
  const [difficulty, setDifficulty] = useState<GameDifficulty>(DIFFICULTIES[0]);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState<MinesweeperStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    bestTimes: {},
    winStreak: 0
  });
  const { isMuted } = useSound();

  // Load stats on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('minesweeper-stats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error('Error loading stats:', e);
      }
    }
  }, []);

  // Save stats when they change
  useEffect(() => {
    localStorage.setItem('minesweeper-stats', JSON.stringify(stats));
  }, [stats]);

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(null);
    setTime(0);
    setTimerActive(false);
    setGameStarted(false);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && board?.gameState === 'playing') {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, board?.gameState]);

  // Sound effects
  const playSound = useCallback((soundType: 'click' | 'flag' | 'reveal' | 'mine' | 'win') => {
    if (isMuted) return;
    
    try {
      const sounds = {
        click: '/sounds/click.mp3',
        flag: '/sounds/flag.mp3',
        reveal: '/sounds/reveal.mp3',
        mine: '/sounds/mine.mp3',
        win: '/sounds/win.mp3'
      };
      
      const audio = new Audio(sounds[soundType]);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [isMuted]);

  // Handle initial click to start game
  const handleInitialClick = useCallback((x: number, y: number) => {
    if (gameStarted) return;
    
    // Create board with first click position (safe area)
    const newBoard = createBoard(
      difficulty.width,
      difficulty.height,
      difficulty.mines,
      x,
      y
    );
    
    // Reveal the first clicked cell
    const revealedBoard = revealCell(newBoard, x, y);
    
    setBoard(revealedBoard);
    setTime(0);
    setTimerActive(true);
    setGameStarted(true);
    
    // Analytics
    event({
      action: 'minesweeper_started',
      category: 'minesweeper',
      label: difficulty.name
    });
    
    playSound('reveal');
  }, [difficulty, gameStarted, playSound]);

  // Handle cell click during gameplay
  const handleGameCellClick = useCallback((x: number, y: number, isRightClick = false) => {
    if (!board || board.gameState !== 'playing') return;
    
    const cell = board.cells[y][x];
    
    if (isRightClick) {
      // Right click: toggle flag
      if (!cell.isRevealed) {
        playSound('flag');
        const newBoard = toggleFlag(board, x, y);
        setBoard(newBoard);
      }
    } else {
      // Left click: reveal cell
      if (cell.isFlagged || cell.isRevealed) return;
      
      if (cell.isMine) {
        playSound('mine');
        const newBoard = revealCell(board, x, y);
        setBoard(newBoard);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          winStreak: 0
        }));
        
        event({
          action: 'minesweeper_lost',
          category: 'minesweeper',
          label: difficulty.name
        });
      } else {
        playSound('reveal');
        const newBoard = revealCell(board, x, y);
        setBoard(newBoard);
        
        if (newBoard.gameState === 'won') {
          playSound('win');
          setTimerActive(false);
          
          // Update stats
          const newStats = {
            gamesPlayed: stats.gamesPlayed + 1,
            gamesWon: stats.gamesWon + 1,
            bestTimes: { ...stats.bestTimes },
            winStreak: stats.winStreak + 1
          };
          
          // Update best time if applicable
          const difficultyKey = difficulty.name;
          if (!newStats.bestTimes[difficultyKey] || time < newStats.bestTimes[difficultyKey]) {
            newStats.bestTimes[difficultyKey] = time;
          }
          
          setStats(newStats);
          
          event({
            action: 'minesweeper_won',
            category: 'minesweeper',
            label: `${difficulty.name}_${time}s`
          });
        }
      }
    }
  }, [board, difficulty.name, playSound, stats, time]);

  // Handle chord (double click)
  const handleChord = useCallback((x: number, y: number) => {
    if (!board || board.gameState !== 'playing') return;
    
    playSound('click');
    const newBoard = chordCell(board, x, y);
    setBoard(newBoard);
    
    if (newBoard.gameState === 'won') {
      playSound('win');
      setTimerActive(false);
      
      // Update stats
      const newStats = {
        gamesPlayed: stats.gamesPlayed + 1,
        gamesWon: stats.gamesWon + 1,
        bestTimes: { ...stats.bestTimes },
        winStreak: stats.winStreak + 1
      };
      
      const difficultyKey = difficulty.name;
      if (!newStats.bestTimes[difficultyKey] || time < newStats.bestTimes[difficultyKey]) {
        newStats.bestTimes[difficultyKey] = time;
      }
      
      setStats(newStats);
    }
  }, [board, difficulty.name, playSound, stats, time]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle difficulty change
  const handleDifficultyChange = (diff: GameDifficulty) => {
    setDifficulty(diff);
    setShowSettings(false);
    resetGame();
  };

  // Get cell size based on difficulty
  const getCellSize = () => {
    switch(difficulty.name) {
      case 'expert': return 'w-7 h-7';
      case 'intermediate': return 'w-8 h-8';
      default: return 'w-9 h-9';
    }
  };

  // Render initial grid
  const renderInitialGrid = () => {
    const cellSize = getCellSize();
    const cells = [];
    
    for (let y = 0; y < difficulty.height; y++) {
      for (let x = 0; x < difficulty.width; x++) {
        cells.push(
          <button
            key={`${x}-${y}`}
            onClick={() => handleInitialClick(x, y)}
            onContextMenu={(e) => {
              e.preventDefault();
              // Don't allow flagging before game starts
            }}
            className={`
              ${cellSize} 
              bg-[#c0c0c0] 
              border-2 
              border-t-white border-l-white 
              border-b-[#808080] border-r-[#808080]
              m-0 p-0
              hover:brightness-90
              active:border-2 active:border-[#808080] active:border-inset
              ${x > 0 ? '-ml-[2px]' : ''}
              ${y > 0 ? '-mt-[2px]' : ''}
            `}
          />
        );
      }
    }
    
    return cells;
  };

  // Render game grid
  const renderGameGrid = () => {
    if (!board) return null;
    const cellSize = getCellSize();
    
    return board.cells.flat().map((cell) => {
      let bgClass = 'bg-[#c0c0c0]';
      let borderClass = 'border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080]';
      let textClass = '';

      if (cell.isRevealed) {
        borderClass = 'border border-[#808080] border-inset';
        if (cell.isMine) {
          if (cell.isExploded) {
            bgClass = 'bg-red-600';
          } else {
            bgClass = 'bg-[#c0c0c0]';
          }
        } else {
          bgClass = 'bg-[#c0c0c0]';
          
          // Set text color based on number
          if (cell.adjacentMines === 1) {
            textClass = 'text-blue-800';
          } else if (cell.adjacentMines === 2) {
            textClass = 'text-green-800';
          } else if (cell.adjacentMines === 3) {
            textClass = 'text-red-600';
          } else if (cell.adjacentMines === 4) {
            textClass = 'text-purple-800';
          } else if (cell.adjacentMines === 5) {
            textClass = 'text-red-800';
          } else if (cell.adjacentMines === 6) {
            textClass = 'text-cyan-800';
          } else if (cell.adjacentMines === 7) {
            textClass = 'text-black';
          } else if (cell.adjacentMines === 8) {
            textClass = 'text-gray-600';
          }
        }
      }

      return (
        <button
          key={`${cell.x}-${cell.y}`}
          onClick={() => handleGameCellClick(cell.x, cell.y)}
          onContextMenu={(e) => {
            e.preventDefault();
            handleGameCellClick(cell.x, cell.y, true);
          }}
          onDoubleClick={() => handleChord(cell.x, cell.y)}
          disabled={board.gameState !== 'playing' || cell.isRevealed}
          className={`
            ${cellSize} 
            flex items-center justify-center
            text-sm font-bold
            ${bgClass}
            ${borderClass}
            ${textClass}
            m-0 p-0
            ${cell.x > 0 ? '-ml-[2px]' : ''}
            ${cell.y > 0 ? '-mt-[2px]' : ''}
            ${!cell.isRevealed && !cell.isFlagged && board.gameState === 'playing' ? 'hover:brightness-90 active:border-inset' : ''}
            transition-none
          `}
        >
          {cell.isFlagged ? (
            <Flag className="w-3/4 h-3/4 text-red-600" />
          ) : cell.isRevealed ? (
            cell.isMine ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-black"></div>
              </div>
            ) : cell.adjacentMines > 0 ? (
              <span className="font-bold">
                {cell.adjacentMines}
              </span>
            ) : null
          ) : null}
        </button>
      );
    });
  };

  return (
    <div className="relative">
      {/* Game Header */}
      <div className="bg-gradient-to-r from-gray-700/20 to-gray-800/20 backdrop-blur-lg rounded-3xl border border-gray-600/30 p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-3 rounded-2xl">
              <Bomb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">MINESWEEPER</h1>
              <p className="text-gray-300 text-sm">Classic Retro Game</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Timer */}
            <div className="bg-[#c0c0c0] rounded-md px-4 py-3 border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#808080] border-r-[#808080]">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-gray-800" />
                <span className="text-black font-bold text-xl mono-font">{formatTime(time)}</span>
              </div>
            </div>
            
            {/* Flags Counter */}
            <div className="bg-[#c0c0c0] rounded-md px-4 py-3 border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#808080] border-r-[#808080]">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-red-600" />
                <span className="text-black font-bold text-xl mono-font">
                  {board?.flagsRemaining ?? difficulty.mines}
                </span>
              </div>
            </div>
            
            {/* Reset Button */}
            <button
              onClick={resetGame}
              className="bg-[#c0c0c0] hover:brightness-90 text-black rounded-md px-5 py-3 flex items-center gap-2 border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#808080] border-r-[#808080] active:border-inset"
            >
              <RefreshCw className="w-4 h-4" />
              {gameStarted ? 'New Game' : 'Reset'}
            </button>
            
            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-[#c0c0c0] hover:brightness-90 text-black rounded-md px-4 py-3 flex items-center gap-2 border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#808080] border-r-[#808080]"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Game Status */}
        {!gameStarted && (
          <div className="mt-4 bg-[#c0c0c0] border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#808080] border-r-[#808080] rounded-md p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span className="text-black font-bold">
                Click any cell to start! First click is always safe.
              </span>
            </div>
          </div>
        )}
        
        {board?.gameState === 'won' && (
          <div className="mt-4 bg-[#c0c0c0] border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#808080] border-r-[#808080] rounded-md p-4 text-center animate-pulse">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="text-green-800 font-bold">VICTORY! Clear in {formatTime(time)}</span>
            </div>
          </div>
        )}
        
        {board?.gameState === 'lost' && (
          <div className="mt-4 bg-[#c0c0c0] border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#808080] border-r-[#808080] rounded-md p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Bomb className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-bold">BOOM! Try again</span>
            </div>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-[#c0c0c0] rounded-md border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#808080] border-r-[#808080] p-5 mb-6">
          <h3 className="text-black font-bold mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Game Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff.name}
                onClick={() => handleDifficultyChange(diff)}
                className={`p-4 rounded-md border-2 transition-all duration-300 ${
                  difficulty.name === diff.name
                    ? 'bg-[#000080] border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#808080] border-r-[#808080] text-white'
                    : 'bg-[#c0c0c0] border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#808080] border-r-[#808080] text-black hover:brightness-90'
                }`}
              >
                <div className="text-left">
                  <div className="font-bold capitalize mb-1">{diff.name}</div>
                  <div className="text-sm opacity-80">{diff.description}</div>
                  {stats.bestTimes[diff.name] && (
                    <div className="text-xs mt-2 text-[#000080] font-bold">
                      Best: {formatTime(stats.bestTimes[diff.name])}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats Panel */}
      <div className="bg-[#c0c0c0] rounded-md border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#808080] border-r-[#808080] p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-[#c0c0c0] rounded-md border-2 border-t-[#808080] border-l-[#808080] border-b-[#dfdfdf] border-r-[#dfdfdf]">
            <div className="text-black text-sm mb-1">Games Played</div>
            <div className="text-2xl font-bold text-black mono-font">{stats.gamesPlayed}</div>
          </div>
          <div className="text-center p-3 bg-[#c0c0c0] rounded-md border-2 border-t-[#808080] border-l-[#808080] border-b-[#dfdfdf] border-r-[#dfdfdf]">
            <div className="text-black text-sm mb-1">Win Rate</div>
            <div className="text-2xl font-bold text-black mono-font">
              {stats.gamesPlayed > 0 
                ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
                : 0}%
            </div>
          </div>
          <div className="text-center p-3 bg-[#c0c0c0] rounded-md border-2 border-t-[#808080] border-l-[#808080] border-b-[#dfdfdf] border-r-[#dfdfdf]">
            <div className="text-black text-sm mb-1">Win Streak</div>
            <div className="text-2xl font-bold text-black mono-font">{stats.winStreak}</div>
          </div>
          <div className="text-center p-3 bg-[#c0c0c0] rounded-md border-2 border-t-[#808080] border-l-[#808080] border-b-[#dfdfdf] border-r-[#dfdfdf]">
            <div className="text-black text-sm mb-1">Best Time</div>
            <div className="text-2xl font-bold text-black mono-font">
              {stats.bestTimes[difficulty.name] 
                ? formatTime(stats.bestTimes[difficulty.name]) 
                : '--:--'}
            </div>
          </div>
        </div>
      </div>

      {/* Game Board - Black background with centered grid */}
      <div className="bg-black/90 backdrop-blur-lg rounded-2xl border-4 border-[#333333] p-4 mb-6 overflow-auto flex justify-center">
        <div 
          className="inline-block bg-[#c0c0c0] p-1.5 rounded-sm shadow-lg"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${difficulty.width}, 1fr)`,
            gap: '0px',
            width: 'fit-content'
          }}
        >
          {!gameStarted ? renderInitialGrid() : renderGameGrid()}
        </div>
      </div>

      {/* Controls Guide */}
      <div className="bg-[#c0c0c0] rounded-md border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#808080] border-r-[#808080] p-5">
        <h3 className="font-bold text-black mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          How to Play:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#c0c0c0] rounded-md p-4 border-2 border-t-[#808080] border-l-[#808080] border-b-[#dfdfdf] border-r-[#dfdfdf]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-[#c0c0c0] rounded-sm flex items-center justify-center border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080]">
                <span className="text-black font-bold text-sm">L</span>
              </div>
              <h4 className="font-semibold text-black">Left Click</h4>
            </div>
            <p className="text-black text-sm">
              Reveal a cell. If it&apos;s a mine, game over. Numbers show adjacent mines.
            </p>
          </div>
          
          <div className="bg-[#c0c0c0] rounded-md p-4 border-2 border-t-[#808080] border-l-[#808080] border-b-[#dfdfdf] border-r-[#dfdfdf]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-[#c0c0c0] rounded-sm flex items-center justify-center border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080]">
                <Flag className="w-4 h-4 text-red-600" />
              </div>
              <h4 className="font-semibold text-black">Right Click</h4>
            </div>
            <p className="text-black text-sm">
              Place or remove a flag to mark suspected mines. (Right-click works!)
            </p>
          </div>
          
          <div className="bg-[#c0c0c0] rounded-md p-4 border-2 border-t-[#808080] border-l-[#808080] border-b-[#dfdfdf] border-r-[#dfdfdf]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-[#c0c0c0] rounded-sm flex items-center justify-center border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080]">
                <span className="text-blue-800 font-bold text-sm">2×</span>
              </div>
              <h4 className="font-semibold text-black">Double Click</h4>
            </div>
            <p className="text-black text-sm">
              When enough flags surround a number, quickly reveal safe cells.
            </p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-8 gap-3 text-sm">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <div key={num} className="flex items-center gap-2 text-black">
              <div className="w-4 h-4 rounded-sm flex items-center justify-center border border-[#808080]">
                <span className={`
                  text-xs font-bold
                  ${num === 1 ? 'text-blue-800' : ''}
                  ${num === 2 ? 'text-green-800' : ''}
                  ${num === 3 ? 'text-red-600' : ''}
                  ${num === 4 ? 'text-purple-800' : ''}
                  ${num === 5 ? 'text-red-800' : ''}
                  ${num === 6 ? 'text-cyan-800' : ''}
                  ${num === 7 ? 'text-black' : ''}
                  ${num === 8 ? 'text-gray-600' : ''}
                `}>
                  {num}
                </span>
              </div>
              <span>{num} mine{num !== 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .mono-font {
          font-family: 'Courier New', Courier, monospace;
        }
        .border-inset {
          border-style: inset;
        }
        /* Prevent text selection on game cells */
        button {
          user-select: none;
          -webkit-user-select: none;
        }
      `}</style>
    </div>
  );
}