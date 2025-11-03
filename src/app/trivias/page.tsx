// src/app/trivias/page.tsx
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
  keywords?: string[];
  related?: string[];
  displayName?: string;
}

interface CategoryCardProps {
  categoryKey: string;
  category: TriviaCategory;
  index: number;
}

interface StructuredDataProps {
  categories: [string, TriviaCategory][];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Free Online Trivia Categories | Quiz Games Online Free',
    description: 'Browse our collection of free online trivia quizzes and categories. Play fun quiz games online free across various topics including history, science, entertainment and more.',
    keywords: 'free online trivia, trivia categories, quiz games online free, free trivia quizzes, online quiz games, free trivia games, trivia quizzes by category',
    alternates: {
      canonical: 'https://elitetrivias.com/trivias',
    },
    openGraph: {
      title: 'Free Online Trivia Categories | Quiz Games Online Free',
      description: 'Browse our collection of free online trivia quizzes and categories. Play fun quiz games online free across various topics including history, science, entertainment and more.',
      url: 'https://elitetrivias.com/trivias',
      siteName: 'Elite Trivias',
      images: [
        {
          url: '/imgs/trivia-categories-og.webp',
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
      description: 'Browse our collection of free online trivia quizzes and categories. Play fun quiz games online free across various topics including history, science, entertainment and more.',
      images: ['/imgs/trivia-categories-og.webp'],
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
      {/* Structured Data for SEO */}
      <StructuredData categories={categories} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Trivia Categories</h1>
        <p className="text-lg text-gray-600">
          Choose a category to test your knowledge with our free online trivia games
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

      {/* FAQ Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-2">Are these trivia games completely free to play?</h3>
            <p className="text-gray-700">
              Yes! All our trivia games and quizzes are completely free to play. No subscriptions, 
              no hidden fees, and no registration required. Just choose a category and start playing immediately.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-2">How many trivia categories are available?</h3>
            <p className="text-gray-700">
              We offer a wide variety of trivia categories covering topics like history, science, 
              entertainment, sports, geography, and more. Our collection is constantly growing with 
              new categories added regularly to keep the content fresh and engaging.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-2">Do I need to create an account to play?</h3>
            <p className="text-gray-700">
              No account creation is required! You can start playing any of our trivia games immediately 
              without signing up. We believe in making knowledge accessible to everyone without barriers.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-2">Can I play on mobile devices?</h3>
            <p className="text-gray-700">
              Absolutely! Our trivia games are fully responsive and work perfectly on all devices 
              including smartphones, tablets, and desktop computers. Play anytime, anywhere.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-2">Are there difficulty levels for the trivia questions?</h3>
            <p className="text-gray-700">
              Our trivia questions span various difficulty levels to cater to both casual players 
              and trivia experts. Each category contains a mix of easy, medium, and challenging 
              questions to keep the game interesting for everyone.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-2">How often are new questions added?</h3>
            <p className="text-gray-700">
              We regularly update our question database with new content to ensure fresh challenges 
              for returning players. While we don&apos;t have a fixed schedule, we&apos;re committed to 
              expanding our trivia collection continuously.
            </p>
          </div>
        </div>
      </section>
      
      <ScrollButtons />
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
        "@id": "https://elitetrivias.com/trivias/#webpage",
        "url": "https://elitetrivias.com/trivias",
        "name": "Free Online Trivia Categories | Quiz Games Online Free",
        "description": "Browse our collection of free online trivia quizzes and categories. Play fun quiz games online free across various topics including history, science, entertainment and more.",
        "isPartOf": {
          "@id": "https://elitetrivias.com/#website"
        },
        "about": {
          "@id": "https://elitetrivias.com/#organization"
        },
        "datePublished": "2025-09-30T00:00:00+00:00",
        "dateModified": new Date().toISOString(),
        "breadcrumb": {
          "@id": "https://elitetrivias.com/trivias/#breadcrumb"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://elitetrivias.com/imgs/trivia-categories-og.webp",
          "width": 1200,
          "height": 630
        }
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
        "@type": "ItemList",
        "name": "Trivia Categories",
        "description": "List of all available trivia categories on Elite Trivias",
        "numberOfItems": categories.length,
        "itemListElement": categories.map(([key, category], index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Game",
            "name": category.title,
            "description": category.description,
            "url": `https://elitetrivias.com/trivias/${key}`,
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
        "@id": "https://elitetrivias.com/trivias/#breadcrumb",
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
              "text": "We offer a wide variety of trivia categories covering topics like history, science, entertainment, sports, geography, and more. Our collection is constantly growing with new categories added regularly to keep the content fresh and engaging."
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
          },
          {
            "@type": "Question",
            "name": "Are there difficulty levels for the trivia questions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our trivia questions span various difficulty levels to cater to both casual players and trivia experts. Each category contains a mix of easy, medium, and challenging questions to keep the game interesting for everyone."
            }
          },
          {
            "@type": "Question",
            "name": "How often are new questions added?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We regularly update our question database with new content to ensure fresh challenges for returning players. While we don't have a fixed schedule, we're committed to expanding our trivia collection continuously."
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