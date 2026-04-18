'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { event } from '@/lib/gtag';
import { useSound } from '@/context/SoundContext';
import { BookOpen, Target, Sparkles, Home, Brain } from 'lucide-react';
import Link from 'next/link';
import {
  getDailyCryptogramQuote,
  getRandomCryptogramQuote,
} from '@/lib/word-games/cryptogram-sb';

// Helper: check if character is a letter
const isLetter = (c: string) => /[a-zA-Z]/.test(c);

const FALLBACK_QUOTES = [
  { text: "THE ONLY WAY TO DO GREAT WORK IS TO LOVE WHAT YOU DO", sourceLabel: 'Quote by', sourceValue: 'STEVE JOBS' },
  { text: "IN THE MIDDLE OF EVERY DIFFICULTY LIES OPPORTUNITY", sourceLabel: 'Quote by', sourceValue: 'ALBERT EINSTEIN' },
  { text: "BELIEVE YOU CAN AND YOU'RE HALFWAY THERE", sourceLabel: 'Quote by', sourceValue: 'THEODORE ROOSEVELT' },
  { text: "IT DOES NOT MATTER HOW SLOWLY YOU GO AS LONG AS YOU DO NOT STOP", sourceLabel: 'Quote by', sourceValue: 'CONFUCIUS' },
  { text: "THE FUTURE BELONGS TO THOSE WHO BELIEVE IN THE BEAUTY OF THEIR DREAMS", sourceLabel: 'Quote by', sourceValue: 'ELEANOR ROOSEVELT' }
];

type DisplayPuzzle = {
  text: string;
  sourceLabel: string;
  sourceValue: string;
};

