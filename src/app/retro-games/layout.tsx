// src/app/word-games/layout.tsx
import { generateRetroGamesMetadata } from './metadata';

export const metadata = generateRetroGamesMetadata();

export default function WordGamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}