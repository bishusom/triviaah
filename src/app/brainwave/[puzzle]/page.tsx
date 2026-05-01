import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BrainwavePageChrome from '@/components/brainwave/BrainwavePageChrome';
import BrainwaveRouteShell from '@/components/brainwave/BrainwaveRouteShell';
import BrainwaveLandingClient from '@/components/brainwave/BrainwaveLandingClient';
import { getGamePageContent, getGamePagesBySection } from '@/lib/game-pages';
import { getBrainwaveRouteDefinition } from '@/lib/brainwave/brainwave-route-registry';
import PlotleComponent from '@/components/brainwave/PlotleComponent';
import CapitaleComponent from '@/components/brainwave/CapitaleComponent';
import HistoridleComponent from '@/components/brainwave/HistoridleComponent';
import CelebrileComponent from '@/components/brainwave/CelebrileComponent';
import SongleComponent from '@/components/brainwave/SongleComponent';
import LiteraleComponent from '@/components/brainwave/LiteraleComponent';
import CreaturedleComponent from '@/components/brainwave/CreaturedleComponent';
import FoodleComponent from '@/components/brainwave/FoodleComponent';
import LandmarkdleComponent from '@/components/brainwave/LandmarkdleComponent';
import InventionleComponent from '@/components/brainwave/InventionleComponent';
import SynonymleComponent from '@/components/brainwave/SynonymleComponent';
import AutomobleComponent from '@/components/brainwave/AutomobleComponent';
import BotanleComponent from '@/components/brainwave/BotanleComponent';
import CitadleComponent from '@/components/brainwave/CitadleComponent';
import CountridleComponent from '@/components/brainwave/CountridleComponent';
import TrordleComponent from '@/components/brainwave/TrordleComponent';
import { getDailyPlotle } from '@/lib/brainwave/plotle/plotle-sb';
import { getDailyCapitale } from '@/lib/brainwave/capitale/capitale-sb';
import { getDailyHistoridle } from '@/lib/brainwave/historidle/historidle-sb';
import { getDailyCelebrile } from '@/lib/brainwave/celebrile/celebrile-sb';
import { getDailySongle } from '@/lib/brainwave/songle/songle-sb';
import { getDailyLiterale } from '@/lib/brainwave/literale/literale-sb';
import { getDailyCryptodle } from '@/lib/brainwave/cryptodle/cryptodle-sb';
import { getDailyCreature } from '@/lib/brainwave/creaturedle/creaturedle-sb';
import { getDailyFood } from '@/lib/brainwave/foodle/foodle-sb';
import { getDailyLandmark } from '@/lib/brainwave/landmarkdle/landmarkdle-sb';
import { getDailyInvention } from '@/lib/brainwave/inventionle/inventionle-sb';
import { getDailySynonymle } from '@/lib/brainwave/synonymle/synonymle-sb';
import { getDailyCar } from '@/lib/brainwave/automoble/automoble-sb';
import { getDailyPlant } from '@/lib/brainwave/botanle/botanle-sb';
import { getDailyCityPuzzle } from '@/lib/brainwave/citadle/citadle-sb';
import { getDailyCountry } from '@/lib/brainwave/countridle/countridle-sb';
import { getDailyTrordle } from '@/lib/brainwave/trordle/trordle-sb';

type PageParams = {
  puzzle: string;
};

const DEFAULT_OG_IMAGE = '/imgs/brainwave/brainwave-trivia-og.webp';

