// src/app/number-puzzles/number-scramble/layout.tsx
import { generateKakuroMetadata } from './metadata';

export const metadata = generateKakuroMetadata();

export default function KakuroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}