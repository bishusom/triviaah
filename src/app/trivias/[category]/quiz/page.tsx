import QuizGame from '@/components/trivias/QuizGame';
import { getCategoryQuestions } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${formattedCategory} Quiz | Triviaah`,
    description: `Test your knowledge with our ${formattedCategory.toLowerCase()} quiz. Challenge yourself with 10 questions!`,
    robots: 'index, follow',
    keywords: [
      `${formattedCategory.toLowerCase()} quiz`,
      'trivia questions',
      'knowledge test',
      formattedCategory.toLowerCase()
    ],
    openGraph: {
      title: `${formattedCategory} Quiz | Triviaah`,
      description: `Can you answer these ${formattedCategory.toLowerCase()} questions? Take the challenge!`,
      url: `https://triviaah.com/trivias/${category}/quiz`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formattedCategory} Quiz Challenge`,
      description: `How well do you know ${formattedCategory.toLowerCase()}? Test yourself!`,
    },
    alternates: {
      canonical: `https://triviaah.com/trivias/${category}/quiz`,
    }
  };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  try {
    const { category } = await params;
    
    if (!category || typeof category !== 'string') {
      console.error('Invalid category parameter:', category);
      return notFound();
    }

    const questions = await getCategoryQuestions(category, 10);

    if (!questions || questions.length === 0) {
      console.error(`No questions found for category: ${category}`);
      return notFound();
    }

    return (
      <div className="quiz-container max-w-4xl mx-auto px-4 py-8">
        <h1 className="sr-only">{category.replace(/-/g, ' ')} Questions - Triviaah</h1>
        <QuizGame initialQuestions={questions} category={category} />
      </div>
    );
  } catch (error) {
    console.error('Error loading quiz page:', error);
    return notFound();
  }
}