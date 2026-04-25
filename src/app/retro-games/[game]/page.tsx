import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GamePageChrome from '@/components/common/GamePageChrome';
import GameLandingClient from '@/components/game-pages/GameLandingClient';
import GameRouteShell from '@/components/game-pages/GameRouteShell';
import RetroGamesGameClient from '@/components/retro-games/RetroGamesGameClient';
import { getGamePageContent, getGamePagesBySection } from '@/lib/game-pages';
import { getRetroGamesRouteDefinition } from '@/lib/retro-games/retro-games-route-registry';

type PageParams = {
  game: string;
};

const DEFAULT_OG_IMAGE = '/imgs/retro-games/retro-games-collection.webp';

export async function generateStaticParams() {
  const pages = await getGamePagesBySection('retro-games');

  return pages
    .filter((page) => page.route_path !== '/retro-games')
    .map((page) => ({
      game: page.route_path.replace('/retro-games/', ''),
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { game } = await params;
  const routeDefinition = getRetroGamesRouteDefinition(game);
  const routePath = routeDefinition?.routePath ?? `/retro-games/${game}`;
  const page = await getGamePageContent(routePath);

  if (!page) {
    return {
      title: 'Retro Games | Triviaah',
      description: 'Play retro games on Triviaah.',
    };
  }

  const ogImage = page.og_image || routeDefinition?.ogImage || DEFAULT_OG_IMAGE;
  const metadataKeywords = page.keywords.length
    ? page.keywords
    : [page.title, 'retro games', 'arcade game', 'classic game'];

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

export default async function RetroGamePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { game } = await params;
  const routeDefinition = getRetroGamesRouteDefinition(game);

  if (!routeDefinition) {
    notFound();
  }

  const page = await getGamePageContent(routeDefinition.routePath);

  if (!page || page.page_kind !== 'game') {
    notFound();
  }

  const allRetroGames = await getGamePagesBySection('retro-games');

  return (
    <GamePageChrome>
      <GameRouteShell 
        page={page} 
        sectionLabel="Retro Games"
        relatedGames={allRetroGames}
      >
        <GameLandingClient
          headline={page.landing_headline ?? page.title}
          introText={page.intro_text}
          landingImage={page.og_image || routeDefinition.ogImage || DEFAULT_OG_IMAGE}
          playLabel={page.cta_label}
          mobilePlayLabel="Play"
          playNotes={page.play_notes}
          readyLabel={page.hero_label ?? 'Ready when you are'}
          supportingCopy={page.supporting_copy}
          isDailyRefresh={page.is_daily_refresh}
          backHref="/retro-games"
          backLabel="Back to Retro Games"
          game={<RetroGamesGameClient componentKey={routeDefinition.componentKey} />}
        />
      </GameRouteShell>
    </GamePageChrome>
  );
}
