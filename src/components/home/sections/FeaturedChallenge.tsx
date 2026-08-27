import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';

import { getFeaturedChallenge } from '@/lib/challenges';

export default async function FeaturedChallenge() {
  const challenge = await getFeaturedChallenge();

  if (!challenge) {
    return null;
  }

  return (
    <section aria-labelledby="featured-challenge-heading" className="w-full">
      <Link
        href={`/challenges/${challenge.slug}`}
        className="group grid overflow-hidden rounded-xl border border-emerald-400/20 bg-emerald-950/20 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/50 md:grid-cols-[16rem_1fr]"
      >
        <div className="relative aspect-square overflow-hidden bg-slate-950 md:aspect-auto">
          <Image
            src={challenge.heroImage}
            alt={`${challenge.title} challenge`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 16rem"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="flex flex-col justify-center p-5 sm:p-6">
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
            <Sparkles className="h-4 w-4" />
            Featured Challenge
          </p>
          <h2 id="featured-challenge-heading" className="text-2xl font-black text-white">
            {challenge.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300">{challenge.subtitle}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Clock className="h-4 w-4 text-cyan-300" />
              {challenge.estimatedMinutes} min
            </span>
            <span className="inline-flex items-center gap-2 font-bold text-emerald-200">
              Start weekly route
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
