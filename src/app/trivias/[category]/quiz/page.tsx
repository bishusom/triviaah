// src/app/trivias/[category]/quiz/page.tsx
import QuizGame from '@/components/trivias/QuizGame';
import { getCategoryQuestions, getSubcategoryQuestions, Question } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import { Timer, ShieldQuestionMark, Trophy, Play } from 'lucide-react';

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
    ? `${formattedSubcategory} ${formattedCategory} Quiz | Triviaah`
    : `${formattedCategory} Quiz | Triviaah`;

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
      url: `https://triviaah.com/trivias/${category}/quiz${subcategory ? `?subcategory=${encodeURIComponent(subcategory)}` : ''}`,
      siteName: 'Triviaah',
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
      canonical: `https://triviaah.com/trivias/${category}/quiz${subcategory ? `?subcategory=${encodeURIComponent(subcategory)}` : ''}`,
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

  const quizUrl = `https://triviaah.com/trivias/${category}/quiz${subcategory ? `?subcategory=${encodeURIComponent(subcategory)}` : ''}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://triviaah.com/#organization",
        "name": "Triviaah",
        "url": "https://triviaah.com/",
        "description": "Triviaah offers engaging and educational trivia games and puzzles for everyone.",
        "logo": {
          "@type": "ImageObject",
          "url": "https://triviaah.com/logo.png",
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
          "@id": "https://triviaah.com/#website"
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
          "url": "https://triviaah.com/imgs/quiz-og.webp",
          "width": 1200,
          "height": 630
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://triviaah.com/#website",
        "url": "https://triviaah.com/",
        "name": "Triviaah",
        "description": "Engaging trivia games and puzzles for everyone",
        "publisher": {
          "@id": "https://triviaah.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://triviaah.com/search?q={search_term_string}"
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
          "@id": "https://triviaah.com/#organization"
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
            "item": "https://triviaah.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Trivia Categories",
            "item": "https://triviaah.com/trivias"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": formattedCategory,
            "item": `https://triviaah.com/trivias/${category}`
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
    <div className="mt-12 bg-transparent"> {/* Add bg-transparent here */}
      <h2 className="text-3xl font-bold text-white text-center mb-8">Quiz Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            icon: "🎯",
            title: "About This Quiz",
            description: `This ${formattedSubcategory ? `${formattedSubcategory} ` : ''}${formattedCategory} quiz contains ${questionCount} multiple-choice questions designed to test your knowledge across various difficulty levels.`
          },
          {
            icon: "⚡",
            title: "How to Play",
            description: "Read each question carefully and select the answer you believe is correct. You'll receive immediate feedback after each question and can track your progress throughout."
          },
          {
            icon: "🏆",
            title: "Scoring System",
            description: "Each correct answer earns you points. There's no penalty for wrong answers, so feel free to make educated guesses! Track your improvement over time."
          },
          {
            icon: "📚",
            title: "Learning Objectives",
            description: `This quiz helps you expand your knowledge of ${formattedCategory.toLowerCase()}${formattedSubcategory ? `, particularly in ${formattedSubcategory.toLowerCase()}` : ''}. Perfect for studying or just learning something new!`
          }
        ].map((item, index) => (
          <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">{item.icon}</span>
              </div>
              <h3 className="font-semibold text-lg text-white">{item.title}</h3>
            </div>
            <p className="text-gray-300">{item.description}</p>
          </div>
        ))}
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

    const formattedCategory = category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const formattedSubcategory = subcategory 
      ? subcategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      : null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-4">
        <div className="max-w-4xl mx-auto px-4">
          {/* Inject structured data directly */}
          <Script
            id="quiz-structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          
        {/* Quiz Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Play className="text-2xl sm:text-3xl text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                  {formattedSubcategory ? formattedSubcategory : formattedCategory}
                </h1>
                <p className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-lg sm:text-xl md:text-2xl font-semibold">
                  Quiz Challenge
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-base sm:text-lg mb-6 max-w-2xl mx-auto">
            {formattedSubcategory 
              ? `Test your ${formattedSubcategory.toLowerCase()} knowledge`
              : `Master ${formattedCategory.toLowerCase()} trivia`
            }
          </p>

          {/* Quiz Stats */}
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
              <ShieldQuestionMark className="text-xl text-cyan-400" />
              <div className="text-left">
                <div className="text-white font-bold text-sm">{questions.length}</div>
                <div className="text-gray-400 text-xs">Questions</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
              <Timer className="text-xl text-yellow-400" />
              <div className="text-left">
                <div className="text-white font-bold text-sm">15s</div>
                <div className="text-gray-400 text-xs">Per Question</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
              <Trophy className="text-xl text-green-400" />
              <div className="text-left">
                <div className="text-white font-bold text-sm">Free</div>
                <div className="text-gray-400 text-xs">To Play</div>
              </div>
            </div>
          </div>
        </div>

          {/* Quiz Game Component */}
          <div className="mb-8">
            <QuizGame 
              initialQuestions={questions} 
              category={category}
              subcategory={subcategory}
              quizConfig={{}}
              quizType="trivias"
            />
          </div>

          {/* FAQ Section */}
          <QuizFAQ 
            category={category} 
            subcategory={subcategory} 
            questionCount={questions.length} 
          />
        </div>  
      </div>
    );
  } catch (error) {
    console.error('Error loading quiz page:', error);
    return notFound();
  }
}