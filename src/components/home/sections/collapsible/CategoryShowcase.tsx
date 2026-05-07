// src/components/home/CategoryShowcase.tsx
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type FeaturedTriviaCategory = {
  key: string;
  category: {
    title: string;
    description: string;
    displayName?: string;
    keywords: string[];
    ogImage?: string;
    related?: string[];
  };
};

interface CategoryShowcaseProps {
  featuredTriviaCategories?: FeaturedTriviaCategory[];
}

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

export default function CategoryShowcase({ featuredTriviaCategories = [] }: CategoryShowcaseProps) {
  const categories = featuredTriviaCategories.map(({ key, category }) => ({
    id: key,
    name: key,
    title: category.displayName || category.title,
    description: category.description,
    icon: getIconForCategory(key),
    color: getColorForCategory(key),
    quizzes: getQuizCountForCategory(key),
    keywords: category.keywords || [],
    ogImage: category.ogImage,
    related: category.related || []
  }));

  const displayedCategories = categories.slice(0, 12);
  const totalCategories = categories.length;

  return (
    <section className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-xl shadow-black/20 sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(80%_120%_at_20%_10%,rgba(37,99,235,0.18)_0%,transparent_55%)] pointer-events-none" />
      <div className="relative z-10">
        <div className="mb-6 text-center">
          <Link href="/trivias" className="group inline-flex items-center justify-center gap-2">
            <h2 className="text-xl font-bold text-white transition-colors group-hover:text-cyan-400">
              Explore Categories
            </h2>
            <ArrowRight className="h-5 w-5 text-cyan-400 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="mt-2 text-sm text-gray-400 md:text-base">
            Choose from {totalCategories}+ categories and {categories.reduce((sum, cat) => sum + cat.quizzes, 0)}+ daily quizzes
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {displayedCategories.map((category) => (
            <Link
              key={category.id}
              href={`/trivias/${category.id}`}
              className="group relative h-full w-40 flex-none overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-4 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-cyan-500/10 before:absolute before:inset-0 before:bg-[radial-gradient(90%_120%_at_20%_10%,rgba(37,99,235,0.16)_0%,transparent_58%)] before:pointer-events-none"
            >
              <div className="relative z-10">
                <div className={`mb-3 text-3xl transition-transform duration-300 group-hover:scale-110 ${category.color}`}>
                  {category.icon}
                </div>
                <h3 className="truncate text-sm font-bold text-white">
                  {category.title}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  {category.quizzes} quizzes
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Play Now <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {totalCategories > displayedCategories.length && (
          <div className="mt-2 flex justify-center">
            <Link
              href="/trivias"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:from-cyan-500 hover:to-blue-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <span>Show All {totalCategories}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
