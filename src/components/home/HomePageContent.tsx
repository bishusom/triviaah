'use client';
import { useState, useEffect } from "react";

const featuredGames = [
  {
    id: "daily", label: "DAILY CHALLENGE",
    title: "Today's Trivia", subtitle: "10 questions · Resets at midnight",
    href: "/daily-trivias", accent: "#22d3ee", icon: "📅", stat: "1.2K playing", cta: "Play Now",
  },
  {
    id: "brainwave", label: "PUZZLE",
    title: "Brain Waves", subtitle: "Word & logic puzzles",
    href: "/brainwave", accent: "#818cf8", icon: "🌊", stat: "843 active", cta: "Start",
  },
  {
    id: "iq", label: "PERSONALITY",
    title: "IQ & Personality", subtitle: "Science-backed tests",
    href: "/iq-and-personality-tests", accent: "#34d399", icon: "🧬", stat: "2.4K today", cta: "Take Test",
  },
  {
    id: "retro", label: "ARCADE",
    title: "Retro Games", subtitle: "Classic arcade fun",
    href: "/retro-games", accent: "#fb923c", icon: "🕹️", stat: "620 playing", cta: "Play",
  },
  {
    id: "words", label: "VOCABULARY",
    title: "Word Games", subtitle: "Challenge your lexicon",
    href: "/word-games", accent: "#f472b6", icon: "📝", stat: "450 active", cta: "Play",
  },
  {
    id: "numbers", label: "MATH",
    title: "Number Puzzles", subtitle: "Logic & math challenges",
    href: "/number-puzzles", accent: "#a78bfa", icon: "🔢", stat: "310 active", cta: "Play",
  },
];

const categories = [
  { icon: "🧠", name: "General Knowledge", count: 156, slug: "general-knowledge" },
  { icon: "🔬", name: "Science", count: 89, slug: "science" },
  { icon: "📜", name: "History", count: 87, slug: "history" },
  { icon: "🌍", name: "Geography", count: 53, slug: "geography" },
  { icon: "🎭", name: "Entertainment", count: 112, slug: "entertainment" },
  { icon: "⚽", name: "Sports", count: 76, slug: "sports" },
  { icon: "🎵", name: "Music", count: 64, slug: "music" },
  { icon: "🎮", name: "Video Games", count: 72, slug: "video-games" },
  { icon: "🎬", name: "Film", count: 78, slug: "film" },
  { icon: "📚", name: "Literature", count: 42, slug: "literature" },
  { icon: "🐾", name: "Animals", count: 67, slug: "animals" },
  { icon: "💻", name: "Tech", count: 46, slug: "computers" },
];

const navLinks = [
  { name: "Daily Trivias", href: "/daily-trivias" },
  { name: "Brain Waves", href: "/brainwave" },
  { name: "All Trivias", href: "/trivias" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Word Games", href: "/word-games" },
  { name: "IQ Tests", href: "/iq-and-personality-tests" },
  { name: "Blog", href: "/blog" },
];

const tickerItems = [
  "Alex scored 10/10 on Science ·",
  "Sarah started the Daily Challenge ·",
  "342 MBTI tests completed today ·",
  "Marco set a record on Brain Waves ·",
  "1,200+ players active right now ·",
];

const catColors = ["#22d3ee","#818cf8","#34d399","#fb923c","#f472b6","#fbbf24","#60a5fa","#a78bfa","#4ade80","#f87171","#94a3b8","#e879f9"];

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

// ─── BigCard (featured, spans 2 rows) ───────────────────────────────────────
function BigCard({ game }: { game: Game }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={game.href}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        gridRow: "span 2",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "40px", borderRadius: "28px",
        background: "rgba(14,20,36,0.85)",
        border: `1px solid ${hov ? game.accent + "55" : "rgba(255,255,255,0.07)"}`,
        backdropFilter: "blur(20px)",
        textDecoration: "none",
        transition: "all 0.3s ease",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? `0 32px 80px ${game.accent}22` : "0 8px 32px rgba(0,0,0,0.3)",
        position: "relative", overflow: "hidden", cursor: "pointer",
      }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "300px", height: "300px", borderRadius: "50%",
        background: game.accent, opacity: hov ? 0.08 : 0.03,
        filter: "blur(80px)", transition: "opacity 0.4s", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "32px", right: "36px",
        fontSize: "64px", lineHeight: 1,
        opacity: hov ? 0.85 : 0.45,
        transition: "all 0.3s",
        transform: hov ? "scale(1.1) rotate(-5deg)" : "scale(1)",
      }}>{game.icon}</div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <span style={{
          fontSize: "10px", fontWeight: "700", letterSpacing: "0.14em",
          color: game.accent, background: `${game.accent}15`,
          border: `1px solid ${game.accent}30`,
          padding: "5px 12px", borderRadius: "999px",
          marginBottom: "16px", display: "inline-block",
        }}>{game.label}</span>
        <h3 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "34px", fontWeight: "700", color: "#f8fafc",
          margin: "0 0 10px", letterSpacing: "-0.02em", lineHeight: 1.1,
        }}>{game.title}</h3>
        <p style={{ fontSize: "15px", color: "#94a3b8", margin: "0 0 28px", lineHeight: 1.5 }}>{game.subtitle}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: "#475569" }}>👥 {game.stat}</span>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: game.accent, color: "#000",
            fontSize: "14px", fontWeight: "800",
            padding: "11px 22px", borderRadius: "12px",
            transition: "transform 0.2s, box-shadow 0.2s",
            transform: hov ? "scale(1.04)" : "scale(1)",
            boxShadow: hov ? `0 8px 24px ${game.accent}50` : "none",
          }}>
            {game.cta}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </a>
  );
}

