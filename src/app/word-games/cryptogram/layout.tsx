// src/app/word-games/boggle/layout.tsx
import { generateCryptogramMetadata } from './metadata';

export const metadata = generateCryptogramMetadata();

export default function CryptogramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}