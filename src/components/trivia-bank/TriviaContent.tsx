'use client';

import { useState } from 'react';
import { Eye, EyeOff, Copy, Download } from 'lucide-react';
import { exportToPdfDirect } from '@/lib/pdf-utils';

// Define the Question interface locally to fix the 'unknown' and 'any' errors
interface TriviaQuestion {
  question: string;
  answer: string;
}

interface TriviaData {
  slug: string;
  title: string;
  header: string;
  excerpt: string;
  tags: string[] | string;
  levels: {
    [key: string]: TriviaQuestion[]; // Explicitly define that values are arrays of TriviaQuestion
  };
}

interface TriviaContentProps {
  trivia: TriviaData;
}

<style jsx global>{`
  /* --- WEB VIEW STYLES --- */
  /* (Keep your existing dark mode transitions here if any) */

  /* --- PDF GENERATION STYLES (Triggered by .pdf-print-mode) --- */
  .pdf-print-mode {
    background: #ffffff !important;
    color: #000000 !important;
    padding: 30px !important;
    width: 800px !important; /* Fixed width for consistent scaling */
  }

  /* Force white background on all nested cards */
  .pdf-print-mode .bg-gray-800\/30,
  .pdf-print-mode .bg-gray-900\/40,
  .pdf-print-mode .bg-black\/30,
  .pdf-print-mode .bg-gray-700\/50 {
    background: #ffffff !important;
    background-color: #ffffff !important;
    border: 1px solid #000000 !important;
    box-shadow: none !important;
  }

  /* Force level header gradients to white in PDF */
  .pdf-print-mode .bg-gradient-to-r {
    background: #ffffff !important;
    border-bottom: 1px solid #000000 !important;
  }

  /* Force text to be black */
  .pdf-print-mode h2, 
  .pdf-print-mode h3, 
  .pdf-print-mode p, 
  .pdf-print-mode span,
  .pdf-print-mode .text-white,
  .pdf-print-mode .text-gray-400 {
    color: #000000 !important;
    text-shadow: none !important;
  }

  /* THE FIX: Unblur answers and force black color ONLY in PDF */
  .pdf-print-mode .pdf-answer-force-show {
    filter: none !important;
    color: #000000 !important;
    background: #f3f4f6 !important; /* Light gray background for answer box in PDF */
    border: 1px solid #000000 !important;
    opacity: 1 !important;
    display: block !important;
  }

  /* Hide elements from the PDF */
  .pdf-print-mode .pdf-exclude,
  .pdf-print-mode .lucide {
    display: none !important;
  }
`}</style>


export default function TriviaContent({ trivia }: TriviaContentProps) {
  const [showAnswers, setShowAnswers] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const levelOrder = ['easy', 'medium', 'hard'];

  const difficultyColors: { [key: string]: string } = {
    easy: 'from-green-500 to-green-600',
    medium: 'from-yellow-500 to-yellow-600',
    hard: 'from-red-500 to-red-600',
    default: 'from-purple-500 to-purple-600'
  };

  const handleDownload = () => {
    exportToPdfDirect(trivia, `${trivia.slug}-questions`);
  };

  // We cast the entries to ensure 'questions' is recognized as TriviaQuestion[]
  const sortedLevels = Object.entries(trivia.levels).sort(([a], [b]) => {
    return levelOrder.indexOf(a.toLowerCase()) - levelOrder.indexOf(b.toLowerCase());
  }) as [string, TriviaQuestion[]][];

  return (
    <div className="space-y-8">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-800/80 p-4 rounded-2xl border border-gray-700 sticky top-20 z-30 backdrop-blur-md pdf-exclude">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-all font-medium"
          >
            {showAnswers ? <EyeOff size={18} /> : <Eye size={18} />}
            {showAnswers ? 'Hide Answers' : 'Show All Answers'}
          </button>
          
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl transition-all font-medium"
          >
            {isGenerating ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Download size={18} />}
            Download PDF
          </button>
        </div>
      </div>

      <div id="trivia-content-area" className="space-y-12">
        {sortedLevels.map(([level, questions]) => (
          <div key={level} className="overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/40">
            <div className={`bg-gradient-to-r ${difficultyColors[level.toLowerCase()] || difficultyColors.default} px-8 py-6 flex justify-between items-center`}>
              <div>
                <h2 className="text-2xl font-bold text-white capitalize">{level} Level</h2>
                <p className="text-white/80 text-sm">{questions.length} Questions</p>
              </div>
            </div>

            <div className="p-6 md:p-8 grid gap-6">
              {questions.map((item: TriviaQuestion, index: number) => (
                <div key={index} className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-start gap-4">
                    <span className="text-purple-400 font-bold text-lg">{index + 1}.</span>
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-lg mb-4">{item.question}</h3>
                      
                      <div className="mt-2">
                        <p className={`
                          font-semibold p-3 rounded-xl border inline-block min-w-[200px] transition-all duration-300
                          ${showAnswers ? 'text-green-400 bg-black/30 border-white/10' : 'text-gray-600 blur-sm select-none bg-black/30 border-white/5'}
                          pdf-answer-force-show
                        `}>
                          <span className="text-purple-500 mr-2 text-xs uppercase tracking-widest pdf-exclude-label">Answer:</span>
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}