'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Play, Search } from 'lucide-react';
import { getSearchableItems, type SearchResult } from '@/lib/supabase';

interface TriviaCategory {
  title: string;
  description: string;
  ogImage?: string;
  keywords?: string[];
  related?: string[];
  displayName?: string;
}

interface TriviaCategoriesExplorerProps {
  categories: Array<{
    key: string;
    category: TriviaCategory;
  }>;
}

function CategoryCard({
  categoryKey,
  category,
  index,
}: {
  categoryKey: string;
  category: TriviaCategory;
  index: number;
}) {
  return (
    <Link
      href={`/trivias/${categoryKey}`}
      className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-glow-blue transition-all duration-500 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 hover:border-cyan-400/40"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

      <div className="relative h-40 w-full bg-slate-900 overflow-hidden">
        {category.ogImage ? (
          <Image
            src={category.ogImage}
            alt={category.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            loading={index < 8 ? 'eager' : 'lazy'}
            priority={index < 4}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-700 to-blue-800">
            <span className="text-white text-2xl font-bold drop-shadow-lg">
              {category.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute bottom-4 right-4 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Play className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="p-4 relative z-10">
        <h3 className="font-black text-base text-white mb-1 uppercase tracking-tight group-hover:text-cyan-300 transition-colors">
          {category.title}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {category.description}
        </p>

        <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-0 group-hover:w-full transition-all duration-700" />
        </div>
      </div>
    </Link>
  );
}

export default function TriviaCategoriesExplorer({ categories }: TriviaCategoriesExplorerProps) {
  const [query, setQuery] = useState('');
  const [searchItems, setSearchItems] = useState<SearchResult[]>([]);

  useEffect(() => {
    getSearchableItems().then(setSearchItems);
  }, []);

  const filteredCategories = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return categories;

    return categories.filter(({ category, key }) => {
      const haystack = [
        key,
        category.title,
        category.displayName,
        category.description,
        ...(category.keywords || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(search);
    });
  }, [categories, query]);

  const matchingSubcategories = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (search.length < 2) return [];

    return searchItems
      .filter((item) => item.type === 'subcategory' && item.name.toLowerCase().includes(search))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [query, searchItems]);

  const resultsSummary = useMemo(() => {
    const formatCount = (count: number, singular: string, plural: string) =>
      `${count} ${count === 1 ? singular : plural} found`;

    if (!query.trim()) {
      return formatCount(filteredCategories.length, 'category', 'categories');
    }

    if (filteredCategories.length > 0 && matchingSubcategories.length > 0) {
      return `${filteredCategories.length} ${filteredCategories.length === 1 ? 'category' : 'categories'} and ${matchingSubcategories.length} ${matchingSubcategories.length === 1 ? 'subcategory' : 'subcategories'} found`;
    }

    if (filteredCategories.length > 0) {
      return formatCount(filteredCategories.length, 'category', 'categories');
    }

    if (matchingSubcategories.length > 0) {
      return formatCount(matchingSubcategories.length, 'subcategory', 'subcategories');
    }

    return 'No matches found';
  }, [filteredCategories.length, matchingSubcategories.length, query]);

  return (
    <>
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trivia categories..."
            className="w-full rounded-2xl border border-gray-700 bg-gray-800/90 py-4 pl-12 pr-4 text-white placeholder-gray-400 outline-none transition-colors focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
          />
        </div>
        <p className="mt-3 text-center text-sm text-cyan-400">
          {resultsSummary}
        </p>
      </div>

      {/* Category Grid */}
      <div className="mb-16">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {filteredCategories.map(({ key, category }, index) => (
            <CategoryCard
              key={key}
              categoryKey={key}
              category={category}
              index={index}
            />
          ))}
        </div>
      </div>

      {matchingSubcategories.length > 0 && (
        <div className="mb-10 rounded-2xl border border-gray-700 bg-gray-800/70 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Matching Subcategories</h2>
              <p className="mt-1 text-sm text-gray-400">
                Topic pages found from the same search index used in the navbar.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              {matchingSubcategories.length} results
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {matchingSubcategories.map((item) => (
              <Link
                key={`${item.type}-${item.slug}`}
                href={item.slug}
                className="group flex items-center justify-between rounded-xl border border-gray-700 bg-gray-900/70 px-4 py-4 transition-colors hover:border-cyan-500/40 hover:bg-gray-900"
              >
                <div>
                  <p className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">
                    {item.parentCategory ? `${item.parentCategory} • ` : ''}Subcategory • {item.count} questions
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-500 transition-colors group-hover:text-cyan-400" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {filteredCategories.length === 0 && matchingSubcategories.length === 0 && (
        <div className="mb-16 rounded-2xl border border-gray-700 bg-gray-800/70 p-8 text-center">
          <h2 className="text-xl font-bold text-white">No matching categories</h2>
          <p className="mt-2 text-gray-400">
            Try another keyword such as science, sports, history, movies, or a subtopic name.
          </p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="mt-5 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-500"
          >
            Clear search
          </button>
        </div>
      )}
    </>
  );
}
