// src/app/plotle/layout.tsx
import { generateCelebrileMetadata } from './metadata';

export const metadata = generateCelebrileMetadata();

export default function CelebrileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}