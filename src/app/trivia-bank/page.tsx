import { getAllTriviaPreviews } from '@/lib/tbank';
import styles from '@/../styles/Blog.module.css';
import TriviaFilter from '@/components/trivia-bank/TriviaFilter';

// Define the type for trivia category previews (matching tbank.ts TriviaPreview)
interface TriviaCategory {
  slug: string;
  title: string;
  header: string;
  excerpt: string;
  tags: string[];
}

export default async function TriviaBankPage() {
  const triviaCategories: TriviaCategory[] = await getAllTriviaPreviews();

  return (
    <div className={styles.container}>
      <div className={styles['blog-header']}>
        <h1>Trivia Question Bank</h1>
        <p className={styles.description}>
          Browse our collection of trivia categories to find questions for your next quiz game
        </p>
        <div className={styles['tbank-navigation']}>
        </div>
      </div>
      
      {/* Client-side filter component */}
      <TriviaFilter categories={triviaCategories} />

      {/* Add SEO content section */}
      <section className={styles['seo-section']}>
        <h2>Create Your Own Online Quiz Games For Free</h2>
        <p>
          Our free trivia question bank allows you to create your own online quiz for free with ease. 
          As one of the best online quiz tools free available, we provide everything you need to 
          create online trivia game free of charge. Whether you need free virtual trivia for teams, 
          trivia games for adults online, or fun quiz games for friends, our question bank has you covered.
        </p>
        <p>
          Looking for free quiz hosting website capabilities? Our platform enables you to create quiz game online free 
          and share it with others. Enjoy free online quiz for team building events or simply test your knowledge 
          with our extensive collection of questions. As a completely free quiz website, we&apos;re committed to 
          providing the best online trivia games experience without any cost.
        </p>
        <ul>
          <li>Create your own trivia game free with our question bank</li>
          <li>Perfect for free virtual trivia games for work and team building</li>
          <li>Enjoy online trivia game with friends and family</li>
          <li>One of the best free quiz sites for trivia enthusiasts</li>
          <li>No cost involved - completely free quiz website</li>
        </ul>
      </section>
    </div>
  );
}