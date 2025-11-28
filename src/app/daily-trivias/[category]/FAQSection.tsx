// app/daily-trivias/[category]/FAQSection.tsx
export function FAQSection({ 
  formattedCategory, 
  hasBonusQuestion, 
  userTimezone,
  lastUpdated 
}: {
  formattedCategory: string;
  hasBonusQuestion: boolean;
  userTimezone: string;
  lastUpdated: string;
}) {
  
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How often are new quizzes available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `New ${formattedCategory.toLowerCase()} quizzes are generated every day at midnight in your local timezone (${userTimezone}).`
        }
      },
      {
        '@type': 'Question',
        name: 'Are these quizzes completely free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! All our daily trivia quizzes are 100% free to play with no registration required.'
        }
      },
      {
        '@type': 'Question',
        name: 'How is the content updated?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Our quiz content is updated daily. This page was last updated on ${new Date(lastUpdated).toLocaleDateString()}. We use server timestamps to ensure accurate timing.`
        }
      },
      ...(hasBonusQuestion ? [{
        '@type': 'Question',
        name: 'What is the bonus question?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Answer all regular questions correctly to unlock a special bonus question worth extra points!'
        }
      }] : [])
    ]
  };

  return (
    <div className="mt-12 bg-transparent">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      
      <h2 className="text-3xl font-bold text-white text-center mb-8">Quiz Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            icon: "🎯",
            title: "About This Quiz",
            description: `This daily ${formattedCategory.toLowerCase()} quiz contains questions that refresh every 24 hours. New challenges await you each day at midnight in your local timezone (${userTimezone}).`
          },
          {
            icon: "⚡",
            title: "How to Play",
            description: "Read each question carefully and select the answer you believe is correct. You'll receive immediate feedback after each question and can track your progress throughout the quiz."
          },
          {
            icon: "🏆",
            title: "Scoring System",
            description: `Each correct answer earns you points. ${hasBonusQuestion ? 'Complete all questions correctly to unlock a bonus round for extra points! ' : ''}There's no penalty for wrong answers, so feel free to make educated guesses!`
          },
          {
            icon: "📚",
            title: "Learning Objectives",
            description: `This daily quiz helps you expand your knowledge of ${formattedCategory.toLowerCase()} with fresh content every day. Perfect for daily practice, studying, or just learning something new!`
          },
          {
            icon: "🔄",
            title: "Content Freshness",
            description: `Last updated: ${new Date(lastUpdated).toLocaleString()}. New questions are generated daily at midnight ${userTimezone}. Our content is regularly reviewed and updated for accuracy.`
          },
          {
            icon: "⏰",
            title: "Daily Challenge",
            description: "Come back every day for new questions! Your progress resets daily, giving you a fresh challenge and opportunity to improve your knowledge and scores."
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

      {/* Additional FAQ items in a more compact format */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <h4 className="font-semibold text-white mb-2">Are these quizzes completely free?</h4>
          <p className="text-gray-300 text-sm">Yes! All our daily trivia quizzes are 100% free to play with no registration required.</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <h4 className="font-semibold text-white mb-2">How often are new quizzes available?</h4>
          <p className="text-gray-300 text-sm">New {formattedCategory.toLowerCase()} quizzes are generated every day at midnight in your local timezone ({userTimezone}).</p>
        </div>
        {hasBonusQuestion && (
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h4 className="font-semibold text-white mb-2">What is the bonus question?</h4>
            <p className="text-gray-300 text-sm">Answer all regular questions correctly to unlock a special bonus question worth extra points!</p>
          </div>
        )}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <h4 className="font-semibold text-white mb-2">Can I retake the quiz?</h4>
          <p className="text-gray-300 text-sm">You can retake today's quiz as many times as you want, but your best score will be recorded for the daily leaderboard.</p>
        </div>
      </div>
    </div>
  );
}