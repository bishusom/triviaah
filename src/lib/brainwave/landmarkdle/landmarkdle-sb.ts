// lib/brainwave/landmarkdle/landmarkdle-sb.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface LandmarkInfo {
  name: string;
  type: string;
  location: string;
  architect: string;
  builtYear: number;
  height: string;
  material: string;
  funFact: string;
}

export interface LandmarkPuzzle {
  id: string;
  answer: string;
  type: string;
  location: string;
  architect: string;
  builtYear: number;
  height: string;
  material: string;
  funFact: string;
  date: string;
}

export interface LandmarkResult {
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

export async function getDailyLandmark(customDate?: Date): Promise<{puzzle: LandmarkPuzzle | null}> {
  try {
    const dateString = getClientDateString(customDate);
    
    console.log('Fetching daily landmark puzzle for date:', dateString);
    
    // Try to get daily puzzle first
    const { data: dailyPuzzles, error: dailyError } = await supabase
      .from('daily_puzzles')
      .select('*')
      .eq('date', dateString)
      .eq('category', 'landmark')
      .limit(1);

    let puzzleData = null;
    
    if (!dailyError && dailyPuzzles && dailyPuzzles.length > 0) {
      // Fetch the specific daily puzzle
      const { data: dailyPuzzle, error: puzzleError } = await supabase
        .from('landmarkdle_puzzles')
        .select('*')
        .eq('id', dailyPuzzles[0].puzzle_id)
        .single();
        
      if (!puzzleError) puzzleData = dailyPuzzle;
    }
    
    // If no daily puzzle found, get a random one
    if (!puzzleData) {
      console.log('Getting random landmark puzzle instead of daily');
      const { data: randomPuzzles, error: randomError } = await supabase
        .from('random_landmarkdle_puzzles')
        .select('*')
        .limit(1);
        
      if (!randomError && randomPuzzles && randomPuzzles.length > 0) {
        puzzleData = randomPuzzles[0];
      }
    }
    
    if (!puzzleData) {
      return { puzzle: null };
    }
    
    return {
      puzzle: {
        id: puzzleData.id,
        answer: puzzleData.answer,
        type: puzzleData.type,
        location: puzzleData.location,
        architect: puzzleData.architect,
        builtYear: puzzleData.built_year,
        height: puzzleData.height,
        material: puzzleData.material,
        funFact: puzzleData.fun_fact,
        date: dateString,
      } as LandmarkPuzzle
    };
    
  } catch (error) {
    console.error('Error getting landmark puzzle:', error);
    return { puzzle: null };
  }
}

export async function addLandmarkResult(
  success: boolean, 
  attempts: number,
  userId?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('puzzle_results')
      .insert([{
        category: 'landmark',
        success,
        attempts,
        user_id: userId,
        timestamp: new Date().toISOString()
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving landmark result to Supabase:', error);
  }
}

export async function getLandmarkStats(): Promise<{
  totalPlayers: number;
  successRate: number;
  averageAttempts: number;
}> {
  try {
    const { data: results, error } = await supabase
      .from('puzzle_results')
      .select('*')
      .eq('category', 'landmark');

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
    console.error('Error getting landmark stats from Supabase:', error);
    return {
      totalPlayers: 0,
      successRate: 0,
      averageAttempts: 0
    };
  }
}