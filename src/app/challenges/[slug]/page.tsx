import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { ArrowRight, Users, Clock, Calendar } from 'lucide-react';
import { getWeeklyChallengeByIdOrSlug, getWeeklyChallenges, getWeeklyChallengeWarmupQuestions } from '@/lib/challenges';
import { challengeStatusLabel } from '@/components/challenges/ChallengeClubCard';
import club from '@/components/home/PuzzleClub.module.css';
import styles from '@/components/challenges/ChallengeClub.module.css';
import PuzzleClubFooter from '@/components/home/PuzzleClubFooter';
import ChallengeClubCard from '@/components/challenges/ChallengeClubCard';
export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const challenge = await getWeeklyChallengeByIdOrSlug(slug);

  if (!challenge) {
    return {
      title: 'Weekly Challenge Not Found | Triviaah',
      robots: { index: false, follow: true },
    };
  }

  const canonical = `https://triviaah.com/challenges/${challenge.slug}`;

  return {
    title: `${challenge.subcategory} in ${challenge.categoryTitle} Trivia | Weekly Challenge | Triviaah`,
    description: challenge.seoDescription,
    keywords: challenge.keywords,
    alternates: { canonical },
    openGraph: {
      title: `${challenge.subcategory} in ${challenge.categoryTitle} Trivia | Weekly Challenge | Triviaah`,
      description: challenge.seoDescription,
      url: canonical,
      siteName: 'Triviaah',
      images: [
        {
          url: challenge.heroImage,
          width: 1024,
          height: 1024,
          alt: `${challenge.subcategory} Trivia Challenge`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${challenge.subcategory} in ${challenge.categoryTitle} Trivia | Weekly Challenge | Triviaah`,
      description: challenge.seoDescription,
      images: [challenge.heroImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export async function generateStaticParams() {
  const challenges = await getWeeklyChallenges();
  return challenges.map((challenge) => ({ slug: challenge.slug }));
}

export default async function ChallengeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const challenge = await getWeeklyChallengeByIdOrSlug(slug);

  if (!challenge) {
    notFound();
  }

  const [allChallenges, sneakPeekQuestions] = await Promise.all([
    getWeeklyChallenges(),
    getWeeklyChallengeWarmupQuestions(challenge, 3).catch(() => []),
  ]);

  const siblingChallenges = allChallenges
    .filter((c) => c.id !== challenge.id && c.status === 'active')
    .slice(0, 6);

  const pageTitle = `${challenge.subcategory} in ${challenge.categoryTitle} Trivia`;
  const canonical = `https://triviaah.com/challenges/${challenge.slug}`;
  const quizHref = `/challenges/${challenge.slug}/quiz`;
  const multiplayerHref = `/multiplayer?category=${encodeURIComponent(challenge.category)}&subcategory=${encodeURIComponent(challenge.subcategory)}`;

  const questionSchemas = sneakPeekQuestions.map((q, idx) => ({
    '@type': 'Question',
    name: q.question,
    position: idx + 1,
    suggestedAnswer: (q.options || []).map((opt, optIdx) => ({
      '@type': 'Answer',
      position: optIdx + 1,
      text: opt,
    })),
    acceptedAnswer: {
      '@type': 'Answer',
      text: q.correct,
    },
  }));

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}/#webpage`,
        url: canonical,
        name: pageTitle,
        description: challenge.seoDescription,
      },
      {
        '@type': 'Quiz',
        '@id': `${canonical}/#quiz`,
        name: `${challenge.subcategory} Weekly Trivia Challenge`,
        description: challenge.description,
        url: canonical,
        numberOfQuestions: challenge.questionCount,
        timeRequired: 'PT5M',
        educationalLevel: 'Intermediate',
        about: {
          '@type': 'Thing',
          name: challenge.subcategory,
        },
        hasPart: questionSchemas,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://triviaah.com' },
          { '@type': 'ListItem', position: 2, name: 'Weekly Challenges', item: 'https://triviaah.com/challenges' },
          { '@type': 'ListItem', position: 3, name: challenge.categoryTitle, item: 'https://triviaah.com/challenges' },
          { '@type': 'ListItem', position: 4, name: pageTitle, item: canonical },
        ],
      },
    ],
  };

  return (
    <div className={club.club}>
      <main id="challenges-main" className={club.main}>
        <Script id="challenge-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <section className={styles.hero}>
          <div>
            <p className={club.eyebrow}>{challenge.categoryTitle} · WEEKLY CHALLENGE</p>
            <h1>{challenge.subcategory}<br /><em>Know your stuff?</em></h1>
            <p className={styles.intro}>{challenge.description}</p>
            <p className={styles.status}>{challengeStatusLabel(challenge)} · {challenge.formattedDateRange}</p>
            <div className={club.actions}><Link href={quizHref} className={club.primary}>{challenge.status === 'past' ? 'Replay this challenge' : 'Play this challenge'} <ArrowRight size={18} /></Link><Link href={multiplayerHref} className={club.textLink}><Users size={18} /> Play with friends</Link></div>
          </div>
          <div className={styles.detailArt}><Image src={challenge.heroImage} alt={`${challenge.subcategory} trivia`} width={320} height={320} priority /></div>
        </section>
        <div className={styles.facts}><span><Clock size={18} /><strong>30 seconds</strong> per question</span><span><strong>{challenge.questionCount} questions</strong> per quiz</span><span><strong>Free to play</strong> · Instant scoring</span><span><Calendar size={18} />{challenge.formattedDateRange}</span></div>

        {sneakPeekQuestions.length > 0 && <section className={styles.section}>
          <p className={club.eyebrow}>A LITTLE WARMUP</p><h2>Get a feel for the challenge.</h2><p className={styles.intro}>Try these sample questions. Open each one to reveal the answer, choices, and explanation.</p>
          <div className={styles.questions}>{sneakPeekQuestions.map((question, index) => <details key={question.id || index}>
            <summary>{index + 1}. {question.question}{question.difficulty && <span className={styles.difficulty}>{question.difficulty}</span>}</summary>
            <div className={styles.answer}><strong>Answer: {question.correct}</strong><div className={styles.options}>{question.options?.map((option, i) => <span key={i}>{option}</span>)}</div>{question.titbits && <p>{question.titbits}</p>}</div>
          </details>)}</div>
          <Link href={quizHref} className={club.primary}>Start the full challenge <ArrowRight size={18} /></Link>
        </section>}

        {siblingChallenges.length > 0 && <section className={styles.section}>
          <div className={club.sectionHeading}><div><p className={club.eyebrow}>KEEP EXPLORING</p><h2>More to discover this week.</h2></div><Link href="/challenges" className={club.textLink}>All weekly challenges <ArrowRight size={17} /></Link></div>
          <div className={styles.grid}>{siblingChallenges.map(item => <ChallengeClubCard key={item.id} challenge={item} />)}</div>
        </section>}
        <nav className={styles.bottomLinks} aria-label="Explore more challenges"><Link href="/challenges" className={club.textLink}>← Back to weekly challenges</Link><Link href="/challenges/archive" className={club.textLink}>Browse the archive <ArrowRight size={17} /></Link><Link href="/daily-trivias" className={club.textLink}>Try daily trivia <ArrowRight size={17} /></Link></nav>
      </main>
      <PuzzleClubFooter />
    </div>
  );
}
