// src/app/retro-games/tic-tac-toe/layout.tsx
import { generateTicTacToeMetadata } from './metadata';

export const metadata = generateTicTacToeMetadata();

export default function TicTacToeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}