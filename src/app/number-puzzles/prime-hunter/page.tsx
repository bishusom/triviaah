import MuteButton from '@/components/common/MuteButton';
import PrimeHunterPuzzle from '@/components/number-puzzles/PrimeHunterPuzzle';

export default function PrimeHunterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
        <MuteButton />
      </div>
      <PrimeHunterPuzzle />
    </div>
  );
}