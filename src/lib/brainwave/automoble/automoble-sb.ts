// lib/brainwave/automoble/automoble-sb.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface CarInfo {
  id: string;
  answer: string;
  make: string;
  model: string;
  full_name: string;
  year: number;
  category: string;
  vehicle_type: string;
  country_origin: string;
  era: string;
  engine: string;
  horsepower: number;
  torque: number;
  top_speed: number;
  acceleration_0_60: number;
  drivetrain: string;
  transmission: string;
  fuel_type: string;
  doors: number;
  seats: number;
  decade: string;
  design_characteristics: string[];
  famous_color: string;
  recognition_score: number;
  famous_appearance: string[];
  nickname: string;
  significance: string;
  production_years: string;
  units_produced: string;
  image_url: string;
  silhouette_url: string;
  hint_column: string;
  fun_fact: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface AutomoblePuzzle extends CarInfo {
  date: string;
}

export interface AutomobleResult {
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

export async function getDailyCar(customDate?: Date): Promise<{
  puzzle: AutomoblePuzzle | null;
}> {
  try {
    const dateString = getClientDateString(customDate);
    
    console.log('Fetching daily automoble puzzle for date:', dateString);
    
    // Try to get daily puzzle first
    const { data: dailyPuzzles, error: dailyError } = await supabase
      .from('daily_puzzles')
      .select('*')
      .eq('date', dateString)
      .eq('category', 'automoble')
      .limit(1);
    
    let puzzleData = null;
    
    if (!dailyError && dailyPuzzles && dailyPuzzles.length > 0) {
      // Fetch the specific daily puzzle
      const { data: dailyPuzzle, error: puzzleError } = await supabase
        .from('automoble_puzzles')
        .select('*')
        .eq('id', dailyPuzzles[0].puzzle_id)
        .single();
        
      if (!puzzleError) puzzleData = dailyPuzzle;
    }
    
    // If no daily puzzle found, get a random one
    if (!puzzleData) {
      console.log('Getting random automoble puzzle instead of daily');
      const { data: randomPuzzles, error: randomError } = await supabase
        .from('random_automoble_puzzles')
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
        ...puzzleData,
        date: dateString,
      } as AutomoblePuzzle,
    };
    
  } catch (error) {
    console.error('Error getting automoble puzzle:', error);
    return { puzzle: null };
  }
}

export async function addAutomobleResult(
  success: boolean, 
  attempts: number,
  userId?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('puzzle_results')
      .insert([{
        category: 'automoble',
        success,
        attempts,
        user_id: userId,
        timestamp: new Date().toISOString()
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving automoble result to Supabase:', error);
  }
}

export async function getAutomobleStats(): Promise<{
  totalPlayers: number;
  successRate: number;
  averageAttempts: number;
}> {
  try {
    const { data: results, error } = await supabase
      .from('puzzle_results')
      .select('*')
      .eq('category', 'automoble');

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
    console.error('Error getting automoble stats from Supabase:', error);
    return {
      totalPlayers: 0,
      successRate: 0,
      averageAttempts: 0
    };
  }
}