// src/app/number-puzzles/2048/layout.tsx
import { generate2048Metadata } from './metadata';

export const metadata = generate2048Metadata();

export default function Number2048Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
