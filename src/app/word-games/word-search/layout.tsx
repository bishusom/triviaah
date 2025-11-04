// src/app/word-games/word-search/layout.tsx
import { generateWordSearchMetadata } from './metadata';

export const metadata = generateWordSearchMetadata();

export default function WordSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}