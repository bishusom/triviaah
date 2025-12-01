// src/components/home/DailyTriviaFacts.tsx - Updated with blue theme
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
  difficulty: 'easy' | 'medium' | 'hard';
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

const DIFFICULTY_COLORS = {
  easy: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  hard: "bg-red-500/20 text-red-400 border-red-500/30"
};

const DIFFICULTY_LABELS = {
  easy: "Easy",
  medium: "Medium", 
  hard: "Hard"
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
        difficulty: 'easy' as const,
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
        difficulty: 'medium' as const,
        source: 'Time Magazine'
      }
    },
    {
      id: '3',
      fact: {
        id: 'fallback-3',
        fact_text: "Octopuses have three hearts: two pump blood through the gills, and one pumps it through the rest of the body.",
        category: 'animals',
        difficulty: 'medium' as const,
        source: 'Ocean Conservancy'
      }
    }
  ]);

  // Fetch today's fact from the database (with fallback)
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

    const shareText = `🤔 Daily Trivia Fact:\n\n"${todayFact.fact.fact_text}"\n\nCategory: ${todayFact.fact.category}\nDifficulty: ${DIFFICULTY_LABELS[todayFact.fact.difficulty]}\n${todayFact.fact.source ? `Source: ${todayFact.fact.source}` : ''}\n\nDiscover more at Triviaah.com!`;
    
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
        <div className="bg-white border-2 border-blue-600 rounded-lg p-6 w-full transition-all duration-300 hover:shadow-lg w-full">         
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-blue-500/20 rounded-lg w-10 h-10 animate-pulse"></div>
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
        <div className="bg-white border-2 border-blue-600 rounded-lg p-6 w-full transition-all duration-300 hover:shadow-lg w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray text-sm">Daily Trivia Fact</h3>
                <p className="text-blue-300 text-xs">Loading fact...</p>
              </div>
            </div>
          </div>
        </div>  
      </div>
    );
  }

  const fact = todayFact.fact;
  const displayText = isExpanded ? fact.fact_text : `${fact.fact_text.substring(0, 120)}${fact.fact_text.length > 120 ? '...' : ''}`;

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white border-2 border-blue-600 rounded-lg p-6 w-full transition-all duration-300 hover:shadow-lg w-full">
        {/* Mobile Layout - Stacked */}
        <div className="block sm:hidden">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray text-lg">Daily Trivia Fact</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`flex items-center gap-1 border rounded-lg px-2 py-1 text-xs ${DIFFICULTY_COLORS[fact.difficulty]}`}>
                    <span className="font-medium">{DIFFICULTY_LABELS[fact.difficulty]}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={shareFact}
                className="p-1.5 text-blue-300 hover:text-gray hover:bg-blue-500/20 rounded-lg transition-all duration-200"
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
              <p className="text-gray leading-relaxed">
                {displayText}
              </p>
            </div>
            
            {fact.fact_text.length > 120 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-blue-300 hover:text-blue-200 text-xs mt-2 transition-colors"
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
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1">
              <span className="text-sm">
                {CATEGORY_ICONS[fact.category] || "📚"}
              </span>
              <span className="text-gray text-sm font-medium capitalize">
                {fact.category.replace('-', ' ')}
              </span>
            </div>

            {fact.source && (
              <button
                onClick={handleSourceClick}
                disabled={!fact.source_url}
                className={`flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm transition-all ${
                  fact.source_url 
                    ? 'cursor-pointer hover:bg-white/10 hover:border-white/20' 
                    : 'cursor-default'
                }`}
                title={fact.source_url ? `Learn more: ${fact.source}` : fact.source}
              >
                <span className="text-gray/80 text-sm truncate max-w-[100px]">
                  {fact.source}
                </span>
                {fact.source_url && (
                  <ExternalLink className="w-3 h-3 text-blue-300 flex-shrink-0" />
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
            <div className="bg-blue-600 p-2 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray text-lg">Daily Trivia Fact</h3>
                <div className={`flex items-center gap-1 border rounded-lg px-2 py-1 text-xs ${DIFFICULTY_COLORS[fact.difficulty]}`}>
                  <span className="font-medium">{DIFFICULTY_LABELS[fact.difficulty]}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1">
                  <span className="text-sm">
                    {CATEGORY_ICONS[fact.category] || "📚"}
                  </span>
                  <span className="text-gray text-sm font-medium capitalize">
                    {fact.category.replace('-', ' ')}
                  </span>
                </div>

                {fact.source && (
                  <button
                    onClick={handleSourceClick}
                    disabled={!fact.source_url}
                    className={`flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm transition-all ${
                      fact.source_url 
                        ? 'cursor-pointer hover:bg-white/10 hover:border-white/20' 
                        : 'cursor-default'
                    }`}
                    title={fact.source_url ? `Learn more: ${fact.source}` : fact.source}
                  >
                    <span className="text-gray/80 text-sm truncate max-w-[150px]">
                      Source: {fact.source}
                    </span>
                    {fact.source_url && (
                      <ExternalLink className="w-3 h-3 text-blue-300 flex-shrink-0" />
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
              <p className="text-gray leading-relaxed group-hover:text-gray/90 transition-colors">
                {displayText}
              </p>
            </div>
            
            {fact.fact_text.length > 120 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-blue-300 hover:text-blue-200 text-xs mt-2 transition-colors"
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
              className="p-2 text-blue-300 hover:text-gray hover:bg-blue-500/20 rounded-lg transition-all duration-200 group"
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