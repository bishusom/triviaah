'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FC } from 'react';

// Define the type for trivia data (based on new front matter structure)
interface TriviaData {
  slug: string;
  title: string;
  header: string;
  excerpt: string;
  tags: string[] | string;
  levels: {
    [key: string]: Array<{
      question: string;
      answer: string;
    }>;
  };
}

// Define props for the component (removed styles prop)
interface TriviaContentProps {
  trivia: TriviaData;
  showParam?: string | string[] | undefined; 
}

// Utility function to handle tags conversion
function getTagsArray(tags: string[] | string): string[] {
  if (Array.isArray(tags)) {
    return tags;
  }
  if (typeof tags === 'string') {
    return tags.split(',').map(tag => tag.trim());
  }
  return [];
}

const TriviaContent: FC<TriviaContentProps> = ({ trivia, showParam }) => {
  const [showAnswers, setShowAnswers] = useState(false);

  // Initialize from URL param if provided (for backward compatibility)
  useEffect(() => {
    if (showParam === 'true') {
      setShowAnswers(true);
    }
  }, [showParam]);

  const toggleAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <header className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {trivia.header || trivia.title}
        </h1>
        <p className="text-lg text-gray-600 mb-6">{trivia.excerpt}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {getTagsArray(trivia.tags).map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
              #{tag}
            </span>
          ))}
        </div>
      </header>
      
      {/* Main Content */}
      <article>
        {/* Controls */}
        <div className="mb-8 flex justify-between items-center bg-gray-50 p-4 rounded-lg">
          <button
            onClick={toggleAnswers}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all ${
              showAnswers 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            type="button"
            aria-pressed={showAnswers}
          >
            {/* Eye icons */}
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {showAnswers ? (
                // Closed eye icon (Hide Answers)
                <>
                  <path d="M2 2L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </>
              ) : (
                // Open eye icon (Show Answers)
                <>
                  <path d="M2 12C2 12 5.63636 5 12 5C18.3636 5 22 12 22 12C22 12 18.3636 19 12 19C5.63636 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </>
              )}
            </svg>
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </button>
          
          <div className="text-sm text-gray-500">
            {Object.values(trivia.levels).reduce((total, level) => total + level.length, 0)} total questions
          </div>
        </div>
        
        {/* Level Info */}
        <div className="mb-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
          <p className="text-gray-700 mb-3">
            This <strong>{trivia.title.toLowerCase()}</strong> trivia collection contains questions across multiple difficulty levels:
          </p>
          <ul className="space-y-2">
            {Object.keys(trivia.levels).map((level) => (
              <li key={level} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span>
                  <strong className="capitalize">{level}</strong>: {trivia.levels[level].length} questions
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Questions by Level */}
        {Object.entries(trivia.levels).map(([level, questions]) => (
          <div key={level} className="mb-10 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
              <span className="capitalize">{level}</span> Level Questions
            </h2>
            <ol className="space-y-6">
              {questions.map((q, i) => (
                <li key={i} className="pl-6 relative">
                  {/* Question number indicator */}
                  <div className="absolute left-0 top-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  
                  <div className="ml-4">
                    <div className="text-lg font-medium text-gray-800 mb-3">
                      {q.question}
                    </div>
                    {showAnswers && q.answer && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="font-bold text-green-800 mb-1">Answer:</div>
                        <div className="text-green-700">{q.answer}</div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
        
        {/* Usage Tips */}
        <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            How to Use These {trivia.title} Trivia Questions
          </h3>
          <p className="text-gray-700 mb-4">These questions are perfect for:</p>
          <ul className="space-y-2 pl-5">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Creating your own trivia night</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Classroom activities and educational purposes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Team building exercises</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Family game nights</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Testing your knowledge of {trivia.title.toLowerCase()}</span>
            </li>
          </ul>
        </div>
        
        {/* Navigation */}
        <div className="pt-6 border-t border-gray-200">
          <Link 
            href="/trivia-bank" 
            className="inline-flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            ← Back to All Trivia Categories
          </Link>
        </div>
      </article>
    </div>
  );
};

export default TriviaContent;