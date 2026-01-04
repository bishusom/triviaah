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
  'quick': "bg-green-100 text-green-800 border-green-200",
  'surprising': "bg-yellow-100 text-yellow-800 border-yellow-200",
  'mind-blowing': "bg-red-100 text-red-800 border-red-200"
};

const FACT_TYPES = {
  'quick': "Quick",
  'surprising': "Suprising", 
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

  // Fetch today's fact from the database
  useEffect(() => {
    const fetchTodayFact = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`/api/daily-facts?date=${today}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        if (data.fact) {
          setTodayFact(data.fact);
        } else {
          setError('No fact available for today');
        }
      } catch (err) {
        console.error('Error fetching daily fact:', err);
        setError(err instanceof Error ? err.message : 'Failed to load fact');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayFact();
  }, []);

  const shareFact = async () => {
    if (!todayFact?.fact) return;

    const factTypeKey = todayFact.fact.fact_type as keyof typeof FACT_TYPES;
    const shareText = `🤔 Daily Trivia Fact:\n\n"${todayFact.fact.fact_text}"\n\nCategory: ${todayFact.fact.category}\nDifficulty: ${FACT_TYPES[factTypeKey]}\n${todayFact.fact.source ? `Source: ${todayFact.fact.source}` : ''}\n\nDiscover more at Triviaah.com!`;
    
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
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-4 backdrop-blur-sm w-full">         
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-purple-500/20 rounded-lg w-10 h-10 animate-pulse"></div>
              <div className="space-y-2 flex-1">
                <div className="bg-white/10 rounded h-4 w-32 animate-pulse"></div>
                <div className="bg-white/5 rounded h-3 w-48 animate-pulse"></div>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg w-8 h-8 animate-pulse"></div>
          </div>  
        </div>    
      </div>
    );
  }

  if (error || !todayFact?.fact) {
    return (
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-300/10 to-pink-300/10 border border-purple-500/30 rounded-2xl p-4 backdrop-blur-sm w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Daily Trivia Fact</h3>
                <p className="text-purple-300 text-xs">No fact available today</p>
              </div>
            </div>
          </div>
        </div>  
      </div>
    );
  }

  const fact = todayFact.fact;
  const displayText = isExpanded ? fact.fact_text : `${fact.fact_text.substring(0, 100)}${fact.fact_text.length > 100 ? '...' : ''}`;

  return (
    <div className="container mx-auto px-4">
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-4 backdrop-blur-sm w-full hover:border-purple-500/50 transition-all duration-300">
        {/* Mobile Layout - Stacked */}
        <div className="block sm:hidden">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Daily Trivia Fact</h3>
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
                className="p-1.5 text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all duration-200"
                title="Share this fact"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Fact Text */}
          <div 
            className="cursor-pointer mb-3"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-white leading-relaxed text-sm">
                {displayText}
              </p>
            </div>
            
            {fact.fact_text.length > 100 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-purple-300 hover:text-purple-200 text-xs mt-2 transition-colors"
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
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
              <span className="text-sm">
                {CATEGORY_ICONS[fact.category] || "📚"}
              </span>
              <span className="text-white text-xs font-medium capitalize">
                {fact.category.replace('-', ' ')}
              </span>
            </div>

            {fact.source && (
              <button
                onClick={handleSourceClick}
                disabled={!fact.source_url}
                className={`flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs transition-all ${
                  fact.source_url 
                    ? 'cursor-pointer hover:bg-white/10 hover:border-white/20' 
                    : 'cursor-default'
                }`}
                title={fact.source_url ? `Learn more: ${fact.source}` : fact.source}
              >
                <span className="text-white/80 text-xs truncate max-w-[80px]">
                  {fact.source}
                </span>
                {fact.source_url && (
                  <ExternalLink className="w-3 h-3 text-purple-300 flex-shrink-0" />
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
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">Daily Trivia Fact</h3>
                <div className={`flex items-center gap-1 border rounded-lg px-2 py-1 text-xs ${FACT_TYPES_COLORS[fact.fact_type]}`}>
                  <span className="font-medium">{FACT_TYPES[fact.fact_type]}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                  <span className="text-sm">
                    {CATEGORY_ICONS[fact.category] || "📚"}
                  </span>
                  <span className="text-white text-xs font-medium capitalize">
                    {fact.category.replace('-', ' ')}
                  </span>
                </div>

                {fact.source && (
                  <button
                    onClick={handleSourceClick}
                    disabled={!fact.source_url}
                    className={`flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs transition-all ${
                      fact.source_url 
                        ? 'cursor-pointer hover:bg-white/10 hover:border-white/20' 
                        : 'cursor-default'
                    }`}
                    title={fact.source_url ? `Learn more: ${fact.source}` : fact.source}
                  >
                    <span className="text-white/80 text-xs truncate max-w-[100px]">
                      Source: {fact.source}
                    </span>
                    {fact.source_url && (
                      <ExternalLink className="w-3 h-3 text-purple-300 flex-shrink-0" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Middle: Fact Text */}
          <div 
            className="flex-1 min-w-0 cursor-pointer group"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />
              <p className="text-white leading-relaxed text-sm group-hover:text-white/90 transition-colors">
                {displayText}
              </p>
            </div>
            
            {fact.fact_text.length > 120 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-purple-300 hover:text-purple-200 text-xs mt-2 transition-colors"
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
              className="p-2 text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all duration-200 group"
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
    </div>
  );
}