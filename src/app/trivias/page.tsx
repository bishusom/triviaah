// src/app/trivias/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import ScrollButtons from '@/components/common/ScrollButtons';
import SearchBar from '@/components/trivias/SearchBar';
import { supabase }  from '@/lib/supabase';
import triviaCategories from '@/config/triviaCategories.json';

// Define proper TypeScript interface for category
interface TriviaCategory {
  title: string;
  description: string;
  ogImage?: string;
  keywords?: string[];
  related?: string[];
  displayName?: string;
}

interface TriviaSubcategory {
  subcategory: string;
  category: string;
  question_count: number;
}

// Interface for search results
interface SearchResult {
  type: 'category' | 'subcategory';
  id: string;
  title: string;
  description: string;
  href: string;
  questionCount: number;
  parentCategory?: string;
  ogImage?: string;
}

interface CategoryCardProps {
  categoryKey: string;
  category: TriviaCategory;
  index: number;
}

interface StructuredDataProps {
  categories: [string, TriviaCategory][];
}

// Import categories JSON (client-side compatible)


// Component for optimized category cards
function CategoryCard({ categoryKey, category, index }: CategoryCardProps) {
  return (
    <Link
      key={categoryKey}
      href={`/trivias/${categoryKey}`}
      className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
    >
      {/* Category Image */}
      <div className="relative h-40 w-full bg-gray-100">
        {category.ogImage ? (
          <Image
            src={category.ogImage}
            alt={category.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            loading={index < 8 ? "eager" : "lazy"}
            priority={index < 4}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500 text-lg font-medium">
              {category.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      {/* Category Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">
          {category.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {category.description}
        </p>
      </div>
    </Link>
  );
}

// Search result card component
function SearchResultCard({ result }: { result: SearchResult }) {
  return (
    <Link
      href={result.href}
      className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
    >
      {/* Result Image/Icon */}
      <div className="relative h-40 w-full bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl font-bold text-gray-700">
              {result.type === 'category' ? '📚' : '🔍'}
            </span>
            <div className="mt-2">
              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                result.type === 'category' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {result.type === 'category' ? 'Category' : 'Subcategory'}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      {/* Result Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
            {result.title}
          </h3>
          {result.questionCount > 0 && (
            <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {result.questionCount} Qs
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {result.description}
        </p>
        {result.type === 'subcategory' && result.parentCategory && (
          <div className="text-xs text-gray-500 flex items-center">
            <span>Part of: {result.parentCategory}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function TriviasPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Get all category keys and sort them alphabetically
  const categories = Object.entries(triviaCategories) as [string, TriviaCategory][];

  // Handle search function
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    
    setIsSearching(true);
    
    try {
      const results: SearchResult[] = [];
      const searchLower = query.toLowerCase();
      
      // Search in local categories
      Object.entries(triviaCategories).forEach(([key, category]) => {
        const cat = category as TriviaCategory;
        
        if (
          cat.title.toLowerCase().includes(searchLower) ||
          cat.description.toLowerCase().includes(searchLower) ||
          (cat.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower)))
        ) {
          results.push({
            type: 'category',
            id: key,
            title: cat.title,
            description: cat.description,
            href: `/trivias/${key}`,
            questionCount: 0,
            ogImage: cat.ogImage
          });
        }
      });

      // Search in subcategories from Supabase (client-side)
      if (typeof window !== 'undefined') {
        // CORRECTED: Use proper column name (subcategory_name instead of subcategory)
        const { data: subcategorieResults, error } = await supabase
          .from('trivia_subcategories_view')
          .select('subcategory, category, question_count')
          .or(`subcategory.ilike.%${searchLower}%,category.ilike.%${searchLower}%`)
          .gte('question_count', 30)
          .limit(20);

        if (error) {
          console.error('Supabase search error:', error);
        }  

        if (!error && subcategorieResults) {
          subcategorieResults.forEach((result: TriviaSubcategory) => {
            results.push({
              type: 'subcategory',
              id: `${result.category}-${result.subcategory}`,
              title: result.subcategory,
              description: `${result.question_count} questions in ${result.category}`,
              href: `/trivias/${result.category}/quiz?subcategory=${encodeURIComponent(result.subcategory)}`,
              questionCount: result.question_count,
              parentCategory: result.category
            });
          });
        }
      }

      // Sort results: categories first, then by title match
      results.sort((a, b) => {
        if (a.type === 'category' && b.type === 'subcategory') return -1;
        if (a.type === 'subcategory' && b.type === 'category') return 1;
        
        // Check for exact title matches first (with safety checks)
        const aTitleLower = a.title?.toLowerCase() || '';
        const bTitleLower = b.title?.toLowerCase() || '';
        const aExactMatch = aTitleLower === searchLower;
        const bExactMatch = bTitleLower === searchLower;
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        
        return (b.questionCount || 0) - (a.questionCount || 0);
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Structured Data Component
  function StructuredData({ categories }: StructuredDataProps) {
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://triviaah.com/#organization",
          "name": "Triviaah",
          "url": "https://triviaah.com/",
          "description": "Triviaah offers engaging and educational trivia games and puzzles for everyone.",
          "logo": {
            "@type": "ImageObject",
            "url": "https://triviaah.com/logo.png",
            "width": 200,
            "height": 60
          },
          "sameAs": [
            "https://twitter.com/elitetrivias",
            "https://www.facebook.com/elitetrivias",
            "https://www.instagram.com/elitetrivias"
          ]
        },
        {
          "@type": "WebPage",
          "@id": "https://triviaah.com/trivias/#webpage",
          "url": "https://triviaah.com/trivias",
          "name": "Free Online Trivia Categories | Quiz Games Online Free",
          "description": "Browse our collection of free online trivia quizzes and categories. Play fun quiz games online free across various topics including history, science, entertainment and more.",
          "isPartOf": {
            "@id": "https://triviaah.com/#website"
          },
          "about": {
            "@id": "https://triviaah.com/#organization"
          },
          "datePublished": "2025-09-30T00:00:00+00:00",
          "dateModified": new Date().toISOString(),
          "breadcrumb": {
            "@id": "https://triviaah.com/trivias/#breadcrumb"
          },
          "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": "https://triviaah.com/imgs/trivia-categories-og.webp",
            "width": 1200,
            "height": 630
          }
        },
        {
          "@type": "WebSite",
          "@id": "https://triviaah.com/#website",
          "url": "https://triviaah.com/",
          "name": "Triviaah",
          "description": "Engaging trivia games and puzzles for everyone",
          "publisher": {
            "@id": "https://triviaah.com/#organization"
          },
          "potentialAction": [
            {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://triviaah.com/trivias?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          ]
        },
        {
          "@type": "ItemList",
          "name": "Trivia Categories",
          "description": "List of all available trivia categories on Triviaah",
          "numberOfItems": categories.length,
          "itemListElement": categories.map(([key, category], index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Game",
              "name": category.title,
              "description": category.description,
              "url": `https://triviaah.com/trivias/${key}`,
              "gameType": "TriviaGame",
              "genre": "trivia",
              "numberOfPlayers": {
                "@type": "QuantitativeValue",
                "minValue": 1
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          }))
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://triviaah.com/trivias/#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://triviaah.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Trivia Categories",
              "item": "https://triviaah.com/trivias"
            }
          ]
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Are these trivia games completely free to play?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! All our trivia games and quizzes are completely free to play. No subscriptions, no hidden fees, and no registration required. Just choose a category and start playing immediately."
              }
            },
            {
              "@type": "Question",
              "name": "How many trivia categories are available?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We offer a wide variety of trivia categories covering topics like history, science, entertainment, sports, geography, and more. Our collection is constantly growing with new categories added regularly to keep the content fresh and engaging."
              }
            },
            {
              "@type": "Question",
              "name": "Do I need to create an account to play?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No account creation is required! You can start playing any of our trivia games immediately without signing up. We believe in making knowledge accessible to everyone without barriers."
              }
            },
            {
              "@type": "Question",
              "name": "Can I play on mobile devices?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely! Our trivia games are fully responsive and work perfectly on all devices including smartphones, tablets, and desktop computers. Play anytime, anywhere."
              }
            }
          ]
        }
      ]
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Structured Data for SEO */}
      <StructuredData categories={categories} />
      
      {/* Page Header with Search */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Trivia Categories</h1>
            <p className="text-base sm:text-lg text-gray-600">
              Choose a category to test your knowledge with our free online trivia games
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="w-full">
            <SearchBar 
              initialQuery={searchQuery} 
              onSearch={handleSearch} 
            />
          </div>
        </div>
        
        {/* Search Results Summary */}
        {searchQuery && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Search results for &quot;{searchQuery}&quot;
                </h2>
                {isSearching ? (
                  <p className="text-sm text-gray-600 flex items-center">
                    <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></span>
                    Searching...
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Found {searchResults?.length || 0} matching {searchResults?.length === 1 ? 'result' : 'results'}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults(null);
                }}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
              >
                Clear search
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Grid */}
      {searchQuery && searchResults ? (
        <>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {searchResults.map((result, index) => (
                <SearchResultCard key={`${result.id}-${index}`} result={result} />
              ))}
            </div>
          ) : !isSearching ? (
            <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg mb-8">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                No results found for &quot;{searchQuery}&quot;
              </h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Try searching with different keywords or browse all categories below
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults(null);
                }}
                className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Browse All Categories
              </button>
            </div>
          ) : null}
          
          {/* Show all categories when search has results */}
          {searchResults.length > 0 && (
            <details className="mb-8" open>
              <summary className="cursor-pointer text-base sm:text-lg font-semibold text-gray-800 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                All Categories ({categories.length} total)
              </summary>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {categories.map(([key, category], index) => (
                  <CategoryCard 
                    key={key} 
                    categoryKey={key}
                    category={category as TriviaCategory} 
                    index={index}
                  />
                ))}
              </div>
            </details>
          )}
        </>
      ) : (
        /* Normal categories grid (no search) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {categories.map(([key, category], index) => (
            <CategoryCard 
              key={key} 
              categoryKey={key}
              category={category as TriviaCategory} 
              index={index}
            />
          ))}
        </div>
      )}
      
      {/* Add SEO content section */}
      <section className="mt-8 sm:mt-12 bg-gray-50 rounded-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Free Online Quiz Games & Trivia Categories</h2>
        <p className="text-gray-600 mb-4">
          Explore our extensive collection of free online trivia games and quiz categories. 
          Whether you&apos;re looking for free quiz games for personal enjoyment or free virtual trivia games for work, 
          we have categories to suit all interests.
        </p>
        <p className="text-gray-600">
          From history and science to entertainment and sports, our free online quizzes for fun 
          provide endless entertainment and learning opportunities.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="mt-8 sm:mt-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg mb-2">Are these trivia games completely free to play?</h3>
            <p className="text-gray-700 text-sm sm:text-base">
              Yes! All our trivia games and quizzes are completely free to play. No subscriptions, 
              no hidden fees, and no registration required.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg mb-2">How many trivia categories are available?</h3>
            <p className="text-gray-700 text-sm sm:text-base">
              We offer a wide variety of trivia categories covering topics like history, science, 
              entertainment, sports, geography, and more.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg mb-2">Do I need to create an account to play?</h3>
            <p className="text-gray-700 text-sm sm:text-base">
              No account creation is required! You can start playing any of our trivia games immediately 
              without signing up.
            </p>
          </div>
        </div>
      </section>
      
      <ScrollButtons />
    </div>
  );
}