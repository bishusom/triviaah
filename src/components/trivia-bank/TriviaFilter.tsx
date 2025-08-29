'use client';

import { useState, FC } from 'react';
import Link from 'next/link';
import styles from '@/../styles/Blog.module.css';

// Define the type for category data (matching tbank.ts)
interface Category {
  slug: string;
  title: string;
  header: string; // Added header field
  excerpt: string;
  tags: string[];
}

// Define props for the component
interface TriviaFilterProps {
  categories: Category[];
}

const TriviaFilter: FC<TriviaFilterProps> = ({ categories }) => {
  const [activeLetter, setActiveLetter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Extract all unique first letters from tags
  const allLetters: string[] = Array.from(
    new Set(
      categories.flatMap(category => 
        category.tags.map(tag => tag.charAt(0).toUpperCase())
      )
    )
  ).sort();

  // Filter categories by active letter and search term
  const filteredCategories: Category[] = categories.filter(category => {
    // Filter by letter
    const letterMatch = activeLetter === 'All' || 
      category.tags.some(tag => tag.charAt(0).toUpperCase() === activeLetter);
    
    // Filter by search term (search in header, excerpt, and tags)
    const searchMatch = searchTerm === '' || 
      category.header.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return letterMatch && searchMatch;
  });

  return (
    <>
      {/* Search input */}
      <div className={styles['search-filter']}>
        <input
          type="text"
          placeholder="Search trivia categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

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
      {activeLetter !== 'All' && (
        <div className={styles['filter-criteria']}>
          Showing results for: <span className={styles['criteria-text']}>{activeLetter}</span>
        </div>
      )}

      {/* Show search results info */}
      {searchTerm && (
        <div className={styles['filter-criteria']}>
          Search results for: <span className={styles['criteria-text']}>&quot;{searchTerm}&quot;</span>
          {filteredCategories.length > 0 && (
            <span> - {filteredCategories.length} result(s) found</span>
          )}
        </div>
      )}

      {/* Trivia cards grid - UPDATED TO USE HEADER */}
      <div className={styles['blog-grid']}>
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <div key={category.slug} className={styles['blog-card']}>
              <div className={styles['card-content']}>
                {/* Use header instead of title */}
                <h2 className={styles['post-title']}>
                  <Link href={`/trivia-bank/${category.slug}`}>
                    {category.header}
                  </Link>
                </h2>
                <p className={styles['post-excerpt']}>{category.excerpt}</p>
                <div className={styles['tag-container']}>
                  {category.tags.slice(0, 5).map(tag => (
                    <span key={tag} className={styles.tag}>#{tag}</span>
                  ))}
                  {category.tags.length > 5 && (
                    <span className={styles.moreTags}>+{category.tags.length - 5} more</span>
                  )}
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
            <p>No trivia found {searchTerm ? `for &quot;${searchTerm}&quot;` : `with tags starting with &quot;${activeLetter}&quot;`}</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setActiveLetter('All');
              }}
              className={styles.clearButton}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default TriviaFilter;