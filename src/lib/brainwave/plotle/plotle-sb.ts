// lib/plotle-sb.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface PlotlePuzzle {
  id: string;
  targetTitle: string;
  emojis: string;
  yearBand: string;
  genre: string;
  date: string;
  language?: string;
  validationHints: {
    releaseYear?: number;
    oscarCategories?: string[];
    featuredActors?: string[];
    director?: string;
    imdbRating?: number;
  };
}

export interface PlotleResult {
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

interface PlotlePuzzleRow {
  id: string;
  target_title: string;
  emojis: string;
  year_band: string;
  genre: string;
  date?: string;
  language?: string;
  normalized_title: string;
  validation_hints?: {
    release_year?: number;
    oscar_categories?: string[];
    featured_actors?: string[];
    director?: string;
    imdb_rating?: number;
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

export async function getDailyPlotle(customDate?: Date): Promise<PlotlePuzzle | null> {
  try {
    const dateString = getClientDateString(customDate);
    
    // First, get the daily puzzle entry
    const { data: dailyPuzzles, error: dailyError } = await supabase
      .from('daily_puzzles')
      .select('*')
      .eq('date', dateString)
      .eq('category', 'plotle')
      .limit(1);

    if (dailyError || !dailyPuzzles || dailyPuzzles.length === 0) {
      console.log('No daily puzzle found for date:', dateString, '- getting random puzzle');
      return getRandomPlotle();
    }
    
    const dailyPuzzle = dailyPuzzles[0];
    const puzzleId = dailyPuzzle.puzzle_id;
    
    // Now fetch the actual puzzle data from plotle_puzzles
    const { data: puzzleData, error: puzzleError } = await supabase
      .from('plotle_puzzles')
      .select('*')
      .eq('id', puzzleId)
      .single();

    if (puzzleError || !puzzleData) {
      console.log('No plotle puzzle found with ID:', puzzleId, '- getting random puzzle');
      return getRandomPlotle();
    }
    
    return transformToPlotlePuzzle(puzzleData);
  } catch (error) {
    console.error('Error getting daily plotle from Supabase:', error);
    return null;
  }
}

export async function getRandomPlotle(): Promise<PlotlePuzzle | null> {
  try {
    // Use PostgreSQL's random() function for true randomness
    const { data: puzzles, error } = await supabase
      .from('random_plotle_puzzles')
      .select('*')
      .limit(1);

    if (error || !puzzles || puzzles.length === 0) return null;
    
    return transformToPlotlePuzzle(puzzles[0]);
  } catch (error) {
    console.error('Error getting random plotle from Supabase:', error);
    return null;
  }
}

export async function checkMovieExists(title: string): Promise<boolean> {
  try {
    const normalized = normalizeMovieTitle(title);
    console.log('Checking if movie exists:', normalized);
    
    const { data, error } = await supabase
      .from('plotle_puzzles')
      .select('id')
      .eq('normalized_title', normalized)
      .limit(1);

    if (error) throw error;
    
    console.log('Movie exists check:', !!(data && data.length > 0));
    return !!(data && data.length > 0);
  } catch (error) {
    console.error('Error checking if movie exists in Supabase:', error);
    return false;
  }
}

export async function getMovieEmojis(title: string): Promise<string[] | null> {
  try {
    const normalized = normalizeMovieTitle(title);
    console.log('Looking up emojis for normalized title:', normalized);
    
    const { data, error } = await supabase
      .from('plotle_puzzles')
      .select('emojis')
      .eq('normalized_title', normalized)
      .limit(1);

    if (error) throw error;
    
    console.log('Found documents:', data?.length || 0);
    
    if (!data || data.length === 0) {
      console.log('No movie found in puzzles:', normalized);
      return null;
    }
    
    const puzzle = data[0];
    console.log('Puzzle data found:', puzzle);
    
    if (!puzzle.emojis) {
      console.log('No emojis found for movie');
      return null;
    }
    
    const emojis = puzzle.emojis.split(' ').filter((emoji: string) => emoji.trim());
    console.log('Parsed emojis:', emojis);
    
    if (emojis.length !== 6) {
      console.log('Incorrect number of emojis:', emojis.length);
      return null;
    }
    
    return emojis;
  } catch (error) {
    console.error('Error getting movie emojis from Supabase:', error);
    return null;
  }
}

export async function addPlotleResult(
  success: boolean, 
  attempts: number,
  userId?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('puzzle_results')
      .insert([{
        category: 'plotle',
        success,
        attempts,
        user_id: userId,
        timestamp: new Date().toISOString()
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving plotle result to Supabase:', error);
  }
}

export async function getPlotleStats(): Promise<{
  totalPlayers: number;
  successRate: number;
  averageAttempts: number;
}> {
  try {
    const { data: results, error } = await supabase
      .from('puzzle_results')
      .select('*')
      .eq('category', 'plotle');

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
    console.error('Error getting plotle stats from Supabase:', error);
    return {
      totalPlayers: 0,
      successRate: 0,
      averageAttempts: 0
    };
  }
}

// Helper function for title normalization (used by both files)
export function normalizeMovieTitle(title: string): string {
  return title.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^(the|a|an)\s+/i, '');
}

// Utility function to transform Supabase data to PlotlePuzzle interface
function transformToPlotlePuzzle(puzzleData: PlotlePuzzleRow): PlotlePuzzle {
  return {
    id: puzzleData.id,
    targetTitle: puzzleData.target_title,
    emojis: puzzleData.emojis,
    yearBand: puzzleData.year_band,
    genre: puzzleData.genre,
    date: puzzleData.date || getClientDateString(),
    language: puzzleData.language,
    validationHints: {
      releaseYear: puzzleData.validation_hints?.release_year,
      oscarCategories: puzzleData.validation_hints?.oscar_categories,
      featuredActors: puzzleData.validation_hints?.featured_actors,
      director: puzzleData.validation_hints?.director,
      imdbRating: puzzleData.validation_hints?.imdb_rating
    }
  };
}

// Additional utility function to set daily puzzle
export async function setDailyPlotlePuzzle(puzzleId: string, date?: Date): Promise<boolean> {
  try {
    const dateString = date ? getClientDateString(date) : getClientDateString();
    
    const { error } = await supabase
      .from('daily_puzzles')
      .upsert([{
        date: dateString,
        category: 'plotle',
        puzzle_id: puzzleId
      }], {
        onConflict: 'date,category'
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error setting daily plotle puzzle:', error);
    return false;
  }
}

// Utility function to search movies by partial title
export async function searchMoviesByTitle(searchTerm: string, limit: number = 10): Promise<PlotlePuzzle[]> {
  try {
    const normalizedSearch = normalizeMovieTitle(searchTerm);
    
    const { data, error } = await supabase
      .from('plotle_puzzles')
      .select('*')
      .ilike('normalized_title', `%${normalizedSearch}%`)
      .limit(limit);

    if (error) throw error;
    
    return (data || []).map(transformToPlotlePuzzle);
  } catch (error) {
    console.error('Error searching movies in Supabase:', error);
    return [];
  }
}