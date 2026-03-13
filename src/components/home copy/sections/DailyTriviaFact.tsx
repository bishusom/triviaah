// src/components/home/DailyTriviaFact.tsx
'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Lightbulb, Share2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const shareFact = () => {
    if (!todayFact?.fact) return;
    const shareText = `🤔 Daily Trivia Fact: "${todayFact.fact.fact_text}" - Discover more at triviaah.com!`;
    navigator.clipboard.writeText(shareText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  if (isLoading || !todayFact?.fact) return <div className="h-32 animate-pulse bg-gray-800/20 rounded-3xl" />;

  const fact = todayFact.fact;
  const displayText = isExpanded ? fact.fact_text : `${fact.fact_text.substring(0, 140)}${fact.fact_text.length > 140 ? '...' : ''}`;

  return (
    <div className="relative group overflow-hidden rounded-3xl border border-white/5 bg-gray-900/40 backdrop-blur-md p-8 transition-all duration-500 hover:border-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/5">
      {/* Premium Background Accent */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors duration-700" />
      
      <div className="relative z-10">
        {/* Header Label */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-500 font-bold">Editorial Pick</p>
              <h3 className="text-white font-semibold text-sm">Daily Insight</h3>
            </div>
          </div>
          
          <button
            onClick={shareFact}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            {isCopied ? "Copied" : <><Share2 className="w-3.5 h-3.5" /> Share Insight</>}
          </button>
        </div>

        {/* Fact Content */}
        <div className="mb-8">
          <div className="flex gap-4">
            <Lightbulb className="w-6 h-6 text-yellow-500/80 flex-shrink-0 mt-1" />
            <div className="space-y-4">
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
          </div>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-gray-800/50 border border-white/5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              {fact.category}
            </div>
            
            {fact.source && (
              <a
                href={fact.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-cyan-400 transition-colors"
              >
                <span>Source: {fact.source}</span>
                {fact.source_url && <ExternalLink className="w-3 h-3" />}
              </a>
            )}
          </div>
          
          <div className="hidden md:block text-[11px] text-gray-600 font-medium italic">
            Part of our daily knowledge series.
          </div>
        </div>
      </div>
    </div>
  );
}