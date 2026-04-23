'use client';

import type { ComponentType } from 'react';
import CryptogramGame from '@/components/word-games/CryptogramGame';
import SpellingBeeGame from '@/components/word-games/SpellingBeeGame';
import BoggleGame from '@/components/word-games/BoggleGame';
import WordSearchGame from '@/components/word-games/WordSearchGame';
import WordLadderGame from '@/components/word-games/WordLadderGame';
import CrossgridGame from '@/components/word-games/CrossgridGame';
import WordConnectGame from '@/components/word-games/WordConnectGame';
import AnagramScrambleGame from '@/components/word-games/AnagramScrambleGame';
import type { WordGamesSlug } from '@/lib/word-games/word-games-route-registry';

const COMPONENT_REGISTRY: Record<WordGamesSlug, ComponentType<any>> = {
  cryptogram: CryptogramGame,
  'spelling-bee': SpellingBeeGame,
  boggle: BoggleGame,
  'word-search': WordSearchGame,
  'word-ladder': WordLadderGame,
  crossgrid: CrossgridGame,
  'word-connect': WordConnectGame,
  'anagram-scramble': AnagramScrambleGame,
};

export function resolveWordGamesComponent(slug: WordGamesSlug): ComponentType<any> {
  return COMPONENT_REGISTRY[slug];
}
