import Link from 'next/link';
import { Brain, Calculator, Gamepad2, SpellCheck } from 'lucide-react';

const collections = [
  {
    title: 'Word Games',
    href: '/word-games',
    description: 'Find hidden words, solve anagrams, and put your vocabulary to work.',
    icon: SpellCheck,
    color: 'text-cyan-400 bg-cyan-400/10',
  },
  {
    title: 'Number Puzzles',
    href: '/number-puzzles',
    description: 'Spot patterns and sharpen your logic with number puzzles.',
    icon: Calculator,
    color: 'text-emerald-400 bg-emerald-400/10',
  },
  {
    title: 'Retro Games',
    href: '/retro-games',
    description: 'Take a playful break with familiar arcade classics.',
    icon: Gamepad2,
    color: 'text-amber-400 bg-amber-400/10',
  },
  {
    title: 'IQ & Personality Tests',
    href: '/iq-and-personality-tests',
    description: 'Explore reasoning puzzles and discover more about your personality.',
    icon: Brain,
    color: 'text-purple-400 bg-purple-400/10',
  },
];

export default function MoreWaysToPlay() {
  return (
    <section aria-labelledby="more-ways-to-play-heading" className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-xl shadow-black/20 sm:p-6">
      <h2 id="more-ways-to-play-heading" className="mb-6 text-center text-xl font-bold text-white">
        More Ways to Play
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {collections.map(({ title, href, description, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col items-center rounded-xl border border-white/10 bg-slate-950/70 p-5 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-cyan-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span className={`mb-4 rounded-xl p-3 ${color}`}>
              <Icon size={28} aria-hidden="true" />
            </span>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300">{title}</h3>
            <p className="mt-2 text-base leading-relaxed text-gray-400">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
