// app/daily/page.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import { MdInfo } from 'react-icons/md';
import DailyQuizzesGrid from '@/components/daily/DailyQuizzesGrid';
import Timer from '@/components/daily/dailyQuizTimer';

export const metadata: Metadata = {
  title: 'Daily Trivia Game - Play Fresh Quizzes Every 24 Hours | Triviaah',
  description: 'Play our free daily trivia game with new questions about history, pop culture, sports, and more! Test your knowledge daily with 10 fresh questions.', // More specific
  keywords: 'daily trivia game, daily quiz, trivia challenges, fun quiz, knowledge test', // Added exact match
  openGraph: {
    title: 'Daily Trivia Game - New Questions Every Day | Triviaah', // Updated
    description: 'Challenge yourself with our daily trivia game. 10 fresh questions every 24 hours!', // More action-oriented
    url: 'https://triviaah.com/daily',
    images: [
      {
        url: '/imgs/daily-trivia-og.webp',
        alt: 'Daily Trivia Game - Play Now', // Updated alt text
      },
    ],
  },
};

async function getDailyQuizzes() {
  return [
    {
    category: 'quick-fire',
    name: 'Quick Fire',
    path: '/quick-fire',
    image: '/imgs/quick-fire-160x160.webp',
    tagline: 'Test your reaction time and knowledge with our 60-second challenge!',
    keywords: 'rapid fire trivia, quick fire triva, general knowledge quiz, daily trivia, daily quiz with answers',
    },
    {
      category: 'general-knowledge',
      name: 'General Knowledge',
      path: '/daily/general-knowledge',
      image: '/imgs/general-knowledge-160x160.webp',
      tagline: 'Test your worldly wisdom with diverse topics',
      keywords: 'facts, trivia, knowledge quiz',
    },
    {
      category: 'today-in-history',
      name: 'Today in History',
      path: '/today-in-history',
      image: '/imgs/today-history-160x160.webp',
      tagline: 'Discover historical events from this date in free online trivia',
      keywords: 'historical trivia quiz, on this day trivia, history facts game',
    },
    {
      category: 'entertainment',
      name: 'Entertainment',
      path: '/daily/entertainment',
      image: '/imgs/entertainment-160x160.webp',
      tagline: 'Movies, music & pop culture challenges',
      keywords: 'film quiz, music trivia, celebrity questions',
    },
    {
      category: 'geography',
      name: 'Geography',
      path: '/daily/geography',
      image: '/imgs/geography-160x160.webp',
      tagline: 'Explore the world without leaving home',
      keywords: 'countries, capitals, landmarks, maps',
    },
    {
      category: 'science',
      name: 'Science',
      path: '/daily/science',
      image: '/imgs/science-160x160.webp',
      tagline: 'Discover the wonders of science',
      keywords: 'biology, physics, chemistry, space',
    },
    {
    category: "arts-literature",
    name: "Arts & Literature",
    path: "/daily/arts-literature",
    image: "/imgs/arts-n-literature-160x160.webp",
    tagline: "Explore the world of great authors, artists, and literary masterpieces",
    keywords: "literature trivia quiz, famous authors quiz, art history questions, classic books quiz, painting trivia, poetry quiz questions"
    },
    {
    category: 'sports',
    name: 'Sports',
    path: '/daily/sports',
    image: '/imgs/sports-160x160.webp',
    tagline: 'Test your knowledge of sports history, athletes, and events',
    keywords: 'sports trivia quiz, athlete trivia, sports history game, sports quiz with answers',
    },
  ];
}

export default async function DailyQuizzesPage() {
  const dailyQuizzes = await getDailyQuizzes();

  return (
    <div className="min-h-screen bg-gray-50">
      <Script
        id="qa-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "QAPage",
            "mainEntity": {
              "@type": "Question",
              "name": "Daily Trivia Game Questions",
              "text": "What topics are covered in today's daily trivia game?",
              "answerCount": 6,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Today's trivia covers history, entertainment, sports, science, geography, and general knowledge. New questions refresh every 24 hours."
              }
            }
          })
        }}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Daily Trivia Game <span className="text-blue-600">(New Questions Every 24h)</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Play our free daily trivia challenge with 10 fresh questions about <strong>history, sports, science, and pop culture</strong>. 
          </p>
          <Timer />
        </div>

        {/* Quiz Grid - Client-side component */}
        <DailyQuizzesGrid quizzes={dailyQuizzes} />

        {/* How It Works Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <MdInfo className="mr-2 text-blue-600" />
            How Daily Quizzes Work
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-gray-800 mb-2">1. New Challenges Daily</h3>
              <p className="text-gray-600">
                We update all quizzes at midnight local time. Come back daily for fresh content!
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-gray-800 mb-2">2. Track Your Progress</h3>
              <p className="text-gray-600">
                Completed quizzes show a checkmark until they reset the next day.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-gray-800 mb-2">3. Compete With Friends</h3>
              <p className="text-gray-600">
                Share your scores and challenge others to beat your results.
              </p>
            </div>
          </div>
        </div>

        {/* SEO-Friendly Content */}
        <section className="prose max-w-none mb-12">
          <h2 className="text-2xl font-bold text-gray-800">Daily Trivia Game Questions</h2> {/* Exact match */}
          <p>
            Our <strong>daily trivia game</strong> is the perfect way to test your knowledge in just a few minutes. 
            Each quiz features 10 hand-picked questions that reset at midnight, covering topics like:
          </p>
          <ul>
            <li><strong>History</strong>: Famous events, leaders, and discoveries</li>
            <li><strong>Entertainment</strong>: Movies, music, and celebrity trivia</li>
            <li><strong>Sports</strong>: Athletes, records, and iconic moments</li>
            <li><strong>Science & Geography</strong>: Space, inventions, and world landmarks</li>
          </ul>
          
          <h3>Why Players Love Our Daily Trivia Game:</h3>
          <ul>
            <li>Perfect for <strong>quick brain exercises</strong> during breaks</li>
            <li>Great for <strong>family game nights</strong> or friendly competitions</li>
            <li>Learn <strong>surprising facts</strong> daily</li>
          </ul>
        </section>
      </main>
    </div>
  );
}