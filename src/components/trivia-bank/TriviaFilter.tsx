'use client';

import { useState, FC, useEffect } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';

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
        <div className="relative mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search trivia categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Loading state for filter buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button className="px-4 py-2 bg-gray-800 border-2 border-gray-700 rounded-lg text-gray-400 cursor-not-allowed" disabled>
            All
          </button>
          {/* Placeholder for alphabet buttons */}
          <div className="hidden">Loading filters...</div>
        </div>

        {/* Render categories without filtering during SSR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => {
            const tagsArray = getTagsArray(category.tags);
            return (
              <div key={category.slug} className="group bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:-translate-y-2">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                    <Link href={`/trivia-bank/${category.slug}`}>
                      {category.header}
                    </Link>
                  </h2>
                  <p className="text-gray-300 mb-4 line-clamp-3">{category.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tagsArray.length > 0 ? (
                      <>
                        {tagsArray.slice(0, 5).map(tag => (
                          <span key={tag} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs border border-purple-500/30">
                            #{tag}
                          </span>
                        ))}
                        {tagsArray.length > 5 && (
                          <span className="bg-gray-700 text-gray-400 px-2 py-1 rounded text-xs">
                            +{tagsArray.length - 5} more
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs border border-purple-500/30">
                        #trivia
                      </span>
                    )}
                  </div>
                  <Link 
                    href={`/trivia-bank/${category.slug}`} 
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold group/link"
                  >
                    Take the Quiz
                    <span className="group-hover/link:translate-x-1 transition-transform">→</span>
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
      <div className="relative mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search trivia categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Alphabet and number filters - only render on client */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <button
          key="all"
          className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-300 ${
            activeLetter === 'All' 
              ? 'bg-purple-600 border-purple-500 text-white' 
              : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
          }`}
          onClick={() => setActiveLetter('All')}
        >
          All
        </button>
        {allFirstChars.map(char => (
          <button 
            key={char} 
            className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-300 ${
              activeLetter === char 
                ? 'bg-purple-600 border-purple-500 text-white' 
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveLetter(char)}
          >
            {char}
          </button>
        ))}
      </div>

      {/* Show active filter */}
      {(activeLetter !== 'All' || searchTerm) && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-4 bg-gray-800/50 px-6 py-3 rounded-xl border border-gray-700">
            <span className="text-gray-400">
              Showing results 
              {activeLetter !== 'All' && (
                <> for: <span className="text-purple-400 font-semibold">{activeLetter}</span></>
              )}
              {searchTerm && (
                <> matching: <span className="text-purple-400 font-semibold">&quot;{searchTerm}&quot;</span></>
              )}
            </span>
            {filteredCategories.length > 0 && (
              <span className="text-green-400 font-semibold">
                {filteredCategories.length} result{filteredCategories.length !== 1 ? 's' : ''} found
              </span>
            )}
            <button 
              onClick={() => {
                setSearchTerm('');
                setActiveLetter('All');
              }}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <X size={16} />
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Trivia cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => {
            const tagsArray = getTagsArray(category.tags);
            return (
              <div key={category.slug} className="group bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:-translate-y-2">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                    <Link href={`/trivia-bank/${category.slug}`}>
                      {category.header}
                    </Link>
                  </h2>
                  <p className="text-gray-300 mb-4 line-clamp-3">{category.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tagsArray.length > 0 ? (
                      <>
                        {tagsArray.slice(0, 5).map(tag => (
                          <span key={tag} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs border border-purple-500/30">
                            #{tag}
                          </span>
                        ))}
                        {tagsArray.length > 5 && (
                          <span className="bg-gray-700 text-gray-400 px-2 py-1 rounded text-xs">
                            +{tagsArray.length - 5} more
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs border border-purple-500/30">
                        #trivia
                      </span>
                    )}
                  </div>
                  <Link 
                    href={`/trivia-bank/${category.slug}`} 
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold group/link"
                  >
                    Take the Quiz
                    <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 max-w-md mx-auto">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">No trivia found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm ? `No results for "${searchTerm}"` : `No categories starting with "${activeLetter}"`}
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setActiveLetter('All');
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
              >
                Show All Categories
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TriviaFilter;