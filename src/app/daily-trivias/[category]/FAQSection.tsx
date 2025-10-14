// app/daily-trivias/[category]/FAQSection.tsx
export function FAQSection({ 
  formattedCategory, 
  hasBonusQuestion, 
  userTimezone 
}: {
  formattedCategory: string;
  hasBonusQuestion: boolean;
  userTimezone: string;
}) {
  return (
    <div className="mt-12 bg-gray-50 p-6 rounded-lg">
      <details className="group">
        <summary className="flex justify-between items-center cursor-pointer list-none">
          <h2 className="text-xl font-bold">Quiz Information</h2>
          <span className="text-gray-500 group-open:rotate-180 transition-transform">
            ▼
          </span>
        </summary>
        <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
          <div>
            <h3 className="font-semibold">Timezone Information</h3>
            <p className="text-gray-600 text-sm">
              Quizzes update at midnight in your local timezone ({userTimezone}).
              Detected via your IP address.
            </p>
          </div>
          <div itemScope itemType="https://schema.org/Question">
            <h3 className="font-semibold" itemProp="name">How often are new quizzes available?</h3>
            <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
              New {formattedCategory.toLowerCase()} quizzes are generated every day at midnight in your local timezone.
            </p>
          </div>
          <div itemScope itemType="https://schema.org/Question">
            <h3 className="font-semibold" itemProp="name">Are these quizzes completely free?</h3>
            <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
              Yes! All our daily trivia quizzes are 100% free to play with no registration required.
            </p>
          </div>
          {hasBonusQuestion && (
            <div itemScope itemType="https://schema.org/Question">
              <h3 className="font-semibold" itemProp="name">What is the bonus question?</h3>
              <p className="text-gray-600" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                Answer all regular questions correctly to unlock a special bonus question worth extra points!
              </p>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}