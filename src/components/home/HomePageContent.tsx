import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Brain, Sparkles, Trophy, Users, BookOpen, Zap, Globe, Music, Film, Lightbulb } from 'lucide-react';
import Ads from '@/components/common/Ads';
import { DAILY_QUIZZES, BRAIN_WAVES } from '@/config/homeContent';
import { getWeeklyChallenges } from '@/lib/challenges';
import styles from './PuzzleClub.module.css';
import PuzzleClubFooter from './PuzzleClubFooter';

const daily = DAILY_QUIZZES.filter(item => ['general-knowledge', 'quick-fire', 'today-in-history', 'entertainment'].includes(item.category));
const puzzles = BRAIN_WAVES.filter(item => ['plotle', 'capitale', 'songle', 'literale'].includes(item.category));
const puzzleIcons = [Film, Globe, Music, BookOpen];

export default async function HomePageContent() {
  const challenges = await getWeeklyChallenges();
  const featured = challenges.find(challenge => challenge.status === 'active');

  return (
    <div className={styles.club}>
      <main id="home-main" className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}><span /> A LITTLE CURIOSITY. EVERY DAY.</p>
            <h1>Your daily<br />brain <em>break.</em></h1>
            <p className={styles.intro}>A fresh question. A satisfying solve. Make a little room for trivia, puzzles, and the joy of figuring it out.</p>
            <div className={styles.actions}>
              <Link className={styles.primary} href="/daily-trivias/general-knowledge">Play today’s trivia <ArrowRight size={18} /></Link>
              <Link className={styles.textLink} href="#daily-lineup">Find your next game <ArrowRight size={17} /></Link>
            </div>
            <p className={styles.heroNote}><Sparkles size={15} /> Free to play. Fresh challenges daily.</p>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            <span className={styles.orbit}>✳</span>
            <div className={styles.artCard}><span>THE DAILY AHA!</span><Brain size={72} strokeWidth={1.3} /><strong>Stay curious.</strong><p>Your next discovery is a play away.</p><div className={styles.letterTiles}>{['T', 'H', 'I', 'N', 'K'].map(letter => <b key={letter}>{letter}</b>)}</div></div>
            <div className={styles.artSticker}><Lightbulb size={23} /> Small break.<br />Big ideas.</div>
            <span className={styles.artStar}>✧</span>
          </div>
        </section>

        <div className={styles.quickLinks}>
          <Link href="/daily-trivias"><Zap size={19} /> Daily trivia <ArrowRight size={16} /></Link>
          <Link href="/brainwave"><Brain size={19} /> Brainwave puzzles <ArrowRight size={16} /></Link>
          <Link href="/challenges"><Trophy size={19} /> Weekly challenges <ArrowRight size={16} /></Link>
          <Link href="/multiplayer"><Users size={19} /> Play with friends <ArrowRight size={16} /></Link>
        </div>

        <section id="daily-lineup" className={styles.section}>
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>A FRESH START</p><h2>What will you discover today?</h2><p>Pick a favourite topic. See what you know.</p></div><Link className={styles.textLink} href="/daily-trivias">All daily trivia <ArrowRight size={17} /></Link></div>
          <div className={styles.cardGrid}>{daily.map((item, index) => <Link className={styles.gameCard} href={item.path} key={item.category}>
            <div className={`${styles.cardArt} ${styles[`tone${index}`]}`}><Image src={item.image} alt="" width={96} height={96} /><span>DAILY TRIVIA</span></div>
            <div className={styles.cardBody}><h3>{item.name}</h3><p>{item.tagline}</p><span className={styles.cardAction}>{item.category === 'quick-fire' ? '60-second challenge' : 'Play today’s quiz'}<ArrowRight size={18} /></span></div>
          </Link>)}</div>
        </section>

        <div className={styles.ad}><span>ADVERTISEMENT</span><Ads format="fluid" style={{ width: '100%', height: '90px' }} /></div>

        <section className={styles.section}>
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>FIND YOUR AHA! MOMENT</p><h2>A little puzzle. A lovely challenge.</h2><p>Connect the clues and put your curiosity to work.</p></div><Link className={styles.textLink} href="/brainwave">All Brainwave games <ArrowRight size={17} /></Link></div>
          <div className={styles.puzzleGrid}>{puzzles.map((item, index) => { const Icon = puzzleIcons[index]; return <Link href={item.path || `/brainwave/${item.category}`} className={styles.puzzleCard} key={item.category}><span className={`${styles.puzzleIcon} ${styles[`tone${index}`]}`}><Icon size={28} /></span><h3>{item.name}</h3><p>{item.tagline}</p><span className={styles.cardAction}>Solve today’s puzzle <ArrowRight size={17} /></span></Link>; })}</div>
        </section>

        <section className={styles.weekly}>
          <div className={styles.weeklyEmblem} aria-hidden="true"><Trophy size={66} strokeWidth={1.3} /><span>CHALLENGE ACCEPTED</span></div>
          <div><p className={styles.eyebrow}>SOMETHING TO LOOK FORWARD TO</p><h2>{featured ? featured.subcategory : 'Your weekly challenge awaits.'}</h2><p>{featured ? featured.description : 'Go deeper into a favourite topic. Explore themed quizzes and give your knowledge a proper workout.'}</p>{featured && <span className={styles.weeklyDate}>{featured.formattedDateRange}</span>}<Link className={styles.primary} href={featured ? `/challenges/${featured.slug}` : '/challenges'}>Explore the challenge <ArrowRight size={18} /></Link></div>
        </section>

        <section className={styles.explore}><div><p className={styles.eyebrow}>FOLLOW YOUR CURIOSITY</p><h2>There’s always more to play.</h2><p>Discover a new favourite in the Triviaah collection.</p></div><div className={styles.exploreLinks}>{[['Word games', '/word-games'], ['Number puzzles', '/number-puzzles'], ['Retro games', '/retro-games'], ['Trivia library', '/trivias']].map(([label, href]) => <Link href={href} key={href}>{label}<ArrowRight size={17} /></Link>)}</div></section>
        <section className={styles.about}><Brain size={27} /><h2>A good day starts with a little curiosity.</h2><p>Triviaah brings together free daily trivia, Brainwave puzzles, and weekly quiz challenges. Play on your own, invite friends to a multiplayer quiz, or explore the trivia library at your own pace.</p><Link className={styles.textLink} href="/about">Get to know Triviaah <ArrowRight size={17} /></Link></section>
      </main>
      <PuzzleClubFooter />
    </div>
  );
}
