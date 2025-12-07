// components/screens/QuestionScreen.tsx
import React, { useState, useEffect } from 'react';
import { Grid3x3, Clock, ChevronLeft, ChevronRight, SkipForward, MousePointerClick } from 'lucide-react';
import { MatrixCell } from './MatrixCell';
import { AnswerOption } from './AnswerOption';
import type { QuestionData, MatrixQuestion } from '@/lib/iq-and-personality-tests/matrixiq/matrixiq-types';

interface QuestionScreenProps {
  question: MatrixQuestion;
  questionData: QuestionData;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (optionIndex: number) => void;
  onSkip: () => void;
  onPrevious: () => void;
  onRestart: () => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  questionData,
  currentIndex,
  totalQuestions,
  onAnswer,
  onSkip,
  onPrevious,
  onRestart
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const handleDoubleClick = (index: number) => {
    setSelectedOption(index);
    // Submit immediately after double-click
    setTimeout(() => {
      onAnswer(index);
      setSelectedOption(null);
    }, 100);
  };
  
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  // Hide instructions after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Reset selection when question changes
  useEffect(() => {
    setSelectedOption(null);
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-800">Matrix IQ Test</h2>
            <div className="text-gray-600">
              {currentIndex + 1} / {totalQuestions}
            </div>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="relative max-w-3xl mx-auto p-4 md:p-6 bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Question header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-100 to-purple-50 text-purple-600 border border-purple-200">
                <Grid3x3 size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Abstract Reasoning</h3>
                <p className="text-sm text-gray-500">
                  Question {currentIndex + 1} of {totalQuestions}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-600 border border-blue-200">
                <Clock size={16} className="inline mr-2" />
                {question.points} Points
              </div>
              <div className="px-3 py-1 rounded-full font-medium bg-green-100 text-green-600 border border-green-200">
                Level {question.difficulty}
              </div>
            </div>
          </div>

          {/* Instructions */}
          {showInstructions && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg flex items-center animate-fadeIn">
              <MousePointerClick className="text-blue-500 mr-3 flex-shrink-0" size={24} />
              <div>
                <p className="font-medium text-blue-700">How to answer:</p>
                <p className="text-blue-600 text-sm">Double-click any option to select and submit it immediately</p>
              </div>
              <button 
                onClick={() => setShowInstructions(false)}
                className="ml-auto text-blue-400 hover:text-blue-600"
              >
                ✕
              </button>
            </div>
          )}

          {/* Question content */}
          <div className="mb-8">
            <p className="text-mb font-medium text-gray-800 mb-6 text-center">
              Which pattern completes the 3×3 matrix?
            </p>

            {/* Matrix grid */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
              {questionData.matrix.map((pattern, index) => (
                <div key={index} className="flex items-center justify-center">
                  <MatrixCell
                    pattern={pattern}
                    isEmpty={pattern === null}
                    size={90}
                  />
                </div>
              ))}
            </div>

            {/* Answer options */}
            <div>
              <p className="text-center text-gray-600 mb-4 font-medium">
                Double-click your answer:
              </p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                {questionData.options.map((option, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <AnswerOption
                      pattern={option}
                      index={index}
                      isSelected={selectedOption === index}
                      onDoubleClick={() => handleDoubleClick(index)}
                    />
                  </div>
                ))}
              </div>
              
              {selectedOption !== null && (
                <div className="text-center mb-4">
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-green-700 font-medium">
                      Submitting option #{selectedOption + 1}...
                    </span>
                  </div>
                </div>
              )}
              
              <p className="text-center text-sm text-gray-500 mt-4">
                Tip: Look for patterns in shape, color, size, rotation, or quantity
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={onRestart}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Restart Test
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={onPrevious}
                disabled={currentIndex === 0}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>
              
              <button
                onClick={onSkip}
                className="px-6 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300 flex items-center"
              >
                <SkipForward size={16} className="mr-2" />
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};