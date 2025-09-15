// src/lib/brainwave/songle/songle-logic.ts

export interface SongleGuessResult {
  guess: string;
  statuses: ('correct' | 'present' | 'absent')[];
  isCorrect: boolean;
}

export interface SongleData {
  id: string;
  targetTitle: string;
  normalizedTitle: string;
  artist: string;
  decade: string;
  genre: string;
  lyricHint: string;
  date: string;
  validationHints: {
    releaseYear?: number;
    album?: string;
    featuredArtists?: string[];
    duration?: number;
    billboardPeak?: number;
  };
}

export function checkSongleGuess(guessTitle: string, puzzle: SongleData): SongleGuessResult {
  const normalizedGuess = normalizeSongTitle(guessTitle);
  const normalizedTarget = normalizeSongTitle(puzzle.targetTitle);
  
  const isCorrect = normalizedGuess === normalizedTarget;
  const statuses: ('correct' | 'present' | 'absent')[] = [];
  const targetLetters = normalizedTarget.split('');
  const guessLetters = normalizedGuess.split('');
  
  // First pass: mark correct letters (green)
  for (let i = 0; i < Math.max(guessLetters.length, targetLetters.length); i++) {
    if (i < guessLetters.length && i < targetLetters.length && guessLetters[i] === targetLetters[i]) {
      statuses[i] = 'correct';
    } else {
      statuses[i] = 'absent';
    }
  }
  
  // Second pass: mark present letters (yellow)
  const availableLetters = [...targetLetters];
  
  // Remove correct letters first
  for (let i = 0; i < guessLetters.length; i++) {
    if (statuses[i] === 'correct' && i < availableLetters.length) {
      availableLetters[i] = ''; // Mark as used
    }
  }
  
  // Mark present letters
  for (let i = 0; i < guessLetters.length; i++) {
    if (statuses[i] !== 'correct') {
      const letter = guessLetters[i];
      const foundIndex = availableLetters.findIndex(l => l === letter);
      if (foundIndex !== -1) {
        statuses[i] = 'present';
        availableLetters[foundIndex] = ''; // Mark as used
      }
    }
  }
  
  return {
    guess: guessTitle,
    statuses,
    isCorrect
  };
}

export function normalizeSongTitle(title: string): string {
  let normalized = title.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
  
  // Remove leading articles
  if (normalized.startsWith('the ')) {
    normalized = normalized.substring(4);
  } else if (normalized.startsWith('a ')) {
    normalized = normalized.substring(2);
  } else if (normalized.startsWith('an ')) {
    normalized = normalized.substring(3);
  }
  
  // Remove all spaces for comparison
  normalized = normalized.replace(/\s+/g, '');
  
  return normalized;
}

export async function validateSongGuess(
  guessTitle: string, 
  puzzleData: SongleData
): Promise<{ isValid: boolean; hint?: string }> {
  const normalizedGuess = normalizeSongTitle(guessTitle);
  
  // Basic validation
  if (!normalizedGuess || normalizedGuess.length < 2) {
    return { isValid: false, hint: "Please enter a valid song title" };
  }
  
  try {
    // Always provide general hints about the target song
    const hintParts = [];
    
    if (puzzleData.decade) {
      hintParts.push(`released in the ${puzzleData.decade}`);
    }
    if (puzzleData.genre) {
      hintParts.push(`${puzzleData.genre} genre`);
    }
    if (puzzleData.artist) {
      hintParts.push(`by ${puzzleData.artist}`);
    }
    
    if (hintParts.length > 0) {
      return { 
        isValid: true, 
        hint: `Today's song was ${hintParts.join(', ')}` 
      };
    }
    
    return { isValid: true };
  } catch (error) {
    console.error('Error validating song guess:', error);
    return { isValid: true };
  }
}

// Function to get progressive clues based on attempt number
export function getProgressiveClues(puzzle: SongleData, attemptNumber: number): string[] {
  const clues: string[] = [];
  
  // Always include the first clue
  clues.push(`Released in the ${puzzle.decade}`);
  
  // Add more clues based on attempt number
  if (attemptNumber >= 1) {
    clues.push(`Genre: ${puzzle.genre}`);
  }

  if (attemptNumber >= 2 && puzzle.validationHints.releaseYear) {
    clues.push(`Released in ${puzzle.validationHints.releaseYear}`);
  }
  
  if (attemptNumber >= 3) {
    clues.push(`Artist: ${puzzle.artist}`);
  }
  
  if (attemptNumber >= 4 && puzzle.validationHints.album) {
    clues.push(`Album: ${puzzle.validationHints.album}`);
  }
  
  if (attemptNumber >= 5) {
    clues.push(`Lyric: ${puzzle.lyricHint}`);
  }
  
  return clues;
}