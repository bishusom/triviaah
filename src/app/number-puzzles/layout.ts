// src/app/number-puzzles/layout.tsx
import { generateNumberPuzzlesMetadata } from './metadata';

export const metadata = generateNumberPuzzlesMetadata();

export default function NumberPuzzlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}