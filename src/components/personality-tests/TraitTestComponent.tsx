import { useState, useEffect, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { event } from '@/lib/gtag';
import { MdShare, MdPsychology, MdEmojiPeople, MdWork, MdStar, MdDownload, MdInsights } from "react-icons/md";
import { FaFilePdf, FaFileImage, FaFileAlt } from "react-icons/fa";
import { 
  TraitQuestion, 
  TraitResult, 
  TraitScore, 
  TraitPercentiles,
  UserAnswer 
} from '@/lib/personality-tests/big-five/trait-types';
import { 
  traitQuestions,
  calculateTraitScores,
  getTraitResult
} from '@/lib/personality-tests/big-five/trait-logic';
import html2canvas from 'html2canvas';

interface TraitTestComponentProps {
  userId?: string;
}

// Scale component for answer selection (same as MBTI)
const AnswerScale = ({ 
  value, 
  onChange 
}: { 
  value: number; 
  onChange: (value: number) => void;
}) => {
  const scaleLabels = [
    { label: 'Strongly Disagree', color: 'bg-red-500' },
    { label: 'Disagree', color: 'bg-red-400' },
    { label: 'Slightly Disagree', color: 'bg-orange-400' },
    { label: 'Neutral', color: 'bg-gray-300' },
    { label: 'Slightly Agree', color: 'bg-blue-400' },
    { label: 'Agree', color: 'bg-blue-500' },
    { label: 'Strongly Agree', color: 'bg-green-500' }
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        {scaleLabels.map((label, index) => (
          <button
            key={index}
            onClick={() => onChange(index - 3)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              value === index - 3 
                ? `${label.color} text-white transform scale-110 ring-2 ring-offset-2 ring-opacity-50` 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            aria-label={label.label}
          >
            <span className="text-sm font-bold">
              {index - 3 > 0 ? `+${index - 3}` : index - 3}
            </span>
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>Strongly Disagree</span>
        <span>Neutral</span>
        <span>Strongly Agree</span>
      </div>
    </div>
  );
};

// Trait Meter component
const TraitMeter = ({ 
  dimension, 
  score, 
  percentile,
  interpretation
}: { 
  dimension: 'O' | 'C' | 'E' | 'A' | 'N';
  score: number;
  percentile: number;
  interpretation: string;
}) => {
  const dimensionLabels = {
    O: { name: 'Openness', color: 'bg-purple-500', icon: '🧠' },
    C: { name: 'Conscientiousness', color: 'bg-blue-500', icon: '📊' },
    E: { name: 'Extraversion', color: 'bg-green-500', icon: '🗣️' },
    A: { name: 'Agreeableness', color: 'bg-pink-500', icon: '🤝' },
    N: { name: 'Neuroticism', color: 'bg-red-500', icon: '🎭' }
  };

  const { name, color, icon } = dimensionLabels[dimension];
  
  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{icon}</span>
          <div>
            <h4 className="font-semibold text-gray-800">{name}</h4>
            <p className="text-xs text-gray-500">Score: {score > 0 ? `+${score}` : score}/30</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-gray-800">{percentile}%</span>
          <span className="text-xs text-gray-500 block">Percentile</span>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Low</span>
          <span>Average</span>
          <span>High</span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden relative">
          <div 
            className={`h-full ${color} transition-all duration-500 ease-out`}
            style={{ width: `${percentile}%` }}
          />
          <div className="absolute left-1/3 w-0.5 h-full bg-gray-400 opacity-50"></div>
          <div className="absolute left-2/3 w-0.5 h-full bg-gray-400 opacity-50"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      
      <div className="mt-2">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
          percentile >= 70 ? 'bg-green-100 text-green-800' :
          percentile <= 30 ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {interpretation}
        </span>
      </div>
    </div>
  );
};

// Trait Comparison Chart
const TraitComparisonChart = ({ percentiles }: { percentiles: TraitPercentiles }) => {
  const dimensions = ['O', 'C', 'E', 'A', 'N'] as const;
  const labels = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'];
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
        <MdInsights className="mr-2" /> Personality Profile Comparison
      </h4>
      <div className="space-y-4">
        {dimensions.map((dim, index) => (
          <div key={dim} className="flex items-center">
            <div className="w-32 text-sm text-gray-600">{labels[index]}</div>
            <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  dim === 'O' ? 'bg-purple-500' :
                  dim === 'C' ? 'bg-blue-500' :
                  dim === 'E' ? 'bg-green-500' :
                  dim === 'A' ? 'bg-pink-500' :
                  'bg-red-500'
                } transition-all duration-500 ease-out`}
                style={{ width: `${percentiles[dim]}%` }}
              />
            </div>
            <div className="w-16 text-right">
              <span className="font-bold text-gray-800">{percentiles[dim]}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function TraitTestComponent({ userId }: TraitTestComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [score, setScore] = useState<TraitScore>({ O: 0, C: 0, E: 0, A: 0, N: 0 });
  const [result, setResult] = useState<TraitResult | null>(null);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);
  const [testStartTime] = useState(Date.now());
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

  const questions = traitQuestions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Calculate intermediate scores
  useEffect(() => {
    const newScore = calculateTraitScores(answers);
    setScore(newScore);
    
    const answeredQuestions = answers.length;
    const totalQuestions = questions.length;
    setAllQuestionsAnswered(answeredQuestions === totalQuestions);
    
    if (answeredQuestions === totalQuestions && !isTestComplete && !isCalculating) {
      setTimeout(() => {
        completeTest();
      }, 500);
    }
  }, [answers, questions, isTestComplete, isCalculating]);

  const handleAnswer = (value: number) => {
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      answer: value,
      dimension: currentQuestion.dimension
    };

    const existingIndex = answers.findIndex(a => a.questionId === currentQuestion.id);
    let newAnswers;
    
    if (existingIndex >= 0) {
      newAnswers = [...answers];
      newAnswers[existingIndex] = newAnswer;
    } else {
      newAnswers = [...answers, newAnswer];
    }

    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 300);
    }
  };

  const completeTest = async () => {
    setIsCalculating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const traitResult = getTraitResult(score);
      setResult(traitResult);
      setIsTestComplete(true);
      
      event({
        action: 'trait_test_completed',
        category: 'personality',
        label: traitResult.overallType
      });
    } catch (error) {
      console.error('Error completing trait test:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const downloadAsPDF = async () => {
    if (!resultsRef.current || !result) return;
    
    setIsDownloading(true);
    try {
      const element = resultsRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([canvas.width, canvas.height]);
      
      const pngImage = await pdfDoc.embedPng(imgData);
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
      });
      
      pdfDoc.setTitle(`Big Five Personality Report - ${result.overallType}`);
      pdfDoc.setAuthor('Triviaah');
      
      const base64PDF = await pdfDoc.saveAsBase64();
      const byteCharacters = atob(base64PDF);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BigFive_${result.overallType.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      event({ action: 'trait_download_pdf', category: 'personality', label: result.overallType });
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAsImage = async () => {
    if (!resultsRef.current || !result) return;
    
    setIsDownloading(true);
    try {
      const element = resultsRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `BigFive_${result.overallType.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      event({ action: 'trait_download_image', category: 'personality', label: result.overallType });
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAsText = () => {
    if (!result) return;
    
    const text = generateDetailedTextReport();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BigFive_${result.overallType.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    event({ action: 'trait_download_text', category: 'personality', label: result.overallType });
  };

  const generateDetailedTextReport = (): string => {
    if (!result) return '';
    
    const date = new Date().toLocaleString();
    const testDuration = Math.round((Date.now() - testStartTime) / 1000 / 60);
    
    const getInterpretationText = (percentile: number): string => {
      if (percentile >= 70) return 'High';
      if (percentile <= 30) return 'Low';
      return 'Average';
    };
    
    const report = `
========================================
🧠 BIG FIVE PERSONALITY TEST RESULT
========================================

Test Date: ${date}
Test Duration: ${testDuration} minutes
Overall Type: ${result.overallType}

========================================
📊 YOUR PERSONALITY PROFILE
========================================

OVERVIEW:
${result.overallDescription}

----------------------------------------
📈 DETAILED SCORES (OCEAN Model)
----------------------------------------

1. OPENNESS (O):
   Score: ${result.scores.O}/30
   Percentile: ${result.percentiles.O}%
   Interpretation: ${getInterpretationText(result.percentiles.O)}
   Description: ${result.descriptions.O}

2. CONSCIENTIOUSNESS (C):
   Score: ${result.scores.C}/30
   Percentile: ${result.percentiles.C}%
   Interpretation: ${getInterpretationText(result.percentiles.C)}
   Description: ${result.descriptions.C}

3. EXTRAVERSION (E):
   Score: ${result.scores.E}/30
   Percentile: ${result.percentiles.E}%
   Interpretation: ${getInterpretationText(result.percentiles.E)}
   Description: ${result.descriptions.E}

4. AGREEABLENESS (A):
   Score: ${result.scores.A}/30
   Percentile: ${result.percentiles.A}%
   Interpretation: ${getInterpretationText(result.percentiles.A)}
   Description: ${result.descriptions.A}

5. NEUROTICISM (N):
   Score: ${result.scores.N}/30
   Percentile: ${result.percentiles.N}%
   Interpretation: ${getInterpretationText(result.percentiles.N)}
   Description: ${result.descriptions.N}

========================================
🎯 TRAIT INTERPRETATIONS
========================================

OPENNESS:
• Low (0-30%): ${result.interpretations.O.low}
• Average (31-69%): ${result.interpretations.O.medium}
• High (70-100%): ${result.interpretations.O.high}

CONSCIENTIOUSNESS:
• Low (0-30%): ${result.interpretations.C.low}
• Average (31-69%): ${result.interpretations.C.medium}
• High (70-100%): ${result.interpretations.C.high}

EXTRAVERSION:
• Low (0-30%): ${result.interpretations.E.low}
• Average (31-69%): ${result.interpretations.E.medium}
• High (70-100%): ${result.interpretations.E.high}

AGREEABLENESS:
• Low (0-30%): ${result.interpretations.A.low}
• Average (31-69%): ${result.interpretations.A.medium}
• High (70-100%): ${result.interpretations.A.high}

NEUROTICISM:
• Low (0-30%): ${result.interpretations.N.low}
• Average (31-69%): ${result.interpretations.N.medium}
• High (70-100%): ${result.interpretations.N.high}

========================================
📝 TEST INFORMATION
========================================

• Total Questions: ${questions.length}
• Questions Answered: ${answers.length}
• Based on the Five Factor Model (OCEAN)
• Scientifically validated personality assessment
• Results are for self-discovery purposes only

========================================
🔗 FIND MORE
========================================

Take more personality tests at:
https://triviaah.com/brainwave

Share your results:
https://triviaah.com/brainwave/big-five

========================================
Generated by Triviaah.com
For personal use only
    `;
    
    return report;
  };

  const getInterpretationLabel = (percentile: number): string => {
    if (percentile >= 70) return 'High';
    if (percentile <= 30) return 'Low';
    return 'Average';
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore({ O: 0, C: 0, E: 0, A: 0, N: 0 });
    setResult(null);
    setIsTestComplete(false);
    setIsCalculating(false);
  };

  const skipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleManualComplete = () => {
    if (allQuestionsAnswered && !isTestComplete && !isCalculating) {
      completeTest();
    }
  };

  const generateShareMessage = () => {
    if (!result) return '';
    
    return `🧠 My Big Five Personality Type: ${result.overallType}

Openness: ${result.percentiles.O}%
Conscientiousness: ${result.percentiles.C}%
Extraversion: ${result.percentiles.E}%
Agreeableness: ${result.percentiles.A}%
Neuroticism: ${result.percentiles.N}%

Discover your personality type at https://triviaah.com/brainwave/big-five`;
  };

  const copyToClipboard = () => {
    const text = generateShareMessage();
    navigator.clipboard.writeText(text).then(() => {
      setShareMessage('Copied to clipboard!');
      setTimeout(() => setShareMessage(''), 2000);
    });
  };

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              🧠 Big Five Personality Test
            </h2>
            <p className="text-gray-600 text-sm">
              Discover your OCEAN personality traits (Scientifically Validated)
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {isCalculating ? (
          // Calculating Animation
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MdPsychology className="text-3xl text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Your Traits</h3>
            <p className="text-gray-600 mb-4">Calculating your OCEAN profile...</p>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        ) : !isTestComplete ? (
          <>
            {/* Current Question */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <MdPsychology className="text-2xl text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {currentQuestion.text}
                  </h3>
                  <p className="text-sm text-gray-600">
                    How accurately does this statement describe you?
                  </p>
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                      {currentQuestion.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <AnswerScale 
                value={answers.find(a => a.questionId === currentQuestion.id)?.answer || 0}
                onChange={handleAnswer}
              />
              
              <div className="flex justify-between mt-6">
                <button
                  onClick={skipQuestion}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Skip Question
                </button>
                <div className="text-sm text-gray-500 flex items-center">
                  {answers.find(a => a.questionId === currentQuestion.id) ? (
                    <span className="text-green-500 font-medium">✓ Answered</span>
                  ) : (
                    <span>Select your response</span>
                  )}
                </div>
              </div>
            </div>

            {/* Current Trait Scores */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-4 text-lg">Your Current Trait Scores</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🧠</span>
                    <h5 className="font-medium text-gray-700">Openness</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {score.O > 0 ? `+${score.O}` : score.O}
                  </div>
                  <div className="text-xs text-gray-500">Score: -30 to 30</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">📊</span>
                    <h5 className="font-medium text-gray-700">Conscientiousness</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {score.C > 0 ? `+${score.C}` : score.C}
                  </div>
                  <div className="text-xs text-gray-500">Score: -30 to 30</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🗣️</span>
                    <h5 className="font-medium text-gray-700">Extraversion</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {score.E > 0 ? `+${score.E}` : score.E}
                  </div>
                  <div className="text-xs text-gray-500">Score: -30 to 30</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🤝</span>
                    <h5 className="font-medium text-gray-700">Agreeableness</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {score.A > 0 ? `+${score.A}` : score.A}
                  </div>
                  <div className="text-xs text-gray-500">Score: -30 to 30</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🎭</span>
                    <h5 className="font-medium text-gray-700">Neuroticism</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {score.N > 0 ? `+${score.N}` : score.N}
                  </div>
                  <div className="text-xs text-gray-500">Score: -30 to 30</div>
                </div>
              </div>
            </div>

            {/* Question Navigation and Completion */}
            <div className="space-y-6">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Question Progress</h4>
                <div className="flex flex-wrap gap-2">
                  {questions.slice(0, 20).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToQuestion(index)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        answers.find(a => a.questionId === questions[index].id)
                          ? 'bg-green-500 text-white'
                          : currentQuestionIndex === index
                          ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  {questions.length > 20 && (
                    <span className="text-gray-500 text-sm self-center ml-2">
                      +{questions.length - 20} more
                    </span>
                  )}
                </div>
              </div>

              {/* Completion Status */}
              <div className={`p-4 rounded-lg ${allQuestionsAnswered ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold ${allQuestionsAnswered ? 'text-green-800' : 'text-yellow-800'}`}>
                      {allQuestionsAnswered ? '✅ All Questions Answered!' : `📝 ${answers.length}/${questions.length} Questions Answered`}
                    </h4>
                    <p className={`text-sm mt-1 ${allQuestionsAnswered ? 'text-green-600' : 'text-yellow-600'}`}>
                      {allQuestionsAnswered 
                        ? 'Ready to calculate your Big Five personality profile!' 
                        : 'Answer all questions to see your detailed trait analysis'}
                    </p>
                  </div>
                  {allQuestionsAnswered && (
                    <button
                      onClick={handleManualComplete}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      See My Results
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Results Display */
          result && (
            <div className="space-y-6">
              {/* Download Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <MdDownload className="text-green-600 text-xl mr-3" />
                  <div>
                    <h4 className="font-semibold text-green-800">Download Your Trait Analysis</h4>
                    <p className="text-green-600 text-sm mt-1">
                      Save your Big Five personality profile for future reference
                    </p>
                  </div>
                </div>
              </div>

              {/* Result Header */}
              <div ref={resultsRef} className="space-y-6">
                <div className={`rounded-xl p-6 text-white ${result.color}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">🎉 Your Big Five Profile</h3>
                      <div className="text-4xl font-black mb-2">{result.overallType}</div>
                      <p className="text-white/90 mt-2 text-lg">
                        {result.overallDescription}
                      </p>
                    </div>
                    <div className="text-6xl">
                      🧠
                    </div>
                  </div>
                  <div className="mt-4 text-sm opacity-90">
                    Generated on {new Date().toLocaleDateString()} • Test ID: BF-{Date.now().toString(36).toUpperCase()}
                  </div>
                </div>

                {/* Trait Scores Overview */}
                <TraitComparisonChart percentiles={result.percentiles} />

                {/* Detailed Trait Analysis */}
                <div className="space-y-6">
                  <h4 className="font-semibold text-xl text-gray-800 mb-2 flex items-center">
                    <MdPsychology className="mr-2" /> Detailed Trait Analysis
                  </h4>
                  
                  <TraitMeter 
                    dimension="O"
                    score={result.scores.O}
                    percentile={result.percentiles.O}
                    interpretation={getInterpretationLabel(result.percentiles.O)}
                  />
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-800 mb-2">Openness Description</h5>
                    <p className="text-gray-700">{result.descriptions.O}</p>
                  </div>

                  <TraitMeter 
                    dimension="C"
                    score={result.scores.C}
                    percentile={result.percentiles.C}
                    interpretation={getInterpretationLabel(result.percentiles.C)}
                  />
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-800 mb-2">Conscientiousness Description</h5>
                    <p className="text-gray-700">{result.descriptions.C}</p>
                  </div>

                  <TraitMeter 
                    dimension="E"
                    score={result.scores.E}
                    percentile={result.percentiles.E}
                    interpretation={getInterpretationLabel(result.percentiles.E)}
                  />
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-800 mb-2">Extraversion Description</h5>
                    <p className="text-gray-700">{result.descriptions.E}</p>
                  </div>

                  <TraitMeter 
                    dimension="A"
                    score={result.scores.A}
                    percentile={result.percentiles.A}
                    interpretation={getInterpretationLabel(result.percentiles.A)}
                  />
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-800 mb-2">Agreeableness Description</h5>
                    <p className="text-gray-700">{result.descriptions.A}</p>
                  </div>

                  <TraitMeter 
                    dimension="N"
                    score={result.scores.N}
                    percentile={result.percentiles.N}
                    interpretation={getInterpretationLabel(result.percentiles.N)}
                  />
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-800 mb-2">Neuroticism Description</h5>
                    <p className="text-gray-700">{result.descriptions.N}</p>
                  </div>
                </div>

                {/* Interpretation Guide */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
                    <MdInsights className="mr-2" /> Understanding Your Scores
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-center mb-2">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">L</div>
                        <span className="font-medium text-gray-800">Low (0-30%)</span>
                      </div>
                      <p className="text-sm text-gray-600">You score lower than most people on this trait</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-center mb-2">
                        <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2">A</div>
                        <span className="font-medium text-gray-800">Average (31-69%)</span>
                      </div>
                      <p className="text-sm text-gray-600">You score similarly to most people on this trait</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-center mb-2">
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">H</div>
                        <span className="font-medium text-gray-800">High (70-100%)</span>
                      </div>
                      <p className="text-sm text-gray-600">You score higher than most people on this trait</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Options */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-bold text-xl text-gray-800 mb-4 text-center">
                  <MdDownload className="inline mr-2" />
                  Download Your Personality Report
                </h4>
                <p className="text-gray-600 text-center mb-6">
                  Choose your preferred format to save your Big Five analysis
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={downloadAsPDF}
                    disabled={isDownloading}
                    className="flex flex-col items-center justify-center p-6 bg-white border border-blue-300 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaFilePdf className="text-4xl text-red-500 mb-3" />
                    <span className="font-semibold text-gray-800">PDF Report</span>
                    <span className="text-sm text-gray-500 mt-1">Detailed analysis</span>
                    {isDownloading && (
                      <div className="mt-2 animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    )}
                  </button>
                  
                  <button
                    onClick={downloadAsImage}
                    disabled={isDownloading}
                    className="flex flex-col items-center justify-center p-6 bg-white border border-green-300 rounded-xl hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaFileImage className="text-4xl text-green-500 mb-3" />
                    <span className="font-semibold text-gray-800">Image</span>
                    <span className="text-sm text-gray-500 mt-1">Visual profile</span>
                    {isDownloading && (
                      <div className="mt-2 animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                    )}
                  </button>
                  
                  <button
                    onClick={downloadAsText}
                    disabled={isDownloading}
                    className="flex flex-col items-center justify-center p-6 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaFileAlt className="text-4xl text-gray-500 mb-3" />
                    <span className="font-semibold text-gray-800">Text File</span>
                    <span className="text-sm text-gray-500 mt-1">Complete data</span>
                    {isDownloading && (
                      <div className="mt-2 animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MdShare /> Copy to Clipboard
                </button>
                <button
                  onClick={resetTest}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Take Test Again
                </button>
              </div>

              {shareMessage && (
                <div className="text-center text-green-600 font-medium">
                  {shareMessage}
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-100 rounded-lg p-4 mt-6">
        <h3 className="font-bold mb-3">📊 How the Big Five Test Works:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><strong>Openness (O):</strong> Measures imagination, creativity, and willingness to try new things</li>
          <li><strong>Conscientiousness (C):</strong> Measures organization, responsibility, and dependability</li>
          <li><strong>Extraversion (E):</strong> Measures sociability, assertiveness, and enthusiasm</li>
          <li><strong>Agreeableness (A):</strong> Measures compassion, cooperation, and trust</li>
          <li><strong>Neuroticism (N):</strong> Measures emotional stability and sensitivity to stress</li>
          <li>Based on the scientifically validated Five Factor Model (OCEAN)</li>
          <li>60 questions measuring each of the 5 major personality dimensions</li>
          <li>Results show your percentile compared to the general population</li>
          <li>Your privacy is protected - no data is stored on our servers</li>
        </ul>
      </div>
    </div>
  );
}