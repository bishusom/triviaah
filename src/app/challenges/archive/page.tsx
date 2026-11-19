import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { getWeeklyChallenges, type WeeklyTriviaChallenge } from '@/lib/challenges';
import club from '@/components/home/PuzzleClub.module.css';
import styles from '@/components/challenges/ChallengeClub.module.css';
import PuzzleClubFooter from '@/components/home/PuzzleClubFooter';
import ChallengeClubCard from '@/components/challenges/ChallengeClubCard';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Trivia Challenge Archive | Past Weekly Quizzes | Triviaah',
  description:
    'Browse and replay past Triviaah weekly challenges by category, month, or topic.',
  alternates: {
    canonical: 'https://triviaah.com/challenges/archive',
  },
  openGraph: {
    title: 'Trivia Challenge Archive | Triviaah',
    description: 'Find and replay past weekly trivia challenges.',
    url: 'https://triviaah.com/challenges/archive',
    siteName: 'Triviaah',
    images: [{ url: '/imgs/triviaah-og.webp', width: 1200, height: 630 }],
    type: 'website',
  },
};

type ArchiveSearchParams = {
  q?: string | string[];
  category?: string | string[];
  month?: string | string[];
  limit?: string | string[];
};

function getParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] || '' : value || '';
}

function formatMonth(month: string): string {
  return new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function buildArchiveHref(
  filters: { q: string; category: string; month: string },
  limit: number
): string {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.category) params.set('category', filters.category);
  if (filters.month) params.set('month', filters.month);
  if (limit > 12) params.set('limit', String(limit));
  const query = params.toString();
  return `/challenges/archive${query ? `?${query}` : ''}`;
}

function groupChallengesByMonth(challenges: WeeklyTriviaChallenge[]) {
  return challenges.reduce<Record<string, WeeklyTriviaChallenge[]>>((groups, challenge) => {
    const month = challenge.startDate.slice(0, 7);
    (groups[month] ||= []).push(challenge);
    return groups;
  }, {});
}

export default async function ChallengeArchivePage({
  searchParams,
}: {
  searchParams?: Promise<ArchiveSearchParams>;
}) {
  const params = (await searchParams) || {};
  const q = getParam(params.q).trim();
  const category = getParam(params.category);
  const month = getParam(params.month);
  const requestedLimit = Number.parseInt(getParam(params.limit), 10);
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 12
    ? Math.ceil(requestedLimit / 12) * 12
    : 12;

  const challenges = await getWeeklyChallenges();
  const archivedChallenges = challenges.filter((challenge) => challenge.status === 'past');
  const normalizedQuery = q.toLowerCase();

  const categoryOptions = Array.from(
    archivedChallenges.reduce<Map<string, string>>((options, challenge) => {
      options.set(challenge.category, challenge.categoryTitle);
      return options;
    }, new Map())
  ).sort((a, b) => a[1].localeCompare(b[1]));

  const monthOptions = Array.from(
    new Set(archivedChallenges.map((challenge) => challenge.startDate.slice(0, 7)))
  ).sort((a, b) => b.localeCompare(a));

  const filteredChallenges = archivedChallenges.filter((challenge) => {
    const matchesQuery = !normalizedQuery || [
      challenge.title,
      challenge.subcategory,
      challenge.categoryTitle,
      challenge.description,
    ].some((value) => value.toLowerCase().includes(normalizedQuery));
    const matchesCategory = !category || challenge.category === category;
    const matchesMonth = !month || challenge.startDate.startsWith(month);
    return matchesQuery && matchesCategory && matchesMonth;
  });

  const visibleChallenges = filteredChallenges.slice(0, limit);
  const groupedChallenges = groupChallengesByMonth(visibleChallenges);
  const filters = { q, category, month };
  const hasFilters = Boolean(q || category || month);
  const hasMore = visibleChallenges.length < filteredChallenges.length;

  return (
    <div className={club.club}>
      <main id="challenges-main" className={club.main}>
        <header className={styles.archiveHero}>
          <Link href="/challenges" className={club.textLink}>← Back to current challenges</Link>
          <p className={club.eyebrow}>THE CHALLENGE COLLECTION</p>
          <h1>A good topic is<br /><em>always worth revisiting.</em></h1>
          <p className={styles.intro}>Find a challenge you missed, revisit a favourite, or discover something unexpected. Search by topic, category, or month.</p>
        </header>
        <section className={styles.filterPanel} aria-label="Filter archived challenges">
          <form action="/challenges/archive" method="get" className={styles.filters}>
            <label>Search topics<input type="search" name="q" defaultValue={q} placeholder="What are you curious about?" /></label>
            <label>Category<select name="category" defaultValue={category}><option value="">All categories</option>{categoryOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label>Month<select name="month" defaultValue={month}><option value="">All months</option>{monthOptions.map(value => <option key={value} value={value}>{formatMonth(value)}</option>)}</select></label>
            <button type="submit" className={club.primary}><Search size={17} /> Find challenges</button>
          </form>
          <div className={styles.filterSummary}><p aria-live="polite">Showing <strong>{visibleChallenges.length}</strong> of <strong>{filteredChallenges.length}</strong> {filteredChallenges.length === 1 ? 'challenge' : 'challenges'}</p>{hasFilters && <Link href="/challenges/archive" className={club.textLink}>Clear filters</Link>}</div>
        </section>
        {visibleChallenges.length > 0 ? Object.entries(groupedChallenges).map(([groupMonth, monthChallenges]) => (
          <section key={groupMonth} className={styles.section} aria-labelledby={`month-${groupMonth}`}>
            <div className={club.sectionHeading}><h2 id={`month-${groupMonth}`}>{formatMonth(groupMonth)}</h2><span className={styles.muted}>{monthChallenges.length} challenges</span></div>
            <div className={styles.archiveGrid}>{monthChallenges.map(challenge => <ChallengeClubCard key={challenge.id} challenge={challenge} compact />)}</div>
          </section>
        )) : <section className={styles.empty}><Search size={28} /><h2>No matching challenges.</h2><p>Try another topic, category, or month.</p><Link href="/challenges/archive" className={club.textLink}>Clear filters <ArrowRight size={17} /></Link></section>}
        {hasMore && <div className={styles.loadMore}><Link href={buildArchiveHref(filters, limit + 12)} className={club.primary}>Load 12 more <ArrowRight size={17} /></Link></div>}
      </main>
      <PuzzleClubFooter />
    </div>
  );
}
