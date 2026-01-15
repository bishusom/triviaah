import { useState, useEffect, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { event } from '@/lib/gtag';
import { 
  MdShare, MdPsychology, MdEmojiPeople, MdWork, 
  MdStar, MdDownload, MdInsights, MdFavorite, 
  MdSecurity, MdGroups, MdBalance, MdTimeline 
} from "react-icons/md";
import { FaFilePdf, FaFileImage, FaFileAlt, FaBrain, FaHeart, FaShieldAlt } from "react-icons/fa";
import { 
  EnneagramQuestion, 
  EnneagramResult, 
  EnneagramScores, 
  UserEnneagramAnswer 
} from '@/lib/iq-and-personality-tests/enneagram/enneagram-types';
import { 
  enneagramQuestions,
  calculateEnneagramScores,
  getEnneagramResult
} from '@/lib/iq-and-personality-tests/enneagram/enneagram-logic';
import html2canvas from 'html2canvas';

interface EnneagramTestComponentProps {
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

// Enneagram Type Circle Visualization
const EnneagramCircle = ({ 
  scores, 
  primaryType,
  percentiles 
}: { 
  scores: EnneagramScores;
  primaryType: string;
  percentiles: EnneagramScores;
}) => {
  const typePositions = {
    '1': { angle: 0, label: '1', name: 'Reformer' },
    '2': { angle: 40, label: '2', name: 'Helper' },
    '3': { angle: 80, label: '3', name: 'Achiever' },
    '4': { angle: 120, label: '4', name: 'Individualist' },
    '5': { angle: 160, label: '5', name: 'Investigator' },
    '6': { angle: 200, label: '6', name: 'Loyalist' },
    '7': { angle: 240, label: '7', name: 'Enthusiast' },
    '8': { angle: 280, label: '8', name: 'Challenger' },
    '9': { angle: 320, label: '9', name: 'Peacemaker' }
  };

  const typeColors = {
    '1': 'bg-blue-600',
    '2': 'bg-pink-500',
    '3': 'bg-yellow-500',
    '4': 'bg-purple-600',
    '5': 'bg-gray-600',
    '6': 'bg-green-600',
    '7': 'bg-orange-500',
    '8': 'bg-red-600',
    '9': 'bg-teal-500'
  };

  return (
    <div className="relative w-64 h-64 mx-auto mb-8">
      {/* Enneagram circle lines */}
      <div className="absolute inset-0 border-2 border-gray-300 rounded-full"></div>
      
      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-20deg)' }}>
        {/* Triangle 3-6-9 */}
        <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4" />
        <line x1="15%" y1="65%" x2="85%" y2="65%" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4" />
        <line x1="15%" y1="65%" x2="50%" y2="10%" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4" />
        <line x1="85%" y1="65%" x2="50%" y2="10%" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4" />
        
        {/* Hexagon 1-4-2-8-5-7 */}
        <polygon 
          points="50%,10% 70%,30% 85%,65% 50%,90% 15%,65% 30%,30%" 
          fill="none" 
          stroke="#9CA3AF" 
          strokeWidth="1" 
          strokeDasharray="4"
        />
      </svg>

      {/* Type points */}
      {Object.entries(typePositions).map(([type, pos]) => {
        const radius = 120;
        const x = 50 + radius * Math.cos((pos.angle * Math.PI) / 180);
        const y = 50 + radius * Math.sin((pos.angle * Math.PI) / 180);
        const isPrimary = type === primaryType;
        const scorePercent = percentiles[type as keyof EnneagramScores];
        const size = 16 + (scorePercent / 100) * 24; // Scale size based on score

        return (
          <div
            key={type}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-white font-bold transition-all duration-500 ${
              typeColors[type as keyof typeof typeColors]
            } ${isPrimary ? 'ring-4 ring-offset-2 ring-yellow-400 z-10' : 'opacity-80'}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              fontSize: `${Math.max(10, size * 0.5)}px`
            }}
            title={`Type ${type}: ${pos.name} (${scorePercent}%)`}
          >
            {type}
          </div>
        );
      })}

      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold">
          E
        </div>
      </div>
    </div>
  );
};

