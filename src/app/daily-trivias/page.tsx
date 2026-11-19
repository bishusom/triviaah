// app/daily-trivias/page.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import Ads from '@/components/common/Ads';
import { ArrowRight, CalendarDays, Users, Sparkles } from 'lucide-react';
import club from '@/components/home/PuzzleClub.module.css';
import styles from '@/components/daily-trivias/DailyTriviaClub.module.css';
import PuzzleClubFooter from '@/components/home/PuzzleClubFooter';
import Timer from '@/components/daily/dailyQuizTimer';
import { getTriviaCategories, type TriviaCategoryRecord } from '@/lib/trivia-categories';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Daily Trivia Games | Fresh Quizzes Every Day | Triviaah',
  description: 'Play free daily trivia quizzes on Triviaah. Choose history, geography, sports, science, entertainment, arts, quick fire, or general knowledge.',
  keywords: 'daily trivia, daily quiz, trivia games, general knowledge quiz',
  alternates: {
    canonical: 'https://triviaah.com/daily-trivias',
  },
  category: 'games',
  openGraph: {
    title: 'Daily Trivia Game - New Questions Every Day | Triviaah',
    description: 'Challenge yourself with our daily trivia game. 10 fresh questions every 24 hours across history, sports, science, geography and more!',
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
};

const FEATURED_DAILY_TRIVIA_CATEGORIES = new Set([
  'general-knowledge',
  'quick-fire',
  'today-in-history',
  'entertainment',
  'sports',
  'nature',
]);

function resolveDailyQuizImage(category: TriviaCategoryRecord) {
  return category.ogImage || `/imgs/daily-trivias/${category.slug}.webp`;
}

function categoryToDailyQuizCard(category: TriviaCategoryRecord): DailyQuizCard {
  const name = category.displayName || category.title;
  return {
    category: category.slug,
    name,
    path: `/daily-trivias/${category.slug}`,
    image: resolveDailyQuizImage(category),
    tagline: category.description || category.longDescription || `Play ${name} daily trivia.`,
  };
}

function QuizCard({ quiz, index }: { quiz: DailyQuizCard; index: number }) {
  return (
    <Link href={quiz.path} className={styles.card}>
      <div className={`${styles.cardArt} ${club[`tone${index % 4}`]}`}>
        <Image src={quiz.image} alt="" width={128} height={128} className={styles.cardImage} />
        <span className={styles.dailyBadge}>FRESH DAILY</span>
      </div>
      <div className={styles.cardBody}>
        <h3>{quiz.name}</h3>
        <p>{quiz.tagline}</p>
        <span className={club.cardAction}>Explore today’s quiz <ArrowRight size={18} /></span>
      </div>
    </Link>
  );
}

