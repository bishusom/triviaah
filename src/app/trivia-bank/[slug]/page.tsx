import { getTriviaData, getAllTriviaPreviews } from '@/lib/tbank';
import TriviaContent from '@/components/trivia-bank/TriviaContent';
import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading trivia questions...</p>
      </div>
    </div>
  );
}

export default async function TriviaPage({ params }: TriviaPageProps) {
  const { slug } = await params;
  const trivia: TriviaData | null = await getTriviaData(slug);

  if (!trivia) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">Trivia Not Found</h1>
          <p className="text-gray-400 mb-8">The requested trivia category could not be found.</p>
          <Link 
            href="/trivia-bank" 
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            Back to All Trivia Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <TriviaContent trivia={trivia} />
    </Suspense>
  );
}