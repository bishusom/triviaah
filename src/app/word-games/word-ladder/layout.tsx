// src/app/word-games/word-ladder/layout.tsx
import { generateWordLadderMetadata } from './metadata';

export const metadata = generateWordLadderMetadata();

export default function WordLadderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}