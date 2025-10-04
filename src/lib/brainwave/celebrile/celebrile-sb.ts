// lib/brainwave/celebrile-sb.ts
import { createClient } from '@supabase/supabase-js';
import { fetchArtistImageFromWikipedia } from '@/lib/wikimedia';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface CelebrilePuzzle {
  id: string;
  targetName: string;
  clues: string[];
  imageUrl?: string;
  category: string;
  date: string;
  validationHints: {
    birthYear?: number;
    profession?: string[];
    notableWorks?: string[];
    nationality?: string;
    yearsActive?: string;
  };
}

export interface CelebrileResult {
  userId?: string;
  puzzleId: string;
  success: boolean;
  attempts: number;
  timestamp: Date;
}

interface CelebrilePuzzleRow {
  id: string;
  target_name: string;
  clues: string[];
  image_url?: string;
  category: string;
  date?: string;
  normalized_name: string;
  validation_hints?: {
    birth_year?: number;
    profession?: string[];
    notable_works?: string[];
    nationality?: string;
    years_active?: string;
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

export async function getDailyCelebrile(customDate?: Date): Promise<CelebrilePuzzle | null> {
  try {
    const dateString = getClientDateString(customDate);
    
    // First, get the daily puzzle entry
    const { data: dailyPuzzles, error: dailyError } = await supabase
      .from('daily_puzzles')
      .select('*')
      .eq('date', dateString)
      .eq('category', 'celebrile')
      .limit(1);

    if (dailyError || !dailyPuzzles || dailyPuzzles.length === 0) {
      console.log('No daily celebrile found for date:', dateString, '- getting random puzzle');
      return getRandomCelebrile();
    }
    
    const dailyPuzzle = dailyPuzzles[0];
    const puzzleId = dailyPuzzle.puzzle_id;
    
    // Now fetch the actual puzzle data from celebrile_puzzles
    const { data: puzzleData, error: puzzleError } = await supabase
      .from('celebrile_puzzles')
      .select('*')
      .eq('id', puzzleId)
      .single();

    if (puzzleError || !puzzleData) {
      console.log('No celebrile puzzle found with ID:', puzzleId, '- getting random puzzle');
      return getRandomCelebrile();
    }
    
    return transformToCelebrilePuzzle(puzzleData);
  } catch (error) {
    console.error('Error getting daily celebrile from Supabase:', error);
    return null;
  }
}

export async function getRandomCelebrile(): Promise<CelebrilePuzzle | null> {
  try {
    const { data: puzzles, error } = await supabase
      .from('random_celebrile_puzzles')
      .select('*')
      .limit(1);

    if (error || !puzzles || puzzles.length === 0) return null;
    
    return transformToCelebrilePuzzle(puzzles[0]);
  } catch (error) {
    console.error('Error getting random celebrile from Supabase:', error);
    return null;
  }
}

export async function checkCelebrityExists(name: string): Promise<boolean> {
  try {
    const normalized = normalizeCelebrityName(name);
    
    const { data, error } = await supabase
      .from('celebrile_puzzles')
      .select('id')
      .eq('normalized_name', normalized)
      .limit(1);

    if (error) throw error;
    
    return !!(data && data.length > 0);
  } catch (error) {
    console.error('Error checking if celebrity exists in Supabase:', error);
    return false;
  }
}

export async function getCelebrityClues(name: string): Promise<string[] | null> {
  try {
    const normalized = normalizeCelebrityName(name);
    
    const { data, error } = await supabase
      .from('celebrile_puzzles')
      .select('clues')
      .eq('normalized_name', normalized)
      .limit(1);

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return null;
    }
    
    return data[0].clues;
  } catch (error) {
    console.error('Error getting celebrity clues from Supabase:', error);
    return null;
  }
}

export async function addCelebrileResult(
  success: boolean, 
  attempts: number,
  userId?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('puzzle_results')
      .insert([{
        category: 'celebrile',
        success,
        attempts,
        user_id: userId,
        timestamp: new Date().toISOString()
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving celebrile result to Supabase:', error);
  }
}

export async function getCelebrileStats(): Promise<{
  totalPlayers: number;
  successRate: number;
  averageAttempts: number;
}> {
  try {
    const { data: results, error } = await supabase
      .from('puzzle_results')
      .select('*')
      .eq('category', 'celebrile');

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
    console.error('Error getting celebrile stats from Supabase:', error);
    return {
      totalPlayers: 0,
      successRate: 0,
      averageAttempts: 0
    };
  }
}

export function normalizeCelebrityName(name: string): string {
  return name.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
}

// Utility function to transform Supabase data to CelebrilePuzzle interface
function transformToCelebrilePuzzle(puzzleData: CelebrilePuzzleRow): CelebrilePuzzle {
  return {
    id: puzzleData.id,
    targetName: puzzleData.target_name,
    clues: puzzleData.clues,
    imageUrl: puzzleData.image_url,
    category: puzzleData.category,
    date: puzzleData.date || getClientDateString(),
    validationHints: {
      birthYear: puzzleData.validation_hints?.birth_year,
      profession: puzzleData.validation_hints?.profession,
      notableWorks: puzzleData.validation_hints?.notable_works,
      nationality: puzzleData.validation_hints?.nationality,
      yearsActive: puzzleData.validation_hints?.years_active
    }
  };
}

// Function to set daily celebrile puzzle
export async function setDailyCelebrilePuzzle(puzzleId: string, date?: Date): Promise<boolean> {
  try {
    const dateString = date ? getClientDateString(date) : getClientDateString();
    
    const { error } = await supabase
      .from('daily_puzzles')
      .upsert([{
        date: dateString,
        category: 'celebrile',
        puzzle_id: puzzleId
      }], {
        onConflict: 'date,category'
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error setting daily celebrile puzzle:', error);
    return false;
  }
}