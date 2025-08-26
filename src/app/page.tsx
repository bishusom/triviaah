import Link from 'next/link';
import Image from 'next/image';
//import { FaCheckCircle } from 'react-icons/fa';
import { MdInfo, MdEmail } from 'react-icons/md';
import { AdBanner, AdSquare } from '@/components/Ads';
import ScrollButtons from '@/components/ScrollButtons';
import DailyQuizClient from '@/components/daily/DailyQuizClient';

export const metadata = {
  title: 'Free Daily Trivia Challenges & Online Quiz Games | Triviaah',
  description: 'Play free daily trivia challenges and online quiz games! Test your knowledge with pop culture trivia quizzes, science questions, history facts, and word games.',
};

// --------------------------
// 1. Static data (unchanged)
// --------------------------
const DAILY_QUIZZES = [
  {
    category: 'trordle',
    name: 'Trordle',
    image: '/imgs/trordle-160x160.webp',
    tagline: 'Wordle-inspired trivia challenges for curious minds',
    keywords: 'trivia wordle, daily trivia game, quiz puzzle, general knowledge quiz, movie trivia, book trivia, geography quiz, history trivia, sports trivia'
    },
  {
    category: 'general-knowledge',
    name: 'General Knowledge',
    image: '/imgs/general-knowledge-160x160.webp',
    tagline: 'Test your worldly wisdom with diverse daily trivia challenges',
    keywords: 'general knowledge quiz, daily trivia facts, world trivia questions',
  },
  {
    category: 'today-in-history',
    name: 'Today in History',
    image: '/imgs/today-history-160x160.webp',
    tagline: 'Discover historical events from this date in free online trivia',
    keywords: 'historical trivia quiz, on this day trivia, history facts game',
  },
  {
    category: 'entertainment',
    name: 'Entertainment',
    image: '/imgs/entertainment-160x160.webp',
    tagline: 'Pop culture trivia quizzes featuring movies, music & celebrities',
    keywords: 'pop culture trivia quizzes, movie trivia game, celebrity quiz',
  },
  {
    category: 'geography',
    name: 'Geography',
    image: '/imgs/geography-160x160.webp',
    tagline: 'Explore world geography through interactive trivia challenges',
    keywords: 'geography trivia quiz, world capitals game, countries trivia',
  },
  {
    category: 'science',
    name: 'Science',
    image: '/imgs/science-160x160.webp',
    tagline: 'Discover scientific wonders in our free online science trivia',
    keywords: 'science trivia quiz, biology quiz game, physics trivia questions',
  },
] as const;

const ADDITIONAL_SECTIONS = [
  {
    category: 'word-games',
    name: 'Word Games',
    image: '/imgs/word-games-160x160.webp',
    tagline: 'Challenge your vocabulary with free online word puzzle games',
    keywords: 'word puzzle games, vocabulary quiz, word trivia challenge',
  },
  {
    category: 'number-puzzles',
    name: 'Number Puzzles',
    image: '/imgs/number-puzzles-160x160.webp',
    tagline: 'Exercise your brain with mathematical trivia and logic puzzles',
    keywords: 'math trivia games, number puzzle quiz, logic brain games',
  },
  {
    category: 'blog',
    name: 'Trivia Blog',
    image: '/imgs/blog-160x160.webp',
    tagline: 'Learn fascinating trivia facts and quiz strategies',
    keywords: 'trivia facts blog, quiz tips, interesting trivia articles',
  },
  {
    category: 'trivia-bank',
    name: 'Trivia Bank',
    image: '/imgs/tbank-160x160.webp',
    tagline: 'Access our complete collection of free trivia questions',
    keywords: 'trivia question database, quiz question bank, trivia archive',
  },
] as const;

