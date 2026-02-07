// src/components/brainwave/pong/PongComponent.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  createGame, 
  updateGame, 
  movePaddle, 
  togglePause, 
  resetGame,
  type PongGame,
  type GameMode,
  type Difficulty,
  type GameState,
} from '@/lib/retro-games/pong-logic';
import { useSound } from '@/context/SoundContext';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Trophy, 
  Settings, 
  Users,
  User,
  Volume2,
  VolumeX,
  Zap,
  Target,
  Award,
  Gamepad2
} from 'lucide-react';
import { event } from '@/lib/gtag';

interface PongStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  bestScore: number;
  longestRally: number;
  highestWinStreak: number;
}

export default function PongComponent() {
  const [game, setGame] = useState<PongGame>(createGame());
  const [stats, setStats] = useState<PongStats>({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    bestScore: 0,
    longestRally: 0,
    highestWinStreak: 0,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [rallyCount, setRallyCount] = useState(0);
  const [winStreak, setWinStreak] = useState(0);
  const [touchControls, setTouchControls] = useState<{
    left: 'up' | 'down' | null;
    right: 'up' | 'down' | null;
  }>({ left: null, right: null });
  
  const { isMuted, toggleMute } = useSound();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Load stats on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('pong-stats');
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
    localStorage.setItem('pong-stats', JSON.stringify(stats));
  }, [stats]);

  // Keyboard controls
  useEffect(() => {
    const isGameOver = game.leftPaddle.score >= game.winningScore || game.rightPaddle.score >= game.winningScore;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) {
        // Enter to start/restart when game over
        if (e.key === 'Enter') {
          handleReset();
        }
        return;
      }
      
      const newKeys = new Set(keysPressed);
      newKeys.add(e.key.toLowerCase());
      setKeysPressed(newKeys);
      
      // Space to pause/unpause
      if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        handlePause();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const newKeys = new Set(keysPressed);
      newKeys.delete(e.key.toLowerCase());
      setKeysPressed(newKeys);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keysPressed, game.gameState]);

  // Handle key presses for paddle movement
  useEffect(() => {
    if (game.gameState !== 'playing') return;
    
    let newGame = game;
    
    // Player 1 (Left paddle) - W/S keys
    if (keysPressed.has('w')) {
      newGame = movePaddle(newGame, 'left', 'up');
    }
    if (keysPressed.has('s')) {
      newGame = movePaddle(newGame, 'left', 'down');
    }
    
    // Player 2 (Right paddle) - Arrow keys (two-player mode) or AI (single mode)
    if (game.mode === 'two-player') {
      if (keysPressed.has('arrowup')) {
        newGame = movePaddle(newGame, 'right', 'up');
      }
      if (keysPressed.has('arrowdown')) {
        newGame = movePaddle(newGame, 'right', 'down');
      }
    }
    
    if (newGame !== game) {
      setGame(newGame);
    }
  }, [keysPressed, game]);

  // Touch controls
  const handleTouchStart = useCallback((side: 'left' | 'right', direction: 'up' | 'down') => {
    if (game.gameState !== 'playing') return;
    
    setTouchControls(prev => ({ ...prev, [side]: direction }));
    setGame(prev => movePaddle(prev, side, direction));
  }, [game.gameState]);

  const handleTouchEnd = useCallback((side: 'left' | 'right') => {
    setTouchControls(prev => ({ ...prev, [side]: null }));
  }, []);

  // Game loop
  useEffect(() => {
    if (game.gameState !== 'playing') {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }
    
    const gameLoop = () => {
      setGame(prev => updateGame(prev));
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [game.gameState]);

  // Sound effects
  const playSound = useCallback((soundType: 'paddle' | 'wall' | 'score' | 'win' | 'lose') => {
    if (isMuted) return;
    
    try {
      const sounds = {
        paddle: '/sounds/pong-paddle.mp3',
        wall: '/sounds/pong-wall.mp3',
        score: '/sounds/pong-score.mp3',
        win: '/sounds/pong-win.mp3',
        lose: '/sounds/pong-lose.mp3'
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
    // Track rally
    if (game.gameState === 'playing') {
      const ballSpeed = Math.sqrt(
        game.ball.speedX * game.ball.speedX + 
        game.ball.speedY * game.ball.speedY
      );
      
      // Count hits (when ball changes direction significantly)
      if (Math.abs(game.ball.speedX) > 4) {
        setRallyCount(prev => {
          const newCount = prev + 1;
          // Update longest rally stat
          if (newCount > stats.longestRally) {
            setStats(prevStats => ({
              ...prevStats,
              longestRally: newCount
            }));
          }
          return newCount;
        });
      }
    }
    
    // Check for game over
    if (game.gameState === 'gameover') {
      const winner = game.leftPaddle.score > game.rightPaddle.score ? 'left' : 'right';
      const isPlayerWin = winner === 'left' || (winner === 'right' && game.mode === 'two-player');
      
      if (isPlayerWin) {
        playSound('win');
        setWinStreak(prev => {
          const newStreak = prev + 1;
          setStats(prevStats => ({
            ...prevStats,
            wins: prevStats.wins + 1,
            highestWinStreak: Math.max(prevStats.highestWinStreak, newStreak)
          }));
          return newStreak;
        });
      } else {
        playSound('lose');
        setWinStreak(0);
        setStats(prevStats => ({
          ...prevStats,
          losses: prevStats.losses + 1
        }));
      }
      
      setStats(prevStats => ({
        ...prevStats,
        gamesPlayed: prevStats.gamesPlayed + 1,
        bestScore: Math.max(prevStats.bestScore, game.leftPaddle.score)
      }));
      
      event({
        action: 'pong_gameover',
        category: 'pong',
        label: `${game.mode}_${game.difficulty}`,
        value: game.leftPaddle.score
      });
    }
  }, [game.gameState, game.leftPaddle.score, game.rightPaddle.score, game.mode]);

  // Draw game on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    // Left paddle
    const leftGradient = ctx.createLinearGradient(
      game.leftPaddle.x,
      0,
      game.leftPaddle.x + game.leftPaddle.width,
      0
    );
    leftGradient.addColorStop(0, '#3b82f6');
    leftGradient.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = leftGradient;
    ctx.fillRect(
      game.leftPaddle.x,
      game.leftPaddle.y,
      game.leftPaddle.width,
      game.leftPaddle.height
    );
    
    // Right paddle
    const rightGradient = ctx.createLinearGradient(
      game.rightPaddle.x,
      0,
      game.rightPaddle.x + game.rightPaddle.width,
      0
    );
    if (game.mode === 'single') {
      rightGradient.addColorStop(0, '#ef4444');
      rightGradient.addColorStop(1, '#b91c1c');
    } else {
      rightGradient.addColorStop(0, '#10b981');
      rightGradient.addColorStop(1, '#047857');
    }
    ctx.fillStyle = rightGradient;
    ctx.fillRect(
      game.rightPaddle.x,
      game.rightPaddle.y,
      game.rightPaddle.width,
      game.rightPaddle.height
    );
    
    // Draw ball with glow effect
    ctx.save();
    const ballGradient = ctx.createRadialGradient(
      game.ball.x,
      game.ball.y,
      0,
      game.ball.x,
      game.ball.y,
      game.ball.radius * 2
    );
    ballGradient.addColorStop(0, '#ffffff');
    ballGradient.addColorStop(0.5, '#fbbf24');
    ballGradient.addColorStop(1, '#f59e0b');
    
    // Glow effect
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 15;
    ctx.fillStyle = ballGradient;
    ctx.beginPath();
    ctx.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Draw scores
    ctx.font = 'bold 60px "Courier New", monospace';
    ctx.fillStyle = '#3b82f6';
    ctx.textAlign = 'center';
    ctx.fillText(
      game.leftPaddle.score.toString(),
      canvas.width / 4,
      80
    );
    
    ctx.fillStyle = game.mode === 'single' ? '#ef4444' : '#10b981';
    ctx.fillText(
      game.rightPaddle.score.toString(),
      (canvas.width / 4) * 3,
      80
    );
    
    // Draw game state overlay
    if (game.gameState === 'paused') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = 'bold 48px "Courier New", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2 - 30);
      
      ctx.font = '20px "Courier New", monospace';
      ctx.fillStyle = '#cccccc';
      ctx.fillText('Press SPACE to resume', canvas.width / 2, canvas.height / 2 + 30);
    } else if (game.gameState === 'gameover') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const winner = game.leftPaddle.score > game.rightPaddle.score ? 'left' : 'right';
      const winnerText = winner === 'left' ? 'PLAYER WINS!' : 
                        game.mode === 'single' ? 'AI WINS!' : 'PLAYER 2 WINS!';
      
      ctx.font = 'bold 48px "Courier New", monospace';
      ctx.fillStyle = winner === 'left' ? '#3b82f6' : 
                     game.mode === 'single' ? '#ef4444' : '#10b981';
      ctx.textAlign = 'center';
      ctx.fillText(winnerText.toUpperCase(), canvas.width / 2, canvas.height / 2 - 50);
      
      ctx.font = '32px "Courier New", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        `${game.leftPaddle.score} - ${game.rightPaddle.score}`,
        canvas.width / 2,
        canvas.height / 2 + 10
      );
      
      ctx.font = '20px "Courier New", monospace';
      ctx.fillStyle = '#cccccc';
      ctx.fillText('Press ENTER to restart', canvas.width / 2, canvas.height / 2 + 60);
    }
  }, [game]);

  // Game controls
  const handleStart = useCallback(() => {
    setGame(prev => ({ ...prev, gameState: 'playing', lastUpdateTime: Date.now() }));
    event({
      action: 'pong_start',
      category: 'pong',
      label: `${game.mode}_${game.difficulty}`
    });
  }, [game.mode, game.difficulty]);

  const handlePause = useCallback(() => {
    setGame(prev => togglePause(prev));
  }, []);

  const handleReset = useCallback(() => {
    setGame(prev => resetGame(prev));
    setRallyCount(0);
    event({
      action: 'pong_reset',
      category: 'pong',
      label: 'reset'
    });
  }, []);

  const handleModeChange = useCallback((mode: GameMode) => {
    setGame(prev => ({
      ...resetGame(prev),
      mode,
    }));
    setShowSettings(false);
    event({
      action: 'pong_mode_change',
      category: 'pong',
      label: mode
    });
  }, []);

  const handleDifficultyChange = useCallback((difficulty: Difficulty) => {
    setGame(prev => ({
      ...resetGame(prev),
      difficulty,
    }));
    setShowSettings(false);
    event({
      action: 'pong_difficulty_change',
      category: 'pong',
      label: difficulty
    });
  }, []);

  const handleWinningScoreChange = useCallback((score: number) => {
    setGame(prev => ({
      ...resetGame(prev),
      winningScore: score,
    }));
    event({
      action: 'pong_winning_score_change',
      category: 'pong',
      label: score.toString()
    });
  }, []);

  // Format time display (if we had a timer)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      {/* Game Header */}
      <div className="bg-gradient-to-r from-blue-700/20 to-purple-800/20 backdrop-blur-lg rounded-3xl border border-gray-600/30 p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-3 rounded-2xl">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">PONG</h1>
              <p className="text-gray-300 text-sm">Classic Arcade Game</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Score Display */}
            <div className="bg-gray-800/50 rounded-lg px-6 py-3 border border-gray-700">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-blue-400 text-sm">PLAYER</div>
                  <div className="text-white font-bold text-2xl mono-font">{game.leftPaddle.score}</div>
                </div>
                <div className="text-gray-400 text-xl">:</div>
                <div className="text-center">
                  <div className={`text-sm ${game.mode === 'single' ? 'text-red-400' : 'text-green-400'}`}>
                    {game.mode === 'single' ? 'AI' : 'PLAYER 2'}
                  </div>
                  <div className="text-white font-bold text-2xl mono-font">{game.rightPaddle.score}</div>
                </div>
              </div>
            </div>
            
            {/* Rally Counter */}
            <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700">
              <div className="text-center">
                <div className="text-gray-400 text-sm">RALLY</div>
                <div className="text-yellow-400 font-bold text-xl mono-font">{rallyCount}</div>
              </div>
            </div>
            
            {/* Win Streak */}
            <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700">
              <div className="text-center">
                <div className="text-gray-400 text-sm">STREAK</div>
                <div className="text-green-400 font-bold text-xl mono-font">{winStreak}</div>
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
                  disabled={game.gameState === 'gameover'}
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
              <Pause className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-bold">GAME PAUSED - Press SPACE to start</span>
            </div>
          </div>
        )}
        
        {game.gameState === 'gameover' && (
          <div className="mt-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-lg p-4 text-center animate-pulse">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-300 font-bold">
                GAME OVER! Winner: {
                  game.leftPaddle.score > game.rightPaddle.score 
                    ? 'PLAYER' 
                    : game.mode === 'single' ? 'AI' : 'PLAYER 2'
                }
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Game Mode */}
            <div>
              <h4 className="text-gray-300 font-semibold mb-2">Game Mode</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => handleModeChange('single')}
                  className={`flex-1 py-3 rounded-lg border ${
                    game.mode === 'single'
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <User className="w-5 h-5 mb-1" />
                    <span className="text-sm">VS AI</span>
                  </div>
                </button>
                <button
                  onClick={() => handleModeChange('two-player')}
                  className={`flex-1 py-3 rounded-lg border ${
                    game.mode === 'two-player'
                      ? 'bg-green-600 border-green-500 text-white'
                      : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <Users className="w-5 h-5 mb-1" />
                    <span className="text-sm">2 Players</span>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Difficulty */}
            {game.mode === 'single' && (
              <div>
                <h4 className="text-gray-300 font-semibold mb-2">AI Difficulty</h4>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => handleDifficultyChange(diff)}
                      className={`flex-1 py-3 rounded-lg border capitalize ${
                        game.difficulty === diff
                          ? diff === 'easy'
                            ? 'bg-green-600 border-green-500 text-white'
                            : diff === 'medium'
                            ? 'bg-yellow-600 border-yellow-500 text-white'
                            : 'bg-red-600 border-red-500 text-white'
                          : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Winning Score */}
            <div>
              <h4 className="text-gray-300 font-semibold mb-2">Winning Score</h4>
              <div className="flex gap-2">
                {[3, 5, 7, 10].map((score) => (
                  <button
                    key={score}
                    onClick={() => handleWinningScoreChange(score)}
                    className={`flex-1 py-3 rounded-lg border ${
                      game.winningScore === score
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    First to {score}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Controls Guide */}
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-gray-300 font-semibold mb-3">Controls</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-blue-400 font-medium mb-2">Player 1 (Left)</div>
                <div className="flex items-center gap-2 text-gray-300 text-sm mb-1">
                  <div className="bg-gray-700 rounded px-2 py-1">W</div>
                  <span>Move Up</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="bg-gray-700 rounded px-2 py-1">S</div>
                  <span>Move Down</span>
                </div>
              </div>
              {game.mode === 'two-player' && (
                <div>
                  <div className="text-green-400 font-medium mb-2">Player 2 (Right)</div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm mb-1">
                    <div className="bg-gray-700 rounded px-2 py-1">↑</div>
                    <span>Move Up</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <div className="bg-gray-700 rounded px-2 py-1">↓</div>
                    <span>Move Down</span>
                  </div>
                </div>
              )}
              <div className="md:col-span-2">
                <div className="text-gray-300 text-sm">
                  <span className="text-yellow-400">SPACE</span> - Pause/Resume •{' '}
                  <span className="text-yellow-400">ENTER</span> - Restart (when game over)
                </div>
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
            <div className="text-gray-400 text-sm mb-1">Win Rate</div>
            <div className="text-2xl font-bold text-white mono-font">
              {stats.gamesPlayed > 0 
                ? Math.round((stats.wins / stats.gamesPlayed) * 100) 
                : 0}%
            </div>
          </div>
          <div className="text-center p-3 bg-gray-900/30 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Win Streak</div>
            <div className="text-2xl font-bold text-white mono-font">{stats.highestWinStreak}</div>
          </div>
          <div className="text-center p-3 bg-gray-900/30 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Best Score</div>
            <div className="text-2xl font-bold text-white mono-font">{stats.bestScore}</div>
          </div>
          <div className="text-center p-3 bg-gray-900/30 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Longest Rally</div>
            <div className="text-2xl font-bold text-white mono-font">{stats.longestRally}</div>
          </div>
          <div className="text-center p-3 bg-gray-900/30 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Current Streak</div>
            <div className="text-2xl font-bold text-white mono-font">{winStreak}</div>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative mb-6">
        <div className="bg-black/90 backdrop-blur-lg rounded-2xl border-4 border-gray-800 p-4">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full h-auto max-w-full rounded-lg"
          />
        </div>
        
        {/* Desktop Controls Hint */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/70 backdrop-blur-sm rounded-lg px-4 py-2 hidden lg:block">
          <div className="text-gray-300 text-sm">
            Use <span className="text-blue-400 font-bold">W/S</span> for left paddle •{' '}
            {game.mode === 'two-player' && (
              <>
                Use <span className="text-green-400 font-bold">↑/↓</span> for right paddle •{' '}
              </>
            )}
            <span className="text-yellow-400 font-bold">SPACE</span> to pause
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
            
            <div className="flex justify-between items-center">
              {/* Left Paddle Controls */}
              <div className="flex flex-col items-center gap-2">
                <div className="text-blue-400 text-sm">Player</div>
                <div className="flex flex-col gap-2">
                  <button
                    onTouchStart={() => handleTouchStart('left', 'up')}
                    onTouchEnd={() => handleTouchEnd('left')}
                    onMouseDown={() => handleTouchStart('left', 'up')}
                    onMouseUp={() => handleTouchEnd('left')}
                    onMouseLeave={() => handleTouchEnd('left')}
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      touchControls.left === 'up' 
                        ? 'bg-blue-600' 
                        : 'bg-blue-500/80 hover:bg-blue-600'
                    }`}
                    disabled={game.gameState !== 'playing'}
                  >
                    <span className="text-white text-2xl font-bold">↑</span>
                  </button>
                  <button
                    onTouchStart={() => handleTouchStart('left', 'down')}
                    onTouchEnd={() => handleTouchEnd('left')}
                    onMouseDown={() => handleTouchStart('left', 'down')}
                    onMouseUp={() => handleTouchEnd('left')}
                    onMouseLeave={() => handleTouchEnd('left')}
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      touchControls.left === 'down' 
                        ? 'bg-blue-600' 
                        : 'bg-blue-500/80 hover:bg-blue-600'
                    }`}
                    disabled={game.gameState !== 'playing'}
                  >
                    <span className="text-white text-2xl font-bold">↓</span>
                  </button>
                </div>
              </div>
              
              {/* Center Info */}
              <div className="text-center">
                <div className="text-gray-400 text-xs mb-1">Tap & Hold to move</div>
                <div className="text-yellow-400 text-sm">Swipe anywhere to control</div>
              </div>
              
              {/* Right Paddle Controls (for two-player mode) */}
              {game.mode === 'two-player' && (
                <div className="flex flex-col items-center gap-2">
                  <div className="text-green-400 text-sm">Player 2</div>
                  <div className="flex flex-col gap-2">
                    <button
                      onTouchStart={() => handleTouchStart('right', 'up')}
                      onTouchEnd={() => handleTouchEnd('right')}
                      onMouseDown={() => handleTouchStart('right', 'up')}
                      onMouseUp={() => handleTouchEnd('right')}
                      onMouseLeave={() => handleTouchEnd('right')}
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        touchControls.right === 'up' 
                          ? 'bg-green-600' 
                          : 'bg-green-500/80 hover:bg-green-600'
                      }`}
                      disabled={game.gameState !== 'playing'}
                    >
                      <span className="text-white text-2xl font-bold">↑</span>
                    </button>
                    <button
                      onTouchStart={() => handleTouchStart('right', 'down')}
                      onTouchEnd={() => handleTouchEnd('right')}
                      onMouseDown={() => handleTouchStart('right', 'down')}
                      onMouseUp={() => handleTouchEnd('right')}
                      onMouseLeave={() => handleTouchEnd('right')}
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        touchControls.right === 'down' 
                          ? 'bg-green-600' 
                          : 'bg-green-500/80 hover:bg-green-600'
                      }`}
                      disabled={game.gameState !== 'playing'}
                    >
                      <span className="text-white text-2xl font-bold">↓</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Game Tips */}
      <div className="bg-gradient-to-r from-blue-700/20 to-purple-800/20 backdrop-blur-lg rounded-xl border border-gray-600/30 p-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-yellow-500" />
          PONG TIPS:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">Control the Angles</h4>
            <p className="text-gray-300 text-sm">
              Hit the ball with different parts of your paddle to control its angle. 
              The edges create sharper angles that are harder to return.
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">Watch for Patterns</h4>
            <p className="text-gray-300 text-sm">
              AI opponents often follow predictable patterns. Observe their movement 
              style and anticipate where they'll move the ball.
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">Mix Up Your Shots</h4>
            <p className="text-gray-300 text-sm">
              Don't always return the ball to the same spot. Alternate between 
              high and low shots to keep your opponent guessing.
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">Use the Walls</h4>
            <p className="text-gray-300 text-sm">
              Bouncing the ball off the top or bottom wall can create tricky angles 
              that are difficult for opponents to anticipate and return.
            </p>
          </div>
        </div>
        
        {/* Player Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <div className="w-3 h-12 bg-gradient-to-b from-blue-400 to-blue-600 rounded"></div>
            <div>
              <h4 className="font-semibold text-blue-400">Player 1 (Left)</h4>
              <p className="text-gray-300 text-sm">
                Control with <span className="font-bold text-blue-300">W</span> and{' '}
                <span className="font-bold text-blue-300">S</span> keys
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-500/10 to-green-500/10 rounded-lg border border-gray-600">
            <div className="w-3 h-12 bg-gradient-to-b from-red-400 to-green-400 rounded"></div>
            <div>
              <h4 className={`font-semibold ${game.mode === 'single' ? 'text-red-400' : 'text-green-400'}`}>
                {game.mode === 'single' ? 'AI Opponent' : 'Player 2'} (Right)
              </h4>
              <p className="text-gray-300 text-sm">
                {game.mode === 'single' 
                  ? `Difficulty: ${game.difficulty}` 
                  : 'Control with ARROW keys'}
              </p>
            </div>
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
        
        canvas {
          display: block;
          margin: 0 auto;
          max-width: 100%;
          height: auto;
        }
        
        @media (max-width: 768px) {
          canvas {
            height: 60vh;
            max-height: 400px;
          }
        }
      `}</style>
    </div>
  );
}