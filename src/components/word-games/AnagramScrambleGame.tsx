'use client';

import confetti from 'canvas-confetti';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCcw, Search, Sparkles, Timer } from 'lucide-react';
import { useSound } from '@/context/SoundContext';
import {
  canUseLetters,
  getScrambleTargetWord,
  loadDictionaryCandidates,
  normalizeWord,
  validateAnagramWord,
} from '@/lib/word-games/anagram-dictionary';
import { getWordGameCopy } from '@/lib/word-games/word-copy';

type ScrambleRound = {
  title: string;
  lengthOptions: number[];
  timeLimit: number;
};

const ROUNDS: ScrambleRound[] = [
  {
    title: 'Triangle Twist',
    lengthOptions: [8],
    timeLimit: 240,
  },
  {
    title: 'Sparkle Stack',
    lengthOptions: [7],
    timeLimit: 180,
  },
  {
    title: 'Planet Puzzle',
    lengthOptions: [7],
    timeLimit: 180,
  },
];

function shuffleLetters(value: string) {
  const letters = value.split('');
  for (let i = letters.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters.join('');
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function AnagramScrambleGame() {
  const { isMuted } = useSound();
  const [roundIndex, setRoundIndex] = useState(() => new Date().getUTCDate() % ROUNDS.length);
  const [targetWord, setTargetWord] = useState('');
  const [shuffled, setShuffled] = useState('');
  const [guess, setGuess] = useState('');
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [message, setMessage] = useState('Unscramble the letters and build as many valid words as you can.');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [candidateWords, setCandidateWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [roundSolved, setRoundSolved] = useState(false);
  const [hintStage, setHintStage] = useState(0);
  const [roundCopy, setRoundCopy] = useState<{ title: string; firstHint: string; secondHint: string }>(() => ({
    title: 'Generating clue...',
    firstHint: 'Looking up a word-based clue for this round.',
    secondHint: 'Looking up a word-based clue for this round.',
  }));
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const usedTargetsRef = useRef<Set<string>>(new Set());
  const targetWordRef = useRef('');

  const round = ROUNDS[roundIndex];

  useEffect(() => {
    targetWordRef.current = targetWord;
  }, [targetWord]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const playSound = useCallback((type: 'select' | 'found' | 'win' | 'error') => {
    if (isMuted) return;
    const sounds: Record<typeof type, string> = {
      select: '/sounds/click.mp3',
      found: '/sounds/correct.mp3',
      error: '/sounds/incorrect.mp3',
      win: '/sounds/win.mp3',
    };
    const audio = new Audio(sounds[type]);
    audio.play().catch(() => undefined);
  }, [isMuted]);

  const advanceRound = useCallback(() => {
    clearTimer();
    setRoundSolved(false);
    setRoundIndex((index) => (index + 1) % ROUNDS.length);
  }, [clearTimer]);

  const handleTimeExpired = useCallback(() => {
    const currentTarget = targetWordRef.current;
    setMessage(`Time's up! The word was ${currentTarget.toUpperCase()}.`);
    playSound('error');
    setFoundWords((current) => (current.includes(currentTarget) ? current : [currentTarget, ...current]));
    setRoundSolved(true);
    setTimeout(() => {
      advanceRound();
    }, 2500);
  }, [advanceRound, playSound]);

  const startTimer = useCallback((seconds: number) => {
    clearTimer();
    setTimeLeft(seconds);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer, handleTimeExpired]);

  const loadRound = useCallback(async () => {
    setLoading(true);
    clearTimer();
    setGuess('');
    setFoundWords([]);
    setCandidateWords([]);
    setMessage('Unscramble the letters and build as many valid words as you can.');
    setRoundSolved(false);
    setHintStage(0);
    setRoundCopy({
      title: 'Generating clue...',
      firstHint: 'Looking up a word-based clue for this round.',
      secondHint: 'Looking up a word-based clue for this round.',
    });

    const chosenLength = round.lengthOptions[Math.floor(Math.random() * round.lengthOptions.length)];
    let target = await getScrambleTargetWord(chosenLength, [...usedTargetsRef.current]);

    if (!target) {
      const fallbackWords = ['triangle', 'sparkle', 'planets'];
      target = fallbackWords[roundIndex % fallbackWords.length];
    }

    usedTargetsRef.current.add(target);
    setTargetWord(target);
    setShuffled(shuffleLetters(target));

    const copy = await getWordGameCopy(target, 'scramble');
    setRoundCopy({
      title: copy.title,
      firstHint: copy.firstHint,
      secondHint: copy.secondHint,
    });

    const candidates = await loadDictionaryCandidates(target, 4);
    setCandidateWords(candidates);
    setLoading(false);
    startTimer(round.timeLimit);
  }, [clearTimer, roundIndex, round.lengthOptions, round.timeLimit, startTimer]);

  useEffect(() => {
    void loadRound();
    return () => clearTimer();
  }, [loadRound, clearTimer]);

  useEffect(() => {
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'anagram_scramble_started', {
          event_category: 'anagram_scramble',
          event_label: 'anagram_scramble',
        });
        clearInterval(checkGtag);
      }
    }, 100);

    return () => clearInterval(checkGtag);
  }, []);

  const submitGuess = useCallback(async () => {
    const normalized = normalizeWord(guess);
    if (!normalized) {
      setMessage('Type a word first.');
      return;
    }

    if (foundWords.includes(normalized)) {
      setMessage('You already found that word.');
      playSound('error');
      return;
    }

    if (!canUseLetters(normalized, targetWord)) {
      setMessage('That word uses letters that are not available.');
      playSound('error');
      return;
    }

    if (!candidateWords.includes(normalized)) {
      const validation = await validateAnagramWord(normalized, targetWord);
      if (!validation.valid) {
        setMessage('That word is not in the dictionary.');
        playSound('error');
        return;
      }
    }

    const points = Math.max(1, normalized.length - 2) * 5;
    const isTarget = normalized === targetWord;
    const nextScore = score + points + (isTarget ? 25 : 0);

    setScore(nextScore);
    setFoundWords((current) => [normalized, ...current]);
    setGuess('');
    setMessage(
      isTarget
        ? `Solved. ${normalized.toUpperCase()} was the target word.`
        : `Nice. ${normalized.toUpperCase()} is valid. +${points} points.`
    );
    playSound('found');

    if (isTarget) {
      clearTimer();
      setRoundSolved(true);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      playSound('win');
      setTimeout(() => {
        advanceRound();
      }, 2200);
    }
  }, [advanceRound, candidateWords, clearTimer, foundWords, guess, playSound, score, targetWord]);

  const shuffleCurrentLetters = useCallback(() => {
    setShuffled(shuffleLetters(targetWord));
    playSound('select');
  }, [playSound, targetWord]);

  const appendLetterToGuess = useCallback((letter: string) => {
    if (loading || roundSolved || letter === '•') return;
    setGuess((current) => `${current}${letter.toLowerCase()}`);
    playSound('select');
  }, [loading, playSound, roundSolved]);

  const deleteLastLetter = useCallback(() => {
    if (loading || roundSolved) return;
    setGuess((current) => current.slice(0, -1));
    playSound('select');
  }, [loading, playSound, roundSolved]);

  const showHint = useCallback(() => {
    if (loading || !targetWord) return;
    setHintStage((current) => {
      if (current >= 2) {
        setMessage('No more hints for this round.');
        return current;
      }

      const nextStage = current + 1;
      setMessage(nextStage === 1 ? roundCopy.firstHint : roundCopy.secondHint);
      return nextStage;
    });
    playSound('select');
  }, [loading, playSound, roundCopy.firstHint, roundCopy.secondHint, targetWord]);

  const remaining = useMemo(
    () => Math.max(0, candidateWords.length - foundWords.length),
    [candidateWords.length, foundWords.length]
  );

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/60 to-cyan-950/30 p-4 md:p-6 shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">Anagram Scramble</p>
            <h2 className="mt-2 text-2xl font-black text-white">{roundCopy.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              Use the scrambled letters to find the main word and as many bonus words as you can.
              Everything is checked against the available letters and a dictionary lookup.
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-cyan-100/70">
              Tap Hint for the prefix clue, then the dictionary meaning.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300/70">Time</p>
                <p className={`mt-1 whitespace-nowrap text-xl font-black leading-none tabular-nums tracking-tight sm:text-2xl ${timeLeft <= 10 ? 'text-red-300' : 'text-white'}`}>
                  {loading ? '--:--' : formatTime(timeLeft)}
                </p>
              </div>
              <div className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300/70">Score</p>
                <p className="mt-1 text-xl font-black leading-none tabular-nums text-white sm:text-2xl">{score}</p>
              </div>
              <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300/70">Remaining Words</p>
                <p className="mt-1 text-xl font-black leading-none tabular-nums text-white">{remaining}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950/70 via-cyan-950/20 to-indigo-950/30 p-4">
          <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300/80">Letters</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(loading ? ''.padEnd(targetWord.length, '•') : shuffled).split('').map((letter, index) => (
              <button
                key={`${letter}-${index}`}
                type="button"
                onClick={() => appendLetterToGuess(letter)}
                disabled={loading || roundSolved || letter === '•'}
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/25 bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-black text-white shadow-[0_8px_18px_rgba(7,89,133,0.22)]"
              >
                {loading ? '•' : letter.toUpperCase()}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-white/60">
            {hintStage === 0 ? 'Tap Hint for the first clue.' : message}
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300/70" />
            <input
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void submitGuess();
                }
              }}
              placeholder="Enter a word"
              className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm uppercase tracking-[0.12em] text-white outline-none transition placeholder:text-white/35 focus:border-cyan-400/50 focus:bg-white/8"
            />
          </div>
          <button
            type="button"
            onClick={deleteLastLetter}
            disabled={loading || roundSolved || !guess}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-white/80 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            <span aria-hidden="true">⌫</span>
            Delete
          </button>
          <button
            type="button"
            onClick={() => void submitGuess()}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition-all duration-200 hover:scale-[1.02] active:scale-95"
            style={{
              background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)',
              boxShadow: '0 10px 30px rgba(37,99,235,0.28)',
            }}
          >
            <Sparkles className="h-4 w-4" />
            Add Word
          </button>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row flex-wrap justify-center items-center sm:items-stretch gap-4">
          <button
            type="button"
            onClick={() => setRoundIndex((index) => (index + 1) % ROUNDS.length)}
            className="w-full sm:w-auto flex-1 max-w-[180px] px-4 sm:px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-semibold text-sm sm:text-base whitespace-nowrap"
          >
            🎮 Next Puzzle
          </button>
          <button
            type="button"
            onClick={shuffleCurrentLetters}
            className="w-full sm:w-auto flex-1 max-w-[180px] px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md font-semibold text-sm sm:text-base whitespace-nowrap"
          >
            🔀 Shuffle
          </button>
          <button
            type="button"
            onClick={showHint}
            className="w-full sm:w-auto flex-1 max-w-[180px] px-4 sm:px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md font-semibold text-sm sm:text-base whitespace-nowrap"
          >
            💡 Hint
          </button>
          <span className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/70">
            <Timer className="h-4 w-4 text-cyan-300" />
            {loading ? 'Loading round' : roundSolved ? 'Round complete' : 'Timed round'}
          </span>
        </div>

        <p className="mt-3 text-sm text-white/70">{message}</p>
        {roundSolved ? (
          <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300/70">Target Word</p>
            <p className="mt-1 text-xl font-black text-white">{targetWord.toUpperCase()}</p>
          </div>
        ) : null}
      </div>

      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/70 via-slate-900/50 to-black p-4 md:p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white">Found Words</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {foundWords.length ? (
            foundWords.map((word) => (
              <span
                key={word}
                className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-sm font-semibold text-cyan-100"
              >
                {word}
              </span>
            ))
          ) : (
            <p className="text-sm text-white/55">Your solved words will show here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
