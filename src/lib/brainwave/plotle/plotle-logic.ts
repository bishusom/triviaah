// src/lib/brainwave/plotle/plotle-logic.ts

export interface PlotleGuessResult {
  guess: string;
  emojis: string[];
  statuses: ('correct' | 'present' | 'absent')[];
  letterStatuses?: ('correct' | 'present' | 'absent')[];
  isCorrect: boolean;
}

export interface PlotleData {
  id: string;
  targetTitle: string;
  emojis: string;
  yearBand: string;
  genre: string;
  date: string;
  language?: string; 
  validationHints: {
    releaseYear?: number;
    oscarCategories?: string[];
    featuredActors?: string[];
    director?: string;
    imdbRating?: number;
  };
}

export function checkLetterGuess(guessTitle: string, puzzle: PlotleData): PlotleGuessResult {
  // Don't normalize for letter comparison - we want to compare the actual titles
  const guess = guessTitle.toLowerCase().trim();
  const target = puzzle.targetTitle.toLowerCase().trim();
  
  const isCorrect = guess === target;
  const letterStatuses: ('correct' | 'present' | 'absent')[] = [];
  
  // Convert to arrays for easier processing
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
    // Only count letters that weren't marked as correct in the guess
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
    emojis: [],
    statuses: [],
    letterStatuses,
    isCorrect
  };
}

export function checkPlotleGuess(guessTitle: string, guessEmojis: string[], puzzle: PlotleData): PlotleGuessResult {
  const targetEmojis = puzzle.emojis.split(' ');
  if (guessEmojis.length !== 6 || targetEmojis.length !== 6) {
    throw new Error('Emoji sequence must be exactly 6 emojis');
  }

  // Use normalized titles for overall comparison
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
    const hints = puzzleData.validationHints || {};
    const hintParts = [];
    
    if (hints.releaseYear && puzzleData.genre) {
      hintParts.push(`a ${puzzleData.genre} film from ${hints.releaseYear}`);
    } else if (hints.releaseYear) {
      hintParts.push(`released in ${hints.releaseYear}`);
    } else if (puzzleData.genre) {
      hintParts.push(`a ${puzzleData.genre} film`);
    }
    
    if (puzzleData.language) {
      const formattedLanguage = puzzleData.language.charAt(0).toUpperCase() + 
                               puzzleData.language.slice(1).toLowerCase();
      hintParts.push(`in ${formattedLanguage}`);
    }
    
    if (hintParts.length > 0) {
      let hintText = "Today's movie is ";
      hintText += hintParts.join(' and ');
      
      return { 
        isValid: true, 
        hint: hintText
      };
    }
    
    return { isValid: true };
  } catch (error) {
    console.error('Error validating movie guess:', error);
    return { isValid: true };
  }
}