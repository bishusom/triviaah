// src/lib/brainwave/historidle/historidle-logic.ts

export interface HistoridleGuessResult {
  guess: string;
  isCorrect: boolean;
  letterStatuses?: ('correct' | 'present' | 'absent')[];
  feedback?: string;
}

export interface HistoridleData {
  id: string;
  targetTitle: string;
  dates: [string, string, string];
  dateSignificances: [string, string, string];
  type: 'figure' | 'event';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hints: string[];
  date: string;
}

export function checkHistoridleGuess(guessTitle: string, puzzle: HistoridleData): HistoridleGuessResult {
  const normalizedGuess = normalizeHistoricalTitle(guessTitle);
  const normalizedTarget = normalizeHistoricalTitle(puzzle.targetTitle);
  
  const isCorrect = normalizedGuess === normalizedTarget;
  
  // Calculate Wordle-style letter feedback
  const letterStatuses = calculateLetterStatuses(guessTitle, puzzle.targetTitle);
  
  return {
    guess: guessTitle,
    isCorrect,
    letterStatuses,
    feedback: isCorrect ? undefined : "Incorrect. Try again!"
  };
}

function calculateLetterStatuses(guess: string, target: string): ('correct' | 'present' | 'absent')[] {
  const targetLetters = target.toLowerCase().split('');
  const guessLetters = guess.toLowerCase().split('');
  const statuses: ('correct' | 'present' | 'absent')[] = new Array(guessLetters.length).fill('absent');
  
  // First pass: mark correct letters
  const targetCount = new Map<string, number>();
  
  // Count target letters
  targetLetters.forEach(letter => {
    targetCount.set(letter, (targetCount.get(letter) || 0) + 1);
  });
  
  // Mark correct positions (green)
  for (let i = 0; i < Math.min(guessLetters.length, targetLetters.length); i++) {
    if (guessLetters[i] === targetLetters[i]) {
      statuses[i] = 'correct';
      targetCount.set(guessLetters[i], targetCount.get(guessLetters[i])! - 1);
    }
  }
  
  // Second pass: mark present letters (amber/yellow)
  for (let i = 0; i < guessLetters.length; i++) {
    if (statuses[i] !== 'correct') {
      const letter = guessLetters[i];
      if (targetCount.has(letter) && targetCount.get(letter)! > 0) {
        statuses[i] = 'present';
        targetCount.set(letter, targetCount.get(letter)! - 1);
      }
    }
  }
  
  return statuses;
}

export function normalizeHistoricalTitle(title: string): string {
  return title.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^(the|a|an)\s+/i, '');
}

export function getProgressiveHint(attempts: number, puzzle: HistoridleData): string {
  const hints = [
    `Think about what these dates might represent...`,
    `Category: ${puzzle.category}`,
    `This is a historical ${puzzle.type}`,
    `The first date (${puzzle.dates[0]}) is ${puzzle.dateSignificances[0]}`,
    `The third date (${puzzle.dates[2]}) is ${puzzle.dateSignificances[2]}`,
    `The middle date (${puzzle.dates[1]}) is ${puzzle.dateSignificances[1]}`,
    `First additional hint: ${puzzle.hints[0]}`,
    `Second additional hint: ${puzzle.hints[1]}`,
    `This involves ${puzzle.targetTitle}`
  ];
  
  return hints[Math.min(attempts, hints.length - 1)];
}

export function validateHistoricalGuess(
  guessTitle: string,
): { isValid: boolean; hint?: string } {
  const normalizedGuess = normalizeHistoricalTitle(guessTitle);
  
  if (!normalizedGuess || normalizedGuess.length < 2) {
    return { isValid: false, hint: "Please enter a valid historical figure or event name" };
  }
  
  return { isValid: true };
}

// New function to get the total number of available hints
export function getTotalHints(puzzle: HistoridleData): number {
  // 3 date significances + 2 additional hints = 5 total hints
  return 3 + (puzzle.hints?.length || 0);
}