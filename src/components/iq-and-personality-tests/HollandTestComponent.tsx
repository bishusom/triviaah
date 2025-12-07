import { useState, useEffect, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { event } from '@/lib/gtag';
import { 
  MdWork, MdDownload, MdInsights, MdShare, MdTrendingUp, 
  MdGroups, MdTipsAndUpdates, MdAttachMoney, MdLocationOn
} from "react-icons/md";
import { FaFilePdf, FaFileImage, FaFileAlt, FaGraduationCap } from "react-icons/fa";
import { 
  HollandQuestion, 
  HollandResult, 
  HollandScores,
  UserHollandAnswer,
  HollandCareer
} from '@/lib/iq-and-personality-tests/holland-career/holland-types';
import { 
  hollandQuestions,
  calculateHollandScores,
  getHollandResult
} from '@/lib/iq-and-personality-tests/holland-career/holland-logic';
import html2canvas from 'html2canvas';

interface HollandTestComponentProps {
  userId?: string;
}

const AnswerScale = ({ 
  value, 
  onChange,
  label = "How interested are you in this type of activity?"
}: { 
  value: number; 
  onChange: (value: number) => void;
  label?: string;
}) => {
  const scaleLabels = [
    { label: 'Not Interested', color: 'bg-gray-300' },
    { label: 'Slightly Interested', color: 'bg-gray-400' },
    { label: 'Moderately Interested', color: 'bg-blue-300' },
    { label: 'Interested', color: 'bg-blue-500' },
    { label: 'Very Interested', color: 'bg-green-600' }
  ];

  return (
    <div className="w-full">
      <div className="text-sm text-gray-600 mb-3">{label}</div>
      <div className="flex justify-between mb-2">
        {scaleLabels.map((scaleLabel, index) => (
          <button
            key={index}
            onClick={() => onChange(index + 1)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              value === index + 1 
                ? `${scaleLabel.color} text-white transform scale-110 ring-2 ring-offset-2 ring-opacity-50` 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            aria-label={scaleLabel.label}
          >
            <span className="text-sm font-bold">{index + 1}</span>
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>Not Interested</span>
        <span>Very Interested</span>
      </div>
    </div>
  );
};

const HollandGraph = ({ 
  scores,
  title,
  showLabels = true
}: { 
  scores: HollandScores;
  title: string;
  showLabels?: boolean;
}) => {
  const types = ['R', 'I', 'A', 'S', 'E', 'C'] as const;
  const colors = {
    R: 'bg-orange-500',
    I: 'bg-green-500',
    A: 'bg-purple-500',
    S: 'bg-blue-500',
    E: 'bg-red-500',
    C: 'bg-yellow-500'
  };
  const labels = {
    R: 'Realistic',
    I: 'Investigative',
    A: 'Artistic',
    S: 'Social',
    E: 'Enterprising',
    C: 'Conventional'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h4 className="font-semibold text-lg text-gray-800 mb-4">{title}</h4>
      <div className="space-y-4">
        {types.map((type) => (
          <div key={type} className="space-y-1">
            {showLabels && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">{labels[type]}</span>
                <span className="text-sm font-bold text-gray-800">{scores[type]}%</span>
              </div>
            )}
            <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${colors[type]} transition-all duration-500`}
                style={{ width: `${scores[type]}%` }}
              />
            </div>
            {!showLabels && (
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span className="font-medium">{scores[type]}%</span>
                <span>100%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const HollandHexagon = ({ scores, primary }: { scores: HollandScores; primary: string }) => {
  const types = [
    { type: 'R', label: 'Realistic', color: 'bg-orange-500', position: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' },
    { type: 'I', label: 'Investigative', color: 'bg-green-500', position: 'top-1/4 right-0 -translate-y-1/2 translate-x-1/2' },
    { type: 'A', label: 'Artistic', color: 'bg-purple-500', position: 'bottom-1/4 right-0 translate-y-1/2 translate-x-1/2' },
    { type: 'S', label: 'Social', color: 'bg-blue-500', position: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' },
    { type: 'E', label: 'Enterprising', color: 'bg-red-500', position: 'bottom-1/4 left-0 translate-y-1/2 -translate-x-1/2' },
    { type: 'C', label: 'Conventional', color: 'bg-yellow-500', position: 'top-1/4 left-0 -translate-y-1/2 -translate-x-1/2' }
  ];

  return (
    <div className="relative w-72 h-72 mx-auto">
      {/* Hexagon background */}
      <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
      
      {/* Connect points with lines for hexagon */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <polygon 
          points="180,40 300,110 300,210 180,280 60,210 60,110" 
          fill="none" 
          stroke="#e5e7eb" 
          strokeWidth="2"
        />
      </svg>
      
      {/* Score indicators */}
      {types.map((type) => {
        const score = scores[type.type as keyof HollandScores];
        const isPrimary = type.type === primary;
        const radius = 120; // Max radius
        const scaledRadius = (score / 100) * radius;
        
        // Calculate position based on type (hexagon vertices)
        let x = 0, y = 0;
        const centerX = 180;
        const centerY = 160;
        
        switch(type.type) {
          case 'R': // Top
            x = centerX;
            y = centerY - scaledRadius;
            break;
          case 'I': // Top-right
            x = centerX + scaledRadius * 0.866; // cos(30°)
            y = centerY - scaledRadius * 0.5;  // sin(30°)
            break;
          case 'A': // Bottom-right
            x = centerX + scaledRadius * 0.866;
            y = centerY + scaledRadius * 0.5;
            break;
          case 'S': // Bottom
            x = centerX;
            y = centerY + scaledRadius;
            break;
          case 'E': // Bottom-left
            x = centerX - scaledRadius * 0.866;
            y = centerY + scaledRadius * 0.5;
            break;
          case 'C': // Top-left
            x = centerX - scaledRadius * 0.866;
            y = centerY - scaledRadius * 0.5;
            break;
        }
        
        return (
          <div key={type.type}>
            {/* Score line from center */}
            <div 
              className={`absolute w-0.5 ${type.color} transform origin-center`}
              style={{
                height: `${scaledRadius}px`,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${
                  type.type === 'R' ? '0deg' :
                  type.type === 'I' ? '60deg' :
                  type.type === 'A' ? '120deg' :
                  type.type === 'S' ? '180deg' :
                  type.type === 'E' ? '240deg' : '300deg'
                })`,
                transformOrigin: 'bottom center'
              }}
            />
            
            {/* Score point */}
            <div
              className={`absolute w-10 h-10 rounded-full ${type.color} flex items-center justify-center text-white font-bold transform -translate-x-1/2 -translate-y-1/2 ${
                isPrimary ? 'ring-4 ring-offset-2 ring-gray-800 z-10' : ''
              }`}
              style={{
                left: `${x}px`,
                top: `${y}px`
              }}
              title={`${type.label}: ${score}%`}
            >
              {type.type}
            </div>
          </div>
        );
      })}
      
      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold">
          RIASEC
        </div>
      </div>
    </div>
  );
};

const CareerCard = ({ career }: { career: HollandCareer }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <h5 className="font-bold text-lg text-gray-800 mb-2">{career.title}</h5>
      <p className="text-gray-600 text-sm mb-4">{career.description}</p>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <MdAttachMoney className="text-green-600 mr-2" />
          <span className="text-sm text-gray-700">
            <span className="font-medium">Median Salary:</span> {career.medianSalary}
          </span>
        </div>
        
        <div className="flex items-center">
          <MdTrendingUp className="text-blue-600 mr-2" />
          <span className="text-sm text-gray-700">
            <span className="font-medium">Job Growth:</span> {career.growth}
          </span>
        </div>
        
        <div className="flex items-center">
          <FaGraduationCap className="text-purple-600 mr-2" />
          <span className="text-sm text-gray-700">
            <span className="font-medium">Education:</span> {career.education}
          </span>
        </div>
        
        <div className="mt-4">
          <h6 className="font-medium text-gray-700 mb-2">Key Skills:</h6>
          <div className="flex flex-wrap gap-2">
            {career.skills.map((skill, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HollandTestComponent({ userId }: HollandTestComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserHollandAnswer[]>([]);
  const [scores, setScores] = useState<HollandScores>({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  const [result, setResult] = useState<HollandResult | null>(null);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);
  const [testStartTime] = useState(Date.now());
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

  const questions = hollandQuestions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Calculate scores as answers are given
  useEffect(() => {
    if (answers.length > 0) {
      const newScores = calculateHollandScores(answers);
      setScores(newScores);
    }
    
    const answeredQuestions = answers.length;
    setAllQuestionsAnswered(answeredQuestions === totalQuestions);
    
    if (answeredQuestions === totalQuestions && !isTestComplete && !isCalculating) {
      setTimeout(() => {
        completeTest();
      }, 500);
    }
  }, [answers, totalQuestions, isTestComplete, isCalculating]);

  const handleAnswer = (value: number) => {
    const newAnswer: UserHollandAnswer = {
      questionId: currentQuestion.id,
      answer: value,
      type: currentQuestion.type
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
      const hollandResult = getHollandResult(scores);
      setResult(hollandResult);
      setIsTestComplete(true);
      
      event({
        action: 'holland_test_completed',
        category: 'career',
        label: hollandResult.hollandCode
      });
    } catch (error) {
      console.error('Error completing Holland test:', error);
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
      
      pdfDoc.setTitle(`Holland Career Report - ${result.hollandCode}`);
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
      link.download = `Holland_Career_${result.hollandCode}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      event({ action: 'holland_download_pdf', category: 'career', label: result.hollandCode });
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
      link.download = `Holland_Career_${result.hollandCode}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      event({ action: 'holland_download_image', category: 'career', label: result.hollandCode });
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
    link.download = `Holland_Career_${result.hollandCode}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    event({ action: 'holland_download_text', category: 'career', label: result.hollandCode });
  };

  const generateDetailedTextReport = (): string => {
    if (!result) return '';
    
    const date = new Date().toLocaleString();
    const testDuration = Math.round((Date.now() - testStartTime) / 1000 / 60);
    const { primary, secondary, tertiary, fourth, fifth, sixth } = result.profile;
    
    const report = `
========================================
🎯 HOLLAND CAREER ASSESSMENT REPORT
========================================

Test Date: ${date}
Test Duration: ${testDuration} minutes
Holland Code: ${result.hollandCode}
Primary Type: ${result.profile.primary} - ${result.profileName}
Secondary Type: ${secondary || 'Not significant'}
Tertiary Type: ${tertiary || 'Not significant'}

========================================
📊 YOUR CAREER INTEREST PROFILE
========================================

OVERVIEW:
${result.overallDescription}

YOUR HOLLAND CODE (RIASEC):
Realistic: ${result.scores.R}%
Investigative: ${result.scores.I}%
Artistic: ${result.scores.A}%
Social: ${result.scores.S}%
Enterprising: ${result.scores.E}%
Conventional: ${result.scores.C}%

========================================
🌟 YOUR PRIMARY TYPE: ${result.profile.primary}
========================================

DESCRIPTION:
${result.descriptions[primary]}

KEY CHARACTERISTICS:
${result.characteristics[primary].map((char, i) => `${i + 1}. ${char}`).join('\n')}

PREFERRED WORK ACTIVITIES:
${result.workActivities[primary].map((activity, i) => `${i + 1}. ${activity}`).join('\n')}

IDEAL WORK ENVIRONMENTS:
${result.workEnvironment[primary].map((env, i) => `${i + 1}. ${env}`).join('\n')}

========================================
💼 SUGGESTED CAREERS
========================================

${result.suggestedCareers[primary].map((career, i) => `
${i + 1}. ${career.title}
   Description: ${career.description}
   Median Salary: ${career.medianSalary}
   Job Growth: ${career.growth}
   Education: ${career.education}
   Key Skills: ${career.skills.join(', ')}
`).join('\n')}

========================================
🤝 TEAM COMPATIBILITY
========================================

${result.compatibleTypes.map((type, i) => `${i + 1}. ${type}`).join('\n')}

========================================
📈 DEVELOPMENT AREAS
========================================

Areas to develop for career growth:
${result.developmentAreas.map((area, i) => `${i + 1}. ${area}`).join('\n')}

========================================
💡 CAREER ADVICE
========================================

${result.careerAdvice.map((advice, i) => `${i + 1}. ${advice}`).join('\n')}

========================================
🎭 ALL HOLLAND TYPES EXPLAINED
========================================

REALISTIC (R):
${result.descriptions.R}

INVESTIGATIVE (I):
${result.descriptions.I}

ARTISTIC (A):
${result.descriptions.A}

SOCIAL (S):
${result.descriptions.S}

ENTERPRISING (E):
${result.descriptions.E}

CONVENTIONAL (C):
${result.descriptions.C}

========================================
📝 TEST INFORMATION
========================================

• Total Questions: ${questions.length}
• Questions Answered: ${answers.length}
• Based on Dr. John Holland's RIASEC Theory
• Used worldwide for career counseling and guidance
• Results help match personality to career environments

========================================
🔗 FIND MORE
========================================

Take more career assessments at:
https://triviaah.com/brainwave

Explore career resources:
https://triviaah.com/career

========================================
Generated by Triviaah.com
For personal and career development use
    `;
    
    return report;
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScores({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
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
    
    return `🎯 My Holland Career Code: ${result.hollandCode}

My primary career interest is ${result.profile.primary}: ${result.descriptions[result.profile.primary].substring(0, 120)}...

Discover your career interests at https://triviaah.com/brainwave/holland`;
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
      'R': '🔧',
      'I': '🔬',
      'A': '🎨',
      'S': '🤝',
      'E': '💼',
      'C': '📊'
    };
    return icons[type] || '🎯';
  };

  const getTypeName = (type: string) => {
    const names: Record<string, string> = {
      'R': 'Realistic',
      'I': 'Investigative',
      'A': 'Artistic',
      'S': 'Social',
      'E': 'Enterprising',
      'C': 'Conventional'
    };
    return names[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'R': 'bg-orange-500',
      'I': 'bg-green-500',
      'A': 'bg-purple-500',
      'S': 'bg-blue-500',
      'E': 'bg-red-500',
      'C': 'bg-yellow-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              🎯 Holland Career Assessment
            </h2>
            <p className="text-gray-600 text-sm">
              Discover your career interests based on the RIASEC theory
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">
              Question {currentQuestionIndex + 1}/{totalQuestions}
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
                <MdWork className="text-3xl text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Your Career Profile</h3>
            <p className="text-gray-600 mb-4">Calculating your Holland Code...</p>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        ) : !isTestComplete ? (
          <>
            {/* Current Question */}
            <div className="border rounded-xl p-6 mb-6 bg-blue-50 border-blue-200">
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg mr-3 bg-blue-100">
                  <MdWork className="text-2xl text-blue-600" />
                </div>
                <div>
                  <div className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mb-2 font-medium">
                    Career Interest Assessment
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {currentQuestion.text}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Rate your interest in this type of work activity
                  </p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${getTypeColor(currentQuestion.type)} text-white`}>
                      {getTypeName(currentQuestion.type)} Type
                    </span>
                  </div>
                </div>
              </div>
              
              <AnswerScale 
                value={answers.find(a => a.questionId === currentQuestion.id)?.answer || 0}
                onChange={handleAnswer}
                label="How interested are you in this type of work?"
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
                    <span>Select your interest level</span>
                  )}
                </div>
              </div>
            </div>

            {/* Current Scores */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-4 text-lg">
                Your Current Career Interest Scores
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🔧</span>
                    <h5 className="font-medium text-orange-700">Realistic</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {scores.R}%
                  </div>
                  <div className="text-xs text-gray-500">Hands-on, practical</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🔬</span>
                    <h5 className="font-medium text-green-700">Investigative</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {scores.I}%
                  </div>
                  <div className="text-xs text-gray-500">Analytical, research</div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🎨</span>
                    <h5 className="font-medium text-purple-700">Artistic</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {scores.A}%
                  </div>
                  <div className="text-xs text-gray-500">Creative, expressive</div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🤝</span>
                    <h5 className="font-medium text-blue-700">Social</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {scores.S}%
                  </div>
                  <div className="text-xs text-gray-500">Helping, cooperative</div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">💼</span>
                    <h5 className="font-medium text-red-700">Enterprising</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {scores.E}%
                  </div>
                  <div className="text-xs text-gray-500">Leadership, persuasive</div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">📊</span>
                    <h5 className="font-medium text-yellow-700">Conventional</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {scores.C}%
                  </div>
                  <div className="text-xs text-gray-500">Organized, systematic</div>
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
                    const question = questions[index];
                    
                    return (
                      <button
                        key={index}
                        onClick={() => goToQuestion(index)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          isAnswered
                            ? `${getTypeColor(question.type)} text-white`
                            : currentQuestionIndex === index
                            ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        title={`${getTypeName(question.type)} question`}
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
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold ${
                      allQuestionsAnswered 
                        ? 'text-green-800' 
                        : 'text-blue-800'
                    }`}>
                      {allQuestionsAnswered 
                        ? '✅ All Questions Answered!' 
                        : `🎯 Career Assessment (${answers.length}/${totalQuestions})`
                      }
                    </h4>
                    <p className={`text-sm mt-1 ${
                      allQuestionsAnswered 
                        ? 'text-green-600' 
                        : 'text-blue-600'
                    }`}>
                      {allQuestionsAnswered 
                        ? 'Ready to discover your Holland career code!' 
                        : 'Complete all questions to see your career profile'
                      }
                    </p>
                  </div>
                  {allQuestionsAnswered && (
                    <button
                      onClick={handleManualComplete}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
                    <h4 className="font-semibold text-green-800">Download Your Career Assessment Report</h4>
                    <p className="text-green-600 text-sm mt-1">
                      Save your Holland career profile for educational and career planning
                    </p>
                  </div>
                </div>
              </div>

              {/* Result Header */}
              <div ref={resultsRef} className="space-y-6">
                <div className={`rounded-xl p-6 text-white ${result.color}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">🎯 Your Holland Career Code</h3>
                      <div className="text-5xl font-black mb-2">{result.hollandCode}</div>
                      <h4 className="text-2xl font-semibold">{result.profileName}</h4>
                      <p className="text-white/90 mt-2 text-lg">
                        {result.overallDescription}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <div className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm">
                          Primary: {getTypeName(result.profile.primary)}
                        </div>
                        {result.profile.secondary && (
                          <div className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm">
                            Secondary: {getTypeName(result.profile.secondary)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-6xl">
                      {getTypeIcon(result.profile.primary)}
                    </div>
                  </div>
                  <div className="mt-4 text-sm opacity-90">
                    Generated on {new Date().toLocaleDateString()} • Based on RIASEC Theory • Test ID: HC-{Date.now().toString(36).toUpperCase()}
                  </div>
                </div>

                {/* Holland Hexagon */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4 text-center">
                    <MdInsights className="inline mr-2" /> Your Holland Hexagon
                  </h4>
                  <HollandHexagon 
                    scores={result.scores}
                    primary={result.profile.primary}
                  />
                  <div className="text-center text-sm text-gray-600 mt-4">
                    Your primary type ({result.profile.primary}) is highlighted. Distance from center indicates interest strength.
                  </div>
                </div>

                {/* Scores Graph */}
                <HollandGraph 
                  scores={result.scores}
                  title="Your Career Interest Scores"
                />

                {/* Primary Type Description */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-lg text-gray-800 mb-3">
                    📋 Your Primary Type: {getTypeName(result.profile.primary)}
                  </h4>
                  <p className="text-gray-700 mb-6">
                    {result.descriptions[result.profile.primary]}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Key Characteristics:</h5>
                      <ul className="space-y-2">
                        {result.characteristics[result.profile.primary].map((char, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span className="text-gray-700">{char}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Preferred Work Activities:</h5>
                      <ul className="space-y-2">
                        {result.workActivities[result.profile.primary].map((activity, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span className="text-gray-700">{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Suggested Careers */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-blue-800 mb-4 flex items-center">
                    <MdWork className="mr-2" /> Suggested Careers for You
                  </h4>
                  <p className="text-gray-700 mb-6">
                    Based on your Holland Code, here are careers that align with your interests:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {result.suggestedCareers[result.profile.primary].map((career, index) => (
                      <CareerCard key={index} career={career} />
                    ))}
                  </div>
                </div>

                {/* Ideal Work Environment */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-green-800 mb-3 flex items-center">
                    <MdLocationOn className="mr-2" /> Ideal Work Environments
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.workEnvironment[result.profile.primary].map((env, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg">
                        <div className="flex items-start">
                          <span className="text-green-500 text-lg mr-2">🏢</span>
                          <span className="text-gray-700">{env}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Compatibility */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-purple-800 mb-3 flex items-center">
                    <MdGroups className="mr-2" /> Team Compatibility
                  </h4>
                  <p className="text-gray-700 mb-4">
                    You work best with people who complement your style:
                  </p>
                  <div className="space-y-3">
                    {result.compatibleTypes.map((type, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg">
                        <div className="flex items-start">
                          <span className="text-purple-500 mr-2">🤝</span>
                          <span className="text-gray-700">{type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Development Areas */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-yellow-800 mb-3 flex items-center">
                    <MdTrendingUp className="mr-2" /> Areas for Development
                  </h4>
                  <p className="text-gray-700 mb-4">
                    Develop these areas to expand your career opportunities:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.developmentAreas.map((area, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg">
                        <div className="flex items-start">
                          <span className="text-yellow-500 mr-2">📈</span>
                          <span className="text-gray-700">{area}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Career Advice */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-red-800 mb-3 flex items-center">
                    <MdTipsAndUpdates className="mr-2" /> Career Development Advice
                  </h4>
                  <div className="space-y-4">
                    {result.careerAdvice.map((advice, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg">
                        <div className="flex items-start">
                          <span className="text-red-500 text-lg mr-2">💡</span>
                          <span className="text-gray-700">{advice}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All Holland Types */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">The Six Holland Types (RIASEC)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className={`w-8 h-8 ${getTypeColor('R')} rounded-full flex items-center justify-center text-white font-bold mr-2`}>R</div>
                        <h5 className="font-semibold text-gray-800">Realistic</h5>
                      </div>
                      <p className="text-sm text-gray-600">{result.descriptions.R}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className={`w-8 h-8 ${getTypeColor('I')} rounded-full flex items-center justify-center text-white font-bold mr-2`}>I</div>
                        <h5 className="font-semibold text-gray-800">Investigative</h5>
                      </div>
                      <p className="text-sm text-gray-600">{result.descriptions.I}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className={`w-8 h-8 ${getTypeColor('A')} rounded-full flex items-center justify-center text-white font-bold mr-2`}>A</div>
                        <h5 className="font-semibold text-gray-800">Artistic</h5>
                      </div>
                      <p className="text-sm text-gray-600">{result.descriptions.A}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className={`w-8 h-8 ${getTypeColor('S')} rounded-full flex items-center justify-center text-white font-bold mr-2`}>S</div>
                        <h5 className="font-semibold text-gray-800">Social</h5>
                      </div>
                      <p className="text-sm text-gray-600">{result.descriptions.S}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className={`w-8 h-8 ${getTypeColor('E')} rounded-full flex items-center justify-center text-white font-bold mr-2`}>E</div>
                        <h5 className="font-semibold text-gray-800">Enterprising</h5>
                      </div>
                      <p className="text-sm text-gray-600">{result.descriptions.E}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className={`w-8 h-8 ${getTypeColor('C')} rounded-full flex items-center justify-center text-white font-bold mr-2`}>C</div>
                        <h5 className="font-semibold text-gray-800">Conventional</h5>
                      </div>
                      <p className="text-sm text-gray-600">{result.descriptions.C}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Options */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-bold text-xl text-gray-800 mb-4 text-center">
                  <MdDownload className="inline mr-2" />
                  Download Your Career Assessment Report
                </h4>
                <p className="text-gray-600 text-center mb-6">
                  Choose your preferred format for career planning and development
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={downloadAsPDF}
                    disabled={isDownloading}
                    className="flex flex-col items-center justify-center p-6 bg-white border border-blue-300 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaFilePdf className="text-4xl text-blue-500 mb-3" />
                    <span className="font-semibold text-gray-800">PDF Report</span>
                    <span className="text-sm text-gray-500 mt-1">Complete career analysis</span>
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
                    <span className="text-sm text-gray-500 mt-1">Visual career profile</span>
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
                    <span className="text-sm text-gray-500 mt-1">Detailed career insights</span>
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
        <h3 className="font-bold mb-3">🎯 How the Holland Career Assessment Works:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><strong>Realistic (R):</strong> Practical, hands-on people who enjoy working with tools and machinery</li>
          <li><strong>Investigative (I):</strong> Analytical thinkers who enjoy research, problem-solving, and intellectual challenges</li>
          <li><strong>Artistic (A):</strong> Creative individuals who enjoy self-expression through arts, writing, or design</li>
          <li><strong>Social (S):</strong> Cooperative people who enjoy helping, teaching, and working with others</li>
          <li><strong>Enterprising (E):</strong> Ambitious individuals who enjoy leading, persuading, and business activities</li>
          <li><strong>Conventional (C):</strong> Organized people who enjoy working with data, systems, and procedures</li>
          <li>Based on Dr. John Holland&apos;s RIASEC theory developed in the 1950s</li>
          <li>36 questions measuring your interest in different types of work activities</li>
          <li>Results show your Holland Code (e.g., &apos;RIS&apos;, &apos;ASE&apos;) for career matching</li>
          <li>Used worldwide by career counselors, schools, and organizations</li>
          <li>Your privacy is protected - no data is stored on our servers</li>
        </ul>
      </div>
    </div>
  );
}