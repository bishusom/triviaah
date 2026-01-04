'use client';
import Link from 'next/link';

export default function ChallengesPage() {
  const upcomingFeatures = [
    {
      icon: "🌞",
      title: "Daily Challenges",
      description: "Fresh puzzles every day to test your skills and earn rewards",
      status: "Coming Soon"
    },
    {
      icon: "📅",
      title: "Weekly Quests", 
      description: "Tougher challenges that run throughout the week with bigger rewards",
      status: "In Development"
    },
    {
      icon: "🗓️",
      title: "Monthly Tournaments",
      description: "Compete with other players and climb the global leaderboards",
      status: "Planned"
    },
    {
      icon: "🏆",
      title: "Achievement System",
      description: "Unlock badges and trophies for your puzzle-solving prowess",
      status: "Coming Soon"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🚧</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Challenges Coming Soon!
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            We're building an exciting challenges system with daily puzzles, weekly quests, and monthly tournaments. 
            Get ready to test your skills and earn amazing rewards!
          </p>
          
          {/* Countdown/Progress */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">Soon</div>
                <div className="text-sm text-gray-400">Launch Date</div>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Upcoming Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {upcomingFeatures.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{feature.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-white text-lg">{feature.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      feature.status === 'Coming Soon' ? 'bg-green-500/20 text-green-400' :
                      feature.status === 'In Development' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {feature.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Available Games */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            🎮 Play Our Current Games
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Number Scramble", href: "/number-scramble", emoji: "🔢" },
              { name: "Number Tower", href: "/number-tower", emoji: "🏗️" },
              { name: "Number Sequence", href: "/number-sequence", emoji: "🔍" },
              { name: "Prime Hunter", href: "/prime-hunter", emoji: "🎯" },
              { name: "Sudoku", href: "/sudoku", emoji: "9️⃣" },
              { name: "Word Games", href: "/word-games", emoji: "🔠" },
              { name: "Trivia Bank", href: "/trivia-bank", emoji: "🏛️" },
              { name: "Blog", href: "/blog", emoji: "📝" },
            ].map((game, index) => (
              <Link key={index} href={game.href}>
                <div className="text-center bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-cyan-500/50 hover:bg-gray-700 transition-all duration-300 group cursor-pointer">
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {game.emoji}
                  </div>
                  <div className="text-white font-semibold text-sm group-hover:text-cyan-400 transition-colors">
                    {game.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-3">
              🎉 Be the First to Know!
            </h3>
            <p className="text-gray-400 mb-6">
              Get notified when challenges launch and receive exclusive early access.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105">
                Notify Me
              </button>
            </div>
          </div>
        </div>

        {/* Back to Games */}
        <div className="text-center mt-8">
          <Link href="/">
            <button className="px-8 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 border border-gray-600">
              ← Back to All Games
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}