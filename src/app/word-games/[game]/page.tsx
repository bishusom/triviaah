import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GamePageChrome from '@/components/common/GamePageChrome';
import GameLandingClient from '@/components/game-pages/GameLandingClient';
import GameRouteShell from '@/components/game-pages/GameRouteShell';
import WordGamesGameClient from '@/components/word-games/WordGamesGameClient';
import { getGamePageContent, getGamePagesBySection } from '@/lib/game-pages';
import { getWordGamesRouteDefinition } from '@/lib/word-games/word-games-route-registry';

type PageParams = {
  game: string;
};

const DEFAULT_OG_IMAGE = '/imgs/word-games/word-games.webp';

export async function generateStaticParams() {
  const pages = await getGamePagesBySection('word-games');

  return pages
    .filter((page) => page.route_path !== '/word-games')
    .map((page) => ({
      game: page.route_path.replace('/word-games/', ''),
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { game } = await params;
  const routeDefinition = getWordGamesRouteDefinition(game);
  const routePath = routeDefinition?.routePath ?? `/word-games/${game}`;
  const page = await getGamePageContent(routePath);

  if (!page) {
    return {
      title: 'Word Games | Triviaah',
      description: 'Play word games on Triviaah.',
    };
  }

  const ogImage = page.og_image || routeDefinition?.ogImage || DEFAULT_OG_IMAGE;
  const metadataKeywords = page.keywords.length
    ? page.keywords
    : [page.title, 'word games', 'vocabulary game', 'word puzzle'];

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

export default async function WordGamePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { game } = await params;
  const routeDefinition = getWordGamesRouteDefinition(game);

  if (!routeDefinition) {
    notFound();
  }

  const page = await getGamePageContent(routeDefinition.routePath);

  if (!page || page.page_kind !== 'game') {
    notFound();
  }

  const allWordGames = await getGamePagesBySection('word-games');

  return (
    <GamePageChrome>
      <GameRouteShell
        page={page}
        sectionLabel="Word Games"
        relatedGames={allWordGames}
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
          backHref="/word-games"
          backLabel="Back to Word Games"
          game={<WordGamesGameClient slug={routeDefinition.slug} />}
        />
      </GameRouteShell>
    </GamePageChrome>
  );
}
