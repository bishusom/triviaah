// components/screens/IntroScreen.tsx
import React from 'react';
import { Brain, Clock, Target, AlertCircle, Grid3x3, ChevronRight } from 'lucide-react';

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
        <div className="space-y-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Clock size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Time Required</h3>
              <p className="text-gray-600">Approximately 15-20 minutes • 30 questions</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Target size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">What You&apos;ll Discover</h3>
              <p className="text-gray-600">Your fluid intelligence score, percentile rank, and cognitive strengths</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Important Notes</h3>
              <p className="text-gray-600">
                This is for educational purposes only. Results are not clinical diagnoses.
                All processing happens locally for privacy.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onStart}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-lg font-medium inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Begin Assessment
            <ChevronRight className="ml-2" size={20} />
          </button>
          <p className="text-gray-500 text-sm mt-4">
            Your responses are processed locally and never leave your device
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 mt-8">
          <h3 className="font-bold text-blue-800 mb-3 flex items-center">
            <Grid3x3 className="mr-2" size={20} />
            Test Structure
          </h3>
          <ul className="space-y-2 text-gray-700 list-disc pl-5">
            <li>3×3 matrix grid with one missing cell</li>
            <li>Identify patterns across rows and columns</li>
            <li>Choose from 6 options to complete the pattern</li>
            <li>Questions progressively increase in difficulty</li>
            <li>Patterns include shape, color, size, rotation, and quantity</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);