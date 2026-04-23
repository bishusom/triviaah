// src/app/trordle/layout.tsx
import { generateCapitaleMetadata } from './metadata';

export const metadata = generateCapitaleMetadata  ();

export default function TrordleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}