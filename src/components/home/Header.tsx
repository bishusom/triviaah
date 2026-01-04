'use client';
import Image from 'next/image';
import Link from 'next/link';
//import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  Brain, 
  MessageSquare, 
  Hash, 
  Trophy, 
  Sword, 
  FolderOpen, 
  Building, 
  FileText,
  ChevronDown,
  Users,
  Mail,
  Shield,
  FileText as TermsIcon
} from 'lucide-react';

export default function Header() {
  //const { user, loading } = useAuth();
  //const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const gamesDropdownRef = useRef<HTMLDivElement>(null);
  const supportDropdownRef = useRef<HTMLDivElement>(null);

  const gameCategories = [
    {
      title: "Daily Games",
      items: [
        { href: "/daily-trivias", label: "Daily Trivias", icon: Calendar },
        { href: "/brainwave", label: "Brain Teasers", icon: Brain }
      ]
    },
    {
      title: "Word & Numbers",
      items: [
        { href: "/word-games", label: "Word Games", icon: MessageSquare },
        { href: "/number-puzzles", label: "Number Puzzles", icon: Hash }
      ]
    },
    {
      title: "Competitive",
      items: [
        { href: "/leaderboard", label: "Leaderboard", icon: Trophy }
      ]
    },
    {
      title: "Explore",
      items: [
        { href: "/trivias", label: "All Trivias", icon: FolderOpen },
        { href: "/trivia-bank", label: "Trivia Bank", icon: Building },
        { href: "/blog", label: "Blogs", icon: FileText }
      ]
    }
  ];

  const supportLinks = [
    { href: "/about", label: "About Triviaah", icon: Users },
    { href: "/contact", label: "Contact Us", icon: Mail },
    { href: "/privacy", label: "Privacy Policy", icon: Shield },
    { href: "/terms", label: "Terms of Service", icon: TermsIcon }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gamesDropdownRef.current && !gamesDropdownRef.current.contains(event.target as Node)) {
        setIsGamesOpen(false);
      }
      if (supportDropdownRef.current && !supportDropdownRef.current.contains(event.target as Node)) {
        setIsSupportOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gray-800 border-b border-gray-700 relative">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="text-xl text-cyan-600">☰</span>
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Image 
                  src="/imgs/bulb.svg" 
                  alt="Triviaah Logo" 
                  width={16} 
                  height={16}
                  className="text-white"
                />
              </div>
              <span className="text-white font-bold text-xl">
                Triviaah
              </span>
            </Link>

            {/* Desktop Navigation - Clean & Organized */}
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/daily-trivias" className="text-gray-300 hover:text-cyan-400 text-sm font-medium transition-colors">
                Daily Trivias
              </Link>
              <Link href="/brainwave" className="text-gray-300 hover:text-cyan-400 text-sm font-medium transition-colors">
                Brain Teasers
              </Link>
              <Link href="/trivias" className="text-gray-300 hover:text-cyan-400 text-sm font-medium transition-colors">
                All Trivias
              </Link>
               <Link href="/leaderboard" className="text-gray-300 hover:text-cyan-400 text-sm font-medium transition-colors">
                Leaderboard
              </Link>
              {/* Commented out IQ & Personality Tests link
              <Link href="/iq-and-personality-tests" className="text-gray-300 hover:text-cyan-400 text-sm font-medium transition-colors">
                IQ & Personality Tests
              </Link>
              */}
              <Link href="/word-games" className="text-gray-300 hover:text-cyan-400 text-sm font-medium transition-colors">
                Word Games
              </Link>
              <Link href="/number-puzzles" className="text-gray-300 hover:text-cyan-400 text-sm font-medium transition-colors">
                Number Puzzles
              </Link>
             
              <Link href="/blog" className="text-gray-300 hover:text-cyan-400 text-sm font-medium transition-colors">
                Blogs
              </Link>
              <Link href="/trivia-bank" className="text-gray-300 hover:text-cyan-400 text-sm font-medium transition-colors">
                Trivia Bank
              </Link>

              {/* Support Dropdown */}
              <div className="relative" ref={supportDropdownRef}>
                <button 
                  className="text-gray-300 hover:text-cyan-400 text-sm font-medium flex items-center gap-1 transition-colors"
                  onClick={() => setIsSupportOpen(!isSupportOpen)}
                >
                  Support <ChevronDown className="w-4 h-4" />
                </button>
                
                {isSupportOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 w-48 shadow-xl z-50">
                    <div className="space-y-1">
                      {supportLinks.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={index}
                            href={item.href}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 text-gray-300 text-sm transition-colors"
                            onClick={() => setIsSupportOpen(false)}
                          >
                            <IconComponent className="w-4 h-4" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
          
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          
          <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-50 md:hidden animate-in slide-in-from-left duration-300">
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">Menu</h2>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>

              <nav className="space-y-1">
                {gameCategories.flatMap(category => category.items).map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Link 
                      key={index}
                      href={item.href} 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-white text-base" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                
                <div className="border-t border-gray-700 my-2"></div>

                {/* Support Links in Mobile Menu */}
                <div className="px-3 py-2">
                  <h3 className="text-cyan-400 text-xs font-semibold uppercase tracking-wide mb-2">
                    Support
                  </h3>
                  <div className="space-y-1">
                    {supportLinks.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <Link 
                          key={index}
                          href={item.href} 
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 text-gray-300 text-sm" 
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}

    </header>
  );
}