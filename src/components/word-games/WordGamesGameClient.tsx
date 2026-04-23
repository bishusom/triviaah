'use client';

import type { WordGamesSlug } from '@/lib/word-games/word-games-route-registry';
import { resolveWordGamesComponent } from '@/components/word-games/word-games-component-registry';

export default function WordGamesGameClient({ slug }: { slug: WordGamesSlug }) {
  const GameComponent = resolveWordGamesComponent(slug);
  return <GameComponent />;
}
