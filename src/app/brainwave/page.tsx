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

export const revalidate = 86400;

interface Puzzle {
  route_path: string;
  category: string;
  name: string;
  path: string;
  image: string;
  og_image?: string | null;
  tagline: string;
  intro_text: string;
  supporting_copy: string;
  is_daily_refresh: boolean;
}

export const metadata: Metadata = {
  title: 'Brainwave Games | Daily Trivia Puzzles | Triviaah',
  description:
    'Play free daily Brainwave puzzles on Triviaah. Choose movie, music, geography, history, food, landmark, invention, word, animal, plant, city, country, or celebrity games.',
  keywords: ['brainwave games', 'daily trivia puzzles', 'trivia puzzle games', 'daily puzzle games'],
  alternates: {
    canonical: 'https://triviaah.com/brainwave',
  },
  category: 'games',
  openGraph: {
    title: 'Brainwave Games | Daily Trivia Puzzles | Triviaah',
    description:
      'Play free daily Brainwave puzzles across movies, music, geography, history, words, food, landmarks, inventions, and more.',
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
    title: 'Brainwave Games | Triviaah',
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

export default async function BrainwavePage() {
  const dailyPuzzles = await getDailyPuzzles();
  const currentDate = new Date();

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
                Pick a daily puzzle and solve it from clues. Brainwave covers movies, music,
                geography, history, food, landmarks, inventions, words, nature, cities, countries,
                and celebrities. No account required.
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

        {/* Only one ad allowed per page
          <div className="py-4">
          <Ads format="horizontal" slot="9040722315" isMobileFooter={false} className="lg:hidden" />
        </div>
        */}

        {/* Gaming Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">How Brainwave Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/20 text-center">
              <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pick a Theme</h3>
              <p className="text-gray-300">Choose from pop culture, places, words, history, science, food, and more.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Daily Rotation</h3>
              <p className="text-gray-300">Each game gets a fresh puzzle on its own daily schedule.</p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Use the Clues</h3>
              <p className="text-gray-300">Hints narrow the answer while keeping each round quick to play.</p>
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
                answer: "Brainwave games are free daily trivia puzzles built around clues and themed answers."
              },
              {
                question: "Are these games free to play?",
                answer: "Yes. Brainwave games are free to play and do not require an account."
              },
              {
                question: "How often are new puzzles available?",
                answer: "Each Brainwave game gets a new puzzle every day."
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
                answer: "Yes. Brainwave games work on phones, tablets, and desktop browsers."
              },
              {
                question: "What if I can't solve a puzzle?",
                answer: "Use the available hints or come back later. Some games reveal more clues as you play."
              },
              {
                question: "Can I share my results?",
                answer: "Yes. Completed games include a share option for your result."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className="font-semibold text-lg text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <ExploreSections exclude="brainwave" />
      </div>
    </div>
  );
}

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
        "name": "Brainwave Games | Daily Trivia Puzzles | Triviaah",
        "description": "Play free daily Brainwave puzzles on Triviaah. Choose movie, music, geography, history, food, landmark, invention, word, animal, plant, city, country, or celebrity games.",
        "isPartOf": {
          "@id": "https://triviaah.com/#website"
        },
        "about": {
          "@id": "https://triviaah.com/brainwave/#itemlist"
        },
        "datePublished": "2024-01-01T00:00:00+00:00",
        "dateModified": currentDate.toISOString(),
        "inLanguage": "en-US",
        "breadcrumb": {
          "@id": "https://triviaah.com/brainwave/#breadcrumb"
        },
        "mainEntity": {
          "@id": "https://triviaah.com/brainwave/#itemlist"
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
        "name": "Brainwave Daily Puzzle Games",
        "description": "Collection of Brainwave trivia puzzles covering movies, music, geography, history, words, food, landmarks, inventions, cities, countries, plants, animals, and pop culture",
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
              "text": "Yes. Brainwave games are free to play and do not require an account."
            }
          },
          {
            "@type": "Question",
            "name": "How often are new puzzles available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Each Brainwave game gets a new puzzle every day."
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
              "text": "Yes. Brainwave games work on phones, tablets, and desktop browsers."
            }
          },
          {
            "@type": "Question",
            "name": "What if I can't solve a puzzle?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use the available hints or come back later. Some games reveal more clues as you play."
            }
          },
          {
            "@type": "Question",
            "name": "Can I share my results?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Completed games include a share option for your result."
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
