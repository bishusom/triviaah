// app/daily-trivias/[category]/page.tsx (Updated Header Section)
import { getDailyQuizQuestions, getRandomQuestions, getTodaysHistoryQuestions,type Question } from '@/lib/supabase';
import QuizGame from '@/components/trivias/QuizGame';
import { notFound } from 'next/navigation';
import { StructuredData } from './structured-data';
import { WithTimezone } from '@/components/common/WithTimezone';
import { TimezoneInfo } from '@/components/common/TimezoneInfo';
import { FAQSection } from './FAQSection';
import type { UserLocationInfo } from '@/types/location';
import { Timer, ShieldQuestionMark, Trophy, Play } from 'lucide-react';

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

interface QuizConfig {
  isQuickfire: boolean;
  timePerQuestion: number;
  hasBonusQuestion: boolean;
}

const categoryConfigs = {
  'quick-fire': {
    name: 'Quick Fire',
    color: 'from-orange-500 to-red-500',
    icon: '⚡',
    description: 'Rapid-fire questions to test your speed and knowledge'
  },
  'general-knowledge': {
    name: 'General Knowledge',
    color: 'from-blue-500 to-cyan-500',
    icon: '🌎',
    description: 'Diverse topics from around the world'
  },
  'today-in-history': {
    name: 'Today in History',
    color: 'from-amber-500 to-orange-500',
    icon: '📅',
    description: 'Historical events from this date'
  },
  'entertainment': {
    name: 'Entertainment',
    color: 'from-purple-500 to-pink-500',
    icon: '🎬',
    description: 'Movies, music & pop culture'
  },
  'geography': {
    name: 'Geography',
    color: 'from-green-500 to-emerald-500',
    icon: '🗺️',
    description: 'Countries, capitals & landmarks'
  },
  'science': {
    name: 'Science & Nature',
    color: 'from-cyan-500 to-blue-500',
    icon: '🔬',
    description: 'Science wonders & animal kingdom'
  },
  'arts-literature': {
    name: 'Arts & Literature',
    color: 'from-pink-500 to-rose-500',
    icon: '🎨',
    description: 'Great authors & artistic masterpieces'
  },
  'sports': {
    name: 'Sports',
    color: 'from-red-500 to-orange-500',
    icon: '⚽',
    description: 'Athletes, records & iconic moments'
  }
};

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
    let questions: Question[];

    if (category === 'quick-fire') {
      questions = await getRandomQuestions(7, ['easy', 'medium', 'hard']);
    } else if (category === 'today-in-history') {
      questions = await getTodaysHistoryQuestions(10, locationInfo.userLocalDate);
    } else {
      questions = await getDailyQuizQuestions(category, locationInfo.userLocalDate);
    }
    
    if (!questions || questions.length === 0) {
      notFound();
    }

    const categoryConfig = categoryConfigs[category as keyof typeof categoryConfigs] || {
      name: category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      color: 'from-cyan-500 to-blue-500',
      icon: '❓',
      description: 'Daily trivia challenge'
    };

    const formattedCategory = categoryConfig.name;
    const isQuickfire = category === 'quick-fire';
    const timePerQuestion = isQuickfire ? 15 : 30;
    const hasBonusQuestion = isQuickfire;

    const quizConfig: QuizConfig = {
      isQuickfire,
      timePerQuestion,
      hasBonusQuestion
    };

    const lastUpdated = new Date().toISOString();

    return (
      <div className="max-w-full md:max-w-4xl lg:max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <StructuredData 
          params={params} 
          locationInfo={locationInfo}
          lastUpdated={lastUpdated}
          questions={questions}
          formattedCategory={formattedCategory}
        />
        
        {/* Updated Hero Header */}
        <div className="text-center mb-8" itemScope itemType="https://schema.org/Quiz">
          {/* Main Title with Icon */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-md shadow-lg">
                <Play className="w-3 h-3 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {formattedCategory} Daily Quiz
              </h1>
            </div>
          </div>

          {/* Description 
          <p className="text-gray-300 text-base sm:text-bs mb-6 max-w-2xl mx-auto">
            {categoryConfig.description}
          </p>
          */}
          {/* Updated Quiz Stats 
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto mb-6">
            <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
              <ShieldQuestionMark className="text-xl text-cyan-400" />
              <div className="text-left">
                <div className="text-white font-bold text-sm">{questions.length}</div>
                <div className="text-gray-400 text-xs">Questions</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
              <Timer className="text-xl text-yellow-400" />
              <div className="text-left">
                <div className="text-white font-bold text-sm">{timePerQuestion}s</div>
                <div className="text-gray-400 text-xs">Per Question</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
              <span className="text-xl">⏱️</span>
              <div className="text-left">
                <div className="text-white font-bold text-sm">{Math.round((timePerQuestion * questions.length) / 60)}min</div>
                <div className="text-gray-400 text-xs">Total Time</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
              <Trophy className="text-xl text-green-400" />
              <div className="text-left">
                <div className="text-white font-bold text-sm">{hasBonusQuestion ? 'Yes' : 'No'}</div>
                <div className="text-gray-400 text-xs">Bonus Round</div>
              </div>
            </div>
          </div>
          */}

          {/* Time Info */}
          <div className="flex flex-col items-center gap-3 text-sm">
            <TimezoneInfo locationInfo={locationInfo} />
          </div>
        </div>

        {/* Quiz Game Component */}
        <div className="mb-8">
          <QuizGame 
            initialQuestions={questions} 
            category={category} 
            quizConfig={quizConfig}
            quizType="daily-trivias"
          />
        </div>

        {/* Hidden SEO Content */}
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

        {/* FAQ Section */}
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

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const categoryConfig = categoryConfigs[resolvedParams.category as keyof typeof categoryConfigs] || {
    name: resolvedParams.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    description: 'Daily trivia challenge'
  };

  const isQuickfire = resolvedParams.category === 'quick-fire';
  const timePerQuestion = isQuickfire ? 10 : 15;

  const title = `${categoryConfig.name} Daily Quiz | Triviaah`;
  const description = `Test your ${categoryConfig.name.toLowerCase()} knowledge with ${timePerQuestion}-second daily trivia questions. ${isQuickfire ? 'Quickfire challenge with bonus round!' : 'New challenges every day!'} Free, no signup required.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://triviaah.com/daily-trivias/${resolvedParams.category}`,
      images: [{
        url: `/imgs/${resolvedParams.category}-og.webp`,
        width: 1200,
        height: 630,
        alt: `${categoryConfig.name} Daily Quiz`,
      }],
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