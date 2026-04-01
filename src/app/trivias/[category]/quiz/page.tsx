// src/app/trivias/[category]/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import triviaCategories from '@/config/triviaCategories.json';
import { getSubcategoriesWithMinQuestions } from '@/lib/supabase';
import { Play, ChevronRight, BookOpen, Info } from 'lucide-react';

type CategoryKey = keyof typeof triviaCategories;

interface TriviaCategory {
  title: string;
  description: string;
  longDescription?: string;
  learningPoints?: string[];
  keywords?: string[];
  ogImage?: string;
  related?: string[];
  displayName?: string;
}

interface Subcategory {
  subcategory: string;
  question_count: number;
}

// 1. GENERATE STATIC PARAMS: This ensures Google finds all 28 pages as static HTML
export async function generateStaticParams() {
  return Object.keys(triviaCategories).map((category) => ({
    category: category,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const categoryKey = category as CategoryKey;
  const categoryData = triviaCategories[categoryKey];

  if (!categoryData) return { title: 'Trivia Category' };

  return {
    title: `${categoryData.title} Trivia Quiz | Master ${categoryData.title} Questions`,
    description: categoryData.longDescription?.substring(0, 160) || categoryData.description,
    keywords: categoryData.keywords || [categoryData.title, 'trivia', 'quiz'],
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryKey = category as CategoryKey;
  const categoryData = triviaCategories[categoryKey];

  if (!categoryData) {
    return <div className="text-white text-center py-20">Category not found</div>;
  }

  const subcategories = await getSubcategoriesWithMinQuestions(category.replace(/-/g, ' '), 5);

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100">
      {/* 2. VISIBLE BREADCRUMBS: Helps bot navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <span className="text-cyan-400 font-medium">{categoryData.title}</span>
      </nav>

      {/* HERO SECTION */}
      <div className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
              {categoryData.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Trivia</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              {categoryData.description}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        {/* SUBCATEGORIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {subcategories.map((sub: any) => (
            <Link
              key={sub.subcategory}
              href={`/trivias/${category}/${sub.subcategory.toLowerCase().replace(/ /g, '-')}`}
              className="group bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 p-6 rounded-3xl transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-cyan-500/10 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                  <Play className="text-cyan-400 fill-cyan-400" size={24} />
                </div>
                <span className="bg-gray-900 text-xs font-bold text-gray-400 px-3 py-1 rounded-full border border-gray-700">
                  {sub.question_count} Qs
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 capitalize">{sub.subcategory}</h3>
              <div className="flex items-center text-cyan-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Start Playing <ChevronRight size={16} />
              </div>
            </Link>
          ))}
        </div>

        {/* 3. ENHANCED LEARNING OBJECTIVES: Uses dynamic JSON data */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What You'll Master</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(categoryData.learningPoints || [
              "Master fundamental principles and terminology",
              "Understand key historical developments",
              "Discover practical applications and trivia facts"
            ]).map((point, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BookOpen size={64} className="text-cyan-400" />
                </div>
                <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg shadow-cyan-500/20">
                  {index + 1}
                </div>
                <p className="text-gray-300 leading-relaxed font-medium">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. LONG-FORM CONTENT SECTION: Vital for SEO Information Gain */}
        <section className="bg-gray-800/30 rounded-3xl p-8 md:p-12 border border-gray-700 mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Info className="text-blue-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Deep Dive: {categoryData.title}</h2>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-400 leading-loose text-lg italic">
              {categoryData.longDescription}
            </p>
          </div>
        </section>

        {/* RELATED CATEGORIES */}
        {categoryData.related && categoryData.related.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-8">Related Categories</h2>
            <div className="flex flex-wrap gap-4">
              {categoryData.related.map((relKey) => {
                const rel = triviaCategories[relKey as CategoryKey];
                if (!rel) return null;
                return (
                  <Link
                    key={relKey}
                    href={`/trivias/${relKey}`}
                    className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-6 py-3 rounded-2xl transition-colors text-gray-300 font-medium"
                  >
                    {rel.title}
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* JSON-LD Structured Data */}
      <StructuredData 
        category={category} 
        categoryData={categoryData} 
        subcategories={subcategories} 
      />
    </div>
  );
}

// Structured Data Component remains largely the same but pulls from the updated interfaces
function StructuredData({ category, categoryData, subcategories }: any) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryData.title} Trivia Quizzes`,
    "description": categoryData.description,
    "url": `https://triviaah.com/trivias/${category}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": subcategories.map((sub: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://triviaah.com/trivias/${category}/${sub.subcategory.toLowerCase().replace(/ /g, '-')}`,
        "name": `${sub.subcategory} Trivia`
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}