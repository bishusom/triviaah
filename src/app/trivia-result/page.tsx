// src/app/trivia-result/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

type SearchParams = {
  score?: string;
  correct?: string;
  total?: string;
  category?: string;
  time?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const { score = '0', correct = '0', total = '0', category = 'Trivia', time = '0' } = params;
  
  const title = `${score} Points in ${category} Trivia!`;
  const description = `Scored ${score} points with ${correct}/${total} correct answers in ${time} seconds. Can you beat this?`;
  const imageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og?score=${score}&correct=${correct}&total=${total}&category=${category}&time=${time}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/trivia-result`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function TriviaResultPage({
  searchParams,
}: Props) {
  const params = await searchParams;
  const { score = '0', correct = '0', total = '0', category = 'Trivia', time = '0' } = params;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Thanks for sharing!</h1>
        <p className="mb-6">
          You scored {score} points in {category} trivia!
          Got {correct}/{total} correct in {time} seconds.
        </p>
        <Link 
          href="/" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Play Again
        </Link>
      </div>
    </div>
  );
}