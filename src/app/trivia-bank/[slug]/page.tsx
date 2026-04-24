import { getTriviaData, getAllTriviaPreviews } from '@/lib/tbank';
import TriviaContent from '@/components/trivia-bank/TriviaContent';
import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import Ads from '@/components/common/Ads';

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
  const pageUrl = `https://triviaah.com/trivia-bank/${trivia.slug}`;
  const description = `Free ${trivia.title} trivia questions with answers. ${trivia.excerpt} Perfect for quizzes, game nights, and educational fun for all ages.`;

  return {
    title: `${trivia.title} Trivia Questions & Answers | Free Quiz Bank | Triviaah`,
    description,
    keywords: [
      `${trivia.title} trivia`,
      `${trivia.title} quiz questions`,
      'trivia with answers',
      'free quiz bank',
      'educational trivia',
      ...tagsArray
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${trivia.title} Questions with Answers | Triviaah`,
      description,
      url: pageUrl,
      images: [{ url: '/imgs/trivia-bank-card.webp' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${trivia.title} Trivia Bank`,
      images: ['/imgs/trivia-bank-card.webp'],
    },
    robots: {
      index: true,
      follow: true,
    }
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
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
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
      <div className="min-h-screen bg-[#0f172a] text-white">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white uppercase tracking-tight">Trivia Not Found</h1>
          <p className="text-gray-400 mb-8">The requested trivia category could not be found.</p>
          <Link 
            href="/trivia-bank" 
            className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors font-black uppercase tracking-widest text-xs"
          >
            <ArrowLeft size={16} />
            Back to Bank
          </Link>
        </div>
      </div>
    );
  }

  const questionCount = Object.values(trivia.levels).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          {/* ultra-Compact Header */}
          <header className="flex items-center flex-wrap justify-between gap-x-4 gap-y-2 mb-6 border-b border-white/10 pb-4">
            <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
              {trivia.title} <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Questions</span>
            </h1>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                {questionCount} Qs
              </span>
              <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/10">
                PRO BANK
              </span>
            </div>
          </header>
          
          <div className="bg-cyan-900/10 border border-cyan-500/10 p-4 md:p-6 rounded-xl mb-6">
            <p className="text-base md:text-lg text-gray-300 leading-relaxed italic">
              &ldquo;{trivia.excerpt}&rdquo;
            </p>
          </div>

          <div className="py-1" aria-label="Top advertisement">
            <Ads format="horizontal" slot="2207590813" isMobileFooter={false} className="lg:hidden" />
          </div>
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <TriviaContent trivia={trivia} />
        </Suspense>

        <div className="max-w-4xl mx-auto mt-10" aria-label="Bottom advertisement">
          <Ads format="horizontal" slot="9040722315" isMobileFooter={false} className="lg:hidden" />
        </div>

        {/* 3. DYNAMIC Q&A SCHEMA */}
        <TriviaSchema trivia={trivia} />
      </main>
    </div>
  );
}

function TriviaSchema({ trivia }: { trivia: TriviaData }) {
  // Combine all questions from all levels into one array for the schema
  const allQuestions = Object.values(trivia.levels).flat().slice(0, 20); // Limit to top 20 for speed
  const pageUrl = `https://triviaah.com/trivia-bank/${trivia.slug}`;
  const description = `${trivia.excerpt} Browse our ${trivia.title.toLowerCase()} trivia questions with answers for all difficulty levels.`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://triviaah.com" },
          { "@type": "ListItem", "position": 2, "name": "Trivia Bank", "item": "https://triviaah.com/trivia-bank" },
          { "@type": "ListItem", "position": 3, "name": trivia.title, "item": pageUrl }
        ]
      },
      {
        "@type": "WebPage",
        "name": trivia.header || `${trivia.title} Questions & Answers`,
        "url": pageUrl,
        "description": description,
        "isPartOf": {
          "@type": "WebSite",
          "name": "Triviaah",
          "url": "https://triviaah.com"
        },
        "about": {
          "@type": "Thing",
          "name": trivia.title
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://triviaah.com/imgs/trivia-bank-card.webp"
        }
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
