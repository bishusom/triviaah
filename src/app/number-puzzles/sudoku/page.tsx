import MuteButton from '@/components/common/MuteButton';
import SudokuPuzzle from '@/components/number-puzzles/SudokuPuzzle';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Sudoku Puzzles Online - Play Daily Sudoku Games | Triviaah',
  description: 'Play free Sudoku puzzles online with daily challenges. Enjoy classic 9x9 Sudoku games with multiple difficulty levels. One of the best free Sudoku websites with no registration required.',
  keywords: 'sudoku, free sudoku puzzles, online sudoku, daily sudoku, sudoku game, number puzzle, logic game, brain game, free puzzle games',
};

export default function SudokuPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
        <MuteButton />
      </div>      
      
      {/* Enhanced header with SEO content */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Free Online Sudoku Puzzles</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Play daily Sudoku challenges on one of the best free Sudoku websites. 
          Enjoy classic 9x9 grid puzzles with multiple difficulty levels - perfect for beginners and experts alike.
        </p>
      </div>
      
      <SudokuPuzzle />
      
      {/* SEO Content Section */}
      <section className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Why Play Sudoku on Triviaah?</h2>
        <div className="prose text-gray-600">
          <p className="mb-4">
            Sudoku is one of the world&apos;s most popular puzzle games, with over 1.5 million people 
            searching for it every month. Our free Sudoku puzzles offer the perfect brain exercise 
            that improves logical thinking, concentration, and problem-solving skills.
          </p>
          <p className="mb-4">
            As one of the top free Sudoku websites, we provide:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>Daily updated Sudoku puzzles with varying difficulty levels</li>
            <li>Completely free online Sudoku with no registration required</li>
            <li>Classic 9x9 grid format that Sudoku enthusiasts love</li>
            <li>Mobile-friendly interface for playing on any device</li>
            <li>Timer functionality to track your solving speed</li>
          </ul>
          <p>
            Whether you&apos;re a Sudoku beginner looking to learn or an expert seeking challenging puzzles, 
            our collection of free Sudoku games has something for everyone. Bookmark this page for your 
            daily Sudoku fix and join millions of players who enjoy this timeless logic game.
          </p>
        </div>
      </section>
    </div>
  );
}