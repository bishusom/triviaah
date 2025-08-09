// app/components/GameHeader.tsx
interface GameHeaderProps {
  score: number;
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
}

export default function GameHeader({
  score,
  currentQuestion,
  totalQuestions,
  timeRemaining
}: GameHeaderProps) {
  const formattedTime = new Date(timeRemaining * 1000)
    .toISOString()
    .substring(14, 19);

  return (
    <header className="bg-white/90 backdrop-blur-sm p-4 shadow-sm mb-6 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto grid grid-cols-3 items-center">
        <div className="text-sm font-medium text-gray-600">
          Question {currentQuestion} of {totalQuestions}
        </div>
        
        <div className="flex justify-center">
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
            ⏱️ {formattedTime}
          </div>
        </div>
        
        <div className="font-bold text-gray-800 text-right">
          Score: {score}
        </div>
      </div>
    </header>
  );
}