// src/app/plotle/layout.tsx
import { generateHistoridleMetadata } from './metadata';

export const metadata = generateHistoridleMetadata();

export default function CelebrileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}