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
    return transformToCityPuzzle(puzzleData);
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
function transformToCityPuzzle(puzzleData: any): CityPuzzle {
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
    validCities: puzzleData.valid_cities || [], // Now comes from the puzzle itself
    puzzleDate: puzzleData.puzzle_date,
    difficulty: puzzleData.difficulty || 'medium',
    validationHints: puzzleData.validation_hints || {},
  };
}

// Helper function to format large numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

// Fallback puzzle for development/error cases
function getFallbackCityPuzzle(): CityPuzzle {
  return {
    id: 'fallback-city',
    answer: 'Paris',
    country: 'France',
    countryCode: 'FR',
    latitude: 48.8566,
    longitude: 2.3522,
    population: 2148000,
    areaKm2: 105.4,
    timezone: '+1',
    continent: 'Europe',
    isCapital: true,
    region: 'Île-de-France',
    elevation: 35,
    foundedYear: 52,
    famousFor: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral'],
    hintColumn: 'Known as the "City of Light" and famous for its art and fashion',
    validCities: ['Paris', 'London', 'New York', 'Tokyo', 'Rome', 'Berlin', 'Madrid', 'Moscow', 'Sydney', 'Cairo'],
    puzzleDate: getClientDateString(),
    difficulty: 'medium',
    validationHints: {
      continent: 'Europe',
      country: 'France',
      coordinates: '48.86°N, 2.35°E',
      timezone: 'UTC+1',
      population: '2.1M',
      area: '105.4 km²',
      elevation: '35m',
      cityType: 'Capital city',
      region: 'Île-de-France',
      foundedYear: 52,
      famousFor: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral'],
      hintColumn: 'Known as the "City of Light" and famous for its art and fashion',
      firstLetter: 'P',
      nameLength: 5,
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