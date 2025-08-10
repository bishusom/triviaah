'use client';

import { useState, FC } from 'react';
import Link from 'next/link';
import styles from '@/../styles/Blog.module.css';

// Define the type for category data (matching tbank.ts)
interface Category {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
}

// Define props for the component
interface TriviaFilterProps {
  categories: Category[];
}

const TriviaFilter: FC<TriviaFilterProps> = ({ categories }) => {
  const [activeLetter, setActiveLetter] = useState<string>('All');
  
  // Extract all unique first letters from tags
  const allLetters: string[] = Array.from(
    new Set(
      categories.flatMap(category => 
        category.tags.map(tag => tag.charAt(0).toUpperCase())
      )
    )
  ).sort();

  // Filter categories by active letter
  const filteredCategories: Category[] = activeLetter === 'All' 
    ? categories 
    : categories.filter(category => 
        category.tags.some(tag => 
          tag.charAt(0).toUpperCase() === activeLetter
        )
      );

  return (
    <>
      {/* Alphabet filters */}
      <div className={styles['search-filter']}>
        <button
          key="all"
          className={`${styles['alpha-btn']} ${activeLetter === 'All' ? styles.active : ''}`}
          onClick={() => setActiveLetter('All')}
        >
          All
        </button>
        {allLetters.map(letter => (
          <button 
            key={letter} 
            className={`${styles['alpha-btn']} ${activeLetter === letter ? styles.active : ''}`}
            onClick={() => setActiveLetter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Show active filter */}
      <div className={styles['filter-criteria']}>
        Showing results for: <span className={styles['criteria-text']}>{activeLetter}</span>
      </div>

      {/* Trivia cards grid */}
      <div className={styles['blog-grid']}>
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <div key={category.slug} className={styles['blog-card']}>
              <div className={styles['card-content']}>
                <h2 className={styles['post-title']}>
                  <Link href={`/trivia-bank/${category.slug}`}>
                    {category.title}
                  </Link>
                </h2>
                <p className={styles['post-excerpt']}>{category.excerpt}</p>
                <div className={styles['tag-container']}>
                  {category.tags.map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <Link 
                  href={`/trivia-bank/${category.slug}`} 
                  className={styles['read-more']}
                >
                  Take the Quiz →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className={styles['no-results']}>
            <p>No trivia found with tags starting with &quot;{activeLetter}&quot;</p>
          </div>
        )}
      </div>
    </>
  );
};

export default TriviaFilter;