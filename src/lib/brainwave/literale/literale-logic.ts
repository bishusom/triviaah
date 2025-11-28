// src/lib/brainwave/literale/literale-logic.ts

export interface LiteraleGuessResult {
  guess: string;
  clues: string[];
  statuses: ('correct' | 'present' | 'absent')[];
  letterStatuses?: ('correct' | 'present' | 'absent')[];
  isCorrect: boolean;
}

export interface LiteraleData {
  id: string;
  targetTitle: string;
  clues: string[];
  imageUrl?: string;
  category: string;
  date: string;
  validationHints: {
    author?: string;
    publishedYear?: number;
    genre?: string[];
    setting?: string;
    awards?: string[];
    pageCount?: number;
  };
}

export function checkLetterGuess(guessTitle: string, puzzle: LiteraleData): LiteraleGuessResult {
  const guess = guessTitle.toLowerCase().trim();
  const target = puzzle.targetTitle.toLowerCase().trim();
  
  const isCorrect = guess === target;
  const letterStatuses: ('correct' | 'present' | 'absent')[] = [];
  
  const targetLetters = target.split('');
  const guessLetters = guess.split('');
  
  // Initialize all as absent first
  for (let i = 0; i < guessLetters.length; i++) {
    letterStatuses[i] = 'absent';
  }
  
  // First pass: mark correct letters (green)
  for (let i = 0; i < Math.min(guessLetters.length, targetLetters.length); i++) {
    if (guessLetters[i] === targetLetters[i]) {
      letterStatuses[i] = 'correct';
    }
  }
  
  // Create a map to track available letters in target (not yet matched as correct)
  const availableLetters = new Map<string, number>();
  for (let i = 0; i < targetLetters.length; i++) {
    if (i >= guessLetters.length || letterStatuses[i] !== 'correct') {
      const letter = targetLetters[i];
      availableLetters.set(letter, (availableLetters.get(letter) || 0) + 1);
    }
  }
  
  // Second pass: mark present letters (yellow/amber)
  for (let i = 0; i < guessLetters.length; i++) {
    if (letterStatuses[i] !== 'correct') {
      const letter = guessLetters[i];
      const count = availableLetters.get(letter) || 0;
      
      if (count > 0) {
        letterStatuses[i] = 'present';
        availableLetters.set(letter, count - 1);
      }
    }
  }
  
  return {
    guess: guessTitle,
    clues: [],
    statuses: [],
    letterStatuses,
    isCorrect
  };
}

export function normalizeBookTitle(title: string): string {
  return title.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
}

export async function validateBookGuess(
  guessTitle: string, 
  puzzleData: LiteraleData
): Promise<{ isValid: boolean; hint?: string }> {
  const normalizedGuess = normalizeBookTitle(guessTitle);
  
  // Basic validation
  if (!normalizedGuess || normalizedGuess.length < 2) {
    return { isValid: false, hint: "Please enter a valid book title" };
  }
  
  try {
    const hints = puzzleData.validationHints || {};
    const hintParts = [];
    
    if (hints.author && hints.publishedYear) {
      hintParts.push(`written by ${hints.author} in ${hints.publishedYear}`);
    } else if (hints.author) {
      hintParts.push(`written by ${hints.author}`);
    } else if (hints.publishedYear) {
      hintParts.push(`published in ${hints.publishedYear}`);
    }
    
    if (hints.genre && hints.genre.length > 0) {
      hintParts.push(`a ${hints.genre.join('/')} novel`);
    }
    
    if (hints.setting) {
      hintParts.push(`set in ${hints.setting}`);
    }
    
    if (hintParts.length > 0) {
      let hintText = "Today's book is ";
      hintText += hintParts.join(' and ');
      
      return { 
        isValid: true, 
        hint: hintText
      };
    }
    
    return { isValid: true };
  } catch (error) {
    console.error('Error validating book guess:', error);
    return { isValid: true };
  }
}

// Function to get revealed clues based on attempt count
export function getRevealedClues(attempts: number, allClues: string[]): string[] {
  if (attempts >= allClues.length) {
    return allClues;
  }
  return allClues.slice(0, attempts + 1);
}