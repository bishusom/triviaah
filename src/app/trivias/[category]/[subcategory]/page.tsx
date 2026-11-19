import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import { ArrowRight, BookOpen, Users } from 'lucide-react';
import club from '@/components/home/PuzzleClub.module.css';
import styles from '@/components/trivias/TriviaLibrary.module.css';
import PuzzleClubFooter from '@/components/home/PuzzleClubFooter';

import { getEnrichedSubcategoriesWithMinQuestions } from '@/lib/supabase';
import { slugifyTriviaSegment } from '@/lib/trivia-slugs';
import { buildMetaDescription } from '@/lib/seo';
import { getTriviaCategoryBySlug } from '@/lib/trivia-categories';

const MIN_SUBCATEGORY_QUESTIONS = 30;

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
  meta_description?: string | null;
  keywords?: string[];
  question_count: number;
}

function getSubcategoryDescription(subcategory: SubcategoryInfo, categoryTitle: string) {
  if (subcategory.description && subcategory.description.trim().length > 0) {
    return subcategory.description;
  }

  return `Explore ${subcategory.subcategory.toLowerCase()} trivia inside ${categoryTitle.toLowerCase()} trivia.`;
}

function getSubcategoryMetaDescription(
  subcategory: SubcategoryInfo,
  categoryTitle: string,
) {
  if (subcategory.meta_description && subcategory.meta_description.trim().length > 0) {
    return buildMetaDescription([subcategory.meta_description]);
  }

  return buildMetaDescription([
    `Explore ${subcategory.question_count}+ ${subcategory.subcategory.toLowerCase()} questions in our ${categoryTitle.toLowerCase()} trivia collection.`,
    'Play the quiz now.',
  ]);
}

function getSubcategoryKeywords(
  subcategory: SubcategoryInfo,
  categoryData: TriviaCategory,
) {
  if (subcategory.keywords && subcategory.keywords.length > 0) {
    return subcategory.keywords;
  }

  const categoryTitle = categoryData.title.toLowerCase();
  const subcategoryName = subcategory.subcategory.toLowerCase();

  return [
    `${subcategoryName} trivia`,
    `${subcategoryName} quiz questions`,
    `${categoryTitle} trivia`,
    `${categoryTitle} quiz questions`,
    ...(categoryData.keywords ?? []),
  ];
}

async function getSubcategoryContext(category: string, subcategorySlug: string) {
  const subcategories = await getEnrichedSubcategoriesWithMinQuestions(category, MIN_SUBCATEGORY_QUESTIONS);
  const activeSubcategory = subcategories.find(
    (item) => slugifyTriviaSegment(item.subcategory) === subcategorySlug
  );

  if (!activeSubcategory) {
    return null;
  }

  return {
    activeSubcategory,
    siblingSubcategories: subcategories.filter(
      (item) =>
        item.subcategory !== activeSubcategory.subcategory &&
        item.question_count >= MIN_SUBCATEGORY_QUESTIONS
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
  const description = getSubcategoryMetaDescription(context.activeSubcategory, categoryData.title);
  const keywords = getSubcategoryKeywords(context.activeSubcategory, categoryData);
  const pageTitle = `${subcategoryName} in ${categoryData.title} Trivia`;

  return {
    title: `${pageTitle} | Free Questions & Answers`,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${pageTitle} | Triviaah`,
      description,
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
      description,
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
  const multiplayerHref = `/multiplayer?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(activeSubcategory.subcategory)}`;
  const canonical = `https://triviaah.com/trivias/${category}/${subcategory}`;
  const subcategoryHeading = `${activeSubcategory.subcategory} Trivia Topics in ${categoryData.title}`;
  const relatedCategoriesHeading = `Related Categories for ${activeSubcategory.subcategory} Trivia`;

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
    <div className={club.club}>
      <main id="library-main" className={club.main}>
        <Script id="subcategory-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <section className={styles.hero}>
          <div><p className={club.eyebrow}>{categoryData.title} · TOPIC COLLECTION</p><h1>{activeSubcategory.subcategory}<br /><em>How much do you know?</em></h1><p className={styles.intro}>{activeSubcategoryDescription}</p><div className={club.actions}><Link href={quizHref} className={club.primary}>Play this topic <ArrowRight size={18} /></Link><Link href={multiplayerHref} className={club.textLink}><Users size={17} /> Play with friends</Link></div></div>
          <aside className={styles.libraryNote}><BookOpen size={52} strokeWidth={1.3} /><p className={club.eyebrow}>A FOCUSED KNOWLEDGE WORKOUT</p><h2>One topic.<br />Plenty to discover.</h2><div className={styles.noteStats}><strong>{activeSubcategory.question_count}</strong><span>questions in the collection</span></div><p className={styles.muted}>10 questions per quiz · Free to play</p></aside>
        </section>
        {siblingSubcategories.length > 0 && <section className={styles.section}><div className={club.sectionHeading}><div><p className={club.eyebrow}>KEEP EXPLORING</p><h2>{subcategoryHeading}</h2></div></div><div className={styles.topicGrid}>{siblingSubcategories.slice(0, 9).map(item => <Link key={item.subcategory} href={`/trivias/${category}/${slugifyTriviaSegment(item.subcategory)}`} className={styles.topicCard}><span className={styles.muted}>{item.question_count} questions</span><h3>{item.subcategory}</h3><p>{getSubcategoryDescription(item, categoryData.title)}</p><span className={club.cardAction}>Explore topic <ArrowRight size={17} /></span></Link>)}</div></section>}
        {relatedCategories.length > 0 && <section className={styles.section}><div className={club.sectionHeading}><h2>{relatedCategoriesHeading}</h2></div><div className={styles.topicGrid}>{relatedCategories.map(({ key, data }) => <Link key={key} href={`/trivias/${key}`} className={styles.topicCard}><h3>{data.displayName || data.title}</h3><p>{data.description}</p><span className={club.cardAction}>Explore category <ArrowRight size={17} /></span></Link>)}</div></section>}
        <nav className={styles.backLinks} aria-label="Library navigation"><Link href={`/trivias/${category}`} className={club.textLink}>← Back to {categoryData.title}</Link><Link href="/trivias" className={club.textLink}>Browse the trivia library <ArrowRight size={17} /></Link></nav>
      </main><PuzzleClubFooter />
    </div>
  );
}
