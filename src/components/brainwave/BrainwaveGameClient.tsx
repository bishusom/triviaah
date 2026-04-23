'use client';

import type { BrainwaveSlug } from '@/lib/brainwave/brainwave-route-registry';
import { resolveBrainwaveComponent } from '@/components/brainwave/brainwave-component-registry';

export default function BrainwaveGameClient({ slug }: { slug: BrainwaveSlug }) {
  const Component = resolveBrainwaveComponent(slug);
  return <Component />;
}
