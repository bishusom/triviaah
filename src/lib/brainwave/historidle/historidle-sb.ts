// lib/historidle-sb.ts
import { createClient } from '@supabase/supabase-js';
import { HistoridleData } from './historidle-logic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface HistoridlePuzzleRow {
  id: string;
  target_title: string;
  dates: string[];
  date_significances: string[];
  type: 'figure' | 'event';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hints: string[];
  date?: string;
}

export interface HistoridleResult {
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

export async function getDailyHistoridle(customDate?: Date): Promise<HistoridleData | null> {
  try {
    const dateString = getClientDateString(customDate);
    
    // First, get the daily puzzle entry
    const { data: dailyPuzzles, error: dailyError } = await supabase
      .from('daily_puzzles')
      .select('*')
      .eq('date', dateString)
      .eq('category', 'historidle')
      .limit(1);

    if (dailyError || !dailyPuzzles || dailyPuzzles.length === 0) {
      console.log('No daily historidle found for date:', dateString, '- getting random puzzle');
      return getRandomHistoridle();
    }
    
    const dailyPuzzle = dailyPuzzles[0];
    const puzzleId = dailyPuzzle.puzzle_id;
    
    // Now fetch the actual puzzle data from historidle_puzzles
    const { data: puzzleData, error: puzzleError } = await supabase
      .from('historidle_puzzles')
      .select('*')
      .eq('id', puzzleId)
      .single();

    if (puzzleError || !puzzleData) {
      console.log('No historidle puzzle found with ID:', puzzleId, '- getting random puzzle');
      return getRandomHistoridle();
    }
    
    return transformToHistoridleData(puzzleData);
  } catch (error) {
    console.error('Error getting daily historidle from Supabase:', error);
    return null;
  }
}

export async function getRandomHistoridle(): Promise<HistoridleData | null> {
  try {
    const { data: puzzles, error } = await supabase
      .from('random_historidle_puzzles')
      .select('*')
      .limit(1);

    if (error || !puzzles || puzzles.length === 0) return null;
    
    return transformToHistoridleData(puzzles[0]);
  } catch (error) {
    console.error('Error getting random historidle from Supabase:', error);
    return null;
  }
}

export async function addHistoridleResult(
  success: boolean, 
  attempts: number,
  userId?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('puzzle_results')
      .insert([{
        category: 'historidle',
        success,
        attempts,
        user_id: userId,
        timestamp: new Date().toISOString()
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving historidle result to Supabase:', error);
  }
}

// Utility function to transform Supabase data to HistoridleData interface
function transformToHistoridleData(puzzleData: HistoridlePuzzleRow): HistoridleData {
  return {
    id: puzzleData.id,
    targetTitle: puzzleData.target_title,
    dates: puzzleData.dates as [string, string, string],
    dateSignificances: puzzleData.date_significances as [string, string, string],
    type: puzzleData.type,
    category: puzzleData.category,
    difficulty: puzzleData.difficulty,
    hints: puzzleData.hints,
    date: puzzleData.date || getClientDateString()
  };
}

export async function setDailyHistoridlePuzzle(puzzleId: string, date?: Date): Promise<boolean> {
  try {
    const dateString = date ? getClientDateString(date) : getClientDateString();
    
    const { error } = await supabase
      .from('daily_puzzles')
      .upsert([{
        date: dateString,
        category: 'historidle',
        puzzle_id: puzzleId
      }], {
        onConflict: 'date,category'
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error setting daily historidle puzzle:', error);
    return false;
  }
}