'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import { FC, Suspense } from 'react';

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
interface TriviaContentProps {
  trivia: TriviaData;
  styles: { [key: string]: string };
  showParam?: string | string[] | undefined; 
}

// Utility function to handle tags conversion
function getTagsArray(tags: string[] | string): string[] {
  if (Array.isArray(tags)) {
    return tags;
  }
  if (typeof tags === 'string') {
    return tags.split(',').map(tag => tag.trim());
  }
  return [];
}

// Create a component that uses useSearchParams
function TriviaContentInner({ trivia, styles, showParam }: TriviaContentProps)  {
  const searchParams = useSearchParams();
  const showAnswers = searchParams.get('show') === 'true';

  return (
    <>
      {/* Add dynamic canonical tag for parameter pages */}
      <Head>
          <link
            rel="canonical"
            href={`https://triviaah.com/trivia-bank/${trivia.slug}`}
            key="canonical"
          />
        </Head>
      <div className={styles.postContainer}>
        <header className={styles.postHeader}>
        <h1 className={styles.postTitle}>
            {trivia.header || trivia.title}
          </h1>
          <p className={styles.postExcerpt}>{trivia.excerpt}</p>
          <div className={styles.tags}>
            {getTagsArray(trivia.tags).map((tag, index) => (
              <span key={index} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        </header>
        
        <article className={styles.postContent}>
          <div className={styles.controls}>
            <Link 
              href={`?show=${!showAnswers}`}
              className={`${styles.answerToggleBtn} ${showAnswers ? styles.active : ''}`}
            >
              {/* Eye icons instead of text icons */}
              <svg 
                className={styles.eyeIcon} 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {showAnswers ? (
                  // Closed eye icon (Hide Answers)
                  <>
                    <path d="M2 2L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </>
                ) : (
                  // Open eye icon (Show Answers)
                  <>
                    <path d="M2 12C2 12 5.63636 5 12 5C18.3636 5 22 12 22 12C22 12 18.3636 19 12 19C5.63636 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </>
                )}
              </svg>
              {showAnswers ? 'Hide Answers' : 'Show Answers'}
            </Link>
          </div>
          
          <div className={styles.levelInfo}>
            <p>This {trivia.title.toLowerCase()} trivia collection contains questions across multiple difficulty levels:</p>
            <ul>
              {Object.keys(trivia.levels).map((level) => (
                <li key={level}>
                  <strong>{level.charAt(0).toUpperCase() + level.slice(1)}</strong>: {trivia.levels[level].length} questions
                </li>
              ))}
            </ul>
          </div>
          
          {Object.entries(trivia.levels).map(([level, questions]) => (
            <div key={level} className={`${styles.level} ${styles[`level-${level}`]}`}>
              <h2>
                <strong>{level.charAt(0).toUpperCase() + level.slice(1)} Level Questions</strong>
              </h2>
              <ol className={styles.questionsList}>
                {questions.map((q, i) => (
                  <li key={i} className={styles.questionItem}>
                    <div className={styles.questionText}>{q.question}</div>
                    {showAnswers && q.answer && (
                      <div className={styles.answer}>
                        <strong>Answer:</strong> {q.answer}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}
          
          <div className={styles.usageTips}>
            <h3>How to Use These {trivia.title} Trivia Questions</h3>
            <p>These questions are perfect for:</p>
            <ul>
              <li>Creating your own trivia night</li>
              <li>Classroom activities and educational purposes</li>
              <li>Team building exercises</li>
              <li>Family game nights</li>
              <li>Testing your knowledge of {trivia.title.toLowerCase()}</li>
            </ul>
          </div>
          
          <div className={styles.navigation}>
            <Link href="/trivia-bank" className={styles.backLink}>
              ← Back to All Trivia Categories
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}

// Loading component for the Suspense fallback
function TriviaContentLoading({ styles }: { styles: { [key: string]: string } }) {
  return (
    <div className={styles.postContainer}>
      <div className={styles.loading}>Loading trivia content...</div>
    </div>
  );
}

// Main component that wraps the inner component with Suspense
const TriviaContent: FC<TriviaContentProps> = ({ trivia, styles }) => {
  return (
    <Suspense fallback={<TriviaContentLoading styles={styles} />}>
      <TriviaContentInner trivia={trivia} styles={styles} />
    </Suspense>
  );
};

export default TriviaContent;