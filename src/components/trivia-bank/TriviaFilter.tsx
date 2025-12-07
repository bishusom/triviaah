'use client';

import { useState, FC, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  slug: string;
  title: string;
  header: string;
  excerpt: string;
  tags: string[] | string;
}

interface TriviaFilterProps {
  categories: Category[];
}

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
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Extract all unique first characters
  const allFirstChars: string[] = Array.from(
    new Set(
      categories.flatMap(category => {
        const tagsArray = getTagsArray(category.tags);
        
        if (tagsArray.length > 0) {
          return tagsArray
            .filter(tag => tag.length > 0)
            .map(tag => {
              const firstChar = tag.charAt(0).toUpperCase();
              return /[A-Z0-9]/.test(firstChar) ? firstChar : null;
            })
            .filter((char): char is string => char !== null);
        }
        
        if (category.header && category.header.length > 0) {
          const firstChar = category.header.replace(/[^a-zA-Z0-9]/g, '').charAt(0)?.toUpperCase();
          return firstChar && /[A-Z0-9]/.test(firstChar) ? firstChar : null;
        }
        
        return null;
      }).filter((char): char is string => char !== null)
    )
  ).sort((a, b) => {
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
    
    let firstCharToCheck = '';
    if (tagsArray.length > 0) {
      firstCharToCheck = tagsArray[0]?.charAt(0).toUpperCase() || '';
    } else if (category.header && category.header.length > 0) {
      firstCharToCheck = category.header.replace(/[^a-zA-Z0-9]/g, '').charAt(0)?.toUpperCase() || '';
    }
    
    const letterMatch = activeLetter === 'All' || firstCharToCheck === activeLetter;
    
    const searchMatch = searchTerm === '' || 
      category.header.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.title && category.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tagsArray.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return letterMatch && searchMatch;
  });

  // SSR/Client rendering handling
  if (!isClient) {
    return (
      <>
        {/* Search input - render during SSR */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search trivia categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        {/* Loading state for filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium" disabled>
            All
          </button>
          <div className="hidden">Loading filters...</div>
        </div>

        {/* Render categories without filtering during SSR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => {
            const tagsArray = getTagsArray(category.tags);
            return (
              <div key={category.slug} className="flex flex-col overflow-hidden rounded-xl shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex flex-col flex-grow p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    <Link href={`/trivia-bank/${category.slug}`} className="hover:text-blue-600 transition-colors">
                      {category.header}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4 flex-grow">{category.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tagsArray.length > 0 ? (
                      <>
                        {tagsArray.slice(0, 5).map(tag => (
                          <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            #{tag}
                          </span>
                        ))}
                        {tagsArray.length > 5 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                            +{tagsArray.length - 5} more
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        #trivia
                      </span>
                    )}
                  </div>
                  <Link 
                    href={`/trivia-bank/${category.slug}`} 
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline self-start"
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
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search trivia categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>

      {/* Alphabet and number filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          key="all"
          className={`px-4 py-2 rounded-full font-medium transition-colors ${activeLetter === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => setActiveLetter('All')}
        >
          All
        </button>
        {allFirstChars.map(char => (
          <button 
            key={char} 
            className={`px-4 py-2 rounded-full font-medium transition-colors ${activeLetter === char ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setActiveLetter(char)}
          >
            {char}
          </button>
        ))}
      </div>

      {/* Show active filter */}
      {(activeLetter !== 'All' || searchTerm) && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-gray-700">Showing results for:</span>
            {activeLetter !== 'All' && (
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                Letter: {activeLetter}
              </span>
            )}
            {searchTerm && (
              <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                Search: &quot;{searchTerm}&quot;
              </span>
            )}
            <span className="text-gray-600 ml-auto">
              {filteredCategories.length} result{filteredCategories.length !== 1 ? 's' : ''} found
            </span>
            {(activeLetter !== 'All' || searchTerm) && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setActiveLetter('All');
                }}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Trivia cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => {
            const tagsArray = getTagsArray(category.tags);
            return (
              <div key={category.slug} className="flex flex-col overflow-hidden rounded-xl shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-all hover:scale-[1.02]">
                <div className="flex flex-col flex-grow p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    <Link href={`/trivia-bank/${category.slug}`} className="hover:text-blue-600 transition-colors">
                      {category.header}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{category.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tagsArray.length > 0 ? (
                      <>
                        {tagsArray.slice(0, 5).map(tag => (
                          <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            #{tag}
                          </span>
                        ))}
                        {tagsArray.length > 5 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                            +{tagsArray.length - 5} more
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        #trivia
                      </span>
                    )}
                  </div>
                  <Link 
                    href={`/trivia-bank/${category.slug}`} 
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline self-start mt-auto"
                  >
                    Take the Quiz →
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No trivia found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? `No results for "${searchTerm}"` : `No categories starting with "${activeLetter}"`}
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setActiveLetter('All');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Clear filters & show all
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default TriviaFilter;