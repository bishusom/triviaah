import MuteButton from '@/components/common/MuteButton';
import NumberTowerGame from "@/components/number-puzzles/NumberTowerGame";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Number Tower - Free Number Puzzle Game | Elite Trivias',
  description: 'Play Number Tower, a free online number puzzle game. Arrange numbers in a tower structure with limited moves. Improve your math skills with this fun and challenging brain game.',
  keywords: 'number tower, number puzzle game, free number game, online math games, brain games, number arrangement, educational games, free brain teasers, daily math challenges',
  alternates: {
    canonical: 'https://elitetrivias.com/number-puzzles/number-tower',
  },
  openGraph: {
    title: 'Number Tower - Free Number Puzzle Game | Elite Trivias',
  description: 'Play Number Tower, a free online number puzzle game. Arrange numbers in a tower structure with limited moves. Improve your math skills with this fun and challenging brain game.',
    url: 'https://elitetrivias.com/number-puzzles/number-tower',
    siteName: 'Elite Trivias',
    images: [
      {
        url: '/imgs/number-tower.webp',
        width: 1200,
        height: 630,
        alt: 'Number Sequence - Free Number Puzzle Game'
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Number Tower - Free Number Puzzle Game | Elite Trivias',
    description: 'Play Number Tower, a free online number puzzle game. Arrange numbers in a tower structure with limited moves. Improve your math skills with this fun and challenging brain game.',
    images: ['/imgs/number-tower.webp'],
  },
};

export default function NumberTowerGamePage() {
  return (
    <div className="container mx-auto px-4 py-8">
       <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
          <MuteButton />
        </div>
        <NumberTowerGame />
    </div>
  );
}