// src/app/trordle/layout.tsx
import { generateTrordleMetadata } from './metadata';

export const metadata = generateTrordleMetadata();

export default function TrordleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}