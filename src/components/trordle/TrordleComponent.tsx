'use client';

import { useState, useEffect, useRef } from 'react';
import { checkTrordleGuess, TrordleData, TrordleGuessResult } from '@/lib/trordle-logic';
import { addTrordleResult } from '@/lib/trordle-fb';
import confetti from 'canvas-confetti';
import { event } from '@/lib/gtag';

interface TrordleComponentProps {
  initialData: TrordleData;
}

export default function TrordleComponent({ initialData }: TrordleComponentProps) {
  const [puzzleData, setPuzzleData] = useState(initialData);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<TrordleGuessResult[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shareMessage, setShareMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showLastGuess, setShowLastGuess] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Sound effects
  const correctSound = useRef<HTMLAudioElement | null>(null);
  const incorrectSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);
  const loseSound = useRef<HTMLAudioElement | null>(null);
  const clickSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize sound effects
    correctSound.current = new Audio('/sounds/correct.mp3');
    incorrectSound.current = new Audio('/sounds/incorrect.mp3');
    winSound.current = new Audio('/sounds/win.mp3');
    loseSound.current = new Audio('/sounds/lose.mp3');
    clickSound.current = new Audio('/sounds/click.mp3');

    return () => {
      [correctSound, incorrectSound, winSound, loseSound, clickSound].forEach(sound => {
        sound.current?.pause();
      });
    };
  }, []);

  const playSound = (soundType: 'correct' | 'incorrect' | 'win' | 'lose' | 'click') => {
    try {
      switch(soundType) {
        case 'correct':
          correctSound.current?.play();
          break;
        case 'incorrect':
          incorrectSound.current?.play();
          break;
        case 'win':
          winSound.current?.play();
          break;
        case 'lose':
          loseSound.current?.play();
          break;
        case 'click':
          clickSound.current?.play();
          break;
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  useEffect(() => {
    const savedProgress = localStorage.getItem(`trordle-${puzzleData.id}`);
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setAttempts(progress.attempts || []);
        setGameState(progress.gameState || 'playing');
      } catch (e) {
        console.error('Error loading saved progress:', e);
      }
    }
  }, [puzzleData.id]);

  useEffect(() => {
    if (attempts.length > 0 || gameState !== 'playing') {
      localStorage.setItem(`trordle-${puzzleData.id}`, JSON.stringify({
        attempts,
        gameState
      }));
    }
  }, [attempts, gameState, puzzleData.id]);

  // Add analytics event for game start
  useEffect(() => {
    event({action: 'trordle_started', category: 'trordle', label: 'trordle'});
  }, []);

  const triggerConfetti = () => {
    if (confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true
      });
      
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => myConfetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } }), 250);
      setTimeout(() => myConfetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } }), 400);
    }
  };

  const handleGuess = (option: string) => {
    if (gameState !== 'playing' || attempts.length >= 6) return;
    
    setSelectedOption(option);
    playSound('click');
    
    setTimeout(() => {
      const result = checkTrordleGuess(option, puzzleData);
      const newAttempts = [...attempts, result];
      setAttempts(newAttempts);
      setShowLastGuess(true);
      
      setTimeout(() => setShowLastGuess(false), 800);
      
      if (result.isCorrect) {
        setGameState('won');
        triggerConfetti();
        playSound('win');
        addTrordleResult(puzzleData.id, true, newAttempts.length);
        // Analytics event for winning
        event({
          action: 'trordle_won',
          category: 'trordle',
          label: `attempts_${newAttempts.length}`,
          value: newAttempts.length
        });
      } else if (newAttempts.length >= 6) {
        setGameState('lost');
        playSound('lose');
        addTrordleResult(puzzleData.id, false, 6);
        // Analytics event for losing
        event({
          action: 'trordle_lost',
          category: 'trordle',
          label: 'max_attempts'
        });
      } else {
        // Play correct/incorrect sound based on if any attributes are correct/partial
        const hasCorrectOrPartial = result.attributes.some(attr => 
          attr.status === 'correct' || attr.status === 'partial'
        );
        if (hasCorrectOrPartial) {
          playSound('correct');
        } else {
          playSound('incorrect');
        }
      }
      
      setSelectedOption(null);
    }, 500);
  };

  const generateShareMessage = () => {
    if (gameState !== 'won' && gameState !== 'lost') return '';
    
    const puzzleNumber = Math.floor((new Date().getTime() - new Date(2024, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
    let shareText = `Trordle #${puzzleNumber} ${gameState === 'won' ? attempts.length : 'X'}/6\n\n`;
    
    attempts.forEach(attempt => {
      attempt.attributes.forEach(attr => {
        if (attr.status === 'correct') {
          shareText += '🟩';
        } else if (attr.status === 'partial') {
          shareText += '🟨';
        } else {
          shareText += '⬜';
        }
      });
      shareText += '\n';
    });
    
    shareText += '\nPlay daily at triviaah.com/daily/trordle';
    return shareText;
  };

  const copyToClipboard = () => {
    const text = generateShareMessage();
    navigator.clipboard.writeText(text).then(() => {
      setShareMessage('Copied to clipboard!');
      setTimeout(() => setShareMessage(''), 2000);
      playSound('click');
    });
  };

  const resetGame = () => {
    setAttempts([]);
    setGameState('playing');
    setSelectedOption(null);
    setShowHistory(false);
    setShowLastGuess(false);
    localStorage.removeItem(`trordle-${puzzleData.id}`);
    playSound('click');
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    playSound('click');
  };

  const getDotColor = (attempt: TrordleGuessResult) => {
    if (attempt.isCorrect) return 'bg-green-500';
    if (attempt.attributes.some(attr => attr.status === 'partial')) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const triesLeft = 6 - attempts.length;
  const triesLeftColor = triesLeft >= 4 ? 'text-green-600' : triesLeft >= 2 ? 'text-amber-600' : 'text-red-600';

  const availableOptions = puzzleData.options.filter(
    option => !attempts.some(attempt => attempt.guess === option)
  );

  return (
    <div className="trordle-container relative flex flex-col min-h-[calc(100vh-4rem)]">
      <canvas 
        ref={confettiCanvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      />
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Today&apos;s Category: {puzzleData.category}</h2>
          <div className={`text-base font-bold ${triesLeftColor}`}>
            {triesLeft} {triesLeft === 1 ? 'try' : 'tries'} left
          </div>
        </div>
        
        <p className="text-lg mb-6">{puzzleData.question}</p>
        
        {/* Collapsible Attempt History */}
        {attempts.length > 0 && (
          <div className="mb-6">
            <button 
              onClick={toggleHistory}
              className="text-blue-500 hover:text-blue-700 font-semibold mb-2"
            >
              {showHistory ? 'Hide Guesses' : 'Show Your Guesses'}
            </button>
            <div className="flex gap-2 mb-3">
              {[...Array(6)].map((_, index) => (
                <button
                  key={index}
                  onClick={toggleHistory}
                  className={`w-4 h-4 rounded-full ${
                    index < attempts.length 
                      ? getDotColor(attempts[index])
                      : 'bg-gray-300'
                  }`}
                  title={index < attempts.length ? `Guess ${index + 1}` : 'Unused attempt'}
                />
              ))}
            </div>
            {(showHistory || showLastGuess) && (
              <div className="space-y-4">
                {(showLastGuess ? attempts.slice(-1) : attempts).slice().reverse().map((attempt, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="font-medium mb-2">{attempt.guess}</div>
                    <div className="grid grid-cols-1 gap-2">
                      {attempt.attributes.map((attr, attrIndex) => (
                        <div 
                          key={attrIndex} 
                          className={`p-2 rounded-md border ${
                            attr.status === 'correct' 
                              ? 'bg-green-100 border-green-400 text-green-800' 
                              : attr.status === 'partial' 
                              ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                              : 'bg-gray-100 border-gray-300 text-gray-600'
                          }`}
                        >
                          <div className="text-xs font-semibold mb-1">{attr.name}:</div>
                          <div className="text-sm">{attr.value}</div>
                          <div className="text-xs mt-1">
                            {attr.status === 'correct' ? '🟩 Exact match' : 
                             attr.status === 'partial' ? '🟨 Partial match' : 
                             '⬜ No match'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Game result message */}
        {gameState === 'won' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Congratulations! 🎉</h3>
            <p>You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Game Over</h3>
            <p>The answer was: <strong>{puzzleData.answer}</strong></p>
          </div>
        )}
      </div>
      
      {/* Sticky Answer Options */}
      {gameState === 'playing' && (
        <div className="trordle-options-container sticky bottom-4 bg-white rounded-lg shadow-md p-4 z-10">
          <div className="trordle-grid">
            {availableOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleGuess(option)}
                disabled={selectedOption === option}
                className={`trordle-option ${selectedOption === option ? 'selected' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Share results */}
      {(gameState === 'won' || gameState === 'lost') && (
        <div className="mt-6 text-center bg-white rounded-lg shadow-md p-6">
          <button
            onClick={copyToClipboard}
            className="btn primary mb-4"
          >
            Share Results
          </button>
          {shareMessage && (
            <div className="mt-2 text-green-600">{shareMessage}</div>
          )}
          
          <div className="trordle-share-grid">
            {attempts.flatMap(attempt => 
              attempt.attributes.map((attr, i) => (
                <div key={`${attempt.guess}-${i}`} className={`trordle-share-cell ${attr.status}`}>
                  {attr.status === 'correct' ? '✓' : attr.status === 'partial' ? '~' : '✗'}
                </div>
              ))
            )}
            {[...Array(6 - attempts.length)].flatMap((_, attemptIndex) => 
              [...Array(5)].map((_, attrIndex) => (
                <div key={`empty-${attemptIndex}-${attrIndex}`} className="trordle-share-cell incorrect">
                  ?
                </div>
              ))
            )}
          </div>
          
          <button
            onClick={resetGame}
            className="mt-4 text-blue-500 hover:text-blue-700 underline"
          >
            Play Again
          </button>
        </div>
      )}
      
      {/* How to Play section */}
      <div className="bg-gray-100 rounded-lg p-4 mt-6">
        <h3 className="font-bold mb-2">How to Play:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Guess the answer to the trivia question in 6 tries</li>
          <li>Click the colored dots or &quot;Show Your Guesses&quot; to view your guesses</li>
          <li>🟩 Green: This attribute is exactly correct</li>
          <li>🟨 Yellow: This attribute is partially correct or related</li>
          <li>⬜ Gray: This attribute is incorrect</li>
        </ul>
      </div>
    </div>
  );
}