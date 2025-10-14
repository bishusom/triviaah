import { Metadata } from 'next';
import MuteButton from '@/components/common/MuteButton';
import ScramblePuzzle from '@/components/number-puzzles/ScramblePuzzle';



export const metadata: Metadata = {
  title: 'Number Scramble | Triviaah',
  description: 'Combine numbers and operators to reach the target value in this challenging math puzzle game',
  keywords: 'number scramble, math puzzle, arithmetic game, number challenge',
  openGraph: {
    title: 'Number Scramble | Triviaah',
    description: 'Challenge your math skills with this number scramble puzzle game',
    images: [
      {
        url: '/number-scramble-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Triviaah Number Scramble',
      },
    ],
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