import QuizGame from '@/components/trivias/QuizGame';
import { getDailyQuizQuestions } from '@/lib/firebase';
import { notFound } from 'next/navigation';

export default async function DailyQuizPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  // Await the params Promise
  const { category } = await params;
  
  // Add validation for the category
  if (!category) {
    return notFound();
  }

  const questions = await getDailyQuizQuestions(category);
  
  if (!questions || questions.length === 0) {
    console.error(`No questions found for category: ${category}`);
    return notFound();
  }

  return <QuizGame initialQuestions={questions} category={category} />;
}