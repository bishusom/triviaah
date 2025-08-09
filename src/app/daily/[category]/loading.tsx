export default function DailyQuizLoading() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="animate-pulse space-y-8">
        <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}