// ─── SmallCard ───────────────────────────────────────────────────────────────
function SmallCard({ game }: { game: Game }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={game.href}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "26px 28px", borderRadius: "20px",
        background: "rgba(14,20,36,0.7)",
        border: `1px solid ${hov ? game.accent + "45" : "rgba(255,255,255,0.06)"}`,
        backdropFilter: "blur(16px)",
        textDecoration: "none",
        transition: "all 0.25s ease",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hov ? `0 20px 50px ${game.accent}18` : "none",
        position: "relative", overflow: "hidden", cursor: "pointer",
      }}>
      <div style={{
        position: "absolute", bottom: "-16px", right: "-16px",
        width: "80px", height: "80px", borderRadius: "50%",
        background: game.accent, opacity: hov ? 0.1 : 0.04,
        filter: "blur(24px)", transition: "opacity 0.3s", pointerEvents: "none",
      }} />
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <span style={{
            fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em",
            color: game.accent, background: `${game.accent}14`,
            border: `1px solid ${game.accent}25`,
            padding: "4px 9px", borderRadius: "999px",
          }}>{game.label}</span>
          <span style={{ fontSize: "24px" }}>{game.icon}</span>
        </div>
        <h3 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "18px", fontWeight: "700", color: "#f1f5f9",
          margin: "0 0 5px", letterSpacing: "-0.01em",
        }}>{game.title}</h3>
        <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>{game.subtitle}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
        <span style={{ fontSize: "11px", color: "#334155" }}>👥 {game.stat}</span>
        <span style={{
          fontSize: "12px", fontWeight: "700", color: hov ? game.accent : "#64748b",
          display: "flex", alignItems: "center", gap: "4px",
          transition: "color 0.2s",
        }}>
          {game.cta}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </div>
    </a>
  );
}

