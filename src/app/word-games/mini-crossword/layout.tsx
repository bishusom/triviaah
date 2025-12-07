// src/app/word-games/word-crossgrid/layout.tsx
import { generateMiniCrossWordMetadata } from './metadata';

export const metadata = generateMiniCrossWordMetadata();

export default function WordCrossGridLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}