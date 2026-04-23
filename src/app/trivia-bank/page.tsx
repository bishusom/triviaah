import { Metadata } from 'next';
import { getAllTriviaPreviews } from '@/lib/tbank';
import TriviaFilter from '@/components/trivia-bank/TriviaFilter';
import Ads from '@/components/common/Ads';

interface TriviaCategory {
  slug: string;
  title: string;
  header: string;
  excerpt: string;
  tags: string[];
}

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = 'https://triviaah.com/trivia-bank';
  
  return {
    title: 'Trivia Question Bank | Create Free Online Quiz Games | Triviaah',
    description: 'Explore our extensive trivia question bank. Create your own online quiz for free, perfect for virtual trivia games, team building, and classroom fun. Thousands of questions across 50+ categories.',
    keywords: [
      'trivia question bank',
      'free trivia questions',
      'create online quiz free',
      'virtual trivia games',
      'team building trivia',
      'educational quiz bank',
      'trivia for classroom',
      'online quiz maker free',
      'history trivia bank',
      'science trivia bank'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Trivia Question Bank | Create Free Online Quiz Games | Triviaah',
      description: 'Create your own online quiz for free with our extensive trivia question bank. Perfect for virtual trivia games and team building.',
      url: canonicalUrl,
      images: [{ url: '/imgs/trivia-bank-card.jpg' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Trivia Question Bank | Create Free Online Quiz Games',
      images: ['/imgs/trivia-bank-card.jpg'],
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

// JSON-LD Structured Data
function TriviaBankJsonLd({ count }: { count: number }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://triviaah.com/trivia-bank/#webpage",
        "url": "https://triviaah.com/trivia-bank",
        "name": "Trivia Question Bank",
        "description": "Free online trivia question bank for creating quiz games and virtual trivia events",
        "publisher": { "@id": "https://triviaah.com/#organization" }
      },
      {
        "@type": "ItemList",
        "name": "Trivia Categories",
        "numberOfItems": count,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "CreativeWork",
              "name": "Free Trivia Questions Collection"
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://triviaah.com" },
          { "@type": "ListItem", "position": 2, "name": "Trivia Bank", "item": "https://triviaah.com/trivia-bank" }
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

export default async function TriviaBankPage() {
  const triviaCategories: TriviaCategory[] = await getAllTriviaPreviews();
  const sortedCategories = [...triviaCategories].sort((a, b) => 
    a.header.localeCompare(b.header)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <TriviaBankJsonLd count={triviaCategories.length} />
      
      <div className="container mx-auto px-4 py-8">
        {/* ── Compact Hero Section ────────────────────────────────────────── */}
        <div className="mb-8 lg:mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Title & Description */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl text-white">📚</span>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tight">
                    Trivia <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Bank</span>
                  </h1>
                </div>
              </div>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">
                Unlock thousands of high-quality trivia questions across 50+ categories. 
                Perfect for creating custom quizzes, hosting game nights, or boosting your knowledge bank.
              </p>
            </div>

            {/* Stats Column */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="bg-slate-800/30 rounded-2xl p-6 border border-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-black text-3xl leading-none">{triviaCategories.length}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-2">Categories</div>
                  </div>
                  <div className="w-px h-10 bg-white/10 mx-6"></div>
                  <div>
                    <div className="text-white font-black text-3xl leading-none">FREE</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-2">Access</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4">
          <Ads format="horizontal" slot="2207590813" isMobileFooter={false} className="lg:hidden" />
        </div>

        {/* Client-side filter component */}
        <TriviaFilter categories={sortedCategories} />

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
  );
}
