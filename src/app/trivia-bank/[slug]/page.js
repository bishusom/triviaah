import { getTriviaData } from '@/lib/tbank';
import TriviaContent from './TriviaContent';
import Link from 'next/link';
import styles from '@/../styles/Blog.module.css';

export default async function TriviaPage({ params }) {
  const { slug } = params;
  const trivia = await getTriviaData(slug);

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