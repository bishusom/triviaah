// app/daily-trivias/[category]/structured-data.tsx
import type { UserLocationInfo } from '@/types/location';
import type { Question } from '@/lib/supabase'; // Import from your existing file

interface StructuredDataProps {
  params: Promise<{ category: string }>;
  locationInfo: UserLocationInfo;
  lastUpdated: string;
  questions: Question[]; // Use the existing Question type
  formattedCategory: string;
}

export async function StructuredData({ 
  params, 
  locationInfo, 
  lastUpdated, 
  questions,
  formattedCategory 
}: StructuredDataProps) {
  
  if (!questions || questions.length === 0) return null;

  const resolvedParams = await params;
  const isQuickfire = resolvedParams.category === 'quick-fire';
  const timePerQuestion = isQuickfire ? 10 : 15;

  // Organization Schema
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

  // Quiz Schema - FIXED: TypeScript now knows 'option' is string
  const quizStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: `${formattedCategory} Daily Quiz`,
    description: `Daily ${formattedCategory.toLowerCase()} trivia challenge with ${questions.length} multiple-choice questions. ${timePerQuestion} seconds per question.`,
    dateCreated: locationInfo.userLocalDate.toISOString().split('T')[0],
    dateModified: lastUpdated,
    numberOfQuestions: questions.length,
    timeRequired: `PT${timePerQuestion * questions.length}S`,
    educationalLevel: 'Beginner',
    assesses: formattedCategory,
    publisher: {
      '@type': 'Organization',
      name: 'Triviaah'
    },
    hasPart: questions.map((question: Question, index: number) => ({
      '@type': 'Question',
      position: index + 1,
      name: question.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: question.correct
      },
      suggestedAnswer: question.options.map((option: string) => ({ // TypeScript knows this is string[]
        '@type': 'Answer',
        text: option
      }))
    }))
  };

  // Article Schema
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Today's ${formattedCategory} Quiz Questions & Answers`,
    description: `Complete list of today's ${formattedCategory.toLowerCase()} trivia questions and answers. Test your knowledge with ${questions.length} challenging questions.`,
    datePublished: locationInfo.userLocalDate.toISOString().split('T')[0],
    dateModified: lastUpdated,
    author: {
      '@type': 'Organization',
      name: 'Triviaah'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Triviaah',
      logo: {
        '@type': 'ImageObject',
        url: 'https://triviaah.com/logo.png'
      }
    },
    mainEntity: questions.map((question: Question) => ({
      '@type': 'Question',
      name: question.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: question.correct
      },
      suggestedAnswer: question.options.map((option: string) => ({ // TypeScript knows this is string[]
        '@type': 'Answer',
        text: option
      }))
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
    </>
  );
}