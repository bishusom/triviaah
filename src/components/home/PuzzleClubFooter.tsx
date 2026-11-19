import Link from 'next/link';
import styles from './PuzzleClub.module.css';

export default function PuzzleClubFooter() {
  return (
    <footer className={styles.footer}><div><Link href="/" className={styles.brand}>triviaah<span>✳</span></Link><p>A little wiser. A little happier.</p></div><nav aria-label="Footer navigation">{[['Blog', '/blog'], ['Trivia Bank', '/trivia-bank'], ['About', '/about'], ['Contact', '/contact'], ['Privacy', '/privacy'], ['Terms', '/terms']].map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav><small>© {new Date().getFullYear()} Triviaah</small></footer>
  );
}
