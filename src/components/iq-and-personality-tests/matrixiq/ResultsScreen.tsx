// components/screens/ResultsScreen.tsx
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { 
  Brain, Trophy, BarChart3, Clock, Download, 
  RotateCw, Lightbulb, Zap, BookOpen, 
  Printer, Home, Share2, MousePointerClick
} from 'lucide-react';
import { getIQCategory } from '@/lib/iq-and-personality-tests/matrixiq/matrixiq-logic';
import type { TestScore } from '@/lib/iq-and-personality-tests/matrixiq/matrixiq-types';

interface ResultsScreenProps {
  score: TestScore;
  onRetake: () => void;
  resultsRef: React.RefObject<HTMLDivElement | null>;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  onRetake,
  resultsRef
}) => {
  const [downloading, setDownloading] = useState(false);
  const category = getIQCategory(score.iqEstimate);

  const downloadAsImage = async () => {
    if (!resultsRef.current || !score) return;
    
    setDownloading(true);
    
    try {
      const element = resultsRef.current;
      const canvas = await html2canvas(element, { 
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `MatrixIQ_Report_${score.iqEstimate}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to download image:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const downloadAsText = () => {
    if (!score) return;
    
    const report = `Matrix IQ Test Results
==================================================
Report Generated: ${new Date().toLocaleString()}
IQ Estimate: ${score.iqEstimate}
IQ Category: ${category.label}
Percentile Rank: ${score.percentile}%
Accuracy Rate: ${score.accuracyRate}%
Raw Score: ${score.rawScore}/${score.maxScore}
Average Response Time: ${score.avgResponseTime.toFixed(1)}s

QUESTION BREAKDOWN:
- Total Questions: 30
- Questions Answered: 30
- Correct Answers: ${Math.round((score.accuracyRate / 100) * 30)}

COGNITIVE DOMAINS:
- Abstract Reasoning: ${score.iqEstimate}
- Pattern Recognition: ${score.iqEstimate}
- Visual-Spatial Processing: ${score.iqEstimate}
- Logical Thinking: ${score.iqEstimate}

PERFORMANCE ANALYSIS:
You performed better than ${score.percentile}% of test takers.
Your response time was ${score.avgResponseTime < 15 ? 'fast' : 'moderate'} compared to average.
Accuracy level: ${score.accuracyRate >= 80 ? 'High' : score.accuracyRate >= 60 ? 'Moderate' : 'Developing'}

DISCLAIMER:
This assessment is for entertainment and educational purposes only.
It is not a clinical evaluation of intelligence.
==================================================`;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MatrixIQ_Report_${score.iqEstimate}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareText = `I scored ${score.iqEstimate} IQ (${score.percentile}th percentile) on the Matrix IQ Test! 🧠`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Matrix IQ Score',
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing cancelled or failed:', error);
        fallbackShare(shareText);
      }
    } else {
      fallbackShare(shareText);
    }
  };

  const fallbackShare = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Score copied to clipboard!'))
      .catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Score copied to clipboard!');
      });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div ref={resultsRef} className="space-y-8">
          {/* Header */}
          <div className="rounded-2xl p-8 text-white bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center mb-4">
                  <Brain size={32} className="mr-3" />
                  <h2 className="text-3xl font-bold">Matrix IQ Assessment</h2>
                </div>
                <h3 className="text-5xl font-black mb-2">{score.iqEstimate} IQ</h3>
                <p className="text-2xl opacity-90 mb-4">{category.label} {category.icon}</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
                  <div className="text-3xl font-bold">{score.percentile}%</div>
                  <div className="text-sm opacity-80 uppercase tracking-wider">Percentile Rank</div>
                </div>
              </div>
              <div className="text-8xl opacity-80">
                {category.icon || '🧠'}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Lightbulb className="mr-3" size={28} />
              Performance Overview
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Your score of <span className="font-bold text-purple-600">{score.iqEstimate} IQ</span> places you in the 
              <span className={`font-bold mx-2 ${category.color}`}>{category.label}</span> category, 
              outperforming <span className="font-bold text-blue-600">{score.percentile}%</span> of test takers. 
              This indicates strong abilities in abstract reasoning, pattern recognition, and logical thinking.
            </p>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-100 to-yellow-50 flex items-center justify-center mr-4">
                  <Trophy className="text-yellow-500" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Score</h3>
                  <p className="text-gray-500 text-sm">Total points earned</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-4">{score.rawScore} / {score.maxScore}</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(score.rawScore / score.maxScore) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-100 to-green-50 flex items-center justify-center mr-4">
                  <BarChart3 className="text-green-500" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Accuracy</h3>
                  <p className="text-gray-500 text-sm">Questions correct</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-4">{score.accuracyRate}%</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${score.accuracyRate}%` }}
                />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center mr-4">
                  <Clock className="text-blue-500" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Speed</h3>
                  <p className="text-gray-500 text-sm">Average per question</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-4">{score.avgResponseTime.toFixed(1)}s</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (30 / score.avgResponseTime) * 25)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interpretation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Strengths */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <Zap className="text-green-600" size={24} />
                </div>
                Cognitive Strengths
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-700 text-lg">Pattern Recognition - Identifying visual patterns and sequences</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-700 text-lg">Abstract Reasoning - Solving problems using non-verbal concepts</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-700 text-lg">Visual-Spatial Processing - Mental manipulation of shapes and patterns</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-700 text-lg">Logical Deduction - Drawing conclusions from visual information</span>
                </li>
              </ul>
            </div>

            {/* Suggestions */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <BookOpen className="text-blue-600" size={24} />
                </div>
                Improvement Suggestions
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <span className="text-gray-700 text-lg">Practice with complex pattern puzzles (Sudoku, nonograms, chess puzzles)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <span className="text-gray-700 text-lg">Study mathematical sequences and logical reasoning problems</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <span className="text-gray-700 text-lg">Engage in strategy games that require planning and pattern recognition</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <span className="text-gray-700 text-lg">Learn about different types of logical reasoning (deductive, inductive, abductive)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Download Options */}
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200 rounded-2xl p-8 shadow-lg">
            <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              <Download className="inline mr-3" size={32} />
              Download Your IQ Report
            </h3>
            <p className="text-gray-600 text-center text-lg mb-10">
              Save your complete assessment for future reference or share with others
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <button
                onClick={downloadAsImage}
                disabled={downloading}
                className="bg-white rounded-xl p-8 hover:shadow-2xl transition-all hover:scale-[1.02] disabled:opacity-50 group border-2 border-purple-300"
              >
                <div className="text-5xl mb-6">🖼️</div>
                <h4 className="font-bold text-gray-800 text-xl mb-3">Image Report</h4>
                <p className="text-gray-600 mb-4">High-quality PNG image perfect for sharing on social media</p>
                <div className="text-sm text-purple-500 font-medium group-hover:text-purple-700">
                  {downloading ? 'Downloading...' : 'Click to download'}
                </div>
              </button>
              
              <button
                onClick={downloadAsText}
                disabled={downloading}
                className="bg-white rounded-xl p-8 hover:shadow-2xl transition-all hover:scale-[1.02] disabled:opacity-50 group border-2 border-blue-300"
              >
                <div className="text-5xl mb-6">📄</div>
                <h4 className="font-bold text-gray-800 text-xl mb-3">Text Report</h4>
                <p className="text-gray-600 mb-4">Detailed text analysis with all your performance metrics</p>
                <div className="text-sm text-blue-500 font-medium group-hover:text-blue-700">
                  {downloading ? 'Downloading...' : 'Click to download'}
                </div>
              </button>
              
              <button
                onClick={handleShare}
                disabled={downloading}
                className="bg-white rounded-xl p-8 hover:shadow-2xl transition-all hover:scale-[1.02] disabled:opacity-50 group border-2 border-green-300"
              >
                <div className="text-5xl mb-6">🔗</div>
                <h4 className="font-bold text-gray-800 text-xl mb-3">Share Results</h4>
                <p className="text-gray-600 mb-4">Share your score via clipboard or native sharing</p>
                <div className="text-sm text-green-500 font-medium group-hover:text-green-700">
                  Click to share
                </div>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <button
              onClick={onRetake}
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <RotateCw className="mr-3" size={24} />
              Retake Assessment
            </button>
            <button
              onClick={handlePrint}
              className="px-10 py-4 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-bold text-lg border border-gray-300"
            >
              <Printer className="inline mr-3" size={24} />
              Print Results
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-10 py-4 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-bold text-lg border border-gray-300"
            >
              <Home className="inline mr-3" size={24} />
              Back to Home
            </button>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-gray-500 text-base pt-12 border-t border-gray-300">
            <div className="mb-6">
              <MousePointerClick className="inline mr-2" size={20} />
              <span className="font-medium">Remember:</span> This test measures specific cognitive abilities
            </div>
            <div className="max-w-3xl mx-auto space-y-3">
              <p className="mb-2">
                <strong className="font-bold">Disclaimer:</strong> This assessment is designed for educational and entertainment purposes only.
                It is not a substitute for professional psychological assessment or clinical evaluation of intelligence.
              </p>
              <p>
                IQ scores are estimates based on pattern recognition ability and may not reflect overall intelligence,
                which encompasses multiple cognitive domains. Results should be interpreted with caution and are not
                definitive measures of intellectual capacity.
              </p>
              <p className="text-sm mt-6">
                © {new Date().getFullYear()} Matrix IQ Test • All data processed locally on your device
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};