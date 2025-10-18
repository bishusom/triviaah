// app/today-in-history/page.tsx
import QuizGame from '@/components/trivias/QuizGame';
import { getTodaysHistoryQuestions } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { WithTimezone } from '@/components/common/WithTimezone';
import { TimezoneInfo } from '@/components/common/TimezoneInfo';
import MuteButton from '@/components/common/MuteButton';
import type { UserLocationInfo } from '@/types/location';
export const dynamic = 'force-dynamic';

export default async function TodayInHistoryPage() {
  return (
    <WithTimezone>
      {(locationInfo) => (
        <TodayInHistoryContent locationInfo={locationInfo} />
      )}
    </WithTimezone>
  );
}

async function TodayInHistoryContent({ locationInfo }: { locationInfo: UserLocationInfo }) {
  try {
    // Fetch questions based on user's local date
    const questions = await getTodaysHistoryQuestions(10, locationInfo.userLocalDate);
    
    if (!questions || questions.length === 0) {
      notFound();
    }

    // Format date for display (using user's timezone)
    const displayDate = locationInfo.userLocalDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: locationInfo.timezone
    });

    return (
      <div className="no-ads-page">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Structured Data for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Quiz",
                "name": `On This Day in History - ${displayDate}`,
                "description": `Historical events quiz for ${displayDate}. Test your knowledge of what happened on this day in history.`,
                "dateCreated": locationInfo.userLocalDate.toISOString().split('T')[0],
                "numberOfQuestions": questions.length,
                "about": "History, Historical Events, Famous Dates",
                "educationalAlignment": {
                  "@type": "AlignmentObject",
                  "alignmentType": "educationalSubject",
                  "targetName": "History"
                },
                "hasPart": questions.map((q, index: number) => ({
                  "@type": "Question",
                  "name": q.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": q.correct
                  },
                  "position": index + 1
                })),
              })
            }}
          />
          
          {/* Server-rendered SEO content */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" itemProp="name">
              On This Day in History
            </h1>
            <p className="text-gray-600 mb-3 text-lg">
              {displayDate} • Daily Historical Events Quiz
            </p>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-4">
              Test your knowledge of historical events that happened on this exact day throughout history. 
              How well do you know your dates?
            </p>
            <TimezoneInfo locationInfo={locationInfo} />
          </div>

          {/* Hidden but indexable quiz content for SEO */}
          <div className="sr-only" aria-hidden="false">
            <h2>Today in History Quiz Questions</h2>
            <p>Historical events quiz for {displayDate}. Test your knowledge with {questions.length} questions about what happened on this day in history.</p>
            <div className="space-y-4">
              <h3>About This Historical Quiz:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>{questions.length} questions about historical events that occurred on {displayDate}</li>
                <li>Questions cover various historical periods and events</li>
                <li>Learn interesting facts and historical context</li>
                <li>Perfect for history enthusiasts and trivia lovers</li>
              </ul>
              <div className="mt-4">
                <h3>Sample Historical Topics:</h3>
                <p>Questions cover historical events, famous birthdays, scientific discoveries, political milestones, 
                   cultural events, and important anniversaries that all happened on this day in history.</p>
              </div>
            </div>
          </div>

          {/* Mute Button */}
          <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
            <MuteButton />
          </div>

          {/* Client-side interactive quiz */}
          <div className="mb-8">
            <QuizGame 
              initialQuestions={questions} 
              category="today-in-history"
            />
          </div>

          {/* FAQ Section */}
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <h2 className="text-xl font-bold">Historical Quiz Information</h2>
                <span className="text-gray-500 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
                <div itemScope itemType="https://schema.org/Question">
                  <h3 className="font-semibold" itemProp="name">How does the `&quot;Today in History`&quot; quiz work?</h3>
                  <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    Each day features historical events that actually occurred on that exact date. 
                    The quiz updates daily at midnight in your local timezone.
                  </p>
                </div>
                <div itemScope itemType="https://schema.org/Question">
                  <h3 className="font-semibold" itemProp="name">What types of historical events are included?</h3>
                  <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    We cover a wide range of historical events including political milestones, scientific discoveries, 
                    cultural events, famous birthdays, and important anniversaries from throughout history.
                  </p>
                </div>
                <div itemScope itemType="https://schema.org/Question">
                  <h3 className="font-semibold" itemProp="name">Are the questions accurate?</h3>
                  <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    Yes! All historical events are verified from reliable sources. Each question includes 
                    interesting context and facts to help you learn more about history.
                  </p>
                </div>
                <div itemScope itemType="https://schema.org/Question">
                  <h3 className="font-semibold" itemProp="name">Why do I see different dates than my friends?</h3>
                  <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    The quiz uses your local timezone to determine today`&quot;s date. If you and your friends 
                    are in different timezones, you might see quizzes for different dates.
                  </p>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading today in history quiz:', error);
    notFound();
  }
}