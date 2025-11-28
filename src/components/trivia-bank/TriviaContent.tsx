'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, Copy, Check } from 'lucide-react';

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

interface TriviaContentProps {
  trivia: TriviaData;
}

export default function TriviaContent({ trivia }: TriviaContentProps) {
  const [showAnswers, setShowAnswers] = useState(false);
  const [copiedLevel, setCopiedLevel] = useState<string | null>(null);

  const copyToClipboard = async (level: string, questions: Array<{ question: string; answer: string }>) => {
    const text = questions.map(q => 
      `Q: ${q.question}\nA: ${q.answer}`
    ).join('\n\n');
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLevel(level);
      setTimeout(() => setCopiedLevel(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const difficultyColors: { [key: string]: string } = {
    easy: 'from-green-500 to-green-600',
    medium: 'from-yellow-500 to-yellow-600',
    hard: 'from-red-500 to-red-600',
    expert: 'from-purple-500 to-purple-600'
  };

  // Define the order of difficulty levels
  const difficultyOrder = ['easy', 'medium', 'hard', 'expert'];

  // Sort the levels according to the defined order
  const sortedLevels = Object.entries(trivia.levels).sort(([levelA], [levelB]) => {
    return difficultyOrder.indexOf(levelA) - difficultyOrder.indexOf(levelB);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/trivia-bank" 
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Question Bank
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            TRIVIAAH QUESTION BANK
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {trivia.header}
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {trivia.excerpt}
          </p>

          {/* Show Answers Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 font-semibold transition-all duration-300 ${
                showAnswers
                  ? 'bg-green-600 border-green-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {showAnswers ? <EyeOff size={20} /> : <Eye size={20} />}
              {showAnswers ? 'Hide Answers' : 'Show Answers'}
            </button>
          </div>
        </header>

        {/* Difficulty Levels */}
        <div className="grid gap-8 max-w-6xl mx-auto">
          {sortedLevels.map(([level, questions]) => (
            <div key={level} className="bg-gray-800 rounded-2xl border-2 border-gray-700 overflow-hidden">
              {/* Level Header */}
              <div className={`bg-gradient-to-r ${difficultyColors[level] || 'from-gray-600 to-gray-700'} px-6 py-4`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white capitalize">
                    {level} Level
                  </h2>
                  <button
                    onClick={() => copyToClipboard(level, questions)}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {copiedLevel === level ? (
                      <Check size={18} />
                    ) : (
                      <Copy size={18} />
                    )}
                    {copiedLevel === level ? 'Copied!' : 'Copy All'}
                  </button>
                </div>
                <p className="text-white/80 mt-2">
                  {questions.length} questions
                </p>
              </div>

              {/* Questions */}
              <div className="p-6 space-y-6">
                {questions.map((item, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                    <div className="flex items-start gap-4">
                      <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-3">
                          {item.question}
                        </h3>
                        {showAnswers && (
                          <div className="bg-green-900/30 border border-green-800 rounded-lg p-4">
                            <p className="text-green-300 font-medium">
                              <span className="text-green-400">Answer:</span> {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}