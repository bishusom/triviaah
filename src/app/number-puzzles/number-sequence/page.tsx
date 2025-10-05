import MuteButton from '@/components/MuteButton';
import NumberSequenceGame from "@/components/number-puzzles/NumberSequenceGame";


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