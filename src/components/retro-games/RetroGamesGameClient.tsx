'use client';

import type { ReactNode } from 'react';
import { resolveRetroGamesComponent } from './retro-games-component-registry';

type RetroGamesGameClientProps = {
  componentKey: string;
};

export default function RetroGamesGameClient({ componentKey }: RetroGamesGameClientProps) {
  const game = resolveRetroGamesComponent(componentKey);

  if (!game) {
    return <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">Game unavailable.</div>;
  }

  return game as ReactNode;
}
