// components/home/CompactHero.tsx
import Link from "next/link";

export default function CompactHero() {
  return (
    <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl text-center p-4 backdrop-blur-sm w-full">
        <h1 className="text-2xl font-bold text-white mb-2">
          Triviaah : Free Daily Trivia Quiz with Answers & Explanations
        </h1>
        <p className="text-gray-10 mb-4">
          New free online trivia games with answers every 24 hours. Test your knowledge and learn instantly!
        </p>
      </div>
    </div>
  
  );
}