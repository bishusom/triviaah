import { supabase } from '@/lib/supabase';

export interface CrossgridPuzzle {
  id: string;
  title: string;
  words: [string, string, string, string, string]; // Updated to 5
  acrossClues: [string, string, string, string, string]; // Updated to 5
  downClues: [string, string, string, string, string]; // Updated to 5
  date: string;
}

interface CrossgridPuzzleRow {
  id: string;
  title: string;
  solution_rows: string[];
  across_clues: string[];
  down_clues: string[];
}

function getClientDateString(customDate?: Date): string {
  const date = customDate || new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidCrossgridRow(row: CrossgridPuzzleRow | null): row is CrossgridPuzzleRow {
  return !!row &&
    Array.isArray(row.solution_rows) &&
    row.solution_rows.length === 5 && // Updated to 5
    Array.isArray(row.across_clues) &&
    row.across_clues.length === 5 && // Updated to 5
    Array.isArray(row.down_clues) &&
    row.down_clues.length === 5;    // Updated to 5
}

function transformCrossgridPuzzle(row: CrossgridPuzzleRow, date: string): CrossgridPuzzle {
  return {
    id: row.id,
    title: row.title,
    words: [
      row.solution_rows[0].toUpperCase(),
      row.solution_rows[1].toUpperCase(),
      row.solution_rows[2].toUpperCase(),
      row.solution_rows[3].toUpperCase(),
      row.solution_rows[4].toUpperCase(),
    ],
    acrossClues: row.across_clues as [string, string, string, string, string],
    downClues: row.down_clues as [string, string, string, string, string],
    date,
  };
}

export async function getRandomCrossgrid(customDate?: Date): Promise<CrossgridPuzzle | null> {
  try {
    const { data, error } = await supabase
      .from('random_crossgrid_puzzles') // Using main table directly or your view
      .select('*')
      .limit(1);

    if (error || !data || data.length === 0 || !isValidCrossgridRow(data[0] as CrossgridPuzzleRow)) {
      return null;
    }

    return transformCrossgridPuzzle(data[0] as CrossgridPuzzleRow, getClientDateString(customDate));
  } catch (error) {
    console.error('Error getting random Crossgrid puzzle:', error);
    return null;
  }
}

export async function getDailyCrossgrid(customDate?: Date): Promise<CrossgridPuzzle | null> {
  try {
    const dateString = getClientDateString(customDate);

    const { data: dailyPuzzles, error: dailyError } = await supabase
      .from('daily_puzzles')
      .select('puzzle_id')
      .eq('date', dateString)
      .eq('category', 'crossgrid')
      .limit(1);

    if (dailyError || !dailyPuzzles || dailyPuzzles.length === 0) {
      return getRandomCrossgrid(customDate);
    }

    const { data: puzzleData, error: puzzleError } = await supabase
      .from('crossgrid_puzzles')
      .select('*')
      .eq('id', dailyPuzzles[0].puzzle_id)
      .single();

    if (puzzleError || !isValidCrossgridRow(puzzleData as CrossgridPuzzleRow)) {
      return getRandomCrossgrid(customDate);
    }

    return transformCrossgridPuzzle(puzzleData as CrossgridPuzzleRow, dateString);
  } catch (error) {
    console.error('Error getting daily Crossgrid puzzle:', error);
    return getRandomCrossgrid(customDate);
  }
}