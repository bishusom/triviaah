'use client';
import MuteButton from '@/components/MuteButton';
import WordLadderGame from '@/components/word-games/word-ladder/WordLadderGame';

export default function WordLadderPage() {
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
        <MuteButton />
      </div>
      <h1 className="text-3xl font-bold text-center mb-6">Word Ladder Game</h1>
      <WordLadderGame />
    </div>
  );
}