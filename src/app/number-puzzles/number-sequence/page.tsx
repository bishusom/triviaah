import MuteButton from '@/components/MuteButton';
import NumberSequenceGame from "@/components/number-puzzles/number-sequence/NumberSequenceGame";


export default function NumberSequencePage() {
  return (
    <div className="container mx-auto px-4 py-8">
       <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
          <MuteButton />
        </div>
      <h1 className="text-3xl font-bold text-center mb-6">Number Sequence</h1>
      <NumberSequenceGame />
    </div>
  );
}