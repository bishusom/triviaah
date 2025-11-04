// src/app/trivias/[category]/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import triviaCategories from '@/config/triviaCategories.json';
import { getSubcategoriesWithMinQuestions } from '@/lib/supabase';
import AdLayoutClient from '@/components/common/TriviaAdLayoutClient';

type CategoryKey = keyof typeof triviaCategories;

// Define proper interfaces for the data structures
interface TriviaCategory {
  title: string;
  description: string;
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
      'free trivia questions',
      'online quiz game',
      'trivia quiz online',
      ...(categoryData.keywords || [])
    ],
    openGraph: {
      title: `${categoryTitle} Trivia Quiz | Free Online Questions`,
      description: `Play free ${categoryTitle.toLowerCase()} trivia quiz. ${categoryDescription} Test your knowledge with our online trivia questions.`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/trivias/${category}`,
      siteName: 'Elite Trivias',
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
    <AdLayoutClient>
      {/* Structured Data for SEO */}
      <StructuredData 
        category={category}
        categoryData={categoryData}
        subcategories={subcategories}
      />
      
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
          <p className="text-sm text-gray-500 mt-2">
            Complete quiz with questions from all {categoryData.title.toLowerCase()} topics
          </p>
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
                  {/* No need to show question count for now
                  <p className="text-sm text-gray-600 mt-1">
                    {subcat.question_count} questions
                  </p>
                  */}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">How many questions are in the {categoryData.title} trivia quiz?</h3>
              <p className="text-gray-700">
                Our {categoryData.title.toLowerCase()} trivia quiz contains a variety of questions. The full category quiz includes 
                questions from all topics, while specific subcategory quizzes focus on particular areas. Each quiz session 
                typically includes 10-20 questions to provide a comprehensive yet engaging experience.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">Is this {categoryData.title} trivia completely free to play?</h3>
              <p className="text-gray-700">
                Yes! All our {categoryData.title.toLowerCase()} trivia quizzes are completely free to play. No registration, 
                no subscriptions, and no hidden fees. You can start playing immediately and enjoy unlimited access 
                to all our trivia content.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">What difficulty levels are available?</h3>
              <p className="text-gray-700">
                Our {categoryData.title.toLowerCase()} trivia questions span various difficulty levels, from beginner to expert. 
                This ensures that both casual players and {categoryData.title.toLowerCase()} enthusiasts will find challenging 
                and engaging questions appropriate for their knowledge level.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">Can I play on my phone or tablet?</h3>
              <p className="text-gray-700">
                Absolutely! Our {categoryData.title.toLowerCase()} trivia quizzes are fully responsive and work perfectly on 
                all devices including smartphones, tablets, and desktop computers. The interface adapts to your 
                screen size for optimal playing experience.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">How often are new questions added?</h3>
              <p className="text-gray-700">
                We regularly update our {categoryData.title.toLowerCase()} question database with new content to keep the 
                quizzes fresh and engaging. While we don&apos;t have a fixed schedule, we&apos;re committed to expanding 
                our question collection to provide ongoing challenges for returning players.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">Can I see my results and compare with others?</h3>
              <p className="text-gray-700">
                After completing each {categoryData.title.toLowerCase()} trivia quiz, you&apos;ll receive immediate feedback on 
                your performance including your score and correct answers. While we focus on individual learning 
                and enjoyment, you can always challenge friends to beat your score!
              </p>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <section className="mt-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">{categoryData.title} Trivia Questions & Quizzes</h2>
          <p className="text-gray-600 mb-4">
            Test your knowledge with our comprehensive collection of {categoryData.title.toLowerCase()} trivia questions. 
            Whether you&apos;re a beginner looking to learn more or an expert wanting to challenge yourself, 
            our free online {categoryData.title.toLowerCase()} quiz offers something for everyone.
          </p>
          <p className="text-gray-600">
            Our {categoryData.title.toLowerCase()} trivia covers various aspects and subtopics, providing a well-rounded 
            testing experience. Play alone or with friends, and see how much you really know about {categoryData.title.toLowerCase()}. 
            With instant feedback and detailed explanations, you&apos;ll not only test your knowledge but also learn 
            new facts along the way.
          </p>
        </section>
      </div>
    </AdLayoutClient>
  );
}

// Structured Data Component for SEO
function StructuredData({ 
  category, 
  categoryData, 
  subcategories 
}: StructuredDataProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elitetrivias.com';
  const categoryUrl = `${siteUrl}/trivias/${category}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://elitetrivias.com/#organization",
        "name": "Elite Trivias",
        "url": "https://elitetrivias.com/",
        "description": "Elite Trivias offers engaging and educational trivia games and puzzles for everyone.",
        "logo": {
          "@type": "ImageObject",
          "url": "https://elitetrivias.com/logo.png",
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
          "@id": "https://elitetrivias.com/#website"
        },
        "about": {
          "@id": `${categoryUrl}/#game`
        },
        "datePublished": "2025-10-22T00:00:00+00:00",
        "dateModified": new Date().toISOString(),
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
        "@id": "https://elitetrivias.com/#website",
        "url": "https://elitetrivias.com/",
        "name": "Elite Trivias",
        "description": "Engaging trivia games and puzzles for everyone",
        "publisher": {
          "@id": "https://elitetrivias.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://elitetrivias.com/search?q={search_term_string}"
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
          "@id": "https://elitetrivias.com/#organization"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "operatingSystem": "Any",
        "author": {
          "@id": "https://elitetrivias.com/#organization"
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
            "item": "https://elitetrivias.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Trivia Categories",
            "item": "https://elitetrivias.com/trivias"
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
            "url": `${categoryUrl}/quiz?subcategory=${encodeURIComponent(subcat.subcategory)}`,
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
          },
          {
            "@type": "Question",
            "name": `How often are new questions added?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `We regularly update our ${categoryData.title.toLowerCase()} question database with new content to keep the quizzes fresh and engaging. While we don't have a fixed schedule, we're committed to expanding our question collection to provide ongoing challenges for returning players.`
            }
          },
          {
            "@type": "Question",
            "name": `Can I see my results and compare with others?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `After completing each ${categoryData.title.toLowerCase()} trivia quiz, you'll receive immediate feedback on your performance including your score and correct answers. While we focus on individual learning and enjoyment, you can always challenge friends to beat your score!`
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