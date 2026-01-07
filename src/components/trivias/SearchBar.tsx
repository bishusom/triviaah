// components/search/SearchBar.tsx
'use client';

import { useState } from 'react';

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
}

export default function SearchBar({ initialQuery = '', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    } else {
      onSearch(''); // Clear search
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // Optional: Auto-search as user types (debounced)
    // Or just update on submit
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center transition-all duration-200 ${
          isFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
        }`}>
          {/* Search icon - moved to left edge */}
          <div className="absolute left-3 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Input field */}
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search categories & subcategories..."
            className="w-full pl-10 pr-24 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            aria-label="Search trivia"
          />
          
          {/* Clear button (when there's text) */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-20 text-gray-400 hover:text-gray-600 p-1"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {/* Search button - matching rounded corners */}
          <button
            type="submit"
            className="absolute right-0 bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors text-sm font-medium h-full"
            aria-label="Search"
          >
            Search
          </button>
        </div>
        
        {/* Quick search tips */}
        <div className="mt-2 text-xs text-gray-500">
          Try: <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => setQuery('History')}>History</span>, 
          <span className="text-blue-600 cursor-pointer hover:underline ml-2" onClick={() => setQuery('Movies')}>Movies</span>, 
          <span className="text-blue-600 cursor-pointer hover:underline ml-2" onClick={() => setQuery('Science')}>Science</span>
        </div>
      </form>
    </div>
  );
}