// src/app/trivias/[category]/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import triviaCategories from '@/config/triviaCategories.json';
import { getSubcategoriesWithMinQuestions } from '@/lib/supabase';
import { slugifyTriviaSegment } from '@/lib/trivia-slugs';
import { Play, Timer, Info, ShieldQuestionMark, BookOpen, Trophy, CircleStar } from 'lucide-react';



type CategoryKey = keyof typeof triviaCategories;

export async function generateStaticParams() {
  return Object.keys(triviaCategories).map((category) => ({
    category,
  }));
}

// Define proper interfaces for the data structures
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

interface StructuredDataProps {
  category: string;
  categoryData: TriviaCategory;
  subcategories: Subcategory[];
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;

  const categoryKey = category as CategoryKey;
  const categoryData = triviaCategories[categoryKey] || {
    title: category.replace(/-/g, ' '),
    description: 'Test your knowledge with our quiz'
  };

  const categoryTitle = categoryData.title;
  const categoryDescription = categoryData.description;

  return {
    title: `${categoryTitle} Trivia Quiz | Free Online Questions`,
    description: `Play free ${categoryTitle.toLowerCase()} trivia quiz. ${categoryDescription} Test your knowledge with our online trivia questions.`,
    keywords: [
      `${categoryTitle.toLowerCase()} trivia`,
      `${categoryTitle.toLowerCase()} quiz`,
      `${categoryTitle.toLowerCase()} questions and answers`,
      `${categoryTitle.toLowerCase()} knowledge test`,
      'free online trivia',
      'educational quiz games',
      `${categoryTitle.toLowerCase()} learning games`,
      'interactive trivia',
      `${categoryTitle.toLowerCase()} exam preparation`,
      ...(categoryData.keywords || [])
    ],
    openGraph: {
      title: `${categoryTitle} Trivia Quiz | Free Online Questions`,
      description: `Play free ${categoryTitle.toLowerCase()} trivia quiz. ${categoryDescription} Test your knowledge with our online trivia questions.`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/trivias/${category}`,
      siteName: 'Triviaah',
      images: categoryData.ogImage ? [{ 
        url: categoryData.ogImage,
        width: 1200,
        height: 630,
        alt: `${categoryTitle} Trivia Quiz`
      }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryTitle} Trivia Quiz | Free Online Questions`,
      description: `Play free ${categoryTitle.toLowerCase()} trivia quiz. ${categoryDescription} Test your knowledge with our online trivia questions.`,
      images: categoryData.ogImage ? [categoryData.ogImage] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/trivias/${category}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-full md:max-w-4xl lg:max-w-6xl mx-auto px-4 py-8">
        
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-3xl text-white">🎯</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {categoryData.title}
                <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-xl md:text-2xl mt-2">
                  Master Your Knowledge
                </span>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                {categoryData.description}
              </p>
            </div>
          </div>

          {/* Category Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
              <ShieldQuestionMark className="text-2xl text-cyan-400 mx-auto mb-2" />
              <div className="text-white font-bold text-lg">100+</div>
              <div className="text-gray-400 text-sm">Questions</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
              <Timer className="text-2xl text-yellow-400 mx-auto mb-2" />
              <div className="text-white font-bold text-lg">30s</div>
              <div className="text-gray-400 text-sm">Per Question</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
              <Trophy className="text-2xl text-green-400 mx-auto mb-2" />
              <div className="text-white font-bold text-lg">{subcategories.length}</div>
              <div className="text-gray-400 text-sm">Topics</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
              <CircleStar className="text-2xl text-purple-400 mx-auto mb-2" />
              <div className="text-white font-bold text-lg">Free</div>
              <div className="text-gray-400 text-sm">To Play</div>
            </div>
          </div>
        </div>

        {/* Main Category Play Button */}
        <div className="text-center mb-12">
          <Link
            href={`/trivias/${category}/quiz`}
            className="group relative inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-12 rounded-2xl text-lg shadow-2xl hover:shadow-glow transition-all duration-300 transform hover:scale-105"
          >
            <Play className="mr-2 text-xl group-hover:scale-110 transition-transform" />
            Play Full Category Quiz
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <p className="text-gray-400 text-sm mt-3">
            Complete quiz with questions from all {categoryData.title.toLowerCase()} topics
          </p>
        </div>

        {/* Subcategories Section */}
        {subcategories.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Or Choose Your Challenge</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subcategories.map((subcat) => (
                <Link
                  key={subcat.subcategory}
                  href={`/trivias/${category}/${slugifyTriviaSegment(subcat.subcategory)}`}
                  className="group relative bg-gradient-to-br from-gray-800 to-gray-900 hover:from-cyan-900/30 hover:to-blue-900/30 rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-glow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-white group-hover:text-cyan-300 transition-colors">
                        {subcat.subcategory}
                      </h3>
                      <p className="text-cyan-400 text-sm mt-1">
                        {subcat.question_count}+ questions
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                      style={{ 
                        width: `${Math.min((subcat.question_count / 50) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Learning Objectives */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">What You&apos;ll Master</h2>
          <section className="mb-24">
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
        </div>

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

        {/* Related Categories */}
        {categoryData.related && categoryData.related.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Explore More Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categoryData.related.map((relatedCategory) => {
                const relatedKey = relatedCategory as CategoryKey;
                const relatedData = triviaCategories[relatedKey];
                if (!relatedData) return null;
                
                return (
                  <Link
                    key={relatedCategory}
                    href={`/trivias/${relatedCategory}`}
                    className="group bg-gradient-to-br from-gray-800 to-gray-900 hover:from-purple-900/30 hover:to-pink-900/30 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/40 transition-all duration-300 text-center"
                  >
                    <h3 className="font-semibold text-lg text-white group-hover:text-purple-300 transition-colors mb-2">
                      {relatedData.title}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {relatedData.description}
                    </p>
                    <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-0 group-hover:w-full transition-all duration-700" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: `How many questions are in the ${categoryData.title} trivia quiz?`,
                answer: `Our ${categoryData.title.toLowerCase()} trivia quiz contains a variety of questions. The full category quiz includes questions from all topics, while specific subcategory quizzes focus on particular areas.`
              },
              {
                question: `Is this ${categoryData.title} trivia completely free to play?`,
                answer: `Yes! All our ${categoryData.title.toLowerCase()} trivia quizzes are completely free to play. No registration, no subscriptions, and no hidden fees.`
              },
              {
                question: `What difficulty levels are available?`,
                answer: `Our ${categoryData.title.toLowerCase()} trivia questions span various difficulty levels, from beginner to expert. Both casual players and experts will find engaging questions.`
              },
              {
                question: `Can I play on my phone or tablet?`,
                answer: `Absolutely! Our ${categoryData.title.toLowerCase()} trivia quizzes are fully responsive and work perfectly on all devices including smartphones, tablets, and desktop computers.`
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className="font-semibold text-lg text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA for Specific Trivia Bank Content */}
        <section className="mt-12 p-6 bg-gray-800 rounded-xl border border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-white" />
                <h3 className="text-xl font-bold text-white">
                  Need a Printable Quiz?
                </h3>
              </div>
              <p className="text-white">
                Download our curated quiz sheets. 
                Perfect for hosting your own trivia night or classroom activity.
              </p>
            </div>
            <Link 
              href={`/trivia-bank/${category}-top-50-trivias`}
              className="whitespace-nowrap inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm"
            >
              Get Downloadable Sheet
              <CircleStar className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
      {/* JSON-LD Structured Data */}
      <StructuredData 
        category={category} 
        categoryData={categoryData} 
        subcategories={subcategories} 
      />
    </div>
  );
}

// Structured Data Component for SEO
function StructuredData({ 
  category, 
  categoryData, 
  subcategories 
}: StructuredDataProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://triviaah.com';
  const categoryUrl = `${siteUrl}/trivias/${category}`;

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
        "@id": `${categoryUrl}/#webpage`,
        "url": categoryUrl,
        "name": `${categoryData.title} Trivia Quiz | Free Online Questions`,
        "description": `Play free ${categoryData.title.toLowerCase()} trivia quiz. ${categoryData.description} Test your knowledge with our online trivia questions.`,
        "isPartOf": {
          "@id": "https://triviaah.com/#website"
        },
        "about": {
          "@id": `${categoryUrl}/#game`
        },
        "datePublished": "2025-10-22T00:00:00+00:00",
        "breadcrumb": {
          "@id": `${categoryUrl}/#breadcrumb`
        },
        "primaryImageOfPage": categoryData.ogImage ? {
          "@type": "ImageObject",
          "url": categoryData.ogImage,
          "width": 1200,
          "height": 630
        } : undefined
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
              "urlTemplate": "https://triviaah.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Game",
        "@id": `${categoryUrl}/#game`,
        "name": `${categoryData.title} Trivia Quiz`,
        "description": categoryData.description,
        "url": categoryUrl,
        "applicationCategory": "Game",
        "gameType": "TriviaGame",
        "genre": ["trivia", "quiz", "educational"],
        "numberOfPlayers": {
          "@type": "QuantitativeValue",
          "minValue": 1
        },
        "publisher": {
          "@id": "https://triviaah.com/#organization"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "operatingSystem": "Any",
        "author": {
          "@id": "https://triviaah.com/#organization"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${categoryUrl}/#breadcrumb`,
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
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": categoryData.title,
            "item": categoryUrl
          }
        ]
      },
      ...(subcategories.length > 0 ? [{
        "@type": "ItemList",
        "name": `${categoryData.title} Subcategories`,
        "description": `Available subcategories for ${categoryData.title} trivia`,
        "numberOfItems": subcategories.length,
        "itemListElement": subcategories.map((subcat, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Game",
            "name": `${subcat.subcategory} - ${categoryData.title} Trivia`,
            "description": `Test your knowledge of ${subcat.subcategory} with our trivia quiz`,
            "url": `${categoryUrl}/${slugifyTriviaSegment(subcat.subcategory)}`,
            "gameType": "TriviaGame"
          }
        }))
      }] : []),
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `How many questions are in the ${categoryData.title} trivia quiz?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Our ${categoryData.title.toLowerCase()} trivia quiz contains a variety of questions. The full category quiz includes questions from all topics, while specific subcategory quizzes focus on particular areas. Each quiz session typically includes 10-20 questions to provide a comprehensive yet engaging experience.`
            }
          },
          {
            "@type": "Question",
            "name": `Is this ${categoryData.title} trivia completely free to play?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Yes! All our ${categoryData.title.toLowerCase()} trivia quizzes are completely free to play. No registration, no subscriptions, and no hidden fees. You can start playing immediately and enjoy unlimited access to all our trivia content.`
            }
          },
          {
            "@type": "Question",
            "name": `What difficulty levels are available?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Our ${categoryData.title.toLowerCase()} trivia questions span various difficulty levels, from beginner to expert. This ensures that both casual players and ${categoryData.title.toLowerCase()} enthusiasts will find challenging and engaging questions appropriate for their knowledge level.`
            }
          },
          {
            "@type": "Question",
            "name": `Can I play on my phone or tablet?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Absolutely! Our ${categoryData.title.toLowerCase()} trivia quizzes are fully responsive and work perfectly on all devices including smartphones, tablets, and desktop computers. The interface adapts to your screen size for optimal playing experience.`
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
