import { getAllTriviaPreviews } from '@/lib/tbank';
import styles from '@/../styles/Blog.module.css';
import TriviaFilter from '@/components/trivia-bank/TriviaFilter';

// Define the type for trivia category previews (matching tbank.ts TriviaPreview)
interface TriviaCategory {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
}

export default async function TriviaBankPage() {
  const triviaCategories: TriviaCategory[] = await getAllTriviaPreviews();

  return (
    <div className={styles.container}>
      <div className={styles['blog-header']}>
        <h1>Trivia Question Bank</h1>
        <div className={styles['tbank-navigation']}>
        </div>
      </div>
      
      {/* Client-side filter component */}
      <TriviaFilter categories={triviaCategories} />
    </div>
  );
}