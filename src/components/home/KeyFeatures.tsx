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
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Players Love Triviaah
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Designed for trivia enthusiasts who want to learn while having fun
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group text-center bg-gradient-to-br from-gray-600 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-xl"
            >
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
          ))}
        </div>
      </div>
    </section>
  );
}