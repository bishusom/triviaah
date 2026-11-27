'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import UserStatsPopover from '../home/UserStatsPopover';
import SearchBar from '../home/SearchBar';

export default function NavBar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeMenus = () => {
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const closeOutsideMenu = (event: Event) => {
      if (event.target instanceof Element && !event.target.closest('[data-trivia-menu]')) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('pointerdown', closeOutsideMenu);
    document.addEventListener('focusin', closeOutsideMenu);
    return () => {
      document.removeEventListener('pointerdown', closeOutsideMenu);
      document.removeEventListener('focusin', closeOutsideMenu);
    };
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine background transparency/shadow
      setIsScrolled(currentScrollY > 50);

      // Hide on scroll logic
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and not at the top
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: 'Today', href: '/daily-trivias' },
    { name: 'Trivias', children: [
      { name: 'Daily trivia', href: '/daily-trivias' },
      { name: 'Quiz categories', href: '/trivias' },
      { name: 'Trivia bank', href: '/trivia-bank' },
      { name: 'Multiplayer trivia', href: '/multiplayer' },
    ] },
    { name: 'Games', children: [
      { name: 'Brainwave puzzles', href: '/brainwave' },
      { name: 'Word games', href: '/word-games' },
      { name: 'Number puzzles', href: '/number-puzzles' },
      { name: 'Retro games', href: '/retro-games' },
    ] },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Blog', href: '/blog' },
  ];

  const renderLinks = (mobile = false) => navLinks.map((link) => {
    const linkClass = mobile
      ? 'text-gray-300 text-lg font-semibold hover:text-cyan-400 transition-colors'
      : 'hover:text-cyan-400 transition-colors duration-300';

    const menuId = `${mobile ? 'mobile' : 'desktop'}-${link.name}`;

    if (link.children) {
      return (
        <details key={link.name} data-trivia-menu open={openMenu === menuId} className="relative group" onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setOpenMenu(null);
            event.currentTarget.querySelector('summary')?.focus();
          }
        }}>
          <summary onClick={(event) => {
            event.preventDefault();
            setOpenMenu((current) => current === menuId ? null : menuId);
          }} className={`${linkClass} flex cursor-pointer list-none items-center gap-1 [&::-webkit-details-marker]:hidden`}>
            {link.name}<ChevronDown size={14} aria-hidden="true" className="transition-transform group-open:rotate-180" />
          </summary>
          <div className={mobile
            ? 'mt-3 flex flex-col gap-3 border-l border-white/10 pl-4'
            : 'absolute left-0 top-full mt-3 flex min-w-52 flex-col gap-1 rounded-xl border border-white/10 bg-[#141414] p-2 shadow-2xl'}>
            {link.children.map((child) => (
              <Link key={child.href} href={child.href}
                className="rounded-md px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-cyan-400 focus-visible:text-cyan-400"
                onClick={closeMenus}>
                {child.name}
              </Link>
            ))}
          </div>
        </details>
      );
    }

    return <Link key={link.name} href={link.href!} className={linkClass}
      onClick={closeMenus}>{link.name}</Link>;
  });

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 px-4 md:px-12 py-3 flex items-center justify-between ${isVisible || isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        } ${isScrolled || isMobileMenuOpen
          ? 'bg-[#0a0a0a] shadow-2xl border-b border-white/5'
          : 'bg-black/60 backdrop-blur-md border-b border-white/5'
        }`}>

        {/* LEFT SIDE: Hamburger + Brand */}
        <div className="flex items-center gap-3 md:gap-8">
          {/* Mobile Menu Trigger (Now on the far left) */}
          <button
            onClick={() => { setOpenMenu(null); setIsMobileMenuOpen(!isMobileMenuOpen); }}
            className="lg:hidden text-white p-1 hover:bg-white/10 rounded-md transition-colors"
            aria-label="Toggle Menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" onClick={closeMenus}>
            {/* The Icon Container - Matches Footer exactly */}
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-cyan-500/20">
              <span className="text-white text-xl">🧠</span>
            </div>

            {/* The Text - Matches Footer's blue-400 and font-bold */}
            <span className="text-2xl font-black tracking-tight md:text-3xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent transition-all duration-300">
              Triviaah
            </span>
          </Link>

          {/* Desktop Links (Visible only on LG+) */}
          <div className="hidden lg:flex gap-6 text-sm font-medium text-gray-200">
            {renderLinks()}
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
        className={`fixed inset-0 z-[90] lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'
          }`}
      >
        {/* Dark Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={closeMenus}
        />

        {/* Sidebar Content */}
        <div className={`absolute top-0 left-0 h-full w-[280px] bg-[#141414] shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto pt-24 pb-6 px-6 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
          {/* Mobile User Profile Section */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-2 group" onClick={closeMenus}>
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🧠</span>
              </div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                TRIVIAAH
              </span>
            </Link>
            <div className="scale-90 origin-right">
              <UserStatsPopover />
            </div>
          </div>

          <div id="mobile-navigation" className="flex flex-col gap-6">
            {renderLinks(true)}

            <div className="h-[1px] w-full bg-white/10 my-2" />
          </div>
        </div>
      </div>
    </>
  );
}
