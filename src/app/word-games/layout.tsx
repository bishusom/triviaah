// src/app/word-games/layout.tsx
import { generateWordGamesMetadata } from './metadata';

export const metadata = generateWordGamesMetadata();

export default function WordGamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}