// lib/trordle/trordle-sb.ts
import { createClient } from '@supabase/supabase-js';
//import { Database } from '@/lib/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface TrordleAttribute {
  name: string;
  value: string;
  matchType?: 'exact' | 'contains' | 'number' | 'year' | 'list';
  range?: number;
  optionValues: Record<string, string>;
}

export interface TrordlePuzzle {
  id: string;
  question: string;
  answer: string;
  options: string[];
  category: string;
  attributes: TrordleAttribute[];
  date: string;
}

export interface TrordleResult {
  userId?: string;
  puzzleId: string;
  success: boolean;
  attempts: number;
  timestamp: Date;
}

interface TrordlePuzzleRow {
  id: string;
  question: string;
  answer: string;
  options: string[];
  category: string;
  attributes: TrordleAttribute[];
  date?: string;
}

interface TrordleAttributeRow {
  name: string;
  value: string;
  matchType?: 'exact' | 'contains' | 'number' | 'year' | 'list';
  range?: number;
  optionValues: Record<string, string>;
}

// Helper function to get client-side date string
function getClientDateString(customDate?: Date): string {
  const date = customDate || new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getDailyTrordle(customDate?: Date): Promise<TrordlePuzzle | null> {
  try {
    const dateString = getClientDateString(customDate);
    
    console.log('Fetching daily puzzle for date:', dateString);
    
    // Get daily puzzle entry
    const { data: dailyPuzzle, error: dailyError } = await supabase
      .from('daily_puzzles')
      .select(`
        puzzle_id,
        trordle_puzzles (*)
      `)
      .eq('date', dateString)
      .eq('category', 'trordle')
      .single();
    
    if (dailyError || !dailyPuzzle) {
      console.log('No daily puzzle found for date:', dateString, '- getting random puzzle');
      return getRandomTrordle();
    }
    
    if (!dailyPuzzle.trordle_puzzles) {
      console.log('No trordle puzzle found with ID:', dailyPuzzle.puzzle_id, '- getting random puzzle');
      return getRandomTrordle();
    }

    // Handle the case where trordle_puzzles might be an array or an object
    const puzzleData = Array.isArray(dailyPuzzle.trordle_puzzles)
      ? dailyPuzzle.trordle_puzzles[0]
      : dailyPuzzle.trordle_puzzles;

    if (!puzzleData) {
      console.log('No valid trordle puzzle data found - getting random puzzle');
      return getRandomTrordle();
    }

    // Process attributes with proper fallbacks
    const processedAttributes = (Array.isArray(puzzleData.attributes) ? puzzleData.attributes : []).map((attr: TrordleAttributeRow) => ({
      ...attr,
      optionValues: attr.optionValues || {},
      matchType: attr.matchType || 'contains',
      range: attr.range || 0
    }));

    console.log('Found trordle puzzle:', puzzleData.id, 'for date:', dateString);

    return {
      id: puzzleData.id,
      question: puzzleData.question,
      answer: puzzleData.answer,
      options: puzzleData.options,
      category: puzzleData.category,
      attributes: processedAttributes,
      date: dateString
    } as TrordlePuzzle;
    
  } catch (error) {
    console.error('Error getting daily trordle:', error);
    return null;
  }
}

export async function getRandomTrordle(): Promise<TrordlePuzzle | null> {
  try {
    // Get a random puzzle using Supabase's built-in random ordering
    const { data: puzzles, error } = await supabase
      .from('random_trordle_puzzles')
      .select('*')
      .limit(1);
    
    if (error || !puzzles || puzzles.length === 0) {
      return null;
    }
    
    const puzzle = puzzles[0] as TrordlePuzzleRow;
    
    // Process attributes with proper fallbacks
    const processedAttributes = (puzzle.attributes as TrordleAttributeRow[]).map(attr => ({
      ...attr,
      optionValues: attr.optionValues || {},
      matchType: attr.matchType || 'contains',
      range: attr.range || 0
    }));
    
    return {
      id: puzzle.id,
      question: puzzle.question,
      answer: puzzle.answer,
      options: puzzle.options,
      category: puzzle.category,
      attributes: processedAttributes,
      date: getClientDateString()
    } as TrordlePuzzle;
    
  } catch (error) {
    console.error('Error getting random trordle:', error);
    return null;
  }
}

export async function addTrordleResult(
  success: boolean, 
  attempts: number,
  userId?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('puzzle_results')
      .insert([{
        category: 'trordle',
        success,
        attempts,
        user_id: userId,
        timestamp: new Date().toISOString()
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving songle result to Supabase:', error);
  }
}

export async function getTrordleStats(): Promise<{
  totalPlayers: number;
  successRate: number;
  averageAttempts: number;
}> {
  try {
    const { data: results, error } = await supabase
      .from('puzzle_results')
      .select('success, attempts')
      .eq('category', 'trordle');
    
    if (error) {
      throw error;
    }
    
    const totalPlayers = results?.length || 0;
    const successfulResults = results?.filter(result => result.success) || [];
    const successRate = totalPlayers > 0 ? successfulResults.length / totalPlayers : 0;
    
    const totalAttempts = results?.reduce((sum, result) => sum + result.attempts, 0) || 0;
    const averageAttempts = totalPlayers > 0 ? totalAttempts / totalPlayers : 0;
    
    return {
      totalPlayers,
      successRate: Math.round(successRate * 100),
      averageAttempts: Math.round(averageAttempts * 10) / 10
    };
  } catch (error) {
    console.error('Error getting trordle stats:', error);
    return {
      totalPlayers: 0,
      successRate: 0,
      averageAttempts: 0
    };
  }
}