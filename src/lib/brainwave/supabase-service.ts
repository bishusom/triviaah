// lib/brainwave/supabase-service.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Convert a snake_case string to camelCase.
 * e.g. "release_year" → "releaseYear", "oscar_categories" → "oscarCategories"
 */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Normalize all keys in a validation_hints object from snake_case to camelCase.
 * Keeps both the camelCase AND the original snake_case key so either reference works.
 * e.g. { release_year: 2001 } → { release_year: 2001, releaseYear: 2001 }
 */
function normalizeHints(raw: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(raw)) {
    out[key] = value;                    // keep original snake_case
    out[snakeToCamel(key)] = value;      // also expose as camelCase
  }
  return out;
}

export interface GameData {
  id: string;
  targetTitle: string;
  date: string;
  category: string;
  emojis?: string;
  clues?: string[];
  validationHints: any;
}

function getClientDateString(customDate?: Date): string {
  const date = customDate || new Date();
  return date.toISOString().split('T')[0];
}

export async function getDailyPuzzle(
  category: string,
  customDate?: Date
): Promise<GameData | null> {
  try {
    const dateString = getClientDateString(customDate);

    const { data: dailyEntry } = await supabase
      .from('daily_puzzles')
      .select('puzzle_id')
      .eq('date', dateString)
      .eq('category', category)
      .single();

    if (!dailyEntry) return null;

    const { data: puzzle } = await supabase
      .from(`${category}_puzzles`)
      .select('*')
      .eq('id', dailyEntry.puzzle_id)
      .single();

    if (!puzzle) return null;

    return {
      id: puzzle.id,
      targetTitle: puzzle.target_title,
      date: dateString,
      category,
      emojis: puzzle.emojis,
      clues: puzzle.clues,
      // Normalize snake_case DB keys → camelCase so hintFields key references match.
      // We also preserve the raw object so any un-mapped key still resolves via
      // the snake_case fallback in DefaultHints.resolveHintValue.
      validationHints: normalizeHints(puzzle.validation_hints ?? {}),
    };
  } catch (error) {
    console.error('getDailyPuzzle error:', error);
    return null;
  }
}

/**
 * Fetch the last `limit` daily puzzles for a category (most recent first).
 * Used by the Last 7 Days panel to show past puzzle metadata.
 */
export async function getPastPuzzles(
  category: string,
  limit = 7
): Promise<GameData[]> {
  try {
    const today = getClientDateString();

    // Get the last `limit` daily_puzzle entries up to and including today
    const { data: entries, error: entriesError } = await supabase
      .from('daily_puzzles')
      .select('puzzle_id, date')
      .eq('category', category)
      .lte('date', today)
      .order('date', { ascending: false })
      .limit(limit);

    if (entriesError || !entries || entries.length === 0) return [];

    // Batch-fetch the puzzle rows
    const puzzleIds = entries.map((e: any) => e.puzzle_id);
    const { data: puzzles, error: puzzlesError } = await supabase
      .from(`${category}_puzzles`)
      .select('*')
      .in('id', puzzleIds);

    if (puzzlesError || !puzzles) return [];

    // Merge entry dates back onto puzzle rows
    const puzzleMap = new Map(puzzles.map((p: any) => [p.id, p]));

    return entries
      .map((entry: any) => {
        const puzzle = puzzleMap.get(entry.puzzle_id);
        if (!puzzle) return null;
        return {
          id: puzzle.id,
          targetTitle: puzzle.target_title,
          date: entry.date,
          category,
          emojis: puzzle.emojis,
          clues: puzzle.clues,
          validationHints: normalizeHints(puzzle.validation_hints ?? {}),
        } satisfies GameData;
      })
      .filter(Boolean) as GameData[];
  } catch (error) {
    console.error('getPastPuzzles error:', error);
    return [];
  }
}

/**
 * Save a game result to Supabase.
 * Accepts the structured object that GameShell passes.
 */
export async function saveGameResult(
  category: string,
  result: { success: boolean; attempts: number; puzzleId: string }
): Promise<void> {
  try {
    const guestId = localStorage.getItem('trivia_guest_alias');
    await supabase.from('game_results').insert({
      category,
      guest_id: guestId,
      success: result.success,
      attempts: result.attempts,
      puzzle_id: result.puzzleId,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('saveGameResult error:', error);
  }
}
