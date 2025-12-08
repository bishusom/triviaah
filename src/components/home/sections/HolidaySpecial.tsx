// components/seasonal/HolidaySpecial.tsx
import { i } from 'mathjs';
import Link from 'next/link';

export function HolidaySpecial() {
  const getCurrentHoliday = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    
    if (month === 12) return {
      theme: "Christmas Holiday",
      category: "christmas-specials",
      imgUrl: "/imgs/christmas.webp"
    };
    
    if (month === 10) return {
      theme: "Spooky Halloween Facts", 
      category: "history",
      imgUrl: "/imgs/halloween.webp"
    };
    
    return null;
  };

  const holiday = getCurrentHoliday();
  if (!holiday) return null;

  return (
    <div className="bg0 border border-blue-700 text-white font-bold px-6 py-4 rounded-lg text-center my-6"
        style={{ backgroundImage: `url(${holiday.imgUrl})` }}>
      <h3>🎉 {holiday.theme}</h3>
      <p>Special seasonal content available for limited time!</p>
      <Link href={`/special-quizzes/${holiday.category}`}
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Play {holiday.theme} Quiz
      </Link>
    </div>
  );
}