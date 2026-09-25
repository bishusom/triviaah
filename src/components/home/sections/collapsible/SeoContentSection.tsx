import Link from 'next/link';

const primaryLinks = [
  {
    href: '/daily-trivias',
    label: 'Daily trivia quizzes',
    description: 'Make a little room for curiosity. Answer a new set of questions each day and discover which subjects surprise you.',
    cta: 'Try today’s questions',
  },
  {
    href: '/brainwave',
    label: 'Brainwave puzzles',
    description: 'Prefer connecting clues to choosing an answer? Narrow down the possibilities to uncover a mystery movie, place, person, or song.',
    cta: 'Solve a puzzle',
  },
  {
    href: '/challenges',
    label: 'Weekly trivia challenges',
    description: 'Put your knowledge of one topic to the test. Each themed challenge gives you 30 seconds per question to make your choice.',
    cta: 'Pick a challenge',
  },
  {
    href: '/trivia-bank',
    label: 'Trivia questions and answers',
    description: 'Hosting a quiz? Find questions for a pub night, classroom warmup, or get-together, with answers ready for the host.',
    cta: 'Browse the question bank',
  },
];

const supportingLinks = [
  { href: '/leaderboard', label: 'View the leaderboard' },
];

export default function SeoContentSection() {
  return (
    <section aria-labelledby="seo-content-heading" className="w-full">
      <div className="mx-auto max-w-5xl py-4 sm:py-6">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Follow your curiosity
          </p>
          <h2 id="seo-content-heading" className="text-2xl font-bold text-white md:text-3xl">
            Find Your Next Trivia Game or Puzzle
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-gray-300 md:text-base">
            A quick break, a tricky mystery, or a quiz night with friends: start with what you feel like doing. These free games and question collections offer a different way to put your knowledge to use.
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
                {item.cta}
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/50 p-5">
          <h3 className="text-base font-semibold text-white">
            See how your scores compare
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