// --------------------------
// 2. Precompute timer on server
// --------------------------
function getTimeLeft() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${h}h ${m}m`;
}

export default function Home() {
  const timeLeft = getTimeLeft();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Banner Ad - placed after header */}
      <header className="bg-blue-700 text-white py-4 px-4">
        <div className="container mx-auto flex items-center justify-center gap-4">
          <Image
            src="/logo-280x80.webp"
            alt="Triviaah - Free Daily Trivia Games"
            width={140}
            height={40}
            priority
            quality={75}
            className="object-contain lcp-priority"
          />
        </div>
      </header>
      <AdBanner position="header" />

      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Play Free Online Trivia Games Daily
          </h1>
          <p className="text-gray-600 mb-4">
            New free online trivia games every 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {DAILY_QUIZZES.map((quiz, idx) => (
            <DailyQuizClient 
              key={quiz.category}
              quiz={quiz}
              priorityImage={idx < 2}
              timeLeft={timeLeft}
              className={idx < 2 ? "lcp-priority" : ""}
            />
          ))}
        </div>
        {/* Square Ad placed after first content section */}
        <AdSquare />

        {/* More Brain Puzzles Section */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
            More Free Online Brain Games & Word Puzzles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADDITIONAL_SECTIONS.map((s) => (
              <div 
                key={s.category} 
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow hover:border-blue-400"
              >
                <div className="p-6 flex flex-col h-full">
                  {/* Image */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                      <Image
                        src={s.image}
                        alt={s.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                        loading="lazy"
                        quality={75}
                      />
                    </div>
                  </div>

                  {/* Text Content (hidden on mobile) */}
                  <div className="text-center mb-4 flex-grow">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{s.name}</h3>
                    <p className="text-sm text-gray-600 italic hidden sm:block mb-2">
                      {s.tagline}
                    </p>
                    {/* SEO Keywords (hidden but crawlable) */}
                    <div className="sr-only" aria-hidden="true">
                      Keywords: {s.keywords}
                    </div>
                  </div>

                  {/* Button */}
                  <Link 
                      href={`/${s.category}`}
                      className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg text-center transition-colors"
                    >
                      Explore
                  </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
          
          {/* SEO-Enhanced Categories Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Popular Trivia Quiz Categories
              </h3>
              <Link href="/trivias" className="text-blue-600 hover:underline" prefetch={false}>
                View All Categories →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Movies', desc: 'Film trivia & cinema quiz' },
                { name: 'Science', desc: 'Biology, physics & chemistry' },
                { name: 'History', desc: 'Historical events & facts' },
                { name: 'Geography', desc: 'World capitals & countries' },
                { name: 'Sports', desc: 'Athletics & sports trivia' },
                { name: 'Music', desc: 'Music trivia & song quiz' }
              ].map((c) => (
                <Link
                  key={c.name}
                  href={`/trivias/${c.name.toLowerCase()}`}
                  className="bg-white hover:bg-blue-50 border border-gray-200 rounded-lg p-4 text-center transition-colors group"
                  prefetch={false}
                  title={c.desc}
                >
                  <div className="font-medium text-gray-800 group-hover:text-blue-600">
                    {c.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {c.desc}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* SEO Content Section */}
          <section className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Why Choose Triviaah for Your Daily Trivia Challenge?
            </h4>
            <div className="prose text-gray-600">
              <p className="mb-4">
                Triviaah offers the best collection of <strong>free online trivia games</strong> with fresh 
                <strong> daily trivia challenges</strong> across 20+ categories. Whether you&apos;re into 
                <strong> pop culture trivia quizzes</strong>, science facts, or history questions, 
                we have something for every trivia enthusiast.
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li>New <strong>daily trivia challenges</strong> every 24 hours</li>
                <li>Wide variety of <strong>free online trivia games</strong></li>
                <li>Popular <strong>pop culture trivia quizzes</strong> and entertainment questions</li>
                <li>Educational content covering science, history, and geography</li>
                <li>Word games and brain teasers for mental exercise</li>
              </ul>
            </div>
          </section>

          <ScrollButtons />  

        </main>

        {/* Footer Banner Ad */}
        <AdBanner position="footer" />    
          
        {/* Enhanced Footer */}
        <footer className="bg-gray-800 text-white py-6 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-bold">Triviaah</h3>
                <p className="text-gray-400">Free daily trivia challenges & online quiz games</p>
              </div>
              <div className="flex gap-6">
                <Link href="/about" className="flex items-center hover:text-blue-300" prefetch={false}>
                  <MdInfo className="mr-1" /> About
                </Link>
                <Link href="/contact" className="flex items-center hover:text-blue-300" prefetch={false}>
                  <MdEmail className="mr-1" /> Contact Us
                </Link>
                <Link href="/privacy" className="hover:text-blue-300" prefetch={false}>
                  Privacy Policy
                </Link>
              </div>
            </div>
            <div className="mt-6 text-center text-gray-400 text-sm">
              © {new Date().getFullYear()} Triviaah. Play free daily trivia challenges and online quiz games.
            </div>
          </div>
        </footer>
      </div>
  );
}