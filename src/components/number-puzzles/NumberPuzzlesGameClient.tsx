'use client';

import type { NumberPuzzlesSlug } from '@/lib/number-puzzles/number-puzzles-route-registry';
import { resolveNumberPuzzlesComponent } from '@/components/number-puzzles/number-puzzles-component-registry';

export default function NumberPuzzlesGameClient({ slug }: { slug: NumberPuzzlesSlug }) {
  const GameComponent = resolveNumberPuzzlesComponent(slug);
  return <GameComponent />;
}
