import QuizGame from '@/components/trivias/QuizGame';
import { getCategoryQuestions } from '@/lib/firebase';
import { notFound } from 'next/navigation';

export default async function QuizPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
    // Properly destructure params first
  const { category } = await params;
  if (!category || typeof category !== 'string') {
    console.error('Invalid category parameter:', category);
    return notFound();
  }
  // Fetch questions for the given category
  console.log(`Fetching questions for category: ${category}`);
  // Ensure getCategoryQuestions is defined and imported correctly
  if (typeof getCategoryQuestions !== 'function') {
    console.error('getCategoryQuestions is not a function');
    return notFound();
  }
  // Fetch questions, assuming it returns a promise that resolves to an array of questions
  console.log(`Calling getCategoryQuestions with category: ${category}`);
  // Adjust the number of questions as needed, here we fetch 10

  const questions = await getCategoryQuestions(category, 10);

  if (!questions || questions.length === 0) {
    console.error(`No questions found for category: ${category}`);
    return notFound();
  }

  return (
    <div className="quiz-container">
      <h1 className="sr-only">{category} Questions - Triviaah</h1>
      <QuizGame initialQuestions={questions} category={category} />
    </div>
  );
}