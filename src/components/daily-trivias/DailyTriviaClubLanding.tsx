import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';
import type { Question } from '@/lib/supabase';
import type { TriviaCategoryRecord } from '@/lib/trivia-categories';
import { FAQSection } from '@/app/daily-trivias/[category]/FAQSection';
import { LandingStructuredData } from './LandingStructuredData';
import PuzzleClubFooter from '@/components/home/PuzzleClubFooter';
import club from '@/components/home/PuzzleClub.module.css';
import styles from './DailyTriviaClub.module.css';

type Props = {
  category: string;
  categoryData: TriviaCategoryRecord;
  siblingCategories: { slug: string; name: string; icon: string }[];
  sneakPeekQuestions: Question[];
  playHref: string;
  lastUpdated: string;
  showFAQ: boolean;
};

export default function DailyTriviaClubLanding({ category, categoryData: cfg, siblingCategories, sneakPeekQuestions, playHref, lastUpdated, showFAQ }: Props) {
  const title = cfg.displayName || cfg.title;
  const learningPoints = cfg.learningPoints.length ? cfg.learningPoints : [
    `Explore curated ${title.toLowerCase()} trivia topics.`,
    'Return daily for fresh questions and challenges.',
    'Test what you know and learn something new.',
  ];

  return (
    <div className={club.club}>
      <main id="daily-main" className={club.main}>
        <LandingStructuredData category={category} title={title} description={cfg.description} lastUpdated={lastUpdated} questions={sneakPeekQuestions} />
        <section className={styles.hero}>
          <div>
            <p className={club.eyebrow}>A LITTLE DISCOVERY, EVERY DAY</p>
            <h1>{title}<br /><em>Daily Quiz.</em></h1>
            <p className={styles.intro}>{cfg.longDescription || cfg.description}</p>
            <div className={club.actions}>
              <Link className={club.primary} href={playHref}>Start today’s quiz <ArrowRight size={18} /></Link>
              <Link className={club.textLink} href={`/multiplayer?quizType=daily-trivias&category=${encodeURIComponent(category)}`}><Users size={18} /> Play with friends</Link>
            </div>
            <div className={styles.facts}><span>Free to play</span><span>No signup needed</span><span>Fresh questions daily</span></div>
          </div>
          <div className={styles.categoryArt}><Image src={cfg.ogImage || `/imgs/daily-trivias/${category}.webp`} width={280} height={280} alt={`${title} trivia`} priority /></div>
        </section>

        {sneakPeekQuestions.length > 0 && (
          <section className={styles.warmup}>
            <p className={club.eyebrow}>A LITTLE WARMUP</p><h2>{title} sample questions</h2>
            <p className={styles.intro}>Try a few practice questions before you play. Open each question to reveal the answer and explanation.</p>
            <div className={styles.faq}>{sneakPeekQuestions.map((question, index) => (
              <details key={question.id || index}>
                <summary>{index + 1}. {question.question}{question.difficulty && <span className={styles.difficulty}>{question.difficulty}</span>}</summary>
                <div className={styles.answer}>
                  <strong>Answer: {question.correct}</strong>
                  {question.options?.length > 0 && <div className={styles.options}>{question.options.map((option, optionIndex) => <span key={optionIndex}>{option}</span>)}</div>}
                  {question.titbits && <p>{question.titbits}</p>}
                </div>
              </details>
            ))}</div>
          </section>
        )}

        <section className={club.section}>
          <div className={club.sectionHeading}><div><p className={club.eyebrow}>SOMETHING NEW TO LEARN</p><h2>Feed your curiosity.</h2></div></div>
          <div className={styles.steps}>{learningPoints.map((point, index) => <div key={index}><span>{String(index + 1).padStart(2, '0')}</span><p>{point}</p></div>)}</div>
        </section>

        {showFAQ && <FAQSection formattedCategory={title} hasBonusQuestion={category === 'quick-fire' || category === 'today-in-history'} lastUpdated={lastUpdated} faqItems={cfg.faqItems} light />}

        <section className={club.explore}>
          <div><p className={club.eyebrow}>YOUR NEXT DISCOVERY</p><h2>Try another daily topic.</h2><Link className={club.textLink} href="/daily-trivias">Browse all daily quizzes <ArrowRight size={17} /></Link></div>
          <div className={club.exploreLinks}>{siblingCategories.map(item => <Link key={item.slug} href={`/daily-trivias/${item.slug}`}>{item.name}<ArrowRight size={17} /></Link>)}</div>
        </section>
        {cfg.related.length > 0 && <nav className={styles.related} aria-label="Related trivia topics"><span className={styles.note}>More to explore:</span>{cfg.related.map(slug => <Link key={slug} className={club.textLink} href={`/trivias/${slug}`}>{slug.replace(/-/g, ' ')}</Link>)}</nav>}
      </main>
      <PuzzleClubFooter />
    </div>
  );
}
