import QuizGame from '@/components/trivias/QuizGame';
import { getCategoryQuestions, getSubcategoryQuestions } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import StructuredData from './structured-data';

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
    ? `Test your ${formattedSubcategory.toLowerCase()} knowledge with our ${formattedCategory.toLowerCase()} quiz. Challenge yourself with 10 questions!`
    : `Test your knowledge with our ${formattedCategory.toLowerCase()} quiz. Challenge yourself with 10 questions!`;

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

    return (
      <div className="quiz-container max-w-4xl mx-auto px-4 py-8">
        <h1 className="sr-only">
          {subcategory 
            ? `${subcategory.replace(/-/g, ' ')} ${category.replace(/-/g, ' ')} Questions - Triviaah`
            : `${category.replace(/-/g, ' ')} Questions - Triviaah`
          }
        </h1>
        <StructuredData params={params} />
        <QuizGame 
          initialQuestions={questions} 
          category={category}
          subcategory={subcategory}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading quiz page:', error);
    return notFound();
  }
}