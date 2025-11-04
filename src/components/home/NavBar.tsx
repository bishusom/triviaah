// components/common/NavBar.tsx
'use client';
import { useState } from 'react';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Daily Trivias', href: '/daily-trivias' },
    { name: 'BrainWave', href: '/brainwave' },
    { name: 'All Trivias', href: '/trivias' },
    { name: 'Word Games', href: '/word-games' },
    { name: 'Number Puzzles', href: '/number-puzzles' },
    { name: 'Blog', href: '/blog' },
    { name: 'Trivia Bank', href: '/trivia-bank' },
  ];

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        {/* Desktop Menu */}
        <div className="hidden md:flex justify-center space-x-6 py-3">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="hover:text-blue-200 transition-colors duration-200 font-medium text-sm whitespace-nowrap"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex justify-between items-center py-3 text-left font-medium"
          >
            <span>Menu</span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Mobile Dropdown */}
          {isMenuOpen && (
            <div className="pb-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block py-2 px-4 hover:bg-blue-700 rounded transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;