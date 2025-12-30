// app/daily-trivias/page.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import { MdInfo } from 'react-icons/md';
import DailyQuizzesGrid from '@/components/daily/DailyQuizzesGrid';
import Timer from '@/components/daily/dailyQuizTimer';
import Ads from '@/components/common/Ads';

export const metadata: Metadata = {
  title: 'Daily Trivia Game - Play Fresh Quizzes Every 24 Hours | Triviaah',
  description: 'Play our free daily trivia game with new questions about history, pop culture, sports, and more! Test your knowledge daily with 10 fresh questions.',
  keywords: 'daily trivia game, daily quiz, trivia challenges, fun quiz, knowledge test',
  openGraph: {
    title: 'Daily Trivia Game - New Questions Every Day | Triviaah',
    description: 'Challenge yourself with our daily trivia game. 10 fresh questions every 24 hours!',
    url: 'https://triviaah.com/daily',
    images: [
      {
        url: '/imgs/daily-trivia-og.webp',
        alt: 'Daily Trivia Game - Play Now',
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
      image: '/imgs/thumbnails/quick-fire-160x160.webp',
      tagline: 'Test your reaction time and knowledge with our 60-second challenge!',
      keywords: 'rapid fire trivia, quick fire triva, general knowledge quiz, daily trivia, daily quiz with answers',
    },
    {
      category: 'general-knowledge',
      name: 'General Knowledge',
      path: '/daily-trivias/general-knowledge',
      image: '/imgs/thumbnails/general-knowledge-160x160.webp',
      tagline: 'Test your worldly wisdom with diverse topics',
      keywords: 'facts, trivia, knowledge quiz',
    },
    {
      category: 'today-in-history',
      name: 'Today in History',
      path: '/today-in-history',
      image: '/imgs/thumbnails/today-history-160x160.webp',
      tagline: 'Discover historical events from this date in free online trivia',
      keywords: 'historical trivia quiz, on this day trivia, history facts game',
    },
    {
      category: 'entertainment',
      name: 'Entertainment',
      path: '/daily-trivias/entertainment',
      image: '/imgs/thumbnails/entertainment-160x160.webp',
      tagline: 'Movies, music & pop culture challenges',
      keywords: 'film quiz, music trivia, celebrity questions',
    },
    {
      category: 'geography',
      name: 'Geography',
      path: '/daily-trivias/geography',
      image: '/imgs/thumbnails/geography-160x160.webp',
      tagline: 'Explore the world without leaving home',
      keywords: 'countries, capitals, landmarks, maps',
    },
    {
      category: 'science',
      name: 'Science & Nature',
      path: '/daily-trivias/science',
      image: '/imgs/thumbnails/science-160x160.webp',
      tagline: 'Discover the wonders of science and the animal kingdom',
      keywords: 'biology, physics, chemistry, space',
    },
    {
      category: "arts-literature",
      name: "Arts & Literature",
      path: "/daily-trivias/arts-literature",
      image: "/imgs/thumbnails/arts-n-literature-160x160.webp",
      tagline: "Explore the world of great authors, artists, and literary masterpieces",
      keywords: "literature trivia quiz, famous authors quiz, art history questions, classic books quiz, painting trivia, poetry quiz questions"
    },
    {
      category: 'sports',
      name: 'Sports',
      path: '/daily-trivias/sports',
      image: '/imgs/thumbnails/sports-160x160.webp',
      tagline: 'Test your knowledge of sports history, athletes, and events',
      keywords: 'sports trivia quiz, athlete trivia, sports history game, sports quiz with answers',
    },
  ];
}

export default async function DailyQuizzesPage() {
  const dailyQuizzes = await getDailyQuizzes();
  const lastUpdated = new Date().toISOString();

  // Organization Schema for the main page
  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Triviaah',
    url: 'https://triviaah.com',
    description: 'Free daily trivia quizzes and challenges across multiple categories including general knowledge, history, entertainment, and more.',
    logo: 'https://triviaah.com/logo.png',
    sameAs: [],
    foundingDate: '2024',
    knowsAbout: ['Trivia', 'Quiz Games', 'General Knowledge', 'Educational Entertainment']
  };

  // WebPage Schema for this specific page
  const webpageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Daily Trivia Game - Play Fresh Quizzes Every 24 Hours',
    description: 'Play our free daily trivia game with new questions about history, pop culture, sports, and more! Test your knowledge daily with 10 fresh questions.',
    url: 'https://triviaah.com/daily-trivias',
    dateModified: lastUpdated,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: dailyQuizzes.length,
      itemListElement: dailyQuizzes.map((quiz, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Quiz',
          name: `${quiz.name} Daily Quiz`,
          description: quiz.tagline,
          url: `https://triviaah.com${quiz.path}`,
          category: quiz.category
        }
      }))
    }
  };

  // FAQ Schema for common questions
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How often are new daily trivia quizzes available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'All daily trivia quizzes are updated every 24 hours at midnight in your local timezone. Each quiz category gets fresh questions daily.'
        }
      },
      {
        '@type': 'Question',
        name: 'Are the daily trivia quizzes completely free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! All our daily trivia quizzes are 100% free to play with no registration required. No hidden fees or subscriptions.'
        }
      },
      {
        '@type': 'Question',
        name: 'What categories of daily trivia are available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `We offer ${dailyQuizzes.length} different trivia categories including ${dailyQuizzes.map(q => q.name).join(', ')}. Each category has unique questions updated daily.`
        }
      },
      {
        '@type': 'Question',
        name: 'Do I need to create an account to play daily trivia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No account or registration is required. You can start playing any daily trivia quiz immediately without signing up.'
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Organization Schema */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData)
        }}
      />

      {/* WebPage Schema */}
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webpageStructuredData)
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData)
        }}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Last Updated */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Daily Trivia Game <span className="text-blue-600">(New Questions Every 24h)</span>
            </h1>
            {/* Last Updated Timestamp */}
            <time 
              dateTime={lastUpdated} 
              className="bg-green-50 px-3 py-1 rounded-full text-xs font-medium border border-green-200"
              title="Last updated"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Play our free daily trivia challenge with 10 fresh questions about <strong>history, sports, science, and pop culture</strong>. 
          </p>
          <Timer />
        </div>

        {/* Ads Section */}
        <div className="max-w-3xl mx-auto p-6">
          <Ads format="horizontal" style={{ width: '100%', height: '90px' }} />
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

        {/* FAQ Section with Schema Markup */}
        <div className="bg-gray-50 rounded-xl shadow-sm p-6 mb-12">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
              <span className="text-gray-500 group-open:rotate-180 transition-transform text-2xl">
                ▼
              </span>
            </summary>
            <div className="mt-6 space-y-6 pt-6 border-t border-gray-200">
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-lg mb-2" itemProp="name">How often are new daily trivia quizzes available?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  All daily trivia quizzes are updated every 24 hours at midnight in your local timezone. Each quiz category gets fresh questions daily.
                </p>
              </div>
              
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-lg mb-2" itemProp="name">Are the daily trivia quizzes completely free?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! All our daily trivia quizzes are 100% free to play with no registration required. No hidden fees or subscriptions.
                </p>
              </div>
              
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-lg mb-2" itemProp="name">What categories of daily trivia are available?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  We offer {dailyQuizzes.length} different trivia categories including {dailyQuizzes.map(q => q.name).join(', ')}. Each category has unique questions updated daily.
                </p>
              </div>
              
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold text-lg mb-2" itemProp="name">Do I need to create an account to play daily trivia?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  No account or registration is required. You can start playing any daily trivia quiz immediately without signing up.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* SEO-Friendly Content */}
        <section className="prose max-w-none mb-12">
          <div itemScope itemType="https://schema.org/WebPage">
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2 className="text-2xl font-bold text-gray-800" itemProp="name">Daily Trivia Game Questions</h2>
            <p itemProp="description">
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
              <li><strong>Completely free</strong> with no registration required</li>
              <li>Updated daily at <strong>midnight in your local timezone</strong></li>
            </ul>

            <h3>Available Daily Trivia Categories:</h3>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {dailyQuizzes.map((quiz) => (
                <div key={quiz.category} className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800">{quiz.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{quiz.tagline}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}