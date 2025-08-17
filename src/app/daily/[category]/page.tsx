import QuizGame from '@/components/trivias/QuizGame';
import { getDailyQuizQuestions } from '@/lib/firebase';
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
    title: `${formattedCategory} Daily Quiz | Triviaah`,
    description: `Test your knowledge with today's ${formattedCategory.toLowerCase()} quiz questions. Challenge yourself and learn something new!`,
    openGraph: {
      title: `${formattedCategory} Daily Quiz | Triviaah`,
      description: `Test your knowledge with today's ${formattedCategory.toLowerCase()} quiz questions. Challenge yourself and learn something new!`,
      url: `https://yourwebsite.com/daily/${category}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formattedCategory} Daily Quiz | Triviaah`,
      description: `Test your knowledge with today's ${formattedCategory.toLowerCase()} quiz questions. Challenge yourself and learn something new!`,
    },
  };
}

export default async function DailyQuizPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  
  if (!category) {
    return notFound();
  }

  const questions = await getDailyQuizQuestions(category);
  
  if (!questions || questions.length === 0) {
    console.error(`No questions found for category: ${category}`);
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <QuizGame initialQuestions={questions} category={category} />
    </div>
  );
}