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
      
      <div className="max-w-4xl mx-auto p-6">
        {/* Enhanced Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{categoryData.title} Trivia</h1>
          <p className="text-lg text-gray-600 mb-4">{categoryData.description}</p>
          
          {/* Enhanced category introduction */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3 text-blue-800">About {categoryData.title}</h2>
            <p className="text-gray-700 mb-3">
              Dive into the fascinating world of {categoryData.title.toLowerCase()} with our comprehensive trivia collection. 
              Whether you&apos;re a curious beginner or a seasoned expert, our carefully crafted questions 
              will challenge your understanding and expand your knowledge.
            </p>
            <p className="text-gray-700">
              From fundamental concepts to advanced topics, our {categoryData.title.toLowerCase()} trivia covers 
              the breadth and depth of this subject, ensuring an engaging learning experience for all 
              knowledge levels.
            </p>
          </div>
        </div>

        {/* Main Category Play Button */}
        <div className="mb-12 text-center">
          <Link
            href={`/trivias/${category}/quiz`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg inline-block transition-colors text-lg shadow-lg hover:shadow-xl"
          >
            Play Full Category Quiz
          </Link>
          <p className="text-sm text-gray-500 mt-3">
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
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Learning Objectives & Benefits Section */}
        <div className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
          <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">
            What You&apos;ll Learn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
              <div className="text-purple-600 font-bold text-lg mb-2">✓ Core Concepts</div>
              <p className="text-gray-700 text-sm">
                Master fundamental {categoryData.title.toLowerCase()} principles and terminology
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
              <div className="text-purple-600 font-bold text-lg mb-2">✓ Historical Context</div>
              <p className="text-gray-700 text-sm">
                Understand key developments and milestones in {categoryData.title.toLowerCase()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
              <div className="text-purple-600 font-bold text-lg mb-2">✓ Practical Applications</div>
              <p className="text-gray-700 text-sm">
                Discover real-world uses and implications of {categoryData.title.toLowerCase()} knowledge
              </p>
            </div>
          </div>
        </div>

        {/* Sample Questions Preview */}
        <div className="mb-12 bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Sample {categoryData.title} Trivia Questions</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3 text-blue-800">Question 1</h3>
              <p className="text-gray-800 mb-3">What is one of the most fundamental concepts in {categoryData.title.toLowerCase()} that every beginner should know?</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                <div className="bg-white border border-gray-300 rounded p-3 text-sm">Multiple choice option A</div>
                <div className="bg-white border border-gray-300 rounded p-3 text-sm">Multiple choice option B</div>
                <div className="bg-white border border-gray-300 rounded p-3 text-sm">Multiple choice option C</div>
                <div className="bg-white border border-gray-300 rounded p-3 text-sm">Multiple choice option D</div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3 text-blue-800">Question 2</h3>
              <p className="text-gray-800 mb-3">Which historical figure made significant contributions to the field of {categoryData.title.toLowerCase()}?</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mt-3">
                <strong className="text-yellow-800">💡 Pro Tip:</strong>
                <span className="text-yellow-700 text-sm ml-2">Our trivia questions include detailed explanations to help you learn while you play!</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Link
              href={`/trivias/${category}/quiz`}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg inline-block transition-colors"
            >
              Start Full Quiz to See All Questions
            </Link>
          </div>
        </div>

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

        {/* Comprehensive SEO Content Section */}
        <section className="mt-12 bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">{categoryData.title} Trivia: Master Your Knowledge</h2>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-xl mb-6">
              Welcome to the ultimate destination for {categoryData.title.toLowerCase()} enthusiasts and learners! 
              Our comprehensive {categoryData.title.toLowerCase()} trivia platform offers an engaging way to test 
              and expand your knowledge across various aspects of this fascinating subject.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Why Choose Our {categoryData.title} Trivia?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2">Comprehensive Coverage</h4>
                <p>Our question database spans beginner to expert levels, covering historical context, key figures, fundamental principles, and modern applications of {categoryData.title.toLowerCase()}.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">Educational Value</h4>
                <p>Each question comes with detailed explanations, turning every quiz session into a valuable learning opportunity that reinforces your understanding.</p>
              </div>
            </div>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Perfect for All Knowledge Levels</h3>
            
            <p className="mb-4">
              Whether you&apos;re just starting to explore {categoryData.title.toLowerCase()} or you&apos;re a seasoned expert 
              looking to challenge yourself, our trivia platform adapts to your level. The questions are 
              carefully categorized by difficulty and topic, allowing you to focus on areas that match 
              your current understanding or push you to learn new concepts.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">How to Get the Most from Our {categoryData.title} Trivia</h3>
            
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Start with the full category quiz</strong> to assess your overall knowledge level</li>
              <li><strong>Focus on specific subcategories</strong> to deepen your understanding of particular topics</li>
              <li><strong>Review explanations carefully</strong> to learn from both correct and incorrect answers</li>
              <li><strong>Retake quizzes periodically</strong> to reinforce learning and track your progress</li>
            </ul>

            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg border border-blue-200">
              <h4 className="text-xl font-bold mb-3 text-blue-800">Ready to Test Your Knowledge?</h4>
              <p className="mb-4">
                Join thousands of learners who use our {categoryData.title.toLowerCase()} trivia to enhance their 
                understanding, prepare for exams, or simply enjoy the challenge of testing their knowledge. 
                With new questions added regularly, there&apos;s always something new to discover!
              </p>
              <div className="text-center">
                <Link
                  href={`/trivias/${category}/quiz`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg inline-block transition-colors text-lg"
                >
                  Start Your {categoryData.title} Trivia Journey Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Categories */}
        {categoryData.related && categoryData.related.length > 0 && (
          <div className="mt-12 bg-gray-50 rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-center">Explore Related Trivia Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryData.related.map((relatedCategory) => {
                const relatedKey = relatedCategory as CategoryKey;
                const relatedData = triviaCategories[relatedKey];
                if (!relatedData) return null;
                
                return (
                  <Link
                    key={relatedCategory}
                    href={`/trivias/${relatedCategory}`}
                    className="bg-white hover:bg-blue-50 rounded-lg p-4 border border-gray-300 hover:border-blue-300 transition-all duration-300 text-center group"
                  >
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-700">
                      {relatedData.title} Trivia
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {relatedData.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
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