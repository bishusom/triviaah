import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import { ArrowRight, CircleStar, Play, Trophy } from 'lucide-react';
import { getEnrichedSubcategoriesWithMinQuestions } from '@/lib/supabase';
import { slugifyTriviaSegment } from '@/lib/trivia-slugs';
import { buildMetaDescription } from '@/lib/seo';
import { getTriviaCategoryBySlug } from '@/lib/trivia-categories';

interface TriviaCategory {
  title: string;
  description: string;
  longDescription?: string;
  learningPoints?: string[];
  keywords?: string[];
  ogImage?: string;
  related?: string[];
  displayName?: string;
}

interface SubcategoryInfo {
  subcategory: string;
  description?: string | null;
  question_count: number;
}

function getSubcategoryDescription(subcategory: SubcategoryInfo, categoryTitle: string) {
  if (subcategory.description && subcategory.description.trim().length > 0) {
    return subcategory.description;
  }

  return `Explore ${subcategory.subcategory.toLowerCase()} trivia inside ${categoryTitle.toLowerCase()} trivia.`;
}

async function getSubcategoryContext(category: string, subcategorySlug: string) {
  const subcategories = await getEnrichedSubcategoriesWithMinQuestions(category, 1);
  const activeSubcategory = subcategories.find(
    (item) => slugifyTriviaSegment(item.subcategory) === subcategorySlug
  );

  if (!activeSubcategory) {
    return null;
  }

  return {
    activeSubcategory,
    siblingSubcategories: subcategories.filter(
      (item) => item.subcategory !== activeSubcategory.subcategory
    ),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}): Promise<Metadata> {
  const { category, subcategory } = await params;
  const categoryRecord = await getTriviaCategoryBySlug(category);
  const categoryData: TriviaCategory = categoryRecord || {
    title: category.replace(/-/g, ' '),
    description: 'Test your knowledge with our quiz',
    ogImage: undefined,
    related: [],
  };

  const context = await getSubcategoryContext(category, subcategory);
  if (!context) {
    return {
      title: 'Subcategory Not Found | Triviaah',
    };
  }

  const subcategoryName = context.activeSubcategory.subcategory;
  const canonical = `https://triviaah.com/trivias/${category}/${subcategory}`;
  const description = buildMetaDescription([
    `Explore ${context.activeSubcategory.question_count}+ ${subcategoryName.toLowerCase()} questions in our ${categoryData.title.toLowerCase()} trivia collection.`,
    'Play the quiz now.',
  ]);
  const pageTitle = `${subcategoryName} in ${categoryData.title} Trivia`;

  return {
    title: `${pageTitle} | Free Questions & Answers`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${pageTitle} | Triviaah`,
      description: `Play ${subcategoryName.toLowerCase()} trivia inside our ${categoryData.title.toLowerCase()} category.`,
      url: canonical,
      siteName: 'Triviaah',
      images: categoryData.ogImage
        ? [{ url: categoryData.ogImage, width: 1200, height: 630, alt: pageTitle }]
        : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pageTitle} | Triviaah`,
      description: `Explore ${subcategoryName.toLowerCase()} questions and play the quiz.`,
      images: categoryData.ogImage ? [categoryData.ogImage] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category, subcategory } = await params;
  const categoryRecord = await getTriviaCategoryBySlug(category);
  const categoryData: TriviaCategory = categoryRecord || {
    title: category.replace(/-/g, ' '),
    description: 'Test your knowledge with our quiz',
    ogImage: undefined,
    related: [],
  };

  const context = await getSubcategoryContext(category, subcategory);
  if (!context) {
    notFound();
  }

  const { activeSubcategory, siblingSubcategories } = context;
  const activeSubcategoryDescription = getSubcategoryDescription(activeSubcategory, categoryData.title);
  const pageTitle = `${activeSubcategory.subcategory} in ${categoryData.title} Trivia`;
  const relatedCategories = await Promise.all((categoryData.related || [])
    .slice(0, 6)
    .map(async (relatedKey) => {
      const data = await getTriviaCategoryBySlug(relatedKey);
      return data ? { key: relatedKey, data } : null;
    }))
    .then((items) => items.filter((item): item is { key: string; data: NonNullable<typeof item> extends { data: infer T } ? T : never } => item !== null));

  const quizHref = `/trivias/${category}/quiz?subcategory=${encodeURIComponent(activeSubcategory.subcategory)}`;
  const canonical = `https://triviaah.com/trivias/${category}/${subcategory}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}/#webpage`,
        url: canonical,
        name: pageTitle,
        description: activeSubcategoryDescription,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://triviaah.com' },
          { '@type': 'ListItem', position: 2, name: 'Trivia Categories', item: 'https://triviaah.com/trivias' },
          { '@type': 'ListItem', position: 3, name: categoryData.title, item: `https://triviaah.com/trivias/${category}` },
          { '@type': 'ListItem', position: 4, name: pageTitle, item: canonical },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Script
          id="subcategory-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <div className="rounded-3xl border border-cyan-500/20 bg-gray-900/60 p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <Link href="/trivias" className="hover:text-cyan-400 transition-colors">Trivia Categories</Link>
            <span>/</span>
            <Link href={`/trivias/${category}`} className="hover:text-cyan-400 transition-colors">{categoryData.title}</Link>
            <span>/</span>
            <span className="text-white">{pageTitle}</span>
          </div>

          <div className="mt-6 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Topic Page
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-black text-white">
              {pageTitle}
            </h1>
            <p className="mt-5 text-lg text-gray-300">
              {activeSubcategoryDescription} Start with this subtopic hub, then jump into a focused quiz with {activeSubcategory.question_count}+ questions from the {categoryData.title.toLowerCase()} category.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-gray-700 bg-gray-800/80 p-4 text-center">
              <Trophy className="mx-auto mb-2 text-cyan-400" />
              <div className="text-xl font-bold text-white">{activeSubcategory.question_count}+</div>
              <div className="text-sm text-gray-400">Questions</div>
            </div>
            <div className="rounded-2xl border border-gray-700 bg-gray-800/80 p-4 text-center">
              <Play className="mx-auto mb-2 text-yellow-400" />
              <div className="text-xl font-bold text-white">10</div>
              <div className="text-sm text-gray-400">Per Quiz Run</div>
            </div>
            <div className="rounded-2xl border border-gray-700 bg-gray-800/80 p-4 text-center">
              <CircleStar className="mx-auto mb-2 text-purple-400" />
              <div className="text-xl font-bold text-white">Free</div>
              <div className="text-sm text-gray-400">To Play</div>
            </div>
            <div className="rounded-2xl border border-gray-700 bg-gray-800/80 p-4 text-center">
              <ArrowRight className="mx-auto mb-2 text-green-400" />
              <div className="text-xl font-bold text-white">Direct</div>
              <div className="text-sm text-gray-400">Quiz Access</div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href={quizHref}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-base font-bold text-white transition-transform hover:scale-[1.02]"
            >
              Play {activeSubcategory.subcategory} Quiz
              <Play className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href={`/trivias/${category}`}
              className="inline-flex items-center justify-center rounded-2xl border border-gray-600 bg-gray-800 px-8 py-4 text-base font-semibold text-white transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
            >
              Back to {categoryData.title}
            </Link>
          </div>
        </div>

        {siblingSubcategories.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-white text-center">More {categoryData.title} Topics</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {siblingSubcategories.slice(0, 9).map((item: SubcategoryInfo) => {
                const href = `/trivias/${category}/${slugifyTriviaSegment(item.subcategory)}`;
                const itemDescription = getSubcategoryDescription(item, categoryData.title);
                return (
                  <Link
                    key={item.subcategory}
                    href={href}
                    className="rounded-2xl border border-gray-700 bg-gray-800/70 p-5 transition-colors hover:border-cyan-500/40 hover:bg-gray-800"
                  >
                    <p className="font-semibold text-white">{item.subcategory}</p>
                    <p className="mt-1 text-sm text-gray-400">{itemDescription}</p>
                    <p className="mt-2 text-xs text-cyan-400">{item.question_count}+ questions</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {relatedCategories.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-white text-center">Related Trivia Categories</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {relatedCategories.map(({ key, data }) => (
                <Link
                  key={key}
                  href={`/trivias/${key}`}
                  className="rounded-2xl border border-gray-700 bg-gray-800/70 p-6 transition-colors hover:border-cyan-500/40 hover:bg-gray-800"
                >
                  <p className="text-lg font-semibold text-white">{data.displayName || data.title}</p>
                  <p className="mt-2 text-sm text-gray-400 line-clamp-2">{data.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
