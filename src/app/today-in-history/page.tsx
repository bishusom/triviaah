'use cluent'
import QuizGame from '@/components/trivias/QuizGame';
import { getTodaysHistoryQuestions } from '@/lib/firebase';
import MuteButton from '@/components/MuteButton';
import { notFound } from 'next/navigation';
import Script from 'next/script';


export default async function TodayInHistoryPage() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Pre-fetch questions on the server for better UX
  let questions;
  try {
    questions = await getTodaysHistoryQuestions(10);
  } catch (error) {
    return notFound();
  }

  if (!questions || questions.length === 0) {
    return notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": `On This Day in History - ${formattedDate}`,
    "description": `Historical events quiz for ${formattedDate}`,
    "about": "History, Historical Events, Famous Dates",
    "educationalAlignment": {
      "@type": "AlignmentObject",
      "alignmentType": "educationalSubject",
      "targetName": "History"
    },
    "hasPart": questions.map((q, index) => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.correct
      },
      "position": index + 1
    }))
  };

  return (
    <>
      <Script
        id="today-in-history-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="no-ads-page">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            On This Day in History
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {formattedDate} • Daily Historical Events Quiz
          </p>
          <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
            <MuteButton />
          </div>
          
          {/* Pass server-fetched questions as initial data */}
          <QuizGame 
            initialQuestions={questions} 
            category="today-in-history" 
          />
        </div>
      </div>
    </>
  );
}