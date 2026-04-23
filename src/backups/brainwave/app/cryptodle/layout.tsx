// src/app/brainwave/cryptodle/layout.tsx
import { generateCryptodleMetadata } from './metadata';

export const metadata = generateCryptodleMetadata();

export default function CryptodleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
