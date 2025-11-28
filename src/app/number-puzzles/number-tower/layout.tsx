// src/app/number-puzzles/number-tower/layout.tsx
import { generateNumberTowerMetadata } from './metadata';

export const metadata = generateNumberTowerMetadata();

export default function NumberTowerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}