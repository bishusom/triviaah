// src/lib/brainwave/celebrile/celebrile-logic.ts

export interface CelebrileGuessResult {
  guess: string;
  clues: string[];
  statuses: ('correct' | 'present' | 'absent')[];
  letterStatuses?: ('correct' | 'present' | 'absent')[];
  isCorrect: boolean;
}

export interface CelebrileData {
  id: string;
  targetName: string;
  clues: string[];
  imageUrl?: string;
  category: string;
  date: string;
  validationHints: {
    birthYear?: number;
    profession?: string[];
    notableWorks?: string[];
    nationality?: string;
    yearsActive?: string;
  };
}

export function checkLetterGuess(guessName: string, puzzle: CelebrileData): CelebrileGuessResult {
  const guess = guessName.toLowerCase().trim();
  const target = puzzle.targetName.toLowerCase().trim();
  
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
    guess: guessName,
    clues: [],
    statuses: [],
    letterStatuses,
    isCorrect
  };
}

export function normalizeCelebrityName(name: string): string {
  return name.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
}

export async function validateCelebrityGuess(
  guessName: string, 
  puzzleData: CelebrileData
): Promise<{ isValid: boolean; hint?: string }> {
  const normalizedGuess = normalizeCelebrityName(guessName);
  
  // Basic validation
  if (!normalizedGuess || normalizedGuess.length < 2) {
    return { isValid: false, hint: "Please enter a valid name" };
  }
  
  try {
    const hints = puzzleData.validationHints || {};
    const hintParts = [];
    
    if (hints.birthYear && puzzleData.category) {
      hintParts.push(`a ${puzzleData.category} born in ${hints.birthYear}`);
    } else if (hints.birthYear) {
      hintParts.push(`born in ${hints.birthYear}`);
    } else if (puzzleData.category) {
      hintParts.push(`a ${puzzleData.category}`);
    }
    
    if (hints.nationality) {
      hintParts.push(`from ${hints.nationality}`);
    }
    
    if (hintParts.length > 0) {
      let hintText = "Today's celebrity is ";
      hintText += hintParts.join(' and ');
      
      return { 
        isValid: true, 
        hint: hintText
      };
    }
    
    return { isValid: true };
  } catch (error) {
    console.error('Error validating celebrity guess:', error);
    return { isValid: true };
  }
}

// Function to get revealed clues based on attempt count
export function getRevealedClues(attempts: number, allClues: string[]): string[] {
  if (attempts >= allClues.length) {
    return allClues;
  }
  return allClues.slice(0, attempts + 1); // Show one more clue after each wrong guess
}