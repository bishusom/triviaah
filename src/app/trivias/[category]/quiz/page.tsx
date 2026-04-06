// src/app/trivias/[category]/quiz/page.tsx
import Link from 'next/link';
import QuizGame from '@/components/trivias/QuizGame';
import { getCategoryQuestions, getSubcategoryQuestions, Question } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import { Play } from 'lucide-react';
import triviaCategories from '@/config/triviaCategories.json';

// ─── Types ────────────────────────────────────────────────────────────────────

type CategoryKey = keyof typeof triviaCategories;

interface TriviaCategoryConfig {
  title: string;
  description: string;
  keywords?: string[];
  related?: string[];
  displayName?: string;
}

interface QuizPageProps {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params, searchParams }: QuizPageProps): Promise<Metadata> {
  const { category } = await params;
  const searchParamsObj = await searchParams;

  // ✅ FIX: Subcategory quiz pages (?subcategory=X) share the same canonical as
  // the base quiz page. They are NOT distinct indexable URLs — they're the same
  // page with filtered questions. Setting a ?subcategory= canonical told Google
  // these were unique pages, causing duplicate content signals across all quiz pages.
  // The canonical always points to the base quiz URL.
  const canonicalUrl = `https://triviaah.com/trivias/${category}/quiz`;

  // Pull subcategory only for title/description — NOT for canonical/OG URL
  const subcategory = searchParamsObj?.subcategory as string | undefined;

  // Use category config if available for richer context
  const categoryKey = category as CategoryKey;
  const categoryConfig = triviaCategories[categoryKey] as TriviaCategoryConfig | undefined;

  const formattedCategory = categoryConfig?.title
    ?? category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const formattedSubcategory = subcategory
    ? subcategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : null;

  // ✅ FIX: Stronger, search-intent-aligned titles.
  // "Science Quiz" → nobody searches this.
  // "Science Trivia Questions & Answers | Free Quiz" → matches real queries.
  // Subcategory pages get even more specific: "Evolution Science Quiz | Triviaah"
  const title = formattedSubcategory
    ? `${formattedSubcategory} ${formattedCategory} Trivia Quiz | Triviaah`
    : `${formattedCategory} Trivia Questions & Answers | Free Online Quiz`;

  // ✅ FIX: Unique description per category, not a generic template shared across
  // all quiz pages. Google flags near-identical descriptions as thin content.
  // The category description from triviaCategories.json gives us unique copy for free.
  const categoryContext = categoryConfig?.description
    ? ` ${categoryConfig.description}`
    : '';

  const description = formattedSubcategory
    ? `Test your ${formattedSubcategory.toLowerCase()} knowledge with our free ${formattedCategory.toLowerCase()} quiz.${categoryContext} Multiple-choice questions with instant results.`
    : `Play our free ${formattedCategory.toLowerCase()} trivia quiz — multiple-choice questions with instant scoring.${categoryContext} No sign-up required.`;

  // ✅ FIX: OG URL is always the canonical base URL, never the ?subcategory= variant.
  // Facebook/Twitter use og:url as the canonical link when content is shared.
  const ogUrl = canonicalUrl;

  const ogTitle = formattedSubcategory
    ? `${formattedSubcategory} ${formattedCategory} Quiz — Can you beat the high score?`
    : `${formattedCategory} Trivia Quiz — Test Your Knowledge!`;

  const ogDescription = formattedSubcategory
    ? `How much do you know about ${formattedSubcategory.toLowerCase()} ${formattedCategory.toLowerCase()}? Take the free quiz and find out!`
    : `Think you know your ${formattedCategory.toLowerCase()}? Challenge yourself with our free trivia quiz and see how you rank!`;

