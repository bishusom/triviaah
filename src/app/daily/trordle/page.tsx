import TrordleComponent from '@/components/trordle/TrordleComponent';
import { getDailyTrordle } from '@/lib/trordle-fb';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trordle - Daily Trivia Puzzle | Triviaah',
  description: 'Guess the answer to today\'s trivia puzzle with limited attempts, similar to Wordle but with trivia questions.',
  openGraph: {
    title: 'Trordle - Daily Trivia Puzzle | Triviaah',
    description: 'Guess the answer to today\'s trivia puzzle with limited attempts, similar to Wordle but with trivia questions.',
    type: 'website',
  },
};

export default async function TrordlePage() {
  // Get today's trordle puzzle
  const trordleData = await getDailyTrordle();
  
  if (!trordleData) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Daily Trordle</h1>
        <p className="text-gray-600">No puzzle available for today. Please check back tomorrow!</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-2">Trordle</h1>
      <p className="text-gray-600 text-center mb-6">The trivia version of Wordle. Guess the answer in 6 tries!</p>
      
      <TrordleComponent initialData={trordleData} />
    </div>
  );
}