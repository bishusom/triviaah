export default function HeroSection() {
  return (
    <div className="text-center py-12 md:py-20 max-w-4xl mx-auto px-4">
      {/* Live status badge */}
      <div className="flex items-center justify-start gap-2 mb-6">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="text-green-400 font-medium text-sm uppercase tracking-wide">
          Daily Challenges live now
        </span>
      </div>

      <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight tracking-tight">
        How much do<br />
        <em className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent not-italic">
          you know?
        </em>
      </h1>

      <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
        Free daily trivia, brain puzzles & personality tests — for curious minds of all ages.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a
          href="/daily-trivias"
          className="group inline-flex items-center px-6 py-3 text-base font-medium rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          ▶ Start Today's Quiz
        </a>
        <a
          href="/trivias"
          className="group inline-flex items-center px-6 py-3 text-base font-medium rounded-full border border-white/30 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
        >
          Browse categories
          <svg
            className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}