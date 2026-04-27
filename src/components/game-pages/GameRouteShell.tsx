import type { ReactNode } from 'react';
import type { GamePageContent } from '@/lib/game-pages';
import Link from 'next/link';
import Image from 'next/image';

type GameRouteShellProps = {
  page: GamePageContent;
  sectionLabel: string;
  relatedGames?: GamePageContent[];
  children: ReactNode;
};

export default function GameRouteShell({
  page,
  sectionLabel,
  relatedGames = [],
  children
}: GameRouteShellProps) {
  // Filter out the current page from related games
  const otherGames = relatedGames
    .filter(g => g.route_path !== page.route_path && g.page_kind !== 'hub')
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 md:py-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6 shadow-2xl">
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            {page.title}
          </h1>
        </div>

        <div className="mt-6">{children}</div>

        <div className="mt-6 flex flex-wrap gap-2">
          {page.featured ? (
            <span className="inline-flex items-center rounded-full bg-red-500 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white shadow-[0_0_18px_rgba(239,68,68,0.25)]">
              Featured
            </span>
          ) : null}
          <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
            {page.is_daily_refresh ? 'Daily Refresh' : 'Evergreen'}
          </span>

        </div>

        {page.faq_items.length ? (
          <section className="mt-8 rounded-3xl border border-white/10 bg-black/30 p-4 md:p-6 shadow-2xl">
            <details className="group">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                <h2 className="text-xl md:text-2xl font-bold text-white">Frequently Asked Questions</h2>
                <span className="text-cyan-300 transition-transform duration-200 group-open:rotate-180">⌄</span>
              </summary>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {page.faq_items.map((faq, index) => (
                  <article
                    key={`${page.route_path}-faq-${index}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <h3 className="text-base font-semibold text-cyan-300">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/70">{faq.answer}</p>
                  </article>
                ))}
              </div>
            </details>
          </section>
        ) : null}

        {/* Subtle Related Games Section */}
        {otherGames.length > 0 && (
          <section className="mt-12 pt-8 border-t border-white/5">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-cyan-500/80 mb-6 font-black">
              More {sectionLabel} Games
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
