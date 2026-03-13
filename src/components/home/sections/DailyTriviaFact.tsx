'use client';
import { Sparkles, Lightbulb, Share2 } from 'lucide-react';

export default function DailyTriviaFact() {
  // Simplified for the cinematic look
  const fact = {
    text: "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
    category: "NATURE",
    label: "MIND-BLOWING"
  };

  return (
    <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
      {/* Decorative Icon */}
      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20">
        <Lightbulb className="text-white w-8 h-8" />
      </div>

      <div className="flex-grow text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
          <span className="text-cyan-400 text-xs font-black tracking-widest uppercase">
            {fact.label}
          </span>
          <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
          <span className="text-gray-400 text-xs font-bold uppercase">
            {fact.category}
          </span>
        </div>
        
        <p className="text-lg md:text-2xl text-white font-medium leading-relaxed italic">
          "{fact.text}"
        </p>
      </div>

      {/* Action Area */}
      <div className="flex-shrink-0">
        <button className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-bold transition-all">
          <Share2 className="w-4 h-4" /> Share Fact
        </button>
      </div>
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />
    </div>
  );
}