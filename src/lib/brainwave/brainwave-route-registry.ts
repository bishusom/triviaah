export type BrainwaveSlug =
  | 'plotle'
  | 'capitale'
  | 'historidle'
  | 'celebrile'
  | 'songle'
  | 'literale'
  | 'cryptodle'
  | 'creaturedle'
  | 'foodle'
  | 'landmarkdle'
  | 'inventionle'
  | 'synonymle'
  | 'automoble'
  | 'botanle'
  | 'citadle'
  | 'countridle'
  | 'trordle';

export interface BrainwaveRouteDefinition {
  slug: BrainwaveSlug;
  routePath: `/brainwave/${BrainwaveSlug}`;
  title: string;
  ogImage: string;
  isDailyRefresh: boolean;
  componentKey: string;
}

const BRAINWAVE_ROUTE_REGISTRY: Record<BrainwaveSlug, BrainwaveRouteDefinition> = {
  plotle: {
    slug: 'plotle',
    routePath: '/brainwave/plotle',
    title: 'Plotle',
    ogImage: '/imgs/brainwave/plotle-og.webp',
    isDailyRefresh: true,
    componentKey: 'PlotleComponent',
  },
  capitale: {
    slug: 'capitale',
    routePath: '/brainwave/capitale',
    title: 'Capitale',
    ogImage: '/imgs/brainwave/capitale-og.webp',
    isDailyRefresh: true,
    componentKey: 'CapitaleComponent',
  },
  historidle: {
    slug: 'historidle',
    routePath: '/brainwave/historidle',
    title: 'Historidle',
    ogImage: '/imgs/brainwave/historidle-og.webp',
    isDailyRefresh: true,
    componentKey: 'HistoridleComponent',
  },
  celebrile: {
    slug: 'celebrile',
    routePath: '/brainwave/celebrile',
    title: 'Celebrile',
    ogImage: '/imgs/brainwave/celebrile-og.webp',
    isDailyRefresh: true,
    componentKey: 'CelebrileComponent',
  },
  songle: {
    slug: 'songle',
    routePath: '/brainwave/songle',
    title: 'Songle',
    ogImage: '/imgs/brainwave/songle-og.webp',
    isDailyRefresh: true,
    componentKey: 'SongleComponent',
  },
  literale: {
    slug: 'literale',
    routePath: '/brainwave/literale',
    title: 'Literale',
    ogImage: '/imgs/brainwave/literale-og.webp',
    isDailyRefresh: true,
    componentKey: 'LiteraleComponent',
  },
  cryptodle: {
    slug: 'cryptodle',
    routePath: '/brainwave/cryptodle',
    title: 'Cryptodle',
    ogImage: '/imgs/word-games/cryptogram.svg',
    isDailyRefresh: true,
    componentKey: 'CryptodleComponent',
  },
  creaturedle: {
    slug: 'creaturedle',
    routePath: '/brainwave/creaturedle',
    title: 'Creaturedle',
    ogImage: '/imgs/brainwave/creaturedle-og.webp',
    isDailyRefresh: true,
    componentKey: 'CreaturedleComponent',
  },
  foodle: {
    slug: 'foodle',
    routePath: '/brainwave/foodle',
    title: 'Foodle',
    ogImage: '/imgs/brainwave/foodle-og.webp',
    isDailyRefresh: true,
    componentKey: 'FoodleComponent',
  },
  landmarkdle: {
    slug: 'landmarkdle',
    routePath: '/brainwave/landmarkdle',
    title: 'Landmarkdle',
    ogImage: '/imgs/brainwave/landmarkdle-og.webp',
    isDailyRefresh: true,
    componentKey: 'LandmarkdleComponent',
  },
  inventionle: {
    slug: 'inventionle',
    routePath: '/brainwave/inventionle',
    title: 'Inventionle',
    ogImage: '/imgs/brainwave/inventionle-og.webp',
    isDailyRefresh: true,
    componentKey: 'InventionleComponent',
  },
  synonymle: {
    slug: 'synonymle',
    routePath: '/brainwave/synonymle',
    title: 'Synonymle',
    ogImage: '/imgs/brainwave/synonymle-og.webp',
    isDailyRefresh: true,
    componentKey: 'SynonymleComponent',
  },
  automoble: {
    slug: 'automoble',
    routePath: '/brainwave/automoble',
    title: 'Automoble',
    ogImage: '/imgs/brainwave/automoble.webp',
    isDailyRefresh: true,
    componentKey: 'AutomobleComponent',
  },
  botanle: {
    slug: 'botanle',
    routePath: '/brainwave/botanle',
    title: 'Botanle',
    ogImage: '/imgs/brainwave/botanle.webp',
    isDailyRefresh: true,
    componentKey: 'BotanleComponent',
  },
  citadle: {
    slug: 'citadle',
    routePath: '/brainwave/citadle',
    title: 'Citadle',
    ogImage: '/imgs/brainwave/citadle.webp',
    isDailyRefresh: true,
    componentKey: 'CitadleComponent',
  },
  countridle: {
    slug: 'countridle',
    routePath: '/brainwave/countridle',
    title: 'Countridle',
    ogImage: '/imgs/brainwave/countridle.webp',
    isDailyRefresh: true,
    componentKey: 'CountridleComponent',
  },
  trordle: {
    slug: 'trordle',
    routePath: '/brainwave/trordle',
    title: 'Trordle',
    ogImage: '/imgs/brainwave/trordle-og.webp',
    isDailyRefresh: true,
    componentKey: 'TrordleComponent',
  },
};

export function getBrainwaveRouteDefinition(slug: string): BrainwaveRouteDefinition | null {
  if (!slug || !(slug in BRAINWAVE_ROUTE_REGISTRY)) return null;
  return BRAINWAVE_ROUTE_REGISTRY[slug as BrainwaveSlug];
}

export function getBrainwaveRouteDefinitionByPath(routePath: string): BrainwaveRouteDefinition | null {
  const slug = routePath.replace('/brainwave/', '') as BrainwaveSlug;
  return getBrainwaveRouteDefinition(slug);
}

export function getBrainwaveRouteDefinitions(): BrainwaveRouteDefinition[] {
  return Object.values(BRAINWAVE_ROUTE_REGISTRY);
}
