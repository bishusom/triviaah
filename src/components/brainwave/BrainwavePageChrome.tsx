import type { ReactNode } from 'react';
import GamePageChrome from '@/components/common/GamePageChrome';

export default function BrainwavePageChrome({ children }: { children: ReactNode }) {
  return <GamePageChrome>{children}</GamePageChrome>;
}
