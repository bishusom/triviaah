import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import GamePageChrome from '@/components/common/GamePageChrome';
import GameRouteShell from '@/components/game-pages/GameRouteShell';
import GameLandingClient from '@/components/game-pages/GameLandingClient';
import NumberPuzzlesGameClient from '@/components/number-puzzles/NumberPuzzlesGameClient';
import { getGamePageContent, getGamePagesBySection } from '@/lib/game-pages';
import { getNumberPuzzlesRouteDefinition } from '@/lib/number-puzzles/number-puzzles-route-registry';

type PageParams = {
  game: string;
};

const DEFAULT_OG_IMAGE = '/imgs/number-puzzles.webp';
const LEGACY_NUMBER_PYRAMIDS_SLUG = 'number-pyramids';
const LEGACY_NUMBER_BONDS_SLUG = 'number-bonds';
const NUMBER_PYRAMID_SLUG = 'number-pyramid';

export async function generateStaticParams() {
  const pages = await getGamePagesBySection('number-puzzles');

  return pages
    .filter((page) => page.route_path !== '/number-puzzles')
    .map((page) => ({
      game: page.route_path.replace('/number-puzzles/', ''),
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { game } = await params;
  const normalizedGame = (game === LEGACY_NUMBER_PYRAMIDS_SLUG || game === LEGACY_NUMBER_BONDS_SLUG) ? NUMBER_PYRAMID_SLUG : game;
  const routeDefinition = getNumberPuzzlesRouteDefinition(normalizedGame);
  const routePath = routeDefinition?.routePath ?? `/number-puzzles/${game}`;
  const page = await getGamePageContent(routePath);

  if (!page) {
    return {
      title: 'Number Puzzles | Triviaah',
      description: 'Play number puzzles on Triviaah.',
    };
  }

  const ogImage = page.og_image || routeDefinition?.ogImage || DEFAULT_OG_IMAGE;
  const metadataKeywords = page.keywords.length
    ? page.keywords
    : [page.title, 'number puzzles', 'math game', 'number puzzle'];

  return {
    title: page.title,
    description: page.meta_description,
    keywords: metadataKeywords,
    alternates: {
      canonical: `https://triviaah.com${page.route_path}`,
    },
    openGraph: {
      title: page.title,
      description: page.meta_description,
      url: `https://triviaah.com${page.route_path}`,
      siteName: 'Triviaah',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.meta_description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function NumberPuzzlePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { game } = await params;
  if (game === LEGACY_NUMBER_PYRAMIDS_SLUG || game === LEGACY_NUMBER_BONDS_SLUG) {
    redirect('/number-puzzles/number-pyramid');
  }

  const routeDefinition = getNumberPuzzlesRouteDefinition(game);

  if (!routeDefinition) {
    notFound();
  }

  const page = await getGamePageContent(routeDefinition.routePath);

  if (!page || page.page_kind !== 'game') {
    notFound();
  }

  const allNumberPuzzles = await getGamePagesBySection('number-puzzles');

  return (
    <GamePageChrome>
      <GameRouteShell 
        page={page} 
        sectionLabel="Number Puzzles"
        relatedGames={allNumberPuzzles}
      >
        <GameLandingClient
          headline={page.landing_headline ?? page.title}
          introText={page.intro_text}
          landingImage={page.og_image || routeDefinition.ogImage || DEFAULT_OG_IMAGE}
          playLabel={page.cta_label}
          playNotes={page.play_notes}
          readyLabel={page.hero_label ?? 'Ready when you are'}
          supportingCopy={page.supporting_copy}
          isDailyRefresh={page.is_daily_refresh}
          backHref="/number-puzzles"
          backLabel="Back to Number Puzzles"
          game={<NumberPuzzlesGameClient slug={routeDefinition.slug} />}
        />
      </GameRouteShell>
    </GamePageChrome>
  );
}
