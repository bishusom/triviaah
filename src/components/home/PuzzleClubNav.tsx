'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import SearchBar from './SearchBar';
import UserStatsPopover from './UserStatsPopover';
import styles from './PuzzleClub.module.css';

const trivias = [
  ['Daily trivia', '/daily-trivias'],
  ['Weekly challenges', '/challenges'],
  ['Quiz categories', '/trivias'],
  ['Trivia bank', '/trivia-bank'],
  ['Multiplayer trivia', '/multiplayer'],
];

const games = [
  ['Brainwave puzzles', '/brainwave'],
  ['Word games', '/word-games'],
  ['Number puzzles', '/number-puzzles'],
  ['Retro games', '/retro-games'],
];
export default function PuzzleClubNav({ mainId = 'home-main' }: { mainId?: string }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const closeMenu = (event: React.MouseEvent<HTMLAnchorElement>) => event.currentTarget.closest('details')?.removeAttribute('open');
  return <header className={styles.header} onKeyDown={event => { if (event.key === 'Escape') { setSearchOpen(false); event.currentTarget.querySelectorAll('details[open]').forEach(menu => menu.removeAttribute('open')); } }}>
    <a href={`#${mainId}`} className={styles.skip}>Skip to content</a>
    <div className={styles.headerInner}><Link href="/" className={styles.brand} aria-label="Triviaah home">triviaah<span aria-hidden="true">✳</span></Link>
      <nav className={styles.desktopNav} aria-label="Main navigation"><Link href="/daily-trivias">Today</Link><details><summary>Trivias</summary><div className={styles.dropdown}>{trivias.map(([label, href]) => <Link onClick={closeMenu} key={href} href={href}>{label}</Link>)}</div></details><details><summary>Games</summary><div className={styles.dropdown}>{games.map(([label, href]) => <Link onClick={closeMenu} key={href} href={href}>{label}</Link>)}</div></details><Link href="/leaderboard">Leaderboard</Link><Link href="/blog">Blog</Link></nav>
      <div className={styles.headerTools}><button className={styles.searchToggle} aria-label={searchOpen ? 'Close search' : 'Search quizzes'} aria-expanded={searchOpen} aria-controls="home-search" onClick={() => setSearchOpen(!searchOpen)}>{searchOpen ? <X size={20} /> : <Search size={20} />}</button><UserStatsPopover /><nav className={styles.mobileNav} aria-label="Mobile navigation"><details><summary>Menu</summary><div className={styles.dropdown}><span className={styles.dropdownLabel}>Trivias</span>{trivias.map(([label, href]) => <Link onClick={closeMenu} key={href} href={href}>{label}</Link>)}<span className={styles.dropdownLabel}>Games</span>{games.map(([label, href]) => <Link onClick={closeMenu} key={href} href={href}>{label}</Link>)}<span className={styles.dropdownLabel}>More</span><Link onClick={closeMenu} href="/leaderboard">Leaderboard</Link><Link onClick={closeMenu} href="/blog">Blog</Link></div></details></nav></div>
      {searchOpen && <div id="home-search" className={styles.searchPanel}><SearchBar /></div>}
    </div>
  </header>;
}
