// components/SignupModal.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuestSave: (guestName: string) => Promise<void>;
  finalScore: number;
  category: string;
}

export default function SignupModal({ 
  isOpen, 
  onClose, 
  onGuestSave,
  finalScore, 
  category 
}: SignupModalProps) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveGuest = async () => {
    if (!username.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      await onGuestSave(username.trim());
    } catch (error) {
      console.error('Failed to save guest score:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Save Your Amazing Score! 🏆</h2>
        <p className="text-gray-600 mb-6">
          You scored {finalScore} points! Save your score to compete with others.
        </p>

        <div className="space-y-3">
          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-2 rounded-lg transition-colors"
          >
            Sign in with Google
          </button>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Guest name */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a guest name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={20}
            disabled={isLoading}
          />
          <button
            onClick={handleSaveGuest}
            disabled={!username.trim() || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save as Guest'}
          </button>

          {/* Skip saving */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors"
          >
            Continue without saving
          </button>
        </div>
      </div>
    </div>
  );
}