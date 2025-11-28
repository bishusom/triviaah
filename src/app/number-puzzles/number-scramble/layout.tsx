// src/app/number-puzzles/number-scramble/layout.tsx
import { generateNumberScrambleMetadata } from './metadata';

export const metadata = generateNumberScrambleMetadata();

export default function NumberScrambleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}