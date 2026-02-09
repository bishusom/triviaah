// components/common/FeedbackComponent.tsx - Updated with context-aware comments
'use client';

import { useState } from 'react';
import { SmilePlus, Smile, Annoyed, Frown, Angry, MessageCircle } from 'lucide-react';

interface FeedbackProps {
  gameType: 'automoble' | 'botanle' | 'capitale' | 'celebrile' | 'countridle' | 'citadle'| 'creaturedle' |  
            'foodle' | 'inventionle' | 'historidle' | 'landmarkdle' | 'literale' | 'plotle' | 'songle' | 
            'synonymle' | 'trordle' | 'trivia';
  category?: string;
  metadata?: Record<string, unknown>;
  onSubmitted?: () => void;
  showCommentsForAll?: boolean; // Optional: show comments for all ratings
}

const FEEDBACK_OPTIONS = [
  { 
    icon: Angry, 
    label: 'Bad', 
    value: 1, 
    color: 'text-red-400',
    hoverColor: 'text-red-300',
    bgColor: 'bg-red-500',
    showComment: true // Always show for low ratings
  },
  { 
    icon: Frown, 
    label: 'Poor', 
    value: 2, 
    color: 'text-pink-400',
    hoverColor: 'text-pink-300',
    bgColor: 'bg-pink-500',
    showComment: true // Always show for low ratings
  },
  { 
    icon: Annoyed, 
    label: 'Average', 
    value: 3, 
    color: 'text-amber-400',
    hoverColor: 'text-amber-300',
    bgColor: 'bg-amber-500',
    showComment: true // Show for average ratings
  },
  { 
    icon: Smile, 
    label: 'Good', 
    value: 4, 
    color: 'text-cyan-400',
    hoverColor: 'text-cyan-300',
    bgColor: 'bg-cyan-500',
    showComment: false // Optional for good ratings
  },
  { 
    icon: SmilePlus, 
    label: 'Excellent', 
    value: 5, 
    color: 'text-emerald-400',
    hoverColor: 'text-emerald-300',
    bgColor: 'bg-emerald-500',
    showComment: false // Optional for excellent ratings
  }
];

export default function FeedbackComponent({ 
  gameType, 
  category = '', 
  metadata = {}, 
  onSubmitted,
  showCommentsForAll = false 
}: FeedbackProps) {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showCommentField, setShowCommentField] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
    const option = FEEDBACK_OPTIONS.find(opt => opt.value === rating);
    
    // Show comment field based on context
    if (showCommentsForAll) {
      setShowCommentField(true);
    } else if (option && option.showComment) {
      setShowCommentField(true);
    } else {
      setShowCommentField(false);
      // Submit immediately for high ratings without comment prompt
      handleSubmit(rating, '');
    }
  };

  const handleSubmit = async (rating: number, commentText: string) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment: commentText.trim(),
          category,
          gameType,
          metadata,
        }),
      });
      setFeedbackSubmitted(true);
      onSubmitted?.();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = () => {
    if (selectedRating > 0) {
      handleSubmit(selectedRating, comment);
    }
  };

  if (feedbackSubmitted) {
    return (
      <div className="text-center p-4 animate-fade-in">
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

  // Get selected option for display
  const selectedOption = FEEDBACK_OPTIONS.find(opt => opt.value === selectedRating);

  return (
    <div className="text-center">
      <h4 className="text-lg font-bold text-white mb-3">Enjoyed the game?</h4>
      
      {/* Rating Selection */}
      <div className="flex justify-center gap-1 mb-4">
        {FEEDBACK_OPTIONS.map((option) => {
          const isSelected = selectedRating === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => handleRatingSelect(option.value)}
              onMouseEnter={() => setSelectedRating(option.value)}
              onMouseLeave={() => {
                if (!showCommentField) setSelectedRating(0);
              }}
              className={`p-3 transition-all duration-200 transform hover:scale-125 ${
                isSelected ? 'ring-2 ring-cyan-500 ring-opacity-50 rounded-lg' : ''
              }`}
              aria-label={`Rate ${option.value} stars - ${option.label}`}
            >
              <option.icon 
                size={28} 
                className={`
                  ${isSelected ? option.hoverColor : option.color} 
                  transition-all duration-200
                  ${isSelected ? 'scale-110' : 'scale-100'}
                `} 
              />
            </button>
          );
        })}
      </div>
      
      {/* Selected Rating Label */}
      {selectedRating > 0 && !showCommentField && (
        <p className="text-cyan-400 font-medium mb-2">
          {selectedOption?.label} - Thank you! ✨
        </p>
      )}
      
      {/* Comment Field (Context-aware) */}
      {showCommentField && selectedRating > 0 && (
        <div className="mt-4 animate-fade-in max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-cyan-400" />
            <p className="text-sm text-gray-300">
              {selectedRating <= 3 
                ? "What could we improve?" 
                : selectedRating === 4
                ? "Anything specific you liked?"
                : "What made it excellent?"}
            </p>
          </div>
          <textarea
            placeholder={selectedRating <= 3 
              ? "Optional: Tell us what we can do better..."
              : "Optional: Share what you enjoyed most..."}
            className="w-full p-3 bg-gray-800 border border-cyan-800 rounded-lg text-white text-sm 
                     focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            rows={3}
            maxLength={500}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            autoFocus
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">
              {comment.length}/500 characters
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowCommentField(false);
                  setComment('');
                  if (selectedRating >= 4) {
                    // Skip comment for high ratings
                    handleSubmit(selectedRating, '');
                  }
                }}
                className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
              >
                {selectedRating >= 4 ? 'Skip' : 'Skip comment'}
              </button>
              <button
                onClick={handleCommentSubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg text-white font-medium transition-all ${
                  isSubmitting 
                    ? 'bg-cyan-700 cursor-not-allowed' 
                    : 'bg-cyan-600 hover:bg-cyan-700'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Default prompt */}
      {!selectedRating && (
        <p className="text-gray-400 text-sm">
          Tap to rate your experience
        </p>
      )}
    </div>
  );
}