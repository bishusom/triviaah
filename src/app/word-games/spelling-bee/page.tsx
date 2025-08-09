import MuteButton from '@/components/MuteButton';
import SpellingBeeGame from '@/components/word-games/spelling-bee/SpellingBeeGame';

export default function SpellingBeePage() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
       <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
        <MuteButton />
      </div>
      <div className="container mx-auto px-4">
        <SpellingBeeGame />
        
        <div className="mt-12 bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Play Spelling Bee</h2>
          <div className="space-y-4 text-gray-700">
            <h3 className="text-lg font-semibold">Game Rules:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Create words using the letters in the honeycomb</li>
              <li>Every word must contain the <strong>center letter</strong></li>
              <li>Words must be at least <strong>4 letters</strong> long</li>
              <li>Letters can be used more than once in a word</li>
              <li>Proper nouns and hyphenated words are not allowed</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">Scoring:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>4-letter words: <strong>1 point</strong></li>
              <li>Each additional letter: <strong>+1 point</strong> per letter</li>
              <li>Pangrams (words using all 7 letters): <strong>+7 bonus points</strong></li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">Ranking System:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Beginner:</strong> 0-4 points</li>
              <li><strong>Good Start:</strong> 5-9 points</li>
              <li><strong>Moving Up:</strong> 10-19 points</li>
              <li><strong>Good:</strong> 20-29 points</li>
              <li><strong>Solid:</strong> 30-49 points</li>
              <li><strong>Nice:</strong> 50-69 points</li>
              <li><strong>Great:</strong> 70-99 points</li>
              <li><strong>Amazing:</strong> 100-199 points</li>
              <li><strong>Genius:</strong> 200+ points</li>
            </ul>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">Pro Tips:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Look for common prefixes (re-, un-, pre-) and suffixes (-ing, -tion, -ment)</li>
                <li>Start with the center letter and build outward</li>
                <li>Plurals often work (add -s or -es to found words)</li>
                <li>Try changing verb tenses (play → played → playing)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}