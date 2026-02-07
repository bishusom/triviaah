// src/app/brainwave/minesweeper/layout.tsx
import { generateMinesweeperMetadata } from './metadata';

export const metadata = generateMinesweeperMetadata();

export default function MinesweeperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}