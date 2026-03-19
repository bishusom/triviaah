'use client';
import { Lightbulb, Share2, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { useState, useEffect } from 'react';


interface TriviaFact {
  id: string;
  fact_text: string;
  category: string;
  subcategory?: string;
  source?: string;
  source_url?: string;
  fact_type: 'quick' | 'surprising' | 'mind-blowing';
}

interface DailyTriviaFact {
  id: string;
  date: string;
  fact_id: string;
  fact: TriviaFact;
}

export default function DailyTriviaFact() {
  const [todayFact, setTodayFact] = useState<DailyTriviaFact | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fallbackFacts = [
    {
      id: '1',
      fact: {
        id: 'fallback-1',
        fact_text: "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old!",
        category: 'nature',
        fact_type: 'quick' as const,
        source: 'National Geographic',
        source_url: 'https://www.nationalgeographic.com'
      }
    }
  ];

  useEffect(() => {
      const fetchTodayFact = async () => {
        try {
          setIsLoading(true);
          const today = new Date().toISOString().split('T')[0];
          const response = await fetch(`/api/daily-facts?date=${today}`);
          
          if (response.ok) {
            const data = await response.json();
            if (data.fact) {
              setTodayFact(data.fact);
              return;
            }
          }
          setTodayFact({
            id: 'fallback',
            date: today,
            fact_id: fallbackFacts[0].fact.id,
            fact: fallbackFacts[0].fact
          });
        } catch (err) {
          console.error('Error fetching daily fact:', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTodayFact();
    }, []);
  

  if (isLoading || !todayFact?.fact) return <div className="h-32 animate-pulse bg-gray-800/20 rounded-3xl" />;

  const fact = todayFact.fact;
  const displayText = isExpanded ? fact.fact_text : `${fact.fact_text.substring(0, 140)}${fact.fact_text.length > 140 ? '...' : ''}`;
  
  const shareUrl = "https://triviaah.com";
  const shareText = `"${fact.fact_text}" — Found on ${shareUrl}`;

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
            {fact.category}
          </span>
          {fact.subcategory && (
            <span className="text-gray-400 text-xs uppercase tracking-wide">
              {fact.subcategory}
            </span>
          )}
        </div>
        
        <p className="text-xl md:text-2xl text-gray-200 font-medium leading-relaxed tracking-tight group-hover:text-white transition-colors duration-500">
          {displayText}
        </p>
        
        {fact.fact_text.length > 140 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1 uppercase tracking-wider"
          >
            {isExpanded ? <>Collapse <ChevronUp className="w-3 h-3" /></> : <>Expand Fact <ChevronDown className="w-3 h-3" /></>}
          </button>
        )}
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