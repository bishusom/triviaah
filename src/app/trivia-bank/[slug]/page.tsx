import { getTriviaData, getAllTriviaPreviews } from '@/lib/tbank';
import TriviaContent from '@/components/trivia-bank/TriviaContent';
import Link from 'next/link';
import styles from '@/../styles/Blog.module.css';
import { Metadata } from 'next';
import { Suspense } from 'react';

// Define the type for params
interface Params {
  slug: string;
}

// Define the type for trivia data (based on new front matter structure)
interface TriviaData {
  slug: string;
  title: string;
  header: string;
  excerpt: string;
  tags: string[] | string; // Allow both array and string
  levels: {
    [key: string]: Array<{
      question: string;
      answer: string;
    }>;
  };
}

// Define props for the component
interface TriviaPageProps {
  params: Promise<Params>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate metadata for each trivia page
export async function generateMetadata({ params }: TriviaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trivia: TriviaData | null = await getTriviaData(slug);

  if (!trivia) {
    return {
      title: 'Trivia Not Found | Triviaah',
      description: 'The requested trivia category could not be found.',
    };
  }

  // Convert tags to array if it's a string
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
    // Add this to handle parameter variations
    other: {
      'google-news-standby': 'URL',
    },
  };
}

// Generate static params for all trivia pages
export async function generateStaticParams() {
  const triviaCategories = await getAllTriviaPreviews();
  
  return triviaCategories.map((trivia) => ({
    slug: trivia.slug,
  }));
}

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className={styles.container}>
      <div className={styles.loading}>Loading trivia questions...</div>
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
      <div className={styles.container}>
        <h1>Trivia Not Found</h1>
        <p>The requested trivia category could not be found.</p>
        <Link href="/trivia-bank" className={styles.backLink}>
          ← Back to All Trivia Categories
        </Link>
      </div>
    );
  }

  // Pass trivia data to client component wrapped in Suspense
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TriviaContent trivia={trivia} styles={styles} showParam={showParam} />
    </Suspense>
  );
}