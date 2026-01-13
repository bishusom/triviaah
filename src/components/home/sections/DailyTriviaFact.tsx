// src/components/home/DailyTriviaFacts.tsx - Dark Theme
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
  times_used?: number;
  last_used?: string;
}

interface DailyTriviaFact {
  id: string;
  date: string;
  fact_id: string;
  fact: TriviaFact;
}

interface ApiResponse {
  fact: DailyTriviaFact;
  type: 'scheduled' | 'random' | 'fallback';
  error?: string;
}

const FACT_TYPES_COLORS = {
  'quick': "bg-green-500/20 text-green-400 border-green-500/30",
  'surprising': "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  'mind-blowing': "bg-red-500/20 text-red-400 border-red-500/30"
};

const FACT_TYPES = {
  'quick': "Quick",
  'surprising': "Surprising", 
  'mind-blowing': "Mind Blowing"
};

const CATEGORY_ICONS: Record<string, string> = {
  'science': '🔬',
  'history': '📜',
  'nature': '🌿',
  'technology': '💻',
  'culture': '🌍',
  'space': '🚀',
  'animals': '🐾',
  'geography': '🗺️',
  'food': '🍕',
  'arts': '🎨',
  'literature': '📚',
  'sports': '⚽',
  'music': '🎵',
  'movies': '🎬',
  'tv': '📺'
};

