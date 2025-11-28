// src/app/number-puzzles/prime-hunter/layout.tsx
import { generatePrimeHunterMetadata } from './metadata';

export const metadata = generatePrimeHunterMetadata();

export default function PrimeHunterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}