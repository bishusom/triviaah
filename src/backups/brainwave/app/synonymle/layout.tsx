// src/app/brainwave/synonymle/layout.tsx
import { generateSynonymleMetadata } from './metadata';

export const metadata = generateSynonymleMetadata();

export default function SynonymleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}