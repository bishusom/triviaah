import Link from 'next/link';
import { Home, Brain, Layout, Hash, Gamepad2, Calendar, Trophy } from 'lucide-react';

const SECTIONS = [
  { id: 'home', name: 'Home', href: '/', icon: Home, color: 'from-blue-500 to-cyan-500', description: 'Main dashboard' },
  { id: 'daily-trivias', name: 'Daily Trivias', href: '/daily-trivias', icon: Calendar, color: 'from-cyan-500 to-blue-500', description: 'Fresh daily challenges' },
  { id: 'brainwave', name: 'Brainwave', href: '/brainwave', icon: Brain, color: 'from-purple-500 to-pink-500', description: 'Daily deduction puzzles' },
  { id: 'word-games', name: 'Word Games', href: '/word-games', icon: Layout, color: 'from-green-500 to-emerald-500', description: 'Vocabulary & spelling' },
  { id: 'number-puzzles', name: 'Number Puzzles', href: '/number-puzzles', icon: Hash, color: 'from-yellow-500 to-orange-500', description: 'Math & logic puzzles' },
  { id: 'retro-games', name: 'Retro Games', href: '/retro-games', icon: Gamepad2, color: 'from-red-500 to-pink-500', description: 'Classic arcade fun' },
  { id: 'trivias', name: 'All Trivias', href: '/trivias', icon: Trophy, color: 'from-indigo-500 to-purple-500', description: 'Browse all categories' },
];

export default function ExploreSections({ exclude }: { exclude?: string }) {
  const filteredSections = SECTIONS.filter(s => s.id !== exclude);

  return (
    <section className="mt-16 mb-12">
      <h2 className="text-3xl font-bold text-white text-center mb-8">Discover More</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {filteredSections.map((section) => (
          <Link
            key={section.id}
            href={section.href}
            className="group relative p-6 rounded-2xl bg-gray-800/40 border border-white/5 hover:border-white/20 transition-all duration-300 overflow-hidden backdrop-blur-sm"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{section.name}</h3>
              <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