export default function CryptogramGame() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [activeQuote, setActiveQuote] = useState<DisplayPuzzle | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(true);
  const { isMuted } = useSound();
  
  const [cipherMap, setCipherMap] = useState<Record<string, string>>({});
  const [userMapping, setUserMapping] = useState<Record<string, string>>({}); // cipher -> plain user guess
  const [selectedCipherLetter, setSelectedCipherLetter] = useState<string | null>(null);
  
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [hintsUsed, setHintsUsed] = useState(0);
  
  // Animation states
  const [isAnimatingIntro, setIsAnimatingIntro] = useState(true);
  const [animFrames, setAnimFrames] = useState<string>('');
  
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Sound utilities
  const playSound = useCallback((soundType: 'correct' | 'incorrect' | 'win' | 'lose' | 'click') => {
    if (isMuted) return;
    try {
      const sounds = {
        correct: '/sounds/correct.mp3',
        incorrect: '/sounds/incorrect.mp3',
        win: '/sounds/win.mp3',
        lose: '/sounds/lose.mp3',
        click: '/sounds/click.mp3'
      };
      const audio = new Audio(sounds[soundType]);
      audio.play().catch(() => {});
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [isMuted]);

  // Initialize game
  const initGame = useCallback(async (useRandomPuzzle = false) => {
    setIsLoadingQuote(true);
    let rawQuote: DisplayPuzzle | null = null;
    try {
        const fetched = useRandomPuzzle
          ? await getRandomCryptogramQuote()
          : await getDailyCryptogramQuote();

        if (fetched && fetched.targetQuote) {
            rawQuote = {
              text: fetched.targetQuote.toUpperCase(),
              sourceLabel: fetched.sourceLabel,
              sourceValue: fetched.sourceValue,
            };
        }
    } catch (e) {
        console.error('Failed to fetch quote', e);
    }

    if (!rawQuote) {
        rawQuote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    }
    
    setActiveQuote(rawQuote);

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    const newCipherMap: Record<string, string> = {};
    
    // Ensure no letter maps to itself (optional but good for cryptograms)
    for (let i = 0; i < 26; i++) {
        // simple shuffle, could result in self-mapping occasionally, but acceptable for this demo
      newCipherMap[letters[i]] = shuffled[i]; 
    }
    
    setCipherMap(newCipherMap);
    setUserMapping({});
    setSelectedCipherLetter(null);
    setGameState('playing');
    setHintsUsed(0);
    setIsAnimatingIntro(true);
    setAnimFrames(rawQuote.text.replace(/[A-Z]/g, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]));

    setIsLoadingQuote(false);

    // Rapid Encryption Animation
    let startTime: number | null = null;
    const duration = 1500; // 1.5 seconds animation
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      if (elapsed < duration) {
        // Scramble letters
        setAnimFrames(
          rawQuote.text.split('').map((char: string) => {
            if (isLetter(char)) {
              return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
            }
            return char;
          }).join('')
        );
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Settle on cipher
        setIsAnimatingIntro(false);
        setAnimFrames('');
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Check win condition
  useEffect(() => {
    if (gameState !== 'playing' || isAnimatingIntro || !activeQuote) return;
    
    const isWin = activeQuote.text.split('').every(char => {
      if (!isLetter(char)) return true;
      const cipherChar = cipherMap[char];
      return userMapping[cipherChar] === char;
    });

    if (isWin) {
      setGameState('won');
      playSound('win');
      if (confettiCanvasRef.current) {
        confetti.create(confettiCanvasRef.current, { resize: true, useWorker: true })({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
      }
    }
  }, [userMapping, activeQuote, cipherMap, gameState, isAnimatingIntro, playSound]);

  // Handle keypress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || isAnimatingIntro || !selectedCipherLetter) return;
      
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        handleLetterMapping(selectedCipherLetter, key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        const newMapping = { ...userMapping };
        delete newMapping[selectedCipherLetter];
        setUserMapping(newMapping);
        playSound('click');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCipherLetter, gameState, isAnimatingIntro, userMapping, playSound]);

  const handleLetterMapping = (cipherLetter: string, plainLetter: string) => {
    playSound('click');
    setUserMapping(prev => {
        // Remove this plain letter if already mapped elsewhere to avoid duplicates
        const updated = { ...prev };
        for (const key in updated) {
            if (updated[key] === plainLetter) {
                delete updated[key];
            }
        }
        updated[cipherLetter] = plainLetter;
        return updated;
    });
    
    // Auto advance to next unfilled (optional ux improvement)
    setSelectedCipherLetter(null);
  };

  const useHint = () => {
    if (gameState !== 'playing' || !activeQuote) return;
    
    // Find an unmapped or incorrectly mapped letter
    for (let i = 0; i < activeQuote.text.length; i++) {
        const plainChar = activeQuote.text[i];
        if (isLetter(plainChar)) {
            const cipherChar = cipherMap[plainChar];
            if (userMapping[cipherChar] !== plainChar) {
                handleLetterMapping(cipherChar, plainChar);
                setHintsUsed(prev => prev + 1);
                return;
            }
        }
    }
  };

  const nextLevel = () => {
    setCurrentLevel(prev => prev + 1);
    initGame(true);
  };
  
  const resetGame = () => {
    initGame();
  };

  const getEncryptedText = () => {
    if (!activeQuote) return [];
    return activeQuote.text.split('').map(char => {
      if (isLetter(char)) return cipherMap[char];
      return char;
    });
  };

  // Keyboard layout
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-4 md:p-6 flex flex-col items-center justify-center relative">
      <canvas ref={confettiCanvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-10" />

      <div className="w-full max-w-4xl mx-auto z-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-cyan-400" /> Cryptogram
            </h1>
            <div className="text-sm md:text-base text-gray-300 mt-1">
              Level: {currentLevel} {activeQuote ? <span>| <span className="text-amber-400 font-semibold">{activeQuote.sourceLabel}</span>: <span className="text-amber-300">{activeQuote.sourceValue}</span></span> : ''}
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="bg-gray-900/80 px-4 py-2 rounded-lg border border-gray-700 font-mono text-lg">
              Hints: {hintsUsed}
            </div>
          </div>
        </div>

        {/* Puzzle Grid */}
        <div className="bg-gray-800/30 rounded-2xl p-6 md:p-8 mb-6 backdrop-blur-sm border border-gray-700/50 min-h-64 flex flex-col justify-center">
          {isLoadingQuote ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
               <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-cyan-300 font-mono animate-pulse">Fetching encrypted puzzle...</p>
            </div>
          ) : isAnimatingIntro ? (
             // Animating encryption
            <div className="flex flex-wrap justify-center gap-y-6 gap-x-2">
              {animFrames.split('').map((char, index) => {
                if (char === ' ') return <div key={index} className="w-6 h-10 mx-2"></div>;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-8 h-10 bg-gray-700/80 border-b-2 border-cyan-400 rounded-t flex items-center justify-center text-xl font-bold font-mono text-gray-300">
                        {char}
                    </div>
                    <div className="text-gray-500 font-mono text-xs mt-1">-</div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Playable Grid
            <div className="flex flex-wrap justify-center gap-y-6 gap-x-2">
              {getEncryptedText().map((cipherChar, index) => {
                if (cipherChar === ' ') return <div key={index} className="w-6 h-10 mx-2"></div>;
                if (!isLetter(cipherChar)) {
                    return (
                        <div key={index} className="flex flex-col items-center justify-center h-10">
                            <span className="text-2xl text-gray-300">{cipherChar}</span>
                        </div>
                    );
                }

                const mappedPlain = userMapping[cipherChar];
                const isSelected = selectedCipherLetter === cipherChar;
                const isCorrect = activeQuote ? mappedPlain === activeQuote.text[index] : false;

                let bgClass = "bg-gray-700/50 text-white";
                if (isSelected) bgClass = "bg-cyan-600/50 ring-2 ring-cyan-400";
                else if (mappedPlain) {
                    if (isCorrect) bgClass = "bg-green-600/60 border-b-2 border-green-500 text-white";
                    else bgClass = "bg-red-600/60 border-b-2 border-red-500 text-white";
                }
                
                // Final reveal styles
                if (gameState === 'won') {
                    bgClass = "bg-green-500 border-green-400 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)] transform scale-105 transition-all duration-300";
                }

                return (
                  <div key={index} className="flex flex-col items-center">
                    <button
                      onClick={() => setSelectedCipherLetter(cipherChar)}
                      className={`w-8 h-10 border-b-2 ${gameState === 'won' ? 'border-green-400' : 'border-gray-500'} rounded-t flex items-center justify-center text-xl font-bold font-mono transition-all duration-200 ${bgClass}`}
                    >
                      {gameState === 'won' && activeQuote ? activeQuote.text[index] : (mappedPlain || '')}
                    </button>
                    <div className={`font-mono text-sm mt-1 font-bold ${selectedCipherLetter === cipherChar ? 'text-cyan-400' : 'text-gray-400'}`}>
                        {cipherChar}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          {gameState === 'playing' && !isAnimatingIntro && (
              <div className="flex justify-center gap-4 mt-10">
                 <button 
                  onClick={resetGame}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                >
                  Restart
                </button>
                <button 
                  onClick={useHint}
                  className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold rounded-xl transition-all shadow-lg"
                >
                  Hint
                </button>
              </div>
          )}
        </div>

        {/* Win State Overlay */}
        {gameState === 'won' && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 mb-6 text-center animate-fade-in-up">
            <h3 className="text-3xl font-bold text-white mb-2 py-2 drop-shadow-lg flex items-center justify-center gap-2">
                <Sparkles className="w-8 h-8 text-yellow-400" />
                Puzzle Decrypted!
            </h3>
            {activeQuote && (
                <p className="text-xl text-gray-200 mb-6 italic">"{activeQuote.text}" <br/><span className="text-cyan-400 not-italic">— {activeQuote.sourceValue}</span></p>
            )}
            <button 
              onClick={nextLevel}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xl shadow-[0_0_15px_rgba(6,182,212,0.5)] transform hover:scale-105 transition-all"
            >
              New Puzzle
            </button>
          </div>
        )}

        {/* On-screen Keyboard */}
        {gameState === 'playing' && !isAnimatingIntro && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-4">
            <h3 className="text-gray-400 text-sm mb-3">
                {selectedCipherLetter 
                    ? <span>Map letter for cipher <strong className="text-cyan-400 text-lg uppercase">{selectedCipherLetter}</strong>:</span> 
                    : "Select a cipher letter in the puzzle to map it"}
            </h3>
            <div className="space-y-2">
              {keyboardRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1.5 md:gap-2">
                  {row.map(letter => {
                    const mappedCipher = Object.keys(userMapping).find(k => userMapping[k] === letter);
                    const isUsed = !!mappedCipher;
                    const isUsedCorrect = isUsed ? cipherMap[letter] === mappedCipher : false;

                    return (
                      <button
                        key={letter}
                        onClick={() => {
                          if (selectedCipherLetter) handleLetterMapping(selectedCipherLetter, letter);
                        }}
                        disabled={!selectedCipherLetter}
                        className={`
                          relative w-10 h-12 md:w-12 md:h-14 rounded-lg font-bold text-lg transition-all duration-200
                          ${selectedCipherLetter && !isUsed
                            ? 'bg-gradient-to-br from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white shadow-md'
                            : isUsed
                              ? (isUsedCorrect ? 'bg-green-900/60 text-green-300 border border-green-500/50' : 'bg-red-900/60 text-red-300 border border-red-500/50')
                              : 'bg-gray-700 text-gray-400'
                          }
                          ${!selectedCipherLetter ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {letter}
                        {isUsed && (
                            <span className={`absolute -top-1 -right-1 text-[10px] rounded-full w-4 h-4 flex items-center justify-center border ${isUsedCorrect ? 'bg-green-900 text-green-300 border-green-500' : 'bg-red-900 text-red-300 border-red-500'}`}>
                                {mappedCipher.toUpperCase()}
                            </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
              <div className="flex justify-center mt-2">
                 <button
                    onClick={() => {
                        if (selectedCipherLetter && userMapping[selectedCipherLetter]) {
                            const newMapping = { ...userMapping };
                            delete newMapping[selectedCipherLetter];
                            setUserMapping(newMapping);
                            playSound('click');
                        }
                    }}
                    disabled={!selectedCipherLetter || !userMapping[selectedCipherLetter]}
                    className="flex justify-center items-center w-24 h-12 md:h-14 bg-gray-700 text-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
                  >
                      DEL
                  </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
