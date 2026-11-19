// app/brainwave/page.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import Ads from '@/components/common/Ads';
import { ArrowRight, Brain, Sparkles } from 'lucide-react';
import club from '@/components/home/PuzzleClub.module.css';
import styles from '@/components/brainwave/BrainwaveClub.module.css';
import PuzzleClubFooter from '@/components/home/PuzzleClubFooter';
import { getGamePagesBySection } from '@/lib/game-pages';
import { getBrainwaveRouteDefinitions } from '@/lib/brainwave/brainwave-route-registry';

export const revalidate = 86400;

interface Puzzle {
  route_path: string;
  category: string;
  name: string;
  path: string;
  image: string;
  og_image?: string | null;
  tagline: string;
  intro_text: string;
  supporting_copy: string;
  is_daily_refresh: boolean;
}

export const metadata: Metadata = {
  title: 'Brainwave Games | Daily Trivia Puzzles | Triviaah',
  description:
    'Play free daily Brainwave puzzles on Triviaah. Choose movie, music, geography, history, food, landmark, invention, word, animal, plant, city, country, or celebrity games.',
  keywords: ['brainwave games', 'daily trivia puzzles', 'trivia puzzle games', 'daily puzzle games'],
  alternates: {
    canonical: 'https://triviaah.com/brainwave',
  },
  category: 'games',
  openGraph: {
    title: 'Brainwave Games | Daily Trivia Puzzles | Triviaah',
    description:
      'Play free daily Brainwave puzzles across movies, music, geography, history, words, food, landmarks, inventions, and more.',
    url: 'https://triviaah.com/brainwave',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/brainwave/brainwave-trivia-og.webp',
        width: 1200,
        height: 630,
        alt: 'Brainwave Trivia Games - Play Now',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brainwave Games | Triviaah',
    description:
      'Play Plotle, Capitale, Songle, Historidle, Foodle, Landmarkdle, Synonymle and more daily trivia puzzles.',
    images: ['/imgs/brainwave/brainwave-trivia-og.webp'],
    site: '@elitetrivias',
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

const BRAINWAVE_IMAGE_MAP = Object.fromEntries(
  getBrainwaveRouteDefinitions().map((definition) => [definition.routePath, definition.ogImage]),
);

const FEATURED_BRAINWAVE_SLUGS = new Set([
  'plotle',
  'capitale',
  'historidle',
  'celebrile',
  'songle',
  'literale',
]);

async function getDailyPuzzles() {
  const rows = await getGamePagesBySection('brainwave');

  return rows
    .filter((row) => row.route_path !== '/brainwave')
    .filter((row) => FEATURED_BRAINWAVE_SLUGS.has(row.route_path.split('/').pop() || ''))
    .map((row) => ({
      route_path: row.route_path,
      category: row.route_path.split('/').pop() || row.route_path,
      name: row.title,
      path: row.cta_href || row.route_path,
      image: row.og_image || BRAINWAVE_IMAGE_MAP[row.route_path] || '/imgs/brainwave/brainwave-trivia-og.webp',
      og_image: row.og_image,
      tagline: row.supporting_copy || row.intro_text,
      intro_text: row.intro_text,
      supporting_copy: row.supporting_copy,
      is_daily_refresh: row.is_daily_refresh,
    }));
}

function PuzzleCard({ puzzle, index }: { puzzle: Puzzle; index: number }) {
  return (
    <Link href={puzzle.path} className={styles.card}>
      <div className={`${styles.cardArt} ${club[`tone${index % 4}`]}`}>
        <Image src={puzzle.image} alt="" width={120} height={120} />
        <span>{puzzle.is_daily_refresh ? 'FRESH DAILY' : 'PLAY ANYTIME'}</span>
      </div>
      <div className={styles.cardBody}>
        <h3>{puzzle.name}</h3><p>{puzzle.tagline}</p>
        <span className={club.cardAction}>Find your aha! moment <ArrowRight size={18} /></span>
      </div>
    </Link>
  );
}

export default async function BrainwavePage() {
  const dailyPuzzles = await getDailyPuzzles();
  const currentDate = new Date();

  return (
    <div className={club.club}>
      <main id="brainwave-main" className={club.main}>
        <StructuredData puzzles={dailyPuzzles} currentDate={currentDate} />
        <section className={styles.hero}>
          <div><p className={club.eyebrow}>BRAINWAVE · DAILY PUZZLES</p><h1>Follow the clues.<br /><em>Find your aha!</em></h1><p className={styles.intro}>A movie, a melody, a place, a moment in history. Turn a handful of clues into one satisfying discovery.</p><div className={club.actions}><Link href="#brainwave-games-grid" className={club.primary}>Pick your puzzle <ArrowRight size={18} /></Link><span className={styles.muted}>Free to play · No account needed</span></div></div>
          <div className={styles.heroArt} aria-hidden="true"><Sparkles size={32} /><p>ONE CLUE CLOSER</p><Brain size={72} strokeWidth={1.3} /><strong>Connect the dots.</strong><div className={styles.tiles}>{['?', '?', '!', '✓'].map((letter, i) => <span key={i}>{letter}</span>)}</div><span>A little curiosity goes a long way.</span></div>
        </section>
        <section id="brainwave-games-grid" className={styles.section}>
          <div className={club.sectionHeading}><div><p className={club.eyebrow}>FOLLOW YOUR CURIOSITY</p><h2>What will you figure out today?</h2><p>Pick a topic you love. Let the clues do the rest.</p></div><span className={styles.muted}>{dailyPuzzles.length} featured puzzles</span></div>
          <div className={styles.grid}>{dailyPuzzles.map((puzzle, index) => <PuzzleCard key={puzzle.category} puzzle={puzzle} index={index} />)}</div>
          {dailyPuzzles.length === 0 && <p className={styles.empty}>The puzzle collection is unavailable right now. Please try again shortly.</p>}
        </section>
        <div className={`${club.ad} lg:hidden`}><span>ADVERTISEMENT</span><Ads format="horizontal" slot="2207590813" isMobileFooter={false} className="lg:hidden" /></div>
        <section className={styles.section}><p className={club.eyebrow}>A LITTLE DAILY DEDUCTION</p><h2>Curiosity is all you need.</h2><div className={styles.steps}>{[
          ['01', 'Pick your world', 'Movies, music, books, capitals, history, or celebrities. Start with something that sparks your interest.'],
          ['02', 'Follow the clues', 'Make a guess and use the feedback. Each puzzle has its own hints to help you narrow things down.'],
          ['03', 'Come back curious', 'Enjoy the solve, share your result, and return for another daily mystery.'],
        ].map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
        <section className={styles.faq}><p className={club.eyebrow}>GOOD TO KNOW</p><h2>A few clues before you begin.</h2>{[
              {
                question: "What are Brainwave games?",
                answer: "Brainwave games are free daily trivia puzzles built around clues and themed answers."
              },
              {
                question: "Are these games free to play?",
                answer: "Yes. Brainwave games are free to play and do not require an account."
              },
              {
                question: "How often are new puzzles available?",
                answer: "Each Brainwave game gets a new puzzle every day."
              },
              {
                question: "Which Brainwave game is best for beginners?",
                answer: "Capitale, Foodle, and Songle are good starting points because their clue categories are familiar and easy to reason through. Plotle is also beginner-friendly if you watch a lot of movies."
              },
              {
                question: "Which Brainwave game is the most challenging?",
                answer: "Synonymle, Trordle, Historidle, and Inventionle tend to be the most challenging because they require deeper vocabulary, broader general knowledge, or careful clue synthesis."
              },
              {
                question: "Can I play on mobile devices?",
                answer: "Yes. Brainwave games work on phones, tablets, and desktop browsers."
              },
              {
                question: "What if I can't solve a puzzle?",
                answer: "Use the available hints or come back later. Some games reveal more clues as you play."
              },
              {
                question: "Can I share my results?",
                answer: "Yes. Completed games include a share option for your result."
              }
            ].map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>
        <section className={club.explore}><div><p className={club.eyebrow}>KEEP EXPLORING</p><h2>More ways to give your brain a break.</h2></div><div className={club.exploreLinks}>{[['Daily trivia', '/daily-trivias'], ['Weekly challenges', '/challenges'], ['Word games', '/word-games'], ['Trivia library', '/trivias']].map(([label, href]) => <Link key={href} href={href}>{label}<ArrowRight size={17} /></Link>)}</div></section>
      </main>
      <PuzzleClubFooter />
    </div>
  );
}

function StructuredData({ puzzles, currentDate }: { puzzles: Puzzle[], currentDate: Date }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://triviaah.com/#organization",
        "name": "Triviaah",
        "url": "https://triviaah.com/",
        "description": "Triviaah offers engaging and educational trivia games, daily puzzles, word games, and knowledge challenges for everyone.",
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
        "@id": "https://triviaah.com/brainwave/#webpage",
        "url": "https://triviaah.com/brainwave",
        "name": "Brainwave Games | Daily Trivia Puzzles | Triviaah",
        "description": "Play free daily Brainwave puzzles on Triviaah. Choose movie, music, geography, history, food, landmark, invention, word, animal, plant, city, country, or celebrity games.",
        "isPartOf": {
          "@id": "https://triviaah.com/#website"
        },
        "about": {
          "@id": "https://triviaah.com/brainwave/#itemlist"
        },
        "datePublished": "2024-01-01T00:00:00+00:00",
        "dateModified": currentDate.toISOString(),
        "inLanguage": "en-US",
        "breadcrumb": {
          "@id": "https://triviaah.com/brainwave/#breadcrumb"
        },
        "mainEntity": {
          "@id": "https://triviaah.com/brainwave/#itemlist"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://triviaah.com/imgs/brainwave/brainwave-trivia-og.webp",
          "width": 1200,
          "height": 630
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://triviaah.com/#website",
        "url": "https://triviaah.com/",
        "name": "Triviaah",
        "description": "Engaging trivia games, daily puzzles, word games, and knowledge challenges for everyone",
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
        "@id": "https://triviaah.com/brainwave/#itemlist",
        "name": "Brainwave Daily Puzzle Games",
        "description": "Collection of Brainwave trivia puzzles covering movies, music, geography, history, words, food, landmarks, inventions, cities, countries, plants, animals, and pop culture",
        "numberOfItems": puzzles.length,
        "itemListElement": puzzles.map((puzzle, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Game",
            "name": puzzle.name,
            "description": puzzle.tagline,
            "url": `https://triviaah.com${puzzle.path}`,
            "gameType": "PuzzleGame",
            "genre": ["puzzle", "trivia", "daily puzzle", "educational"],
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
        "@id": "https://triviaah.com/brainwave/#breadcrumb",
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
            "name": "Brainwave Games",
            "item": "https://triviaah.com/brainwave"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are Brainwave games?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Brainwave games are free daily trivia puzzles that combine clue solving with specific knowledge themes. The collection includes movie, music, geography, history, food, landmark, invention, word, animal, plant, city, country, and celebrity puzzles."
            }
          },
          {
            "@type": "Question",
            "name": "Are these games free to play?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Brainwave games are free to play and do not require an account."
            }
          },
          {
            "@type": "Question",
            "name": "How often are new puzzles available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Each Brainwave game gets a new puzzle every day."
            }
          },
          {
            "@type": "Question",
            "name": "Which Brainwave game is best for beginners?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Capitale, Foodle, and Songle are good starting points because their clue categories are familiar and easy to reason through. Plotle is also beginner-friendly if you watch a lot of movies."
            }
          },
          {
            "@type": "Question",
            "name": "Which Brainwave game is the most challenging?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Synonymle, Trordle, Historidle, and Inventionle tend to be the most challenging because they require deeper vocabulary, broader general knowledge, or careful clue synthesis."
            }
          },
          {
            "@type": "Question",
            "name": "Can I play on mobile devices?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Brainwave games work on phones, tablets, and desktop browsers."
            }
          },
          {
            "@type": "Question",
            "name": "What if I can't solve a puzzle?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use the available hints or come back later. Some games reveal more clues as you play."
            }
          },
          {
            "@type": "Question",
            "name": "Can I share my results?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Completed games include a share option for your result."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need to create an account?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No account is required. You can open any Brainwave game and start playing immediately in your browser."
            }
          }
        ]
      }
    ]
  };

  return (
    <Script
      id="structured-data-brainwave"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
