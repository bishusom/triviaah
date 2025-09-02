// components/SignupModal.tsx
'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  finalScore: number;
  category: string;
}

export default function SignupModal({ isOpen, onClose, finalScore, category }: SignupModalProps) {
  const [username, setUsername] = useState('');
  const { user, login } = useUser();

  const handleSaveScore = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) return;

    // Update the user context with the new name
    if (user) {
      login({
        ...user,
        name: username.trim(),
        isGuest: false // Mark as registered (even though it's just a local name)
      });
    }
    
    // Here you would typically send to your backend API
    try {
      const response = await fetch('/api/save-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: username.trim(),
          score: finalScore,
          category: category,
          userId: user?.id
        })
      });
      
      if (response.ok) {
        console.log('Score saved successfully');
      }
    } catch (error) {
      console.error('Failed to save score:', error);
    }
    
    onClose();
  };

  const handleContinueAsGuest = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Save Your Amazing Score! 🏆</h2>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-center text-lg font-semibold">
            You scored <span className="text-blue-600">{finalScore} points</span>!
          </p>
          <p className="text-center text-sm text-gray-600 mt-1">
            in {category.replace(/-/g, ' ')} trivia
          </p>
        </div>

        <form onSubmit={handleSaveScore} className="mb-4">
          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700 mb-1 block">
              Choose a cool username:
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="TriviaMaster2000"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={20}
            />
          </label>
          
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!username.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex-1 transition-colors"
            >
              Save Score
            </button>
            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg flex-1 transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">Save your score to:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-green-50 p-2 rounded">✓ Track progress</div>
            <div className="bg-yellow-50 p-2 rounded">✓ Compete on leaderboards</div>
            <div className="bg-purple-50 p-2 rounded">✓ Build your streak</div>
            <div className="bg-blue-50 p-2 rounded">✓ Unlock achievements</div>
          </div>
        </div>
      </div>
    </div>
  );
}