// ─── CategoryTile ─────────────────────────────────────────────────────────────
function CategoryTile({ cat, index }: { cat: Category; index: number }) {
  const [hov, setHov] = useState(false);
  const c = catColors[index % catColors.length];
  return (
    <a href={`/trivias/${cat.slug}`}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "13px 16px", borderRadius: "12px",
        background: hov ? `${c}0d` : "rgba(255,255,255,0.02)",
        border: `1px solid ${hov ? c + "30" : "rgba(255,255,255,0.05)"}`,
        textDecoration: "none", transition: "all 0.2s", cursor: "pointer",
      }}>
      <span style={{ fontSize: "18px", width: "22px", textAlign: "center", flexShrink: 0 }}>{cat.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: "12px", fontWeight: "600",
          color: hov ? c : "#cbd5e1",
          transition: "color 0.2s",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{cat.name}</div>
        <div style={{ fontSize: "10px", color: "#334155" }}>{cat.count} quizzes</div>
      </div>
    </a>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function TriviaahHomepage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const [featured, ...rest] = featuredGames;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #060c18; }
        a { text-decoration: none; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pdot { 0%,100%{box-shadow:0 0 0 0 rgba(34,211,238,0.5)} 60%{box-shadow:0 0 0 7px rgba(34,211,238,0)} }
        .fu1 { animation: fadeUp 0.65s 0.05s ease both; }
        .fu2 { animation: fadeUp 0.65s 0.15s ease both; }
        .fu3 { animation: fadeUp 0.65s 0.25s ease both; }
        .fu4 { animation: fadeUp 0.65s 0.35s ease both; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #060c18; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#060c18", fontFamily: "'Inter', sans-serif", color: "#f1f5f9" }}>

        {/* TICKER */}
        <div style={{
          background: "rgba(34,211,238,0.04)",
          borderBottom: "1px solid rgba(34,211,238,0.09)",
          overflow: "hidden", height: "30px",
          display: "flex", alignItems: "center",
        }}>
          <div style={{
            display: "flex", gap: "80px",
            animation: "ticker 30s linear infinite",
            whiteSpace: "nowrap", paddingLeft: "100%",
          }}>
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i} style={{ fontSize: "11px", color: "#475569", letterSpacing: "0.04em" }}>
                <span style={{ color: "#22d3ee", marginRight: "8px" }}>●</span>{t}
              </span>
            ))}
          </div>
        </div>

        {/* NAV */}
        <header style={{
          position: "sticky", top: 0, zIndex: 100,
          background: scrolled ? "rgba(6,12,24,0.97)" : "rgba(6,12,24,0.8)",
          backdropFilter: "blur(24px)",
          borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.07)" : "transparent"}`,
          transition: "all 0.3s ease",
        }}>
          <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", height: "62px", gap: "32px" }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              <div style={{
                width: "34px", height: "34px",
                background: "linear-gradient(135deg, #22d3ee, #6366f1)",
                borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px",
              }}>🧠</div>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "21px", fontWeight: "700",
                background: "linear-gradient(135deg, #e2e8f0, #94a3b8)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                letterSpacing: "-0.01em",
              }}>Triviaah</span>
            </a>

            <nav style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              {navLinks.map(l => (
                <a key={l.name} href={l.href} style={{
                  fontSize: "13px", fontWeight: "500", color: "#64748b",
                  padding: "7px 13px", borderRadius: "8px",
                  transition: "color 0.15s", whiteSpace: "nowrap",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#22d3ee"}
                onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
                >{l.name}</a>
              ))}
            </nav>

            <a href="/daily-trivias" style={{
              flexShrink: 0,
              background: "linear-gradient(135deg, #22d3ee, #6366f1)",
              color: "#000", fontSize: "13px", fontWeight: "700",
              padding: "9px 22px", borderRadius: "10px",
              transition: "opacity 0.2s, transform 0.2s",
              display: "inline-flex", alignItems: "center", gap: "6px",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = ".85"; e.currentTarget.style.transform = "scale(1.03)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
            >▶ Play Today</a>
          </div>
        </header>

        {/* HERO */}
        <section style={{ maxWidth: "1320px", margin: "0 auto", padding: "68px 32px 48px", position: "relative" }}>
          {/* Ambient glow */}
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: "900px", height: "500px",
            background: "radial-gradient(ellipse at 50% 0%, rgba(34,211,238,0.05) 0%, transparent 68%)",
            pointerEvents: "none",
          }} />

          {/* Eyebrow */}
          <div className="fu1" style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "18px" }}>
            <div style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: "#22d3ee", animation: "pdot 2.5s ease infinite",
            }} />
            <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.11em", color: "#22d3ee", textTransform: "uppercase" }}>
              Daily challenges live now
            </span>
          </div>

          {/* Headline + CTA side by side */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "28px", marginBottom: "52px" }}>
            <div>
              <h1 className="fu2" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(42px, 6vw, 82px)", fontWeight: "700",
                color: "#f8fafc", letterSpacing: "-0.03em", lineHeight: "1.02",
                marginBottom: "18px",
              }}>
                How much do<br />
                <em style={{
                  background: "linear-gradient(135deg, #22d3ee 0%, #818cf8 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  fontStyle: "italic",
                }}>you know?</em>
              </h1>
              <p className="fu3" style={{
                fontSize: "clamp(14px, 1.4vw, 17px)", color: "#64748b",
                maxWidth: "400px", lineHeight: "1.65",
              }}>
                Free daily trivia, brain puzzles & personality tests — for curious minds of all ages.
              </p>
            </div>

            <div className="fu4" style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <a href="/daily-trivias" style={{
                background: "linear-gradient(135deg, #22d3ee, #6366f1)",
                color: "#000", fontSize: "15px", fontWeight: "700",
                padding: "14px 30px", borderRadius: "14px",
                display: "inline-flex", alignItems: "center", gap: "8px",
                boxShadow: "0 0 40px rgba(34,211,238,0.22)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(34,211,238,0.38)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(34,211,238,0.22)"; }}
              >▶&nbsp; Start Today's Quiz</a>
              <a href="/trivias" style={{
                fontSize: "13px", fontWeight: "500", color: "#64748b",
                display: "inline-flex", alignItems: "center", gap: "5px",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
              onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
              >
                Browse categories
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>

          {/* CARDS GRID — 3 col, big card spans 2 rows */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "auto auto",
            gap: "14px",
          }}>
            <BigCard game={featured} />
            {rest.map(g => <SmallCard key={g.id} game={g} />)}
          </div>
        </section>

        {/* DIVIDER */}
        <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 32px" }}>
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" }} />
        </div>

        {/* STATS */}
        <section style={{ maxWidth: "1320px", margin: "0 auto", padding: "36px 32px" }}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {[
              { val: "50K+", label: "Monthly players" },
              { val: "2,400+", label: "Quizzes available" },
              { val: "30+", label: "Categories" },
              { val: "100% Free", label: "No sign-up needed" },
            ].map((s, i) => (
              <div key={i} style={{
                flex: "1 1 120px", textAlign: "center", padding: "16px 12px",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "32px", fontWeight: "700", color: "#f8fafc",
                  letterSpacing: "-0.02em", lineHeight: 1,
                }}>{s.val}</div>
                <div style={{ fontSize: "11px", color: "#475569", marginTop: "5px", letterSpacing: "0.03em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* DIVIDER */}
        <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 32px" }}>
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" }} />
        </div>

        {/* CATEGORIES */}
        <section style={{ maxWidth: "1320px", margin: "0 auto", padding: "48px 32px 56px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "22px" }}>
            <div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "26px", fontWeight: "700", color: "#f8fafc", letterSpacing: "-0.02em",
              }}>Browse by topic</h2>
              <p style={{ fontSize: "13px", color: "#475569", marginTop: "3px" }}>30+ categories, updated daily</p>
            </div>
            <a href="/trivias" style={{
              fontSize: "12px", color: "#22d3ee", fontWeight: "600",
              display: "flex", alignItems: "center", gap: "4px",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = ".7"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              View all <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "7px" }}>
            {categories.map((cat, i) => <CategoryTile key={cat.slug} cat={cat} index={i} />)}
          </div>
        </section>

        {/* DAILY FACT */}
        <section style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 32px 64px" }}>
          <div style={{
            borderRadius: "22px",
            border: "1px solid rgba(34,211,238,0.1)",
            background: "rgba(34,211,238,0.025)",
            padding: "32px 36px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            gap: "28px", flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", gap: "18px", alignItems: "flex-start", flex: 1, minWidth: "260px" }}>
              <div style={{
                fontSize: "24px", background: "rgba(251,191,36,0.1)",
                border: "1px solid rgba(251,191,36,0.15)",
                borderRadius: "12px", padding: "10px", flexShrink: 0,
              }}>💡</div>
              <div>
                <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.14em", color: "#22d3ee", marginBottom: "8px", textTransform: "uppercase" }}>
                  Today's Trivia Fact
                </div>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "16px", color: "#cbd5e1", lineHeight: "1.6", margin: 0, fontStyle: "italic",
                }}>
                  "Honey never spoils — archaeologists found 3,000-year-old honey in Egyptian tombs that was still perfectly edible."
                </p>
              </div>
            </div>
            <a href="/daily-trivias" style={{
              flexShrink: 0,
              border: "1px solid rgba(34,211,238,0.25)",
              color: "#22d3ee", fontSize: "12px", fontWeight: "600",
              padding: "10px 20px", borderRadius: "10px", whiteSpace: "nowrap",
              transition: "all 0.2s", background: "transparent",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,211,238,0.07)"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.25)"; }}
            >Test your knowledge →</a>
          </div>
        </section>

        {/* WHY */}
        <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "52px 32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "40px 32px" }}>
              {[
                { icon: "📅", title: "Fresh Every Day", desc: "New quizzes and puzzles added every 24 hours — always something new." },
                { icon: "🏆", title: "Climb the Ranks", desc: "Earn badges, build streaks, and appear on global leaderboards." },
                { icon: "🧬", title: "Know Yourself", desc: "Science-backed IQ and personality tests reveal how your mind works." },
                { icon: "🆓", title: "Free, No Sign-up", desc: "Play instantly, no account needed. Zero paywalls, ever." },
              ].map(f => (
                <div key={f.title} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "20px", lineHeight: 1, marginTop: "2px" }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#e2e8f0", marginBottom: "5px" }}>{f.title}</div>
                    <div style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6" }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ maxWidth: "1320px", margin: "0 auto", padding: "36px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
              <span style={{ fontSize: "17px" }}>🧠</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: "700", color: "#94a3b8" }}>Triviaah</span>
            </div>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {["About", "Contact", "Privacy", "Terms", "Blog", "Trivia Bank"].map(l => (
                <a key={l} href={`/${l.toLowerCase().replace(" ", "-")}`}
                  style={{ fontSize: "11px", color: "#334155", transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#64748b"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#334155"}
                >{l}</a>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22d3ee", animation: "pdot 2.5s infinite" }} />
              <span style={{ fontSize: "11px", color: "#334155" }}>2,400 online now</span>
            </div>
          </div>
          <div style={{ marginTop: "24px", fontSize: "11px", color: "#1e293b", textAlign: "center" }}>
            © {new Date().getFullYear()} Triviaah · Free daily trivia challenges and online quiz games
          </div>
        </footer>

      </div>
    </>
  );
}