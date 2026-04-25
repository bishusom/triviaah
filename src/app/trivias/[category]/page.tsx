// src/app/trivias/[category]/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import { getEnrichedSubcategoriesWithMinQuestions } from '@/lib/supabase';
import { slugifyTriviaSegment } from '@/lib/trivia-slugs';
import { buildMetaDescription } from '@/lib/seo';
import {
  getTriviaCategoryBySlug,
  getTriviaCategorySlugs,
} from '@/lib/trivia-categories';
import Ads from '@/components/common/Ads';
import { Play, Timer, Info, ShieldQuestionMark, BookOpen, Trophy, CircleStar, Sparkles } from 'lucide-react';

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getTriviaCategorySlugs('trivias');
  return categories.map((category) => ({
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
  icon?: string;
  showPrintableQuizCTA?: boolean;
}

interface Subcategory {
  subcategory: string;
  description?: string | null;
  question_count: number;
}

interface SubcategoryCardVariant {
  shell: string;
  glow: string;
  topBar: string;
  icon: string;
}

function getSubcategoryDescription(subcategory: Subcategory, categoryTitle: string) {
  if (subcategory.description && subcategory.description.trim().length > 0) {
    return subcategory.description;
  }

  return `Explore ${subcategory.subcategory.toLowerCase()} trivia inside ${categoryTitle.toLowerCase()} trivia.`;
}

function getSubcategoryCardVariant(index: number): SubcategoryCardVariant {
  const variants: SubcategoryCardVariant[] = [
    {
      shell: 'from-slate-900/95 via-slate-900 to-cyan-950/60',
      glow: 'rgba(34, 211, 238, 0.18)',
      topBar: 'from-cyan-400 via-sky-400 to-blue-500',
      icon: 'border-cyan-400/30 bg-cyan-400/12 text-cyan-200 shadow-cyan-500/15',
    },
    {
      shell: 'from-slate-900/95 via-slate-900 to-indigo-950/60',
      glow: 'rgba(59, 130, 246, 0.18)',
      topBar: 'from-sky-400 via-blue-400 to-indigo-500',
      icon: 'border-sky-400/30 bg-sky-400/12 text-sky-200 shadow-sky-500/15',
    },
    {
      shell: 'from-slate-900/95 via-slate-900 to-blue-950/60',
      glow: 'rgba(37, 99, 235, 0.18)',
      topBar: 'from-blue-400 via-indigo-400 to-blue-600',
      icon: 'border-blue-400/30 bg-blue-400/12 text-blue-200 shadow-blue-500/15',
    },
    {
      shell: 'from-slate-900/95 via-slate-900 to-emerald-950/60',
      glow: 'rgba(16, 185, 129, 0.18)',
      topBar: 'from-emerald-400 via-teal-400 to-cyan-500',
      icon: 'border-emerald-400/30 bg-emerald-400/12 text-emerald-200 shadow-emerald-500/15',
    },
  ];

  return variants[index % variants.length];
}

interface StructuredDataProps {
  category: string;
  categoryData: TriviaCategory;
  subcategories: Subcategory[];
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const categoryRecord = await getTriviaCategoryBySlug(category);
  const categoryData: TriviaCategory = categoryRecord || {
    title: category.replace(/-/g, ' '),
    description: 'Test your knowledge with our quiz',
  };

  const categoryTitle = categoryData.title;
  const categoryDescription = categoryData.description;
  const description = `Play free ${categoryTitle} trivia quiz. ${categoryDescription} Test your knowledge with 100+ questions across multiple topics. No registration required.`;

  return {
    title: `${categoryTitle} Trivia Quiz | Questions & Answers | Triviaah`,
    description,
    keywords: [
      `${categoryTitle.toLowerCase()} trivia`,
      `${categoryTitle.toLowerCase()} quiz questions`,
      `${categoryTitle.toLowerCase()} answers`,
      'free online trivia',
      'educational quiz',
      'interactive learning'
    ],
    openGraph: {
      title: `${categoryTitle} Trivia Quiz | Triviaah`,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/trivias/${category}`,
      images: categoryData.ogImage ? [{ url: categoryData.ogImage }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryTitle} Challenge`,
      images: categoryData.ogImage ? [categoryData.ogImage] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/trivias/${category}`,
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryRecord = await getTriviaCategoryBySlug(category);
  const categoryData: TriviaCategory = categoryRecord || {
    title: category.replace(/-/g, ' '),
    description: 'Test your knowledge with our quiz',
  };
  const showPrintableQuizCTA = categoryRecord?.showPrintableQuizCTA !== false;

  let subcategories = await getEnrichedSubcategoriesWithMinQuestions(category, 30);
  const relatedCategories = await Promise.all((categoryData.related || [])
    .slice(0, 6)
    .map(async (relatedKey) => {
      const data = await getTriviaCategoryBySlug(relatedKey);
      return data ? { key: relatedKey, data } : null;
    }))
    .then((items) => items.filter((item): item is { key: string; data: NonNullable<typeof item> extends { data: infer T } ? T : never } => item !== null));

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* ── Compact Hero Section ────────────────────────────────────────── */}
        <div className="mb-10 lg:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-white/5 pb-10">
            {/* Title & Play Action */}
            <div className="lg:col-span-8 text-left">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 shrink-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🎯</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
                  {categoryData.title} <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Quiz</span>
                </h1>
              </div>
              
              <p className="text-base md:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed italic">
                &ldquo;{categoryData.description}&rdquo;
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={`/trivias/${category}/quiz`}
                  className="group relative inline-flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-xl shadow-lg shadow-cyan-600/20 transition-all duration-300 font-black uppercase tracking-widest text-sm"
                >
                  <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                  Start Full Quiz
                </Link>
              </div>
            </div>

            {/* Integrated Stats Panel */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="bg-slate-800/40 rounded-3xl p-6 border border-white/5 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <ShieldQuestionMark className="text-xl text-cyan-400 mb-2" />
                    <div className="text-white font-black text-2xl">100+</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500">Questions</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <Timer className="text-xl text-yellow-400 mb-2" />
                    <div className="text-white font-black text-2xl">30s</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500">Per Q</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <Trophy className="text-xl text-green-400 mb-2" />
                    <div className="text-white font-black text-2xl">{subcategories.length}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500">Modules</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <Sparkles className="text-xl text-blue-400 mb-2" />
                    <div className="text-white font-black text-2xl">FREE</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500">Access</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4">
          <Ads format="horizontal" slot="2207590813" isMobileFooter={false} className="lg:hidden" />
        </div>

        {/* Subcategories Section */}
        {subcategories.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-10 uppercase tracking-tighter"><span className="text-cyan-400">Or</span> Choose Your <span className="text-cyan-400">Challenge</span></h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 auto-rows-fr">
              {subcategories.map((subcat, index) => {
                const variant = getSubcategoryCardVariant(index);
                return (
                <Link
                  key={subcat.subcategory}
                  href={`/trivias/${category}/${slugifyTriviaSegment(subcat.subcategory)}`}
                  className={`group relative flex h-full min-h-[150px] items-center justify-center overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-br ${variant.shell} p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-300/30 hover:shadow-[0_28px_70px_rgba(8,145,178,0.24)]`}
                >
                  <div
                    className="absolute inset-0 opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at top right, ${variant.glow}, transparent 32%), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.14), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent 45%)`,
                    }}
                  />
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${variant.topBar}`} />
                  <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl transition-all duration-300 group-hover:bg-cyan-400/20" />

                  <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                        SUB-TOPIC
                      </p>
                      <h3 className="mt-2 flex items-center justify-center gap-2 text-xl font-bold text-white transition-colors group-hover:text-cyan-300">
                        <Sparkles className="h-4 w-4 flex-shrink-0 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.95)] transition-transform duration-300 group-hover:scale-110 group-hover:text-white" />
                        <span>{subcat.subcategory}</span>
                      </h3>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 transition-colors group-hover:border-cyan-300/40 group-hover:bg-cyan-300/15">
                      <Play className="h-3.5 w-3.5 translate-x-[1px]" />
                      Explore
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Learning Objectives */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-10 uppercase tracking-tighter">What You&apos;ll <span className="text-cyan-400">Master</span></h2>
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
        {relatedCategories.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-8 uppercase tracking-tighter">Explore <span className="text-cyan-400">Related</span> Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {relatedCategories.map(({ key, data }) => {
                return (
                  <Link
                    key={key}
                    href={`/trivias/${key}`}
                    className="group bg-slate-800/40 hover:bg-slate-800/60 rounded-2xl p-6 border border-white/5 hover:border-cyan-500/20 transition-all duration-300 text-center"
                  >
                    <h3 className="font-black text-sm text-white group-hover:text-cyan-300 transition-colors mb-2 uppercase tracking-tight">
                      {data.displayName || data.title}
                    </h3>
                    <p className="text-gray-500 text-xs line-clamp-2">
                      Explore this related topic
                    </p>
                    <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-0 group-hover:w-full transition-all duration-700" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-10 uppercase tracking-tighter">Frequently Asked <span className="text-blue-400">Questions</span></h2>
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
              <div key={index} className="bg-slate-800/40 rounded-2xl p-6 border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
                <h3 className="font-black text-white mb-3 uppercase tracking-tight text-sm">{faq.question}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA for Specific Trivia Bank Content */}
        {showPrintableQuizCTA && (
          <section className="mt-12 p-6 md:p-8 rounded-3xl border border-cyan-500/10 bg-cyan-900/5 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto text-left">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 shrink-0 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-inner">
                  <Trophy className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-1">
                    Need a Printable Quiz?
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base max-w-md leading-tight">
                    Download curated quiz sheets. Perfect for hosting your own trivia night or classroom activity.
                  </p>
                </div>
              </div>
              <Link 
                href={`/trivia-bank/${category}-top-50-trivias`}
                title={`Download ${categoryData.title} quiz sheet`}
                className="group flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 font-black uppercase tracking-widest text-xs shrink-0"
              >
                Get Sheet
                <CircleStar className="w-3 h-3 fill-current" />
              </Link>
            </div>
          </section>
        )}
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
