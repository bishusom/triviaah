import { useState, useEffect, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { event } from '@/lib/gtag';
import { 
  MdFavorite, MdChat, MdDownload, MdInsights,
  MdShare, MdEmojiPeople, MdWarning, MdTipsAndUpdates
} from "react-icons/md";
import { FaFilePdf, FaFileImage, FaFileAlt } from "react-icons/fa";
import { 
  LoveLanguageResult, 
  LoveLanguageScores,
  UserLoveLanguageAnswer
} from '@/lib/iq-and-personality-tests/love-languages/love-languages-types';
import { 
  loveLanguageQuestions,
  calculateLoveLanguageScores,
  getLoveLanguageResult
} from '@/lib/iq-and-personality-tests/love-languages/love-languages-logic';
import html2canvas from 'html2canvas';

interface LoveLanguagesTestComponentProps {
  userId?: string;
}

const AnswerScale = ({ 
  value, 
  onChange,
  label = "How important is this to you?"
}: { 
  value: number; 
  onChange: (value: number) => void;
  label?: string;
}) => {
  const scaleLabels = [
    { label: 'Not Important', color: 'bg-gray-300' },
    { label: 'Slightly Important', color: 'bg-gray-400' },
    { label: 'Moderately Important', color: 'bg-blue-300' },
    { label: 'Important', color: 'bg-blue-500' },
    { label: 'Very Important', color: 'bg-purple-600' }
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
        <span>Not Important</span>
        <span>Very Important</span>
      </div>
    </div>
  );
};

const LoveLanguageGraph = ({ 
  scores,
  title,
  showLabels = true
}: { 
  scores: LoveLanguageScores;
  title: string;
  showLabels?: boolean;
}) => {
  const languages = ['WA', 'AS', 'RG', 'QT', 'PT'] as const;
  const colors = {
    WA: 'bg-blue-500',
    AS: 'bg-green-500',
    RG: 'bg-purple-500',
    QT: 'bg-yellow-500',
    PT: 'bg-red-500'
  };
  const labels = {
    WA: 'Words of Affirmation',
    AS: 'Acts of Service',
    RG: 'Receiving Gifts',
    QT: 'Quality Time',
    PT: 'Physical Touch'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h4 className="font-semibold text-lg text-gray-800 mb-4">{title}</h4>
      <div className="space-y-4">
        {languages.map((lang) => (
          <div key={lang} className="space-y-1">
            {showLabels && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">{labels[lang]}</span>
                <span className="text-sm font-bold text-gray-800">{scores[lang]}%</span>
              </div>
            )}
            <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${colors[lang]} transition-all duration-500`}
                style={{ width: `${scores[lang]}%` }}
              />
            </div>
            {!showLabels && (
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span className="font-medium">{scores[lang]}%</span>
                <span>100%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const LoveLanguageWheel = ({ scores, primary }: { scores: LoveLanguageScores; primary: string }) => {
  const languages = [
    { type: 'WA', label: 'Words', color: 'bg-blue-500', position: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' },
    { type: 'AS', label: 'Service', color: 'bg-green-500', position: 'top-1/2 right-0 -translate-y-1/2 translate-x-1/2' },
    { type: 'RG', label: 'Gifts', color: 'bg-purple-500', position: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' },
    { type: 'QT', label: 'Time', color: 'bg-yellow-500', position: 'top-1/2 left-0 -translate-y-1/2 -translate-x-1/2' },
    { type: 'PT', label: 'Touch', color: 'bg-red-500', position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' }
  ];

// Add this labels object
  const labels = {
    WA: 'Words of Affirmation',
    AS: 'Acts of Service',
    RG: 'Receiving Gifts',
    QT: 'Quality Time',
    PT: 'Physical Touch'
  };

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Wheel background */}
      <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
      
      {/* Score indicators */}
      {languages.map((lang) => {
        const score = scores[lang.type as keyof LoveLanguageScores];
        const isPrimary = lang.type === primary;
        const radius = 80; // Max radius
        const scaledRadius = (score / 100) * radius;
        
        // Calculate position based on type (pentagon layout)
        let x = 0, y = 0;
        const angle = Math.PI / 2.5; // 72 degrees between points
        
        switch(lang.type) {
          case 'WA': // Top
            y = -scaledRadius;
            break;
          case 'AS': // Top-right
            x = scaledRadius * Math.sin(angle);
            y = -scaledRadius * Math.cos(angle);
            break;
          case 'RG': // Bottom-right
            x = scaledRadius * Math.sin(angle);
            y = scaledRadius * Math.cos(angle);
            break;
          case 'QT': // Bottom-left
            x = -scaledRadius * Math.sin(angle);
            y = scaledRadius * Math.cos(angle);
            break;
          case 'PT': // Top-left
            x = -scaledRadius * Math.sin(angle);
            y = -scaledRadius * Math.cos(angle);
            break;
        }
        
        return (
          <div key={lang.type}>
            {/* Score line */}
            <div 
              className={`absolute w-0.5 ${lang.color} transform origin-center`}
              style={{
                height: `${scaledRadius}px`,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%)`,
              }}
            />
            
            {/* Score point */}
            <div
              className={`absolute w-8 h-8 rounded-full ${lang.color} flex items-center justify-center text-white font-bold transform -translate-x-1/2 -translate-y-1/2 ${
                isPrimary ? 'ring-4 ring-offset-2 ring-yellow-400 z-10' : ''
              }`}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`
              }}
              title={`${labels[lang.type as keyof typeof labels]}: ${score}%`}
            >
              {lang.type.charAt(0)}
            </div>
          </div>
        );
      })}
      
      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold">
          ❤️
        </div>
      </div>
    </div>
  );
};

export default function LoveLanguagesTestComponent({ userId }: LoveLanguagesTestComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserLoveLanguageAnswer[]>([]);
  const [scores, setScores] = useState<LoveLanguageScores>({ WA: 0, AS: 0, RG: 0, QT: 0, PT: 0 });
  const [result, setResult] = useState<LoveLanguageResult | null>(null);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);
  const [testStartTime] = useState(Date.now());
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

  const questions = loveLanguageQuestions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Calculate scores as answers are given
  useEffect(() => {
    if (answers.length > 0) {
      const newScores = calculateLoveLanguageScores(answers);
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
    const newAnswer: UserLoveLanguageAnswer = {
      questionId: currentQuestion.id,
      answer: value,
      language: currentQuestion.language
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
      const loveLanguageResult = getLoveLanguageResult(scores);
      setResult(loveLanguageResult);
      setIsTestComplete(true);
      
      event({
        action: 'love_languages_test_completed',
        category: 'personality',
        label: loveLanguageResult.profile.primary
      });
    } catch (error) {
      console.error('Error completing Love Languages test:', error);
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
      
      pdfDoc.setTitle(`Love Languages Report - ${result.profileName}`);
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
      link.download = `Love_Languages_${result.profile.primary}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      event({ action: 'love_languages_download_pdf', category: 'personality', label: result.profile.primary });
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
      link.download = `Love_Languages_${result.profile.primary}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      event({ action: 'love_languages_download_image', category: 'personality', label: result.profile.primary });
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
    link.download = `Love_Languages_${result.profile.primary}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    event({ action: 'love_languages_download_text', category: 'personality', label: result.profile.primary });
  };

  const generateDetailedTextReport = (): string => {
    if (!result) return '';
    
    const date = new Date().toLocaleString();
    const testDuration = Math.round((Date.now() - testStartTime) / 1000 / 60);
    const { primary, secondary, tertiary, fourth, fifth } = result.profile;
    
    const report = `
========================================
❤️ LOVE LANGUAGES ASSESSMENT REPORT
========================================

Test Date: ${date}
Test Duration: ${testDuration} minutes
Primary Love Language: ${result.profileName}
Secondary Love Language: ${secondary || 'Not significant'}
Tertiary Love Language: ${tertiary || 'Not significant'}
Fourth Love Language: ${fourth || 'Not significant'}
Fifth Love Language: ${result.descriptions[fifth].split(':')[0]}

========================================
💖 YOUR LOVE LANGUAGE PROFILE
========================================

OVERVIEW:
${result.overallDescription}

----------------------------------------
📊 YOUR SCORES:
Words of Affirmation: ${result.scores.WA}%
Acts of Service: ${result.scores.AS}%
Receiving Gifts: ${result.scores.RG}%
Quality Time: ${result.scores.QT}%
Physical Touch: ${result.scores.PT}%

========================================
🗣️ HOW YOU FEEL LOVED
========================================

${result.descriptions[primary]}

YOUR SPECIFIC NEEDS:
${result.needs[primary].map((need, i) => `${i + 1}. ${need}`).join('\n')}

========================================
💌 HOW TO LOVE SOMEONE LIKE YOU
========================================

${result.partnerTips[primary].map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

========================================
✨ HOW YOU CAN EXPRESS LOVE TO OTHERS
========================================

${result.expressions[primary].map((expression, i) => `${i + 1}. ${expression}`).join('\n')}

========================================
⚠️ COMMON MISUNDERSTANDINGS
========================================

People might misunderstand when you:
${result.commonMisunderstandings[primary].map((misunderstanding, i) => `${i + 1}. ${misunderstanding}`).join('\n')}

========================================
🤝 COMMUNICATION TIPS
========================================

How to communicate with someone whose love language is ${result.profileName}:
${result.communicationTips[primary].map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

========================================
🎯 ALL FIVE LOVE LANGUAGES EXPLAINED
========================================

WORDS OF AFFIRMATION:
${result.descriptions.WA}

ACTS OF SERVICE:
${result.descriptions.AS}

RECEIVING GIFTS:
${result.descriptions.RG}

QUALITY TIME:
${result.descriptions.QT}

PHYSICAL TOUCH:
${result.descriptions.PT}

========================================
📝 TEST INFORMATION
========================================

• Total Questions: ${questions.length}
• Questions Answered: ${answers.length}
• Based on Dr. Gary Chapman's "The 5 Love Languages"
• Results help understand how you give and receive love
• Used worldwide for improving relationships

========================================
🔗 FIND MORE
========================================

Take more personality tests at:
https://triviaah.com/brainwave

Share your results:
https://triviaah.com/brainwave/love-languages

========================================
Generated by Triviaah.com
For personal use only
    `;
    
    return report;
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScores({ WA: 0, AS: 0, RG: 0, QT: 0, PT: 0 });
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
    
    return `❤️ My Love Language: ${result.profileName}

${result.descriptions[result.profile.primary].substring(0, 150)}...

Discover your love language at https://triviaah.com/brainwave/love-languages`;
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
      'WA': '💬',
      'AS': '🛠️',
      'RG': '🎁',
      'QT': '⏰',
      'PT': '🤗'
    };
    return icons[type] || '❤️';
  };

  const getLanguageName = (type: string) => {
    const names: Record<string, string> = {
      'WA': 'Words of Affirmation',
      'AS': 'Acts of Service',
      'RG': 'Receiving Gifts',
      'QT': 'Quality Time',
      'PT': 'Physical Touch'
    };
    return names[type] || type;
  };

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              ❤️ Love Languages Assessment
            </h2>
            <p className="text-gray-600 text-sm">
              Discover how you give and receive love in relationships
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">
              Question {currentQuestionIndex + 1}/{totalQuestions}
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-pink-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {isCalculating ? (
          // Calculating Animation
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-pink-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-pink-600 rounded-full animate-spin border-t-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MdFavorite className="text-3xl text-pink-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Discovering Your Love Language</h3>
            <p className="text-gray-600 mb-4">Analyzing your responses...</p>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        ) : !isTestComplete ? (
          <>
            {/* Current Question */}
            <div className="border rounded-xl p-6 mb-6 bg-pink-50 border-pink-200">
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg mr-3 bg-pink-100">
                  <MdFavorite className="text-2xl text-pink-600" />
                </div>
                <div>
                  <div className="inline-block bg-pink-100 text-pink-800 text-xs px-3 py-1 rounded-full mb-2 font-medium">
                    Love Language Assessment
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {currentQuestion.text}
                  </h3>
                  <p className="text-sm text-gray-600">
                    How important is this to you in a relationship?
                  </p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      currentQuestion.language === 'WA' ? 'bg-blue-100 text-blue-700' :
                      currentQuestion.language === 'AS' ? 'bg-green-100 text-green-700' :
                      currentQuestion.language === 'RG' ? 'bg-purple-100 text-purple-700' :
                      currentQuestion.language === 'QT' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {getLanguageName(currentQuestion.language)}
                    </span>
                  </div>
                </div>
              </div>
              
              <AnswerScale 
                value={answers.find(a => a.questionId === currentQuestion.id)?.answer || 0}
                onChange={handleAnswer}
                label="Rate how important this is to you in a relationship:"
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
                Your Current Love Language Scores
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">💬</span>
                    <h5 className="font-medium text-blue-700">Words</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {scores.WA}%
                  </div>
                  <div className="text-xs text-gray-500">Verbal affirmation</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🛠️</span>
                    <h5 className="font-medium text-green-700">Service</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {scores.AS}%
                  </div>
                  <div className="text-xs text-gray-500">Helpful actions</div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🎁</span>
                    <h5 className="font-medium text-purple-700">Gifts</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {scores.RG}%
                  </div>
                  <div className="text-xs text-gray-500">Thoughtful tokens</div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">⏰</span>
                    <h5 className="font-medium text-yellow-700">Time</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {scores.QT}%
                  </div>
                  <div className="text-xs text-gray-500">Undivided attention</div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🤗</span>
                    <h5 className="font-medium text-red-700">Touch</h5>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {scores.PT}%
                  </div>
                  <div className="text-xs text-gray-500">Physical affection</div>
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
                            ? question.language === 'WA' ? 'bg-blue-500 text-white' :
                              question.language === 'AS' ? 'bg-green-500 text-white' :
                              question.language === 'RG' ? 'bg-purple-500 text-white' :
                              question.language === 'QT' ? 'bg-yellow-500 text-white' :
                              'bg-red-500 text-white'
                            : currentQuestionIndex === index
                            ? 'bg-pink-600 text-white ring-2 ring-pink-300'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        title={`${getLanguageName(question.language)} question`}
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
                  : 'bg-pink-50 border border-pink-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold ${
                      allQuestionsAnswered 
                        ? 'text-green-800' 
                        : 'text-pink-800'
                    }`}>
                      {allQuestionsAnswered 
                        ? '✅ All Questions Answered!' 
                        : `❤️ Love Languages Assessment (${answers.length}/${totalQuestions})`
                      }
                    </h4>
                    <p className={`text-sm mt-1 ${
                      allQuestionsAnswered 
                        ? 'text-green-600' 
                        : 'text-pink-600'
                    }`}>
                      {allQuestionsAnswered 
                        ? 'Ready to discover your primary love language!' 
                        : 'Complete all questions to see your love language profile'
                      }
                    </p>
                  </div>
                  {allQuestionsAnswered && (
                    <button
                      onClick={handleManualComplete}
                      className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
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
                    <h4 className="font-semibold text-green-800">Download Your Love Language Profile</h4>
                    <p className="text-green-600 text-sm mt-1">
                      Save your assessment for personal relationships and growth
                    </p>
                  </div>
                </div>
              </div>

              {/* Result Header */}
              <div ref={resultsRef} className="space-y-6">
                <div className={`rounded-xl p-6 text-white ${result.color}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">❤️ Your Love Language</h3>
                      <div className="text-4xl font-black mb-2">{result.profileName}</div>
                      <h4 className="text-2xl font-semibold">Primary: {result.profile.primary}</h4>
                      <p className="text-white/90 mt-2 text-lg">
                        {result.overallDescription}
                      </p>
                      {result.profile.secondary && (
                        <div className="mt-3 inline-block bg-white/20 px-4 py-1 rounded-full text-sm">
                          Secondary: {getLanguageName(result.profile.secondary)}
                        </div>
                      )}
                    </div>
                    <div className="text-6xl">
                      {getTypeIcon(result.profile.primary)}
                    </div>
                  </div>
                  <div className="mt-4 text-sm opacity-90">
                    Generated on {new Date().toLocaleDateString()} • Test ID: LL-{Date.now().toString(36).toUpperCase()}
                  </div>
                </div>

                {/* Love Language Wheel */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4 text-center">
                    <MdInsights className="inline mr-2" /> Your Love Language Wheel
                  </h4>
                  <LoveLanguageWheel 
                    scores={result.scores}
                    primary={result.profile.primary}
                  />
                  <div className="text-center text-sm text-gray-600 mt-4">
                    Your primary love language ({result.profile.primary}) is highlighted. Distance from center indicates importance.
                  </div>
                </div>

                {/* Scores Graph */}
                <LoveLanguageGraph 
                  scores={result.scores}
                  title="Your Love Language Scores"
                />

                {/* How You Feel Loved */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-blue-800 mb-3 flex items-center">
                    <MdFavorite className="mr-2" /> How You Feel Most Loved
                  </h4>
                  <p className="text-gray-700 mb-4">
                    {result.descriptions[result.profile.primary]}
                  </p>
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-800 mb-2">Your Specific Needs:</h5>
                    <ul className="space-y-2">
                      {result.needs[result.profile.primary].map((need, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">❤️</span>
                          <span className="text-gray-700">{need}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* How to Love Someone Like You */}
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-pink-800 mb-3 flex items-center">
                    <MdTipsAndUpdates className="mr-2" /> How to Love Someone Like You
                  </h4>
                  <p className="text-gray-700 mb-4">
                    Share these tips with your partner or loved ones:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.partnerTips[result.profile.primary].map((tip, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg">
                        <div className="flex items-start">
                          <span className="text-pink-500 text-lg mr-2">•</span>
                          <span className="text-gray-700">{tip}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How You Express Love */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-green-800 mb-3 flex items-center">
                    <MdEmojiPeople className="mr-2" /> How You Naturally Express Love
                  </h4>
                  <div className="space-y-3">
                    {result.expressions[result.profile.primary].map((expression, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg">
                        <div className="flex items-start">
                          <span className="text-green-500 mr-2">✨</span>
                          <span className="text-gray-700">{expression}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Misunderstandings */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-yellow-800 mb-3 flex items-center">
                    <MdWarning className="mr-2" /> Common Misunderstandings
                  </h4>
                  <p className="text-gray-700 mb-4">
                    People might misunderstand when you:
                  </p>
                  <div className="space-y-3">
                    {result.commonMisunderstandings[result.profile.primary].map((misunderstanding, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg">
                        <div className="flex items-start">
                          <span className="text-yellow-500 mr-2">⚠️</span>
                          <span className="text-gray-700">{misunderstanding}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Communication Tips */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-purple-800 mb-3 flex items-center">
                    <MdChat className="mr-2" /> Communication Tips
                  </h4>
                  <p className="text-gray-700 mb-4">
                    How to communicate with someone whose love language is {result.profileName}:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.communicationTips[result.profile.primary].map((tip, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg">
                        <div className="flex items-start">
                          <span className="text-purple-500 text-lg mr-2">•</span>
                          <span className="text-gray-700">{tip}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All Love Languages */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">Understanding All Five Love Languages</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-2">W</div>
                        <h5 className="font-semibold text-gray-800">Words of Affirmation</h5>
                      </div>
                      <p className="text-sm text-gray-600">{result.descriptions.WA}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-2">A</div>
                        <h5 className="font-semibold text-gray-800">Acts of Service</h5>
                      </div>
                      <p className="text-sm text-gray-600">{result.descriptions.AS}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-2">G</div>
                        <h5 className="font-semibold text-gray-800">Receiving Gifts</h5>
                      </div>
                      <p className="text-sm text-gray-600">{result.descriptions.RG}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold mr-2">Q</div>
                        <h5 className="font-semibold text-gray-800">Quality Time</h5>
                      </div>
                      <p className="text-sm text-gray-600">{result.descriptions.QT}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mr-2">P</div>
                        <h5 className="font-semibold text-gray-800">Physical Touch</h5>
                      </div>
                      <p className="text-sm text-gray-600">{result.descriptions.PT}</p>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg shadow-sm border border-pink-200">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-2">❤️</div>
                        <h5 className="font-semibold text-gray-800">Your Profile</h5>
                      </div>
                      <p className="text-sm text-gray-600">
                        Understanding love languages helps improve communication and emotional connection in all relationships.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Options */}
              <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-xl p-6">
                <h4 className="font-bold text-xl text-gray-800 mb-4 text-center">
                  <MdDownload className="inline mr-2" />
                  Download Your Love Language Report
                </h4>
                <p className="text-gray-600 text-center mb-6">
                  Choose your preferred format to save your relationship assessment
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={downloadAsPDF}
                    disabled={isDownloading}
                    className="flex flex-col items-center justify-center p-6 bg-white border border-pink-300 rounded-xl hover:bg-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaFilePdf className="text-4xl text-pink-500 mb-3" />
                    <span className="font-semibold text-gray-800">PDF Report</span>
                    <span className="text-sm text-gray-500 mt-1">Complete analysis</span>
                    {isDownloading && (
                      <div className="mt-2 animate-spin rounded-full h-5 w-5 border-b-2 border-pink-600"></div>
                    )}
                  </button>
                  
                  <button
                    onClick={downloadAsImage}
                    disabled={isDownloading}
                    className="flex flex-col items-center justify-center p-6 bg-white border border-red-300 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaFileImage className="text-4xl text-red-500 mb-3" />
                    <span className="font-semibold text-gray-800">Image</span>
                    <span className="text-sm text-gray-500 mt-1">Visual profile</span>
                    {isDownloading && (
                      <div className="mt-2 animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
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
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
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
        <h3 className="font-bold mb-3">❤️ How Love Languages Work:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><strong>Words of Affirmation (WA):</strong> Expressing affection through spoken words, praise, or appreciation</li>
          <li><strong>Acts of Service (AS):</strong> Doing helpful things for your partner to show love</li>
          <li><strong>Receiving Gifts (RG):</strong> Feeling loved through thoughtful gifts and tokens of affection</li>
          <li><strong>Quality Time (QT):</strong> Feeling loved when receiving undivided attention and shared experiences</li>
          <li><strong>Physical Touch (PT):</strong> Feeling loved through physical affection and closeness</li>
          <li>Everyone has a primary and secondary love language</li>
          <li>30 questions measuring what makes you feel most loved</li>
          <li>Results help improve communication and connection in relationships</li>
          <li>Based on Dr. Gary Chapman&apos;s relationship research</li>
          <li>Used worldwide for improving romantic, family, and friendship relationships</li>
          <li>Your privacy is protected - no data is stored on our servers</li>
        </ul>
      </div>
    </div>
  );
}