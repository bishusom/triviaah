// MatrixIQTestComponent.tsx (simplified)
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { QuestionManager, generateQuestions, calculateScore, getIQCategory } from '@/lib/iq-and-personality-tests/matrixiq/matrixiq-logic';
import type { UserAnswer, TestScore } from '@/lib/iq-and-personality-tests/matrixiq/matrixiq-types';

import { IntroScreen } from './IntroScreen';
import { QuestionScreen } from './QuestionScreen';
import { ResultsScreen } from './ResultsScreen';

const MatrixIQTestComponent: React.FC = () => {
  const [questionManager] = useState(() => new QuestionManager());
  const questions = generateQuestions();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [complete, setComplete] = useState(false);
  const [score, setScore] = useState<TestScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questionData, setQuestionData] = useState<ReturnType<typeof questionManager.getQuestionData> | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);
  const startTimes = useRef<number[]>(Array(questions.length).fill(Date.now()));

  // Load question data
  useEffect(() => {
    if (!showIntro && !complete) {
      const question = questions[currentIndex];
      const data = questionManager.getQuestionData(
        question.id,
        question.difficulty,
        question.patternType
      );
      setQuestionData(data);
    }
  }, [currentIndex, showIntro, complete]);

  const handleAnswer = (optionIndex: number) => {
    if (!questionData) return;
    
    const timeTaken = (Date.now() - startTimes.current[currentIndex]) / 1000;
    const isCorrect = questionManager.checkAnswer(questions[currentIndex].id, optionIndex);
    
    const userAnswer: UserAnswer = {
      questionId: questions[currentIndex].id,
      selectedAnswer: optionIndex,
      isCorrect,
      timeTaken,
      skipped: false
    };
    
    const updatedAnswers = [...answers, userAnswer];
    setAnswers(updatedAnswers);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      startTimes.current[currentIndex + 1] = Date.now();
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setScore(calculateScore(updatedAnswers, questions));
        setComplete(true);
        setIsLoading(false);
      }, 800);
    }
  };

  const handleSkip = () => {
    const timeTaken = (Date.now() - startTimes.current[currentIndex]) / 1000;
    
    const userAnswer: UserAnswer = {
      questionId: questions[currentIndex].id,
      selectedAnswer: -1,
      isCorrect: false,
      timeTaken,
      skipped: true
    };
    
    const updatedAnswers = [...answers, userAnswer];
    setAnswers(updatedAnswers);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      startTimes.current[currentIndex + 1] = Date.now();
    } else {
      setScore(calculateScore(updatedAnswers, questions));
      setComplete(true);
    }
  };

  const reset = () => {
    questionManager.clear();
    setCurrentIndex(0);
    setAnswers([]);
    setComplete(false);
    setScore(null);
    setShowIntro(true);
    setQuestionData(null);
    startTimes.current = Array(questions.length).fill(Date.now());
  };

  if (showIntro) {
    return <IntroScreen onStart={() => {
      setShowIntro(false);
      startTimes.current = Array(questions.length).fill(Date.now());
    }} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
        <h3 className="text-2xl font-bold text-gray-800 mt-6">Analyzing Your Results</h3>
        <p className="text-gray-600 mt-2">Calculating your IQ estimate...</p>
      </div>
    );
  }

  if (complete && score) {
    return <ResultsScreen score={score} onRetake={reset} resultsRef={resultsRef} />;
  }

  if (questionData) {
    return (
      <QuestionScreen
        question={questions[currentIndex]}
        questionData={questionData}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
        onPrevious={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
        onRestart={reset}
      />
    );
  }

  return null;
};

export default MatrixIQTestComponent;