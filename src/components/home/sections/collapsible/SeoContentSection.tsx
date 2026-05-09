import Link from 'next/link';

const primaryLinks = [
  {
    href: '/daily-trivias',
    label: 'free daily trivia quizzes with answers',
    description: 'Fresh timed quizzes across general knowledge, science, sports, history, geography, and pop culture.',
  },
  {
    href: '/trivia-bank',
    label: 'free trivia questions and answers',
    description: 'Browse ready-to-use trivia questions for quiz nights, classroom warmups, and team games.',
  },
  {
    href: '/word-games',
    label: 'free online word games',
    description: 'Play vocabulary puzzles including word search, spelling challenges, anagrams, and cryptograms.',
  },
  {
    href: '/brainwave',
    label: 'daily brain teaser games',
    description: 'Solve clue-based guessing games for movies, music, geography, history, books, food, and more.',
  },
];

const supportingLinks = [
  { href: '/number-puzzles', label: 'online number puzzle games' },
  { href: '/retro-games', label: 'classic retro games online' },
  { href: '/trivias', label: 'trivia categories for every topic' },
  { href: '/blog', label: 'trivia facts and quiz guides' },
];

export default function SeoContentSection() {
  return (
    <section aria-labelledby="seo-content-heading" className="w-full">
      <div className="mx-auto max-w-5xl py-4 sm:py-6">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Play, learn, and host better quizzes
          </p>
          <h2 id="seo-content-heading" className="text-2xl font-bold text-white md:text-3xl">
            Free Trivia Games, Daily Quizzes, and Brain Puzzles
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-gray-300 md:text-base">
            Triviaah brings together daily quiz challenges, searchable trivia questions, word games, number puzzles, and brain teasers in one place. Use it for quick solo practice, classroom trivia, virtual trivia nights, or team-building quiz games with answers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {primaryLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/70 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <span className="relative z-10 block text-lg font-bold text-cyan-300 transition-colors group-hover:text-cyan-200">
                {item.label}
              </span>
              <span className="relative z-10 mt-2 block text-sm leading-6 text-gray-300">
                {item.description}
              </span>
              <span aria-hidden="true" className="relative z-10 mt-4 inline-flex text-sm font-semibold text-white">
                Explore {item.label}
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/50 p-5">
          <h3 className="text-base font-semibold text-white">
            More ways to play free puzzles online
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {supportingLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition-colors hover:border-cyan-300 hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
