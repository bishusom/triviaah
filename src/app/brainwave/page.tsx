// app/brainwave/page.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import { MdInfo } from 'react-icons/md';
import DailyPuzzlesGrid from '@/components/daily/DailyPuzzlesGrid';
import Ads from '@/components/common/Ads';

interface Puzzle {
  category: string;
  name: string;
  path: string;
  image: string;
  tagline: string;
  keywords: string;
}

export const metadata: Metadata = {
  title: 'Brainwave Trivia Games - Creative Puzzle Challenges | Elite Trivias',
  description: 'Enjoy our collection of creative brainwave trivia games including word puzzles, movie guessing, music challenges and geography quizzes.', 
  keywords: 'brainwave games, trivia puzzles, word games, movie trivia, music trivia, geography quizzes', 
  alternates: {
    canonical: 'https://elitetrivias.com/brainwave',
  },
  openGraph: {
    title: 'Brainwave Trivia Games - Creative Puzzle Challenges | Elite Trivias',
    description: 'Challenge your mind with our creative brainwave trivia games including Capitale, Plotle, Songle and more!',
    url: 'https://elitetrivias.com/brainwave',
    siteName: 'Elite Trivias',
    images: [
      {
        url: '/imgs//brainwave/brainwave-trivia-og.webp',
        width: 1200,
        height: 630,
        alt: 'Brainwave Trivia Games - Play Now',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brainwave Trivia Games - Creative Puzzle Challenges | Elite Trivias',
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
      category: 'capitale',
      name: 'Capitale',
      path: '/brainwave/capitale',
      image: '/imgs/thumbnails/capitale-160x160.webp',
      tagline: 'Guess world capitals in this challenging geography puzzle',
      keywords: 'capital cities game, geography puzzle, world capitals quiz'
      },
      {
      category: 'plotle',
      name: 'Plotle',
      path: '/brainwave/plotle',
      image: '/imgs/thumbnails/plotle-160x160.webp',
      tagline: 'Guess the movie from its plot description in emojis',
      keywords: 'movie plot game, film trivia, movie guessing game'
      },
      {
      category: 'celebrile',
      name: 'Celebrile',
      path: '/brainwave/celebrile',
      image: '/imgs/thumbnails/celebrile-160x160.webp',
      tagline: 'Guess the celebrity from fun facts in this star-studded quiz',
      keywords: 'celebrity trivia game, famous people quiz, celebrity guessing game'    
      },
      {
      category: 'songle',
      name: 'Songle',
      path: '/brainwave/songle',
      image: '/imgs/thumbnails/songle-160x160.webp',
      tagline: 'Identify songs from lyrics snippets in this music challenge',
      keywords: 'music lyrics game, song trivia, music guessing challenge'
      },
      {
      category: 'historidle',
      name: 'Historidle',
      path: '/brainwave/historidle',
      image: '/imgs/thumbnails/historidle-160x160.webp',
      tagline: 'Guess the historical event from dates and other intriguing clues',
      keywords: 'history trivia game, historical events quiz, history guessing game'
      },
      {
      category: 'creaturedle',
      name: 'Creaturedle',
      path: '/brainwave/creaturedle',
      image: '/imgs/thumbnails/creaturedle-160x160.webp',
      tagline: 'Identify animals and mystery creatures from interesting clues',
      keywords: 'animal trivia game, mystery creatures quiz, creature guessing challenge'
      },
      {
      category: 'foodle',
      name: 'Foodle',
      path: '/brainwave/foodle',
      image: '/imgs/thumbnails/foodle-160x160.webp',
      tagline: 'Guess the food from its 6 attributes in this tasty puzzle',
      keywords: 'food trivia game, dish guessing quiz, cuisine puzzle challenge'
      },
      {
      category: 'literale',
      name: 'Literale',
      path: '/brainwave/literale',
      image: '/imgs/thumbnails/literale-160x160.webp',
      tagline: 'Guess the book from its opening line in this literary puzzle',
      keywords: 'book opening game, literature trivia, book guessing puzzle'
      },
      {
      category: 'landmarkdle',
      name: 'Landmarkdle',
      path: '/brainwave/landmarkdle',
      image: '/imgs/thumbnails/landmarkdle-160x160.webp',
      tagline: 'Identify famous landmarks from clues in this geography challenge',
      keywords: 'landmark trivia game, famous places quiz, landmark guessing challenge'
      },
      {
      category: 'inventionle',
      name: 'Inventionle',
      path: '/brainwave/inventionle',
      image: '/imgs/thumbnails/inventionle-160x160.webp',
      tagline: 'Guess the invention from historical clues and fun facts',
      keywords: 'invention trivia game, invention guessing quiz, historical inventions challenge'
      },
      {
      category: 'synonymle',
      name: 'Synonymle',
      path: '/brainwave/synonymle',
      image: '/imgs/thumbnails/synonymle-160x160.webp',
      tagline: 'Guess the word based on semantic similarity and synonyms',
      keywords: 'synonymle, word puzzle, daily word, wordle vocabulary, synonym game, semantic game'
      },
      {
      category: 'trordle',
      name: 'Trordle',
      path: '/brainwave/trordle',
      image: '/imgs/thumbnails/trordle-160x160.webp',
      tagline: 'Wordle-inspired trivia challenges for curious minds',
      keywords: 'trivia wordle, daily trivia game, quiz puzzle, general knowledge quiz, movie trivia, book trivia, geography quiz, history trivia, sports trivia'
      }
 ];
}

export default async function DailyQuizzesPage() {
  const dailyPuzzles = await getDailyPuzzles();
  const currentDate = new Date();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Structured Data for SEO */}
      <StructuredData puzzles={dailyPuzzles} currentDate={currentDate} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Brainwave Trivia Games <span className="text-blue-600">(Creative Challenges)</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Exercise your mind with our creative trivia puzzles including <strong>word games, movie plots, song lyrics, and geography challenges</strong>. 
          </p>
          
          {/* Last Updated Date */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Last updated: {currentDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Brainwave Grid - Client-side component */}
        <DailyPuzzlesGrid quizzes={dailyPuzzles} />

        {/* Ads Section */}
        <div className="max-w-3xl mx-auto p-6">
          <Ads format="horizontal" style={{ width: '100%', height: '90px' }} />
        </div>
        
        {/* How It Works Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <MdInfo className="mr-2 text-blue-600" />
            How Brainwave Games Work
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold text-gray-800 mb-2">Creative Challenges</h3>
              <p className="text-gray-600">
                Each game offers a unique twist on traditional trivia with puzzle elements.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold text-gray-800 mb-2">No Daily Limits</h3>
              <p className="text-gray-600">
                Play brainwave games as much as you want - they&apos;re always available!
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold text-gray-800 mb-2">Progressive Difficulty</h3>
              <p className="text-gray-600">
                Challenges get progressively harder as you advance through levels.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold text-gray-800 mb-2">Share Your Achievements</h3>
              <p className="text-gray-600">
                Brag about your puzzle-solving skills with friends and family.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-lg mb-2">What are Brainwave games?</h3>
              <p className="text-gray-700">
                Brainwave games are creative daily puzzle challenges that combine trivia with unique gameplay mechanics. 
                Each game focuses on a specific theme like geography, movies, music, or literature, offering a fresh 
                challenge every day to test your knowledge and problem-solving skills.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-lg mb-2">Are these games free to play?</h3>
              <p className="text-gray-700">
                Yes! All Brainwave games are completely free to play. No registration, no subscriptions, 
                and no hidden fees. You can enjoy all our daily puzzle challenges without any cost.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-lg mb-2">How often are new puzzles available?</h3>
              <p className="text-gray-700">
                Each Brainwave game features a new challenge every day. The puzzles reset at midnight local time, 
                giving you fresh content to enjoy daily. You can play previous days&apos; puzzles if you miss them.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-lg mb-2">Can I play on mobile devices?</h3>
              <p className="text-gray-700">
                Absolutely! All Brainwave games are fully responsive and work perfectly on smartphones, tablets, 
                and desktop computers. The interface adapts to your screen size for the best playing experience.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-lg mb-2">What if I can&apos;t solve a puzzle?</h3>
              <p className="text-gray-700">
                Don&apos;t worry! Each game provides hints and progressive clues to help you solve challenging puzzles. 
                You can also share the puzzle with friends to collaborate, or check back the next day for the solution.
              </p>
            </div>
            
            <div className="pb-2">
              <h3 className="font-semibold text-lg mb-2">Can I share my results?</h3>
              <p className="text-gray-700">
                Yes! After completing each Brainwave game, you&apos;ll have the option to share your results on social media 
                and challenge your friends to beat your score. It&apos;s a great way to compete and learn together.
              </p>
            </div>
          </div>
        </div>

        {/* SEO-Friendly Content */}
        <section className="prose max-w-none mb-12">
          <h2 className="text-2xl font-bold text-gray-800">Brainwave Trivia Challenges</h2>
          <p>
            Our <strong>brainwave trivia games</strong> offer creative twists on traditional trivia with puzzle elements that challenge different cognitive skills. 
            Each game focuses on a specific type of knowledge and problem-solving:
          </p>
          <ul>
            <li><strong>Capitale</strong>: Geography puzzle where you guess world capitals</li>
            <li><strong>Plotle</strong>: Movie trivia game where you identify films from plot descriptions</li>
            <li><strong>Songle</strong>: Music challenge where you guess songs from lyrics snippets</li>
            <li><strong>Trordle</strong>: Wordle-inspired trivia with multiple categories</li>
          </ul>
          
          <h3>Why Players Love Our Brainwave Games:</h3>
          <ul>
            <li>Perfect for <strong>developing problem-solving skills</strong></li>
            <li>Great for <strong>music, movie and geography enthusiasts</strong></li>
            <li>Learn <strong>through engaging gameplay</strong> rather than memorization</li>
          </ul>
        </section>
      </main>
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
        "@id": "https://elitetrivias.com/#organization",
        "name": "Elite Trivias",
        "url": "https://elitetrivias.com/",
        "description": "Elite Trivias offers engaging and educational trivia games and puzzles for everyone.",
        "logo": {
          "@type": "ImageObject",
          "url": "https://elitetrivias.com/logo.png",
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
        "@id": "https://elitetrivias.com/brainwave/#webpage",
        "url": "https://elitetrivias.com/brainwave",
        "name": "Brainwave Trivia Games - Creative Puzzle Challenges | Elite Trivias",
        "description": "Enjoy our collection of creative brainwave trivia games including word puzzles, movie guessing, music challenges and geography quizzes.",
        "isPartOf": {
          "@id": "https://elitetrivias.com/#website"
        },
        "about": {
          "@id": "https://elitetrivias.com/brainwave/#itemlist"
        },
        "datePublished": "2024-01-01T00:00:00+00:00",
        "dateModified": currentDate.toISOString(),
        "breadcrumb": {
          "@id": "https://elitetrivias.com/brainwave/#breadcrumb"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://elitetrivias.com/imgs/thumbnails/brainwave-trivia-og.webp",
          "width": 1200,
          "height": 630
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://elitetrivias.com/#website",
        "url": "https://elitetrivias.com/",
        "name": "Elite Trivias",
        "description": "Engaging trivia games and puzzles for everyone",
        "publisher": {
          "@id": "https://elitetrivias.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://elitetrivias.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://elitetrivias.com/brainwave/#itemlist",
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
            "url": `https://elitetrivias.com${puzzle.path}`,
            "gameType": "PuzzleGame",
            "genre": ["puzzle", "trivia", "educational"],
            "applicationCategory": "Game",
            "numberOfPlayers": {
              "@type": "QuantitativeValue",
              "minValue": 1
            },
            "publisher": {
              "@id": "https://elitetrivias.com/#organization"
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
        "@id": "https://elitetrivias.com/brainwave/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://elitetrivias.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Brainwave Games",
            "item": "https://elitetrivias.com/brainwave"
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