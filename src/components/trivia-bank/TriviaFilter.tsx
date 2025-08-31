'use client';

import { useState, FC, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/../styles/Blog.module.css';

// Define the type for category data (matching tbank.ts)
interface Category {
  slug: string;
  title: string;
  header: string;
  excerpt: string;
  tags: string[] | string;
}

// Define props for the component
interface TriviaFilterProps {
  categories: Category[];
}

// Utility function to handle both string and array tags
function getTagsArray(tags: string[] | string): string[] {
  if (Array.isArray(tags)) {
    return tags;
  }
  if (typeof tags === 'string') {
    return tags.split(',').map(tag => tag.trim());
  }
  return [];
}

const TriviaFilter: FC<TriviaFilterProps> = ({ categories }) => {
  const [activeLetter, setActiveLetter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true after component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Extract all unique first characters - use a deterministic approach
  const allFirstChars: string[] = Array.from(
    new Set(
      categories.flatMap(category => {
        const tagsArray = getTagsArray(category.tags);
        
        // If tags exist, use them
        if (tagsArray.length > 0) {
          return tagsArray
            .filter(tag => tag.length > 0)
            .map(tag => {
              const firstChar = tag.charAt(0).toUpperCase();
              return /[A-Z0-9]/.test(firstChar) ? firstChar : null;
            })
            .filter((char): char is string => char !== null);
        }
        
        // Fallback: use the first character of the category header
        if (category.header && category.header.length > 0) {
          const firstChar = category.header.replace(/[^a-zA-Z0-9]/g, '').charAt(0)?.toUpperCase();
          return firstChar && /[A-Z0-9]/.test(firstChar) ? firstChar : null;
        }
        
        return null;
      }).filter((char): char is string => char !== null)
    )
  ).sort((a, b) => {
    // Sort numbers first, then letters
    if (!isNaN(Number(a)) && !isNaN(Number(b))) {
      return Number(a) - Number(b);
    }
    if (!isNaN(Number(a))) return -1;
    if (!isNaN(Number(b))) return 1;
    return a.localeCompare(b);
  });

  // Filter categories by active letter and search term
  const filteredCategories: Category[] = categories.filter(category => {
    const tagsArray = getTagsArray(category.tags);
    
    // Determine the first character to filter by (tags fallback to header)
    let firstCharToCheck = '';
    if (tagsArray.length > 0) {
      firstCharToCheck = tagsArray[0]?.charAt(0).toUpperCase() || '';
    } else if (category.header && category.header.length > 0) {
      firstCharToCheck = category.header.replace(/[^a-zA-Z0-9]/g, '').charAt(0)?.toUpperCase() || '';
    }
    
    // Filter by letter
    const letterMatch = activeLetter === 'All' || firstCharToCheck === activeLetter;
    
    // Filter by search term (search in header, excerpt, and tags)
    const searchMatch = searchTerm === '' || 
      category.header.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.title && category.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tagsArray.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return letterMatch && searchMatch;
  });

  // Don't render filter buttons during SSR to avoid hydration mismatch
  if (!isClient) {
    return (
      <>
        {/* Search input - render during SSR */}
        <div className={styles['search-filter']}>
          <input
            type="text"
            placeholder="Search trivia categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Loading state for filter buttons */}
        <div className={styles['search-filter']}>
          <button className={styles['alpha-btn']} disabled>All</button>
          {/* Placeholder for alphabet buttons */}
          <div style={{ display: 'none' }}>Loading filters...</div>
        </div>

        {/* Render categories without filtering during SSR */}
        <div className={styles['blog-grid']}>
          {categories.map(category => {
            const tagsArray = getTagsArray(category.tags);
            return (
              <div key={category.slug} className={styles['blog-card']}>
                <div className={styles['card-content']}>
                  <h2 className={styles['post-title']}>
                    <Link href={`/trivia-bank/${category.slug}`}>
                      {category.header}
                    </Link>
                  </h2>
                  <p className={styles['post-excerpt']}>{category.excerpt}</p>
                  <div className={styles['tag-container']}>
                    {tagsArray.length > 0 ? (
                      <>
                        {tagsArray.slice(0, 5).map(tag => (
                          <span key={tag} className={styles.tag}>#{tag}</span>
                        ))}
                        {tagsArray.length > 5 && (
                          <span className={styles.moreTags}>
                            +{tagsArray.length - 5} more
                          </span>
                        )}
                      </>
                    ) : (
                      <span className={styles.tag}>#trivia</span>
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
            );
          })}
        </div>
      </>
    );
  }

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

      {/* Alphabet and number filters - only render on client */}
      <div className={styles['search-filter']}>
        <button
          key="all"
          className={`${styles['alpha-btn']} ${activeLetter === 'All' ? styles.active : ''}`}
          onClick={() => setActiveLetter('All')}
        >
          All
        </button>
        {allFirstChars.map(char => (
          <button 
            key={char} 
            className={`${styles['alpha-btn']} ${activeLetter === char ? styles.active : ''}`}
            onClick={() => setActiveLetter(char)}
          >
            {char}
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

      {/* Trivia cards grid */}
      <div className={styles['blog-grid']}>
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => {
            const tagsArray = getTagsArray(category.tags);
            return (
              <div key={category.slug} className={styles['blog-card']}>
                <div className={styles['card-content']}>
                  <h2 className={styles['post-title']}>
                    <Link href={`/trivia-bank/${category.slug}`}>
                      {category.header}
                    </Link>
                  </h2>
                  <p className={styles['post-excerpt']}>{category.excerpt}</p>
                  <div className={styles['tag-container']}>
                    {tagsArray.length > 0 ? (
                      <>
                        {tagsArray.slice(0, 5).map(tag => (
                          <span key={tag} className={styles.tag}>#{tag}</span>
                        ))}
                        {tagsArray.length > 5 && (
                          <span className={styles.moreTags}>
                            +{tagsArray.length - 5} more
                          </span>
                        )}
                      </>
                    ) : (
                      <span className={styles.tag}>#trivia</span>
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
            );
          })
        ) : (
          <div className={styles['no-results']}>
            <p>No trivia found {searchTerm ? `for &quot;${searchTerm}&quot;` : `starting with &quot;${activeLetter}&quot;`}</p>
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