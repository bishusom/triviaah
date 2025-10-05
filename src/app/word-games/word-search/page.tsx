import MuteButton from '@/components/MuteButton';
import WordSearchGame from '@/components/word-games/WordSearchGame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Word Search Puzzles Online | Printable Word Find Games | Triviaah',
  description: 'Play free word search puzzles online. Find hidden words in our themed word find games. Perfect for vocabulary practice, relaxation, and educational fun for all ages.',
  keywords: 'word search, word find puzzles, free word search, online word games, vocabulary games, word puzzles, printable word search, brain games, educational games',
};

export default function WordSearchPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="no-ads-page">
        <div className="container mx-auto px-4">
          <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
            <MuteButton />
          </div>
          
          {/* SEO Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Free Word Search Puzzles Online</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover hidden words in our themed word find games. Perfect for vocabulary practice, 
              relaxation, and educational fun for all ages.
            </p>
          </div>
          
          <WordSearchGame />
          
          <div className="mt-12 bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Play Word Search</h2>
            <div className="space-y-4 text-gray-700">
              <h3 className="text-lg font-semibold">Game Rules:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Find all the hidden words in the grid</li>
                <li>Words can be horizontal, vertical, or diagonal</li>
                <li>Words may be forwards or backwards</li>
                <li>Click and drag or tap letters to select words</li>
                <li>Words must be at least {3} letters long</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">Difficulty Levels:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Easy:</strong> 10x10 grid, 10 words (3-5 letters)</li>
                <li><strong>Medium:</strong> 15x15 grid, 15 words (4-7 letters)</li>
                <li><strong>Hard:</strong> 20x20 grid, 20 words (5-8 letters)</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">Progression:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Complete 3 consecutive games to advance to the next difficulty</li>
                <li>Each level increases your score multiplier</li>
              </ul>
            </div>
            
            {/* SEO Content Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Play Word Search?</h3>
              <div className="prose text-gray-700">
                <p className="mb-4">
                  Word Search is one of the most popular <strong>free word puzzles</strong> enjoyed by 
                  millions worldwide. Our <strong>online word search</strong> games offer numerous benefits:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Improves vocabulary and spelling</li>
                  <li>Enhances pattern recognition skills</li>
                  <li>Provides relaxing, meditative gameplay</li>
                  <li>Great educational tool for all ages</li>
                  <li>Available as <strong>printable word search</strong> options for offline play</li>
                </ul>
                <p>
                  Whether you&apos;re looking for a quick brain teaser or a longer relaxing session, 
                  our <strong>free word search</strong> puzzles provide the perfect combination of 
                  challenge and enjoyment. With themed puzzles updated regularly, you&apos;ll always 
                  find fresh content to explore.
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">Pro Tips:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Look for unique letters in words (Q, X, Z) to help spot them</li>
                <li>Scan rows, then columns, then diagonals systematically</li>
                <li>Watch for common endings like -ING or -TION</li>
                <li>Use the Hint button if you get stuck</li>
                <li>Try our <strong>printable word search</strong> versions for offline fun</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}