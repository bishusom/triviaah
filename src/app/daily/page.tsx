// app/daily/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MdInfo } from 'react-icons/md';
import Timer from '@/components/daily/dailyQuizTImer'; 


export const metadata: Metadata = {
  title: 'Daily Trivia Challenges | Triviaah',
  description: 'Play fresh trivia quizzes every day. Test your knowledge with our daily challenges that reset every 24 hours!',
  keywords: 'daily trivia, quiz challenges, daily quiz, trivia game, knowledge test',
  openGraph: {
    title: 'Daily Trivia Challenges | Triviaah',
    description: 'Fresh trivia quizzes updated daily - play now!',
    url: 'https://triviaah.com/daily',
    images: [
      {
        url: '/imgs/daily-trivia-og.webp',
        width: 1200,
        height: 630,
        alt: 'Daily Trivia Challenges',
      },
    ],
  },
};

async function getDailyQuizzes() {
  return [
    {
      category: 'general-knowledge',
      name: 'General Knowledge',
      image: '/imgs/general-knowledge.webp',
      tagline: 'Test your worldly wisdom with diverse topics',
      keywords: 'facts, trivia, knowledge quiz',
    },
    {
      category: 'entertainment',
      name: 'Entertainment',
      image: '/imgs/entertainment.webp',
      tagline: 'Movies, music & pop culture challenges',
      keywords: 'film quiz, music trivia, celebrity questions',
    },
    {
      category: 'history',
      name: 'History',
      image: '/imgs/history.webp',
      tagline: 'Journey through time with historical facts',
      keywords: 'world history, past events, historical figures',
    },
    {
      category: 'geography',
      name: 'Geography',
      image: '/imgs/geography.webp',
      tagline: 'Explore the world without leaving home',
      keywords: 'countries, capitals, landmarks, maps',
    },
    {
      category: 'science',
      name: 'Science',
      image: '/imgs/science.webp',
      tagline: 'Discover the wonders of science',
      keywords: 'biology, physics, chemistry, space',
    },
    {
      category: 'sports',
      name: 'Sports',
      image: '/imgs/sports.webp',
      tagline: 'For the ultimate sports fanatic',
      keywords: 'football, basketball, olympics, athletes',
    },
  ];
}

export default async function DailyQuizzesPage() {
  const dailyQuizzes = await getDailyQuizzes();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Daily Trivia Challenges
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fresh quizzes every 24 hours! Test your knowledge across various topics.
          </p>
          <Timer /> {/* Use the client-side timer component */}
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {dailyQuizzes.map((quiz) => (
            <div
              key={quiz.category}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow hover:border-blue-400"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    <Image
                      src={quiz.image}
                      alt={quiz.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{quiz.name}</h2>
                  <p className="text-sm text-gray-600 italic mb-2">{quiz.tagline}</p>
                </div>

                <div className="mt-auto">
                  <Link
                    href={`/daily/${quiz.category}`}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors"
                  >
                    Play Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

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
          <h2 className="text-2xl font-bold text-gray-800">Daily Trivia Questions</h2>
          <p>
            Our daily trivia challenges offer a fun way to test your knowledge across various
            topics including history, science, entertainment, and more. Each quiz consists of
            10 carefully selected questions that refresh every 24 hours, giving you a new
            challenge to look forward to each day.
          </p>
          <h3>Why Play Daily Trivia?</h3>
          <ul>
            <li>Expand your knowledge in bite-sized daily sessions</li>
            <li>Discover interesting facts you might not encounter otherwise</li>
            <li>Challenge yourself with questions that get progressively harder</li>
            <li>Track your improvement over time</li>
          </ul>
        </section>
      </main>
    </div>
  );
}