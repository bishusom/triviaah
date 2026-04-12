import { supabase } from '@/lib/supabase';

type KakuroSolution = number[][];

export interface KakuroPuzzleData {
  id: string;
  title: string;
  rowSums: [number, number, number];
  colSums: [number, number, number];
  solution: KakuroSolution;
  date: string;
}

interface KakuroPuzzleRow {
  id: string;
  title: string;
  row_sums: number[];
  col_sums: number[];
  solution_grid: unknown;
}

function getClientDateString(customDate?: Date): string {
  const date = customDate || new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidSolutionGrid(grid: unknown): grid is KakuroSolution {
  return Array.isArray(grid) &&
    grid.length === 3 &&
    grid.every((row) =>
      Array.isArray(row) &&
      row.length === 3 &&
      row.every((value) => typeof value === 'number' && value >= 1 && value <= 9)
    );
}

function isValidKakuroRow(row: KakuroPuzzleRow | null): row is KakuroPuzzleRow {
  return !!row &&
    Array.isArray(row.row_sums) &&
    row.row_sums.length === 3 &&
    Array.isArray(row.col_sums) &&
    row.col_sums.length === 3 &&
    isValidSolutionGrid(row.solution_grid);
}

function transformKakuroPuzzle(row: KakuroPuzzleRow, date: string): KakuroPuzzleData {
  return {
    id: row.id,
    title: row.title,
    rowSums: [row.row_sums[0], row.row_sums[1], row.row_sums[2]],
    colSums: [row.col_sums[0], row.col_sums[1], row.col_sums[2]],
    solution: row.solution_grid as KakuroSolution,
    date,
  };
}

export async function getRandomKakuro(customDate?: Date): Promise<KakuroPuzzleData | null> {
  try {
    const { data, error } = await supabase
      .from('random_kakuro_puzzles')
      .select('*')
      .limit(1);

    if (error || !data || data.length === 0 || !isValidKakuroRow(data[0] as KakuroPuzzleRow)) {
      return null;
    }

    return transformKakuroPuzzle(data[0] as KakuroPuzzleRow, getClientDateString(customDate));
  } catch (error) {
    console.error('Error getting random Kakuro puzzle:', error);
    return null;
  }
}

export async function getDailyKakuro(customDate?: Date): Promise<KakuroPuzzleData | null> {
  try {
    const dateString = getClientDateString(customDate);

    const { data: dailyPuzzles, error: dailyError } = await supabase
      .from('daily_puzzles')
      .select('puzzle_id')
      .eq('date', dateString)
      .eq('category', 'kakuro')
      .limit(1);

    if (dailyError || !dailyPuzzles || dailyPuzzles.length === 0) {
      return getRandomKakuro(customDate);
    }

    const { data: puzzleData, error: puzzleError } = await supabase
      .from('kakuro_puzzles')
      .select('*')
      .eq('id', dailyPuzzles[0].puzzle_id)
      .single();

    if (puzzleError || !isValidKakuroRow(puzzleData as KakuroPuzzleRow)) {
      return getRandomKakuro(customDate);
    }

    return transformKakuroPuzzle(puzzleData as KakuroPuzzleRow, dateString);
  } catch (error) {
    console.error('Error getting daily Kakuro puzzle:', error);
    return null;
  }
}
