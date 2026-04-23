'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';

type SeoBlockConfig = {
  title: string;
  intro: string;
  points: string[];
  ctaHref: string;
  ctaLabel: string;
};

const SEO_COPY: Record<string, SeoBlockConfig> = {
  '/brainwave': {
    title: 'Brainwave puzzle collection',
    intro:
      'Explore a daily puzzle hub built around movie clues, geography, history, words, food, animals, landmarks, and more. Each game has its own rules, hints, and daily challenge loop.',
    points: [
      'Choose a puzzle that matches your interests.',
      'Read the game rules before you start guessing.',
      'Return daily for a fresh challenge and new leaderboard chances.',
    ],
    ctaHref: '/brainwave',
    ctaLabel: 'Explore Brainwave',
  },
  '/brainwave/plotle': {
    title: 'Plotle daily movie puzzle',
    intro:
      'Plotle turns movie knowledge into a daily guessing challenge. Use the plot summary, clue reveals, and feedback loop to identify the film in as few attempts as possible.',
    points: [
      'Best for players who enjoy film trivia and story recognition.',
      'Each round rewards knowledge of plots, genres, and movie memory.',
      'A good fit for people who like short, replayable daily games.',
    ],
    ctaHref: '/brainwave/plotle',
    ctaLabel: 'Play Plotle',
  },
  '/brainwave/capitale': {
    title: 'Capitale capital city puzzle',
    intro:
      'Capitale challenges geography fans to identify world capitals with structured clues and directional feedback. It is built for players who like map knowledge, country associations, and quick deduction.',
    points: [
      'Use continent and distance hints to narrow the answer.',
      'Great for geography learners and casual quiz players alike.',
      'The game updates daily with a new capital city to solve.',
    ],
    ctaHref: '/brainwave/capitale',
    ctaLabel: 'Play Capitale',
  },
  '/brainwave/historidle': {
    title: 'Historidle history puzzle',
    intro:
      'Historidle blends dates, clues, and historical reasoning into a daily challenge. Players work from timelines and contextual hints to identify the right historical figure or event.',
    points: [
      'Ideal for history fans who enjoy deduction and chronology.',
      'Progressive clues make each guess more informed than the last.',
      'The format rewards real-world knowledge without feeling repetitive.',
    ],
    ctaHref: '/brainwave/historidle',
    ctaLabel: 'Play Historidle',
  },
  '/brainwave/celebrile': {
    title: 'Celebrile celebrity puzzle',
    intro:
      'Celebrile is a pop-culture guessing game where you identify celebrities from layered clues and letter feedback. It keeps the format fast, social, and easy to share.',
    points: [
      'Built for fans of celebrities, movies, and entertainment trivia.',
      'The clue structure helps players learn as they narrow the answer.',
      'A short, daily puzzle makes it easy to return every day.',
    ],
    ctaHref: '/brainwave/celebrile',
    ctaLabel: 'Play Celebrile',
  },
  '/brainwave/songle': {
    title: 'Songle music puzzle',
    intro:
      'Songle focuses on songs, lyrics, and music recognition. It gives music lovers a daily way to test memory across artists, genres, and eras.',
    points: [
      'Good for players who follow lyrics, artists, and album culture.',
      'Clues are designed to feel fair while still requiring music knowledge.',
      'The daily cadence makes it a lightweight music habit.',
    ],
    ctaHref: '/brainwave/songle',
    ctaLabel: 'Play Songle',
  },
  '/brainwave/literale': {
    title: 'Literale book puzzle',
    intro:
      'Literale asks players to identify books from opening lines and literary clues. It is aimed at readers who enjoy titles, authors, and classic or contemporary fiction.',
    points: [
      'Strong fit for book lovers and reading-focused trivia players.',
      'The opening-line mechanic creates a memorable literary challenge.',
      'Daily play encourages broad reading discovery over time.',
    ],
    ctaHref: '/brainwave/literale',
    ctaLabel: 'Play Literale',
  },
  '/brainwave/cryptodle': {
    title: 'Cryptodle logic puzzle',
    intro:
      'Cryptodle is a substitution-cipher puzzle built around logic, pattern recognition, and quote decoding. It is more of a brain teaser than a pure trivia game, which is exactly why it needs stronger landing-page context.',
    points: [
      'Explain the cipher rules clearly so searchers understand the game.',
      'Add enough text around the puzzle to show the unique value.',
      'This route is the highest-priority one to strengthen for indexing.',
    ],
    ctaHref: '/brainwave/cryptodle',
    ctaLabel: 'Play Cryptodle',
  },
  '/brainwave/creaturedle': {
    title: 'Creaturedle animal puzzle',
    intro:
      'Creaturedle combines wildlife knowledge with six-attribute deduction. Players use biology, habitat, diet, and body traits to identify the correct animal.',
    points: [
      'A strong fit for science-minded players and animal lovers.',
      'The six attribute model gives Google clear topical context.',
      'Educational copy works especially well on this route.',
    ],
    ctaHref: '/brainwave/creaturedle',
    ctaLabel: 'Play Creaturedle',
  },
  '/brainwave/foodle': {
    title: 'Foodle cuisine puzzle',
    intro:
      'Foodle challenges players to identify dishes from cuisine clues, ingredients, and cooking style. It works well for food lovers, home cooks, and anyone who enjoys culinary trivia.',
    points: [
      'Add clear food and cuisine context for stronger search relevance.',
      'The attributes make the game easy to explain to new visitors.',
      'Daily play can support a broad food trivia audience.',
    ],
    ctaHref: '/brainwave/foodle',
    ctaLabel: 'Play Foodle',
  },
  '/brainwave/landmarkdle': {
    title: 'Landmarkdle landmark puzzle',
    intro:
      'Landmarkdle focuses on famous places, architecture, and world monuments. The clues revolve around structure, location, height, and historical detail.',
    points: [
      'A natural match for travel and architecture search intent.',
      'The game benefits from more descriptive landmark copy.',
      'Players can use geography knowledge to narrow each guess.',
    ],
    ctaHref: '/brainwave/landmarkdle',
    ctaLabel: 'Play Landmarkdle',
  },
  '/brainwave/inventionle': {
    title: 'Inventionle invention puzzle',
    intro:
      'Inventionle is a history-and-science puzzle about objects, inventors, and technological impact. It gives the site a useful educational angle beyond simple entertainment.',
    points: [
      'Useful for users interested in innovation and invention history.',
      'Add context about inventors, years, and real-world impact.',
      'This page benefits from being more like a lesson than a shell.',
    ],
    ctaHref: '/brainwave/inventionle',
    ctaLabel: 'Play Inventionle',
  },
  '/brainwave/synonymle': {
    title: 'Synonymle vocabulary puzzle',
    intro:
      'Synonymle is a word-meaning game built around semantic similarity, synonyms, and vocabulary skill. It is the most language-focused route in the collection.',
    points: [
      'Best paired with clear explanations of semantic feedback.',
      'Strong educational copy helps the page read as useful content.',
      'Ideal for searchers looking for vocabulary and word games.',
    ],
    ctaHref: '/brainwave/synonymle',
    ctaLabel: 'Play Synonymle',
  },
};

export default function BrainwaveSeoBlock() {
  const pathname = usePathname();
  const config = SEO_COPY[pathname];

  if (!config) return null;

  return (
    <section className="mx-auto mt-10 max-w-5xl">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-blue-950/30 to-black/70 p-6 md:p-8">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">
          <Sparkles className="h-4 w-4" />
          <span>Brainwave Guide</span>
        </div>
        <h2 className="mt-3 text-2xl md:text-3xl font-black tracking-tight text-white">
          {config.title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm md:text-base leading-relaxed text-gray-300">
          {config.intro}
        </p>
        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          {config.points.map((point) => (
            <li
              key={point}
              className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-gray-200"
            >
              {point}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={config.ctaHref}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black transition-transform hover:scale-[1.02]"
          >
            {config.ctaLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <p className="text-xs text-gray-500">
            This section helps search engines understand the page beyond the interactive game.
          </p>
        </div>
      </div>
    </section>
  );
}
