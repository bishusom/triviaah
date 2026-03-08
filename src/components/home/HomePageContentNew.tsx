'use client';
import { useState, useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Game {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  href: string;
  accent: string;
  icon: string;
  stat: string;
  cta: string;
}

interface Category {
  icon: string;
  name: string;
  count: number;
  slug: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const GAMES: Game[] = [
  { id: 'daily',   label: 'Daily Challenge', title: "Today's Trivia",    subtitle: '10 questions · Resets at midnight',    href: '/daily-trivias',            accent: '#38bdf8', icon: '📅', stat: '1.2K playing', cta: 'Play Now'   },
  { id: 'brain',   label: 'Puzzle',          title: 'Brain Waves',       subtitle: 'Word & logic puzzles',                 href: '/brainwave',                accent: '#a78bfa', icon: '🌊', stat: '843 active',  cta: 'Start'      },
  { id: 'iq',      label: 'Personality',     title: 'IQ & Personality',  subtitle: 'Science-backed tests',                 href: '/iq-and-personality-tests', accent: '#34d399', icon: '🧬', stat: '2.4K today',  cta: 'Take Test'  },
  { id: 'retro',   label: 'Arcade',          title: 'Retro Games',       subtitle: 'Classic arcade fun',                   href: '/retro-games',              accent: '#fb923c', icon: '🕹️', stat: '620 playing', cta: 'Play'       },
  { id: 'words',   label: 'Vocabulary',      title: 'Word Games',        subtitle: 'Challenge your lexicon',               href: '/word-games',               accent: '#f472b6', icon: '📝', stat: '450 active',  cta: 'Play'       },
  { id: 'numbers', label: 'Math',            title: 'Number Puzzles',    subtitle: 'Logic & math challenges',              href: '/number-puzzles',           accent: '#fbbf24', icon: '🔢', stat: '310 active',  cta: 'Play'       },
];

const CATEGORIES: Category[] = [
  { icon: '🧠', name: 'General Knowledge', count: 156, slug: 'general-knowledge' },
  { icon: '🔬', name: 'Science',           count: 89,  slug: 'science'           },
  { icon: '📜', name: 'History',           count: 87,  slug: 'history'           },
  { icon: '🌍', name: 'Geography',         count: 53,  slug: 'geography'         },
  { icon: '🎭', name: 'Entertainment',     count: 112, slug: 'entertainment'     },
  { icon: '⚽', name: 'Sports',            count: 76,  slug: 'sports'            },
  { icon: '🎵', name: 'Music',             count: 64,  slug: 'music'             },
  { icon: '🎮', name: 'Video Games',       count: 72,  slug: 'video-games'       },
  { icon: '🎬', name: 'Film',              count: 78,  slug: 'film'              },
  { icon: '📚', name: 'Literature',        count: 42,  slug: 'literature'        },
  { icon: '🐾', name: 'Animals',           count: 67,  slug: 'animals'           },
  { icon: '💻', name: 'Tech',              count: 46,  slug: 'computers'         },
];

const NAV = [
  { name: 'Daily Trivias', href: '/daily-trivias' },
  { name: 'Brain Waves',   href: '/brainwave'     },
  { name: 'All Trivias',   href: '/trivias'        },
  { name: 'Leaderboard',   href: '/leaderboard'   },
  { name: 'Word Games',    href: '/word-games'     },
  { name: 'IQ Tests',      href: '/iq-and-personality-tests' },
  { name: 'Blog',          href: '/blog'           },
];

const TICKER = [
  'Alex scored 10/10 on Science',
  'Sarah started the Daily Challenge',
  '342 MBTI tests completed today',
  'Marco set a record on Brain Waves',
  '1,200+ players active right now',
];

const CAT_COLORS = ['#38bdf8','#a78bfa','#34d399','#fb923c','#f472b6','#fbbf24','#60a5fa','#c084fc','#4ade80','#f87171','#94a3b8','#e879f9'];

// ─── Ticker ───────────────────────────────────────────────────────────────────

function LiveTicker() {
  return (
    <div className="tv-ticker">
      <div className="tv-ticker-track">
        {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
          <span key={i} className="tv-ticker-item">
            <span className="tv-dot">●</span>{t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Featured hero card (full-width on mobile) ────────────────────────────────

function HeroCard({ game }: { game: Game }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={game.href}
      className="tv-hero-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      data-hov={hov ? '1' : '0'}
      style={{ '--accent': game.accent } as React.CSSProperties}
    >
      <div className="tv-hero-glow" />
      <div className="tv-hero-icon">{game.icon}</div>
      <div className="tv-hero-body">
        <span className="tv-label" style={{ color: game.accent, borderColor: game.accent + '40', background: game.accent + '18' }}>
          {game.label}
        </span>
        <h3 className="tv-hero-title">{game.title}</h3>
        <p className="tv-hero-sub">{game.subtitle}</p>
        <div className="tv-hero-footer">
          <span className="tv-stat">👥 {game.stat}</span>
          <span className="tv-cta-btn" style={{ background: game.accent }}>
            {game.cta}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </div>
    </a>
  );
}

// ─── Secondary game card ──────────────────────────────────────────────────────

function GameCard({ game }: { game: Game }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={game.href}
      className="tv-game-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ '--accent': game.accent } as React.CSSProperties}
    >
      <div className="tv-game-glow" />
      <div className="tv-game-top">
        <span className="tv-label" style={{ color: game.accent, borderColor: game.accent + '35', background: game.accent + '12' }}>
          {game.label}
        </span>
        <span className="tv-game-icon">{game.icon}</span>
      </div>
      <strong className="tv-game-title">{game.title}</strong>
      <p className="tv-game-sub">{game.subtitle}</p>
      <div className="tv-game-footer">
        <span className="tv-stat">{game.stat}</span>
        <span className="tv-arrow" style={{ color: game.accent }}>
          {game.cta} →
        </span>
      </div>
    </a>
  );
}

// ─── Category chip ────────────────────────────────────────────────────────────

function CatChip({ cat, index }: { cat: Category; index: number }) {
  const c = CAT_COLORS[index % CAT_COLORS.length];
  return (
    <a href={`/trivias/${cat.slug}`} className="tv-cat" style={{ '--cc': c } as React.CSSProperties}>
      <span className="tv-cat-icon">{cat.icon}</span>
      <span className="tv-cat-name">{cat.name}</span>
      <span className="tv-cat-count">{cat.count}</span>
    </a>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function TriviaahHomepage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const [heroGame, ...secondaryGames] = GAMES;

  return (
    <>
      {/* ─── Global Styles ─────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; -webkit-text-size-adjust: 100%; }
        body { background: #07090f; overflow-x: hidden; }
        a { text-decoration: none; color: inherit; }

        /* ── Tokens ── */
        :root {
          --bg:        #07090f;
          --surface:   #0d1117;
          --surface2:  #111820;
          --border:    rgba(255,255,255,0.07);
          --border2:   rgba(255,255,255,0.12);
          --text:      #f0f4f8;
          --muted:     #64748b;
          --faint:     #1e293b;
          --accent:    #38bdf8;
          --serif:     'Cormorant Garamond', Georgia, serif;
          --sans:      'DM Sans', system-ui, sans-serif;
          --r-sm:      12px;
          --r-md:      18px;
          --r-lg:      24px;
          --r-xl:      32px;
        }

        /* ── Base ── */
        .tv-root {
          min-height: 100vh;
          background: var(--bg);
          font-family: var(--sans);
          color: var(--text);
        }

        /* ── Ticker ── */
        .tv-ticker {
          height: 28px;
          background: rgba(56,189,248,0.04);
          border-bottom: 1px solid rgba(56,189,248,0.08);
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .tv-ticker-track {
          display: flex;
          gap: 64px;
          white-space: nowrap;
          animation: ticker 35s linear infinite;
          padding-left: 100vw;
          will-change: transform;
        }
        .tv-ticker-item {
          font-size: 11px;
          color: #475569;
          letter-spacing: 0.03em;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .tv-dot { color: #38bdf8; font-size: 8px; }

        /* ── Nav ── */
        .tv-nav {
          position: sticky;
          top: 0;
          z-index: 200;
          transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s;
          border-bottom: 1px solid transparent;
        }
        .tv-nav.scrolled {
          background: rgba(7,9,15,0.96);
          border-color: var(--border);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .tv-nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px;
          height: 58px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tv-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-shrink: 0;
          margin-right: 8px;
        }
        .tv-logo-mark {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #38bdf8, #6366f1);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        .tv-logo-name {
          font-family: var(--serif);
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.01em;
          background: linear-gradient(135deg, #e2e8f0 30%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .tv-nav-links {
          display: none;
          gap: 0;
          flex: 1;
          overflow: hidden;
        }
        @media (min-width: 900px) {
          .tv-nav-links { display: flex; }
        }
        .tv-nav-link {
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          padding: 6px 12px;
          border-radius: 8px;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .tv-nav-link:hover { color: #38bdf8; background: rgba(56,189,248,0.07); }
        .tv-play-btn {
          flex-shrink: 0;
          margin-left: auto;
          background: linear-gradient(135deg, #38bdf8, #6366f1);
          color: #000;
          font-family: var(--sans);
          font-size: 13px;
          font-weight: 700;
          padding: 8px 20px;
          border-radius: 10px;
          letter-spacing: 0.01em;
          transition: opacity 0.2s, transform 0.2s;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .tv-play-btn:hover { opacity: 0.85; transform: scale(1.03); }
        .tv-menu-btn {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px;
          background: none;
          border: none;
          cursor: pointer;
          margin-left: 8px;
        }
        @media (min-width: 900px) { .tv-menu-btn { display: none; } }
        .tv-menu-btn span {
          display: block;
          width: 20px;
          height: 1.5px;
          background: #94a3b8;
          border-radius: 2px;
          transition: transform 0.25s, opacity 0.25s;
        }
        .tv-mobile-menu {
          position: fixed;
          inset: 0;
          background: rgba(7,9,15,0.98);
          z-index: 300;
          display: flex;
          flex-direction: column;
          padding: 24px 20px;
          gap: 4px;
          animation: fadeIn 0.2s ease;
        }
        .tv-mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        .tv-mobile-close {
          background: none; border: none; color: #64748b;
          font-size: 24px; cursor: pointer; padding: 4px;
        }
        .tv-mobile-link {
          font-family: var(--serif);
          font-size: 28px;
          font-weight: 600;
          color: #475569;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
          transition: color 0.15s;
        }
        .tv-mobile-link:hover { color: var(--text); }

        /* ── Hero Section ── */
        .tv-hero {
          max-width: 1280px;
          margin: 0 auto;
          padding: 56px 20px 48px;
          position: relative;
        }
        .tv-hero-glow-bg {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: min(900px, 100%);
          height: 400px;
          background: radial-gradient(ellipse at 50% 0%,
            rgba(56,189,248,0.07) 0%,
            transparent 65%);
          pointer-events: none;
        }
        .tv-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          animation: fadeUp 0.6s 0.05s ease both;
        }
        .tv-live-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 0 rgba(34,197,94,0.4);
          animation: livepulse 2.5s ease infinite;
        }
        .tv-eyebrow-text {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: #22c55e;
          text-transform: uppercase;
        }
        .tv-headline {
          font-family: var(--serif);
          font-size: clamp(44px, 8vw, 96px);
          font-weight: 700;
          line-height: 0.95;
          letter-spacing: -0.03em;
          color: var(--text);
          margin-bottom: 20px;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .tv-headline em {
          font-style: italic;
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 55%, #38bdf8 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }
        .tv-tagline {
          font-size: clamp(14px, 1.6vw, 17px);
          color: var(--muted);
          max-width: 400px;
          line-height: 1.65;
          margin-bottom: 32px;
          animation: fadeUp 0.6s 0.18s ease both;
        }
        .tv-ctas {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 52px;
          animation: fadeUp 0.6s 0.26s ease both;
        }
        .tv-cta-primary {
          background: linear-gradient(135deg, #38bdf8, #6366f1);
          color: #000;
          font-family: var(--sans);
          font-weight: 700;
          font-size: 15px;
          padding: 13px 28px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          box-shadow: 0 0 32px rgba(56,189,248,0.22);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .tv-cta-primary:hover {
          transform: scale(1.04);
          box-shadow: 0 0 52px rgba(56,189,248,0.38);
        }
        .tv-cta-ghost {
          font-size: 14px;
          font-weight: 500;
          color: var(--muted);
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: color 0.2s;
        }
        .tv-cta-ghost:hover { color: #94a3b8; }

        /* ── Stats bar ── */
        .tv-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          overflow: hidden;
          animation: fadeUp 0.6s 0.34s ease both;
          margin-bottom: 56px;
        }
        @media (max-width: 540px) {
          .tv-stats { grid-template-columns: repeat(2, 1fr); }
        }
        .tv-stat-cell {
          padding: 20px 16px;
          text-align: center;
          border-right: 1px solid var(--border);
        }
        .tv-stat-cell:last-child { border-right: none; }
        @media (max-width: 540px) {
          .tv-stat-cell:nth-child(2) { border-right: none; }
          .tv-stat-cell:nth-child(3) { border-right: 1px solid var(--border); border-top: 1px solid var(--border); }
          .tv-stat-cell:nth-child(4) { border-right: none; border-top: 1px solid var(--border); }
        }
        .tv-stat-val {
          font-family: var(--serif);
          font-size: 28px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .tv-stat-label {
          font-size: 11px;
          color: var(--muted);
          margin-top: 4px;
          letter-spacing: 0.02em;
        }

        /* ── Section header ── */
        .tv-section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 20px;
        }
        .tv-section-title {
          font-family: var(--serif);
          font-size: 26px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .tv-section-sub {
          font-size: 12px;
          color: var(--muted);
          margin-top: 3px;
        }
        .tv-see-all {
          font-size: 12px;
          color: #38bdf8;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 3px;
          white-space: nowrap;
          transition: opacity 0.2s;
          flex-shrink: 0;
        }
        .tv-see-all:hover { opacity: 0.7; }

        /* ── Hero card (large, full-width on mobile) ── */
        .tv-hero-card {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 28px;
          border-radius: var(--r-lg);
          background: var(--surface);
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          text-decoration: none;
          transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
          min-height: 280px;
          cursor: pointer;
        }
        .tv-hero-card:hover {
          border-color: color-mix(in srgb, var(--accent) 40%, transparent);
          transform: translateY(-3px);
          box-shadow: 0 24px 64px color-mix(in srgb, var(--accent) 15%, transparent);
        }
        .tv-hero-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 260px; height: 260px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.04;
          filter: blur(70px);
          pointer-events: none;
          transition: opacity 0.4s;
        }
        .tv-hero-card:hover .tv-hero-glow { opacity: 0.1; }
        .tv-hero-icon {
          position: absolute;
          top: 24px; right: 28px;
          font-size: 56px;
          line-height: 1;
          opacity: 0.35;
          transition: opacity 0.3s, transform 0.3s;
        }
        .tv-hero-card:hover .tv-hero-icon { opacity: 0.7; transform: scale(1.08) rotate(-4deg); }
        .tv-hero-body { position: relative; z-index: 2; }
        .tv-hero-title {
          font-family: var(--serif);
          font-size: 32px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.02em;
          line-height: 1.05;
          margin: 10px 0 8px;
        }
        .tv-hero-sub {
          font-size: 14px;
          color: var(--muted);
          margin-bottom: 24px;
          line-height: 1.5;
        }
        .tv-hero-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .tv-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #000;
          font-weight: 700;
          font-size: 13px;
          padding: 10px 18px;
          border-radius: 10px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .tv-hero-card:hover .tv-cta-btn {
          transform: scale(1.04);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        /* ── Game cards grid ── */
        .tv-games-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px 56px;
        }
        /* Mobile: hero card full width, secondary cards in 2-col grid */
        .tv-hero-slot { margin-bottom: 12px; }
        .tv-secondary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        /* Tablet+: all 3 col */
        @media (min-width: 720px) {
          .tv-hero-slot { margin-bottom: 0; }
          .tv-games-layout {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: auto auto;
            gap: 12px;
          }
          .tv-hero-slot {
            grid-column: 1;
            grid-row: 1 / span 2;
          }
          .tv-hero-slot .tv-hero-card {
            height: 100%;
            min-height: 360px;
          }
          .tv-secondary-grid {
            grid-column: 2 / span 2;
            grid-row: 1 / span 2;
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* ── Small game card ── */
        .tv-game-card {
          display: flex;
          flex-direction: column;
          padding: 18px 20px;
          border-radius: var(--r-md);
          background: var(--surface);
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          text-decoration: none;
          transition: border-color 0.22s, transform 0.22s, box-shadow 0.22s;
          cursor: pointer;
          gap: 6px;
        }
        .tv-game-card:hover {
          border-color: color-mix(in srgb, var(--accent) 35%, transparent);
          transform: translateY(-2px);
          box-shadow: 0 16px 40px color-mix(in srgb, var(--accent) 12%, transparent);
        }
        .tv-game-glow {
          position: absolute;
          bottom: -12px; right: -12px;
          width: 70px; height: 70px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.04;
          filter: blur(20px);
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .tv-game-card:hover .tv-game-glow { opacity: 0.1; }
        .tv-game-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2px;
        }
        .tv-game-icon { font-size: 20px; opacity: 0.7; }
        .tv-game-title {
          font-family: var(--serif);
          font-size: 17px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .tv-game-sub {
          font-size: 12px;
          color: var(--muted);
          line-height: 1.4;
          flex: 1;
        }
        .tv-game-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--border);
        }
        .tv-stat { font-size: 11px; color: #334155; }
        .tv-arrow { font-size: 12px; font-weight: 600; }

        /* ── Pill label ── */
        .tv-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          padding: 3px 8px;
          border-radius: 999px;
          border: 1px solid;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* ── Divider ── */
        .tv-rule {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .tv-rule hr {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border2), transparent);
        }

        /* ── Categories ── */
        .tv-cats-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 48px 20px 52px;
        }
        .tv-cat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
        }
        @media (min-width: 480px) { .tv-cat-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 720px) { .tv-cat-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1024px) { .tv-cat-grid { grid-template-columns: repeat(6, 1fr); } }

        .tv-cat {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: var(--r-sm);
          background: var(--surface);
          border: 1px solid var(--border);
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
          cursor: pointer;
          overflow: hidden;
        }
        .tv-cat:hover {
          border-color: color-mix(in srgb, var(--cc) 30%, transparent);
          background: color-mix(in srgb, var(--cc) 7%, var(--surface));
          transform: translateY(-1px);
        }
        .tv-cat-icon { font-size: 18px; flex-shrink: 0; }
        .tv-cat-name {
          font-size: 12px;
          font-weight: 600;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          transition: color 0.2s;
          min-width: 0;
        }
        .tv-cat:hover .tv-cat-name { color: var(--cc); }
        .tv-cat-count {
          font-size: 10px;
          color: #334155;
          flex-shrink: 0;
        }

        /* ── Daily fact ── */
        .tv-fact-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px 56px;
        }
        .tv-fact {
          border-radius: var(--r-lg);
          border: 1px solid rgba(56,189,248,0.1);
          background: rgba(56,189,248,0.025);
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        @media (min-width: 640px) {
          .tv-fact {
            flex-direction: row;
            align-items: center;
            padding: 28px 32px;
          }
        }
        .tv-fact-body { display: flex; gap: 16px; align-items: flex-start; flex: 1; }
        .tv-fact-bulb {
          font-size: 20px;
          background: rgba(251,191,36,0.1);
          border: 1px solid rgba(251,191,36,0.15);
          border-radius: 11px;
          padding: 9px;
          flex-shrink: 0;
          line-height: 1;
        }
        .tv-fact-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #38bdf8;
          text-transform: uppercase;
          margin-bottom: 7px;
        }
        .tv-fact-text {
          font-family: var(--serif);
          font-size: 16px;
          font-style: italic;
          color: #cbd5e1;
          line-height: 1.6;
          margin: 0;
        }
        .tv-fact-cta {
          flex-shrink: 0;
          border: 1px solid rgba(56,189,248,0.25);
          color: #38bdf8;
          font-size: 12px;
          font-weight: 600;
          padding: 10px 20px;
          border-radius: 10px;
          white-space: nowrap;
          transition: background 0.2s, border-color 0.2s;
          display: inline-block;
          align-self: flex-start;
        }
        @media (min-width: 640px) { .tv-fact-cta { align-self: center; } }
        .tv-fact-cta:hover {
          background: rgba(56,189,248,0.07);
          border-color: rgba(56,189,248,0.45);
        }

        /* ── Features ── */
        .tv-features-section {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .tv-features-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 48px 20px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px 24px;
        }
        @media (min-width: 720px) {
          .tv-features-inner { grid-template-columns: repeat(4, 1fr); }
        }
        .tv-feature { display: flex; gap: 13px; align-items: flex-start; }
        .tv-feature-icon { font-size: 19px; line-height: 1; margin-top: 1px; flex-shrink: 0; }
        .tv-feature-title { font-size: 13px; font-weight: 700; color: #e2e8f0; margin-bottom: 4px; }
        .tv-feature-desc { font-size: 12px; color: var(--muted); line-height: 1.6; }

        /* ── Footer ── */
        .tv-footer {
          max-width: 1280px;
          margin: 0 auto;
          padding: 32px 20px 24px;
        }
        .tv-footer-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
        }
        .tv-footer-links { display: flex; gap: 20px; flex-wrap: wrap; }
        .tv-footer-link { font-size: 11px; color: #334155; transition: color 0.15s; }
        .tv-footer-link:hover { color: #64748b; }
        .tv-footer-online { display: flex; align-items: center; gap: 7px; }
        .tv-online-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          animation: livepulse 2.5s infinite;
        }
        .tv-online-text { font-size: 11px; color: #334155; }
        .tv-footer-copy {
          padding-top: 16px;
          font-size: 10px;
          color: #1e293b;
          text-align: center;
        }

        /* ── Animations ── */
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @keyframes shimmer {
          from { background-position: 200% center; }
          to   { background-position: -200% center; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes livepulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.45); }
          60%       { box-shadow: 0 0 0 5px rgba(34,197,94,0);  }
        }
      `}</style>

      <div className="tv-root">

        {/* TICKER */}
        <LiveTicker />

        {/* NAV */}
        <header className={`tv-nav${scrolled ? ' scrolled' : ''}`}>
          <div className="tv-nav-inner">
            <a href="/" className="tv-logo">
              <div className="tv-logo-mark">🧠</div>
              <span className="tv-logo-name">Triviaah</span>
            </a>
            <nav className="tv-nav-links">
              {NAV.map(l => (
                <a key={l.name} href={l.href} className="tv-nav-link">{l.name}</a>
              ))}
            </nav>
            <a href="/daily-trivias" className="tv-play-btn">▶ Play Today</a>
            <button className="tv-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <span /><span /><span />
            </button>
          </div>
        </header>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="tv-mobile-menu">
            <div className="tv-mobile-menu-header">
              <div className="tv-logo">
                <div className="tv-logo-mark">🧠</div>
                <span className="tv-logo-name">Triviaah</span>
              </div>
              <button className="tv-mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
            </div>
            {NAV.map(l => (
              <a key={l.name} href={l.href} className="tv-mobile-link" onClick={() => setMenuOpen(false)}>
                {l.name}
              </a>
            ))}
            <a href="/daily-trivias" className="tv-cta-primary" style={{ marginTop: 24, alignSelf: 'flex-start' }}>
              ▶ Play Today
            </a>
          </div>
        )}

        {/* HERO */}
        <section className="tv-hero">
          <div className="tv-hero-glow-bg" />

          <div className="tv-eyebrow">
            <div className="tv-live-dot" />
            <span className="tv-eyebrow-text">Daily challenges live now</span>
          </div>

          <h1 className="tv-headline">
            How much do<br />
            <em>you know?</em>
          </h1>

          <p className="tv-tagline">
            Free daily trivia, brain puzzles &amp; personality tests — for curious minds of all ages.
          </p>

          <div className="tv-ctas">
            <a href="/daily-trivias" className="tv-cta-primary">
              ▶&nbsp; Start Today's Quiz
            </a>
            <a href="/trivias" className="tv-cta-ghost">
              Browse categories
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div className="tv-stats">
            {[
              { val: '50K+',   label: 'Monthly players'   },
              { val: '2,400+', label: 'Quizzes available' },
              { val: '30+',    label: 'Categories'        },
              { val: '100%',   label: 'Free forever'      },
            ].map(s => (
              <div key={s.label} className="tv-stat-cell">
                <div className="tv-stat-val">{s.val}</div>
                <div className="tv-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* GAME CARDS */}
        <section className="tv-games-section">
          <div className="tv-section-header">
            <div>
              <h2 className="tv-section-title">Play now</h2>
              <p className="tv-section-sub">Pick a game and start in seconds</p>
            </div>
            <a href="/trivias" className="tv-see-all">
              See all
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          {/* Mobile layout: hero card full width, then 2-col grid */}
          <div className="tv-games-layout">
            <div className="tv-hero-slot">
              <HeroCard game={heroGame} />
            </div>
            <div className="tv-secondary-grid">
              {secondaryGames.map(g => (
                <GameCard key={g.id} game={g} />
              ))}
            </div>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="tv-rule"><hr /></div>

        {/* CATEGORIES */}
        <section className="tv-cats-section">
          <div className="tv-section-header">
            <div>
              <h2 className="tv-section-title">Browse by topic</h2>
              <p className="tv-section-sub">30+ categories, updated daily</p>
            </div>
            <a href="/trivias" className="tv-see-all">
              View all
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
          <div className="tv-cat-grid">
            {CATEGORIES.map((cat, i) => <CatChip key={cat.slug} cat={cat} index={i} />)}
          </div>
        </section>

        {/* DAILY FACT */}
        <section className="tv-fact-section">
          <div className="tv-fact">
            <div className="tv-fact-body">
              <div className="tv-fact-bulb">💡</div>
              <div>
                <div className="tv-fact-label">Today's Trivia Fact</div>
                <p className="tv-fact-text">
                  "Honey never spoils — archaeologists found 3,000-year-old honey in Egyptian tombs that was still perfectly edible."
                </p>
              </div>
            </div>
            <a href="/daily-trivias" className="tv-fact-cta">Test your knowledge →</a>
          </div>
        </section>

        {/* FEATURES */}
        <section className="tv-features-section">
          <div className="tv-features-inner">
            {[
              { icon: '📅', title: 'Fresh Every Day',  desc: 'New quizzes and puzzles added every 24 hours.' },
              { icon: '🏆', title: 'Climb the Ranks',  desc: 'Earn badges, build streaks, hit leaderboards.' },
              { icon: '🧬', title: 'Know Yourself',    desc: 'Science-backed IQ & personality tests.' },
              { icon: '🆓', title: 'Free, No Sign-up', desc: 'Play instantly. No account, no paywalls.' },
            ].map(f => (
              <div key={f.title} className="tv-feature">
                <span className="tv-feature-icon">{f.icon}</span>
                <div>
                  <div className="tv-feature-title">{f.title}</div>
                  <div className="tv-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="tv-footer">
          <div className="tv-footer-row">
            <a href="/" className="tv-logo">
              <div className="tv-logo-mark">🧠</div>
              <span className="tv-logo-name">Triviaah</span>
            </a>
            <div className="tv-footer-links">
              {['About', 'Contact', 'Privacy', 'Terms', 'Blog', 'Trivia Bank'].map(l => (
                <a key={l} href={`/${l.toLowerCase().replace(' ', '-')}`} className="tv-footer-link">{l}</a>
              ))}
            </div>
            <div className="tv-footer-online">
              <div className="tv-online-dot" />
              <span className="tv-online-text">2,400 online now</span>
            </div>
          </div>
          <p className="tv-footer-copy">
            © {new Date().getFullYear()} Triviaah · Free daily trivia challenges and online quiz games
          </p>
        </footer>

      </div>
    </>
  );
}