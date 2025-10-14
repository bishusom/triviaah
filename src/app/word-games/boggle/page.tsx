import MuteButton from '@/components/common/MuteButton';
import BoggleGame from '@/components/word-games/BoggleGame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Boggle Game Online | Word Search Challenge | Triviaah',
  description: 'Play free Boggle game online. Find words in a 4x4 or 5x5 letter grid with our daily puzzle challenge. Boost your vocabulary, word-finding skills, and uncover all possible words.',
  keywords: 'boggle, word search game, vocabulary game, word game, boggle challenge, daily puzzle, word finder, educational games, free boggle, online word games',
};


export default function BogglePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="no-ads-page">
        <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
          <MuteButton />
        </div>
        <BoggleGame />
      </div>  
    </div>
  );
}