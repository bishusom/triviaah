import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Clock, Users, Gamepad2, Trophy, History } from 'lucide-react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { getGamePagesBySection, type GamePageContent } from '@/lib/game-pages';
import { ScrollToSectionButton } from '@/components/common/ScrollToSectionButton';
import ExploreSections from '@/components/common/ExploreSections';

export const metadata: Metadata = {
  title: 'Free Retro Games Online - Snake, Tetris, Pong & More | Triviaah',
  description:
    'Play 8 free retro games online including Snake, Tetris, Pong, Minesweeper, Pac-Man, Space Invaders, Breakout, and Tic Tac Toe. Classic arcade games with no sign-up required.',
  keywords: [
    'retro games',
    'free retro games online',
    'classic arcade games',
    'snake game',
    'tetris online',
    'pong game',
    'minesweeper online',
    'pac man game',
    'space invaders',
    'breakout game',
    'tic tac toe online',
    'old school games',
    'vintage games',
    '80s arcade games',
    '90s games',
    'classic browser games',
    'free arcade games',
  ],
  alternates: {
    canonical: 'https://triviaah.com/retro-games',
  },
  openGraph: {
    title: 'Free Retro Games Online - Snake, Tetris, Pong & More | Triviaah',
    description:
      'Play 8 free retro games including Snake, Tetris, Pong, Minesweeper, Pac-Man, Space Invaders, Breakout, and Tic Tac Toe. No account needed.',
    url: 'https://triviaah.com/retro-games',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/retro-games/retro-games-og.webp',
        width: 1200,
        height: 630,
        alt: 'Free Retro Games Collection - Classic Arcade Games',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Retro Games Online | Triviaah',
    description:
      'Play Snake, Tetris, Pong, Minesweeper, Pac-Man and more classic arcade games free.',
    images: ['/imgs/retro-games/retro-games-og.webp'],
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

const GAME_DETAIL_BLURBS: Record<
  string,
  { legacy: string; skills: string; tip: string; bestFor: string }
> = {
  snake: {
    legacy:
      'Snake became one of the defining mobile games because it turns a single movement rule into a steadily tightening spatial puzzle. Every snack makes the route longer, so the board shifts from open navigation to careful path planning.',
    skills:
      'Snake develops spatial awareness, route planning, impulse control, and risk assessment. Strong players think about where the snake will be in five moves, not just where the next snack appears.',
    tip: 'Use the board perimeter as a safety lane early, then fold inward in predictable rows. Random sharp turns create traps; smooth loops preserve escape routes.',
    bestFor:
      'Short arcade sessions, mobile play, high-score chasing, and players who like simple controls with rising pressure.',
  },
  tetris: {
    legacy:
      'Tetris is the classic falling-block puzzle that proved a game can be instantly readable and endlessly deep. Its tetromino system rewards clean stacking, fast recognition, and long-term board management.',
    skills:
      'Tetris builds spatial rotation, pattern recognition, working memory, and decision speed. Each placement changes future options, so expert play is as much about maintaining a flexible board as clearing lines.',
    tip: 'Keep the stack low and leave a single well open for the I-piece. Avoid covering holes, because buried gaps are far more expensive than an uneven surface.',
    bestFor:
      'Puzzle fans, reflex training, score attacks, and anyone who wants a timeless game with genuine mastery depth.',
  },
  pong: {
    legacy:
      'Pong distilled competitive video games to their essentials: timing, angle control, and positioning. Its simple table-tennis loop remains one of the clearest examples of skill-based arcade design.',
    skills:
      'Pong develops reaction time, hand-eye coordination, trajectory prediction, and tactical positioning. Good players control the paddle before the ball arrives instead of chasing it late.',
    tip: 'Use the paddle edges to change return angles, and recover toward the center immediately after each hit. Center control reduces how far you must travel on the next shot.',
    bestFor:
      'Beginners, quick two-player sessions, reflex practice, and players who want the most accessible retro game in the collection.',
  },
  minesweeper: {
    legacy:
      'Minesweeper is a logic classic because every revealed number is a constraint. The game rewards deduction over speed at first, then turns into a fast pattern-recognition challenge as your confidence improves.',
    skills:
      'Minesweeper develops deductive reasoning, probability judgment, pattern recognition, and careful risk management. It is one of the strongest retro games for pure logic practice.',
    tip: 'Start with forced moves around 1s and 2s. When a guess is unavoidable, choose the square that opens the largest likely safe area rather than the first unknown cell you see.',
    bestFor:
      'Logic puzzle fans, analytical players, and anyone who enjoys a slower retro game where careful thinking matters.',
  },
  pacman: {
    legacy:
      'Pac-Man added character, maze routing, and enemy behavior to arcade design. The ghosts have distinct movement patterns, so success comes from learning routes rather than simply reacting.',
    skills:
      'Pac-Man builds path planning, timing, enemy tracking, and risk-reward decision-making. Power pellets are limited resources, so when you use them matters as much as where you go.',
    tip: 'Clear one quadrant at a time and save power pellets for escapes or clustered ghost captures. Wandering across the maze without a route wastes safe openings.',
    bestFor:
      'Arcade fans, maze-game players, and anyone who wants classic character-driven gameplay with strategic movement.',
  },
  'space-invaders': {
    legacy:
      'Space Invaders helped define the fixed shooter. Its descending enemy formation creates a natural tension curve: the fewer invaders remain, the faster and more dangerous the board becomes.',
    skills:
      'Space Invaders develops aiming rhythm, threat prioritization, timing, and composure under increasing speed. Players must balance clearing enemies with preserving defensive cover.',
    tip: 'Trim columns evenly and remove low invaders before they compress your movement space. Use cover sparingly; destroyed shields cannot save you later.',
    bestFor:
      'Classic shooter fans, score chasers, and players who enjoy escalating arcade pressure.',
  },
  breakout: {
    legacy:
      'Breakout transformed Pong into a single-player precision challenge. Every bounce changes the board, and the game rewards controlled angles more than frantic paddle movement.',
    skills:
      'Breakout builds trajectory prediction, timing, fine motor control, and strategic targeting. Creating channels behind the brick wall is often the fastest path to big clears.',
    tip: 'Aim for side gaps early. Once the ball gets above the bricks, stay calm and prepare for sharp returns instead of overcorrecting.',
    bestFor:
      'Players who like precision arcade games, short sessions, and satisfying chain reactions.',
  },
  'tic-tac-toe': {
    legacy:
      'Tic Tac Toe is one of the oldest strategy games because it teaches complete-information planning in its simplest form. Every move can be evaluated logically from the current board.',
    skills:
      'Tic Tac Toe develops turn planning, fork creation, defensive blocking, and minimax thinking. It is a compact introduction to the same reasoning used in more complex strategy games.',
    tip: 'Take the center when available, block forks before single threats become unavoidable, and use corners to create two-way winning chances.',
    bestFor:
      'Beginners, children learning strategy, quick decision games, and players who want a calm classic between faster arcade sessions.',
  },
};

function GameCard({ game, index }: { game: GamePageContent; index: number }) {
  const imageSrc = game.og_image || `/imgs/retro-games/${game.route_path.split('/').pop()}.webp`;
  const route = game.cta_href || game.route_path;
  const tagline = game.supporting_copy || game.intro_text;
  const year = 'Classic'; // generic if no year
  const difficulty = 'Medium'; // generic difficulty

  return (
    <Link
      key={game.route_path}
      href={route}
      title={`Play ${game.title} - ${tagline}`}
      className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-500 bg-gradient-to-br from-gray-800 to-gray-900 border border-amber-500/20 hover:border-amber-400/40"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 50%, rgba(255,255,255,.05) 50%)',
          backgroundSize: '100% 4px',
        }} />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-400/10 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      <div className="relative aspect-square w-full bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">  
        <Image
          src={imageSrc}
          alt={`${game.title} Retro Game`}
          fill
          className="object-contain transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={index < 3 ? "eager" : "lazy"}
          priority={index < 2}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        <div className="absolute bottom-4 right-4 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Play className="w-5 h-5 text-white" />
        </div>

        <div className="absolute top-4 left-4 bg-black/70 text-white text-sm font-semibold px-3 py-1 rounded-full">
          #{index + 1}
        </div>
        
        <div className="absolute top-4 right-4 bg-amber-600/80 text-white text-xs font-bold px-2 py-1 rounded">
          {year}
        </div>
      </div>
      
      <div className="p-6 relative z-10">
        <h3 className="font-bold text-lg text-white mb-2 group-hover:text-amber-300 transition-colors">
          {game.title}
        </h3>
        <p className="text-sm text-gray-300 line-clamp-2 mb-3">
          {game.supporting_copy || game.intro_text}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400">Difficulty:</span>
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < 2 ? 'bg-green-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-red-500 w-0 group-hover:w-full transition-all duration-700" />
        </div>
      </div>
    </Link>
  );
}

