// lib/brainwave/country/countridle-logic.ts
import { CountryPuzzle, getCountryCoordinates, CountryInfo } from './countridle-sb';

export interface CountryGuessResult {
  guess: string;
  isCorrect: boolean;
  letterFeedback: LetterFeedback[];
  geographicHint: string;
  flagUrl?: string;
  mapSilhouetteUrl?: string;
  comparisonData?: {
    continentMatch: boolean;
    populationComparison: 'larger' | 'smaller' | 'similar';
    areaComparison: 'larger' | 'smaller' | 'similar';
    drivingSideMatch: boolean;
    currencyMatch: boolean;
  };
}

export interface LetterFeedback {
  letter: string;
  status: 'correct' | 'present' | 'absent';
}

// Country name normalization function
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Handle common prefixes
    .replace(/^the\s+/i, '') // Remove "The" from "The Bahamas", etc.
    .replace(/^st\.?\s+/i, 'saint ')        // "St " → "saint "
    .replace(/\sst\.?\s+/i, ' saint ')      // " St " → " saint "
    .replace(/^ste\.?\s+/i, 'sainte ')      // "Ste " → "sainte "
    .replace(/\sste\.?\s+/i, ' sainte ')    // " Ste " → " sainte "
    .replace(/^new\s+/i, 'new ')            // "New " → "new "
    .replace(/^north\s+/i, 'north ')        // Keep "North" but normalize spacing
    .replace(/^south\s+/i, 'south ')        // Keep "South" but normalize spacing
    .replace(/^east\s+/i, 'east ')          // Keep "East" but normalize spacing
    .replace(/^west\s+/i, 'west ')          // Keep "West" but normalize spacing
    // Handle special characters and punctuation
    .replace(/['’.,\-]/g, '')               // Remove apostrophes, periods, commas, hyphens
    .replace(/\s+/g, ' ')                   // Collapse multiple spaces
    .trim();
}

// Country variants mapping for flexible matching
const COUNTRY_VARIANTS: Record<string, string[]> = {
  "United States": ["USA", "United States of America", "America", "US", "U.S.", "U.S.A."],
  "United Kingdom": ["UK", "Great Britain", "Britain", "England", "Scotland", "Wales", "U.K.", "United Kingdom of Great Britain and Northern Ireland"],
  "Russian Federation": ["Russia", "Russian Federation"],
  "South Korea": ["Republic of Korea", "Korea", "Korea, South", "S. Korea"],
  "North Korea": ["Democratic People's Republic of Korea", "Korea, North", "N. Korea", "DPRK"],
  "Czech Republic": ["Czechia", "Czech Republic"],
  "Ivory Coast": ["Côte d'Ivoire", "Cote d'Ivoire", "Côte d'Ivoire"],
  "Eswatini": ["Swaziland"],
  "North Macedonia": ["Macedonia"],
  "Myanmar": ["Burma"],
  "Vatican City": ["Holy See", "Vatican"],
  "Cabo Verde": ["Cape Verde"],
  "São Tomé and Príncipe": ["Sao Tome and Principe"],
  "Timor-Leste": ["East Timor"],
  "Trinidad and Tobago": ["Trinidad & Tobago"],
  "Antigua and Barbuda": ["Antigua & Barbuda"],
  "Saint Kitts and Nevis": ["St. Kitts and Nevis", "St Kitts and Nevis"],
  "Saint Vincent and the Grenadines": ["St. Vincent and the Grenadines", "St Vincent and the Grenadines"],
  "Saint Lucia": ["St. Lucia", "St Lucia"],
  "Bosnia and Herzegovina": ["Bosnia & Herzegovina"],
  "Democratic Republic of the Congo": ["DR Congo", "Congo, Democratic Republic", "Congo-Kinshasa"],
  "Republic of the Congo": ["Congo", "Congo-Brazzaville"],
  "United Arab Emirates": ["UAE", "U.A.E."],
  "Papua New Guinea": ["PNG"],
  "Dominican Republic": ["Dominican Rep."],
  "Central African Republic": ["CAR"],
  "Equatorial Guinea": ["Eq. Guinea"],
  "Saudi Arabia": ["Saudi"],
  "South Africa": ["S. Africa"],
  "Palestine": ["Palestinian Territories"],
  "Syria": ["Syrian Arab Republic"],
  "Iran": ["Iran, Islamic Republic of"],
  "Laos": ["Lao People's Democratic Republic"],
  "Vietnam": ["Viet Nam"],
  "Brunei": ["Brunei Darussalam"],
  "Moldova": ["Republic of Moldova"],
  "Tanzania": ["United Republic of Tanzania"],
  "Bolivia": ["Bolivia, Plurinational State of"],
  "Venezuela": ["Venezuela, Bolivarian Republic of"],
};

// Enhanced validation function for countries
export function isValidCountry(country: string, validCountries: string[]): boolean {
  const normalizedInput = normalizeText(country);
  
  // Check exact match
  if (validCountries.some(validCountry => normalizeText(validCountry) === normalizedInput)) {
    return true;
  }
  
  // Check variant matches
  for (const [officialName, variants] of Object.entries(COUNTRY_VARIANTS)) {
    const normalizedOfficial = normalizeText(officialName);
    
    // Check if this official name is in the valid countries
    const isOfficialValid = validCountries.some(vc => normalizeText(vc) === normalizedOfficial);
    
    if (isOfficialValid && variants.some(variant => normalizeText(variant) === normalizedInput)) {
      return true;
    }
  }
  
  return false;
}

// Calculate distance and bearing between two points (same as in capitale-logic)
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

// Generate letter feedback (Wordle-style) for country names
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

// Main function to check a country guess
export function checkCountryGuess(
  guess: string, 
  puzzle: CountryPuzzle, 
  attemptNumber: number,
  allCountries: CountryInfo[]
): CountryGuessResult {
  const isCorrect = normalizeText(guess) === normalizeText(puzzle.answer);
  
  // Generate letter feedback (Wordle-style)
  const letterFeedback = generateLetterFeedback(guess, puzzle.answer);
  
  // Generate geographic hint based on attempt number
  const { hintText, flagUrl, mapSilhouetteUrl } = generateCountryHint(guess, puzzle, attemptNumber, allCountries);
  
  // Generate comparison data for the guess
  const comparisonData = generateComparisonData(guess, puzzle, allCountries);
  
  return {
    guess,
    isCorrect,
    letterFeedback,
    geographicHint: hintText,
    flagUrl,
    mapSilhouetteUrl,
    comparisonData
  };
}

// Helper function to format population
function formatPopulation(pop: number): string {
  if (pop > 1000000000) return `${(pop / 1000000000).toFixed(1)}B`;
  if (pop > 1000000) return `${(pop / 1000000).toFixed(1)}M`;
  if (pop > 1000) return `${(pop / 1000).toFixed(1)}K`;
  return pop.toString();
}

// Helper function to format area
function formatArea(areaKm2: number): string {
  if (areaKm2 > 1000000) return `${(areaKm2 / 1000000).toFixed(1)}M km²`;
  if (areaKm2 > 1000) return `${(areaKm2 / 1000).toFixed(1)}K km²`;
  return `${areaKm2.toFixed(0)} km²`;
}

// Generate comparison data between guessed country and target
function generateComparisonData(
  guess: string,
  puzzle: CountryPuzzle,
  allCountries: CountryInfo[]
): {
  continentMatch: boolean;
  populationComparison: 'larger' | 'smaller' | 'similar';
  areaComparison: 'larger' | 'smaller' | 'similar';
  drivingSideMatch: boolean;
  currencyMatch: boolean;
} {
  const guessedCountry = allCountries.find(c => 
    c.name.toLowerCase() === guess.trim().toLowerCase()
  );
  
  if (!guessedCountry) {
    return {
      continentMatch: false,
      populationComparison: 'similar',
      areaComparison: 'similar',
      drivingSideMatch: false,
      currencyMatch: false
    };
  }
  
  // Continent match
  const continentMatch = guessedCountry.continent === puzzle.continent;
  
  // Population comparison (±25% threshold)
  const popRatio = puzzle.population / guessedCountry.population;
  let populationComparison: 'larger' | 'smaller' | 'similar';
  if (popRatio > 1.25) populationComparison = 'larger';
  else if (popRatio < 0.75) populationComparison = 'smaller';
  else populationComparison = 'similar';
  
  // Area comparison (±25% threshold)
  const areaRatio = puzzle.areaKm2 / guessedCountry.areaKm2;
  let areaComparison: 'larger' | 'smaller' | 'similar';
  if (areaRatio > 1.25) areaComparison = 'larger';
  else if (areaRatio < 0.75) areaComparison = 'smaller';
  else areaComparison = 'similar';
  
  // Driving side match
  const drivingSideMatch = guessedCountry.drivingSide === puzzle.drivingSide;
  
  // Currency match (case-insensitive)
  const currencyMatch = guessedCountry.currency.toLowerCase() === puzzle.currency.toLowerCase();
  
  return {
    continentMatch,
    populationComparison,
    areaComparison,
    drivingSideMatch,
    currencyMatch
  };
}

// Updated generateCountryHint function with all fixes
function generateCountryHint(
  guess: string,
  puzzle: CountryPuzzle,
  attemptNumber: number,
  allCountries: CountryInfo[]
): { hintText: string; flagUrl?: string; mapSilhouetteUrl?: string } {
  
  const guessedCountry = allCountries.find(c => 
    c.name.toLowerCase() === guess.trim().toLowerCase()
  );
  
  const isCorrect = normalizeText(guess) === normalizeText(puzzle.answer);
  if (isCorrect) {
    return {
      hintText: `🎯 Correct! You've guessed ${puzzle.answer}!`
    };
  }
  
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
  
  const guessCountryInits = guessedCountry ? toInitialCaps(guessedCountry.name) : guess;
  
  switch (attemptNumber) {
    case 1:
      // Continent hint
      if (guessedCountry) {
        if (guessedCountry.continent === puzzle.continent) {
          return {
            hintText: `Same continent (${puzzle.continent}) as ${guessCountryInits}`
          };
        } else {
          return {
            hintText: `Different continent. ${guessCountryInits} is in ${guessedCountry.continent}, target is in ${puzzle.continent}`
          };
        }
      }
      return {
        hintText: `Located in ${puzzle.continent}`
      };
      
    case 2:
      // Country silhouette/map outline
      if (puzzle.mapSilhouette) {
        return {
          hintText: `Country Outline:`,
          mapSilhouetteUrl: puzzle.mapSilhouette
        };
      } else {
        return {
          hintText: `Country: ${puzzle.answer}`
        };
      }
      
    case 3:
      // Flag (with decreasing blur)
      const blurAmount = Math.max(10 - (attemptNumber * 2), 0);
      if (puzzle.flagUrl) {
        return {
          hintText: `Flag (${blurAmount > 0 ? `blurred: ${blurAmount}px` : 'fully visible'}):`,
          flagUrl: puzzle.flagUrl
        };
      } else {
        return {
          hintText: `Population: ${formatPopulation(puzzle.population)}`
        };
      }
      
    case 4:
      // Geographic coordinates and direction
      if (guessedCountry) {
        const { distance, bearing } = calculateDistanceAndBearing(
          guessedCountry.latitude,
          guessedCountry.longitude,
          puzzle.latitude,
          puzzle.longitude
        );
        
        let distanceHint = '';
        if (distance < 100) distanceHint = 'Very close to';
        else if (distance < 500) distanceHint = 'Close to';
        else if (distance < 2000) distanceHint = 'Moderate distance from';
        else distanceHint = 'Far from';
        
        return {
          hintText: `${distanceHint} ${guessCountryInits} (~${distance}km ${bearing})`
        };
      }
      return {
        hintText: `Coordinates: ${puzzle.latitude.toFixed(2)}°N, ${puzzle.longitude.toFixed(2)}°E`
      };
      
    case 5:
      // Multiple comparison hints
      if (guessedCountry) {
        const comparisons = [];
        
        // Population comparison
        const popRatio = puzzle.population / guessedCountry.population;
        if (popRatio > 1.5) comparisons.push('larger population');
        else if (popRatio < 0.67) comparisons.push('smaller population');
        else comparisons.push('similar population');
        
        // Area comparison
        const areaRatio = puzzle.areaKm2 / guessedCountry.areaKm2;
        if (areaRatio > 1.5) comparisons.push('larger area');
        else if (areaRatio < 0.67) comparisons.push('smaller area');
        else comparisons.push('similar area');
        
        // Driving side
        if (guessedCountry.drivingSide === puzzle.drivingSide) {
          comparisons.push('same driving side');
        }
        
        // Currency
        if (guessedCountry.currency === puzzle.currency) {
          comparisons.push('same currency');
        }
        
        return {
          hintText: `Compared to ${guessCountryInits}: ${comparisons.join(', ')}`
        };
      }
      return {
        hintText: `Population: ${formatPopulation(puzzle.population)} | Area: ${formatArea(puzzle.areaKm2)} | Timezone: ${puzzle.timezone}`
      };
      
    case 6:
      // Final hint - capital or language
      if (puzzle.hint) {
        return {
          hintText: puzzle.hint
        };
      } else {
        return {
          hintText: `Capital: ${puzzle.capital} | Languages: ${puzzle.languages.slice(0, 2).join(', ')}`
        };
      }
      
    default:
      return {
        hintText: "No additional hint"
      };
  }
}