import { getTriviaData, getAllTriviaPreviews } from '@/lib/tbank';
import TriviaContent from '@/components/trivia-bank/TriviaContent';
import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface Params {
  slug: string;
}

interface TriviaData {
  slug: string;
  title: string;
  header: string;
  excerpt: string;
  tags: string[] | string;
  levels: {
    [key: string]: Array<{
      question: string;
      answer: string;
    }>;
  };
}

interface TriviaPageProps {
  params: Promise<Params>;
}

export async function generateMetadata({ params }: TriviaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trivia: TriviaData | null = await getTriviaData(slug);

  if (!trivia) {
    return {
      title: 'Trivia Not Found | Triviaah',
      description: 'The requested trivia category could not be found.',
    };
  }

  const tagsArray = typeof trivia.tags === 'string' 
    ? trivia.tags.split(',').map(tag => tag.trim())
    : trivia.tags;

  return {
    title: `${trivia.title} Questions with Answers | Triviaah`,
    description: `${trivia.excerpt} Browse our ${trivia.title.toLowerCase()} trivia questions with answers for all difficulty levels.`,
    keywords: `${trivia.title.toLowerCase()} trivia, ${trivia.title.toLowerCase()} quiz, ${trivia.title.toLowerCase()} questions and answers, ${tagsArray.join(', ')}`,
    alternates: {
      canonical: `https://triviaah.com/trivia-bank/${trivia.slug}`,
    },
    openGraph: {
      title: `${trivia.title} Questions | Triviaah`,
      description: trivia.excerpt,
      type: 'article',
      tags: tagsArray,
    },
  };
}

export async function generateStaticParams() {
  const triviaCategories = await getAllTriviaPreviews();
  
  return triviaCategories.map((trivia) => ({
    slug: trivia.slug,
  }));
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading trivia questions...</p>
      </div>
    </div>
  );
}

export default async function TriviaPage({ params }: TriviaPageProps) {
  const { slug } = await params;
  const trivia: TriviaData | null = await getTriviaData(slug);

  if (!trivia) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">Trivia Not Found</h1>
          <p className="text-gray-400 mb-8">The requested trivia category could not be found.</p>
          <Link 
            href="/trivia-bank" 
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            Back to All Trivia Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* 1. SEO BREADCRUMBS */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-purple-400">Home</Link>
        <ChevronRight size={14} />
        <Link href="/trivia-bank" className="hover:text-purple-400">Trivia Bank</Link>
        <ChevronRight size={14} />
        <span className="text-purple-400 font-medium">{trivia.title}</span>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-12">
          <Link href="/trivia-bank" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Trivia Bank
          </Link>
          
          {/* 2. SEO RICH HEADER SECTION */}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {trivia.header || `${trivia.title} Questions & Answers`}
          </h1>
          
          <div className="bg-purple-900/20 border border-purple-500/20 p-6 rounded-3xl mb-10">
            <p className="text-xl text-gray-300 leading-relaxed italic">
              {trivia.excerpt}
            </p>
          </div>
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <TriviaContent trivia={trivia} />
        </Suspense>

        {/* 3. DYNAMIC Q&A SCHEMA */}
        <TriviaSchema trivia={trivia} />
      </main>
    </div>
  );
}

function TriviaSchema({ trivia }: { trivia: TriviaData }) {
  // Combine all questions from all levels into one array for the schema
  const allQuestions = Object.values(trivia.levels).flat().slice(0, 20); // Limit to top 20 for speed

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://triviaah.com" },
          { "@type": "ListItem", "position": 2, "name": "Trivia Bank", "item": "https://triviaah.com/trivia-bank" },
          { "@type": "ListItem", "position": 3, "name": trivia.title }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": allQuestions.map((q) => ({
          "@type": "Question",
          "name": q.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": q.answer
          }
        }))
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}