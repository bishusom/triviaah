import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Boxes, Star, Clock, Users, Brain, BookOpen, Zap, Target } from 'lucide-react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { getGamePagesBySection, type GamePageContent } from '@/lib/game-pages';
import { ScrollToSectionButton } from '@/components/common/ScrollToSectionButton';

export const metadata: Metadata = {
  title: 'Free Word Games Online - Boggle, Cryptogram, Spelling Bee & More | Triviaah',
  description:
    'Play 8 free word games online including Cryptogram, Spelling Bee, Boggle, Word Search, Word Ladder, Crossgrid, Word Connect, and Anagram Scramble. Build vocabulary, spelling, and cognitive skills. No sign-up required.',
  keywords: [
    'word games',
    'free word games online',
    'vocabulary games',
    'spelling games',
    'boggle online',
    'cryptogram puzzle',
    'spelling bee game',
    'word search online',
    'word ladder game',
    'anagram scramble',
    'word connect game',
    'crossgrid puzzle',
    'brain training word games',
    'educational word games',
    'word puzzles free',
  ],
  alternates: {
    canonical: 'https://triviaah.com/word-games',
  },
  openGraph: {
    title: 'Free Word Games Online - Boggle, Cryptogram, Spelling Bee & More | Triviaah',
    description:
      'Play 8 free word games including Cryptogram, Spelling Bee, Boggle, Word Search, Word Ladder, Crossgrid, Word Connect, and Anagram Scramble. No account needed.',
    url: 'https://triviaah.com/word-games',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/word-games/word-games.webp',
        width: 1200,
        height: 630,
        alt: 'Free Word Games Collection - Vocabulary and Spelling Challenges',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Word Games Online | Triviaah',
    description:
      'Play Boggle, Cryptogram, Spelling Bee, Word Search, and more — all free, no sign-up.',
    images: ['/imgs/word-games/word-games.webp'],
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

// ─── Static game detail blurbs (one per slug) ────────────────────────────────
// These are the deep-detail paragraphs that appear in the "Explore" section.
// They are the primary content signal for Google — keep them unique and specific.
const GAME_DETAIL_BLURBS: Record<string, { skills: string; tip: string; bestFor: string }> = {
  cryptogram: {
    skills:
      'Cryptograms sharpen pattern recognition, frequency analysis, and deductive reasoning. Because every letter in the encrypted quote maps to a unique substitute, solving one requires you to hold multiple hypotheses in mind simultaneously — the same mental flexibility that underpins strong reading comprehension and logical problem-solving.',
    tip: 'Start with single-letter words: they are almost always "A" or "I". Then look for the most common three-letter groups — "THE" and "AND" account for a surprising share of English text. Once you place those, the rest of the grid tends to cascade quickly.',
    bestFor: 'Puzzle enthusiasts, fans of logic games, and anyone who wants to sharpen deductive thinking.',
  },
  'spelling-bee': {
    skills:
      'Spelling Bee exercises your mental lexicon — the internal dictionary your brain draws on during reading and conversation. The requirement to include the center letter in every valid word forces creative search strategies rather than simple recall, making this one of the most cognitively demanding games in our collection.',
    tip: 'Do not overlook short words. Many players chase long words for big points but miss easy four-letter words that add up fast. Plurals, verb forms (-ING, -ED), and common prefixes (RE-, UN-) are reliable sources of bonus words most players leave on the table.',
    bestFor: 'Readers, writers, students studying for standardized tests, and anyone who enjoys linguistic precision.',
  },
  boggle: {
    skills:
      'Boggle trains rapid spatial scanning, orthographic awareness (recognising valid letter sequences at a glance), and working memory. The timed format adds a controlled stress element that many players find sharpens their focus over repeated sessions.',
    tip: 'Scan the grid systematically rather than randomly. Starting from a corner and sweeping row by row catches more word starts than jumping around. Also remember that longer words score disproportionately more points — a six-letter word is worth far more than three two-letter words.',
    bestFor: 'Competitive players, fans of fast-paced games, and people who want vocabulary practice with an adrenaline edge.',
  },
  'word-search': {
    skills:
      'Word Search develops visual scanning, selective attention, and letter pattern recognition. Research in educational psychology has consistently linked word search practice to improved reading fluency in younger learners, and the game remains an accessible entry point for players new to word games entirely.',
    tip: 'Scan for the first letter of each target word rather than reading the grid globally. Once you spot a match, trace all eight directions before moving on. Diagonal words trip up the most players, so scan those lines deliberately rather than assuming words only run horizontally.',
    bestFor: 'Beginners, younger players, casual gamers, and anyone who wants a relaxing but mentally engaging session.',
  },
  'word-ladder': {
    skills:
      'Word Ladder builds vocabulary breadth and semantic flexibility — you need to know which letter substitutions produce real words, which requires a larger mental word list than most players realise they have. Planning a path several steps ahead also exercises forward-thinking and strategic reasoning.',
    tip: 'If you get stuck, work backwards from the target word. Sometimes the path from END to START is more obvious than the path from START to END. Also look for "bridge words" — common four-letter words that connect many other words with a single-letter swap.',
    bestFor: 'Strategy thinkers, puzzle fans, and players looking for a word game that requires planning rather than speed.',
  },
  crossgrid: {
    skills:
      'Crossgrid packs the cognitive load of a full crossword into a compact 5×5 format. Every cell must satisfy two constraints simultaneously (an Across clue and a Down clue), which demands flexible thinking and the ability to revise initial assumptions quickly — a skill that transfers directly to analytical writing and critical thinking.',
    tip: 'Fill the most constrained cells first — corners and cells adjacent to already-filled squares. Starting in the middle and working outward often creates dead ends. If a five-letter answer does not fit any crossing letters you have, treat it as a signal that an earlier entry is wrong rather than forcing the current one.',
    bestFor: 'Crossword fans who want a quicker format, lateral thinkers, and players who enjoy clue-based deduction.',
  },
  'word-connect': {
    skills:
      'Word Connect develops morphological awareness — understanding how root words, prefixes, and suffixes combine to form new words. Because the letter bank is fixed and limited, players must work with constraints rather than free recall, which mirrors real-world vocabulary use more closely than open-ended word games.',
    tip: 'Start with the longest possible word you can form from the available letters, then systematically remove one letter at a time to find shorter valid words. This top-down approach is more efficient than building up from two-letter words, which often dead-end quickly.',
    bestFor: 'ESL learners, students building vocabulary for exams, and anyone who enjoys methodical puzzle-solving.',
  },
  'anagram-scramble': {
    skills:
      'Anagram Scramble builds mental flexibility by forcing your brain to re-parse familiar letter sequences in new configurations. Studies on anagram solving show it activates the same neural networks involved in creative insight — making unexpected connections between stored knowledge patterns.',
    tip: 'Look for common letter clusters rather than working letter by letter: -TION, -ING, -ER, -EST, RE-, UN-, and -LY appear in thousands of English words. Mentally grouping letters into chunks dramatically speeds up the solving process compared to evaluating all possible permutations individually.',
    bestFor: 'Creative thinkers, fans of word scramble games, and players who enjoy an unstructured, open-ended challenge.',
  },
};

// ─── Game Card ────────────────────────────────────────────────────────────────
function GameCard({ game, index }: { game: GamePageContent; index: number }) {
  const imageSrc = game.og_image || `/imgs/word-games/${game.route_path.split('/').pop()}.webp`;
  const route = game.cta_href || game.route_path;
  const tagline = game.supporting_copy || game.intro_text;

  return (
    <Link
      href={route}
      title={`Play ${game.title} - ${tagline}`}
      className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-500 bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/20 hover:border-cyan-400/40"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-400/10 to-green-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

      <div className="relative aspect-square w-full bg-gradient-to-br from-green-900 to-emerald-900 overflow-hidden">
        <Image
          src={imageSrc}
          alt={`${game.title} Word Game`}
          fill
          className="object-contain transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={index < 3 ? 'eager' : 'lazy'}
          priority={index < 2}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute bottom-4 right-4 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Play className="w-5 h-5 text-white" />
        </div>

        <div className="absolute top-4 left-4 bg-black/70 text-white text-sm font-semibold px-3 py-1 rounded-full">
          #{index + 1}
        </div>
      </div>

      <div className="p-6 relative z-10">
        <h3 className="font-bold text-lg text-white mb-2 group-hover:text-green-300 transition-colors">
          {game.title}
        </h3>
        <p className="text-sm text-gray-300 line-clamp-2">{tagline}</p>
        <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-0 group-hover:w-full transition-all duration-700" />
        </div>
      </div>
    </Link>
  );
}

// ─── Game Detail Card (SEO section) ──────────────────────────────────────────
function GameDetailCard({
  game,
  accentClass,
}: {
  game: GamePageContent;
  accentClass: string;
}) {
  const slug = game.route_path.split('/').pop() ?? '';
  const blurb = GAME_DETAIL_BLURBS[slug];
  const route = game.cta_href || game.route_path;

  return (
    <div className="border border-gray-700 rounded-xl p-5 hover:border-green-500/30 transition-colors duration-300">
      <h3 className={`text-lg font-bold mb-1 ${accentClass}`}>{game.title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed mb-3">
        {game.supporting_copy || game.intro_text}
      </p>
      {blurb && (
        <>
          <p className="text-gray-400 text-sm leading-relaxed mb-2">{blurb.skills}</p>
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
        Play {game.title} →
      </Link>
    </div>
  );
}

// ─── Structured Data ──────────────────────────────────────────────────────────
function StructuredData({
  games,
  currentDate,
}: {
  games: GamePageContent[];
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
        description: 'Triviaah offers engaging and educational trivia games and word puzzles for everyone.',
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
        '@id': 'https://triviaah.com/word-games/#webpage',
        url: 'https://triviaah.com/word-games',
        name: 'Free Word Games Online - Boggle, Cryptogram, Spelling Bee & More | Triviaah',
        description:
          'Play 8 free word games online including Cryptogram, Spelling Bee, Boggle, Word Search, Word Ladder, Crossgrid, Word Connect, and Anagram Scramble.',
        isPartOf: { '@id': 'https://triviaah.com/#website' },
        about: { '@id': 'https://triviaah.com/word-games/#itemlist' },
        datePublished: '2024-01-01T00:00:00+00:00',
        dateModified: currentDate.toISOString(),
        breadcrumb: { '@id': 'https://triviaah.com/word-games/#breadcrumb' },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://triviaah.com/imgs/word-games/word-games.webp',
          width: 1200,
          height: 630,
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://triviaah.com/#website',
        url: 'https://triviaah.com/',
        name: 'Triviaah',
        description: 'Engaging trivia games and word puzzles for everyone',
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
        '@id': 'https://triviaah.com/word-games/#itemlist',
        name: 'Free Word Games Collection',
        description:
          'Collection of free online word games designed to improve vocabulary, spelling, and cognitive skills',
        numberOfItems: games.length,
        itemListElement: games.map((game, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Game',
            name: game.title,
            description: game.supporting_copy || game.intro_text,
            url: `https://triviaah.com${game.cta_href || game.route_path}`,
            gameType: 'WordGame',
            genre: ['word', 'puzzle', 'educational'],
            applicationCategory: 'Game',
            numberOfPlayers: { '@type': 'QuantitativeValue', minValue: 1 },
            publisher: { '@id': 'https://triviaah.com/#organization' },
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://triviaah.com/word-games/#breadcrumb',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://triviaah.com' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Word Games',
            item: 'https://triviaah.com/word-games',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What free word games are available on Triviaah?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Triviaah offers eight free word games: Cryptogram (decode encrypted quotes), Spelling Bee (build words from a honeycomb of letters), Boggle (find words in a timed letter grid), Word Search (locate hidden words), Word Ladder (transform one word into another one letter at a time), Crossgrid (a compact 5×5 clue-based crossword), Word Connect (build words from a fixed letter bank), and Anagram Scramble (rearrange scrambled letters into valid words).',
            },
          },
          {
            '@type': 'Question',
            name: 'Are these word games educational?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Every game in the collection targets specific cognitive skills: Cryptogram builds deductive reasoning, Spelling Bee expands your mental lexicon, Boggle sharpens rapid scanning and orthographic awareness, Word Ladder develops strategic planning, and Anagram Scramble builds mental flexibility. Regular play across multiple games delivers a well-rounded vocabulary and cognitive workout.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need to create an account to play?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No account or registration is required. All eight word games are immediately playable without signing up. Your progress within a session is saved in your browser automatically.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which word game is best for beginners?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Word Search is the most accessible starting point — it requires only letter recognition and visual scanning. Word Connect is also beginner-friendly as it has no time pressure. Once comfortable, Spelling Bee and Boggle offer a natural step up in difficulty.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which word game is the most challenging?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Cryptogram and Crossgrid are generally considered the most challenging because they require both deductive reasoning and broad vocabulary knowledge simultaneously. Boggle is the most demanding under time pressure. Word Ladder can become extremely difficult on longer paths.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I play on mobile?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. All word games are fully responsive and optimised for touchscreens. They work on iOS and Android browsers without any app download required.',
            },
          },
        ],
      },
    ],
  };

  return (
    <Script
      id="word-games-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function WordGamesPage() {
  const allRows = await getGamePagesBySection('word-games');
  const wordGames = allRows.filter((r) => r.route_path !== '/word-games');
  const currentDate = new Date();

  const accentClasses = [
    'text-green-400',
    'text-cyan-400',
    'text-purple-400',
    'text-yellow-400',
    'text-pink-400',
    'text-orange-400',
    'text-blue-400',
    'text-red-400',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <StructuredData games={wordGames} currentDate={currentDate} />

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="mb-8 lg:mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="text-2xl text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tight">
                  Word{' '}
                  <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Games
                  </span>
                </h1>
              </div>

              <p className="max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
                Eight free word games, one destination. From the fast-paced letter grids of Boggle
                and Word Search to the slow-burn logic of Cryptogram and Crossgrid, every game in
                our collection is designed to build real vocabulary and cognitive skills — not just
                pass the time. No sign-up. No download. Just play.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ScrollToSectionButton
                  targetId="word-games-grid"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-900/20 transition-all hover:-translate-y-0.5 hover:shadow-green-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 sm:w-auto"
                >
                  <Play className="h-4 w-4" />
                  Browse Word Games
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
                  <Boxes className="text-xl text-green-400 mx-auto mb-1.5" />
                  <div className="text-white font-black text-lg leading-none">{wordGames.length}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Games</div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-3 border border-white/5 text-center backdrop-blur-sm">
                  <Clock className="text-xl text-yellow-400 mx-auto mb-1.5" />
                  <div className="text-white font-black text-lg leading-none">Daily</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Updates</div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-3 border border-white/5 text-center backdrop-blur-sm">
                  <Users className="text-xl text-cyan-400 mx-auto mb-1.5" />
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

        {/* ── Game Grid ─────────────────────────────────────────────────── */}
        <div id="word-games-grid" className="mb-16 scroll-mt-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">All Word Games</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {wordGames.map((game, index) => (
              <GameCard key={game.route_path} game={game} index={index} />
            ))}
          </div>
        </div>

        {/* ── Why Word Games ────────────────────────────────────────────── */}
        <section className="mb-16 bg-slate-800/40 rounded-2xl p-8 border border-white/5">
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Word Games Are Good for Your Brain
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed max-w-3xl">
            Word games are not just entertainment — they are one of the most accessible forms of
            cognitive exercise available. Research in neuroplasticity consistently shows that
            activities requiring active word retrieval, pattern recognition, and semantic
            flexibility help maintain mental sharpness across all age groups. Here is what each
            core skill in our games actually develops.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 bg-green-500/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Vocabulary Growth</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Active retrieval — being forced to recall a word rather than recognise it in a
                  list — dramatically accelerates vocabulary retention. Games like Spelling Bee,
                  Word Connect, and Anagram Scramble require active retrieval every single turn,
                  making them more effective vocabulary builders than passive reading or flashcard
                  review alone.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Pattern Recognition</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Boggle and Word Search train your visual system to detect letter sequences in
                  noise — the same skill that underlies fast, fluent reading. Regular practice
                  measurably reduces the time it takes your brain to identify familiar word shapes,
                  which compounds into faster reading speeds and improved comprehension over time.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Deductive Reasoning</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Cryptogram and Crossgrid require you to maintain multiple working hypotheses,
                  test them against constraints, and revise them when they fail — the core loop of
                  scientific thinking, legal reasoning, and debugging code. These games are among
                  the few casual activities that genuinely exercise deductive rather than just
                  associative thinking.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Mental Flexibility</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Word Ladder and Anagram Scramble both require you to hold a word in mind and
                  actively reconfigure it — changing one letter, or rearranging all of them. This
                  kind of mental rotation exercise strengthens working memory and the ability to
                  shift between competing solutions quickly, skills that transfer directly to
                  creative problem-solving in everyday life.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Game Deep-Dives ───────────────────────────────────────────── */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-3">
            Every Word Game, Explained in Detail
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed max-w-3xl">
            Not sure which game to start with? Below is a deep look at each of the{' '}
            {wordGames.length} word games in our collection — what skills each one targets, a
            pro strategy tip, and who it is best suited for.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {wordGames.map((game, index) => (
              <GameDetailCard
                key={game.route_path}
                game={game}
                accentClass={accentClasses[index % accentClasses.length]}
              />
            ))}
          </div>
        </section>

        {/* ── How to Choose ─────────────────────────────────────────────── */}
        <section className="mb-16 bg-slate-800/40 rounded-2xl p-8 border border-white/5">
          <h2 className="text-3xl font-bold text-white mb-6">How to Choose the Right Word Game</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-bold text-green-400 mb-3">You have 3–5 minutes</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Go for Boggle or Word Search. Both are designed for short, satisfying sessions
                that feel complete within a few minutes. Boggle's timer creates a natural endpoint,
                while Word Search lets you finish a grid at your own pace.
              </p>
              <p className="text-gray-400 text-xs">Best picks: Boggle, Word Search, Anagram Scramble</p>
            </div>

            <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">You want a real challenge</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Cryptogram and Crossgrid are the most intellectually demanding options. Both
                require you to work through uncertainty systematically rather than relying on
                speed or large vocabulary alone. Expect to spend 10–20 minutes on a good session.
              </p>
              <p className="text-gray-400 text-xs">Best picks: Cryptogram, Crossgrid, Word Ladder</p>
            </div>

            <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-bold text-purple-400 mb-3">You are building vocabulary</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Spelling Bee and Word Connect are specifically designed around the mental
                processes that build vocabulary most efficiently. Both force active retrieval from
                a constrained letter set, which produces stronger memory encoding than free-recall
                tasks.
              </p>
              <p className="text-gray-400 text-xs">Best picks: Spelling Bee, Word Connect, Cryptogram</p>
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
                question: 'What free word games are available on Triviaah?',
                answer:
                  'Triviaah offers eight free word games: Cryptogram, Spelling Bee, Boggle, Word Search, Word Ladder, Crossgrid, Word Connect, and Anagram Scramble. Each game targets different vocabulary and cognitive skills and is playable immediately without any sign-up.',
              },
              {
                question: 'Are these word games educational?',
                answer:
                  'Yes. Every game is designed around real cognitive and vocabulary-building mechanisms. Cryptogram builds deductive reasoning, Spelling Bee expands your mental lexicon, Boggle sharpens pattern recognition, Word Ladder develops strategic planning, and Anagram Scramble builds mental flexibility. Regular mixed play delivers a genuinely well-rounded language workout.',
              },
              {
                question: 'Which word game is best for beginners?',
                answer:
                  'Word Search is the most accessible starting point — it requires only letter recognition and visual scanning with no time pressure. Word Connect is also beginner-friendly. Once comfortable, Spelling Bee and Boggle offer a natural step up in difficulty without becoming intimidating.',
              },
              {
                question: 'Which word game is the most challenging?',
                answer:
                  'Cryptogram and Crossgrid are the most cognitively demanding because they require simultaneous deductive reasoning and vocabulary knowledge. Boggle is the most demanding purely under time pressure. Word Ladder difficulty scales dramatically with path length — short paths are easy, long ones can stump experienced players.',
              },
              {
                question: 'Do I need to create an account?',
                answer:
                  'No account or registration is required for any game. All eight word games are immediately playable. Progress within a session is saved in your browser automatically, so you can pause and return to any puzzle.',
              },
              {
                question: 'Can I play these word games on mobile?',
                answer:
                  'Yes. All games are fully responsive and touch-optimised. They work on iOS and Android browsers without any app download. Games like Word Search and Boggle have touch-specific controls (tap and drag) that feel natural on a phone screen.',
              },
              {
                question: 'How often do new puzzles appear?',
                answer:
                  'Several games — including Crossgrid and Spelling Bee — refresh with new content daily. Evergreen games like Word Connect and Anagram Scramble generate new puzzles on demand so you are never playing the same content twice. Boggle and Word Search also generate fresh boards each session.',
              },
              {
                question: 'Are word games good for children?',
                answer:
                  'Yes, with some guidance on difficulty. Word Search and Word Connect are appropriate from around age 8 onwards. Spelling Bee suits ages 10 and up. Cryptogram and Crossgrid are best from age 12 onwards due to the deductive reasoning required. All games are ad-safe and require no personal information.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-green-500/30 transition-all duration-300"
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
            About Triviaah's Word Games Collection
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Triviaah built this word games collection around a single principle: every game should
            deliver genuine cognitive value, not just novelty. That means each game in the
            collection was chosen because it targets a distinct set of skills — no two games in
            our lineup do the same thing. Boggle and Word Search may both involve finding words in
            letter grids, but they train completely different processes: Boggle demands spatial
            path-tracing and rapid recall under time pressure, while Word Search rewards systematic
            visual scanning and patience.
          </p>
          <p className="text-gray-300 leading-relaxed mb-4">
            The eight games span three broad cognitive domains. Retrieval-based games (Spelling
            Bee, Word Connect, Anagram Scramble) work by making you produce words from constrained
            inputs, strengthening the memory pathways that support fluent reading and writing.
            Scanning games (Boggle, Word Search) train the perceptual speed that underlies fast
            reading. Deduction games (Cryptogram, Crossgrid, Word Ladder) develop logical
            reasoning by requiring you to work from incomplete information toward a definite
            answer.
          </p>
          <p className="text-gray-300 leading-relaxed mb-6">
            All eight games are free, require no account, and work across all modern devices. Daily
            content refreshes on selected games mean there is always a reason to come back, while
            the evergreen games provide unlimited replay depth. Whether you have three minutes or
            thirty, there is a word game in this collection built for that session.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Who Plays Word Games on Triviaah</h3>
              <div className="space-y-3 text-gray-300 text-sm">
                <div className="flex gap-2">
                  <span className="text-green-400 font-bold mt-0.5">→</span>
                  <span>
                    <strong className="text-white">Students</strong> — from elementary learners
                    building foundational spelling skills to high schoolers preparing for SAT
                    vocabulary sections and ESL learners strengthening English word knowledge.
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-cyan-400 font-bold mt-0.5">→</span>
                  <span>
                    <strong className="text-white">Professionals</strong> — writers, editors,
                    lawyers, and communicators who treat vocabulary as a professional tool and
                    want to keep it sharp with daily practice.
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-purple-400 font-bold mt-0.5">→</span>
                  <span>
                    <strong className="text-white">Seniors</strong> — word games are among the
                    most evidence-backed activities for maintaining cognitive health, and our
                    collection spans difficulty levels that suit both casual and experienced players.
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-400 font-bold mt-0.5">→</span>
                  <span>
                    <strong className="text-white">Puzzle enthusiasts</strong> — fans of the NYT
                    Spelling Bee, Wordle, and traditional crosswords who want more variety in
                    their daily word puzzle routine.
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Word Games vs. Other Brain Games</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Number puzzles and spatial games like Sudoku are excellent for logical reasoning,
                but they do not build language skills. Word games uniquely bridge both: they
                require logical thinking (especially Cryptogram and Crossgrid) while simultaneously
                exercising the language-specific networks that support reading, writing, and verbal
                communication.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Compared to passive vocabulary apps that show you words to recognise, active word
                games force production — you must generate the word yourself from partial
                information. This production requirement is what makes word games significantly
                more effective as vocabulary builders than flashcard-style apps, which is why
                language teachers have used games like Boggle and Spelling Bee in classrooms
                for decades.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}