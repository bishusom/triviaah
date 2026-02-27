// app/brainwave/page.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import Ads from '@/components/common/Ads';
import { Play, Boxes, Star, Clock, Users } from 'lucide-react';

interface Puzzle {
  category: string;
  name: string;
  path: string;
  image: string;
  tagline: string;
  keywords: string;
}

export const metadata: Metadata = {
  title: 'Brainwave Trivia Games - Creative Puzzle Challenges | Triviaah',
  description: 'Enjoy our collection of creative brainwave trivia games including word puzzles, movie guessing, music challenges and geography quizzes.', 
  keywords: 'brainwave games, trivia puzzles, word games, movie trivia, music trivia, geography quizzes', 
  alternates: {
    canonical: 'https://triviaah.com/brainwave',
  },
  openGraph: {
    title: 'Brainwave Trivia Games - Creative Puzzle Challenges | Triviaah',
    description: 'Challenge your mind with our creative brainwave trivia games including Capitale, Plotle, Songle and more!',
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brainwave Trivia Games - Creative Puzzle Challenges | Triviaah',
    description: 'Challenge your mind with our creative brainwave trivia games including Capitale, Plotle, Songle and more!',
    images: ['/imgs/brainwave/brainwave-trivia-og.webp'],
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

async function getDailyPuzzles() {
  return [  
      {
      category: 'plotle',
      name: 'Plotle',
      path: '/brainwave/plotle',
      image: '/imgs/brainwave/plotle.webp',
      tagline: 'Guess the movie from its plot description in emojis',
      keywords: 'movie plot game, film trivia, movie guessing game'
      },
      {
      category: 'capitale',
      name: 'Capitale',
      path: '/brainwave/capitale',
      image: '/imgs/brainwave/capitale.webp',
      tagline: 'Guess world capitals in this challenging geography puzzle',
      keywords: 'capital cities game, geography puzzle, world capitals quiz'
      },
      {
      category: 'historidle',
      name: 'Historidle',
      path: '/brainwave/historidle',
      image: '/imgs/brainwave/historidle.webp',
      tagline: 'Guess the historical event from dates and other intriguing clues',
      keywords: 'history trivia game, historical events quiz, history guessing game'
      },
      {
      category: 'celebrile',
      name: 'Celebrile',
      path: '/brainwave/celebrile',
      image: '/imgs/brainwave/celebrile.webp',
      tagline: 'Guess the celebrity from fun facts in this star-studded quiz',
      keywords: 'celebrity trivia game, famous people quiz, celebrity guessing game'    
      },
      {
      category: 'songle',
      name: 'Songle',
      path: '/brainwave/songle',
      image: '/imgs/brainwave/songle.webp',
      tagline: 'Identify songs from lyrics snippets in this music challenge',
      keywords: 'music lyrics game, song trivia, music guessing challenge'
      },
      {
      category: 'literale',
      name: 'Literale',
      path: '/brainwave/literale',
      image: '/imgs/brainwave/literale.webp',
      tagline: 'Guess the book from its opening line in this literary puzzle',
      keywords: 'book opening game, literature trivia, book guessing puzzle'
      },    
      {
      category: 'creaturedle',
      name: 'Creaturedle',
      path: '/brainwave/creaturedle',
      image: '/imgs/brainwave/creaturedle.webp',
      tagline: 'Identify animals and mystery creatures from interesting clues',
      keywords: 'animal trivia game, mystery creatures quiz, creature guessing challenge'
      },
      {
      category: 'foodle',
      name: 'Foodle',
      path: '/brainwave/foodle',
      image: '/imgs/brainwave/foodle.webp',
      tagline: 'Guess the food from its 6 attributes in this tasty puzzle',
      keywords: 'food trivia game, dish guessing quiz, cuisine puzzle challenge'
      },
      {
      category: 'landmarkdle',
      name: 'Landmarkdle',
      path: '/brainwave/landmarkdle',
      image: '/imgs/brainwave/landmarkdle.webp',
      tagline: 'Identify famous landmarks from clues in this geography challenge',
      keywords: 'landmark trivia game, famous places quiz, landmark guessing challenge'
      },
      {
      category: 'inventionle',
      name: 'Inventionle',
      path: '/brainwave/inventionle',
      image: '/imgs/brainwave/inventionle.webp',
      tagline: 'Guess the invention from historical clues and fun facts',
      keywords: 'invention trivia game, invention guessing quiz, historical inventions challenge'
      },
      {
        category: 'automoble',
        name: 'Automoble',
        path: '/brainwave/automoble',
        image: '/imgs/brainwave/automoble.webp',
        tagline: 'Guess the car from its unique characteristics in this automotive puzzle',
        keywords: 'car trivia game, automotive quiz, car guessing puzzle'
      },
      {
        category: 'botanle',
        name: 'Botanle',
        path: '/brainwave/botanle',
        image: '/imgs/brainwave/botanle.webp',
        tagline: 'Guess the plant from its unique characteristics in this botanical puzzle',
        keywords: 'plant trivia game, botanical quiz, plant guessing puzzle'
      },
      {
        category: 'citadle',
        name: 'Citadle',
        path: '/brainwave/citadle',
        image: '/imgs/brainwave/citadle.webp',
        tagline: 'Guess the city from its unique characteristics in this urban geography puzzle',
        keywords: 'city trivia game, urban geography quiz, city guessing puzzle'
      },
      {
        category: 'countridle',
        name: 'Countridle',
        path: '/brainwave/countridle',
        image: '/imgs/brainwave/countridle.webp',
        tagline: 'Guess the country from its unique characteristics in this global geography puzzle',
        keywords: 'country trivia game, world geography quiz, country guessing puzzle'
      },
      {
      category: 'synonymle',
      name: 'Synonymle',
      path: '/brainwave/synonymle',
      image: '/imgs/brainwave/synonymle.webp',
      tagline: 'Guess the word based on semantic similarity and synonyms',
      keywords: 'synonymle, word puzzle, daily word, wordle vocabulary, synonym game, semantic game'
      },
      {
      category: 'trordle',
      name: 'Trordle',
      path: '/brainwave/trordle',
      image: '/imgs/brainwave/trordle.webp',
      tagline: 'Wordle-inspired trivia challenges for curious minds',
      keywords: 'trivia wordle, daily trivia game, quiz puzzle, general knowledge quiz, movie trivia, book trivia, geography quiz, history trivia, sports trivia'
      }
 ];
}

// Gaming-style puzzle card matching the trivias page design
function PuzzleCard({ puzzle, index }: { puzzle: Puzzle; index: number }) {
  return (
    <Link
      key={puzzle.category}
      href={puzzle.path}
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
          alt={puzzle.name}
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
        <h3 className="font-bold text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
          {puzzle.name}
        </h3>
        <p className="text-sm text-gray-300 line-clamp-2">
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

export default async function DailyQuizzesPage() {
  const dailyPuzzles = await getDailyPuzzles();
  const currentDate = new Date();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Structured Data for SEO */}
        <StructuredData puzzles={dailyPuzzles} currentDate={currentDate} />
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-2xl">
              <Star className="text-4xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Brainwave Games
            </h1>
          </div>
          
          <div className="max-w-3xl mx-auto">  
            <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-xl md:text-2xl mt-2">
                Creative Daily Puzzle Challenges
              </span>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Challenge your mind with our collection of creative trivia puzzles. 
              From word games to geography challenges, each game offers a unique twist on traditional trivia.
            </p>
            
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-8 py-4">
            <div className="bg-gray-800 rounded-xl p-2 border border-gray-700 text-center">
              <Boxes className="text-2xl text-cyan-400 mx-auto mb-2" />
              <div className="text-white font-bold text-xl">{dailyPuzzles.length}</div>
              <div className="text-gray-400 text-sm">Games</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
              <Clock className="text-2xl text-yellow-400 mx-auto mb-2" />
              <div className="text-white font-bold text-xl">Daily</div>
              <div className="text-gray-400 text-sm">Challenges</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
              <Users className="text-2xl text-green-400 mx-auto mb-2" />
              <div className="text-white font-bold text-xl">Free</div>
              <div className="text-gray-400 text-sm">To Play</div>
            </div>
          </div>

          {/* Last Updated Date */}
          <div className="text-center">
            <p className="text-sm text-gray-500 bg-gray-800/50 rounded-lg px-4 py-2 inline-block border border-gray-700">
              Last updated: {currentDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/*
        <div className="py-4">
          <Ads format="horizontal" slot="2207590813" isMobileFooter={false} className="lg:hidden" />
        </div>
        */}

        {/* Mobile: Vertical Scroll Layout (Single Column) */}
        <div className="lg:hidden mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">All Brainwave Games</h2>
          <div className="grid grid-cols-1 gap-6">
            {dailyPuzzles.map((puzzle, index) => (
              <PuzzleCard key={puzzle.category} puzzle={puzzle} index={index} />
            ))}
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:block mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                answer: "Brainwave games are creative daily puzzle challenges that combine trivia with unique gameplay mechanics. Each game focuses on a specific theme like geography, movies, music, or literature."
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
                    <span><strong>Trordle</strong>: Wordle-inspired trivia with multiple categories</span>
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
      </div>
    </div>
  );
}

// Structured Data Component for SEO (unchanged)
function StructuredData({ puzzles, currentDate }: { puzzles: Puzzle[], currentDate: Date }) {
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
        "@id": "https://triviaah.com/brainwave/#webpage",
        "url": "https://triviaah.com/brainwave",
        "name": "Brainwave Trivia Games - Creative Puzzle Challenges | Triviaah",
        "description": "Enjoy our collection of creative brainwave trivia games including word puzzles, movie guessing, music challenges and geography quizzes.",
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
        "@id": "https://triviaah.com/brainwave/#itemlist",
        "name": "Brainwave Daily Puzzle Games",
        "description": "Collection of creative daily puzzle challenges and trivia games",
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
            "genre": ["puzzle", "trivia", "educational"],
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
              "text": "Brainwave games are creative daily puzzle challenges that combine trivia with unique gameplay mechanics. Each game focuses on a specific theme like geography, movies, music, or literature, offering a fresh challenge every day to test your knowledge and problem-solving skills."
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
            "text": "Our brainwave section includes geography puzzles with Capitale, movie guessing with Plotle, music challenges with Songle, celebrity trivia with Celebrile, historical puzzles with Historidle, animal trivia with Creaturedle, food puzzles with Foodle, literature challenges with Literale, landmark identification with Landmarkdle, invention guessing with Inventionle, word similarity games with Synonymle, and Wordle-inspired trivia with Trordle."
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