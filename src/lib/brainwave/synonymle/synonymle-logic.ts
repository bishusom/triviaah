// src/lib/brainwave/synonymle/synonymle-logic.ts

export interface SynonymleGuessResult {
  guess: string;
  isCorrect: boolean;
  similarityScore: number;
  similarityCategory: 'perfect' | 'hot' | 'warm' | 'cool' | 'cold' | 'freezing';
  feedback?: string;
}

export interface SynonymleData {
  id: string;
  targetWord: string;
  wordLength: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  synonyms: string[];
  relatedWords: string[];
  hints: string[];
  date: string;
}

// Semantic similarity scoring system
const SIMILARITY_THRESHOLDS = {
  PERFECT: { min: 990, max: 1000, category: 'perfect' as const },
  HOT: { min: 900, max: 989, category: 'hot' as const },
  WARM: { min: 700, max: 899, category: 'warm' as const },
  COOL: { min: 500, max: 699, category: 'cool' as const },
  COLD: { min: 1, max: 499, category: 'cold' as const },
  FREEZING: { min: 0, max: 0, category: 'freezing' as const }
};

export function checkSynonymleGuess(guess: string, puzzle: SynonymleData): SynonymleGuessResult {
  const normalizedGuess = normalizeWord(guess);
  const normalizedTarget = normalizeWord(puzzle.targetWord);
  
  const isCorrect = normalizedGuess === normalizedTarget;
  
  // Calculate semantic similarity score
  const similarityScore = calculateSemanticSimilarity(normalizedGuess, normalizedTarget, puzzle);
  const similarityCategory = getSimilarityCategory(similarityScore);
  
  return {
    guess,
    isCorrect,
    similarityScore: parseFloat(similarityScore.toFixed(2)), // Format to 2 decimal places
    similarityCategory,
    feedback: isCorrect ? undefined : getFeedbackMessage(similarityCategory)
  };
}

function calculateSemanticSimilarity(guess: string, target: string, puzzle: SynonymleData): number {
  // Direct match
  if (guess === target) return 1000;
  
  // Exact synonym match
  if (puzzle.synonyms.some(synonym => normalizeWord(synonym) === guess)) {
    return 950 + Math.random() * 40; // 950-989
  }
  
  // Related word match
  if (puzzle.relatedWords.some(related => normalizeWord(related) === guess)) {
    return 700 + Math.random() * 200; // 700-899
  }
  
  // Letter overlap scoring (fallback when no semantic match)
  const guessLetters = new Set(guess.split(''));
  const targetLetters = new Set(target.split(''));
  
  const intersection = new Set([...guessLetters].filter(x => targetLetters.has(x)));
  const union = new Set([...guessLetters, ...targetLetters]);
  
  const jaccardSimilarity = intersection.size / union.size;
  
  // Convert to our 0-1000 scale with some randomness for variety
  const baseScore = jaccardSimilarity * 500;
  const randomVariation = Math.random() * 100;
  return parseFloat((baseScore + randomVariation).toFixed(2)); // Format to 2 decimal places
}

function getSimilarityCategory(score: number): SynonymleGuessResult['similarityCategory'] {
  if (score >= SIMILARITY_THRESHOLDS.PERFECT.min) return 'perfect';
  if (score >= SIMILARITY_THRESHOLDS.HOT.min) return 'hot';
  if (score >= SIMILARITY_THRESHOLDS.WARM.min) return 'warm';
  if (score >= SIMILARITY_THRESHOLDS.COOL.min) return 'cool';
  if (score >= SIMILARITY_THRESHOLDS.COLD.min) return 'cold';
  return 'freezing';
}

function getFeedbackMessage(category: SynonymleGuessResult['similarityCategory']): string {
  const messages = {
    perfect: "🎉 Perfect! You've guessed the word!",
    hot: "🔥 Hot! Extremely close synonym or highly related concept",
    warm: "☀️ Warm! Conceptually related - you're on the right track",
    cool: "💨 Cool! Broadly related but not a direct synonym",
    cold: "❄️ Cold! Semantically distant - try a new concept",
    freezing: "🧊 Freezing! No meaningful connection - completely different concept"
  };
  
  return messages[category];
}

