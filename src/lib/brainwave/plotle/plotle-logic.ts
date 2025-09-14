// src/lib/brainwave/plotle/plotle-logic.ts;

export interface PlotleGuessResult {
  guess: string;
  emojis: string[];
  statuses: ('correct' | 'present' | 'absent')[];
  letterStatuses?: ('correct' | 'present' | 'absent')[]; // Add this for letter-based feedback
  isCorrect: boolean;
}

export interface PlotleData {
  id: string;
  targetTitle: string;
  emojis: string;
  yearBand: string;
  genre: string;
  date: string;
  validationHints: {
    releaseYear?: number;
    oscarCategories?: string[];
    featuredActors?: string[];
    director?: string;
    imdbRating?: number;
  };
}

export function checkLetterGuess(guessTitle: string, puzzle: PlotleData): PlotleGuessResult {
  const normalizedGuess = normalizeMovieTitle(guessTitle);
  const normalizedTarget = normalizeMovieTitle(puzzle.targetTitle);
  
  const isCorrect = normalizedGuess === normalizedTarget;
  const letterStatuses: ('correct' | 'present' | 'absent')[] = [];
  const targetLetters = normalizedTarget.split('');
  const guessLetters = normalizedGuess.split('');
  
  // First pass: mark correct letters (green)
  for (let i = 0; i < Math.max(guessLetters.length, targetLetters.length); i++) {
    if (i < guessLetters.length && i < targetLetters.length && guessLetters[i] === targetLetters[i]) {
      letterStatuses[i] = 'correct';
    } else {
      letterStatuses[i] = 'absent';
    }
  }
  
  // Second pass: mark present letters (yellow)
  const availableLetters = [...targetLetters];
  
  // Remove correct letters first
  for (let i = 0; i < guessLetters.length; i++) {
    if (letterStatuses[i] === 'correct' && i < availableLetters.length) {
      availableLetters[i] = ''; // Mark as used
    }
  }
  
  // Mark present letters
  for (let i = 0; i < guessLetters.length; i++) {
    if (letterStatuses[i] !== 'correct') {
      const letter = guessLetters[i];
      const foundIndex = availableLetters.findIndex(l => l === letter);
      if (foundIndex !== -1) {
        letterStatuses[i] = 'present';
        availableLetters[foundIndex] = ''; // Mark as used
      }
    }
  }
  
  return {
    guess: guessTitle,
    emojis: [], // Empty since we're not using emojis
    statuses: [], // Empty since we're not using emojis
    letterStatuses,
    isCorrect
  };
}

export function checkPlotleGuess(guessTitle: string, guessEmojis: string[], puzzle: PlotleData): PlotleGuessResult {
  const targetEmojis = puzzle.emojis.split(' ');
  if (guessEmojis.length !== 6 || targetEmojis.length !== 6) {
    throw new Error('Emoji sequence must be exactly 6 emojis');
  }

  // Normalize titles for comparison
  const normalizedGuess = normalizeMovieTitle(guessTitle);
  const normalizedTarget = normalizeMovieTitle(puzzle.targetTitle);
  
  const isCorrect = normalizedGuess === normalizedTarget;

  const statuses: ('correct' | 'present' | 'absent')[] = new Array(6).fill('absent');
  const targetCount = new Map<string, number>();

  // Count target emojis
  targetEmojis.forEach(emoji => {
    targetCount.set(emoji, (targetCount.get(emoji) || 0) + 1);
  });

  // First pass: mark correct (green)
  for (let i = 0; i < 6; i++) {
    if (guessEmojis[i] === targetEmojis[i]) {
      statuses[i] = 'correct';
      targetCount.set(guessEmojis[i], targetCount.get(guessEmojis[i])! - 1);
    }
  }

  // Second pass: mark present (yellow)
  for (let i = 0; i < 6; i++) {
    if (statuses[i] === 'absent') {
      const emoji = guessEmojis[i];
      if (targetCount.has(emoji) && targetCount.get(emoji)! > 0) {
        statuses[i] = 'present';
        targetCount.set(emoji, targetCount.get(emoji)! - 1);
      }
    }
  }

  return {
    guess: guessTitle,
    emojis: guessEmojis,
    statuses,
    isCorrect
  };
}

export function normalizeMovieTitle(title: string): string {
  return title.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^(the|a|an)\s+/i, '');
}

export async function validateMovieGuess(
  guessTitle: string, 
  puzzleData: PlotleData
): Promise<{ isValid: boolean; hint?: string }> {
  const normalizedGuess = normalizeMovieTitle(guessTitle);
  
  // Basic validation
  if (!normalizedGuess || normalizedGuess.length < 2) {
    return { isValid: false, hint: "Please enter a valid movie title" };
  }
  
  try {
    // Always provide general hints about the target movie
    const hints = puzzleData.validationHints || {};
    const hintParts = [];
    
    if (hints.releaseYear) {
      hintParts.push(`released in ${hints.releaseYear}`);
    }
    if (puzzleData.genre) {
      hintParts.push(`a ${puzzleData.genre} film`);
    }
    
    if (hintParts.length > 0) {
      return { 
        isValid: true, 
        hint: `Today's movie was ${hintParts.join(' and ')}` 
      };
    }
    
    return { isValid: true };
  } catch (error) {
    console.error('Error validating movie guess:', error);
    return { isValid: true };
  }
}