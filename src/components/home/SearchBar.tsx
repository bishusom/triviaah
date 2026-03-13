// components/navigation/SearchBar.tsx
import { useState, useEffect, useRef } from 'react';
import { Search, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getSearchableItems, type SearchResult } from '@/lib/supabase';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [allData, setAllData] = useState<SearchResult[]>([]);
  const [filtered, setFiltered] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load data once on mount
  useEffect(() => {
    getSearchableItems().then(setAllData);
  }, []);

  // Filter as user types
  useEffect(() => {
    if (query.trim().length > 1) {
      const search = query.toLowerCase();
      const matches = allData
        .filter(item => item.name.toLowerCase().includes(search))
        .sort((a, b) => b.count - a.count) // Show most popular first
        .slice(0, 7);
      setFiltered(matches);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [query, allData]);

  return (
    <div className="relative w-full max-w-sm" ref={containerRef}>
      <div className="relative flex items-center group">
        <Search className="absolute left-3 w-4 h-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 300+ quizzes..."
          className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-200 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 focus:bg-white/10 transition-all"
        />
      </div>

      {/* Blue-Themed Dropdown */}
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#141414] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(34,211,238,0.1)] overflow-hidden z-[150] animate-in fade-in slide-in-from-top-2">
          <div className="p-3 border-b border-white/5 bg-cyan-500/5 flex justify-between items-center">
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Recommended Quizzes</span>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {filtered.map((item, i) => (
              <Link
                key={i}
                href={item.slug}
                onClick={() => { setIsOpen(false); setQuery(''); }}
                className="group flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-all border-b border-white/5 last:border-none"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-800 border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                    <Zap className="w-3.5 h-3.5 text-gray-400 group-hover:text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200 group-hover:text-cyan-400 transition-colors">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-tight">
                      {item.type} • {item.count} Questions
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-cyan-400 transform group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}