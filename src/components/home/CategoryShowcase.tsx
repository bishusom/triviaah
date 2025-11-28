// src/components/home/CategoryShowcase.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import triviaCategories from '@/config/triviaCategories.json';

// Helper function to get icon for each category
const getIconForCategory = (categoryName: string) => {
  const iconMap: { [key: string]: string } = {
    'general-knowledge': '🧠',
    'science': '🔬',
    'history': '📜',
    'geography': '🌍',
    'entertainment': '🎭',
    'sports': '⚽',
    'literature': '📖',
    'arts': '🎨',
    'movies': '🎞️ ',
    'music': '🎵',
    'mathematics': '📐',
    'mythology': '⚡',
    'animals': '🐾',
    'transportation': '🚗',
    'comics': '🦸',
    'anime-manga': '🗾',
    'cartoons': '📺',
    'nature': '🌿',
    'computers': '💻',
    'video-games': '🎮',
    'politics': '🏛️',
    'celebrities': '🌟',
    'fashion': '👠',
    'festivals': '🎆',
    'tv': '📡',
    'books': '📚',
    'business': '💵',
    'quick-fire': '⚡',
    'today-in-history': '📅',
    'food': '🍔',
    'film': '🎬',
    'board-games': '🎲',
    'japanese-anime-manga': '🇯🇵',
    'cartoon-animations': '🐭',
    'famous-firsts': '🥇',
    'famous-quotes': '✏️',
    'languages': '💬',
    'acroynmyns': '🔠',
    'philosophy': '🤔'
  };
  return iconMap[categoryName] || '❓';
};

// Helper function to get color for each category
const getColorForCategory = (categoryName: string) => {
  const colorMap: { [key: string]: string } = {
    'general-knowledge': 'text-cyan-400',
    'science-technology': 'text-green-400',
    'history': 'text-amber-400',
    'geography': 'text-emerald-400',
    'entertainment': 'text-purple-400',
    'sports': 'text-red-400',
    'arts-literature': 'text-pink-400',
    'science': 'text-blue-400',
    'music': 'text-yellow-400',
    'mathematics': 'text-indigo-400',
    'mythology': 'text-orange-400',
    'animals': 'text-green-400',
    'vehicles': 'text-red-400',
    'comics': 'text-blue-400',
    'anime-manga': 'text-pink-400',
    'cartoons': 'text-purple-400',
    'nature': 'text-green-400',
    'computers': 'text-cyan-400',
    'video-games': 'text-green-400',
    'politics': 'text-gray-400',
    'celebrities': 'text-yellow-400',
    'television': 'text-purple-400',
    'books': 'text-amber-400',
    'quick-fire': 'text-orange-400',
    'today-in-history': 'text-amber-400',
    'film': 'text-blue-400',
    'musicals-theatres': 'text-purple-400',
    'board-games': 'text-indigo-400',
    'japanese-anime-manga': 'text-pink-400',
    'cartoon-animations': 'text-purple-400'
  };
  return colorMap[categoryName] || 'text-gray-400';
};

// Helper function to get realistic quiz counts
const getQuizCountForCategory = (categoryName: string) => {
  const countMap: { [key: string]: number } = {
    'general-knowledge': 156,
    'science-technology': 125,
    'history': 87,
    'geography': 53,
    'entertainment': 112,
    'sports': 76,
    'arts-literature': 42,
    'science': 89,
    'music': 64,
    'mathematics': 51,
    'mythology': 29,
    'animals': 67,
    'vehicles': 41,
    'comics': 27,
    'anime-manga': 34,
    'cartoons': 31,
    'nature': 58,
    'computers': 46,
    'video-games': 72,
    'politics': 33,
    'celebrities': 48,
    'television': 45,
    'books': 38,
    'quick-fire': 95,
    'today-in-history': 65,
    'film': 78,
    'musicals-theatres': 22,
    'board-games': 28,
    'japanese-anime-manga': 36,
    'cartoon-animations': 39
  };
  return countMap[categoryName] || Math.floor(Math.random() * 50) + 20;
};

export default function CategoryShowcase() {
  const [showAll, setShowAll] = useState(false);
  
  // Transform the JSON data into display format
  const categories = Object.entries(triviaCategories).map(([key, category]) => ({
    id: key,
    name: key,
    title: category.title,
    description: category.description,
    icon: getIconForCategory(key),
    color: getColorForCategory(key),
    quizzes: getQuizCountForCategory(key),
    keywords: category.keywords || [],
    ogImage: category.ogImage,
    related: category.related || []
  }));

  // Show 12 categories by default (2 rows of 6), all when expanded
  const initialCount = 12;
  const displayedCategories = showAll ? categories : categories.slice(0, initialCount);
  const totalCategories = categories.length;

  // Helper function to chunk categories for mobile rows
  const chunkCategories = (categories: any[], chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < categories.length; i += chunkSize) {
      chunks.push(categories.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // For mobile: split into chunks of 6 for each row
  const mobileCategoryChunks = chunkCategories(displayedCategories, 6);

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Explore Categories
          </h2>
          <p className="text-gray-400 text-lg">
            Choose from {totalCategories}+ categories and {categories.reduce((sum, cat) => sum + cat.quizzes, 0)}+ daily quizzes
          </p>
        </div>

        {/* Mobile: Dynamic Rows */}
        <div className="lg:hidden">
          {mobileCategoryChunks.map((chunk, chunkIndex) => (
            <div key={chunkIndex} className="grid grid-cols-3 gap-3 mb-6">
              {chunk.map((category) => (
                <Link key={category.id} href={`/trivias/${category.id}`}>
                  <div className="group text-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-3 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer transform hover:-translate-y-1 h-full">
                    <div className={`text-2xl mb-2 group-hover:scale-110 transition-transform duration-300 ${category.color}`}>
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-white text-xs mb-1 line-clamp-2 leading-tight">
                      {category.title}
                    </h3>
                    <p className="text-[10px] text-gray-400">
                      {category.quizzes} quizzes
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Desktop: 6 Columns Grid */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-6 gap-4">
            {displayedCategories.map((category) => (
              <Link key={category.id} href={`/trivias/${category.id}`}>
                <div className="group text-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer transform hover:-translate-y-1 h-full">
                  <div className={`text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 ${category.color}`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">
                    {category.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {category.quizzes} quizzes
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Expand/Collapse Button - Only show if there are more than initialCount categories */}
        {totalCategories > initialCount && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 bg-gradient-to-br from-gray-600 to-gray-900 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-gray-600 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less Categories
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show All {totalCategories} Categories
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}