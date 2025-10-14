import { Metadata } from 'next';
import MuteButton from '@/components/common/MuteButton';
import ScrambleGame from '@/components/word-games/ScrambleGame';

export const metadata: Metadata = {
  title: 'Word Scramble Game | Triviaah',
  description: 'Unscramble letters to form words in this challenging vocabulary game. Test your word skills with our Scramble game!',
  keywords: 'word scramble, anagram game, vocabulary game, word puzzle, letter scramble',
  openGraph: {
    title: 'Word Scramble Game | Triviaah',
    description: 'Challenge your vocabulary with our exciting word scramble game',
    images: [
      {
        url: '/word-scramble-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Triviaah Word Scramble Game',
      },
    ],
  },
};

export default function ScramblePage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
          <MuteButton />
        </div>
        <ScrambleGame />
        
        <div className="mt-12 bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">How to Play Scramble</h2>
          <div className="prose prose-gray">
            <ul className="space-y-2">
              <li>Letters from a word are scrambled randomly</li>
              <li>Click on letters to select them in order</li>
              <li>Submit your attempt to check if it matches the original word</li>
              <li>Use the Shuffle button to rearrange letters</li>
              <li>Get hints if you&apos;re stuck</li>
              <li>Earn more points for longer words</li>
            </ul>
            <p className="mt-4">
              <strong>Tip:</strong> Look for common prefixes and suffixes to help unscramble the word faster!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}