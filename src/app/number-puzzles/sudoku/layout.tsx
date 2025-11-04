// src/app/number-puzzles/sudoku/layout.tsx
import { generateSudokuMetadata } from './metadata';

export const metadata = generateSudokuMetadata();

export default function SudokuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}