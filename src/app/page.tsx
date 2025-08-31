import Link from 'next/link';
import Image from 'next/image';
//import { FaCheckCircle } from 'react-icons/fa';
import { MdInfo, MdEmail } from 'react-icons/md';
import { AdBanner, AdSquare } from '@/components/Ads';
import ScrollButtons from '@/components/ScrollButtons';
import DailyQuizClient from '@/components/daily/DailyQuizClient';

export const metadata = {
  title: 'Free Daily Quiz with Answers | Online Trivia Games & Challenges | Triviaah',
  description: 'Play free daily quiz with answers and explanations. Enjoy online trivia games, test your knowledge with instant feedback, and learn with our educational quiz platform.',
};

// --------------------------
// 1. Static data (unchanged)
// --------------------------
const DAILY_QUIZZES = [
  {
    category: 'trordle',
    name: 'Trordle',
    path: '/trordle',
    image: '/imgs/trordle-160x160.webp',
    tagline: 'Wordle-inspired trivia challenges for curious minds',
    keywords: 'trivia wordle, daily trivia game, quiz puzzle, general knowledge quiz, movie trivia, book trivia, geography quiz, history trivia, sports trivia'
    },
  {
    category: 'general-knowledge',
    name: 'General Knowledge',
    path: '/daily/general-knowledge',
    image: '/imgs/general-knowledge-160x160.webp',
    tagline: 'Test your worldly wisdom with diverse daily trivia challenges',
    keywords: 'general knowledge quiz, daily trivia facts, world trivia questions, daily quiz with answers',
  },
  {
    category: 'today-in-history',
    name: 'Today in History',
    path: '/today-in-history',
    image: '/imgs/today-history-160x160.webp',
    tagline: 'Discover historical events from this date in free online trivia',
    keywords: 'historical trivia quiz, on this day trivia, history facts game, history quiz with answers',
  },
  {
    category: 'entertainment',
    name: 'Entertainment',
    path: '/daily/entertainment',
    image: '/imgs/entertainment-160x160.webp',
    tagline: 'Pop culture trivia quizzes featuring movies, music & celebrities',
    keywords: 'pop culture trivia quizzes, movie trivia game, celebrity quiz, entertainment quiz answers',
  },
  {
    category: 'geography',
    name: 'Geography',
    path: '/daily/geography',
    image: '/imgs/geography-160x160.webp',
    tagline: 'Explore world geography through interactive trivia challenges',
    keywords: 'geography trivia quiz, world capitals game, countries trivia, geography quiz with answers',
  },
  {
    category: 'science',
    name: 'Science',
    path: '/daily/science',
    image: '/imgs/science-160x160.webp',
    tagline: 'Discover scientific wonders in our free online science trivia',
    keywords: 'science trivia quiz, biology quiz game, physics trivia questions, science quiz with answers',
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
    keywords: 'trivia facts blog, quiz tips, interesting trivia articles, quiz answers explained',
  },
  {
    category: 'trivia-bank',
    name: 'Trivia Bank',
    image: '/imgs/tbank-160x160.webp',
    tagline: 'Access our complete collection of free trivia questions',
    keywords: 'trivia question database, quiz question bank, trivia archive, quiz with answers',
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
            Free Daily Quiz with Answers & Explanations
          </h1>
          <p className="text-gray-600 mb-4">
            New free online trivia games with answers every 24 hours. Test your knowledge and learn instantly!
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
                Popular Daily Quiz Categories with Answers
              </h3>
              <Link href="/trivias" className="text-blue-600 hover:underline" prefetch={false}>
                View All Categories →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Movies', desc: 'Film trivia & cinema quiz with answers' },
                { name: 'Science', desc: 'Biology, physics & chemistry explanations' },
                { name: 'History', desc: 'Historical events & facts with context' },
                { name: 'Geography', desc: 'World capitals & countries explained' },
                { name: 'Sports', desc: 'Athletics & sports trivia answers' },
                { name: 'Music', desc: 'Music trivia & song quiz explanations' }
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

          {/* Enhanced SEO Content Section */}
          <section className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Free Daily Quiz with Answers & Explanations
            </h4>
            <div className="prose text-gray-600">
              <p className="mb-4">
                Triviaah offers the best collection of <strong>free daily quiz with answers</strong> and detailed explanations 
                across multiple categories. Our <strong>daily quiz with answers</strong> format helps you learn while you play, 
                with instant feedback on every question. Enjoy our <strong>free trivia games online</strong> 
                including <strong>trivia games to play with friends online</strong> and <strong>virtual trivia games for work</strong>. 
              </p>
              <p className="mb-4">
                Looking for <strong>daily quiz with answers free</strong> resources? Our platform provides 
                <strong> quiz with answers and explanations</strong> that make learning engaging and effective. 
                Whether you&apos;re preparing for a test, hosting a <strong>virtual trivia night with answers</strong>, 
                or just expanding your knowledge, our <strong>daily trivia with answers</strong> format is perfect for all learners.
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li><strong>Daily quiz with answers</strong> updated every 24 hours</li>
                <li>Detailed explanations for every question in our <strong>quiz with answers</strong></li>
                <li>Instant feedback on your <strong>daily trivia challenges</strong></li>
                <li>Educational <strong>trivia with answers</strong> across all categories</li>
                <li>Perfect for <strong>team building quizzes with answers</strong></li>
                <li>Learn while you play with our <strong>quiz games with answers</strong></li>
                <li>Track your progress with our <strong>daily quiz challenge with answers</strong></li>
                <li>Share your scores on <strong>social media trivia with answers</strong></li>
              </ul>
              <p>
                As a leading <strong>free quiz website with answers</strong>, we provide comprehensive 
                <strong> daily quizzes with explanations</strong> that help you understand why answers are correct. 
                Our <strong>trivia with answers and facts</strong> approach ensures you not only test your knowledge 
                but also expand it with every game. Join thousands of players who enjoy our 
                <strong> educational quiz with answers</strong> platform daily!
              </p>
            </div>
          </section>

          {/* New Section: How Our Daily Quiz with Answers Works */}
          <section className="bg-blue-50 rounded-lg p-6 mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              How Our Daily Quiz with Answers Works
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h5 className="font-semibold mb-2">Play Daily Quiz</h5>
                <p className="text-sm text-gray-600">Choose from multiple categories and test your knowledge with our daily updated quizzes</p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h5 className="font-semibold mb-2">Get Instant Answers</h5>
                <p className="text-sm text-gray-600">Receive immediate feedback with detailed explanations for each question</p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h5 className="font-semibold mb-2">Learn & Improve</h5>
                <p className="text-sm text-gray-600">Track your progress, learn new facts, and improve your scores over time</p>
              </div>
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
                <p className="text-gray-400">Free daily trivia challenges with answers & online quiz games</p>
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
              © {new Date().getFullYear()} Triviaah. Play free daily trivia challenges with answers and online quiz games.
            </div>
          </div>
        </footer>
      </div>
  );
}