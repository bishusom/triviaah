import MuteButton from '@/components/common/MuteButton';
import PrimeHunterPuzzle from '@/components/number-puzzles/PrimeHunterPuzzle';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prime Hunter - Free Prime Number Puzzle Game | Triviaah',
  description: 'Play Prime Hunter, a free online prime number puzzle game. Identify prime numbers in a grid with limited attempts. Improve your math skills with this fun and challenging brain game.',
  keywords: 'prime hunter, prime number puzzle, free prime game, online math games, brain games, number puzzles, prime number identification, educational games, free brain teasers, daily math challenges',
  alternates: {
    canonical: 'https://triviaah.com/number-puzzles/prime-hunter',
  },
  openGraph: {
    title: 'Prime Hunter - Free Prime Number Puzzle Game | Triviaah',
    description: 'Play Prime Hunter, a free online prime number puzzle game. Identify prime numbers in a grid with limited attempts. Improve your math skills with this fun and challenging brain game.',
    url: 'https://triviaah.com/number-puzzles/prime-hunter',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/prime-hunter.webp',
        width: 1200,
        height: 630,
        alt: 'Prime Hunter - Free Prime Number Puzzle Game'
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prime Hunter - Free Prime Number Puzzle Game | Triviaah',
    description: 'Play Prime Hunter, a free online prime number puzzle game. Identify prime numbers in a grid with limited attempts. Improve your math skills with this fun and challenging brain game.',
    images: ['/imgs/prime-hunter.webp'],
  },
};

export default function PrimeHunterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
        <MuteButton />
      </div>
      <PrimeHunterPuzzle />
    </div>
  );
}