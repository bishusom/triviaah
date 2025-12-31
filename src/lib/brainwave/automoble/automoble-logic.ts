// lib/brainwave/automoble/automoble-logic.ts
import { AutomoblePuzzle } from './automoble-sb';

export interface CarGuessResult {
  guess: string;
  isCorrect: boolean;
  letterFeedback?: Array<{
    letter: string;
    status: 'correct' | 'present' | 'absent';
    position: number;
  }>;
  similarityScore?: number;
}

export interface LetterComparison {
  letter: string;
  status: 'correct' | 'present' | 'absent';
  position: number;
}

/**
 * Normalize car names for comparison
 */
function normalizeCarName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')  // Remove special characters
    .replace(/\s+/g, ' ')         // Normalize spaces
    .trim();
}

/**
 * Calculate similarity between guess and answer
 */
function calculateSimilarity(guess: string, answer: string): number {
  const normalizedGuess = normalizeCarName(guess);
  const normalizedAnswer = normalizeCarName(answer);
  
  if (normalizedGuess === normalizedAnswer) return 1.0;
  
  // Check if it's just the model (e.g., "Mustang" for "Ford Mustang")
  const guessWords = normalizedGuess.split(' ');
  const answerWords = normalizedAnswer.split(' ');
  
  // If guess matches the last word (model) of the answer
  if (guessWords.length === 1 && answerWords.length > 1) {
    if (guessWords[0] === answerWords[answerWords.length - 1]) {
      return 0.8; // Partial match (model only)
    }
  }
  
  // Check if make is included
  if (answerWords.length > 1) {
    const make = answerWords[0]; // First word is usually the make
    if (normalizedGuess.includes(make)) {
      return 0.7; // Contains make
    }
  }
  
  // Calculate Levenshtein distance
  const longer = normalizedGuess.length > normalizedAnswer.length ? normalizedGuess : normalizedAnswer;
  const shorter = normalizedGuess.length > normalizedAnswer.length ? normalizedAnswer : normalizedGuess;
  
  if (longer.length === 0) return 1.0;
  
  return (longer.length - editDistance(longer, shorter)) / longer.length;
}

