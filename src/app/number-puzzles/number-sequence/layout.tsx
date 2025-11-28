// src/app/number-puzzles/number-sequence/layout.tsx
import { generateNumberSequenceMetadata } from './metadata';

export const metadata = generateNumberSequenceMetadata();

export default function NumberSequenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}