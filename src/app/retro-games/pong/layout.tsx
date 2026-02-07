// src/app/brainwave/minesweeper/layout.tsx
import { generatePongMetadata } from './metadata';

export const metadata = generatePongMetadata();

export default function MinesweeperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}