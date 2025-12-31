// lib/brainwave/botanle/botanle-sb.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface PlantInfo {
  id: string;
  answer: string;
  common_name: string;
  scientific_name: string;
  full_name: string;
  category: 'flower' | 'fruit' | 'tree' | 'herb' | 'succulent' | 'vegetable' | 'shrub' | 'fern' | 'cactus' | 'vine';
  plant_type: 'perennial' | 'annual' | 'biennial' | 'deciduous' | 'evergreen';
  family: string;
  genus: string;
  species: string;
  native_region: string[];
  climate_zones: string[];
  blooming_season: string[];
  fruiting_season: string[];
  size_category: 'small' | 'medium' | 'large' | 'gigantic';
  height_min: number; // in cm
  height_max: number; // in cm
  spread_min: number; // in cm
  spread_max: number; // in cm
  lifespan_years: number;
  water_requirements: 'low' | 'moderate' | 'high' | 'aquatic';
  sun_requirements: 'full_sun' | 'partial_shade' | 'full_shade';
  soil_type: string[];
  flower_color: string[];
  fruit_color: string[];
  leaf_color: string[];
  edible_parts: string[]; // e.g., ['fruit', 'leaves', 'roots', 'seeds']
  medicinal_uses: boolean;
  poisonous: boolean;
  fragrance: 'none' | 'mild' | 'strong' | 'sweet' | 'spicy';
  pollination_method: 'insect' | 'wind' | 'bird' | 'self' | 'bat';
  growth_rate: 'slow' | 'moderate' | 'fast';
  hardiness_zones: string; // e.g., "3-8"
  uses: string[]; // e.g., ['ornamental', 'culinary', 'medicinal', 'timber']
  symbolism: string[];
  mythological_references: string[];
  famous_gardens: string[];
  recognition_score: number;
  nickname: string;
  significance: string;
  cultivation_tips: string;
  hint_column: string;
  fun_fact: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  conservation_status: 'least_concern' | 'vulnerable' | 'endangered' | 'critically_endangered' | 'extinct_in_wild';
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare';
  special_features: string[]; // e.g., ['drought_tolerant', 'deer_resistant', 'attracts_butterflies']
}

export interface BotanlePuzzle extends PlantInfo {
  date: string;
}

export interface BotanleResult {
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

export async function getDailyPlant(customDate?: Date): Promise<{
  puzzle: BotanlePuzzle | null;
}> {
  try {
    const dateString = getClientDateString(customDate);
    
    console.log('Fetching daily botanle puzzle for date:', dateString);
    
    // Try to get daily puzzle first
    const { data: dailyPuzzles, error: dailyError } = await supabase
      .from('daily_puzzles')
      .select('*')
      .eq('date', dateString)
      .eq('category', 'botanle')
      .limit(1);
    
    let puzzleData = null;
    
    if (!dailyError && dailyPuzzles && dailyPuzzles.length > 0) {
      // Fetch the specific daily puzzle
      const { data: dailyPuzzle, error: puzzleError } = await supabase
        .from('botanle_puzzles')
        .select('*')
        .eq('id', dailyPuzzles[0].puzzle_id)
        .single();
        
      if (!puzzleError) puzzleData = dailyPuzzle;
    }
    
    // If no daily puzzle found, get a random one
    if (!puzzleData) {
      console.log('Getting random botanle puzzle instead of daily');
      const { data: randomPuzzles, error: randomError } = await supabase
        .from('random_botanle_puzzles')
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
      } as BotanlePuzzle,
    };
    
  } catch (error) {
    console.error('Error getting botanle puzzle:', error);
    return { puzzle: null };
  }
}

export async function addBotanleResult(
  success: boolean, 
  attempts: number,
  userId?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('puzzle_results')
      .insert([{
        category: 'botanle',
        success,
        attempts,
        user_id: userId,
        timestamp: new Date().toISOString()
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving botanle result to Supabase:', error);
  }
}

export async function getBotanleStats(): Promise<{
  totalPlayers: number;
  successRate: number;
  averageAttempts: number;
}> {
  try {
    const { data: results, error } = await supabase
      .from('puzzle_results')
      .select('*')
      .eq('category', 'botanle');

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
    console.error('Error getting botanle stats from Supabase:', error);
    return {
      totalPlayers: 0,
      successRate: 0,
      averageAttempts: 0
    };
  }
}