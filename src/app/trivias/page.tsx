// src/app/trivias/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import Ads from '@/components/common/Ads';
import ScrollButtons from '@/components/common/ScrollButtons';
import { Play, Boxes, ShieldQuestionMark } from 'lucide-react';
import TriviaCategoriesExplorer from '@/components/trivias/TriviaCategoriesExplorer';
import { getTriviaCategories, getTriviaExplorerCards, type TriviaCategoryRecord } from '@/lib/trivia-categories';

interface StructuredDataProps {
  categories: TriviaCategoryRecord[];
}

export async function generateMetadata(): Promise<Metadata> {
  const description = 'Browse free trivia categories across history, science, entertainment, sports, and more.';

  return {
    title: 'Free Online Trivia Categories | Quiz Games Online Free',
    description,
    keywords: 'free online trivia, trivia categories, quiz games online free, free trivia quizzes, online quiz games, free trivia games, trivia quizzes by category',
    alternates: {
      canonical: 'https://triviaah.com/trivias',
    },
    openGraph: {
      title: 'Free Online Trivia Categories | Quiz Games Online Free',
      description,
      url: 'https://triviaah.com/trivias',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/triviaah-og.webp',
          width: 1200,
          height: 630,
          alt: 'Trivia Categories - Free Online Quiz Games'
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Free Online Trivia Categories | Quiz Games Online Free',
      description,
      images: ['/imgs/triviaah-og.webp'],
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

export default async function TriviasPage() {
  const categories = await getTriviaCategories('trivias');
  const categoriesForExplorer = await getTriviaExplorerCards('trivias');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Structured Data for SEO */}
        <StructuredData categories={categories} />
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Boxes className="text-4xl text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Trivia Categories
                <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-xl md:text-2xl mt-2">
                  Unlimited Challenges Await
                </span>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Choose a category to test your knowledge with our free online trivia games. 
                Master each topic and become a trivia champion!
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
              <Boxes className="text-2xl text-cyan-400 mx-auto mb-2" />
              <div className="text-white font-bold text-xl">{categories.length}</div>
              <div className="text-gray-400 text-sm">Categories</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
              <ShieldQuestionMark className="text-2xl text-yellow-400 mx-auto mb-2" />
              <div className="text-white font-bold text-xl">10,000+</div>
              <div className="text-gray-400 text-sm">Questions</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
              <span className="text-2xl">🎮</span>
              <div className="text-white font-bold text-xl">Free</div>
              <div className="text-gray-400 text-sm">To Play</div>
            </div>
          </div>
        </div>

         <div className="py-4">
          <Ads format="horizontal" slot="2207590813" isMobileFooter={false} className="lg:hidden" />
        </div>

        <TriviaCategoriesExplorer categories={categoriesForExplorer} />

        {/* CTA Section for Trivia Bank */}
        <section className="mt-16 p-8 rounded-2xl border border-cyan-500/20 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Boxes className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl text-white font-bold text-slate-900 mb-2">
              Looking for Printables?
            </h2>
            <p className="text-white mb-6">
              Access our comprehensive <strong>Trivia Bank</strong> featuring downloadable quiz sheets 
              and curated "Top 50" lists perfect for pub nights, classrooms, or family gatherings.
            </p>
            <Link 
              href="/trivia-bank"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 shadow-sm"
            >
              Browse Downloadable Quiz Sheets
              <Play className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </section>

        
        <div className="py-4">
          <Ads format="horizontal" slot="9040722315" isMobileFooter={false} className="lg:hidden" />
        </div>
                
        {/* Gaming Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Why Players Love Triviaah</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/20 text-center">
              <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Play</h3>
              <p className="text-gray-300">No registration needed. Start playing immediately and challenge your friends!</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Learn & Grow</h3>
              <p className="text-gray-300">Detailed explanations help you learn from every question you answer.</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Track Progress</h3>
              <p className="text-gray-300">Monitor your improvement and compete for high scores across all categories.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section - Gaming Style */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "Are these trivia games completely free to play?",
                answer: "Yes! All our trivia games and quizzes are completely free to play. No subscriptions, no hidden fees, and no registration required."
              },
              {
                question: "How many trivia categories are available?",
                answer: `We offer ${categories.length} different trivia categories covering topics like history, science, entertainment, sports, and more. New categories are added regularly!`
              },
              {
                question: "Do I need to create an account to play?",
                answer: "No account creation is required! You can start playing any of our trivia games immediately without signing up."
              },
              {
                question: "Can I play on mobile devices?",
                answer: "Absolutely! Our trivia games are fully responsive and work perfectly on all devices including smartphones, tablets, and desktop computers."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className="font-semibold text-lg text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <ScrollButtons />
      </div>
    </div>
  );
}

// Structured Data Component for SEO
function StructuredData({ categories }: StructuredDataProps) {
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
        "@id": "https://triviaah.com/trivias/#webpage",
        "url": "https://triviaah.com/trivias",
        "name": "Free Online Trivia Categories | Quiz Games Online Free",
        "description": "Browse our collection of free online trivia quizzes and categories. Play fun quiz games online free across various topics including history, science, entertainment and more.",
        "isPartOf": {
          "@id": "https://triviaah.com/#website"
        },
        "about": {
          "@id": "https://triviaah.com/#organization"
        },
        "datePublished": "2025-09-30T00:00:00+00:00",
        "dateModified": new Date().toISOString(),
        "breadcrumb": {
          "@id": "https://triviaah.com/trivias/#breadcrumb"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://triviaah.com/imgs/trivia-categories-og.webp",
          "width": 1200,
          "height": 630
        }
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
        "@type": "ItemList",
        "name": "Trivia Categories",
        "description": "List of all available trivia categories on Triviaah",
        "numberOfItems": categories.length,
        "itemListElement": categories.map((category, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Game",
            "name": category.title,
            "description": category.description,
            "url": `https://triviaah.com/trivias/${category.slug}`,
            "gameType": "TriviaGame",
            "genre": "trivia",
            "numberOfPlayers": {
              "@type": "QuantitativeValue",
              "minValue": 1
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://triviaah.com/trivias/#breadcrumb",
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
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Are these trivia games completely free to play?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! All our trivia games and quizzes are completely free to play. No subscriptions, no hidden fees, and no registration required. Just choose a category and start playing immediately."
            }
          },
          {
            "@type": "Question",
            "name": "How many trivia categories are available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `We offer ${categories.length} different trivia categories covering topics like history, science, entertainment, sports, geography, and more. Our collection is constantly growing with new categories added regularly to keep the content fresh and engaging.`
            }
          },
          {
            "@type": "Question",
            "name": "Do I need to create an account to play?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No account creation is required! You can start playing any of our trivia games immediately without signing up. We believe in making knowledge accessible to everyone without barriers."
            }
          },
          {
            "@type": "Question",
            "name": "Can I play on mobile devices?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! Our trivia games are fully responsive and work perfectly on all devices including smartphones, tablets, and desktop computers. Play anytime, anywhere."
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
