// components/common/FeedbackComponent.tsx - Clean version
'use client';

import { useState } from 'react';
import { FaGrinStars, FaSmile, FaMeh, FaFrown, FaAngry } from 'react-icons/fa';

interface FeedbackProps {
  gameType: 'trivia' | 'capitale' | 'celebrile'| 'plotle' | 'songle' | 
            'creaturdle' | 'landmarkdle'|
            'literale' | 'historidle' | 'synonymle' | 'trordle';
  category?: string;
  metadata?: Record<string, unknown>;
  onSubmitted?: () => void;
}

export default function FeedbackComponent({ 
  gameType, 
  category = '', 
  metadata = {}, 
  onSubmitted 
}: FeedbackProps) {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedback = async (rating: number) => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          category,
          gameType,
          metadata,
        }),
      });
      setFeedbackSubmitted(true);
      onSubmitted?.();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  if (feedbackSubmitted) {
    return (
      <div className="mb-8 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-semibold">Thank you for your feedback! 💫</p>
          <p className="text-green-800">For detailed feedback, use <a href="/contact" className="underline">our contact form</a>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 text-center">
      <h3 className="text-xl font-semibold mb-4">How was your game experience?</h3>
      <p className="text-gray-600 mb-4 text-sm">Your feedback helps us improve!</p>
      <div className="flex justify-center gap-4">
        {[
          { icon: FaGrinStars, label: 'Excellent', value: 5 },
          { icon: FaSmile, label: 'Good', value: 4 },
          { icon: FaMeh, label: 'Average', value: 3 },
          { icon: FaFrown, label: 'Poor', value: 2 },
          { icon: FaAngry, label: 'Bad', value: 1 }
        ].map(({ icon: Icon, label, value }) => (
          <button
            key={value}
            onClick={() => handleFeedback(value)}
            className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors group"
            aria-label={label}
          >
            <Icon 
              size={28} 
              className="text-gray-500 group-hover:text-blue-600 transition-colors" 
            />
            <span className="text-xs text-gray-600 mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}