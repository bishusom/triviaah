// src/app/trivias/[category]/loading.tsx
export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Header Skeleton */}
        <div className="text-center mb-12">
          <div className="flex flex-col items-center gap-6 mb-8">
            {/* Icon Skeleton */}
            <div className="w-24 h-24 bg-gray-700 rounded-3xl animate-pulse" />
            
            {/* Title Skeleton */}
            <div className="space-y-4">
              <div className="h-12 bg-gray-700 rounded-2xl w-64 mx-auto animate-pulse" />
              <div className="h-6 bg-gray-700 rounded-xl w-48 mx-auto animate-pulse" />
              <div className="h-4 bg-gray-700 rounded-lg w-80 mx-auto animate-pulse" />
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700 animate-pulse">
                <div className="w-8 h-8 bg-gray-700 rounded-lg mx-auto mb-2" />
                <div className="h-6 bg-gray-700 rounded-lg w-12 mx-auto mb-1" />
                <div className="h-4 bg-gray-700 rounded w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Play Button Skeleton */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gray-700 text-transparent font-bold py-4 px-12 rounded-2xl text-lg animate-pulse">
            Loading Quiz...
          </div>
          <div className="h-4 bg-gray-700 rounded w-48 mx-auto mt-3 animate-pulse" />
        </div>

        {/* Subcategories Grid Skeleton */}
        <div className="mb-16">
          <div className="h-8 bg-gray-700 rounded-xl w-64 mx-auto mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-6 bg-gray-700 rounded-lg w-3/4" />
                    <div className="h-4 bg-gray-700 rounded w-1/2" />
                  </div>
                  <div className="w-10 h-10 bg-gray-700 rounded-full" />
                </div>
                <div className="h-1 bg-gray-700 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Learning Objectives Skeleton */}
        <div className="mb-16">
          <div className="h-8 bg-gray-700 rounded-xl w-64 mx-auto mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 animate-pulse">
                <div className="w-16 h-16 bg-gray-700 rounded-2xl mx-auto mb-4" />
                <div className="h-6 bg-gray-700 rounded-lg w-32 mx-auto mb-3" />
                <div className="h-4 bg-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section Skeleton */}
        <div className="mb-16">
          <div className="h-8 bg-gray-700 rounded-xl w-64 mx-auto mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 animate-pulse">
                <div className="h-6 bg-gray-700 rounded-lg w-full mb-3" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-700 rounded w-5/6" />
                  <div className="h-4 bg-gray-700 rounded w-4/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}