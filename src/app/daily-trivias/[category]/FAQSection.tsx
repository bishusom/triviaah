// src/app/daily-trivias/[category]/FAQSection.tsx
//
// ✅ FIX: FAQ structured data text now matches visible text exactly.
//    Google cross-references JSON-LD FAQPage schema against the rendered HTML.
//    The original had questions in the schema that weren't in the visible grid
//    (and vice versa), and the wording differed between the two. Mismatches
//    disqualify pages from FAQ rich results in Google Search.
//
// ✅ FIX: Removed the duplicate compact FAQ grid at the bottom.
//    The same questions appeared twice — once in the card grid, once in a
//    smaller grid below. Duplicate visible content is a minor quality signal
//    issue and creates confusion about which version the schema maps to.
//
// ✅ FIX: The JSON-LD schema is now static (no userTimezone interpolation).
//    The original embedded `userTimezone` in schema text, but userTimezone comes
//    from the client (WithTimezone reads Intl.DateTimeFormat). During SSR,
//    the server renders with its own timezone — so the schema Google sees says
//    e.g. "UTC" while the hydrated page might say "Asia/Kolkata". Removing the
//    timezone string from structured data avoids this mismatch entirely.
//    Timezone info still appears in the visible TimezoneInfo component.

export function FAQSection({
  formattedCategory,
  hasBonusQuestion,
  lastUpdated,
}: {
  formattedCategory: string;
  hasBonusQuestion: boolean;
  userTimezone: string;  // kept in props signature for compatibility, not used in schema
  lastUpdated: string;
}) {
  // ✅ Schema text = visible text below, verbatim.
  // Matching ensures Google can grant FAQ rich result eligibility.
  const faqItems = [
    {
      icon: '🔄',
      title: 'How often are new questions available?',
      answer: `New ${formattedCategory.toLowerCase()} trivia questions are available every day. The quiz refreshes at midnight — come back daily for a fresh challenge.`,
    },
    {
      icon: '💰',
      title: `Is the ${formattedCategory} daily quiz free?`,
      answer: `Yes. The ${formattedCategory.toLowerCase()} daily trivia quiz is completely free to play — no registration, no subscription, no hidden fees.`,
    },
    {
      icon: '❓',
      title: 'How many questions are in the daily quiz?',
      answer: `The daily ${formattedCategory.toLowerCase()} quiz contains multiple-choice questions, each with a countdown timer. Scores are tracked on the daily leaderboard.`,
    },
    {
      icon: '🔁',
      title: 'Can I retake the quiz?',
      answer: "Yes — you can retake today's quiz as many times as you like. Your best score is recorded for the daily leaderboard.",
    },
    {
      icon: '🎯',
      title: 'About This Quiz',
      answer: `This daily ${formattedCategory.toLowerCase()} quiz refreshes every 24 hours with fresh questions. Last updated: ${new Date(lastUpdated).toLocaleDateString('en-US', { timeZone: 'UTC' })}.`,
    },
    {
      icon: '⚡',
      title: 'How to Play',
      answer: "Select the answer you believe is correct before the timer runs out. You get instant feedback after each question and can track your progress throughout.",
    },
    {
      icon: '🏆',
      title: 'Scoring System',
      answer: `Each correct answer earns you points.${hasBonusQuestion ? ' Complete all questions correctly to unlock a bonus round for extra points!' : ''} No penalty for wrong answers.`,
    },
    {
      icon: '📚',
      title: 'Learning Objectives',
      answer: `This daily quiz helps you expand your ${formattedCategory.toLowerCase()} knowledge with fresh content every day. Perfect for daily practice or just learning something new.`,
    },
  ];

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.slice(0, 4).map(item => ({
      '@type': 'Question',
      name: item.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="mt-12 bg-transparent">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <h2 className="text-3xl font-bold text-white text-center mb-8">Quiz Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">{item.icon}</span>
              </div>
              <h3 className="font-semibold text-lg text-white">{item.title}</h3>
            </div>
            <p className="text-gray-300">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
