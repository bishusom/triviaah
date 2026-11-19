// src/app/trivias/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import Ads from '@/components/common/Ads';
import { ArrowRight, BookOpen, Users } from 'lucide-react';
import club from '@/components/home/PuzzleClub.module.css';
import styles from '@/components/trivias/TriviaLibrary.module.css';
import PuzzleClubFooter from '@/components/home/PuzzleClubFooter';

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
      'geography trivia',
      'multiplayer trivia',
      'multiplayer quiz',
      'private trivia room',
      'online multiplayer trivia'
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
    <div className={club.club}>
      <main id="library-main" className={club.main}>
        <StructuredData categories={categories} />
        <section className={styles.hero}>
          <div><p className={club.eyebrow}>THE TRIVIA LIBRARY</p><h1>A world of questions.<br /><em>Where will you wander?</em></h1><p className={styles.intro}>From ancient history to your favourite films, follow a familiar interest or find a new fascination. Explore {categories.length} categories, one curious question at a time.</p><div className={club.actions}><Link href="#library-categories" className={club.primary}>Explore the library <ArrowRight size={18} /></Link><span className={styles.muted}>Free to play · No signup needed</span></div></div>
          <aside className={styles.libraryNote}><BookOpen size={62} strokeWidth={1.3} /><p className={club.eyebrow}>SOMETHING FOR EVERY CURIOUS MIND</p><h2>Find your subject.<br />Discover your next obsession.</h2><div className={styles.noteStats}><strong>{categories.length}</strong><span>categories to explore</span></div></aside>
        </section>
        <section id="library-categories" className={styles.section}><div className={club.sectionHeading}><div><p className={club.eyebrow}>FOLLOW YOUR INTERESTS</p><h2>What are you curious about?</h2><p>Browse the collection or search for a favourite topic.</p></div></div><TriviaCategoriesExplorer categories={categoriesForExplorer} /></section>
        <div className={`${club.ad} lg:hidden`}><span>ADVERTISEMENT</span><Ads format="horizontal" slot="2207590813" isMobileFooter={false} className="lg:hidden" /></div>
        <section className={styles.banner}><Users size={38} /><div><p className={club.eyebrow}>A LITTLE FRIENDLY COMPETITION</p><h2>Bring your friends into the story.</h2><p>Choose a category or topic, select Play with friends, and share your private room’s invite link.</p></div><Link href="/multiplayer" className={club.primary}>Explore multiplayer <ArrowRight size={17} /></Link></section>
        <section className={styles.faq}><p className={club.eyebrow}>GOOD TO KNOW</p><h2>Your library questions, answered.</h2>{[
          ['Are these trivia games free?', 'Yes. The trivia library is free to play, with no subscription or account required.'],
          ['How many categories can I explore?', `There are ${categories.length} categories in the library, with focused topic pages to help you explore further.`],
          ['Can I play with friends?', 'Yes. Open a category or topic and select Play with friends to create a private room.'],
          ['Can I play on my phone?', 'Yes. You can browse and play on phones, tablets, and desktop browsers.'],
        ].map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
        <section className={club.explore}><div><p className={club.eyebrow}>TAKE THE QUESTIONS WITH YOU</p><h2>Planning a trivia night?</h2><p>Explore printable quiz sheets and question collections in the Trivia Bank.</p></div><div className={club.exploreLinks}><Link href="/trivia-bank">Visit the Trivia Bank <ArrowRight size={17} /></Link><Link href="/daily-trivias">Try daily trivia <ArrowRight size={17} /></Link></div></section>
        <div className={`${club.ad} lg:hidden`}><span>ADVERTISEMENT</span><Ads format="horizontal" slot="9040722315" isMobileFooter={false} className="lg:hidden" /></div>
      </main><PuzzleClubFooter />
    </div>
  );
}

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
        "description": "Browse our collection of free online trivia quizzes, categories, and multiplayer trivia rooms across topics including history, science, entertainment and more.",
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
              "text": "No account creation is required! You can start playing any of our trivia games immediately without signing up. Multiplayer trivia rooms also work with guest display names and private invite links."
            }
          },
          {
            "@type": "Question",
            "name": "Can I play trivia with friends online?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Many Triviaah category and topic pages include a Play With Friends option that creates a private multiplayer trivia room with an invite link, synchronized questions, and a shared scoreboard."
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
