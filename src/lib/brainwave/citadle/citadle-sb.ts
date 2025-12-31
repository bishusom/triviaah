// lib/brainwave/citadle/citadle-sb.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface CityPuzzle {
  id: string;
  answer: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  population: number;
  areaKm2: number;
  timezone: string;
  continent: string;
  isCapital: boolean;
  region?: string;
  elevation?: number;
  foundedYear?: number;
  famousFor?: string[];
  hintColumn?: string;
  flagUrl?: string;
  mapSilhouette?: string;
  validCities: string[];
  puzzleDate: string;
  difficulty: 'easy' | 'medium' | 'hard';
  validationHints: {
    continent?: string;
    country?: string;
    coordinates?: string;
    timezone?: string;
    population?: string;
    area?: string;
    elevation?: string;
    cityType?: string;
    region?: string;
    foundedYear?: number;
    famousFor?: string[];
    hintColumn?: string;
    firstLetter?: string;
    nameLength?: number;
  };
}

export interface CityResult {
  userId?: string;
  puzzleId: string;
  success: boolean;
  attempts: number;
  timestamp: Date;
}

interface CityPuzzleRow {
  id: string;
  answer: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  population: number;
  area_km2: number;
  timezone: string;
  continent: string;
  is_capital: boolean;
  region?: string;
  elevation?: number;
  founded_year?: number;
  famous_for?: string[];
  hint_column?: string;
  flag_url?: string;
  map_silhouette?: string;
  valid_cities?: string[];
  puzzle_date: string;
  difficulty: 'easy' | 'medium' | 'hard';
  normalized_name: string;
  validation_hints?: {
    continent?: string;
    country?: string;
    coordinates?: string;
    timezone?: string;
    population?: string;
    area?: string;
    elevation?: string;
    city_type?: string;
    region?: string;
    founded_year?: number;
    famous_for?: string[];
    hint_column?: string;
    first_letter?: string;
    name_length?: number;
  };
}

// Helper function to get client-side date string
function getClientDateString(customDate?: Date): string {
  const date = customDate || new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Updated function without cities table query
export async function getDailyCityPuzzle(customDate?: Date): Promise<CityPuzzle | null> {
  try {
    const dateString = getClientDateString(customDate);
    
    // Get the daily puzzle entry
    const { data: dailyPuzzles, error: dailyError } = await supabase
      .from('daily_puzzles')
      .select('*')
      .eq('date', dateString)
      .eq('category', 'citadle')
      .limit(1);

    let puzzleData = null;
    
    if (!dailyError && dailyPuzzles && dailyPuzzles.length > 0) {
      // Fetch the specific daily puzzle
      const { data: dailyPuzzle, error: puzzleError } = await supabase
        .from('citadle_puzzles')
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
      console.log('Getting random city puzzle instead of daily');
      const { data: randomPuzzles, error: randomError } = await supabase
        .from('random_citadle_puzzles')
        .select('*')
        .limit(1);
        
      if (!randomError && randomPuzzles && randomPuzzles.length > 0) {
        puzzleData = randomPuzzles[0];
      }
    }
    if (!puzzleData) {
      console.error('No puzzle data found');
      return null;
    }
    return transformToCityPuzzle(puzzleData as CityPuzzleRow);
  } catch (error) {
    console.error('Error getting daily city puzzle from Supabase:', error);
    return null;
  }
}

export async function addCitadleResult(
  success: boolean, 
  attempts: number,
  userId?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('puzzle_results')
      .insert([{
        category: 'citadle',
        success,
        attempts,
        user_id: userId,
        timestamp: new Date().toISOString()
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving citadle result to Supabase:', error);
  }
}

export async function getCitadleStats(): Promise<{
  totalPlayers: number;
  successRate: number;
  averageAttempts: number;
}> {
  try {
    const { data: results, error } = await supabase
      .from('puzzle_results')
      .select('*')
      .eq('category', 'citadle');

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
    console.error('Error getting citadle stats from Supabase:', error);
    return {
      totalPlayers: 0,
      successRate: 0,
      averageAttempts: 0
    };
  }
}

export function normalizeCityName(name: string): string {
  return name.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
}

// Utility function to transform Supabase data to CityPuzzle interface
function transformToCityPuzzle(puzzleData: CityPuzzleRow): CityPuzzle {
  return {
    id: puzzleData.id,
    answer: puzzleData.answer,
    country: puzzleData.country,
    countryCode: puzzleData.country_code,
    latitude: puzzleData.latitude,
    longitude: puzzleData.longitude,
    population: puzzleData.population,
    areaKm2: puzzleData.area_km2,
    timezone: puzzleData.timezone,
    continent: puzzleData.continent,
    isCapital: puzzleData.is_capital,
    region: puzzleData.region,
    elevation: puzzleData.elevation,
    foundedYear: puzzleData.founded_year,
    famousFor: puzzleData.famous_for,
    hintColumn: puzzleData.hint_column,
    flagUrl: puzzleData.flag_url,
    mapSilhouette: puzzleData.map_silhouette,
    validCities: puzzleData.valid_cities || [],
    puzzleDate: puzzleData.puzzle_date,
    difficulty: puzzleData.difficulty || 'medium',
    validationHints: {
      continent: puzzleData.validation_hints?.continent,
      country: puzzleData.validation_hints?.country,
      coordinates: puzzleData.validation_hints?.coordinates,
      timezone: puzzleData.validation_hints?.timezone,
      population: puzzleData.validation_hints?.population,
      area: puzzleData.validation_hints?.area,
      elevation: puzzleData.validation_hints?.elevation,
      cityType: puzzleData.validation_hints?.city_type,
      region: puzzleData.validation_hints?.region,
      foundedYear: puzzleData.validation_hints?.founded_year,
      famousFor: puzzleData.validation_hints?.famous_for,
      hintColumn: puzzleData.validation_hints?.hint_column,
      firstLetter: puzzleData.validation_hints?.first_letter,
      nameLength: puzzleData.validation_hints?.name_length,
    }
  };
}

// Function to set daily city puzzle
export async function setDailyCityPuzzle(puzzleId: string, date?: Date): Promise<boolean> {
  try {
    const dateString = date ? getClientDateString(date) : getClientDateString();
    
    const { error } = await supabase
      .from('daily_puzzles')
      .upsert([{
        date: dateString,
        category: 'citadle',
        puzzle_id: puzzleId
      }], {
        onConflict: 'date,category'
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error setting daily city puzzle:', error);
    return false;
  }
}