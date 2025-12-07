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
      `px-6 py-3 text-lg font-bold rounded-lg transition-all ${
        disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
      }`
    }
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const buttonStyle = "px-6 md:px-3 py-2 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] text-center"

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

  // Sequence generators
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
      className: 'bg-blue-500 text-white hover:bg-blue-600 px-6 py-3 text-lg font-bold rounded-lg transition-all'
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
          className: 'bg-blue-500 text-white hover:bg-blue-600 px-6 py-3 text-lg font-bold rounded-lg transition-all'
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
    // Clear existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    const { sequence, answer, description } = generateSequenceData(gameState.level);
    const displayElements = sequence.map((num, index) => (
      <span key={index} className="px-4 py-2 text-lg font-semibold bg-gray-200 rounded-lg">
        {num}
      </span>
    ));
    displayElements.push(
      <span key={sequence.length} className="px-4 py-2 text-lg font-semibold bg-gray-300 rounded-lg text-gray-500">
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

    // Start timer
    timerIntervalRef.current = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = Math.max(0, prev.timeLeft - 1);
        if (newTimeLeft <= 0) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          // Handle time expiration
          setGameState(prevState => ({ 
            ...prevState, 
            feedbackText: "Time's up!", 
            feedbackClass: "bg-red-100 text-red-700" 
          }));
          playSound('error');
          
          // Schedule new puzzle after delay
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
      feedbackClass: "bg-green-100 text-green-700",
    }));
    playSound('found');
    playSound('win');
    showConfetti();

    setTimeout(generateNewPuzzle, 1500);
  }, [gameState.level, playSound, showConfetti, generateNewPuzzle]);

  const checkAnswer = useCallback(
    (selected: number) => {
      playSound("select");

      // Disable all options immediately and show visual feedback
      setGameState(prev => ({
        ...prev,
        options: prev.options.map(option => ({
          ...option,
          disabled: true,
          className: option.value === selected 
            ? (option.value === correctAnswerRef.current 
                ? 'bg-green-100 text-green-700 px-6 py-3 text-lg font-bold rounded-lg transition-all cursor-not-allowed'
                : 'bg-red-100 text-red-700 px-6 py-3 text-lg font-bold rounded-lg transition-all cursor-not-allowed'
              )
            : (option.value === correctAnswerRef.current
                ? 'bg-green-100 text-green-700 px-6 py-3 text-lg font-bold rounded-lg transition-all cursor-not-allowed'
                : 'bg-gray-300 text-gray-500 px-6 py-3 text-lg font-bold rounded-lg transition-all cursor-not-allowed'
              )
        }))
      }));

      if (selected === correctAnswerRef.current) {
        handleCorrectAnswer();
      } else {
        setGameState(prev => ({
          ...prev,
          feedbackText: "Incorrect. Try again!",
          feedbackClass: "bg-red-100 text-red-700",
        }));
        playSound("error");
        
        // Re-enable options after a delay for another try
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            feedbackText: "",
            feedbackClass: "",
            options: prev.options.map(option => ({
              ...option,
              disabled: false,
              className: 'bg-blue-500 text-white hover:bg-blue-600 px-6 py-3 text-lg font-bold rounded-lg transition-all'
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
    <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Number Sequence - Guess the next number?</h1>
      <p className="text-gray-600 mb-6">Identify the pattern and select the next number</p>

      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold">Level: {gameState.level}</div>
        <div className={`text-lg font-semibold ${gameState.timeLeft <= 10 ? 'text-red-600 animate-pulse' : ''}`}>
          Time: {formatTime(gameState.timeLeft)}
        </div>
        <div className="text-lg font-semibold">Score: {gameState.score}</div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">{gameState.sequenceDisplay}</div>

      {gameState.hintText && (
        <div className="p-4 rounded-lg mb-4 font-mono text-lg bg-blue-50 text-blue-700">
          {gameState.hintText}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
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

      {gameState.feedbackText && (
        <div className={`p-4 rounded-lg mb-4 font-mono text-lg ${gameState.feedbackClass}`}>
          {gameState.feedbackText}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <button
          onClick={showHint}
          className={`${buttonStyle} bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-amber-400 hover:to-amber-500 text-white`}
        >
          Show Hint
        </button>
        <button
          onClick={initGame}
          className={`${buttonStyle} bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white`}
        >
          New Game
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">How to Play</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Identify the pattern in the number sequence</li>
          <li>Select the correct next number from the options</li>
          <li>Correct answers earn points based on your level</li>
          <li>Each correct answer advances you to the next level</li>
          <li>Higher levels feature more complex patterns</li>
          <li>Use hints if you get stuck (but try without first!)</li>
        </ul>
      </div>
    </div>
  );
}