import QuizGame from '@/components/trivias/QuizGame';
import { getCategoryQuestions, getSubcategoryQuestions, Question } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';

interface QuizPageProps {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: QuizPageProps): Promise<Metadata> {
  const { category } = await params;
  const searchParamsObj = await searchParams;
  const subcategory = searchParamsObj?.subcategory as string | undefined;
  
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const formattedSubcategory = subcategory 
    ? subcategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : null;

  const title = formattedSubcategory 
    ? `${formattedSubcategory} ${formattedCategory} Quiz | Triviaah`
    : `${formattedCategory} Quiz | Triviaah`;

  const description = formattedSubcategory
    ? `Test your ${formattedSubcategory.toLowerCase()} knowledge with our ${formattedCategory.toLowerCase()} quiz. Challenge yourself with 10 multi-choice questions to beat the highscore. Invite your friends on social media if they can beat your scores!`
    : `Test your knowledge with our ${formattedCategory.toLowerCase()} quiz. Challenge yourself with 10 multi-choice questions to beat the highscore. Invite your friends on social media if they can beat your scores!`;

  return {
    title,
    description,
    robots: 'index, follow',
    keywords: [
      formattedSubcategory ? `${formattedSubcategory.toLowerCase()} quiz` : `${formattedCategory.toLowerCase()} quiz`,
      'trivia questions',
      'knowledge test',
      formattedCategory.toLowerCase(),
      ...(formattedSubcategory ? [formattedSubcategory.toLowerCase()] : [])
    ],
    openGraph: {
      title,
      description: formattedSubcategory
        ? `Can you answer these ${formattedSubcategory.toLowerCase()} ${formattedCategory.toLowerCase()} questions? Take the challenge!`
        : `Can you answer these ${formattedCategory.toLowerCase()} questions? Take the challenge!`,
      url: `https://triviaah.com/trivias/${category}/quiz${subcategory ? `?subcategory=${encodeURIComponent(subcategory)}` : ''}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: formattedSubcategory 
        ? `${formattedSubcategory} ${formattedCategory} Quiz Challenge`
        : `${formattedCategory} Quiz Challenge`,
      description: formattedSubcategory
        ? `How well do you know ${formattedSubcategory.toLowerCase()} ${formattedCategory.toLowerCase()}? Test yourself!`
        : `How well do you know ${formattedCategory.toLowerCase()}? Test yourself!`,
    },
    alternates: {
      canonical: `https://triviaah.com/trivias/${category}/quiz${subcategory ? `?subcategory=${encodeURIComponent(subcategory)}` : ''}`,
    }
  };
}

// Helper function to generate structured data without extra DB calls
function generateStructuredData(questions: Question[], category: string) {
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

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
      'suggestedAnswer': [
        ...question.options.map((answer: string) => ({
          '@type': 'Answer',
          'text': answer
        })),
        {
          '@type': 'Answer',
          'text': question.correct
        }
      ],
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': question.correct
      }
    }))
  };

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

  return [websiteSchema, faqSchema, quizSchema];
}

export default async function QuizPage({
  params,
  searchParams,
}: QuizPageProps) {
  try {
    const { category } = await params;
    const searchParamsObj = await searchParams;
    const subcategory = searchParamsObj?.subcategory as string | undefined;
    
    if (!category || typeof category !== 'string') {
      console.error('Invalid category parameter:', category);
      return notFound();
    }

    let questions;
    if (subcategory) {
      questions = await getSubcategoryQuestions(category, subcategory, 10);
    } else {
      questions = await getCategoryQuestions(category, 10);
    }

    if (!questions || questions.length === 0) {
      console.error(`No questions found for category: ${category}${subcategory ? `, subcategory: ${subcategory}` : ''}`);
      return notFound();
    }

    // Generate structured data using the questions we already fetched
    const structuredData = generateStructuredData(questions, category);

    return (
      <div className="quiz-container max-w-4xl mx-auto px-4 py-8">
        <h1 className="sr-only">
          {subcategory 
            ? `${subcategory.replace(/-/g, ' ')} ${category.replace(/-/g, ' ')} Questions - Triviaah`
            : `${category.replace(/-/g, ' ')} Questions - Triviaah`
          }
        </h1>
        
        {/* Inject structured data directly */}
        <Script
          id="quiz-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <QuizGame 
          initialQuestions={questions} 
          category={category}
          subcategory={subcategory}
          quizConfig={{}}
          quizType="trivias"
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading quiz page:', error);
    return notFound();
  }
}