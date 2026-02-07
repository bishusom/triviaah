// src/app/brainwave/minesweeper/layout.tsx
import { generateTetrisMetadata } from './metadata';

export const metadata = generateTetrisMetadata();

export default function MinesweeperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}