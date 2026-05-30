import type { ReactNode } from 'react';
import type { GamePageContent } from '@/lib/game-pages';
import { CalendarDays, Sparkles, HelpCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const PUZZLE_NOTES: Record<string, { title: string; body: string; links: Array<{ href: string; label: string }> }> = {
  '/brainwave/botanle': {
    title: "Today's Plant Lens",
    body:
      'Botanle is strongest when you treat every clue as a field note, not a flashcard. Habitat tells you where the plant survives, common use hints at why people remember it, and appearance clues help separate similar flowers, trees, herbs, and crops. That mix gives the page more than a single answer: each daily puzzle becomes a small botany lesson.',
    links: [
      { href: '/brainwave/creaturedle', label: 'Compare it with Creaturedle' },
      { href: '/brainwave/foodle', label: 'Follow plant clues into Foodle' },
      { href: '/daily-trivias/science', label: 'Play Science daily trivia' },
    ],
  },
  '/brainwave/foodle': {
    title: 'Why Foodle is really a geography puzzle',
    body:
      'Ingredients are only half the signal. A cooking method, spice pattern, or serving tradition often points to a region before it points to a dish. That is why Foodle pairs well with geography and culture games.',
    links: [
      { href: '/brainwave/countridle', label: 'Try Countridle next' },
      { href: '/daily-trivias/geography', label: 'Play Geography daily trivia' },
    ],
  },
};

export default function BrainwaveRouteShell({
  page,
  showIntro = true,
  relatedGames = [],
  children,
}: {
  page: GamePageContent;
  showIntro?: boolean;
  relatedGames?: GamePageContent[];
  children: ReactNode;
}) {
  // Filter out the current page and any hub pages
  const otherGames = relatedGames
    .filter(g => g.route_path !== page.route_path && g.page_kind !== 'hub')
    .slice(0, 12); // Allowing up to 12 for the full collection

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-4 md:py-5">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6 shadow-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {page.featured ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                <Sparkles className="h-3.5 w-3.5" />
                Featured
              </span>
            ) : null}
            {page.is_daily_refresh ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
                <CalendarDays className="h-3.5 w-3.5" />
                Daily Refresh
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                Evergreen
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            {page.title}
          </h1>
          {showIntro ? (
            <p className="mt-2 max-w-3xl text-sm md:text-base text-white/75">
              {page.intro_text}
            </p>
          ) : null}
        </div>

        <div className="mt-6">
          {children}
        </div>

        {PUZZLE_NOTES[page.route_path] ? (
          <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4 md:p-6 shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">
              Developer's Note
            </p>
            <h2 className="mt-2 text-xl font-bold text-white">
              {PUZZLE_NOTES[page.route_path].title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-cyan-50/80">
              {PUZZLE_NOTES[page.route_path].body}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {PUZZLE_NOTES[page.route_path].links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-cyan-300/20 bg-black/20 px-3 py-2 text-xs font-semibold text-cyan-100 transition-colors hover:border-cyan-200/50 hover:bg-cyan-300/10"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {page.highlights.length ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {page.highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100"
              >
                {highlight}
              </span>
            ))}
          </div>
        ) : null}

        {page.faq_items.length ? (
          <details className="group mt-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6 shadow-2xl">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
              <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <HelpCircle className="h-5 w-5 text-cyan-300" />
                Frequently Asked Questions
              </h2>
              <ChevronDown className="h-5 w-5 text-cyan-300 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {page.faq_items.map((faq, index) => (
                <article key={`${faq.question}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <h3 className="text-base font-semibold text-cyan-200">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{faq.answer}</p>
                </article>
              ))}
            </div>
          </details>
        ) : null}

        {/* Subtle More Brainwave Section */}
        {otherGames.length > 0 && (
          <section className="mt-12 pt-8 border-t border-white/5">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-cyan-500/80 mb-6 font-black">
              More Brainwave Games
            </h2>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {otherGames.map((game) => (
                <Link
                  key={game.route_path}
                  href={game.route_path}
                  className="group block w-20 sm:w-24"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-cyan-500/40 group-hover:bg-white/10 group-hover:scale-105">
                    {game.og_image && (
                      <Image
                        src={game.og_image}
                        alt={game.title}
                        fill
                        className="object-contain p-2.5 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                        sizes="(max-width: 768px) 80px, 96px"
                      />
                    )}
                  </div>
                  <h3 className="mt-2 text-[10px] font-medium text-white/40 group-hover:text-cyan-300 transition-colors line-clamp-1 text-center">
                    {game.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
