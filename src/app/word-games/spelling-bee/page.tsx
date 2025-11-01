import MuteButton from '@/components/common/MuteButton';
import SpellingBeeGame from '@/components/word-games/SpellingBeeGame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Spelling Bee Game Online | Vocabulary Challenge | Elite Trivias',
  description: 'Play free Spelling Bee game online. Create words from 7 letters with our daily puzzle challenge. Improve your vocabulary, spelling skills, and find all possible words.',
  keywords: 'spelling bee, spelling game, vocabulary game, word game, spelling challenge, daily puzzle, word finder, educational games, free spelling bee, online word games',
  alternates: {
    canonical: 'https://elitetrivias.com/word-games/spelling-bee',
  },
  openGraph: {
    title: 'Free Spelling Bee Game Online | Vocabulary Challenge | Elite Trivias',
    description: 'Play free Spelling Bee game online. Create words from 7 letters with our daily puzzle challenge. Improve your vocabulary, spelling skills, and find all possible words.',
    url: 'https://elitetrivias.com/word-games/spelling-bee',
    siteName: 'Elite Trivias',
    images: [
      {
        url: '/imgs/spelling-bee-og.webp',
        width: 1200,
        height: 630,
        alt: 'Free Spelling Bee Game Online'
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Spelling Bee Game Online | Vocabulary Challenge | Elite Trivias',
    description: 'Play free Spelling Bee game online. Create words from 7 letters with our daily puzzle challenge. Improve your vocabulary, spelling skills, and find all possible words.',
    images: ['/imgs/spelling-bee-og.webp'],
  },
};

export default function SpellingBeePage() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
       <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
        <MuteButton />
      </div>
      <div className="container mx-auto px-4">
        
        {/* SEO Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Free Spelling Bee Game Online</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Challenge your vocabulary with our daily Spelling Bee puzzle. Find as many words as possible 
            from 7 letters and aim for the coveted Genius rank!
          </p>
        </div>
        
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
          </div>
          
          {/* SEO Content Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Benefits of Playing Spelling Bee</h3>
            <div className="prose text-gray-700">
              <p className="mb-4">
                Our <strong>free Spelling Bee game</strong> is more than just entertainment—it&apos;s a powerful 
                educational tool that helps improve vocabulary, spelling, and cognitive skills. As one of the 
                most popular <strong>online word games</strong>, it offers:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Daily new challenges to keep your mind sharp</li>
                <li>Vocabulary expansion with every puzzle solved</li>
                <li>Improved spelling and word recognition skills</li>
                <li>Pattern recognition development</li>
                <li>Fun way to learn new words and their meanings</li>
              </ul>
              <p>
                Whether you&apos;re a word game enthusiast, a student looking to improve your language skills, 
                or someone who enjoys daily puzzles, our <strong>free spelling bee</strong> offers the perfect 
                combination of challenge and learning.
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-2">Pro Tips:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Look for common prefixes (re-, un-, pre-) and suffixes (-ing, -tion, -ment)</li>
              <li>Start with the center letter and build outward</li>
              <li>Plurals often work (add -s or -es to found words)</li>
              <li>Try changing verb tenses (play → played → playing)</li>
              <li>Don&apos;t forget to look for compound words and less common forms</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}