// Type Score Bar
const TypeScoreBar = ({ 
  type, 
  score, 
  percentile,
  isPrimary 
}: { 
  type: string;
  score: number;
  percentile: number;
  isPrimary: boolean;
}) => {
  const typeNames = {
    '1': 'Reformer',
    '2': 'Helper',
    '3': 'Achiever',
    '4': 'Individualist',
    '5': 'Investigator',
    '6': 'Loyalist',
    '7': 'Enthusiast',
    '8': 'Challenger',
    '9': 'Peacemaker'
  };

  const typeColors = {
    '1': 'bg-blue-500',
    '2': 'bg-pink-500',
    '3': 'bg-yellow-500',
    '4': 'bg-purple-500',
    '5': 'bg-gray-600',
    '6': 'bg-green-500',
    '7': 'bg-orange-500',
    '8': 'bg-red-500',
    '9': 'bg-teal-500'
  };

  return (
    <div className={`mb-3 p-3 rounded-lg ${isPrimary ? 'bg-gray-50 border-2 border-yellow-400' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 ${typeColors[type as keyof typeof typeColors]}`}>
            {type}
          </div>
          <div>
            <span className="font-medium text-gray-800">
              {typeNames[type as keyof typeof typeNames]}
            </span>
            {isPrimary && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                Primary
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-gray-800">{percentile}%</div>
          <div className="text-xs text-gray-500">Score: {score}</div>
        </div>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${typeColors[type as keyof typeof typeColors]} transition-all duration-500`}
          style={{ width: `${percentile}%` }}
        />
      </div>
    </div>
  );
};

export default function EnneagramTestComponent({ userId }: EnneagramTestComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserEnneagramAnswer[]>([]);
  const [scores, setScores] = useState<EnneagramScores>({ '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 });
  const [result, setResult] = useState<EnneagramResult | null>(null);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);
  const [testStartTime] = useState(Date.now());
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

  const questions = enneagramQuestions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Calculate intermediate scores
  useEffect(() => {
    const newScores = calculateEnneagramScores(answers);
    setScores(newScores);
    
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
    const newAnswer: UserEnneagramAnswer = {
      questionId: currentQuestion.id,
      answer: value,
      types: currentQuestion.types,
      weight: currentQuestion.weight
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
      const enneagramResult = getEnneagramResult(scores);
      setResult(enneagramResult);
      setIsTestComplete(true);
      
      event({
        action: 'enneagram_test_completed',
        category: 'personality',
        label: enneagramResult.primaryType
      });
    } catch (error) {
      console.error('Error completing enneagram test:', error);
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
      
      pdfDoc.setTitle(`Enneagram Type ${result.primaryType} Report - ${result.typeData.name}`);
      pdfDoc.setAuthor('Elite Trivias');
      
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
      link.download = `Enneagram_Type_${result.primaryType}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      event({ action: 'enneagram_download_pdf', category: 'personality', label: result.primaryType });
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
      link.download = `Enneagram_Type_${result.primaryType}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      event({ action: 'enneagram_download_image', category: 'personality', label: result.primaryType });
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
    link.download = `Enneagram_Type_${result.primaryType}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    event({ action: 'enneagram_download_text', category: 'personality', label: result.primaryType });
  };

  const generateDetailedTextReport = (): string => {
    if (!result) return '';
    
    const date = new Date().toLocaleString();
    const testDuration = Math.round((Date.now() - testStartTime) / 1000 / 60);
    const wingText = result.wing.wing ? `with a ${result.wing.wing} wing (Type ${result.wing.wing === 'left' ? result.wing.leftType : result.wing.rightType})` : 'with balanced wings';
    
    const report = `
========================================
🎭 ENNEAGRAM PERSONALITY TEST RESULT
========================================

Test Date: ${date}
Test Duration: ${testDuration} minutes
Primary Type: Type ${result.primaryType} - ${result.typeData.name}
Wing: ${wingText}
Integration Level: ${result.integrationLevel.toUpperCase()}
Triad Center: ${result.triad.center ? result.triad.center.toUpperCase() : 'Balanced'}

========================================
📊 YOUR ENNEAGRAM PROFILE
========================================

PRIMARY TYPE: Type ${result.primaryType} - ${result.typeData.name}
${result.overallDescription}

----------------------------------------
🎯 CORE MOTIVATIONS
----------------------------------------
Core Fear: ${result.typeData.coreFear}
Core Desire: ${result.typeData.coreDesire}
Basic Proposition: ${result.typeData.basicProposition}

----------------------------------------
🌟 STRENGTHS:
${result.typeData.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

----------------------------------------
⚠️  WEAKNESSES:
${result.typeData.weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}

----------------------------------------
🔄 GROWTH PATH:
${result.typeData.growthPath.map((g, i) => `${i + 1}. ${g}`).join('\n')}

----------------------------------------
🎭 WING INFLUENCE:
${result.wingDescription}

${result.wing.wing ? `
Your ${result.wing.wing} wing (Type ${result.wing.wing === 'left' ? result.wing.leftType : result.wing.rightType}) modifies your primary type characteristics.
` : 'You show balanced characteristics from both adjacent types.'}

----------------------------------------
🧠 TRIAD ANALYSIS:
You are part of the ${result.triad.center ? result.triad.center.toUpperCase() + ' center' : 'multiple centers'}.
${result.triad.center === 'head' ? 'You process through thinking and fear.' : ''}
${result.triad.center === 'heart' ? 'You process through feeling and image.' : ''}
${result.triad.center === 'body' ? 'You process through instinct and anger.' : ''}

----------------------------------------
📈 INTEGRATION LEVEL:
${result.integrationDescription}

${result.integrationLevel === 'healthy' ? 'You show healthy, integrated characteristics with good self-awareness.' : ''}
${result.integrationLevel === 'average' ? 'You show typical characteristics with room for growth in some areas.' : ''}
${result.integrationLevel === 'unhealthy' ? 'You may be experiencing stress patterns that could benefit from attention.' : ''}

========================================
📊 DETAILED TYPE SCORES
========================================

Type 1 (Reformer): ${scores['1']} points (${result.percentiles['1']}%)
Type 2 (Helper): ${scores['2']} points (${result.percentiles['2']}%)
Type 3 (Achiever): ${scores['3']} points (${result.percentiles['3']}%)
Type 4 (Individualist): ${scores['4']} points (${result.percentiles['4']}%)
Type 5 (Investigator): ${scores['5']} points (${result.percentiles['5']}%)
Type 6 (Loyalist): ${scores['6']} points (${result.percentiles['6']}%)
Type 7 (Enthusiast): ${scores['7']} points (${result.percentiles['7']}%)
Type 8 (Challenger): ${scores['8']} points (${result.percentiles['8']}%)
Type 9 (Peacemaker): ${scores['9']} points (${result.percentiles['9']}%)

Highest Score: Type ${result.primaryType} with ${scores[result.primaryType]} points

========================================
💼 IDEAL CAREERS
========================================
${result.typeData.careers.map((c, i) => `${i + 1}. ${c}`).join('\n')}

========================================
🌟 FAMOUS TYPE ${result.primaryType}s
========================================
${result.typeData.famousExamples.map((p, i) => `${i + 1}. ${p}`).join('\n')}

========================================
📝 TEST INFORMATION
========================================

• Total Questions: ${questions.length}
• Questions Answered: ${answers.length}
• Based on the Enneagram System of Personality
• Results are for self-discovery and personal growth
• The Enneagram is a dynamic system showing patterns of thinking, feeling, and behaving

========================================
🔗 FIND MORE
========================================

Take more personality tests at:
https://elitetrivias.com/brainwave

Share your results:
https://elitetrivias.com/brainwave/enneagram

========================================
Generated by elitetrivias.com
For personal use only
    `;
    
    return report;
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScores({ '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 });
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
    
    const wingText = result.wing.wing ? ` with a ${result.wing.wing} wing` : '';
    
    return `🎭 My Enneagram Type: ${result.primaryType}${wingText} - ${result.typeData.name}

${result.typeData.description.substring(0, 150)}...

Discover your Enneagram type at https://elitetrivias.com/brainwave/enneagram`;
  };

  const copyToClipboard = () => {
    const text = generateShareMessage();
    navigator.clipboard.writeText(text).then(() => {
      setShareMessage('Copied to clipboard!');
      setTimeout(() => setShareMessage(''), 2000);
    });
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      '1': '⚖️',
      '2': '💝',
      '3': '🏆',
      '4': '🎨',
      '5': '🔍',
      '6': '🛡️',
      '7': '🎉',
      '8': '⚡',
      '9': '🕊️'
    };
    return icons[type] || '🎭';
  };

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              🎭 Enneagram Personality Test
            </h2>
            <p className="text-gray-600 text-sm">
              Discover your Enneagram type, wing, and growth path
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {isCalculating ? (
          // Calculating Animation
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MdPsychology className="text-3xl text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Discovering Your Type</h3>
            <p className="text-gray-600 mb-4">Mapping your personality patterns...</p>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        ) : !isTestComplete ? (
          <>
            {/* Current Question */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-6">
              <div className="flex items-start mb-4">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <MdPsychology className="text-2xl text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {currentQuestion.text}
                  </h3>
                  <p className="text-sm text-gray-600">
                    How accurately does this statement describe you?
                  </p>
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
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

            {/* Current Type Scores */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-4 text-lg">Your Current Type Scores</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(scores).map(([type, score]) => (
                  <div key={type} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{getTypeIcon(type)}</span>
                      <h5 className="font-medium text-gray-700">
                        Type {type}
                      </h5>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {score}
                    </div>
                    <div className="text-xs text-gray-500">
                      {type === '1' && 'Reformer'}
                      {type === '2' && 'Helper'}
                      {type === '3' && 'Achiever'}
                      {type === '4' && 'Individualist'}
                      {type === '5' && 'Investigator'}
                      {type === '6' && 'Loyalist'}
                      {type === '7' && 'Enthusiast'}
                      {type === '8' && 'Challenger'}
                      {type === '9' && 'Peacemaker'}
                    </div>
                  </div>
                ))}
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
                          ? 'bg-purple-600 text-white ring-2 ring-purple-300'
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
                        ? 'Ready to discover your Enneagram type!' 
                        : 'Answer all questions to see your detailed analysis'}
                    </p>
                  </div>
                  {allQuestionsAnswered && (
                    <button
                      onClick={handleManualComplete}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Discover My Type
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
                    <h4 className="font-semibold text-green-800">Download Your Enneagram Analysis</h4>
                    <p className="text-green-600 text-sm mt-1">
                      Save your complete Enneagram profile for personal growth
                    </p>
                  </div>
                </div>
              </div>

              {/* Result Header */}
              <div ref={resultsRef} className="space-y-6">
                <div className={`rounded-xl p-6 text-white ${result.color}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">🎉 Your Enneagram Type</h3>
                      <div className="text-5xl font-black mb-2 flex items-center">
                        <span className="mr-4">Type {result.primaryType}</span>
                        <span className="text-4xl">{getTypeIcon(result.primaryType)}</span>
                      </div>
                      <h4 className="text-2xl font-semibold">{result.typeData.name}</h4>
                      <p className="text-white/90 mt-2 text-lg">
                        {result.typeData.description}
                      </p>
                      {result.wing.wing && (
                        <div className="mt-3 inline-block bg-white/20 px-4 py-1 rounded-full text-sm">
                          With a {result.wing.wing} wing (Type {result.wing.wing === 'left' ? result.wing.leftType : result.wing.rightType})
                        </div>
                      )}
                    </div>
                    <div className="text-6xl">
                      {getTypeIcon(result.primaryType)}
                    </div>
                  </div>
                  <div className="mt-4 text-sm opacity-90">
                    Generated on {new Date().toLocaleDateString()} • Test ID: EN-{Date.now().toString(36).toUpperCase()}
                  </div>
                </div>

                {/* Enneagram Circle Visualization */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4 text-center">
                    <MdTimeline className="inline mr-2" /> Your Enneagram Map
                  </h4>
                  <EnneagramCircle 
                    scores={result.scores}
                    primaryType={result.primaryType}
                    percentiles={result.percentiles}
                  />
                  <div className="text-center text-sm text-gray-600">
                    Larger circles indicate higher scores. Your primary type is highlighted in gold.
                  </div>
                </div>

                {/* Detailed Type Scores */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">
                    <MdInsights className="inline mr-2" /> Detailed Type Scores
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(result.scores).map(([type, score]) => (
                      <TypeScoreBar
                        key={type}
                        type={type}
                        score={score}
                        percentile={result.percentiles[type as keyof EnneagramScores]}
                        isPrimary={type === result.primaryType}
                      />
                    ))}
                  </div>
                </div>

                {/* Core Motivations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-lg text-blue-800 mb-3 flex items-center">
                      <FaHeart className="mr-2" /> Core Fear
                    </h4>
                    <p className="text-gray-700">{result.typeData.coreFear}</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold text-lg text-green-800 mb-3 flex items-center">
                      <MdStar className="mr-2" /> Core Desire
                    </h4>
                    <p className="text-gray-700">{result.typeData.coreDesire}</p>
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold text-lg text-green-800 mb-3 flex items-center">
                      <MdStar className="mr-2" /> Strengths
                    </h4>
                    <ul className="space-y-2">
                      {result.typeData.strengths.map((strength, index) => (
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
                      {result.typeData.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">⚠</span>
                          <span className="text-gray-700">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Growth Path */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-purple-800 mb-3 flex items-center">
                    <MdTimeline className="mr-2" /> Growth & Development
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Growth Path:</h5>
                      <ul className="space-y-1">
                        {result.typeData.growthPath.map((path, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-purple-500 mr-2">→</span>
                            <span className="text-gray-700">{path}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Integration Level:</h5>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        result.integrationLevel === 'healthy' ? 'bg-green-100 text-green-800' :
                        result.integrationLevel === 'average' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {result.integrationLevel.toUpperCase()}
                      </div>
                      <p className="text-gray-700 mt-2">{result.integrationDescription}</p>
                    </div>
                  </div>
                </div>

                {/* Wing Analysis */}
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-pink-800 mb-3 flex items-center">
                    <MdBalance className="mr-2" /> Wing Analysis
                  </h4>
                  <p className="text-gray-700 mb-4">{result.wingDescription}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`text-center p-4 rounded-lg ${result.primaryType === result.wing.leftType ? 'bg-pink-100' : 'bg-gray-100'}`}>
                      <div className="text-2xl mb-2">{getTypeIcon(result.wing.leftType)}</div>
                      <div className="font-medium text-gray-800">Type {result.wing.leftType}</div>
                      <div className="text-sm text-gray-600">Left Wing</div>
                      <div className="text-lg font-bold text-gray-800 mt-2">{result.wing.leftScore}</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-yellow-400">
                      <div className="text-2xl mb-2">{getTypeIcon(result.primaryType)}</div>
                      <div className="font-medium text-gray-800">Type {result.primaryType}</div>
                      <div className="text-sm text-gray-600">Primary Type</div>
                      <div className="text-lg font-bold text-gray-800 mt-2">{result.scores[result.primaryType]}</div>
                    </div>
                    <div className={`text-center p-4 rounded-lg ${result.primaryType === result.wing.rightType ? 'bg-pink-100' : 'bg-gray-100'}`}>
                      <div className="text-2xl mb-2">{getTypeIcon(result.wing.rightType)}</div>
                      <div className="font-medium text-gray-800">Type {result.wing.rightType}</div>
                      <div className="text-sm text-gray-600">Right Wing</div>
                      <div className="text-lg font-bold text-gray-800 mt-2">{result.wing.rightScore}</div>
                    </div>
                  </div>
                </div>

                {/* Triad Analysis */}
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-teal-800 mb-3 flex items-center">
                    <MdGroups className="mr-2" /> Triad Center
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`text-center p-4 rounded-lg ${result.triad.center === 'head' ? 'bg-teal-100 border-2 border-teal-400' : 'bg-gray-100'}`}>
                      <FaBrain className="text-3xl text-teal-600 mx-auto mb-2" />
                      <div className="font-medium text-gray-800">Head Center</div>
                      <div className="text-sm text-gray-600">Types 5, 6, 7</div>
                      <div className="text-lg font-bold text-gray-800 mt-2">{result.triad.headScore}</div>
                      <p className="text-sm text-gray-600 mt-2">Process through thinking and fear</p>
                    </div>
                    <div className={`text-center p-4 rounded-lg ${result.triad.center === 'heart' ? 'bg-teal-100 border-2 border-teal-400' : 'bg-gray-100'}`}>
                      <FaHeart className="text-3xl text-teal-600 mx-auto mb-2" />
                      <div className="font-medium text-gray-800">Heart Center</div>
                      <div className="text-sm text-gray-600">Types 2, 3, 4</div>
                      <div className="text-lg font-bold text-gray-800 mt-2">{result.triad.heartScore}</div>
                      <p className="text-sm text-gray-600 mt-2">Process through feeling and image</p>
                    </div>
                    <div className={`text-center p-4 rounded-lg ${result.triad.center === 'body' ? 'bg-teal-100 border-2 border-teal-400' : 'bg-gray-100'}`}>
                      <FaShieldAlt className="text-3xl text-teal-600 mx-auto mb-2" />
                      <div className="font-medium text-gray-800">Body Center</div>
                      <div className="text-sm text-gray-600">Types 8, 9, 1</div>
                      <div className="text-lg font-bold text-gray-800 mt-2">{result.triad.bodyScore}</div>
                      <p className="text-sm text-gray-600 mt-2">Process through instinct and anger</p>
                    </div>
                  </div>
                </div>

                {/* Careers */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-blue-800 mb-3 flex items-center">
                    <MdWork className="mr-2" /> Ideal Careers
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.typeData.careers.map((career, index) => (
                      <span 
                        key={index}
                        className="bg-white border border-blue-300 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Famous Examples */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-purple-800 mb-3 flex items-center">
                    <MdEmojiPeople className="mr-2" /> Famous Type {result.primaryType}s
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {result.typeData.famousExamples.map((person, index) => (
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
              </div>

              {/* Download Options */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                <h4 className="font-bold text-xl text-gray-800 mb-4 text-center">
                  <MdDownload className="inline mr-2" />
                  Download Your Enneagram Report
                </h4>
                <p className="text-gray-600 text-center mb-6">
                  Choose your preferred format to save your complete analysis
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={downloadAsPDF}
                    disabled={isDownloading}
                    className="flex flex-col items-center justify-center p-6 bg-white border border-purple-300 rounded-xl hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaFilePdf className="text-4xl text-red-500 mb-3" />
                    <span className="font-semibold text-gray-800">PDF Report</span>
                    <span className="text-sm text-gray-500 mt-1">Complete analysis</span>
                    {isDownloading && (
                      <div className="mt-2 animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                    )}
                  </button>
                  
                  <button
                    onClick={downloadAsImage}
                    disabled={isDownloading}
                    className="flex flex-col items-center justify-center p-6 bg-white border border-pink-300 rounded-xl hover:bg-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaFileImage className="text-4xl text-pink-500 mb-3" />
                    <span className="font-semibold text-gray-800">Image</span>
                    <span className="text-sm text-gray-500 mt-1">Visual profile</span>
                    {isDownloading && (
                      <div className="mt-2 animate-spin rounded-full h-5 w-5 border-b-2 border-pink-600"></div>
                    )}
                  </button>
                  
                  <button
                    onClick={downloadAsText}
                    disabled={isDownloading}
                    className="flex flex-col items-center justify-center p-6 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaFileAlt className="text-4xl text-gray-500 mb-3" />
                    <span className="font-semibold text-gray-800">Text File</span>
                    <span className="text-sm text-gray-500 mt-1">Detailed insights</span>
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
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
      <div className="bg-gray-100 text-gray-800 rounded-lg p-4 mt-6">
        <h3 className="font-bold mb-3">📊 How the Enneagram Test Works:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><strong>9 Personality Types:</strong> Each type has distinct patterns of thinking, feeling, and behaving</li>
          <li><strong>Wings:</strong> Your primary type is influenced by adjacent types on the circle</li>
          <li><strong>Triads:</strong> Types are grouped into Head (5,6,7), Heart (2,3,4), and Body (8,9,1) centers</li>
          <li><strong>Growth Paths:</strong> Each type has directions of integration (growth) and disintegration (stress)</li>
          <li>27 questions measuring tendencies toward each of the 9 types</li>
          <li>Scores show your strongest type and wing influences</li>
          <li>Results include your integration level (healthy, average, or unhealthy)</li>
          <li>Based on the ancient Enneagram system of personality</li>
          <li>Your privacy is protected - no data is stored on our servers</li>
        </ul>
      </div>
    </div>
  );
}