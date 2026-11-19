'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';
import club from '@/components/home/PuzzleClub.module.css';
import styles from './BrainwaveClub.module.css';

type BrainwaveLandingClientProps = {
  game: ReactNode;
  introText?: string;
  headline: string;
  landingImage?: string | null;
  supportingCopy?: string;
  playNotes?: string[];
  readyLabel?: string;
  playLabel?: string;
  backHref?: string;
  backLabel?: string;
};

export default function BrainwaveLandingClient({
  game,
  introText,
  headline,
  landingImage,
  supportingCopy,
  playNotes = [],
  readyLabel = 'Ready when you are',
  playLabel = 'Play Now',
  backHref = '/brainwave',
  backLabel = 'Back to Brainwave',
}: BrainwaveLandingClientProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const descriptionParts = [
    introText,
    supportingCopy,
    "Press play when you’re ready to follow the clues.",
  ].filter((part): part is string => Boolean(part && part.trim().length > 0));
  const description = descriptionParts.join(' ');

  if (hasStarted) {
    return <div className={styles.gameBoard}>{game}</div>;
  }

  return (
    <section className={styles.landing}>
      <div className={styles.landingTop}>
        <div><p className={club.eyebrow}>{readyLabel}</p><h2>{headline}</h2><p className={styles.intro}>{description}</p>
          <div className={club.actions}><button type="button" onClick={() => setHasStarted(true)} className={club.primary}><Play size={17} />{playLabel}</button><Link href={backHref} className={club.textLink}><ArrowLeft size={17} />{backLabel}</Link></div>
        </div>
        {landingImage && <div className={styles.landingImage}><Image src={landingImage} alt={headline} width={190} height={190} priority /></div>}
      </div>
      {playNotes.length > 0 && <div className={styles.playNotes}><h3>How to play</h3><ul>{playNotes.map(note => <li key={note}>{note}</li>)}</ul></div>}
    </section>
  );
}
