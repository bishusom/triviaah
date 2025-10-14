// app/daily-trivias/[category]/structured-data.tsx
import { getDailyQuizQuestions } from '@/lib/supabase';
import { WithTimezone } from '@/components/common/WithTimezone';
import type { UserLocationInfo } from '@/types/location';

interface StructuredDataProps {
  params: Promise<{
    category: string;
  }>;
}

interface StructuredDataContentProps {
  params: Promise<{ category: string }>;
  locationInfo: UserLocationInfo;
}

export async function StructuredData({ params }: StructuredDataProps) {
  return (
    <WithTimezone>
      {(locationInfo) => (
        <StructuredDataContent 
          params={params} 
          locationInfo={locationInfo} 
        />
      )}
    </WithTimezone>
  );
}

async function StructuredDataContent({ 
  params, 
  locationInfo 
}: StructuredDataContentProps) {
  const resolvedParams = await params;
  const category = resolvedParams.category;
  const questions = await getDailyQuizQuestions(category, locationInfo.userLocalDate);
  
  if (!questions) return null;

  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const isQuickfire = category === 'quick-fire';
  const timePerQuestion = isQuickfire ? 10 : 15;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: `${formattedCategory} Daily Quiz`,
    description: `Daily ${formattedCategory.toLowerCase()} trivia challenge with ${questions.length} multiple-choice questions. ${timePerQuestion} seconds per question.`,
    dateCreated: locationInfo.userLocalDate.toISOString().split('T')[0],
    numberOfQuestions: questions.length,
    timeRequired: `PT${timePerQuestion * questions.length}S`,
    educationalLevel: 'Beginner',
    assesses: formattedCategory,
    hasPart: questions.map((question, index) => ({
      '@type': 'Question',
      position: index + 1,
      name: question.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: question.correct
      },
      suggestedAnswer: question.options.map(option => ({
        '@type': 'Answer',
        text: option
      }))
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}