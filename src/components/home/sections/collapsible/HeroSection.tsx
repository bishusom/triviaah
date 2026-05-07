import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative mx-auto mb-6 w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 px-5 py-6 text-center shadow-xl shadow-black/20 sm:px-8 md:py-8">
      <div className="absolute inset-0 bg-[radial-gradient(80%_120%_at_20%_10%,rgba(37,99,235,0.22)_0%,transparent_55%)] pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-blue-400">
          <span className="h-1 w-7 rounded-full bg-blue-500" />
          The Brain Hub
        </p>
        <p className="mb-1 text-sm font-medium tracking-tight text-gray-400 md:text-base">
          Challenge your mind
        </p>
        <h1 className="mb-3 text-3xl font-black leading-none tracking-tight text-white sm:text-4xl md:text-5xl">
          PLAY. <span className="text-blue-500">THINK.</span> WIN.
        </h1>
        <p className="mx-auto mb-5 max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">
          Test your knowledge across thousands of curated questions, solve elegant logic puzzles, and compete on the global leaderboard. Fresh challenges delivered every single day.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/daily-trivias"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-105 hover:from-cyan-500 hover:to-blue-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Play Daily Challenges
            <Zap className="h-4 w-4" />
          </Link>
          <Link
            href="/trivias"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-400/30 bg-white/5 px-6 py-2.5 text-sm font-medium text-cyan-100 transition-all duration-300 hover:scale-105 hover:border-cyan-400/60 hover:bg-cyan-400/10 hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Explore Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
