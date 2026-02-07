// src/components/brainwave/tetris/TetrisComponent.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  createBoard, 
  movePiece, 
  rotatePiece, 
  hardDrop, 
  holdPiece,
  getGhostPiece,
  getRandomTetromino,
  type TetrisBoard,
  type GameState,
  COLORS,
} from '@/lib/retro-games/tetris-logic';
import { useSound } from '@/context/SoundContext';
import { 
  Play, 
  Pause, 
  RotateCw, 
  FastForward, 
  SkipForward, 
  Box, 
  Trophy, 
  Settings, 
  RefreshCw,
  Timer,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Volume2,
  VolumeX
} from 'lucide-react';
import { event } from '@/lib/gtag';

interface TetrisStats {
  gamesPlayed: number;
  highScore: number;
  totalLines: number;
  maxLevel: number;
  longestGame: number; // in seconds
}

export default function TetrisComponent() {
  const [board, setBoard] = useState<TetrisBoard>(createBoard());
  const [gameState, setGameState] = useState<GameState>('playing');
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState<TetrisStats>({
    gamesPlayed: 0,
    highScore: 0,
    totalLines: 0,
    maxLevel: 1,
    longestGame: 0
  });
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const { isMuted, toggleMute } = useSound();
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef(Date.now());

  // Load stats on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('tetris-stats');
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
    localStorage.setItem('tetris-stats', JSON.stringify(stats));
  }, [stats]);

  // Initialize game
  const initGame = useCallback(() => {
    const newBoard = createBoard();
    const firstPiece = getRandomTetromino();
    const nextPiece = getRandomTetromino();
    
    setBoard({
      ...newBoard,
      currentPiece: firstPiece,
      nextPiece: nextPiece,
    });
    setGameState('playing');
    setTime(0);
    setTimerActive(true);
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    initGame();
    
    event({
      action: 'tetris_reset',
      category: 'tetris',
      label: 'reset'
    });
  }, [initGame]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing' || !timerActive) return;

    const gameLoop = () => {
      const now = Date.now();
      const delta = now - lastUpdateRef.current;
      
      if (delta >= board.dropSpeed) {
        setBoard(prev => movePiece(prev, 0, 1));
        lastUpdateRef.current = now;
      }
    };

    gameLoopRef.current = setInterval(gameLoop, 50);
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, timerActive, board.dropSpeed]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && gameState === 'playing') {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, gameState]);

  // Update game state when board changes
  useEffect(() => {
    if (board.gameState === 'gameover' && gameState === 'playing') {
      setGameState('gameover');
      setTimerActive(false);
      
      // Update stats
      setStats(prev => {
        const newStats = {
          gamesPlayed: prev.gamesPlayed + 1,
          highScore: Math.max(prev.highScore, board.score),
          totalLines: prev.totalLines + board.lines,
          maxLevel: Math.max(prev.maxLevel, board.level),
          longestGame: Math.max(prev.longestGame, time)
        };
        
        event({
          action: 'tetris_gameover',
          category: 'tetris',
          label: `score_${board.score}`,
          value: board.score
        });
        
        return newStats;
      });
    }
  }, [board.gameState, board.score, board.lines, board.level, gameState, time]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setBoard(prev => movePiece(prev, -1, 0));
          playSound('move');
          break;
        case 'ArrowRight':
          e.preventDefault();
          setBoard(prev => movePiece(prev, 1, 0));
          playSound('move');
          break;
        case 'ArrowDown':
          e.preventDefault();
          setBoard(prev => movePiece(prev, 0, 1));
          playSound('move');
          break;
        case 'ArrowUp':
        case 'x':
        case 'X':
          e.preventDefault();
          setBoard(prev => rotatePiece(prev));
          playSound('rotate');
          break;
        case 'z':
        case 'Z':
          e.preventDefault();
          // Alternative rotation (counter-clockwise)
          setBoard(prev => rotatePiece(rotatePiece(rotatePiece(prev))));
          playSound('rotate');
          break;
        case ' ':
          e.preventDefault();
          setBoard(prev => hardDrop(prev));
          playSound('hardDrop');
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          setBoard(prev => holdPiece(prev));
          playSound('hold');
          break;
        case 'p':
        case 'P':
        case 'Escape':
          e.preventDefault();
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Touch controls for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart || gameState !== 'playing') return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // Minimum swipe distance
    const minSwipe = 30;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipe) {
        if (deltaX > 0) {
          // Swipe right
          setBoard(prev => movePiece(prev, 1, 0));
          playSound('move');
        } else {
          // Swipe left
          setBoard(prev => movePiece(prev, -1, 0));
          playSound('move');
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipe) {
        if (deltaY > 0) {
          // Swipe down - soft drop
          setBoard(prev => movePiece(prev, 0, 1));
          playSound('move');
        } else {
          // Swipe up - rotate
          setBoard(prev => rotatePiece(prev));
          playSound('rotate');
        }
      } else {
        // Tap - toggle mobile controls
        setShowMobileControls(prev => !prev);
      }
    }
    
    setTouchStart(null);
  }, [touchStart, gameState]);

  // Sound effects
  const playSound = useCallback((soundType: 'move' | 'rotate' | 'hardDrop' | 'hold' | 'line' | 'gameover') => {
    if (isMuted) return;
    
    try {
      const sounds = {
        move: '/sounds/tetris-move.mp3',
        rotate: '/sounds/tetris-rotate.mp3',
        hardDrop: '/sounds/tetris-harddrop.mp3',
        hold: '/sounds/tetris-hold.mp3',
        line: '/sounds/tetris-line.mp3',
        gameover: '/sounds/tetris-gameover.mp3'
      };
      
      const audio = new Audio(sounds[soundType]);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [isMuted]);

  // Pause/Resume
  const togglePause = useCallback(() => {
    if (gameState === 'gameover') return;
    
    if (gameState === 'playing') {
      setGameState('paused');
      setTimerActive(false);
    } else {
      setGameState('playing');
      setTimerActive(true);
    }
    
    event({
      action: 'tetris_toggle_pause',
      category: 'tetris',
      label: gameState === 'playing' ? 'paused' : 'resumed'
    });
  }, [gameState]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get ghost piece
  const ghostPiece = getGhostPiece(board);

  // Initialize game on mount
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Render game board
  const renderBoard = () => {
    const displayGrid = board.grid.map(row => [...row]);
    const ghost = ghostPiece;
    
    // Draw ghost piece
    if (ghost) {
      for (let y = 0; y < ghost.shape.length; y++) {
        for (let x = 0; x < ghost.shape[y].length; x++) {
          if (ghost.shape[y][x]) {
            const boardX = ghost.x + x;
            const boardY = ghost.y + y;
            if (boardY >= 0 && boardY < board.height) {
              displayGrid[boardY][boardX] = 'ghost';
            }
          }
        }
      }
    }
    
    // Draw current piece
    if (board.currentPiece) {
      for (let y = 0; y < board.currentPiece.shape.length; y++) {
        for (let x = 0; x < board.currentPiece.shape[y].length; x++) {
          if (board.currentPiece.shape[y][x]) {
            const boardX = board.currentPiece.x + x;
            const boardY = board.currentPiece.y + y;
            if (boardY >= 0 && boardY < board.height) {
              displayGrid[boardY][boardX] = board.currentPiece.type;
            }
          }
        }
      }
    }
    
    return displayGrid.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`
              w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8
              border border-gray-800
              ${cell === 'empty' ? 'bg-gray-900' : ''}
              ${cell === 'ghost' ? 'bg-gray-700/30 border-dashed border-gray-600' : ''}
              ${cell !== 'empty' && cell !== 'ghost' ? `${COLORS[cell]} border-gray-800` : ''}
            `}
          />
        ))}
      </div>
    ));
  };

  // Render next piece preview
  const renderNextPiece = () => {
    if (!board.nextPiece) return null;
    
    return (
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="text-white text-sm font-bold mb-2">NEXT</div>
        <div className="flex justify-center">
          {board.nextPiece.shape.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`
                    w-4 h-4 md:w-5 md:h-5
                    ${cell ? `${COLORS[board.nextPiece!.type]} border border-gray-800` : 'bg-transparent'}
                  `}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render hold piece
  const renderHoldPiece = () => {
    if (!board.holdPiece) return null;
    
    return (
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="text-white text-sm font-bold mb-2">HOLD</div>
        <div className="flex justify-center">
          {board.holdPiece.shape.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`
                    w-4 h-4 md:w-5 md:h-5
                    ${cell ? `${COLORS[board.holdPiece!.type]} border border-gray-800` : 'bg-transparent'}
                  `}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Game Header */}
      <div className="bg-gradient-to-r from-purple-700/20 to-blue-800/20 backdrop-blur-lg rounded-3xl border border-gray-600/30 p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-700 p-3 rounded-2xl">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">TETRIS</h1>
              <p className="text-gray-300 text-sm">Classic Puzzle Game</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Score */}
            <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700">
              <div className="text-center">
                <div className="text-gray-400 text-sm">SCORE</div>
                <div className="text-white font-bold text-xl mono-font">{board.score.toLocaleString()}</div>
              </div>
            </div>
            
            {/* Timer */}
            <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-gray-300" />
                <span className="text-white font-bold text-xl mono-font">{formatTime(time)}</span>
              </div>
            </div>
            
            {/* Level */}
            <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700">
              <div className="text-center">
                <div className="text-gray-400 text-sm">LEVEL</div>
                <div className="text-white font-bold text-xl mono-font">{board.level}</div>
              </div>
            </div>
            
            {/* Lines */}
            <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700">
              <div className="text-center">
                <div className="text-gray-400 text-sm">LINES</div>
                <div className="text-white font-bold text-xl mono-font">{board.lines}</div>
              </div>
            </div>
            
            {/* Pause/Play Button */}
            <button
              onClick={togglePause}
              className="bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg px-4 py-3 border border-gray-700 flex items-center gap-2"
              disabled={gameState === 'gameover'}
            >
              {gameState === 'playing' ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline">Resume</span>
                </>
              )}
            </button>
            
            {/* Reset Button */}
            <button
              onClick={resetGame}
              className="bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg px-4 py-3 border border-gray-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            
            {/* Sound Button */}
            <button
              onClick={toggleMute}
              className="bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg px-3 py-3 border border-gray-700"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            
            {/* Mobile Controls Toggle */}
            <button
              onClick={() => setShowMobileControls(!showMobileControls)}
              className="bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg px-4 py-3 border border-gray-700 flex items-center gap-2 lg:hidden"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Game Status */}
        {gameState === 'gameover' && (
          <div className="mt-4 bg-red-500/20 backdrop-blur-lg rounded-lg p-4 text-center animate-pulse">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-bold">GAME OVER! Final Score: {board.score.toLocaleString()}</span>
            </div>
          </div>
        )}
        
        {gameState === 'paused' && (
          <div className="mt-4 bg-blue-500/20 backdrop-blur-lg rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Pause className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-bold">GAME PAUSED</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Game Area */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Left Panel - Hold and Info */}
        <div className="lg:w-1/4 space-y-6">
          {renderHoldPiece()}
          
          {/* Stats Panel */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-4">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              STATS
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">High Score</span>
                <span className="text-white font-bold">{stats.highScore.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Games Played</span>
                <span className="text-white font-bold">{stats.gamesPlayed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Lines</span>
                <span className="text-white font-bold">{stats.totalLines}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Level</span>
                <span className="text-white font-bold">{stats.maxLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Longest Game</span>
                <span className="text-white font-bold">{formatTime(stats.longestGame)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Center Panel - Game Board */}
        <div className="lg:w-2/4">
          <div 
            className="bg-black/90 backdrop-blur-lg rounded-xl border-4 border-gray-800 p-4"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex justify-center">
              <div className="border-2 border-gray-700 bg-gray-900">
                {renderBoard()}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Next Piece and Controls */}
        <div className="lg:w-1/4 space-y-6">
          {renderNextPiece()}
          
          {/* Controls Guide */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-4">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-400" />
              CONTROLS
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-gray-700 rounded p-1">
                  <ArrowLeft className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm">Move Left</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-700 rounded p-1">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm">Move Right</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-700 rounded p-1">
                  <ArrowDown className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm">Soft Drop</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-700 rounded p-1">
                  <ArrowUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm">Rotate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-700 rounded p-1">
                  <FastForward className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm">Space - Hard Drop</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-700 rounded p-1">
                  <SkipForward className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm">C - Hold Piece</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-700 rounded p-1">
                  <Pause className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm">P - Pause/Resume</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Controls Overlay */}
      {showMobileControls && (
        <div className="fixed bottom-20 left-0 right-0 z-50 lg:hidden">
          <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-700 mx-4 p-4">
            <div className="flex flex-col items-center gap-4">
              {/* Rotate Button */}
              <button
                onClick={() => {
                  setBoard(prev => rotatePiece(prev));
                  playSound('rotate');
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-16 h-16 flex items-center justify-center"
                disabled={gameState !== 'playing'}
              >
                <RotateCw className="w-8 h-8" />
              </button>
              
              {/* Movement Row */}
              <div className="flex items-center gap-8">
                <button
                  onClick={() => {
                    setBoard(prev => movePiece(prev, -1, 0));
                    playSound('move');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center"
                  disabled={gameState !== 'playing'}
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => {
                      setBoard(prev => hardDrop(prev));
                      playSound('hardDrop');
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full w-14 h-14 flex items-center justify-center"
                    disabled={gameState !== 'playing'}
                  >
                    <FastForward className="w-6 h-6" />
                  </button>
                  <span className="text-xs text-gray-300">Hard Drop</span>
                </div>
                
                <button
                  onClick={() => {
                    setBoard(prev => movePiece(prev, 1, 0));
                    playSound('move');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center"
                  disabled={gameState !== 'playing'}
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
              
              {/* Soft Drop Button */}
              <button
                onClick={() => {
                  setBoard(prev => movePiece(prev, 0, 1));
                  playSound('move');
                }}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full w-16 h-16 flex items-center justify-center"
                disabled={gameState !== 'playing'}
              >
                <ArrowDown className="w-8 h-8" />
              </button>
              
              {/* Hold Button */}
              <button
                onClick={() => {
                  setBoard(prev => holdPiece(prev));
                  playSound('hold');
                }}
                className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 mt-4"
                disabled={gameState !== 'playing' || !board.canHold}
              >
                <SkipForward className="w-4 h-4" />
                Hold Piece
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Tips */}
      <div className="bg-gradient-to-r from-purple-700/20 to-blue-800/20 backdrop-blur-lg rounded-xl border border-gray-600/30 p-6 mb-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          TETRIS TIPS:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Leave Space for I-Piece</h4>
            <p className="text-gray-300 text-sm">
              Always keep at least one column clear for the I-piece to clear Tetris (4 lines at once).
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Use Hold Strategically</h4>
            <p className="text-gray-300 text-sm">
              Hold difficult pieces (like S, Z) for later when you have better placement options.
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Build Flat</h4>
            <p className="text-gray-300 text-sm">
              Keep your stack relatively flat to maximize placement options for all piece types.
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Practice T-Spins</h4>
            <p className="text-gray-300 text-sm">
              T-spins score more points than regular line clears and are essential for high-level play.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .mono-font {
          font-family: 'Courier New', Courier, monospace;
        }
        
        /* Prevent text selection on game controls */
        button {
          user-select: none;
          -webkit-user-select: none;
        }
        
        /* Smooth transitions */
        * {
          transition: background-color 0.2s ease;
        }
      `}</style>
    </div>
  );
}