export function normalizeWord(word: string): string {
  return word.toLowerCase()
    .trim()
    .replace(/[^a-z]/g, '');
}

export function getProgressiveHint(attempts: number, puzzle: SynonymleData): string {
  const hints = [
    `Think about words that mean something similar...`,
    `Category: ${puzzle.category}`,
    `The word has ${puzzle.wordLength} letters`,
    `Starts with: ${puzzle.targetWord[0].toUpperCase()}`,
    `Synonyms include: ${puzzle.synonyms.slice(0, 3).join(', ')}`,
    `Additional hint: ${puzzle.hints[0]}`,
    `Second additional hint: ${puzzle.hints[1]}`,
    `The word is: ${puzzle.targetWord}`
  ];
  
  return hints[Math.min(attempts, hints.length - 1)];
}

export function validateWordGuess(
  guess: string, 
  puzzleData: SynonymleData
): { isValid: boolean; hint?: string } {
  const normalizedGuess = normalizeWord(guess);
  
  if (!normalizedGuess || normalizedGuess.length < 2) {
    return { isValid: false, hint: "Please enter a valid word (at least 2 letters)" };
  }
  
  if (normalizedGuess.length > 12) {
    return { isValid: false, hint: "Word too long (maximum 12 letters)" };
  }
  
  // NEW: Validate word length matches the puzzle
  if (normalizedGuess.length !== puzzleData.wordLength) {
    return { isValid: false, hint: `Please enter a ${puzzleData.wordLength}-letter word` };
  }
  
  // Basic English word validation (you might want to enhance this with a dictionary)
  if (!/^[a-z]+$/.test(normalizedGuess)) {
    return { isValid: false, hint: "Please enter a valid English word" };
  }
  
  return { isValid: true };
}

export function getTotalHints(puzzle: SynonymleData): number {
  return 3 + (puzzle.hints?.length || 0);
}

// Enhanced color system with better contrast
export function getCategoryColor(category: SynonymleGuessResult['similarityCategory']): string {
  const colors = {
    perfect: 'bg-gradient-to-r from-green-500 to-green-600',
    hot: 'bg-gradient-to-r from-red-500 to-red-600',
    warm: 'bg-gradient-to-r from-orange-400 to-orange-500',
    cool: 'bg-gradient-to-r from-blue-400 to-blue-500',
    cold: 'bg-gradient-to-r from-cyan-400 to-cyan-500', // Changed from blue-200 for better contrast
    freezing: 'bg-gradient-to-r from-gray-400 to-gray-500'
  };
  
  return colors[category];
}

// Text color for better contrast
export function getCategoryTextColor(category: SynonymleGuessResult['similarityCategory']): string {
  const colors = {
    perfect: 'text-white',
    hot: 'text-white',
    warm: 'text-white',
    cool: 'text-white',
    cold: 'text-white', // White text for better contrast
    freezing: 'text-white'
  };
  
  return colors[category];
}

// Border color for additional visual distinction
export function getCategoryBorderColor(category: SynonymleGuessResult['similarityCategory']): string {
  const colors = {
    perfect: 'border-green-600',
    hot: 'border-red-600',
    warm: 'border-orange-500',
    cool: 'border-blue-500',
    cold: 'border-cyan-500',
    freezing: 'border-gray-500'
  };
  
  return colors[category];
}

export function getCategoryEmoji(category: SynonymleGuessResult['similarityCategory']): string {
  const emojis = {
    perfect: '🎉',
    hot: '🔥',
    warm: '☀️',
    cool: '💨',
    cold: '❄️',
    freezing: '🧊'
  };
  
  return emojis[category];
}

// New function to get descriptive label for the category
export function getCategoryLabel(category: SynonymleGuessResult['similarityCategory']): string {
  const labels = {
    perfect: 'Perfect Match',
    hot: 'Hot Synonym',
    warm: 'Warm Concept',
    cool: 'Cool Relation',
    cold: 'Cold Distance',
    freezing: 'Freezing Cold'
  };
  
  return labels[category];
}