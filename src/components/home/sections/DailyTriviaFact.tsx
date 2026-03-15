'use client';
import { Sparkles, Lightbulb, Share2, Check } from 'lucide-react';
import { useState } from 'react';

export default function DailyTriviaFact() {
  const [copied, setCopied] = useState(false);

  const fact = {
    text: "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
    category: "NATURE",
    label: "MIND-BLOWING"
  };

  const shareUrl = "https://triviaah.com";
  const shareText = `"${fact.text}" — Found on ${shareUrl}`;

  const handleShare = async () => {
    // Try native share first (mobile/modern browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Trivia Fact',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled or failed', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset icon after 2s
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
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

      <div className="flex-shrink-0">
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-bold transition-all active:scale-95"
        >
          {copied ? (
            <><Check className="w-4 h-4 text-green-400" /> Copied!</>
          ) : (
            <><Share2 className="w-4 h-4" /> Share Fact</>
          )}
        </button>
      </div>
      
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />
    </div>
  );
}