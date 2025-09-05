'use client';
import { event } from '@/lib/gtag';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { db } from '@/lib/firebase'; // Import your Firebase config
import { useSound } from '@/context/SoundContext';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import gameStyles from '@styles/WordGames/ScrambleGame.module.css';
import commonStyles from '@styles/WordGames/WordGames.common.module.css';

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

  // Level system
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gamesCompletedInCurrentDifficulty, setGamesCompletedInCurrentDifficulty] = useState(0);
  const levels: DifficultyLevel[] = [
    { difficulty: 'easy', wordLength: [6, 7], games: 3, timeLimit: 240 },
    { difficulty: 'medium', wordLength: [8, 9], games: 3, timeLimit: 300 },
    { difficulty: 'hard', wordLength: [10, 11, 12], games: 3, timeLimit: 500 }
  ];
  const totalGames = levels.reduce((sum, level) => sum + level.games, 0);

  
  // Refs for sounds and timer
  const timerInterval = useRef<NodeJS.Timeout| null>(null)
  const audioElements = useRef<Record<string, string>>({
    select: '/sounds/click.mp3',
    found: '/sounds/correct.mp3',
    win: '/sounds/win.mp3',
    error: '/sounds/incorrect.mp3'
   }); 

  // Helper functions
  const scrambleWord = (word: string) => {
    // Convert word to array of characters
    const letters = word.split('');
    
    // Keep shuffling until we get a different arrangement
    let scrambled;
    do {
      scrambled = [...letters];
      // Fisher-Yates shuffle algorithm
      for (let i = scrambled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
      }
    } while (scrambled.join('') === word); // Keep trying if same as original

    return scrambled.join('');
  };

  const playSound = (type: keyof typeof audioElements.current) => {
    if (isMuted) return;
    try {
      const audio = new Audio(audioElements.current[type]);
      audio.play().catch(err => console.error(`Error playing ${type} sound:`, err));
    } catch (error) {
      console.error('Sound error:', error);
    }
  };

  const showFeedback = (message: string, type: string) => {
    setFeedback({ message, type });
  };

  // Timer functions
  const startTimer = () => {
    if (timerInterval.current !== null) {
      window.clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
    const currentDifficulty = getCurrentDifficulty(currentLevel);
    if (!currentDifficulty) return;

    setTimer(currentDifficulty.timeLimit);
    
    timerInterval.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          timerInterval.current = null;
          showFeedback('Time\'s up!', 'error');
          setTimeout(checkLevelProgress, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const setupNewGame = (word: string) => {
    setBaseWord(word);
    setUsedBaseWords(prev => [...prev, word]);
    
    // Get a scrambled version that's definitely different
    const scrambled = scrambleWord(word);
    setScrambledLetters(scrambled.split(''));
    
    setFoundWords([]);
    setCurrentWord([]);
    showFeedback('Unscramble the letters to form a valid word!', 'info');
    startTimer();
  };

  // Game logic
  const initGame = async () => {
    try {
        const currentDifficulty = getCurrentDifficulty(currentLevel);
        if (!currentDifficulty) return;

        const wordLength = currentDifficulty.wordLength[
        Math.floor(Math.random() * currentDifficulty.wordLength.length)
        ];

        try {
            const randomFloor = Math.floor(Math.random() * 900000);
            const q = query(
            collection(db, 'dictionary'),
            where('length', '==', wordLength),
            where('isCommon', '==', true),
            where('randomIndex', '>=', randomFloor),
            orderBy('randomIndex'),
            limit(50)
            );

            const querySnapshot = await getDocs(q);
            const wordList: string[] = [];

            querySnapshot.forEach((doc) => {
            const data = doc.data();
            const word = data.word.toUpperCase();
            if (!usedBaseWords.includes(word)) {
                wordList.push(word);
            }
            });

            if (wordList.length > 0) {
            const newBaseWord = wordList[Math.floor(Math.random() * wordList.length)];
            return setupNewGame(newBaseWord);
            }
        } catch (firestoreError) {
            console.log('Using fallback word list due to Firestore error:', firestoreError);
      }
        // Updated word list with more options
        const localWordList = [
        'PICTURE', 'SILENCE', 'CAPTURE', 'MOUNTAIN', 'ADVENTURE', 
        'DISCOVERY', 'STANDARD', 'PARADISE', 'ELEPHANT', 'HOSPITAL',
        'BIRTHDAY', 'COMPUTER', 'TELEPHONE', 'BUTTERFLY', 'UNIVERSE'
        ].filter(word => word.length === wordLength && !usedBaseWords.includes(word));

        if (localWordList.length === 0) {
        console.log('Resetting used words for new game');
        setUsedBaseWords([]);
        return initGame();
        }

        const newBaseWord = localWordList[Math.floor(Math.random() * localWordList.length)];
        setBaseWord(newBaseWord);
        setUsedBaseWords(prev => [...prev, newBaseWord]);
        setScrambledLetters(scrambleWord(newBaseWord).split(''));
        setFoundWords([]);
        setCurrentWord([]);
        showFeedback('Unscramble the letters to form the correct word!', 'info');
        startTimer();
    } catch (error) {
        console.error('Error initializing game:', error);
        showFeedback('Error starting game', 'error');
    }
    };

  const selectLetter = (index: number) => {
    if (currentWord.includes(index)) return;
    setCurrentWord(prev => [...prev, index]);
    playSound('select');
  };

  const submitWord = () => {
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
      setScore(newScore);
      showFeedback(`Correct! You found the word! +${calculateScore(word)} points`, 'success');
      playSound('found');
      if (timerInterval.current !== null) {
        window.clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
      showConfetti();

      setTimeout(() => {
        checkLevelProgress();
      }, 2500);
    } else {
      showFeedback('Not the correct word', 'error');
      playSound('error');
    }
  };

  const calculateScore = (word: string) => {
    return word.length * 5;
  };

  const clearCurrentAttempt = () => {
    setCurrentWord([]);
  };

  const shuffleLetters = () => {
    setScrambledLetters(scrambleWord(baseWord).split(''));
  };

  const showHint = () => {
    if (foundWords.includes(baseWord)) {
      showFeedback('You already found the word!', 'info');
    } else {
      const hint = baseWord.split('').slice(0, 2).join('');
      showFeedback(`Try starting with: ${hint}...`, 'info');
    }
  };

  const revealWord = () => {
    // Stop the timer
    if (timerInterval.current !== null) {
      window.clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
    
    // Show the correct word
    showFeedback(`The word was: ${baseWord}`, 'info');
    
    // Mark the word as found if not already
    if (!foundWords.includes(baseWord)) {
      setFoundWords(prev => [...prev, baseWord]);
    }
    
    // Disable all letter buttons
    setCurrentWord([]);
    
    // Play sound effect
    playSound('error'); // or create a new sound for reveal
    
    // Auto-start a new game after delay
    setTimeout(() => {
      checkLevelProgress();
    }, 3000);
  };

  const getCurrentDifficulty = (level: number) => {
    let gamesCount = 0;
    for (const l of levels) {
      gamesCount += l.games;
      if (level <= gamesCount) {
        return l;
      }
    }
    return levels[0]; // fallback to first level
  };

  const checkLevelProgress = () => {
    const newGamesCompleted = gamesCompletedInCurrentDifficulty + 1;
    setGamesCompletedInCurrentDifficulty(newGamesCompleted);

    const currentDifficulty = levels.find(level => 
      currentLevel <= level.games + levels.slice(0, levels.indexOf(level)).reduce((sum, l) => sum + l.games, 0)
    );

    if (currentDifficulty && newGamesCompleted >= currentDifficulty.games) {
      setCurrentLevel(prev => prev + 1);
      setGamesCompletedInCurrentDifficulty(0);
      showConfetti({ particleCount: 200, spread: 100 });
    }

    if (currentLevel >= totalGames) {
      playSound('win');
      showConfetti({ particleCount: 200, spread: 100 });
      setTimeout(() => {
        setCurrentLevel(1);
        setGamesCompletedInCurrentDifficulty(0);
        setUsedBaseWords([]);
        setScore(0);
        initGame();
      }, 5000);
    } else {
      initGame();
    }
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

  // Initialize game on mount
  useEffect(() => {
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'word_scramble_started', category: 'word_scramble',label: 'word_scramble'});
        clearInterval(checkGtag);
      }
    }, 100)
    initGame();
    return () => {
        if (timerInterval.current !== null) {
          window.clearInterval(timerInterval.current);
          timerInterval.current = null;
        }
    };
  }, []);

  return (
    <div className={`${commonStyles.container}`}>
      <div className={`${commonStyles.header}`}>
        <div>
          <h1 className={commonStyles.title}>Word Scramble Game</h1>
          <div className={commonStyles.levelText}>
            Level: {currentLevel} ({getCurrentDifficulty(currentLevel).difficulty})
          </div>
        </div>
         <div className="flex items-center gap-4">
          <div className={`${commonStyles.timerContainer} ${timer <= 10 ? commonStyles.timeCritical : ''}`}>
            ⏱️ {formatTime(timer)}
          </div>
          <div className={commonStyles.scoreText}>
            Score: {score}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4" id="scrambled-letters">
          {scrambledLetters.map((letter, index) => (
            <button
                key={index}
                onClick={() => selectLetter(index)}
                disabled={currentWord.includes(index)}
                className={`
                    w-letter-tile h-letter-tile
                    flex items-center justify-center
                    text-2xl font-bold rounded-lg
                    ${currentWord.includes(index) 
                    ? 'bg-gray-200 cursor-not-allowed' 
                    : 'bg-blue-100 hover:bg-blue-200 cursor-pointer'}
                    transition-colors duration-200
                `}
                >
                {letter}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Current Attempt:</h3>
          <div className="flex flex-wrap gap-2 min-h-10" id="current-attempt">
            {currentWord.map((index, i) => (
              <span key={i} className={`${gameStyles.letterTile} bg-blue-200`}>
                {scrambledLetters[index]}
              </span>
            ))}
          </div>
        </div>

        <div className={`p-3 rounded mb-4 ${feedback.type === 'error' ? 'bg-red-100 text-red-800' : feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
          {feedback.message}
        </div>
      </div>

      <div className={`${commonStyles.actionButtons}`}>
        <button 
          onClick={submitWord}
          className={`${commonStyles.actionButton} ${commonStyles.submitButton}`}
        >
          Submit
        </button>
        <button 
          onClick={clearCurrentAttempt}
          className={`${commonStyles.actionButton} ${commonStyles.clearButton}`}
        >
          Clear
        </button>
        <button 
          onClick={shuffleLetters}
          className={`${commonStyles.actionButton} ${commonStyles.shuffleButton}`}
        >
          Shuffle
        </button>
        <button 
          onClick={showHint}
          className={`${commonStyles.actionButton} ${commonStyles.hintButton}`}
        >
          Hint
        </button>
        <button 
          onClick={revealWord}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Reveal Word
        </button>
        <button 
          onClick={initGame}
          className={`${commonStyles.actionButton} ${commonStyles.playAgainButton}`}
        >
          New Word
        </button>
      </div>

      {foundWords.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Found Words:</h3>
          <div className="flex flex-wrap gap-2">
            {foundWords.map((word, i) => (
              <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}