import Link from 'next/link';
import Image from 'next/image';

export default function MoreGames() {
  const items = [
    {
      title: "Word Games",
      description: "Challenge your vocabulary with free online word puzzle games",
      color: "from-green-500 to-emerald-500",
      href: "/word-games",
      image: "/imgs/word-games/word-games.webp" // Larger image path
    },
    {
      title: "Number Puzzles",
      description: "Exercise your brain with mathematical trivia and logic puzzles",
      color: "from-purple-500 to-rose-500",
      href: "/number-puzzles",
      image: "/imgs/number-puzzles/number-puzzles.webp"
    },
    {
      title: "Blog", 
      description: "Learn fascinating trivia facts and quiz strategies",
      color: "from-pink-500 to-orange-500",
      href: "/blog",
      image: "/imgs/blog-card.webp"
    },
    {
      title: "Trivia Bank",
      description: "Access our complete collection of free trivia questions",
      color: "from-cyan-500 to-blue-500",
      href: "/trivia-bank",
      image: "/imgs/trivia-bank-card.webp"
    }
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            🎮 More Free Brain Games
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Designed for trivia enthusiasts who want to learn while having fun
          </p>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="lg:hidden relative">
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            {items.map((item, index) => (
              <div key={index} className="flex-none w-[300px] snap-start mr-6 last:mr-0">
                <Link href={`${item.href}`}>
                  <div className="group text-center bg-gradient-to-br from-gray-600 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-xl h-full">
                    {/* Larger Square Image */}
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className={`w-full h-full bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-r ${item.color} rounded-2xl`} />
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-white text-lg mb-3 group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Single Row Grid */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-6">
            {items.map((item, index) => (
              <Link key={index} href={`${item.href}`}>
                <div className="group text-center bg-gradient-to-br from-gray-600 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-xl h-full">
                  {/* Larger Square Image */}
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className={`w-full h-full bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-r ${item.color} rounded-2xl`} />
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-white text-lg mb-3 group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}