export type Status = 'correct' | 'present' | 'absent';

export interface BaseGuessResult {
  guess: string;
  letterStatuses: Status[];
  isCorrect: boolean;
}

export function checkLetterGuess(guessTitle: string, targetTitle: string): BaseGuessResult {
  const guess = guessTitle.toLowerCase().trim();
  const target = targetTitle.toLowerCase().trim();
  const isCorrect = guess === target;
  
  const targetLetters = target.split('');
  const guessLetters = guess.split('');
  const letterStatuses: Status[] = new Array(guessLetters.length).fill('absent');
  
  // First pass: Find exact matches (Green)
  for (let i = 0; i < Math.min(guessLetters.length, targetLetters.length); i++) {
    if (guessLetters[i] === targetLetters[i]) {
      letterStatuses[i] = 'correct';
    }
  }
  
  // Track remaining letters for partial matches
  const availableLetters = new Map<string, number>();
  targetLetters.forEach((char, i) => {
    if (i >= guessLetters.length || letterStatuses[i] !== 'correct') {
      availableLetters.set(char, (availableLetters.get(char) || 0) + 1);
    }
  });
  
  // Second pass: Find misplaced matches (Yellow)
  for (let i = 0; i < guessLetters.length; i++) {
    if (letterStatuses[i] !== 'correct') {
      const char = guessLetters[i];
      const count = availableLetters.get(char) || 0;
      if (count > 0) {
        letterStatuses[i] = 'present';
        availableLetters.set(char, count - 1);
      }
    }
  }
  
  return { guess: guessTitle, letterStatuses, isCorrect };
}