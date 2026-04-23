// src/app/brainwave/botanle/layout.tsx
import { generateBotanleMetadata } from './metadata';

export const metadata = generateBotanleMetadata();

export default function BotanleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}