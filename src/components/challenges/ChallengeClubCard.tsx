import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import type { WeeklyTriviaChallenge } from '@/lib/challenges';
import styles from './ChallengeClub.module.css';

export function challengeStatusLabel(challenge: WeeklyTriviaChallenge) {
  return challenge.status === 'active' ? 'Live this week' : challenge.status === 'past' ? 'From the archive' : 'Coming up';
}

export default function ChallengeClubCard({ challenge, compact = false }: { challenge: WeeklyTriviaChallenge; compact?: boolean }) {
  return (
    <Link href={`/challenges/${challenge.slug}`} className={compact ? styles.archiveCard : styles.card}>
      <div className={styles.cardImage}>
        <Image src={challenge.heroImage} alt="" fill sizes={compact ? '80px' : '(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw'} className="object-cover" />
        {!compact && <span className={styles.badge}>{challengeStatusLabel(challenge)}</span>}
      </div>
      <div className={styles.cardBody}>
        <span className={styles.category}>{challenge.categoryTitle}</span>
        <h3>{challenge.subcategory}</h3>
        <span className={styles.date}><Calendar size={14} />{challenge.formattedDateRange}</span>
        {!compact && <><p>{challenge.description}</p><div className={styles.cardAction}><span>{challenge.questionCount} questions · 30s each</span><ArrowRight size={18} /></div></>}
      </div>
      {compact && <ArrowRight className={styles.archiveArrow} size={19} />}
    </Link>
  );
}