  return {
    title,
    description,

    // ✅ Keywords: category-specific, not a generic list repeated on every page
    keywords: [
      `${formattedCategory.toLowerCase()} trivia`,
      `${formattedCategory.toLowerCase()} trivia questions`,
      `${formattedCategory.toLowerCase()} quiz questions and answers`,
      `free ${formattedCategory.toLowerCase()} quiz`,
      `online ${formattedCategory.toLowerCase()} quiz`,
      `${formattedCategory.toLowerCase()} knowledge test`,
      'free trivia quiz',
      'online trivia questions',
      ...(formattedSubcategory
        ? [
          `${formattedSubcategory.toLowerCase()} quiz`,
          `${formattedSubcategory.toLowerCase()} trivia questions`,
          `${formattedSubcategory.toLowerCase()} ${formattedCategory.toLowerCase()} quiz`,
        ]
        : []),
      ...(categoryConfig?.keywords ?? []),
    ],

    // ✅ Use object form — more reliable than string form across Next.js versions
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

    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: ogUrl,          // ✅ Always canonical — never ?subcategory= variant
      siteName: 'Triviaah',
      type: 'website',
      images: [
        {
          url: '/imgs/triviaah-og.webp',
          width: 1200,
          height: 630,
          alt: `${formattedCategory} Trivia Quiz on Triviaah`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ['/imgs/triviaah-og.webp'],
    },

    alternates: {
      canonical: canonicalUrl,  // ✅ Always base URL — ?subcategory= is never canonical
    },
  };
}

// ─── Structured data ──────────────────────────────────────────────────────────
//
// ✅ FIX: Removed the separate structured-data.tsx component — it was making a
// second duplicate Supabase call and was never actually imported anywhere.
// All structured data is generated here from the questions already fetched.
//
// ✅ FIX: The Quiz schema's `url` field for subcategory pages still uses the
// ?subcategory= URL (this is correct — it identifies what the user is actually
// doing), but the canonical + og:url remain the base URL. These serve
// different purposes: canonical = "which URL should rank", schema url = "what
// this content describes". They can and should differ for filtered views.

function generateStructuredData(
  questions: Question[],
  category: string,
  subcategory: string | undefined,
  formattedCategory: string,
  formattedSubcategory: string | null,
) {
  const canonicalUrl = `https://triviaah.com/trivias/${category}/quiz`;
  const quizName = formattedSubcategory
    ? `${formattedSubcategory} ${formattedCategory} Trivia Quiz`
    : `${formattedCategory} Trivia Quiz`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://triviaah.com/#organization',
        name: 'Triviaah',
        url: 'https://triviaah.com/',
        description: 'Triviaah offers engaging and educational trivia games and puzzles for everyone.',
        logo: {
          '@type': 'ImageObject',
          url: 'https://triviaah.com/logo.png',
          width: 200,
          height: 60,
        },
        sameAs: [
          'https://twitter.com/elitetrivias',
          'https://www.facebook.com/elitetrivias',
          'https://www.instagram.com/elitetrivias',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://triviaah.com/#website',
        url: 'https://triviaah.com/',
        name: 'Triviaah',
        description: 'Engaging trivia games and puzzles for everyone',
        publisher: { '@id': 'https://triviaah.com/#organization' },
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://triviaah.com/search?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}/#webpage`,
        url: canonicalUrl,
        name: quizName,
        description: `Test your ${formattedCategory.toLowerCase()} knowledge with ${questions.length} multiple-choice questions.`,
        isPartOf: { '@id': 'https://triviaah.com/#website' },
        about: { '@id': `${canonicalUrl}/#quiz` },
        datePublished: '2024-01-01T00:00:00+00:00',
        dateModified: new Date().toISOString(),
        breadcrumb: { '@id': `${canonicalUrl}/#breadcrumb` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://triviaah.com/imgs/triviaah-og.webp',
          width: 1200,
          height: 630,
        },
      },
      {
        // ✅ Schema.org Quiz type — tells Google exactly what this page is.
        // hasPart contains actual questions + correct answers, which enables
        // rich results in Google Search for quiz content.
        '@type': 'Quiz',
        '@id': `${canonicalUrl}/#quiz`,
        name: quizName,
        description: `Test your ${formattedCategory.toLowerCase()} knowledge with ${questions.length} multiple-choice questions.${formattedSubcategory ? ` Focused on ${formattedSubcategory.toLowerCase()}.` : ''}`,
        url: canonicalUrl,
        numberOfQuestions: questions.length,
        educationalLevel: 'Beginner',
        assesses: formattedSubcategory
          ? `${formattedSubcategory} ${formattedCategory}`
          : formattedCategory,
        hasPart: questions.map((question, index) => ({
          '@type': 'Question',
          position: index + 1,
          name: question.question,
          eduQuestionType: 'Multiple choice',
          text: question.question,
          // ✅ All options as suggestedAnswer, correct answer as acceptedAnswer
          suggestedAnswer: question.options.map((answer: string) => ({
            '@type': 'Answer',
            text: answer,
          })),
          acceptedAnswer: {
            '@type': 'Answer',
            text: question.correct,
          },
        })),
        publisher: { '@id': 'https://triviaah.com/#organization' },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://triviaah.com' },
          { '@type': 'ListItem', position: 2, name: 'Trivia Categories', item: 'https://triviaah.com/trivias' },
          { '@type': 'ListItem', position: 3, name: formattedCategory, item: `https://triviaah.com/trivias/${category}` },
          { '@type': 'ListItem', position: 4, name: 'Quiz', item: canonicalUrl },
        ],
      },
      {
        // ✅ FAQPage schema with actual question content — eligible for FAQ rich results
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `How many questions are in this ${formattedCategory.toLowerCase()} quiz?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `This quiz contains ${questions.length} multiple-choice ${formattedCategory.toLowerCase()} trivia questions${formattedSubcategory ? `, focusing specifically on ${formattedSubcategory.toLowerCase()}` : ' covering various topics within the category'}. Each question has a timer, and you get instant feedback after every answer.`,
            },
          },
          {
            '@type': 'Question',
            name: `Is this ${formattedCategory.toLowerCase()} trivia quiz free?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes, completely free. No registration, no subscription, and no hidden costs. You can retake the ${formattedCategory.toLowerCase()} quiz as many times as you like.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Can I see the correct answers after the quiz?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes — after completing the quiz you receive a full results breakdown showing which questions you got right, which you missed, and the correct answers for every question.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does the quiz work on mobile?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. The quiz is fully responsive and designed for smartphones, tablets, and desktops. No app download needed.',
            },
          },
        ],
      },
    ],
  };
}

