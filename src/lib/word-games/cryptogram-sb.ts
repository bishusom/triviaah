import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export type CryptogramPuzzleType = 'quote' | 'book' | 'movie';

export interface CryptogramQuote {
  id: string;
  targetQuote: string;
  person: string;
  sourceLabel: string;
  sourceValue: string;
  puzzleType: CryptogramPuzzleType;
}

interface DailyPuzzleRow {
  puzzle_id: string;
}

interface CryptogramPuzzleRow {
  id: string;
  unencrypted_text?: string;
  person?: string;
  puzzle_type?: string;
  person_role?: string;
}

function getClientDateString(customDate?: Date): string {
  const date = customDate || new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getFirstNonEmpty(...values: Array<string | undefined>): string {
  for (const value of values) {
    if (value && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

function normalizePuzzleType(row: CryptogramPuzzleRow): CryptogramPuzzleType {
  const rawType = getFirstNonEmpty(row.puzzle_type, row.person_role).toLowerCase();

  if (rawType.includes('author')) return 'book';
  if (rawType.includes('lead_star')) return 'movie';
  return 'quote';
}

function getSourceLabel(puzzleType: CryptogramPuzzleType): string {
  switch (puzzleType) {
    case 'book':
      return 'Author';
    case 'movie':
      return 'Lead star';
    default:
      return 'Attributed to';
  }
}

function getSourceValue(row: CryptogramPuzzleRow, puzzleType: CryptogramPuzzleType): string {
  switch (puzzleType) {
    case 'book':
      return getFirstNonEmpty(row.person, 'Unknown');
    case 'movie':
      return getFirstNonEmpty(row.person, 'Unknown');
    default:
      return getFirstNonEmpty(row.person, 'Unknown');
  }
}

function normalizePuzzleRow(row: CryptogramPuzzleRow): CryptogramQuote {
  const puzzleType = normalizePuzzleType(row);
  const targetQuote = getFirstNonEmpty(row.unencrypted_text).toUpperCase();
  const sourceValue = getSourceValue(row, puzzleType);

  return {
    id: row.id,
    targetQuote,
    person: sourceValue,
    sourceLabel: getSourceLabel(puzzleType),
    sourceValue,
    puzzleType,
  };
}

async function getDailyPuzzleId(dateString: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('daily_puzzles')
    .select('puzzle_id')
    .eq('date', dateString)
    .eq('category', 'cryptogram')
    .limit(1);

  if (error) {
    console.error('Error fetching daily cryptogram puzzle mapping:', error);
    return null;
  }

  return data?.[0]?.puzzle_id ?? null;
}

async function getCryptogramPuzzleById(puzzleId: string): Promise<CryptogramPuzzleRow | null> {
  const { data, error } = await supabase
    .from('cryptogram_puzzles')
    .select('*')
    .eq('id', puzzleId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching cryptogram puzzle by id:', error);
    return null;
  }

  return data ?? null;
}

async function getRandomCryptogramPuzzleRow(minLength?: number, maxLength?: number, excludeIds?: string[]): Promise<CryptogramPuzzleRow | null> {
  const { data, error } = await supabase
    .from('random_cryptogram_puzzles')
    .select('*')
    .limit(50);

  if (error) {
    console.error('Error fetching random cryptogram puzzle:', error);
    return null;
  }

  if (!data || data.length === 0) return null;

  let candidates = data;
  
  if (excludeIds && excludeIds.length > 0) {
    candidates = candidates.filter(row => !excludeIds.includes(row.id));
  }

  if (minLength !== undefined && maxLength !== undefined) {
    candidates = candidates.filter(row => {
      const text = row.unencrypted_text || '';
      return text.length >= minLength && text.length <= maxLength;
    });
  }

  if (candidates.length > 0) {
    return candidates[0];
  }

  return data[0];
}

export async function getDailyCryptogramQuote(customDate?: Date, minLength?: number, maxLength?: number, excludeIds?: string[]): Promise<CryptogramQuote | null> {
  try {
    const dateString = getClientDateString(customDate);
    const dailyPuzzleId = await getDailyPuzzleId(dateString);

    if (dailyPuzzleId) {
      const dailyPuzzle = await getCryptogramPuzzleById(dailyPuzzleId);
      if (dailyPuzzle) {
        if (minLength !== undefined && maxLength !== undefined) {
          const textLen = (dailyPuzzle.unencrypted_text || '').length;
          if (textLen >= minLength && textLen <= maxLength) {
            return normalizePuzzleRow(dailyPuzzle);
          }
        } else {
          return normalizePuzzleRow(dailyPuzzle);
        }
      }
    }

    const randomPuzzle = await getRandomCryptogramPuzzleRow(minLength, maxLength, excludeIds);
    return randomPuzzle ? normalizePuzzleRow(randomPuzzle) : null;
  } catch (error) {
    console.error('Error fetching daily cryptogram puzzle:', error);
    return null;
  }
}

export async function getRandomCryptogramQuote(minLength?: number, maxLength?: number, excludeIds?: string[]): Promise<CryptogramQuote | null> {
  try {
    const randomPuzzle = await getRandomCryptogramPuzzleRow(minLength, maxLength, excludeIds);
    return randomPuzzle ? normalizePuzzleRow(randomPuzzle) : null;
  } catch (error) {
    console.error('Error fetching random cryptogram puzzle:', error);
    return null;
  }
}

export async function getDailyCryptogramPuzzle(customDate?: Date, minLength?: number, maxLength?: number, excludeIds?: string[]): Promise<CryptogramQuote | null> {
  return getDailyCryptogramQuote(customDate, minLength, maxLength, excludeIds);
}

export async function getRandomCryptogramPuzzle(minLength?: number, maxLength?: number, excludeIds?: string[]): Promise<CryptogramQuote | null> {
  return getRandomCryptogramQuote(minLength, maxLength, excludeIds);
}
