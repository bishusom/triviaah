'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

const wordGames = [
  {
    slug: 'scramble',
    name: 'Scramble',
    image: '/imgs/word-scramble.webp',
    description: 'Unscramble letters to form valid words against the clock',
    keywords: 'word scramble, anagram game, letter scramble',
  },
  {
    slug: 'spelling-bee',
    name: 'Spelling Bee',
    image: '/imgs/spelling-bee.webp',
    description: 'Spell words correctly using given letters with a center requirement',
    keywords: 'spelling game, bee game, vocabulary challenge',
  },
  {
    slug: 'boggle',
    name: 'Boggle',
    image: '/imgs/boggle.webp',
    description: 'Find as many words as possible in a 4x4 letter grid',
    keywords: 'boggle online, word grid game, find words',
  },
  {
    slug: 'word-search',
    name: 'Word Search',
    image: '/imgs/word-search.webp',
    description: 'Find hidden words in a letter matrix horizontally, vertically or diagonally',
    keywords: 'word search puzzle, find words game, letter grid',
  },
  {
    slug: 'word-ladder',
    name: 'Word Ladder',
    image: '/imgs/word-ladder.webp',
    description: 'Change one letter at a time to transform start word into end word',
    keywords: 'word transformation, Lewis Carroll game, vocabulary puzzle',
  },
];

export const metadata: Metadata = {
  title: 'Word Games Collection | Elite Trivias',
  description: 'Challenge your vocabulary and language skills with our collection of word games including Boggle, Scramble, Spelling Bee, Word Search and Word Ladder',
  keywords: 'word games, vocabulary games, boggle, scramble, spelling bee, word search, word ladder',
  
  alternates: {
    canonical: 'https://elitetrivias.com/word-games',
  },
  openGraph: {
    title: 'Number Puzzles Collection | Elite Trivias',
    description: 'Play fun number puzzles to improve your math and problem-solving skills',
    images: [
      {
        url: '/imgs/word-games.webp',
        width: 1200,
        height: 630,
        alt: 'Elite Trivias Word Games',
      },
    ],
  },
};

export default function WordGamesClientPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Word Games Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Challenge your vocabulary with our exciting word games
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {wordGames.map((game) => (
            <div 
              key={game.slug}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
            >
              <Link href={`/word-games/${game.slug}`}>
                <div className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mb-4 flex items-center justify-center overflow-hidden">
                    <Image 
                      src={game.image}
                      alt={game.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{game.name}</h2>
                  <p className="text-gray-600 mb-4 flex-grow">{game.description}</p>
                  <div className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                    Play Now
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Our Word Games</h2>
          <div className="prose prose-lg text-gray-600">
            <p>
              Our word games collection helps improve vocabulary, spelling, and cognitive skills. 
              Each game offers unique challenges suitable for all ages and skill levels. 
              Perfect for students, word enthusiasts, and anyone looking to sharpen their language skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}