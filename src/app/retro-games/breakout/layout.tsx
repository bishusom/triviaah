// src/app/brainwave/breakout/layout.tsx
import { generateBreakoutMetadata } from './metadata';

export const metadata = generateBreakoutMetadata();

export default function BreakoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}