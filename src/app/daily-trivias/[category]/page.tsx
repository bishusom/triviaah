// app/daily-trivias/[category]/page.tsx
import { getDailyQuizQuestions } from '@/lib/supabase';
import QuizGame from '@/components/trivias/QuizGame';
import { notFound } from 'next/navigation';
import { StructuredData } from './structured-data';
import { WithTimezone } from '@/components/common/WithTimezone';
import { TimezoneInfo } from '@/components/common/TimezoneInfo';
import { FAQSection } from './FAQSection';
import type { UserLocationInfo } from '@/types/location';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

interface DailyQuizContentProps {
  category: string;
  locationInfo: UserLocationInfo;
  params: Promise<{ category: string }>;
}

export default async function DailyQuizPage({ params }: PageProps) {
  const resolvedParams = await params;
  const category = resolvedParams.category;

  return (
    <WithTimezone>
      {(locationInfo) => (
        <DailyQuizContent 
          category={category} 
          locationInfo={locationInfo} 
          params={params}
        />
      )}
    </WithTimezone>
  );
}

// Separate component that uses the locationInfo
async function DailyQuizContent({ 
  category, 
  locationInfo,
  params 
}: DailyQuizContentProps) {
  try {
    const questions = await getDailyQuizQuestions(category, locationInfo.userLocalDate);
    
    if (!questions || questions.length === 0) {
      notFound();
    }

    const formattedCategory = category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Configure quiz settings based on category
    const isQuickfire = category === 'quick-fire';
    const timePerQuestion = isQuickfire ? 10 : 15;
    const hasBonusQuestion = isQuickfire;

    const quizConfig = {
      isQuickfire,
      timePerQuestion,
      hasBonusQuestion
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-4">
        <StructuredData params={params} />
        
        {/* Server-rendered SEO content */}
        <div className="text-center mb-6" itemScope itemType="https://schema.org/Quiz">
          <h1 className="text-2xl font-bold mb-2" itemProp="name">
            {formattedCategory} Daily Quiz
          </h1>
          <p className="text-gray-600 mb-3" itemProp="description">
            {questions.length} questions • {timePerQuestion}s each
            {hasBonusQuestion && ' • Bonus round!'}
          </p>
          <TimezoneInfo locationInfo={locationInfo} />
        </div>

        {/* Client-side interactive quiz */}
        <div className="mb-8">
          <QuizGame 
            initialQuestions={questions} 
            category={category} 
            quizConfig={quizConfig}
          />
        </div>

        {/* Hidden but indexable quiz content for SEO */}
        <div className="sr-only" aria-hidden="false">
          <h2>Today&apos;s {formattedCategory} Quiz Questions</h2>
          <p>Test your knowledge with these {formattedCategory.toLowerCase()} trivia questions. 
             Try to answer all {questions.length} questions correctly!</p>
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="question-preview" itemScope itemProp="hasPart" itemType="https://schema.org/Question">
                <h3 itemProp="name">Question {index + 1}: {question.question}</h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <strong>Correct Answer:</strong> {question.correct}
                </div>
                <ul className="mt-2 space-y-1">
                  {question.options.map((option, optIndex) => (
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

        {/* Collapsible FAQ Section */}
        <FAQSection 
          formattedCategory={formattedCategory}
          hasBonusQuestion={hasBonusQuestion}
          userTimezone={locationInfo.timezone}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading daily quiz:', error);
    notFound();
  }
}

// generateMetadata remains the same...
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const formattedCategory = resolvedParams.category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const isQuickfire = resolvedParams.category === 'quick-fire';
  const timePerQuestion = isQuickfire ? 10 : 15;

  const title = `${formattedCategory} Daily Quiz | Triviaah`;
  const description = `Test your ${formattedCategory.toLowerCase()} knowledge with ${timePerQuestion}-second daily trivia questions. ${isQuickfire ? 'Quickfire challenge with bonus round!' : 'New challenges every day!'} Free, no signup required.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://triviaah.com/daily-trivias/${resolvedParams.category}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://triviaah.com/daily-trivias/${resolvedParams.category}`
    }
  };
}