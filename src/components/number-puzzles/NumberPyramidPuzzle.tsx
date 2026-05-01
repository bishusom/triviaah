'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle2, Trophy, HelpCircle, Delete, XCircle, Timer } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';

interface Cell {
  id: string;
  value: number;
  isHidden: boolean;
  userInput: string;
  isCorrect: boolean | null;
}

const DIFFICULTY_CONFIG = {
  easy: { size: 3, range: 10, hideCount: 3, timeLimit: 45 },
  medium: { size: 4, range: 15, hideCount: 6, timeLimit: 60 },
  hard: { size: 5, range: 20, hideCount: 10, timeLimit: 90 },
};

export default function NumberPyramidPuzzle() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [pyramid, setPyramid] = useState<Cell[][]>([]);
  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_CONFIG[difficulty].timeLimit);
  const [showHelp, setShowHelp] = useState(false);
  const [activeCell, setActiveCell] = useState<{ r: number; c: number } | null>(null);

  const generatePyramid = useCallback((currentDiff?: Difficulty) => {
    const diff = currentDiff || difficulty;
    const { size, range, hideCount } = DIFFICULTY_CONFIG[diff];

    const baseRow = Array.from({ length: size }, () => Math.floor(Math.random() * range) + 1);

    const pyramidData: number[][] = [baseRow];
    for (let r = 1; r < size; r++) {
      const prevRow = pyramidData[r - 1];
      const newRow: number[] = [];
      for (let c = 0; c < prevRow.length - 1; c++) {
        newRow.push(prevRow[c] + prevRow[c + 1]);
      }
      pyramidData.push(newRow);
    }

    const allValues = pyramidData.reverse();
    const newPyramid: Cell[][] = [];

    for (let r = 0; r < size; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < allValues[r].length; c++) {
        row.push({
          id: `${r}-${c}`,
          value: allValues[r][c],
          isHidden: false,
          userInput: '',
          isCorrect: null,
        });
      }
      newPyramid.push(row);
    }

    let hiddenCount = 0;
    while (hiddenCount < hideCount) {
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * newPyramid[r].length);
      if (!newPyramid[r][c].isHidden) {
        newPyramid[r][c].isHidden = true;
        hiddenCount++;
      }
    }

    setPyramid(newPyramid);
    setIsWon(false);
    setIsGameOver(false);
    setTimeLeft(DIFFICULTY_CONFIG[diff].timeLimit);
    setActiveCell(null);
  }, [difficulty]);

  useEffect(() => {
    generatePyramid();
  }, [generatePyramid]);

  useEffect(() => {
    if (isWon || isGameOver || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameOver(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isWon, isGameOver, timeLeft]);

  const handleInputChange = (r: number, c: number, val: string) => {
    if (isWon || isGameOver) return;
    const newPyramid = [...pyramid];
    const numVal = parseInt(val, 10);

    newPyramid[r][c] = {
      ...newPyramid[r][c],
      userInput: val,
      isCorrect: isNaN(numVal) ? null : numVal === newPyramid[r][c].value,
    };

    setPyramid(newPyramid);
    checkWinCondition(newPyramid);
  };

  const handleKeyPress = (key: string) => {
    if (!activeCell || isWon || isGameOver) return;
    const { r, c } = activeCell;
    const currentVal = pyramid[r][c].userInput;

    if (key === 'DELETE') {
      handleInputChange(r, c, currentVal.slice(0, -1));
    } else if (key === 'CLEAR') {
      handleInputChange(r, c, '');
    } else {
      // Limit to 3 digits
      if (currentVal.length < 3) {
        handleInputChange(r, c, currentVal + key);
      }
    }
  };

  const checkWinCondition = (currentPyramid: Cell[][]) => {
    for (const row of currentPyramid) {
      for (const cell of row) {
        if (cell.isHidden && (!cell.userInput || !cell.isCorrect)) {
          return;
        }
      }
    }
    setIsWon(true);
    setActiveCell(null);
  };

  const changeDifficulty = (newDiff: Difficulty) => {
    setDifficulty(newDiff);
    generatePyramid(newDiff);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 font-sans text-slate-200">
      <div className="max-w-2xl w-full bg-[#0a0a0a] p-6 sm:p-8 rounded-3xl shadow-2xl border border-blue-500/20 backdrop-blur-sm relative overflow-hidden">

        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Number Pyramid
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-slate-400 text-sm">Fill in the missing numbers!</p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-3">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-md border transition-all duration-300 ${timeLeft < 10
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse'
              : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
              }`}>
              <Timer className={`w-5 h-5 ${timeLeft < 10 ? 'animate-bounce' : ''}`} />
              <span className="text-2xl font-black tabular-nums">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-white/5 transition-colors"
                title="How to play"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => generatePyramid()}
                className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-colors"
                title="New Puzzle"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="flex gap-2 mb-10 bg-black/40 p-1.5 rounded-2xl border border-white/5 w-fit mx-auto">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => changeDifficulty(diff)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${difficulty === diff
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {showHelp && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 bg-blue-900/20 rounded-2xl border border-blue-500/20 text-sm leading-relaxed text-blue-100"
          >
            <strong className="text-blue-400">How to Play:</strong> Each block contains a number that is the sum of the two blocks directly below it. Tap a block and use the number pad to fill it in!
          </motion.div>
        )}

        <div className="flex flex-col items-center gap-2 mb-12">
          {pyramid.map((row, rIndex) => (
            <div key={rIndex} className="flex gap-2">
              {row.map((cell, cIndex) => {
                const isActive = activeCell?.r === rIndex && activeCell?.c === cIndex;
                return (
                  <div key={cell.id} className="relative">
                    {cell.isHidden ? (
                      <button
                        onClick={() => !isWon && !isGameOver && setActiveCell({ r: rIndex, c: cIndex })}
                        className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-base sm:text-xl font-bold rounded-xl border-2 transition-all outline-none ${isActive
                          ? 'bg-[#cce0ff] border-blue-500 text-black shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                          : cell.userInput
                            ? cell.isCorrect
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                              : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                            : 'bg-[#e6f2ff] border-[#31567f] text-black hover:bg-[#d8ebff]'
                          }`}
                      >
                        {cell.userInput}
                      </button>
                    ) : (
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-base sm:text-xl font-black rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-300/25 text-white shadow-[0_8px_18px_rgba(7,89,133,0.22)] ${cell.value > 99 ? 'text-xs sm:text-sm' : ''}`}>
                        {cell.value}
                      </div>
                    )}
                    {cell.isHidden && cell.userInput && cell.isCorrect && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1.5 -right-1.5 text-emerald-400 bg-black rounded-full"
                      >
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Custom Number Pad */}
        <AnimatePresence>
          {!isWon && !isGameOver && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 max-w-sm mx-auto"
            >
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeyPress(num.toString())}
                    className="h-12 sm:h-14 rounded-md bg-slate-800/40 border border-white/5 text-xl font-bold text-white hover:bg-blue-600/20 hover:border-blue-500/40 active:scale-95 transition-all"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => handleKeyPress('CLEAR')}
                  className="h-12 sm:h-14 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 active:scale-95 transition-all flex items-center justify-center"
                  title="Clear All"
                >
                  <XCircle className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleKeyPress('0')}
                  className="h-12 sm:h-14 rounded-xl bg-slate-800/40 border border-white/5 text-xl font-bold text-white hover:bg-blue-600/20 hover:border-blue-500/40 active:scale-95 transition-all"
                >
                  0
                </button>
                <button
                  onClick={() => handleKeyPress('DELETE')}
                  className="h-12 sm:h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 active:scale-95 transition-all flex items-center justify-center"
                  title="Backspace"
                >
                  <Delete className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 border border-blue-500/20 rounded-3xl flex flex-col items-center justify-center gap-4 mt-8"
          >
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 mb-2 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <Trophy className="w-10 h-10" />
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Pyramid Conquered!</h3>
              <p className="text-blue-400/80 font-medium tracking-wide uppercase text-xs">Master of {difficulty} Math</p>
            </div>
            <button
              onClick={() => generatePyramid()}
              className="mt-4 px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl transition-all shadow-xl shadow-blue-600/30 active:scale-95"
            >
              New Challenge
            </button>
          </motion.div>
        )}

        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-rose-950/20 border border-rose-500/20 rounded-3xl flex flex-col items-center justify-center gap-4 mt-8"
          >
            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-400 mb-2 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
              <XCircle className="w-10 h-10" />
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Time's Up!</h3>
              <p className="text-rose-400/80 font-medium tracking-wide uppercase text-xs">The pyramid remains a mystery</p>
            </div>
            <button
              onClick={() => generatePyramid()}
              className="mt-4 px-10 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl transition-all shadow-xl shadow-rose-600/30 active:scale-95"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

