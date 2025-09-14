// app/brainwave/page.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import { MdInfo } from 'react-icons/md';
import DailyPuzzlesGrid from '@/components/daily/DailyPuzzlesGrid';
import Timer from '@/components/daily/dailyQuizTimer';

export const metadata: Metadata = {
  title: 'Brainwave Trivia Games - Creative Puzzle Challenges | Triviaah',
  description: 'Enjoy our collection of creative brainwave trivia games including word puzzles, movie guessing, music challenges and geography quizzes.', 
  keywords: 'brainwave games, trivia puzzles, word games, movie trivia, music trivia, geography quizzes', 
  openGraph: {
    title: 'Brainwave Trivia Games - Creative Puzzle Challenges | Triviaah',
    description: 'Challenge your mind with our creative brainwave trivia games including Capitale, Plotle, Songle and more!',
    url: 'https://triviaah.com/brainwave',
    images: [
      {
        url: '/imgs/brainwave-trivia-og.webp',
        alt: 'Brainwave Trivia Games - Play Now',
      },
    ],
  },
};

async function getDailyPuzzles() {
  return [  
    {
        category: 'capitale',
        name: 'Capitale',
        path: '/brainwave/capitale',
        image: '/imgs/capitale-160x160.webp',
        tagline: 'Guess world capitals in this challenging geography puzzle',
        keywords: 'capital cities game, geography puzzle, world capitals quiz'
    },
    {
        category: 'plotle',
        name: 'Plotle',
        path: '/brainwave/plotle',
        image: '/imgs/plotle-160x160.webp',
        tagline: 'Guess the movie from its plot description',
        keywords: 'movie plot game, film trivia, movie guessing game'
    },
    {
        category: 'songle',
        name: 'Songle',
        path: '/brainwave/songle',
        image: '/imgs/songle-160x160.webp',
        tagline: 'Identify songs from lyrics snippets in this music challenge',
        keywords: 'music lyrics game, song trivia, music guessing challenge'
    },
        {
        category: 'trordle',
        name: 'Trordle',
        path: '/brainwave/trordle',
        image: '/imgs/trordle-160x160.webp',
        tagline: 'Wordle-inspired trivia challenges for curious minds',
        keywords: 'trivia wordle, daily trivia game, quiz puzzle, general knowledge quiz, movie trivia, book trivia, geography quiz, history trivia, sports trivia'
    },
 ];
}

export default async function DailyQuizzesPage() {
  const dailyQuizzes = await getDailyPuzzles();
  return (
    <div className="min-h-screen bg-gray-50">
      <Script
        id="qa-schema-brainwave"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "QAPage",
            "mainEntity": {
              "@type": "Question",
              "name": "Brainwave Trivia Games",
              "text": "What types of brainwave trivia games are available?",
              "answerCount": 4,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our brainwave section includes geography puzzles with Capitale, movie guessing with Plotle, music challenges with Songle, and Wordle-inspired trivia with Trordle."
              }
            }
          })
        }}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Brainwave Trivia Games <span className="text-blue-600">(Creative Challenges)</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Exercise your mind with our creative trivia puzzles including <strong>word games, movie plots, song lyrics, and geography challenges</strong>. 
          </p>
        </div>

        {/* Brainwave Grid - Client-side component */}
        <DailyPuzzlesGrid quizzes={dailyQuizzes} />

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