import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowRight, Trophy, Clock, History } from 'lucide-react';
import { getWeeklyChallenges } from '@/lib/challenges';
import club from '@/components/home/PuzzleClub.module.css';
import styles from '@/components/challenges/ChallengeClub.module.css';
import PuzzleClubFooter from '@/components/home/PuzzleClubFooter';
import ChallengeClubCard from '@/components/challenges/ChallengeClubCard';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Weekly Trivia Challenges | Free Timed Topic Quizzes | Triviaah',
  description:
    'Play curated weekly trivia challenges across food, history, science, sports, and pop-culture. 10 questions with 30-second timers refreshed every week.',
  alternates: {
    canonical: 'https://triviaah.com/challenges',
  },
  openGraph: {
    title: 'Weekly Trivia Challenges | Free Timed Topic Quizzes | Triviaah',
    description:
      'Play curated weekly trivia challenges across food, history, science, sports, and pop-culture. 10 questions with 30-second timers refreshed every week.',
    url: 'https://triviaah.com/challenges',
    siteName: 'Triviaah',
    images: [{ url: '/imgs/triviaah-og.webp', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weekly Trivia Challenges | Free Timed Topic Quizzes | Triviaah',
    description:
      'Play curated weekly trivia challenges across food, history, science, sports, and pop-culture.',
    images: ['/imgs/triviaah-og.webp'],
  },
  robots: { index: true, follow: true },
};

export default async function ChallengesPage() {
  const challenges = await getWeeklyChallenges();
  const activeChallenges = challenges.filter(c => c.status === 'active');
  const displayChallenges = activeChallenges.length ? activeChallenges : challenges.filter(c => c.status === 'upcoming');
  const archivedChallenges = challenges.filter(c => c.status === 'past');
  const structuredData = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: 'Weekly Trivia Challenges', url: 'https://triviaah.com/challenges', description: metadata.description,
    mainEntity: { '@type': 'ItemList', itemListElement: displayChallenges.map((challenge, index) => ({
      '@type': 'ListItem', position: index + 1, name: challenge.title, url: `https://triviaah.com/challenges/${challenge.slug}`,
    })) },
  };

  return (
    <div className={club.club}>
      <main id="challenges-main" className={club.main}>
        <Script id="structured-data-weekly-challenges" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <section className={styles.hero}>
          <div>
            <p className={club.eyebrow}>A NEW WEEK. A NEW CHALLENGE.</p>
            <h1>Go a little deeper.<br /><em>Surprise yourself.</em></h1>
            <p className={styles.intro}>A favourite topic. Ten questions. Thirty seconds to make each one count. Discover this week’s collection of focused trivia challenges.</p>
            <div className={club.actions}><Link href="#weekly-lineup" className={club.primary}>Explore the challenges <ArrowRight size={18} /></Link><Link href="/challenges/archive" className={club.textLink}><History size={17} /> Browse the archive</Link></div>
          </div>
          <aside className={styles.weeklyNote}>
            <Trophy size={65} strokeWidth={1.3} />
            <p className={club.eyebrow}>YOUR WEEKLY KNOWLEDGE WORKOUT</p>
            <h2>Small challenge.<br />Big “I knew that!” energy.</h2>
            <div className={styles.noteStats}><span><strong>{activeChallenges.length}</strong> live challenges</span><span><Clock size={18} /><strong>30s</strong> per question</span></div>
          </aside>
        </section>

        <section id="weekly-lineup" className={styles.section}>
          <div className={club.sectionHeading}><div><p className={club.eyebrow}>PICK YOUR NEXT CHALLENGE</p><h2>{activeChallenges.length ? 'In the spotlight this week.' : 'Coming up next.'}</h2><p>One topic at a time. Plenty to discover.</p></div><span className={styles.muted}>{displayChallenges.length} {activeChallenges.length ? 'live' : 'upcoming'} challenges</span></div>
          <div className={`${styles.grid} ${styles.weeklyGrid}`}>{displayChallenges.map(challenge => <ChallengeClubCard key={challenge.id} challenge={challenge} />)}</div>
          {displayChallenges.length === 0 && <div className={styles.empty}><h3>The next lineup is on its way.</h3><p>Explore a past challenge while you wait for the next collection.</p><Link href="/challenges/archive" className={club.textLink}>Visit the archive <ArrowRight size={17} /></Link></div>}
        </section>

        {archivedChallenges.length > 0 && <section className={styles.archiveSection}>
          <div className={club.sectionHeading}><div><p className={club.eyebrow}>WORTH ANOTHER LOOK</p><h2>Good challenges don’t get old.</h2><p>Catch one you missed or revisit a favourite.</p></div><Link href="/challenges/archive" className={club.textLink}>Browse all {archivedChallenges.length} <ArrowRight size={17} /></Link></div>
          <div className={styles.archiveGrid}>{archivedChallenges.slice(0, 6).map(challenge => <ChallengeClubCard key={challenge.id} challenge={challenge} compact />)}</div>
        </section>}

        <section className={club.explore}><div><p className={club.eyebrow}>KEEP THE CURIOSITY GOING</p><h2>Make a little time for play.</h2><p>A fresh daily quiz or a satisfying puzzle is just around the corner.</p></div><div className={club.exploreLinks}><Link href="/daily-trivias">Daily trivia <ArrowRight size={17} /></Link><Link href="/brainwave">Brainwave puzzles <ArrowRight size={17} /></Link></div></section>
      </main>
      <PuzzleClubFooter />
    </div>
  );
}
