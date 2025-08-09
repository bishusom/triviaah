import WordGamesClientPage from './WordGamesClientPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Word Games Collection | Triviaah',
  description: 'Challenge your vocabulary with our collection of word games including Scramble, Spelling Bee, Boggle, Word Search, and Word Ladder',
  keywords: 'word games, vocabulary games, scramble, spelling bee, boggle, word search, word ladder, language games',
  openGraph: {
    title: 'Word Games Collection | Triviaah',
    description: 'Play fun word games to improve your vocabulary and spelling skills',
    images: [
      {
        url: '/word-games-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Triviaah Word Games',
      },
    ],
  },
};

export default function WordGamesPage() {
  return <WordGamesClientPage />;
}