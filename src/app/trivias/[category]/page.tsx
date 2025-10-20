import Link from 'next/link';
import { Metadata } from 'next';
import triviaCategories from '@/config/triviaCategories.json';
import Ads from '@/components/Ads';
import { getSubcategoriesWithMinQuestions } from '@/lib/supabase';

type CategoryKey = keyof typeof triviaCategories;

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;

  const categoryKey = category as CategoryKey;
  const categoryData = triviaCategories[categoryKey] || {
    title: category.replace(/-/g, ' '),
    description: 'Test your knowledge with our quiz'
  };

  return {
    title: `${categoryData.title} Trivia Quiz`,
    description: categoryData.description,
    keywords: categoryData.keywords || [],
    openGraph: {
      images: categoryData.ogImage ? [{ url: categoryData.ogImage }] : 'undefined',
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/trivias/${category}`,
    }
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryKey = category as CategoryKey;
  const categoryData = triviaCategories[categoryKey] || {
    title: category.replace(/-/g, ' '),
    description: 'Test your knowledge with our quiz'
  };

  // Fetch subcategories with at least 30 questions
  const subcategories = await getSubcategoriesWithMinQuestions(category, 30);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{categoryData.title} Trivia</h1>
        <p className="text-lg text-gray-600">{categoryData.description}</p>
      </div>

      {/* Main Category Play Button */}
      <div className="mb-12 text-center">
        <Link
          href={`/trivias/${category}/quiz`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg inline-block transition-colors text-lg"
        >
          Play Full Category Quiz
        </Link>
      </div>

      {/* Subcategories Section */}
      {subcategories.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Or Choose a Specific Topic</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subcategories.map((subcat) => (
              <Link
                key={subcat.subcategory}
                href={`/trivias/${category}/quiz?subcategory=${encodeURIComponent(subcat.subcategory)}`}
                className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group text-center"
              >
                <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-700">
                  {subcat.subcategory}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      <Ads format="horizontal" style={{ width: '100%', height: '90px' }} />
    </div>
  );
}