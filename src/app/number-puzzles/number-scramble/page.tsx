import { Metadata } from 'next';
import MuteButton from '@/components/common/MuteButton';
import ScramblePuzzle from '@/components/number-puzzles/ScramblePuzzle';

export const metadata: Metadata = {
  title: 'Number Sequence - Free Number Puzzle Game | Elite Trivias',
  description: 'Play Number Sequence, a free online number puzzle game. Identify the next numbers in a sequence with limited attempts. Improve your math skills with this fun and challenging brain game.',
  keywords: 'number sequence, number puzzle game, free number game, online math games, brain games, number pattern identification, educational games, free brain teasers, daily math challenges',
  alternates: {
    canonical: 'https://elitetrivias.com/number-puzzles/number-scramble',
  },
  openGraph: {
    title: 'Number Sequence - Free Number Puzzle Game | Elite Trivias',
    description: 'Play Number Sequence, a free online number puzzle game. Identify the next numbers in a sequence with limited attempts. Improve your math skills with this fun and challenging brain game.',
    url: 'https://elitetrivias.com/number-puzzles/number-scramble',
    siteName: 'Elite Trivias',
    images: [
      {
        url: '/imgs/number-scramble.webp',
        width: 1200,
        height: 630,
        alt: 'Number Sequence - Free Number Puzzle Game'
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Number Sequence - Free Number Puzzle Game | Elite Trivias',
    description: 'Play Number Sequence, a free online number puzzle game. Identify the next numbers in a sequence with limited attempts. Improve your math skills with this fun and challenging brain game.',
    images: ['/imgs/number-scramble.webp'],
  },
};


export default function NumberScramblePage() {
  return (
    <div className="container mx-auto px-4 py-8">
       <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
          <MuteButton />
        </div>
      <ScramblePuzzle />
    </div>
  );
}