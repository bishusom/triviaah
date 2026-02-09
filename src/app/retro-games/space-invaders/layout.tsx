// src/app/retro-games/space-invaders/layout.tsx
import { generateSpaceInvadersMetadata } from './metadata';

export const metadata = generateSpaceInvadersMetadata();

export default function SpaceInvadersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}