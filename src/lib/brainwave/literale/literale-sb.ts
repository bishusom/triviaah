// lib/brainwave/literale-sb.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface LiteralePuzzle {
  id: string;
  targetTitle: string;
  clues: string[];
  imageUrl?: string;
  category: string;
  date: string;
  validationHints: {
    author?: string;
    publishedYear?: number;
    genre?: string[];
    setting?: string;
    awards?: string[];
    pageCount?: number;
  };
}

export interface LiteraleResult {
  userId?: string;
  puzzleId: string;
  success: boolean;
  attempts: number;
  timestamp: Date;
}

interface LiteralePuzzleRow {
  id: string;
  target_title: string;
  clues: string[];
  image_url?: string;
  category: string;
  date?: string;
  normalized_title: string;
  validation_hints?: {
    author?: string;
    published_year?: number;
    genre?: string[];
    setting?: string;
    awards?: string[];
    page_count?: number;
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

export async function getDailyLiterale(customDate?: Date): Promise<LiteralePuzzle | null> {
  try {
    const dateString = getClientDateString(customDate);
    
    const { data: dailyPuzzles, error: dailyError } = await supabase
      .from('daily_puzzles')
      .select('*')
      .eq('date', dateString)
      .eq('category', 'literale')
      .limit(1);

    if (dailyError || !dailyPuzzles || dailyPuzzles.length === 0) {
      console.log('No daily literale found for date:', dateString, '- getting random puzzle');
      return getRandomLiterale();
    }
    
    const dailyPuzzle = dailyPuzzles[0];
    const puzzleId = dailyPuzzle.puzzle_id;
    
    const { data: puzzleData, error: puzzleError } = await supabase
      .from('literale_puzzles')
      .select('*')
      .eq('id', puzzleId)
      .single();

    if (puzzleError || !puzzleData) {
      console.log('No literale puzzle found with ID:', puzzleId, '- getting random puzzle');
      return getRandomLiterale();
    }
    
    return transformToLiteralePuzzle(puzzleData);
  } catch (error) {
    console.error('Error getting daily literale from Supabase:', error);
    return null;
  }
}

export async function getRandomLiterale(): Promise<LiteralePuzzle | null> {
  try {
    const { data: puzzles, error } = await supabase
      .from('random_literale_puzzles')
      .select('*')
      .limit(1);

    if (error || !puzzles || puzzles.length === 0) return null;
    
    return transformToLiteralePuzzle(puzzles[0]);
  } catch (error) {
    console.error('Error getting random literale from Supabase:', error);
    return null;
  }
}

export async function checkBookTitleExists(title: string): Promise<boolean> {
  try {
    const normalized = normalizeBookTitle(title);
    
    const { data, error } = await supabase
      .from('literale_puzzles')
      .select('id')
      .eq('normalized_title', normalized)
      .limit(1);

    if (error) throw error;
    
    return !!(data && data.length > 0);
  } catch (error) {
    console.error('Error checking if book title exists in Supabase:', error);
    return false;
  }
}

export async function getBookClues(title: string): Promise<string[] | null> {
  try {
    const normalized = normalizeBookTitle(title);
    
    const { data, error } = await supabase
      .from('literale_puzzles')
      .select('clues')
      .eq('normalized_title', normalized)
      .limit(1);

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return null;
    }
    
    return data[0].clues;
  } catch (error) {
    console.error('Error getting book clues from Supabase:', error);
    return null;
  }
}

export async function addLiteraleResult(
  success: boolean, 
  attempts: number,
  userId?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('puzzle_results')
      .insert([{
        category: 'literale',
        success,
        attempts,
        user_id: userId,
        timestamp: new Date().toISOString()
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving literale result to Supabase:', error);
  }
}

export async function getLiteraleStats(): Promise<{
  totalPlayers: number;
  successRate: number;
  averageAttempts: number;
}> {
  try {
    const { data: results, error } = await supabase
      .from('puzzle_results')
      .select('*')
      .eq('category', 'literale');

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
    console.error('Error getting literale stats from Supabase:', error);
    return {
      totalPlayers: 0,
      successRate: 0,
      averageAttempts: 0
    };
  }
}

export function normalizeBookTitle(title: string): string {
  return title.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
}

function transformToLiteralePuzzle(puzzleData: LiteralePuzzleRow): LiteralePuzzle {
  return {
    id: puzzleData.id,
    targetTitle: puzzleData.target_title,
    clues: puzzleData.clues,
    imageUrl: puzzleData.image_url,
    category: puzzleData.category,
    date: puzzleData.date || getClientDateString(),
    validationHints: {
      author: puzzleData.validation_hints?.author,
      publishedYear: puzzleData.validation_hints?.published_year,
      genre: puzzleData.validation_hints?.genre,
      setting: puzzleData.validation_hints?.setting,
      awards: puzzleData.validation_hints?.awards,
      pageCount: puzzleData.validation_hints?.page_count
    }
  };
}

export async function setDailyLiteralePuzzle(puzzleId: string, date?: Date): Promise<boolean> {
  try {
    const dateString = date ? getClientDateString(date) : getClientDateString();
    
    const { error } = await supabase
      .from('daily_puzzles')
      .upsert([{
        date: dateString,
        category: 'literale',
        puzzle_id: puzzleId
      }], {
        onConflict: 'date,category'
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error setting daily literale puzzle:', error);
    return false;
  }
}