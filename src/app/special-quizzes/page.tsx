// app/special-quizzes/page.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import { SPECIAL_QUIZZES, getCurrentMonthQuiz, isQuizAvailable } from '@/config/special-quizzes';
import { MdLock, MdCheckCircle, MdCalendarToday } from 'react-icons/md';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Seasonal Special Quizzes - Monthly Trivia Challenges | Triviaah',
  description: 'Play our special monthly trivia quizzes! Each month features a unique themed challenge available only during that month. Test your knowledge with time-limited trivia!',
  keywords: 'seasonal trivia, monthly quiz, special trivia challenges, holiday quizzes, time-limited trivia',
  openGraph: {
    title: 'Seasonal Special Quizzes - Monthly Challenges | Triviaah',
    description: 'Discover our monthly special trivia quizzes! Each month brings a new themed challenge available for limited time.',
    url: 'https://triviaah.com/special-quizzes',
    images: [
      {
        url: '/imgs/special-quizzes-og.webp',
        alt: 'Seasonal Special Quizzes',
      },
    ],
  },
};

function getMonthName(monthNumber: number): string {
  return new Date(2000, monthNumber - 1, 1).toLocaleString('default', { month: 'long' });
}

export default function SpecialQuizzesPage() {
  const currentMonthQuiz = getCurrentMonthQuiz();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Sort quizzes by month for display
  const sortedQuizzes = [...SPECIAL_QUIZZES].sort((a, b) => a.month - b.month);

  // Schema data
  const lastUpdated = new Date().toISOString();

  const webpageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Seasonal Special Quizzes - Monthly Trivia Challenges',
    description: 'Play our special monthly trivia quizzes! Each month features a unique themed challenge available only during that month.',
    url: 'https://triviaah.com/special-quizzes',
    dateModified: lastUpdated,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: sortedQuizzes.length,
      itemListElement: sortedQuizzes.map((quiz, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Quiz',
          name: `${quiz.name} - ${getMonthName(quiz.month)} Special`,
          description: quiz.description,
          url: `https://triviaah.com/special-quizzes/${quiz.category}`,
          availableMonth: getMonthName(quiz.month)
        }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Schema Markup */}
      <Script
        id="special-quizzes-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webpageStructuredData)
        }}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Seasonal Special Quizzes <span className="text-blue-600">(Monthly Rotating)</span>
            </h1>
            <time 
              dateTime={lastUpdated} 
              className="bg-blue-50 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
              title="Current month"
            >
              {getMonthName(currentMonth)} {currentYear}
            </time>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Each month features a unique themed trivia challenge. Play the current month&apos;s quiz before it disappears!
          </p>
        </div>

        {/* Current Month Highlight */}
        {currentMonthQuiz && (
          <div className="mb-10">
            <div className={`${currentMonthQuiz.bgColor} rounded-xl shadow-xl text-white p-8 text-center relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20">
                {currentMonthQuiz.emojis.map((emoji, index) => (
                  <div 
                    key={index}
                    className="absolute text-4xl"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full mb-4">
                  <MdCheckCircle className="text-green-300" />
                  <span className="font-semibold">CURRENTLY AVAILABLE</span>
                </div>
                <h2 className="text-3xl font-bold mb-3">{currentMonthQuiz.name}</h2>
                <p className="text-xl mb-6 max-w-2xl mx-auto">{currentMonthQuiz.description}</p>
                <div className="flex justify-center gap-4 mb-6">
                  {currentMonthQuiz.emojis.map((emoji, index) => (
                    <span key={index} className="text-2xl animate-bounce" style={{animationDelay: `${index * 100}ms`}}>
                      {emoji}
                    </span>
                  ))}
                </div>
                <Link 
                  href={`/special-quizzes/${currentMonthQuiz.category}`}
                  className="inline-block bg-white text-gray-800 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Play Now →
                </Link>
                <p className="mt-4 text-sm opacity-80">
                  Available until {getMonthName(currentMonth)} 31st, {currentYear}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* All Special Quizzes Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            All Monthly Special Quizzes
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedQuizzes.map((quiz) => {
              const isAvailable = quiz.month === currentMonth;
              const monthName = getMonthName(quiz.month);
              
              return (
                <div 
                  key={quiz.month}
                  className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
                    isAvailable 
                      ? 'border-blue-500 shadow-lg transform hover:-translate-y-1 transition-transform duration-200' 
                      : 'border-gray-200 opacity-80'
                  }`}
                >
                  {/* Emoji Header */}
                  <div className={`${quiz.bgColor} p-4 text-center`}>
                    <div className="flex justify-center gap-2 mb-2">
                      {quiz.emojis.slice(0, 4).map((emoji, index) => (
                        <span key={index} className="text-2xl">
                          {emoji}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-white">{quiz.name}</h3>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <MdCalendarToday className="text-gray-500" />
                        <span className="font-semibold text-gray-700">{monthName}</span>
                      </div>
                      {isAvailable ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          <MdCheckCircle /> Available Now
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                          <MdLock /> Available in {monthName}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-6">{quiz.description}</p>
                    
                    <div className="space-y-3">
                      {isAvailable ? (
                        <Link 
                          href={`/special-quizzes/${quiz.category}`}
                          className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold transition-colors duration-200"
                        >
                          Play This Quiz
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gray-200 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
                        >
                          Available in {monthName}
                        </button>
                      )}
                      
                      <div className="text-xs text-gray-500 flex items-center justify-center gap-2">
                        <MdCalendarToday />
                        <span>Available {quiz.month === 12 ? 'Dec 1-31' : `${monthName} 1-30`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How Special Quizzes Work</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold text-gray-800 mb-2">1. Monthly Rotation</h3>
              <p className="text-gray-600">
                Each special quiz is available only during its assigned month. Mark your calendar for favorites!
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold text-gray-800 mb-2">2. Limited Time Access</h3>
              <p className="text-gray-600">
                Play the current month&apos;s quiz anytime before the month ends. Once gone, you&apos;ll have to wait until next year!
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold text-gray-800 mb-2">3. Unique Themes</h3>
              <p className="text-gray-600">
                Each month features a completely new theme, emoji set, and custom questions you won&apos;t find elsewhere.
              </p>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <section className="prose max-w-none mb-12">
          <h2 className="text-2xl font-bold text-gray-800">Monthly Special Trivia Challenges</h2>
          <p>
            Our <strong>seasonal special quizzes</strong> offer unique trivia experiences that change every month. 
            Unlike our daily trivia games, these special quizzes are available for a <strong>limited time only</strong> — 
            typically just during the month they&apos;re themed for.
          </p>
          
          <h3>Why Players Love Our Special Quizzes:</h3>
          <ul>
            <li><strong>Exclusive content</strong> available only during specific months</li>
            <li><strong>Perfect for holidays</strong> and seasonal celebrations</li>
            <li><strong>Collectible experience</strong> - complete them all throughout the year</li>
            <li><strong>Surprise themes</strong> that keep gameplay fresh and exciting</li>
            <li><strong>Share with friends</strong> to see who can get the highest score before time runs out</li>
          </ul>

          <h3>Coming Up Next:</h3>
          <p>
            Looking ahead to next month? Check back on the first day of each month to discover the new special quiz theme! 
            Our quizzes are designed to celebrate holidays, seasons, and special occasions throughout the year.
          </p>
        </section>
      </main>
    </div>
  );
}