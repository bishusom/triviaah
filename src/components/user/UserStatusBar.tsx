// components/UserStatusBar.tsx
'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/user/Authmodal';
import { useState, useRef, useEffect } from 'react';

export default function UserStatusBar() {
  const { user, profile, profileLoading, signOut } = useAuth(); // Get profile from context
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loading = profileLoading; // Just use profileLoading from context

  // Get display name
  const getDisplayName = () => {
    if (!profile) return 'Guest';
    return profile.display_name || profile.username || 'Quizzer';
  };

  // Get avatar letter
  const getAvatarLetter = () => {
    return getDisplayName().charAt(0).toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="animate-pulse bg-gray-700 rounded-lg w-10 h-10 rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4" ref={dropdownRef}>
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 hover:bg-gray-700 rounded-lg p-2 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {getAvatarLetter()}
              </div>
              <span className="text-white text-sm hidden sm:block">
                {getDisplayName()}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="text-white font-medium text-sm truncate">{getDisplayName()}</p>
                  {profile?.username && (
                    <p className="text-cyan-400 text-xs">@{profile.username}</p>
                  )}
                </div>
                
                <Link href="/profile">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                    My Profile
                  </button>
                </Link>
                
                <Link href="/scores">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                    My Scores
                  </button>
                </Link>
                
                <button 
                  onClick={signOut}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors border-t border-gray-700"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm hidden sm:block">
              Guest
            </span>
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              Sign In
            </button>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}