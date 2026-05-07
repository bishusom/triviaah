export default function KeyFeatures() {
  const features = [
    {
      icon: "📚",
      title: "Daily Trivia Facts",
      description: "Learn something new every day with fresh facts and explanations",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "🏆", 
      title: "Progressive Challenges",
      description: "Earn badges and climb leaderboards with our achievement system",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "📊",
      title: "User Stats & Analytics", 
      description: "Track your progress and see how you compare with other players",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "🔄",
      title: "Daily New Content",
      description: "Fresh quizzes and puzzles added every 24 hours",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-xl shadow-black/20 sm:p-6 md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(80%_120%_at_20%_10%,rgba(37,99,235,0.18)_0%,transparent_55%)] pointer-events-none" />
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Why Players Love Triviaah
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Designed for trivia enthusiasts who want to learn while having fun
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-cyan-500/10 before:absolute before:inset-0 before:bg-[radial-gradient(90%_120%_at_20%_10%,rgba(37,99,235,0.16)_0%,transparent_58%)] before:pointer-events-none"
            >
              <div className="relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                
                <h3 className="font-bold text-white text-lg mb-3 group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
