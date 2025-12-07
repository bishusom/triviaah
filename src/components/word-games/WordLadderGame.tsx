'use client';
import { event } from '@/lib/gtag';
import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { createClient } from '@supabase/supabase-js';
import { useSound } from '@/context/SoundContext';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const buttonStyle = "px-6 md:px-8 py-2 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] text-center";

// Add Merriam-Webster API key
const DICTIONARY_API_KEY = process.env.NEXT_PUBLIC_MW_DICTIONARY_KEY;

interface GameConfig {
  wordLength: {
    easy: number;
    medium: number;
    hard: number;
  };
  timeLimit: {
    easy: number;
    medium: number;
    hard: number;
  };
  scorePerStep: {
    easy: number;
    medium: number;
    hard: number;
  };
  bonusPerSecond: number;
  maxHints: number;
}

interface GameState {
  difficulty: 'easy' | 'medium' | 'hard';
  consecutiveWins: number;
  currentLevel: number;
}

interface LetterTileProps {
  letter: string;
  index: number;
  isSelected: boolean;
  onClick: (index: number) => void;
}

const LetterTile: React.FC<LetterTileProps> = ({ letter, index, isSelected, onClick }) => (
  <button
    onClick={() => onClick(index)}
    className={`
      w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-xl md:text-2xl font-bold 
      rounded-lg transition-all duration-200 border-2
      ${isSelected 
        ? 'bg-blue-500 text-white border-blue-600 transform scale-105 shadow-lg' 
        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-blue-300 hover:shadow'
      }
    `}
  >
    {letter}
  </button>
);

interface AlphabetTileProps {
  letter: string;
  onClick: (letter: string) => void;
}

const AlphabetTile: React.FC<AlphabetTileProps> = ({ letter, onClick }) => (
  <button
    onClick={() => onClick(letter)}
    className="
      w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-lg font-medium
      bg-gray-100 text-gray-700 rounded-lg border border-gray-300
      hover:bg-blue-100 hover:text-blue-700 hover:border-blue-400 hover:shadow
      transition-all duration-150 active:scale-95
    "
  >
    {letter}
  </button>
);

