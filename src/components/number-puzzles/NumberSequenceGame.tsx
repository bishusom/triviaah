"use client";
import { event } from '@/lib/gtag';
import React, { useEffect, useState, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import { useSound } from '@/context/SoundContext';

type OptionState = {
  value: number;
  disabled: boolean;
  className: string;
};

type GameState = {
  currentSequence: number[];
  options: OptionState[];
  sequenceDisplay: React.ReactElement[];
  correctAnswer: number;
  level: number;
  score: number;
  puzzlesSolved: number;
  timeLeft: number;
  description: string;
  feedbackText: string;
  feedbackClass: string;
  hintText: string;
};

type SequenceType = {
  sequence: number[];
  answer: number;
  description: string;
};

type OptionProps = {
  children: number;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

const OptionButton: React.FC<OptionProps> = ({ children, onClick, disabled, className }) => (
  <button
    className={
      className ??
      `px-8 py-4 text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
        disabled 
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
          : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
      }`
    }
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default function NumberSequenceGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentSequence: [],
    options: [],
    sequenceDisplay: [],
    correctAnswer: 0,
    level: 1,
    score: 0,
    puzzlesSolved: 0,
    timeLeft: 120,
    description: "",
    feedbackText: "",
    feedbackClass: "",
    hintText: "",
  });

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const correctAnswerRef = useRef<number>(0);
  const { isMuted } = useSound();

  type SoundType = 'select' | 'found' | 'win' | 'error';
  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;
    const sounds: Record<SoundType, string> = {
      select: '/sounds/click.mp3',
      found: '/sounds/correct.mp3',
      error: '/sounds/incorrect.mp3',
      win: '/sounds/win.mp3',
    };
    try {
      const audio = new Audio(sounds[type]);
      audio.play().catch(err => console.error(`Error playing ${type} sound:`, err));
    } catch (error) {
      console.error('Sound error:', error);
    }
  }, [isMuted]);

  const showConfetti = useCallback(() => {
    const defaults = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
    };
    confetti(defaults);
    if (Math.random() > 0.5) {
      setTimeout(() => {
        confetti({ ...defaults, angle: Math.random() * 180 - 90, origin: { x: Math.random(), y: 0.6 } });
      }, 300);
    }
  }, []);

  // Sequence generators (unchanged)
  const generateArithmeticSequence = useCallback((): SequenceType => {
    const start = Math.floor(Math.random() * 10) + 1;
    const difference = Math.floor(Math.random() * 6) + 2;
    const length = Math.floor(Math.random() * 3) + 4;
    const sequence = [];
    for (let i = 0; i < length; i++) sequence.push(start + i * difference);
    const displayedSequence = sequence.slice(0, -1);
    const lastNumber = displayedSequence[displayedSequence.length - 1];
    const answer = lastNumber + difference;
    return { sequence: displayedSequence, answer, description: `Arithmetic sequence: add ${difference} each time` };
  }, []);

  const generateGeometricSequence = useCallback((): SequenceType => {
    const start = Math.floor(Math.random() * 5) + 1;
    const ratio = Math.floor(Math.random() * 3) + 2;
    const length = Math.floor(Math.random() * 3) + 4;
    const sequence = [];
    for (let i = 0; i < length; i++) sequence.push(start * Math.pow(ratio, i));
    const displayedSequence = sequence.slice(0, -1);
    const lastNumber = displayedSequence[displayedSequence.length - 1];
    const answer = lastNumber * ratio;
    return { sequence: displayedSequence, answer, description: `Geometric sequence: multiply by ${ratio} each time` };
  }, []);

  const generateSquareSequence = useCallback((): SequenceType => {
    const start = Math.floor(Math.random() * 5) + 1;
    const length = Math.floor(Math.random() * 3) + 4;
    const sequence = [];
    for (let i = 0; i < length; i++) sequence.push(Math.pow(start + i, 2));
    const displayedSequence = sequence.slice(0, -1);
    const lastIndex = displayedSequence.length;
    const answer = Math.pow(start + lastIndex + 1, 2);
    return { sequence: displayedSequence, answer, description: `Square numbers: n² where n starts at ${start}` };
  }, []);

  const generatePrimeSequence = useCallback((): SequenceType => {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
    const start = Math.floor(Math.random() * 4);
    const length = Math.floor(Math.random() * 3) + 4;
    const sequence = primes.slice(start, start + length);
    const displayedSequence = sequence.slice(0, -1);
    const answer = sequence[sequence.length - 1];
    return { sequence: displayedSequence, answer, description: `Prime number sequence` };
  }, []);

  const generateFibonacciLikeSequence = useCallback((): SequenceType => {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 1;
    const length = Math.floor(Math.random() * 3) + 5;
    const sequence = [a, b];
    for (let i = 2; i < length; i++) sequence.push(sequence[i - 1] + sequence[i - 2]);
    const displayedSequence = sequence.slice(0, -1);
    const answer = sequence[sequence.length - 1] + sequence[sequence.length - 2];
    return { sequence: displayedSequence, answer, description: `Fibonacci-like sequence: each number is the sum of the two preceding ones` };
  }, []);

  const generateMixedSequence = useCallback((): SequenceType => {
    const types = [generateSquareSequence, generatePrimeSequence, generateFibonacciLikeSequence];
    return types[Math.floor(Math.random() * types.length)]();
  }, [generateSquareSequence, generatePrimeSequence, generateFibonacciLikeSequence]);

  const generateOptions = useCallback((correctAnswer: number): OptionState[] => {
    const options: OptionState[] = [{
      value: correctAnswer,
      disabled: false,
      className: 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl px-8 py-4 text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105'
    }];
    
    while (options.length < 4) {
      let wrongAnswer;
      const variation = Math.floor(Math.random() * 3) + 1;
      switch (variation) {
        case 1: wrongAnswer = correctAnswer + (Math.floor(Math.random() * 5) + 1); break;
        case 2: wrongAnswer = Math.max(1, correctAnswer - (Math.floor(Math.random() * 5) + 1)); break;
        case 3: wrongAnswer = correctAnswer * (Math.floor(Math.random() * 2) + 1); break;
        default: wrongAnswer = correctAnswer + 1;
      }
      if (wrongAnswer > 0 && !options.some(opt => opt.value === wrongAnswer)) {
        options.push({
          value: wrongAnswer,
          disabled: false,
          className: 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl px-8 py-4 text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105'
        });
      }
    }
    return options.sort(() => Math.random() - 0.5);
  }, []);

  const generateSequenceData = useCallback((level: number): SequenceType => {
    const sequenceTypes = [
      generateArithmeticSequence,
      generateGeometricSequence,
      generateSquareSequence,
      generatePrimeSequence,
      generateFibonacciLikeSequence,
      generateMixedSequence,
    ];

    let typeIndex;
    if (level <= 2) typeIndex = Math.floor(Math.random() * 2);
    else if (level <= 4) typeIndex = Math.random() < 0.7 ? Math.floor(Math.random() * 2) : 2 + Math.floor(Math.random() * 2);
    else if (level <= 6) {
      const rand = Math.random();
      if (rand < 0.5) typeIndex = 2 + Math.floor(Math.random() * 2);
      else if (rand < 0.8) typeIndex = Math.floor(Math.random() * 2);
      else typeIndex = 4 + Math.floor(Math.random() * 2);
    } else {
      const rand = Math.random();
      if (rand < 0.6) typeIndex = 4 + Math.floor(Math.random() * 2);
      else if (rand < 0.9) typeIndex = 2 + Math.floor(Math.random() * 2);
      else typeIndex = Math.floor(Math.random() * 2);
    }

    return sequenceTypes[typeIndex]();
  }, [
    generateArithmeticSequence,
    generateGeometricSequence,
    generateSquareSequence,
    generatePrimeSequence,
    generateFibonacciLikeSequence,
    generateMixedSequence,
  ]);

  const generateNewPuzzle = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    const { sequence, answer, description } = generateSequenceData(gameState.level);
    const displayElements = sequence.map((num, index) => (
      <span key={index} className="px-6 py-3 text-xl font-bold bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-md border border-gray-300">
        {num}
      </span>
    ));
    displayElements.push(
      <span key={sequence.length} className="px-6 py-3 text-xl font-bold bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl shadow-md border border-yellow-300 animate-pulse">
        ?
      </span>
    );

    const options = generateOptions(answer);
    correctAnswerRef.current = answer;

    setGameState(prev => ({
      ...prev,
      currentSequence: sequence,
      sequenceDisplay: displayElements,
      options,
      correctAnswer: answer,
      description,
      timeLeft: 120,
      feedbackText: "",
      feedbackClass: "",
      hintText: "",
    }));

    timerIntervalRef.current = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = Math.max(0, prev.timeLeft - 1);
        if (newTimeLeft <= 0) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          setGameState(prevState => ({ 
            ...prevState, 
            feedbackText: "Time's up!", 
            feedbackClass: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300" 
          }));
          playSound('error');
          
          setTimeout(() => {
            generateNewPuzzle();
          }, 2000);
        }
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 1000);
  }, [gameState.level, generateSequenceData, generateOptions, playSound]);

  const handleCorrectAnswer = useCallback(() => {
    let points = 10;
    points = Math.round(points * gameState.level);

    const newLevel = gameState.level + 1;

    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      level: newLevel,
      puzzlesSolved: prev.puzzlesSolved + 1,
    }));

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setGameState(prev => ({
      ...prev,
      feedbackText: `Correct! Well done! (+${points} points)`,
      feedbackClass: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300",
    }));
    playSound('found');
    playSound('win');
    showConfetti();

    setTimeout(generateNewPuzzle, 1500);
  }, [gameState.level, playSound, showConfetti, generateNewPuzzle]);

  const checkAnswer = useCallback(
    (selected: number) => {
      playSound("select");

      setGameState(prev => ({
        ...prev,
        options: prev.options.map(option => ({
          ...option,
          disabled: true,
          className: option.value === selected 
            ? (option.value === correctAnswerRef.current 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg px-8 py-4 text-xl font-bold rounded-2xl transition-all duration-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg px-8 py-4 text-xl font-bold rounded-2xl transition-all duration-300 cursor-not-allowed'
              )
            : (option.value === correctAnswerRef.current
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg px-8 py-4 text-xl font-bold rounded-2xl transition-all duration-300 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 px-8 py-4 text-xl font-bold rounded-2xl transition-all duration-300 cursor-not-allowed'
              )
        }))
      }));

      if (selected === correctAnswerRef.current) {
        handleCorrectAnswer();
      } else {
        setGameState(prev => ({
          ...prev,
          feedbackText: "Incorrect. Try again!",
          feedbackClass: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300",
        }));
        playSound("error");
        
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            feedbackText: "",
            feedbackClass: "",
            options: prev.options.map(option => ({
              ...option,
              disabled: false,
              className: 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl px-8 py-4 text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105'
            }))
          }));
        }, 1000);
      }
    },
    [playSound, handleCorrectAnswer]
  );

  const showHint = useCallback(() => {
    setGameState(prev => ({ ...prev, hintText: prev.description || "" }));
    playSound("select");
  }, [playSound]);

  const initGame = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    setGameState({
      currentSequence: [],
      options: [],
      sequenceDisplay: [],
      correctAnswer: 0,
      level: 1,
      score: 0,
      puzzlesSolved: 0,
      timeLeft: 120,
      description: "",
      feedbackText: "",
      feedbackClass: "",
      hintText: "",
    });
    
    generateNewPuzzle();
    playSound("select");
  }, [generateNewPuzzle, playSound]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({ action: 'number_sequence_started', category: 'number_sequence', label: 'number_sequence' });
        clearInterval(checkGtag);
      }
    }, 100);
    generateNewPuzzle();

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [generateNewPuzzle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto border border-white/60">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Number Sequence
          </h1>
          <p className="text-gray-600 text-lg">Identify the pattern and select the next number</p>
        </div>

        {/* Stats Bar */}
        <div className="flex justify-between items-center mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-inner border border-blue-100/50">
          <div className="text-center">
            <div className="text-sm text-gray-500 font-medium">Level</div>
            <div className="text-2xl font-bold text-blue-600">{gameState.level}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 font-medium">Time</div>
            <div className={`text-2xl font-bold ${gameState.timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-purple-600'}`}>
              {formatTime(gameState.timeLeft)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 font-medium">Score</div>
            <div className="text-2xl font-bold text-green-600">{gameState.score}</div>
          </div>
        </div>

        {/* Sequence Display */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          {gameState.sequenceDisplay}
        </div>

        {/* Hint */}
        {gameState.hintText && (
          <div className="p-4 rounded-2xl mb-6 font-mono text-lg bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200 shadow-sm">
            💡 {gameState.hintText}
          </div>
        )}

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {gameState.options.map((option, index) => (
            <OptionButton
              key={index}
              onClick={() => checkAnswer(option.value)}
              disabled={option.disabled}
              className={option.className}
            >
              {option.value}
            </OptionButton>
          ))}
        </div>

        {/* Feedback */}
        {gameState.feedbackText && (
          <div className={`p-4 rounded-2xl mb-6 font-semibold text-lg text-center shadow-lg ${gameState.feedbackClass}`}>
            {gameState.feedbackText}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={showHint}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl font-bold text-lg"
          >
            💡 Show Hint
          </button>
          <button
            onClick={initGame}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl font-bold text-lg"
          >
            🎮 New Game
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🎯</span> How to Play
          </h2>
          <div className="grid md:grid-cols-2 gap-3 text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Identify the pattern in the number sequence</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Select the correct next number from the options</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Correct answers earn points based on your level</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Each correct answer advances you to the next level</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Higher levels feature more complex patterns</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Use hints if you get stuck (but try without first!)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}