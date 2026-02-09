// src/app/brainwave/minesweeper/layout.tsx
import { generatePacManMetadata } from './metadata';

export const metadata = generatePacManMetadata();

export default function PacManLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}