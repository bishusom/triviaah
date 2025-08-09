'use client';
import { event } from '@/lib/gtag';
import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useSound } from '@/app/context/SoundContext';

type FeedbackType = 'error' | 'success' | 'info' | 'hint';
type HexagonPosition = 'top' | 'bottom' | 'left' | 'right' | 'center';

interface FeedbackState {
  message: string;
  type: FeedbackType | '';
}

interface HexagonButtonProps {
  letter: string;
  onClick: () => void;
  position: HexagonPosition;
}


export default function SpellingBeeGame() {
  // Game state
  const [letters, setLetters] = useState<string[]>([]);
  const [centerLetter, setCenterLetter] = useState('');
  const [currentWord, setCurrentWord] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [allPossibleWords, setAllPossibleWords] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [rank, setRank] = useState('Beginner');
  const [feedback, setFeedback] = useState<FeedbackState>({ message: '', type: '' });
  const { isMuted } = useSound();
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  // Sound effects
  const playSound = useCallback((type: string) => {
    if (isMuted) return;
    const sounds: Record<string, string> = {
      select: '/sounds/click.mp3',
      correct: '/sounds/correct.mp3',
      error: '/sounds/incorrect.mp3',
      win: '/sounds/win.mp3',
      shuffle: '/sounds/click.mp3'
    };
    
    try {
      const audio = new Audio(sounds[type]);
      audio.play().catch(err => console.error(`Error playing ${type} sound:`, err));
    } catch (error) {
      console.error('Sound error:', error);
    }
  }, [isMuted]);

  // Helper functions
  const getRandomLetter = useCallback((letterArray: string[]) => {
    return letterArray[Math.floor(Math.random() * letterArray.length)];
  }, []);

  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  }, []);

  const generateFallbackWords = useCallback((center: string, letters: string[]) => {
    const examples = [
      'ABLE', 'BAKE', 'CAKE', 'DEAL', 'FEAR', 'GEAR', 'HEAL', 'JADE', 'KALE', 'LEAK',
      // ... (rest of the example words remain the same)
      'WORK', 'YARD', 'YEAR', 'YELL', 'YET', 'YOUR', 'ZONE'
    ];
    
    return examples.filter(word => {
      if (!word.includes(center)) return false;
      for (const letter of word) {
        if (!letters.includes(letter)) return false;
      }
      return true;
    });
  }, []);

  const showFeedback = useCallback((type: FeedbackType, message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
  }, []);

  const updateRank = useCallback((currentScore: number) => {
    if (currentScore >= 100) {
      setRank("Genius");
      setGameOver(true);
      showGameOver();
    } else if (currentScore >= 70) {
      setRank("Amazing");
    } else if (currentScore >= 50) {
      setRank("Great");
    } else if (currentScore >= 30) {
      setRank("Nice");
    } else if (currentScore >= 20) {
      setRank("Solid");
    } else if (currentScore >= 10) {
      setRank("Good");
    } else if (currentScore >= 5) {
      setRank("Moving Up");
    } else {
      setRank("Beginner");
    }
  }, []);

  const validateWord = useCallback(async (word: string) => {
    const wordUpper = word.toUpperCase();
    
    if (!wordUpper.split('').every(l => letters.includes(l)) || !wordUpper.includes(centerLetter)) {
      return false;
    }

    if (allPossibleWords.includes(wordUpper)) {
      return true;
    }

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      if (response.ok) {
        setAllPossibleWords(prev => [...prev, wordUpper]);
        return true;
      }
      showFeedback('info', 'Word validation failed. Try again or start a new game.');
      return allPossibleWords.includes(wordUpper);
    } catch (error) {
      console.error(`Error validating word ${wordUpper}:`, error);
      showFeedback('info', 'Network error. Using local word list.');
      return allPossibleWords.includes(wordUpper);
    }
  }, [letters, centerLetter, allPossibleWords, showFeedback]);

  const initGame = useCallback(() => {
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

    let newLetters: string[] = [];
    let newCenterLetter = '';
    let newAllPossibleWords: string[] = [];

    do {
      newCenterLetter = getRandomLetter([...vowels, ...consonants]);
      newLetters = [newCenterLetter];
      
      if (newCenterLetter === 'Q') {
        newLetters.push('U');
      } else {
        newLetters.push(getRandomLetter(vowels));
      }
      
      while (newLetters.length < 7) {
        const letter = getRandomLetter([...vowels, ...consonants]);
        if (!newLetters.includes(letter)) {
          newLetters.push(letter);
        }
      }
      
      newLetters = [newLetters[0], ...shuffleArray(newLetters.slice(1))];
      newAllPossibleWords = generateFallbackWords(newCenterLetter, newLetters).slice(0, 50);
    } while (newAllPossibleWords.length < 5);
    
    setLetters(newLetters);
    setCenterLetter(newCenterLetter);
    setCurrentWord([]);
    setFoundWords([]);
    setScore(0);
    setAllPossibleWords(newAllPossibleWords);
    setGameOver(false);
    setRank('Beginner');
    setShowGameOverModal(false);
    showFeedback('info', 'Words must be 4+ letters, include the center letter, and use only the given letters.');
  }, [getRandomLetter, generateFallbackWords, shuffleArray, showFeedback]);

  const selectLetter = useCallback((letter: string) => {
    if (gameOver) return;
    setCurrentWord(prev => [...prev, letter]);
    playSound('select');
  }, [gameOver, playSound]);

  const submitWord = useCallback(async () => {
    if (gameOver) return;

    const word = currentWord.join('');
    
    if (word.length < 4) {
      showFeedback('error', 'Word must be at least 4 letters');
      playSound('error');
      return;
    }
    
    if (!word.includes(centerLetter)) {
      showFeedback('error', 'Must use the center letter');
      playSound('error');
      return;
    }
    
    if (foundWords.includes(word)) {
      showFeedback('error', 'You already found this word');
      playSound('error');
      return;
    }
    
    const isValid = await validateWord(word);
    if (isValid) {
      let wordScore = Math.max(1, word.length - 3);
      const isPangram = new Set(word.split('')).size === 7;
      if (isPangram) {
        wordScore += 7;
        showFeedback('success', `Pangram! +${wordScore} points!`);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        showFeedback('success', `+${wordScore} points!`);
      }
      
      setScore(prev => prev + wordScore);
      setFoundWords(prev => [...prev, word]);
      updateRank(score + wordScore);
      setCurrentWord([]);
      playSound('correct');
    } else {
      showFeedback('error', 'Not a valid word');
      playSound('error');
    }
  }, [gameOver, currentWord, centerLetter, foundWords, validateWord, playSound, showFeedback, updateRank, score]);

  const clearCurrentWord = useCallback(() => {
    if (gameOver) return;
    setCurrentWord([]);
    playSound('select');
  }, [gameOver, playSound]);

  const shuffleLetters = useCallback(() => {
    if (gameOver) return;
    setLetters(prev => [prev[0], ...shuffleArray(prev.slice(1))]);
    playSound('shuffle');
  }, [gameOver, playSound, shuffleArray]);

  const showHint = useCallback(() => {
    if (gameOver) {
      showFeedback('info', 'Game over! Start a new game to continue.');
      return;
    }
    const remainingWords = allPossibleWords.filter(w => !foundWords.includes(w));
    if (remainingWords.length > 0) {
      const hintWord = remainingWords.reduce((a, b) => a.length > b.length ? a : b);
      const hint = hintWord.slice(0, 2);
      showFeedback('hint', `Try starting with: ${hint}...`);
    } else {
      showFeedback('hint', `Try combining the center letter (${centerLetter}) with other letters!`);
    }
  }, [gameOver, allPossibleWords, foundWords, centerLetter, showFeedback]);

  const giveUp = useCallback(() => {
    setGameOver(true);
    setShowGameOverModal(true);
    playSound('error');
  }, [playSound]);

  const showGameOver = useCallback(() => {
    setShowGameOverModal(true);
    if (score >= 100) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
      playSound('win');
    }
  }, [score, playSound]);

  // Initialize game on mount
  useEffect(() => {
    event({action: 'spelling_bee_started', category: 'spelling_bee',label: 'spelling_bee'});
    initGame();
  }, [initGame]);

  // Hexagon Button Component
  const HexagonButton = ({ letter, onClick, position }: HexagonButtonProps) => {
    const getColor = () => {
      switch (position) {
        case 'center': return 'bg-yellow-200 hover:bg-yellow-300';
        default: return 'bg-blue-100 hover:bg-blue-200';
      }
    };

    return (
      <div className="hexagon-container">
        <button
          onClick={onClick}
          className={`hexagon ${getColor()} transition-colors duration-200`}
        >
          <span className="hexagon-text">{letter}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md relative">
      <h1 className="text-2xl font-bold text-center mb-4">Spelling Bee</h1>
      {/* Center letter display */}
      <div className="text-center mb-4">
        <div className="text-lg font-semibold">Rank: {rank}</div>
        <div className="text-xl font-bold animate-pulse">Score: {score}</div>
      </div>
      
      
      {/* Hexagonal letter grid */}
      <div className="hex-grid">
        {/* Top row (2 letters) */}
        <div className="hex-row hex-row-top">
          {letters.slice(1, 3).map((letter, index) => (
            <HexagonButton
              key={index}
              letter={letter}
              onClick={() => selectLetter(letter)}
              position="top"
            />
          ))}
        </div>
        
        {/* Middle row (3 letters - left, center, right) */}
        <div className="hex-row hex-row-middle">
          {letters.slice(3, 4).map((letter, index) => (
            <HexagonButton
              key={index}
              letter={letter}
              onClick={() => selectLetter(letter)}
              position="left"
            />
          ))}
          <HexagonButton
            letter={centerLetter}
            onClick={() => selectLetter(centerLetter)}
            position="center"
          />
          {letters.slice(4, 5).map((letter, index) => (
            <HexagonButton
              key={index}
              letter={letter}
              onClick={() => selectLetter(letter)}
              position="right"
            />
          ))}
        </div>
        
        {/* Bottom row (2 letters) */}
        <div className="hex-row hex-row-bottom">
          {letters.slice(5, 7).map((letter, index) => (
            <HexagonButton
              key={index}
              letter={letter}
              onClick={() => selectLetter(letter)}
              position="bottom"
            />
          ))}
        </div>
      </div>
      
       {/* Feedback message */}
      {feedback.message && (
        <div className={`p-2 mb-4 rounded text-center transition-all duration-300 ${
          feedback.type === 'error' ? 'bg-red-100 text-red-800' :
          feedback.type === 'success' ? 'bg-green-100 text-green-800' :
          feedback.type === 'hint' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {feedback.message}
        </div>
      )}

      {/* Current word */}
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Current Word:</h3>
        <div className="text-2xl font-bold min-h-10 transition-all duration-200">
          {currentWord.join('') || <span className="opacity-30">Select letters</span>}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={submitWord}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors duration-200"
        >
          Submit
        </button>
        <button
          onClick={clearCurrentWord}
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors duration-200"
        >
          Clear
        </button>
        <button
          onClick={shuffleLetters}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-200"
        >
          Shuffle
        </button>
        <button
          onClick={showHint}
          className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded transition-colors duration-200"
        >
          Hint
        </button>
        <button
          onClick={giveUp}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded col-span-2 transition-colors duration-200"
        >
          Give Up
        </button>
      </div>
      
      {/* Found words */}
      {foundWords.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Found Words ({foundWords.length}):</h3>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2">
            {foundWords
              .sort((a, b) => b.length - a.length)
              .map((word, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full transition-all duration-200 ${
                    new Set(word.split('')).size === 7 ? 
                    'bg-purple-100 text-purple-800 font-bold' : 'bg-green-100 text-green-800'
                  }`}
                >
                  {word}
                </span>
              ))}
          </div>
        </div>
      )}
      
      {/* Game over modal */}
      {showGameOverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Game Over!</h2>
            <p className="mb-2">Final Score: <span className="font-bold">{score}</span></p>
            <p className="mb-2">Rank: <span className="font-bold">{rank}</span></p>
            <p className="mb-6">Words Found: {foundWords.length}</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={initGame}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-200"
              >
                Play Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors duration-200"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}