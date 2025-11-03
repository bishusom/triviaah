// app/daily-trivias/[category]/page.tsx
import { getDailyQuizQuestions, type Question } from '@/lib/supabase'; // Import type from existing file
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

// Simple interface for quiz config (if you don't have it elsewhere)
interface QuizConfig {
  isQuickfire: boolean;
  timePerQuestion: number;
  hasBonusQuestion: boolean;
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

async function DailyQuizContent({ 
  category, 
  locationInfo,
  params 
}: DailyQuizContentProps) {
  try {
    // Use the existing Question type from supabase
    const questions: Question[] = await getDailyQuizQuestions(category, locationInfo.userLocalDate);
    
    if (!questions || questions.length === 0) {
      notFound();
    }

    const formattedCategory = category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const isQuickfire = category === 'quick-fire';
    const timePerQuestion = isQuickfire ? 10 : 15;
    const hasBonusQuestion = isQuickfire;

    const quizConfig: QuizConfig = {
      isQuickfire,
      timePerQuestion,
      hasBonusQuestion
    };

    const lastUpdated = new Date().toISOString();

    return (
      <div className="max-w-4xl mx-auto px-4 py-4">
        <StructuredData 
          params={params} 
          locationInfo={locationInfo}
          lastUpdated={lastUpdated}
          questions={questions}
          formattedCategory={formattedCategory}
        />
        
        {/* Rest of your component remains exactly the same */}
        <div className="text-center mb-6" itemScope itemType="https://schema.org/Quiz">
          <meta itemProp="dateModified" content={lastUpdated} />
          <h1 className="text-2xl font-bold mb-2" itemProp="name">
            {formattedCategory} Daily Quiz
          </h1>
          <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mb-3">
            <span>{questions.length} questions • {timePerQuestion}s each</span>
            {hasBonusQuestion && <span>• Bonus round!</span>}
            <time 
              dateTime={lastUpdated} 
              className="bg-blue-50 px-2 py-1 rounded text-xs font-medium"
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
          <TimezoneInfo locationInfo={locationInfo} />
        </div>

        <div className="mb-8">
          <QuizGame 
            initialQuestions={questions} 
            category={category} 
            quizConfig={quizConfig}
            quizType="daily-trivias"
          />
        </div>

        <div className="sr-only" aria-hidden="false">
          <div itemScope itemType="https://schema.org/Article">
            <meta itemProp="datePublished" content={locationInfo.userLocalDate.toISOString().split('T')[0]} />
            <meta itemProp="dateModified" content={lastUpdated} />
            <h2 itemProp="headline">Today&apos;s {formattedCategory} Quiz Questions & Answers</h2>
            <p itemProp="description">
              Test your knowledge with these {formattedCategory.toLowerCase()} trivia questions. 
              Try to answer all {questions.length} questions correctly! Updated daily.
            </p>
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="question-preview" itemScope itemProp="hasPart" itemType="https://schema.org/Question">
                  <h3 itemProp="name">Question {index + 1}: {question.question}</h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <strong>Correct Answer:</strong> <span itemProp="text">{question.correct}</span>
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
        </div>

        <FAQSection 
          formattedCategory={formattedCategory}
          hasBonusQuestion={hasBonusQuestion}
          userTimezone={locationInfo.timezone}
          lastUpdated={lastUpdated}
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

  const title = `${formattedCategory} Daily Quiz | Elite Trivias`;
  const description = `Test your ${formattedCategory.toLowerCase()} knowledge with ${timePerQuestion}-second daily trivia questions. ${isQuickfire ? 'Quickfire challenge with bonus round!' : 'New challenges every day!'} Free, no signup required.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://elitetrivias.com/daily-trivias/${resolvedParams.category}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://elitetrivias.com/daily-trivias/${resolvedParams.category}`
    }
  };
}