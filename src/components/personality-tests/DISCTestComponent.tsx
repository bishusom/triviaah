import { useState, useEffect, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { event } from '@/lib/gtag';
import { 
  MdShare, MdPsychology, MdEmojiPeople, MdWork, 
  MdStar, MdDownload, MdInsights, MdTrendingUp,
  MdGroups, MdChat, MdBalance, MdTimeline, MdCompareArrows
} from "react-icons/md";
import { FaFilePdf, FaFileImage, FaFileAlt, FaChartBar, FaUsers, FaBullseye } from "react-icons/fa";
import { 
  DISCQuestion, 
  DISCResult, 
  DISCScores, 
  UserDISCAnswer,
  DISCBehavior
} from '@/lib/personality-tests/disc/disc-types';
import { 
  discQuestions,
  calculateNaturalAndAdaptedScores,
  getDISCResult
} from '@/lib/personality-tests/disc/disc-logic';
import html2canvas from 'html2canvas';

interface DISCTestComponentProps {
  userId?: string;
}

// Scale component for answer selection
const AnswerScale = ({ 
  value, 
  onChange,
  label = "How accurately does this describe you?"
}: { 
  value: number; 
  onChange: (value: number) => void;
  label?: string;
}) => {
  const scaleLabels = [
    { label: 'Very Inaccurate', color: 'bg-red-500' },
    { label: 'Inaccurate', color: 'bg-red-400' },
    { label: 'Somewhat Inaccurate', color: 'bg-orange-400' },
    { label: 'Neutral', color: 'bg-gray-300' },
    { label: 'Somewhat Accurate', color: 'bg-blue-400' },
    { label: 'Accurate', color: 'bg-blue-500' },
    { label: 'Very Accurate', color: 'bg-green-500' }
  ];

  return (
    <div className="w-full">
      <div className="text-sm text-gray-600 mb-3">{label}</div>
      <div className="flex justify-between mb-2">
        {scaleLabels.map((scaleLabel, index) => (
          <button
            key={index}
            onClick={() => onChange(index - 3)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              value === index - 3 
                ? `${scaleLabel.color} text-white transform scale-110 ring-2 ring-offset-2 ring-opacity-50` 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            aria-label={scaleLabel.label}
          >
            <span className="text-sm font-bold">
              {index - 3 > 0 ? `+${index - 3}` : index - 3}
            </span>
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>Very Inaccurate</span>
        <span>Neutral</span>
        <span>Very Accurate</span>
      </div>
    </div>
  );
};

// DISC Graph Component
const DISCGraph = ({ 
  scores,
  title,
  showLabels = true
}: { 
  scores: DISCScores;
  title: string;
  showLabels?: boolean;
}) => {
  const dimensions = ['D', 'I', 'S', 'C'] as const;
  const colors = {
    D: 'bg-red-500',
    I: 'bg-yellow-500',
    S: 'bg-green-500',
    C: 'bg-blue-500'
  };
  const labels = {
    D: 'Dominance',
    I: 'Influence',
    S: 'Steadiness',
    C: 'Conscientiousness'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h4 className="font-semibold text-lg text-gray-800 mb-4">{title}</h4>
      <div className="space-y-4">
        {dimensions.map((dim) => (
          <div key={dim} className="space-y-1">
            {showLabels && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">{labels[dim]}</span>
                <span className="text-sm font-bold text-gray-800">{scores[dim]}%</span>
              </div>
            )}
            <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${colors[dim]} transition-all duration-500`}
                style={{ width: `${scores[dim]}%` }}
              />
            </div>
            {!showLabels && (
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span className="font-medium">{scores[dim]}%</span>
                <span>100%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Comparison Graph
const ComparisonGraph = ({ behavior }: { behavior: DISCBehavior }) => {
  const dimensions = ['D', 'I', 'S', 'C'] as const;
  const colors = {
    D: 'text-red-500',
    I: 'text-yellow-500',
    S: 'text-green-500',
    C: 'text-blue-500'
  };
  const labels = {
    D: 'Dominance',
    I: 'Influence',
    S: 'Steadiness',
    C: 'Conscientiousness'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
        <MdCompareArrows className="mr-2" /> Natural vs. Adapted Style Comparison
      </h4>
      <div className="space-y-6">
        {dimensions.map((dim) => (
          <div key={dim} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${colors[dim].replace('text', 'bg')} mr-2`}></div>
                <span className="font-medium text-gray-700">{labels[dim]}</span>
              </div>
              <div className="text-sm text-gray-600">
                Gap: <span className={`font-bold ${behavior.gap[dim] > 0 ? 'text-green-600' : behavior.gap[dim] < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {behavior.gap[dim] > 0 ? '+' : ''}{behavior.gap[dim]}%
                </span>
              </div>
            </div>
            <div className="relative h-10 bg-gray-100 rounded-full overflow-hidden">
              {/* Natural style */}
              <div 
                className={`absolute h-full ${colors[dim].replace('text', 'bg')} opacity-80 rounded-l-full`}
                style={{ width: `${behavior.natural[dim]}%` }}
              >
                <div className="absolute inset-0 flex items-center justify-end pr-2">
                  <span className="text-xs font-bold text-white">Natural: {behavior.natural[dim]}%</span>
                </div>
              </div>
              
              {/* Adapted style */}
              <div 
                className={`absolute h-full ${colors[dim].replace('text', 'bg')} opacity-60 rounded-r-full`}
                style={{ 
                  width: `${Math.max(0, behavior.adapted[dim] - behavior.natural[dim])}%`,
                  left: `${behavior.natural[dim]}%`
                }}
              >
                {behavior.adapted[dim] > behavior.natural[dim] && (
                  <div className="absolute inset-0 flex items-center pl-2">
                    <span className="text-xs font-bold text-white">Adapted: {behavior.adapted[dim]}%</span>
                  </div>
                )}
              </div>
              
              {/* If adapted is less than natural */}
              {behavior.adapted[dim] < behavior.natural[dim] && (
                <div className="absolute h-full bg-gray-300 opacity-70 rounded-r-full"
                  style={{ 
                    width: `${behavior.natural[dim] - behavior.adapted[dim]}%`,
                    left: `${behavior.adapted[dim]}%`
                  }}
                >
                  <div className="absolute inset-0 flex items-center pl-2">
                    <span className="text-xs font-bold text-gray-700">Adapted: {behavior.adapted[dim]}%</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center text-sm text-gray-600">
          <div className="flex items-center mr-4">
            <div className="w-4 h-4 bg-red-500 opacity-80 rounded mr-2"></div>
            <span>Natural Style</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 opacity-60 rounded mr-2"></div>
            <span>Adapted/Work Style</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Positive gap indicates you adapt this trait more at work. Negative gap indicates you express this trait more naturally.
        </p>
      </div>
    </div>
  );
};

// DISC Wheel Component
const DISCWheel = ({ scores, primary }: { scores: DISCScores; primary: string }) => {
  const dimensions = [
    { type: 'D', label: 'Dominance', color: 'bg-red-500', position: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' },
    { type: 'I', label: 'Influence', color: 'bg-yellow-500', position: 'top-1/2 right-0 -translate-y-1/2 translate-x-1/2' },
    { type: 'S', label: 'Steadiness', color: 'bg-green-500', position: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' },
    { type: 'C', label: 'Conscientiousness', color: 'bg-blue-500', position: 'top-1/2 left-0 -translate-y-1/2 -translate-x-1/2' }
  ];

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Wheel background */}
      <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
      
      {/* Quadrant lines */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-200 transform -translate-x-1/2"></div>
        <div className="absolute left-0 top-1/2 h-0.5 w-full bg-gray-200 transform -translate-y-1/2"></div>
      </div>
      
      {/* Score indicators */}
      {dimensions.map((dim) => {
        const score = scores[dim.type as keyof DISCScores];
        const isPrimary = dim.type === primary;
        const radius = 100; // Max radius
        const scaledRadius = (score / 100) * radius;
        
        // Calculate position based on quadrant
        let x = 0, y = 0;
        switch(dim.type) {
          case 'D': // Top
            y = -scaledRadius;
            break;
          case 'I': // Right
            x = scaledRadius;
            break;
          case 'S': // Bottom
            y = scaledRadius;
            break;
          case 'C': // Left
            x = -scaledRadius;
            break;
        }
        
        return (
          <div key={dim.type}>
            {/* Score line */}
            <div 
              className={`absolute w-0.5 ${dim.color} transform origin-center`}
              style={{
                height: `${scaledRadius}px`,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${
                  dim.type === 'D' ? '0deg' :
                  dim.type === 'I' ? '90deg' :
                  dim.type === 'S' ? '180deg' : '270deg'
                })`,
                transformOrigin: 'bottom center'
              }}
            />
            
            {/* Score point */}
            <div
              className={`absolute w-8 h-8 rounded-full ${dim.color} flex items-center justify-center text-white font-bold transform -translate-x-1/2 -translate-y-1/2 ${
                isPrimary ? 'ring-4 ring-offset-2 ring-yellow-400 z-10' : ''
              }`}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`
              }}
              title={`${dim.label}: ${score}%`}
            >
              {dim.type}
            </div>
          </div>
        );
      })}
      
      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold">
          DISC
        </div>
      </div>
    </div>
  );
};

export default function DISCTestComponent({ userId }: DISCTestComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserDISCAnswer[]>([]);
  const [behavior, setBehavior] = useState<DISCBehavior>({
    natural: { D: 0, I: 0, S: 0, C: 0 },
    adapted: { D: 0, I: 0, S: 0, C: 0 },
    gap: { D: 0, I: 0, S: 0, C: 0 }
  });
  const [result, setResult] = useState<DISCResult | null>(null);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);
  const [testStartTime] = useState(Date.now());
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [isWorkStylePhase, setIsWorkStylePhase] = useState(false);

  const questions = discQuestions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const naturalQuestions = questions.filter(q => !q.id.startsWith('W') && !q.id.startsWith('B')).length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Calculate scores as answers are given
  useEffect(() => {
    if (answers.length > 0) {
      const newBehavior = calculateNaturalAndAdaptedScores(answers);
      setBehavior(newBehavior);
    }
    
    const answeredQuestions = answers.length;
    setAllQuestionsAnswered(answeredQuestions === totalQuestions);
    
    // Check if natural style questions are complete
    const naturalAnswered = answers.filter(a => !a.isWorkStyle).length;
    if (naturalAnswered === naturalQuestions && !isWorkStylePhase && !isTestComplete) {
      setTimeout(() => {
        setIsWorkStylePhase(true);
      }, 500);
    }
    
    if (answeredQuestions === totalQuestions && !isTestComplete && !isCalculating) {
      setTimeout(() => {
        completeTest();
      }, 500);
    }
  }, [answers, totalQuestions, naturalQuestions, isWorkStylePhase, isTestComplete, isCalculating]);

  const handleAnswer = (value: number) => {
    const isWorkStyle = currentQuestion.id.startsWith('W') || 
                       (isWorkStylePhase && (currentQuestion.id.startsWith('B') || currentQuestionIndex >= naturalQuestions));
    
    const newAnswer: UserDISCAnswer = {
      questionId: currentQuestion.id,
      answer: value,
      dimension: currentQuestion.dimension,
      isWorkStyle
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
      const discResult = getDISCResult(behavior);
      setResult(discResult);
      setIsTestComplete(true);
      
      event({
        action: 'disc_test_completed',
        category: 'personality',
        label: discResult.profile.primary
      });
    } catch (error) {
      console.error('Error completing DISC test:', error);
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
      
      pdfDoc.setTitle(`DISC Profile Report - ${result.profileName}`);
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
      link.download = `DISC_${result.profile.primary}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      event({ action: 'disc_download_pdf', category: 'personality', label: result.profile.primary });
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
      link.download = `DISC_${result.profile.primary}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      event({ action: 'disc_download_image', category: 'personality', label: result.profile.primary });
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
    link.download = `DISC_${result.profile.primary}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    event({ action: 'disc_download_text', category: 'personality', label: result.profile.primary });
  };

  const generateDetailedTextReport = (): string => {
    if (!result) return '';
    
    const date = new Date().toLocaleString();
    const testDuration = Math.round((Date.now() - testStartTime) / 1000 / 60);
    const { primary, secondary, tertiary, least } = result.profile;
    
    const report = `
========================================
📊 DISC PERSONALITY ASSESSMENT REPORT
========================================

Test Date: ${date}
Test Duration: ${testDuration} minutes
Profile: ${result.profileName}
Primary Style: ${primary} - ${result.descriptions[primary].split('.')[0]}
${secondary ? `Secondary Style: ${secondary}` : ''}
${tertiary ? `Tertiary Style: ${tertiary}` : ''}
Least Preferred: ${least}

========================================
🎯 YOUR BEHAVIORAL STYLE
========================================

OVERVIEW:
${result.overallDescription}

----------------------------------------
📈 NATURAL STYLE SCORES:
Dominance (D): ${result.scores.D}%
Influence (I): ${result.scores.I}%
Steadiness (S): ${result.scores.S}%
Conscientiousness (C): ${result.scores.C}%

----------------------------------------
🔄 NATURAL VS. ADAPTED STYLE:
Natural Dominance: ${behavior.natural.D}% | Adapted: ${behavior.adapted.D}% | Gap: ${behavior.gap.D > 0 ? '+' : ''}${behavior.gap.D}%
Natural Influence: ${behavior.natural.I}% | Adapted: ${behavior.adapted.I}% | Gap: ${behavior.gap.I > 0 ? '+' : ''}${behavior.gap.I}%
Natural Steadiness: ${behavior.natural.S}% | Adapted: ${behavior.adapted.S}% | Gap: ${behavior.gap.S > 0 ? '+' : ''}${behavior.gap.S}%
Natural Conscientiousness: ${behavior.natural.C}% | Adapted: ${behavior.adapted.C}% | Gap: ${behavior.gap.C > 0 ? '+' : ''}${behavior.gap.C}%

Positive gap = You adapt this more at work
Negative gap = You express this more naturally

========================================
🌟 STRENGTHS & WEAKNESSES
========================================

DOMINANCE (D):
Strengths: ${result.strengths.D.join(', ')}
Weaknesses: ${result.weaknesses.D.join(', ')}

INFLUENCE (I):
Strengths: ${result.strengths.I.join(', ')}
Weaknesses: ${result.weaknesses.I.join(', ')}

STEADINESS (S):
Strengths: ${result.strengths.S.join(', ')}
Weaknesses: ${result.weaknesses.S.join(', ')}

CONSCIENTIOUSNESS (C):
Strengths: ${result.strengths.C.join(', ')}
Weaknesses: ${result.weaknesses.C.join(', ')}

========================================
🗣️ COMMUNICATION TIPS
========================================

How to communicate with a ${primary} style:
${result.communicationTips[primary].map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

========================================
💼 IDEAL WORK ENVIRONMENT
========================================

${result.idealEnvironment[primary].map((env, i) => `${i + 1}. ${env}`).join('\n')}

========================================
⚠️ STRESS BEHAVIORS
========================================

Under stress, you may:
${result.stressBehaviors[primary].map((behavior, i) => `${i + 1}. ${behavior}`).join('\n')}

========================================
🎭 DETAILED TYPE DESCRIPTIONS
========================================

DOMINANCE (D):
${result.descriptions.D}

INFLUENCE (I):
${result.descriptions.I}

STEADINESS (S):
${result.descriptions.S}

CONSCIENTIOUSNESS (C):
${result.descriptions.C}

========================================
📝 TEST INFORMATION
========================================

• Total Questions: ${questions.length}
• Questions Answered: ${answers.length}
• Based on the DISC Behavioral Assessment
• Used worldwide for personal and professional development
• Results help understand communication and work style preferences

========================================
🔗 FIND MORE
========================================

Take more personality tests at:
https://triviaah.com/brainwave

Share your results:
https://triviaah.com/brainwave/disc

========================================
Generated by Triviaah.com
For personal use only
    `;
    
    return report;
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setBehavior({
      natural: { D: 0, I: 0, S: 0, C: 0 },
      adapted: { D: 0, I: 0, S: 0, C: 0 },
      gap: { D: 0, I: 0, S: 0, C: 0 }
    });
    setResult(null);
    setIsTestComplete(false);
    setIsCalculating(false);
    setIsWorkStylePhase(false);
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
    
    return `📊 My DISC Profile: ${result.profileName} (${result.profile.primary})

${result.descriptions[result.profile.primary].substring(0, 150)}...

Discover your DISC profile at https://triviaah.com/brainwave/disc`;
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
      'D': '⚡',
      'I': '🌟',
      'S': '🤝',
      'C': '📊'
    };
    return icons[type] || '🎭';
  };

  const getProgressText = () => {
    if (isWorkStylePhase) {
      return `Work Style: ${currentQuestionIndex + 1 - naturalQuestions}/${totalQuestions - naturalQuestions}`;
    }
    return `Natural Style: ${currentQuestionIndex + 1}/${naturalQuestions}`;
  };

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              📊 DISC Personality Assessment
            </h2>
            <p className="text-gray-600 text-sm">
              Discover your behavioral style and communication preferences
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">
              {getProgressText()}
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  isWorkStylePhase ? 'bg-blue-600' : 'bg-red-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {isCalculating ? (
          // Calculating Animation
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-red-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-red-600 rounded-full animate-spin border-t-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MdPsychology className="text-3xl text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Your Style</h3>
            <p className="text-gray-600 mb-4">Calculating your DISC profile...</p>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        ) : !isTestComplete ? (
          <>
            {/* Current Question */}
            <div className={`border rounded-xl p-6 mb-6 ${
              isWorkStylePhase 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start mb-4">
                <div className={`p-2 rounded-lg mr-3 ${
                  isWorkStylePhase ? 'bg-blue-100' : 'bg-red-100'
                }`}>
                  <MdPsychology className={`text-2xl ${
                    isWorkStylePhase ? 'text-blue-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  {isWorkStylePhase && (
                    <div className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mb-2 font-medium">
                      💼 Work Style Assessment
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {currentQuestion.text}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isWorkStylePhase 
                      ? 'How accurately does this describe you AT WORK?' 
                      : 'How accurately does this describe you NATURALLY?'}
                  </p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      currentQuestion.dimension === 'D' ? 'bg-red-100 text-red-700' :
                      currentQuestion.dimension === 'I' ? 'bg-yellow-100 text-yellow-700' :
                      currentQuestion.dimension === 'S' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {currentQuestion.dimension === 'D' ? 'Dominance' :
                       currentQuestion.dimension === 'I' ? 'Influence' :
                       currentQuestion.dimension === 'S' ? 'Steadiness' : 'Conscientiousness'}
                    </span>
                  </div>
                </div>
              </div>
              
              <AnswerScale 
                value={answers.find(a => a.questionId === currentQuestion.id)?.answer || 0}
                onChange={handleAnswer}
                label={isWorkStylePhase ? "At work, this describes me..." : "Naturally, this describes me..."}
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

            {/* Current Scores */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-4 text-lg">
                {isWorkStylePhase ? 'Your Work Style Scores' : 'Your Natural Style Scores'}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">⚡</span>
                    <h5 className="font-medium text-red-700">Dominance</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {isWorkStylePhase ? behavior.adapted.D : behavior.natural.D}%
                  </div>
                  <div className="text-xs text-gray-500">Direct, results-focused</div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🌟</span>
                    <h5 className="font-medium text-yellow-700">Influence</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {isWorkStylePhase ? behavior.adapted.I : behavior.natural.I}%
                  </div>
                  <div className="text-xs text-gray-500">Outgoing, people-focused</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🤝</span>
                    <h5 className="font-medium text-green-700">Steadiness</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {isWorkStylePhase ? behavior.adapted.S : behavior.natural.S}%
                  </div>
                  <div className="text-xs text-gray-500">Steady, team-focused</div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">📊</span>
                    <h5 className="font-medium text-blue-700">Conscientiousness</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {isWorkStylePhase ? behavior.adapted.C : behavior.natural.C}%
                  </div>
                  <div className="text-xs text-gray-500">Careful, quality-focused</div>
                </div>
              </div>
            </div>

            {/* Question Navigation and Completion */}
            <div className="space-y-6">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Question Progress</h4>
                <div className="flex flex-wrap gap-2">
                  {questions.slice(0, 20).map((_, index) => {
                    const isAnswered = answers.find(a => a.questionId === questions[index].id);
                    const isWorkStyleQ = questions[index].id.startsWith('W') || 
                                       (index >= naturalQuestions && questions[index].id.startsWith('B'));
                    
                    return (
                      <button
                        key={index}
                        onClick={() => goToQuestion(index)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          isAnswered
                            ? isWorkStyleQ ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
                            : currentQuestionIndex === index
                            ? (isWorkStylePhase ? 'bg-blue-600 text-white ring-2 ring-blue-300' : 'bg-red-600 text-white ring-2 ring-red-300')
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        title={isWorkStyleQ ? 'Work style question' : 'Natural style question'}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                  {questions.length > 20 && (
                    <span className="text-gray-500 text-sm self-center ml-2">
                      +{questions.length - 20} more
                    </span>
                  )}
                </div>
              </div>

              {/* Completion Status */}
              <div className={`p-4 rounded-lg ${
                allQuestionsAnswered 
                  ? 'bg-green-50 border border-green-200' 
                  : isWorkStylePhase 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold ${
                      allQuestionsAnswered 
                        ? 'text-green-800' 
                        : isWorkStylePhase 
                          ? 'text-blue-800' 
                          : 'text-yellow-800'
                    }`}>
                      {allQuestionsAnswered 
                        ? '✅ All Questions Answered!' 
                        : isWorkStylePhase
                          ? `💼 Work Style Assessment (${answers.filter(a => a.isWorkStyle).length}/${totalQuestions - naturalQuestions})`
                          : `🎭 Natural Style Assessment (${answers.filter(a => !a.isWorkStyle).length}/${naturalQuestions})`
                      }
                    </h4>
                    <p className={`text-sm mt-1 ${
                      allQuestionsAnswered 
                        ? 'text-green-600' 
                        : isWorkStylePhase 
                          ? 'text-blue-600' 
                          : 'text-yellow-600'
                    }`}>
                      {allQuestionsAnswered 
                        ? 'Ready to calculate your complete DISC profile!' 
                        : isWorkStylePhase
                          ? 'Answer work style questions to see your complete profile'
                          : 'Answer natural style questions to continue to work style assessment'
                      }
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
                    <h4 className="font-semibold text-green-800">Download Your DISC Profile</h4>
                    <p className="text-green-600 text-sm mt-1">
                      Save your behavioral assessment for personal and professional development
                    </p>
                  </div>
                </div>
              </div>

              {/* Result Header */}
              <div ref={resultsRef} className="space-y-6">
                <div className={`rounded-xl p-6 text-white ${result.color}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">📊 Your DISC Profile</h3>
                      <div className="text-4xl font-black mb-2">{result.profileName}</div>
                      <h4 className="text-2xl font-semibold">Primary Style: {result.profile.primary}</h4>
                      <p className="text-white/90 mt-2 text-lg">
                        {result.overallDescription}
                      </p>
                      {result.profile.secondary && (
                        <div className="mt-3 inline-block bg-white/20 px-4 py-1 rounded-full text-sm">
                          Secondary Style: {result.profile.secondary}
                        </div>
                      )}
                    </div>
                    <div className="text-6xl">
                      {getTypeIcon(result.profile.primary)}
                    </div>
                  </div>
                  <div className="mt-4 text-sm opacity-90">
                    Generated on {new Date().toLocaleDateString()} • Test ID: DISC-{Date.now().toString(36).toUpperCase()}
                  </div>
                </div>

                {/* DISC Wheel */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4 text-center">
                    <MdInsights className="inline mr-2" /> Your DISC Wheel
                  </h4>
                  <DISCWheel 
                    scores={result.scores}
                    primary={result.profile.primary}
                  />
                  <div className="text-center text-sm text-gray-600 mt-4">
                    Your primary style ({result.profile.primary}) is highlighted. Distance from center indicates strength.
                  </div>
                </div>

                {/* Comparison Graph */}
                <ComparisonGraph behavior={result.behavior} />

                {/* Natural Style Scores */}
                <DISCGraph 
                  scores={result.behavior.natural}
                  title="Natural Behavioral Style"
                />

                {/* Adapted Style Scores */}
                <DISCGraph 
                  scores={result.behavior.adapted}
                  title="Adapted/Work Style"
                />

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold text-lg text-green-800 mb-3 flex items-center">
                      <MdStar className="mr-2" /> Key Strengths
                    </h4>
                    <ul className="space-y-2">
                      {result.strengths[result.profile.primary].map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h4 className="font-semibold text-lg text-red-800 mb-3 flex items-center">
                      <MdPsychology className="mr-2" /> Areas for Growth
                    </h4>
                    <ul className="space-y-2">
                      {result.weaknesses[result.profile.primary].map((weakness, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">⚠</span>
                          <span className="text-gray-700">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Communication Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-blue-800 mb-3 flex items-center">
                    <MdChat className="mr-2" /> Communication Tips for Your Style
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.communicationTips[result.profile.primary].map((tip, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg">
                        <div className="flex items-start">
                          <span className="text-blue-500 text-lg mr-2">•</span>
                          <span className="text-gray-700">{tip}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ideal Environment */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-purple-800 mb-3 flex items-center">
                    <MdWork className="mr-2" /> Ideal Work Environment
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.idealEnvironment[result.profile.primary].map((env, index) => (
                      <span 
                        key={index}
                        className="bg-white border border-purple-300 text-purple-700 px-3 py-2 rounded-lg text-sm"
                      >
                        {env}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stress Behaviors */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-yellow-800 mb-3 flex items-center">
                    <MdTrendingUp className="mr-2" /> Stress Indicators
                  </h4>
                  <p className="text-gray-700 mb-4">
                    When under pressure, you may exhibit these behaviors:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.stressBehaviors[result.profile.primary].map((behavior, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg">
                        <div className="flex items-start">
                          <span className="text-yellow-500 mr-2">⚠</span>
                          <span className="text-gray-700">{behavior}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All Type Descriptions */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">Understanding All DISC Styles</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mr-2">D</div>
                        <h5 className="font-semibold text-gray-800">Dominance</h5>
                      </div>
                      <p className="text-sm text-gray-600">{result.descriptions.D}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold mr-2">I</div>
                        <h5 className="font-semibold text-gray-800">Influence</h5>
                      </div>
                      <p className="text-sm text-gray-600">{result.descriptions.I}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-2">S</div>
                        <h5 className="font-semibold text-gray-800">Steadiness</h5>
                      </div>
                      <p className="text-sm text-gray-600">{result.descriptions.S}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-2">C</div>
                        <h5 className="font-semibold text-gray-800">Conscientiousness</h5>
                      </div>
                      <p className="text-sm text-gray-600">{result.descriptions.C}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Options */}
              <div className="bg-gradient-to-r from-red-50 to-blue-50 border border-red-200 rounded-xl p-6">
                <h4 className="font-bold text-xl text-gray-800 mb-4 text-center">
                  <MdDownload className="inline mr-2" />
                  Download Your DISC Report
                </h4>
                <p className="text-gray-600 text-center mb-6">
                  Choose your preferred format to save your behavioral assessment
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={downloadAsPDF}
                    disabled={isDownloading}
                    className="flex flex-col items-center justify-center p-6 bg-white border border-red-300 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaFilePdf className="text-4xl text-red-500 mb-3" />
                    <span className="font-semibold text-gray-800">PDF Report</span>
                    <span className="text-sm text-gray-500 mt-1">Complete analysis</span>
                    {isDownloading && (
                      <div className="mt-2 animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                    )}
                  </button>
                  
                  <button
                    onClick={downloadAsImage}
                    disabled={isDownloading}
                    className="flex flex-col items-center justify-center p-6 bg-white border border-yellow-300 rounded-xl hover:bg-yellow-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaFileImage className="text-4xl text-yellow-500 mb-3" />
                    <span className="font-semibold text-gray-800">Image</span>
                    <span className="text-sm text-gray-500 mt-1">Visual profile</span>
                    {isDownloading && (
                      <div className="mt-2 animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
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
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
        <h3 className="font-bold mb-3">📊 How the DISC Assessment Works:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><strong>Dominance (D):</strong> Measures directness, assertiveness, and results-orientation</li>
          <li><strong>Influence (I):</strong> Measures sociability, optimism, and people-orientation</li>
          <li><strong>Steadiness (S):</strong> Measures patience, cooperation, and stability</li>
          <li><strong>Conscientiousness (C):</strong> Measures carefulness, analysis, and quality-orientation</li>
          <li>Assesses both your natural style and adapted work style</li>
          <li>28 questions measuring behavioral preferences in different contexts</li>
          <li>Results show your primary and secondary behavioral styles</li>
          <li>Used worldwide for team building, communication, and leadership development</li>
          <li>Your privacy is protected - no data is stored on our servers</li>
        </ul>
      </div>
    </div>
  );
}