// src/app/word-games/spelling-bee/layout.tsx
import { generateSpellingBeeMetadata } from './metadata';

export const metadata = generateSpellingBeeMetadata();

export default function SpellingBeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}