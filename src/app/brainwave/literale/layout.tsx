// src/app/plotle/layout.tsx
import { generateLiteraleMetadata } from './metadata';

export const metadata = generateLiteraleMetadata();

export default function LiteraleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}