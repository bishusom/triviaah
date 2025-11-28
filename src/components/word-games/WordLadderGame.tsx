'use client';
import { event } from '@/lib/gtag';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { createClient } from '@supabase/supabase-js';
import { useSound } from '@/context/SoundContext';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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

export default function WordLadderGame() {
  // Refs
  const currentWordRef = useRef<HTMLDivElement>(null);
  const letterTilesRef = useRef<HTMLDivElement>(null);
  const wordListRef = useRef<HTMLUListElement>(null);

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
  const [feedback, setFeedback] = useState<{ message: string; type: 'info' | 'success' | 'error' }>({ 
          message: '', 
          type: 'info' 
        });

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

  // Game configuration
  const config: GameConfig = {
    wordLength: {
      easy: 4,
      medium: 5,
      hard: 6
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

  // Initialize game
  useEffect(() => {
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'word_ladder_started', category: 'word_ladder',label: 'word_ladder'});
        clearInterval(checkGtag);
      }
    }, 100)
    loadGameState();
    initGame();
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
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
  const saveGameState = () => {
    localStorage.setItem('wordLadderGameState', JSON.stringify(gameState));
  };

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
    const availableWords = wordLists[wordLength as keyof typeof wordLists];
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
        const pairKey = `${sequence[0]}-${sequence[sequence.length-1]}`;
        if (!usedPairs.has(pairKey)) {
          start = sequence[0];
          end = sequence[sequence.length-1];
          setUsedPairs(prev => new Set(prev).add(pairKey));
          validPair = true;
          break;
        }
      }

      if (!validPair) {
        start = availableWords[0];
        end = availableWords[1];
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

  const renderCurrentWord = () => {
    if (!currentWordRef.current) return;
    currentWordRef.current.innerHTML = '';
    
    for (let i = 0; i < currentWord.length; i++) {
      const letterSpan = document.createElement('span');
      letterSpan.textContent = currentWord[i];
      letterSpan.className = `inline-flex items-center justify-center w-12 h-12 mx-1 border-2 rounded-lg font-bold text-xl cursor-pointer transition-all duration-200 ${
        i === selectedLetterIndex 
          ? 'bg-yellow-400 border-yellow-500 text-gray-900 scale-110' 
          : 'bg-blue-100 border-blue-300 text-gray-800 hover:bg-blue-200'
      }`;
      letterSpan.addEventListener('click', () => selectLetter(i));
      currentWordRef.current.appendChild(letterSpan);
    }
  };

  const renderLetterTiles = () => {
    if (!letterTilesRef.current) return;
    letterTilesRef.current.innerHTML = '';
    if (selectedLetterIndex === -1) return;

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (const letter of alphabet) {
      const tile = document.createElement('div');
      tile.textContent = letter;
      tile.className = 'inline-flex items-center justify-center w-10 h-10 mx-1 my-1 bg-gray-200 border-2 border-gray-300 rounded-lg font-bold text-lg cursor-pointer hover:bg-gray-300 transition-colors duration-200';
      tile.addEventListener('click', () => changeLetter(letter));
      letterTilesRef.current.appendChild(tile);
    }
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

  const renderWordList = () => {
    if (!wordListRef.current) return;
    wordListRef.current.innerHTML = '';
    ladderWords.forEach((word, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${word}`;
      li.className = 'py-1 px-3 bg-gray-700/50 rounded text-white font-mono';
      wordListRef.current?.appendChild(li);
    });
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

  const showFeedback = (message: string, type: 'info' | 'success' | 'error') => {
    setFeedback({ message, type });
    if (type === 'error') {
      playSound('error');
    }
  };

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
        const response = await fetch(
          `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word.toLowerCase()}?key=${DICTIONARY_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          for (const entry of data) {
            if (typeof entry === 'string') {
              continue;
            }
            
            if (typeof entry === 'object' && entry !== null) {
              const wordMatches = 
                (entry.meta?.id && entry.meta.id.split(':')[0].toUpperCase() === word.toUpperCase()) ||
                (entry.hwi?.hw && entry.hwi.hw.replace(/\*/g, '').toUpperCase() === word.toUpperCase()) ||
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

  // Update renders when state changes
  useEffect(() => {
    renderCurrentWord();
    renderLetterTiles();
    renderWordList();
  }, [currentWord, selectedLetterIndex, ladderWords]);

  // Feedback style mapping
  const getFeedbackStyle = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'error':
        return 'bg-red-500/20 border border-red-500/50 text-red-200';
      case 'success':
        return 'bg-green-500/20 border border-green-500/50 text-green-200';
      case 'info':
        return 'bg-blue-500/20 border border-blue-500/50 text-blue-200';
      default:
        return 'bg-gray-500/20 border border-gray-500/50 text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray=900 text-white p-4 md:p-6 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Word Ladder Game</h2>
          <div className="text-lg text-gray-300">
            Level: {gameState.currentLevel} ({gameState.difficulty})
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`text-xl font-bold px-4 py-2 rounded-lg ${
            timer <= 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-700 text-yellow-400'
          }`}>
            ⏱️ {updateTimer()}
          </div>
          <div className="text-xl font-bold bg-gray-700 text-green-400 px-4 py-2 rounded-lg">
            Score: {score}
          </div>
        </div>
      </div>

      {/* Word Display */}
      <div className="text-center mb-6">
        {/* FIXED: Start and End words display */}
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="text-2xl font-bold bg-blue-600 text-white px-6 py-3 rounded-lg">
            {startWord}
          </div>
          <div className="text-2xl text-yellow-400 font-bold">→</div>
          <div className="text-2xl font-bold bg-green-600 text-white px-6 py-3 rounded-lg">
            {endWord}
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Current Word:</h3>
          <div ref={currentWordRef} className="flex justify-center gap-2"></div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Change Letter To:</h3>
          <div ref={letterTilesRef} className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto"></div>
        </div>
      </div>

      {/* Feedback */}
      {feedback.message && (
        <div className={`mb-6 p-4 rounded-lg text-center font-medium ${getFeedbackStyle(feedback.type)}`}>
          {feedback.message}
        </div>
      )}

      {/* Word List */}
      <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-3 text-center">Word Ladder Progress:</h3>
        <ul ref={wordListRef} className="flex flex-wrap gap-2 justify-center"></ul>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button 
          onClick={initGame}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          New Game
        </button>
        <button 
          onClick={provideHint}
          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Hint ({config.maxHints - hintsUsed} left)
        </button>
      </div>
    </div>
  );
}