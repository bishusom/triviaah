// src/app/songle/layout.tsx
import { generateSongleMetadata } from './metadata';

export const metadata = generateSongleMetadata();

export default function SongleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}