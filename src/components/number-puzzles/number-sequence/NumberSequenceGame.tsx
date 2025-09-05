"use client";
import { event } from '@/lib/gtag';
import React, { useEffect, useState, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import { useSound } from '@/context/SoundContext';
import commonStyles from '@styles/NumberPuzzles/NumberPuzzles.common.module.css';
import styles from '@styles/NumberPuzzles/NumberSequence.module.css';

/* ---------- TYPES ---------- */
type GameState = {
  currentSequence: number[];
  correctAnswer: number;
  level: number;
  score: number;
  sequencesSolved: number;
  timeoutId: NodeJS.Timeout | null;
  timeLeft: number;
  timerInterval: NodeJS.Timeout | null;
  description: string;
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

/* ---------- OPTION BUTTON COMPONENT ---------- */
const OptionButton: React.FC<OptionProps> = ({ children, onClick, disabled, className }) => (
  <button className={className} onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

/* ---------- MAIN GAME COMPONENT ---------- */
export default function NumberSequenceGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentSequence: [],
    correctAnswer: 0,
    level: 1,
    score: 0,
    sequencesSolved: 0,
    timeoutId: null,
    timeLeft: 120,
    timerInterval: null,
    description: "",
  });

  const [sequenceDisplay, setSequenceDisplay] = useState<React.ReactElement[]>([]);
  const [sequenceOptions, setSequenceOptions] = useState<React.ReactElement<OptionProps>[]>([]);
  const [feedback, setFeedback] = useState({ text: "", className: "" });
  const [hintText, setHintText] = useState("");
  const correctAnswerRef = useRef<number>(0);
  const { isMuted } = useSound();

  /* ---------- LIFECYCLE ---------- */
  useEffect(() => {
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'number_sequence_started', category: 'number_sequence',label: 'number_sequence'});
        clearInterval(checkGtag);
      }
    }, 100);
    generateSequence();

    return () => {
      if (gameState.timeoutId) clearTimeout(gameState.timeoutId);
      if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    };
  }, []);

  /* ---------- SOUND ---------- */
  type SoundType = 'select' | 'found' | 'win' | 'error';
  const playSound = (type: SoundType) => {
    if (isMuted) return;
    const sounds: Record<SoundType, string> = {
      select: '/sounds/click.mp3',
      found: '/sounds/correct.mp3',
      error: '/sounds/incorrect.mp3',
      win: '/sounds/win.mp3'
    };
    try {
      const audio = new Audio(sounds[type]);
      audio.play().catch(err => console.error(`Error playing ${type} sound:`, err));
    } catch (error) {
      console.error('Sound error:', error);
    }
  };

  /* ---------- TIMER ---------- */
  const startTimer = useCallback(() => {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    setGameState(prev => ({ ...prev, timeLeft: 120 }));
    const interval = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = Math.max(0, prev.timeLeft - 1);
        if (newTimeLeft <= 0) {
          clearInterval(interval);
          setFeedback({ text: "Time's up!", className: "text-red-500" });
          playSound("error");
          setTimeout(generateSequence, 2000);
          return { ...prev, timeLeft: newTimeLeft, timerInterval: null };
        }
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 1000);
    setGameState(prev => ({ ...prev, timerInterval: interval }));
  }, [playSound]);

  /* ---------- SEQUENCE GENERATORS ---------- */
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

  const generateOptions = useCallback((correctAnswer: number): number[] => {
    const options = [correctAnswer];
    while (options.length < 4) {
      let wrongAnswer;
      const variation = Math.floor(Math.random() * 3) + 1;
      switch (variation) {
        case 1: wrongAnswer = correctAnswer + (Math.floor(Math.random() * 5) + 1); break;
        case 2: wrongAnswer = Math.max(1, correctAnswer - (Math.floor(Math.random() * 5) + 1)); break;
        case 3: wrongAnswer = correctAnswer * (Math.floor(Math.random() * 2) + 1); break;
        default: wrongAnswer = correctAnswer + 1;
      }
      if (wrongAnswer > 0 && !options.includes(wrongAnswer)) options.push(wrongAnswer);
    }
    return options.sort(() => Math.random() - 0.5);
  }, []);

  /* ---------- SEQUENCE / OPTIONS GENERATION ---------- */
  const generateSequence = useCallback(() => {
    setSequenceDisplay([]);
    setSequenceOptions([]);
    setFeedback({ text: "", className: "" });
    setHintText("");

    const sequenceTypes = [
      generateArithmeticSequence,
      generateGeometricSequence,
      generateSquareSequence,
      generatePrimeSequence,
      generateFibonacciLikeSequence,
      generateMixedSequence,
    ];

    let typeIndex;
    if (gameState.level <= 2) typeIndex = Math.floor(Math.random() * 2);
    else if (gameState.level <= 4) typeIndex = Math.random() < 0.7 ? Math.floor(Math.random() * 2) : 2 + Math.floor(Math.random() * 2);
    else if (gameState.level <= 6) {
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

    const { sequence, answer, description } = sequenceTypes[typeIndex]();
    const displayElements = sequence.map((num, index) => (
      <span key={index} className={styles.sequenceNumber}>
        {num}
      </span>
    ));
    displayElements.push(<span key={sequence.length} className={`${styles.sequenceNumber} ${styles.missing}`}>?</span>);
    setSequenceDisplay(displayElements);

    const options = generateOptions(answer);
    const optionElements = options.map((option, index) => (
      <OptionButton
        key={index}
        onClick={() => checkAnswer(option)}
        disabled={false}
        className={styles.btn}
      >
        {option}
      </OptionButton>
    ));
    setSequenceOptions(optionElements);

    correctAnswerRef.current = answer;
    setGameState(prev => ({ ...prev, currentSequence: sequence, correctAnswer: answer, description }));
    startTimer();
  }, [
    gameState.level,
    generateArithmeticSequence,
    generateGeometricSequence,
    generateSquareSequence,
    generatePrimeSequence,
    generateFibonacciLikeSequence,
    generateMixedSequence,
    generateOptions,
    startTimer,
  ]);

  /* ---------- ANSWER CHECK ---------- */
  const checkAnswer = useCallback((selected: number) => {
    playSound("select");

    const disabledOptions = sequenceOptions.map(option =>
      React.cloneElement(option, {
        disabled: true,
        className: `${commonStyles.btn} ${commonStyles.disabled}`,
      })
    );
    setSequenceOptions(disabledOptions);

    if (selected === correctAnswerRef.current) {
      setFeedback({ text: "Correct! Well done!", className: `${commonStyles.feedback} ${commonStyles.success}` });
      setGameState(prev => {
        const newScore = prev.score + prev.level * 10;
        const newSequencesSolved = prev.sequencesSolved + 1;
        let newLevel = prev.level;
        if (newSequencesSolved >= 3) {
          newLevel++;
          showConfetti({ particleCount: 150, spread: 80 });
        } else {
          showConfetti();
        }
        return { ...prev, score: newScore, sequencesSolved: newSequencesSolved >= 3 ? 0 : newSequencesSolved, level: newLevel };
      });

      const updatedOptions = sequenceOptions.map(option =>
        React.cloneElement(option, {
          disabled: true,
          className: parseInt(option.props.children.toString()) === correctAnswerRef.current
            ? `${commonStyles.btn} ${commonStyles.correct}`
            : `${commonStyles.btn} ${commonStyles.disabled}`,
        })
      );
      setSequenceOptions(updatedOptions);

      if (gameState.timerInterval) clearInterval(gameState.timerInterval);
      playSound("found");
      const timeoutId = setTimeout(() => {
        generateSequence();
        setGameState(prev => ({ ...prev, timeoutId: null }));
      }, 2500);
      setGameState(prev => ({ ...prev, timeoutId, timerInterval: null }));
    } else {
      setFeedback({ text: "Incorrect. Try again!", className: `${commonStyles.feedback} ${commonStyles.error}` });
      const updatedOptions = sequenceOptions.map(option =>
        React.cloneElement(option, {
          disabled: true,
          className: parseInt(option.props.children.toString()) === selected
            ? `${commonStyles.btn} ${commonStyles.wrong}`
            : `${commonStyles.btn} ${commonStyles.disabled}`,
        })
      );
      setSequenceOptions(updatedOptions);
      playSound("error");
      const timeoutId = setTimeout(() => {
        const resetOptions = sequenceOptions.map(option =>
          React.cloneElement(option, { disabled: false, className: `${commonStyles.btn}` })
        );
        setSequenceOptions(resetOptions);
        setFeedback({ text: "", className: "" });
      }, 1000);
      setGameState(prev => ({ ...prev, timeoutId }));
    }
  }, [gameState.timerInterval, sequenceOptions, playSound, generateSequence]);

  /* ---------- HINT / RESET / CONFETTI ---------- */
  const showHint = useCallback(() => {
    setHintText(gameState.description || "");
    playSound("select");
  }, [playSound, gameState.description]);

  const showConfetti = useCallback((options = {}) => {
    const defaults = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
    };
    confetti({ ...defaults, ...options });
    if (Math.random() > 0.5) {
      setTimeout(() => {
        confetti({ ...defaults, ...options, angle: Math.random() * 180 - 90, origin: { x: Math.random(), y: 0.6 } });
      }, 300);
    }
  }, []);

  const initGame = useCallback(() => {
    if (gameState.timeoutId) clearTimeout(gameState.timeoutId);
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    setGameState({
      currentSequence: [],
      correctAnswer: 0,
      level: 1,
      score: 0,
      sequencesSolved: 0,
      timeoutId: null,
      timeLeft: 120,
      timerInterval: null,
      description: "",
    });
    setSequenceDisplay([]);
    setSequenceOptions([]);
    setFeedback({ text: "", className: "" });
    setHintText("");
    generateSequence();
    playSound("select");
  }, [gameState.timeoutId, gameState.timerInterval, generateSequence, playSound]);

  /* ---------- UTIL ---------- */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Number Sequence</h1>
      <p className="text-gray-600 mb-6">Identify the pattern and select the next number</p>

      <div className={styles.gameHeader}>
        <div className="text-lg font-semibold">Level: {gameState.level}</div>
        <div className={`text-lg font-semibold ${gameState.timeLeft <= 10 ? commonStyles.timeCritical : ""}`}>
          Time: {formatTime(gameState.timeLeft)}
        </div>
        <div className="text-lg font-semibold">Score: {gameState.score}</div>
      </div>

      <div className={styles.progressBar}>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={styles.progressFill}
            style={{ width: `${(gameState.sequencesSolved / 3) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          <span>Sequences Solved: {gameState.sequencesSolved}</span>
          <span>Total to Level Up: 3</span>
        </div>
      </div>

      <div className={styles.sequenceDisplay}>{sequenceDisplay}</div>

      {hintText && <div className={styles.hintText}>{hintText}</div>}

      <div className={styles.sequenceOptions}>{sequenceOptions}</div>

      {feedback.text && (
        <div className={`${commonStyles.feedback} ${feedback.className} mb-4`}>{feedback.text}</div>
      )}

      <div className="flex gap-2 mb-6">
        <button onClick={showHint} className={`${commonStyles.btn} ${commonStyles.secondary}`}>
          Show Hint
        </button>
        <button onClick={initGame} className={`${commonStyles.btn} ${commonStyles.primary}`}>
          New Game
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">How to Play</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Identify the pattern in the number sequence</li>
          <li>Select the correct next number from the options</li>
          <li>Correct answers earn points based on your level</li>
          <li>Solve 3 sequences in a row to level up</li>
          <li>Higher levels feature more complex patterns</li>
          <li>Use hints if you get stuck (but try without first!)</li>
        </ul>
      </div>
    </div>
  );
}