function editDistance(s1: string, s2: string): number {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  
  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

/**
 * Get letter-by-letter feedback for the guess
 */
function getLetterFeedback(guess: string, target: string): LetterComparison[] {
  const feedback: LetterComparison[] = [];
  const targetLetters = target.toLowerCase().split('');
  const guessLetters = guess.toLowerCase().split('');
  
  // First pass: mark correct letters
  for (let i = 0; i < guessLetters.length; i++) {
    if (i >= targetLetters.length) {
      feedback.push({ letter: guessLetters[i], status: 'absent', position: i });
      continue;
    }
    
    if (guessLetters[i] === targetLetters[i]) {
      feedback.push({ letter: guessLetters[i], status: 'correct', position: i });
      targetLetters[i] = '*'; // Mark as used
    } else {
      feedback.push({ letter: guessLetters[i], status: 'absent', position: i });
    }
  }
  
  // Second pass: mark present letters
  for (let i = 0; i < feedback.length; i++) {
    if (feedback[i].status === 'absent') {
      const targetIndex = targetLetters.indexOf(guessLetters[i]);
      if (targetIndex !== -1) {
        feedback[i].status = 'present';
        targetLetters[targetIndex] = '*'; // Mark as used
      }
    }
  }
  
  return feedback;
}

/**
 * Validate if a guess is a valid car (simplified - just checks similarity)
 */
export async function validateCarGuess(
  guess: string, 
  puzzleData: AutomoblePuzzle
): Promise<{
  isValid: boolean;
  hint?: string;
}> {
  const normalizedGuess = normalizeCarName(guess);
  const normalizedAnswer = normalizeCarName(puzzleData.answer);
  
  // Check if exact match
  if (normalizedGuess === normalizedAnswer) {
    return {
      isValid: true,
      hint: "That's the correct car!"
    };
  }
  
  // Check similarity for helpful hints
  const similarity = calculateSimilarity(guess, puzzleData.answer);
  
  if (similarity > 0.9) {
    return {
      isValid: true,
      hint: "Very close! Check spelling or try full name."
    };
  } else if (similarity > 0.7) {
    return {
      isValid: true,
      hint: "Close! Think about the make and model combination."
    };
  } else if (similarity > 0.5) {
    return {
      isValid: true,
      hint: "Getting warmer. Consider the car's origin or era."
    };
  }
  
  return {
    isValid: true, // Always valid for free text input
    hint: "Keep guessing! Use the hints to narrow it down."
  };
}

/**
 * Main function to check a car guess
 */
export function checkCarGuess(
  guess: string,
  puzzleData: AutomoblePuzzle,
  attemptNumber: number
): CarGuessResult {
  const normalizedGuess = normalizeCarName(guess);
  const normalizedAnswer = normalizeCarName(puzzleData.answer);
  const isCorrect = normalizedGuess === normalizedAnswer;
  
  const result: CarGuessResult = {
    guess,
    isCorrect,
  };
  
  // Add letter feedback (Wordle-style)
  result.letterFeedback = getLetterFeedback(guess, puzzleData.answer);
  
  // Calculate similarity for wrong guesses (for potential analytics)
  if (!isCorrect) {
    result.similarityScore = calculateSimilarity(guess, puzzleData.answer);
  }
  
  return result;
}

/**
 * Get progressive hints based on attempt number
 */
export function getCarHints(puzzleData: AutomoblePuzzle, attemptNumber: number): string[] {
  const hints: string[] = [];
  
  if (attemptNumber >= 1) {
    hints.push(`🏭 Make: ${puzzleData.make}`);
    hints.push(`📅 Decade: ${puzzleData.decade}`);
    if (puzzleData.country_origin) hints.push(`🌍 Country: ${puzzleData.country_origin}`);
  }
  
  if (attemptNumber >= 2) {
    if (puzzleData.vehicle_type) hints.push(`🚗 Type: ${puzzleData.vehicle_type}`);
    if (puzzleData.fuel_type) hints.push(`⛽ Fuel: ${puzzleData.fuel_type}`);
    if (puzzleData.era) hints.push(`🕰️ Era: ${puzzleData.era}`);
  }
  
  if (attemptNumber >= 3) {
    if (puzzleData.category) hints.push(`🏎️ Category: ${puzzleData.category}`);
    if (puzzleData.engine) hints.push(`⚙️ Engine: ${puzzleData.engine}`);
    if (puzzleData.horsepower) hints.push(`💨 Horsepower: ${puzzleData.horsepower} HP`);
  }
  
  if (attemptNumber >= 4) {
    if (puzzleData.acceleration_0_60) hints.push(`⚡ 0-60: ${puzzleData.acceleration_0_60}s`);
    if (puzzleData.top_speed) hints.push(`🚀 Top Speed: ${puzzleData.top_speed} mph`);
    if (puzzleData.drivetrain) hints.push(`🔧 Drivetrain: ${puzzleData.drivetrain}`);
  }
  
  if (attemptNumber >= 5) {
    if (puzzleData.famous_appearance && puzzleData.famous_appearance.length > 0) {
      hints.push(`🎬 Appeared in: ${puzzleData.famous_appearance.slice(0, 2).join(', ')}`);
    }
    if (puzzleData.nickname) hints.push(`🏆 Nickname: "${puzzleData.nickname}"`);
    if (puzzleData.design_characteristics && puzzleData.design_characteristics.length > 0) {
      hints.push(`🎨 Design: ${puzzleData.design_characteristics.slice(0, 2).join(', ')}`);
    }
  }
  
  if (attemptNumber >= 6) {
    hints.push(`🔤 First letter: ${puzzleData.answer.charAt(0).toUpperCase()}`);
    hints.push(`📏 Name length: ${puzzleData.answer.length} characters`);
    if (puzzleData.hint_column) hints.push(`💡 ${puzzleData.hint_column}`);
  }
  
  return hints;
}

/**
 * Get difficulty color for UI
 */
export function getDifficultyColor(difficulty: 'easy' | 'medium' | 'hard'): string {
  switch (difficulty) {
    case 'easy': return 'text-green-600 bg-green-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'hard': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

/**
 * Get difficulty label
 */
export function getDifficultyLabel(difficulty: 'easy' | 'medium' | 'hard'): string {
  switch (difficulty) {
    case 'easy': return 'Easy';
    case 'medium': return 'Medium';
    case 'hard': return 'Hard';
    default: return 'Unknown';
  }
}

/**
 * Get era emoji
 */
export function getEraEmoji(era: string): string {
  const eraLower = era.toLowerCase();
  if (eraLower.includes('classic')) return '🕰️';
  if (eraLower.includes('modern')) return '📱';
  if (eraLower.includes('contemporary')) return '🚀';
  return '🚗';
}

/**
 * Get category emoji
 */
export function getCategoryEmoji(category: string): string {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('sports') || categoryLower.includes('sport')) return '🏎️';
  if (categoryLower.includes('supercar')) return '⚡';
  if (categoryLower.includes('muscle')) return '💪';
  if (categoryLower.includes('suv')) return '🚙';
  if (categoryLower.includes('sedan')) return '🚗';
  if (categoryLower.includes('hatch')) return '🚐';
  if (categoryLower.includes('convertible')) return '🌞';
  if (categoryLower.includes('coupe')) return '🚘';
  if (categoryLower.includes('electric') || categoryLower.includes('ev')) return '🔋';
  if (categoryLower.includes('luxury')) return '💎';
  if (categoryLower.includes('off-road') || categoryLower.includes('4x4')) return '🏞️';
  return '🚗';
}