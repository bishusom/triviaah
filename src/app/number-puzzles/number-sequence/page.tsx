import MuteButton from '@/components/common/MuteButton';
import NumberSequenceGame from "@/components/number-puzzles/NumberSequenceGame";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Number Sequence - Free Number Puzzle Game | Elite Trivias',
  description: 'Play Number Sequence, a free online number puzzle game. Identify the next numbers in a sequence with limited attempts. Improve your math skills with this fun and challenging brain game.',
  keywords: 'number sequence, number puzzle game, free number game, online math games, brain games, number pattern identification, educational games, free brain teasers, daily math challenges',
  alternates: {
    canonical: 'https://elitetrivias.com/number-puzzles/number-sequence',
  },
  openGraph: {
    title: 'Number Sequence - Free Number Puzzle Game | Elite Trivias',
    description: 'Play Number Sequence, a free online number puzzle game. Identify the next numbers in a sequence with limited attempts. Improve your math skills with this fun and challenging brain game.',
    url: 'https://elitetrivias.com/number-puzzles/number-sequence',
    siteName: 'Elite Trivias',
    images: [
      {
        url: '/imgs/number-sequence.webp',
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
    images: ['/imgs/number-sequence.webp'],
  },
};

export default function NumberSequencePage() {
  return (
    <div className="container mx-auto px-4 py-8">
       <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
          <MuteButton />
        </div>
      <NumberSequenceGame />
    </div>
  );
}