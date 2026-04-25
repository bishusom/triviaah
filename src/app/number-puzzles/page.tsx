import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Boxes, Star, Clock, Users } from 'lucide-react';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { getGamePagesBySection, type GamePageContent } from '@/lib/game-pages';
import { MobileExpandableDescription } from '@/components/daily-trivias/MobileExpandableDescription';
import { ScrollToSectionButton } from '@/components/common/ScrollToSectionButton';

export const metadata: Metadata = {
  title: 'Number Puzzles Collection | Free Math Games & Brain Teasers | Triviaah',
  description: 'Challenge your math skills with our collection of free number puzzles including 2048, Number Tower, Prime Hunter, Number Sequence, Sudoku, Kakuro, KenKen, and Number Bonds.',
  alternates: {
    canonical: 'https://triviaah.com/number-puzzles',
  },
  openGraph: {
    title: 'Number Puzzles Collection | Free Math Games & Brain Teasers | Triviaah',
    description: 'Challenge your math skills with our collection of free number puzzles.',
    url: 'https://triviaah.com/number-puzzles',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/number-puzzles/number-puzzles-og.webp',
        width: 1200,
        height: 630,
        alt: 'Number Puzzles Collection',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Number Puzzles Collection | Triviaah',
    description: 'Challenge your math skills with our collection of free number puzzles.',
    images: ['/imgs/number-puzzles/number-puzzles-og.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

function PuzzleCard({ puzzle, index }: { puzzle: GamePageContent; index: number }) {
  const imageSrc = puzzle.og_image || `/imgs/number-puzzles/${puzzle.route_path.split('/').pop()}.webp`;
  const route = puzzle.cta_href || puzzle.route_path;
  const tagline = puzzle.supporting_copy || puzzle.intro_text;

  // Since we don't have explicit arrays of skills/difficulties in DB anymore (or maybe we do in tags?),
  // we can use keywords or just leave the badges out if not provided. We'll default to some generic ones.
  const difficulty = 'Medium';
  const skills = puzzle.keywords?.slice(0, 2) || ['Math', 'Logic'];

  return (
    <Link
      key={puzzle.route_path}
      href={route}
      title={`Play ${puzzle.title} - ${tagline}`}
      className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-500 bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/20 hover:border-cyan-400/40"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      <div className="relative aspect-square w-full bg-gradient-to-br from-cyan-900 to-purple-900 overflow-hidden">  
        <Image
          src={imageSrc}
          alt={`${puzzle.title} Number Puzzle`}
          fill
          className="object-contain transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={index < 3 ? "eager" : "lazy"}
          priority={index < 2}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        <div className="absolute bottom-4 right-4 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Play className="w-5 h-5 text-white" />
        </div>

        <div className="absolute top-4 left-4 bg-black/70 text-white text-sm font-semibold px-3 py-1 rounded-full">
          #{index + 1}
        </div>

        <div className="absolute top-4 right-4 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full">
          {difficulty}
        </div>
      </div>
      
      <div className="p-6 relative z-10">
        <h3 className="font-bold text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
          {puzzle.title}
        </h3>
        <p className="text-sm text-gray-300 line-clamp-2">
          {puzzle.supporting_copy || puzzle.intro_text}
        </p>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {skills.map((skill, idx) => (
            <span key={idx} className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs truncate max-w-full">
              {skill}
            </span>
          ))}
        </div>
        
        <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-0 group-hover:w-full transition-all duration-700" />
        </div>
      </div>
    </Link>
  );
}

function StructuredData({ puzzles, currentDate }: { puzzles: GamePageContent[], currentDate: Date }) {
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
        "@id": "https://triviaah.com/number-puzzles/#webpage",
        "url": "https://triviaah.com/number-puzzles",
        "name": "Number Puzzles Collection | Free Math Games & Brain Teasers | Triviaah",
        "description": "Challenge your math skills with our collection of free number puzzles including 2048, Number Tower, Prime Hunter, Number Sequence, Sudoku, Kakuro, KenKen, and Number Bonds.",
        "isPartOf": {
          "@id": "https://triviaah.com/#website"
        },
        "about": {
          "@id": "https://triviaah.com/number-puzzles/#itemlist"
        },
        "datePublished": "2024-01-01T00:00:00+00:00",
        "dateModified": currentDate.toISOString(),
        "breadcrumb": {
          "@id": "https://triviaah.com/number-puzzles/#breadcrumb"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://triviaah.com/imgs/number-puzzles/number-puzzles-og.webp",
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
        "@id": "https://triviaah.com/number-puzzles/#itemlist",
        "name": "Number Puzzles Collection",
        "description": "Comprehensive collection of mathematical puzzle games designed to improve cognitive skills and mathematical thinking",
        "numberOfItems": puzzles.length,
        "itemListElement": puzzles.map((puzzle, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Game",
            "name": puzzle.title,
            "description": puzzle.supporting_copy || puzzle.intro_text,
            "url": `https://triviaah.com${puzzle.cta_href || puzzle.route_path}`,
            "gameType": "PuzzleGame",
            "genre": ["math", "puzzle", "educational"],
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
        "@id": "https://triviaah.com/number-puzzles/#breadcrumb",
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
            "name": "Number Puzzles",
            "item": "https://triviaah.com/number-puzzles"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are number puzzles?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Number puzzles are mathematical games and brain teasers that challenge players to solve problems using numbers, patterns, and logical reasoning. They develop mathematical thinking, problem-solving skills, and cognitive abilities through engaging gameplay."
            }
          },
          {
            "@type": "Question",
            "name": "Are these number puzzles free to play?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! All our number puzzles are completely free to play with no registration required. You can enjoy unlimited gameplay across all puzzle types without any cost or subscription requirements."
            }
          },
          {
            "@type": "Question",
            "name": "What skills do number puzzles develop?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Number puzzles develop mathematical reasoning, logical thinking, problem-solving abilities, pattern recognition, mental math skills, concentration, and overall cognitive function through engaging mathematical challenges."
            }
          },
          {
            "@type": "Question",
            "name": "Which number puzzle should I start with?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Beginners should start with Number Sequence, Number Pyramid, or Prime Hunter, which have easier difficulty levels. Intermediate players can try 2048, KenKen, Number Tower, or Kakuro, while Sudoku offers challenges for all skill levels."
            }
          }
        ]
      }
    ]
  };

  return (
    <Script
      id="number-puzzles-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default async function NumberPuzzlesPage() {
  const allRows = await getGamePagesBySection('number-puzzles');
  const numberPuzzles = allRows.filter((r) => r.route_path !== '/number-puzzles');
  const currentDate = new Date();
  const heroDescription = 'Challenge your math skills with our free number puzzles, including 2048, Number Tower, Prime Hunter, Number Sequence, Sudoku, Kakuro, KenKen, and Number Bonds. Practice arithmetic, pattern recognition, logic, and problem-solving through quick puzzles designed for mobile and desktop play.';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Structured Data */}
        <StructuredData puzzles={numberPuzzles} currentDate={currentDate} />
        
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
                    Number <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Puzzles</span>
                  </h1>
                </div>
              </div>
              <MobileExpandableDescription className="max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
                {heroDescription}
              </MobileExpandableDescription>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ScrollToSectionButton
                  targetId="number-puzzles-grid"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition-all hover:-translate-y-0.5 hover:shadow-purple-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 sm:w-auto"
                >
                  <Play className="h-4 w-4" />
                  Browse Number Puzzles
                </ScrollToSectionButton>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-slate-800/30 px-3 py-1.5 rounded-full border border-white/5 inline-block">
                  Last Updated: {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Stats Column */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/50 rounded-2xl p-3 border border-white/5 text-center backdrop-blur-sm">
                  <Boxes className="text-xl text-purple-400 mx-auto mb-1.5" />
                  <div className="text-white font-black text-lg leading-none">{numberPuzzles.length}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Puzzles</div>
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
            
          <div id="number-puzzles-grid" className="mb-16 scroll-mt-6">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">All Number Puzzles</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
              {numberPuzzles.map((puzzle, index) => (
                <PuzzleCard key={puzzle.route_path} puzzle={puzzle} index={index} />
              ))}
            </div>
          </div>

          {/* Gaming Features Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Why Players Love Number Puzzles</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Brain Training</h3>
                <p className="text-gray-300">Improve cognitive skills, memory, and logical reasoning abilities</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Math Skills</h3>
                <p className="text-gray-300">Develop mental math, pattern recognition, and problem-solving</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">All Levels</h3>
                <p className="text-gray-300">Multiple difficulty levels perfect for beginners to math experts</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-500/20 text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Daily Progress</h3>
                <p className="text-gray-300">Track your improvement with daily challenges and achievements</p>
              </div>
            </div>
          </div>

          {/* FAQ Section - Gaming Style */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "What are number puzzles?",
                  answer: "Number puzzles are mathematical games and brain teasers that challenge players to solve problems using numbers, patterns, sequences, and logical reasoning. They range from simple arithmetic challenges to complex logical problems designed to develop mathematical thinking."
                },
                {
                  question: "Are these number puzzles free to play?",
                  answer: "Yes! All our number puzzles are completely free to play with no registration required. Enjoy unlimited gameplay across all puzzle types, multiple difficulty levels, and daily challenges without any cost or subscription requirements."
                },
                {
                  question: "What skills do number puzzles develop?",
                  answer: "Number puzzles develop mathematical reasoning, logical thinking, problem-solving abilities, pattern recognition, mental math skills, concentration, spatial reasoning, strategic planning, and overall cognitive function through engaging mathematical challenges."
                },
                {
                  question: "Which number puzzle should I start with?",
                  answer: "Beginners should start with Number Sequence, Number Pyramid, or Prime Hunter, which have easier difficulty levels. Intermediate players can try 2048, KenKen, Number Tower, or Kakuro, while Sudoku offers classic puzzle challenges suitable for all skill levels."
                },
                {
                  question: "Are these puzzles suitable for children?",
                  answer: "Absolutely! Our number puzzles are excellent for children developing mathematical skills. The varying difficulty levels make them suitable for different age groups, helping build foundational math skills and logical thinking abilities valuable for academic success."
                },
                {
                  question: "How often are new puzzles added?",
                  answer: "We add new puzzles and challenges regularly, with daily updates for most puzzle types. Each game features fresh content, new difficulty levels, and seasonal challenges to keep the experience engaging and provide continuous learning opportunities."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/30 transition-all duration-300">
                  <h3 className="font-semibold text-lg text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Content Section */}
          <section className="bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-700">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-3xl font-bold text-white mb-6">Number Puzzles Collection - Mathematical Brain Teasers</h2>
              <p className="text-lg text-gray-300 mb-6">
                Our <strong className="text-purple-400">number puzzles collection</strong> offers challenging mathematical games designed to 
                improve logical reasoning, problem-solving skills, and cognitive abilities through engaging, 
                thought-provoking puzzles that make learning mathematics enjoyable and rewarding.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Featured Number Puzzles</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-400 font-bold mr-2">•</span>
                      <span><strong>2048</strong>: Swipe tiles to merge matching numbers and reach 2048</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 font-bold mr-2">•</span>
                      <span><strong>Prime Hunter</strong>: Identify prime numbers in challenging grid configurations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 font-bold mr-2">•</span>
                      <span><strong>Number Sequence</strong>: Discover patterns and complete mathematical sequences</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 font-bold mr-2">•</span>
                      <span><strong>Number Tower</strong>: Strategically arrange numbers in tower structures</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 font-bold mr-2">•</span>
                      <span><strong>KenKen</strong>: Fill rows, columns, and cages using arithmetic logic</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 font-bold mr-2">•</span>
                      <span><strong>Number Pyramid</strong>: Mathematical puzzle using sums and differences</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Mathematical Benefits</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-purple-400 font-bold mr-2">✓</span>
                      <span>Enhanced <strong>mathematical reasoning</strong> and logical thinking</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 font-bold mr-2">✓</span>
                      <span>Improved <strong>problem-solving</strong> and strategic planning skills</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 font-bold mr-2">✓</span>
                      <span>Advanced <strong>pattern recognition</strong> and analytical abilities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 font-bold mr-2">✓</span>
                      <span>Stronger <strong>mental math</strong> and numerical processing</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Perfect For Mathematical Development</h3>
                <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-2">Students & Learners</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Elementary students building math foundations</li>
                      <li>• Middle school students developing logic skills</li>
                      <li>• High school students preparing for exams</li>
                      <li>• College students strengthening analytical thinking</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-2">Adults & Enthusiasts</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Puzzle enthusiasts seeking intellectual challenges</li>
                      <li>• Professionals maintaining analytical skills</li>
                      <li>• Seniors preserving cognitive health</li>
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
