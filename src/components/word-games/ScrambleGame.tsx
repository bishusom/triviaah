'use client';
import { event } from '@/lib/gtag';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { createClient } from '@supabase/supabase-js';
import { useSound } from '@/context/SoundContext';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type DifficultyLevel = {
  difficulty: string;
  wordLength: number[];
  games: number;
  timeLimit: number;
};

export default function ScrambleGame() {
  // Game state
  const [baseWord, setBaseWord] = useState('');
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<number[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [usedBaseWords, setUsedBaseWords] = useState<string[]>([]);
  const [timer, setTimer] = useState(0);
  const { isMuted } = useSound();
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [wordSolved, setWordSolved] = useState(false);

  // Level system
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gamesCompletedInCurrentDifficulty, setGamesCompletedInCurrentDifficulty] = useState(0);
  
  const levels: DifficultyLevel[] = useMemo(() => [
    { difficulty: 'easy', wordLength: [6, 7], games: 3, timeLimit: 240 },
    { difficulty: 'medium', wordLength: [8, 9], games: 3, timeLimit: 300 },
    { difficulty: 'hard', wordLength: [10, 11, 12], games: 3, timeLimit: 500 }
  ], []);
  const prevDifficulty = useRef<DifficultyLevel | null>(null);

  const totalGames = useMemo(() => levels.reduce((sum, level) => sum + level.games, 0), [levels]);

  // Refs
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const audioElements = useRef<Record<string, string>>({
    select: '/sounds/click.mp3',
    found: '/sounds/correct.mp3',
    win: '/sounds/win.mp3',
    error: '/sounds/incorrect.mp3'
  });

  // Helper functions
  const scrambleWord = useCallback((word: string) => {
    const letters = word.split('');
    let scrambled;
    do {
      scrambled = [...letters];
      for (let i = scrambled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
      }
    } while (scrambled.join('') === word);
    return scrambled.join('');
  }, []);

  const playSound = useCallback((type: keyof typeof audioElements.current) => {
    if (isMuted) return;
    try {
      const audio = new Audio(audioElements.current[type]);
      audio.play().catch(err => console.error(`Error playing ${type} sound:`, err));
    } catch (error) {
      console.error('Sound error:', error);
    }
  }, [isMuted]);

  const showFeedback = useCallback((message: string, type: string) => {
    setFeedback({ message, type });
  }, []);

  const getCurrentDifficulty = useCallback((level: number) => {
    let gamesCount = 0;
    for (const l of levels) {
      gamesCount += l.games;
      if (level <= gamesCount) {
        return l;
      }
    }
    return levels[0];
  }, [levels]);

  const showConfetti = useCallback((options = {}) => {
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
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const calculateScore = useCallback((word: string) => {
    return word.length * 5;
  }, []);

  // Timer management
  const startTimer = useCallback((timeLimit: number) => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }

    setTimer(timeLimit);
    
    timerInterval.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          if (timerInterval.current) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
          }
          showFeedback('Time\'s up!', 'error');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [showFeedback]);

  const stopTimer = useCallback(() => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  }, []);

  // Game progression
  const checkLevelProgress = useCallback(() => {
    const newGamesCompleted = gamesCompletedInCurrentDifficulty + 1;
    setGamesCompletedInCurrentDifficulty(newGamesCompleted);

    const currentDifficulty = getCurrentDifficulty(currentLevel);
    
    if (currentDifficulty && newGamesCompleted >= currentDifficulty.games) {
      const newLevel = currentLevel + 1;
      setCurrentLevel(newLevel);
      setGamesCompletedInCurrentDifficulty(0);
      showConfetti({ particleCount: 200, spread: 100 });
      const next = getCurrentDifficulty(currentLevel + 1);
      showFeedback(
        `Level-up!  Next: ${next?.difficulty ?? 'finished'} difficulty`,
        'success'
      );
      
      if (newLevel > totalGames) {
        playSound('win');
        showConfetti({ particleCount: 200, spread: 100 });
        showFeedback('Congratulations! You completed all levels!', 'success');
        setTimeout(() => {
          setCurrentLevel(1);
          setGamesCompletedInCurrentDifficulty(0);
          setUsedBaseWords([]);
          setScore(0);
        }, 5000);
        return;
      }
    }
  }, [gamesCompletedInCurrentDifficulty, currentLevel, totalGames, playSound, showConfetti, getCurrentDifficulty, showFeedback]);

  // Game actions
  const selectLetter = useCallback((index: number) => {
    if (currentWord.includes(index)) return;
    setCurrentWord(prev => [...prev, index]);
    playSound('select');
  }, [currentWord, playSound]);

  const submitWord = useCallback(() => {
    if (timer === 0 && timerInterval.current === null) {
      showFeedback('Game over! Start a new word.', 'error');
      return;
    }

    if (currentWord.length === 0) {
      showFeedback('Please select some letters first', 'error');
      playSound('error');
      return;
    }

    const word = currentWord.map(index => scrambledLetters[index]).join('');

    if (word.length !== baseWord.length) {
      showFeedback(`Word must be ${baseWord.length} letters`, 'error');
      playSound('error');
      return;
    }

    if (word === baseWord) {
      const newScore = score + calculateScore(word);
      setFoundWords(prev => [...prev, word]);
      setWordSolved(true);
      setScore(newScore);
      showFeedback(`Correct! You found the word! +${calculateScore(word)} points`, 'success');
      playSound('found');
      stopTimer();
      showConfetti();

      setTimeout(() => {
        checkLevelProgress();
      }, 2500);
    } else {
      showFeedback('Not the correct word', 'error');
      playSound('error');
    }
  }, [currentWord, scrambledLetters, baseWord, score, calculateScore, showFeedback, playSound, showConfetti, checkLevelProgress, stopTimer, timer]);

  const clearCurrentAttempt = useCallback(() => {
    setCurrentWord([]);
  }, []);

  const shuffleLetters = useCallback(() => {
    setScrambledLetters(scrambleWord(baseWord).split(''));
  }, [baseWord, scrambleWord]);

  const showHint = useCallback(() => {
    if (foundWords.includes(baseWord)) {
      showFeedback('You already found the word!', 'info');
    } else {
      const hint = baseWord.split('').slice(0, 2).join('');
      showFeedback(`Try starting with: ${hint}...`, 'info');
    }
  }, [foundWords, baseWord, showFeedback]);

  const giveUp = useCallback(() => {
    stopTimer();
    showFeedback(`The word was: ${baseWord}`, 'info');
    
    if (!foundWords.includes(baseWord)) {
      setFoundWords(prev => [...prev, baseWord]);
    }
    
    setCurrentWord([]);
    playSound('error');
    
    setTimeout(() => {
      checkLevelProgress();
    }, 3000);
  }, [baseWord, foundWords, showFeedback, playSound, stopTimer, checkLevelProgress]);

  // Main game initialization
  const initGame = useCallback(async () => {
    try {
      stopTimer();

      const currentDifficulty = getCurrentDifficulty(currentLevel);
      if (!currentDifficulty) return;

      if (prevDifficulty.current?.difficulty !== currentDifficulty.difficulty) {
        setUsedBaseWords([]);
        prevDifficulty.current = currentDifficulty;
      }

      const wordLength =
        currentDifficulty.wordLength[
          Math.floor(Math.random() * currentDifficulty.wordLength.length)
        ];

      let newBaseWord = '';

      try {
        const randomFloor = Math.floor(Math.random() * 900_000);
        const { data, error } = await supabase
          .from('dictionary')
          .select('word')
          .eq('length', wordLength)
          .eq('is_common', true)
          .gte('random_index', randomFloor)
          .order('random_index')
          .limit(50);

        if (!error && data?.length) {
          const available = data
            .map((i) => i.word.toUpperCase())
            .filter((w) => !usedBaseWords.includes(w));
          if (available.length) {
            newBaseWord = available[Math.floor(Math.random() * available.length)];
          }
        }
      } catch (e) {
        console.warn('Supabase fetch failed, using local list', e);
      }

      if (!newBaseWord) {
        const localList = [
          'PICTURE','SILENCE','CAPTURE','MOUNTAIN','ADVENTURE',
          'DISCOVERY','STANDARD','PARADISE','ELEPHANT','HOSPITAL',
          'BIRTHDAY','COMPUTER','TELEPHONE','BUTTERFLY','UNIVERSE'
        ]
          .filter((w) => w.length === wordLength && !usedBaseWords.includes(w));

        if (localList.length) {
          newBaseWord = localList[Math.floor(Math.random() * localList.length)];
        }
      }

      if (!newBaseWord) {
        setUsedBaseWords([]);
        newBaseWord =
          ['PICTURE','SILENCE','CAPTURE','MOUNTAIN','ADVENTURE'][0] ?? 'EXAMPLE';
      }

      setBaseWord(newBaseWord);
      setUsedBaseWords((prev) => [...prev, newBaseWord]);
      setScrambledLetters(scrambleWord(newBaseWord).split(''));
      setFoundWords([]);
      setCurrentWord([]);
      showFeedback('Unscramble the letters to form a valid word!', 'info');
      startTimer(currentDifficulty.timeLimit);
    } catch (err) {
      console.error('initGame crash', err);
      showFeedback('Error starting game', 'error');
    }
  }, [
    currentLevel,
    usedBaseWords,
    getCurrentDifficulty,
    scrambleWord,
    showFeedback,
    startTimer,
    stopTimer
  ]);

  // Initialize game on mount
  useEffect(() => {
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({ action: 'word_scramble_started', category: 'word_scramble', label: 'word_scramble' });
        clearInterval(checkGtag);
      }
    }, 100);

    initGame();

    return () => stopTimer();
  }, []);   

  // Effect to handle game completion and start new game
  useEffect(() => {
    if (!wordSolved) return;
    const t = setTimeout(() => {
      setWordSolved(false);
      initGame();
    }, 2000);
    return () => clearTimeout(t);
  }, [wordSolved, initGame]);

  const newWord = useCallback(() => {
    stopTimer();
    initGame();
  }, [initGame, stopTimer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray=900 text-white p-4 md:p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Word Scramble
            </h1>
            <div className="text-sm md:text-base text-gray-300 mt-1">
              Level: {currentLevel} ({getCurrentDifficulty(currentLevel).difficulty})
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className={`bg-gray-900/80 px-4 py-2 rounded-lg border border-gray-700 font-mono text-lg ${
              timer <= 10 ? 'text-red-400 animate-pulse' : 'text-white'
            }`}>
              ⏱️ {formatTime(timer)}
            </div>
            <div className="bg-gray-900/80 px-4 py-2 rounded-lg border border-gray-700 font-mono text-lg">
              Score: {score}
            </div>
          </div>
        </div>

        {/* Scrambled Letters Grid */}
        <div className="bg-gray-800/30 rounded-2xl p-6 md:p-8 mb-6 backdrop-blur-sm border border-gray-700/50">
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center mb-6">
            {scrambledLetters.map((letter, index) => (
              <button
                key={index}
                onClick={() => selectLetter(index)}
                disabled={currentWord.includes(index)}
                className={`
                  w-12 h-12 md:w-16 md:h-16 flex items-center justify-center
                  text-xl md:text-2xl font-bold rounded-xl transition-all duration-200
                  border-2
                  ${currentWord.includes(index) 
                    ? 'bg-gray-600 text-gray-400 border-gray-500 cursor-not-allowed' 
                    : 'bg-gray-700/80 text-white border-gray-600 hover:bg-blue-600 hover:border-blue-400 hover:scale-105 cursor-pointer'}
                `}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Current Attempt */}
          <div className="mb-6">
            <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-200 text-center">Current Attempt:</h3>
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center min-h-16 bg-gray-700/30 rounded-xl p-4 border border-gray-600/50">
              {currentWord.map((index, i) => (
                <span key={i} className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-xl md:text-2xl font-bold rounded-xl bg-blue-600 text-white border-2 border-blue-400">
                  {scrambledLetters[index]}
                </span>
              ))}
              {currentWord.length === 0 && (
                <div className="text-gray-400 text-lg flex items-center justify-center">
                  Select letters to form the word
                </div>
              )}
            </div>
          </div>

          {/* Feedback Message */}
          {feedback.message && (
            <div className={`text-center text-lg font-medium p-4 rounded-xl border backdrop-blur-sm mb-6 ${
              feedback.type === 'error' ? 'bg-red-500/20 text-red-300 border-red-500/50' : 
              feedback.type === 'success' ? 'bg-green-500/20 text-green-300 border-green-500/50' : 
              'bg-blue-500/20 text-blue-300 border-blue-500/50'
            }`}>
              {feedback.message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button 
              onClick={submitWord}
              className="px-6 md:px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Submit
            </button>
            <button 
              onClick={clearCurrentAttempt}
              className="px-6 md:px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Clear
            </button>
            <button 
              onClick={shuffleLetters}
              className="px-6 md:px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Shuffle
            </button>
            <button 
              onClick={showHint}
              className="px-6 md:px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Hint
            </button>
            <button 
              onClick={giveUp}
              className="px-6 md:px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Give Up
            </button>
            <button 
              onClick={newWord}
              className="px-6 md:px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              New Word
            </button>
          </div>
        </div>

        {/* Found Words */}
        {foundWords.length > 0 && (
          <div className="bg-gray-800/50 rounded-2xl p-4 md:p-6 mb-6 backdrop-blur-sm border border-gray-700">
            <h3 className="text-lg md:text-xl font-bold text-center mb-4 text-gray-200">Found Words:</h3>
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
              {foundWords.map((word, i) => (
                <span key={i} className="px-3 md:px-4 py-2 bg-green-600/20 text-green-300 rounded-lg font-medium border border-green-500/50">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* How to Play */}
        <div className="bg-gray-800/50 rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-gray-700">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-gray-200">How to Play</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Click on letters to unscramble them and form the correct word</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Complete words before time runs out</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Progress through easy, medium, and hard difficulty levels</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Use hints if you get stuck (shows first 2 letters)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Shuffle the letters for a different view</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Earn points based on word length (5 points per letter)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}