import QuizGame from '@/components/trivias/QuizGame';
import { getCategoryQuestions, getSubcategoryQuestions, Question } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';

interface QuizPageProps {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: QuizPageProps): Promise<Metadata> {
  const { category } = await params;
  const searchParamsObj = await searchParams;
  const subcategory = searchParamsObj?.subcategory as string | undefined;
  
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const formattedSubcategory = subcategory 
    ? subcategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : null;

  const title = formattedSubcategory 
    ? `${formattedSubcategory} ${formattedCategory} Quiz | Elite Trivias`
    : `${formattedCategory} Quiz | Elite Trivias`;

  const description = formattedSubcategory
    ? `Test your ${formattedSubcategory.toLowerCase()} knowledge with our ${formattedCategory.toLowerCase()} quiz. Challenge yourself with 10 multi-choice questions to beat the highscore. Invite your friends on social media if they can beat your scores!`
    : `Test your knowledge with our ${formattedCategory.toLowerCase()} quiz. Challenge yourself with 10 multi-choice questions to beat the highscore. Invite your friends on social media if they can beat your scores!`;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    keywords: [
      formattedSubcategory ? `${formattedSubcategory.toLowerCase()} quiz` : `${formattedCategory.toLowerCase()} quiz`,
      'trivia questions',
      'knowledge test',
      'free online quiz',
      'multiple choice questions',
      formattedCategory.toLowerCase(),
      ...(formattedSubcategory ? [formattedSubcategory.toLowerCase()] : [])
    ],
    openGraph: {
      title,
      description: formattedSubcategory
        ? `Can you answer these ${formattedSubcategory.toLowerCase()} ${formattedCategory.toLowerCase()} questions? Take the challenge!`
        : `Can you answer these ${formattedCategory.toLowerCase()} questions? Take the challenge!`,
      url: `https://elitetrivias.com/trivias/${category}/quiz${subcategory ? `?subcategory=${encodeURIComponent(subcategory)}` : ''}`,
      siteName: 'Elite Trivias',
      type: 'website',
      images: [
        {
          url: '/imgs/quiz-og.webp',
          width: 1200,
          height: 630,
          alt: `${formattedCategory} Quiz Challenge`
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: formattedSubcategory 
        ? `${formattedSubcategory} ${formattedCategory} Quiz Challenge`
        : `${formattedCategory} Quiz Challenge`,
      description: formattedSubcategory
        ? `How well do you know ${formattedSubcategory.toLowerCase()} ${formattedCategory.toLowerCase()}? Test yourself!`
        : `How well do you know ${formattedCategory.toLowerCase()}? Test yourself!`,
      images: ['/imgs/quiz-og.webp'],
    },
    alternates: {
      canonical: `https://elitetrivias.com/trivias/${category}/quiz${subcategory ? `?subcategory=${encodeURIComponent(subcategory)}` : ''}`,
    }
  };
}

// Helper function to generate comprehensive structured data
function generateStructuredData(questions: Question[], category: string, subcategory?: string) {
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const formattedSubcategory = subcategory 
    ? subcategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : null;

  const quizName = formattedSubcategory 
    ? `${formattedSubcategory} ${formattedCategory} Quiz`
    : `${formattedCategory} Quiz`;

  const quizUrl = `https://elitetrivias.com/trivias/${category}/quiz${subcategory ? `?subcategory=${encodeURIComponent(subcategory)}` : ''}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://elitetrivias.com/#organization",
        "name": "Elite Trivias",
        "url": "https://elitetrivias.com/",
        "description": "Elite Trivias offers engaging and educational trivia games and puzzles for everyone.",
        "logo": {
          "@type": "ImageObject",
          "url": "https://elitetrivias.com/logo.png",
          "width": 200,
          "height": 60
        },
        "sameAs": [
          "https://twitter.com/elitetrivias",
          "https://www.facebook.com/elitetrivias",
          "https://www.instagram.com/elitetrivias"
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${quizUrl}/#webpage`,
        "url": quizUrl,
        "name": quizName,
        "description": `Test your knowledge with our ${formattedCategory.toLowerCase()} quiz. Challenge yourself with ${questions.length} multiple-choice questions!`,
        "isPartOf": {
          "@id": "https://elitetrivias.com/#website"
        },
        "about": {
          "@id": `${quizUrl}/#quiz`
        },
        "datePublished": "2024-01-01T00:00:00+00:00",
        "dateModified": new Date().toISOString(),
        "breadcrumb": {
          "@id": `${quizUrl}/#breadcrumb`
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://elitetrivias.com/imgs/quiz-og.webp",
          "width": 1200,
          "height": 630
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://elitetrivias.com/#website",
        "url": "https://elitetrivias.com/",
        "name": "Elite Trivias",
        "description": "Engaging trivia games and puzzles for everyone",
        "publisher": {
          "@id": "https://elitetrivias.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://elitetrivias.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Quiz",
        "@id": `${quizUrl}/#quiz`,
        "name": quizName,
        "description": `Test your ${formattedCategory.toLowerCase()} knowledge with ${questions.length} multiple-choice questions. Challenge yourself and beat the high score!`,
        "url": quizUrl,
        "numberOfQuestions": questions.length,
        "educationalLevel": "Beginner",
        "assesses": formattedSubcategory ? `${formattedSubcategory} ${formattedCategory}` : formattedCategory,
        "educationalAlignment": {
          "@type": "AlignmentObject",
          "alignmentType": "educationalSubject",
          "educationalFramework": "General Knowledge",
          "targetName": formattedSubcategory ? `${formattedSubcategory} ${formattedCategory}` : formattedCategory
        },
        "hasPart": questions.map((question, index) => ({
          "@type": "Question",
          "position": index + 1,
          "name": question.question,
          "eduQuestionType": "Multiple choice",
          "text": question.question,
          "suggestedAnswer": question.options.map((answer: string) => ({
            "@type": "Answer",
            "text": answer
          })),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": question.correct
          }
        })),
        "publisher": {
          "@id": "https://elitetrivias.com/#organization"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${quizUrl}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://elitetrivias.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Trivia Categories",
            "item": "https://elitetrivias.com/trivias"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": formattedCategory,
            "item": `https://elitetrivias.com/trivias/${category}`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Quiz",
            "item": quizUrl
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How many questions are in this quiz?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `This quiz contains ${questions.length} multiple-choice questions covering various aspects of ${formattedCategory.toLowerCase()}${formattedSubcategory ? `, specifically focusing on ${formattedSubcategory.toLowerCase()}` : ''}.`
            }
          },
          {
            "@type": "Question",
            "name": "Is this quiz completely free to play?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! All our quizzes are completely free to play. No registration required, no hidden fees, and no subscriptions. You can start playing immediately and retake the quiz as many times as you want."
            }
          },
          {
            "@type": "Question",
            "name": "Can I see the correct answers after completing the quiz?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! After completing the quiz, you'll receive immediate feedback on your performance, including which questions you got right and wrong. You'll also see the correct answers with explanations to help you learn."
            }
          },
          {
            "@type": "Question",
            "name": "What happens if I leave the quiz halfway through?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Your progress is saved in your browser's local storage. If you accidentally close the tab or navigate away, you can return and resume where you left off. However, if you clear your browser data, your progress will be lost."
            }
          },
          {
            "@type": "Question",
            "name": "Can I share my results with friends?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! After completing the quiz, you'll have the option to share your score on social media and challenge your friends to beat it. This makes learning competitive and fun!"
            }
          },
          {
            "@type": "Question",
            "name": "Are there different difficulty levels?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Our ${formattedCategory.toLowerCase()} quiz includes questions of varying difficulty levels, from beginner to expert. This ensures that both newcomers and ${formattedCategory.toLowerCase()} enthusiasts will find the quiz challenging and engaging.`
            }
          }
        ]
      }
    ]
  };

  return structuredData;
}

