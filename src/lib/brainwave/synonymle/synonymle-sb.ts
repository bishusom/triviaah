// src/lib/brainwave/synonymle/synonymle-sb.ts
import { createClient } from '@supabase/supabase-js';
import { SynonymleData } from './synonymle-logic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface SynonymlePuzzleRow {
  id: string;
  target_word: string;
  word_length: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  synonyms: string[];
  related_words: string[];
  hints: string[];
  created_at?: string;
}

export interface SynonymleResult {
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

export async function getDailySynonymle(customDate?: Date): Promise<SynonymleData | null> {
  try {
    const dateString = getClientDateString(customDate);
    
    // First, get the daily puzzle entry
    const { data: dailyPuzzles, error: dailyError } = await supabase
      .from('daily_puzzles')
      .select('*')
      .eq('date', dateString)
      .eq('category', 'synonymle')
      .limit(1);

    if (dailyError || !dailyPuzzles || dailyPuzzles.length === 0) {
      console.log('No daily synonymle found for date:', dateString, '- getting random puzzle');
      return getRandomSynonymle();
    }
    
    const dailyPuzzle = dailyPuzzles[0];
    const puzzleId = dailyPuzzle.puzzle_id;
    
    // Now fetch the actual puzzle data from synonymle_puzzles
    const { data: puzzleData, error: puzzleError } = await supabase
      .from('synonymle_puzzles')
      .select('*')
      .eq('id', puzzleId)
      .single();

    if (puzzleError || !puzzleData) {
      console.log('No synonymle puzzle found with ID:', puzzleId, '- getting random puzzle');
      return getRandomSynonymle();
    }
    
    return transformToSynonymleData(puzzleData);
  } catch (error) {
    console.error('Error getting daily synonymle from Supabase:', error);
    return null;
  }
}

export async function getRandomSynonymle(): Promise<SynonymleData | null> {
  try {
    const { data: puzzles, error } = await supabase
      .from('random_synonymle_puzzles')
      .select('*')
      .limit(1);

    if (error || !puzzles || puzzles.length === 0) return null;
    
    return transformToSynonymleData(puzzles[0]);
  } catch (error) {
    console.error('Error getting random synonymle from Supabase:', error);
    return null;
  }
}

export async function addSynonymleResult(
  success: boolean, 
  attempts: number,
  userId?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('puzzle_results')
      .insert([{
        category: 'synonymle',
        success,
        attempts,
        user_id: userId,
        timestamp: new Date().toISOString()
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving synonymle result to Supabase:', error);
  }
}

// Utility function to transform Supabase data to SynonymleData interface
function transformToSynonymleData(puzzleData: SynonymlePuzzleRow): SynonymleData {
  return {
    id: puzzleData.id,
    targetWord: puzzleData.target_word,
    wordLength: puzzleData.word_length,
    category: puzzleData.category,
    difficulty: puzzleData.difficulty,
    synonyms: puzzleData.synonyms,
    relatedWords: puzzleData.related_words,
    hints: puzzleData.hints,
    date: getClientDateString()
  };
}

export async function setDailySynonymlePuzzle(puzzleId: string, date?: Date): Promise<boolean> {
  try {
    const dateString = date ? getClientDateString(date) : getClientDateString();
    
    const { error } = await supabase
      .from('daily_puzzles')
      .upsert([{
        date: dateString,
        category: 'synonymle',
        puzzle_id: puzzleId
      }], {
        onConflict: 'date,category'
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error setting daily synonymle puzzle:', error);
    return false;
  }
}   