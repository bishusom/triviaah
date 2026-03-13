export default function HeaderSection() {
  return (
    <header className="sticky top-0 z-50 bg-gray-700/80 backdrop-blur-md border-b border-white/10 py-3 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between relative">
        {/* Brand Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">🧠</span>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Triviaah
          </h3>
        </div>

        {/* Slogan - centered on desktop, below on mobile */}
        <p className="text-sm md:text-base text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text font-semibold tracking-wide order-3 sm:order-2 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 whitespace-nowrap mt-2 sm:mt-0">
          Feed Your Curiosity Daily
        </p>

        {/* Empty div to maintain justify-between on desktop (optional) */}
        <div className="hidden sm:block w-[140px]"></div> {/* Approx width of brand to balance, but not needed if absolute */}
      </div>
    </header>
  );
}