function GameDetailCard({ game, accentClass }: { game: GamePageContent; accentClass: string }) {
  const slug = game.route_path.split('/').pop() ?? '';
  const blurb = GAME_DETAIL_BLURBS[slug];
  const route = game.cta_href || game.route_path;

  return (
    <div className="border border-gray-700 rounded-xl p-5 hover:border-amber-500/30 transition-colors duration-300">
      <h3 className={`text-lg font-bold mb-1 ${accentClass}`}>{game.title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed mb-3">
        {game.supporting_copy || game.intro_text}
      </p>
      {blurb && (
        <>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Why it matters
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">{blurb.legacy}</p>
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
        href={route}
        className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold ${accentClass} hover:underline`}
      >
        Play {game.title} -&gt;
      </Link>
    </div>
  );
}

function StructuredData({ games, currentDate }: { games: GamePageContent[], currentDate: Date }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://triviaah.com/#organization",
        "name": "Triviaah",
        "url": "https://triviaah.com/",
        "description": "Triviaah offers engaging and educational retro games and puzzles for everyone.",
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
        "@id": "https://triviaah.com/retro-games/#webpage",
        "url": "https://triviaah.com/retro-games",
        "name": "Free Retro Games Online - Snake, Tetris, Pong and More | Triviaah",
        "description": "Play 8 free retro games online including Snake, Tetris, Pong, Minesweeper, Pac-Man, Space Invaders, Breakout, and Tic Tac Toe. Classic arcade games with no sign-up required.",
        "isPartOf": {
          "@id": "https://triviaah.com/#website"
        },
        "about": {
          "@id": "https://triviaah.com/retro-games/#itemlist"
        },
        "datePublished": "2024-01-01T00:00:00+00:00",
        "dateModified": currentDate.toISOString(),
        "breadcrumb": {
          "@id": "https://triviaah.com/retro-games/#breadcrumb"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://triviaah.com/imgs/retro-games/retro-games-og.webp",
          "width": 1200,
          "height": 630
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://triviaah.com/#website",
        "url": "https://triviaah.com/",
        "name": "Triviaah",
        "description": "Engaging retro games and puzzles for everyone",
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
        "@id": "https://triviaah.com/retro-games/#itemlist",
        "name": "Free Retro Games Collection",
        "description": "Collection of free online retro games and classic arcade games designed for logic, reflexes, spatial reasoning, and high-score play",
        "numberOfItems": games.length,
        "itemListElement": games.map((game, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Game",
            "name": game.title,
            "description": game.intro_text || game.supporting_copy,
            "url": `https://triviaah.com${game.cta_href || game.route_path}`,
            "gameType": "RetroGame",
            "genre": ["arcade", "classic", "puzzle", "strategy", "retro"],
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
        "@id": "https://triviaah.com/retro-games/#breadcrumb",
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
            "name": "Retro Games",
            "item": "https://triviaah.com/retro-games"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What free retro games are available on Triviaah?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Triviaah offers eight free retro games: Snake, Tetris, Pong, Minesweeper, Pac-Man, Space Invaders, Breakout, and Tic Tac Toe. Each game is playable instantly in your browser with no account required."
            }
          },
          {
            "@type": "Question",
            "name": "Are these retro games free to play?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! All retro games are completely free to play with no registration required. You can enjoy unlimited gameplay across our entire retro game collection, with multiple difficulty levels and features available at no cost."
            }
          },
          {
            "@type": "Question",
            "name": "Which retro game is best for beginners?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Pong is the easiest retro game for beginners because the controls and objective are immediately clear. Snake and Tic Tac Toe are also beginner-friendly, while Minesweeper and Tetris offer more strategic depth once you are ready for a harder challenge."
            }
          },
          {
            "@type": "Question",
            "name": "Which retro game is the most challenging?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tetris and Minesweeper are the most challenging overall. Tetris demands fast spatial decisions under pressure, while Minesweeper requires careful deduction and probability judgment. Space Invaders also becomes difficult as enemy speed increases."
            }
          },
          {
            "@type": "Question",
            "name": "Can I play on mobile devices?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! All retro games are fully responsive and work perfectly on smartphones, tablets, and desktop computers. We've optimized each game with touch controls for mobile play, making it easy to enjoy classic gaming anywhere."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need to create an account to play?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No account or registration is required. All retro games are free to play directly in your browser, and high scores are saved locally where supported."
            }
          }
        ]
      }
    ]
  };

  return (
    <Script
      id="retro-games-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default async function RetroGamesPage() {
  const allRows = await getGamePagesBySection('retro-games');
  const retroGames = allRows.filter((r) => r.route_path !== '/retro-games');
  const currentDate = new Date();
  const heroDescription = 'Relive the golden age of gaming with free classic retro games including Minesweeper, Tetris, Pong, Snake, Breakout, Pac-Man, Space Invaders, and Tic Tac Toe. Enjoy timeless arcade, puzzle, strategy, and reflex challenges optimized for modern mobile and desktop play.';
  const accentClasses = [
    'text-amber-400',
    'text-red-400',
    'text-cyan-400',
    'text-green-400',
    'text-purple-400',
    'text-blue-400',
    'text-orange-400',
    'text-pink-400',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Structured Data */}
        <StructuredData games={retroGames} currentDate={currentDate} />
        
        {/* ── Compact Hero Section ────────────────────────────────────────── */}
        <div className="mb-8 lg:mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Title & Description */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 bg-gradient-to-r from-amber-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <History className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tight">
                    Retro <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Games</span>
                  </h1>
                </div>
              </div>
              <p className="max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
                {heroDescription}
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ScrollToSectionButton
                  targetId="retro-games-grid"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-900/20 transition-all hover:-translate-y-0.5 hover:shadow-amber-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
                >
                  <Play className="h-4 w-4" />
                  Browse Retro Games
                </ScrollToSectionButton>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-slate-800/30 px-3 py-1.5 rounded-full border border-white/5 inline-block">
                  Last Updated: {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Stats Column */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5 text-center">
                  <Gamepad2 className="text-xl text-amber-400 mx-auto mb-1.5" />
                  <div className="text-white font-black text-lg leading-none">{retroGames.length}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Games</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5 text-center">
                  <Clock className="text-xl text-green-400 mx-auto mb-1.5" />
                  <div className="text-white font-black text-lg leading-none">40+</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Years</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5 text-center">
                  <Users className="text-xl text-blue-400 mx-auto mb-1.5" />
                  <div className="text-white font-black text-lg leading-none">Free</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Access</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5 text-center">
                  <Trophy className="text-xl text-purple-400 mx-auto mb-1.5" />
                  <div className="text-white font-black text-lg leading-none">Global</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Scores</div>
                </div>
              </div>
            </div>
          </div>
        </div>

          <div className="py-4">
            <Ads format="horizontal" slot="2207590813" isMobileFooter={false} className="lg:hidden" />
          </div>

          <div id="retro-games-grid" className="mb-16 scroll-mt-6">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">All Retro Games</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
              {retroGames.map((game, index) => (
                <GameCard key={game.route_path} game={game} index={index} />
              ))}
            </div>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">
              Every Retro Game, Explained in Detail
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-3xl">
              Not sure what to play first? Here is a full breakdown of all {retroGames.length}{' '}
              classic games: why each one matters, what skills it builds, a practical strategy tip,
              and who it is best suited for.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {retroGames.map((game, index) => (
                <GameDetailCard
                  key={game.route_path}
                  game={game}
                  accentClass={accentClasses[index % accentClasses.length]}
                />
              ))}
            </div>
          </section>

          <section className="mb-16 bg-slate-800/40 rounded-2xl p-8 border border-white/5">
            <h2 className="text-3xl font-bold text-white mb-6">
              How to Choose the Right Retro Game
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700">
                <h3 className="text-lg font-bold text-amber-400 mb-3">
                  You want a quick arcade break
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  Pong, Snake, and Breakout are the best picks when you want immediate action with
                  almost no setup. Each has simple controls, fast restarts, and a clear score or win
                  condition that makes a five-minute session feel complete.
                </p>
                <p className="text-gray-400 text-xs">Best picks: Pong, Snake, Breakout</p>
              </div>

              <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700">
                <h3 className="text-lg font-bold text-cyan-400 mb-3">
                  You want a thinking challenge
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  Minesweeper and Tic Tac Toe reward deduction, planning, and careful defense.
                  Tetris also becomes deeply strategic at higher speeds, where clean stacking and
                  future-piece planning matter more than pure reaction time.
                </p>
                <p className="text-gray-400 text-xs">
                  Best picks: Minesweeper, Tic Tac Toe, Tetris
                </p>
              </div>

              <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700">
                <h3 className="text-lg font-bold text-green-400 mb-3">
                  You want classic arcade pressure
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  Pac-Man and Space Invaders deliver the most iconic arcade tension: enemies close
                  in, timing windows shrink, and every point must be earned. They are ideal when you
                  want nostalgia with genuine skill progression.
                </p>
                <p className="text-gray-400 text-xs">Best picks: Pac-Man, Space Invaders</p>
              </div>
            </div>
          </section>

          {/* Gaming Features Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Why Retro Games Are Timeless</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20 text-center">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎮</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Pure Gameplay</h3>
                <p className="text-gray-300">Simple controls, deep strategy - no complex mechanics or tutorials needed</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Brain Training</h3>
                <p className="text-gray-300">Improve logic, reflexes, pattern recognition, and strategic thinking</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏱️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Quick Sessions</h3>
                <p className="text-gray-300">Perfect for short breaks - most games can be enjoyed in 5-10 minutes</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Skill Progression</h3>
                <p className="text-gray-300">Easy to learn, challenging to master with endless replayability</p>
              </div>
            </div>
          </div>

          {/* FAQ Section - Retro Gaming Style */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "What makes retro games different from modern games?",
                  answer: "Retro games focus on pure gameplay, simple mechanics, and skill-based challenges. Unlike modern games with complex graphics and stories, retro games are about mastering mechanics, achieving high scores, and enjoying timeless gameplay loops."
                },
                {
                  question: "Are these retro games free to play?",
                  answer: "Yes! All retro games are completely free to play with no registration required. You can enjoy unlimited gameplay across our entire retro game collection without any cost or subscriptions."
                },
                {
                  question: "Which retro game is best for beginners?",
                  answer: "Pong is perfect for beginners with its simple two-button controls. Snake is also beginner-friendly with gradual difficulty. For puzzle lovers, Tetris on easy mode is a great starting point before trying Minesweeper."
                },
                {
                  question: "Can I play these games on mobile?",
                  answer: "Absolutely! All retro games are fully optimized for mobile devices with touch controls. We've designed each game to work perfectly on smartphones and tablets, so you can enjoy classic gaming anywhere."
                },
                {
                  question: "Do these games save my progress and high scores?",
                  answer: "Yes! All games automatically save your high scores and progress in your browser's local storage. You can track your improvement over time and compete against your own personal best scores."
                },
                {
                  question: "Are there multiplayer options?",
                  answer: "Pong features both single-player (vs AI) and two-player modes. The other games are primarily single-player focused, offering personal challenge and high score competition against yourself and other players globally."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-amber-500/30 transition-all duration-300">
                  <h3 className="font-semibold text-lg text-white mb-3 flex items-center gap-2">
                    <span className="text-amber-500">Q{index + 1}.</span>
                    {faq.question}
                  </h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Content Section */}
          <section className="bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-700">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-3xl font-bold text-white mb-6">Retro Games Collection - Timeless Classic Arcade Experiences</h2>
              <p className="text-lg text-gray-300 mb-6">
                Our <strong className="text-amber-400">retro games collection</strong> brings back the golden age of gaming with 
                carefully preserved classics that have stood the test of time. From the strategic depth of Minesweeper 
                to the addictive gameplay of Tetris, these games offer pure, unadulterated entertainment that modern 
                titles often overlook.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Featured Retro Games</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-400 font-bold mr-2">•</span>
                      <span><strong>Minesweeper</strong>: The ultimate logic puzzle that challenges deductive reasoning and careful planning</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 font-bold mr-2">•</span>
                      <span><strong>Tetris</strong>: The iconic block-stacking puzzle that tests spatial awareness and quick thinking</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 font-bold mr-2">•</span>
                      <span><strong>Pong</strong>: The game that started it all - simple, competitive table tennis action</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 font-bold mr-2">•</span>
                      <span><strong>Snake</strong>: The mobile classic that challenges navigation and growth management</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Cognitive Benefits</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-amber-400 font-bold mr-2">✓</span>
                      <span>Enhanced <strong>problem-solving skills</strong> and logical thinking</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 font-bold mr-2">✓</span>
                      <span>Improved <strong>hand-eye coordination</strong> and reaction times</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 font-bold mr-2">✓</span>
                      <span>Better <strong>pattern recognition</strong> and spatial awareness</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 font-bold mr-2">✓</span>
                      <span>Development of <strong>strategic planning</strong> and resource management</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-amber-500/10 to-red-500/10 rounded-xl border border-amber-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Perfect For All Audiences</h3>
                <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <h4 className="font-semibold text-amber-300 mb-2">Nostalgia Seekers</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Players who grew up with these classics in the 70s-90s</li>
                      <li>• Fans of simple, skill-based gameplay</li>
                      <li>• Those seeking a break from modern complex games</li>
                      <li>• Parents introducing classic games to their children</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-300 mb-2">New Generations</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Young gamers discovering gaming history</li>
                      <li>• Casual players looking for quick, engaging games</li>
                      <li>• Puzzle enthusiasts seeking challenging logic games</li>
                      <li>• Anyone wanting to improve cognitive skills through play</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-bold text-white mb-4">The Legacy of Retro Gaming</h3>
                <p className="text-gray-300 mb-4">
                  Retro games represent the foundation of modern gaming. Each game in our collection has influenced 
                  countless titles that followed. <strong className="text-amber-400">Pong</strong> demonstrated that electronic games could 
                  be commercially viable. <strong className="text-purple-400">Tetris</strong> showed how simple mechanics could create endless 
                  engagement. <strong className="text-blue-400">Minesweeper</strong> proved that logic puzzles could be as addictive as action 
                  games, and <strong className="text-emerald-400">Snake</strong> pioneered mobile gaming on a global scale.
                </p>
                <p className="text-gray-300">
                  These games have endured for decades because they focus on what matters most: <strong>engaging gameplay</strong>, 
                  <strong> skill-based challenges</strong>, and <strong>pure fun</strong>. In an era of complex graphics and 
                  sprawling narratives, sometimes the simplest games provide the deepest satisfaction.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-amber-500/20 to-red-500/20 rounded-2xl p-8 border border-amber-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Play Some Classics?</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Choose any game above to start playing instantly. No downloads, no registration, 
                just pure retro gaming fun. Challenge yourself, beat your high scores, and 
                experience why these games have remained popular for decades.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {retroGames.slice(0, 3).map(game => (
                  <Link
                    key={game.route_path}
                    href={game.cta_href || game.route_path}
                    className="px-6 py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-red-700 transition-all duration-300 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Play {game.title}
                  </Link>
                ))}
              </div>
          </div>
        </div>

        <ExploreSections exclude="retro-games" />
      </div>
    </div>
  );
}
