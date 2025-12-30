import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  CAPAQuestion, 
  CAPAScore, 
  CAPAResult, 
  UserAnswer,
  CAPADomain 
} from '@/lib/iq-and-personality-tests/capa/capa-types';
import {
  questions,
  calculateCAPAScores,
  getCognitiveProfile,
  getDomainDescription,
  checkMemoryAnswer
} from '@/lib/iq-and-personality-tests/capa/capa-logic';
import { 
  Brain, 
  Clock, 
  Trophy, 
  Target, 
  Lightbulb,
  Zap,
  BookOpen,
  Calculator,
  Map,
  Download,
  RotateCw,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { PDFDocument, rgb } from 'pdf-lib';

interface CAPATestComponentProps {
  userId?: string;
  showTutorial?: boolean;
}

interface TestSession {
  startTime: Date;
  answers: UserAnswer[];
  completed: boolean;
}

const CAPATestComponent: React.FC<CAPATestComponentProps> = ({ 
  showTutorial = true 
}) => {
  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [testSession, setTestSession] = useState<TestSession>({
    startTime: new Date(),
    answers: [],
    completed: false
  });
  const [score, setScore] = useState<CAPAScore | null>(null);
  const [result, setResult] = useState<CAPAResult | null>(null);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(showTutorial);
  const [timer, setTimer] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showBreak, setShowBreak] = useState(false);
  const [breakCountdown, setBreakCountdown] = useState(30); // seconds
  const breakIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [memoryStimulusVisible, setMemoryStimulusVisible] = useState(true);
  const [memoryInput, setMemoryInput] = useState('');

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = useCallback((answer: string | null, skipped = false) => {
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    const isCorrect = checkAnswer(currentQuestion, answer);

    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      answer: answer || '',
      timeTaken,
      isCorrect,
      skipped,
      confidence: 3
    };

    const updatedAnswers = [...answers, userAnswer];
    setAnswers(updatedAnswers);
    setTestSession(prev => ({ ...prev, answers: updatedAnswers }));

    // === MEMORY QUESTION SPECIAL FLOW ===
    if (currentQuestion.domain === 'memory' && memoryStimulusVisible) {
      // This was the first click: hide stimulus and show input box
      setMemoryStimulusVisible(false);
      setMemoryInput('');
      return; // don't go to next question yet
    }

    // === NORMAL FLOW (or second click on memory question) ===
    if (currentQuestion.domain === 'memory') {
      // User just submitted their recall → validate
      const finalAnswer = memoryInput.trim();
      const correct = checkMemoryAnswer(currentQuestion.id, finalAnswer);

      // Override the temporary answer with the real recalled one
      const correctedAnswers = answers.map(a =>
        a.questionId === currentQuestion.id
          ? { ...a, answer: finalAnswer, isCorrect: correct }
          : a
      );
      setAnswers(correctedAnswers);
      setTestSession(prev => ({ ...prev, answers: correctedAnswers }));
    }

    // Check for break
    const answeredCount = answers.length + (currentQuestion.domain === 'memory' ? 1 : 0);
    if (answeredCount % 12 === 0 && answeredCount < questions.length) {
      triggerBreakIfNeeded();
      return;
    }

    // Next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
      setTimer(null);
      setMemoryStimulusVisible(true); // reset for next memory question
      setMemoryInput('');
    } else {
      completeTest();
    }
  }, [currentQuestion, currentQuestionIndex, questionStartTime, answers, memoryStimulusVisible, memoryInput]);

  const triggerBreakIfNeeded = () => {
    const answeredCount = answers.length + 1; // +1 because we just answered one
    if (answeredCount > 0 && answeredCount % 12 === 0 && answeredCount < questions.length) {
      setShowBreak(true);
      setBreakCountdown(30);
    }
  };

  // Function to continue after break
  const handleContinueAfterBreak = () => {
    setShowBreak(false);
    setBreakCountdown(30);
    if (breakIntervalRef.current) clearTimeout(breakIntervalRef.current);
  };

  // Timer for timed questions
  useEffect(() => {
    if (currentQuestion?.timeLimit) {
      const start = Date.now();
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - start) / 1000);
        setTimer(currentQuestion.timeLimit! - elapsed);
        
        if (elapsed >= currentQuestion.timeLimit!) {
          handleAnswer(null, true);
          clearInterval(interval);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
    return () => {};
  }, [currentQuestionIndex, currentQuestion, handleAnswer]);

  // Add this useEffect for the break countdown
  useEffect(() => {
    if (showBreak && breakCountdown > 0) {
      breakIntervalRef.current = setTimeout(() => {
        setBreakCountdown(prev => prev - 1);
      }, 1000);
    } else if (showBreak && breakCountdown === 0) {
      handleContinueAfterBreak();
    }

    return () => {
      if (breakIntervalRef.current) clearTimeout(breakIntervalRef.current);
    };
  }, [showBreak, breakCountdown]);

  const checkAnswer = (question: CAPAQuestion, answer: string | null): boolean => {
    if (question.answerType === 'multiple_choice' && question.correctIndex !== undefined) {
      return answer === question.options![question.correctIndex];
    }
    // Add other answer type checks
    return false;
  };

  const completeTest = async () => {
    setIsLoading(true);
    
    // Calculate total time
    const totalTime = (Date.now() - testSession.startTime.getTime()) / 1000;
    
    // Calculate scores
    const calculatedScore = calculateCAPAScores(answers, totalTime);
    const profile = getCognitiveProfile(calculatedScore);
    
    setScore(calculatedScore);
    setResult(profile);
    setIsTestComplete(true);
    
    setIsLoading(false);
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTestSession({
      startTime: new Date(),
      answers: [],
      completed: false
    });
    setScore(null);
    setResult(null);
    setIsTestComplete(false);
    setShowInstructions(true);
    setTimer(null);
  };

  // Download functions
  const downloadReport = async (format: 'pdf' | 'image' | 'text') => {
    if (!resultsRef.current || !result || !score) return;
    
    setIsLoading(true);
    
    try {
      switch (format) {
        case 'pdf':
          await downloadAsPDF();
          break;
        case 'image':
          await downloadAsImage();
          break;
        case 'text':
          downloadAsText();
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAsPDF = async () => {
    const element = resultsRef.current;
    if (!element || !result || !score) return;
    
    setIsLoading(true);
    
    try {
      const canvas = await html2canvas(element, { 
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });
      
      const pdfDoc = await PDFDocument.create();
      
      // Set PDF metadata
      pdfDoc.setTitle(`CAPA Cognitive Profile Report - ${result.profileType}`);
      pdfDoc.setAuthor('Triviaah');
      pdfDoc.setSubject('Cognitive Abilities Profile Assessment');
      pdfDoc.setKeywords(['CAPA', 'Cognitive', 'Assessment', 'Triviaah']);
      pdfDoc.setProducer('triviaah.com');
      pdfDoc.setCreator('Triviaah Brainwave Assessment Tool');
      
      // Calculate page dimensions (A4 at 96 DPI)
      const pageWidth = 595.28; // A4 width in points
      const pageHeight = 841.89; // A4 height in points
      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');
      const pngImage = await pdfDoc.embedPng(imgData);
      
      // Calculate scaling to fit page while maintaining aspect ratio
      const scaleX = pageWidth / canvas.width;
      const scaleY = pageHeight / canvas.height;
      const scale = Math.min(scaleX, scaleY) * 0.9; // 90% scale to add margins
      
      const scaledWidth = canvas.width * scale;
      const scaledHeight = canvas.height * scale;
      
      // Center the image on the page
      const x = (pageWidth - scaledWidth) / 2;
      const y = (pageHeight - scaledHeight) / 2;
      
      page.drawImage(pngImage, {
        x,
        y,
        width: scaledWidth,
        height: scaledHeight,
      });
      
      // Add footer text
      const fontSize = 8;
      const footerText = `Generated by triviaah.com • ${new Date().toLocaleDateString()} • Profile: ${result.profileType}`;
      
      page.drawText(footerText, {
        x: 50,
        y: 30,
        size: fontSize,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      // Save as base64 and convert to Uint8Array
      const base64PDF = await pdfDoc.saveAsBase64({ dataUri: false });
      const byteCharacters = atob(base64PDF);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CAPA_Report_${result.profileType}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAsImage = async () => {
    const element = resultsRef.current;
    if (!element) return;
    
    const canvas = await html2canvas(element, { 
      scale: 2,
      backgroundColor: '#ffffff'
    });
    
    const link = document.createElement('a');
    link.download = `CAPA_Profile_${result?.profileType}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const downloadAsText = () => {
    if (!result || !score) return;
    
    const report = generateTextReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CAPA_Report_${result?.profileType}_${Date.now()}.txt`;
    link.click();
  };

  const generateTextReport = (): string => {
    if (!result || !score) return '';
    
    return `COGNITIVE ABILITIES PROFILE ASSESSMENT (CAPA)
==================================================
Report Generated: ${new Date().toLocaleDateString()}
Profile Type: ${result.name} (${result.profileType})
Cognitive Percentile: ${score.percentile}%
Confidence Band: ${score.confidenceBand[0]}%-${score.confidenceBand[1]}%

COGNITIVE DOMAIN SCORES:
- Verbal Intelligence: ${score.verbal}
- Numerical Intelligence: ${score.numerical}
- Spatial Intelligence: ${score.spatial}
- Working Memory: ${score.memory}
- Logical Reasoning: ${score.reasoning}
- Processing Speed: ${score.processing}

PROFILE DESCRIPTION:
${result.description}

COGNITIVE STRENGTHS:
${result.cognitiveStrengths.map(s => `• ${s}`).join('\n')}

LEARNING STYLES:
${result.learningStyles.map(s => `• ${s}`).join('\n')}

CAREER SUGGESTIONS:
${result.careerSuggestions.map(s => `• ${s}`).join('\n')}

FAMOUS SIMILAR PROFILES:
${result.famousSimilarProfiles.map(p => `• ${p}`).join('\n')}

==================================================
Disclaimer: This assessment is for self-discovery and
educational purposes only. It is not a clinical evaluation.
`;
  };

  // Render components
  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const isMemoryQuestion = currentQuestion.domain === 'memory';

    return (
      <div className="relative max-w-3xl mx-auto p-4 md:p-6 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Question header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                currentQuestion.domain === 'verbal' ? 'bg-blue-100 text-blue-600' :
                currentQuestion.domain === 'numerical' ? 'bg-green-100 text-green-600' :
                currentQuestion.domain === 'spatial' ? 'bg-purple-100 text-purple-600' :
                currentQuestion.domain === 'memory' ? 'bg-yellow-100 text-yellow-600' :
                currentQuestion.domain === 'reasoning' ? 'bg-red-100 text-red-600' :
                'bg-indigo-100 text-indigo-600'
              }`}>
                {currentQuestion.domain === 'verbal' && <BookOpen size={20} />}
                {currentQuestion.domain === 'numerical' && <Calculator size={20} />}
                {currentQuestion.domain === 'spatial' && <Map size={20} />}
                {currentQuestion.domain === 'memory' && <Brain size={20} />}
                {currentQuestion.domain === 'reasoning' && <Lightbulb size={20} />}
                {currentQuestion.domain === 'processing' && <Zap size={20} />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {getDomainDescription(currentQuestion.domain).name}
                </h3>
                <p className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>
            
            {timer !== null && (
              <div className={`px-3 py-1 rounded-full font-medium ${
                timer < 10 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                <Clock size={16} className="inline mr-2" />
                {timer}s
              </div>
            )}
          </div>

        {/* Question content */}    
        <div className="mb-8">
          {currentQuestion.instruction && (
            <p className="text-gray-600 mb-4 italic">{currentQuestion.instruction}</p>
          )}

          {/* MEMORY STIMULUS PHASE */}
          {isMemoryQuestion && memoryStimulusVisible ? (
            <div className="text-center py-12">
              <p className="text-2xl font-medium text-gray-800 mb-8">
                Memorize the following:
              </p>
              <div className="text-4xl font-bold text-indigo-600 tracking-wider">
                {currentQuestion.text}
              </div>
              <p className="mt-8 text-lg text-gray-500">
                The items will disappear in a few seconds...
              </p>

              {/* Auto-hide after time limit */}
              {currentQuestion.timeLimit && (
                <div className="mt-8 text-6xl font-black text-red-500 tabular-nums">
                  {timer}
                </div>
              )}
            </div>
          ) : isMemoryQuestion ? (
            /* MEMORY RECALL PHASE */
            <div className="space-y-6">
              <p className="text-2xl font-medium text-gray-800 text-center">
                Type exactly what you remember (in order)
              </p>
              <input
                type="text"
                autoFocus
                value={memoryInput}
                onChange={(e) => setMemoryInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnswer(memoryInput)}
                placeholder="e.g. Apple, River, Mountain, Clock, Bridge"
                className="w-full px-6 py-4 text-xl text-center border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={() => handleAnswer(memoryInput)}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xl font-medium rounded-xl hover:from-indigo-700 hover:to-blue-700 transition"
              >
                Submit Answer
              </button>
            </div>
          ) : (
            /* NORMAL QUESTION (non-memory) */
            <>
              <p className="text-xl font-medium text-gray-800 mb-6">{currentQuestion.text}</p>

              {currentQuestion.options && currentQuestion.options.length > 0 && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-2xl transition"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <span className="font-medium text-gray-600">
                            {String.fromCharCode(65 + index)}
                          </span>
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Navigation stays the same */}
        {!isMemoryQuestion && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleAnswer(null, true)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Skip
              </button>
              
              <div className="text-sm text-gray-500">
                {answers.length} / {questions.length} answered
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };


  const renderResults = () => {
    if (!result || !score) return null;

    return (
      <div className="space-y-8">
        {/* Header */}
        <div ref={resultsRef} className="space-y-8">
          {/* Profile Card */}
          <div className={`rounded-2xl p-8 text-white ${result.color}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-4">
                  <Brain size={32} className="mr-3" />
                  <h2 className="text-3xl font-bold">Cognitive Profile</h2>
                </div>
                <h3 className="text-4xl font-black mb-2">{result.name}</h3>
                <p className="text-xl opacity-90 mb-4">{result.thinkingStyle} Thinker</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
                  <div className="text-2xl font-bold">{score.percentile}%</div>
                  <div className="text-sm opacity-80">Cognitive Percentile</div>
                </div>
              </div>
              <div className="text-6xl">
                {result.profileType === 'AS' && '🧠'}
                {result.profileType === 'CS' && '✨'}
                {result.profileType === 'PI' && '⚡'}
                {result.profileType === 'BI' && '🌐'}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Lightbulb className="mr-2" size={24} />
              Profile Overview
            </h3>
            <p className="text-gray-700 text-lg">{result.description}</p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Primary Brain Areas</h4>
              <p className="text-blue-700">{result.brainAreas.join(', ')}</p>
            </div>
          </div>

          {/* Cognitive Domains Radar */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Cognitive Domain Scores</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(score).filter(([key]) => 
                !['rawTotal', 'percentile', 'cognitiveProfile', 'confidenceBand', 'testDuration'].includes(key)
              ).map(([domain, value]) => (
                <div key={domain} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                        {getDomainDescription(domain as CAPADomain).icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {getDomainDescription(domain as CAPADomain).name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {getDomainDescription(domain as CAPADomain).brainArea}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Score</span>
                      <span className="font-bold text-gray-800">{value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, value)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                <Trophy className="mr-2" size={24} />
                Cognitive Strengths
              </h3>
              <ul className="space-y-3">
                {result.cognitiveStrengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning Styles */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                <BookOpen className="mr-2" size={24} />
                Optimal Learning Styles
              </h3>
              <ul className="space-y-3">
                {result.learningStyles.map((style, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                    </div>
                    <span className="text-gray-700">{style}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Career Suggestions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Target className="mr-2" size={24} />
              Career Pathways
            </h3>
            <div className="flex flex-wrap gap-3">
              {result.careerSuggestions.map((career, index) => (
                <div
                  key={index}
                  className="bg-white border border-blue-300 rounded-lg px-4 py-2 text-blue-700 font-medium hover:bg-blue-50 transition-colors cursor-default"
                >
                  {career}
                </div>
              ))}
            </div>
          </div>

          {/* Famous Profiles */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Similar Cognitive Profiles</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {result.famousSimilarProfiles.map((person, index) => (
                <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">
                      {index === 0 ? '👨‍🔬' : index === 1 ? '👩‍💼' : '👨‍🎨'}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800">{person}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            <Download className="inline mr-3" size={28} />
            Download Your Cognitive Profile
          </h3>
          <p className="text-gray-600 text-center mb-8">
            Save your complete cognitive assessment for future reference
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => downloadReport('pdf')}
              disabled={isLoading}
              className="bg-white border-2 border-red-300 rounded-xl p-6 hover:bg-red-50 transition-all hover:shadow-lg disabled:opacity-50"
            >
              <div className="text-red-500 text-4xl mb-4">📄</div>
              <h4 className="font-bold text-gray-800 text-lg mb-2">PDF Report</h4>
              <p className="text-gray-600 text-sm">Professional format, printable</p>
            </button>
            
            <button
              onClick={() => downloadReport('image')}
              disabled={isLoading}
              className="bg-white border-2 border-green-300 rounded-xl p-6 hover:bg-green-50 transition-all hover:shadow-lg disabled:opacity-50"
            >
              <div className="text-green-500 text-4xl mb-4">🖼️</div>
              <h4 className="font-bold text-gray-800 text-lg mb-2">Image</h4>
              <p className="text-gray-600 text-sm">Perfect for sharing</p>
            </button>
            
            <button
              onClick={() => downloadReport('text')}
              disabled={isLoading}
              className="bg-white border-2 border-blue-300 rounded-xl p-6 hover:bg-blue-50 transition-all hover:shadow-lg disabled:opacity-50"
            >
              <div className="text-blue-500 text-4xl mb-4">📝</div>
              <h4 className="font-bold text-gray-800 text-lg mb-2">Text File</h4>
              <p className="text-gray-600 text-sm">Simple, portable format</p>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <button
            onClick={resetTest}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center"
          >
            <RotateCw className="mr-2" size={20} />
            Retake Assessment
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Print Results
          </button>
        </div>
      </div>
    );
  };

  const renderInstructions = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">

      <div className="space-y-6 mb-8">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Time Required</h3>
            <p className="text-gray-600">Approximately 15-20 minutes</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <Target size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">What You&#39;ll Discover</h3>
            <p className="text-gray-600">Your cognitive strengths, optimal learning styles, and career suggestions</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Important Notes</h3>
            <p className="text-gray-600">
              This is for self-discovery only. Results are not clinical diagnoses.
              All processing happens on your device for privacy.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => setShowInstructions(false)}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-lg font-medium inline-flex items-center"
        >
          Begin Assessment
          <ChevronRight className="ml-2" size={20} />
        </button>
        <p className="text-gray-500 text-sm mt-4">
          Your responses are processed locally and never leave your device
        </p>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 mb-8">
        <h3 className="font-bold text-blue-800 mb-3">Cognitive Domains Measured</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(['verbal', 'numerical', 'spatial', 'memory', 'reasoning', 'processing'] as CAPADomain[]).map(domain => (
            <div key={domain} className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl mb-2">{getDomainDescription(domain).icon}</div>
              <div className="text-sm font-medium text-gray-700">{getDomainDescription(domain).name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Main render
  if (showInstructions) {
    return renderInstructions();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress bar */}
        {!isTestComplete && !isLoading && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-gray-800">
                Cognitive Assessment
              </h2>
              <div className="text-gray-600">
                {currentQuestionIndex + 1} / {questions.length}
              </div>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <Brain size={80} className="text-blue-500 animate-pulse" />
              <div className="absolute inset-0 animate-ping">
                <Brain size={80} className="text-blue-200" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-6">Analyzing Your Results</h3>
            <p className="text-gray-600 mt-2">Generating your cognitive profile...</p>
          </div>
        ) : isTestComplete ? (
          renderResults()
        ) : (
          renderQuestion()
        )}

        {showBreak && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto text-center animate-in fade-in duration-500">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Brain size={48} className="text-indigo-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Time for a Short Break
            </h2>
            
            <p className="text-gray-600 mb-6">
              You&apos;ve completed {answers.length} questions.<br />
              Take a moment to rest your mind.
            </p>

            <div className="text-5xl font-black text-indigo-600 mb-8 tabular-nums">
              {breakCountdown}
            </div>

            <p className="text-sm text-gray-500 mb-6">
              The test will continue automatically, or you can proceed now:
            </p>

            <button
              onClick={handleContinueAfterBreak}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Continue Now
            </button>

            <div className="mt-6 text-xs text-gray-400">
              Tip: Look away from the screen, blink, and stretch!
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CAPATestComponent;