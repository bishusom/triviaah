'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import SearchBar from './SearchBar';
import UserStatsPopover from './UserStatsPopover';

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGamesMenuOpen, setIsGamesMenuOpen] = useState(false);
  const [isMobileGamesOpen, setIsMobileGamesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Daily Trivias', href: '/daily-trivias' },
    { name: 'Brain Waves', href: '/brainwave' },
    { name: 'All Trivias', href: '/trivias' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Blog', href: '/blog' },
    { name: 'Trivia Bank', href: '/trivia-bank' },
  ];

  const gameLinks = [
    { name: 'Retro Games', href: '/retro-games' },
    { name: 'Word Games', href: '/word-games' },
    { name: 'Number Puzzles', href: '/number-puzzles' },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-4 md:px-12 py-3 flex items-center justify-between ${
        isScrolled || isMobileMenuOpen ? 'bg-[#141414] shadow-2xl' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}>
        
        {/* LEFT SIDE: Hamburger + Brand */}
        <div className="flex items-center gap-3 md:gap-8">
          {/* Mobile Menu Trigger (Now on the far left) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-1 hover:bg-white/10 rounded-md transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* The Icon Container - Matches Footer exactly */}
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-cyan-500/20">
              <span className="text-white text-xl">🧠</span>
            </div>

            {/* The Text - Matches Footer's blue-400 and font-bold */}
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent transition-all duration-300">
              Triviaah
            </span>
          </Link>

          {/* Desktop Links (Visible only on LG+) */}
          <div className="hidden lg:flex gap-6 text-sm font-medium text-gray-200">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="hover:text-cyan-400 transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}

            <div
              className="relative pt-3 -mt-3"
              onMouseEnter={() => setIsGamesMenuOpen(true)}
              onMouseLeave={() => setIsGamesMenuOpen(false)}
            >
              <button
                className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-300"
                aria-haspopup="menu"
                aria-expanded={isGamesMenuOpen}
              >
                Games
                <ChevronDown className={`h-4 w-4 transition-transform ${isGamesMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isGamesMenuOpen ? (
                <div className="absolute left-0 top-full w-52 rounded-2xl border border-[#28486f] bg-[#141414] p-2 shadow-2xl">
                  {gameLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-gray-200 transition-colors hover:bg-[#1b2b3f] hover:text-cyan-400"
                    >
                      {link.name}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Functional Icons */}
        <div className="flex items-center gap-4 text-white">
          <div className="hidden md:block">
            <SearchBar /> 
          </div>
          <UserStatsPopover />
        </div>
      </nav>

      {/* MOBILE DRAWER: Slides in from the left */}
      <div 
        className={`fixed inset-0 z-[90] lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Dark Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Sidebar Content */}
        <div className={`absolute top-0 left-0 h-full w-[280px] bg-[#141414] shadow-2xl transform transition-transform duration-300 ease-in-out pt-20 px-6 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 text-lg font-semibold hover:text-cyan-400 transition-colors flex items-center justify-between" // Already using cyan-400
              >
                {link.name}
                <span className="text-gray-600 text-xs group-hover:text-cyan-400">›</span>
              </Link>
            ))}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIsMobileGamesOpen((prev) => !prev)}
                className="flex items-center justify-between text-gray-300 text-lg font-semibold hover:text-cyan-400 transition-colors"
                aria-expanded={isMobileGamesOpen}
              >
                <span>Games</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${isMobileGamesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileGamesOpen ? (
                <div className="ml-3 flex flex-col gap-3 border-l border-white/10 pl-4">
                  {gameLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => {
                        setIsMobileGamesOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-gray-400 text-base font-medium hover:text-cyan-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="h-[1px] w-full bg-white/10 my-2" />
            <Link 
              href="/trivias" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-gray-400 text-sm hover:text-white"
            >
              All Categories
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
