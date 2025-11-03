// app/quick-fire/page.tsx
import QuizGame from '@/components/trivias/QuizGame';
import { getRandomQuestions, type Question } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { WithTimezone } from '@/components/common/WithTimezone';
import { TimezoneInfo } from '@/components/common/TimezoneInfo';
import type { UserLocationInfo } from '@/types/location';

export const dynamic = 'force-dynamic';

export default async function QuickFirePage() {
  return (
    <WithTimezone>
      {(locationInfo) => (
        <QuickFireContent locationInfo={locationInfo} />
      )}
    </WithTimezone>
  );
}

async function QuickFireContent({ locationInfo }: { locationInfo: UserLocationInfo }) {
  try {
    // Fetch 7 random questions: mix of all difficulties
    const questions: Question[] = await getRandomQuestions(7, ['easy', 'medium', 'hard']);
    
    if (!questions || questions.length === 0) {
      notFound();
    }

    // Server timestamp for last updated
    const lastUpdated = new Date().toISOString();

    return (
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Elite Trivias",
              "url": "https://elitetrivias.com",
              "description": "Free daily trivia quizzes and challenges across multiple categories including general knowledge, history, entertainment, and more.",
              "logo": "https://elitetrivias.com/logo.png",
              "sameAs": [],
              "foundingDate": "2024",
              "knowsAbout": ["Trivia", "Quiz Games", "General Knowledge", "Educational Entertainment", "Quick Fire Trivia"]
            })
          }}
        />

        {/* Enhanced Quiz Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Quiz",
              "name": "Quick-Fire Trivia Challenge",
              "description": "Test your reflexes and knowledge with 7 random trivia questions. 10 seconds per question with bonus round!",
              "dateCreated": new Date().toISOString().split('T')[0],
              "dateModified": lastUpdated,
              "numberOfQuestions": 7,
              "timeRequired": "PT70S",
              "educationalLevel": "Mixed",
              "assesses": "General Knowledge",
              "publisher": {
                "@type": "Organization",
                "name": "Elite Trivias"
              },
              "hasPart": questions.map((q: Question, index: number) => ({
                "@type": "Question",
                "position": index + 1,
                "name": q.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": q.correct
                },
                "suggestedAnswer": q.options.map((option: string) => ({
                  "@type": "Answer",
                  "text": option
                }))
              }))
            })
          }}
        />

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is the Quick-Fire Quiz?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A fast-paced trivia challenge with 7 random questions. You have only 10 seconds per question to test your quick thinking and knowledge across various topics."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does scoring work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You earn more points for answering quickly. Base points depend on question difficulty, plus bonus points for each second remaining on the timer."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is the bonus question?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Answer all 6 regular questions correctly to unlock a special 7th bonus question worth 500 points!"
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are the questions different each time?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! The Quick-Fire quiz pulls 7 random questions from our database each time you play, so you can enjoy a new challenge every time."
                  }
                }
              ]
            })
          }}
        />
        
        {/* Server-rendered SEO content with enhanced schema */}
        <div className="text-center mb-6" itemScope itemType="https://schema.org/Quiz">
          <meta itemProp="dateModified" content={lastUpdated} />
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold mb-2" itemProp="name">
              ⚡ Quick-Fire Quiz
            </h1>
            {/* Last Updated Timestamp */}
            <time 
              dateTime={lastUpdated} 
              className="bg-yellow-50 px-3 py-1 rounded-full text-xs font-medium border border-yellow-200"
              itemProp="dateModified"
            >
              Updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <p className="text-gray-600 mb-3" itemProp="description">
            7 random questions • 10 seconds each • Bonus round!
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-2">
            Fast-paced trivia challenge with questions of varying difficulty. 
            Answer quickly for bonus points and unlock the final bonus question!
          </p>
          <TimezoneInfo locationInfo={locationInfo} showCountry={false} />
        </div>

        {/* Enhanced hidden but indexable quiz content for SEO */}
        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Article">
            <meta itemProp="datePublished" content={new Date().toISOString().split('T')[0]} />
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2 itemProp="headline">Quick-Fire Quiz Questions</h2>
            <p itemProp="description">
              Test your knowledge with these random trivia questions. Answer all 7 questions under time pressure!
            </p>
            <div className="space-y-4">
              <h3>About This Quiz:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>7 random questions from easy, medium, and hard difficulties</li>
                <li>10 seconds to answer each question</li>
                <li>Bonus points for quick answers</li>
                <li>Special bonus question if you answer all regular questions correctly</li>
                <li>Perfect for testing your quick thinking and general knowledge</li>
                <li>New random questions every time you play</li>
              </ul>
              <div className="mt-4">
                <h3>Sample Question Types:</h3>
                <p>Questions cover topics like science, history, geography, pop culture, and more. 
                   Each question has four multiple-choice options with one correct answer.</p>
              </div>
            </div>
            
            {/* Question previews for SEO */}
            <div className="mt-6 space-y-6">
              {questions.map((question: Question, index: number) => (
                <div key={question.id} className="question-preview" itemScope itemProp="hasPart" itemType="https://schema.org/Question">
                  <h4 itemProp="name">Question {index + 1}: {question.question}</h4>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <strong>Correct Answer:</strong> <span itemProp="text">{question.correct}</span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {question.options.map((option: string, optIndex: number) => (
                      <li key={optIndex} className="text-gray-700">
                        {option} {option === question.correct ? '(Correct Answer)' : ''}
                      </li>
                    ))}
                  </ul>
                  {question.titbits && (
                    <p className="mt-2 text-sm text-gray-600">💡 {question.titbits}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client-side interactive quiz */}
        <div className="mb-8">
          <QuizGame
            initialQuestions={questions}
            category="quick-fire"
            quizConfig={{
              isQuickfire: true,
              timePerQuestion: 10, // 10 seconds for quick-fire
              hasBonusQuestion: true,
            }}
            quizType="quick-fire"
          />
        </div>

        {/* Enhanced FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Quick-Fire Quiz Information & FAQ</h2>
              <span className="text-gray-500 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
              {/* Content Freshness Info */}
              <div>
                <h3 className="font-semibold">Content Freshness</h3>
                <p className="text-gray-600 text-sm">
                  <strong>Last updated:</strong> {new Date(lastUpdated).toLocaleString()} (Server Time)
                </p>
              </div>

              <div>
                <h3 className="font-semibold">Quiz Mechanics</h3>
                <p className="text-gray-600 text-sm">
                  Questions are randomly selected from our database each time you play. 
                  No two games are exactly the same!
                </p>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What is the Quick-Fire Quiz?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  A fast-paced trivia challenge with 7 random questions. You have only 10 seconds per question 
                  to test your quick thinking and knowledge across various topics.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">How does scoring work?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  You earn more points for answering quickly. Base points depend on question difficulty, 
                  plus bonus points for each second remaining on the timer.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">What is the bonus question?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Answer all 6 regular questions correctly to unlock a special 7th bonus question worth 500 points!
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Are the questions different each time?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Yes! The Quick-Fire quiz pulls 7 random questions from our database each time you play, 
                  so you can enjoy a new challenge every time.
                </p>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="font-semibold" itemProp="name">Is there a time limit for the entire quiz?</h3>
                <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  Each question has a 10-second time limit, but there&apos;s no overall time limit for the entire quiz. 
                  You can take as much time as you need between questions.
                </p>
              </div>
            </div>
          </details>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading quick-fire quiz:', error);
    notFound();
  }
}

// Fixed and enhanced metadata generation
export async function generateMetadata() {
  const title = "Quick-Fire Trivia Challenge | Elite Trivias";
  const description = "Test your reflexes with 10-second quick-fire trivia questions! 7 random questions with bonus round. Free, no signup required.";

  return {
    title,
    description,
    keywords: ["quick fire trivia", "fast trivia", "timed quiz", "quick thinking game", "rapid fire questions", "quick fire quiz", "speed trivia"],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://elitetrivias.com/quick-fire`,
      images: [
        {
          url: '/imgs/quick-fire-og.webp',
          width: 1200,
          height: 630,
          alt: 'Quick-Fire Trivia Challenge - Elite Trivias'
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/imgs/quick-fire-og.webp'],
    },
    alternates: {
      canonical: `https://elitetrivias.com/quick-fire`
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}