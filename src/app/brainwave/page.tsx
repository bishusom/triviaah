// app/brainwave/page.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import Ads from '@/components/common/Ads';
import { Play, Boxes, Star, Clock, Users } from 'lucide-react';
import { getGamePagesBySection } from '@/lib/game-pages';
import { getBrainwaveRouteDefinitions } from '@/lib/brainwave/brainwave-route-registry';
import { ScrollToSectionButton } from '@/components/common/ScrollToSectionButton';
import ExploreSections from '@/components/common/ExploreSections';

interface Puzzle {
  route_path: string;
  category: string;
  name: string;
  path: string;
  image: string;
  og_image?: string | null;
  tagline: string;
  keywords: string;
  intro_text: string;
  supporting_copy: string;
  is_daily_refresh: boolean;
}

export const metadata: Metadata = {
  title: 'Free Brainwave Games Online - Daily Trivia Puzzles | Triviaah',
  description:
    'Play free Brainwave games online including Plotle, Capitale, Songle, Historidle, Foodle, Landmarkdle, Synonymle, and more daily trivia puzzles. No sign-up.',
  keywords: [
    'brainwave games',
    'free brainwave games online',
    'daily trivia puzzles',
    'trivia puzzle games',
    'plotle game',
    'capitale game',
    'songle game',
    'historidle game',
    'foodle puzzle',
    'landmarkdle game',
    'synonymle game',
    'movie trivia puzzles',
    'music trivia games',
    'geography quiz games',
    'word puzzle games',
    'daily puzzle games',
  ],
  alternates: {
    canonical: 'https://triviaah.com/brainwave',
  },
  openGraph: {
    title: 'Free Brainwave Games Online - Daily Trivia Puzzles | Triviaah',
    description:
      'Play free daily Brainwave trivia puzzles across movies, music, geography, history, words, food, landmarks, inventions, and more.',
    url: 'https://triviaah.com/brainwave',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/brainwave/brainwave-trivia-og.webp',
        width: 1200,
        height: 630,
        alt: 'Brainwave Trivia Games - Play Now',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Brainwave Games Online | Triviaah',
    description:
      'Play Plotle, Capitale, Songle, Historidle, Foodle, Landmarkdle, Synonymle and more daily trivia puzzles.',
    images: ['/imgs/brainwave/brainwave-trivia-og.webp'],
    site: '@elitetrivias',
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

const PUZZLE_DETAIL_BLURBS: Record<
  string,
  { howItWorks: string; skills: string; tip: string; bestFor: string }
> = {
  plotle: {
    howItWorks:
      'Plotle gives you a movie clue and asks you to identify the film. The challenge is not just remembering titles, but connecting story structure, genre signals, character hints, and release-era context.',
    skills:
      'Builds film knowledge, clue interpretation, memory recall, and lateral association. Good players recognize plot patterns before a clue names anything obvious.',
    tip: 'Start broad with genre and decade, then narrow by distinctive story beats. If a clue mentions an unusual setting or relationship, treat that as the strongest signal.',
    bestFor:
      'Movie fans, pop-culture players, and anyone who likes deduction built around story clues.',
  },
  capitale: {
    howItWorks:
      'Capitale tests capital-city knowledge through geography clues. You connect countries, regions, spelling patterns, and map memory to identify the correct capital.',
    skills:
      'Strengthens world geography, regional reasoning, spelling recall, and elimination strategy across countries and cities.',
    tip: 'Group countries by region first. If you know the continent and neighboring capitals, the answer pool shrinks quickly.',
    bestFor:
      'Geography learners, map fans, students, and players preparing for general knowledge quizzes.',
  },
  historidle: {
    howItWorks:
      'Historidle turns dates, eras, and historical clues into a daily identification puzzle. You infer the event, person, or period from context rather than rote memorization alone.',
    skills:
      'Develops chronology, cause-and-effect reasoning, historical context, and timeline memory.',
    tip: 'Anchor the clue to a century first, then look for conflict, invention, ruler, or social movement signals that place it more precisely.',
    bestFor:
      'History buffs, trivia players, and learners who want daily practice with timelines and events.',
  },
  celebrile: {
    howItWorks:
      'Celebrile asks you to identify a public figure from a sequence of clues. The puzzle rewards recognizing career paths, notable works, and cultural context.',
    skills:
      'Builds celebrity trivia knowledge, media literacy, clue filtering, and memory association across film, music, sports, and public life.',
    tip: 'Separate profession clues from achievement clues. A single award, role, team, or era can usually reduce the answer set sharply.',
    bestFor:
      'Entertainment trivia fans, pop-culture players, and quick daily guessing sessions.',
  },
  songle: {
    howItWorks:
      'Songle challenges you to identify a song from music-related clues. Depending on the prompt, you may need lyric memory, artist knowledge, genre awareness, or release-era context.',
    skills:
      'Strengthens auditory memory, pop music knowledge, pattern recall, and cultural association.',
    tip: 'Use era and genre before guessing titles. Many songs share common words, but artist style and time period make the answer much clearer.',
    bestFor:
      'Music fans, lyric-game players, and anyone who likes quick pop-culture puzzles.',
  },
  literale: {
    howItWorks:
      'Literale focuses on books, authors, characters, and literary clues. You solve by linking themes, plots, quotes, genres, and author context.',
    skills:
      'Builds reading recall, literary knowledge, theme recognition, and clue-based deduction.',
    tip: 'Identify the literary period or genre first. A gothic clue, dystopian setting, or coming-of-age theme often points toward a narrow author group.',
    bestFor:
      'Readers, students, book-club players, and literature trivia fans.',
  },
  creaturedle: {
    howItWorks:
      'Creaturedle is an animal and creature guessing puzzle that uses habitat, behavior, appearance, taxonomy, or folklore-style clues.',
    skills:
      'Develops biology knowledge, classification reasoning, habitat awareness, and detail recall.',
    tip: 'Start with habitat and body features. Location plus diet or movement style usually separates similar animals quickly.',
    bestFor:
      'Animal lovers, science learners, and family-friendly trivia sessions.',
  },
  foodle: {
    howItWorks:
      'Foodle asks you to identify foods, dishes, ingredients, or cuisines from culinary clues. It blends geography, culture, ingredients, and everyday food knowledge.',
    skills:
      'Builds cuisine recognition, ingredient memory, cultural geography, and descriptive reasoning.',
    tip: 'Look for cooking method and origin clues first. Fried, fermented, baked, or spiced can point to the right cuisine before the dish name appears.',
    bestFor:
      'Food lovers, travel trivia fans, and players who enjoy culture-based guessing games.',
  },
  landmarkdle: {
    howItWorks:
      'Landmarkdle gives clues about famous places, monuments, and locations. You infer the landmark from architecture, country, history, and visitor context.',
    skills:
      'Develops visual memory, world geography, architectural awareness, and historical association.',
    tip: 'Use country and construction era as anchors. A modern tower, ancient site, or religious structure points to very different answer pools.',
    bestFor:
      'Travel fans, geography players, and visual trivia solvers.',
  },
  inventionle: {
    howItWorks:
      'Inventionle turns inventions, inventors, and technology milestones into a daily puzzle. The clues usually combine function, era, impact, and origin.',
    skills:
      'Builds science history, technology literacy, causal reasoning, and timeline recall.',
    tip: 'Ask what problem the invention solved. Function is often easier to identify than inventor or exact date.',
    bestFor:
      'STEM learners, history-of-technology fans, and general knowledge players.',
  },
  synonymle: {
    howItWorks:
      'Synonymle is a word-relation puzzle built around meaning, similarity, and vocabulary. You infer the target word through semantic closeness rather than direct trivia recall.',
    skills:
      'Improves vocabulary depth, semantic reasoning, language precision, and flexible word association.',
    tip: 'Think in meaning clusters. If a clue feels close but not exact, list neighboring words with different tone, intensity, or formality.',
    bestFor:
      'Word-game fans, writers, language learners, and players who enjoy vocabulary puzzles.',
  },
  automoble: {
    howItWorks:
      'Automoble tests car and automotive knowledge through clues about brands, models, design, performance, and manufacturing history.',
    skills:
      'Builds automotive trivia, brand recognition, technical vocabulary, and era-based deduction.',
    tip: 'Separate make, model, and decade clues. Styling and country of origin often solve the puzzle before performance details are needed.',
    bestFor:
      'Car enthusiasts, transport trivia fans, and players who enjoy niche knowledge challenges.',
  },
  botanle: {
    howItWorks:
      'Botanle focuses on plants, flowers, trees, and botanical clues. You connect appearance, habitat, use, taxonomy, and cultural associations.',
    skills:
      'Develops plant knowledge, classification reasoning, environmental awareness, and descriptive memory.',
    tip: 'Start with plant type and habitat. A desert succulent, tropical fruit, and temperate tree follow very different clue patterns.',
    bestFor:
      'Nature lovers, gardeners, biology students, and science trivia players.',
  },
  citadle: {
    howItWorks:
      'Citadle challenges you to identify cities from clues about geography, landmarks, culture, history, or urban identity.',
    skills:
      'Builds city knowledge, cultural geography, landmark recall, and regional elimination strategy.',
    tip: 'Use language, climate, and landmark clues together. They usually identify the region before you need the exact city.',
    bestFor:
      'Travelers, geography fans, and players who enjoy place-based deduction.',
  },
  countridle: {
    howItWorks:
      'Countridle asks you to identify countries from geographic, cultural, political, or historical clues.',
    skills:
      'Strengthens country knowledge, regional reasoning, flag and capital association, and comparative geography.',
    tip: 'Pin down continent, neighbors, and language family first. Those three clues often remove most wrong answers.',
    bestFor:
      'Geography quiz players, students, and general knowledge competitors.',
  },
  trordle: {
    howItWorks:
      'Trordle is a trivia-word hybrid where clues push you toward a specific term, answer, or concept. It rewards both knowledge and word-level deduction.',
    skills:
      'Builds clue synthesis, vocabulary recall, pattern recognition, and broad trivia association.',
    tip: 'Do not chase the first category that comes to mind. Re-read every clue and look for the answer that satisfies all of them, not just one.',
    bestFor:
      'Players who like mixed trivia, word games, and harder daily deduction puzzles.',
  },
};

const BRAINWAVE_IMAGE_MAP = Object.fromEntries(
  getBrainwaveRouteDefinitions().map((definition) => [definition.routePath, definition.ogImage]),
);

async function getDailyPuzzles() {
  const rows = await getGamePagesBySection('brainwave');

  return rows
    .filter((row) => row.route_path !== '/brainwave')
    .map((row) => ({
      route_path: row.route_path,
      category: row.route_path.split('/').pop() || row.route_path,
      name: row.title,
      path: row.cta_href || row.route_path,
      image: row.og_image || BRAINWAVE_IMAGE_MAP[row.route_path] || '/imgs/brainwave/brainwave-trivia-og.webp',
      og_image: row.og_image,
      tagline: row.supporting_copy || row.intro_text,
      keywords: Array.isArray(row.keywords) ? row.keywords.join(', ') : '',
      intro_text: row.intro_text,
      supporting_copy: row.supporting_copy,
      is_daily_refresh: row.is_daily_refresh,
    }));
}

// Gaming-style puzzle card matching the trivias page design
function PuzzleCard({ puzzle, index }: { puzzle: Puzzle; index: number }) {
  return (
    <Link
      key={puzzle.category}
      href={puzzle.path}
      title={`Play ${puzzle.name} - ${puzzle.tagline}`}
      className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-500 bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/20 hover:border-cyan-400/40"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

      {/* Puzzle Image */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-cyan-900 to-purple-900 overflow-hidden">
        <Image
          src={puzzle.image}
          alt={`${puzzle.name} Puzzle Game`}
          fill
          className="object-contain transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={index < 8 ? "eager" : "lazy"}
          priority={index < 4}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Play button overlay */}
        <div className="absolute bottom-4 right-4 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Play className="w-5 h-5 text-white" />
        </div>

        {/* Puzzle number badge */}
        <div className="absolute top-4 left-4 bg-black/70 text-white text-sm font-semibold px-3 py-1 rounded-full">
          #{index + 1}
        </div>
      </div>

      {/* Puzzle Content */}
      <div className="p-6 relative z-10">
        <h3 className="min-h-[4.5rem] text-lg font-bold leading-tight text-white mb-2 line-clamp-3 group-hover:text-cyan-300 transition-colors sm:min-h-[5.5rem]">
          {puzzle.name}
        </h3>
        <p className="min-h-[3rem] text-sm leading-relaxed text-gray-300 line-clamp-2 sm:min-h-[3.5rem]">
          {puzzle.tagline}
        </p>

        {/* Progress bar effect */}
        <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-0 group-hover:w-full transition-all duration-700" />
        </div>
      </div>
    </Link>
  );
}

function PuzzleDetailCard({
  puzzle,
  accentClass,
}: {
  puzzle: Puzzle;
  accentClass: string;
}) {
  const blurb = PUZZLE_DETAIL_BLURBS[puzzle.category];

  return (
    <div className="border border-gray-700 rounded-xl p-5 hover:border-cyan-500/30 transition-colors duration-300">
      <h3 className={`text-lg font-bold mb-1 ${accentClass}`}>{puzzle.name}</h3>
      <p className="text-gray-300 text-sm leading-relaxed mb-3">{puzzle.tagline}</p>
      {blurb && (
        <>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
            How it works
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">{blurb.howItWorks}</p>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Skills it builds
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">{blurb.skills}</p>
          <p className="text-gray-500 text-xs leading-relaxed mb-2">
            <span className="text-gray-400 font-semibold">Strategy tip: </span>
            {blurb.tip}
          </p>
          <p className="text-gray-500 text-xs">
            <span className="text-gray-400 font-semibold">Best for: </span>
            {blurb.bestFor}
          </p>
        </>
      )}
      <Link
        href={puzzle.path}
        className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold ${accentClass} hover:underline`}
      >
        Play {puzzle.name} -&gt;
      </Link>
    </div>
  );
}

export default async function BrainwavePage() {
  const dailyPuzzles = await getDailyPuzzles();
  const currentDate = new Date();
  const accentClasses = [
    'text-cyan-400',
    'text-blue-400',
    'text-purple-400',
    'text-pink-400',
    'text-green-400',
    'text-yellow-400',
    'text-orange-400',
    'text-red-400',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Structured Data for SEO */}
        <StructuredData puzzles={dailyPuzzles} currentDate={currentDate} />

        {/* ── Compact Hero Section ────────────────────────────────────────── */}
        <div className="mb-8 lg:mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Title & Description */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tight">
                    Brainwave <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Puzzles</span>
                  </h1>
                </div>
              </div>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">
                Play free Brainwave games that turn trivia into daily deduction puzzles. From
                movie plots and song clues to geography, history, food, landmarks, inventions, and
                vocabulary, every challenge is built for quick play and broad knowledge building.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ScrollToSectionButton
                  targetId="brainwave-games-grid"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-900/20 transition-all hover:-translate-y-0.5 hover:shadow-cyan-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 sm:w-auto"
                >
                  <Play className="h-4 w-4" />
                  Browse Brainwave Games
                </ScrollToSectionButton>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-slate-800/30 px-3 py-1.5 rounded-full border border-white/5 inline-block">
                  Last Updated: {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Stats & Metadata Cards */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/50 rounded-2xl p-3 border border-white/5 text-center backdrop-blur-sm">
                  <Boxes className="text-xl text-cyan-400 mx-auto mb-1.5" />
                  <div className="text-white font-black text-lg leading-none">{dailyPuzzles.length}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Games</div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-3 border border-white/5 text-center backdrop-blur-sm">
                  <Clock className="text-xl text-yellow-400 mx-auto mb-1.5" />
                  <div className="text-white font-black text-lg leading-none">Daily</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Puzzles</div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-3 border border-white/5 text-center backdrop-blur-sm">
                  <Users className="text-xl text-green-400 mx-auto mb-1.5" />
                  <div className="text-white font-black text-lg leading-none">Free</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4">
          <Ads format="horizontal" slot="2207590813" isMobileFooter={false} className="lg:hidden" />
        </div>

        {/* Puzzle Grid */}
        <div id="brainwave-games-grid" className="mb-16 scroll-mt-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">All Brainwave Games</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {dailyPuzzles.map((puzzle, index) => (
              <PuzzleCard key={puzzle.category} puzzle={puzzle} index={index} />
            ))}
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-3">
            Every Brainwave Game, Explained in Detail
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed max-w-3xl">
            Not sure where to start? Below is a practical breakdown of all {dailyPuzzles.length}{' '}
            Brainwave games: how each puzzle works, what skills it builds, a useful solving tip,
            and the kind of player it suits best.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {dailyPuzzles.map((puzzle, index) => (
              <PuzzleDetailCard
                key={puzzle.category}
                puzzle={puzzle}
                accentClass={accentClasses[index % accentClasses.length]}
              />
            ))}
          </div>
        </section>

        <section className="mb-16 bg-slate-800/40 rounded-2xl p-8 border border-white/5">
          <h2 className="text-3xl font-bold text-white mb-6">
            How to Choose the Right Brainwave Game
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">
                You want pop-culture deduction
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Plotle, Songle, and Celebrile are built around movies, music, and public figures.
                They are quick to understand, easy to share, and reward players who connect clues
                across entertainment history.
              </p>
              <p className="text-gray-400 text-xs">Best picks: Plotle, Songle, Celebrile</p>
            </div>

            <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-bold text-green-400 mb-3">
                You want geography and places
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Capitale, Countridle, Citadle, and Landmarkdle are the strongest choices for map
                knowledge. They build country, capital, city, and landmark recall through compact
                daily clues.
              </p>
              <p className="text-gray-400 text-xs">
                Best picks: Capitale, Countridle, Citadle, Landmarkdle
              </p>
            </div>

            <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-bold text-purple-400 mb-3">
                You want words and knowledge depth
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Synonymle and Trordle lean into language and clue synthesis, while Historidle,
                Inventionle, Botanle, Creaturedle, and Foodle broaden your general knowledge across
                history, science, nature, and culture.
              </p>
              <p className="text-gray-400 text-xs">
                Best picks: Synonymle, Trordle, Historidle, Inventionle
              </p>
            </div>
          </div>
        </section>

        {/* Only one ad allowed per page
          <div className="py-4">
          <Ads format="horizontal" slot="9040722315" isMobileFooter={false} className="lg:hidden" />
        </div>
        */}

        {/* Gaming Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Why Players Love Brainwave</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/20 text-center">
              <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Creative Challenges</h3>
              <p className="text-gray-300">Unique twists on traditional trivia with innovative puzzle mechanics</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Daily Limits</h3>
              <p className="text-gray-300">Play anytime, anywhere - all games are always available!</p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Learn & Grow</h3>
              <p className="text-gray-300">Expand your knowledge across multiple topics while having fun</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-500/20 text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Share Results</h3>
              <p className="text-gray-300">Challenge friends and share your achievements on social media</p>
            </div>
          </div>
        </div>

        {/* FAQ Section - Gaming Style */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "What are Brainwave games?",
                answer: "Brainwave games are free daily trivia puzzles that combine clue solving with specific knowledge themes. The collection includes movie, music, geography, history, food, landmark, invention, word, animal, plant, city, country, and celebrity puzzles."
              },
              {
                question: "Are these games free to play?",
                answer: "Yes! All Brainwave games are completely free to play. No registration, no subscriptions, and no hidden fees. You can enjoy all our daily puzzle challenges without any cost."
              },
              {
                question: "How often are new puzzles available?",
                answer: "Each Brainwave game features a new challenge every day. The puzzles reset at midnight local time, giving you fresh content to enjoy daily."
              },
              {
                question: "Which Brainwave game is best for beginners?",
                answer: "Capitale, Foodle, and Songle are good starting points because their clue categories are familiar and easy to reason through. Plotle is also beginner-friendly if you watch a lot of movies."
              },
              {
                question: "Which Brainwave game is the most challenging?",
                answer: "Synonymle, Trordle, Historidle, and Inventionle tend to be the most challenging because they require deeper vocabulary, broader general knowledge, or careful clue synthesis."
              },
              {
                question: "Can I play on mobile devices?",
                answer: "Absolutely! All Brainwave games are fully responsive and work perfectly on smartphones, tablets, and desktop computers. Play anytime, anywhere."
              },
              {
                question: "What if I can't solve a puzzle?",
                answer: "Don't worry! Each game provides hints and progressive clues to help you solve challenging puzzles. You can also share the puzzle with friends to collaborate."
              },
              {
                question: "Can I share my results?",
                answer: "Yes! After completing each Brainwave game, you'll have the option to share your results on social media and challenge your friends to beat your score."
              },
              {
                question: "Do I need to create an account?",
                answer: "No account is required. You can open any Brainwave game and start playing immediately in your browser."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className="font-semibold text-lg text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Content Section */}
        <section className="bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-700">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-3xl font-bold text-white mb-6">Brainwave Trivia Challenges</h2>
            <p className="text-lg text-gray-300 mb-6">
              Our <strong className="text-cyan-400">brainwave trivia games</strong> offer creative twists on traditional trivia with puzzle elements
              that challenge different cognitive skills and knowledge domains.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Popular Game Categories</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-cyan-400 font-bold mr-2">•</span>
                    <span><strong>Capitale</strong>: Geography puzzle where you guess world capitals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 font-bold mr-2">•</span>
                    <span><strong>Plotle</strong>: Movie trivia game identifying films from plot descriptions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 font-bold mr-2">•</span>
                    <span><strong>Songle</strong>: Music challenge guessing songs from lyrics snippets</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 font-bold mr-2">•</span>
                    <span><strong>Historidle</strong>: Connect events in history from dates</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Why Players Love Brainwave</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-cyan-400 font-bold mr-2">✓</span>
                    <span>Perfect for <strong>developing problem-solving skills</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 font-bold mr-2">✓</span>
                    <span>Great for <strong>music, movie and geography enthusiasts</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 font-bold mr-2">✓</span>
                    <span>Learn <strong>through engaging gameplay</strong> rather than memorization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 font-bold mr-2">✓</span>
                    <span><strong>Daily challenges</strong> keep your mind sharp and engaged</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        <ExploreSections exclude="brainwave" />
      </div>
    </div>
  );
}

// Structured Data Component for SEO
function StructuredData({ puzzles, currentDate }: { puzzles: Puzzle[], currentDate: Date }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://triviaah.com/#organization",
        "name": "Triviaah",
        "url": "https://triviaah.com/",
        "description": "Triviaah offers engaging and educational trivia games, daily puzzles, word games, and knowledge challenges for everyone.",
        "logo": {
          "@type": "ImageObject",
          "url": "https://triviaah.com/logo.png",
          "width": 200,
          "height": 60
        },
        "sameAs": [
          "https://twitter.com/elitetrivias",
          "https://www.facebook.com/elitetrivias",
          "https://www.instagram.com/elitetrivias"
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://triviaah.com/brainwave/#webpage",
        "url": "https://triviaah.com/brainwave",
        "name": "Free Brainwave Games Online - Daily Trivia Puzzles | Triviaah",
        "description": "Play free Brainwave games online including Plotle, Capitale, Songle, Historidle, Foodle, Landmarkdle, Synonymle, and more daily trivia puzzles. No sign-up required.",
        "isPartOf": {
          "@id": "https://triviaah.com/#website"
        },
        "about": {
          "@id": "https://triviaah.com/brainwave/#itemlist"
        },
        "datePublished": "2024-01-01T00:00:00+00:00",
        "dateModified": currentDate.toISOString(),
        "breadcrumb": {
          "@id": "https://triviaah.com/brainwave/#breadcrumb"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://triviaah.com/imgs/brainwave/brainwave-trivia-og.webp",
          "width": 1200,
          "height": 630
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://triviaah.com/#website",
        "url": "https://triviaah.com/",
        "name": "Triviaah",
        "description": "Engaging trivia games, daily puzzles, word games, and knowledge challenges for everyone",
        "publisher": {
          "@id": "https://triviaah.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://triviaah.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://triviaah.com/brainwave/#itemlist",
        "name": "Free Brainwave Daily Puzzle Games",
        "description": "Collection of free online Brainwave trivia puzzles covering movies, music, geography, history, words, food, landmarks, inventions, cities, countries, plants, animals, and pop culture",
        "numberOfItems": puzzles.length,
        "itemListElement": puzzles.map((puzzle, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Game",
            "name": puzzle.name,
            "description": puzzle.tagline,
            "url": `https://triviaah.com${puzzle.path}`,
            "gameType": "PuzzleGame",
            "genre": ["puzzle", "trivia", "daily puzzle", "educational"],
            "applicationCategory": "Game",
            "numberOfPlayers": {
              "@type": "QuantitativeValue",
              "minValue": 1
            },
            "publisher": {
              "@id": "https://triviaah.com/#organization"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://triviaah.com/brainwave/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://triviaah.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Brainwave Games",
            "item": "https://triviaah.com/brainwave"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are Brainwave games?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Brainwave games are free daily trivia puzzles that combine clue solving with specific knowledge themes. The collection includes movie, music, geography, history, food, landmark, invention, word, animal, plant, city, country, and celebrity puzzles."
            }
          },
          {
            "@type": "Question",
            "name": "Are these games free to play?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! All Brainwave games are completely free to play. No registration, no subscriptions, and no hidden fees. You can enjoy all our daily puzzle challenges without any cost."
            }
          },
          {
            "@type": "Question",
            "name": "How often are new puzzles available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Each Brainwave game features a new challenge every day. The puzzles reset at midnight local time, giving you fresh content to enjoy daily. You can play previous days' puzzles if you miss them."
            }
          },
          {
            "@type": "Question",
            "name": "Which Brainwave game is best for beginners?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Capitale, Foodle, and Songle are good starting points because their clue categories are familiar and easy to reason through. Plotle is also beginner-friendly if you watch a lot of movies."
            }
          },
          {
            "@type": "Question",
            "name": "Which Brainwave game is the most challenging?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Synonymle, Trordle, Historidle, and Inventionle tend to be the most challenging because they require deeper vocabulary, broader general knowledge, or careful clue synthesis."
            }
          },
          {
            "@type": "Question",
            "name": "Can I play on mobile devices?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! All Brainwave games are fully responsive and work perfectly on smartphones, tablets, and desktop computers. The interface adapts to your screen size for the best playing experience."
            }
          },
          {
            "@type": "Question",
            "name": "What if I can't solve a puzzle?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Don't worry! Each game provides hints and progressive clues to help you solve challenging puzzles. You can also share the puzzle with friends to collaborate, or check back the next day for the solution."
            }
          },
          {
            "@type": "Question",
            "name": "Can I share my results?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! After completing each Brainwave game, you'll have the option to share your results on social media and challenge your friends to beat your score. It's a great way to compete and learn together."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need to create an account?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No account is required. You can open any Brainwave game and start playing immediately in your browser."
            }
          }
        ]
      },
      {
        "@type": "QAPage",
        "mainEntity": {
          "@type": "Question",
          "name": "Brainwave Trivia Games",
          "text": "What types of brainwave trivia games are available?",
          "answerCount": 4,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Brainwave section includes movie guessing with Plotle, capital-city clues with Capitale, music challenges with Songle, celebrity trivia with Celebrile, historical puzzles with Historidle, animal trivia with Creaturedle, food puzzles with Foodle, literature challenges with Literale, landmark identification with Landmarkdle, invention guessing with Inventionle, word similarity games with Synonymle, car trivia with Automoble, plant clues with Botanle, city puzzles with Citadle, country puzzles with Countridle, and mixed trivia-word deduction with Trordle."
          },
          "dateCreated": currentDate.toISOString()
        }
      }
    ]
  };

  return (
    <Script
      id="structured-data-brainwave"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
