// components/Logo.tsx
'use client';

import { HiOutlineLightBulb } from 'react-icons/hi';

export default function Logo() {
  return (
    <div className="flex items-center justify-center space-x-3">
      {/* Light Bulb Icon */}
      <div className="text-white bg-blue-600 rounded-full p-2">
        <HiOutlineLightBulb size={28} />
      </div>
      
      {/* Text with improved typography */}
      <div className="flex flex-col items-start">
        <span className="text-white text-2xl font-bold leading-tight tracking-wide font-logo">
          triviaah.com
        </span>
      </div>
      
      {/* Add the font import in your global CSS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Montserrat:wght@700&family=Righteous&display=swap');
        .font-logo {
          font-family: 'Poppins', 'Montserrat', 'Righteous', sans-serif;
        }
      `}</style>
    </div>
  );
}