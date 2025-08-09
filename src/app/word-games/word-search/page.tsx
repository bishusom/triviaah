import MuteButton from '@/components/MuteButton';
import WordSearchGame from '@/components/word-games/word-search/WordSearchGame';

export default function WordSearchPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
          <MuteButton />
        </div>
        <WordSearchGame />
        
        <div className="mt-12 bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Play Word Search</h2>
          <div className="space-y-4 text-gray-700">
            <h3 className="text-lg font-semibold">Game Rules:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Find all the hidden words in the grid</li>
              <li>Words can be horizontal, vertical, or diagonal</li>
              <li>Words may be forwards or backwards</li>
              <li>Click and drag or tap letters to select words</li>
              <li>Words must be at least {3} letters long</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">Difficulty Levels:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Easy:</strong> 10x10 grid, 10 words (3-5 letters)</li>
              <li><strong>Medium:</strong> 15x15 grid, 15 words (4-7 letters)</li>
              <li><strong>Hard:</strong> 20x20 grid, 20 words (5-8 letters)</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">Progression:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Complete 3 consecutive games to advance to the next difficulty</li>
              <li>Each level increases your score multiplier</li>
            </ul>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">Pro Tips:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Look for unique letters in words (Q, X, Z) to help spot them</li>
                <li>Scan rows, then columns, then diagonals systematically</li>
                <li>Watch for common endings like -ING or -TION</li>
                <li>Use the Hint button if you get stuck</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}