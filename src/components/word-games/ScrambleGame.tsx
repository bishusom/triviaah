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
          // Don't auto-progress here, let user click "New Word"
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
      //showFeedback(`Level up! Now at ${getCurrentDifficulty(newLevel).difficulty} difficulty`, 'success');
      
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
    // Prevent submission if word was revealed or timer is stopped
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
    
    // Disable further interactions and move to next word after delay
    setTimeout(() => {
      checkLevelProgress();
    }, 3000);
  }, [baseWord, foundWords, showFeedback, playSound, stopTimer, checkLevelProgress]);

  // Main game initialization - simplified to avoid loops
  const initGame = useCallback(async () => {
    try {
      stopTimer();

      const currentDifficulty = getCurrentDifficulty(currentLevel);
      if (!currentDifficulty) return;

      /* 1.  Clear used words when we just changed difficulty ---------- */
      if (prevDifficulty.current?.difficulty !== currentDifficulty.difficulty) {
        setUsedBaseWords([]);
        prevDifficulty.current = currentDifficulty;
      }

      const wordLength =
        currentDifficulty.wordLength[
          Math.floor(Math.random() * currentDifficulty.wordLength.length)
        ];

      let newBaseWord = '';

      /* 2.  Try Supabase first --------------------------------------- */
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

      /* 3.  Fallback local list -------------------------------------- */
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

      /* 4.  Last-resort reset --------------------------------------- */
      if (!newBaseWord) {
        setUsedBaseWords([]);                 // wipe and retry
        newBaseWord =
          ['PICTURE','SILENCE','CAPTURE','MOUNTAIN','ADVENTURE'][0] ?? 'EXAMPLE';
      }

      /* 5.  Update board -------------------------------------------- */
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

    initGame();                 // first board

    return () => stopTimer();   // clean-up
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
    <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Word Scramble Game</h2>
          <div className="text-lg font-semibold text-gray-600">
            Level: {currentLevel} ({getCurrentDifficulty(currentLevel).difficulty})
          </div>
        </div>
         <div className="flex items-center gap-4">
          <div className={`text-lg font-semibold ${timer <= 10 ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
            ⏱️ {formatTime(timer)}
          </div>
          <div className="text-lg font-semibold text-gray-800">
            Score: {score}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {scrambledLetters.map((letter, index) => (
            <button
                key={index}
                onClick={() => selectLetter(index)}
                disabled={currentWord.includes(index)}
                className={`
                    w-14 h-14
                    flex items-center justify-center
                    text-2xl font-bold rounded-lg
                    ${currentWord.includes(index) 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'}
                    transition-all duration-200
                `}
                >
                {letter}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Current Attempt:</h3>
          <div className="flex flex-wrap gap-2 min-h-14">
            {currentWord.map((index, i) => (
              <span key={i} className="w-14 h-14 flex items-center justify-center text-2xl font-bold rounded-lg bg-blue-200 text-gray-800">
                {scrambledLetters[index]}
              </span>
            ))}
          </div>
        </div>

        {feedback.message && (
          <div className={`p-4 rounded-lg mb-4 font-mono text-lg ${
            feedback.type === 'error' ? 'bg-red-100 text-red-700' : 
            feedback.type === 'success' ? 'bg-green-100 text-green-700' : 
            'bg-blue-50 text-blue-700'
          }`}>
            {feedback.message}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={submitWord}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold"
        >
          Submit
        </button>
        <button 
          onClick={clearCurrentAttempt}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-semibold"
        >
          Clear
        </button>
        <button 
          onClick={shuffleLetters}
          className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all font-semibold"
        >
          Shuffle
        </button>
        <button 
          onClick={showHint}
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all font-semibold"
        >
          Hint
        </button>
        <button 
          onClick={giveUp}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-semibold"
        >
          Give Up
        </button>
        <button 
          onClick={newWord}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold"
        >
          New Word
        </button>
      </div>

      {foundWords.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Found Words:</h3>
          <div className="flex flex-wrap gap-2">
            {foundWords.map((word, i) => (
              <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">How to Play</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Click on letters to unscramble them and form the correct word</li>
          <li>Complete words before time runs out</li>
          <li>Progress through easy, medium, and hard difficulty levels</li>
          <li>Use hints if you get stuck (shows first 2 letters)</li>
          <li>Shuffle the letters for a different view</li>
          <li>Earn points based on word length (5 points per letter)</li>
        </ul>
      </div>
    </div>
  );
}