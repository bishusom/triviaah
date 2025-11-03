// lib/brainwave/inventionle/inventionle-logic.ts
import { InventionPuzzle } from '@/lib/brainwave/inventionle/inventionle-sb';

export interface InventionGuessResult {
  guess: string;
  isCorrect: boolean;
  letterStatuses: ('correct' | 'present' | 'absent')[];
  funFact?: string;
}

// Enhanced normalization function for invention names
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['’.,]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function checkInventionGuess(
  guess: string, 
  puzzle: InventionPuzzle
): InventionGuessResult {
  const normalizedGuess = normalizeText(guess);
  const normalizedAnswer = normalizeText(puzzle.answer);
  const isCorrect = normalizedGuess === normalizedAnswer;
  
  // Generate letter-by-letter feedback (Wordle-style)
  const letterStatuses: ('correct' | 'present' | 'absent')[] = [];
  const answerLetters = normalizedAnswer.split('');
  const guessLetters = normalizedGuess.split('');
  
  // First pass: mark correct letters
  const remainingAnswerLetters = [...answerLetters];
  const statuses: ('correct' | 'present' | 'absent')[] = new Array(guessLetters.length).fill('absent');
  
  // Mark correct positions
  for (let i = 0; i < guessLetters.length; i++) {
    if (i < answerLetters.length && guessLetters[i] === answerLetters[i]) {
      statuses[i] = 'correct';
      remainingAnswerLetters[i] = ''; // Mark as used
    }
  }
  
  // Second pass: mark present letters (but not in correct position)
  for (let i = 0; i < guessLetters.length; i++) {
    if (statuses[i] === 'correct') continue;
    
    const letter = guessLetters[i];
    const foundIndex = remainingAnswerLetters.findIndex(
      (answerLetter, index) => answerLetter === letter && index !== i
    );
    
    if (foundIndex !== -1) {
      statuses[i] = 'present';
      remainingAnswerLetters[foundIndex] = ''; // Mark as used
    }
  }
  
  return {
    guess,
    isCorrect,
    letterStatuses: statuses,
    funFact: isCorrect ? puzzle.funFact : undefined
  };
}