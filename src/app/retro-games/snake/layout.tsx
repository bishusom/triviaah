// src/app/brainwave/minesweeper/layout.tsx
import { generateSnakeMetadata } from './metadata';

export const metadata = generateSnakeMetadata();

export default function MinesweeperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}