export default function DailyTriviaFact() {
  const [todayFact, setTodayFact] = useState<DailyTriviaFact | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fallbackFacts] = useState([
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
    },
    {
      id: '2',
      fact: {
        id: 'fallback-2',
        fact_text: "The average person spends 6 months of their lifetime waiting at red lights.",
        category: 'culture',
        fact_type: 'surprising' as const,
        source: 'Time Magazine'
      }
    },
    {
      id: '3',
      fact: {
        id: 'fallback-3',
        fact_text: "Octopuses have three hearts: two pump blood through the gills, and one pumps it through the rest of the body.",
        category: 'animals',
        fact_type: 'mind-blowing' as const,
        source: 'Ocean Conservancy'
      }
    }
  ]);

  useEffect(() => {
    const fetchTodayFact = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const today = new Date().toISOString().split('T')[0];
        // Try to fetch from API
        const response = await fetch(`/api/daily-facts?date=${today}`);
        
        if (response.ok) {
          const data: ApiResponse = await response.json();
          if (data.fact && !data.error) {
            setTodayFact(data.fact);
            return;
          }
        }
        
        // Fallback: Use one of the static facts based on day of month
        const dayOfMonth = new Date().getDate();
        const fallbackIndex = dayOfMonth % fallbackFacts.length;
        setTodayFact({
          id: `fallback-${dayOfMonth}`,
          date: today,
          fact_id: fallbackFacts[fallbackIndex].fact.id,
          fact: fallbackFacts[fallbackIndex].fact
        });
        
      } catch (err) {
        console.error('Error fetching daily fact:', err);
        // Use first fallback fact on error
        setTodayFact({
          id: 'fallback-error',
          date: new Date().toISOString().split('T')[0],
          fact_id: fallbackFacts[0].fact.id,
          fact: fallbackFacts[0].fact
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayFact();
  }, [fallbackFacts]);

  const shareFact = async () => {
    if (!todayFact?.fact) return;

    const shareText = `🤔 Daily Trivia Fact:\n\n"${todayFact.fact.fact_text}"\n\nCategory: ${todayFact.fact.category}\nType: ${FACT_TYPES[todayFact.fact.fact_type]}\n${todayFact.fact.source ? `Source: ${todayFact.fact.source}` : ''}\n\nDiscover more at triviaah.com!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Trivia Fact',
          text: shareText,
        });
        return;
      } catch (err) {
        // Continue to clipboard fallback
      }
    }
    
    // Clipboard fallback
    navigator.clipboard.writeText(shareText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleSourceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (todayFact?.fact?.source_url) {
      window.open(todayFact.fact.source_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 p-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-gray-700 rounded-lg w-10 h-10 animate-pulse"></div>
            <div className="space-y-2 flex-1">
              <div className="bg-gray-700 rounded h-4 w-32 animate-pulse"></div>
              <div className="bg-gray-700 rounded h-3 w-48 animate-pulse"></div>
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg w-8 h-8 animate-pulse"></div>
        </div>  
      </div>
    );
  }

  if (error || !todayFact?.fact) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 p-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/20 p-2 rounded-lg">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Daily Trivia Fact</h3>
              <p className="text-gray-400 text-xs">Loading fact...</p>
            </div>
          </div>
        </div>
      </div>  
    );
  }

  const fact = todayFact.fact;
  const displayText = isExpanded ? fact.fact_text : `${fact.fact_text.substring(0, 120)}${fact.fact_text.length > 120 ? '...' : ''}`;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1 p-6 w-full">
      {/* Mobile Layout - Stacked */}
      <div className="block sm:hidden">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Daily Trivia Fact</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className={`flex items-center gap-1 border rounded-lg px-2 py-1 text-xs ${FACT_TYPES_COLORS[fact.fact_type]}`}>
                  <span className="font-medium">{FACT_TYPES[fact.fact_type]}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={shareFact}
              className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-gray-700 rounded-lg transition-all duration-200"
              title="Share this fact"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fact Text */}
        <div 
          className="cursor-pointer mb-4"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-gray-200 leading-relaxed">
              {displayText}
            </p>
          </div>
          
          {fact.fact_text.length > 120 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs mt-2 transition-colors"
            >
              {isExpanded ? (
                <>Show less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Read more <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1">
            <span className="text-sm">
              {CATEGORY_ICONS[fact.category] || "📚"}
            </span>
            <span className="text-gray-200 text-sm font-medium capitalize">
              {fact.category.replace('-', ' ')}
            </span>
          </div>

          {fact.source && (
            <button
              onClick={handleSourceClick}
              disabled={!fact.source_url}
              className={`flex items-center gap-1 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1 text-sm transition-all ${
                fact.source_url 
                  ? 'cursor-pointer hover:bg-gray-600 hover:border-gray-500' 
                  : 'cursor-default'
              }`}
              title={fact.source_url ? `Learn more: ${fact.source}` : fact.source}
            >
              <span className="text-gray-300 text-sm truncate max-w-[100px]">
                {fact.source}
              </span>
              {fact.source_url && (
                <ExternalLink className="w-3 h-3 text-cyan-400 flex-shrink-0" />
              )}
            </button>
          )}

          {isCopied && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-2 py-1">
              <span className="text-green-400 text-xs">Copied!</span>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout - Horizontal */}
      <div className="hidden sm:flex items-start justify-between gap-4">
        {/* Left: Icon and Metadata */}
        <div className="flex items-start gap-3 flex-shrink-0">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-lg">Daily Trivia Fact</h3>
              <div className={`flex items-center gap-1 border rounded-lg px-2 py-1 text-xs ${FACT_TYPES_COLORS[fact.fact_type]}`}>
                <span className="font-medium">{FACT_TYPES[fact.fact_type]}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1">
                <span className="text-sm">
                  {CATEGORY_ICONS[fact.category] || "📚"}
                </span>
                <span className="text-gray-200 text-sm font-medium capitalize">
                  {fact.category.replace('-', ' ')}
                </span>
              </div>

              {fact.source && (
                <button
                  onClick={handleSourceClick}
                  disabled={!fact.source_url}
                  className={`flex items-center gap-1 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1 text-sm transition-all ${
                    fact.source_url 
                      ? 'cursor-pointer hover:bg-gray-600 hover:border-gray-500' 
                      : 'cursor-default'
                  }`}
                  title={fact.source_url ? `Learn more: ${fact.source}` : fact.source}
                >
                  <span className="text-gray-300 text-sm truncate max-w-[150px]">
                    Source: {fact.source}
                  </span>
                  {fact.source_url && (
                    <ExternalLink className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Middle: Fact Text */}
        <div 
          className="flex-1 min-w-0 cursor-pointer group px-4"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />
            <p className="text-gray-200 leading-relaxed group-hover:text-white transition-colors">
              {displayText}
            </p>
          </div>
          
          {fact.fact_text.length > 120 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs mt-2 transition-colors"
            >
              {isExpanded ? (
                <>Show less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Read more <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={shareFact}
            className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-700 rounded-lg transition-all duration-200 group"
            title="Share this fact"
          >
            <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          
          {isCopied && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-2 py-1">
              <span className="text-green-400 text-xs">Copied! 📋</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}