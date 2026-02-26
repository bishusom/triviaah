// lib/brainwave/country/country-sb.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface CountryInfo {
  id: string;
  name: string;
  countryCode: string;
  continent: string;
  capital: string;
  flagUrl: string;
  mapSilhouette: string;
  latitude: number;
  longitude: number;
  timezone: string;
  population: number;
  areaKm2: number;
  neighbors: string[];
  languages: string[];
  currency: string;
  drivingSide: 'left' | 'right';
  hint?: string;
  isActive: boolean;
}

export interface CountryPuzzle {
  id: string;
  answer: string;
  countryCode: string;
  continent: string;
  capital: string;
  flagUrl: string;
  mapSilhouette: string;
  latitude: number;
  longitude: number;
  timezone: string;
  population: number;
  areaKm2: number;
  neighbors: string[];
  languages: string[];
  currency: string;
  drivingSide: 'left' | 'right';
  date: string;
  validCountries: string[];
  hint: string;
}

export interface CountryResult {
  userId?: string;
  puzzleId: string;
  success: boolean;
  attempts: number;
  timestamp: Date;
}

// Helper function to get client-side date string
function getClientDateString(customDate?: Date): string {
  const date = customDate || new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getDailyCountry(customDate?: Date): Promise<{
  puzzle: CountryPuzzle | null;
  allCountries: CountryInfo[];
}> {
  try {
    const dateString = getClientDateString(customDate);
    
    console.log('Fetching daily country puzzle for date:', dateString);
    
    // Try to get daily puzzle first
    const { data: dailyPuzzles, error: dailyError } = await supabase
      .from('daily_puzzles')
      .select('*')
      .eq('date', dateString)
      .eq('category', 'countridle')
      .limit(1);

    let puzzleData = null;
    
    if (!dailyError && dailyPuzzles && dailyPuzzles.length > 0) {
      // Fetch the specific daily puzzle
      const { data: dailyPuzzle, error: puzzleError } = await supabase
        .from('countridle_puzzles')
        .select('*')
        .eq('id', dailyPuzzles[0].puzzle_id)
        .single();
        
      if (!puzzleError) {
        puzzleData = dailyPuzzle;
        console.log('Found daily puzzle:', puzzleData.country_name);
      }
    }
    
    // If no daily puzzle found, get a random one
    if (!puzzleData) {
      console.log('Getting random country puzzle instead of daily');
      const { data: randomPuzzles, error: randomError } = await supabase
        .from('random_countridle_puzzles')
        .select('*')
        .limit(1);
        
      if (!randomError && randomPuzzles && randomPuzzles.length > 0) {
        puzzleData = randomPuzzles[0];
      }
    }
    
    if (!puzzleData) {
      console.error('No puzzle data found');
      return { puzzle: null, allCountries: [] };
    }
    
    // Get all countries for validation and hints
    const { data: allCountriesData, error: countriesError } = await supabase
      .from('countridle_puzzles')
      .select('*')
      .eq('is_active', true);
    
    if (countriesError) {
      console.error('Error fetching all countries:', countriesError);
      return { puzzle: null, allCountries: [] };
    }
    
    const allCountries: CountryInfo[] = (allCountriesData || [])
      .map(country => ({
        id: country.id,
        name: country.country_name?.trim() || '',
        countryCode: country.country_code || '',
        continent: country.continent || '',
        capital: country.capital || '',
        flagUrl: country.flag_url || '',
        mapSilhouette: country.map_silhouette || '',
        latitude: parseFloat(country.latitude) || 0,
        longitude: parseFloat(country.longitude) || 0,
        timezone: country.timezone || '',
        population: parseInt(country.population) || 0,
        areaKm2: parseFloat(country.area_km2) || 0,
        neighbors: Array.isArray(country.neighbors) ? country.neighbors : 
                  typeof country.neighbors === 'string' ? JSON.parse(country.neighbors) : [],
        languages: Array.isArray(country.languages) ? country.languages :
                  typeof country.languages === 'string' ? JSON.parse(country.languages) : [],
        currency: country.currency || '',
        drivingSide: (country.driving_side === 'left' ? 'left' : 'right') as 'left' | 'right',
        hint: country.hint || '',
        isActive: country.is_active || true
      }))
      .filter(country => 
        !!country.name && 
        country.latitude !== undefined && 
        country.longitude !== undefined && 
        !!country.continent &&
        !!country.countryCode
      );
    
    const validCountries = allCountries.map(c => c.name);
    console.log('Valid countries count:', validCountries.length);
    
    // Parse neighbors and languages for the puzzle data
    const parsedNeighbors = Array.isArray(puzzleData.neighbors) ? puzzleData.neighbors :
                           typeof puzzleData.neighbors === 'string' ? JSON.parse(puzzleData.neighbors) : [];
    
    const parsedLanguages = Array.isArray(puzzleData.languages) ? puzzleData.languages :
                           typeof puzzleData.languages === 'string' ? JSON.parse(puzzleData.languages) : [];
    
    return {
      puzzle: {
        id: puzzleData.id,
        answer: puzzleData.country_name,
        countryCode: puzzleData.country_code,
        continent: puzzleData.continent,
        capital: puzzleData.capital,
        flagUrl: puzzleData.flag_url,
        mapSilhouette: puzzleData.map_silhouette,
        latitude: parseFloat(puzzleData.latitude) || 0,
        longitude: parseFloat(puzzleData.longitude) || 0,
        timezone: puzzleData.timezone || '',
        population: parseInt(puzzleData.population) || 0,
        areaKm2: parseFloat(puzzleData.area_km2) || 0,
        neighbors: parsedNeighbors,
        languages: parsedLanguages,
        currency: puzzleData.currency || '',
        drivingSide: (puzzleData.driving_side === 'left' ? 'left' : 'right') as 'left' | 'right',
        date: dateString,
        validCountries: validCountries,
        hint: puzzleData.hint || ''
      } as CountryPuzzle,
      allCountries
    };
    
  } catch (error) {
    console.error('Error getting country puzzle:', error);
    return { puzzle: null, allCountries: [] };
  }
}

export async function addCountryResult(
  success: boolean, 
  attempts: number,
  userId?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('puzzle_results')
      .insert([{
        category: 'countridle',
        success,
        attempts,
        user_id: userId,
        timestamp: new Date().toISOString()
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving country result to Supabase:', error);
  }
}

export async function getCountryStats(): Promise<{
  totalPlayers: number;
  successRate: number;
  averageAttempts: number;
}> {
  try {
    const { data: results, error } = await supabase
      .from('puzzle_results')
      .select('*')
      .eq('category', 'countridle');

    if (error) throw error;
    
    const resultsData = results || [];
    
    const totalPlayers = resultsData.length;
    const successfulResults = resultsData.filter(result => result.success);
    const successRate = totalPlayers > 0 ? successfulResults.length / totalPlayers : 0;
    
    const totalAttempts = resultsData.reduce((sum, result) => sum + result.attempts, 0);
    const averageAttempts = totalPlayers > 0 ? totalAttempts / totalPlayers : 0;
    
    return {
      totalPlayers,
      successRate: Math.round(successRate * 100),
      averageAttempts: Math.round(averageAttempts * 10) / 10
    };
  } catch (error) {
    console.error('Error getting country stats from Supabase:', error);
    return {
      totalPlayers: 0,
      successRate: 0,
      averageAttempts: 0
    };
  }
}

export function getCountryCoordinates(
  country: string, 
  allCountries: CountryInfo[]
): { lat: number; lon: number } | null {
  const normalizedCountry = country.trim().toLowerCase();
  const countryInfo = allCountries.find(c => 
    c.name.toLowerCase() === normalizedCountry
  );
  
  return countryInfo ? { 
    lat: countryInfo.latitude, 
    lon: countryInfo.longitude 
  } : null;
}

export function getCountryByCode(
  code: string,
  allCountries: CountryInfo[]
): CountryInfo | null {
  const normalizedCode = code.trim().toUpperCase();
  const countryInfo = allCountries.find(c => 
    c.countryCode.toUpperCase() === normalizedCode
  );
  
  return countryInfo || null;
}

export async function setDailyCountryPuzzle(
  puzzleId: string, 
  date?: Date
): Promise<boolean> {
  try {
    const dateString = date ? getClientDateString(date) : getClientDateString();
    
    const { error } = await supabase
      .from('daily_puzzles')
      .upsert([{
        date: dateString,
        category: 'countridle',
        puzzle_id: puzzleId
      }], {
        onConflict: 'date,category'
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error setting daily country puzzle:', error);
    return false;
  }
}

// Helper function to get country data for autocomplete and comparison
export function getCountryComparisonData(
  guess: string,
  target: CountryPuzzle,
  allCountries: CountryInfo[]
): {
  continentMatch: boolean;
  populationComparison: 'larger' | 'smaller' | 'similar';
  areaComparison: 'larger' | 'smaller' | 'similar';
  drivingSideMatch: boolean;
  currencyMatch: boolean;
  neighborMatch: boolean;
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
      currencyMatch: false,
      neighborMatch: false
    };
  }
  
  // Continent match
  const continentMatch = guessedCountry.continent === target.continent;
  
  // Population comparison (±25% threshold)
  const popRatio = target.population / guessedCountry.population;
  let populationComparison: 'larger' | 'smaller' | 'similar';
  if (popRatio > 1.25) populationComparison = 'larger';
  else if (popRatio < 0.75) populationComparison = 'smaller';
  else populationComparison = 'similar';
  
  // Area comparison (±25% threshold)
  const areaRatio = target.areaKm2 / guessedCountry.areaKm2;
  let areaComparison: 'larger' | 'smaller' | 'similar';
  if (areaRatio > 1.25) areaComparison = 'larger';
  else if (areaRatio < 0.75) areaComparison = 'smaller';
  else areaComparison = 'similar';
  
  // Driving side match
  const drivingSideMatch = guessedCountry.drivingSide === target.drivingSide;
  
  // Currency match (case-insensitive)
  const currencyMatch = guessedCountry.currency.toLowerCase() === target.currency.toLowerCase();
  
  // Check if countries are neighbors
  const neighborMatch = target.neighbors.some(neighborCode => 
    neighborCode.toUpperCase() === guessedCountry.countryCode.toUpperCase()
  );
  
  return {
    continentMatch,
    populationComparison,
    areaComparison,
    drivingSideMatch,
    currencyMatch,
    neighborMatch
  };
}