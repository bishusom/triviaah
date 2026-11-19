// src/app/trivias/[category]/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getEnrichedSubcategoriesWithMinQuestions } from '@/lib/supabase';
import { slugifyTriviaSegment } from '@/lib/trivia-slugs';
import { buildMetaDescription } from '@/lib/seo';
import {
  getTriviaCategoryBySlug,
  getTriviaCategorySlugs,
} from '@/lib/trivia-categories';
import Ads from '@/components/common/Ads';
import { ArrowRight, BookOpen, Users } from 'lucide-react';
import club from '@/components/home/PuzzleClub.module.css';
import styles from '@/components/trivias/TriviaLibrary.module.css';
import PuzzleClubFooter from '@/components/home/PuzzleClubFooter';


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

function getSubcategoryDescription(subcategory: Subcategory, categoryTitle: string) {
  if (subcategory.description && subcategory.description.trim().length > 0) {
    return subcategory.description;
  }

  return `Explore ${subcategory.subcategory.toLowerCase()} trivia inside ${categoryTitle.toLowerCase()} trivia.`;
}

interface StructuredDataProps {
  category: string;
  categoryData: TriviaCategory;
  subcategories: Subcategory[];
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const categoryRecord = await getTriviaCategoryBySlug(category);
  if (!categoryRecord) {
    return {
      title: 'Category Not Found | Triviaah',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const categoryData: TriviaCategory = categoryRecord;

  const categoryTitle = categoryData.title;
  const categoryDescription = categoryData.description;
  const description = `${categoryDescription}`.trim() || `Test your knowledge with our ${categoryTitle.toLowerCase()} trivia quiz. Free online questions and answers to challenge yourself and learn new facts!`;

  return {
    title: `${categoryTitle} Trivia Quiz | Questions & Answers | Triviaah`,
    description,
    keywords: [
      `${categoryTitle.toLowerCase()} trivia`,
      `${categoryTitle.toLowerCase()} quiz questions`,
      `${categoryTitle.toLowerCase()} answers`,
      `${categoryTitle.toLowerCase()} multiplayer trivia`,
      `${categoryTitle.toLowerCase()} multiplayer quiz`,
      'multiplayer trivia',
      'multiplayer quiz',
      'private trivia room',
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
  if (category === 'quick-fire') {
    redirect('/daily-trivias/quick-fire');
  }

  const categoryRecord = await getTriviaCategoryBySlug(category);
  if (!categoryRecord) {
    notFound();
  }

  const categoryData: TriviaCategory = categoryRecord;
  const showPrintableQuizCTA = categoryRecord?.showPrintableQuizCTA !== false;

  const subcategories = await getEnrichedSubcategoriesWithMinQuestions(category, 30);
  const chooseChallengeHeading = `Choose Your ${categoryData.title} Trivia Challenge`;
  const masteryHeading = `${categoryData.title} Trivia Skills You'll Master`;
  const relatedHeading = `Explore Categories Related to ${categoryData.title} Trivia`;
  const faqHeading = `${categoryData.title} Trivia Frequently Asked Questions`;
  const relatedCategories = await Promise.all((categoryData.related || [])
    .slice(0, 6)
    .map(async (relatedKey) => {
      const data = await getTriviaCategoryBySlug(relatedKey);
      return data ? { key: relatedKey, data } : null;
    }))
    .then((items) => items.filter((item): item is { key: string; data: NonNullable<typeof item> extends { data: infer T } ? T : never } => item !== null));

  return (
    <div className={club.club}>
      <main id="library-main" className={club.main}>
        <section className={styles.hero}>
          <div><p className={club.eyebrow}>FROM THE TRIVIA LIBRARY</p><h1>{categoryData.displayName || categoryData.title}<br /><em>Follow your curiosity.</em></h1><p className={styles.intro}>{categoryData.description}</p><div className={club.actions}><Link href={`/trivias/${category}/quiz`} className={club.primary}>Start the full quiz <ArrowRight size={18} /></Link><Link href={`/multiplayer?category=${encodeURIComponent(category)}`} className={club.textLink}><Users size={17} /> Play with friends</Link></div></div>
          <aside className={styles.libraryNote}><BookOpen size={52} strokeWidth={1.3} /><p className={club.eyebrow}>TAKE A CLOSER LOOK</p><h2>A whole subject.<br />So many discoveries.</h2><div className={styles.noteStats}><strong>{subcategories.length}</strong><span>topics to explore · Free to play</span></div></aside>
        </section>
        {subcategories.length > 0 && <section className={styles.section}><div className={club.sectionHeading}><div><p className={club.eyebrow}>GO A LITTLE DEEPER</p><h2>{chooseChallengeHeading}</h2></div></div><div className={styles.topicGrid}>{subcategories.map(subcat => <Link key={subcat.subcategory} href={`/trivias/${category}/${slugifyTriviaSegment(subcat.subcategory)}`} className={styles.topicCard}><span className={styles.muted}>{subcat.question_count} questions</span><h3>{subcat.subcategory}</h3><p>{getSubcategoryDescription(subcat, categoryData.title)}</p><span className={club.cardAction}>Explore topic <ArrowRight size={17} /></span></Link>)}</div></section>}
        <div className={`${club.ad} lg:hidden`}><span>ADVERTISEMENT</span><Ads format="horizontal" slot="2207590813" isMobileFooter={false} className="lg:hidden" /></div>
        <section className={styles.section}><p className={club.eyebrow}>SOMETHING NEW TO LEARN</p><h2>{masteryHeading}</h2><div className={styles.learning}>{(categoryData.learningPoints || ['Master fundamental principles and terminology', 'Understand key historical developments', 'Discover practical applications and trivia facts']).map((point, index) => <article key={index}><span>{String(index + 1).padStart(2, '0')}</span><p>{point}</p></article>)}</div></section>
        {categoryData.longDescription && <section className={styles.note}><h2>Deep dive: {categoryData.title}</h2><p>{categoryData.longDescription}</p></section>}
        {relatedCategories.length > 0 && <section className={styles.section}><div className={club.sectionHeading}><h2>{relatedHeading}</h2></div><div className={styles.topicGrid}>{relatedCategories.map(({ key, data }) => <Link key={key} href={`/trivias/${key}`} className={styles.topicCard}><h3>{data.displayName || data.title}</h3><p>{data.description}</p><span className={club.cardAction}>Explore category <ArrowRight size={17} /></span></Link>)}</div></section>}
        <section className={styles.faq}><h2>{faqHeading}</h2>{[
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
            ].map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>
        {showPrintableQuizCTA && <section className={styles.banner}><BookOpen size={36} /><div><h2>Take the quiz offline.</h2><p>Download a printable quiz sheet for your next trivia night or classroom activity.</p></div><Link href={`/trivia-bank/${category}-top-50-trivias`} className={club.primary}>Get the quiz sheet <ArrowRight size={17} /></Link></section>}
        <nav className={styles.backLinks} aria-label="Library navigation"><Link href="/trivias" className={club.textLink}>← Back to the trivia library</Link></nav>
        <StructuredData category={category} categoryData={categoryData} subcategories={subcategories} />
      </main><PuzzleClubFooter />
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
