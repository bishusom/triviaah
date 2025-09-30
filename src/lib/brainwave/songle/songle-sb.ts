// lib/songle-sb.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface SonglePuzzle {
  id: string;
  targetTitle: string;
  normalizedTitle: string;
  artist: string;
  decade: string;
  genre: string;
  lyricHint: string;
  date: string;
  validationHints: {
    releaseYear?: number;
    album?: string;
    featuredArtists?: string[];
    duration?: number;
    billboardPeak?: number;
  };
}

export interface SongleResult {
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

interface SonglePuzzleRow {
  id: string;
  target_title: string;
  normalized_title: string;
  artist: string;
  decade: string;
  genre: string;
  lyric_hint?: string;
  date?: string;
  validation_hints?: {
    release_year?: number;
    album?: string;
    featured_artists?: string[];
    duration?: number;
    billboard_peak?: number;
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

export async function getDailySongle(customDate?: Date): Promise<SonglePuzzle | null> {
  try {
    const dateString = getClientDateString(customDate);
    
    // First, get the daily puzzle entry
    const { data: dailyPuzzles, error: dailyError } = await supabase
      .from('daily_puzzles')
      .select('*')
      .eq('date', dateString)
      .eq('category', 'songle')
      .limit(1);

    if (dailyError || !dailyPuzzles || dailyPuzzles.length === 0) {
      console.log('No daily puzzle found for date:', dateString, '- getting random puzzle');
      return getRandomSongle();
    }
    
    const dailyPuzzle = dailyPuzzles[0];
    const puzzleId = dailyPuzzle.puzzle_id;
    
    // Now fetch the actual puzzle data from songle_puzzles
    const { data: puzzleData, error: puzzleError } = await supabase
      .from('songle_puzzles')
      .select('*')
      .eq('id', puzzleId)
      .single();

    if (puzzleError || !puzzleData) {
      console.log('No songle puzzle found with ID:', puzzleId, '- getting random puzzle');
      return getRandomSongle();
    }
    
    return transformToSonglePuzzle(puzzleData);
  } catch (error) {
    console.error('Error getting daily songle from Supabase:', error);
    return null;
  }
}

export async function getRandomSongle(): Promise<SonglePuzzle | null> {
  try {
    // Use PostgreSQL's random() function for true randomness
    const { data: puzzles, error } = await supabase
      .from('random_songle_puzzles')
      .select('*')
      .limit(1);

    if (error || !puzzles || puzzles.length === 0) return null;
    
    return transformToSonglePuzzle(puzzles[0]);
  } catch (error) {
    console.error('Error getting random songle from Supabase:', error);
    return null;
  }
}

export async function checkSongExists(title: string): Promise<boolean> {
  try {
    const normalized = normalizeSongTitle(title);
    console.log('Checking if song exists:', normalized);
    
    const { data, error } = await supabase
      .from('songle_puzzles')
      .select('id')
      .eq('normalized_title', normalized)
      .limit(1);

    if (error) throw error;
    
    console.log('Song exists check:', !!(data && data.length > 0));
    return !!(data && data.length > 0);
  } catch (error) {
    console.error('Error checking if song exists in Supabase:', error);
    return false;
  }
}

export async function getSongDetails(title: string): Promise<{
  artist: string;
  decade: string;
  genre: string;
  lyricHint: string;
} | null> {
  try {
    const normalized = normalizeSongTitle(title);
    console.log('Looking up details for normalized title:', normalized);
    
    const { data, error } = await supabase
      .from('songle_puzzles')
      .select('artist, decade, genre, lyric_hint')
      .eq('normalized_title', normalized)
      .limit(1);

    if (error) throw error;
    
    console.log('Found documents:', data?.length || 0);
    
    if (!data || data.length === 0) {
      console.log('No song found in puzzles:', normalized);
      return null;
    }
    
    const songData = data[0];
    console.log('Song data found:', songData);
    
    return {
      artist: songData.artist || '',
      decade: songData.decade || '',
      genre: songData.genre || '',
      lyricHint: songData.lyric_hint || ''
    };
  } catch (error) {
    console.error('Error getting song details from Supabase:', error);
    return null;
  }
}

export async function addSongleResult(
  success: boolean, 
  attempts: number,
  userId?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('puzzle_results')
      .insert([{
        category: 'songle',
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

export async function getSongleStats(): Promise<{
  totalPlayers: number;
  successRate: number;
  averageAttempts: number;
}> {
  try {
    const { data: results, error } = await supabase
      .from('puzzle_results')
      .select('*')
      .eq('category', 'songle');

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
    console.error('Error getting songle stats from Supabase:', error);
    return {
      totalPlayers: 0,
      successRate: 0,
      averageAttempts: 0
    };
  }
}

// Helper function for title normalization
export function normalizeSongTitle(title: string): string {
  // First normalize the string
  let normalized = title.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
  
  // Only remove articles if they are the first word
  if (normalized.startsWith('the ')) {
    normalized = normalized.substring(4);
  } else if (normalized.startsWith('a ')) {
    normalized = normalized.substring(2);
  } else if (normalized.startsWith('an ')) {
    normalized = normalized.substring(3);
  }
  
  return normalized;
}

// Utility function to transform Supabase data to SonglePuzzle interface
function transformToSonglePuzzle(puzzleData: SonglePuzzleRow): SonglePuzzle {
  return {
    id: puzzleData.id,
    targetTitle: puzzleData.target_title,
    normalizedTitle: puzzleData.normalized_title,
    artist: puzzleData.artist,
    decade: puzzleData.decade,
    genre: puzzleData.genre,
    lyricHint: puzzleData.lyric_hint || '',
    date: puzzleData.date || getClientDateString(),
    validationHints: {
      releaseYear: puzzleData.validation_hints?.release_year,
      album: puzzleData.validation_hints?.album,
      featuredArtists: puzzleData.validation_hints?.featured_artists,
      duration: puzzleData.validation_hints?.duration,
      billboardPeak: puzzleData.validation_hints?.billboard_peak
    }
  };
}

// Additional utility function to set daily puzzle
export async function setDailySonglePuzzle(puzzleId: string, date?: Date): Promise<boolean> {
  try {
    const dateString = date ? getClientDateString(date) : getClientDateString();
    
    const { error } = await supabase
      .from('daily_puzzles')
      .upsert([{
        date: dateString,
        category: 'songle',
        puzzle_id: puzzleId
      }], {
        onConflict: 'date,category'
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error setting daily songle puzzle:', error);
    return false;
  }
}

// Utility function to search songs by partial title
export async function searchSongsByTitle(searchTerm: string, limit: number = 10): Promise<SonglePuzzle[]> {
  try {
    const normalizedSearch = normalizeSongTitle(searchTerm);
    
    const { data, error } = await supabase
      .from('songle_puzzles')
      .select('*')
      .ilike('normalized_title', `%${normalizedSearch}%`)
      .limit(limit);

    if (error) throw error;
    
    return (data || []).map(transformToSonglePuzzle);
  } catch (error) {
    console.error('Error searching songs in Supabase:', error);
    return [];
  }
}

// Utility function to get songs by artist
export async function getSongsByArtist(artist: string, limit: number = 10): Promise<SonglePuzzle[]> {
  try {
    const { data, error } = await supabase
      .from('songle_puzzles')
      .select('*')
      .ilike('artist', `%${artist}%`)
      .limit(limit);

    if (error) throw error;
    
    return (data || []).map(transformToSonglePuzzle);
  } catch (error) {
    console.error('Error getting songs by artist from Supabase:', error);
    return [];
  }
}

// Utility function to get songs by decade
export async function getSongsByDecade(decade: string, limit: number = 10): Promise<SonglePuzzle[]> {
  try {
    const { data, error } = await supabase
      .from('songle_puzzles')
      .select('*')
      .eq('decade', decade)
      .limit(limit);

    if (error) throw error;
    
    return (data || []).map(transformToSonglePuzzle);
  } catch (error) {
    console.error('Error getting songs by decade from Supabase:', error);
    return [];
  }
}