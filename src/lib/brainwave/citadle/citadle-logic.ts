// lib/brainwave/citadle/citadle-logic.ts
import { CityPuzzle } from './citadle-sb';

export interface CityGuessResult {
  guess: string;
  isCorrect: boolean;
  letterFeedback?: Array<{
    letter: string;
    status: 'correct' | 'present' | 'absent';
    position: number;
  }>;
  geographicHint?: string;
  distanceKm?: number;
  direction?: string;
  similarityScore?: number;
}

export interface LetterComparison {
  letter: string;
  status: 'correct' | 'present' | 'absent';
  position: number;
}

/**
 * Calculate distance between two coordinates in kilometers
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Get cardinal direction from guess to target
 */
function getDirection(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const latDiff = lat2 - lat1;
  const lonDiff = lon2 - lon1;
  
  if (Math.abs(latDiff) > Math.abs(lonDiff)) {
    return latDiff > 0 ? 'N' : 'S';
  } else {
    return lonDiff > 0 ? 'E' : 'W';
  }
}

/**
 * Calculate string similarity using Levenshtein distance
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  return (longer.length - editDistance(longer, shorter)) / parseFloat(longer.length.toString());
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
 * Validate if a guess is a valid city
 */
export async function validateCityGuess(guess: string, puzzleData: CityPuzzle): Promise<{
  isValid: boolean;
  hint?: string;
}> {
  const normalizedGuess = guess.trim().toLowerCase();
  const normalizedAnswer = puzzleData.answer.toLowerCase();
  
  // Check if exact match
  if (normalizedGuess === normalizedAnswer) {
    return {
      isValid: true,
      hint: "That's the correct city!"
    };
  }
  
  // Provide geographic hint based on distance
  const guessCoords = getCityCoordinates(guess, puzzleData);
  if (guessCoords) {
    const distance = calculateDistance(
      guessCoords.lat,
      guessCoords.lon,
      puzzleData.latitude,
      puzzleData.longitude
    );
    const direction = getDirection(
      guessCoords.lat,
      guessCoords.lon,
      puzzleData.latitude,
      puzzleData.longitude
    );
    
    let hint = '';
    if (distance < 50) {
      hint = 'Very close!';
    } else if (distance < 200) {
      hint = 'Close by';
    } else if (distance < 500) {
      hint = 'Same region';
    } else if (distance < 1000) {
      hint = 'Same country';
    } else if (distance < 2000) {
      hint = 'Same continent';
    } else {
      hint = 'Far away';
    }
    
    return {
      isValid: true,
      hint: `${hint} (${distance.toFixed(0)} km ${direction})`
    };
  }
  
  return {
    isValid: true,
    hint: "Keep guessing!"
  };
}

/**
 * Mock function to get city coordinates (in a real app, this would query your database)
 */
function getCityCoordinates(guess: string, puzzleData: CityPuzzle): { lat: number; lon: number } | null {
  // This is a simplified mock - in reality, you'd look this up in your cities table
  // For now, return null or approximate coordinates
  return {
    lat: puzzleData.latitude + (Math.random() - 0.5) * 10,
    lon: puzzleData.longitude + (Math.random() - 0.5) * 10
  };
}

/**
 * Main function to check a city guess
 */
export function checkCityGuess(
  guess: string,
  puzzleData: CityPuzzle,
  attemptNumber: number
): CityGuessResult {
  const isCorrect = guess.toLowerCase() === puzzleData.answer.toLowerCase();
  
  const result: CityGuessResult = {
    guess,
    isCorrect,
  };
  
  // Add letter feedback
  result.letterFeedback = getLetterFeedback(guess, puzzleData.answer);
  
  // Calculate similarity for wrong guesses
  if (!isCorrect) {
    result.similarityScore = calculateSimilarity(guess, puzzleData.answer);
  }
  
  return result;
}

/**
 * Get hints based on attempt number (for progressive hint system)
 */
// In citadle-logic.ts, update getCityHints function:
export function getCityHints(puzzleData: CityPuzzle, attemptNumber: number): string[] {
  const hintList: string[] = [];
  
  if (attemptNumber >= 1) {
    if (puzzleData.continent) hintList.push(`🌍 Continent: ${puzzleData.continent}`);
    if (puzzleData.country) hintList.push(`Country: ${puzzleData.country}`);
  }
  
  if (attemptNumber >= 2) {
    if (puzzleData.latitude && puzzleData.longitude) {
      hintList.push(`📍 Coordinates: ${puzzleData.latitude.toFixed(2)}°, ${puzzleData.longitude.toFixed(2)}°`);
    }
    if (puzzleData.timezone) hintList.push(`Timezone: ${puzzleData.timezone}`);
  }
  
  if (attemptNumber >= 3) {
    if (puzzleData.population > 0) hintList.push(`📊 Population: ${(puzzleData.population / 1000000).toFixed(1)}M`);
    if (puzzleData.areaKm2 > 0) hintList.push(`Area: ${puzzleData.areaKm2.toLocaleString()} km²`);
    if (puzzleData.elevation) hintList.push(`Elevation: ${puzzleData.elevation}m`);
  }
  
  if (attemptNumber >= 4) {
    if (puzzleData.isCapital !== undefined) {
      hintList.push(`${puzzleData.isCapital ? '🏛️' : '🏙️'} ${puzzleData.isCapital ? 'Capital city' : 'Major city'}`);
    }
    if (puzzleData.region) hintList.push(`Region: ${puzzleData.region}`);
    if (puzzleData.foundedYear) hintList.push(`Founded: ${puzzleData.foundedYear}`);
  }
  
  if (attemptNumber >= 5) {
    if (puzzleData.famousFor && puzzleData.famousFor.length > 0) {
      hintList.push(`🌟 Famous for: ${puzzleData.famousFor.slice(0, 2).join(', ')}`);
    }
    if (puzzleData.hintColumn) {
      hintList.push(`💡 ${puzzleData.hintColumn}`);
    }
  }
  
  if (attemptNumber >= 6) {
    if (puzzleData.answer) {
      hintList.push(`🔤 First letter: ${puzzleData.answer.charAt(0).toUpperCase()}`);
      hintList.push(`📝 Name length: ${puzzleData.answer.length} letters`);
    }
  }
  
  return hintList;
}

/**
 * Get difficulty color based on puzzle difficulty
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