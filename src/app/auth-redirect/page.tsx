// app/auth-redirect/page.tsx (Simplest fix)
'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      const redirectTo = sessionStorage.getItem('quizAfterAuth');
      const savedGameState = sessionStorage.getItem('quizGameState');
      
      // Clean up
      sessionStorage.removeItem('quizAfterAuth');
      
      if (redirectTo === 'quiz' && savedGameState) {
        try {
          const gameState = JSON.parse(savedGameState);
          // Redirect back to the quiz page with the original category
          router.push(`/quiz?category=${gameState.category}`);
        } catch (error) {
          console.error('Error parsing saved game state:', error);
          router.push('/');
        }
      } else if (redirectTo === 'summary') {
        // Redirect to quiz summary page
        const quizResult = sessionStorage.getItem('quizResult');
        if (quizResult) {
          try {
            const result = JSON.parse(quizResult);
            const queryParams = new URLSearchParams({
              score: result.score.toString(),
              correctCount: result.correctCount.toString(),
              totalQuestions: result.totalQuestions.toString(),
              timeUsed: result.timeUsed.toString(),
              category: result.category
            });
            router.push(`/quiz-summary?${queryParams.toString()}`);
          } catch (error) {
            console.error('Error parsing quiz result:', error);
            router.push('/');
          }
        } else {
          router.push('/');
        }
      } else {
        // Default redirect to home
        router.push('/');
      }
    } else if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Completing authentication...</p>
      </div>
    </div>
  );
}