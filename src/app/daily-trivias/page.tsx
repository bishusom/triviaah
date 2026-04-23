// app/daily-trivias/page.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import Ads from '@/components/common/Ads';
import { Play, Boxes, Clock, Users, Calendar } from 'lucide-react';
import Timer from '@/components/daily/dailyQuizTimer';
import { getTriviaCategories, type TriviaCategoryRecord } from '@/lib/trivia-categories';

export const metadata: Metadata = {
  title: 'Daily Trivia Game - Play Fresh Quizzes Every 24 Hours | Triviaah',
  description: 'Play our free daily trivia game with new questions about history, pop culture, sports, and more! Test your knowledge daily with 10 fresh questions.',
  keywords: 'daily trivia game, daily quiz, trivia challenges, fun quiz, knowledge test',
  alternates: {
    canonical: 'https://triviaah.com/daily-trivias',
  },
  openGraph: {
    title: 'Daily Trivia Game - New Questions Every Day | Triviaah',
    description: 'Challenge yourself with our daily trivia game. 10 fresh questions every 24 hours!',
    url: 'https://triviaah.com/daily-trivias',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/daily-trivias/daily-trivia-og.webp',
        width: 1200,
        height: 630,
        alt: 'Daily Trivia Game - Play Now',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Trivia Game - New Questions Every Day | Triviaah',
    description: 'Challenge yourself with our daily trivia game. 10 fresh questions every 24 hours!',
    images: ['/imgs/daily-trivias/daily-trivia-og.webp'],
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

type DailyQuizCard = {
  category: string;
  name: string;
  path: string;
  image: string;
  tagline: string;
  keywords: string;
};

function categoryToDailyQuizCard(category: TriviaCategoryRecord): DailyQuizCard {
  const name = category.displayName || category.title;
  return {
    category: category.slug,
    name,
    path: `/daily-trivias/${category.slug}`,
    image: category.ogImage || `/imgs/daily-trivias/${category.slug}.webp`,
    tagline: category.description || category.longDescription || `Play ${name} daily trivia.`,
    keywords: category.keywords.join(', '),
  };
}

// Gaming-style quiz card
function QuizCard({ quiz, index }: { quiz: DailyQuizCard; index: number }) {
  return (
    <Link
      key={quiz.category}
      href={quiz.path}
      title={`Play ${quiz.name} Daily Quiz - ${quiz.tagline}`}
      className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-500 bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/20 hover:border-cyan-400/40"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      {/* Quiz Image */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-cyan-900 to-purple-900 overflow-hidden">
        <Image
          src={quiz.image}
          alt={`${quiz.name} Daily Trivia Quiz`}
          fill
          className="object-contain transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAAcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          loading={index < 8 ? "eager" : "lazy"}
          priority={index < 4}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Play button overlay */}
        <div className="absolute bottom-4 right-4 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Play className="w-5 h-5 text-white" />
        </div>

        {/* Daily badge */}
        <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          DAILY
        </div>
      </div>
      
      {/* Quiz Content */}
      <div className="p-6 relative z-10">
        <h3 className="font-bold text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
          {quiz.name}
        </h3>
        <p className="text-sm text-gray-300 line-clamp-2">
          {quiz.tagline}
        </p>
        
        {/* Progress bar effect */}
        <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-0 group-hover:w-full transition-all duration-700" />
        </div>
      </div>
    </Link>
  );
}

export default async function DailyQuizzesPage() {
  const dailyCategories = await getTriviaCategories('daily-trivias');
  const dailyQuizzes = dailyCategories.map(categoryToDailyQuizCard);
  const lastUpdated = new Date();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Structured Data for SEO */}
        <StructuredData quizzes={dailyQuizzes} currentDate={lastUpdated} />
        
        
        {/* ── Compact Hero Section ────────────────────────────────────────── */}
        <div className="mb-8 lg:mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Title & Description */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tight">
                    Daily <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Trivias</span>
                  </h1>
                </div>
              </div>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">
                Fresh challenges every 24 hours. Play our free daily trivia challenges across history, sports, science, and pop culture.
              </p>
              <div className="mt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-slate-800/30 px-3 py-1.5 rounded-full border border-white/5 inline-block">
                  Last Updated: {lastUpdated.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Timer & Stats Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5 backdrop-blur-sm">
                <Timer />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/50 rounded-xl p-2 border border-white/5 text-center">
                  <Boxes className="text-lg text-cyan-400 mx-auto mb-1" />
                  <div className="text-white font-black text-base">{dailyQuizzes.length}</div>
                  <div className="text-[9px] uppercase tracking-widest text-gray-500">Topics</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-2 border border-white/5 text-center">
                  <Clock className="text-lg text-yellow-400 mx-auto mb-1" />
                  <div className="text-white font-black text-base">24h</div>
                  <div className="text-[9px] uppercase tracking-widest text-gray-500">Reset</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-2 border border-white/5 text-center">
                  <Users className="text-lg text-green-400 mx-auto mb-1" />
                  <div className="text-white font-black text-base">Free</div>
                  <div className="text-[9px] uppercase tracking-widest text-gray-500">Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-4">
          <Ads format="horizontal" slot="2207590813" isMobileFooter={false} className="lg:hidden" />
        </div>

        {/* Mobile: Horizontal Scroll Layout */}
        <div className="lg:hidden mb-16 overflow-hidden">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">All Daily Trivia Categories</h2>
          <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scrollbar-hide px-4 -mx-4">
            {dailyQuizzes.map((quiz, index) => (
              <div key={quiz.category} className="w-[260px] shrink-0 snap-start">
                <QuizCard quiz={quiz} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:block mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dailyQuizzes.map((quiz, index) => (
              <QuizCard key={quiz.category} quiz={quiz} index={index} />
            ))}
          </div>
        </div>

        {/* Only one ad allowed per page
        <div className="py-4">
          <Ads format="horizontal" slot="9040722315" isMobileFooter={false} className="lg:hidden" />
        </div>
        */}

        {/* Gaming Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">How Daily Quizzes Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/20 text-center">
              <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">New Challenges Daily</h3>
              <p className="text-gray-300">All quizzes reset at midnight local time with fresh questions every 24 hours!</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Track Your Progress</h3>
              <p className="text-gray-300">Completed quizzes show checkmarks until they reset the next day.</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Compete With Friends</h3>
              <p className="text-gray-300">Share your scores and challenge others to beat your results.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section - Gaming Style */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "How often are new daily trivia quizzes available?",
                answer: "All daily trivia quizzes are updated every 24 hours at midnight in your local timezone. Each quiz category gets fresh questions daily."
              },
              {
                question: "Are the daily trivia quizzes completely free?",
                answer: "Yes! All our daily trivia quizzes are 100% free to play with no registration required. No hidden fees or subscriptions."
              },
              {
                question: "What categories of daily trivia are available?",
                answer: `We offer ${dailyQuizzes.length} different trivia categories including ${dailyQuizzes.map((q) => q.name).join(', ')}. Each category has unique questions updated daily.`
              },
              {
                question: "Do I need to create an account to play daily trivia?",
                answer: "No account or registration is required. You can start playing any daily trivia quiz immediately without signing up."
              },
              {
                question: "How many questions are in each daily quiz?",
                answer: "Each daily quiz contains 10 carefully selected questions that test your knowledge across various difficulty levels."
              },
              {
                question: "Can I play previous days' quizzes?",
                answer: "Currently, we focus on providing fresh daily content. Each day brings brand new questions to keep the challenge exciting!"
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className="font-semibold text-lg text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Content Section */}
        <section className="bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-700">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-3xl font-bold text-white mb-6">Daily Trivia Game Questions</h2>
            <p className="text-lg text-gray-300 mb-6">
              Our <strong className="text-cyan-400">daily trivia game</strong> is the perfect way to test your knowledge in just a few minutes. 
              Each quiz features 10 hand-picked questions that reset at midnight, covering topics like:
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Available Categories</h3>
                <ul className="space-y-3 text-gray-300">
                  {dailyQuizzes.slice(0, 4).map((quiz, index) => {
                    const accentClass = [
                      'text-cyan-400',
                      'text-purple-400',
                      'text-green-400',
                      'text-yellow-400',
                    ][index] || 'text-cyan-400';

                    return (
                      <li key={quiz.category} className="flex items-start">
                        <span className={`${accentClass} font-bold mr-2`}>•</span>
                        <span>
                          <strong>{quiz.name}</strong>: {quiz.tagline}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Why Players Love Daily Trivia</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-cyan-400 font-bold mr-2">✓</span>
                    <span>Perfect for <strong>quick brain exercises</strong> during breaks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 font-bold mr-2">✓</span>
                    <span>Great for <strong>family game nights</strong> or friendly competitions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 font-bold mr-2">✓</span>
                    <span>Learn <strong>surprising facts</strong> daily</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 font-bold mr-2">✓</span>
                    <span><strong>Completely free</strong> with no registration required</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Structured Data Component for SEO
function StructuredData({ quizzes, currentDate }: { quizzes: any[], currentDate: Date }) {
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
        "@id": "https://triviaah.com/daily-trivias/#webpage",
        "url": "https://triviaah.com/daily-trivias",
        "name": "Daily Trivia Game - Play Fresh Quizzes Every 24 Hours | Triviaah",
        "description": "Play our free daily trivia game with new questions about history, pop culture, sports, and more! Test your knowledge daily with 10 fresh questions.",
        "isPartOf": {
          "@id": "https://triviaah.com/#website"
        },
        "about": {
          "@id": "https://triviaah.com/daily-trivias/#itemlist"
        },
        "datePublished": "2024-01-01T00:00:00+00:00",
        "dateModified": currentDate.toISOString(),
        "breadcrumb": {
          "@id": "https://triviaah.com/daily-trivias/#breadcrumb"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://triviaah.com/imgs/daily-trivias/daily-trivia-og.webp",
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
        "@id": "https://triviaah.com/daily-trivias/#itemlist",
        "name": "Daily Trivia Games",
        "description": "Collection of daily trivia quizzes updated every 24 hours",
        "numberOfItems": quizzes.length,
        "itemListElement": quizzes.map((quiz, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Game",
            "name": quiz.name,
            "description": quiz.tagline,
            "url": `https://triviaah.com${quiz.path}`,
            "gameType": "TriviaGame",
            "genre": ["trivia", "educational", "daily-challenge"],
            "applicationCategory": "Game",
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
            }
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://triviaah.com/daily-trivias/#breadcrumb",
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
            "name": "Daily Trivia",
            "item": "https://triviaah.com/daily-trivias"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How often are new daily trivia quizzes available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "All daily trivia quizzes are updated every 24 hours at midnight in your local timezone. Each quiz category gets fresh questions daily."
            }
          },
          {
            "@type": "Question",
            "name": "Are the daily trivia quizzes completely free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! All our daily trivia quizzes are 100% free to play with no registration required. No hidden fees or subscriptions."
            }
          },
          {
            "@type": "Question",
            "name": "What categories of daily trivia are available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `We offer ${quizzes.length} different trivia categories including ${quizzes.map(q => q.name).join(', ')}. Each category has unique questions updated daily.`
            }
          },
          {
            "@type": "Question",
            "name": "Do I need to create an account to play daily trivia?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No account or registration is required. You can start playing any daily trivia quiz immediately without signing up."
            }
          }
        ]
      }
    ]
  };

  return (
    <Script
      id="structured-data-daily-trivias"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
