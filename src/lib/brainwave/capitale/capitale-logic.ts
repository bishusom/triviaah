// lib/capitale-logic.ts
import { CapitalePuzzle, getCapitalCoordinates, CapitalInfo } from '@/lib/brainwave/capitale/capitale-sb';  

export interface CapitaleGuessResult {
  guess: string;
  isCorrect: boolean;
  letterFeedback: LetterFeedback[];
  geographicHint: string;
  silhouetteUrl?: string;
}

export interface LetterFeedback {
  letter: string;
  status: 'correct' | 'present' | 'absent';
}

// Enhanced normalization function
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Handle common capital city abbreviations and variants
    .replace(/^st\.?\s+/i, 'saint ')        // "St " → "saint "
    .replace(/\sst\.?\s+/i, ' saint ')      // " St " → " saint "
    .replace(/^ste\.?\s+/i, 'sainte ')      // "Ste " → "sainte " (feminine)
    .replace(/\sste\.?\s+/i, ' sainte ')    // " Ste " → " sainte "
    .replace(/^ft\.?\s+/i, 'fort ')         // "Ft " → "fort "
    .replace(/\sft\.?\s+/i, ' fort ')       // " Ft " → " fort "
    .replace(/^new\s+/i, 'new ')            // "New " → "new "
    // Handle apostrophes and special characters
    .replace(/['’.,]/g, '')                 // Remove apostrophes, periods, commas
    // Normalize whitespace
    .replace(/\s+/g, ' ')                   // Collapse multiple spaces
    .trim();
}


// Variants mapping for flexible matching
const CAPITAL_VARIANTS: Record<string, string[]> = {
  "Saint George's": ["St. George's", "Saint Georges", "St. Georges", "St George's", "St Georges"],
  "São Tomé": ["Sao Tome", "Sao Tomé"],
  "Port-au-Prince": ["Port au Prince", "PortauPrince"],
  "Bandar Seri Begawan": ["Bandar Seri Begawan", "BSB", "Bandar"],
  "N'Djamena": ["N Djamena", "N'Djamena", "N Djaména", "Ndjamena"],
  "Mexico City": ["Mexico", "Ciudad de México", "Mexico D.F."],
  "Kuala Lumpur": ["Kuala Lumpur", "KL"],
  "Buenos Aires": ["Buenos Aires", "Buenos-Aires"],
  "Addis Ababa": ["Addis Ababa", "Addis-Ababa"],
  "Abu Dhabi": ["Abu Dhabi", "Abu-Dhabi"],
  "New Delhi": ["New Delhi", "New-Delhi"],
  "Panama City": ["Panama City", "Panama", "Panama-City"],
  "Quezon City": ["Quezon City", "Quezon-City"],
  "Sana'a": ["Sanaa", "Sana'a", "Sana"],
  "Ulaanbaatar": ["Ulaanbaatar", "Ulan Bator"],
  "Andorra la Vella": ["Andorra la Vella", "Andorra"],
  "Vatican City": ["Vatican City", "Vatican"],
};

// Enhanced validation function (moved from capitale-fb.ts)
export function isValidCapital(capital: string, validCapitals: string[]): boolean {
  const normalizedInput = normalizeText(capital);
  
  // Check exact match
  if (validCapitals.some(validCapital => normalizeText(validCapital) === normalizedInput)) {
    return true;
  }
  
  // Check variant matches
  for (const [officialName, variants] of Object.entries(CAPITAL_VARIANTS)) {
    const normalizedOfficial = normalizeText(officialName);
    
    // Check if this official name is in the valid capitals
    const isOfficialValid = validCapitals.some(vc => normalizeText(vc) === normalizedOfficial);
    
    if (isOfficialValid && variants.some(variant => normalizeText(variant) === normalizedInput)) {
      return true;
    }
  }
  
  return false;
}

function calculateDistanceAndBearing(
  guessLat: number, 
  guessLon: number, 
  targetLat: number, 
  targetLon: number
): { distance: number, bearing: string } {
  // Haversine formula to calculate distance between two points
  const R = 6371; // Earth's radius in km
  const dLat = (targetLat - guessLat) * Math.PI / 180;
  const dLon = (targetLon - guessLon) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(guessLat * Math.PI / 180) * Math.cos(targetLat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = Math.round(R * c);
  
  // Calculate bearing (direction)
  const y = Math.sin(dLon) * Math.cos(targetLat * Math.PI / 180);
  const x = Math.cos(guessLat * Math.PI / 180) * Math.sin(targetLat * Math.PI / 180) -
            Math.sin(guessLat * Math.PI / 180) * Math.cos(targetLat * Math.PI / 180) * Math.cos(dLon);
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  bearing = (bearing + 360) % 360;
  
  // Convert bearing to compass direction
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  const compassDirection = directions[index];
  
  return { distance, bearing: compassDirection };
}

export function checkCapitaleGuess(
  guess: string, 
  puzzle: CapitalePuzzle, 
  attemptNumber: number,
  allCapitals: CapitalInfo[]
): CapitaleGuessResult {
  const isCorrect = normalizeText(guess) === normalizeText(puzzle.answer);
  
  // Generate letter feedback (Wordle-style)
  const letterFeedback = generateLetterFeedback(guess, puzzle.answer);
  
  // Generate geographic hint based on attempt number
  const { hintText, silhouetteUrl } = generateGeographicHint(guess, puzzle, attemptNumber, allCapitals);
  
  return {
    guess,
    isCorrect,
    letterFeedback,
    geographicHint: hintText,
    silhouetteUrl
  };
}

function generateLetterFeedback(guess: string, answer: string): LetterFeedback[] {
  const normalizedGuess = normalizeText(guess);
  const normalizedAnswer = normalizeText(answer);
  const feedback: LetterFeedback[] = [];
  
  // Use the normalized versions for comparison but original for display
  for (let i = 0; i < guess.length; i++) {
    if (i >= answer.length) {
      feedback.push({ letter: guess[i], status: 'absent' });
    } else if (normalizedGuess[i] === normalizedAnswer[i]) {
      feedback.push({ letter: guess[i], status: 'correct' });
    } else {
      feedback.push({ letter: guess[i], status: 'absent' }); // Temporary, will update in next pass
    }
  }
  
  // Second pass: mark present letters (correct letter but wrong position)
  const answerLetterCounts: Record<string, number> = {};
  for (let i = 0; i < normalizedAnswer.length; i++) {
    const letter = normalizedAnswer[i];
    answerLetterCounts[letter] = (answerLetterCounts[letter] || 0) + 1;
  }
  
  // Subtract correct letters first
  for (let i = 0; i < feedback.length; i++) {
    if (feedback[i].status === 'correct') {
      const letter = normalizedGuess[i];
      answerLetterCounts[letter]--;
    }
  }
  
  // Now mark present letters
  for (let i = 0; i < feedback.length; i++) {
    if (feedback[i].status === 'correct') continue;
    
    const letter = normalizedGuess[i];
    if (answerLetterCounts[letter] > 0) {
      feedback[i].status = 'present';
      answerLetterCounts[letter]--;
    }
  }
  
  return feedback;
}

// Update the generateGeographicHint function in capitale-logic.ts
function generateGeographicHint(
  guess: string, 
  puzzle: CapitalePuzzle, 
  attemptNumber: number, 
  allCapitals: CapitalInfo[]
): { hintText: string; silhouetteUrl?: string } {
  
  // First check if the guess is correct - if so, return a congratulatory message
  const isCorrect = normalizeText(guess) === normalizeText(puzzle.answer);
  if (isCorrect) {
    return {
      hintText: `🎯 Correct! You've guessed the capital of ${puzzle.country}!`
    };
  }
  
  const guessedCoords = getCapitalCoordinates(guess, allCapitals);
  const targetCoords = { lat: puzzle.latitude, lon: puzzle.longitude };
  
  // Find the guessed capital info for better hints
  const guessedCapital = allCapitals.find(c => 
    c.name.toLowerCase() === guess.trim().toLowerCase()
  );
  
  const toInitialCaps = (str: string) => {
    if (typeof str !== 'string' || str.length === 0) {
      return '';
    }
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const guessCapitalInits = guessedCapital ? toInitialCaps(guessedCapital.name) : guess;
  
  switch (attemptNumber) {
    case 1:
      if (guessedCapital) {
        if (guessedCapital.continent === puzzle.continent) {
          return {
            hintText: `Same continent (${puzzle.continent}) as ${guessCapitalInits}`
          };
        } else {
          return {
            hintText: `Different continent. ${guessCapitalInits} is in ${guessedCapital.continent}, target is in ${puzzle.continent}`
          };
        }
      }
      return {
        hintText: `Located in ${puzzle.continent}`
      };

    case 2:
      if (puzzle.silhouette) {
        return {
          hintText: `Wrong Country: Guess from Country Silhouette:`,
          silhouetteUrl: puzzle.silhouette
        };
      } else if (puzzle.country) {
        return {
          hintText: `Country: ${puzzle.country}`
        };
      } else {
        return {
          hintText: 'Guess the capital city'
        };
      }  
    
    case 3:
      if (guessedCoords && targetCoords) {
        const { distance, bearing } = calculateDistanceAndBearing(
          guessedCoords.lat, guessedCoords.lon,
          targetCoords.lat, targetCoords.lon
        );
        
        let distanceHint = '';
        if (distance < 100) distanceHint = 'Very close to';
        else if (distance < 500) distanceHint = 'Close to';
        else if (distance < 2000) distanceHint = 'Moderate distance from';
        else distanceHint = 'Far from';
        
        return {
          hintText: `${distanceHint} ${guessCapitalInits || 'your guess'} (~${distance}km ${bearing})`
        };
      }
      return {
        hintText: "Distance calculation unavailable"
      };
    
    case 4:
      if (guessedCapital) {
        // Calculate timezone difference
        const guessTimezone = parseInt(puzzle.timezone) || 0;
        const targetTimezone = parseInt(guessedCapital.timezone) || 0;
        const timezoneDiff = targetTimezone - guessTimezone;
        
        let timezoneHint = '';
        if (timezoneDiff === 0) {
          timezoneHint = 'same timezone as';
        } else if (timezoneDiff > 0) {
          timezoneHint = `${Math.abs(timezoneDiff)} hours ahead of`;
        } else {
          timezoneHint = `${Math.abs(timezoneDiff)} hours behind`;
        }
        
        return {
          hintText: `Mystery capital is ${timezoneHint} ${guessCapitalInits || 'your guess'}.`
        };
      }
      return {
        hintText: `Timezone: UTC${puzzle.timezone}`
      };
    
    case 5:
      // REPLACE THIS ENTIRE CASE WITH:
      if (puzzle.cityHint) {
        return {
          hintText: puzzle.cityHint
        };
      } else {
        // Fallback to original logic if no cityHint exists
        if (puzzle.countryCode) {
          return {
            hintText: `Country code: ${puzzle.countryCode.toUpperCase()}`
          };
        } else {
          const pop = puzzle.population;
          if (pop < 1000000) return { hintText: `Small city (<1M people)` };
          if (pop < 5000000) return { hintText: `Medium-sized city (1-5M people)` };
          if (pop < 10000000) return { hintText: `Large city (5-10M people)` };
          return { hintText: `Megacity (>10M people)` };
        }
      }
    
    default:
      return {
        hintText: "No additional hint"
      };
  }
}