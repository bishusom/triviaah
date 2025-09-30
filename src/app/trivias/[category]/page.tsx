import Link from 'next/link';
import { Metadata } from 'next';
import triviaCategories from '@/config/triviaCategories.json';
import Ads from '@/components/Ads';

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
    description: 'Test your knowledge with our quiz',
    related: []
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{categoryData.title} Trivia</h1>
        <p className="text-lg text-gray-600">{categoryData.description}</p>
      </div>

      <div className="mb-12 text-center">
        <Link
          href={`/trivias/${category}/quiz`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg inline-block transition-colors text-lg"
        >
          Play Now
        </Link>
      </div>

      {categoryData.related && categoryData.related.length > 0 && (
        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold mb-6">More Trivia Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categoryData.related.map((relatedKey) => {
              const relatedCategory = triviaCategories[relatedKey as CategoryKey];
              if (!relatedCategory) return null;
              
              return (
                <Link
                  key={relatedKey}
                  href={`/trivias/${relatedKey}`}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <h3 className="font-medium">{relatedCategory.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {relatedCategory.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      <Ads format="horizontal" style={{ width: '100%', height: '90px' }} />
    </div>
    
  );
}