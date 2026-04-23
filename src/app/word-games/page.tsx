import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Boxes, Star, Clock, Users } from 'lucide-react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { getGamePagesBySection, type GamePageContent } from '@/lib/game-pages';

export const metadata: Metadata = {
  title: 'Word Games Collection - Free Vocabulary & Spelling Games | Triviaah',
  description: 'Challenge your vocabulary with our collection of free word games including Cryptogram, Spelling Bee, Boggle, Word Search, Word Ladder, Crossgrid, Word Connect, and Anagram Scramble.',
  alternates: {
    canonical: 'https://triviaah.com/word-games',
  },
  openGraph: {
    title: 'Word Games Collection - Free Vocabulary & Spelling Games | Triviaah',
    description: 'Challenge your vocabulary with our collection of free word games including Cryptogram, Spelling Bee, Boggle, Word Search, Word Ladder, Crossgrid, Word Connect, and Anagram Scramble.',
    url: 'https://triviaah.com/word-games',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/word-games/word-games.webp',
        width: 1200,
        height: 630,
        alt: 'Word Games Collection',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Word Games Collection | Triviaah',
    description: 'Challenge your vocabulary with our collection of free word games.',
    images: ['/imgs/word-games/word-games.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Gaming-style game card matching the brainwave page design
function GameCard({ game, index }: { game: GamePageContent; index: number }) {
  const imageSrc = game.og_image || `/imgs/word-games/${game.route_path.split('/').pop()}.webp`;
  const route = game.cta_href || game.route_path;
  const tagline = game.supporting_copy || game.intro_text;

  return (
    <Link
      key={game.route_path}
      href={route}
      title={`Play ${game.title} - ${tagline}`}
      className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-500 bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/20 hover:border-cyan-400/40"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      {/* Game Image */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-cyan-900 to-purple-900 overflow-hidden">  
        <Image
          src={imageSrc}
          alt={`${game.title} Word Game`}
          fill
          className="object-contain transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={index < 3 ? "eager" : "lazy"}
          priority={index < 2}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Play button overlay */}
        <div className="absolute bottom-4 right-4 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Play className="w-5 h-5 text-white" />
        </div>

        {/* Game number badge */}
        <div className="absolute top-4 left-4 bg-black/70 text-white text-sm font-semibold px-3 py-1 rounded-full">
          #{index + 1}
        </div>
      </div>
      
      {/* Game Content */}
      <div className="p-6 relative z-10">
        <h3 className="font-bold text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
          {game.title}
        </h3>
        <p className="text-sm text-gray-300 line-clamp-2">
          {game.supporting_copy || game.intro_text}
        </p>
        
        {/* Progress bar effect */}
        <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-0 group-hover:w-full transition-all duration-700" />
        </div>
      </div>
    </Link>
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
        "description": "Triviaah offers engaging and educational trivia games and puzzles for everyone.",
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
        "@id": "https://triviaah.com/word-games/#webpage",
        "url": "https://triviaah.com/word-games",
        "name": "Word Games Collection - Free Vocabulary & Spelling Games | Triviaah",
        "description": "Challenge your vocabulary with our collection of free word games including Cryptogram, Spelling Bee, Boggle, Word Search, Word Ladder, Crossgrid, Word Connect, and Anagram Scramble.",
        "isPartOf": {
          "@id": "https://triviaah.com/#website"
        },
        "about": {
          "@id": "https://triviaah.com/word-games/#itemlist"
        },
        "datePublished": "2024-01-01T00:00:00+00:00",
        "dateModified": currentDate.toISOString(),
        "breadcrumb": {
          "@id": "https://triviaah.com/word-games/#breadcrumb"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://triviaah.com/imgs/word-games/word-games.webp",
          "width": 1200,
          "height": 630
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://triviaah.com/#website",
        "url": "https://triviaah.com/",
        "name": "Triviaah",
        "description": "Engaging trivia games and puzzles for everyone",
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
        "@id": "https://triviaah.com/word-games/#itemlist",
        "name": "Word Games Collection",
        "description": "Collection of educational word games designed to improve vocabulary, spelling, and cognitive skills",
        "numberOfItems": games.length,
        "itemListElement": games.map((game, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Game",
            "name": game.title,
            "description": game.supporting_copy || game.intro_text,
            "url": `https://triviaah.com${game.cta_href || game.route_path}`,
            "gameType": "WordGame",
            "genre": ["word", "puzzle", "educational"],
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
        "@id": "https://triviaah.com/word-games/#breadcrumb",
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
            "name": "Word Games",
            "item": "https://triviaah.com/word-games"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What types of word games are available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We offer eight main word games: Cryptogram (decoding quotes), Spelling Bee (word formation), Boggle (grid word search), Word Search (hidden word finding), Word Ladder (word transformation), Crossgrid (mini clue-based word squares), Word Connect (letter-bank word building), and Anagram Scramble (letter building). Each game focuses on different language skills and provides unique challenges for vocabulary building."
            }
          },
          {
            "@type": "Question",
            "name": "Are these word games educational?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! All our word games are designed to be educational, helping improve vocabulary, spelling, pattern recognition, and cognitive skills while providing engaging entertainment. Each game targets specific language skills and offers progressive learning opportunities."
            }
          },
          {
            "@type": "Question",
            "name": "Are the word games free to play?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! All word games are completely free to play with no registration required. You can enjoy unlimited gameplay across all our word game collection, with daily new puzzles and multiple difficulty levels available at no cost."
            }
          },
          {
            "@type": "Question",
            "name": "Which word game is best for beginners?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Word Search is great for beginners as it's relaxing and helps with word recognition. For more challenge, try Cryptogram or Spelling Bee to build vocabulary and spelling skills. Boggle offers a good balance of challenge and accessibility."
            }
          }
        ]
      }
    ]
  };

  return (
    <Script
      id="word-games-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default async function WordGamesPage() {
  const allRows = await getGamePagesBySection('word-games');
  const wordGames = allRows.filter((r) => r.route_path !== '/word-games');
  const currentDate = new Date();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Structured Data */}
        <StructuredData games={wordGames} currentDate={currentDate} />
        
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
                    Word <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Games</span>
                  </h1>
                </div>
              </div>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">
                Challenge your vocabulary with our exciting collection of word games. 
                From cipher decoding to spelling and scramble puzzles, every game is free to play.
              </p>
              <div className="mt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-slate-800/30 px-3 py-1.5 rounded-full border border-white/5 inline-block">
                  Last Updated: {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Stats Column */}
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

          {/* Mobile: Horizontal Scroll Layout */}
          <div className="lg:hidden mb-16 overflow-hidden">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">All Word Games</h2>
            <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scrollbar-hide px-4 -mx-4">
              {wordGames.map((game, index) => (
                <div key={game.route_path} className="w-[260px] shrink-0 snap-start">
                  <GameCard game={game} index={index} />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden lg:block mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wordGames.map((game, index) => (
                <GameCard key={game.route_path} game={game} index={index} />
              ))}
            </div>
          </div>

          {/* Gaming Features Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Why Players Love Word Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Vocabulary Builder</h3>
                <p className="text-gray-300">Expand your vocabulary and discover new words through engaging gameplay</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Brain Training</h3>
                <p className="text-gray-300">Improve cognitive skills, memory, and problem-solving abilities</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Skill Levels</h3>
                <p className="text-gray-300">Multiple difficulty levels perfect for beginners to word masters</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-500/20 text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Daily Challenges</h3>
                <p className="text-gray-300">Fresh puzzles every day to keep your mind sharp and engaged</p>
              </div>
            </div>
          </div>

          {/* FAQ Section - Gaming Style */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "What types of word games are available?",
                  answer: "We offer eight main word games: Cryptogram for decoding quotes, Spelling Bee for word formation, Boggle for grid word searches, Word Search for hidden word finding, Word Ladder for word transformation puzzles, Crossgrid for clue-based word-square solving, Word Connect for letter-bank word building, and Anagram Scramble for letter building."
                },
                {
                  question: "Are these word games educational?",
                  answer: "Yes! All our word games are designed to be educational, helping improve vocabulary, spelling, pattern recognition, and cognitive skills while providing engaging entertainment for all ages."
                },
                {
                  question: "Are the word games free to play?",
                  answer: "Absolutely! All word games are completely free to play with no registration required. Enjoy unlimited gameplay across our entire word game collection without any cost."
                },
                {
                  question: "Which word game is best for beginners?",
                  answer: "Word Search is perfect for beginners as it's relaxing and helps with word recognition. For more challenge, try Cryptogram or Spelling Bee to build vocabulary and spelling skills progressively."
                },
                {
                  question: "Can I play on mobile devices?",
                  answer: "Yes! All word games are fully responsive and work perfectly on smartphones, tablets, and desktop computers. Play anytime, anywhere with our mobile-optimized designs."
                },
                {
                  question: "How often are new puzzles available?",
                  answer: "Some word games refresh daily, while evergreen games like Word Connect and Anagram Scramble can be replayed anytime. We also add new puzzle packs and themed challenges regularly to keep the gameplay fresh and exciting."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-green-500/30 transition-all duration-300">
                  <h3 className="font-semibold text-lg text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Content Section */}
          <section className="bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-700">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-3xl font-bold text-white mb-6">Word Games Collection - Educational Vocabulary Challenges</h2>
              <p className="text-lg text-gray-300 mb-6">
                Our <strong className="text-green-400">word games collection</strong> offers engaging educational challenges designed to 
                improve vocabulary, spelling, and cognitive skills through fun, interactive gameplay that makes learning enjoyable.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Featured Word Games</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-green-400 font-bold mr-2">•</span>
                      <span><strong>Cryptogram</strong>: Decode encrypted quotes in this classic puzzle</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 font-bold mr-2">•</span>
                      <span><strong>Spelling Bee</strong>: Create words from letter honeycombs with center requirements</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 font-bold mr-2">•</span>
                      <span><strong>Boggle</strong>: Find words by connecting adjacent letters in timed grid challenges</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 font-bold mr-2">•</span>
                      <span><strong>Word Search</strong>: Locate hidden words across multiple directions in letter grids</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 font-bold mr-2">•</span>
                      <span><strong>Word Connect</strong>: Connect letters to build valid words from a letter bank</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 font-bold mr-2">•</span>
                      <span><strong>Anagram Scramble</strong>: Build words from a scrambled letter bank</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Educational Benefits</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-green-400 font-bold mr-2">✓</span>
                      <span>Significant <strong>vocabulary expansion</strong> and word discovery</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 font-bold mr-2">✓</span>
                      <span>Improved <strong>spelling accuracy</strong> and pattern recognition</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 font-bold mr-2">✓</span>
                      <span>Enhanced <strong>cognitive skills</strong> and problem-solving abilities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 font-bold mr-2">✓</span>
                      <span>Development of <strong>logical thinking</strong> and mental agility</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Perfect For All Ages & Skill Levels</h3>
                <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <h4 className="font-semibold text-green-300 mb-2">Students & Learners</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Elementary students building foundational skills</li>
                      <li>• Middle school students expanding vocabulary</li>
                      <li>• High school students preparing for tests</li>
                      <li>• ESL learners improving English proficiency</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-2">Adults & Enthusiasts</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Word game enthusiasts seeking new challenges</li>
                      <li>• Seniors maintaining cognitive health</li>
                      <li>• Professionals enhancing communication skills</li>
                      <li>• Families enjoying educational entertainment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
        </section>
      </div>
    </div>
  );
}
