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
        case 'center': return 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-lg';
        default: return 'bg-blue-200 hover:bg-blue-300 text-gray-800 shadow-md';
      }
    };

  return (
    <div className="relative w-16 h-16"> {/* Slightly smaller to accommodate increased spacing */}
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

  // Feedback style mapping
  const getFeedbackStyle = (type: FeedbackType | '') => {
    switch (type) {
      case 'error':
        return 'bg-red-500/20 border border-red-500/50 text-red-200';
      case 'success':
        return 'bg-green-500/20 border border-green-500/50 text-green-200';
      case 'hint':
        return 'bg-blue-500/20 border border-blue-500/50 text-blue-200';
      case 'info':
        return 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-200';
      default:
        return 'bg-gray-500/20 border border-gray-500/50 text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray=900 text-white p-4 md:p-6 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-white mb-2 text-center">Spelling Bee</h2>
      
      {/* Score and Rank */}
      <div className="flex justify-center gap-8 mb-6">
        <div className="text-lg font-semibold text-yellow-400">Rank: {rank}</div>
        <div className="text-lg font-semibold text-green-400">Score: {score}</div>
      </div>
      
      {/* Hexagonal letter grid */}
      <div className="flex flex-col items-center justify-center mb-6">
        {/* Top row (2 letters) - increased horizontal gap */}
        <div className="flex justify-center -mb-4"> {/* Increased negative margin for tighter vertical spacing */}
          {letters.slice(1, 3).map((letter, index) => (
            <div key={index} className="mx-2"> {/* Increased horizontal gap from mx-1 to mx-2 */}
              <HexagonButton
                letter={letter}
                onClick={() => selectLetter(letter)}
                position="top"
              />
            </div>
          ))}
        </div>
        
        {/* Middle row (3 letters) - keep existing spacing */}
        <div className="flex justify-center items-center -mb-4"> {/* Increased negative margin */}
          {letters.slice(3, 4).map((letter, index) => (
            <HexagonButton
              key={index}
              letter={letter}
              onClick={() => selectLetter(letter)}
              position="left"
            />
          ))}
          <div className="mx-3"> {/* Keep good middle row spacing */}
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
        
        {/* Bottom row (2 letters) - increased horizontal gap */}
        <div className="flex justify-center">
          {letters.slice(5, 7).map((letter, index) => (
            <div key={index} className="mx-2"> {/* Increased horizontal gap from mx-1 to mx-2 */}
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
        <div className={`mb-4 p-4 rounded-lg text-center font-medium ${getFeedbackStyle(feedback.type)}`}>
          {feedback.message}
        </div>
      )}

      {/* Current word */}
      <div className="bg-gray-700/50 rounded-lg p-4 mb-6 text-center">
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Current Word:</h3>
        <div className="text-2xl font-bold text-white min-h-8">
          {currentWord.join('') || <span className="text-gray-400">Select letters to form a word</span>}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <button
          onClick={submitWord}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Submit
        </button>
        <button
          onClick={clearCurrentWord}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Clear
        </button>
        <button
          onClick={shuffleLetters}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Shuffle
        </button>
        <button
          onClick={showHint}
          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Hint
        </button>
        <button
          onClick={giveUp}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Give Up
        </button>
      </div>
      
      {/* Found words */}
      {foundWords.length > 0 && (
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3 text-center">
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
                      ? 'bg-yellow-500 text-gray-900 font-bold' 
                      : 'bg-blue-500 text-white'
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-8 max-w-md mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Game Over!</h2>
            <div className="space-y-3 text-center">
              <p className="text-gray-300">Final Score: <span className="font-bold text-yellow-400">{score}</span></p>
              <p className="text-gray-300">Rank: <span className="font-bold text-green-400">{rank}</span></p>
              <p className="text-gray-300">Words Found: <span className="font-bold text-blue-400">{foundWords.length}</span></p>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={initGame}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Play Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
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