// components/seasonal/HolidaySpecial.tsx
import Link from 'next/link';
import { useMemo } from 'react';

export function HolidaySpecial() {
  const holiday = useMemo(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    
    if (month === 12) return {
      theme: "Christmas Holiday",
      category: "christmas-specials",
      emojis: ["🎄", "🎅", "🤶", "🦌", "🎁", "🔔", "⛄", "🎶"],
      bgColor: "bg-gradient-to-r from-blue-900 to-red-900"
    };
    
    if (month === 10) return {
      theme: "Spooky Halloween Facts", 
      category: "history",
      emojis: ["🎃", "👻", "💀", "🕸️", "🕷️", "😱", "🧙", "🦇"],
      bgColor: "bg-gradient-to-r from-purple-900 to-orange-900"
    };
    
    return null;
  }, []);

  // Generate static emoji positions
  const emojiPositions = useMemo(() => {
    if (!holiday) return [];
    
    const positions = [];
    const emojiCount = 20;
    
    for (let i = 0; i < emojiCount; i++) {
      const angle = (i / emojiCount) * Math.PI * 2;
      const radius = 0.3 + (i % 5) * 0.1;
      const x = 50 + Math.cos(angle) * radius * 40;
      const y = 50 + Math.sin(angle) * radius * 30;
      
      const size = i % 3 === 0 ? "text-xl" : i % 2 === 0 ? "text-2xl" : "text-3xl";
      const rotation = (i * 36) % 45;
      const opacity = i % 4 === 0 ? "opacity-40" : i % 3 === 0 ? "opacity-60" : "opacity-30";
      
      positions.push({
        x,
        y,
        emoji: holiday.emojis[i % holiday.emojis.length],
        size,
        rotation,
        opacity
      });
    }
    return positions;
  }, [holiday]);

  if (!holiday) return null;

  return (
    <div className={`${holiday.bgColor} border border-blue-700 text-white font-bold px-6 py-4 rounded-lg text-center my-6 relative overflow-hidden`}>
      {/* Static Emoji Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {emojiPositions.map((pos, i) => (
          <div 
            key={i}
            className={`absolute ${pos.size} ${pos.opacity} select-none`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
              zIndex: 0
            }}
          >
            {pos.emoji}
          </div>
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 bg-black/40 backdrop-blur-sm rounded-lg p-4 mx-2">
        <h3 className="text-2xl mb-2 drop-shadow-lg">
          {holiday.emojis[0]} {holiday.theme} {holiday.emojis[1]}
        </h3>
        <p className="mb-4 drop-shadow-md">Special seasonal content available for limited time!</p>
        <Link 
          href={`/special-quizzes/${holiday.category}`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl relative z-20"
        >
          Play {holiday.theme} Quiz
        </Link>
      </div>
    </div>
  );
}