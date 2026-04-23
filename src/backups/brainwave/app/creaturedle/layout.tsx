// src/app/creaturdle/layout.tsx
import { generateCreaturdleMetadata } from './metadata';

export const metadata = generateCreaturdleMetadata();

export default function CreaturdleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}