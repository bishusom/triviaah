import Link from 'next/link';
import { Metadata } from 'next';
import triviaCategories from '@/config/triviaCategories.json';
import Image from 'next/image';
import ScrollButtons from '@/components/ScrollButtons'; // Import ScrollButtons component

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Trivia Categories',
    description: 'Browse our collection of trivia quizzes',
  };
}

export default function TriviasPage() {
  // Get all category keys and sort them alphabetically
  const categories = Object.entries(triviaCategories);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Trivia Categories</h1>
        <p className="text-lg text-gray-600">
          Choose a category to test your knowledge
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map(([key, category]) => (
          <Link
            key={key}
            href={`/trivias/${key}`}
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
                { category.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <ScrollButtons /> {/* Add ScrollButtons component at the bottom */}
    </div>
  );
}