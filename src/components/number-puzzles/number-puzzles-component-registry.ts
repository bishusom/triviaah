'use client';

import type { ComponentType } from 'react';
import Puzzle2048 from '@/components/number-puzzles/2048Puzzle';
import PrimeHunterPuzzle from '@/components/number-puzzles/PrimeHunterPuzzle';
import NumberSequenceGame from '@/components/number-puzzles/NumberSequenceGame';
import NumberTowerGame from '@/components/number-puzzles/NumberTowerGame';
import SudokuPuzzle from '@/components/number-puzzles/SudokuPuzzle';
import KakuroPuzzle from '@/components/number-puzzles/KakuroPuzzle';
import KenKenPuzzle from '@/components/number-puzzles/KenKenPuzzle';

import NumberPyramidPuzzle from '@/components/number-puzzles/NumberPyramidPuzzle';
import type { NumberPuzzlesSlug } from '@/lib/number-puzzles/number-puzzles-route-registry';

const COMPONENT_REGISTRY: Record<NumberPuzzlesSlug, ComponentType<any>> = {
  '2048': Puzzle2048,
  'prime-hunter': PrimeHunterPuzzle,
  'number-sequence': NumberSequenceGame,
  'number-tower': NumberTowerGame,
  sudoku: SudokuPuzzle,
  kakuro: KakuroPuzzle,
  kenken: KenKenPuzzle,
  'number-pyramid': NumberPyramidPuzzle,
};

export function resolveNumberPuzzlesComponent(slug: NumberPuzzlesSlug): ComponentType<any> {
  return COMPONENT_REGISTRY[slug];
}
