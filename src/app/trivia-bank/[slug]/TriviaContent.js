// app/trivia-bank/[slug]/TriviaContent.js
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function TriviaContent({ trivia, styles }) {
  const searchParams = useSearchParams();
  const showAnswers = searchParams.get('show') === 'true';

  return (
    <div className={styles.postContainer}>
      <header className={styles.postHeader}>
        <h1 className={styles.postTitle}>{trivia.title}</h1>
        <p className={styles.postExcerpt}>{trivia.excerpt}</p>
      </header>
      
      <article className={styles.postContent}>
        <div className={styles.controls}>
          <Link 
            href={`?show=${!showAnswers}`}
            className={`${styles.answerToggleBtn} ${showAnswers ? styles.active : ''}`}
          >
            <span className="material-icons">
              {showAnswers ? 'visibility_off' : 'visibility'}
            </span>
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </Link>
        </div>
        
        {Object.entries(trivia.levels).map(([level, questions]) => (
          <div key={level} className={`${styles.level} ${styles[`level-${level}`]}`}>
            <h2>
              <strong>{level.charAt(0).toUpperCase() + level.slice(1)} Level</strong>
            </h2>
            <ol className={styles.questionsList}>
              {questions.map((q, i) => (
                <li key={i} className={styles.questionItem}>
                  <div>{q.question}</div>
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
      </article>
    </div>
  );
}