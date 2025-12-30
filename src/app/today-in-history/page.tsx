// app/today-in-history/page.tsx
import QuizGame from '@/components/trivias/QuizGame';
import { getTodaysHistoryQuestions } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { WithTimezone } from '@/components/common/WithTimezone';
import { TimezoneInfo } from '@/components/common/TimezoneInfo';
import MuteButton from '@/components/common/MuteButton';
import type { UserLocationInfo } from '@/types/location';
import type { Question } from '@/lib/supabase';

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
    const questions: Question[] = await getTodaysHistoryQuestions(10, locationInfo.userLocalDate);
    
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

    // Server timestamp for last updated
    const lastUpdated = new Date().toISOString();

    return (
      <div className="no-ads-page">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Enhanced Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Quiz",
                "name": `On This Day in History - ${displayDate}`,
                "description": `Historical events quiz for ${displayDate}. Test your knowledge of what happened on this day in history.`,
                "dateCreated": locationInfo.userLocalDate.toISOString().split('T')[0],
                "dateModified": lastUpdated,
                "numberOfQuestions": questions.length,
                "about": "History, Historical Events, Famous Dates",
                "educationalAlignment": {
                  "@type": "AlignmentObject",
                  "alignmentType": "educationalSubject",
                  "targetName": "History"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "Triviaah",
                  "url": "https://triviaah.com"
                },
                "hasPart": questions.map((q: Question, index: number) => ({
                  "@type": "Question",
                  "name": q.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": q.correct
                  },
                  "suggestedAnswer": q.options.map((option: string) => ({
                    "@type": "Answer",
                    "text": option
                  })),
                  "position": index + 1
                })),
              })
            }}
          />

          {/* Organization Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Triviaah",
                "url": "https://triviaah.com",
                "description": "Free daily trivia quizzes and challenges across multiple categories including general knowledge, history, entertainment, and more.",
                "logo": "https://triviaah.com/logo.png",
                "sameAs": [],
                "foundingDate": "2024",
                "knowsAbout": ["Trivia", "Quiz Games", "General Knowledge", "Educational Entertainment", "History"]
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
                    "name": "How does the 'Today in History' quiz work?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Each day features historical events that actually occurred on that exact date. The quiz updates daily at midnight in your local timezone and is personalized based on your detected location."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What types of historical events are included?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "We cover a wide range of historical events including political milestones, scientific discoveries, cultural events, famous birthdays, and important anniversaries from throughout history."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Are the questions accurate?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! All historical events are verified from reliable sources. Each question includes interesting context and facts to help you learn more about history."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Why do I see different dates than my friends?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "The quiz uses your local timezone to determine today's date. If you and your friends are in different timezones, you might see quizzes for different dates."
                    }
                  }
                ]
              })
            }}
          />
          
          {/* Server-rendered SEO content with enhanced schema */}
          <div className="text-center mb-8" itemScope itemType="https://schema.org/Quiz">
            <meta itemProp="dateModified" content={lastUpdated} />
            <div className="flex justify-center items-center gap-4 mb-3">
              <h1 className="text-3xl font-bold mb-2" itemProp="name">
                On This Day in History - {displayDate}
              </h1>
              {/* Last Updated Timestamp */}
              <time 
                dateTime={lastUpdated} 
                className="bg-blue-50 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
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
            <p className="text-gray-600 mb-3 text-lg">
              {displayDate} • Daily Historical Events Quiz
            </p>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-4">
              Test your knowledge of historical events that happened on this exact day throughout history. 
              How well do you know your dates?
            </p>
            <TimezoneInfo locationInfo={locationInfo} />
          </div>

          {/* Enhanced hidden but indexable quiz content for SEO */}
          <div className="sr-only" aria-hidden="false">
            <div itemScope itemType="https://schema.org/Article">
              <meta itemProp="datePublished" content={locationInfo.userLocalDate.toISOString().split('T')[0]} />
              <meta itemProp="dateModified" content={lastUpdated} />
              <h2 itemProp="headline">Today in History Quiz Questions - {displayDate}</h2>
              <p itemProp="description">
                Historical events quiz for {displayDate}. Test your knowledge with {questions.length} questions about what happened on this day in history.
              </p>
              <div className="space-y-4">
                <h3>About This Historical Quiz:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>{questions.length} questions about historical events that occurred on {displayDate}</li>
                  <li>Questions cover various historical periods and events</li>
                  <li>Learn interesting facts and historical context</li>
                  <li>Perfect for history enthusiasts and trivia lovers</li>
                  <li>Updated daily at midnight in your local timezone ({locationInfo.timezone})</li>
                </ul>
                <div className="mt-4">
                  <h3>Sample Historical Topics:</h3>
                  <p>Questions cover historical events, famous birthdays, scientific discoveries, political milestones, 
                    cultural events, and important anniversaries that all happened on this day in history.</p>
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

          {/* Mute Button */}
          <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
            <MuteButton />
          </div>

          {/* Client-side interactive quiz */}
          <div className="mb-8">
            <QuizGame 
              initialQuestions={questions} 
              category="today-in-history"
              quizConfig={{}}
              quizType="daily-trivias"
            />
          </div>

          {/* Enhanced FAQ Section */}
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <h2 className="text-xl font-bold">Historical Quiz Information & FAQ</h2>
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
                  <h3 className="font-semibold">Timezone Information</h3>
                  <p className="text-gray-600 text-sm">
                    Historical quizzes update at midnight in your local timezone ({locationInfo.timezone}).
                    Detected via your IP address for accurate date personalization.
                  </p>
                </div>

                <div itemScope itemType="https://schema.org/Question">
                  <h3 className="font-semibold" itemProp="name">How does the &ldquo;Today in History&rdquo; quiz work?</h3>
                  <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    Each day features historical events that actually occurred on that exact date. 
                    The quiz updates daily at midnight in your local timezone and is personalized based on your detected location.
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
                    The quiz uses your local timezone to determine today&apos;s date. If you and your friends 
                    are in different timezones, you might see quizzes for different dates.
                  </p>
                </div>
                <div itemScope itemType="https://schema.org/Question">
                  <h3 className="font-semibold" itemProp="name">How often is the historical content updated?</h3>
                  <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    Our historical database is continuously updated with new events and facts. The daily quiz 
                    content refreshes every 24 hours with new questions specific to each date.
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