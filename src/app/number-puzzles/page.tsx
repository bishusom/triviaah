import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Boxes, Star, Clock, Users, Brain, Calculator, Target, Zap } from 'lucide-react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { getGamePagesBySection, type GamePageContent } from '@/lib/game-pages';
import { ScrollToSectionButton } from '@/components/common/ScrollToSectionButton';
import ExploreSections from '@/components/common/ExploreSections';

export const metadata: Metadata = {
  title: 'Free Number Puzzles Online - Sudoku, 2048, KenKen & More | Triviaah',
  description:
    'Play 8 free number puzzles online including 2048, Sudoku, KenKen, Kakuro, Number Sequence, Prime Hunter, Number Tower, and Number Pyramid. Build math skills and logical reasoning. No sign-up required.',
  keywords: [
    'number puzzles',
    'free number puzzles online',
    'math puzzles',
    'sudoku online',
    '2048 game',
    'kenken puzzle',
    'kakuro online',
    'prime hunter game',
    'number sequence puzzle',
    'number tower game',
    'number pyramid puzzle',
    'brain teasers',
    'logic puzzles',
    'mental math games',
    'free math games',
    'educational number games',
    'cognitive math puzzles',
  ],
  alternates: {
    canonical: 'https://triviaah.com/number-puzzles',
  },
  openGraph: {
    title: 'Free Number Puzzles Online - Sudoku, 2048, KenKen & More | Triviaah',
    description:
      'Play 8 free number puzzles including Sudoku, 2048, KenKen, Kakuro, Prime Hunter, Number Sequence, Number Tower, and Number Pyramid. No account needed.',
    url: 'https://triviaah.com/number-puzzles',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/number-puzzles/number-puzzles-og.webp',
        width: 1200,
        height: 630,
        alt: 'Free Number Puzzles Collection - Math Games and Brain Teasers',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Number Puzzles Online | Triviaah',
    description:
      'Play Sudoku, 2048, KenKen, Kakuro, Prime Hunter and more — all free, no sign-up required.',
    images: ['/imgs/number-puzzles/number-puzzles-og.webp'],
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

// ─── Static deep-detail blurbs per puzzle slug ────────────────────────────────
const PUZZLE_DETAIL_BLURBS: Record<
  string,
  { skills: string; tip: string; bestFor: string; howItWorks: string }
> = {
  '2048': {
    howItWorks:
      'Slide all tiles on a 4x4 grid in one of four directions. Every slide moves every tile as far as possible, and two tiles with the same number that collide merge into their sum. After each move a new tile (2 or 4) appears in a random empty cell. The game ends when the board is full and no merges remain.',
    skills:
      'Despite its simple rules, 2048 is a masterclass in forward planning and spatial reasoning. Each move has cascading consequences across the entire board, so strong players think two or three moves ahead rather than reacting to individual tiles. The game also builds intuitive number-doubling fluency: experienced players instantly recognise that 512 + 512 = 1024 without calculating.',
    tip: 'Pick one corner — bottom-left works well — and commit to keeping your highest tile there throughout the game. Build a descending sequence along the bottom row (e.g. 512, 256, 128, 64) and never swipe upward unless forced. This snake strategy prevents the high tile from becoming stranded in the centre where it blocks merges.',
    bestFor:
      'Fans of strategic puzzle games, players who enjoy exponential thinking, and anyone who wants a short session that rewards careful planning over reflexes.',
  },
  'number-sequence': {
    howItWorks:
      'Each puzzle presents a series of numbers with one or more missing values. You must identify the underlying mathematical rule — which could involve addition, multiplication, powers, alternating operations, or multi-step formulas — and select the correct number from multiple-choice options. Difficulty increases across levels as patterns grow more complex.',
    skills:
      'Number Sequence is one of the purest tests of mathematical pattern recognition in a casual format. It requires holding a sequence in working memory, generating hypotheses about the rule, testing each against multiple data points, and committing to an answer. This exact process underpins numerical reasoning sections of IQ tests, GMAT, and GRE examinations.',
    tip: 'Always check the difference between consecutive terms first — is it constant, increasing, or doubling? If the differences themselves form a pattern, you are dealing with a second-order sequence. If neither works, check for alternating rules where odd-position and even-position terms each follow separate patterns.',
    bestFor:
      'Students preparing for aptitude tests, anyone who enjoys mathematical detective work, and players looking to sharpen analytical reasoning without time pressure.',
  },
  'number-pyramid': {
    howItWorks:
      'Each cell in a triangular pyramid contains a number equal to the sum of the two cells directly below it. Some cells are pre-filled; the rest are blank. Your task is to deduce the missing values using the constraint that every cell must satisfy the sum rule. Puzzles range from small three-row pyramids to large five-row configurations with many unknowns.',
    skills:
      'Number Pyramid builds arithmetic fluency and constraint-satisfaction reasoning — the ability to work within a system of interdependent rules rather than solving elements in isolation. Harder puzzles require working both bottom-up (summing known values upward) and top-down (subtracting from known sums to find missing addends), which develops flexible mathematical thinking.',
    tip: 'Start from the row with the most pre-filled cells and work outward. If you know two of three values in a triplet you can always find the third. Mark cells you are confident about before filling cells that require more inference — this prevents errors from propagating upward through the pyramid.',
    bestFor:
      'Students practising arithmetic and algebra, puzzle fans who enjoy constraint-logic games, and anyone who wants a calm pressure-free number challenge.',
  },
  'number-tower': {
    howItWorks:
      'A rule is displayed at the top of the screen — for example, select multiples of 7, or select even numbers greater than 50. You must identify and click all matching numbers from the grid before the timer expires. Each correct selection builds your tower; incorrect clicks subtract time. Reaching the target tower height advances you to the next level.',
    skills:
      'Number Tower develops rapid numerical classification — the ability to quickly evaluate whether a number meets multiple criteria simultaneously. Higher levels combine two or three conditions, which exercises the same parallel-processing skills used in spreadsheet analysis, data filtering, and mental arithmetic in real-world professional contexts.',
    tip: 'Read the rule completely before the timer starts. Multi-condition rules are where most players lose time — they process one condition, click, then notice the second condition too late. For rules involving primes, memorise the primes below 50 before you start, since most grids draw heavily from this range.',
    bestFor:
      'Players who enjoy fast-paced games with a mathematical twist, students practising number properties, and anyone building mental math speed.',
  },
  'prime-hunter': {
    howItWorks:
      'A grid of numbers appears on screen. Your goal is to click every prime number in the grid before the timer runs out. Clicking a non-prime deducts seconds from your remaining time. As you advance through levels, grids grow larger and number ranges extend into the hundreds and thousands, where primality is harder to verify at a glance.',
    skills:
      'Prime Hunter builds deep familiarity with prime numbers — their distribution, their density across different ranges, and the quick divisibility tests that identify them. Regular play ingrains divisibility instincts for 2, 3, 5, 7, 11, and 13, which collectively eliminate most composite numbers in under a second.',
    tip: 'Learn the sieve approach: immediately eliminate all even numbers except 2, all multiples of 5 except 5, and all numbers whose digits sum to a multiple of 3. This three-step filter eliminates roughly 70 percent of composite numbers instantly, leaving a much smaller set to evaluate carefully. For numbers above 100, also check divisibility by 7, 11, and 13.',
    bestFor:
      'Students studying number theory, anyone preparing for math competitions, and players who want to build genuine mathematical intuition rather than just puzzle-solving habit.',
  },
  sudoku: {
    howItWorks:
      'Fill a 9x9 grid with digits 1 through 9 so that every row, every column, and every 3x3 box contains each digit exactly once. Puzzles ship with a subset of cells pre-filled; the difficulty rating determines how many cells are given and how much logical deduction is required. No guessing is needed on a well-formed Sudoku — every puzzle has a unique solution reachable by pure logic.',
    skills:
      'Sudoku is the gold standard of constraint-satisfaction puzzles. It trains two complementary reasoning modes: candidate elimination (ruling out digits that cannot appear in a cell based on existing placements) and naked or hidden subset detection (identifying groups of cells that must contain a specific set of digits). These skills transfer directly to logical reasoning tasks across mathematics, computer science, and analytical problem-solving.',
    tip: 'Never guess. Every Sudoku with a unique solution can be completed by logic alone. Start with the digit that appears most often in the initial puzzle — it has the fewest remaining positions, making placements easy. Then look for naked singles (cells with only one possible digit) and hidden singles (a digit that can only go in one cell within a row, column, or box). These two techniques alone solve most beginner and intermediate puzzles.',
    bestFor:
      'Puzzle enthusiasts of all experience levels, logical thinkers who enjoy systematic deduction, and players looking for a timeless game with decades of proven cognitive benefit.',
  },
  kenken: {
    howItWorks:
      'Fill an NxN grid (typically 4x4 to 6x6) with digits 1 through N so that no digit repeats in any row or column. The grid is divided into cages — outlined groups of cells — each labelled with a target number and an arithmetic operation. The digits in each cage must combine using that operation to produce the target. A cage labelled 12x containing three cells must hold three digits whose product is 12.',
    skills:
      'KenKen uniquely combines the constraint logic of Sudoku with arithmetic reasoning, making it one of the most complete mathematical puzzle formats available. Solving requires simultaneous management of three constraint systems: row uniqueness, column uniqueness, and cage arithmetic. This multi-constraint reasoning is directly analogous to algebraic problem-solving and systems of equations.',
    tip: 'Start with cages that have only one valid digit combination. A two-cell cage labelled 1-minus in a 4x4 grid can only contain pairs differing by 1: (1,2), (2,3), or (3,4). A two-cell 24x cage in a 6x6 grid can only be (4,6). Pinning these down first dramatically constrains the remaining grid. For division cages, remember the larger number is always the dividend — useful for ordering digits within the cage.',
    bestFor:
      'Players who find pure Sudoku too simple but want arithmetic practice woven into logic puzzles, and students looking for a game that genuinely reinforces multiplication and division fluency.',
  },
  kakuro: {
    howItWorks:
      'Kakuro is a crossword-style grid where every white cell contains a digit from 1 to 9. Shaded cells contain clues: the number above a diagonal slash is the sum of digits in the horizontal run to the right; the number below is the sum of the vertical run below. Within any single run, no digit may repeat. The puzzle is complete when all runs match their clues.',
    skills:
      'Kakuro builds a specific and valuable mathematical skill: combinatorial arithmetic — knowing which sets of distinct digits sum to a given total. Experienced players internalise that a two-cell run summing to 3 must be 1 and 2, a three-cell run summing to 6 must be 1, 2, and 3, and a nine-cell run summing to 45 must contain every digit from 1 to 9. This systematic enumeration of possibilities is the foundation of combinatorics and discrete mathematics.',
    tip: 'Memorise the forced combinations — runs where only one valid set of digits exists. Two cells summing to 3 are always 1 and 2. Two cells summing to 16 are always 7 and 9. Three cells summing to 6 are always 1, 2, and 3. Three cells summing to 23 are always 6, 8, and 9. These locked combinations frequently determine crossing cells immediately, cascading solutions through the puzzle.',
    bestFor:
      'Players who loved crosswords but want a mathematical equivalent, Sudoku fans looking for a harder challenge, and anyone interested in developing combinatorial number sense.',
  },
};

// ─── Puzzle Card ──────────────────────────────────────────────────────────────
function PuzzleCard({ puzzle, index }: { puzzle: GamePageContent; index: number }) {
  const imageSrc =
    puzzle.og_image || `/imgs/number-puzzles/${puzzle.route_path.split('/').pop()}.webp`;
  const route = puzzle.cta_href || puzzle.route_path;
  const tagline = puzzle.supporting_copy || puzzle.intro_text;

  return (
    <Link
      href={route}
      title={`Play ${puzzle.title} - ${tagline}`}
      className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-500 bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 hover:border-purple-400/40"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-400/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

      <div className="relative aspect-square w-full bg-gradient-to-br from-purple-900 to-pink-900 overflow-hidden">
        <Image
          src={imageSrc}
          alt={`${puzzle.title} Number Puzzle`}
          fill
          className="object-contain transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={index < 3 ? 'eager' : 'lazy'}
          priority={index < 2}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute bottom-4 right-4 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Play className="w-5 h-5 text-white" />
        </div>

        <div className="absolute top-4 left-4 bg-black/70 text-white text-sm font-semibold px-3 py-1 rounded-full">
          #{index + 1}
        </div>
      </div>

      <div className="p-6 relative z-10">
        <h3 className="font-bold text-lg text-white mb-2 group-hover:text-purple-300 transition-colors">
          {puzzle.title}
        </h3>
        <p className="text-sm text-gray-300 line-clamp-2">{tagline}</p>
        <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-0 group-hover:w-full transition-all duration-700" />
        </div>
      </div>
    </Link>
  );
}

// ─── Puzzle Detail Card ────────────────────────────────────────────────────────
function PuzzleDetailCard({
  puzzle,
  accentClass,
}: {
  puzzle: GamePageContent;
  accentClass: string;
}) {
  const slug = puzzle.route_path.split('/').pop() ?? '';
  const blurb = PUZZLE_DETAIL_BLURBS[slug];
  const route = puzzle.cta_href || puzzle.route_path;

  return (
    <div className="border border-gray-700 rounded-xl p-5 hover:border-purple-500/30 transition-colors duration-300">
      <h3 className={`text-lg font-bold mb-1 ${accentClass}`}>{puzzle.title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed mb-3">
        {puzzle.supporting_copy || puzzle.intro_text}
      </p>
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
            <span className="text-gray-400 font-semibold">Pro tip: </span>
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
        Play {puzzle.title} →
      </Link>
    </div>
  );
}

// ─── Structured Data ──────────────────────────────────────────────────────────
function StructuredData({
  puzzles,
  currentDate,
}: {
  puzzles: GamePageContent[];
  currentDate: Date;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://triviaah.com/#organization',
        name: 'Triviaah',
        url: 'https://triviaah.com/',
        description:
          'Triviaah offers engaging and educational trivia games, word puzzles, and number puzzles for everyone.',
        logo: {
          '@type': 'ImageObject',
          url: 'https://triviaah.com/logo.png',
          width: 200,
          height: 60,
        },
        sameAs: [
          'https://twitter.com/elitetrivias',
          'https://www.facebook.com/elitetrivias',
          'https://www.instagram.com/elitetrivias',
        ],
      },
      {
        '@type': 'WebPage',
        '@id': 'https://triviaah.com/number-puzzles/#webpage',
        url: 'https://triviaah.com/number-puzzles',
        name: 'Free Number Puzzles Online - Sudoku, 2048, KenKen and More | Triviaah',
        description:
          'Play 8 free number puzzles online including Sudoku, 2048, KenKen, Kakuro, Prime Hunter, Number Sequence, Number Tower, and Number Pyramid. No account needed.',
        isPartOf: { '@id': 'https://triviaah.com/#website' },
        about: { '@id': 'https://triviaah.com/number-puzzles/#itemlist' },
        datePublished: '2024-01-01T00:00:00+00:00',
        dateModified: currentDate.toISOString(),
        breadcrumb: { '@id': 'https://triviaah.com/number-puzzles/#breadcrumb' },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://triviaah.com/imgs/number-puzzles/number-puzzles-og.webp',
          width: 1200,
          height: 630,
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://triviaah.com/#website',
        url: 'https://triviaah.com/',
        name: 'Triviaah',
        description: 'Engaging trivia games, word puzzles, and number games for everyone',
        publisher: { '@id': 'https://triviaah.com/#organization' },
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://triviaah.com/search?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': 'https://triviaah.com/number-puzzles/#itemlist',
        name: 'Free Number Puzzles Collection',
        description:
          'Collection of free online number puzzles and math games designed to build logical reasoning, arithmetic fluency, and mathematical problem-solving skills',
        numberOfItems: puzzles.length,
        itemListElement: puzzles.map((puzzle, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Game',
            name: puzzle.title,
            description: puzzle.supporting_copy || puzzle.intro_text,
            url: `https://triviaah.com${puzzle.cta_href || puzzle.route_path}`,
            gameType: 'PuzzleGame',
            genre: ['math', 'number', 'puzzle', 'educational'],
            applicationCategory: 'Game',
            numberOfPlayers: { '@type': 'QuantitativeValue', minValue: 1 },
            publisher: { '@id': 'https://triviaah.com/#organization' },
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://triviaah.com/number-puzzles/#breadcrumb',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://triviaah.com' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Number Puzzles',
            item: 'https://triviaah.com/number-puzzles',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What free number puzzles are available on Triviaah?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Triviaah offers eight free number puzzles: 2048, Number Sequence, Number Pyramid, Number Tower, Prime Hunter, Sudoku, KenKen, and Kakuro. Each targets different mathematical and logical skills, and all are playable immediately with no account required.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which number puzzle is best for beginners?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Number Sequence and Number Pyramid are the most accessible starting points — both have clear rules and no time pressure on beginner difficulty. 2048 is also easy to learn in under a minute. Sudoku on easy difficulty is an excellent first constraint-logic puzzle.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which number puzzle is the most challenging?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Kakuro is the most demanding overall, requiring simultaneous arithmetic and constraint reasoning across intersecting runs. Hard Sudoku and large KenKen grids are also highly challenging. Prime Hunter at high levels becomes extremely difficult as numbers extend into the thousands.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are number puzzles good for children?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Number Pyramid and Number Sequence are suitable from around age 8, reinforcing arithmetic taught in elementary school. Prime Hunter and Number Tower suit ages 10 and up. Sudoku, KenKen, and Kakuro are best from age 12 onwards. All games are free of targeted advertising and require no personal information.',
            },
          },
          {
            '@type': 'Question',
            name: 'What mathematical skills do number puzzles develop?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '2048 builds spatial reasoning and exponential number sense. Number Sequence develops inductive pattern recognition. Number Pyramid strengthens arithmetic fluency and algebraic thinking. Prime Hunter builds number theory intuition. Sudoku and KenKen develop constraint-satisfaction logic. Kakuro builds combinatorial arithmetic. Number Tower builds numerical classification speed.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need to create an account to play?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No account or registration is required. All eight number puzzles are immediately playable in your browser without signing up. Progress within a session is saved automatically.',
            },
          },
        ],
      },
    ],
  };

  return (
    <Script
      id="number-puzzles-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function NumberPuzzlesPage() {
  const allRows = await getGamePagesBySection('number-puzzles');
  const numberPuzzles = allRows.filter((r) => r.route_path !== '/number-puzzles');
  const currentDate = new Date();

  const accentClasses = [
    'text-purple-400',
    'text-cyan-400',
    'text-pink-400',
    'text-yellow-400',
    'text-green-400',
    'text-orange-400',
    'text-blue-400',
    'text-red-400',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <StructuredData puzzles={numberPuzzles} currentDate={currentDate} />

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="mb-8 lg:mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="text-2xl text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tight">
                  Number{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Puzzles
                  </span>
                </h1>
              </div>

              <p className="max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
                Eight free number puzzles, one place to play. From the addictive tile-merging of
                2048 and the classic constraint logic of Sudoku to the arithmetic challenges of
                KenKen and Kakuro, every puzzle in this collection is built to develop real
                mathematical thinking — not just number familiarity. No account needed. Play
                instantly on any device.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ScrollToSectionButton
                  targetId="number-puzzles-grid"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition-all hover:-translate-y-0.5 hover:shadow-purple-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 sm:w-auto"
                >
                  <Play className="h-4 w-4" />
                  Browse Number Puzzles
                </ScrollToSectionButton>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-slate-800/30 px-3 py-1.5 rounded-full border border-white/5 inline-block">
                  Last Updated:{' '}
                  {currentDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/50 rounded-2xl p-3 border border-white/5 text-center backdrop-blur-sm">
                  <Boxes className="text-xl text-purple-400 mx-auto mb-1.5" />
                  <div className="text-white font-black text-lg leading-none">
                    {numberPuzzles.length}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
                    Puzzles
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-3 border border-white/5 text-center backdrop-blur-sm">
                  <Clock className="text-xl text-yellow-400 mx-auto mb-1.5" />
                  <div className="text-white font-black text-lg leading-none">Daily</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
                    Updates
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-3 border border-white/5 text-center backdrop-blur-sm">
                  <Users className="text-xl text-cyan-400 mx-auto mb-1.5" />
                  <div className="text-white font-black text-lg leading-none">Free</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
                    Access
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4">
          <Ads
            format="horizontal"
            slot="2207590813"
            isMobileFooter={false}
            className="lg:hidden"
          />
        </div>

        {/* ── Puzzle Grid ───────────────────────────────────────────────── */}
        <div id="number-puzzles-grid" className="mb-16 scroll-mt-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">All Number Puzzles</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {numberPuzzles.map((puzzle, index) => (
              <PuzzleCard key={puzzle.route_path} puzzle={puzzle} index={index} />
            ))}
          </div>
        </div>

        {/* ── Why Number Puzzles ────────────────────────────────────────── */}
        <section className="mb-16 bg-slate-800/40 rounded-2xl p-8 border border-white/5">
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Number Puzzles Are Genuinely Good for Your Brain
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed max-w-3xl">
            Number puzzles are not just a way to kill time — they are one of the most effective
            forms of mathematical cognitive exercise available without a classroom. Unlike drills
            or flashcards, puzzles embed arithmetic and logical reasoning inside a motivating
            challenge structure. Here is what each core skill domain in our collection actually
            develops.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Calculator className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Arithmetic Fluency</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Puzzles like Kakuro, KenKen, and Number Pyramid require you to perform mental
                  arithmetic repeatedly under mild pressure. This kind of spaced, contextual
                  practice builds arithmetic automaticity — the ability to recall sums, products,
                  and factorizations instantly — far more effectively than rote memorisation of
                  multiplication tables. Players who complete Kakuro regularly report measurable
                  improvement in the speed of mental addition and subtraction.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Logical Constraint Reasoning</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Sudoku and KenKen are constraint-satisfaction problems — a category that requires
                  finding values that simultaneously satisfy multiple independent rules. This is the
                  same class of problem that appears in scheduling, resource allocation, and
                  algorithm design. Regular Sudoku practice measurably strengthens the ability to
                  track and manage multiple interacting constraints, which is one of the most
                  transferable analytical skills across professional disciplines.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Pattern Recognition</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Number Sequence and Prime Hunter both hinge on pattern recognition — detecting
                  mathematical regularities in numerical data. This is the foundational skill
                  behind data analysis, scientific observation, and inductive reasoning. Number
                  Sequence puzzles train the ability to generate and test hypotheses about hidden
                  rules, which mirrors the scientific method at a small scale. Players who practise
                  regularly develop a broader library of recognisable mathematical patterns they
                  can apply outside the game context.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Strategic Planning</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  2048 and Number Tower both punish reactive play and reward multi-step planning.
                  In 2048, every swipe has global consequences across the entire board, so
                  experienced players maintain a mental model of the board state several moves
                  ahead. This kind of look-ahead planning is a core executive function — the same
                  cognitive capability underlying effective decision-making, project management,
                  and chess. Even ten minutes a day of strategic puzzle play has been linked to
                  improvements in planning and working memory in cognitive science research.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Puzzle Deep-Dives ─────────────────────────────────────────── */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-3">
            Every Number Puzzle, Explained in Detail
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed max-w-3xl">
            Not sure where to begin? Below is a complete breakdown of all{' '}
            {numberPuzzles.length} puzzles — how each one works, what mathematical skills it
            builds, a pro strategy tip, and who it is best suited for.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {numberPuzzles.map((puzzle, index) => (
              <PuzzleDetailCard
                key={puzzle.route_path}
                puzzle={puzzle}
                accentClass={accentClasses[index % accentClasses.length]}
              />
            ))}
          </div>
        </section>

        {/* ── How to Choose ─────────────────────────────────────────────── */}
        <section className="mb-16 bg-slate-800/40 rounded-2xl p-8 border border-white/5">
          <h2 className="text-3xl font-bold text-white mb-6">
            How to Choose the Right Number Puzzle
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-bold text-purple-400 mb-3">
                You want a quick 5-minute session
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                2048 and Number Tower are designed for short, self-contained sessions. 2048 has a
                natural endpoint each game, and Number Tower's timer format creates a focused burst
                of activity that feels satisfying and complete within a few minutes. Prime Hunter
                on easy difficulty also works well as a quick warm-up.
              </p>
              <p className="text-gray-400 text-xs">
                Best picks: 2048, Number Tower, Prime Hunter (easy)
              </p>
            </div>

            <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">
                You want a deep thinking challenge
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Kakuro and hard-difficulty Sudoku are the most intellectually demanding options.
                Both require extended chains of logical deduction with no guessing, and a
                well-crafted Kakuro puzzle can occupy a serious solver for 20 to 30 minutes.
                KenKen on its larger grid sizes is a close third.
              </p>
              <p className="text-gray-400 text-xs">
                Best picks: Kakuro, Sudoku (hard), KenKen (6x6)
              </p>
            </div>

            <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-bold text-green-400 mb-3">
                You want to build real math skills
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Number Sequence and Number Pyramid are the best choices if the primary goal is
                mathematical skill development rather than entertainment alone. Both directly
                exercise arithmetic and pattern-recognition skills taught in school curricula.
                Prime Hunter builds number theory intuition useful well beyond the game context.
              </p>
              <p className="text-gray-400 text-xs">
                Best picks: Number Sequence, Number Pyramid, Prime Hunter
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: 'What free number puzzles are available on Triviaah?',
                answer:
                  'Triviaah offers eight free number puzzles: 2048, Number Sequence, Number Pyramid, Number Tower, Prime Hunter, Sudoku, KenKen, and Kakuro. Each targets different mathematical and logical skills, and all are playable immediately with no account required.',
              },
              {
                question: 'Which number puzzle is best for beginners?',
                answer:
                  'Number Sequence and Number Pyramid are the most accessible — both have clear rules and no time pressure on beginner difficulty. 2048 is also easy to learn in under a minute even though mastery takes much longer. Sudoku on easy difficulty is an excellent first constraint-logic puzzle.',
              },
              {
                question: 'Which number puzzle is the most challenging?',
                answer:
                  'Kakuro is the most demanding overall, requiring simultaneous arithmetic and constraint reasoning across intersecting runs. Hard Sudoku and large KenKen grids are also highly challenging. Prime Hunter at high levels becomes extremely difficult as numbers extend into the thousands.',
              },
              {
                question: 'Are number puzzles good for children?',
                answer:
                  'Yes. Number Pyramid and Number Sequence are suitable from around age 8, reinforcing arithmetic taught in elementary school. Prime Hunter and Number Tower suit ages 10 and up. Sudoku, KenKen, and Kakuro are best from age 12 onwards. All games are free of targeted advertising and require no personal information.',
              },
              {
                question: 'What mathematical skills do number puzzles develop?',
                answer:
                  '2048 builds spatial reasoning and exponential number sense. Number Sequence develops inductive pattern recognition. Number Pyramid strengthens arithmetic fluency and algebraic thinking. Prime Hunter builds number theory intuition. Sudoku and KenKen develop constraint-satisfaction logic. Kakuro builds combinatorial arithmetic. Number Tower builds numerical classification speed.',
              },
              {
                question: 'Do I need to create an account to play?',
                answer:
                  'No account or registration is required. All eight number puzzles are immediately playable in your browser without signing up. Progress within a session is saved automatically so you can pause and return to any puzzle without losing your place.',
              },
              {
                question: 'Can I play on mobile?',
                answer:
                  'Yes. All puzzles are fully responsive and touch-optimised for iOS and Android browsers. No app download is needed. Puzzles like Sudoku and 2048 have touch-specific controls — tap to select and swipe to move — that feel natural on a phone screen.',
              },
              {
                question: 'How often do new puzzles appear?',
                answer:
                  'Sudoku and Kakuro generate new daily puzzles each day. 2048 and Number Tower generate fresh boards on demand each session. Number Sequence and Prime Hunter draw from large question pools so content rarely repeats. KenKen and Number Pyramid offer daily variants alongside unlimited on-demand play.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/30 transition-all duration-300"
              >
                <h3 className="font-semibold text-lg text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── About Section ─────────────────────────────────────────────── */}
        <section className="bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-4">
            About Triviaah's Number Puzzles Collection
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Triviaah built this number puzzles collection to cover the full spectrum of mathematical
            puzzle types — from fast-paced classification games to deep constraint-logic challenges
            — in a single free, no-login destination. The eight puzzles were chosen because each
            one targets a genuinely distinct cognitive and mathematical skill. There is no
            redundancy in the collection: 2048 does something Sudoku does not, and Kakuro develops
            skills that Prime Hunter cannot replicate.
          </p>
          <p className="text-gray-300 leading-relaxed mb-4">
            The collection spans three broad mathematical domains. Arithmetic-primary puzzles
            — Kakuro, KenKen, and Number Pyramid — develop the fluency and combinatorial number
            sense that underpin all higher mathematics. Logic-primary puzzles — Sudoku and Number
            Sequence — build the deductive and inductive reasoning skills that transfer to
            analytical tasks across every discipline. Speed-and-classification puzzles — 2048,
            Number Tower, and Prime Hunter — develop the rapid numerical evaluation and working
            memory that support day-to-day mathematical thinking.
          </p>
          <p className="text-gray-300 leading-relaxed mb-6">
            All eight puzzles are free, require no account, and work on any modern browser
            including mobile. Daily content refreshes on selected puzzles ensure there is always
            new material waiting, while the on-demand and generative puzzles provide unlimited
            depth for players who want to go beyond the daily offering.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                Number Puzzles vs. Other Brain Games
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Memory games like card matching target working memory capacity directly but have
                limited transfer to real-world mathematical or analytical skills. Number puzzles
                also exercise working memory — you must hold partial solutions and constraints in
                mind while solving — but they simultaneously train the reasoning skills that make
                that memory useful. Constraint-logic puzzles like Sudoku and KenKen are among the
                few casual game types where cognitive gains reliably transfer outside the game
                context.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Word games primarily exercise language-specific neural networks. Number puzzles
                engage the dorsolateral prefrontal cortex more heavily through arithmetic
                operations and logical constraint management. The two types are complementary:
                playing both delivers broader cognitive coverage than specialising in either alone.
                See our{' '}
                <Link href="/word-games" className="text-cyan-400 hover:underline">
                  Word Games collection
                </Link>{' '}
                for the language-focused half of that combination.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Who Plays Number Puzzles</h3>
              <div className="space-y-3 text-gray-300 text-sm">
                <div className="flex gap-2">
                  <span className="text-purple-400 font-bold mt-0.5">→</span>
                  <span>
                    <strong className="text-white">Students</strong> — from primary school
                    children reinforcing arithmetic to university students maintaining quantitative
                    reasoning skills between semesters.
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-cyan-400 font-bold mt-0.5">→</span>
                  <span>
                    <strong className="text-white">Professionals</strong> — analysts, engineers,
                    accountants, and developers who use numerical reasoning daily and want a
                    mentally engaging break that reinforces rather than interrupts those skills.
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-pink-400 font-bold mt-0.5">→</span>
                  <span>
                    <strong className="text-white">Seniors</strong> — number puzzles are among
                    the most evidence-backed activities for cognitive maintenance in older adults,
                    and this collection spans the full difficulty spectrum from gentle to
                    genuinely demanding.
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-400 font-bold mt-0.5">→</span>
                  <span>
                    <strong className="text-white">Puzzle enthusiasts</strong> — fans of newspaper
                    Sudoku, logic puzzle books, and math competitions who want a broader variety of
                    challenges in a single free destination.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ExploreSections exclude="number-puzzles" />
      </div>
    </div>
  );
}