// app/page.tsx
import { Suspense } from 'react';
import Image from 'next/image';
import { AdBanner } from '@/components/Ads';
import QuizSection from '@/components/home/QuizSection';
import AdditionalSection from '@/components/home/AdditionalSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import Footer from '@/components/home/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-700 text-white py-4 px-4">
        <div className="container mx-auto flex items-center justify-center gap-4">
          <Image
              src="/logo.webp"
              alt="Triviaah - Free Daily Trivia Games"
              width={280}
              height={50}
              priority
              quality={75}
              className="object-contain lcp-priority w-auto h-auto"
            />
        </div>
      </header>    
      
      <main className="container mx-auto px-4 py-8">  
        {/* Daily Quizzes Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Daily Trivia Quizzes
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Challenge yourself with fresh questions every day across multiple categories
            </p>
          </div>
          <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading quizzes...</div>}>
            <QuizSection />
          </Suspense>
        </section>

        {/* Additional Sections */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              More Ways to Play
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Explore additional games and resources to enhance your trivia experience
            </p>
          </div>
          <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading sections...</div>}>
            <AdditionalSection />
          </Suspense>
        </section>

        {/* Popular Quiz Categories Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              Popular Quiz Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Discover quizzes from our most popular categories
            </p>
          </div>
          <CategoryGrid />
        </section>
      </main>
        
      {/* Footer */}
      <Footer />
    </div>
  );
}