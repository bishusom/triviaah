// components/home/CompactHero.tsx
import Link from "next/link";

export default function CompactHero() {
  return (
    <section className="bg-gradient-to-br from-purple-900/50 to-gray-900 py-8 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Logo/Brand */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Triviaah
          </h1>
          
          {/* Short value prop */}
          <p className="text-xl text-gray-300 mb-6">
            Daily trivia, puzzles & brain teasers to challenge your mind
          </p>
          
          {/* Single CTA */}
          <div className="flex gap-4 justify-center">
            <Link href="/daily-trivias/quick-fire" >
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
              Start Playing
            </button>
            </Link>
            
          </div>
          
          {/* Quick stats */}
          <div className="flex justify-center gap-6 mt-6 text-sm text-gray-400">
            <span>100K+ Players</span>
            <span>•</span>
            <span>Daily Challenges</span>
            <span>•</span>
            <span>Free Forever</span>
          </div>
        </div>
      </div>
    </section>
  );
}