export default function WordLadderGame() {
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    difficulty: 'easy',
    consecutiveWins: 0,
    currentLevel: 1
  });
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const { isMuted } = useSound();
  const [selectedLetterIndex, setSelectedLetterIndex] = useState(-1);
  const [gameActive, setGameActive] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState({ message: '', type: 'info' as 'info' | 'success' | 'error' });

  // Game data
  const [startWord, setStartWord] = useState('');
  const [endWord, setEndWord] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [ladderWords, setLadderWords] = useState<string[]>([]);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [usedPairs, setUsedPairs] = useState<Set<string>>(new Set());
  const [wordCache, setWordCache] = useState<Map<string, boolean>>(new Map());
  const [currentSolutionPath, setCurrentSolutionPath] = useState<string[]>([]);

  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const feedbackTimeout = useRef<NodeJS.Timeout | null>(null);

  // Game configuration
  const config: GameConfig = {
    wordLength: {
      easy: 5,
      medium: 6,
      hard: 7
    },
    timeLimit: {
      easy: 300,
      medium: 240,
      hard: 180
    },
    scorePerStep: {
      easy: 50,
      medium: 75,
      hard: 100
    },
    bonusPerSecond: 5,
    maxHints: 3
  };

  // Word lists by length (fallback)
  const wordLists = {
    4: [
      'COLD', 'WARM', 'CORD', 'CARD', 'WARD', 'WORD', 'WORM', 'FARM', 'FIRE', 'FIVE',
      'FINE', 'LINE', 'LION', 'LOAN', 'LOIN', 'RAIN', 'MAIN', 'MAID', 'MILD', 'MIND'
    ],
    5: [
      'APPLE', 'AMPLY', 'AMBLE', 'ABLED', 'ABIDE', 'BRICK', 'TRICK', 'QUICK', 'SLICK',
      'FLICK', 'CLICK', 'STICK', 'THICK', 'PRICK', 'CRACK', 'TRACK', 'STACK', 'BLACK'
    ],
    6: [
      'CANNON', 'CANTON', 'CANTOR', 'CAPTOR', 'BLOOMS', 'GLOOMS', 'BROOMS', 'ROOMS',
      'DOOMS', 'FLOODS', 'BLOODS', 'MOODS', 'GOODS', 'HOODS', 'WOODS', 'STANDS'
    ]
  };

  // Alphabet for letter tiles
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Initialize game
  useEffect(() => {
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({ action: 'word_ladder_started', category: 'word_ladder', label: 'word_ladder' });
        clearInterval(checkGtag);
      }
    }, 100);
    loadGameState();
    initGame();
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
      if (feedbackTimeout.current) {
        clearTimeout(feedbackTimeout.current);
      }
    };
  }, []);

  // Load game state from localStorage
  const loadGameState = () => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('wordLadderGameState');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          if (['easy', 'medium', 'hard'].includes(parsed.difficulty) &&
            typeof parsed.consecutiveWins === 'number' &&
            typeof parsed.currentLevel === 'number') {
            setGameState(parsed);
          }
        } catch (e) {
          console.error('Invalid saved game state', e);
        }
      }
    }
  };

  // Save game state to localStorage
  const saveGameState = useCallback(() => {
    localStorage.setItem('wordLadderGameState', JSON.stringify(gameState));
  }, [gameState]);

  // Updated function to fetch from Supabase
  const fetchWordLadderFromSupabase = async (wordLength: number) => {
    try {
      const { data, error } = await supabase
        .from('word_ladders')
        .select('*')
        .eq('length', wordLength)
        .eq('difficulty', gameState.difficulty)
        .limit(100);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No ladders found');
      }

      const randomLadder = data[Math.floor(Math.random() * data.length)];

      return {
        startWord: randomLadder.start_word.toUpperCase(),
        endWord: randomLadder.end_word.toUpperCase(),
        path: randomLadder.path.map((w: string) => w.toUpperCase())
      };
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
      throw error;
    }
  };

  // Initialize game
  const initGame = async () => {
    if (timerInterval.current !== null) {
      window.clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
    setTimer(config.timeLimit[gameState.difficulty]);
    setScore(0);
    setLadderWords([]);
    setUsedWords(new Set());
    setWordCache(new Map());
    setHintsUsed(0);
    setGameActive(true);
    setSelectedLetterIndex(-1);
    setFeedback({ message: '', type: 'info' });

    const wordLength = config.wordLength[gameState.difficulty];

    try {
      const { startWord, endWord, path } = await fetchWordLadderFromSupabase(wordLength);

      setStartWord(startWord);
      setEndWord(endWord);
      setCurrentWord(startWord);
      setLadderWords([startWord]);
      setUsedWords(new Set([startWord]));
      setCurrentSolutionPath(path);

      startTimer();
      showFeedback('Game started! Transform the start word to the end word.', 'info');
    } catch (error) {
      console.error('Failed to fetch from Supabase, using local words:', error);
      initGameWithLocalWords(wordLength);
    }
  };

  const initGameWithLocalWords = (wordLength: number) => {
    const availableWords = wordLists[wordLength as keyof typeof wordLists] || [];
    let validPair = false;
    let attempts = 0;
    const maxAttempts = 50;

    let start = '';
    let end = '';

    while (!validPair && attempts < maxAttempts) {
      start = availableWords[Math.floor(Math.random() * availableWords.length)];
      const endCandidates = availableWords.filter(w => w !== start);

      if (endCandidates.length > 0) {
        end = endCandidates[Math.floor(Math.random() * endCandidates.length)];
        const pairKey = `${start}-${end}`;
        if (!usedPairs.has(pairKey)) {
          validPair = true;
          setUsedPairs(prev => new Set(prev).add(pairKey));
        }
      }
      attempts++;
    }

    if (!validPair) {
      const fallbackSequences = {
        4: [['COLD', 'CORD', 'CARD', 'WARD', 'WARM']],
        5: [['APPLE', 'AMPLY', 'AMBLE', 'ABLED', 'ABIDE']],
        6: [['CANNON', 'CANTON', 'CANTOR', 'CAPTOR']]
      };

      const sequences = fallbackSequences[wordLength as keyof typeof fallbackSequences] || [];
      for (const sequence of sequences) {
        const pairKey = `${sequence[0]}-${sequence[sequence.length - 1]}`;
        if (!usedPairs.has(pairKey)) {
          start = sequence[0];
          end = sequence[sequence.length - 1];
          setUsedPairs(prev => new Set(prev).add(pairKey));
          validPair = true;
          break;
        }
      }

      if (!validPair) {
        start = availableWords[0] || 'TEST';
        end = availableWords[1] || 'WORD';
      }
    }

    setStartWord(start);
    setEndWord(end);
    setCurrentWord(start);
    setLadderWords([start]);
    setUsedWords(prev => new Set(prev).add(start));
    setCurrentSolutionPath([start, end]);

    startTimer();
    showFeedback('Game started! Transform the start word to the end word.', 'info');
  };

  const selectLetter = (index: number) => {
    setSelectedLetterIndex(index);
    playSound('select');
  };

  const changeLetter = async (newLetter: string) => {
    if (selectedLetterIndex === -1 || !gameActive) return;

    const newWord = currentWord.substring(0, selectedLetterIndex) +
      newLetter +
      currentWord.substring(selectedLetterIndex + 1);

    if (await checkWord(newWord)) {
      setCurrentWord(newWord);
      setLadderWords(prev => [...prev, newWord]);
      setUsedWords(prev => new Set(prev).add(newWord));

      const points = config.scorePerStep[gameState.difficulty];
      setScore(prev => prev + points);
      playSound('found');

      if (newWord === endWord) {
        const timeBonus = timer * config.bonusPerSecond;
        setScore(prev => prev + timeBonus);

        if (timerInterval.current !== null) {
          window.clearInterval(timerInterval.current);
          timerInterval.current = null;
        }
        setGameActive(false);
        showFeedback(`You won! +${points} points + ${timeBonus} time bonus`, 'success');
        playSound('win');
        handleGameWin();
      } else {
        showFeedback(`Valid: ${newWord} (+${points} points)`, 'success');
      }

      setSelectedLetterIndex(-1);
    }
  };

  const updateTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (timerInterval.current !== null) {
      window.clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
    setTimer(config.timeLimit[gameState.difficulty]);
    timerInterval.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 0 && gameActive) {
          if (timerInterval.current !== null) {
            window.clearInterval(timerInterval.current);
            timerInterval.current = null;
          }
          setGameActive(false);
          showFeedback('Time\'s up!', 'error');
          playSound('error');
          setTimeout(initGame, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const showFeedback = (message: string, type: 'success' | 'error' | 'info') => {
    setFeedback({ message, type });
    if (feedbackTimeout.current) {
      clearTimeout(feedbackTimeout.current);
    }
    feedbackTimeout.current = setTimeout(() => {
      setFeedback({ message: '', type: 'info' });
    }, 3000);
    if (type === 'error') {
      playSound('error');
    }
  };

  // Updated checkWord function to use Merriam-Webster API
  const checkWord = async (word: string) => {
    if (!gameActive) return false;
    if (word.length !== currentWord.length) {
      showFeedback(`Word must be ${currentWord.length} letters long`, 'error');
      return false;
    }
    if (word === currentWord) {
      showFeedback('Word must be different from current word', 'error');
      return false;
    }
    if (usedWords.has(word)) {
      showFeedback('Word already used in this ladder', 'error');
      return false;
    }

    let diffCount = 0;
    for (let i = 0; i < currentWord.length; i++) {
      if (currentWord[i] !== word[i]) diffCount++;
      if (diffCount > 1) {
        showFeedback('Only one letter can be changed at a time', 'error');
        return false;
      }
    }

    let isValid = false;
    if (wordCache.has(word.toLowerCase())) {
      isValid = wordCache.get(word.toLowerCase())!;
    } else {
      try {
        // Use Merriam-Webster API similar to BoggleGame
        const response = await fetch(
          `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word.toLowerCase()}?key=${DICTIONARY_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        // Handle Merriam-Webster API response
        if (Array.isArray(data) && data.length > 0) {
          // Check each entry in the array
          for (const entry of data) {
            // If it's a string, it's a suggestion (not a valid entry)
            if (typeof entry === 'string') {
              continue;
            }

            // If it's an object with meta data, check if it matches our word
            if (typeof entry === 'object' && entry !== null) {
              // Check multiple possible ways the word might be represented
              const wordMatches =
                // Check meta.id (might be "word:1" format)
                (entry.meta?.id && entry.meta.id.split(':')[0].toUpperCase() === word.toUpperCase()) ||
                // Check hwi.hw (headword)
                (entry.hwi?.hw && entry.hwi.hw.replace(/\*/g, '').toUpperCase() === word.toUpperCase()) ||
                // Check stems array
                (entry.meta?.stems && entry.meta.stems.some((stem: string) => stem.toUpperCase() === word.toUpperCase()));

              if (wordMatches) {
                isValid = true;
                break;
              }
            }
          }
        }

        setWordCache(prev => new Map(prev).set(word.toLowerCase(), isValid));
      } catch (error) {
        console.error(`Error validating word "${word}":`, error);
        // Fallback to local word list
        isValid = wordLists[word.length as keyof typeof wordLists]?.includes(word.toUpperCase()) || false;
        setWordCache(prev => new Map(prev).set(word.toLowerCase(), isValid));

        if (!isValid) {
          showFeedback('Dictionary API unavailable. Using local word list.', 'info');
        }
      }
    }

    if (!isValid) {
      showFeedback('Not a valid English word', 'error');
      return false;
    }

    return true;
  };

  const provideHint = () => {
    if (!gameActive || hintsUsed >= config.maxHints) {
      showFeedback('No more hints available', 'error');
      return;
    }

    const currentIndex = currentSolutionPath.findIndex(word =>
      word === currentWord || countMatchingLetters(word, currentWord) >= currentWord.length - 1
    );

    if (currentIndex === -1 || currentIndex >= currentSolutionPath.length - 1) {
      showFeedback('No hints available for this step', 'error');
      return;
    }

    const nextWord = currentSolutionPath[currentIndex + 1];
    let changeIndex = -1;

    for (let i = 0; i < currentWord.length; i++) {
      if (currentWord[i] !== nextWord[i]) {
        changeIndex = i;
        break;
      }
    }

    setHintsUsed(prev => prev + 1);

    if (changeIndex !== -1) {
      setSelectedLetterIndex(changeIndex);
      showFeedback(
        `Change ${ordinal(changeIndex + 1)} letter to ${nextWord[changeIndex]} (→ ${nextWord})`,
        'info'
      );
    } else {
      showFeedback(`Next step: ${nextWord}`, 'info');
    }
  };

  const countMatchingLetters = (word1: string, word2: string) => {
    let count = 0;
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] === word2[i]) count++;
    }
    return count;
  };

  const ordinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const showConfetti = (options = {}) => {
    const defaults = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    };

    confetti({
      ...defaults,
      ...options
    });
  };

  const handleGameWin = () => {
    const newConsecutiveWins = gameState.consecutiveWins + 1;
    let newDifficulty = gameState.difficulty;
    let levelUp = false;
    let victoryMessage = '';

    if (newConsecutiveWins >= 3) {
      if (gameState.difficulty === 'easy') {
        newDifficulty = 'medium';
        levelUp = true;
        victoryMessage = `🎉 Advanced to Medium level! 🎉`;
      } else if (gameState.difficulty === 'medium') {
        newDifficulty = 'hard';
        levelUp = true;
        victoryMessage = `🎉 Advanced to Hard level! 🎉`;
      } else {
        victoryMessage = `🎉 Mastered Hard level! Continuing at max difficulty. 🎉`;
      }
    } else {
      victoryMessage = `🎉 Level ${gameState.currentLevel} Complete! 🎉`;
    }

    showConfetti();
    showFeedback(victoryMessage, 'success');

    setTimeout(() => {
      setGameState(prev => ({
        difficulty: levelUp ? newDifficulty : prev.difficulty,
        consecutiveWins: levelUp ? 0 : newConsecutiveWins,
        currentLevel: levelUp ? prev.currentLevel : prev.currentLevel + 1
      }));
      saveGameState();
      initGame();
    }, 3000);
  };

  const playSound = (type: string) => {
    if (isMuted) return;
    const sounds: Record<string, string> = {
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

  const triesLeftColor = timer <= 10 ? 'text-red-600 animate-pulse' : 'text-gray-700';

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Word Ladder Game</h2>
          <div className="text-gray-600 font-medium">
            Level: <span className="text-blue-600">{gameState.currentLevel}</span> • 
            Difficulty: <span className="text-blue-600 capitalize">{gameState.difficulty}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className={`text-lg md:text-xl font-bold ${triesLeftColor} bg-gray-50 px-4 py-2 rounded-lg border`}>
            ⏱️ {updateTimer()}
          </div>
          <div className="text-lg md:text-xl font-bold text-gray-900 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            Score: <span className="text-blue-600">{score}</span>
          </div>
        </div>
      </div>

      {/* Word Display */}
      <div className="mb-8">
        {/* Start and End Words */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Start Word</div>
            <div className="text-2xl md:text-3xl font-bold text-green-600 bg-green-50 px-6 py-3 rounded-lg border-2 border-green-300">
              {startWord}
            </div>
          </div>
          <div className="text-2xl text-gray-400">→</div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Target Word</div>
            <div className="text-2xl md:text-3xl font-bold text-red-600 bg-red-50 px-6 py-3 rounded-lg border-2 border-red-300">
              {endWord}
            </div>
          </div>
        </div>

        {/* Current Word */}
        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-2 text-center">Current Word (click a letter to change)</div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {currentWord.split('').map((letter, index) => (
              <LetterTile
                key={index}
                letter={letter}
                index={index}
                isSelected={selectedLetterIndex === index}
                onClick={selectLetter}
              />
            ))}
          </div>
        </div>

        {/* Alphabet Tiles (only shown when a letter is selected) */}
        {selectedLetterIndex !== -1 && (
          <div className="mb-8">
            <div className="text-sm text-gray-500 mb-2 text-center">Choose a new letter</div>
            <div className="flex flex-wrap justify-center gap-2">
              {alphabet.map((letter) => (
                <AlphabetTile
                  key={letter}
                  letter={letter}
                  onClick={changeLetter}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feedback Message */}
      {feedback.message && (
        <div className={`
          mb-6 p-4 rounded-lg border text-center font-medium
          ${feedback.type === 'error' 
            ? 'bg-red-50 border-red-200 text-red-800' 
            : feedback.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-blue-50 border-blue-200 text-blue-800'
          }
        `}>
          {feedback.message}
        </div>
      )}

      {/* Word Ladder History */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Word Ladder Progress</h3>
        <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {ladderWords.map((word, index) => (
              <div
                key={index}
                className={`
                  px-3 py-2 rounded-lg font-medium transition-all
                  ${index === 0 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : index === ladderWords.length - 1 
                    ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                  }
                  ${index === ladderWords.length - 1 ? 'animate-pulse' : ''}
                `}
              >
                {word}
                {index < ladderWords.length - 1 && (
                  <span className="ml-2 text-gray-400">→</span>
                )}
              </div>
            ))}
          </div>
          {ladderWords.length === 1 && (
            <p className="text-gray-500 text-sm text-center mt-2">
              Start by changing one letter at a time to reach the target word
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
       <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
          <button 
            onClick={() => initGame()}
            className="px-6 md:px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            New Game
          </button>
          <button 
            onClick={provideHint}
            disabled={hintsUsed >= config.maxHints || !gameActive}
            className={`
              px-5 py-2.5 bg-gradient-to-r text-white font-bold rounded-xl active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl
              ${hintsUsed >= config.maxHints || !gameActive
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
              }
              `}
          >
            Hint ({config.maxHints - hintsUsed} left)
          </button>
      </div>

      {/* Game Instructions */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-2">How to Play:</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">1.</span>
            <span>Click on a letter in the current word to select it</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">2.</span>
            <span>Choose a new letter from the alphabet to change it</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">3.</span>
            <span>Each step must create a valid English word by changing only one letter</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">4.</span>
            <span>Reach the target word to win and earn bonus points for remaining time</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">5.</span>
            <span>Use hints wisely - you only have {config.maxHints} per game</span>
          </li>
        </ul>
      </div>
    </div>
  );
}