export async function generateStaticParams() {
  const pages = await getGamePagesBySection('brainwave');

  return pages
    .filter((page) => page.route_path !== '/brainwave')
    .map((page) => ({
      puzzle: page.route_path.replace('/brainwave/', ''),
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { puzzle } = await params;
  const routeDefinition = getBrainwaveRouteDefinition(puzzle);
  const routePath = routeDefinition?.routePath ?? `/brainwave/${puzzle}`;
  const page = await getGamePageContent(routePath);

  if (!page) {
    return {
      title: 'Brainwave Game | Triviaah',
      description: 'Play Brainwave puzzle games on Triviaah.',
    };
  }

  const ogImage = page.og_image || routeDefinition?.ogImage || DEFAULT_OG_IMAGE;
  const metadataKeywords = page.keywords.length
    ? page.keywords
    : [page.title, 'Brainwave puzzle', 'daily puzzle', 'trivia game'];

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

export default async function BrainwavePuzzlePage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams?: Promise<{ date?: string }> | { date?: string };
}) {
  const { puzzle } = await params;
  const routeDefinition = getBrainwaveRouteDefinition(puzzle);

  if (!routeDefinition) {
    notFound();
  }

  const page = await getGamePageContent(routeDefinition.routePath);

  if (!page || page.page_kind !== 'game') {
    notFound();
  }

  const landingImage = page.og_image || routeDefinition.ogImage || DEFAULT_OG_IMAGE;

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const parsedDate = resolvedSearchParams.date ? new Date(`${resolvedSearchParams.date}T00:00:00`) : undefined;
  const targetDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : undefined;

  let game: React.ReactNode | null = null;

  const allBrainwaveGames = await getGamePagesBySection('brainwave');

  switch (routeDefinition.slug) {
    case 'plotle': {
      const initialData = await getDailyPlotle(targetDate);
      if (!initialData) notFound();
      game = <PlotleComponent initialData={initialData} />;
      break;
    }
    case 'capitale': {
      const initialData = await getDailyCapitale(targetDate);
      if (!initialData?.puzzle) notFound();
      game = <CapitaleComponent initialData={initialData.puzzle} allCapitals={initialData.allCapitals} />;
      break;
    }
    case 'historidle': {
      const initialData = await getDailyHistoridle(targetDate);
      if (!initialData) notFound();
      game = <HistoridleComponent initialData={initialData} />;
      break;
    }
    case 'celebrile': {
      const initialData = await getDailyCelebrile(targetDate);
      if (!initialData) notFound();
      game = <CelebrileComponent initialData={initialData} />;
      break;
    }
    case 'songle': {
      const initialData = await getDailySongle(targetDate);
      if (!initialData) notFound();
      game = <SongleComponent initialData={initialData} />;
      break;
    }
    case 'literale': {
      const initialData = await getDailyLiterale(targetDate);
      if (!initialData) notFound();
      game = <LiteraleComponent initialData={initialData} />;
      break;
    }
    case 'creaturedle': {
      const initialData = await getDailyCreature(targetDate);
      if (!initialData?.puzzle) notFound();
      game = <CreaturedleComponent initialData={initialData as any} />;
      break;
    }
    case 'foodle': {
      const initialData = await getDailyFood(targetDate);
      if (!initialData?.puzzle) notFound();
      game = <FoodleComponent initialData={initialData as any} />;
      break;
    }
    case 'landmarkdle': {
      const initialData = await getDailyLandmark(targetDate);
      if (!initialData?.puzzle) notFound();
      game = <LandmarkdleComponent initialData={initialData as any} />;
      break;
    }
    case 'inventionle': {
      const initialData = await getDailyInvention(targetDate);
      if (!initialData?.puzzle) notFound();
      game = <InventionleComponent initialData={initialData as any} />;
      break;
    }
    case 'synonymle': {
      const initialData = await getDailySynonymle(targetDate);
      if (!initialData) notFound();
      game = <SynonymleComponent initialData={initialData} />;
      break;
    }
    case 'automoble': {
      const initialData = await getDailyCar(targetDate);
      if (!initialData?.puzzle) notFound();
      game = <AutomobleComponent initialData={initialData.puzzle} />;
      break;
    }
    case 'botanle': {
      const initialData = await getDailyPlant(targetDate);
      if (!initialData?.puzzle) notFound();
      game = <BotanleComponent initialData={{ puzzle: initialData.puzzle }} />;
      break;
    }
    case 'citadle': {
      const initialData = await getDailyCityPuzzle(targetDate);
      if (!initialData) notFound();
      game = <CitadleComponent initialData={initialData} />;
      break;
    }
    case 'countridle': {
      const initialData = await getDailyCountry(targetDate);
      if (!initialData?.puzzle) notFound();
      game = <CountridleComponent initialData={initialData.puzzle} allCountries={initialData.allCountries} />;
      break;
    }
    case 'trordle': {
      const initialData = await getDailyTrordle(targetDate);
      if (!initialData) notFound();
      game = <TrordleComponent initialData={initialData} />;
      break;
    }
    default:
      notFound();
  }

  return (
    <BrainwavePageChrome>
      <BrainwaveRouteShell page={page} showIntro={false} relatedGames={allBrainwaveGames}>
        <BrainwaveLandingClient
          headline={page.landing_headline ?? page.title}
          introText={page.intro_text}
          landingImage={landingImage}
          playLabel={page.cta_label}
          playNotes={page.play_notes}
          readyLabel={page.hero_label ?? 'Ready when you are'}
          supportingCopy={page.supporting_copy}
          game={game}
        />
      </BrainwaveRouteShell>
    </BrainwavePageChrome>
  );
}
