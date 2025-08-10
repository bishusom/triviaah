import { getTriviaData } from '@/lib/tbank';
import TriviaContent from './TriviaContent';
import Link from 'next/link';
import styles from '@/../styles/Blog.module.css';

// Define the type for params
interface Params {
  slug: string;
}

// Define the type for trivia data (based on tbank.ts)
interface TriviaData {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
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
}

export default async function TriviaPage({ params }: TriviaPageProps) {
  const { slug } = await params; // Await the params Promise
  const trivia: TriviaData | null = await getTriviaData(slug);

  if (!trivia) {
    return (
      <div className={styles.container}>
        <h1>Trivia Not Found</h1>
        <Link href="/trivia-bank" className={styles.backLink}>
          ← Back to Trivia Bank
        </Link>
      </div>
    );
  }

  // Pass trivia data to client component
  return <TriviaContent trivia={trivia} styles={styles} />;
}