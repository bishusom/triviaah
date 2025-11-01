import MuteButton from '@/components/common/MuteButton';
import BoggleGame from '@/components/word-games/BoggleGame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Boggle Game Online | Word Search Challenge | Elite Trivias',
  description: 'Play free Boggle game online. Find words in a 4x4 or 5x5 letter grid with our daily puzzle challenge. Boost your vocabulary, word-finding skills, and uncover all possible words.',
  keywords: 'boggle, word search game, vocabulary game, word game, boggle challenge, daily puzzle, word finder, educational games, free boggle, online word games',
  alternates: {
    canonical: 'https://elitetrivias.com/word-games/boggle',
  },
  openGraph: {
    title: 'Free Boggle Game Online | Word Search Challenge | Elite Trivias',
    description: 'Play free Boggle game online. Find words in a 4x4 or 5x5 letter grid with our daily puzzle challenge. Boost your vocabulary, word-finding skills, and uncover all possible words.',
    url: 'https://elitetrivias.com/word-games/boggle',
    siteName: 'Elite Trivias',
    images: [
      {
        url: '/imgs/boggle.webp',
        width: 1200,
        height: 630,
        alt: 'Free Boggle Game Online'
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Boggle Game Online | Word Search Challenge | Elite Trivias',
    description: 'Play free Boggle game online. Find words in a 4x4 or 5x5 letter grid with our daily puzzle challenge. Boost your vocabulary, word-finding skills, and uncover all possible words.',
    images: ['/imgs/boggle.webp'],
  },
};


export default function BogglePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="no-ads-page">
        <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
          <MuteButton />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Free Boggle Game Online</h1>
          <p className="text-lg text-gray-600">
            Challenge your vocabulary with our daily Boggle puzzle. Find as many words as possible 
            from the letter grid and improve your word-finding skills!
          </p>
        </div>

        <BoggleGame />
        {/* SEO Content Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Boggle - Free Word Puzzle Game</h2>
          <div className="prose text-gray-700">
            <p className="mb-4">
              Boggle is a classic word game where players attempt to find words in sequences of adjacent letters 
              on a 4x4 or 5x5 grid. It&apos;s one of the most engaging <strong>free word puzzles</strong> available online, 
              perfect for enhancing your vocabulary and cognitive skills.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Benefits of Playing Boggle</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Improves vocabulary and spelling skills</li>
              <li>Enhances pattern recognition and cognitive abilities</li>
              <li>Provides a fun and challenging way to pass the time</li>
              <li>Suitable for all ages and skill levels</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Why Choose Our Boggle Game?</h3>
            <p className="mb-4">
              Our Boggle game offers an intuitive interface, multiple difficulty levels, and daily puzzles to keep you
              engaged. Whether you&apos;re a beginner or a seasoned word game enthusiast, our platform provides an 
              enjoyable experience for everyone.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>User-friendly design for seamless gameplay</li>
              <li>Regular updates with new puzzles and challenges</li>
              <li>Helpful hints and tips to improve your skills</li>
              <li>Accessible on various devices for gaming on the go</li>
            </ul>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">Word Game Tips:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Start with shorter words and gradually build up to longer ones.</li>
                <li>Look for common prefixes and suffixes to find more words.</li>
                <li>Practice regularly to enhance your vocabulary and pattern recognition skills.</li>
            </ul>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}