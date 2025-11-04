// src/app/word-games/boggle/layout.tsx
import { generateScrambleMetadata } from './metadata';

export const metadata = generateScrambleMetadata();

export default function ScrambleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}