// Component for FAQ Section
function QuizFAQ({ category, subcategory, questionCount }: { category: string, subcategory?: string, questionCount: number }) {
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const formattedSubcategory = subcategory 
    ? subcategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : null;

  return (
    <div className="mt-12 bg-gray-50 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Quiz Information & FAQs</h2>
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-2">About This Quiz</h3>
          <p className="text-gray-700">
            This {formattedSubcategory ? `${formattedSubcategory} ` : ''}{formattedCategory} quiz contains {questionCount} multiple-choice questions 
            designed to test your knowledge across various difficulty levels. Whether you&apos;re a beginner or an expert, 
            you&apos;ll find challenging questions that will help you learn and improve your understanding of {formattedCategory.toLowerCase()}.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-2">How to Play</h3>
          <p className="text-gray-700">
            Read each question carefully and select the answer you believe is correct. You&apos;ll receive immediate 
            feedback after each question. Your score is calculated based on the number of correct answers, and 
            you can track your progress throughout the quiz.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-2">Scoring System</h3>
          <p className="text-gray-700">
            Each correct answer earns you points. There&apos;s no penalty for wrong answers, so feel free to make 
            educated guesses! At the end of the quiz, you&apos;ll see your total score and can compare it with 
            previous attempts to track your improvement.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-2">Learning Objectives</h3>
          <p className="text-gray-700">
            This quiz is designed to help you expand your knowledge of {formattedCategory.toLowerCase()}{formattedSubcategory ? `, particularly in the area of ${formattedSubcategory.toLowerCase()}` : ''}. 
            Whether you&apos;re studying for academic purposes, preparing for a trivia competition, or just want to 
            learn something new, this quiz provides an engaging way to test and improve your knowledge.
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function QuizPage({
  params,
  searchParams,
}: QuizPageProps) {
  try {
    const { category } = await params;
    const searchParamsObj = await searchParams;
    const subcategory = searchParamsObj?.subcategory as string | undefined;
    
    if (!category || typeof category !== 'string') {
      console.error('Invalid category parameter:', category);
      return notFound();
    }

    let questions;
    if (subcategory) {
      questions = await getSubcategoryQuestions(category, subcategory, 10);
    } else {
      questions = await getCategoryQuestions(category, 10);
    }

    if (!questions || questions.length === 0) {
      console.error(`No questions found for category: ${category}${subcategory ? `, subcategory: ${subcategory}` : ''}`);
      return notFound();
    }

    // Generate comprehensive structured data
    const structuredData = generateStructuredData(questions, category, subcategory);

    return (
      <div className="quiz-container max-w-4xl mx-auto px-4 py-8">
        <h1 className="sr-only">
          {subcategory 
            ? `${subcategory.replace(/-/g, ' ')} ${category.replace(/-/g, ' ')} Questions - Elite Trivias`
            : `${category.replace(/-/g, ' ')} Questions - Elite Trivias`
          }
        </h1>
        
        {/* Inject structured data directly */}
        <Script
          id="quiz-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <QuizGame 
          initialQuestions={questions} 
          category={category}
          subcategory={subcategory}
          quizConfig={{}}
          quizType="trivias"
        />

        {/* FAQ Section */}
        <QuizFAQ 
          category={category} 
          subcategory={subcategory} 
          questionCount={questions.length} 
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading quiz page:', error);
    return notFound();
  }
}