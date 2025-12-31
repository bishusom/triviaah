// lib/brainwave/botanle/botanle-logic.ts
import { BotanlePuzzle } from './botanle-sb';

export interface PlantGuessResult {
  guess: string;
  isCorrect: boolean;
  letterFeedback?: Array<{
    letter: string;
    status: 'correct' | 'present' | 'absent';
    position: number;
  }>;
  similarityScore?: number;
  commonNameMatch?: boolean;
  scientificNameMatch?: boolean;
}

export interface LetterComparison {
  letter: string;
  status: 'correct' | 'present' | 'absent';
  position: number;
}

/**
 * Normalize plant names for comparison
 */
function normalizePlantName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')  // Remove special characters
    .replace(/\s+/g, ' ')         // Normalize spaces
    .trim();
}

/**
 * Calculate similarity between guess and answer (supports both common and scientific names)
 */
function calculateSimilarity(guess: string, puzzleData: BotanlePuzzle): number {
  const normalizedGuess = normalizePlantName(guess);
  const normalizedCommon = normalizePlantName(puzzleData.common_name);
  const normalizedScientific = normalizePlantName(puzzleData.scientific_name);
  const normalizedAnswer = normalizePlantName(puzzleData.answer);
  
  // Check exact matches
  if (normalizedGuess === normalizedCommon || 
      normalizedGuess === normalizedScientific || 
      normalizedGuess === normalizedAnswer) {
    return 1.0;
  }
  
  // Check if guess matches part of scientific name (genus or species)
  const scientificParts = puzzleData.scientific_name.toLowerCase().split(' ');
  if (scientificParts.some(part => normalizedGuess.includes(part) || part.includes(normalizedGuess))) {
    return 0.8; // Partial match to scientific name
  }
  
  // Check if guess matches common name partially
  const commonWords = normalizedCommon.split(' ');
  if (commonWords.some(word => normalizedGuess.includes(word) || word.includes(normalizedGuess))) {
    return 0.7; // Partial match to common name
  }
  
  // Calculate Levenshtein distance for the best match
  const comparisons = [normalizedCommon, normalizedScientific, normalizedAnswer];
  let bestSimilarity = 0;
  
  for (const target of comparisons) {
    const longer = normalizedGuess.length > target.length ? normalizedGuess : target;
    const shorter = normalizedGuess.length > target.length ? target : normalizedGuess;
    
    if (longer.length === 0) continue;
    
    const similarity = (longer.length - editDistance(longer, shorter)) / longer.length;
    bestSimilarity = Math.max(bestSimilarity, similarity);
  }
  
  return bestSimilarity;
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
 * Validate if a guess is a valid plant
 */
export async function validatePlantGuess(
  guess: string, 
  puzzleData: BotanlePuzzle
): Promise<{
  isValid: boolean;
  hint?: string;
}> {
  const normalizedGuess = normalizePlantName(guess);
  const normalizedAnswer = normalizePlantName(puzzleData.answer);
  const normalizedCommon = normalizePlantName(puzzleData.common_name);
  const normalizedScientific = normalizePlantName(puzzleData.scientific_name);
  
  // Check if exact match to any name
  if (normalizedGuess === normalizedAnswer || 
      normalizedGuess === normalizedCommon || 
      normalizedGuess === normalizedScientific) {
    return {
      isValid: true,
      hint: "That's the correct plant!"
    };
  }
  
  // Check similarity for helpful hints
  const similarity = calculateSimilarity(guess, puzzleData);
  
  if (similarity > 0.9) {
    return {
      isValid: true,
      hint: "Very close! Check spelling or try the scientific name."
    };
  } else if (similarity > 0.7) {
    return {
      isValid: true,
      hint: "Close! You might be thinking of a related species."
    };
  } else if (similarity > 0.5) {
    return {
      isValid: true,
      hint: "Getting warmer. Consider the plant's family or native region."
    };
  }
  
  return {
    isValid: true, // Always valid for free text input
    hint: "Keep guessing! Use the hints to narrow it down."
  };
}

/**
 * Main function to check a plant guess
 */
export function checkPlantGuess(
  guess: string,
  puzzleData: BotanlePuzzle,
  attemptNumber: number
): PlantGuessResult {
  const normalizedGuess = normalizePlantName(guess);
  const normalizedAnswer = normalizePlantName(puzzleData.answer);
  const normalizedCommon = normalizePlantName(puzzleData.common_name);
  const normalizedScientific = normalizePlantName(puzzleData.scientific_name);
  
  const isCorrect = normalizedGuess === normalizedAnswer || 
                   normalizedGuess === normalizedCommon || 
                   normalizedGuess === normalizedScientific;
  
  const result: PlantGuessResult = {
    guess,
    isCorrect,
  };
  
  // Check which name was matched
  if (isCorrect) {
    result.commonNameMatch = normalizedGuess === normalizedCommon;
    result.scientificNameMatch = normalizedGuess === normalizedScientific;
  }
  
  // Add letter feedback (Wordle-style)
  result.letterFeedback = getLetterFeedback(guess, puzzleData.answer);
  
  // Calculate similarity for wrong guesses
  if (!isCorrect) {
    result.similarityScore = calculateSimilarity(guess, puzzleData);
  }
  
  return result;
}

/**
 * Get progressive hints based on attempt number
 */
export function getPlantHints(puzzleData: BotanlePuzzle, attemptNumber: number): string[] {
  const hints: string[] = [];
  
  if (attemptNumber >= 1) {
    hints.push(`🌿 Category: ${getCategoryEmoji(puzzleData.category)} ${puzzleData.category}`);
    hints.push(`🌍 Native Region: ${puzzleData.native_region[0]}`);
    if (puzzleData.family) hints.push(`🏷️ Family: ${puzzleData.family}`);
  }
  
  if (attemptNumber >= 2) {
    hints.push(`📏 Size: ${puzzleData.size_category} (${puzzleData.height_min}-${puzzleData.height_max}cm)`);
    hints.push(`☀️ Sun: ${puzzleData.sun_requirements.replace('_', ' ')}`);
    hints.push(`💧 Water: ${puzzleData.water_requirements}`);
  }
  
  if (attemptNumber >= 3) {
    if (puzzleData.flower_color.length > 0) {
      hints.push(`🌸 Flower Color: ${puzzleData.flower_color.join(', ')}`);
    }
    if (puzzleData.fruit_color.length > 0) {
      hints.push(`🍎 Fruit Color: ${puzzleData.fruit_color.join(', ')}`);
    }
    if (puzzleData.blooming_season.length > 0) {
      hints.push(`📅 Blooms: ${puzzleData.blooming_season.join(', ')}`);
    }
  }
  
  if (attemptNumber >= 4) {
    hints.push(`🌡️ Hardiness Zone: ${puzzleData.hardiness_zones}`);
    if (puzzleData.plant_type) hints.push(`🌱 Type: ${puzzleData.plant_type}`);
    if (puzzleData.edible_parts.length > 0) {
      hints.push(`🍽️ Edible Parts: ${puzzleData.edible_parts.join(', ')}`);
    }
  }
  
  if (attemptNumber >= 5) {
    if (puzzleData.uses.length > 0) {
      hints.push(`🏆 Uses: ${puzzleData.uses.slice(0, 3).join(', ')}`);
    }
    if (puzzleData.special_features.length > 0) {
      hints.push(`✨ Features: ${puzzleData.special_features.slice(0, 2).join(', ')}`);
    }
    if (puzzleData.fragrance !== 'none') {
      hints.push(`👃 Fragrance: ${puzzleData.fragrance}`);
    }
  }
  
  if (attemptNumber >= 6) {
    hints.push(`🔤 First letter: ${puzzleData.answer.charAt(0).toUpperCase()}`);
    hints.push(`📏 Name length: ${puzzleData.answer.length} characters`);
    if (puzzleData.symbolism.length > 0) {
      hints.push(`💭 Symbolism: ${puzzleData.symbolism[0]}`);
    }
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
 * Get category emoji
 */
export function getCategoryEmoji(category: string): string {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('flower')) return '🌸';
  if (categoryLower.includes('fruit')) return '🍎';
  if (categoryLower.includes('tree')) return '🌳';
  if (categoryLower.includes('herb')) return '🌿';
  if (categoryLower.includes('succulent')) return '🌵';
  if (categoryLower.includes('vegetable')) return '🥦';
  if (categoryLower.includes('shrub')) return '🪴';
  if (categoryLower.includes('fern')) return '🍃';
  if (categoryLower.includes('cactus')) return '🌵';
  if (categoryLower.includes('vine')) return '🌱';
  return '🌱';
}

/**
 * Get conservation status emoji
 */
export function getConservationEmoji(status: string): string {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('least_concern')) return '🟢';
  if (statusLower.includes('vulnerable')) return '🟡';
  if (statusLower.includes('endangered')) return '🟠';
  if (statusLower.includes('critically_endangered')) return '🔴';
  if (statusLower.includes('extinct_in_wild')) return '⚫';
  return '⚪';
}

/**
 * Get rarity label
 */
export function getRarityLabel(rarity: string): string {
  switch (rarity) {
    case 'common': return 'Common';
    case 'uncommon': return 'Uncommon';
    case 'rare': return 'Rare';
    case 'very_rare': return 'Very Rare';
    default: return 'Unknown';
  }
}

/**
 * Get rarity color
 */
export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common': return 'text-blue-600 bg-blue-100';
    case 'uncommon': return 'text-green-600 bg-green-100';
    case 'rare': return 'text-purple-600 bg-purple-100';
    case 'very_rare': return 'text-orange-600 bg-orange-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}