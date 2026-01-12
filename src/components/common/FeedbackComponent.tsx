// components/common/FeedbackComponent.tsx - Clean version
'use client';

import { useState } from 'react';
import { SmilePlus, Smile, Annoyed, Frown, Angry } from 'lucide-react';

interface FeedbackProps {
  gameType: 'automoble' | 'botanle' | 'capitale' | 'celebrile' | 'countridle' | 'citadle'| 'creaturedle' |  
            'foodle' | 'inventionle' | 'historidle' | 'landmarkdle' | 'literale' | 'plotle' | 'songle' | 
            'synonymle' | 'trordle' | 'trivia';
  category?: string;
  metadata?: Record<string, unknown>;
  onSubmitted?: () => void;
}

const FEEDBACK_OPTIONS = [
  { 
    icon: Angry, 
    label: 'Bad', 
    value: 1, 
    color: 'text-red-400',
    hoverColor: 'text-red-300',
    bgColor: 'bg-red-500'
  },
  { 
    icon: Frown, 
    label: 'Poor', 
    value: 2, 
    color: 'text-pink-400',
    hoverColor: 'text-pink-300',
    bgColor: 'bg-pink-500'
  },
  { 
    icon: Annoyed, 
    label: 'Average', 
    value: 3, 
    color: 'text-amber-400',
    hoverColor: 'text-amber-300',
    bgColor: 'bg-amber-500'
  },
  { 
    icon: Smile, 
    label: 'Good', 
    value: 4, 
    color: 'text-cyan-400',
    hoverColor: 'text-cyan-300',
    bgColor: 'bg-cyan-500'
  },
  { 
    icon: SmilePlus, 
    label: 'Excellent', 
    value: 5, 
    color: 'text-emerald-400',
    hoverColor: 'text-emerald-300',
    bgColor: 'bg-emerald-500'
  }
];

// Elegant minimalist version with colored icons
export default function FeedbackComponent({ 
  gameType, 
  category = '', 
  metadata = {}, 
  onSubmitted 
}: FeedbackProps) {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

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
      <div className="text-center p-4">
        <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-cyan-400 font-semibold">Thank you for your feedback! 💫</p>
        <p className="text-cyan-400">For detailed feedback, use <a href="/contact" className="underline">our contact form</a>.</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h4 className="text-lg font-bold text-white mb-3">Enjoyed the game?</h4>
      <div className="flex justify-center gap-1 mb-2">
        {FEEDBACK_OPTIONS.map((option) => {
          const isActive = hoveredRating >= option.value;
          const isHovered = hoveredRating === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => handleFeedback(option.value)}
              onMouseEnter={() => setHoveredRating(option.value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-3 transition-all duration-200 transform hover:scale-125"
              aria-label={`Rate ${option.value} stars - ${option.label}`}
            >
              <option.icon 
                size={28} 
                className={`
                  ${isActive || isHovered ? option.hoverColor : option.color} 
                  transition-all duration-200
                  ${isHovered ? 'scale-110' : 'scale-100'}
                `} 
              />
            </button>
          );
        })}
      </div>
      <p className="text-gray-400 text-sm">
        {hoveredRating ? 
          `Rate ${hoveredRating} stars - ${FEEDBACK_OPTIONS.find(opt => opt.value === hoveredRating)?.label}` : 
          'Tap to rate your experience'
        }
      </p>
    </div>
  );
}