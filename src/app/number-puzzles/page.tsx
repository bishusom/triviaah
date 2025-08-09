import NumberPuzzlesClientPage from './NumberPuzzlesClientPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Number Puzzles Collection | Triviaah',
  description: 'Challenge your math skills with our collection of number puzzles including Number Scramble, Number Tower, Prime Hunter, Number Sequence, and Sudoku',
  keywords: 'number puzzles, math games, number scramble, number tower, prime hunter, number sequence, sudoku',
  openGraph: {
    title: 'Number Puzzles Collection | Triviaah',
    description: 'Play fun number puzzles to improve your math and problem-solving skills',
    images: [
      {
        url: '/number-puzzles-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Triviaah Number Puzzles',
      },
    ],
  },
};

export default function NumberPuzzlesPage() {
  return <NumberPuzzlesClientPage />;
}