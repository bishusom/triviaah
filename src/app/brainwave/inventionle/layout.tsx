// src/app/inventionle/layout.tsx
import { generateInventionleMetadata } from './metadata';

export const metadata = generateInventionleMetadata();

export default function InventionleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}