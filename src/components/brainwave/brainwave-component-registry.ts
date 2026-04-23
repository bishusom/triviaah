'use client';

import type { ComponentType } from 'react';
import CapitaleComponent from '@/components/brainwave/CapitaleComponent';
import PlotleComponent from '@/components/brainwave/PlotleComponent';
import HistoridleComponent from '@/components/brainwave/HistoridleComponent';
import CelebrileComponent from '@/components/brainwave/CelebrileComponent';
import SongleComponent from '@/components/brainwave/SongleComponent';
import LiteraleComponent from '@/components/brainwave/LiteraleComponent';
import CryptodleComponent from '@/components/brainwave/CryptodleComponent';
import CreaturedleComponent from '@/components/brainwave/CreaturedleComponent';
import FoodleComponent from '@/components/brainwave/FoodleComponent';
import LandmarkdleComponent from '@/components/brainwave/LandmarkdleComponent';
import InventionleComponent from '@/components/brainwave/InventionleComponent';
import SynonymleComponent from '@/components/brainwave/SynonymleComponent';
import type { BrainwaveSlug } from '@/lib/brainwave/brainwave-route-registry';

const COMPONENT_REGISTRY: Record<BrainwaveSlug, ComponentType<any>> = {
  plotle: PlotleComponent,
  capitale: CapitaleComponent,
  historidle: HistoridleComponent,
  celebrile: CelebrileComponent,
  songle: SongleComponent,
  literale: LiteraleComponent,
  cryptodle: CryptodleComponent,
  creaturedle: CreaturedleComponent,
  foodle: FoodleComponent,
  landmarkdle: LandmarkdleComponent,
  inventionle: InventionleComponent,
  synonymle: SynonymleComponent,
};

export function resolveBrainwaveComponent(slug: BrainwaveSlug): ComponentType<any> {
  return COMPONENT_REGISTRY[slug];
}
