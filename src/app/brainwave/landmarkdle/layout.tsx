// src/app/creaturdle/layout.tsx
import { generateLandmarkdleMetadata } from './metadata';

export const metadata = generateLandmarkdleMetadata();

export default function CreaturdleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}