// app/quick-fire/page.tsx
import QuizGame from '@/components/trivias/QuizGame';
import { getRandomQuestions } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { WithTimezone } from '@/components/common/WithTimezone';
import { TimezoneInfo } from '@/components/common/TimezoneInfo';
import type { UserLocationInfo } from '@/types/location';
import { i } from 'mathjs';
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

async function QuickFireContent({ locationInfo }: { locationInfo: UserLocationInfo; }) {
  try {
    // Fetch 7 random questions: mix of all difficulties
    const questions = await getRandomQuestions(7, ['easy', 'medium', 'hard']);
    
    if (!questions || questions.length === 0) {
      notFound();
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Quiz",
              "name": "Quick-Fire Trivia Challenge",
              "description": "Test your reflexes and knowledge with 7 random trivia questions. 10 seconds per question with bonus round!",
              "numberOfQuestions": 7,
              "timeRequired": "PT70S",
              "educationalLevel": "Mixed",
              "assesses": "General Knowledge",
            })
          }}
        />
        
        {/* Server-rendered SEO content */}
        <div className="text-center mb-6" itemScope itemType="https://schema.org/Quiz">
          <h1 className="text-3xl font-bold mb-2" itemProp="name">
            ⚡ Quick-Fire Quiz
          </h1>
          <p className="text-gray-600 mb-3" itemProp="description">
            7 random questions • 10 seconds each • Bonus round!
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-2">
            Fast-paced trivia challenge with questions of varying difficulty. 
            Answer quickly for bonus points and unlock the final bonus question!
          </p>
          <TimezoneInfo locationInfo={locationInfo} showCountry={false} />
        </div>

        {/* Hidden but indexable quiz content for SEO */}
        <div className="sr-only" aria-hidden="false">
          <h2>Quick-Fire Quiz Questions</h2>
          <p>Test your knowledge with these random trivia questions. Answer all 7 questions under time pressure!</p>
          <div className="space-y-4">
            <h3>About This Quiz:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>7 random questions from easy, medium, and hard difficulties</li>
              <li>10 seconds to answer each question</li>
              <li>Bonus points for quick answers</li>
              <li>Special bonus question if you answer all regular questions correctly</li>
              <li>Perfect for testing your quick thinking and general knowledge</li>
            </ul>
            <div className="mt-4">
              <h3>Sample Question Types:</h3>
              <p>Questions cover topics like science, history, geography, pop culture, and more. 
                 Each question has four multiple-choice options with one correct answer.</p>
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
          />
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold">Quick-Fire Quiz Information</h2>
              <span className="text-gray-500 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
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

// Generate meta tags for SEO
export async function generateMetadata() {
  const title = "Quick-Fire Trivia Challenge | Triviaah";
  const description = "Test your reflexes with 10-second quick-fire trivia questions! 7 random questions with bonus round. Free, no signup required.";

  return {
    title,
    description,
    alertnates: {
      canonical: `https://triviaah.com/quick-fire`
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://triviaah.com/quick-fire`,
      images: [
        {
          url: '/imgs/quick-fire.webp',
          width: 1200,
          height: 630,
          alt: 'Quick-Fire Trivia Challenge - Triviaah'
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://triviaah.com/quick-fire`
    },
    keywords: ["quick fire trivia", "fast trivia", "timed quiz", "quick thinking game", "rapid fire questions"]
  };
}