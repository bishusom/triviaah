import Link from 'next/link';
import { Metadata } from 'next';
import triviaCategories from '@/config/triviaCategories.json';
import Image from 'next/image';
import ScrollButtons from '@/components/common/ScrollButtons';

// Define proper TypeScript interface for category
interface TriviaCategory {
  title: string;
  description: string;
  ogImage?: string;
}

interface CategoryCardProps {
  categoryKey: string;
  category: TriviaCategory;
  index: number;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Free Online Trivia Categories | Quiz Games Online Free',
    description: 'Browse our collection of free online trivia quizzes and categories. Play fun quiz games online free across various topics including history, science, entertainment and more.',
    keywords: 'free online trivia, trivia categories, quiz games online free, free trivia quizzes, online quiz games, free trivia games, trivia quizzes by category',
    alternates: {
      canonical: 'https://triviaah.com/trivias',
    }
  };
}

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
            loading={index < 8 ? "eager" : "lazy"} // Load first 8 images eagerly, rest lazy
            priority={index < 4} // High priority for above-fold images
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
        {categories.map(([key, category], index) => (
          <CategoryCard 
            key={key} 
            categoryKey={key}
            category={category as TriviaCategory} 
            index={index}
          />
        ))}
      </div>
      
      {/* Add SEO content section */}
      <section className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Free Online Quiz Games & Trivia Categories</h2>
        <p className="text-gray-600 mb-4">
          Explore our extensive collection of free online trivia games and quiz categories. 
          Whether you&apos;re looking for free quiz games for personal enjoyment or free virtual trivia games for work, 
          we have categories to suit all interests. Our platform offers some of the best online trivia games 
          available completely free of charge.
        </p>
        <p className="text-gray-600">
          From history and science to entertainment and sports, our free online quizzes for fun 
          provide endless entertainment and learning opportunities. Enjoy quiz games online free 
          with no registration required, and discover why we&apos;re considered one of the top free quiz sites 
          for trivia enthusiasts.
        </p>
      </section>
      <ScrollButtons />
    </div>
  );
}