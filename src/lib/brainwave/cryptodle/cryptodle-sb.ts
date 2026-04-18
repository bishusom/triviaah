// lib/brainwave/cryptodle/cryptodle-sb.ts
import { createClient } from '@supabase/supabase-js';
import { generateDeterministicCipher } from './cipher';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface CryptodlePuzzle {
  id: string;
  targetQuote: string;
  encryptedQuote: string;
  cipherMapping: Record<string, string>;
  hints: string[];
  author?: string;
  authorImageUrl?: string;
  date: string;
}

interface DailyPuzzleRow {
  id: string;
  date: string;
  category: string;
  puzzle_id: string;
}

interface CryptodlePuzzleRow {
  id: string;
  target_quote: string;
  hints: string[];
  author?: string;
  author_image_url?: string;
  times_used?: number;
  last_used?: string;
  is_active?: boolean;
}

function getClientDateString(customDate?: Date): string {
  const date = customDate || new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

async function getDailyPuzzleRow(dateStr: string): Promise<DailyPuzzleRow | null> {
  const { data, error } = await supabase
    .from('daily_puzzles')
    .select('*')
    .eq('date', dateStr)
    .eq('category', 'cryptodle')
    .limit(1);

  if (error) {
    console.error('Error fetching daily cryptodle puzzle mapping:', error);
    return null;
  }

  return data?.[0] || null;
}

async function getRandomCryptodlePuzzle(): Promise<CryptodlePuzzleRow | null> {
  const { data, error } = await supabase
    .from('random_cryptodle_puzzles')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching random cryptodle puzzle:', error);
    return null;
  }

  return data?.[0] || null;
}

async function getCryptodlePuzzleById(puzzleId: string): Promise<CryptodlePuzzleRow | null> {
  const { data, error } = await supabase
    .from('cryptodle_puzzles')
    .select('*')
    .eq('id', puzzleId)
    .single();

  if (error) {
    console.error('Error fetching cryptodle puzzle by id:', error);
    return null;
  }

  return data;
}

function normalizeCryptodlePuzzleRow(puzzle: CryptodlePuzzleRow, dateString: string): CryptodlePuzzle {
  const seed = `${dateString}-${puzzle.id}`;
  const { cipherMapping, encryptedText } = generateDeterministicCipher(puzzle.target_quote, seed);

  return {
    id: puzzle.id,
    targetQuote: puzzle.target_quote,
    encryptedQuote: encryptedText,
    cipherMapping,
    hints: puzzle.hints || [],
    author: puzzle.author,
    authorImageUrl: puzzle.author_image_url,
    date: dateString,
  };
}

export async function getDailyCryptodle(customDate?: Date): Promise<CryptodlePuzzle | null> {
  try {
    const dateString = getClientDateString(customDate);
    const dailyPuzzle = await getDailyPuzzleRow(dateString);

    if (dailyPuzzle?.puzzle_id) {
      const puzzle = await getCryptodlePuzzleById(dailyPuzzle.puzzle_id);
      if (puzzle) {
        // Fire-and-forget update of usage stats (no await, handle errors)
        (async () => {
          try {
            await supabase
              .from('cryptodle_puzzles')
              .update({
                last_used: dateString,
                times_used: (puzzle.times_used || 0) + 1,
              })
              .eq('id', puzzle.id);
          } catch (err) {
            console.error('Failed to update usage stats:', err);
          }
        })();

        return normalizeCryptodlePuzzleRow(puzzle, dateString);
      }
    }

    const randomPuzzle = await getRandomCryptodlePuzzle();
    if (randomPuzzle) {
      return normalizeCryptodlePuzzleRow(randomPuzzle, dateString);
    }

    return null;
  } catch (error) {
    console.error('Error fetching daily cryptodle:', error);
    return null;
  }
}

export async function addCryptodleResult(
  success: boolean,
  attempts: number,
  userId?: string
): Promise<void> {
  try {
    const { error } = await supabase.from('puzzle_results').insert([
      {
        category: 'cryptodle',
        success,
        attempts,
        user_id: userId,
        timestamp: new Date().toISOString(),
      },
    ]);
    if (error) throw error;
  } catch (error) {
    console.error('Error saving cryptodle result:', error);
  }
}

export async function getCryptodleStats(): Promise<{
  totalPlayers: number;
  successRate: number;
  averageAttempts: number;
}> {
  try {
    const { data: results, error } = await supabase
      .from('puzzle_results')
      .select('*')
      .eq('category', 'cryptodle');

    if (error) throw error;

    const resultsData = results || [];
    const totalPlayers = resultsData.length;
    const successfulResults = resultsData.filter((r) => r.success);
    const successRate = totalPlayers > 0 ? successfulResults.length / totalPlayers : 0;
    const totalAttempts = resultsData.reduce((sum, r) => sum + r.attempts, 0);
    const averageAttempts = totalPlayers > 0 ? totalAttempts / totalPlayers : 0;

    return {
      totalPlayers,
      successRate: Math.round(successRate * 100),
      averageAttempts: Math.round(averageAttempts * 10) / 10,
    };
  } catch (error) {
    console.error('Error getting cryptodle stats:', error);
    return { totalPlayers: 0, successRate: 0, averageAttempts: 0 };
  }
}
