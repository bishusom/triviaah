// src/app/word-games/boggle/layout.tsx
import { generateBoggleMetadata } from './metadata';

export const metadata = generateBoggleMetadata();

export default function BoggleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}