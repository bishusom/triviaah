// src/components/brainwave/snake/SnakeComponent.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  createGame, 
  updateGame, 
  changeDirection, 
  togglePause, 
  resetGame,
  getSnakeLength,
  getSpeedLevel,
  type SnakeGame,
  type Direction,
  type GameState,
  type Difficulty,
  type GameMode,
  DIFFICULTIES,
  GAME_MODES,
  FOOD_TYPES,
} from '@/lib/retro-games/snake-logic';
import { useSound } from '@/context/SoundContext';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Trophy, 
  Settings, 
  Zap,
  Target,
  Volume2,
  VolumeX,
  Apple,
  Clock,
  TrendingUp,
  Gamepad2,
  Shield,
  Star,
  FastForward
} from 'lucide-react';
import { event } from '@/lib/gtag';

interface SnakeStats {
  gamesPlayed: number;
  highScore: number;
  totalFood: number;
  longestSnake: number;
  maxStreak: number;
  totalTime: number; // in seconds
}

export default function SnakeComponent() {
  const [game, setGame] = useState<SnakeGame>(createGame());
  const [stats, setStats] = useState<SnakeStats>({
    gamesPlayed: 0,
    highScore: 0,
    totalFood: 0,
    longestSnake: 3,
    maxStreak: 0,
    totalTime: 0,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [foodAnimation, setFoodAnimation] = useState<{x: number, y: number, type: string} | null>(null);
  
  const { isMuted, toggleMute } = useSound();
  const animationRef = useRef<number | null>(null);

  // Load stats on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('snake-stats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setStats(parsed);
        setGame(prev => ({ ...prev, highScore: parsed.highScore }));
      } catch (e) {
        console.error('Error loading stats:', e);
      }
    }
  }, []);

  // Save stats when they change
  useEffect(() => {
    localStorage.setItem('snake-stats', JSON.stringify(stats));
  }, [stats]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Enter key to reset (works in any state)
      if (e.key.toLowerCase() === 'enter') {
        // Allow reset if not currently playing
        if (game.gameState !== 'playing') {
          handleReset();
        }
        return;
      }
      
      // Don't process other keys if not playing
      if (game.gameState !== 'playing') return;
      
      let newDirection: Direction | null = null;
      
      switch(e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          e.preventDefault();
          newDirection = 'up';
          break;
        case 'arrowdown':
        case 's':
          e.preventDefault();
          newDirection = 'down';
          break;
        case 'arrowleft':
        case 'a':
          e.preventDefault();
          newDirection = 'left';
          break;
        case 'arrowright':
        case 'd':
          e.preventDefault();
          newDirection = 'right';
          break;
        case ' ':
        case 'escape':
          e.preventDefault();
          handlePause();
          break;
      }
      
      if (newDirection) {
        setGame(prev => changeDirection(prev, newDirection!));
        playSound('move');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game.gameState]);

  // Touch controls for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart || game.gameState !== 'playing') return;
    
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
          setGame(prev => changeDirection(prev, 'right'));
          playSound('move');
        } else {
          // Swipe left
          setGame(prev => changeDirection(prev, 'left'));
          playSound('move');
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipe) {
        if (deltaY > 0) {
          // Swipe down
          setGame(prev => changeDirection(prev, 'down'));
          playSound('move');
        } else {
          // Swipe up
          setGame(prev => changeDirection(prev, 'up'));
          playSound('move');
        }
      } else {
        // Tap - toggle mobile controls
        setShowMobileControls(prev => !prev);
      }
    }
    
    setTouchStart(null);
  }, [touchStart, game.gameState]);

  // Game loop
  useEffect(() => {
    if (game.gameState !== 'playing') {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }
    
    const gameLoop = () => {
      setGame(prev => {
        const newGame = updateGame(prev);
        
        // Check if food was eaten in this update
        const oldFoodCount = prev.food.length;
        const newFoodCount = newGame.food.length;
        
        if (newFoodCount < oldFoodCount) {
          // Food was eaten - find which one
          const eatenFood = prev.food.find(food => 
            !newGame.food.some(f => f.x === food.x && f.y === food.y)
          );
          
          if (eatenFood) {
            playSound(eatenFood.type === 'golden' ? 'golden' : 'eat');
            
            // Trigger animation
            setFoodAnimation({
              x: eatenFood.x,
              y: eatenFood.y,
              type: eatenFood.type
            });
            
            setTimeout(() => setFoodAnimation(null), 500);
          }
        }
        
        return newGame;
      });
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [game.gameState]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && game.gameState === 'playing') {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, game.gameState]);

  // Sound effects
  const playSound = useCallback((soundType: 'move' | 'eat' | 'golden' | 'gameover' | 'start') => {
    if (isMuted) return;
    
    try {
      const sounds = {
        move: '/sounds/snake-move.mp3',
        eat: '/sounds/snake-eat.mp3',
        golden: '/sounds/snake-golden.mp3',
        gameover: '/sounds/snake-gameover.mp3',
        start: '/sounds/snake-start.mp3'
      };
      
      const audio = new Audio(sounds[soundType]);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [isMuted]);

  // Handle game state changes
  useEffect(() => {
    if (game.gameState === 'playing' && !timerActive) {
      setTimerActive(true);
      playSound('start');
      
      event({
        action: 'snake_start',
        category: 'snake',
        label: `${game.difficulty}_${game.mode}`
      });
    }
    
    // @ts-ignore - gameState can be 'gameover' at runtime even though type definition is incomplete
    if (game.gameState === 'gameover') {
      setTimerActive(false);
      playSound('gameover');
      
      // Update stats
      setStats(prev => {
        const newStats = {
          gamesPlayed: prev.gamesPlayed + 1,
          highScore: Math.max(prev.highScore, game.score),
          totalFood: prev.totalFood + game.foodsEaten,
          longestSnake: Math.max(prev.longestSnake, getSnakeLength(game)),
          maxStreak: Math.max(prev.maxStreak, game.streak),
          totalTime: prev.totalTime + time,
        };
        
        event({
          action: 'snake_gameover',
          category: 'snake',
          label: `${game.difficulty}_${game.mode}`,
          value: game.score
        });
        
        return newStats;
      });
    }
    
    // Update game's high score from stats
    if (stats.highScore > game.highScore) {
      setGame(prev => ({ ...prev, highScore: stats.highScore }));
    }
  }, [game.gameState, game.score, game.foodsEaten, game.streak, game.difficulty, game.mode, time]);

  // Game controls
  const handleStart = useCallback(() => {
    setGame(prev => ({ ...prev, gameState: 'playing', lastUpdateTime: Date.now() }));
    setTime(0);
  }, []);

  const handlePause = useCallback(() => {
    setGame(prev => togglePause(prev));
  }, []);

  const handleReset = useCallback(() => {
    setGame(prev => resetGame(prev));
    setTime(0);
    setTimerActive(false);
    
    event({
      action: 'snake_reset',
      category: 'snake',
      label: 'reset'
    });
  }, []);

  const handleDifficultyChange = useCallback((difficulty: Difficulty) => {
    setGame(prev => ({
      ...resetGame(prev),
      difficulty,
      speed: DIFFICULTIES[difficulty].speed,
    }));
    setShowSettings(false);
    
    event({
      action: 'snake_difficulty_change',
      category: 'snake',
      label: difficulty
    });
  }, []);

  const handleModeChange = useCallback((mode: GameMode) => {
    const modeConfig = GAME_MODES[mode];
    setGame(prev => ({
      ...resetGame(prev),
      mode,
      width: modeConfig.width,
      height: modeConfig.height,
    }));
    setShowSettings(false);
    
    event({
      action: 'snake_mode_change',
      category: 'snake',
      label: mode
    });
  }, []);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate snake length
  const snakeLength = getSnakeLength(game);
  const speedLevel = getSpeedLevel(game);

  // Render game grid
  const renderGrid = () => {
    const grid = [];
    
    for (let y = 0; y < game.height; y++) {
      for (let x = 0; x < game.width; x++) {
        // Check what's at this position
        const isSnake = game.snake.some(segment => segment.x === x && segment.y === y);
        const snakeSegment = game.snake.find(segment => segment.x === x && segment.y === y);
        const foodItem = game.food.find(food => food.x === x && food.y === y);
        const isFoodAnimation = foodAnimation && foodAnimation.x === x && foodAnimation.y === y;
        
        let cellClass = 'bg-gray-900';
        let content = null;
        
        if (isSnake && snakeSegment) {
          // Snake segment
          let gradient = '';
          let borderClass = '';
          
          switch(snakeSegment.type) {
            case 'head':
              gradient = 'bg-gradient-to-br from-green-500 to-emerald-700';
              borderClass = 'border-2 border-green-300';
              // Add eyes based on direction
              let eyes = '';
              switch(snakeSegment.direction) {
                case 'up':
                  eyes = 'eyes-top';
                  break;
                case 'down':
                  eyes = 'eyes-bottom';
                  break;
                case 'left':
                  eyes = 'eyes-left';
                  break;
                case 'right':
                  eyes = 'eyes-right';
                  break;
              }
              cellClass = `${gradient} ${borderClass} ${eyes}`;
              break;
            case 'body':
              gradient = 'bg-gradient-to-br from-green-600 to-emerald-800';
              borderClass = 'border border-emerald-900';
              cellClass = `${gradient} ${borderClass}`;
              break;
            case 'tail':
              gradient = 'bg-gradient-to-br from-green-700 to-emerald-900';
              borderClass = 'border border-emerald-950';
              cellClass = `${gradient} ${borderClass}`;
              break;
          }
        } else if (foodItem) {
          // Food item
          const foodConfig = FOOD_TYPES[foodItem.type];
          cellClass = `${foodConfig.color} rounded-full border-2 ${foodItem.type === 'golden' ? 'border-yellow-300' : 'border-white/30'}`;
          
          // Add shine effect for golden food
          if (foodItem.type === 'golden') {
            cellClass += ' animate-pulse';
          } else if (foodItem.type === 'speed') {
            cellClass += ' animate-spin-slow';
          }
        } else if (isFoodAnimation) {
          // Food animation
          cellClass = 'bg-white animate-ping rounded-full';
        } else {
          // Empty cell with grid pattern
          if ((x + y) % 2 === 0) {
            cellClass = 'bg-gray-900';
          } else {
            cellClass = 'bg-gray-800';
          }
        }
        
        grid.push(
          <div
            key={`${x}-${y}`}
            className={`
              w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6
              ${cellClass}
              transition-all duration-150
            `}
            style={{
              gridColumn: x + 1,
              gridRow: y + 1,
            }}
          />
        );
      }
    }
    
    return grid;
  };

  return (
    <div className="relative">
      {/* Game Header */}
      <div className="bg-gradient-to-r from-emerald-700/20 to-green-800/20 backdrop-blur-lg rounded-3xl border border-gray-600/30 p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-3 rounded-2xl">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">SNAKE</h1>
              <p className="text-gray-300 text-sm">Classic Arcade Game</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Score Display */}
            <div className="bg-gray-800/50 rounded-lg px-6 py-3 border border-gray-700">
              <div className="text-center">
                <div className="text-emerald-400 text-sm">SCORE</div>
                <div className="text-white font-bold text-2xl mono-font">{game.score}</div>
              </div>
            </div>
            
            {/* High Score */}
            <div className="bg-gray-800/50 rounded-lg px-6 py-3 border border-gray-700">
              <div className="text-center">
                <div className="text-yellow-400 text-sm">HIGH SCORE</div>
                <div className="text-white font-bold text-2xl mono-font">{stats.highScore}</div>
              </div>
            </div>
            
            {/* Length */}
            <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700">
              <div className="text-center">
                <div className="text-green-400 text-sm">LENGTH</div>
                <div className="text-white font-bold text-xl mono-font">{snakeLength}</div>
              </div>
            </div>
            
            {/* Timer */}
            <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-300" />
                <span className="text-white font-bold text-xl mono-font">{formatTime(time)}</span>
              </div>
            </div>
            
            {/* Control Buttons */}
            <div className="flex gap-2">
              {game.gameState === 'paused' ? (
                <button
                  onClick={handleStart}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-3 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline">Start</span>
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg px-4 py-3 flex items-center gap-2"
                  disabled={(game.gameState as string) === 'gameover'}
                >
                  <Pause className="w-4 h-4" />
                  <span className="hidden sm:inline">Pause</span>
                </button>
              )}
              
              <button
                onClick={handleReset}
                className="bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg px-4 py-3 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg px-4 py-3 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
              </button>
              
              <button
                onClick={toggleMute}
                className="bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg px-3 py-3"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              
              {/* Mobile Controls Toggle */}
              <button
                onClick={() => setShowMobileControls(!showMobileControls)}
                className="bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg px-4 py-3 flex items-center gap-2 lg:hidden"
              >
                <Zap className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Game Status */}
        {game.gameState === 'paused' && !showSettings && (
          <div className="mt-4 bg-blue-500/20 backdrop-blur-lg rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Play className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-bold">PRESS START TO PLAY</span>
            </div>
          </div>
        )}
        
        {/* @ts-ignore - gameState can be 'gameover' at runtime */}
        {game.gameState === 'gameover' && (
          <div className="mt-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-lg rounded-lg p-4 text-center animate-pulse">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-bold">
                GAME OVER! Final Score: {game.score} | Length: {snakeLength}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-700 p-6 mb-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Game Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Game Mode */}
            <div>
              <h4 className="text-gray-300 font-semibold mb-2">Game Mode</h4>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(GAME_MODES).map(([key, mode]) => (
                  <button
                    key={key}
                    onClick={() => handleModeChange(key as GameMode)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      game.mode === key
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-bold mb-1">{mode.name}</div>
                    <div className="text-sm opacity-80">{mode.description}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Difficulty */}
            <div>
              <h4 className="text-gray-300 font-semibold mb-2">Difficulty</h4>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(DIFFICULTIES).map(([key, diff]) => (
                  <button
                    key={key}
                    onClick={() => handleDifficultyChange(key as Difficulty)}
                    className={`p-4 rounded-lg border text-left transition-all capitalize ${
                      game.difficulty === key
                        ? key === 'easy'
                          ? 'bg-green-600 border-green-500 text-white'
                          : key === 'medium'
                          ? 'bg-yellow-600 border-yellow-500 text-white'
                          : 'bg-red-600 border-red-500 text-white'
                        : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-bold mb-1">{key}</div>
                    <div className="text-sm opacity-80">
                      Speed: {diff.speed}ms • Golden: {Math.round(diff.goldenFoodChance * 100)}%
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Controls Guide */}
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-gray-300 font-semibold mb-3">Controls</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <div className="bg-gray-700 rounded px-2 py-1">W / ↑</div>
                <span>Move Up</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <div className="bg-gray-700 rounded px-2 py-1">S / ↓</div>
                <span>Move Down</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <div className="bg-gray-700 rounded px-2 py-1">A / ←</div>
                <span>Move Left</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <div className="bg-gray-700 rounded px-2 py-1">D / →</div>
                <span>Move Right</span>
              </div>
              <div className="col-span-2 flex items-center gap-2 text-gray-300 text-sm">
                <div className="bg-gray-700 rounded px-2 py-1">SPACE</div>
                <span>Pause/Resume</span>
              </div>
              <div className="col-span-2 flex items-center gap-2 text-gray-300 text-sm">
                <div className="bg-gray-700 rounded px-2 py-1">ENTER</div>
                <span>Restart (when game over)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Panel */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center p-3 bg-gray-900/30 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Games Played</div>
            <div className="text-2xl font-bold text-white mono-font">{stats.gamesPlayed}</div>
          </div>
          <div className="text-center p-3 bg-gray-900/30 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Food Eaten</div>
            <div className="text-2xl font-bold text-white mono-font">{stats.totalFood}</div>
          </div>
          <div className="text-center p-3 bg-gray-900/30 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Longest Snake</div>
            <div className="text-2xl font-bold text-white mono-font">{stats.longestSnake}</div>
          </div>
          <div className="text-center p-3 bg-gray-900/30 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Max Streak</div>
            <div className="text-2xl font-bold text-white mono-font">{stats.maxStreak}</div>
          </div>
          <div className="text-center p-3 bg-gray-900/30 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Total Time</div>
            <div className="text-2xl font-bold text-white mono-font">{formatTime(stats.totalTime)}</div>
          </div>
          <div className="text-center p-3 bg-gray-900/30 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Speed Level</div>
            <div className="text-2xl font-bold text-white mono-font">{speedLevel}</div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Game Board */}
        <div className="lg:w-2/3">
          <div 
            className="bg-black/90 backdrop-blur-lg rounded-2xl border-4 border-gray-800 p-4"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="relative mx-auto"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${game.width}, 1fr)`,
                gridTemplateRows: `repeat(${game.height}, 1fr)`,
                gap: '1px',
                width: 'fit-content',
                backgroundColor: '#1a1a1a',
                padding: '2px',
                borderRadius: '4px',
              }}
            >
              {renderGrid()}
            </div>
            
            {/* Desktop Controls Hint */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/70 backdrop-blur-sm rounded-lg px-4 py-2 hidden lg:block">
              <div className="text-gray-300 text-sm">
                Use <span className="text-emerald-400 font-bold">WASD</span> or{' '}
                <span className="text-emerald-400 font-bold">Arrow Keys</span> to move •{' '}
                <span className="text-yellow-400 font-bold">SPACE</span> to pause
              </div>
            </div>
          </div>
        </div>
        
        {/* Side Panel - Food Guide and Controls */}
        <div className="lg:w-1/3 space-y-6">
          {/* Food Guide */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-4">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Apple className="w-4 h-4 text-red-400" />
              FOOD TYPES
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-gray-900/30 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white/30"></div>
                <div>
                  <div className="text-white text-sm font-semibold">Normal Apple</div>
                  <div className="text-gray-400 text-xs">+1 Point • No effect</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-900/30 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-yellow-300 animate-pulse"></div>
                <div>
                  <div className="text-white text-sm font-semibold">Golden Apple</div>
                  <div className="text-gray-400 text-xs">+5 Points • Disappears after 10s</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-900/30 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white/30 animate-spin-slow"></div>
                <div>
                  <div className="text-white text-sm font-semibold">Speed Berry</div>
                  <div className="text-gray-400 text-xs">+3 Points • Speeds up snake for 5s</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Current Game Info */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-4">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              CURRENT GAME
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Mode</span>
                <span className="text-white font-bold">{GAME_MODES[game.mode].name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Difficulty</span>
                <span className={`font-bold capitalize ${
                  game.difficulty === 'easy' ? 'text-green-400' :
                  game.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {game.difficulty}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Speed</span>
                <span className="text-white font-bold">{game.speed}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Streak</span>
                <span className="text-yellow-400 font-bold">{game.streak}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Food on Screen</span>
                <span className="text-white font-bold">{game.food.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Controls Overlay */}
      {showMobileControls && (
        <div className="fixed bottom-20 left-0 right-0 z-50 lg:hidden">
          <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-gray-700 mx-4 p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-white font-bold">Touch Controls</div>
              <button
                onClick={() => setShowMobileControls(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              {/* Up Button */}
              <button
                onClick={() => {
                  setGame(prev => changeDirection(prev, 'up'));
                  playSound('move');
                }}
                className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center"
                disabled={game.gameState !== 'playing'}
              >
                <span className="text-2xl font-bold">↑</span>
              </button>
              
              {/* Middle Row */}
              <div className="flex items-center gap-8">
                <button
                  onClick={() => {
                    setGame(prev => changeDirection(prev, 'left'));
                    playSound('move');
                  }}
                  className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center"
                  disabled={game.gameState !== 'playing'}
                >
                  <span className="text-2xl font-bold">←</span>
                </button>
                
                <div className="flex flex-col items-center">
                  <div className="text-gray-400 text-xs mb-1">Tap or Swipe</div>
                  <div className="text-yellow-400 text-sm">Swipe anywhere to control</div>
                </div>
                
                <button
                  onClick={() => {
                    setGame(prev => changeDirection(prev, 'right'));
                    playSound('move');
                  }}
                  className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center"
                  disabled={game.gameState !== 'playing'}
                >
                  <span className="text-2xl font-bold">→</span>
                </button>
              </div>
              
              {/* Down Button */}
              <button
                onClick={() => {
                  setGame(prev => changeDirection(prev, 'down'));
                  playSound('move');
                }}
                className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center"
                disabled={game.gameState !== 'playing'}
              >
                <span className="text-2xl font-bold">↓</span>
              </button>
              
              {/* Action Buttons */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={game.gameState === 'playing' ? handlePause : handleStart}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg px-4 py-2 flex items-center gap-2"
                >
                  {game.gameState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {game.gameState === 'playing' ? 'Pause' : 'Start'}
                </button>
                
                <button
                  onClick={handleReset}
                  className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Tips */}
      <div className="bg-gradient-to-r from-emerald-700/20 to-green-800/20 backdrop-blur-lg rounded-xl border border-gray-600/30 p-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-yellow-500" />
          SNAKE STRATEGIES:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-emerald-400 mb-2">Plan Your Path</h4>
            <p className="text-gray-300 text-sm">
              Always think 2-3 moves ahead. Leave space to turn around without hitting yourself.
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-emerald-400 mb-2">Use the Edges</h4>
            <p className="text-gray-300 text-sm">
              Move along the walls to safely collect food, then spiral inward when longer.
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-emerald-400 mb-2">Prioritize Golden Apples</h4>
            <p className="text-gray-300 text-sm">
              Golden apples give 5x points but disappear quickly. Go for them when they appear nearby.
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-emerald-400 mb-2">Manage Speed</h4>
            <p className="text-gray-300 text-sm">
              Speed berries make you faster but harder to control. Use them strategically when you have space.
            </p>
          </div>
        </div>
        
        {/* Mode Specific Tips */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
            <h4 className="font-semibold text-blue-400 mb-2">Classic Mode</h4>
            <p className="text-gray-300 text-sm">
              Walls are deadly. Stay away from edges and always leave room to turn around.
            </p>
          </div>
          <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-700/30">
            <h4 className="font-semibold text-purple-400 mb-2">Wrapped Mode</h4>
            <p className="text-gray-300 text-sm">
              Use wrap-around to escape tight spots. You can reappear on the opposite side.
            </p>
          </div>
          <div className="bg-pink-900/20 rounded-lg p-4 border border-pink-700/30">
            <h4 className="font-semibold text-pink-400 mb-2">Portal Mode</h4>
            <p className="text-gray-300 text-sm">
              Hitting walls teleports you randomly. Can be used to escape or find food quickly.
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
          transition: background-color 0.2s ease, transform 0.1s ease;
        }
        
        /* Snake eye styles */
        .eyes-top::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 4px;
        }
        .eyes-top::before {
          content: '';
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          top: 2px;
          right: 4px;
        }
        
        .eyes-bottom::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          bottom: 2px;
          left: 4px;
        }
        .eyes-bottom::before {
          content: '';
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          bottom: 2px;
          right: 4px;
        }
        
        .eyes-left::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          top: 4px;
          left: 2px;
        }
        .eyes-left::before {
          content: '';
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          bottom: 4px;
          left: 2px;
        }
        
        .eyes-right::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          top: 4px;
          right: 2px;
        }
        .eyes-right::before {
          content: '';
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          bottom: 4px;
          right: 2px;
        }
        
        /* Slow spin animation for speed food */
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        @media (max-width: 768px) {
          .grid-cell {
            width: 12px !important;
            height: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}