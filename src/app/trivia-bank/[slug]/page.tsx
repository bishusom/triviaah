import { getTriviaData, getAllTriviaPreviews } from '@/lib/tbank';
import TriviaContent from '@/components/trivia-bank/TriviaContent';
import Link from 'next/link';
import { Metadata } from 'next';

interface Params {
  slug: string;
}

interface TriviaData {
  slug: string;
  title: string;
  header: string;
  excerpt: string;
  tags: string[] | string;
  levels: {
    [key: string]: Array<{
      question: string;
      answer: string;
    }>;
  };
}

interface TriviaPageProps {
  params: Promise<Params>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: TriviaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trivia: TriviaData | null = await getTriviaData(slug);

  if (!trivia) {
    return {
      title: 'Trivia Not Found | Triviaah',
      description: 'The requested trivia category could not be found.',
    };
  }

  const tagsArray = typeof trivia.tags === 'string' 
    ? trivia.tags.split(',').map(tag => tag.trim())
    : trivia.tags;

  return {
    title: `${trivia.title} Questions with Answers | Triviaah`,
    description: `${trivia.excerpt} Browse our ${trivia.title.toLowerCase()} trivia questions with answers for all difficulty levels.`,
    keywords: `${trivia.title.toLowerCase()} trivia, ${trivia.title.toLowerCase()} quiz, ${trivia.title.toLowerCase()} questions and answers, ${tagsArray.join(', ')}`,
    alternates: {
      canonical: `https://triviaah.com/trivia-bank/${trivia.slug}`,
    },
    openGraph: {
      title: `${trivia.title} Questions | Triviaah`,
      description: trivia.excerpt,
      type: 'article',
      tags: tagsArray,
    },
  };
}

export async function generateStaticParams() {
  const triviaCategories = await getAllTriviaPreviews();
  
  return triviaCategories.map((trivia) => ({
    slug: trivia.slug,
  }));
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-lg text-gray-600">Loading trivia questions...</div>
    </div>
  );
}

export default async function TriviaPage({ params, searchParams }: TriviaPageProps) {
  const { slug } = await params;
  const queryParams = await searchParams;
  const showParam = queryParams?.show;
  
  const trivia: TriviaData | null = await getTriviaData(slug);

  if (!trivia) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Trivia Not Found</h1>
        <p className="text-gray-600 mb-6">The requested trivia category could not be found.</p>
        <Link 
          href="/trivia-bank" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Back to All Trivia Categories
        </Link>
      </div>
    );
  }

  return <TriviaContent trivia={trivia} showParam={showParam} />;
}