'use client';
import { event } from '@/lib/gtag';
import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useSound } from '@/context/SoundContext';

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
  const DICTIONARY_API_KEY = process.env.NEXT_PUBLIC_MW_DICTIONARY_KEY;

  // Consistent button style for all buttons
  const buttonStyle = "px-6 md:px-8 py-2 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] text-center";

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
      'MEAL', 'NAME', 'PALE', 'RACE', 'SALE', 'TALE', 'WAVE', 'BEAR', 'CARE', 'DARE',
      'FARE', 'HARE', 'MARE', 'PARE', 'RARE', 'FIRE', 'HIRE', 'MIRE', 'SIRE', 'TIRE',
      'BORE', 'CORE', 'FORE', 'GORE', 'MORE', 'PORE', 'SORE', 'TORE', 'WORE', 'TRUE',
      'BLUE', 'CLUE', 'FLUE', 'GLUE', 'WORK', 'YARD', 'YEAR', 'YELL', 'YET', 'YOUR', 'ZONE'
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
    const wordLower = word.toLowerCase();
    
    // Basic validation
    if (!wordUpper.split('').every(l => letters.includes(l)) || !wordUpper.includes(centerLetter)) {
      return false;
    }

    if (allPossibleWords.includes(wordUpper)) {
      return true;
    }

    try {
      const response = await fetch(
        `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${wordLower}?key=${DICTIONARY_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Response:', responseText);
        throw new Error('Invalid JSON from API');
      }

      console.log('MW API response:', data);

      // Handle different response types from Merriam-Webster
      if (Array.isArray(data) && data.length > 0) {
        for (const entry of data) {
          if (typeof entry === 'string') {
            continue;
          }
          
          if (typeof entry === 'object' && entry !== null) {
            const wordMatches = 
              (entry.meta?.id && entry.meta.id.split(':')[0].toUpperCase() === wordUpper) ||
              (entry.hwi?.hw && entry.hwi.hw.replace(/\*/g, '').toUpperCase() === wordUpper) ||
              (entry.meta?.stems && entry.meta.stems.some((stem: string) => stem.toUpperCase() === wordUpper));
            
            if (wordMatches) {
              console.log(`Word "${wordUpper}" validated via Merriam-Webster API.`);
              setAllPossibleWords(prev => [...prev, wordUpper]);
              return true;
            }
          }
        }
      }
      
      showFeedback('info', `"${word}" is not in our dictionary.`);
      return false;
    } catch (error) {
      console.error(`Error validating word "${wordUpper}":`, error);
      
      const isInLocalList = allPossibleWords.includes(wordUpper);
      if (!isInLocalList) {
        showFeedback('info', 'Dictionary API unavailable. Using local word list.');
      }
      return isInLocalList;
    }
  }, [letters, centerLetter, allPossibleWords, showFeedback, DICTIONARY_API_KEY]);

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
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'spellingbee_started', category: 'spellingbee',label: 'spellingbee'});
        clearInterval(checkGtag);
      }
    }, 100);
    initGame();
  }, [initGame]);

  // Hexagon Button Component
  const HexagonButton = ({ letter, onClick, position }: HexagonButtonProps) => {
    const getColor = () => {
      switch (position) {
        case 'center': return 'bg-yellow-200 hover:bg-yellow-300 text-gray-900 shadow-lg';
        default: return 'bg-blue-100 hover:bg-blue-200 text-gray-800 shadow-md';
      }
    };

    return (
      <div className="relative w-16 h-16">
        <button
          onClick={onClick}
          className={`w-full h-full flex items-center justify-center font-bold text-xl transition-all duration-200 transform hover:scale-110 ${getColor()}`}
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
          }}
        >
          {letter}
        </button>
      </div>
    );
  };

  // Feedback style mapping for light theme
  const getFeedbackStyle = (type: FeedbackType | '') => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'hint':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'info':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 p-4 md:p-6 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 p-4 bg-white/70 rounded-xl backdrop-blur-sm border border-gray-200 shadow-lg">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Spelling Bee
            </h1>
            <div className="text-sm md:text-base text-gray-600 mt-1">
              Rank: {rank}
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="bg-white/90 px-4 py-2 rounded-lg border border-gray-300 font-bold text-lg shadow-sm">
              Score: {score}
            </div>
          </div>
        </div>

        {/* Hexagonal letter grid */}
        <div className="flex flex-col items-center justify-center mb-6">
          {/* Top row (2 letters) */}
          <div className="flex justify-center -mb-4">
            {letters.slice(1, 3).map((letter, index) => (
              <div key={index} className="mx-2">
                <HexagonButton
                  letter={letter}
                  onClick={() => selectLetter(letter)}
                  position="top"
                />
              </div>
            ))}
          </div>
          
          {/* Middle row (3 letters) */}
          <div className="flex justify-center items-center -mb-4">
            {letters.slice(3, 4).map((letter, index) => (
              <HexagonButton
                key={index}
                letter={letter}
                onClick={() => selectLetter(letter)}
                position="left"
              />
            ))}
            <div className="mx-3">
              <HexagonButton
                letter={centerLetter}
                onClick={() => selectLetter(centerLetter)}
                position="center"
              />
            </div>
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
          <div className="flex justify-center">
            {letters.slice(5, 7).map((letter, index) => (
              <div key={index} className="mx-2">
                <HexagonButton
                  letter={letter}
                  onClick={() => selectLetter(letter)}
                  position="bottom"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Feedback message */}
        {feedback.message && (
          <div className={`mb-4 p-4 rounded-lg text-center font-medium border backdrop-blur-sm ${getFeedbackStyle(feedback.type)}`}>
            {feedback.message}
          </div>
        )}

        {/* Current word */}
        <div className="bg-white/70 rounded-xl p-4 mb-6 text-center border border-gray-200 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Word:</h3>
          <div className="text-2xl font-bold text-gray-800 min-h-8">
            {currentWord.join('') || <span className="text-gray-500">Select letters to form a word</span>}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button
            onClick={submitWord}
            className={`${buttonStyle} bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white`}
          >
            Submit
          </button>
          <button
            onClick={clearCurrentWord}
            className={`${buttonStyle} bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white`}
          >
            Clear
          </button>
          <button
            onClick={shuffleLetters}
            className={`${buttonStyle} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white`}
          >
            Shuffle
          </button>
          <button
            onClick={showHint}
            className={`${buttonStyle} bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white`}
          >
            Hint
          </button>
          <button
            onClick={giveUp}
            className={`${buttonStyle} bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white`}
          >
            Give Up
          </button>
        </div>
        
        {/* Found words */}
        {foundWords.length > 0 && (
          <div className="bg-white/70 rounded-xl p-4 mb-6 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
              Found Words ({foundWords.length}):
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {foundWords
                .sort((a, b) => b.length - a.length)
                .map((word, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full font-medium ${
                      new Set(word.split('')).size === 7 
                        ? 'bg-yellow-200 text-gray-900 font-bold border border-yellow-300' 
                        : 'bg-blue-100 text-gray-800 border border-blue-200'
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-6 md:p-8 max-w-md w-full border border-gray-300 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Game Over!
              </h2>
              <div className="space-y-3 text-center">
                <p className="text-gray-600">Final Score: <span className="font-bold text-green-600">{score}</span></p>
                <p className="text-gray-600">Rank: <span className="font-bold text-blue-600">{rank}</span></p>
                <p className="text-gray-600">Words Found: <span className="font-bold text-purple-600">{foundWords.length}</span></p>
              </div>
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={initGame}
                  className={`${buttonStyle} bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white`}
                >
                  Play Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className={`${buttonStyle} bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white`}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}