import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Play, Sparkles, Trophy } from 'lucide-react';
import { getWeeklyChallenges } from '@/lib/challenges';

export default async function WeeklyChallengesSection() {
  const challenges = await getWeeklyChallenges();
  const activeChallenges = challenges.filter((c) => c.status === 'active');
  const displayChallenges = (activeChallenges.length > 0 ? activeChallenges : challenges).slice(0, 4);

  if (displayChallenges.length === 0) return null;

  return (
    <section aria-labelledby="weekly-challenges-heading" className="w-full">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Weekly Trivia Challenges
            </p>
          </div>
          <h2 id="weekly-challenges-heading" className="text-2xl font-bold text-white md:text-3xl">
            Live Weekly Routes
          </h2>
        </div>
        <Link
          href="/challenges"
          className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
        >
          View all challenges
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {displayChallenges.map((challenge, index) => {
          const isFeatured = index === 0;
          return (
            <div
              key={challenge.id}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 ${
                isFeatured
                  ? 'border-red-500/40 bg-slate-900/90 shadow-xl shadow-red-950/20 hover:border-red-400/60 hover:-translate-y-1'
                  : 'border-white/10 bg-slate-900/70 shadow-lg shadow-black/30 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-slate-900/90'
              }`}
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                  <Image
                    src={challenge.heroImage}
                    alt={`${challenge.subcategory} trivia challenge`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {isFeatured && (
                    <div className="absolute left-3 top-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-600 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-red-600/30 backdrop-blur">
                        <Trophy className="h-3.5 w-3.5 fill-current" />
                        Featured
                      </span>
                    </div>
                  )}

                  <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-xs font-bold text-gray-300 backdrop-blur">
                    {challenge.categoryTitle}
                  </span>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="mb-2 flex items-center justify-between gap-2 text-xs text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                      {challenge.formattedDateRange}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
                      <Clock className="h-3.5 w-3.5" />
                      30s / Q
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white group-hover:text-cyan-200 transition-colors">
                    {challenge.subcategory}
                  </h3>

                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-gray-300 line-clamp-2">
                    {challenge.description}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 p-4 pt-3">
                <Link
                  href={`/challenges/${challenge.slug}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-blue-500"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Start Challenge
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
