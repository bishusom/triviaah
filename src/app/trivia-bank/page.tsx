import { Metadata } from 'next';
import { getAllTriviaPreviews } from '@/lib/tbank';
import TriviaFilter from '@/components/trivia-bank/TriviaFilter';

interface TriviaCategory {
  slug: string;
  title: string;
  header: string;
  excerpt: string;
  tags: string[];
}

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const triviaCategories = await getAllTriviaPreviews();
  
  return {
    title: 'Free Trivia Question Bank | Create Online Quiz Games For Free',
    description: 'Create your own online quiz for free with our extensive trivia question bank. Perfect for virtual trivia games, team building, and fun quiz games with friends. No cost involved!',
    keywords: [
      'free trivia questions',
      'create online quiz free',
      'trivia question bank',
      'virtual trivia games',
      'team building trivia',
      'free quiz website',
      'online trivia games',
      'trivia for adults',
      'quiz game creator',
      'free quiz hosting'
    ].join(', '),
    authors: [{ name: 'Triviaah' }],
    creator: 'Triviaah',
    publisher: 'Triviaah',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://triviaah.com'), // Replace with your actual domain
    alternates: {
      canonical: 'https://triviaah.com/trivia-bank',
    },
    openGraph: {
      title: 'Free Trivia Question Bank | Create Online Quiz Games For Free',
      description: 'Create your own online quiz for free with our extensive trivia question bank. Perfect for virtual trivia games and team building activities.',
      url: '/trivia-bank',
      siteName: 'Triviaah',
      images: [
        {
          url: '/imgs/trivia-bank-card.jpg', // Create this OG image
          width: 1200,
          height: 630,
          alt: 'Triviaah Question Bank - Create Free Online Quiz Games',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Free Trivia Question Bank | Create Online Quiz Games For Free',
      description: 'Create your own online quiz for free with our extensive trivia question bank.',
      images: ['/imgs/trivia-bank-card.jpg'], // Same as OG image
      creator: '@triviaah', // Replace with your Twitter handle
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

// JSON-LD Structured Data
function addTriviaBankJsonLd() {
  return {
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Trivia Question Bank",
      "description": "Free online trivia question bank for creating quiz games and virtual trivia events",
      "url": "https://triviaah.com/trivia-bank", // Replace with your domain
      "publisher": {
        "@type": "Organization",
        "name": "Triviaah",
        "logo": {
          "@type": "ImageObject",
          "url": "https://triviaah.com/logo.png" // Replace with your logo
        }
      },
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": 20, // Update with actual count
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "CreativeWork",
              "name": "Free Trivia Questions",
              "description": "Collection of free trivia questions for online quizzes"
            }
          }
        ]
      },
      "isAccessibleForFree": true,
      "license": "https://creativecommons.org/licenses/by/4.0/"
    })
  };
}

export default async function TriviaBankPage() {
  const triviaCategories: TriviaCategory[] = await getAllTriviaPreviews();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={addTriviaBankJsonLd()}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-12">
          {/* Gaming Header */}
          <div className="relative bg-gradient-to-r from-purple-600 to-blue-500 py-20 rounded-2xl border-2 border-purple-400/30 mb-16 overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse-slow"></div>
            
            <div className="relative container mx-auto px-4 text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
                TRIVIAAH QUESTION BANK
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Level up your quizzes with our extensive collection of trivia questions
              </p>
            </div>
          </div>

          {/* Separator */}
          <div className="relative mb-16">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-900 px-6 py-2 text-sm text-purple-400 font-semibold border border-purple-500/30 rounded-full">
                BROWSE CATEGORIES
              </span>
            </div>
          </div>

          {/* Client-side filter component */}
          <TriviaFilter categories={triviaCategories} />

          {/* SEO Content Section */}
          <section className="mt-20 bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-white text-center">
              Create Your Own Online Quiz Games For Free
            </h2>
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-gray-300 mb-4">
                Our free trivia question bank allows you to create your own online quiz for free with ease. 
                As one of the best online quiz tools free available, we provide everything you need to 
                create online trivia game free of charge. Whether you need free virtual trivia for teams, 
                trivia games for adults online, or fun quiz games for friends, our question bank has you covered.
              </p>
              <p className="text-gray-300 mb-6">
                Looking for free quiz hosting website capabilities? Our platform enables you to create quiz game online free 
                and share it with others. Enjoy free online quiz for team building events or simply test your knowledge 
                with our extensive collection of questions. As a completely free quiz website, we&apos;re committed to 
                providing the best online trivia games experience without any cost.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Create your own trivia game free with our question bank
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Perfect for free virtual trivia games for work and team building
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Enjoy online trivia game with friends and family
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  One of the best free quiz sites for trivia enthusiasts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  No cost involved - completely free quiz website
                </li>
              </ul>
            </div>
          </section>

          {/* Additional SEO Content */}
          <section className="mt-12 bg-gray-800/30 rounded-2xl p-8 border border-gray-600">
            <h3 className="text-2xl font-bold mb-4 text-white">
              Why Choose Our Free Trivia Question Bank?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-bold text-white mb-2">Extensive Collection</h4>
                <p className="text-gray-400 text-sm">
                  Thousands of carefully curated trivia questions across multiple categories
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🚀</div>
                <h4 className="font-bold text-white mb-2">Easy to Use</h4>
                <p className="text-gray-400 text-sm">
                  Simple interface to create and host your own online quizzes instantly
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">💯</div>
                <h4 className="font-bold text-white mb-2">Completely Free</h4>
                <p className="text-gray-400 text-sm">
                  No hidden costs, no subscriptions - truly free quiz creation platform
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}