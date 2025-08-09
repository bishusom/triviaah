import MuteButton from '@/components/MuteButton';
import BoggleGame from '@/components/word-games/boggle/BoggleGame';


export default function BogglePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
        <MuteButton />
      </div>
      <BoggleGame />
    </div>
  );
}