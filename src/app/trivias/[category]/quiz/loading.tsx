// src/app/trivias/[category]/quiz/loading.tsx
export default function QuizLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Quiz Header Skeleton */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-4 mb-6">
            {/* Quiz Icon Skeleton */}
            <div className="w-20 h-20 bg-gray-700 rounded-2xl animate-pulse" />
            
            {/* Quiz Title Skeleton */}
            <div className="space-y-3">
              <div className="h-10 bg-gray-700 rounded-xl w-64 mx-auto animate-pulse" />
              <div className="h-6 bg-gray-700 rounded-lg w-48 mx-auto animate-pulse" />
            </div>
          </div>

          {/* Quiz Stats Skeleton */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700 animate-pulse">
                <div className="w-8 h-8 bg-gray-700 rounded-lg mx-auto mb-2" />
                <div className="h-6 bg-gray-700 rounded-lg w-12 mx-auto mb-1" />
                <div className="h-4 bg-gray-700 rounded w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Game Skeleton */}
        <div className="mb-8">
          {/* Question Progress */}
          <div className="flex justify-between items-center mb-6">
            <div className="h-4 bg-gray-700 rounded w-24 animate-pulse" />
            <div className="h-4 bg-gray-700 rounded w-16 animate-pulse" />
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-700 rounded-full mb-8 animate-pulse">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: '30%' }}
            />
          </div>

          {/* Question Card Skeleton */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl mb-6 animate-pulse">
            {/* Question Text */}
            <div className="space-y-3 mb-8">
              <div className="h-6 bg-gray-700 rounded-lg w-3/4 mx-auto" />
              <div className="h-4 bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-700 rounded w-5/6 mx-auto" />
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-700 rounded-xl p-4 border border-gray-600 animate-pulse">
                  <div className="h-5 bg-gray-600 rounded w-full" />
                </div>
              ))}
            </div>

            {/* Timer Skeleton */}
            <div className="flex justify-center mt-8">
              <div className="h-12 w-12 bg-gray-700 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Navigation Buttons Skeleton */}
          <div className="flex justify-between">
            <div className="h-12 bg-gray-700 rounded-xl w-32 animate-pulse" />
            <div className="h-12 bg-gray-700 rounded-xl w-32 animate-pulse" />
          </div>
        </div>

        {/* FAQ Section Skeleton */}
        <div className="mt-12">
          <div className="h-8 bg-gray-700 rounded-xl w-64 mx-auto mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 animate-pulse">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-gray-700 rounded-xl" />
                  <div className="h-6 bg-gray-700 rounded-lg w-32" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-700 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}