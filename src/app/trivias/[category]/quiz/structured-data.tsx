// app/trivias/[category]/quiz/structured-data.tsx
import { getCategoryQuestions } from '@/lib/supabase';

export default async function StructuredData({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  
  if (!category || typeof category !== 'string') {
    return null;
  }

  const questions = await getCategoryQuestions(category, 10);

  if (!questions || questions.length === 0) {
    return null;
  }

  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Create FAQ schema for the quiz questions
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': questions.map(question => ({
      '@type': 'Question',
      'name': question.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': question.correct
      }
    }))
  };

  // Create Quiz schema with all questions and answers
  const quizSchema = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    'name': `${formattedCategory} Quiz`,
    'description': `Test your knowledge with our ${formattedCategory.toLowerCase()} quiz. Challenge yourself with ${questions.length} questions!`,
    'numberOfQuestions': questions.length,
    'educationalLevel': 'Beginner',
    'assesses': formattedCategory,
    'hasPart': questions.map((question, index) => ({
      '@type': 'Question',
      'position': index + 1,
      'name': question.question,
      'eduQuestionType': 'Multiple choice',
      'text': question.question,
      // Combine correct and incorrect answers for all options
      'suggestedAnswer': [
        ...question.options.map(answer => ({
          '@type': 'Answer',
          'text': answer
        })),
        {
          '@type': 'Answer',
          'text': question.correct
        }
      ],
      // Mark the correct answer
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': question.correct
      }
    }))
  };

  // WebPage schema for general page information
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': `${formattedCategory} Quiz | Triviaah`,
    'description': `Test your knowledge with our ${formattedCategory.toLowerCase()} quiz. Challenge yourself with ${questions.length} questions!`,
    'url': `https://triviaah.com/trivias/${category}/quiz`,
    'mainEntity': {
      '@type': 'Quiz',
      'name': `${formattedCategory} Quiz`
    }
  };

  const structuredData = [websiteSchema, faqSchema, quizSchema];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}