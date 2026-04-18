// lib/brainwave/cryptodle/cryptodle-logic.ts
import { CryptodlePuzzle } from './cryptodle-sb';

export interface GuessResult {
  isCorrect: boolean;
  currentDecryption: string;
  letterStatuses?: ('correct' | 'present' | 'absent')[];
}

export function checkGuess(
  userMapping: Record<string, string>,
  puzzle: CryptodlePuzzle
): GuessResult {
  const encryptedQuote = puzzle.encryptedQuote.toLowerCase();
  let decryptedAttempt = '';

  // Decrypt the quote using the user's current mapping
  for (const char of encryptedQuote) {
    if (/[a-z0-9]/.test(char)) {
      decryptedAttempt += userMapping[char] || '_';
    } else {
      decryptedAttempt += char;
    }
  }

  const targetLower = puzzle.targetQuote.toLowerCase();
  const isCorrect = decryptedAttempt === targetLower;

  // Generate Wordle-style feedback for each letter position
  const letterStatuses: ('correct' | 'present' | 'absent')[] = [];
  const targetLetters = targetLower.split('');
  const guessLetters = decryptedAttempt.split('');

  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      letterStatuses[i] = 'correct';
    } else if (targetLetters.includes(guessLetters[i])) {
      letterStatuses[i] = 'present';
    } else {
      letterStatuses[i] = 'absent';
    }
  }

  return {
    isCorrect,
    currentDecryption: decryptedAttempt,
    letterStatuses,
  };
}

export function getRevealedHints(attempts: number, allHints: string[]): string[] {
  if (attempts >= allHints.length) {
    return allHints;
  }
  return allHints.slice(0, attempts + 1);
}
