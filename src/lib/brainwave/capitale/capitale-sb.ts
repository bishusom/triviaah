// lib/capitale-sb.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface CapitalInfo {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  continent: string;
  timezone: string;
  population?: number;
  countryCode?: string;
}

export interface CapitalePuzzle {
  id: string;
  answer: string;
  country: string;
  countryCode: string;
  silhouette: string;
  timezone: string;
  population: number;
  latitude: number;
  longitude: number;
  date: string;
  continent: string;
  validCapitals: string[];
  cityHint: string;
}

export interface CapitaleResult {
  userId?: string;
  puzzleId: string;
  success: boolean;
  attempts: number;
  timestamp: Date;
}

export interface DailyPuzzle {
  id: string;
  date: string;
  category: string;
  puzzle_id: string;
}

// Helper function to get client-side date string
function getClientDateString(customDate?: Date): string {
  const date = customDate || new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getDailyCapitale(customDate?: Date): Promise<{puzzle: CapitalePuzzle | null, allCapitals: CapitalInfo[]}> {
  try {
    const dateString = getClientDateString(customDate);
    
    console.log('Fetching daily puzzle for date:', dateString);
    
    // Try to get daily puzzle first
    const { data: dailyPuzzles, error: dailyError } = await supabase
      .from('daily_puzzles')
      .select('*')
      .eq('date', dateString)
      .eq('category', 'capitale')
      .limit(1);

    let puzzleData = null;
    
    if (!dailyError && dailyPuzzles && dailyPuzzles.length > 0) {
      // Fetch the specific daily puzzle
      const { data: dailyPuzzle, error: puzzleError } = await supabase
        .from('capitale_puzzles')
        .select('*')
        .eq('id', dailyPuzzles[0].puzzle_id)
        .single();
        
      if (!puzzleError) puzzleData = dailyPuzzle;
    }
    
    // If no daily puzzle found, get a random one
    if (!puzzleData) {
      console.log('Getting random puzzle instead of daily');
      const { data: randomPuzzles, error: randomError } = await supabase
        .from('random_capitale_puzzles')
        .select('*')
        .limit(1);
        
      if (!randomError && randomPuzzles && randomPuzzles.length > 0) {
        puzzleData = randomPuzzles[0];
      }
    }
    
    if (!puzzleData) {
      return { puzzle: null, allCapitals: [] };
    }
    
    // Get all capitals for validation
    const { data: allPuzzles } = await supabase
      .from('capitale_puzzles')
      .select('answer, country, latitude, longitude, continent, timezone, population, country_code');
    
    const allCapitals: CapitalInfo[] = (allPuzzles || [])
      .map(puzzle => ({
        name: puzzle.answer?.trim(),
        country: puzzle.country,
        latitude: parseFloat(puzzle.latitude) || 0,
        longitude: parseFloat(puzzle.longitude) || 0,
        continent: puzzle.continent,
        timezone: puzzle.timezone || '',
        population: puzzle.population,
        countryCode: puzzle.country_code
      }))
      .filter(capital => !!capital.name && capital.latitude !== undefined && 
                         capital.longitude !== undefined && !!capital.continent);
    
    const validCapitals = allCapitals.map(c => c.name);
    console.log('Valid capitals count:', validCapitals.length);
    return {
      puzzle: {
        id: puzzleData.id,
        answer: puzzleData.answer,
        country: puzzleData.country,
        countryCode: puzzleData.country_code,
        silhouette: puzzleData.silhouette,
        timezone: puzzleData.timezone || '',
        population: puzzleData.population || 0,
        latitude: parseFloat(puzzleData.latitude) || 0,
        longitude: parseFloat(puzzleData.longitude) || 0,
        date: dateString,
        continent: puzzleData.continent,
        validCapitals: validCapitals,
        cityHint: puzzleData.city_hint || ''
      } as CapitalePuzzle,
      allCapitals
    };
    
  } catch (error) {
    console.error('Error getting capitale puzzle:', error);
    return { puzzle: null, allCapitals: [] };
  }
}

export async function addCapitaleResult(
  success: boolean, 
  attempts: number,
  userId?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('puzzle_results')
      .insert([{
        category: 'capitale',
        success,
        attempts,
        user_id: userId,
        timestamp: new Date().toISOString()
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving capitale result to Supabase:', error);
  }
}

export async function getCapitaleStats(): Promise<{
  totalPlayers: number;
  successRate: number;
  averageAttempts: number;
}> {
  try {
    const { data: results, error } = await supabase
      .from('puzzle_results')
      .select('*')
      .eq('category', 'capitale');

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
    console.error('Error getting capitale stats from Supabase:', error);
    return {
      totalPlayers: 0,
      successRate: 0,
      averageAttempts: 0
    };
  }
}

export function getCapitalCoordinates(capital: string, allCapitals: CapitalInfo[]): { lat: number, lon: number } | null {
  const normalizedCapital = capital.trim().toLowerCase();
  const capitalInfo = allCapitals.find(c => 
    c.name.toLowerCase() === normalizedCapital
  );
  
  return capitalInfo ? { lat: capitalInfo.latitude, lon: capitalInfo.longitude } : null;
}

// Additional utility function to set daily puzzle
export async function setDailyCapitalePuzzle(puzzleId: string, date?: Date): Promise<boolean> {
  try {
    const dateString = date ? getClientDateString(date) : getClientDateString();
    
    const { error } = await supabase
      .from('daily_puzzles')
      .upsert([{
        date: dateString,
        category: 'capitale',
        puzzle_id: puzzleId
      }], {
        onConflict: 'date,category'
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error setting daily capitale puzzle:', error);
    return false;
  }
}