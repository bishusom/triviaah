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
  const description = 'Explore 30+ free trivia categories including History, Science, Entertainment, and Sports. Master 10,000+ questions and become a trivia champion on Triviaah.';

  return {
    title: 'Free Online Trivia Categories | Quiz Games & Challenges | Triviaah',
    description,
    keywords: [
      'free online trivia',
      'trivia categories',
      'quiz games online free',
      'history trivia',
      'science trivia',
      'entertainment trivia',
      'sports trivia',
      'geography trivia'
    ],
    alternates: {
      canonical: 'https://triviaah.com/trivias',
    },
    openGraph: {
      title: 'Free Online Trivia Categories | Quiz Games & Challenges',
      description,
      url: 'https://triviaah.com/trivias',
      images: [{ url: '/imgs/triviaah-og.webp' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Trivia Categories | Free Online Quiz Games',
      images: ['/imgs/triviaah-og.webp'],
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function TriviasPage() {
  const categories = await getTriviaCategories('trivias');
  const categoriesForExplorer = await getTriviaExplorerCards('trivias');

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Structured Data for SEO */}
        <StructuredData categories={categories} />
        
        {/* ── Compact Hero Section ────────────────────────────────────────── */}
        <div className="mb-10 lg:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Title & Description */}
            <div className="lg:col-span-8 text-left">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Boxes className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                    Trivia <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Categories</span>
                  </h1>
                </div>
              </div>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">
                Test your knowledge across {categories.length} high-octane categories. 
                From history buffs to pop-culture fans, we have the ultimate challenge waiting for you.
              </p>
            </div>

            {/* Integrated Stats */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="bg-slate-800/40 rounded-2xl p-6 border border-white/5 backdrop-blur-sm text-center">
                <div className="flex items-center justify-center divide-x divide-white/10">
                  <div className="px-6">
                    <div className="text-white font-black text-3xl leading-none">{categories.length}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-2">Topics</div>
                  </div>
                  <div className="px-6">
                    <div className="text-white font-black text-3xl leading-none">10K+</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-2">Questions</div>
                  </div>
                  <div className="px-6">
                    <div className="text-white font-black text-3xl leading-none">FREE</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-2">Play</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

         <div className="py-4">
          <Ads format="horizontal" slot="2207590813" isMobileFooter={false} className="lg:hidden" />
        </div>

        <TriviaCategoriesExplorer categories={categoriesForExplorer} />

        {/* ── Compact Trivia Bank CTA ─────────────────────────────────────── */}
        <section className="mt-16 p-6 md:p-8 rounded-3xl border border-cyan-500/10 bg-cyan-900/5 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-5 text-left">
              <div className="w-14 h-14 shrink-0 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                <Boxes className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-1">
                  Looking for Printables?
                </h2>
                <p className="text-gray-400 text-sm md:text-base max-w-md leading-tight">
                  Access downloadable quiz sheets and "Top 50" lists in our comprehensive <strong>Trivia Bank</strong>.
                </p>
              </div>
            </div>
            <Link 
              href="/trivia-bank"
              title="Explore our downloadable trivia sheets"
              className="group flex items-center gap-3 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all duration-300 shadow-lg shadow-cyan-600/20 font-black uppercase tracking-widest text-xs shrink-0"
            >
              Browse Bank
              <Play className="w-3 h-3 fill-current group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        
        <div className="py-4">
          <Ads format="horizontal" slot="9040722315" isMobileFooter={false} className="lg:hidden" />
        </div>
                
        {/* Gaming Features Section - Blue Themed */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-10 uppercase tracking-tighter">
            The <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Triviaah</span> Advantage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl p-6 border border-white/5 text-center group hover:border-cyan-500/20 transition-colors">
              <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">Instant Play</h3>
              <p className="text-gray-400 text-sm leading-relaxed">No registration needed. Start playing immediately and challenge your knowledge bank!</p>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl p-6 border border-white/5 text-center group hover:border-cyan-500/20 transition-colors">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <span className="text-xl">📚</span>
              </div>
              <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">Learn & Grow</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Detailed explanations help you learn from every question you answer. Knowledge is power.</p>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl p-6 border border-white/5 text-center group hover:border-cyan-500/20 transition-colors">
              <div className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-400/20 group-hover:scale-110 transition-transform">
                <span className="text-xl">🏆</span>
              </div>
              <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">Track Progress</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Monitor your improvement and compete for high scores across all gaming categories.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section - Gaming Style */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-10 uppercase tracking-tighter">
            Frequently Asked <span className="text-cyan-400">Questions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "Are these trivia games completely free to play?",
                answer: "Yes! All our trivia games and quizzes are 100% free. No subscriptions, hidden fees, or registration required."
              },
              {
                question: "How many trivia categories are available?",
                answer: `We offer over ${categories.length} diverse trivia categories covering everything from History and Science to modern Pop Culture and Sports.`
              },
              {
                question: "Do I need to create an account to play?",
                answer: "No account creation is required. You can jump straight into any category and start challenging your knowledge immediately."
              },
              {
                question: "Is Triviaah mobile-friendly?",
                answer: "Absolutely! Our platform is fully responsive, optimized for seamless play on smartphones, tablets, and desktop computers."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-slate-800/40 rounded-2xl p-6 border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
                <h3 className="font-black text-white mb-3 uppercase tracking-tight text-sm">{faq.question}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEO Informational Content Section ────────────────────────────── */}
        <section className="mb-16 border-t border-white/5 pt-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-8 uppercase tracking-tighter text-center lg:text-left">
              The Ultimate Hub for <span className="text-blue-400">Free Online Trivia</span>
            </h2>
            
            <div className="grid gap-10">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-cyan-400 uppercase tracking-widest">A Category for Every Curious Mind</h3>
                <p className="text-gray-400 leading-relaxed">
                  At <strong>Triviaah</strong>, we believe knowledge should be accessible and entertaining. Our vast library of 
                  <strong> trivia categories</strong> is curated to challenge both casual players and hard-core quiz enthusiasts. 
                  Whether you're looking for <strong>History trivia</strong> to test your timeline knowledge, <strong>Science quizzes</strong> 
                  to explore the universe, or <strong>Entertainment trivia</strong> to prove your pop-culture prowess, we have it all.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <h4 className="text-white font-black uppercase tracking-tight mb-3">Educational Benefits</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Playing trivia isn't just fun—it's a workout for your brain. Regular quiz gaming has been shown to improve 
                    <strong> memory retention</strong>, increase <strong>general knowledge</strong>, and enhance 
                    <strong> problem-solving skills</strong> across all age groups.
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <h4 className="text-white font-black uppercase tracking-tight mb-3">No Registration Required</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Unlike other platforms, Triviaah offers <strong>instant access</strong>. We don't ask for your email or 
                    personal details. Just pick a topic and start your <strong>free quiz game</strong> journey in seconds.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-black text-blue-400 uppercase tracking-widest">How to Play & Win</h3>
                <p className="text-gray-400 leading-relaxed">
                  Simply select one of the categories above to launch a dedicated trivia session. Each topic features multiple 
                  difficulty levels, from <strong>Easy</strong> introductions to <strong>Hard</strong> challenges that will 
                  test even the most seasoned experts. Perfect for <strong>classroom activities</strong>, <strong>family game nights</strong>, 
                  or a quick mental break during the day.
                </p>
              </div>
            </div>
          </div>
        </section>

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
          "url": "https://triviaah.com/imgs/triviaah-og.webp",
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
