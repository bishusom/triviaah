'use client';
import Link from 'next/link';
import Image from 'next/image';

const numberPuzzles = [
  {
    slug: 'number-scramble',
    name: 'Number Scramble',
    image: '/imgs/number-scramble.webp',
    description: 'Combine numbers and operators to reach the target value',
    keywords: 'math scramble, number challenge, arithmetic game',
  },
  {
    slug: 'number-tower',
    name: 'Number Tower',
    image: '/imgs/number-tower.webp',
    description: 'Build towers by adding numbers to reach specific sums',
    keywords: 'addition game, math towers, number stacking',
  },
  {
    slug: 'prime-hunter',
    name: 'Prime Hunter',
    image: '/imgs/prime-hunter.webp',
    description: 'Identify all prime numbers in the given grid',
    keywords: 'prime numbers game, math challenge, number theory',
  },
  {
    slug: 'number-sequence',
    name: 'Number Sequence',
    image: '/imgs/number-sequence.webp',
    description: 'Find the pattern and complete the number sequence',
    keywords: 'number patterns, sequence puzzle, math logic',
  },
  {
    slug: 'sudoku',
    name: 'Sudoku',
    image: '/imgs/sudoku.webp',
    description: 'Classic 9x9 grid puzzle with numbers 1-9',
    keywords: 'sudoku puzzle, number grid, logic game',
  },
];

export default function NumberPuzzlesClientPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Number Puzzles Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Challenge your math skills with our exciting number puzzles
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {numberPuzzles.map((puzzle) => (
            <div 
              key={puzzle.slug}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
            >
              <Link href={`/number-puzzles/${puzzle.slug}`}>
                <div className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mb-4 flex items-center justify-center overflow-hidden">
                    <Image 
                      src={puzzle.image}
                      alt={puzzle.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{puzzle.name}</h2>
                  <p className="text-gray-600 mb-4 flex-grow">{puzzle.description}</p>
                  <div className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                    Play Now
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Our Number Puzzles</h2>
          <div className="prose prose-lg text-gray-600">
            <p>
              Our number puzzles collection helps improve mathematical reasoning, 
              problem-solving skills, and mental calculation. Each puzzle offers 
              unique challenges suitable for all ages and skill levels. Perfect 
              for students, math enthusiasts, and anyone looking to sharpen their 
              numerical skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}