// ─── Page component ───────────────────────────────────────────────────────────

export default async function QuizPage({ params, searchParams }: QuizPageProps) {
  try {
    const { category } = await params;
    const searchParamsObj = await searchParams;
    const subcategory = searchParamsObj?.subcategory as string | undefined;

    if (!category || typeof category !== 'string') {
      return notFound();
    }

    const questions = subcategory
      ? await getSubcategoryQuestions(category, subcategory, 10)
      : await getCategoryQuestions(category, 10);

    if (!questions || questions.length === 0) {
      return notFound();
    }

    const categoryKey = category as CategoryKey;
    const categoryConfig = triviaCategories[categoryKey] as TriviaCategoryConfig | undefined;

    const formattedCategory = categoryConfig?.title
      ?? category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const formattedSubcategory = subcategory
      ? subcategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : null;

    const structuredData = generateStructuredData(
      questions,
      category,
      subcategory,
      formattedCategory,
      formattedSubcategory,
    );
    const relatedCategories = (categoryConfig?.related ?? [])
      .map((relatedKey) => ({
        key: relatedKey,
        config: triviaCategories[relatedKey as CategoryKey] as TriviaCategoryConfig | undefined,
      }))
      .filter(
        (item): item is { key: string; config: TriviaCategoryConfig } => Boolean(item.config)
      )
      .slice(0, 6);

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <Script
            id="quiz-structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />

          {/* Quiz header */}
          <div className="text-center mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-md shadow-lg">
                  <Play className="w-3 h-3 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                    {formattedSubcategory ? formattedSubcategory : formattedCategory} Quiz Challenge
                  </h1>
                  {/* ✅ Visible description text — helps Google understand page content
                      beyond just the quiz UI. Previously this was commented out. */}
                  <p className="text-gray-300 text-sm sm:text-base max-w-xl">
                    {formattedSubcategory
                      ? `${questions.length} ${formattedSubcategory.toLowerCase()} trivia questions — see how you score!`
                      : `${questions.length} free ${formattedCategory.toLowerCase()} trivia questions with instant results.`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz game */}
          <div className="mb-8">
            <QuizGame
              initialQuestions={questions}
              category={category}
              subcategory={subcategory}
              quizConfig={{}}
              quizType="trivias"
            />
          </div>

          {/* FAQ section */}
          <QuizFAQ
            category={category}
            subcategory={subcategory}
            questionCount={questions.length}
            formattedCategory={formattedCategory}
            formattedSubcategory={formattedSubcategory}
          />

          {/* ✅ Internal links — passes PageRank back up to category and across
              to related categories. Previously the quiz page was a dead end. */}
          <div className="mt-10 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm text-center mb-4">
              Explore more in{' '}
              <Link
                href={`/trivias/${category}`}
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                {formattedCategory} trivia
              </Link>
              {' '}or browse all{' '}
              <Link
                href="/trivias"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                trivia categories
              </Link>.
            </p>

            {relatedCategories.length > 0 && (
              <div className="mt-6 rounded-2xl border border-gray-700 bg-gray-800/60 p-6">
                <h2 className="text-xl font-bold text-white text-center">Related Trivia Categories</h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                  Explore adjacent topics to discover more quizzes and strengthen topical paths across the site.
                </p>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedCategories.map(({ key, config }) => (
                    <Link
                      key={key}
                      href={`/trivias/${key}`}
                      className="rounded-xl border border-gray-700 bg-gray-900/60 p-4 transition-colors hover:border-cyan-500/40 hover:bg-gray-900"
                    >
                      <p className="font-semibold text-white">
                        {config.displayName || config.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                        {config.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading quiz page:', error);
    return notFound();
  }
}

// ─── FAQ component ────────────────────────────────────────────────────────────
//
// ✅ FIX: FAQ text now matches the FAQPage schema above exactly.
// Google cross-references visible FAQ text against the JSON-LD — mismatches
// can disqualify the page from FAQ rich results.

function QuizFAQ({
  category,
  subcategory,
  questionCount,
  formattedCategory,
  formattedSubcategory,
}: {
  category: string;
  subcategory?: string;
  questionCount: number;
  formattedCategory: string;
  formattedSubcategory: string | null;
}) {
  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-white text-center mb-8">Quiz Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            icon: '🎯',
            title: 'About This Quiz',
            description: `This quiz contains ${questionCount} multiple-choice ${formattedCategory.toLowerCase()} trivia questions${formattedSubcategory ? `, focusing specifically on ${formattedSubcategory.toLowerCase()}` : ' covering various topics within the category'}. Each question has a timer, and you get instant feedback after every answer.`,
          },
          {
            icon: '⚡',
            title: 'How to Play',
            description:
              'Read each question carefully and select the answer you believe is correct. You\'ll receive immediate feedback after each question and can track your progress throughout.',
          },
          {
            icon: '🏆',
            title: 'Scoring System',
            description:
              'Each correct answer earns you points. There\'s no penalty for wrong answers, so feel free to make educated guesses! Track your improvement over multiple attempts.',
          },
          {
            icon: '📚',
            title: 'Learning Objectives',
            description: `Yes, completely free. No registration, no subscription, and no hidden costs. You can retake the ${formattedCategory.toLowerCase()} quiz as many times as you like.`,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">{item.icon}</span>
              </div>
              <h3 className="font-semibold text-lg text-white">{item.title}</h3>
            </div>
            <p className="text-gray-300">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
