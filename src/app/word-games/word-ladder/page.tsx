import MuteButton from '@/components/MuteButton';
import WordLadderGame from '@/components/word-games/word-ladder/WordLadderGame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Word Ladder Puzzles Online | Vocabulary Brain Game | Triviaah',
  description: 'Play free word ladder puzzles online. Transform one word into another by changing one letter at a time. Fun vocabulary game that improves spelling and logic skills.',
  keywords: 'word ladder, word ladder puzzles, vocabulary games, word games, spelling games, free word puzzles, online word games, brain games, word transformation game',
};

export default function WordLadderPage() {
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
        <MuteButton />
      </div>
      
      {/* SEO Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Free Word Ladder Puzzles Online</h1>
        <p className="text-lg text-gray-600">
          Transform words step by step in this classic vocabulary puzzle game. 
          Perfect for word game enthusiasts and anyone looking to improve their spelling skills.
        </p>
      </div>
      
      <WordLadderGame />
      
      {/* SEO Content Section */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">About Word Ladder Puzzles</h2>
        <div className="prose text-gray-700">
          <p className="mb-4">
            Word Ladder is a classic word game where you transform one word into another by 
            changing a single letter at a time, with each intermediate step forming a valid word. 
            It&apos;s one of the most engaging <strong>free word puzzles</strong> available online, 
            perfect for <strong>vocabulary building</strong> and <strong>cognitive exercise</strong>.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Benefits of Playing Word Ladder:</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Improves vocabulary and spelling skills</li>
            <li>Enhances problem-solving and logical thinking</li>
            <li>Great brain exercise for all ages</li>
            <li>Helps with pattern recognition</li>
            <li>Fun way to learn new words</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Why Choose Our Word Ladder Game?</h3>
          <p className="mb-4">
            Our <strong>free online word ladder</strong> puzzles are carefully designed to provide 
            the perfect balance of challenge and enjoyment. As one of the top <strong>free word games</strong> 
            available, we offer:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Multiple difficulty levels from beginner to expert</li>
            <li>Daily new puzzles to keep the challenge fresh</li>
            <li>Hint system to help when you&apos;re stuck</li>
            <li>Timer to track your solving speed</li>
            <li>Completely free with no registration required</li>
          </ul>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-2">Word Game Tips:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Start by looking for common word patterns and endings</li>
              <li>Try changing vowels first as they often create new words</li>
              <li>Work from both the start and end words simultaneously</li>
              <li>Use the hint system when you need a nudge in the right direction</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}