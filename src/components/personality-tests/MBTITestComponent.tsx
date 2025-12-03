import { useState, useEffect, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { event } from '@/lib/gtag';
import { MdShare, MdPsychology, MdEmojiPeople, MdWork, MdStar, MdDownload } from "react-icons/md";
import { FaFilePdf, FaFileImage, FaFileAlt } from "react-icons/fa";
import { 
  MBTIQuestion, 
  MBTIResult, 
  MBTIScore, 
  UserAnswer
} from '@/lib/personality-tests/mbti/mbti-types';
import { 
  calculateMBTIType,
  getResultDescription,
  questions as mbtiQuestions 
} from '@/lib/personality-tests/mbti/mbti-logic';
import html2canvas from 'html2canvas';

interface MBTITestComponentProps {
  userId?: string;
}

// Scale component for answer selection
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

// Dimension meter component
const DimensionMeter = ({ 
  dimension, 
  score, 
  showLabels = true 
}: { 
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  score: number;
  showLabels?: boolean;
}) => {
  const dimensions = {
    EI: { left: 'Introvert (I)', right: 'Extravert (E)', color: 'bg-blue-500' },
    SN: { left: 'Sensing (S)', right: 'Intuitive (N)', color: 'bg-green-500' },
    TF: { left: 'Thinking (T)', right: 'Feeling (F)', color: 'bg-purple-500' },
    JP: { left: 'Judging (J)', right: 'Perceiving (P)', color: 'bg-yellow-500' }
  };

  const { left, right, color } = dimensions[dimension];
  const percentage = ((score + 30) / 60) * 100;

  return (
    <div className="mb-4">
      {showLabels && (
        <div className="flex justify-between text-sm font-medium mb-1">
          <span className="text-gray-600">{left}</span>
          <span className="text-gray-600">{right}</span>
        </div>
      )}
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>-30</span>
        <span className="font-bold">{score > 0 ? `+${score}` : score}</span>
        <span>+30</span>
      </div>
    </div>
  );
};

export default function MBTITestComponent({ userId }: MBTITestComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [score, setScore] = useState<MBTIScore>({ EI: 0, SN: 0, TF: 0, JP: 0 });
  const [result, setResult] = useState<MBTIResult | null>(null);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [testStartTime] = useState(Date.now());
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

  const questions = mbtiQuestions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Calculate intermediate scores
  useEffect(() => {
    const newScore: MBTIScore = { EI: 0, SN: 0, TF: 0, JP: 0 };
    
    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      let adjustedAnswer = answer.answer;
      if (question?.reverse) {
        adjustedAnswer = -answer.answer;
      }
      newScore[answer.dimension] += adjustedAnswer;
    });

    setScore(newScore);
    
    // Check if all questions are answered
    const answeredQuestions = answers.length;
    const totalQuestions = questions.length;
    setAllQuestionsAnswered(answeredQuestions === totalQuestions);
    
    // Auto-complete test when all questions are answered
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

    // Update or add answer
    const existingIndex = answers.findIndex(a => a.questionId === currentQuestion.id);
    let newAnswers;
    
    if (existingIndex >= 0) {
      newAnswers = [...answers];
      newAnswers[existingIndex] = newAnswer;
    } else {
      newAnswers = [...answers, newAnswer];
    }

    setAnswers(newAnswers);

    // Move to next question after delay (but not if it's the last question)
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 300);
    }
  };

  const completeTest = async () => {
    setIsCalculating(true);
    
    // Show calculating animation for at least 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Calculate final type
      const mbtiType = calculateMBTIType(score);
      console.log('Calculated MBTI Type:', mbtiType);
      
      const resultDescription = getResultDescription(mbtiType);
      console.log('Result Description:', resultDescription);
      
      if (!resultDescription) {
        console.error('No result description found for type:', mbtiType);
        return;
      }
      
      setResult(resultDescription);
      setIsTestComplete(true);
      
      // Analytics only
      event({
        action: 'mbti_test_completed',
        category: 'personality',
        label: mbtiType
      });
    } catch (error) {
      console.error('Error completing test:', error);
      // Fallback to default result if calculation fails
      const fallbackResult = getResultDescription('INFP');
      if (fallbackResult) {
        setResult(fallbackResult);
        setIsTestComplete(true);
      }
    } finally {
      setIsCalculating(false);
    }
  };

  const generateShareMessage = () => {
    if (!result) return '';
    
    return `🎭 My MBTI Personality Type: ${result.type} - ${result.name}

${result.description.substring(0, 150)}...

Discover your personality type at https://triviaah.com/brainwave/mbti`;
  };

  const copyToClipboard = () => {
    const text = generateShareMessage();
    navigator.clipboard.writeText(text).then(() => {
      setShareMessage('Copied to clipboard!');
      setTimeout(() => setShareMessage(''), 2000);
    });
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
      
      pdfDoc.setTitle(`MBTI ${result.type} Personality Report`);
      pdfDoc.setAuthor('Triviaah');
      
      const pdfBytes = await pdfDoc.save();
      
      // Extract the exact slice of buffer we need
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
      link.download = `MBTI_${result.type}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      event({ action: 'mbti_download_pdf', category: 'personality', label: result.type });
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
      link.download = `MBTI_${result.type}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      event({ action: 'mbti_download_image', category: 'personality', label: result.type });
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
    link.download = `MBTI_${result.type}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    event({ action: 'mbti_download_text', category: 'personality', label: result.type });
  };

  const generateDetailedTextReport = (): string => {
    if (!result) return '';
    
    const date = new Date().toLocaleString();
    const testDuration = Math.round((Date.now() - testStartTime) / 1000 / 60);
    
    const report = `
========================================
🎭 MBTI PERSONALITY TEST RESULT
========================================

Test Date: ${date}
Test Duration: ${testDuration} minutes
Your Type: ${result.type}
Type Name: ${result.name}
Prevalence: ${result.percentage}% of population

========================================
📊 YOUR PERSONALITY PROFILE
========================================

DESCRIPTION:
${result.description}

----------------------------------------
✅ STRENGTHS:
${result.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

----------------------------------------
⚠️  WEAKNESSES:
${result.weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}

----------------------------------------
💼 IDEAL CAREERS:
${result.careers.map((c, i) => `${i + 1}. ${c}`).join('\n')}

----------------------------------------
🌟 FAMOUS ${result.type}s:
${result.famousPeople.map((p, i) => `${i + 1}. ${p}`).join('\n')}

========================================
📈 DETAILED SCORES
========================================

Extraversion (E) vs Introversion (I): ${score.EI}
- Negative scores indicate Introversion
- Positive scores indicate Extraversion

Sensing (S) vs Intuition (N): ${score.SN}
- Negative scores indicate Sensing
- Positive scores indicate Intuition

Thinking (T) vs Feeling (F): ${score.TF}
- Negative scores indicate Thinking
- Positive scores indicate Feeling

Judging (J) vs Perceiving (P): ${score.JP}
- Negative scores indicate Judging
- Positive scores indicate Perceiving

========================================
📝 TEST INFORMATION
========================================

• Total Questions: ${questions.length}
• Questions Answered: ${answers.length}
• Based on Carl Jung's psychological types
• Myers-Briggs Type Indicator (MBTI®)
• Results are for self-discovery purposes only

========================================
🔗 FIND MORE
========================================

Take more personality tests at:
https://triviaah.com/brainwave

Share your results:
https://triviaah.com/brainwave/mbti

========================================
Generated by Triviaah.com
For personal use only
    `;
    
    return report;
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore({ EI: 0, SN: 0, TF: 0, JP: 0 });
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

  // Manual complete button handler
  const handleManualComplete = () => {
    if (allQuestionsAnswered && !isTestComplete && !isCalculating) {
      completeTest();
    }
  };

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              🎭 MBTI Personality Test
            </h2>
            <p className="text-gray-600 text-sm">
              Discover your Myers-Briggs Type Indicator
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
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Calculating Your Results</h3>
            <p className="text-gray-600 mb-4">Analyzing your responses...</p>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
                    How strongly do you agree with this statement?
                  </p>
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
                    <span>Tap a number to answer</span>
                  )}
                </div>
              </div>
            </div>

            {/* Current Dimension Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Extraversion (E) vs Introversion (I)</h4>
                <DimensionMeter dimension="EI" score={score.EI} />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Sensing (S) vs Intuition (N)</h4>
                <DimensionMeter dimension="SN" score={score.SN} />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Thinking (T) vs Feeling (F)</h4>
                <DimensionMeter dimension="TF" score={score.TF} />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Judging (J) vs Perceiving (P)</h4>
                <DimensionMeter dimension="JP" score={score.JP} />
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
                        ? 'Ready to calculate your personality type!' 
                        : 'Answer all questions to see your results'}
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
                    <h4 className="font-semibold text-green-800">Download Your Results</h4>
                    <p className="text-green-600 text-sm mt-1">
                      Save your personality profile for future reference. Your data stays on your device.
                    </p>
                  </div>
                </div>
              </div>

              {/* Result Header */}
              <div ref={resultsRef} className="space-y-6">
                <div className={`rounded-xl p-6 text-white ${result.color}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">🎉 Your Result</h3>
                      <div className="text-5xl font-black mb-2">{result.type}</div>
                      <h4 className="text-2xl font-semibold">{result.name}</h4>
                      <p className="text-white/90 mt-2">
                        {result.percentage}% of people share this type
                      </p>
                    </div>
                    <div className="text-6xl">
                      {result.type === 'INFP' ? '🎨' : 
                       result.type === 'ENFJ' ? '🌟' :
                       result.type === 'ISTJ' ? '📊' :
                       result.type === 'ESTP' ? '⚡' : '🎭'}
                    </div>
                  </div>
                  <div className="mt-4 text-sm opacity-90">
                    Generated on {new Date().toLocaleDateString()} • Test ID: MBTI-{Date.now().toString(36).toUpperCase()}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-xl text-gray-800 mb-3 flex items-center">
                    <MdPsychology className="mr-2" /> Personality Overview
                  </h4>
                  <p className="text-gray-700">{result.description}</p>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold text-lg text-green-800 mb-3 flex items-center">
                      <MdStar className="mr-2" /> Strengths
                    </h4>
                    <ul className="space-y-2">
                      {result.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h4 className="font-semibold text-lg text-red-800 mb-3 flex items-center">
                      <MdPsychology className="mr-2" /> Weaknesses
                    </h4>
                    <ul className="space-y-2">
                      {result.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">⚠</span>
                          <span className="text-gray-700">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Careers */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-blue-800 mb-3 flex items-center">
                    <MdWork className="mr-2" /> Ideal Careers
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.careers.map((career, index) => (
                      <span 
                        key={index}
                        className="bg-white border border-blue-300 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Famous People */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-purple-800 mb-3 flex items-center">
                    <MdEmojiPeople className="mr-2" /> Famous {result.type}s
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {result.famousPeople.map((person, index) => (
                      <div key={index} className="text-center">
                        <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl">
                            {index === 0 ? '🎬' : index === 1 ? '🎵' : index === 2 ? '📚' : '🏆'}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{person}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Scores */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">Your Detailed Scores</h4>
                  <div className="space-y-4">
                    <DimensionMeter dimension="EI" score={score.EI} />
                    <DimensionMeter dimension="SN" score={score.SN} />
                    <DimensionMeter dimension="TF" score={score.TF} />
                    <DimensionMeter dimension="JP" score={score.JP} />
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Scores range from -30 to 30. Positive values favor the right trait, negative values favor the left trait.</p>
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
                  Choose your preferred format to save your results
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={downloadAsPDF}
                    disabled={isDownloading}
                    className="flex flex-col items-center justify-center p-6 bg-white border border-blue-300 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaFilePdf className="text-4xl text-red-500 mb-3" />
                    <span className="font-semibold text-gray-800">PDF Report</span>
                    <span className="text-sm text-gray-500 mt-1">High-quality printable</span>
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
                    <span className="text-sm text-gray-500 mt-1">Share on social media</span>
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
                    <span className="text-sm text-gray-500 mt-1">Simple & shareable</span>
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
        <h3 className="font-bold mb-3">📊 How the MBTI Test Works:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>60 questions measuring 4 key dimensions of personality</li>
          <li>Each dimension scored from -30 to 30</li>
          <li>Your answers determine your 4-letter type (e.g., INFP, ESTJ)</li>
          <li>Based on Carl Jung&apos;s theory of psychological types</li>
          <li>Results are generated on your device and can be downloaded</li>
          <li>Your privacy is protected - no data is stored on our servers</li>
        </ul>
      </div>
    </div>
  );
}