export default async function DailyQuizzesPage() {
  const dailyCategories = await getTriviaCategories('daily-trivias');
  const dailyQuizzes = dailyCategories
    .filter((category) => FEATURED_DAILY_TRIVIA_CATEGORIES.has(category.slug))
    .map(categoryToDailyQuizCard);
  const lastUpdated = new Date();

  return (
    <div className={club.club}>
      <main id="daily-main" className={club.main}>
        <StructuredData quizzes={dailyQuizzes} currentDate={lastUpdated} />
        <section className={styles.hero}>
          <div>
            <p className={club.eyebrow}><CalendarDays size={15} /> YOUR DAILY DOSE OF DISCOVERY</p>
            <h1>A new day.<br />A little <em>more curious.</em></h1>
            <p className={styles.intro}>Pick your topic, put your knowledge to the test, and learn something unexpected. Fresh daily trivia, ready whenever you are.</p>
            <div className={club.actions}>
              <Link href="#daily-trivia-categories" className={club.primary}>Choose your quiz <ArrowRight size={18} /></Link>
              <span className={styles.note}>Free to play · No account needed</span>
            </div>
          </div>
          <aside className={styles.dailyNote}>
            <CalendarDays size={35} strokeWidth={1.5} />
            <p className={club.eyebrow}>MAKE A LITTLE TIME FOR TRIVIA</p>
            <h2>A fresh set.<br />Every single day.</h2>
            <p>{dailyQuizzes.length} featured topics. Plenty of possibilities.</p>
            <div className={styles.reset}><Timer className={styles.timer} /></div>
          </aside>
        </section>

        <section id="daily-trivia-categories" className={styles.categories}>
          <div className={club.sectionHeading}>
            <div><p className={club.eyebrow}>FOLLOW YOUR CURIOSITY</p><h2>What’s your topic today?</h2><p>Start with a favourite. Come back for something new.</p></div>
            <span className={styles.note}><Sparkles size={15} /> {dailyQuizzes.length} daily quizzes</span>
          </div>
          <div className={styles.grid}>{dailyQuizzes.map((quiz, index) => <QuizCard key={quiz.category} quiz={quiz} index={index} />)}</div>
          {dailyQuizzes.length === 0 && <p className={styles.empty}>Today’s categories are unavailable right now. Please try again shortly.</p>}
        </section>

        <div className={`${club.ad} lg:hidden`}><span>ADVERTISEMENT</span><Ads format="horizontal" slot="2207590813" isMobileFooter={false} className="lg:hidden" /></div>

        <section className={styles.friends}>
          <span className={styles.friendsIcon}><Users size={36} strokeWidth={1.5} /></span>
          <div><p className={club.eyebrow}>BETTER WITH A LITTLE FRIENDLY RIVALRY</p><h2>Same questions. Different bragging rights.</h2><p>Create a private quiz room, share the invite, and see who knows their stuff.</p></div>
          <Link href="/multiplayer?quizType=daily-trivias" className={club.primary}>Play with friends <ArrowRight size={18} /></Link>
        </section>

        <section className={club.section}>
          <div className={club.sectionHeading}><div><p className={club.eyebrow}>A SIMPLE DAILY RITUAL</p><h2>Pick. Play. Come back curious.</h2></div></div>
          <div className={styles.steps}>
            {[
              ['01', 'Find your favourite', 'Choose a topic you love or try something outside your usual interests.'],
              ['02', 'Put your knowledge to work', 'Answer the day’s questions and discover something new along the way.'],
              ['03', 'Make it a daily habit', 'Compare scores with friends and return for a fresh set after the next reset.'],
            ].map(([number, title, text]) => <div key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></div>)}
          </div>
        </section>

        <section className={styles.faq}>
          <p className={club.eyebrow}>GOOD TO KNOW</p><h2>A few curious questions.</h2>
          {[
              {
                question: 'How often are new daily trivia quizzes available?',
                answer:
                  'Daily quizzes refresh every 24 hours. Played categories open again after the next reset.',
              },
              {
                question: 'Are the daily trivia quizzes completely free?',
                answer:
                  'Yes. The daily trivia categories are free to play, and you do not need an account.',
              },
              {
                question: 'What categories of daily trivia are available?',
                answer: `We currently offer ${dailyQuizzes.length} categories: ${dailyQuizzes.map((q) => q.name).join(', ')}. Each one covers a different knowledge domain and is refreshed independently every 24 hours.`,
              },
              {
                question: 'Do I need to create an account to play?',
                answer:
                  'No. Choose a category and start answering. Completion checkmarks are stored in your browser.',
              },
              {
                question: 'How many questions are in each daily quiz?',
                answer:
                  'Most categories have 10 questions. Quick Fire has 6 timed questions.',
              },
              {
                question: 'Can I play previous days\' quizzes?',
                answer:
                  'No. Daily trivia is built around today\'s shared quiz. Older sets are replaced at reset.',
              },
              {
                question: 'How difficult are the questions?',
                answer:
                  'Each set mixes easy, medium, and harder questions so casual players and regulars both have a reason to play.',
              },
              {
                question: 'Can I use daily trivia for a pub quiz or team game?',
                answer:
                  'Yes. Use Play With Friends to create a private room with an invite link and shared scoreboard.',
              },
            ].map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
        </section>
        <section className={club.explore}>
          <div><p className={club.eyebrow}>KEEP EXPLORING</p><h2>Still in a curious mood?</h2><p>There’s always another way to challenge your mind.</p></div>
          <div className={club.exploreLinks}>{[['Brainwave puzzles', '/brainwave'], ['Weekly challenges', '/challenges'], ['Trivia library', '/trivias'], ['Leaderboard', '/leaderboard']].map(([label, href]) => <Link key={href} href={href}>{label}<ArrowRight size={17} /></Link>)}</div>
        </section>
      </main>
      <PuzzleClubFooter />
    </div>
  );
}

function StructuredData({ quizzes, currentDate }: { quizzes: DailyQuizCard[]; currentDate: Date }) {
  const structuredData = {
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
        '@type': 'WebPage',
        '@id': 'https://triviaah.com/daily-trivias/#webpage',
        url: 'https://triviaah.com/daily-trivias',
        name: 'Daily Trivia Games | Fresh Quizzes Every Day | Triviaah',
        description:
          'Play free daily trivia quizzes on Triviaah. Choose history, geography, sports, science, entertainment, arts, quick fire, or general knowledge.',
        isPartOf: { '@id': 'https://triviaah.com/#website' },
        about: { '@id': 'https://triviaah.com/daily-trivias/#itemlist' },
        datePublished: '2024-01-01T00:00:00+00:00',
        dateModified: currentDate.toISOString(),
        inLanguage: 'en-US',
        breadcrumb: { '@id': 'https://triviaah.com/daily-trivias/#breadcrumb' },
        mainEntity: { '@id': 'https://triviaah.com/daily-trivias/#itemlist' },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://triviaah.com/imgs/daily-trivias/daily-trivia-og.webp',
          width: 1200,
          height: 630,
        },
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
        '@type': 'ItemList',
        '@id': 'https://triviaah.com/daily-trivias/#itemlist',
        name: 'Daily Trivia Games',
        description: 'Collection of daily trivia quizzes updated every 24 hours',
        numberOfItems: quizzes.length,
        itemListElement: quizzes.map((quiz, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Game',
            name: quiz.name,
            description: quiz.tagline,
            url: `https://triviaah.com${quiz.path}`,
            gameType: 'TriviaGame',
            genre: ['trivia', 'educational', 'daily-challenge'],
            applicationCategory: 'Game',
            numberOfPlayers: { '@type': 'QuantitativeValue', minValue: 1 },
            publisher: { '@id': 'https://triviaah.com/#organization' },
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://triviaah.com/daily-trivias/#breadcrumb',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://triviaah.com' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Daily Trivia',
            item: 'https://triviaah.com/daily-trivias',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How often are new daily trivia quizzes available?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Daily quizzes refresh every 24 hours. Played categories open again after the next reset.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are the daily trivia quizzes completely free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. The daily trivia categories are free to play, and you do not need an account.',
            },
          },
          {
            '@type': 'Question',
            name: 'What categories of daily trivia are available?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `We currently offer ${quizzes.length} categories: ${quizzes.map((q) => q.name).join(', ')}. Each one covers a different knowledge domain and is refreshed independently every 24 hours.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need to create an account to play daily trivia?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Choose a category and start answering. Completion checkmarks are stored in your browser.',
            },
          },
          {
            '@type': 'Question',
            name: 'How many questions are in each daily quiz?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Most categories have 10 questions. Quick Fire has 6 timed questions.',
            },
          },
          {
            '@type': 'Question',
            name: 'How difficult are the questions?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Each set mixes easy, medium, and harder questions so casual players and regulars both have a reason to play.',
            },
          },
        ],
      },
    ],
  };

  return (
    <Script
      id="structured-data-daily-trivias"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
