// app/trivia-result/page.tsx
import { Metadata } from 'next';

type Props = {
  searchParams: {
    score?: string;
    correct?: string;
    total?: string;
    category?: string;
    time?: string;
  };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { score, correct, total, category, time } = searchParams;
  
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

export default function TriviaResultPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Thanks for sharing!</h1>
        <p className="mb-6">Your trivia results have been shared successfully.</p>
        <a 
          href="/" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Play Again
        </a>
      </div>
    </div>
  );
}